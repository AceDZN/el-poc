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
import { motion, AnimatePresence } from 'framer-motion';

import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';

interface QuizGameProps {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  hasAnswered: boolean;
  setSelectedAnswer: (answer: string | null) => void;
  setHasAnswered: (value: boolean) => void;
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
}

export function QuizGame({
  question,
  options,
  correctAnswer,
  selectedAnswer,
  hasAnswered,
  setSelectedAnswer,
  setHasAnswered,
  onClose,
  sendMessage,
  // interruptTalking,
}: QuizGameProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'quiz';

  if (!isVisible) return null;

  const handleAnswerClick = (option: string) => {
    if (hasAnswered) return;

    // interruptTalking();
    setSelectedAnswer(option);
    setHasAnswered(true);

    const message = `The user answered ${option} and is ${option === correctAnswer ? 'correct' : 'incorrect'}!`;

    if (option === correctAnswer) {
      toast.success('Correct! 🎉', {
        description: "Well done! That's the right answer.",
      });
    } else {
      toast.error('Not quite right!', {
        description: `The correct answer was: ${correctAnswer}`,
      });
    }

    console.log('handleAnswerClick - message', message);
    sendMessage(message);
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
            <CardTitle>Quiz Time!</CardTitle>
            <CardDescription>Test your knowledge</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='mb-4 text-lg font-medium'>{question}</div>
            <div className='grid grid-cols-1 gap-3'>
              {options.map((option: string) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Button
                    className='h-auto w-full justify-start px-6 py-4 text-left'
                    variant={
                      hasAnswered
                        ? option === correctAnswer
                          ? 'default'
                          : option === selectedAnswer
                            ? 'destructive'
                            : 'secondary'
                        : 'secondary'
                    }
                    onClick={() => handleAnswerClick(option)}
                    disabled={hasAnswered}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useQuizGame(sendMessage: (message: string) => void) {
  const [quizData, setQuizData] = React.useState<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>({
    question: '',
    options: [],
    correctAnswer: '',
  });

  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = React.useState(false);

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setQuizData({
        question: '',
        options: [],
        correctAnswer: '',
      });
      setSelectedAnswer(null);
      setHasAnswered(false);
    };

    registerResetCallback('quiz', resetState);
    return () => unregisterResetCallback('quiz');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentQuiz = async (args: {
    question: string;
    options: string[];
    correctAnswer: string;
  }) => {
    setQuizData(args);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setActiveTool('quiz');
    sendMessage(
      'Quiz game presented successfully. You must read the question and the answers and wait for the user to answer.'
    );
  };

  const closeQuiz = () => {
    closeActiveTool();
  };

  return {
    QuizGameComponent: (
      <QuizGame
        {...quizData}
        selectedAnswer={selectedAnswer}
        hasAnswered={hasAnswered}
        setSelectedAnswer={setSelectedAnswer}
        setHasAnswered={setHasAnswered}
        onClose={closeQuiz}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
      />
    ),
    presentQuiz,
  };
}
