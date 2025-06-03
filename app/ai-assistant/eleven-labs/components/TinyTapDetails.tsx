'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TinyTapDetails() {
  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>TinyTap Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h3 className='mb-2 font-semibold text-blue-900'>About TinyTap</h3>
            <p className='text-blue-800'>
              TinyTap is an educational technology platform that enables teachers and content
              creators to create interactive educational games and activities. It's designed to make
              learning engaging and fun for students of all ages.
            </p>
          </div>

          <div className='rounded-lg bg-green-50 p-4'>
            <h3 className='mb-2 font-semibold text-green-900'>Key Features</h3>
            <ul className='list-inside list-disc space-y-1 text-green-800'>
              <li>Interactive game creation</li>
              <li>Educational content library</li>
              <li>Progress tracking</li>
              <li>Multi-platform support</li>
              <li>Collaborative learning tools</li>
            </ul>
          </div>

          <div className='rounded-lg bg-purple-50 p-4'>
            <h3 className='mb-2 font-semibold text-purple-900'>Platform Statistics</h3>
            <ul className='list-inside list-disc space-y-1 text-purple-800'>
              <li>Over 150,000+ educational games</li>
              <li>Available in 20+ languages</li>
              <li>Used by 100,000+ teachers</li>
              <li>Millions of students worldwide</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
