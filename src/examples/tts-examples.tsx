// Quick Example: Using the Advanced TTS Button in your components

import { AdvancedTTSButton } from '@/components/ui/advanced-tts-button';

// Example 1: Simple usage
export const SimpleExample = () => {
    return (
        <AdvancedTTSButton
            text="আপনার বাংলা টেক্সট এখানে লিখুন"
        />
    );
};

// Example 2: With label and AI TTS
export const WithLabelExample = () => {
    return (
        <AdvancedTTSButton
            text="ধান চাষের জন্য মাটি ভালোভাবে চাষ করে নিন। বীজ বপনের আগে জমিতে পর্যাপ্ত পানি দিন।"
            showLabel
            useHuggingFace={true}
            size="default"
            variant="default"
        />
    );
};

// Example 3: With author name
export const WithAuthorExample = () => {
    return (
        <AdvancedTTSButton
            text="আগামী ৩ দিন ভারী বৃষ্টিপাতের সম্ভাবনা রয়েছে।"
            authorName="আবহাওয়া বিশেষজ্ঞ"
            showLabel
            useHuggingFace={true}
        />
    );
};

// Example 4: Browser TTS only (offline)
export const BrowserTTSExample = () => {
    return (
        <AdvancedTTSButton
            text="অফলাইন মোডে কাজ করবে"
            showLabel
            useHuggingFace={false}
            variant="outline"
        />
    );
};

// Example 5: In a card with post
export const InPostExample = () => {
    const post = {
        author: "কৃষক রহিম",
        content: "আজ আমার ধানের ক্ষেতে নতুন জাতের বীজ বপন করেছি। আশা করি ভালো ফলন হবে।",
        timestamp: "২ ঘন্টা আগে"
    };

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
                <AdvancedTTSButton
                    text={post.content}
                    authorName={post.author}
                    size="icon"
                    variant="ghost"
                />
            </div>
            <p className="text-sm">{post.content}</p>
        </div>
    );
};

// Example 6: Using TTS Service directly
import { banglaTTSService } from '@/services/ttsService';

export const DirectServiceExample = () => {
    const handleSpeak = async () => {
        try {
            await banglaTTSService.speak("সরাসরি সার্ভিস দিয়ে টেক্সট পড়া", {
                rate: 0.85,
                pitch: 1.0,
                volume: 1.0,
                useHuggingFace: true
            });
        } catch (error) {
            console.error('TTS Error:', error);
        }
    };

    const handleStop = () => {
        banglaTTSService.stop();
    };

    return (
        <div className="space-x-2">
            <button onClick={handleSpeak}>শুরু করুন</button>
            <button onClick={handleStop}>বন্ধ করুন</button>
        </div>
    );
};

// Example 7: With status tracking
import { useState, useEffect } from 'react';

export const WithStatusExample = () => {
    const [status, setStatus] = useState({
        isPlaying: false,
        isLoading: false,
        progress: 0
    });

    useEffect(() => {
        const unsubscribe = banglaTTSService.onStatusChange((newStatus) => {
            setStatus(newStatus);
        });

        return unsubscribe;
    }, []);

    return (
        <div className="space-y-2">
            <AdvancedTTSButton
                text="স্ট্যাটাস ট্র্যাকিং এর উদাহরণ"
                showLabel
            />
            <div className="text-sm text-muted-foreground">
                {status.isLoading && `লোড হচ্ছে... ${status.progress}%`}
                {status.isPlaying && 'প্লে হচ্ছে...'}
                {!status.isLoading && !status.isPlaying && 'থামানো আছে'}
            </div>
        </div>
    );
};
