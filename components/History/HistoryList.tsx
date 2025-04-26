"use client";
import React from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import { useHistory } from '@/hooks/useHistory';

const HistoryList: React.FC = () => {
  const { history, isLoading, error, retry, hasMore, loadMore } = useHistory();

  if (isLoading && history.length === 0) {
    return <LoadingSkeleton className="h-32 w-full" />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }
  return (
    <div className="flex flex-col gap-4">
      {history.length === 0 ? (
        <div className="text-center text-zinc-400">No conversations yet.</div>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {history.map((item) => (
            <li key={item.id} className="rounded px-4 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.title || 'Untitled Conversation'}</span>
                <span className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <div className="truncate text-sm text-zinc-500">{item.preview}</div>
            </li>
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          onClick={loadMore}
          className="mx-auto mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default HistoryList;

/*
Key Points:
- Paginated list of conversations.
- Loading, error, and empty states.
- Accessible, keyboard navigable.
*/
