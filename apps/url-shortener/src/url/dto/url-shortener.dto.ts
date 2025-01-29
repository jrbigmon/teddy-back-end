export class UrlShortenerInputDTO {
  url: string;
  serverUrl: string;
  userId?: string;
}

export interface UrlShortenerOutputDTO {
  id: string;
  shortUrl: string;
  createdAt?: Date;
}
