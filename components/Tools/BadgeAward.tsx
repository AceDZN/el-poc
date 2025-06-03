import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';
import { Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface BadgeAwardProps {
  word: string;
  activitiesCompleted: number;
  totalActivities: number;
  onClose: () => void;
  sendMessage: (message: string) => void;
  // interruptTalking: () => void;
}

export function BadgeAward({
  word,
  activitiesCompleted,
  totalActivities,
  onClose,
  sendMessage,
  // interruptTalking,
}: BadgeAwardProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'badgeAward';

  React.useEffect(() => {
    if (isVisible) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isVisible]);

  const handleContinue = () => {
    // interruptTalking();
    sendMessage('The user has received their badge and is ready to continue with the next word.');
    onClose();
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
        <Card className='w-full max-w-lg text-center' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle className='flex items-center justify-center gap-2 text-2xl'>
              <Award className='h-8 w-8 text-yellow-500' />
              Congratulations!
              <Award className='h-8 w-8 text-yellow-500' />
            </CardTitle>
            <CardDescription className='text-lg'>
              You've earned a badge for mastering the word:
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='relative mx-auto w-32'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className='flex aspect-square items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg'
              >
                <Star className='h-12 w-12 text-white' />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='mt-4 text-xl font-bold'
              >
                {word}
              </motion.div>
            </div>

            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Activities completed: {activitiesCompleted}/{totalActivities}
              </p>
              <div className='mx-auto h-2 w-48 overflow-hidden rounded-full bg-muted'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(activitiesCompleted / totalActivities) * 100}%` }}
                  transition={{ delay: 0.2 }}
                  className='h-full bg-yellow-500'
                />
              </div>
            </div>

            <Button onClick={handleContinue} className='gap-2'>
              <Star className='h-4 w-4' />
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useBadgeAward(
  sendMessage: (message: string) => void
  // interruptTalking: () => void
) {
  const [badgeData, setBadgeData] = React.useState<{
    word: string;
    activitiesCompleted: number;
    totalActivities: number;
  }>({
    word: '',
    activitiesCompleted: 0,
    totalActivities: 0,
  });

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setBadgeData({
        word: '',
        activitiesCompleted: 0,
        totalActivities: 0,
      });
    };

    registerResetCallback('badgeAward', resetState);
    return () => unregisterResetCallback('badgeAward');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentBadgeAward = async (args: {
    word: string;
    activitiesCompleted: number;
    totalActivities: number;
  }) => {
    setBadgeData(args);
    setActiveTool('badgeAward');
    sendMessage(
      "Congratulations! You've earned a badge for completing activities with this word. Let's celebrate your achievement!"
    );
  };

  const closeBadgeAward = () => {
    closeActiveTool();
  };

  return {
    BadgeAwardComponent: (
      <BadgeAward
        {...badgeData}
        onClose={closeBadgeAward}
        sendMessage={sendMessage}
        // interruptTalking={interruptTalking}
      />
    ),
    presentBadgeAward,
  };
}
