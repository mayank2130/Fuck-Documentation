import { GmailBuilder } from '../gmail/gmail-builder';
import { NotionBuilder } from '../notion/notion-builder';

export class DevFlow {
  public readonly gmail: GmailBuilder;
  public readonly notion: NotionBuilder;

  constructor() {
    this.gmail = new GmailBuilder();
    this.notion = new NotionBuilder();
  }
}

export const devflow = new DevFlow();
