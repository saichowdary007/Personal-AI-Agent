"use client";
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { useTodo } from '@/hooks/useTodo';
import { Todo } from '@/types/Todo';

const TodoList: React.FC = () => {
  const { todos, isLoading, error, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodo();
  const [newTodoText, setNewTodoText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText('');
    }
  };

  const handleToggle = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toggleTodo(id, !todo.completed);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>
      
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>
      
      <div className="bg-white rounded-md shadow">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading todos...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Error: {error.message}</div>
        ) : todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No todos yet. Add one above!</div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 