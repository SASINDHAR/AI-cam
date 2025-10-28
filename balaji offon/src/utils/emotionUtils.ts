import * as faceapi from 'face-api.js';
import { Emotion, EmotionResults } from '../types/emotion';

// Load models
export const loadModels = async () => {
  try {
    // First ensure the models directory exists
    await fetch('/models', { method: 'HEAD' }).catch(() => {
      console.log('Creating models directory...');
    });

    // Define model URLs - using Microsoft's CDN where the models are hosted
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    return true;
  } catch (error) {
    console.error('Error loading models:', error);
    return false;
  }
};

// Map face-api expressions to our emotion types
const mapExpressionToEmotion = (expressions: faceapi.FaceExpressions): EmotionResults => {
  const emotionMap: Record<string, Emotion> = {
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    fearful: 'fearful',
    disgusted: 'disgusted',
    surprised: 'surprised',
    neutral: 'neutral'
  };

  // Convert expressions to our emotion format
  const emotions = Object.entries(expressions).reduce((acc, [key, value]) => {
    const emotion = emotionMap[key] as Emotion;
    if (emotion) {
      acc[emotion] = value;
    }
    return acc;
  }, {} as Record<Emotion, number>);

  // Find dominant emotion
  let dominantEmotion: Emotion = 'neutral';
  let maxProb = 0;

  Object.entries(emotions).forEach(([emotion, probability]) => {
    if (probability > maxProb) {
      maxProb = probability;
      dominantEmotion = emotion as Emotion;
    }
  });

  return {
    dominantEmotion,
    emotions,
    timestamp: Date.now()
  };
};

// Detect emotions from a video element
export const detectEmotion = async (
  videoElement: HTMLVideoElement
): Promise<EmotionResults | null> => {
  if (!videoElement || videoElement.paused || videoElement.ended) {
    return null;
  }

  try {
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      return null;
    }

    // Use the first detected face
    const expressions = detections[0].expressions;
    return mapExpressionToEmotion(expressions);
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
};

// Get color for emotion
export const getEmotionColor = (emotion: Emotion): string => {
  const colors: Record<Emotion, string> = {
    happy: '#FFD700', // Gold
    sad: '#6495ED', // Blue
    angry: '#DC143C', // Crimson
    surprised: '#9370DB', // Purple
    disgusted: '#32CD32', // Green
    fearful: '#FF8C00', // Orange
    neutral: '#708090' // Slate Gray
  };
  
  return colors[emotion] || colors.neutral;
};

// Get emoji for emotion
export const getEmotionEmoji = (emotion: Emotion): string => {
  const emojis: Record<Emotion, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😡',
    surprised: '😲',
    disgusted: '🤢',
    fearful: '😨',
    neutral: '😐'
  };
  
  return emojis[emotion] || emojis.neutral;
};

// Get description for emotion
export const getEmotionDescription = (emotion: Emotion): string => {
  const descriptions: Record<Emotion, string> = {
    happy: 'You seem to be in a good mood!',
    sad: 'You look a bit down. Hope things get better!',
    angry: 'You appear to be upset about something.',
    surprised: 'Something seems to have caught you off guard!',
    disgusted: 'You don\'t seem pleased with what you\'re seeing.',
    fearful: 'You seem concerned or worried about something.',
    neutral: 'Your expression is calm and neutral.'
  };
  
  return descriptions[emotion] || descriptions.neutral;
};