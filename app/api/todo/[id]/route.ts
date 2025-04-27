import { NextRequest, NextResponse } from 'next/server';

// Route for PUT (update) and DELETE operations on a specific todo by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { task } = await req.json();
    
    if (!task || typeof task !== 'string' || !task.trim()) {
      return NextResponse.json(
        { error: 'Task content is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
    const response = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ task: task.trim() }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
    const response = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 