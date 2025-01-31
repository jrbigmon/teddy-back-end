import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UrlShortenerInputDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Url is required' })
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
