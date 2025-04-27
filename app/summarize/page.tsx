"use client";
import React from 'react';
import SummarizeInput from '@/components/Summarize/SummarizeInput';
import SummarizeResult from '@/components/Summarize/SummarizeResult';
import SummarizeOptions from '@/components/Summarize/SummarizeOptions';
import { useSummarize } from '@/hooks/useSummarize';

const SummarizePage: React.FC = () => {
  const { 
    summarizeText, 
    summarizeFile, 
    result, 
    metadata, 
    isLoading, 
    error, 
    reset 
  } = useSummarize();

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Text Summarizer</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Paste text or upload a document to generate a concise summary.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <SummarizeInput 
            onSummarizeText={summarizeText} 
            onSummarizeFile={summarizeFile}
            isLoading={isLoading}
          />
          
          <SummarizeResult
            result={result}
            metadata={metadata}
            isLoading={isLoading}
            error={error}
            onReset={reset}
          />
        </div>
        
        <div>
          <SummarizeOptions />
        </div>
      </div>
    </section>
  );
};

export default SummarizePage; 