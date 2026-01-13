import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { campaignFields, campaignOperations } from './CampaignDescription';
import { createGoogleAdsClient, createCustomer, getCampaigns, getCampaignById } from './GoogleAdsHelpers';

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
				],
				default: 'campaign',
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
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'campaign') {
					const managerCustomerId = this.getNodeParameter('managerCustomerId', i) as string;
					const clientCustomerId = this.getNodeParameter('clientCustomerId', i) as string;

					// Extract refresh token from credentials
					// n8n OAuth2 credentials store the token data in oauthTokenData
					const refreshToken = (credentials.oauthTokenData as { refresh_token?: string })?.refresh_token as string;

					if (!refreshToken) {
						throw new Error('No refresh token found in credentials. Please re-authenticate with Google Ads.');
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
