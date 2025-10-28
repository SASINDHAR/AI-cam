import React, { useRef, useEffect, useState } from 'react';

interface WebcamCaptureProps {
  onWebcamReady: (video: HTMLVideoElement) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onWebcamReady
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setErrorMessage(null);
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
              onWebcamReady(videoRef.current);
            }
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
        
        if ((error as DOMException).name === 'NotAllowedError') {
          setErrorMessage('Camera access denied. Please enable camera permissions.');
        } else if ((error as DOMException).name === 'NotFoundError') {
          setErrorMessage('No camera detected on your device.');
        } else {
          setErrorMessage('Error accessing camera. Please try again.');
        }
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onWebcamReady]);

  if (hasPermission === false) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ position: 'fixed', top: '-9999px' }}
    />
  );
};

export default WebcamCapture;