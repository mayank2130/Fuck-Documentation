// packages/sdk/src/notion/notion-builder.ts
import { NotionPageData, ChainableAction } from '../types';
import { notion } from './client';

export class NotionBuilder {
  db(databaseId: string): NotionDatabaseBuilder {
    return new NotionDatabaseBuilder(databaseId);
  }

  createPage(pageData?: Partial<NotionPageData>): ChainableAction<any> {
    return new NotionAction('createPage', pageData);
  }
}

export class NotionDatabaseBuilder {
  constructor(private databaseId: string) {}

  create(data?: Partial<NotionPageData>): ChainableAction<any> {
    return new NotionAction('create', { ...data, databaseId: this.databaseId });
  }

  insert(data?: Partial<NotionPageData>): ChainableAction<any> {
    return new NotionAction('insert', { ...data, databaseId: this.databaseId });
  }
}

class NotionAction<T = any> implements ChainableAction<T> {
  constructor(
    private action: string,
    private config?: any
  ) {}

  then<U>(nextAction: (input: T) => Promise<U>): ChainableAction<U> {
    return new ChainedAction(this, nextAction);
  }

  async execute(): Promise<T> {
    switch (this.action) {
      case 'createPage':
      case 'create':
      case 'insert':
        return notion.createPage(this.config) as Promise<T>;
      default:
        throw new Error(`Unknown action: ${this.action}`);
    }
  }
}

class ChainedAction<T, U> implements ChainableAction<U> {
  constructor(
    private previousAction: ChainableAction<T>,
    private nextAction: (input: T) => Promise<U>
  ) {}

  then<V>(nextAction: (input: U) => Promise<V>): ChainableAction<V> {
    return new ChainedAction(this, nextAction);
  }

  async execute(): Promise<U> {
    const previousResult = await this.previousAction.execute();
    return this.nextAction(previousResult);
  }
}
