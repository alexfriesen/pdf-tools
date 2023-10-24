export interface DocumentMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator?: string;
  producer?: string;
  creationDate?: string | Date;
  modificationDate?: string | Date;
}
