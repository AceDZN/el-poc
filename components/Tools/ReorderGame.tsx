import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReorderGameProps {
  text: string;
  type: 'word' | 'sentence';
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
}

export function ReorderGame({
  text,
  type,
  onClose,
  sendMessage,
  // interruptTalking,
}: ReorderGameProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'reorderGame';

  // Split text into items (letters for word, words for sentence)
  const originalItems = React.useMemo(
    () =>
      (type === 'word' ? text.split('') : text.split(' ')).map((item, index) => ({
        id: `${item}-${index}`,
        value: item,
      })),
    [text, type]
  );

  // State for the current order of items
  const [items, setItems] = React.useState<Array<{ id: string; value: string }>>([]);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  // Shuffle the items
  const shuffleItems = React.useCallback(() => {
    const shuffled = [...originalItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setHasStarted(true);
    setIsCorrect(null);
  }, [originalItems]);

  // Initialize items on mount
  React.useEffect(() => {
    if (isVisible && !hasStarted) {
      shuffleItems();
    }
  }, [isVisible, hasStarted, shuffleItems]);

  const checkOrder = () => {
    // interruptTalking();
    const currentText = items.map(item => item.value).join(type === 'word' ? '' : ' ');
    const isOrderCorrect = currentText.toLowerCase().trim() === text.toLowerCase().trim();
    setIsCorrect(isOrderCorrect);

    if (isOrderCorrect) {
      toast.success('Correct! 🎉', {
        description: 'You arranged everything in the right order!',
      });
      sendMessage('The user has correctly arranged the ' + type + '!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      toast.error('Not quite right!', {
        description: 'Try rearranging the ' + (type === 'word' ? 'letters' : 'words') + ' again.',
      });
      sendMessage('The user needs to try again to arrange the ' + type + ' correctly.');
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
        <Card className='w-full max-w-lg' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Reorder {type === 'word' ? 'Letters' : 'Words'}</CardTitle>
            <CardDescription>
              Drag and drop the {type === 'word' ? 'letters' : 'words'} to put them in the correct
              order
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <Reorder.Group
              axis='x'
              values={items}
              onReorder={setItems}
              className='flex flex-row flex-wrap justify-center gap-2'
            >
              {items.map(item => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className='cursor-grab rounded-lg bg-white p-4 text-4xl text-black active:cursor-grabbing'
                >
                  {item.value}
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {/* <Reorder.Group
              axis='x'
              values={items}
              onReorder={setItems}
              className='flex flex-wrap justify-center gap-2'
            >
              {items.map(item => (
                <Reorder.Item
                  key={item + Math.random()} // Add random to handle duplicate letters/words
                  value={item}
                  className='cursor-grab active:cursor-grabbing'
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex min-h-12 min-w-12 items-center justify-center rounded-lg border-2 p-4 text-xl font-bold text-black shadow-lg',
                      isCorrect === true && 'border-green-500 bg-green-100',
                      isCorrect === false && 'border-red-500 bg-red-100',
                      isCorrect === null && 'border-blue-200 bg-blue-50'
                    )}
                  >
                    {item}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group> */}

            <div className='flex justify-center gap-4'>
              <Button
                variant='outline'
                onClick={shuffleItems}
                className='gap-2'
                disabled={isCorrect === true}
              >
                <Shuffle className='h-4 w-4' />
                Shuffle
              </Button>
              <Button onClick={checkOrder} className='gap-2' disabled={isCorrect === true}>
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

export function useReorderGame(
  sendMessage: (message: string) => void
  // interruptTalking: () => void
) {
  const [gameData, setGameData] = React.useState<{
    text: string;
    type: 'word' | 'sentence';
  }>({
    text: '',
    type: 'word',
  });

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setGameData({
        text: '',
        type: 'word',
      });
    };

    registerResetCallback('reorderGame', resetState);
    return () => unregisterResetCallback('reorderGame');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentReorderGame = async (args: { text: string; type: 'word' | 'sentence' }) => {
    setGameData(args);
    setActiveTool('reorderGame');
    sendMessage(
      `Reorder game presented. You must tell the user to drag and drop the ${
        args.type === 'word' ? 'letters' : 'words'
      } to put them in the correct order.`
    );
  };

  const closeReorderGame = () => {
    closeActiveTool();
  };

  return {
    ReorderGameComponent: (
      <ReorderGame
        {...gameData}
        onClose={closeReorderGame}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
      />
    ),
    presentReorderGame,
  };
}
