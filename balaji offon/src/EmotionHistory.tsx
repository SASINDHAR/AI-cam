import React from 'react';
import { EmotionResults } from './types/emotion';
import { getEmotionEmoji } from './utils/emotionUtils';
import { History, Clock } from 'lucide-react';

interface EmotionHistoryProps {
  history: EmotionResults[];
}

const EmotionHistory: React.FC<EmotionHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <History className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Emotion History</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No emotion history yet</p>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <History className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Emotion History</h3>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.slice().reverse().map((item, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 bg-gray-50 rounded-md transition-all hover:bg-gray-100"
          >
            <div className="text-2xl mr-3">
              {getEmotionEmoji(item.dominantEmotion)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 capitalize">{item.dominantEmotion}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(item.timestamp)}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {Math.round(item.emotions[item.dominantEmotion] * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionHistory;