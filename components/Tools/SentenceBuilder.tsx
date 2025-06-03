import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, X, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentenceBuilderProps {
  subject: string;
  correctSentence: string;
  wordBank: string[];
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
  isCorrect: boolean | null;
  setIsCorrect: (isCorrect: boolean | null) => void;
  selectedWordIds: string[];
  setSelectedWordIds: (selectedWordIds: string[]) => void;
}

export function SentenceBuilder({
  subject,
  correctSentence,
  wordBank,
  onClose,
  sendMessage,
  // interruptTalking,
  isCorrect,
  setIsCorrect,
  selectedWordIds,
  setSelectedWordIds,
}: SentenceBuilderProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'sentenceBuilder';

  // Create word bank items with unique IDs
  const wordBankItems = React.useMemo(
    () => wordBank.map((word, index) => ({ id: `${word}-${index}`, value: word })),
    [wordBank]
  );

  // Get selected words from IDs
  const selectedWords = React.useMemo(
    () => selectedWordIds.map(id => wordBankItems.find(item => item.id === id)?.value || ''),
    [selectedWordIds, wordBankItems]
  );

  const handleWordClick = (wordId: string) => {
    setSelectedWordIds(prev => {
      const lastIndex = prev.lastIndexOf(wordId);
      if (lastIndex !== -1) {
        // If word exists, remove its last occurrence
        return [...prev.slice(0, lastIndex), ...prev.slice(lastIndex + 1)];
      } else {
        // If word doesn't exist, add it
        return [...prev, wordId];
      }
    });
    setIsCorrect(null);
  };

  const handleClear = () => {
    setSelectedWordIds([]);
    setIsCorrect(null);
  };

  const handleBackspace = () => {
    setSelectedWordIds(prev => prev.slice(0, -1));
    setIsCorrect(null);
  };

  const checkSentence = () => {
    // interruptTalking();
    const builtSentence = selectedWords.join(' ');

    const resolvedCorrectSentence = correctSentence.replace(/\.$/, '');

    const isMatch =
      builtSentence.toLowerCase().trim() === resolvedCorrectSentence.toLowerCase().trim();

    setIsCorrect(isMatch);

    if (isMatch) {
      toast.success('Correct! 🎉', {
        description: 'You built the sentence perfectly!',
      });
      sendMessage('The user has built the correct sentence!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      toast.error('Not quite right!', {
        description: 'Try building the sentence again.',
      });
      sendMessage('The user needs to try building the sentence again.');

      setTimeout(() => {
        setIsCorrect(null);
      }, 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className='inset-0 z-50 flex h-full items-center justify-center bg-black/50 p-4'
      >
        <Card className='w-full max-w-2xl' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>
              <span className='text-blue-500'>Build the Sentence:</span> "{correctSentence}"
            </CardTitle>
            <CardDescription>
              Click on words to build a sentence about: <span className='font-bold'>{subject}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Sentence Building Area */}
            <div
              className={cn(
                'min-h-24 rounded-lg border-2 p-4 text-lg text-black',
                isCorrect === true && 'border-green-500 bg-green-50',
                isCorrect === false && 'border-red-500 bg-red-50',
                isCorrect === null && 'border-blue-200 bg-blue-50'
              )}
            >
              {selectedWords.length > 0 ? (
                <motion.div
                  layout
                  className='flex flex-wrap gap-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedWords.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className='rounded bg-white px-2 py-1 font-medium shadow'
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              ) : (
                <p className='text-muted-foreground'>Click words below to build your sentence...</p>
              )}
            </div>

            {/* Word Bank */}
            <div className='space-y-4'>
              <div className='flex flex-wrap justify-center gap-2'>
                {wordBankItems.map(item => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleWordClick(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'rounded-lg px-4 py-2 text-lg font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                      selectedWordIds.includes(item.id)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white text-black hover:bg-blue-50',
                      isCorrect !== null && 'opacity-50'
                    )}
                    disabled={isCorrect !== null}
                  >
                    {item.value}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className='flex justify-center gap-4'>
              <Button
                variant='outline'
                onClick={handleBackspace}
                className='gap-2'
                disabled={selectedWords.length === 0 || isCorrect !== null}
              >
                <X className='h-4 w-4' />
                Backspace
              </Button>
              <Button
                variant='outline'
                onClick={handleClear}
                className='gap-2'
                disabled={selectedWords.length === 0 || isCorrect !== null}
              >
                <Eraser className='h-4 w-4' />
                Clear
              </Button>
              <Button
                onClick={checkSentence}
                className='gap-2'
                disabled={selectedWords.length === 0 || isCorrect === true}
              >
                <Check className='h-4 w-4' />
                Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useSentenceBuilder(
  sendMessage: (message: string) => void
  // interruptTalking: () => void
) {
  const [builderData, setBuilderData] = React.useState<{
    subject: string;
    correctSentence: string;
    wordBank: string[];
  }>({
    subject: '',
    correctSentence: '',
    wordBank: [],
  });

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [selectedWordIds, setSelectedWordIds] = React.useState<string[]>([]);

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setBuilderData({
        subject: '',
        correctSentence: '',
        wordBank: [],
      });
    };

    registerResetCallback('sentenceBuilder', resetState);
    return () => unregisterResetCallback('sentenceBuilder');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentSentenceBuilder = async (args: {
    subject: string;
    correctSentence: string;
    wordBank: string[];
  }) => {
    // Shuffle the word bank
    const shuffledWordBank = [...args.wordBank].sort(() => Math.random() - 0.5);
    setBuilderData({
      ...args,
      wordBank: shuffledWordBank,
    });
    setActiveTool('sentenceBuilder');
    sendMessage(
      `Sentence builder presented. Tell the user they have to build the sentence "${args.correctSentence}" using the words provided.`
    );
  };

  const closeSentenceBuilder = () => {
    closeActiveTool();
    setBuilderData({
      subject: '',
      correctSentence: '',
      wordBank: [],
    });
    setIsCorrect(null);
    setSelectedWordIds([]);
  };

  return {
    SentenceBuilderComponent: (
      <SentenceBuilder
        {...builderData}
        onClose={closeSentenceBuilder}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        selectedWordIds={selectedWordIds}
        setSelectedWordIds={setSelectedWordIds}
      />
    ),
    presentSentenceBuilder,
  };
}
