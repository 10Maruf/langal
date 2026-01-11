import { ReportDetail, ReportStats, ReportType, PostReportReason, CommentReportReason, POST_REPORT_REASONS, COMMENT_REPORT_REASONS, UserType } from '@/types/social';
import { SocialFeedService } from './socialFeedService';
import axios from 'axios';
import { API_URL as BASE_API_URL } from './api';

const API_URL = `${BASE_API_URL}/social-feed-reports`;

export class SocialFeedReportService {
    private static instance: SocialFeedReportService;

    private constructor() {
        // No need for initialization anymore
    }

    static getInstance(): SocialFeedReportService {
        if (!SocialFeedReportService.instance) {
            SocialFeedReportService.instance = new SocialFeedReportService();
        }
        return SocialFeedReportService.instance;
    }

    // Get all reports with full details
    async getAllReports(): Promise<ReportDetail[]> {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            return [];
        }
    }
    async getAllReports(): Promise<ReportDetail[]> {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            return [];
        }
    }

    // Get report statistics
    async getReportStats(): Promise<ReportStats> {
        try {
            const response = await axios.get(`${API_URL}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching report stats:', error);
            return {
                totalReports: 0,
                pendingReports: 0,
                acceptedReports: 0,
                declinedReports: 0,
                postReports: 0,
                commentReports: 0
            };
        }
    }

    // Accept a report and optionally delete content
    async acceptReport(reportId: string, deleteContent: boolean = true, adminNote?: string): Promise<void> {
        try {
            await axios.post(`${API_URL}/${reportId}/accept`, {
                deleteContent,
                adminNote
            });
        } catch (error) {
            console.error('Error accepting report:', error);
            throw error;
        }
    }

    // Decline a report
    async declineReport(reportId: string, adminNote?: string): Promise<void> {
        try {
            await axios.post(`${API_URL}/${reportId}/decline`, {
                adminNote
            });
        } catch (error) {
            console.error('Error declining report:', error);
            throw error;
        }
    }

    // Get report by ID
    async getReportById(reportId: string): Promise<ReportDetail | null> {
        try {
            const reports = await this.getAllReports();
            return reports.find(r => r.id === reportId) || null;
        } catch (error) {
            console.error('Error fetching report by ID:', error);
            return null;
        }
    }
}

export default SocialFeedReportService;