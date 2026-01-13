import {
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { campaignFields, campaignOperations } from './CampaignDescription';
import { createGoogleAdsClient, createCustomer, getCampaigns, getCampaignById, executeCustomQuery } from './GoogleAdsHelpers';

export class GoogleAds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Ads',
		name: 'googleAds',
		icon: 'file:googleAds.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use the Google Ads API',
		defaults: {
			name: 'Google Ads',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'googleAdsOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Custom Query',
						value: 'customQuery',
					},
				],
				default: 'campaign',
			},
			//-------------------------------
			// Custom Query Fields
			//-------------------------------
			{
				displayName: 'Manager Customer ID',
				name: 'managerCustomerId',
				type: 'string',
				required: true,
				placeholder: '9998887777',
				displayOptions: {
					show: {
						resource: ['customQuery'],
					},
				},
				default: '',
			},
			{
				displayName: 'Client Customer ID',
				name: 'clientCustomerId',
				type: 'string',
				required: true,
				placeholder: '6665554444',
				displayOptions: {
					show: {
						resource: ['customQuery'],
					},
				},
				default: '',
			},
			{
				displayName: 'GAQL Query',
				name: 'gaqlQuery',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['customQuery'],
					},
				},
				default: 'SELECT campaign.id, campaign.name FROM campaign LIMIT 10',
				description: 'Google Ads Query Language (GAQL) query. See <a href="https://developers.google.com/google-ads/api/docs/query/overview">GAQL documentation</a> for syntax.',
			},
			//-------------------------------
			// Campaign Operations
			//-------------------------------
			...campaignOperations,
			{
				displayName:
					'Divide field names expressed with <i>micros</i> by 1,000,000 to get the actual value',
				name: 'campaigsNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
			},
			...campaignFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('googleAdsOAuth2Api');

		// Create Google Ads API client
		const client = createGoogleAdsClient(credentials);

		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'campaign') {
					const operation = this.getNodeParameter('operation', i) as string;
					const managerCustomerId = this.getNodeParameter('managerCustomerId', i) as string;
					const clientCustomerId = this.getNodeParameter('clientCustomerId', i) as string;

					// Extract refresh token from credentials
					// n8n OAuth2 credentials store the token data in oauthTokenData
					const refreshToken = (credentials.oauthTokenData as { refresh_token?: string })?.refresh_token as string;

					if (!refreshToken) {
						throw new NodeOperationError(
							this.getNode(),
							'No refresh token found in credentials. Please re-authenticate with Google Ads.',
						);
					}

					// Create customer instance
					const customer = createCustomer(client, clientCustomerId, managerCustomerId, refreshToken);

					if (operation === 'getAll') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as {
							dateRange?: string;
							campaignStatus?: string;
						};

						const campaigns = await getCampaigns(customer, {
							dateRange: additionalOptions.dateRange,
							campaignStatus: additionalOptions.campaignStatus,
						});

						for (const campaign of campaigns) {
							returnData.push({ json: campaign });
						}
					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;

						const campaigns = await getCampaignById(customer, campaignId);

						for (const campaign of campaigns) {
							returnData.push({ json: campaign });
						}
					}
				} else if (resource === 'customQuery') {
					const managerCustomerId = this.getNodeParameter('managerCustomerId', i) as string;
					const clientCustomerId = this.getNodeParameter('clientCustomerId', i) as string;
					const gaqlQuery = this.getNodeParameter('gaqlQuery', i) as string;

					// Extract refresh token from credentials
					const refreshToken = (credentials.oauthTokenData as { refresh_token?: string })?.refresh_token as string;

					if (!refreshToken) {
						throw new NodeOperationError(
							this.getNode(),
							'No refresh token found in credentials. Please re-authenticate with Google Ads.',
						);
					}

					// Create customer instance
					const customer = createCustomer(client, clientCustomerId, managerCustomerId, refreshToken);

					const results = await executeCustomQuery(customer, gaqlQuery);

					for (const result of results) {
						returnData.push({ json: result });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
