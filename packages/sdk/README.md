# @techno-king/sdk

SDK for AIBoomi platform integrations with Gmail and Notion.

## Installation

```bash
npm install @techno-king/sdk
```

## Usage

### Notion Integration

```typescript
import { createPage } from '@techno-king/sdk';

// Create a page in a database
const result = await createPage(
  { accessToken: 'your-notion-token' },
  {
    title: 'My New Page',
    content: 'This is the page content',
    databaseId: 'your-database-id'
  }
);

// Create a child page
const result = await createPage(
  { accessToken: 'your-notion-token' },
  {
    title: 'Child Page',
    content: 'This is a child page',
    parentPageId: 'parent-page-id'
  }
);
```

### Gmail Integration

```typescript
import { gmail } from '@techno-king/sdk';

// Send an email
const result = await gmail.send(
  { accessToken: 'your-gmail-token' },
  {
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'This is a test email'
  }
);
```

## Environment Variables

- `NOTION_DATABASE_ID`: Default database ID for Notion pages
- `INTEGRATION_TOKEN`: Notion internal integration token

## API Reference

### Notion

#### `createPage(tokens, data)`

Creates a new page in Notion.

**Parameters:**
- `tokens`: Object with `accessToken` string
- `data`: Object with:
  - `title`: Page title (required)
  - `content`: Page content (optional)
  - `parentPageId`: Parent page ID (optional)
  - `databaseId`: Database ID (optional)

**Returns:** Notion page object

### Gmail

#### `gmail.send(tokens, data)`

Sends an email via Gmail.

**Parameters:**
- `tokens`: Object with `accessToken` string
- `data`: Object with:
  - `to`: Recipient email (required)
  - `subject`: Email subject (required)
  - `body`: Email body (required)

**Returns:** Gmail message object

## License

MIT
