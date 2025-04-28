import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    messages: [
      { 
        id: "1", 
        role: "assistant", 
        content: "Hello! How can I help you today?" 
      }
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API route called');
    const { content } = await req.json();
    console.log('Chat content:', content);
    
    // Send to the backend FastAPI server
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8001";
    console.log('Using backend URL:', backendUrl);
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    console.log('Auth header exists:', !!authHeader, 'Token exists:', !!token);

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const requestBody = {
      type: "chat",
      content: content,
    };
    console.log('Sending to backend:', requestBody);

    const response = await fetch(`${backendUrl}/assist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to send message to backend: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Backend response data:', data);
    
    // Return the backend response
    return NextResponse.json({
      messages: [
        { 
          id: Date.now().toString(),
          role: "user", 
          content 
        },
        { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: data.content || "Sorry, I could not process your request." 
        }
      ]
    });
  } catch (error) {
    console.error("Error handling chat request:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
