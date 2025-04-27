import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Extract request details
    const { endpoint, method, body } = await req.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Set up headers for the backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    // Create the fetch options
    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers,
      cache: 'no-store',
    };
    
    // Add body for non-GET requests
    if (method && method !== 'GET' && body) {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Get the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
    // Make the request to the backend
    const response = await fetch(`${backendUrl}${endpoint}`, fetchOptions);
    
    // Get the response body
    const data = await response.json().catch(() => ({}));
    
    // Return the response with the same status code
    return NextResponse.json(
      data,
      { status: response.status }
    );
  } catch (error: any) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
} 