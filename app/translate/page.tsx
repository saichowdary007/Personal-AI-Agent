"use client";
import React from 'react';
import TranslatorPanel from '@/components/Translator/TranslatorPanel';

const TranslatePage: React.FC = () => {
  return (
    <section aria-labelledby="translate-heading">
      <h1 id="translate-heading" className="sr-only">Translator</h1>
      <TranslatorPanel />
    </section>
  );
};

export default TranslatePage;
