import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { MessageSquare, Mic, Phone, Video, Send, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsultationRequest {
  id: string;
  question: string;
  category: string;
  status: 'pending' | 'assigned' | 'completed';
  expert?: string;
  response?: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  available: boolean;
  languages: string[];
}

const Consultation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [contactMethod, setContactMethod] = useState("text");
  const [isListening, setIsListening] = useState(false);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  // Mock experts data
  const experts: Expert[] = [
    {
      id: '1',
      name: 'ড. রহিমা খাতুন',
      specialization: 'ফসলের রোগ ও পোকামাকড়',
      experience: '১৫ বছর',
      rating: 4.8,
      available: true,
      languages: ['বাংলা', 'ইংরেজি']
    },
    {
      id: '2',
      name: 'মো. করিম উদ্দিন',
      specialization: 'মাটি ও সার ব্যবস্থাপনা',
      experience: '১২ বছর',
      rating: 4.6,
      available: true,
      languages: ['বাংলা']
    },
    {
      id: '3',
      name: 'প্রো. নাসির আহমেদ',
      specialization: 'ফসল পরিকল্পনা ও বীজ',
      experience: '২০ বছর',
      rating: 4.9,
      available: false,
      languages: ['বাংলা', 'ইংরেজি']
    }
  ];

  const categories = [
    { value: "disease", label: "রোগ ও পোকামাকড়" },
    { value: "soil", label: "মাটি ও সার" },
    { value: "crop", label: "ফসল পরিকল্পনা" },
    { value: "irrigation", label: "সেচ ব্যবস্থাপনা" },
    { value: "marketing", label: "বিপণন" },
    { value: "weather", label: "আবহাওয়া" },
    { value: "other", label: "অন্যান্য" }
  ];

  const mockConsultations: ConsultationRequest[] = [
    {
      id: '1',
      question: 'আমার ধানগাছে বাদামী দাগ পড়েছে। কি করব?',
      category: 'রোগ ও পোকামাকড়',
      status: 'completed',
      expert: 'ড. রহিমা খাতুন',
      response: 'এটি ব্লাস্ট রোগের লক্ষণ। ট্রাইসাইক্লাজোল স্প্রে করুন এবং নাইট্রোজেন সার কমান।',
      timestamp: '২ ঘন্টা আগে',
      priority: 'high'
    },
    {
      id: '2',
      question: 'মাটিতে লবণাক্ততা কমানোর উপায় কি?',
      category: 'মাটি ও সার',
      status: 'assigned',
      expert: 'মো. করিম উদ্দিন',
      timestamp: '৫ ঘন্টা আগে',
      priority: 'medium'
    },
    {
      id: '3',
      question: 'রবি মৌসুমে কোন ফসল লাভজনক হবে?',
      category: 'ফসল পরিকল্পনা',
      status: 'pending',
      timestamp: '১ দিন আগে',
      priority: 'low'
    }
  ];

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "শুনছি...",
          description: "এখন আপনার প্রশ্ন বলুন।",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "ত্রুটি",
          description: "ভয়েস ইনপুটে সমস্যা হয়েছে।",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "সাপোর্ট নেই",
        description: "আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না।",
        variant: "destructive"
      });
    }
  };

  const handleSubmitQuestion = () => {
    if (!question.trim() || !category) {
      toast({
        title: "তথ্য প্রয়োজন",
        description: "প্রশ্ন ও ক্যাটেগরি নির্বাচন করুন।",
        variant: "destructive"
      });
      return;
    }

    const newConsultation: ConsultationRequest = {
      id: Date.now().toString(),
      question: question.trim(),
      category: categories.find(c => c.value === category)?.label || category,
      status: 'pending',
      timestamp: 'এখনই',
      priority: 'medium'
    };

    setConsultations(prev => [newConsultation, ...prev]);
    setQuestion("");
    setCategory("");

    toast({
      title: "প্রশ্ন জমা হয়েছে",
      description: "বিশেষজ্ঞ শীঘ্রই উত্তর দেবেন।",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">অপেক্ষমান</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">প্রক্রিয়াধীন</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">সম্পন্ন</Badge>;
      default:
        return <Badge variant="outline">অজানা</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'assigned':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 pb-20 space-y-4 pt-20">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <MessageSquare className="h-5 w-5 text-primary" />
              কৃষি পরামর্শ সেবা
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Question Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">প্রশ্ন করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ক্যাটেগরি নির্বাচন করুন</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background"
              >
                <option value="">ক্যাটেগরি নির্বাচন করুন</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">আপনার প্রশ্ন</label>
              <Textarea
                placeholder="আপনার কৃষি সমস্যা বা প্রশ্ন বিস্তারিত লিখুন..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">যোগাযোগের মাধ্যম</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'text', label: 'লিখিত উত্তর', icon: MessageSquare },
                  { value: 'voice', label: 'ভয়েস কল', icon: Phone },
                  { value: 'video', label: 'ভিডিও কল', icon: Video }
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setContactMethod(method.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${contactMethod === method.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                      }`}
                  >
                    <method.icon className="h-4 w-4" />
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleVoiceInput}
                disabled={isListening}
                className="flex-1"
              >
                <Mic className={`h-4 w-4 mr-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                {isListening ? "শুনছি..." : "ভয়েস দিয়ে বলুন"}
              </Button>
              <Button onClick={handleSubmitQuestion} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                প্রশ্ন পাঠান
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Experts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">উপলব্ধ বিশেষজ্ঞগণ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {experts.map((expert) => (
                <div key={expert.id} className={`border rounded-lg p-3 ${expert.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{expert.name}</h4>
                      <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                      <p className="text-xs text-muted-foreground">অভিজ্ঞতা: {expert.experience}</p>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">রেটিং: ⭐ {expert.rating}</div>
                        <div className="text-xs">
                          {expert.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={expert.available ? "default" : "secondary"}>
                        {expert.available ? "অনলাইন" : "অফলাইন"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Previous Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">আপনার পূর্ববর্তী প্রশ্ন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...consultations, ...mockConsultations].map((consultation) => (
                <div key={consultation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(consultation.status)}
                        <span className="font-semibold">{consultation.category}</span>
                        {getStatusBadge(consultation.status)}
                      </div>
                      <p className="text-sm">{consultation.question}</p>
                      {consultation.response && (
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm font-medium text-primary mb-1">
                            {consultation.expert} এর উত্তর:
                          </p>
                          <p className="text-sm">{consultation.response}</p>
                        </div>
                      )}
                    </div>
                    <TTSButton
                      text={`প্রশ্ন: ${consultation.question}${consultation.response ? `. উত্তর: ${consultation.response}` : ''}`}
                      authorName={consultation.expert}
                      size="icon"
                      variant="ghost"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{consultation.timestamp}</span>
                    {consultation.expert && (
                      <span>বিশেষজ্ঞ: {consultation.expert}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">জরুরি যোগাযোগ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>কৃষি কল সেন্টার:</strong> ১৬১২৩ (২৪/৭ সেবা)</p>
            <p><strong>জরুরি পরামর্শ:</strong> ০১৭৭৭-৭০০৮৮৮</p>
            <p><strong>কৃষি অধিদপ্তর হটলাইন:</strong> ৩৩৩</p>
            <p className="text-muted-foreground mt-2">
              জরুরি অবস্থায় সরাসরি ফোন করুন বা নিকটস্থ কৃষি অফিসে যোগাযোগ করুন।
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Consultation;