# n8n-nodes-google-ads

This is an n8n community node for **Google Ads** integration using the [@opteo/google-ads-api](https://github.com/Opteo/google-ads-api) SDK.

> ⚠️ **Important**: This node uses external npm dependencies and is **NOT compatible with n8n Cloud**. It can only be used with **self-hosted n8n** instances.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

This node is designed for **self-hosted n8n only**.

### Using npm link (Development)

```bash
cd /path/to/n8n-nodes-google-ads
npm install
npm run build
npm link

# In your n8n installation directory
npm link @zhibinyang/n8n-nodes-google-ads
```

### Manual Installation

1. Copy the built `dist` folder to your n8n custom nodes directory
2. Restart n8n

## Operations

### Campaign

| Operation | Description |
|-----------|-------------|
| **Get Many** | Retrieve multiple campaigns with metrics |
| **Get** | Retrieve a specific campaign by ID |

**Returned Fields:**
- Campaign: id, name, status, optimization_score, advertising_channel_type, advertising_channel_sub_type
- Budget: amount_micros, period
- Metrics: impressions, interactions, interaction_rate, average_cost, cost_micros, conversions, cost_per_conversion, conversions_from_interactions_rate, video_views, average_cpm, ctr

## Credentials

You need to set up **Google Ads OAuth2 API** credentials:

### Prerequisites

1. A Google Cloud Project with Google Ads API enabled
2. OAuth 2.0 Client ID (Web application type)
3. A Google Ads Developer Token

### Setup Steps

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Get a Developer Token from your [Google Ads Manager Account](https://ads.google.com/aw/apicenter)
3. In n8n, create a new "Google Ads OAuth2 API" credential
4. Enter your Client ID, Client Secret, and Developer Token
5. Complete the OAuth flow to authorize access

## Compatibility

- **n8n**: Self-hosted only (not compatible with n8n Cloud)
- **Google Ads API**: v21 (via google-ads-api SDK v21.0.1)

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [@opteo/google-ads-api SDK](https://github.com/Opteo/google-ads-api)

## License

MIT
