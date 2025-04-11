import { PUBLIC_API_URL } from "$env/static/public";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getHistory = async (
  siteKey: string, 
  fetch: typeof window.fetch,
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<PaginatedResponse<any>> => {
  const response = await fetch(
    `${PUBLIC_API_URL}/history/${siteKey}?page=${page}&limit=${limit}`, 
    { credentials: "include" }
  );

  return response.json();
}