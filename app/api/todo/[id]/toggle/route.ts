import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { completed } = await req.json();
    
    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Completed status must be a boolean' },
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
    
    // Since the backend doesn't have a direct toggle endpoint,
    // we use a workaround by first getting the todo, then updating it
    const getResponse = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch todo: ${getResponse.status}`);
    }

    const todo = await getResponse.json();
    
    // Update the todo with the toggled status
    const updateResponse = await fetch(`${backendUrl}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        task: todo.text,
        completed: completed
      }),
      cache: 'no-store',
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to toggle todo: ${updateResponse.status}`);
    }

    const data = await updateResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error toggling todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle todo' },
      { status: 500 }
    );
  }
} 