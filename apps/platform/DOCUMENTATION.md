# DevFlow SDK Documentation

## Overview

The DevFlow SDK is a powerful cross-API integration toolkit that enables seamless workflows between different services like Gmail and Notion. It provides a fluent, chainable API for building complex automation workflows with minimal code.

## 🏗️ Architecture

### Core Components

```
packages/sdk/
├── src/
│   ├── core/
│   │   └── devflow.ts          # Main DevFlow class
│   ├── gmail/
│   │   ├── client.ts           # Gmail API client
│   │   └── gmail-builder.ts    # Gmail workflow builder
│   ├── notion/
│   │   ├── client.ts           # Notion API client
│   │   └── notion-builder.ts   # Notion workflow builder
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── index.ts                # Main exports
```

### Design Principles

1. **Fluent API**: Chainable methods for intuitive workflow building
2. **Type Safety**: Full TypeScript support with comprehensive type definitions
3. **Cross-Service Integration**: Seamless data flow between different APIs
4. **Error Handling**: Robust error handling and recovery
5. **Extensible**: Easy to add new services and workflows

## 🚀 Quick Start

### Installation

```bash
npm install @techno-king/sdk
```

### Basic Usage

```typescript
import { devflow } from '@techno-king/sdk';

// Monitor Gmail and create Notion pages
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(async (emails) => {
    return emails.map(email => ({
      title: `Support Email: ${email.subject}`,
      content: `From: ${email.from}\nReceived: ${email.date}\n\n${email.body}`,
      databaseId: "support_tickets"
    }));
  })
  .then(async (pageDataArray) => {
    return Promise.all(pageDataArray.map(pageData => 
      devflow.notion.createPage(pageData).execute()
    ));
  })
  .execute();
```

## 📧 Gmail Integration

### Available Methods

#### `onNewEmail(config)`
Monitors Gmail for new emails matching specified criteria.

```typescript
// Monitor unread emails from specific sender
const emails = await devflow.gmail
  .onNewEmail({ 
    query: "from:support@company.com",
    maxResults: 10 
  })
  .execute();
```

**Parameters:**
- `query` (string): Gmail search query (e.g., "from:support@company.com", "is:unread")
- `maxResults` (number): Maximum number of emails to retrieve (default: 10)

**Returns:** Array of `EmailMessage` objects

#### `sendEmail(data)`
Sends an email via Gmail.

```typescript
await devflow.gmail
  .sendEmail({
    to: "recipient@example.com",
    subject: "Test Email",
    body: "This is a test email"
  })
  .execute();
```

### EmailMessage Interface

```typescript
interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  snippet: string;
}
```

## 📝 Notion Integration

### Available Methods

#### `createPage(data)`
Creates a new page in Notion.

```typescript
await devflow.notion
  .createPage({
    title: "New Page",
    content: "Page content here",
    databaseId: "your-database-id"
  })
  .execute();
```

#### `db(databaseId)`
Returns a database-specific builder for creating pages in a specific database.

```typescript
await devflow.notion
  .db("support_tickets")
  .create({
    title: "Support Ticket",
    content: "Ticket details"
  })
  .execute();
```

### NotionPageData Interface

```typescript
interface NotionPageData {
  title: string;
  content?: string;
  parentPageId?: string;
  databaseId?: string;
}
```

## 🔗 Workflow Chaining

The SDK supports powerful workflow chaining for complex automation scenarios.

### Basic Chaining

```typescript
await devflow.gmail
  .onNewEmail({ query: "is:unread" })
  .then(async (emails) => {
    // Transform emails
    return emails.map(email => ({
      title: email.subject,
      content: email.body
    }));
  })
  .then(async (pageData) => {
    // Create Notion pages
    return devflow.notion.createPage(pageData).execute();
  })
  .execute();
```

### Advanced Workflow Example

```typescript
await devflow.gmail
  .onNewEmail({ 
    query: "from:support@company.com is:unread",
    maxResults: 5 
  })
  .then(async (emails) => {
    console.log(`Found ${emails.length} support emails`);
    
    // Filter and transform emails
    return emails
      .filter(email => email.subject.toLowerCase().includes('urgent'))
      .map(email => ({
        title: `URGENT: ${email.subject}`,
        content: `
