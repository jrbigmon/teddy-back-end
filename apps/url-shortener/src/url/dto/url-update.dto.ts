import { ApiProperty } from '@nestjs/swagger';

export class UrlUpdateInputDTO {
  id: string;

  @ApiProperty({ type: String })
  url: string;

  userId: string;
  serverUrl: string;
}

export class UrlUpdateOutputDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  shortUrl: string;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
