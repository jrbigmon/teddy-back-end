import { ApiProperty } from '@nestjs/swagger';

export class UrlGetInputDTO {
  id: string;
  userId?: string;
}

export class UrlGetOutputDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  originalUrl: string;

  @ApiProperty({ type: String })
  shortUrl: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Number, nullable: true })
  clickCount?: number;
  // _clicksPage: string; TODO: create a route to show the clicks
}
