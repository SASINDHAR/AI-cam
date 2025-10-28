import { VoiceCommand } from '../types/voice';

export function matchVoiceCommand(transcript: string, commands: VoiceCommand[]): VoiceCommand | null {
  const normalizedTranscript = transcript.toLowerCase().trim();
  
  for (const command of commands) {
    if (command.matchPattern.test(normalizedTranscript)) {
      return command;
    }
  }
  
  return null;
}

export function createMatchPattern(phrases: string[]): RegExp {
  const escapedPhrases = phrases.map(phrase => 
    phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  const pattern = `\\b(${escapedPhrases.join('|')})\\b`;
  return new RegExp(pattern, 'i');
}

export const sampleNavigationCommands = [
  { command: 'go to home', action: () => {}, matchPattern: /\b(go to home|navigate to home|open home)\b/i },
  { command: 'go to about', action: () => {}, matchPattern: /\b(go to about|navigate to about|open about)\b/i },
  { command: 'go to contact', action: () => {}, matchPattern: /\b(go to contact|navigate to contact|open contact)\b/i },
  { command: 'scroll down', action: () => {}, matchPattern: /\b(scroll down|move down)\b/i },
  { command: 'scroll up', action: () => {}, matchPattern: /\b(scroll up|move up)\b/i },
];

export function getSuggestions(commands: VoiceCommand[]): string[] {
  return commands.map(cmd => cmd.command);
}