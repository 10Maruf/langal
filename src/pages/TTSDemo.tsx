import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdvancedTTSButton } from '@/components/ui/advanced-tts-button';
import { TTSButton } from '@/components/ui/tts-button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Sparkles, Volume2 } from 'lucide-react';
import { VoiceInfoCard } from '@/components/ui/voice-info-card';
import { HuggingFaceStatusCard } from '@/components/ui/huggingface-status-card';

const TTSDemo: React.FC = () => {
  const [customText, setCustomText] = useState('আসসালামু আলাইকুম। আমি বাংলা টেক্সট-টু-স্পিচ সিস্টেম।');

  const sampleTexts = [
    {
      title: 'ধান চাষের পরামর্শ',
      text: 'ধান চাষের জন্য মাটি ভালোভাবে চাষ করে নিন। বীজ বপনের আগে জমিতে পর্যাপ্ত পানি দিন। সার প্রয়োগের সময় সতর্ক থাকুন।',
      author: 'কৃষি বিশেষজ্ঞ'
    },
    {
      title: 'আবহাওয়া সতর্কতা',
      text: 'আগামী ৩ দিন ভারী বৃষ্টিপাতের সম্ভাবনা রয়েছে। ফসলের সুরক্ষার জন্য প্রয়োজনীয় ব্যবস্থা নিন। নিষ্কাশনের ব্যবস্থা রাখুন।',
      author: 'আবহাওয়া দপ্তর'
    },
    {
      title: 'সবজি চাষ',
      text: 'শীতকালীন সবজি চাষের জন্য এখনই প্রস্তুতি শুরু করুন। বাঁধাকপি, ফুলকপি, টমেটো এবং মরিচের চারা তৈরি করুন।',
      author: 'উদ্যানতত্ত্ব বিভাগ'
    },
    {
      title: 'কীটনাশক ব্যবহার',
      text: 'কীটনাশক ব্যবহারের সময় সুরক্ষা সরঞ্জাম পরিধান করুন। সকাল বা বিকেলে স্প্রে করুন। বাতাস থাকলে স্প্রে করবেন না।',
      author: 'কৃষি সম্প্রসারণ অফিসার'
    },
    {
      title: 'বীজ সংরক্ষণ',
      text: 'ভালো মানের বীজ নির্বাচন করুন এবং শুকনো স্থানে সংরক্ষণ করুন। বীজ বপনের আগে শোধন করে নিন। রোগমুক্ত বীজ ব্যবহার করুন।',
      author: 'বীজ প্রযুক্তিবিদ'
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          বাংলা টেক্সট-টু-স্পিচ ডেমো
        </h1>
        <p className="text-muted-foreground text-lg">
          উচ্চমানের AI মডেল দিয়ে বাংলা টেক্সট শুনুন
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          এই সিস্টেম দুটি মোড সাপোর্ট করে:
          <br />
          <strong className="text-purple-600">AI TTS (Hugging Face)</strong> - উচ্চমানের Meta এর MMS মডেল (Backend প্রয়োজন)
          <br />
          <strong className="text-green-600">Browser TTS (প্রস্তাবিত)</strong> - অফলাইন কাজ করে, CORS সমস্যা নেই
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-4">
        <HuggingFaceStatusCard />
        <VoiceInfoCard />
      </div>

      <Tabs defaultValue="samples" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="samples">নমুনা টেক্সট</TabsTrigger>
          <TabsTrigger value="custom">কাস্টম টেক্সট</TabsTrigger>
        </TabsList>

        <TabsContent value="samples" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {sampleTexts.map((sample, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{sample.title}</span>
                    <Badge variant="outline">{sample.author}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sample.text}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {/* AI TTS Button */}
                    <AdvancedTTSButton
                      text={sample.text}
                      authorName={sample.author}
                      size="default"
                      variant="default"
                      showLabel
                      useHuggingFace={true}
                      className="flex-1"
                    />

                    {/* Browser TTS Button */}
                    <AdvancedTTSButton
                      text={sample.text}
                      authorName={sample.author}
                      size="default"
                      variant="outline"
                      showLabel
                      useHuggingFace={false}
                      className="flex-1"
                    />
                  </div>

                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>উচ্চমানের AI TTS</span>
                    <Volume2 className="h-3 w-3 ml-2" />
                    <span>ব্রাউজার TTS</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>আপনার টেক্সট লিখুন</CardTitle>
              <CardDescription>
                যেকোনো বাংলা টেক্সট লিখুন এবং AI দিয়ে শুনুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-text">বাংলা টেক্সট</Label>
                <Textarea
                  id="custom-text"
                  placeholder="এখানে বাংলা টেক্সট লিখুন..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={6}
                  className="resize-none font-bengali"
                />
                <p className="text-xs text-muted-foreground">
                  টেক্সট দৈর্ঘ্য: {customText.length} অক্ষর
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      AI TTS (Hugging Face)
                    </CardTitle>
                    <CardDescription>
                      Meta এর MMS মডেল - সবচেয়ে ভালো মান
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdvancedTTSButton
                      text={customText}
                      size="default"
                      variant="default"
                      showLabel
                      useHuggingFace={true}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-blue-600" />
                      ব্রাউজার TTS
                    </CardTitle>
                    <CardDescription>
                      অফলাইন কাজ করে - API লাগে না
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdvancedTTSButton
                      text={customText}
                      size="default"
                      variant="outline"
                      showLabel
                      useHuggingFace={false}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Old TTS Button for comparison */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">পুরাতন TTS বাটন (তুলনার জন্য)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <TTSButton
                  text={customText}
                  size="default"
                  variant="secondary"
                />
                <span className="text-sm text-muted-foreground">
                  মূল Web Speech API বাটন
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle>কিভাবে ব্যবহার করবেন?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              AI TTS সেটআপ (ঐচ্ছিক):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Hugging Face এ একাউন্ট তৈরি করুন (huggingface.co)</li>
              <li>API Token তৈরি করুন (Settings → Access Tokens)</li>
              <li>প্রজেক্টের <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">.env</code> ফাইলে যোগ করুন:</li>
              <li className="ml-4">
                <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                  VITE_HUGGINGFACE_API_KEY=your_token_here
                </code>
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              ব্রাউজার TTS:
            </h4>
            <p className="text-sm text-muted-foreground ml-4">
              কোন সেটআপ প্রয়োজন নেই। সরাসরি ব্যবহার করুন। অফলাইনেও কাজ করবে।
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TTSDemo;