From: ${email.from}
Date: ${email.date}
Priority: URGENT

${email.body}
        `,
        databaseId: "urgent_tickets"
      }));
  })
  .then(async (urgentTickets) => {
    console.log(`Creating ${urgentTickets.length} urgent tickets`);
    
    // Create pages in parallel
    const pagePromises = urgentTickets.map(ticket => 
      devflow.notion.createPage(ticket).execute()
    );
    
    return Promise.all(pagePromises);
  })
  .then(async (createdPages) => {
    console.log(`Successfully created ${createdPages.length} pages`);
    
    // Send confirmation email
    return devflow.gmail
      .sendEmail({
        to: "admin@company.com",
        subject: "Urgent Tickets Created",
        body: `${createdPages.length} urgent tickets have been created in Notion.`
      })
      .execute();
  })
  .execute();
```

## 🏛️ API Architecture

### Client-Server Pattern

The SDK follows a client-server pattern where:

1. **SDK Client**: Makes HTTP requests to platform API routes
2. **Platform API Routes**: Handle authentication and service-specific logic
3. **External APIs**: Gmail and Notion APIs are called from the platform

```
SDK Client → Platform API Routes → External APIs (Gmail/Notion)
```

### API Routes Structure

```
apps/platform/src/app/api/sdk/
├── gmail/
│   ├── monitor/route.ts    # Email monitoring
│   ├── send/route.ts       # Email sending
│   └── list/route.ts       # Email listing
└── notion/
    └── page/route.ts       # Page creation
```

### Authentication Flow

1. **OAuth Tokens**: Stored in database after OAuth flow
2. **Token Refresh**: Automatic token refresh via `tokenManager`
3. **API Calls**: Platform routes use fresh tokens for external API calls

## 🔧 Configuration

### Environment Variables

```bash
# Platform Configuration
PLATFORM_ORIGIN=http://localhost:3000
DEVFLOW_BASE_URL=http://localhost:3000

# Gmail OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/gmail/callback

# Notion OAuth
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_DATABASE_ID=your_default_database_id
```

### Database Schema

```sql
-- Users table
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  clerkId TEXT UNIQUE,
  name TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Integrations table
CREATE TABLE "Integration" (
  id TEXT PRIMARY KEY,
  provider TEXT, -- 'GMAIL' or 'NOTION'
  accessToken TEXT,
  refreshToken TEXT,
  expiresAt TIMESTAMP,
  scope TEXT,
  userId TEXT REFERENCES "User"(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  UNIQUE(userId, provider)
);
```

## 🧪 Testing

### Test Workflow Page

Visit `/test-workflow` to test the complete Gmail → Notion workflow:

1. **Configure Query**: Set Gmail search criteria
2. **Set Database ID**: Specify Notion database for page creation
3. **Run Workflow**: Execute the complete automation
4. **View Results**: See emails found and pages created

### Example Test Configuration

```typescript
// Test with npm support emails
{
  query: "from:support@npmjs.com",
  databaseId: "25f3f2eb4b908071907fe4aab90ded63"
}
```

## 🚀 Advanced Usage

### Custom Workflow Functions

```typescript
// Custom email processing function
const processSupportEmails = async (emails: EmailMessage[]) => {
  return emails.map(email => ({
    title: `Support: ${email.subject}`,
    content: `
**From:** ${email.from}
**Date:** ${email.date}
**Priority:** ${email.subject.toLowerCase().includes('urgent') ? 'HIGH' : 'NORMAL'}

${email.body}
    `,
    databaseId: "support_database"
  }));
};

// Use in workflow
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(processSupportEmails)
  .then(async (pageData) => {
    return devflow.notion.createPage(pageData).execute();
  })
  .execute();
```

### Error Handling

```typescript
try {
  await devflow.gmail
    .onNewEmail({ query: "from:support@company.com" })
    .then(async (emails) => {
      if (emails.length === 0) {
        throw new Error("No emails found");
      }
      return emails;
    })
    .then(async (emails) => {
      // Process emails
      return emails.map(email => ({
        title: email.subject,
        content: email.body,
        databaseId: "support_tickets"
      }));
    })
    .then(async (pageData) => {
      return devflow.notion.createPage(pageData).execute();
    })
    .execute();
} catch (error) {
  console.error("Workflow failed:", error);
  // Handle error appropriately
}
```

