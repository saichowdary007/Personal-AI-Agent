"use client";
import React, { useState } from 'react';
import SummarizeInput from '@/components/Summarize/SummarizeInput';
import SummarizeResult from '@/components/Summarize/SummarizeResult';
import SummarizeOptions from '@/components/Summarize/SummarizeOptions';
import { useSummarize } from '@/hooks/useSummarize';

// Make sure this matches the type in useSummarize
interface SummaryOptions {
  maxLength?: number;
  format?: 'paragraph' | 'bullets';
}

const SummarizePage: React.FC = () => {
  // Track metadata separately since useSummarize doesn't provide it
  const [metadata, setMetadata] = useState<any>(null);
  const [options, setOptions] = useState<SummaryOptions>({
    maxLength: 500,
    format: 'paragraph'
  });
  
  const { 
    summarizeText, 
    summarizeFile, 
    summary,
    loading,
    error, 
    reset 
  } = useSummarize();

  // Wrap the summarizeText function to capture metadata
  const handleSummarizeText = async (text: string) => {
    const result = await summarizeText(text, options);
    if (result) {
      setMetadata({
        source_type: 'text',
        original_length: text.length,
        summary_length: result.length,
        format: options.format || 'paragraph'
      });
    }
    return result;
  };

  // Wrap the summarizeFile function to capture metadata
  const handleSummarizeFile = async (file: File) => {
    const result = await summarizeFile(file, options);
    if (result) {
      setMetadata({
        source_type: file.type.includes('pdf') ? 'pdf' : 'text file',
        original_length: 'N/A', // We don't know the content length of a file
        summary_length: result.length,
        format: options.format || 'paragraph'
      });
    }
    return result;
  };

  // Wrap reset to also clear metadata
  const handleReset = () => {
    reset();
    setMetadata(null);
  };

  // Handle options change from SummarizeOptions component
  const handleOptionsChange = (newOptions: any) => {
    // Filter out any format value that's not supported by useSummarize
    const sanitizedOptions: SummaryOptions = {
      ...newOptions,
      format: newOptions.format === 'outline' ? 'paragraph' : newOptions.format
    };
    
    setOptions(prevOptions => ({
      ...prevOptions,
      ...sanitizedOptions
    }));
  };

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
            onSummarizeText={handleSummarizeText}
            onSummarizeFile={handleSummarizeFile}
            isLoading={loading}
          />
          
          <SummarizeResult
            result={summary}
            metadata={metadata}
            isLoading={loading}
            error={error}
            onReset={handleReset}
          />
        </div>
        
        <div>
          <SummarizeOptions onOptionsChange={handleOptionsChange} />
        </div>
      </div>
    </section>
  );
};

export default SummarizePage; 