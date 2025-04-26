import { useState } from 'react';
import useSWR from 'swr';

export interface HistoryItem {
  id: string;
  title?: string;
  preview: string;
  createdAt: string;
}

const PAGE_SIZE = 10;
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useHistory() {
  const [page, setPage] = useState(1);
  const { data, error, mutate, isLoading } = useSWR<{ items: HistoryItem[]; hasMore: boolean }>(`/api/history?page=${page}&size=${PAGE_SIZE}`, fetcher);

  const retry = () => mutate();
  const loadMore = () => setPage((p) => p + 1);

  return {
    history: data?.items || [],
    hasMore: data?.hasMore || false,
    isLoading,
    error: error ? (error.message || 'Failed to load history') : undefined,
    retry,
    loadMore,
  };
}

/*
Key Points:
- SWR for paginated history fetching.
- Handles loading, error, retry, and pagination.
- Type-safe HistoryItem interface.
*/
