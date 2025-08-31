import { NextRequest, NextResponse } from "next/server";
import { devflow } from "@techno-king/sdk";

export async function POST(req: NextRequest) {
  try {
    const { query, databaseId } = await req.json();

    console.log("Starting workflow with:", { query, databaseId });

    // Execute the workflow: Monitor Gmail → Transform → Create Notion Page
    const result = await devflow.gmail
      .onNewEmail({ query, maxResults: 5 })
      .then(async (emails) => {
        console.log(`Found ${emails.length} emails`);
        
        // Transform each email into Notion page data
        const pageDataPromises = emails.map(async (email) => ({
          title: `Support Email: ${email.subject}`,
          content: `From: ${email.from}\nReceived: ${email.date}\n\n${email.body}`,
          databaseId: databaseId,
        }));

        return Promise.all(pageDataPromises);
      })
      .then(async (pageDataArray) => {
        console.log(`Creating ${pageDataArray.length} Notion pages`);
        
        // Create Notion pages for each email
        const pagePromises = pageDataArray.map(pageData => 
          devflow.notion.createPage(pageData).execute()
        );

        return Promise.all(pagePromises);
      })
      .execute();

    console.log("Workflow completed successfully");

    return NextResponse.json({
      success: true,
      emailsFound: result.length,
      pagesCreated: result.length,
      details: result,
    });

  } catch (error) {
    console.error("Workflow error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Workflow failed" },
      { status: 500 }
    );
  }
}
