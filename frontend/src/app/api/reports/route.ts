import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let body: any;
    
    // Handle both JSON and FormData
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        priority: formData.get('priority') || 'medium',
        location: formData.get('location'),
        date_occurred: formData.get('date_occurred'),
        witnesses: formData.get('witnesses'),
      };
    } else {
      body = await request.json();
    }
    
    // Forward to backend
    const response = await fetch(API_ENDPOINTS.reports, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to submit report' },
        { status: response.status }
      );
    }

    // Add reference number for frontend
    const result = {
      ...data,
      reference_number: data.report?.id || Date.now(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(API_ENDPOINTS.reports);
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch reports' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}