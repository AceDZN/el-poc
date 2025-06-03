'use client';

import React, { useEffect, useState } from 'react';
import useWebRTCAudioSession from '@/hooks/use-webrtc';
import { tools } from '@/lib/tools';
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
// import { useDragGame } from '@/components/Tools/DragGame';

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState('ash');

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation,
    muteMic,
    unmuteMic,
    sendTextMessage,
  } = useWebRTCAudioSession(voice, [...tools]);

  // Get LessonWords hook
  const { LessonWordsComponent, presentLessonWords } = useLessonWords(sendTextMessage);

  // Get QuizGame hook
  const { QuizGameComponent, presentQuiz } = useQuizGame(sendTextMessage);

  // Get ClozeGame hook
  const { ClozeGameComponent, presentCloze } = useClozeGame(sendTextMessage);

  // Get PhotoQuiz hook
  const { PhotoQuizComponent, presentPhotoQuiz } = usePhotoQuiz(sendTextMessage);

  // Get DragTrueOrFalseGame hook
  const { DragTrueOrFalseGameComponent, presentDragTrueOrFalse } =
    useDragTrueOrFalseGame(sendTextMessage);

  // Get PresentWord hook
  const { PresentWordComponent, presentWord } = usePresentWord(sendTextMessage);

  // Get SentenceBuilder hook
  const { SentenceBuilderComponent, presentSentenceBuilder } = useSentenceBuilder(sendTextMessage);

  // Get CameraActivity hook
  const { CameraActivityComponent, presentCameraActivity } = useCameraActivity(sendTextMessage);

  // Get BadgeAward hook
  const { BadgeAwardComponent, presentBadgeAward } = useBadgeAward(sendTextMessage);

  // Get ReorderGame hook
  const { ReorderGameComponent, presentReorderGame } = useReorderGame(sendTextMessage);

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
    drag: {
      subject: 'Apple',
      words: [
        { word: 'Apples are fruits', isTrue: true },
        { word: 'Apples are blue', isTrue: false },
        { word: 'Apples grow on trees', isTrue: true },
        { word: 'Apples are vegetables', isTrue: false },
        { word: 'Apples can be red or green', isTrue: true },
      ],
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
      cameraInstructions: 'Take a photo of an apple that is red and round',
    },
    badgeAward: {
      lessonTitle: 'Apple Lesson',
      badgeTitle: 'Apple Expert',
      badgeDescription: 'You have learned all about apples!',
    },
    reorderGame: {
      subject: 'Apple',
      items: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango'],
    },
  };

  // Register tools only once on mount
  useEffect(() => {
    const functions = [
      {
        name: 'presentLessonWords',
        func: presentLessonWords,
      },
      {
        name: 'presentQuiz',
        func: presentQuiz,
      },
      {
        name: 'presentCloze',
        func: presentCloze,
      },
      {
        name: 'presentPhotoQuiz',
        func: presentPhotoQuiz,
      },
      {
        name: 'presentDragTrueOrFalse',
        func: presentDragTrueOrFalse,
      },
      {
        name: 'presentWord',
        func: presentWord,
      },
      {
        name: 'presentSentenceBuilder',
        func: presentSentenceBuilder,
      },
      {
        name: 'presentCameraActivity',
        func: presentCameraActivity,
      },
    ];

    // Register custom tools
    functions.forEach(({ name, func }) => {
      registerFunction(name, func);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  return (
    <div
      className={cn(
        'relative z-50 mx-auto grid h-full w-full min-w-[1000px] grid-rows-1 transition-all duration-500',
        // isInitialState ? 'grid-cols-[0%_100%]' :
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
        {/* {DragGameComponent} */}
      </div>

      <div className='container relative h-[100vh] w-full flex-col items-center justify-center lg:px-0'>
        <div className='flex h-full flex-col p-4 lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <BroadcastButton isSessionActive={isSessionActive} onClick={handleStartStopClick} />
            <PushToTalk
              isSessionActive={isSessionActive}
              onMouseDown={unmuteMic}
              onMouseUp={muteMic}
              onTouchStart={unmuteMic}
              onTouchEnd={muteMic}
            />

            <input type='text' onChange={e => sendTextMessage(e.target.value)} />

            <StatusDisplay status={status} />
            <TokenUsageDisplay msgs={msgs} />
            <MessageControls conversation={conversation} msgs={msgs} />
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
