
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamCaptureProps {
  onWebcamReady: (video: HTMLVideoElement) => void;
  isDetecting: boolean;
  onToggleDetection: () => void;
}

const WebcamCapture2: React.FC<WebcamCaptureProps> = ({
  onWebcamReady,
  isDetecting,
  onToggleDetection
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
          
          // Notify parent when video is ready
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
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

    if (isDetecting) {
      setupCamera();
    }

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isDetecting, onWebcamReady]);

  return (
    <div className="relative">
      <div className={`rounded-lg overflow-hidden bg-gray-100 ${!isDetecting ? 'hidden' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto object-cover"
          style={{ transform: 'scaleX(-1)' }} // Mirror the video
        />
      </div>
      
      {!isDetecting && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <CameraOff className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500">Camera is turned off</p>
        </div>
      )}
      
      {hasPermission === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
          <div className="text-center text-white p-4">
            <p className="font-medium mb-2">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={onToggleDetection}
        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
          isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isDetecting ? 'Turn off camera' : 'Turn on camera'}
      >
        {isDetecting ? (
          <CameraOff className="w-5 h-5 text-white" />
        ) : (
          <Camera className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};

export default WebcamCapture2;