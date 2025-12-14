import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Alert, AlertDescription } from './alert';
import { Badge } from './badge';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { banglaTTSService } from '@/services/ttsService';

export const HuggingFaceStatusCard: React.FC = () => {
    const isConfigured = banglaTTSService.isHuggingFaceConfigured();

    if (isConfigured) {
        return (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <AlertTriangle className="h-5 w-5" />
                        CORS সীমাবদ্ধতা
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Alert className="border-blue-300 bg-blue-100/50">
                        <AlertDescription>
                            <strong>⚠️ Hugging Face API browser থেকে কাজ করবে না</strong>
                            <br />
                            <span className="text-sm">
                                CORS policy এর কারণে direct API call blocked।
                            </span>
                        </AlertDescription>
                    </Alert>

                    <div className="text-sm space-y-1">
                        <p className="font-semibold">✅ বর্তমান সমাধান:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Browser TTS ব্যবহার করা হচ্ছে</li>
                            <li>Offline কাজ করে</li>
                            <li>কোন API key লাগে না</li>
                        </ul>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                        <strong>ভবিষ্যতে:</strong> Backend proxy দিয়ে Hugging Face API enable করা হবে
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                    Hugging Face কনফিগার করা নেই
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Alert className="border-amber-300 bg-amber-100/50">
                    <AlertDescription>
                        <strong>ব্রাউজার TTS ব্যবহার হবে</strong>
                        <br />
                        উচ্চমানের AI TTS এর জন্য Hugging Face API কনফিগার করুন।
                    </AlertDescription>
                </Alert>

                <div className="space-y-2">
                    <p className="text-sm font-semibold">দ্রুত সেটআপ (২ মিনিট):</p>
                    <ol className="text-sm space-y-1.5 list-decimal list-inside">
                        <li>
                            <a
                                href="https://huggingface.co/join"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                Hugging Face একাউন্ট তৈরি করুন
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://huggingface.co/settings/tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                API Token তৈরি করুন (Free)
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </li>
                        <li>
                            প্রজেক্টে <code className="bg-gray-200 px-1 rounded">.env</code> ফাইল তৈরি করুন:
                            <div className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs font-mono overflow-x-auto">
                                VITE_HUGGINGFACE_API_KEY=hf_xxxxxxxxxx
                            </div>
                        </li>
                        <li>
                            Dev server রিস্টার্ট করুন:
                            <div className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs font-mono">
                                npm run dev
                            </div>
                        </li>
                    </ol>
                </div>

                <div className="pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open('https://huggingface.co/settings/tokens', '_blank')}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        API Token পেতে যান
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
