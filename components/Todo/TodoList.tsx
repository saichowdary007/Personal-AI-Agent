"use client";
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '@/types/Todo';

interface TodoListProps {
  initialTodos?: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos = [] }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: number, text: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text } : todo
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(newTodoText);
    setNewTodoText('');
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
        {todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No todos yet. Add one above!</div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
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