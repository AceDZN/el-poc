import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveToolStore } from '@/store/activeToolStore';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface LessonWordsProps {
  words: string[];
  onClose: () => void;
  sendTextMessage: (message: string) => void;
}

export function LessonWords({ words, onClose, sendTextMessage }: LessonWordsProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'lessonWords';

  if (!isVisible || words.length === 0) return null;

  // Use either the props words or the last tool call words
  const displayWords = words;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className='inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      >
        <Card className='w-full max-w-lg' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Lesson Words</CardTitle>
            <CardDescription>Here are your lesson words for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {displayWords.map((word: string, index: number) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant='secondary' className='px-4 py-2 text-lg'>
                    {word}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useLessonWords(sendTextMessage: (message: string) => void) {
  const [words, setWords] = React.useState<string[]>([]);
  const { setActiveTool, closeActiveTool } = useActiveToolStore();

  const presentLessonWords = async (args: { words?: string[]; items?: string[] }) => {
    console.log('presentLessonWords', args);
    setWords(args.words || args.items || []);
    setActiveTool('lessonWords');
    sendTextMessage(
      'Lesson words presented successfully. You must read them to the user and ask them where they want to start.'
    );
  };

  const closeLessonWords = () => {
    closeActiveTool();
    setWords([]);
  };

  return {
    LessonWordsComponent: (
      <LessonWords words={words} onClose={closeLessonWords} sendTextMessage={sendTextMessage} />
    ),
    presentLessonWords,
  };
}
