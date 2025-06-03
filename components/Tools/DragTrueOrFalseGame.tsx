import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';

interface DragStatement {
  word: string;
  isTrue: boolean;
}

interface DragTrueOrFalseGameProps {
  statements: DragStatement[];
  currentStatements: DragStatement[];
  correctAnswers: number;
  isDragging: boolean;
  dragStartX: number;
  dragOffset: number;
  hasStarted: boolean;
  setCurrentStatements: React.Dispatch<React.SetStateAction<DragStatement[]>>;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setDragStartX: React.Dispatch<React.SetStateAction<number>>;
  setDragOffset: React.Dispatch<React.SetStateAction<number>>;
  setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  sendMessage: (message: string) => void;
}

export function DragTrueOrFalseGame({
  statements,
  currentStatements,
  correctAnswers,
  isDragging,
  dragStartX,
  dragOffset,
  hasStarted,
  setCurrentStatements,
  setCorrectAnswers,
  setIsDragging,
  setDragStartX,
  setDragOffset,
  setHasStarted,
  onClose,
  sendMessage,
}: DragTrueOrFalseGameProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'dragTrueOrFalse';
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cardRef.current) return;
      const offset = e.clientX - dragStartX;
      setDragOffset(offset);

      // Apply transform to card
      cardRef.current.style.transform = `translateX(${offset}px) rotate(${offset * 0.1}deg)`;

      // Change background color based on drag direction
      if (offset > 100) {
        cardRef.current.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green for true
      } else if (offset < -100) {
        cardRef.current.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; // Red for false
      } else {
        cardRef.current.style.backgroundColor = 'white';
      }
    };

    const handleMouseUp = () => {
      if (!isDragging || !cardRef.current) return;
      setIsDragging(false);

      // Check if dragged far enough to make a decision
      if (Math.abs(dragOffset) > 100) {
        const isAnswerTrue = dragOffset > 0;
        handleAnswer(isAnswerTrue);
      } else {
        // Reset card position if not dragged far enough
        cardRef.current.style.transform = '';
        cardRef.current.style.backgroundColor = 'white';
      }

      setDragOffset(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragOffset, setDragOffset, setIsDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setHasStarted(true);
    cardRef.current.style.cursor = 'grabbing';
  };

  const handleAnswer = (answer: boolean) => {
    const currentStatement = currentStatements[0];
    const isCorrect = answer === currentStatement.isTrue;
    let message = '';

    if (currentStatements[1]) {
      message = `Just read the next statement, don't say anything else.`;
    }

    if (isCorrect) {
      toast.success('Correct! 🎉', {
        description: "That's right!",
      });
      setCorrectAnswers((prev: number) => prev + 1);
    } else {
      toast.error('Not quite right!', {
        description: `This statement is ${currentStatement.isTrue ? 'true' : 'false'}!`,
      });
    }

    sendMessage(message);

    // Remove the current statement and move to next
    setCurrentStatements((prev: DragStatement[]) => prev.slice(1));

    // Reset card style
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.backgroundColor = 'white';
      cardRef.current.style.cursor = 'grab';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className='inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      >
        <Card className='w-full max-w-4xl' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>True or False</CardTitle>
            <CardDescription>Drag right for True, left for False</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='relative flex w-full items-center justify-around py-10'>
              <div className='text-2xl font-bold text-red-500'>FALSE</div>

              <div className='relative h-40 w-[400px]'>
                {currentStatements.length > 0 && (
                  <div
                    ref={cardRef}
                    onMouseDown={handleMouseDown}
                    className='absolute inset-0 cursor-grab rounded-xl bg-white p-6 shadow-lg transition-colors'
                  >
                    <p className='text-center text-lg text-black'>{currentStatements[0].word}</p>
                  </div>
                )}
              </div>

              <div className='text-2xl font-bold text-green-500'>TRUE</div>
            </div>

            <div className='mt-4 text-center text-sm text-gray-500'>
              {currentStatements.length > 0
                ? `${currentStatements.length} statements remaining`
                : `Game completed! You got ${correctAnswers} out of ${statements.length} correct!`}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useDragTrueOrFalseGame(sendMessage: (message: string) => void) {
  const [gameData, setGameData] = useState<{
    statements: DragStatement[];
  }>({
    statements: [],
  });

  const [currentStatements, setCurrentStatements] = useState<DragStatement[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setGameData({
        statements: [],
      });
      setCurrentStatements([]);
      setCorrectAnswers(0);
      setIsDragging(false);
      setDragStartX(0);
      setDragOffset(0);
      setHasStarted(false);
    };

    registerResetCallback('dragTrueOrFalse', resetState);
    return () => unregisterResetCallback('dragTrueOrFalse');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentDragTrueOrFalse = async (args: { statements: DragStatement[] }) => {
    setGameData(args);
    setCurrentStatements(args.statements);
    setCorrectAnswers(0);
    setIsDragging(false);
    setDragStartX(0);
    setDragOffset(0);
    setHasStarted(false);
    setActiveTool('dragTrueOrFalse');
    sendMessage(
      'True/False drag game presented. Drag statements right for True, left for False. You must not read all the statements.'
    );
  };

  const closeDragTrueOrFalse = () => {
    closeActiveTool();
  };

  return {
    DragTrueOrFalseGameComponent: (
      <DragTrueOrFalseGame
        {...gameData}
        currentStatements={currentStatements}
        correctAnswers={correctAnswers}
        isDragging={isDragging}
        dragStartX={dragStartX}
        dragOffset={dragOffset}
        hasStarted={hasStarted}
        setCurrentStatements={setCurrentStatements}
        setCorrectAnswers={setCorrectAnswers}
        setIsDragging={setIsDragging}
        setDragStartX={setDragStartX}
        setDragOffset={setDragOffset}
        setHasStarted={setHasStarted}
        onClose={closeDragTrueOrFalse}
        sendMessage={sendMessage}
      />
    ),
    presentDragTrueOrFalse,
  };
}
