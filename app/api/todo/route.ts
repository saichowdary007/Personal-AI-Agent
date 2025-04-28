import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    console.log('[DEBUG] Todo GET - Auth header:', authHeader?.substring(0, 15) + '...');
    console.log('[DEBUG] Todo GET - Token present:', !!token);

    if (!token) {
      console.log('[DEBUG] Todo GET - Authentication failed: No token provided');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log(`[DEBUG] Todo GET - Making request to: ${backendUrl}/todos`);
    
    const response = await fetch(`${backendUrl}/todos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    console.log('[DEBUG] Todo GET - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[DEBUG] Todo GET - Error response:', errorText);
      throw new Error(`Failed to get todos: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Todo GET - Retrieved todos count:', data.length);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error getting todos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get todos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task } = body;
    
    console.log('[DEBUG] Todo POST - Request body:', JSON.stringify(body));
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    console.log(`[DEBUG] Todo POST - Using backend URL: ${backendUrl}`);

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    console.log('[DEBUG] Todo POST - Auth header:', authHeader?.substring(0, 15) + '...');
    console.log('[DEBUG] Todo POST - Token present:', !!token);
    console.log('[DEBUG] Todo POST - Task content:', task);

    if (!token) {
      console.log('[DEBUG] Todo POST - Authentication failed: No token provided');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!task || typeof task !== 'string' || task.trim() === '') {
      console.log('[DEBUG] Todo POST - Validation failed: Invalid task content');
      return NextResponse.json({ error: 'Task content is required' }, { status: 400 });
    }

    console.log(`[DEBUG] Todo POST - Making request to: ${backendUrl}/todos`);
    
    try {
      const response = await fetch(`${backendUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ task }),
        cache: 'no-store',
      });

      console.log('[DEBUG] Todo POST - Response status:', response.status);

      const responseBody = await response.text();
      console.log('[DEBUG] Todo POST - Response body:', responseBody);

      if (!response.ok) {
        console.log('[DEBUG] Todo POST - Error response:', responseBody);
        throw new Error(`Failed to create todo: ${response.status} - ${responseBody}`);
      }

      const data = responseBody ? JSON.parse(responseBody) : {};
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error('[DEBUG] Todo POST - Fetch error:', fetchError.message);
      throw new Error(`Error making request to backend: ${fetchError.message}`);
    }
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create todo' },
      { status: 500 }
    );
  }
} 