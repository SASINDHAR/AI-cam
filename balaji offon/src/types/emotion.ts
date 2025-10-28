export type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'disgusted' | 'fearful' | 'neutral';

export interface EmotionData {
  emotion: Emotion;
  probability: number;
  timestamp: number;
}

export interface EmotionResults {
  dominantEmotion: Emotion;
  emotions: Record<Emotion, number>;
  timestamp: number;
}