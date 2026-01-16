# n8n-nodes-google-ads

English | [简体中文](./README_CN.md)

This is an n8n community node for **Google Ads** integration using the [google-ads-api](https://github.com/Opteo/google-ads-api) SDK.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

> ⚠️ **Note**: This node is **NOT compatible with n8n Cloud** due to external npm dependencies. It requires a self-hosted n8n instance.

## ✨ Key Features

### Custom GAQL Queries

**This is the main advantage over the official n8n Google Ads node!** This package supports **custom GAQL (Google Ads Query Language) queries**, allowing you to:

- 🔍 **Query any Google Ads resource** - campaigns, ad groups, keywords, ads, etc.
- 📊 **Select specific metrics** - customize exactly which fields and metrics you need
- 🎯 **Apply complex filters** - use GAQL's powerful WHERE clauses
- 🚀 **Advanced segmentation** - segment data by date, device, network, and more

**Example GAQL Query:**
```sql
SELECT 
  campaign.id, 
  campaign.name, 
  metrics.impressions, 
  metrics.clicks, 
  metrics.cost_micros 
FROM campaign 
WHERE campaign.status = 'ENABLED' 
  AND metrics.impressions > 0 
ORDER BY metrics.impressions DESC
```

This flexibility makes it perfect for advanced reporting, custom dashboards, and complex automation workflows that the official node cannot handle.

## 📦 Installation

### Install via n8n Community Nodes (Recommended)

**For self-hosted n8n instances:**

1. Go to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter the package name: `@zhibinyang/n8n-nodes-google-ads`
4. Click **Install**

## 🎯 Operations

### Campaign

| Operation | Description |
|-----------|-------------|
| **Get Many** | Retrieve multiple campaigns with metrics |
| **Get** | Retrieve a specific campaign by ID |
| **Custom Query** | Execute custom GAQL queries for advanced use cases |

**Available Fields:**
- **Campaign**: id, name, status, optimization_score, advertising_channel_type, advertising_channel_sub_type
- **Budget**: amount_micros, period
- **Metrics**: impressions, interactions, interaction_rate, average_cost, cost_micros, conversions, cost_per_conversion, conversions_from_interactions_rate, video_views, average_cpm, ctr

## 🔑 Credentials

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

## 📚 Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [GAQL Reference Guide](https://developers.google.com/google-ads/api/docs/query/overview)
- [google-ads-api SDK](https://github.com/Opteo/google-ads-api)

## 🛠️ For Developers

### Build System

This project uses **esbuild** instead of the traditional TypeScript compiler (tsc) to optimize bundle size and build performance for Cloud Run + GCS deployment.

#### Benefits

- ✓ **Optimized bundle size**: All dependencies (including `google-ads-api`) are bundled into single files
- ✓ **Faster builds**: Build completes in ~2 seconds
- ✓ **Fewer files**: Minimal file count for better GCS mounting performance
- ✓ **Self-contained**: All dependencies included in the bundle, no external node_modules needed at runtime

#### Build Commands

```bash
# Build for production (default - minified, no sourcemaps)
npm run build

# Build for development (with sourcemaps for debugging)
npm run build:dev

# Build and watch for changes (development mode)
npm run build:watch
```

**Comparison**:
- **Production build** (`npm run build`): ~23MB, minified for deployment (default)
- **Development build** (`npm run build:dev`): ~86MB, includes sourcemaps for debugging

**Reference**: This build configuration is based on [n8n-nodes-esbuild-starter](https://github.com/zhibinyang/n8n-nodes-esbuild-starter).

### Publishing

```bash
# Clean and build for production
rm -rf dist
npm run build

# Verify no sourcemap files exist
ls dist/nodes/GoogleAds/

# Update version and publish
npm version patch
npm publish
```

## ⚙️ Compatibility

- **n8n**: Self-hosted only (not compatible with n8n Cloud)
- **Google Ads API**: v21 (via google-ads-api SDK v21.0.1)

## 📄 License

MIT
