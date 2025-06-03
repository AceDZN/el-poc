export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest) {
  try {
    // Get the URL parameters
    const searchParams = req.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())
    // Make the request to langchain server

    const response = await fetch(
      'https://langchain.tinytap.it/get_images',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
                apiKey: '1234567asdfgh'

        },
        body: JSON.stringify(params),
      },
    )
    // Return the response data
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images from langchain server' },
      { status: 500 },
    )
  }
}
