# DevFlow Platform - Quick Reference

## 🚀 What We Built

A powerful cross-API SDK that enables seamless workflows between Gmail and Notion with a fluent, chainable API.

## 📁 Project Structure

```
AIBoomi/
├── apps/
│   └── platform/                    # Main Next.js application
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/
│       │   │   │   ├── oauth/       # OAuth flows (Gmail, Notion)
│       │   │   │   └── sdk/         # SDK API routes
│       │   │   ├── dashboard/       # Main dashboard
│       │   │   └── test-workflow/   # Workflow testing page
│       │   └── lib/                 # Utilities (prisma, tokenManager)
│       └── prisma/                  # Database schema
└── packages/
    └── sdk/                         # Cross-API SDK package
        ├── src/
        │   ├── gmail/              # Gmail integration
        │   ├── notion/             # Notion integration
        │   └── types/              # TypeScript interfaces
        └── DOCUMENTATION.md        # Comprehensive docs
```

## 🔧 Key Components

### 1. SDK Package (`@techno-king/sdk`)
- **Fluent API**: Chainable methods for workflow building
- **Type Safety**: Full TypeScript support
- **Cross-Service**: Seamless Gmail ↔ Notion integration

### 2. Platform API Routes
- **OAuth Handling**: Gmail and Notion authentication
- **Token Management**: Automatic refresh and storage
- **Service Integration**: External API calls with proper auth

### 3. Database Schema
- **Users**: User management with Clerk integration
- **Integrations**: OAuth tokens and service connections

## 🎯 Core Workflow Example

```typescript
// Monitor Gmail → Transform → Create Notion Pages
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(async (emails) => {
    return emails.map(email => ({
      title: `Support: ${email.subject}`,
      content: `From: ${email.from}\n\n${email.body}`,
      databaseId: "support_tickets"
    }));
  })
  .then(async (pageData) => {
    return devflow.notion.createPage(pageData).execute();
  })
  .execute();
```

## 🔗 API Endpoints

### OAuth Flows
- `GET /api/oauth/gmail/start` - Start Gmail OAuth
- `GET /api/oauth/gmail/callback` - Gmail OAuth callback
- `GET /api/oauth/notion/start` - Start Notion OAuth
- `GET /api/oauth/notion/callback` - Notion OAuth callback

### SDK Routes
- `POST /api/sdk/gmail/monitor` - Monitor Gmail emails
- `POST /api/sdk/gmail/send` - Send Gmail emails
- `POST /api/sdk/notion/page` - Create Notion pages

### Testing
- `POST /api/test-workflow` - Execute complete workflow
- `GET /test-workflow` - Workflow testing interface

## 🛠️ Development Commands

```bash
# Build SDK
cd packages/sdk
npm run build

# Publish SDK
npm publish

# Update SDK in platform
cd apps/platform
pnpm update @techno-king/sdk

# Run platform
npm run dev
```

## 🔑 Environment Variables

```bash
# Platform
PLATFORM_ORIGIN=http://localhost:3000
DEVFLOW_BASE_URL=http://localhost:3000

# Gmail OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/gmail/callback

# Notion OAuth
NOTION_CLIENT_ID=your_client_id
NOTION_CLIENT_SECRET=your_client_secret
NOTION_DATABASE_ID=your_database_id
```

## 🧪 Testing

1. **Connect Services**: Use dashboard to connect Gmail and Notion
2. **Test Workflow**: Visit `/test-workflow` to test the complete flow
3. **Monitor Logs**: Check terminal for detailed execution logs

## 📊 Recent Test Results

From the terminal logs, we can see the workflow successfully:
- ✅ Found 5 emails from `from:support@npmjs.com`
- ✅ Created 5 Notion pages in database `25f3f2eb4b908071907fe4aab90ded63`
- ✅ Total execution time: ~38 seconds
- ✅ All API calls completed successfully

## 🎉 Success Metrics

- **SDK Published**: `@techno-king/sdk@1.0.2`
- **Cross-API Integration**: Gmail ↔ Notion working
- **Fluent API**: Chainable workflow building
- **Type Safety**: Full TypeScript support
- **Documentation**: Comprehensive docs created
- **Testing Interface**: Interactive workflow testing

## 🔮 Next Steps

1. **Add More Services**: Slack, Discord, GitHub, etc.
2. **Real-time Monitoring**: WebSocket-based email monitoring
3. **Scheduled Workflows**: Cron-based automation
4. **Conditional Logic**: If-then-else workflow branching
5. **Analytics Dashboard**: Workflow execution metrics

---

*This quick reference covers the current state of the DevFlow platform. For detailed documentation, see `packages/sdk/DOCUMENTATION.md`.*
