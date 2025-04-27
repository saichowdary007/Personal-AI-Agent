"use client";
import React from 'react';
import { Clipboard, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSkeleton from '../LoadingSkeleton';

interface EmailOutputProps {
  content: string | null;
  metadata: any;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const EmailOutput: React.FC<EmailOutputProps> = ({
  content,
  metadata,
  isLoading,
  error,
  onReset
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 font-semibold text-zinc-700 dark:text-zinc-300">Generated Email</h3>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900 dark:bg-red-900/20">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle size={20} />
          <h3 className="font-semibold">Error</h3>
        </div>
        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={onReset}
          className="mt-3 flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success('Email copied to clipboard');
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Generated Email</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          aria-label="Copy to clipboard"
        >
          <Clipboard size={14} />
          Copy
        </button>
      </div>
      
      <div className="mb-4 whitespace-pre-line rounded-md bg-zinc-50 p-4 font-mono text-sm dark:bg-zinc-900">
        {content}
      </div>
      
      {metadata && (
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
          <p className="font-medium text-blue-700 dark:text-blue-300">
            Email Details:
            {metadata.tone && <span className="ml-2">Tone: <span className="font-normal">{metadata.tone}</span></span>}
            {metadata.format && <span className="ml-2">Format: <span className="font-normal">{metadata.format}</span></span>}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailOutput; 