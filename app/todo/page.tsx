"use client";
import React from 'react';
import TodoList from '@/components/Todo/TodoList';

export default function TodoPage() {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo Manager</h1>
      <TodoList />
    </div>
  );
} 