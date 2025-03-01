// src/types/global.d.ts
console.log("Fichier global.d.ts bien lu !");

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognition: typeof SpeechRecognition;
}

// Ajout d'une variable globale
declare global {
  var isGlobalTypesLoaded: boolean;
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
