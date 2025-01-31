import { ApiProperty } from '@nestjs/swagger';
import { Sort } from '../../../../@share/enums/sort.enum';
import { IsIn, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

const isDiffOfNullAndUndefined = (_, value) => {
  return value !== null && value !== undefined;
};

export class UrlListInputDTO {
  userId?: string;
  baseUrl: string;

  @ApiProperty({ description: 'Page number to retrieve.', example: 1 })
  @ValidateIf(isDiffOfNullAndUndefined)
  @Transform(({ value }) => parseInt(value, 10))
  @Min(0, { message: 'Page cannot be negative' })
  page?: number;

  @ApiProperty({ description: 'Number of items per page.', example: 10 })
  @ValidateIf(isDiffOfNullAndUndefined)
  @Transform(({ value }) => parseInt(value, 10))
  @Min(1, { message: 'Page size must be greater than 0' })
  pageSize?: number;

  @ApiProperty({ description: 'Sort order (ASC or DESC).', example: 'ASC' })
  @ValidateIf(isDiffOfNullAndUndefined)
  @Transform(({ value }) => value.toUpperCase())
  @IsIn([Sort.ASC, Sort.DESC], { message: 'Sort must be ASC or DESC' })
  sort?: Sort;
}

export class UrlOutputDTO {
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
  clickCount: number | null;

  @ApiProperty({ type: String })
  _infoPage: string;

  // _clicksPage: string; TODO: create a route to show the clicks
}

export class UrlListOutputDTO {
  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: Number })
  totalPages: number;

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ enum: Sort })
  sort: Sort;

  @ApiProperty({ type: String, nullable: true })
  _nextPage: string | null;

  @ApiProperty({ type: String, nullable: true })
  _prevPage: string | null;

  @ApiProperty({ type: [UrlOutputDTO] })
  data: UrlOutputDTO[];
}
