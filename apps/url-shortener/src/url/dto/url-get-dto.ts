export class UrlGetInputDTO {
  id: string;
  userId?: string;
}

export interface UrlGetOutputDTO {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
  clickCount?: number;
  // _clicksPage: string; TODO: create a route to show the clicks
}
