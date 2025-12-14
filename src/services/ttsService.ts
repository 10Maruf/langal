/**
 * Advanced Bengali TTS Service using Hugging Face API
 * 
 * Supports multiple high-quality Bengali TTS models:
 * 1. facebook/mms-tts-ben - Meta's Massively Multilingual Speech (Best Quality)
 * 2. mnatrb/VitsModel-Bangla-Female - Bengali Female Voice
 * 3. fallback to Web Speech API
 */

export interface TTSOptions {
    rate?: number;
    pitch?: number;
    volume?: number;
    useHuggingFace?: boolean;
}

export interface TTSStatus {
    isPlaying: boolean;
    isLoading: boolean;
    progress: number;
    error?: string;
}

class BanglaTTSService {
    private audioContext: AudioContext | null = null;
    private currentAudio: HTMLAudioElement | null = null;
    private utterance: SpeechSynthesisUtterance | null = null;
    
    // Hugging Face API Configuration
    private readonly HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    private readonly HF_MODELS = {
        primary: 'facebook/mms-tts-ben', // Meta's Bengali TTS - Best quality
        secondary: 'mnatrb/VitsModel-Bangla-Female', // Bengali Female Voice
        tertiary: 'sanchit-gandhi/whisper-small-bn' // Fallback
    };
    
    private statusCallbacks: ((status: TTSStatus) => void)[] = [];