## 🔄 Workflow Patterns

### 1. Email Monitoring → Notion Documentation

```typescript
// Monitor support emails and create documentation
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(async (emails) => {
    return emails.map(email => ({
      title: `Support Case: ${email.subject}`,
      content: `Customer: ${email.from}\nIssue: ${email.body}`,
      databaseId: "support_cases"
    }));
  })
  .then(async (cases) => {
    return Promise.all(cases.map(case_ => 
      devflow.notion.createPage(case_).execute()
    ));
  })
  .execute();
```

### 2. Multi-Step Processing

```typescript
// Complex workflow with multiple steps
await devflow.gmail
  .onNewEmail({ query: "is:unread" })
  .then(async (emails) => {
    // Step 1: Filter important emails
    return emails.filter(email => 
      email.subject.toLowerCase().includes('urgent') ||
      email.from.includes('ceo@company.com')
    );
  })
  .then(async (importantEmails) => {
    // Step 2: Create Notion pages
    const pages = await Promise.all(
      importantEmails.map(email => 
        devflow.notion
          .db("important_emails")
          .create({
            title: email.subject,
            content: `From: ${email.from}\n\n${email.body}`
          })
          .execute()
      )
    );
    
    // Step 3: Send notification email
    await devflow.gmail
      .sendEmail({
        to: "admin@company.com",
        subject: "Important Emails Processed",
        body: `${pages.length} important emails have been documented.`
      })
      .execute();
    
    return pages;
  })
  .execute();
```

## 🛠️ Development

### Building the SDK

```bash
cd packages/sdk
npm run build
```

### Publishing Updates

```bash
cd packages/sdk
npm version patch  # or minor/major
npm publish
```

### Adding New Services

1. **Create Service Client** (`src/new-service/client.ts`)
2. **Create Service Builder** (`src/new-service/new-service-builder.ts`)
3. **Add Types** (`src/types/index.ts`)
4. **Create API Routes** (`apps/platform/src/app/api/sdk/new-service/`)
5. **Update Main Exports** (`src/index.ts`)

## 📚 API Reference

### DevFlow Class

```typescript
class DevFlow {
  gmail: GmailBuilder;
  notion: NotionBuilder;
}
```

### GmailBuilder Class

```typescript
class GmailBuilder {
  onNewEmail(config?: { query?: string; maxResults?: number }): ChainableAction<EmailMessage[]>;
  sendEmail(data: EmailData): ChainableAction<any>;
}
```

### NotionBuilder Class

```typescript
class NotionBuilder {
  createPage(data: NotionPageData): ChainableAction<any>;
  db(databaseId: string): NotionDatabaseBuilder;
}
```

### NotionDatabaseBuilder Class

```typescript
class NotionDatabaseBuilder {
  create(data?: NotionPageData): ChainableAction<any>;
  insert(data?: NotionPageData): ChainableAction<any>;
}
```

### ChainableAction Interface

```typescript
interface ChainableAction<T> {
  then<U>(action: WorkflowAction<T, U>): ChainableAction<U>;
  execute(): Promise<T>;
}
```

## 🎯 Best Practices

1. **Use Specific Queries**: Narrow down Gmail searches for better performance
2. **Handle Errors Gracefully**: Always wrap workflows in try-catch blocks
3. **Limit Results**: Use `maxResults` to prevent overwhelming API calls
4. **Parallel Processing**: Use `Promise.all()` for independent operations
5. **Type Safety**: Leverage TypeScript for better development experience

## 🔮 Future Enhancements

- **Real-time Monitoring**: WebSocket-based email monitoring
- **Scheduled Workflows**: Cron-based workflow execution
- **Conditional Logic**: If-then-else workflow branching
- **Data Transformation**: Built-in data mapping and filtering
- **Service Templates**: Pre-built workflow templates
- **Analytics**: Workflow execution metrics and monitoring

---

*This documentation covers the current implementation of the DevFlow SDK. For updates and new features, check the latest version.*
