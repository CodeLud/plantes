// global.d.ts

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  item(index: number): SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult?: (event: SpeechRecognitionEvent) => void;
  onerror?: (event: SpeechRecognitionError) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
