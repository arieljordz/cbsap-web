
export interface Pagination<T>  {
  data : T[] 
  currentPage: number | 0;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}
