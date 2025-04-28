import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { completed } = await req.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    console.log('[DEBUG] Todo Toggle PUT - Auth header:', authHeader?.substring(0, 15) + '...');
    console.log('[DEBUG] Todo Toggle PUT - Token present:', !!token);
    console.log('[DEBUG] Todo Toggle PUT - Todo ID:', id);
    console.log('[DEBUG] Todo Toggle PUT - Completed value:', completed);

    if (!token) {
      console.log('[DEBUG] Todo Toggle PUT - Authentication failed: No token provided');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (typeof completed !== 'boolean') {
      console.log('[DEBUG] Todo Toggle PUT - Validation failed: Invalid completed value', typeof completed);
      return NextResponse.json(
        { error: 'Completed must be a boolean' },
        { status: 400 }
      );
    }

    console.log(`[DEBUG] Todo Toggle PUT - Making request to: ${backendUrl}/todos/${id}/toggle`);

    const response = await fetch(`${backendUrl}/todos/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
      cache: 'no-store',
    });

    console.log('[DEBUG] Todo Toggle PUT - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[DEBUG] Todo Toggle PUT - Error response:', errorText);
      throw new Error(`Failed to toggle todo: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error toggling todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle todo' },
      { status: 500 }
    );
  }
} 