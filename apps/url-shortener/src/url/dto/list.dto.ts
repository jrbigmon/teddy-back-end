import { Sort } from '../../../../@share/enums/sort.enum';

export interface ListInputDTO {
  sort?: Sort;
  userId?: string;
  page?: number;
  pageSize?: number;
  baseUrl: string;
}

export interface ListOutputDTO {
  count: number;
  totalPages: number;
  page: number;
  pageSize: number;
  sort: Sort;
  _nextPage: string;
  _prevPage: string;
  data: {
    id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: Date;
    updatedAt: Date;
    clickCount?: number;
    _infoPage: string;
    // _clicksPage: string; TODO: create a route to show the clicks
  }[];
}
