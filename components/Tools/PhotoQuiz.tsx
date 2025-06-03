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
import Image from 'next/image';

interface PhotoOption {
  text: string;
  image: string | null;
  fallback_url?: string;
  imageSearchQuery: string;
}

interface PhotoQuizProps {
  question: string;
  options: PhotoOption[];
  correctAnswer: string;
  selectedAnswer: string | null;
  hasAnswered: boolean;
  setSelectedAnswer: (answer: string | null) => void;
  setHasAnswered: (value: boolean) => void;
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
}

export function PhotoQuiz({
  question,
  options,
  correctAnswer,
  selectedAnswer,
  hasAnswered,
  setSelectedAnswer,
  setHasAnswered,
  onClose,
  sendMessage,
}: PhotoQuizProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'photoQuiz';

  if (!isVisible) return null;

  const handleOptionClick = (option: PhotoOption) => {
    if (hasAnswered) return;

    setSelectedAnswer(option.text);
    setHasAnswered(true);
    const isCorrect = option.text === correctAnswer;
    const message = `The user selected "${option.text}" and is ${isCorrect ? 'correct' : 'incorrect'}!`;

    if (isCorrect) {
      toast.success('Correct! 🎉', {
        description: "Well done! That's the right answer.",
      });
    } else {
      toast.error('Not quite right!', {
        description: 'Try again! Look carefully at the images.',
      });
      // Reset after a delay to allow another try
      setTimeout(() => {
        setHasAnswered(false);
        setSelectedAnswer(null);
      }, 2000);
    }

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
        <Card className='w-full max-w-3xl' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Photo Quiz</CardTitle>
            <CardDescription>{question}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              {options.map((option: PhotoOption) => (
                <motion.div
                  key={option.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='relative'
                >
                  <Button
                    variant={
                      hasAnswered
                        ? option.text === correctAnswer
                          ? 'default'
                          : option.text === selectedAnswer
                            ? 'destructive'
                            : 'secondary'
                        : 'secondary'
                    }
                    className='h-full w-full overflow-hidden p-0'
                    onClick={() => handleOptionClick(option)}
                    disabled={hasAnswered && option.text === selectedAnswer}
                  >
                    {option.image ? (
                      <div className='relative aspect-square w-full'>
                        <Image
                          src={option.image}
                          alt={option.text}
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      </div>
                    ) : (
                      <div className='flex aspect-square w-full items-center justify-center bg-muted'>
                        Image not available
                      </div>
                    )}
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

export function usePhotoQuiz(sendMessage: (message: string) => void) {
  const [quizData, setQuizData] = React.useState<{
    question: string;
    options: PhotoOption[];
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

    registerResetCallback('photoQuiz', resetState);
    return () => unregisterResetCallback('photoQuiz');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentPhotoQuiz = async (args: {
    question: string;
    options: { text: string; imageSearchQuery: string }[];
    correctAnswer: string;
  }) => {
    try {
      // Process each option to get its image
      const processedOptions = await Promise.all(
        args.options.map(async opt => {
          try {
            const searchParams = new URLSearchParams({
              query: opt.imageSearchQuery,
              model: 'bing',
              aspect: 'All',
              image_type: 'Photo',
            });

            const response = await fetch(`/api/proxy-images?${searchParams}`, {
              headers: {
                'Content-Type': 'application/json',
                apiKey: 'ssss',
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data || !data.length) {
              return {
                text: opt.text,
                image: null,
                imageSearchQuery: opt.imageSearchQuery,
              };
            }

            const firstImage = data[0].image;
            return {
              text: opt.text,
              image: firstImage.s3url,
              fallback_url: firstImage.fallback_url,
              imageSearchQuery: opt.imageSearchQuery,
            };
          } catch (error) {
            console.error(`Failed to fetch image for option "${opt.text}":`, error);
            return {
              text: opt.text,
              image: null,
              imageSearchQuery: opt.imageSearchQuery,
            };
          }
        })
      );

      setQuizData({
        question: args.question,
        options: processedOptions,
        correctAnswer: args.correctAnswer,
      });
      setSelectedAnswer(null);
      setHasAnswered(false);
      setActiveTool('photoQuiz');
      sendMessage(
        'Photo quiz presented successfully. You must read the question and wait for the user to select an answer.'
      );

      return {
        success: true,
        message: 'Photo quiz presented successfully. Wait for the user to select an answer.',
      };
    } catch (error) {
      console.error('Failed to prepare photo quiz:', error);
      throw error;
    }
  };

  const closePhotoQuiz = () => {
    closeActiveTool();
  };

  return {
    PhotoQuizComponent: (
      <PhotoQuiz
        {...quizData}
        selectedAnswer={selectedAnswer}
        hasAnswered={hasAnswered}
        setSelectedAnswer={setSelectedAnswer}
        setHasAnswered={setHasAnswered}
        onClose={closePhotoQuiz}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
      />
    ),
    presentPhotoQuiz,
  };
}
