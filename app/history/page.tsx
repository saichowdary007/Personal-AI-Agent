"use client";
import React from 'react';
import HistoryList from '@/components/History/HistoryList';

const HistoryPage: React.FC = () => {
  return (
    <section aria-labelledby="history-heading">
      <h1 id="history-heading" className="sr-only">History</h1>
      <div className="mx-auto max-w-2xl">
        <HistoryList />
      </div>
    </section>
  );
};

export default HistoryPage;
