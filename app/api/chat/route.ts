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
    const { content } = await req.json();
    
    // Send to the backend FastAPI server
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://personal-ai-agent-0wsk.onrender.com";
    
    // Get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/assist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "chat",
        content: content,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to send message to backend: ${response.status}`);
    }
    
    const data = await response.json();
    
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
