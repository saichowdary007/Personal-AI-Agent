import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, token, body } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Set up headers for the backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request to the specified URL
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {}),
      cache: 'no-store',
    });
    
    console.log('Proxy test response status:', response.status);
    
    // Return the response with full details for debugging
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (e) {
      responseBody = { error: 'Could not parse response as JSON' };
    }
    
    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody
    });
  } catch (error: any) {
    console.error('Proxy test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 