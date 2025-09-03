'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Code, Mail, FileText, Settings, Zap, TestTube, Wrench, Target, Sparkles } from 'lucide-react';

const DevFlowDocs = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [openSections, setOpenSections] = useState(new Set(['getting-started', 'integrations']));

  const toggleSection = (section) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const navigation = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'architecture', title: 'Architecture', icon: Settings },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      children: [
        { id: 'installation', title: 'Installation' },
        { id: 'basic-usage', title: 'Basic Usage' }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Code,
      children: [
        { id: 'gmail', title: 'Gmail Integration' },
        { id: 'notion', title: 'Notion Integration' }
      ]
    },
    { id: 'workflow-chaining', title: 'Workflow Chaining', icon: Zap },
    { id: 'api-architecture', title: 'API Architecture', icon: Settings },
    { id: 'configuration', title: 'Configuration', icon: Settings },
    { id: 'testing', title: 'Testing', icon: TestTube },
    { id: 'advanced-usage', title: 'Advanced Usage', icon: Target },
    { id: 'workflow-patterns', title: 'Workflow Patterns', icon: FileText },
    { id: 'development', title: 'Development', icon: Wrench },
    { id: 'api-reference', title: 'API Reference', icon: Code },
    { id: 'best-practices', title: 'Best Practices', icon: Target },
    { id: 'future-enhancements', title: 'Future Enhancements', icon: Sparkles }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.flatMap(nav => 
        nav.children ? [nav, ...nav.children] : [nav]
      );
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const CodeBlock = ({ children, language = 'typescript' }) => (
    <div className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">{language}</span>
      </div>
      <pre className="text-green-400 text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );

  const NavItem = ({ item, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.has(item.id);
    const isActive = activeSection === item.id;
    const Icon = item.icon;

    return (
      <div className="mb-1">
        <div
          className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            }
            scrollToSection(item.id);
          }}
        >
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </div>
        {hasChildren && isOpen && (
          <div className="ml-4">
            {item.children.map(child => (
              <NavItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">DevFlow SDK</h1>
          <p className="text-sm text-gray-600 mt-1">Documentation</p>
        </div>
        
        <nav className="p-4">
          {navigation.map(item => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-8 py-12">
          
          {/* Overview */}
          <section id="overview" className="mb-16">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">DevFlow SDK</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              A powerful cross-API integration toolkit that enables seamless workflows between different services like Gmail and Notion. It provides a fluent, chainable API for building complex automation workflows with minimal code.
            </p>
          </section>

          {/* Architecture */}
          <section id="architecture" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-7 h-7 text-blue-600 mr-3" />
              Architecture
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Core Components</h3>
            <CodeBlock language="text">
{`packages/sdk/
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
│   └── index.ts                # Main exports`}
            </CodeBlock>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Design Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Fluent API', desc: 'Chainable methods for intuitive workflow building' },
                { title: 'Type Safety', desc: 'Full TypeScript support with comprehensive type definitions' },
                { title: 'Cross-Service Integration', desc: 'Seamless data flow between different APIs' },
                { title: 'Error Handling', desc: 'Robust error handling and recovery' },
                { title: 'Extensible', desc: 'Easy to add new services and workflows' }
              ].map((principle, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">{principle.title}</h4>
                  <p className="text-gray-600 text-sm">{principle.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="w-7 h-7 text-blue-600 mr-3" />
              Installation
            </h2>
            <CodeBlock language="bash">
              npm install @techno-king/sdk
            </CodeBlock>
          </section>

          {/* Basic Usage */}
          <section id="basic-usage" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Usage</h2>
            <CodeBlock>
{`import { devflow } from '@techno-king/sdk';

// Monitor Gmail and create Notion pages
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(async (emails) => {
    return emails.map(email => ({
      title: \`Support Email: \${email.subject}\`,
      content: \`From: \${email.from}\\nReceived: \${email.date}\\n\\n\${email.body}\`,
      databaseId: "support_tickets"
    }));
  })
  .then(async (pageDataArray) => {
    return Promise.all(pageDataArray.map(pageData => 
      devflow.notion.createPage(pageData).execute()
    ));
  })
  .execute();`}
            </CodeBlock>
          </section>

          {/* Gmail Integration */}
          <section id="gmail" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="w-7 h-7 text-red-600 mr-3" />
              Gmail Integration
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Methods</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">onNewEmail(config)</h4>
              <p className="text-gray-600 mb-4">Monitors Gmail for new emails matching specified criteria.</p>
              
              <CodeBlock>
{`// Monitor unread emails from specific sender
const emails = await devflow.gmail
  .onNewEmail({ 
    query: "from:support@company.com",
    maxResults: 10 
  })
  .execute();`}
              </CodeBlock>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <h5 className="font-semibold text-gray-800 mb-2">Parameters:</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><code className="bg-gray-200 px-2 py-1 rounded">query</code> (string): Gmail search query</li>
                  <li><code className="bg-gray-200 px-2 py-1 rounded">maxResults</code> (number): Maximum number of emails (default: 10)</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">sendEmail(data)</h4>
              <p className="text-gray-600 mb-4">Sends an email via Gmail.</p>
              
              <CodeBlock>
{`await devflow.gmail
  .sendEmail({
    to: "recipient@example.com",
    subject: "Test Email",
    body: "This is a test email"
  })
  .execute();`}
              </CodeBlock>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">EmailMessage Interface</h3>
            <CodeBlock>
{`interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  snippet: string;
}`}
            </CodeBlock>
          </section>

          {/* Notion Integration */}
          <section id="notion" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-7 h-7 text-black mr-3" />
              Notion Integration
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Methods</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">createPage(data)</h4>
              <p className="text-gray-600 mb-4">Creates a new page in Notion.</p>
              
              <CodeBlock>
{`await devflow.notion
  .createPage({
    title: "New Page",
    content: "Page content here",
    databaseId: "your-database-id"
  })
  .execute();`}
              </CodeBlock>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">db(databaseId)</h4>
              <p className="text-gray-600 mb-4">Returns a database-specific builder for creating pages in a specific database.</p>
              
              <CodeBlock>
{`await devflow.notion
  .db("support_tickets")
  .create({
    title: "Support Ticket",
    content: "Ticket details"
  })
  .execute();`}
              </CodeBlock>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">NotionPageData Interface</h3>
            <CodeBlock>
{`interface NotionPageData {
  title: string;
  content?: string;
  parentPageId?: string;
  databaseId?: string;
}`}
            </CodeBlock>
          </section>

          {/* Workflow Chaining */}
          <section id="workflow-chaining" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="w-7 h-7 text-yellow-600 mr-3" />
              Workflow Chaining
            </h2>
            <p className="text-gray-600 mb-6">The SDK supports powerful workflow chaining for complex automation scenarios.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Chaining</h3>
            <CodeBlock>
{`await devflow.gmail
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
  .execute();`}
            </CodeBlock>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Advanced Workflow Example</h3>
            <CodeBlock>
{`await devflow.gmail
  .onNewEmail({ 
    query: "from:support@company.com is:unread",
    maxResults: 5 
  })
  .then(async (emails) => {
    console.log(\`Found \${emails.length} support emails\`);
    
    // Filter and transform emails
    return emails
      .filter(email => email.subject.toLowerCase().includes('urgent'))
      .map(email => ({
        title: \`URGENT: \${email.subject}\`,
        content: \`
From: \${email.from}
Date: \${email.date}
Priority: URGENT

\${email.body}
        \`,
        databaseId: "urgent_tickets"
      }));
  })
  .then(async (urgentTickets) => {
    console.log(\`Creating \${urgentTickets.length} urgent tickets\`);
    
    // Create pages in parallel
    const pagePromises = urgentTickets.map(ticket => 
      devflow.notion.createPage(ticket).execute()
    );
    
    return Promise.all(pagePromises);
  })
  .then(async (createdPages) => {
    console.log(\`Successfully created \${createdPages.length} pages\`);
    
    // Send confirmation email
    return devflow.gmail
      .sendEmail({
        to: "admin@company.com",
        subject: "Urgent Tickets Created",
        body: \`\${createdPages.length} urgent tickets have been created in Notion.\`
      })
      .execute();
  })
  .execute();`}
            </CodeBlock>
          </section>

          {/* API Architecture */}
          <section id="api-architecture" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-7 h-7 text-gray-600 mr-3" />
              API Architecture
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Client-Server Pattern</h3>
            <p className="text-gray-600 mb-4">The SDK follows a client-server pattern where:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>SDK Client:</strong> Makes HTTP requests to platform API routes</li>
              <li><strong>Platform API Routes:</strong> Handle authentication and service-specific logic</li>
              <li><strong>External APIs:</strong> Gmail and Notion APIs are called from the platform</li>
            </ol>

            <div className="bg-gray-100 p-4 rounded-lg text-center font-mono text-sm mb-6">
              SDK Client → Platform API Routes → External APIs (Gmail/Notion)
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">API Routes Structure</h3>
            <CodeBlock language="text">
{`apps/platform/src/app/api/sdk/
├── gmail/
│   ├── monitor/route.ts    # Email monitoring
│   ├── send/route.ts       # Email sending
│   └── list/route.ts       # Email listing
└── notion/
    └── page/route.ts       # Page creation`}
            </CodeBlock>
          </section>

          {/* Configuration */}
          <section id="configuration" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-7 h-7 text-blue-600 mr-3" />
              Configuration
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Environment Variables</h3>
            <CodeBlock language="bash">
{`# Platform Configuration
PLATFORM_ORIGIN=http://localhost:3000
DEVFLOW_BASE_URL=http://localhost:3000

# Gmail OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/gmail/callback

# Notion OAuth
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_DATABASE_ID=your_default_database_id`}
            </CodeBlock>
          </section>

          {/* Testing */}
          <section id="testing" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <TestTube className="w-7 h-7 text-green-600 mr-3" />
              Testing
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Workflow Page</h3>
            <p className="text-gray-600 mb-4">Visit <code className="bg-gray-200 px-2 py-1 rounded">/test-workflow</code> to test the complete Gmail → Notion workflow:</p>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Configure Query:</strong> Set Gmail search criteria</li>
              <li><strong>Set Database ID:</strong> Specify Notion database for page creation</li>
              <li><strong>Run Workflow:</strong> Execute the complete automation</li>
              <li><strong>View Results:</strong> See emails found and pages created</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Example Test Configuration</h3>
            <CodeBlock>
{`// Test with npm support emails
{
  query: "from:support@npmjs.com",
  databaseId: "25f3f2eb4b908071907fe4aab90ded63"
}`}
            </CodeBlock>
          </section>

          {/* Advanced Usage */}
          <section id="advanced-usage" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-7 h-7 text-purple-600 mr-3" />
              Advanced Usage
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Workflow Functions</h3>
            <CodeBlock>
{`// Custom email processing function
const processSupportEmails = async (emails: EmailMessage[]) => {
  return emails.map(email => ({
    title: \`Support: \${email.subject}\`,
    content: \`
**From:** \${email.from}
**Date:** \${email.date}
**Priority:** \${email.subject.toLowerCase().includes('urgent') ? 'HIGH' : 'NORMAL'}

\${email.body}
    \`,
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
  .execute();`}
            </CodeBlock>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Error Handling</h3>
            <CodeBlock>
{`try {
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
}`}
            </CodeBlock>
          </section>

          {/* Workflow Patterns */}
          <section id="workflow-patterns" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-7 h-7 text-indigo-600 mr-3" />
              Workflow Patterns
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Email Monitoring → Notion Documentation</h3>
                <CodeBlock>
{`// Monitor support emails and create documentation
await devflow.gmail
  .onNewEmail({ query: "from:support@company.com" })
  .then(async (emails) => {
    return emails.map(email => ({
      title: \`Support Case: \${email.subject}\`,
      content: \`Customer: \${email.from}\\nIssue: \${email.body}\`,
      databaseId: "support_cases"
    }));
  })
  .then(async (cases) => {
    return Promise.all(cases.map(case_ => 
      devflow.notion.createPage(case_).execute()
    ));
  })
  .execute();`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Multi-Step Processing</h3>
                <CodeBlock>
{`// Complex workflow with multiple steps
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
            content: \`From: \${email.from}\\n\\n\${email.body}\`
          })
          .execute()
      )
    );
    
    // Step 3: Send notification email
    await devflow.gmail
      .sendEmail({
        to: "admin@company.com",
        subject: "Important Emails Processed",
        body: \`\${pages.length} important emails have been documented.\`
      })
      .execute();
    
    return pages;
  })
  .execute();`}
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Development */}
          <section id="development" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Wrench className="w-7 h-7 text-orange-600 mr-3" />
              Development
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Building the SDK</h3>
                <CodeBlock language="bash">
{`cd packages/sdk
npm run build`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Publishing Updates</h3>
                <CodeBlock language="bash">
{`cd packages/sdk
npm version patch  # or minor/major
npm publish`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Adding New Services</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Create Service Client</strong> (<code>src/new-service/client.ts</code>)</li>
                  <li><strong>Create Service Builder</strong> (<code>src/new-service/new-service-builder.ts</code>)</li>
                  <li><strong>Add Types</strong> (<code>src/types/index.ts</code>)</li>
                  <li><strong>Create API Routes</strong> (<code>apps/platform/src/app/api/sdk/new-service/</code>)</li>
                  <li><strong>Update Main Exports</strong> (<code>src/index.ts</code>)</li>
                </ol>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Code className="w-7 h-7 text-gray-700 mr-3" />
              API Reference
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">DevFlow Class</h3>
                <CodeBlock>
{`class DevFlow {
  gmail: GmailBuilder;
  notion: NotionBuilder;
}`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">GmailBuilder Class</h3>
                <CodeBlock>
{`class GmailBuilder {
  onNewEmail(config?: { query?: string; maxResults?: number }): ChainableAction<EmailMessage[]>;
  sendEmail(data: EmailData): ChainableAction<any>;
}`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">NotionBuilder Class</h3>
                <CodeBlock>
{`class NotionBuilder {
  createPage(data: NotionPageData): ChainableAction<any>;
  db(databaseId: string): NotionDatabaseBuilder;
}`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">NotionDatabaseBuilder Class</h3>
                <CodeBlock>
{`class NotionDatabaseBuilder {
  create(data?: NotionPageData): ChainableAction<any>;
  insert(data?: NotionPageData): ChainableAction<any>;
}`}
                </CodeBlock>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">ChainableAction Interface</h3>
                <CodeBlock>
{`interface ChainableAction<T> {
  then<U>(action: WorkflowAction<T, U>): ChainableAction<U>;
  execute(): Promise<T>;
}`}
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-7 h-7 text-green-600 mr-3" />
              Best Practices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Use Specific Queries',
                  desc: 'Narrow down Gmail searches for better performance',
                  icon: '🎯'
                },
                {
                  title: 'Handle Errors Gracefully',
                  desc: 'Always wrap workflows in try-catch blocks',
                  icon: '🛡️'
                },
                {
                  title: 'Limit Results',
                  desc: 'Use maxResults to prevent overwhelming API calls',
                  icon: '⚡'
                },
                {
                  title: 'Parallel Processing',
                  desc: 'Use Promise.all() for independent operations',
                  icon: '🚀'
                },
                {
                  title: 'Type Safety',
                  desc: 'Leverage TypeScript for better development experience',
                  icon: '🔒'
                }
              ].map((practice, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{practice.icon}</span>
                    <h3 className="font-semibold text-gray-800">{practice.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{practice.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Future Enhancements */}
          <section id="future-enhancements" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-7 h-7 text-purple-600 mr-3" />
              Future Enhancements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Real-time Monitoring',
                  desc: 'WebSocket-based email monitoring',
                  status: 'planned'
                },
                {
                  title: 'Scheduled Workflows',
                  desc: 'Cron-based workflow execution',
                  status: 'planned'
                },
                {
                  title: 'Conditional Logic',
                  desc: 'If-then-else workflow branching',
                  status: 'in-progress'
                },
                {
                  title: 'Data Transformation',
                  desc: 'Built-in data mapping and filtering',
                  status: 'planned'
                },
                {
                  title: 'Service Templates',
                  desc: 'Pre-built workflow templates',
                  status: 'planned'
                },
                {
                  title: 'Analytics',
                  desc: 'Workflow execution metrics and monitoring',
                  status: 'planned'
                }
              ].map((enhancement, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{enhancement.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      enhancement.status === 'planned' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {enhancement.status === 'planned' ? 'Planned' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{enhancement.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 italic text-center">
                This documentation covers the current implementation of the DevFlow SDK. 
                For updates and new features, check the latest version.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-500">
              <p className="mb-2">DevFlow SDK Documentation</p>
              <p className="text-sm">Built with ❤️ for seamless API integrations</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DevFlowDocs;