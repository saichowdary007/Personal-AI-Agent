import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Translate API route called');
    const { input, sourceLang, targetLang } = await req.json();
    console.log('Input length:', input?.length, 'sourceLang:', sourceLang, 'targetLang:', targetLang);
    
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'No text provided' },
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
      type: 'translate',
      content: input,
      parameters: {
        source_language: sourceLang || 'en',
        target_language: targetLang || 'es',
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
      console.error('Backend translate error:', error);
      throw new Error(`Backend error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    
    // Fallback for translator - temporary workaround
    if (!data.content || data.content === '') {
      return NextResponse.json({
        output: `[Translated from ${sourceLang} to ${targetLang}]: ${input}`,
        metadata: {
          source_language: sourceLang,
          target_language: targetLang,
          fallback: true
        }
      });
    }
    
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