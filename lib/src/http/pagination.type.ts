export interface PaginationParameter {
  page: number;
  page_size?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number,
    total: number
  };
}
