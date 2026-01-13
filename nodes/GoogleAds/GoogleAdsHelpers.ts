import { GoogleAdsApi, type Customer } from 'google-ads-api';
import type { ICredentialDataDecryptedObject, IDataObject } from 'n8n-workflow';

/**
 * Creates a GoogleAdsApi client from n8n credentials
 */
export function createGoogleAdsClient(credentials: ICredentialDataDecryptedObject): GoogleAdsApi {
    return new GoogleAdsApi({
        client_id: credentials.clientId as string,
        client_secret: credentials.clientSecret as string,
        developer_token: credentials.developerToken as string,
    });
}

/**
 * Creates a Customer instance for making API calls
 */
export function createCustomer(
    client: GoogleAdsApi,
    customerId: string,
    loginCustomerId: string,
    refreshToken: string,
): Customer {
    return client.Customer({
        customer_id: customerId.replace(/-/g, ''),
        login_customer_id: loginCustomerId.replace(/-/g, ''),
        refresh_token: refreshToken,
    });
}

/**
 * Retrieves campaigns with metrics for a customer
 */
export async function getCampaigns(
    customer: Customer,
    options: { dateRange?: string; campaignStatus?: string },
): Promise<IDataObject[]> {
    let query = `
		SELECT
			campaign.id,
			campaign.name,
			campaign_budget.amount_micros,
			campaign_budget.period,
			campaign.status,
			campaign.optimization_score,
			campaign.advertising_channel_type,
			campaign.advertising_channel_sub_type,
			metrics.impressions,
			metrics.interactions,
			metrics.interaction_rate,
			metrics.average_cost,
			metrics.cost_micros,
			metrics.conversions,
			metrics.cost_per_conversion,
			metrics.conversions_from_interactions_rate,
			metrics.video_views,
			metrics.average_cpm,
			metrics.ctr
		FROM campaign
		WHERE campaign.id > 0
	`;

    // Add date range filter if not "all time"
    if (options.dateRange && !['allTime', undefined, ''].includes(options.dateRange)) {
        query += ` AND segments.date DURING ${options.dateRange}`;
    }

    // Add campaign status filter if not "all"
    if (options.campaignStatus && !['all', undefined, ''].includes(options.campaignStatus)) {
        query += ` AND campaign.status = '${options.campaignStatus}'`;
    }

    const results = await customer.query(query);

    return results.map((row) => ({
        ...(row.campaign as IDataObject),
        ...(row.metrics as IDataObject),
        ...(row.campaign_budget as IDataObject),
    } as IDataObject));
}

/**
 * Retrieves a single campaign by ID
 */
export async function getCampaignById(
    customer: Customer,
    campaignId: string,
): Promise<IDataObject[]> {
    const query = `
		SELECT
			campaign.id,
			campaign.name,
			campaign_budget.amount_micros,
			campaign_budget.period,
			campaign.status,
			campaign.optimization_score,
			campaign.advertising_channel_type,
			campaign.advertising_channel_sub_type,
			metrics.impressions,
			metrics.interactions,
			metrics.interaction_rate,
			metrics.average_cost,
			metrics.cost_micros,
			metrics.conversions,
			metrics.cost_per_conversion,
			metrics.conversions_from_interactions_rate,
			metrics.video_views,
			metrics.average_cpm,
			metrics.ctr
		FROM campaign
		WHERE campaign.id = ${campaignId.replace(/-/g, '')}
	`;

    const results = await customer.query(query);

    return results.map((row) => ({
        ...(row.campaign as IDataObject),
        ...(row.metrics as IDataObject),
        ...(row.campaign_budget as IDataObject),
    } as IDataObject));
}
