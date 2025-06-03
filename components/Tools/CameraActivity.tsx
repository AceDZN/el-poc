import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveToolStore } from '@/store/activeToolStore';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraActivityProps {
  object: string;
  prompt: string;
  camera_instructions: string;
  onClose: () => void;
  sendMessage: (message: string) => void;
}

export function CameraActivity({
  object,
  prompt,
  camera_instructions,
  onClose,
  sendMessage,
}: CameraActivityProps) {
  const { activeTool } = useActiveToolStore();
  const isVisible = activeTool === 'cameraActivity';
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied', {
        description: 'Please allow camera access to continue',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const checkImage = async (imageData: string) => {
    try {
      setIsChecking(true);
      const res = await fetch('https://langchain.tinytap.it/image_detection/', {
        method: 'POST',
        body: JSON.stringify({
          image_data: imageData,
          prompt: camera_instructions,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to validate image');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg');
        setPhoto(photoData);
        stopCamera();

        // Check the image
        const imageToCheck = photoData?.replace('data:image/jpeg;base64,', '');
        const response = await checkImage(imageToCheck);
        console.log('response', response);
        setIsValid(response.answer);

        console.log('isValidImage', response.answer, typeof response.answer);
        if (response.answer) {
          toast.success('Great photo!', {
            description:
              'The photo matches the requirements. You can submit it or take another one.',
          });
          sendMessage('The user has taken a valid photo that matches the requirements.');
        } else {
          toast.error('Photo needs improvement', {
            description: "The photo doesn't quite match what we're looking for. Please try again.",
          });
          sendMessage("The user's photo doesn't match the requirements. They should try again.");
        }
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setIsValid(null);
    startCamera();
  };

  const submitPhoto = () => {
    if (!isValid) {
      toast.error('Invalid photo', {
        description: 'Please take a new photo that matches the requirements.',
      });

      setTimeout(() => {
        setIsValid(null);
      }, 2000);
      return;
    }

    // interruptTalking();
    toast.success('Photo submitted!', {
      description: "Great job! Let's continue with the lesson.",
    });
    sendMessage('The user has submitted their photo. You can continue with the lesson.');
    onClose();
  };

  React.useEffect(() => {
    if (isVisible) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn('inset-0 z-50 flex h-full items-center justify-center bg-black/50 p-4', {
          'bg-black/50': !photo,
          'bg-green-500': isValid,
          'bg-red-500': isValid === false,
        })}
      >
        <Card className='w-full max-w-lg' onClick={e => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Camera Activity</CardTitle>
            <CardDescription>{prompt}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='relative aspect-video w-full overflow-hidden rounded-lg bg-muted'>
              {/* {!photo && stream && ( */}
              <video ref={videoRef} autoPlay playsInline className='h-full w-full object-cover' />
              {/* )} */}
              {photo && <img src={photo} alt='Captured' className='h-full w-full object-cover' />}
              <canvas ref={canvasRef} className='hidden' />
            </div>

            <div className='flex justify-center gap-4'>
              {!photo && stream && (
                <Button onClick={takePhoto} className='gap-2' disabled={isChecking}>
                  <Camera className='h-4 w-4' />
                  Take Photo
                </Button>
              )}
              {photo && (
                <>
                  <Button variant='outline' onClick={retakePhoto} disabled={isChecking}>
                    Retake
                  </Button>
                  <Button onClick={submitPhoto} disabled={isChecking || !isValid} className='gap-2'>
                    {isChecking ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Submit'}
                  </Button>
                </>
              )}
            </div>

            <div className='space-y-2 text-sm text-muted-foreground'>
              <p className='font-medium'>Instructions:</p>
              <p>{camera_instructions}</p>
              {isChecking && <p className='text-blue-500'>Checking your photo...</p>}
              {isValid === false && (
                <p className='text-red-500'>
                  Your photo doesn't match the requirements. Please try again.
                </p>
              )}
              {isValid === true && (
                <p className='text-green-500'>Perfect! Your photo matches the requirements.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export function useCameraActivity(sendMessage: (message: string) => void) {
  const [cameraData, setCameraData] = React.useState<{
    object: string;
    prompt: string;
    camera_instructions: string;
  }>({
    object: '',
    prompt: '',
    camera_instructions: '',
  });

  const { setActiveTool, closeActiveTool, registerResetCallback, unregisterResetCallback } =
    useActiveToolStore();

  // Register reset callback
  React.useEffect(() => {
    const resetState = () => {
      setCameraData({
        object: '',
        prompt: '',
        camera_instructions: '',
      });
    };

    registerResetCallback('cameraActivity', resetState);
    return () => unregisterResetCallback('cameraActivity');
  }, [registerResetCallback, unregisterResetCallback]);

  const presentCameraActivity = async (args: {
    object: string;
    prompt: string;
    camera_instructions: string;
  }) => {
    setCameraData(args);
    setActiveTool('cameraActivity');
    sendMessage(
      'Camera activity presented. You must wait for the user to take and submit a photo before continuing with the lesson.'
    );
  };

  const closeCameraActivity = () => {
    closeActiveTool();
  };

  return {
    CameraActivityComponent: (
      <CameraActivity {...cameraData} onClose={closeCameraActivity} sendMessage={sendMessage} />
    ),
    presentCameraActivity,
  };
}
