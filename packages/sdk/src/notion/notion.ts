import { Client } from "@notionhq/client";
import { NotionTokens } from '../types';

function getNotionClient(tokens: NotionTokens) {
  return new Client({ auth: tokens.accessToken });
}

export async function createPage(
  tokens: NotionTokens, 
  data: { 
    title: string; 
    content?: string;
    parentPageId?: string;
    databaseId?: string;
  }
) {
  const notion = getNotionClient(tokens);

  const parent = data.parentPageId 
    ? { page_id: data.parentPageId }
    : { database_id: data.databaseId || process.env.NOTION_DATABASE_ID || "25f3f2eb4b908071907fe4aab90ded63" };

  const res = await notion.pages.create({
    parent,
    properties: {
      title: {
        title: [{ text: { content: data.title } }],
      },
    },
    children: data.content ? [
      {
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ text: { content: data.content } }] },
      },
    ] : undefined,
  });

  return res;
}
