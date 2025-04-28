import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { input, sourceLang, targetLang } = await req.json();
    
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Send to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    const response = await fetch(`${backendUrl}/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'translate',
        content: input,
        parameters: {
          source_language: sourceLang || 'en',
          target_language: targetLang || 'es',
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend translate error:', error);
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      output: data.content,
      metadata: data.metadata
    });
  } catch (error: any) {
    console.error('Error in translate API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate text' },
      { status: 500 }
    );
  }
} 