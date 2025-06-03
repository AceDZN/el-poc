import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';

interface PresentWordProps {
  word: string;
  definition: string;
  examples: string[];
  onClose: () => void;
  sendMessage: (message: string) => void;
}

export function PresentWord({
  word,
  definition,
  examples,
  onClose,
  sendMessage,
}: PresentWordProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'presentWord';

  // React.useEffect(() => {
  //   if (isVisible) {
  //     // Send a message to the model to start talking about the word
  //     sendMessage(
  //       `Let me introduce you to the word "${word}". I'll explain what it means and how to use it.`
  //     );
  //   }
  // }, [isVisible, word, sendMessage]);

  if (!isVisible) return null;

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
            <CardTitle className='text-3xl font-bold'>{word}</CardTitle>
            <CardDescription>Let's learn about this word</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Definition</h3>
              <p className='text-muted-foreground'>{definition}</p>
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Examples</h3>
              <ul className='list-inside list-disc space-y-1'>
                {examples.map((example, index) => (
                  <li key={index} className='text-muted-foreground'>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function usePresentWord(sendMessage: (message: string) => void) {
  const [wordData, setWordData] = React.useState<{
    word: string;
    definition: string;
    examples: string[];
  }>({
    word: '',
    definition: '',
    examples: [],
  });

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setWordData({
        word: '',
        definition: '',
        examples: [],
      });
    };

    registerResetCallback('presentWord', resetState);
    return () => unregisterResetCallback('presentWord');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentWord = async (args: { word: string; definition: string; examples: string[] }) => {
    setWordData(args);
    setActiveTool('presentWord');
    sendMessage(
      `Let me introduce you to the word "${args.word}". I'll explain what it means and how to use it.`
    );
  };

  const closePresentWord = () => {
    closeActiveTool();
  };

  return {
    PresentWordComponent: (
      <PresentWord {...wordData} onClose={closePresentWord} sendMessage={sendMessage} />
    ),
    presentWord,
  };
}