    constructor() {
        // Initialize Audio Context
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            this.audioContext = new AudioContext();
        }
    }

    /**
     * Main speak function with automatic fallback
     */
    async speak(text: string, options: TTSOptions = {}): Promise<void> {
        this.updateStatus({ isLoading: true, isPlaying: false, progress: 0 });

        try {
            // Try Hugging Face API first
            if (options.useHuggingFace !== false && this.HF_API_KEY) {
                await this.speakWithHuggingFace(text, options);
            } else {
                // Fallback to Web Speech API
                await this.speakWithWebAPI(text, options);
            }
        } catch (error) {
            // If Hugging Face was attempted, silently fall back to browser TTS
            if (options.useHuggingFace !== false) {
                console.info('ℹ️ Using Browser TTS (Hugging Face requires backend proxy)');
                await this.speakWithWebAPI(text, options);
            } else {
                console.error('TTS Error:', error);
                this.updateStatus({ 
                    isLoading: false, 
                    isPlaying: false, 
                    progress: 0,
                    error: 'টেক্সট পড়তে সমস্যা হয়েছে' 
                });
                throw error;
            }
        }
    }

    /**
     * Hugging Face API TTS - High Quality via Backend Proxy
     */
    private async speakWithHuggingFace(text: string, options: TTSOptions): Promise<void> {
        this.updateStatus({ isLoading: true, isPlaying: false, progress: 10 });

        // Get backend API URL from environment
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const apiEndpoint = `${backendUrl}/api/tts/generate`;

        console.info('🎙️ Calling Hugging Face TTS via backend proxy...');
        console.info('⏳ First-time model loading may take 20-30 seconds');

        try {
            this.updateStatus({ isLoading: true, isPlaying: false, progress: 30 });

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model: options.model || 'facebook/mms-tts-ben'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Backend API Error:', errorData);
                throw new Error(errorData.error || `Backend API error: ${response.status}`);
            }

            console.info('✅ Received audio from Hugging Face!');

            this.updateStatus({ isLoading: true, isPlaying: false, progress: 70 });

            // Get audio blob from response
            const audioBlob = await response.blob();

            // Play the audio
            await this.playAudioBlob(audioBlob, options);

        } catch (error) {
            console.error('Backend TTS API Error:', error);
            throw error;
        }
    }

    /**
     * Play audio blob with AudioContext for better control
     */
    private async playAudioBlob(blob: Blob, options: TTSOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            this.currentAudio = audio;

            audio.src = URL.createObjectURL(blob);
            audio.volume = options.volume ?? 1.0;
            audio.playbackRate = options.rate ?? 0.9; // Slightly slower for Bengali

            audio.onloadedmetadata = () => {
                this.updateStatus({ isLoading: false, isPlaying: true, progress: 100 });
            };

            audio.onplay = () => {
                this.updateStatus({ isLoading: false, isPlaying: true, progress: 100 });
            };

            audio.onended = () => {
                this.updateStatus({ isLoading: false, isPlaying: false, progress: 0 });
                URL.revokeObjectURL(audio.src);
                this.currentAudio = null;
                resolve();
            };

            audio.onerror = (e) => {
                this.updateStatus({ 
                    isLoading: false, 
                    isPlaying: false, 
                    progress: 0,
                    error: 'অডিও প্লে করতে সমস্যা হয়েছে' 
                });
                URL.revokeObjectURL(audio.src);
                this.currentAudio = null;
                reject(e);
            };

            audio.play().catch(reject);
        });
    }

    /**
     * Web Speech API Fallback - Works offline
     */
    private async speakWithWebAPI(text: string, options: TTSOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('Speech Synthesis not supported'));
                return;
            }

            this.stop(); // Stop any ongoing speech

            this.updateStatus({ isLoading: true, isPlaying: false, progress: 20 });

            const utterance = new SpeechSynthesisUtterance(text);
            this.utterance = utterance;

            utterance.lang = 'bn-BD';
            utterance.rate = options.rate ?? 0.85;
            utterance.pitch = options.pitch ?? 1.0;
            utterance.volume = options.volume ?? 1.0;

            // Try to find a Bengali voice with priority order
            const loadVoices = () => {
                const voices = speechSynthesis.getVoices();
                console.log('Available voices:', voices.length);
                
                // Priority 1: Google বাংলা (exact match)
                let bengaliVoice = voices.find(voice => 
                    voice.name.toLowerCase().includes('bangla') ||
                    voice.name.toLowerCase().includes('bengali') ||
                    (voice.lang === 'bn-BD' || voice.lang === 'bn-IN' || voice.lang === 'bn')
                );

                // Priority 2: Any voice with 'bn' language code (not Hindi)
                if (!bengaliVoice) {
                    bengaliVoice = voices.find(voice => 
                        voice.lang.startsWith('bn') && !voice.name.includes('हिन्दी') && !voice.name.includes('Hindi')
                    );
                }

                // Priority 3: Microsoft or other Bengali voices
                if (!bengaliVoice) {
                    bengaliVoice = voices.find(voice => 
                        (voice.name.includes('Bengali') || voice.name.includes('Bangla')) && 
                        !voice.name.includes('Hindi')
                    );
                }

                // Log all Bengali-like voices for debugging
                const potentialVoices = voices.filter(v => 
                    v.name.toLowerCase().includes('beng') || 
                    v.name.toLowerCase().includes('bang') || 
                    v.lang.includes('bn')
                );
                console.log('Bengali-like voices found:', potentialVoices.map(v => `${v.name} (${v.lang})`));

                if (bengaliVoice) {
                    utterance.voice = bengaliVoice;
                    console.log('✓ Selected Bengali voice:', bengaliVoice.name, bengaliVoice.lang);
                } else {
                    console.warn('⚠️ No Bengali voice found. Using default voice.');
                    console.log('All available voices:', voices.map(v => `${v.name} (${v.lang})`));
                }
            };

            // Load voices (they might not be ready immediately)
            if (speechSynthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                speechSynthesis.onvoiceschanged = loadVoices;
            }

            utterance.onstart = () => {
                this.updateStatus({ isLoading: false, isPlaying: true, progress: 100 });
            };

            utterance.onend = () => {
                this.updateStatus({ isLoading: false, isPlaying: false, progress: 0 });
                this.utterance = null;
                resolve();
            };

            utterance.onerror = (event) => {
                console.error('Speech Synthesis Error:', event);
                this.updateStatus({ 
                    isLoading: false, 
                    isPlaying: false, 
                    progress: 0,
                    error: 'টেক্সট পড়তে সমস্যা হয়েছে' 
                });
                this.utterance = null;
                reject(event);
            };

            this.updateStatus({ isLoading: false, isPlaying: true, progress: 50 });
            speechSynthesis.speak(utterance);
        });
    }

    /**
     * Stop any ongoing speech
     */
    stop(): void {
        // Stop HTML5 Audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            URL.revokeObjectURL(this.currentAudio.src);
            this.currentAudio = null;
        }

        // Stop Web Speech API
        if ('speechSynthesis' in window && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            this.utterance = null;
        }

        this.updateStatus({ isLoading: false, isPlaying: false, progress: 0 });
    }

    /**
     * Check if currently playing
     */
    isPlaying(): boolean {
        return (
            (this.currentAudio && !this.currentAudio.paused) ||
            ('speechSynthesis' in window && speechSynthesis.speaking)
        );
    }

    /**
     * Subscribe to status updates
     */
    onStatusChange(callback: (status: TTSStatus) => void): () => void {
        this.statusCallbacks.push(callback);
        return () => {
            this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Update status and notify subscribers
     */
    private updateStatus(status: TTSStatus): void {
        this.statusCallbacks.forEach(callback => callback(status));
    }

    /**
     * Get available voices
     */
    getAvailableVoices(): SpeechSynthesisVoice[] {
        if ('speechSynthesis' in window) {
            return speechSynthesis.getVoices();
        }
        return [];
    }

    /**
     * Get Bengali voices only
     */
    getBengaliVoices(): SpeechSynthesisVoice[] {
        const voices = this.getAvailableVoices();
        return voices.filter(voice => 
            voice.name.toLowerCase().includes('beng') ||
            voice.name.toLowerCase().includes('bang') ||
            voice.lang.includes('bn')
        );
    }

    /**
     * Check if Bengali voice is available
     */
    hasBengaliVoice(): boolean {
        return this.getBengaliVoices().length > 0;
    }

    /**
     * Check if Hugging Face is configured
     */
    isHuggingFaceConfigured(): boolean {
        return Boolean(this.HF_API_KEY);
    }
}

// Export singleton instance
export const banglaTTSService = new BanglaTTSService();
