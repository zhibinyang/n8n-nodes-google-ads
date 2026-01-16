# n8n-nodes-google-ads

[English](./README.md) | 简体中文

这是一个使用 [google-ads-api](https://github.com/Opteo/google-ads-api) SDK 的 **Google Ads** n8n 社区节点。

[n8n](https://n8n.io/) 是一个[公平代码许可](https://docs.n8n.io/reference/license/)的工作流自动化平台。

> ⚠️ **注意**：此节点由于使用外部 npm 依赖，**不兼容 n8n Cloud**，需要自托管的 n8n 实例。

## ✨ 核心特性

### 自定义 GAQL 查询

**这是相对于官方 n8n Google Ads 节点的主要优势！** 本包支持 **自定义 GAQL（Google Ads 查询语言）查询**，让您可以：

- 🔍 **查询任何 Google Ads 资源** - 广告系列、广告组、关键词、广告等
- 📊 **选择特定指标** - 精确定制您需要的字段和指标
- 🎯 **应用复杂过滤器** - 使用 GAQL 强大的 WHERE 子句
- 🚀 **高级细分** - 按日期、设备、网络等维度细分数据

**GAQL 查询示例：**
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

这种灵活性使其非常适合高级报告、自定义仪表板以及官方节点无法处理的复杂自动化工作流。

## 📦 安装

### 通过 n8n 社区节点安装（推荐）

**适用于自托管 n8n 实例：**

1. 进入 **设置** → **社区节点**
2. 点击 **安装社区节点**
3. 输入包名：`@zhibinyang/n8n-nodes-google-ads`
4. 点击 **安装**

## 🎯 操作

### 广告系列（Campaign）

| 操作 | 描述 |
|------|------|
| **Get Many** | 获取多个广告系列及其指标 |
| **Get** | 通过 ID 获取特定广告系列 |
| **Custom Query** | 执行自定义 GAQL 查询以实现高级用例 |

**可用字段：**
- **广告系列（Campaign）**：id, name, status, optimization_score, advertising_channel_type, advertising_channel_sub_type
- **预算（Budget）**：amount_micros, period
- **指标（Metrics）**：impressions, interactions, interaction_rate, average_cost, cost_micros, conversions, cost_per_conversion, conversions_from_interactions_rate, video_views, average_cpm, ctr

## 🔑 凭据配置

您需要设置 **Google Ads OAuth2 API** 凭据：

### 前置要求

1. 启用了 Google Ads API 的 Google Cloud 项目
2. OAuth 2.0 客户端 ID（Web 应用程序类型）
3. Google Ads 开发者令牌

### 设置步骤

1. 在 [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 创建 OAuth 凭据
2. 从您的 [Google Ads 管理员账户](https://ads.google.com/aw/apicenter)获取开发者令牌
3. 在 n8n 中创建新的 "Google Ads OAuth2 API" 凭据
4. 输入您的客户端 ID、客户端密钥和开发者令牌
5. 完成 OAuth 流程以授权访问

## 📚 资源

- [n8n 社区节点文档](https://docs.n8n.io/integrations/community-nodes/)
- [Google Ads API 文档](https://developers.google.com/google-ads/api/docs/start)
- [GAQL 参考指南](https://developers.google.com/google-ads/api/docs/query/overview)
- [google-ads-api SDK](https://github.com/Opteo/google-ads-api)

## 🛠️ 开发者指南

### 构建系统

本项目使用 **esbuild** 替代传统的 TypeScript 编译器（tsc），以优化包大小和构建性能，专为 Cloud Run + GCS 部署而设计。

#### 优势

- ✓ **优化的包大小**：所有依赖（包括 `google-ads-api`）打包到单个文件中
- ✓ **更快的构建**：构建在约 2 秒内完成
- ✓ **更少的文件**：最小化文件数量以提升 GCS 挂载性能
- ✓ **自包含**：所有依赖都包含在 bundle 中，运行时不需要外部 node_modules

#### 构建命令

```bash
# 生产构建（默认 - 压缩，无 sourcemap）
npm run build

# 开发构建（带 sourcemap 用于调试）
npm run build:dev

# 监听模式（开发模式）
npm run build:watch
```

**对比**：
- **生产构建**（`npm run build`）：~23MB，已压缩用于部署（默认）
- **开发构建**（`npm run build:dev`）：~86MB，包含 sourcemap 用于调试

**参考**：此构建配置基于 [n8n-nodes-esbuild-starter](https://github.com/zhibinyang/n8n-nodes-esbuild-starter)。

### 发布

```bash
# 清理并构建生产版本
rm -rf dist
npm run build

# 验证没有 sourcemap 文件
ls dist/nodes/GoogleAds/

# 更新版本并发布
npm version patch
npm publish
```

## ⚙️ 兼容性

- **n8n**：仅限自托管（不兼容 n8n Cloud）
- **Google Ads API**：v21（通过 google-ads-api SDK v21.0.1）

## 📄 许可证

MIT
