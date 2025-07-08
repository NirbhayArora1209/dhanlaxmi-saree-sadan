import { NextResponse } from 'next/server';

export async function DELETE(): Promise<Response> {
  return NextResponse.json({ success: true });
} 