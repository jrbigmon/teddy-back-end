export class ClickingInputDTO {
  shortUrl: string;
  userId?: string;
}

export interface ClickingOutputDTO {
  id: string;
  originalUrl: string;
  createdAt: Date;
}
