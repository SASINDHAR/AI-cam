import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Emotion type with emoji mapping
const EMOTION_EMOJIS: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    fear: '😨',
    disgust: '🤢',
};

// Sample history data - replace with your actual data source
const sampleHistory = [
    {
        id: 1,
        timestamp: new Date('2025-09-20T14:30:00'),
        emotion: 'happy',
        confidence: 0.92,
        image: '/sample1.jpg' // Replace with actual image paths
    },
    {
        id: 2,
        timestamp: new Date('2025-09-19T11:20:00'),
        emotion: 'neutral',
        confidence: 0.85,
        image: '/sample2.jpg'
    },
    {
        id: 3,
        timestamp: new Date('2025-09-18T16:45:00'),
        emotion: 'sad',
        confidence: 0.78,
        image: '/sample3.jpg'
    },
];

const History: React.FC = () => {
    const navigate = useNavigate();
    const [historyData] = useState(sampleHistory);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence > 0.8) return 'bg-green-100 text-green-800';
        if (confidence > 0.6) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detection History</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Review your past emotion detection results
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {historyData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {historyData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                                    onClick={() => setSelectedEmotion(item.emotion)}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                <span className="text-2xl">
                                                    {EMOTION_EMOJIS[item.emotion] || '❓'}
                                                </span>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                                        {item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1)}
                                                    </dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">
                                                            {formatDate(item.timestamp)}
                                                        </div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="relative pt-1">
                                                <div className="flex mb-2 items-center justify-between">
                                                    <div>
                                                        <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getConfidenceColor(item.confidence)}`}>
                                                            Confidence: {(item.confidence * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                                    <div
                                                        style={{ width: `${item.confidence * 100}%` }}
                                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${item.confidence > 0.8 ? 'bg-green-500' :
                                                            item.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No detections yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by detecting emotions from your webcam.
                        </p>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Start Detecting
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Emotion Detail Modal */}
            <AnimatePresence>
                {selectedEmotion && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div
                                    className="absolute inset-0 bg-gray-500 opacity-75"
                                    onClick={() => setSelectedEmotion(null)}
                                ></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <span className="text-xl">
                                                {EMOTION_EMOJIS[selectedEmotion] || '❓'}
                                            </span>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} Detected
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    This emotion was detected in one of your previous sessions.
                                                    You can view more details or take action based on this detection.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setSelectedEmotion(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </div >
  );
};

export default History;
