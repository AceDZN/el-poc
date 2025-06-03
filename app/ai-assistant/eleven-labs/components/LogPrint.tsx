'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogPrintProps {
  text: string;
}

export function LogPrint({ text }: LogPrintProps) {
  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Agent Log</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className='whitespace-pre-wrap rounded-lg bg-gray-100 p-4 font-mono text-sm'>
          {text}
        </pre>
      </CardContent>
    </Card>
  );
}
