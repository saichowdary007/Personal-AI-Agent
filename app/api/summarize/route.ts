import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, options = {} } = await req.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Send to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    const response = await fetch(`${backendUrl}/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'summarize',
        content,
        parameters: {
          max_length: options.maxLength || 500,
          format: options.format || 'paragraph',
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend summarize error:', error);
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in summarize API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize text' },
      { status: 500 }
    );
  }
} 