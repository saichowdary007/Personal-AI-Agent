import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Code API route called');
    const { code, language, mode } = await req.json();
    console.log('Code length:', code?.length, 'language:', language, 'mode:', mode);
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    console.log('Auth header exists:', !!authHeader, 'Token exists:', !!token);

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Send to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';
    console.log('Using backend URL:', backendUrl);
    
    // Determine the action based on mode
    const action = mode === 'generate' ? 'generate' : 'execute';
    
    const requestBody = {
      type: 'code',
      content: code,
      parameters: {
        language: language || 'python',
        action: action,
      },
    };
    console.log('Sending to backend:', requestBody);
    
    const response = await fetch(`${backendUrl}/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);
    if (!response.ok) {
      const error = await response.text();
      console.error('Backend code error:', error);
      throw new Error(`Backend error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json({
      output: data.content,
      metadata: data.metadata
    });
  } catch (error: any) {
    console.error('Error in code API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute code' },
      { status: 500 }
    );
  }
} 