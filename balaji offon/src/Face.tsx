import React, { useState, useEffect, useCallback } from 'react';
import WebcamCapture2 from './web';
import EmotionDisplay from './EmotionDisplay';
import EmotionHistory from './EmotionHistory';
import { loadModels, detectEmotion } from './utils/emotionUtils';
import { EmotionResults } from './types/emotion';
import { Brain, Github, Info } from 'lucide-react';

const FaceReg: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResults | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResults[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  // Load models on component mount
  useEffect(() => {
    const initializeModels = async () => {
      setIsModelLoading(true);
      try {
        const success = await loadModels();
        setIsModelLoaded(success);
      } catch (error) {
        console.error('Failed to initialize models:', error);
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeModels();
  }, []);

  const handleWebcamReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
  }, []);

  const toggleDetection = useCallback(() => {
    setIsDetecting(prev => !prev);
    if (!isDetecting) {
      // Reset emotion data when turning on
      setCurrentEmotion(null);
    }
  }, [isDetecting]);

  // Start detection loop when video is ready and detection is enabled
  useEffect(() => {
    let animationFrameId: number;
    let lastDetectionTime = 0;
    const detectionInterval = 500; // Detect every 500ms

    const detectionLoop = async (timestamp: number) => {
      if (videoElement && isDetecting && isModelLoaded) {
        // Only run detection at certain intervals
        if (timestamp - lastDetectionTime >= detectionInterval) {
          const result = await detectEmotion(videoElement);

          if (result) {
            setCurrentEmotion(result);

            // Add to history if emotion changed or every 5 seconds
            const shouldAddToHistory =
              !currentEmotion ||
              currentEmotion.dominantEmotion !== result.dominantEmotion ||
              result.timestamp - (currentEmotion?.timestamp || 0) > 5000;

            if (shouldAddToHistory) {
              setEmotionHistory(prev => {
                // Keep last 20 entries
                const newHistory = [...prev, result];
                if (newHistory.length > 20) {
                  return newHistory.slice(newHistory.length - 20);
                }
                return newHistory;
              });
            }
          }

          lastDetectionTime = timestamp;
        }
      }

      animationFrameId = requestAnimationFrame(detectionLoop);
    };

    if (videoElement && isDetecting && isModelLoaded) {
      animationFrameId = requestAnimationFrame(detectionLoop);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [videoElement, isDetecting, isModelLoaded, currentEmotion]);

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>This application uses your webcam to detect facial expressions and identify emotions in real-time.</p>
                  <p className="mt-1">All processing happens locally in your browser - no data is sent to any server.</p>
                  <p className="mt-1">Click the camera button to start/stop emotion detection.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WebcamCapture2
              onWebcamReady={handleWebcamReady}
              isDetecting={isDetecting}
              onToggleDetection={toggleDetection}
            />

            <EmotionDisplay
              emotionData={currentEmotion}
              isDetecting={isDetecting}
              isLoading={isModelLoading}
            />
          </div>

          <div>
            <EmotionHistory history={emotionHistory} />
          </div>
        </div>
      </main>


    </div>
  );
};

export default FaceReg;