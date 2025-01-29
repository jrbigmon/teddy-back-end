export function getPagination({
  page = 1,
  pageSize = 10,
}: {
  page: number;
  pageSize: number;
}) {
  if (pageSize > 50) pageSize = 50;

  return (page - 1) * pageSize;
}
