import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    const response = await fetch(`${backendUrl}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json();
    
    if (!task || typeof task !== 'string' || !task.trim()) {
      return NextResponse.json(
        { error: 'Task content is required' },
        { status: 400 }
      );
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    const response = await fetch(`${backendUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ task: task.trim() }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create todo' },
      { status: 500 }
    );
  }
} 