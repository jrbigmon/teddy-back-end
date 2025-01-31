import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UrlUpdateInputDTO {
  id: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Url is required' })
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
