import { NextRequest, NextResponse } from 'next/server';

interface SummarizeOptions {
  maxLength?: number;
  format?: string;
}

// Configure route options
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and TXT files are supported' },
        { status: 400 }
      );
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Get options if provided
    let options: SummarizeOptions = {};
    const optionsStr = formData.get('options') as string;
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {
        console.error('Failed to parse options', e);
      }
    }

    // Upload file to backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://personal-ai-agent-0wsk.onrender.com';
    
  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
    
    // Create a new FormData instance to send to backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    
    // Send file to backend
    const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: backendFormData,
      cache: 'no-store',
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const filename = uploadResult.filename;

    // Now request summarization with the uploaded file
    const response = await fetch(`${backendUrl}/assist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'summarize',
        parameters: {
          filename,
          max_length: options.maxLength || 500,
          format: options.format || 'paragraph',
        }
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
    console.error('Error in summarize file API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize file' },
      { status: 500 }
    );
  }
} 