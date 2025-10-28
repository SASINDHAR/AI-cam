export interface VoiceCommand {
  command: string;
  action: () => void;
  matchPattern: RegExp;
}

export type VoiceAssistantStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export interface VoiceNavigationContextType {
  registerNavigationCommand: (command: VoiceCommand) => void;
  unregisterNavigationCommand: (command: string) => void;
  navigateToPage: (page: string) => void;
  navigateToSection: (page: string, section: string) => void;
  commands: VoiceCommand[];
}