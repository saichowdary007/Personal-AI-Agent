import { NextRequest, NextResponse } from 'next/server';

// Route for PUT (update) and DELETE operations on a specific todo by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { task } = await req.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    console.log('[DEBUG] Todo PUT - Auth header:', authHeader?.substring(0, 15) + '...');
    console.log('[DEBUG] Todo PUT - Token present:', !!token);
    console.log('[DEBUG] Todo PUT - Todo ID:', id);
    console.log('[DEBUG] Todo PUT - New task content:', task);

    if (!token) {
      console.log('[DEBUG] Todo PUT - Authentication failed: No token provided');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!task || typeof task !== 'string' || task.trim() === '') {
      console.log('[DEBUG] Todo PUT - Validation failed: Invalid task content');
      return NextResponse.json(
        { error: 'Task cannot be empty' },
        { status: 400 }
      );
    }

    console.log(`[DEBUG] Todo PUT - Making request to: ${backendUrl}/todos/${id}`);
    
    const response = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ task }),
      cache: 'no-store',
    });

    console.log('[DEBUG] Todo PUT - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[DEBUG] Todo PUT - Error response:', errorText);
      throw new Error(`Failed to update todo: ${response.status} - ${errorText}`);
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
    const { id } = params;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    console.log('[DEBUG] Todo DELETE - Auth header:', authHeader?.substring(0, 15) + '...');
    console.log('[DEBUG] Todo DELETE - Token present:', !!token);
    console.log('[DEBUG] Todo DELETE - Todo ID:', id);

    if (!token) {
      console.log('[DEBUG] Todo DELETE - Authentication failed: No token provided');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log(`[DEBUG] Todo DELETE - Making request to: ${backendUrl}/todos/${id}`);
    
    const response = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    console.log('[DEBUG] Todo DELETE - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[DEBUG] Todo DELETE - Error response:', errorText);
      throw new Error(`Failed to delete todo: ${response.status} - ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 