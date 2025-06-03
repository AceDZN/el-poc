import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <Link href='/ai-assistant'>
        <Button>Go to Ediie - AI Assistant</Button>
      </Link>
    </div>
  );
};

export default Page;
