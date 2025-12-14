import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { banglaTTSService } from '@/services/ttsService';

export const VoiceInfoCard: React.FC = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [bengaliVoices, setBengaliVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVoices = () => {
            const allVoices = banglaTTSService.getAvailableVoices();
            const bnVoices = banglaTTSService.getBengaliVoices();

            setVoices(allVoices);
            setBengaliVoices(bnVoices);
            setLoading(false);
        };

        // Initial load
        loadVoices();

        // Wait for voices to be ready
        if ('speechSynthesis' in window) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if ('speechSynthesis' in window) {
                speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">ভয়েস লোড হচ্ছে...</p>
                </CardContent>
            </Card>
        );
    }

    const hasBengali = bengaliVoices.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {hasBengali ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    ব্রাউজার ভয়েস স্ট্যাটাস
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {hasBengali ? (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                            <strong className="text-green-700">বাংলা ভয়েস পাওয়া গেছে!</strong>
                            <br />
                            আপনার সিস্টেমে {bengaliVoices.length}টি বাংলা TTS voice আছে।
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="border-amber-200 bg-amber-50">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                            <strong className="text-amber-700">বাংলা ভয়েস নেই</strong>
                            <br />
                            ডিফল্ট voice ব্যবহার হবে। উচ্চারণ ভালো হবে না।
                            <br />
                            <br />
                            <strong>সমাধান:</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                <li>Windows Settings → Language → Add Bengali</li>
                                <li>Chrome/Edge ব্যবহার করুন</li>
                                <li>AI TTS (Hugging Face) ব্যবহার করুন</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {bengaliVoices.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-2">বাংলা ভয়েস ({bengaliVoices.length}):</h4>
                        <div className="space-y-2">
                            {bengaliVoices.map((voice, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{voice.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {voice.lang}
                                            {voice.localService ? ' • Local' : ' • Remote'}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        ✓ উপলব্ধ
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-sm text-muted-foreground">
                    <strong>মোট ভয়েস:</strong> {voices.length}টি
                    <br />
                    <strong>বাংলা ভয়েস:</strong> {bengaliVoices.length}টি
                </div>
            </CardContent>
        </Card>
    );
};
