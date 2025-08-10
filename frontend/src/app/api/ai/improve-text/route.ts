import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api';

// Map general improve request to specific task type
function determineTaskType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('professional') || lowerPrompt.includes('formal')) {
    return 'make_professional';
  }
  if (lowerPrompt.includes('grammar') || lowerPrompt.includes('spelling')) {
    return 'fix_grammar';
  }
  if (lowerPrompt.includes('summary') || lowerPrompt.includes('summarize')) {
    return 'create_summary';
  }
  // Default to improve clarity
  return 'improve_clarity';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, prompt } = body;
    
    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    // Determine task type based on prompt
    const taskType = prompt ? determineTaskType(prompt) : 'improve_clarity';
    
    // Forward to backend AI assistant
    const response = await fetch(API_ENDPOINTS.aiAssist, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskType,
        text,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to improve text' },
        { status: response.status }
      );
    }

    // Return in the format the frontend expects
    return NextResponse.json({
      success: true,
      improvedText: data.improvedText,
      taskType: data.taskType,
      taskName: data.taskName,
    });
  } catch (error) {
    console.error('AI improve text error:', error);
    return NextResponse.json(
      { error: 'Failed to improve text. Please try again later.' },
      { status: 500 }
    );
  }
}