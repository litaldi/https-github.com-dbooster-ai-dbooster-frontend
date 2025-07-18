
import { productionLogger } from '@/utils/productionLogger';

export interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

class VoiceInterfaceService {
  private synthesis: SpeechSynthesis;
  private recognition: any; // SpeechRecognition
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: VoiceSettings = {
    voice: 'default',
    rate: 1,
    pitch: 1,
    volume: 1
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.loadVoices();
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private loadVoices(): void {
    const loadVoicesHandler = () => {
      this.voices = this.synthesis.getVoices();
      if (this.voices.length > 0) {
        // Find a good default voice
        const preferredVoice = this.voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Google')
        ) || this.voices.find(voice => voice.lang.startsWith('en')) || this.voices[0];
        
        if (preferredVoice) {
          this.settings.voice = preferredVoice.name;
        }
      }
    };

    loadVoicesHandler();
    this.synthesis.onvoiceschanged = loadVoicesHandler;
  }

  async speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const settings = { ...this.settings, ...options };

        // Find the voice
        const voice = this.voices.find(v => v.name === settings.voice) || this.voices[0];
        if (voice) {
          utterance.voice = voice;
        }

        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        utterance.onend = () => {
          productionLogger.info('Speech synthesis completed', 'VoiceInterfaceService');
          resolve();
        };

        utterance.onerror = (event) => {
          productionLogger.error('Speech synthesis error', event.error, 'VoiceInterfaceService');
          reject(new Error(event.error));
        };

        this.synthesis.speak(utterance);
      } catch (error) {
        productionLogger.error('Failed to speak text', error, 'VoiceInterfaceService');
        reject(error);
      }
    });
  }

  async startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      this.stopListening();
    }

    return new Promise((resolve, reject) => {
      this.recognition.onstart = () => {
        this.isListening = true;
        productionLogger.info('Speech recognition started', 'VoiceInterfaceService');
        resolve();
      };

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          onResult({
            transcript: result[0].transcript,
            confidence: result[0].confidence,
            isFinal: result.isFinal
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        productionLogger.error(errorMessage, event, 'VoiceInterfaceService');
        if (onError) onError(errorMessage);
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
        productionLogger.info('Speech recognition ended', 'VoiceInterfaceService');
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isCurrentlySpeaking(): boolean {
    return this.synthesis.speaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  // Voice command processing
  async processVoiceCommand(transcript: string): Promise<string> {
    const command = transcript.toLowerCase().trim();
    
    // Database-specific voice commands
    if (command.includes('show') || command.includes('display')) {
      if (command.includes('users')) {
        return 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;';
      } else if (command.includes('orders')) {
        return 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;';
      } else if (command.includes('tables')) {
        return 'SHOW TABLES;';
      } else if (command.includes('databases')) {
        return 'SHOW DATABASES;';
      }
    }
    
    if (command.includes('create')) {
      if (command.includes('user')) {
        return 'INSERT INTO users (name, email) VALUES (?, ?);';
      } else if (command.includes('table')) {
        return 'CREATE TABLE new_table (id INT PRIMARY KEY, name VARCHAR(255));';
      }
    }
    
    if (command.includes('delete') || command.includes('remove')) {
      if (command.includes('user')) {
        return 'DELETE FROM users WHERE id = ?;';
      }
    }
    
    if (command.includes('update') || command.includes('modify')) {
      if (command.includes('user')) {
        return 'UPDATE users SET name = ? WHERE id = ?;';
      }
    }
    
    // Navigation commands
    if (command.includes('go to') || command.includes('navigate to')) {
      if (command.includes('dashboard')) return 'navigate:/dashboard';
      if (command.includes('queries')) return 'navigate:/queries';
      if (command.includes('analytics')) return 'navigate:/analytics';
      if (command.includes('settings')) return 'navigate:/settings';
    }
    
    // General commands
    if (command.includes('help')) {
      return 'help:voice_commands';
    }
    
    if (command.includes('clear') || command.includes('reset')) {
      return 'action:clear';
    }
    
    // Return the original transcript if no specific command is recognized
    return transcript;
  }

  // Get voice command suggestions
  getVoiceCommandSuggestions(): string[] {
    return [
      'Show all users',
      'Display recent orders',
      'Create a new table',
      'Go to dashboard',
      'Help with voice commands',
      'Show database tables',
      'Clear the screen',
      'Navigate to queries page'
    ];
  }
}

export const voiceInterfaceService = new VoiceInterfaceService();
