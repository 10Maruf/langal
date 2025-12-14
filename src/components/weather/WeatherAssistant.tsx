/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * কৃষি আবহাওয়া সহায়ক - AI চ্যাটবট
 * কৃষকদের জন্য বাংলায় আবহাওয়া পরামর্শ
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Send,
    Mic,
    Bot,
    User,
    Loader2,
    RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    startWeatherAssistantSession,
    continueWeatherAssistantSession,
    WeatherAssistantMessage
} from "@/services/weatherAssistant";

interface WeatherAssistantProps {
    initialLocation?: string;
}

const WeatherAssistant = ({ initialLocation }: WeatherAssistantProps) => {
    const { toast } = useToast();
    const [messages, setMessages] = useState<WeatherAssistantMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // স্বাগত বার্তা
    useEffect(() => {
        const welcomeMessage: WeatherAssistantMessage = {
            id: 'welcome',
            role: 'assistant',
            content: `👋 আসসালামু আলাইকুম! আমি আপনার **কৃষি আবহাওয়া সহায়ক**।

আমাকে বাংলায় বা ইংরেজিতে জিজ্ঞেস করতে পারেন:

🌤️ "ঢাকার আবহাওয়া কেমন?"
🌧️ "আগামীকাল কি বৃষ্টি হবে?"
🌾 "ধান চাষের জন্য আবহাওয়া উপযুক্ত?"
🥬 "সবজি চাষে কি সমস্যা হবে?"

${initialLocation ? `আপনি **${initialLocation}** থেকে আছেন। এই এলাকার আবহাওয়া জানতে চাইলে বলুন!` : 'আপনার জেলার নাম বলুন, আমি সেখানের আবহাওয়া ও কৃষি পরামর্শ দেব!'}`,
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
    }, [initialLocation]);

    // স্ক্রল করা
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // মেসেজ পাঠানো
    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: WeatherAssistantMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content: inputText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputText;
        setInputText("");
        setIsLoading(true);

        try {
            let response;

            if (sessionId) {
                response = await continueWeatherAssistantSession(sessionId, currentInput);
            } else {
                response = await startWeatherAssistantSession(currentInput);
            }

            setSessionId(response.sessionId);

            const assistantMessage: WeatherAssistantMessage = {
                id: `assistant_${Date.now()}`,
                role: 'assistant',
                content: response.answer,
                timestamp: new Date(),
                data: response.data
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "উত্তর পেতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ভয়েস ইনপুট
    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'bn-BD';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                toast({
                    title: "🎤 শুনছি...",
                    description: "আপনার প্রশ্ন বলুন"
                });
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                toast({
                    title: "শোনা হয়েছে",
                    description: `"${transcript}"`
                });
            };

            recognition.onerror = () => {
                toast({
                    title: "ভয়েস ত্রুটি",
                    description: "আবার চেষ্টা করুন",
                    variant: "destructive"
                });
            };

            recognition.start();
        } else {
            toast({
                title: "সাপোর্ট নেই",
                description: "আপনার ব্রাউজার ভয়েস সাপোর্ট করে না",
                variant: "destructive"
            });
        }
    };

    // নতুন চ্যাট শুরু
    const resetChat = () => {
        setSessionId(null);
        setMessages([{
            id: 'welcome_new',
            role: 'assistant',
            content: '🔄 নতুন কথোপকথন শুরু হয়েছে। আপনার প্রশ্ন জিজ্ঞেস করুন!',
            timestamp: new Date()
        }]);
    };

    // দ্রুত প্রশ্ন
    const quickQuestions = [
        { text: "আজকের আবহাওয়া", icon: "☀️" },
        { text: "বৃষ্টি হবে কি?", icon: "🌧️" },
        { text: "ধান চাষে পরামর্শ", icon: "🌾" },
        { text: "সেচ দেওয়া উচিত?", icon: "💧" }
    ];

    return (
        <Card className="h-[600px] flex flex-col border-green-200 dark:border-green-800">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        কৃষি আবহাওয়া সহায়ক
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetChat}
                        className="text-white hover:bg-white/20"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-white/80">বাংলায় আবহাওয়া জিজ্ঞেস করুন</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* মেসেজ লিস্ট */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl p-3 ${message.role === 'user'
                                        ? 'bg-green-500 text-white rounded-br-md'
                                        : 'bg-slate-100 dark:bg-slate-800 rounded-bl-md'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {message.role === 'assistant' && (
                                            <Bot className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                                        )}
                                        <div className="text-sm whitespace-pre-wrap">
                                            {message.content.split('**').map((part, i) =>
                                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                            )}
                                        </div>
                                        {message.role === 'user' && (
                                            <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                        {message.timestamp.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* লোডিং */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md p-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                                        <span className="text-sm">উত্তর খোঁজা হচ্ছে...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* দ্রুত প্রশ্ন */}
                <div className="px-4 py-2 border-t bg-slate-50 dark:bg-slate-900">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {quickQuestions.map((q, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 whitespace-nowrap"
                                onClick={() => {
                                    setInputText(q.text);
                                }}
                            >
                                {q.icon} {q.text}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* ইনপুট বার */}
                <div className="p-4 border-t bg-white dark:bg-slate-950">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleVoiceInput}
                            disabled={isLoading}
                            className="flex-shrink-0 bg-purple-50 hover:bg-purple-100 border-purple-200"
                        >
                            <Mic className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Input
                            placeholder="আপনার প্রশ্ন লিখুন বা বলুন..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={isLoading || !inputText.trim()}
                            className="flex-shrink-0 bg-green-600 hover:bg-green-700"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeatherAssistant;
