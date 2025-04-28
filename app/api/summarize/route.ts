import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Summarize API route called');
    const { content, options = {} } = await req.json();
    console.log('Summarize content length:', content?.length, 'options:', options);
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'No content provided' },
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

    // Send to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';
    console.log('Using backend URL:', backendUrl);
    
    const requestBody = {
      type: 'summarize',
      content,
      parameters: {
        max_length: options.maxLength || 500,
        format: options.format || 'paragraph',
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
      console.error('Backend summarize error:', error);
      throw new Error(`Backend error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in summarize API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize text' },
      { status: 500 }
    );
  }
} 