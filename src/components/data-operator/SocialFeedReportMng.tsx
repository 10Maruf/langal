import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CheckCircle,
    XCircle,
    Flag,
    MessageSquare,
    FileText,
    Clock,
    User,
    Calendar,
    AlertTriangle,
    Trash2,
    Eye,
    ArrowLeft
} from "lucide-react";
import { ReportDetail, ReportStats, ReportStatus } from "@/types/social";
import { SocialFeedReportService } from "@/services/socialFeedReportService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";

const SocialFeedReportMng = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<ReportDetail[]>([]);
    const [stats, setStats] = useState<ReportStats>({
        totalReports: 0,
        pendingReports: 0,
        acceptedReports: 0,
        declinedReports: 0,
        postReports: 0,
        commentReports: 0
    });
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
    const [viewDetailsReport, setViewDetailsReport] = useState<ReportDetail | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const { toast } = useToast();

    const reportService = SocialFeedReportService.getInstance();

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const allReports = await reportService.getAllReports();
            const reportStats = await reportService.getReportStats();
            setReports(allReports);
            setStats(reportStats);
        } catch (error) {
            console.error('Error loading reports:', error);
            toast({
                title: "ত্রুটি",
                description: "রিপোর্ট লোড করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptReport = async (reportId: string, deleteContent: boolean = true) => {
        try {
            await reportService.acceptReport(reportId, deleteContent, adminNote);
            await loadReports();
            setSelectedReport(null);
            setAdminNote("");
            toast({
                title: "সফল",
                description: `রিপোর্ট গ্রহণ করা হয়েছে${deleteContent ? ' এবং কন্টেন্ট মুছে ফেলা হয়েছে' : ''}`,
            });
        } catch (error) {
            console.error('Error accepting report:', error);
            toast({
                title: "ত্রুটি",
                description: "রিপোর্ট গ্রহণ করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        }
    };

    const handleDeclineReport = async (reportId: string) => {
        try {
            await reportService.declineReport(reportId, adminNote);
            await loadReports();
            setSelectedReport(null);
            setAdminNote("");
            toast({
                title: "সফল",
                description: "রিপোর্ট প্রত্যাখ্যান করা হয়েছে",
            });
        } catch (error) {
            console.error('Error declining report:', error);
            toast({
                title: "ত্রুটি",
                description: "রিপোর্ট প্রত্যাখ্যান করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />অপেক্ষমান</Badge>;
            case "accepted":
                return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />গৃহীত</Badge>;
            case "declined":
                return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />প্রত্যাখ্যাত</Badge>;
            default:
                return <Badge variant="outline">অজানা</Badge>;
        }
    };

    const getReportTypeIcon = (type: string) => {
        return type === "post" ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
    };

    const filteredReports = reports.filter(report => {
        if (activeTab === "all") return true;
        return report.status === activeTab;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">লোড হচ্ছে...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DataOperatorHeader />
            
            <div className="p-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/data-operator-dashboard')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">সোশ্যাল ফিড রিপোর্ট ম্যানেজমেন্ট</h1>
                        <p className="text-gray-600">পোস্ট এবং কমেন্টের রিপোর্ট পরিচালনা করুন</p>
                    </div>
                </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">মোট রিপোর্ট</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalReports}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">অপেক্ষমান</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">গৃহীত</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.acceptedReports}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Reports List */}
            <Card>
                <CardHeader>
                    <CardTitle>রিপোর্ট তালিকা</CardTitle>
                    <CardDescription>
                        সোশ্যাল ফিডে রিপোর্ট করা পোস্ট এবং কমেন্টগুলি দেখুন এবং পরিচালনা করুন
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="pending">অপেক্ষমান ({stats.pendingReports})</TabsTrigger>
                            <TabsTrigger value="accepted">গৃহীত ({stats.acceptedReports})</TabsTrigger>
                            <TabsTrigger value="declined">প্রত্যাখ্যাত ({stats.declinedReports})</TabsTrigger>
                            <TabsTrigger value="all">সব ({stats.totalReports})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-4">
                            {filteredReports.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    কোন রিপোর্ট খুঁজে পাওয়া যায়নি
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredReports.map((report) => (
                                        <Card key={report.id} className="border-l-4 border-l-red-500">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            {getReportTypeIcon(report.reportType)}
                                                            <Badge variant="outline">
                                                                {report.reportType === "post" ? "পোস্ট" : "কমেন্ট"}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <span className="font-medium">কারণ:</span>
                                                                <Badge variant="destructive">{report.reason.label}</Badge>
                                                                {getStatusBadge(report.status)}
                                                            </div>

                                                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Avatar className="w-6 h-6">
                                                                            <AvatarImage src={report.content.author.avatar} />
                                                                            <AvatarFallback>
                                                                                {report.content.author.name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-sm font-medium">{report.content.author.name}</span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {formatDate(report.content.postedAt)}
                                                                        </span>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setViewDetailsReport(report)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        <Eye className="w-3 h-3 mr-1" />
                                                                        বিস্তারিত
                                                                    </Button>
                                                                </div>
                                                                <p className="text-sm text-gray-700 line-clamp-3">
                                                                    {report.content.text}
                                                                </p>
                                                                {report.content.images && report.content.images.length > 0 && (
                                                                    <div className="mt-2 flex gap-2 overflow-x-auto">
                                                                        {report.content.images.map((image, idx) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={image}
                                                                                alt={`পোস্ট ছবি ${idx + 1}`}
                                                                                className="h-20 w-20 object-cover rounded border"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="text-sm text-gray-600">
                                                                <div className="flex items-center space-x-2">
                                                                    <Avatar className="w-6 h-6">
                                                                        <AvatarImage src={report.reportedBy.avatar} />
                                                                        <AvatarFallback>
                                                                            {report.reportedBy.name.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <span>রিপোর্টকারী: {report.reportedBy.name}</span>
                                                                    <span className="text-gray-400">•</span>
                                                                    <span>তারিখ: {formatDate(report.reportedAt)}</span>
                                                                </div>
                                                                {report.description && (
                                                                    <p className="mt-1 italic">"{report.description}"</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {report.status === "pending" && (
                                                        <div className="flex space-x-2">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => setSelectedReport(report)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                                        গ্রহণ করুন
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>রিপোর্ট গ্রহণ করুন</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            আপনি কি নিশ্চিত যে এই রিপোর্ট গ্রহণ করতে চান এবং কন্টেন্ট মুছে ফেলতে চান?
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <div className="my-4">
                                                                        <label className="text-sm font-medium">প্রশাসনিক নোট (ঐচ্ছিক):</label>
                                                                        <Textarea
                                                                            placeholder="এই সিদ্ধান্তের কারণ লিখুন..."
                                                                            value={adminNote}
                                                                            onChange={(e) => setAdminNote(e.target.value)}
                                                                            className="mt-1"
                                                                        />
                                                                    </div>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => setAdminNote("")}>
                                                                            বাতিল
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => selectedReport && handleAcceptReport(selectedReport.id, true)}
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                                            গ্রহণ করুন ও মুছে দিন
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>

                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSelectedReport(report)}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-1" />
                                                                        প্রত্যাখ্যান
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>রিপোর্ট প্রত্যাখ্যান করুন</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            আপনি কি নিশ্চিত যে এই রিপোর্ট প্রত্যাখ্যান করতে চান? কন্টেন্ট অপরিবর্তিত থাকবে।
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <div className="my-4">
                                                                        <label className="text-sm font-medium">প্রশাসনিক নোট (ঐচ্ছিক):</label>
                                                                        <Textarea
                                                                            placeholder="এই সিদ্ধান্তের কারণ লিখুন..."
                                                                            value={adminNote}
                                                                            onChange={(e) => setAdminNote(e.target.value)}
                                                                            className="mt-1"
                                                                        />
                                                                    </div>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel onClick={() => setAdminNote("")}>
                                                                            বাতিল
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => selectedReport && handleDeclineReport(selectedReport.id)}
                                                                        >
                                                                            প্রত্যাখ্যান করুন
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Detailed Post View Dialog */}
            <Dialog open={!!viewDetailsReport} onOpenChange={(open) => !open && setViewDetailsReport(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {viewDetailsReport && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {getReportTypeIcon(viewDetailsReport.reportType)}
                                    {viewDetailsReport.reportType === "post" ? "পোস্টের" : "কমেন্টের"} বিস্তারিত তথ্য
                                </DialogTitle>
                                <DialogDescription>
                                    রিপোর্ট আইডি: {viewDetailsReport.id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-4">
                                {/* Report Info */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-red-900">রিপোর্টের তথ্য</h3>
                                        {getStatusBadge(viewDetailsReport.status)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">কারণ:</span>
                                            <Badge variant="destructive" className="ml-2">
                                                {viewDetailsReport.reason.label}
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">রিপোর্টের তারিখ:</span>
                                            <span className="ml-2">{formatDate(viewDetailsReport.reportedAt)}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-700">বিবরণ:</span>
                                            <p className="mt-1 text-gray-600">{viewDetailsReport.reason.description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Reporter Info */}
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <span className="font-medium text-gray-700 block mb-2">রিপোর্টকারী:</span>
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={viewDetailsReport.reportedBy.avatar} />
                                                <AvatarFallback>
                                                    {viewDetailsReport.reportedBy.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{viewDetailsReport.reportedBy.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {viewDetailsReport.reportedBy.userType === 'farmer' ? 'কৃষক' : 
                                                     viewDetailsReport.reportedBy.userType === 'expert' ? 'বিশেষজ্ঞ' : 
                                                     'ডেটা অপারেটর'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        {viewDetailsReport.reportType === "post" ? "পোস্টের" : "কমেন্টের"} বিষয়বস্তু
                                    </h3>
                                    
                                    {/* Author Info */}
                                    <div className="flex items-center space-x-3 mb-3 pb-3 border-b">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={viewDetailsReport.content.author.avatar} />
                                            <AvatarFallback>
                                                {viewDetailsReport.content.author.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{viewDetailsReport.content.author.name}</p>
                                                {viewDetailsReport.content.author.verified && (
                                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                                )}
                                                {viewDetailsReport.content.author.isExpert && (
                                                    <Badge variant="outline" className="text-xs">বিশেষজ্ঞ</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{viewDetailsReport.content.author.location}</p>
                                            <p className="text-xs text-gray-400">{formatDate(viewDetailsReport.content.postedAt)}</p>
                                        </div>
                                    </div>

                                    {/* Full Content */}
                                    <div className="space-y-3">
                                        <div className="prose max-w-none">
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                {viewDetailsReport.content.text}
                                            </p>
                                        </div>

                                        {/* Images - Full Size */}
                                        {viewDetailsReport.content.images && viewDetailsReport.content.images.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    সংযুক্ত ছবি ({viewDetailsReport.content.images.length}টি):
                                                </p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {viewDetailsReport.content.images.map((image, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`ছবি ${idx + 1}`}
                                                                className="w-full h-auto rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer"
                                                                onClick={() => window.open(image, '_blank')}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                                                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {viewDetailsReport.status === "pending" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => setSelectedReport(viewDetailsReport)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    রিপোর্ট গ্রহণ করুন
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>রিপোর্ট গ্রহণ করুন</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        আপনি কি নিশ্চিত যে এই রিপোর্ট গ্রহণ করতে চান এবং কন্টেন্ট মুছে ফেলতে চান?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="my-4">
                                                    <label className="text-sm font-medium">প্রশাসনিক নোট (ঐচ্ছিক):</label>
                                                    <Textarea
                                                        placeholder="এই সিদ্ধান্তের কারণ লিখুন..."
                                                        value={adminNote}
                                                        onChange={(e) => setAdminNote(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setAdminNote("")}>
                                                        বাতিল
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            if (selectedReport) {
                                                                handleAcceptReport(selectedReport.id, true);
                                                                setViewDetailsReport(null);
                                                            }
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        গ্রহণ করুন ও মুছে দিন
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => setSelectedReport(viewDetailsReport)}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    রিপোর্ট প্রত্যাখ্যান করুন
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>রিপোর্ট প্রত্যাখ্যান করুন</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        আপনি কি নিশ্চিত যে এই রিপোর্ট প্রত্যাখ্যান করতে চান? কন্টেন্ট অপরিবর্তিত থাকবে।
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="my-4">
                                                    <label className="text-sm font-medium">প্রশাসনিক নোট (ঐচ্ছিক):</label>
                                                    <Textarea
                                                        placeholder="এই সিদ্ধান্তের কারণ লিখুন..."
                                                        value={adminNote}
                                                        onChange={(e) => setAdminNote(e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setAdminNote("")}>
                                                        বাতিল
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            if (selectedReport) {
                                                                handleDeclineReport(selectedReport.id);
                                                                setViewDetailsReport(null);
                                                            }
                                                        }}
                                                    >
                                                        প্রত্যাখ্যান করুন
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}

                                {/* Review Info for accepted/declined reports */}
                                {viewDetailsReport.status !== "pending" && viewDetailsReport.reviewedAt && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-blue-900 mb-2">পর্যালোচনার তথ্য</h3>
                                        <div className="text-sm space-y-1">
                                            <p>
                                                <span className="font-medium">স্ট্যাটাস:</span> 
                                                <span className="ml-2">{getStatusBadge(viewDetailsReport.status)}</span>
                                            </p>
                                            <p>
                                                <span className="font-medium">পর্যালোচনার তারিখ:</span>
                                                <span className="ml-2">{formatDate(viewDetailsReport.reviewedAt)}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            </div>        </div>
    );
};

export default SocialFeedReportMng;
