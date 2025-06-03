import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';

interface ClozeGameProps {
  sentence: string;
  answer: string;
  hint?: string;
  userAnswer: string;
  hasAnswered: boolean;
  setUserAnswer: (answer: string) => void;
  setHasAnswered: (value: boolean) => void;
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
}

export function ClozeGame({
  sentence,
  answer,
  hint,
  userAnswer,
  hasAnswered,
  setUserAnswer,
  setHasAnswered,
  onClose,
  sendMessage,
  // interruptTalking,
}: ClozeGameProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'cloze';

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnswered) return;

    // interruptTalking();
    setHasAnswered(true);
    const isCorrect = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
    const message = `The user answered "${userAnswer}" and is ${isCorrect ? 'correct' : 'incorrect'}! The correct answer was "${answer}".`;

    if (isCorrect) {
      toast.success('Correct! 🎉', {
        description: "Well done! That's the right answer.",
      });
    } else {
      toast.error('Not quite right!', {
        description: `The correct answer was: ${answer}`,
      });
    }

    sendMessage(message);
  };

  const renderSentenceWithInput = () => {
    const parts = sentence.split('___');
    if (parts.length < 2) return sentence;

    return (
      <>
        {parts[0]}
        <Input
          type='text'
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          disabled={hasAnswered}
          className='mx-2 inline-block w-32'
          placeholder='Type your answer'
        />
        {parts[1]}
      </>
    );
  };

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
            <CardTitle>Fill in the Blank</CardTitle>
            <CardDescription>Complete the sentence with the correct word</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='text-lg font-medium'>{renderSentenceWithInput()}</div>
              {hint && <div className='text-sm text-muted-foreground'>💡 Hint: {hint}</div>}
              <Button type='submit' className='w-full' disabled={hasAnswered || !userAnswer.trim()}>
                Check Answer
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useClozeGame(sendMessage: (message: string) => void) {
  const [clozeData, setClozeData] = React.useState<{
    sentence: string;
    answer: string;
    hint?: string;
  }>({
    sentence: '',
    answer: '',
    hint: '',
  });

  const [userAnswer, setUserAnswer] = React.useState('');
  const [hasAnswered, setHasAnswered] = React.useState(false);

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setClozeData({
        sentence: '',
        answer: '',
        hint: '',
      });
      setUserAnswer('');
      setHasAnswered(false);
    };

    registerResetCallback('cloze', resetState);
    return () => unregisterResetCallback('cloze');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentCloze = async (args: { sentence: string; answer: string; hint?: string }) => {
    setClozeData(args);
    setUserAnswer('');
    setHasAnswered(false);
    setActiveTool('cloze');
    sendMessage(
      'Fill in the blank exercise presented successfully. You must read the sentence and wait for the user to type their answer.'
    );
  };

  const closeCloze = () => {
    closeActiveTool();
  };

  return {
    ClozeGameComponent: (
      <ClozeGame
        {...clozeData}
        userAnswer={userAnswer}
        hasAnswered={hasAnswered}
        setUserAnswer={setUserAnswer}
        setHasAnswered={setHasAnswered}
        onClose={closeCloze}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
      />
    ),
    presentCloze,
  };
}
