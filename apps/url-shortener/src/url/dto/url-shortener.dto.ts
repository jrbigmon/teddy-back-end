import { ApiProperty } from '@nestjs/swagger';

export class UrlShortenerInputDTO {
  @ApiProperty({ type: String })
  url: string;

  serverUrl: string;
  userId?: string;
}

export class UrlShortenerOutputDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  shortUrl: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;
}
