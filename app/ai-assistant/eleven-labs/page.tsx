'use client';

import React, { useEffect, useState } from 'react';
import { Welcome } from '@/components/welcome';
import { VoiceSelector } from '@/components/voice-select';
import { BroadcastButton } from '@/components/broadcast-button';
import { StatusDisplay } from '@/components/status';
import { TokenUsageDisplay } from '@/components/token-usage';
import { MessageControls } from '@/components/message-controls';
import { ToolsEducation } from '@/components/tools-education';
import { PushToTalk } from '@/components/push-to-talk';
import { useLessonWords } from '@/components/Tools/LessonWords';
import { useQuizGame } from '@/components/Tools/QuizGame';
import { useClozeGame } from '@/components/Tools/ClozeGame';
import { usePhotoQuiz } from '@/components/Tools/PhotoQuiz';
import { motion } from 'framer-motion';
import { useToolsFunctions } from '@/hooks/use-tools';
import { cn } from '@/lib/utils';
import { DebugPanel } from '@/components/debug-panel';
import { useDragTrueOrFalseGame } from '@/components/Tools/DragTrueOrFalseGame';
import { usePresentWord } from '@/components/Tools/PresentWord';
import { useSentenceBuilder } from '@/components/Tools/SentenceBuilder';
import { useCameraActivity } from '@/components/Tools/CameraActivity';
import { useBadgeAward } from '@/components/Tools/BadgeAward';
import { useReorderGame } from '@/components/Tools/ReorderGame';
import { Conversation as ElevenLabsConversation } from '@11labs/client';
import { Conversation } from '@/lib/conversations';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState('ash');
  const [conversation, setConversation] = useState<ElevenLabsConversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [status, setStatus] = useState('');
  const [msgs, setMsgs] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<Conversation[]>([]);

  // Get all tool hooks
  const { LessonWordsComponent, presentLessonWords } = useLessonWords(sendTextMessage);
  const { QuizGameComponent, presentQuiz } = useQuizGame(sendTextMessage);
  const { ClozeGameComponent, presentCloze } = useClozeGame(sendTextMessage);
  const { PhotoQuizComponent, presentPhotoQuiz } = usePhotoQuiz(sendTextMessage);
  const { DragTrueOrFalseGameComponent, presentDragTrueOrFalse } =
    useDragTrueOrFalseGame(sendTextMessage);
  const { PresentWordComponent, presentWord } = usePresentWord(sendTextMessage);
  const { SentenceBuilderComponent, presentSentenceBuilder } = useSentenceBuilder(sendTextMessage);
  const { CameraActivityComponent, presentCameraActivity } = useCameraActivity(sendTextMessage);
  const { BadgeAwardComponent, presentBadgeAward } = useBadgeAward(sendTextMessage);
  const { ReorderGameComponent, presentReorderGame } = useReorderGame(sendTextMessage);

  // Map of activity types to their corresponding functions
  const activityHandlers = {
    presentLessonWords: presentLessonWords,
    presentQuiz: presentQuiz,
    presentCloze: presentCloze,
    presentPhotoQuiz: presentPhotoQuiz,
    presentDragTrueOrFalse: presentDragTrueOrFalse,
    presentWord: presentWord,
    presentSentenceBuilder: presentSentenceBuilder,
    presentCameraActivity: presentCameraActivity,
    presentBadgeAward: presentBadgeAward,
    presentReorderGame: presentReorderGame,
  };

  async function requestMicrophonePermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      console.error('Microphone permission denied');
      return false;
    }
  }

  async function getSignedUrl(): Promise<string> {
    const response = await fetch('/api/eleven-labs/signed-url');
    if (!response.ok) {
      throw Error('Failed to get signed url');
    }
    const data = await response.json();
    return data.signedUrl;
  }

  async function startConversation() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert('Microphone permission is required');
      return;
    }

    try {
      setStatus('Getting signed URL...');
      const signedUrl = await getSignedUrl();

      setStatus('Starting conversation...');
      const conversation = await ElevenLabsConversation.startSession({
        signedUrl: signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setStatus('Connected');
          conversation.setMicMuted(true);
          setIsMuted(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSpeaking(false);
          setStatus('Disconnected');
          setIsMuted(true);
        },
        onError: error => {
          console.error(error);
          setStatus('Error occurred');
          alert('An error occurred during the conversation');
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === 'speaking');
        },
        onMessage: (message: { message: string }) => {
          const newMessage: Conversation = {
            id: uuidv4(),
            role: 'assistant',
            text: message.message,
            timestamp: new Date().toISOString(),
            isFinal: true,
            status: 'final',
          };
          setTranscript(prev => [...prev, newMessage]);
        },
        clientTools: {
          LogPrint: async ({ text }) => {
            console.log(text);
            return 'Message logged successfully';
          },
          PrintTinyTapDetails: async () => {
            console.log('TinyTap details');
            return 'TinyTap details displayed successfully';
          },
          PresentLessonActivity: async ({ activity_type, activity_data }) => {
            try {
              const handler = activityHandlers[activity_type as keyof typeof activityHandlers];
              if (!handler) {
                throw new Error(`Unknown activity type: ${activity_type}`);
              }

              const parsedData = JSON.parse(activity_data);
              console.log('parsedData', parsedData);
              await handler(parsedData);
              return `Activity ${activity_type} presented successfully`;
            } catch (error) {
              console.error(`Error presenting activity ${activity_type}:`, error);
              throw error;
            }
          },
        },
      });
      setConversation(conversation);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setStatus('Failed to start conversation');
      alert('Failed to start conversation');
    }
  }

  async function endConversation() {
    if (!conversation) return;
    await conversation.endSession();
    setConversation(null);
    setIsConnected(false);
    setIsSpeaking(false);
    setStatus('Conversation ended');
  }

  function handlePushToTalkStart() {
    if (conversation && isConnected) {
      conversation.setMicMuted(false);
      setIsMuted(false);
      setIsSpeaking(true);
    }
  }

  function handlePushToTalkEnd() {
    if (conversation && isConnected) {
      conversation.setMicMuted(true);
      setIsMuted(true);
      setIsSpeaking(false);
    }
  }

  function sendTextMessage(message: string) {
    if (!conversation) return;

    const newMessage: Conversation = {
      id: uuidv4(),
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
      isFinal: true,
      status: 'final',
    };
    setTranscript(prev => [...prev, newMessage]);

    // Implement text message sending logic for ElevenLabs
    console.log('Sending text message:', message);
  }

  // Sample data for debug tools
  const sampleData = {
    lessonWords: ['apple', 'banana', 'orange', 'grape', 'mango'],
    quiz: {
      question: 'What color is an apple?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: 'Red',
    },
    cloze: {
      sentence: 'An ___ a day keeps the doctor away.',
      answer: 'apple',
      hint: "It's a red fruit",
    },
    photoQuiz: {
      question: 'Which of these is an apple?',
      options: [
        { text: 'Apple', imageSearchQuery: 'red apple fruit' },
        { text: 'Orange', imageSearchQuery: 'orange fruit' },
        { text: 'Banana', imageSearchQuery: 'yellow banana fruit' },
      ],
      correctAnswer: 'Apple',
    },
    dragTrueOrFalse: {
      statements: [
        { word: 'The sky is blue', isTrue: true },
        { word: 'The grass is purple', isTrue: false },
        { word: 'Water is wet', isTrue: true },
        { word: 'Cars can fly', isTrue: false },
        { word: 'Birds can sing', isTrue: true },
      ],
    },
    word: {
      word: 'Apple',
      definition: 'A round fruit with red or green skin and white flesh',
      examples: [
        'I eat an apple every morning for breakfast.',
        'The apple tree in our garden produces delicious fruit.',
        'She cut the apple into slices for the children.',
      ],
    },
    sentenceBuilder: {
      subject: 'Apple',
      correctSentence: 'An apple a day keeps the doctor away.',
      wordBank: ['apple', 'doctor', 'day', 'away'],
    },
    cameraActivity: {
      object: 'Apple',
      prompt: 'Take a photo of an apple',
      camera_instructions: 'Take a photo of an apple that is red and round',
    },
    badgeAward: {
      word: 'Apple',
      activitiesCompleted: 5,
      totalActivities: 5,
    },
    reorderGame: {
      text: 'An apple a day keeps the doctor away',
      type: 'sentence' as const,
    },
  };

  return (
    <div
      className={cn(
        'relative z-50 mx-auto grid h-full w-full min-w-[1000px] grid-rows-1 transition-all duration-500',
        'grid-cols-[70%_30%]'
      )}
    >
      <div>
        {LessonWordsComponent}
        {QuizGameComponent}
        {ClozeGameComponent}
        {PhotoQuizComponent}
        {DragTrueOrFalseGameComponent}
        {PresentWordComponent}
        {SentenceBuilderComponent}
        {CameraActivityComponent}
        {BadgeAwardComponent}
        {ReorderGameComponent}
      </div>

      <div className='container relative h-[100vh] w-full flex-col items-center justify-center lg:px-0'>
        <div className='flex h-full flex-col p-4 lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <BroadcastButton
              isSessionActive={isConnected}
              onClick={isConnected ? endConversation : startConversation}
            />
            <PushToTalk
              isSessionActive={isConnected}
              onMouseDown={handlePushToTalkStart}
              onMouseUp={handlePushToTalkEnd}
              onTouchStart={handlePushToTalkStart}
              onTouchEnd={handlePushToTalkEnd}
            />

            <input type='text' onChange={e => sendTextMessage(e.target.value)} />

            <StatusDisplay status={status} />
            <TokenUsageDisplay msgs={msgs} />
            <MessageControls conversation={transcript} msgs={msgs} />
          </div>
        </div>
      </div>

      <DebugPanel
        onPresentLessonWords={() => presentLessonWords({ words: sampleData.lessonWords })}
        onPresentQuiz={() => presentQuiz(sampleData.quiz)}
        onPresentCloze={() => presentCloze(sampleData.cloze)}
        onPresentPhotoQuiz={() => presentPhotoQuiz(sampleData.photoQuiz)}
        onPresentDragTrueOrFalse={() => presentDragTrueOrFalse(sampleData.dragTrueOrFalse)}
        onPresentWord={() => presentWord(sampleData.word)}
        onPresentSentenceBuilder={() => presentSentenceBuilder(sampleData.sentenceBuilder)}
        onPresentCameraActivity={() => presentCameraActivity(sampleData.cameraActivity)}
        onPresentBadgeAward={() => presentBadgeAward(sampleData.badgeAward)}
        onPresentReorderGame={() => presentReorderGame(sampleData.reorderGame)}
      />
    </div>
  );
};

export default App;
