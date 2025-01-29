export class UrlUpdateInputDTO {
  id: string;
  url: string;
  userId: string;
  serverUrl: string;
}

export class UrlUpdateOutputDTO {
  id: string;
  shortUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
