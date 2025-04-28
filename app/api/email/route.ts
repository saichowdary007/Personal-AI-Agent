import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Email API route called');
    const { prompt, options = {} } = await req.json();
    console.log('Email prompt length:', prompt?.length, 'options:', options);
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'No prompt provided' },
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
    
    const requestBody = {
      type: 'email',
      content: prompt,
      parameters: {
        tone: options.tone || 'professional',
        format: options.format || 'full',
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
      console.error('Backend email error:', error);
      throw new Error(`Backend error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email' },
      { status: 500 }
    );
  }
} 