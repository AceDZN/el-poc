import { NextResponse } from 'next/server';

export async function GET() {
  const agentId = 'pIoxHtD84aviMmoAuWqq';
  const apiKey = process.env.ELEVENLABS_API_KEY;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get signed URL');
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 });
  }
}
