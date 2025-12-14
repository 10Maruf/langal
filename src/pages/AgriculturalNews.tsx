import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { Newspaper, Calendar, ExternalLink, ArrowLeft, RefreshCw, Bell, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    category: 'policy' | 'market' | 'weather' | 'technology' | 'training' | 'subsidy';
    date: string;
    source: string;
    link?: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
}

const AgriculturalNews = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Mock news data
    const newsItems: NewsItem[] = [
        {
            id: '1',
            title: 'নতুন বীজ ভর্তুকি প্রকল্প ঘোষণা',
            summary: 'সরকার কৃষকদের জন্য ৫০% বীজ ভর্তুকি প্রকল্প ঘোষণা করেছে। আগামী মাসে আবেদন শুরু হবে।',
            category: 'subsidy',
            date: '২ ঘন্টা আগে',
            source: 'কৃষি মন্ত্রণালয়',
            priority: 'high',
            tags: ['বীজ', 'ভর্তুকি', 'আবেদন'],
            link: '#'
        },
        {
            id: '2',
            title: 'কৃষি প্রযুক্তি প্রশিক্ষণ কর্মসূচি',
            summary: 'আধুনিক কৃষি প্রযুক্তি ব্যবহারের উপর কৃষকদের জন্য বিনামূল্যে প্রশিক্ষণের আয়োজন করা হয়েছে।',
            category: 'training',
            date: '৪ ঘন্টা আগে',
            source: 'কৃষি সম্প্রসারণ অধিদপ্তর',
            priority: 'medium',
            tags: ['প্রশিক্ষণ', 'প্রযুক্তি', 'বিনামূল্যে'],
            link: '#'
        },
        {
            id: '3',
            title: 'আগামী সপ্তাহে ভারী বৃষ্টির সম্ভাবনা',
            summary: 'আবহাওয়া অধিদপ্তরের পূর্বাভাস অনুযায়ী আগামী ৩-৪ দিন ভারী বৃষ্টি হতে পারে। ফসল সুরক্ষার ব্যবস্থা নিন।',
            category: 'weather',
            date: '৬ ঘন্টা আগে',
            source: 'আবহাওয়া অধিদপ্তর',
            priority: 'high',
            tags: ['আবহাওয়া', 'বৃষ্টি', 'সতর্কতা'],
            link: '#'
        },
        {
            id: '4',
            title: 'কৃষি ঋণে নতুন সুদের হার ঘোষণা',
            summary: 'ব্যাংকগুলো কৃষি ঋণের সুদের হার ৯% থেকে কমিয়ে ৭% করেছে। এখনই আবেদন করার সুযোগ।',
            category: 'policy',
            date: '১ দিন আগে',
            source: 'বাংলাদেশ ব্যাংক',
            priority: 'medium',
            tags: ['ঋণ', 'সুদ', 'ব্যাংক'],
            link: '#'
        },
        {
            id: '5',
            title: 'স্মার্ট সেচ প্রযুক্তি চালু',
            summary: 'নতুন স্মার্ট সেচ প্রযুক্তি ব্যবহার করে ৩০% পানি সাositions এবং ফলন বৃদ্ধি সম্ভব।',
            category: 'technology',
            date: '২ দিন আগে',
            source: 'কৃষি গবেষণা ইনস্টিটিউট',
            priority: 'medium',
            tags: ['স্মার্ট', 'সেচ', 'প্রযুক্তি'],
            link: '#'
        },
        {
            id: '6',
            title: 'জৈব সার উৎপাদন প্রশিক্ষণ',
            summary: 'কৃষকদের জন্য জৈব সার উৎপাদনের উপর ৩ দিনের প্রশিক্ষণ কর্মসূচি। রেজিস্ট্রেশন চলছে।',
            category: 'training',
            date: '৩ দিন আগে',
            source: 'কৃষি সম্প্রসারণ অধিদপ্তর',
            priority: 'low',
            tags: ['জৈব সার', 'প্রশিক্ষণ', 'পরিবেশ'],
            link: '#'
        },
        {
            id: '7',
            title: 'নতুন কৃষি যন্ত্রপাতি ভর্তুকি',
            summary: 'ট্রাক্টর, পাওয়ার টিলার এবং অন্যান্য কৃষি যন্ত্রপাতি কেনার জন্য ৪০% ভর্তুকি দেওয়া হবে।',
            category: 'subsidy',
            date: '৪ দিন আগে',
            source: 'কৃষি মন্ত্রণালয়',
            priority: 'high',
            tags: ['যন্ত্রপাতি', 'ভর্তুকি', 'ট্রাক্টর'],
            link: '#'
        },
        {
            id: '8',
            title: 'কৃষি বিপণন সহায়তা কর্মসূচি',
            summary: 'কৃষকদের সরাসরি বিপণনের জন্য অনলাইন প্ল্যাটফর্ম চালু করা হয়েছে। কমিশন মুক্ত বিক্রয়।',
            category: 'market',
            date: '৫ দিন আগে',
            source: 'কৃষি বিপণন অধিদপ্তর',
            priority: 'medium',
            tags: ['বিপণন', 'অনলাইন', 'কমিশন মুক্ত'],
            link: '#'
        }
    ];

    const categories = [
        { key: 'all', label: 'সব সংবাদ', icon: Newspaper, color: 'bg-blue-100 text-blue-800' },
        { key: 'policy', label: 'নীতিমালা', icon: Calendar, color: 'bg-purple-100 text-purple-800' },
        { key: 'subsidy', label: 'ভর্তুকি', icon: Bell, color: 'bg-green-100 text-green-800' },
        { key: 'training', label: 'প্রশিক্ষণ', icon: ExternalLink, color: 'bg-orange-100 text-orange-800' },
        { key: 'weather', label: 'আবহাওয়া', icon: RefreshCw, color: 'bg-yellow-100 text-yellow-800' },
        { key: 'technology', label: 'প্রযুক্তি', icon: Filter, color: 'bg-indigo-100 text-indigo-800' },
        { key: 'market', label: 'বিপণন', icon: ExternalLink, color: 'bg-teal-100 text-teal-800' }
    ];

    const getFilteredNews = () => {
        if (selectedCategory === 'all') return newsItems;
        return newsItems.filter(item => item.category === selectedCategory);
    };

    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'policy': return 'bg-purple-100 text-purple-800';
            case 'subsidy': return 'bg-green-100 text-green-800';
            case 'training': return 'bg-orange-100 text-orange-800';
            case 'weather': return 'bg-yellow-100 text-yellow-800';
            case 'technology': return 'bg-indigo-100 text-indigo-800';
            case 'market': return 'bg-teal-100 text-teal-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'policy': return 'নীতিমালা';
            case 'subsidy': return 'ভর্তুকি';
            case 'training': return 'প্রশিক্ষণ';
            case 'weather': return 'আবহাওয়া';
            case 'technology': return 'প্রযুক্তি';
            case 'market': return 'বিপণন';
            default: return 'সাধারণ';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'জরুরি';
            case 'medium': return 'গুরুত্বপূর্ণ';
            case 'low': return 'সাধারণ';
            default: return 'সাধারণ';
        }
    };

    const handleRefresh = () => {
        toast({
            title: "সংবাদ আপডেট করা হয়েছে",
            description: "সর্বশেষ কৃষি সংবাদ লোড করা হয়েছে",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pb-20 pt-14">
                {/* Header */}
                <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Newspaper className="h-5 w-5 text-blue-600" />
                                কৃষি সংবাদ
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                সর্বশেষ আপডেট: {new Date().toLocaleTimeString('bn-BD')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TTSButton
                            text="কৃষি সংবাদ পাতা। এখানে সর্বশেষ কৃষি বিষয়ক সংবাদ দেখতে পাবেন।"
                            size="icon"
                            variant="ghost"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* News Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Bell className="h-8 w-8 text-red-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">জরুরি সংবাদ</p>
                                        <p className="font-semibold">
                                            {newsItems.filter(n => n.priority === 'high').length} টি
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <ExternalLink className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">ভর্তুকি সংবাদ</p>
                                        <p className="font-semibold">
                                            {newsItems.filter(n => n.category === 'subsidy').length} টি
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <Newspaper className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">মোট সংবাদ</p>
                                        <p className="font-semibold">{getFilteredNews().length} টি</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Filter */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.key}
                                            onClick={() => setSelectedCategory(category.key)}
                                            className={`px-3 py-2 rounded-full text-sm border transition-colors flex items-center gap-1 ${selectedCategory === category.key
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background border-border hover:bg-muted"
                                                }`}
                                        >
                                            <Icon className="h-3 w-3" />
                                            {category.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* News Items */}
                    <div className="space-y-4">
                        {getFilteredNews().map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <TTSButton
                                                    text={`${item.title}। ${item.summary}। উৎস: ${item.source}। প্রকাশ: ${item.date}`}
                                                    size="icon"
                                                    variant="ghost"
                                                />
                                                <Badge className={getPriorityBadgeColor(item.priority)}>
                                                    {getPriorityLabel(item.priority)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">{item.summary}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1">
                                            {item.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t">
                                            <div className="flex items-center gap-4 text-sm">
                                                <Badge className={getCategoryBadgeColor(item.category)}>
                                                    {getCategoryLabel(item.category)}
                                                </Badge>
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Newspaper className="h-3 w-3" />
                                                    {item.source}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.date}
                                                </span>

                                                {item.link && (
                                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                        <ExternalLink className="h-3 w-3" />
                                                        বিস্তারিত
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {getFilteredNews().length === 0 && (
                        <div className="text-center py-12">
                            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">কোন সংবাদ পাওয়া যায়নি</h3>
                            <p className="text-muted-foreground">
                                এই বিভাগে কোন সংবাদ পাওয়া যায়নি
                            </p>
                        </div>
                    )}

                    {/* Subscription Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <h3 className="text-lg font-semibold">সংবাদ সাবস্ক্রিপশন</h3>
                                <p className="text-muted-foreground text-sm">
                                    গুরুত্বপূর্ণ কৃষি সংবাদ SMS এ পেতে ১৬১২ৃ নম্বরে "NEWS" লিখে পাঠান
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Badge variant="outline" className="py-2 px-4">
                                        📞 সংবাদ হটলাইন: ১৬১২৩
                                    </Badge>
                                    <Badge variant="outline" className="py-2 px-4">
                                        📱 SMS: NEWS ১৬১২৩
                                    </Badge>
                                </div>
                                <Button variant="outline" size="sm">
                                    SMS সাবস্ক্রিপশন
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AgriculturalNews;
