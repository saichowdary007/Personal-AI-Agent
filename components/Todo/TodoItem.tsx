"use client";
import React, { useState } from 'react';
import { Check, Edit, Trash, X } from 'lucide-react';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center p-3 border-b border-gray-200 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="mr-2 size-5 text-blue-500"
      />
      
      {isEditing ? (
        <div className="flex flex-1 items-center">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-1 border border-gray-300 rounded"
            autoFocus
          />
          <button 
            onClick={handleSave}
            className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-sm"
          >
            Save
          </button>
          <button 
            onClick={handleCancel}
            className="ml-2 px-2 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span 
            className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
          >
            {todo.text}
          </span>
          <div className="hidden group-hover:flex">
            <button 
              onClick={handleEdit}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem; 