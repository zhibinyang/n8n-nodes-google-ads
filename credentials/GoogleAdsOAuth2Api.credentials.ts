import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

const scopes = ['https://www.googleapis.com/auth/adwords'];

export class GoogleAdsOAuth2Api implements ICredentialType {
    name = 'googleAdsOAuth2Api';

    displayName = 'Google Ads OAuth2 API';

    documentationUrl = 'https://developers.google.com/google-ads/api/docs/oauth/overview';

    icon: Icon = 'file:googleAds.svg';

    extends = ['oAuth2Api'];

    properties: INodeProperties[] = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'hidden',
            default: 'authorizationCode',
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: 'https://accounts.google.com/o/oauth2/v2/auth',
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: 'https://oauth2.googleapis.com/token',
        },
        {
            displayName: 'Auth URI Query Parameters',
            name: 'authQueryParameters',
            type: 'hidden',
            default: 'access_type=offline&prompt=consent',
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'body',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
        {
            displayName: 'Developer Token',
            name: 'developerToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your Google Ads API developer token',
        },
    ];
}
