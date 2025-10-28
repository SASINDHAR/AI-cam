import React from 'react';
import { EmotionResults } from './types/emotion';
import { getEmotionColor, getEmotionEmoji, getEmotionDescription } from './utils/emotionUtils';
import { Smile, Camera, Loader } from 'lucide-react';

interface EmotionDisplayProps {
  emotionData: EmotionResults | null;
  isDetecting: boolean;
  isLoading: boolean;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotionData,
  isDetecting,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-8 text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl font-medium text-gray-700">Loading emotion detection models...</p>
        <p className="text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (!isDetecting) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-8 text-center">
        <Camera className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl font-medium text-gray-700">Camera is not active</p>
        <p className="text-gray-500 mt-2">Enable the camera to start emotion detection</p>
      </div>
    );
  }

  if (!emotionData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md p-8 text-center">
        <Smile className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl font-medium text-gray-700">No face detected</p>
        <p className="text-gray-500 mt-2">Position your face in front of the camera</p>
      </div>
    );
  }

  const { dominantEmotion, emotions } = emotionData;
  const emotionColor = getEmotionColor(dominantEmotion);
  const emotionEmoji = getEmotionEmoji(dominantEmotion);
  const emotionDescription = getEmotionDescription(dominantEmotion);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500"
      style={{ borderTop: `4px solid ${emotionColor}` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {dominantEmotion}
          </h2>
          <span className="text-4xl">{emotionEmoji}</span>
        </div>
        
        <p className="text-gray-600 mb-6">{emotionDescription}</p>
        
        <div className="space-y-3">
          {Object.entries(emotions).map(([emotion, probability]) => (
            <div key={emotion} className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                <span className="text-sm text-gray-500">{Math.round(probability * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.round(probability * 100)}%`,
                    backgroundColor: getEmotionColor(emotion as any)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionDisplay;