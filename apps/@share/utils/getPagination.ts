import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../constants/pagination';

export function getPagination({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  page: number;
  pageSize: number;
}) {
  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

  return (page - 1) * pageSize;
}

function getUrlToPagination({
  baseUrl,
  pageSize,
  page,
}: {
  baseUrl: string;
  pageSize: number;
  page: number;
}) {
  return `${baseUrl}?pageSize=${pageSize}?page=${page}`;
}

export function getNextPage({
  page,
  totalPages,
  baseUrl,
  pageSize,
}: {
  page: number;
  totalPages: number;
  baseUrl: string;
  pageSize: number;
}) {
  const nextPage = Number(page) + 1;
  return page < totalPages
    ? getUrlToPagination({ baseUrl, pageSize, page: nextPage })
    : null;
}

export function getPrevPage({
  page,
  baseUrl,
  pageSize,
}: {
  page: number;
  baseUrl: string;
  pageSize: number;
}) {
  const prevPage = Number(page) - 1;
  return page > 1
    ? getUrlToPagination({ baseUrl, pageSize, page: prevPage })
    : null;
}
