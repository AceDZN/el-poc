import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DebugPanelProps {
  onPresentLessonWords: () => void;
  onPresentQuiz: () => void;
  onPresentCloze: () => void;
  onPresentPhotoQuiz: () => void;
  onPresentDragTrueOrFalse: () => void;
  onPresentWord: () => void;
  onPresentSentenceBuilder: () => void;
  onPresentCameraActivity: () => void;
  onPresentBadgeAward: () => void;
  onPresentReorderGame: () => void;
}

export function DebugPanel({
  onPresentLessonWords,
  onPresentQuiz,
  onPresentCloze,
  onPresentPhotoQuiz,
  onPresentDragTrueOrFalse,
  onPresentWord,
  onPresentSentenceBuilder,
  onPresentCameraActivity,
  onPresentBadgeAward,
  onPresentReorderGame,
}: DebugPanelProps) {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <Card className='fixed bottom-4 left-4 z-50'>
      <CardHeader>
        <CardTitle className='text-sm'>Debug Tools</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-2'>
        <Button size='sm' variant='outline' onClick={() => onPresentLessonWords()}>
          Present Lesson Words
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentQuiz()}>
          Present Quiz
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentCloze()}>
          Present Cloze
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentPhotoQuiz()}>
          Present Photo Quiz
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentDragTrueOrFalse()}>
          Present Drag True/False
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentWord()}>
          Present Word
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentSentenceBuilder()}>
          Present Sentence Builder
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentCameraActivity()}>
          Present Camera Activity
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentBadgeAward()}>
          Present Badge Award
        </Button>
        <Button size='sm' variant='outline' onClick={() => onPresentReorderGame()}>
          Present Reorder Game
        </Button>
      </CardContent>
    </Card>
  );
}
