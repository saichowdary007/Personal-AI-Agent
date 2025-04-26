import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-md bg-red-50 p-6 dark:bg-red-900">
    <span className="mb-2 font-semibold text-red-600 dark:text-red-300" role="alert">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;

/*
Key Points:
- Displays error message and optional retry button.
- Accessible: role="alert" for error text.
*/
