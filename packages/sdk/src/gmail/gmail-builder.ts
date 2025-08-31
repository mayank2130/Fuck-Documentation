// packages/sdk/src/gmail/gmail-builder.ts
import { EmailData, ChainableAction, WorkflowAction, EmailMessage } from '../types';
import { gmail } from './client';

export class GmailBuilder {
  sendEmail(emailData?: Partial<EmailData>): ChainableAction<any> {
    return new GmailAction('sendEmail', emailData);
  }

  onNewEmail(config?: { query?: string; maxResults?: number }): ChainableAction<EmailMessage[]> {
    return new GmailAction('onNewEmail', config);
  }
}

class GmailAction<T = any> implements ChainableAction<T> {
  constructor(
    private action: string,
    private config?: any
  ) {}

  then<U>(nextAction: WorkflowAction<T, U>): ChainableAction<U> {
    return new ChainedAction(this, nextAction);
  }

  async execute(): Promise<T> {
    switch (this.action) {
      case 'sendEmail':
        return gmail.sendEmail(this.config) as Promise<T>;
      case 'onNewEmail':
        return gmail.onNewEmail(this.config) as Promise<T>;
      default:
        throw new Error(`Unknown action: ${this.action}`);
    }
  }
}

class ChainedAction<T, U> implements ChainableAction<U> {
  constructor(
    private previousAction: ChainableAction<T>,
    private currentAction: WorkflowAction<T, U>
  ) {}

  then<V>(nextAction: WorkflowAction<U, V>): ChainableAction<V> {
    return new ChainedAction(this, nextAction);
  }

  async execute(): Promise<U> {
    const previousResult = await this.previousAction.execute();
    return this.currentAction(previousResult);
  }
}
