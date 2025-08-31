export interface GmailTokens {
    accessToken: string;
    refreshToken?: string;
    expiryDate?: number;
  }
  
  export interface NotionTokens {
    accessToken: string;
  }
  
  export interface EmailData {
    to: string;
    subject: string;
    body: string;
  }
  
  export interface EmailMessage {
    id: string;
    subject: string;
    from: string;
    date: string;
    body: string;
    snippet: string;
  }
  
  export interface NotionPageData {
    title: string;
    content?: string;
    parentPageId?: string;
    databaseId?: string;
  }
  
  // Workflow types for the fluent API
  export interface WorkflowTrigger<T = any> {
    service: string;
    event: string;
    data: T;
  }
  
  export interface WorkflowAction<TInput = any, TOutput = any> {
    (input: TInput): Promise<TOutput>;
  }
  
  export interface ChainableAction<T = any> {
    then<U>(action: WorkflowAction<T, U>): ChainableAction<U>;
    execute(): Promise<T>;
  }
  