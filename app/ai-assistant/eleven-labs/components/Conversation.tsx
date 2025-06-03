'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Conversation as ElevenLabsConversation } from '@11labs/client';
import { useState, useEffect } from 'react';
import { LogPrint } from './LogPrint';
import { TinyTapDetails } from './TinyTapDetails';

export function Conversation() {
  const [conversation, setConversation] = useState<ElevenLabsConversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [logText, setLogText] = useState<string>('');
  const [showTinyTapDetails, setShowTinyTapDetails] = useState(false);
  const [transcript, setTranscript] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([]);

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
      const signedUrl = await getSignedUrl();
      const conversation = await ElevenLabsConversation.startSession({
        signedUrl: signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setIsSpeaking(true);
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSpeaking(false);
        },
        onError: error => {
          console.error(error);
          alert('An error occurred during the conversation');
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === 'speaking');
        },
        onMessage: (message: { message: string }) => {
          setTranscript(prev => [...prev, { role: 'assistant', content: message.message }]);
        },
        clientTools: {
          LogPrint: async ({ text }) => {
            setLogText(text);
            return 'Message logged successfully';
          },
          PrintTinyTapDetails: async () => {
            setShowTinyTapDetails(true);
            return 'TinyTap details displayed successfully';
          },
        },
      });
      setConversation(conversation);
    } catch (error) {
      console.error('conversation: Failed to start conversation:', error);
      alert('conversation: Failed to start conversation');
    }
  }

  async function endConversation() {
    if (!conversation) return;
    await conversation.endSession();
    setConversation(null);
  }

  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>
            {isConnected
              ? isSpeaking
                ? 'Agent is speaking'
                : 'Agent is listening'
              : 'Disconnected'}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex justify-center gap-4'>
            <Button
              variant='outline'
              className='rounded-full'
              size='lg'
              disabled={conversation !== null && isConnected}
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant='outline'
              className='rounded-full'
              size='lg'
              disabled={conversation === null && !isConnected}
              onClick={endConversation}
            >
              End conversation
            </Button>
          </div>

          <div className='mt-4 space-y-4'>
            {transcript.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 text-black ${
                  message.role === 'user' ? 'ml-auto bg-blue-300' : 'bg-gray-300'
                } max-w-[80%]`}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {logText && <LogPrint text={logText} />}
      {showTinyTapDetails && <TinyTapDetails />}
    </div>
  );
}
