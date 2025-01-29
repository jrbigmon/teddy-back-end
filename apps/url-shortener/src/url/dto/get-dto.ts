export class GetInputDTO {
  id: string;
  userId?: string;
}

export interface GetOutputDTO {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
  clickCount?: number;
  // _clicksPage: string; TODO: create a route to show the clicks
}
