"use client";
import React, { useState } from 'react';
import EmailInput from '@/components/Email/EmailInput';
import EmailOutput from '@/components/Email/EmailOutput';
import EmailOptions from '@/components/Email/EmailOptions';
import { useEmail } from '@/hooks/useEmail';

// Import the EmailOptions type with a different name
import type { EmailOptions as EmailOptionsType } from '@/hooks/useEmail';

const EmailPage: React.FC = () => {
  const [emailOptions, setEmailOptions] = useState<EmailOptionsType>({
    tone: 'professional',
    format: 'full',
  });
  
  const { 
    generateEmail, 
    result, 
    metadata, 
    isLoading, 
    error, 
    reset 
  } = useEmail();

  const handleGenerateEmail = async (prompt: string) => {
    await generateEmail(prompt, emailOptions);
  };

  const handleOptionsChange = (newOptions: EmailOptionsType) => {
    setEmailOptions(newOptions);
  };

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">Email Generator</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Describe the email you want to draft and we'll generate it for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <EmailInput 
            onSubmit={handleGenerateEmail}
            isLoading={isLoading}
          />
          
          <EmailOutput
            content={result}
            metadata={metadata}
            isLoading={isLoading}
            error={error}
            onReset={reset}
          />
        </div>
        
        <div>
          <EmailOptions 
            options={emailOptions}
            onOptionsChange={handleOptionsChange}
          />
        </div>
      </div>
    </section>
  );
};

export default EmailPage; 