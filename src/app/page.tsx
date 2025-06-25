"use client";
import { useState, useEffect } from "react";
import { PrismaClient, Todo } from "@/generated/prisma";

const prisma = new PrismaClient();

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    setNewTodo("");
    fetchTodos();
  }

  async function removeTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">My Todo List</h1>
      <form onSubmit={addTodo} className="flex gap-2 mb-6 w-full max-w-md">
        <input
          className="flex-1 px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors font-semibold" type="submit">
          Add
        </button>
      </form>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-400">No todos yet!</div>
        ) : (
          <ul className="space-y-4">
            {todos.map(todo => (
              <li key={todo.id} className="flex justify-between items-center bg-gray-700 rounded px-4 py-2">
                <span>{todo.title}</span>
                <button
                  className="text-red-400 hover:text-red-600 transition-colors"
                  onClick={() => removeTodo(todo.id)}
                  aria-label="Remove todo"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
