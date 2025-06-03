import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/components/translations-context';

interface PushToTalkProps {
  isSessionActive: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

export function PushToTalk({
  isSessionActive,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}: PushToTalkProps) {
  const { t } = useTranslations();

  if (!isSessionActive) return null;

  return (
    <Button
      className='mx-auto mt-4 h-12 w-full max-w-sm text-lg font-semibold active:scale-95 active:border-gray-800 active:bg-gray-200 active:text-gray-800'
      variant='secondary'
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {t('broadcast.pushToTalk')}
    </Button>
  );
}
