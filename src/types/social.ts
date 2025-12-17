// Social Feed Types - Enhanced for Facebook-like features

export type PostType = "general" | "marketplace" | "question" | "advice" | "expert_advice";

export type UserType = "farmer" | "customer" | "expert";

export interface PostAuthor {
    name: string;
    avatar?: string;
    location: string;
    verified?: boolean;
    isExpert?: boolean;
    userType: UserType;
}

export interface MarketplaceLink {
    title: string;
    price: number;
    category: string;
}

export interface SocialPost {
    id: string;
    author: PostAuthor;
    content: string;
    images: string[];
    type: PostType;
    marketplaceLink?: MarketplaceLink;
    likes: number;
    comments: number;
    reports?: number;
    postedAt: string;
    liked?: boolean;
    reported?: boolean;
    isOwnPost?: boolean;
}

export interface PostComment {
    id: string;
    author: {
        name: string;
        avatar?: string;
        userType: UserType;
        isExpert?: boolean;
    };
    content: string;
    postedAt: string;
    likes: number;
    liked?: boolean;
    replies: PostReply[];
}

export interface PostReply {
    id: string;
    author: {
        name: string;
        avatar?: string;
        userType: UserType;
        isExpert?: boolean;
    };
    content: string;
    postedAt: string;
    likes: number;
    liked?: boolean;
}

export interface PostReportReason {
    id: string;
    label: string;
    description: string;
}

export interface CommentReportReason {
    id: string;
    label: string;
    description: string;
}

// Report reasons for posts
export const POST_REPORT_REASONS: PostReportReason[] = [
    {
        id: "spam",
        label: "স্প্যাম",
        description: "অবাঞ্ছিত বা পুনরাবৃত্তিমূলক বিষয়বস্তু"
    },
    {
        id: "inappropriate",
        label: "অনুপযুক্ত",
        description: "অশ্লীল বা আক্রমণাত্মক বিষয়বস্তু"
    },
    {
        id: "false_info",
        label: "মিথ্যা তথ্য",
        description: "ভুল বা বিভ্রান্তিকর কৃষি তথ্য"
    },
    {
        id: "harassment",
        label: "হয়রানি",
        description: "অন্য ব্যবহারকারীকে হয়রানি করা"
    },
    {
        id: "copyright",
        label: "কপিরাইট লঙ্ঘন",
        description: "অন্যের বুদ্ধিবৃত্তিক সম্পদ চুরি"
    },
    {
        id: "other",
        label: "অন্যান্য",
        description: "অন্য কোনো সমস্যা"
    }
];

// Report reasons for comments
export const COMMENT_REPORT_REASONS: CommentReportReason[] = [
    {
        id: "spam",
        label: "স্প্যাম",
        description: "অবাঞ্ছিত মন্তব্য"
    },
    {
        id: "inappropriate",
        label: "অনুপযুক্ত",
        description: "অশ্লীল বা আক্রমণাত্মক মন্তব্য"
    },
    {
        id: "harassment",
        label: "হয়রানি",
        description: "অন্য ব্যবহারকারীকে হয়রানি"
    },
    {
        id: "false_advice",
        label: "ভুল পরামর্শ",
        description: "ক্ষতিকর বা ভুল কৃষি পরামর্শ"
    },
    {
        id: "other",
        label: "অন্যান্য",
        description: "অন্য কোনো সমস্যা"
    }
];

export interface FeedFilter {
    id: string;
    label: string;
    icon: any;
    userTypes?: UserType[];
}

// Feed filters for different user types
export const FEED_FILTERS: FeedFilter[] = [
    {
        id: "all",
        label: "সব",
        icon: "Users"
    },
    {
        id: "general",
        label: "সাধারণ",
        icon: "Users"
    },
    {
        id: "marketplace",
        label: "বাজার",
        icon: "TrendingUp"
    },
    {
        id: "question",
        label: "প্রশ্ন",
        icon: "Zap"
    },
    {
        id: "advice",
        label: "পরামর্শ",
        icon: "MessageSquare"
    },
    {
        id: "expert_advice",
        label: "বিশেষজ্ঞ পরামর্শ",
        icon: "UserCheck",
        userTypes: ["expert"]
    }
];

// Report Management Types
export type ReportType = "post" | "comment";
export type ReportStatus = "pending" | "accepted" | "declined";

export interface ReportDetail {
    id: string;
    reportType: ReportType;
    contentId: string; // Post ID or Comment ID
    postId?: string; // Only for comment reports
    reportedBy: {
        id: string;
        name: string;
        userType: UserType;
    };
    reason: PostReportReason | CommentReportReason;
    description?: string;
    reportedAt: string;
    status: ReportStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    content: {
        text: string;
        author: PostAuthor;
        postedAt: string;
        images?: string[];
    };
}

export interface ReportStats {
    totalReports: number;
    pendingReports: number;
    acceptedReports: number;
    declinedReports: number;
    postReports: number;
    commentReports: number;
}