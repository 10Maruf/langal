import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { banglaTTSService, TTSStatus } from '@/services/ttsService';
import { useToast } from '@/hooks/use-toast';

interface AdvancedTTSButtonProps {
    text: string;
    authorName?: string;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    showLabel?: boolean;
    useHuggingFace?: boolean; // Enable high-quality Hugging Face TTS
}

export const AdvancedTTSButton: React.FC<AdvancedTTSButtonProps> = ({
    text,
    authorName,
    className,
    size = 'icon',
    variant = 'outline',
    showLabel = false,
    useHuggingFace = false // Default to Browser TTS (reliable and fast)
}) => {
    const [status, setStatus] = useState<TTSStatus>({
        isPlaying: false,
        isLoading: false,
        progress: 0
    });
    const { toast } = useToast();

    useEffect(() => {
        // Subscribe to TTS service status updates
        const unsubscribe = banglaTTSService.onStatusChange((newStatus) => {
            setStatus(newStatus);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSpeak = async () => {
        if (!text || !text.trim()) {
            toast({
                title: "ত্রুটি",
                description: "কোন টেক্সট নেই পড়ার জন্য",
                variant: "destructive"
            });
            return;
        }

        // If already playing, stop it
        if (status.isPlaying) {
            banglaTTSService.stop();
            return;
        }

        try {
            // Prepare text with author name if provided
            const textToSpeak = authorName ? `${authorName} বলেছেন: ${text}` : text;

            // Check if using Hugging Face
            if (useHuggingFace && !banglaTTSService.isHuggingFaceConfigured()) {
                toast({
                    title: "⚠️ সতর্কতা",
                    description: "Hugging Face API কনফিগার করা নেই। ব্রাউজার TTS ব্যবহার করা হবে।"
                });
            }

            // Show initial toast for HF
            if (useHuggingFace && banglaTTSService.isHuggingFaceConfigured()) {
                toast({
                    title: "🎙️ উচ্চমানের TTS",
                    description: "AI মডেল দিয়ে প্রস্তুত করা হচ্ছে..."
                });
            }

            await banglaTTSService.speak(textToSpeak, {
                rate: 0.85,
                pitch: 1.0,
                volume: 1.0,
                useHuggingFace
            });

            // Success toast
            if (useHuggingFace && banglaTTSService.isHuggingFaceConfigured()) {
                toast({
                    title: "✓ সফল",
                    description: "টেক্সট পড়া শুরু হয়েছে"
                });
            }
        } catch (error) {
            console.error('TTS Error:', error);

            toast({
                title: "ত্রুটি",
                description: status.error || "টেক্সট পড়তে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                variant: "destructive"
            });
        }
    };

    const getIcon = () => {
        if (status.isLoading) {
            return <Loader2 className="h-4 w-4 animate-spin" />;
        }
        if (status.isPlaying) {
            return <VolumeX className="h-4 w-4" />;
        }
        if (useHuggingFace && banglaTTSService.isHuggingFaceConfigured()) {
            return <Sparkles className="h-4 w-4" />;
        }
        return <Volume2 className="h-4 w-4" />;
    };

    const getLabel = () => {
        if (status.isLoading) return 'প্রস্তুত হচ্ছে...';
        if (status.isPlaying) return 'বন্ধ করুন';
        if (useHuggingFace && banglaTTSService.isHuggingFaceConfigured()) {
            return 'AI দিয়ে শুনুন';
        }
        return 'শুনুন';
    };

    const getTooltip = () => {
        if (status.isLoading) return `প্রস্তুত হচ্ছে... (${status.progress}%)`;
        if (status.isPlaying) return 'বন্ধ করতে ক্লিক করুন';
        if (useHuggingFace && banglaTTSService.isHuggingFaceConfigured()) {
            return 'উচ্চমানের AI TTS দিয়ে শুনুন (Hugging Face)';
        }
        return 'টেক্সট শুনতে ক্লিক করুন';
    };

    return (
        <Button
            onClick={handleSpeak}
            disabled={status.isLoading}
            size={size}
            variant={variant}
            className={cn(
                'transition-all duration-300 hover:scale-105 gap-2',
                status.isPlaying && 'text-green-600 bg-green-50 border-green-300 dark:bg-green-950 dark:text-green-400',
                status.isLoading && 'opacity-70',
                useHuggingFace && banglaTTSService.isHuggingFaceConfigured() && !status.isPlaying &&
                'border-purple-300 hover:bg-purple-50 hover:border-purple-400 dark:border-purple-700',
                className
            )}
            title={getTooltip()}
        >
            {getIcon()}
            {(showLabel || size !== 'icon') && (
                <span className="text-sm font-medium">{getLabel()}</span>
            )}

            {/* Progress indicator */}
            {status.isLoading && status.progress > 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${status.progress}%` }} />
            )}
        </Button>
    );
};

// Export the old TTSButton for backward compatibility
export { TTSButton } from './tts-button';
