"use client";
import React from 'react';
import { Clipboard, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSkeleton from '../LoadingSkeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SummarizeResultProps {
  result: string | null;
  metadata: any;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const SummarizeResult: React.FC<SummarizeResultProps> = ({
  result,
  metadata,
  isLoading,
  error,
  onReset
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 font-semibold text-zinc-700 dark:text-zinc-300">Summary</h3>
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

  if (!result) {
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Summary copied to clipboard');
  };

  // Format metadata for display
  const formatMetadata = () => {
    if (!metadata) return [];
    
    const items = [];
    
    if (metadata.source_type) {
      items.push({
        label: 'Source',
        value: metadata.source_type.charAt(0).toUpperCase() + metadata.source_type.slice(1)
      });
    }
    
    if (metadata.original_length) {
      items.push({
        label: 'Original Length',
        value: `${metadata.original_length.toLocaleString()} characters`
      });
    }
    
    if (metadata.summary_length) {
      items.push({
        label: 'Summary Length',
        value: `${metadata.summary_length.toLocaleString()} characters`
      });
    }
    
    if (metadata.format) {
      items.push({
        label: 'Format',
        value: metadata.format.charAt(0).toUpperCase() + metadata.format.slice(1)
      });
    }
    
    return items;
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Summary</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          aria-label="Copy to clipboard"
        >
          <Clipboard size={14} />
          Copy
        </button>
      </div>
      
      <div className="mb-4 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-3" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-3" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              code: ({node, className, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match && (props.children?.toString() || '').split('\n').length <= 1;
                return isInline ? 
                  <code className="bg-zinc-200 dark:bg-zinc-600 px-1 py-0.5 rounded" {...props} /> : 
                  <code className="block bg-zinc-200 dark:bg-zinc-600 p-2 rounded my-2 overflow-x-auto" {...props} />;
              },
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-500 pl-3 py-1 italic my-2" {...props} />,
            }}
          >
            {result}
          </ReactMarkdown>
        </div>
      </div>
      
      {metadata && (
        <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
          <h4 className="mb-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            Summary Info
          </h4>
          <dl className="grid gap-1 text-sm md:grid-cols-2">
            {formatMetadata().map((item, index) => (
              <div key={index} className="flex items-baseline gap-1">
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}:</dt>
                <dd className="text-zinc-600 dark:text-zinc-400">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

export default SummarizeResult; 