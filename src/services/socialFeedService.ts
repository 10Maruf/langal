// Central Social Feed Service - Facebook-like system for all user types
import axios from 'axios';
import { SocialPost, PostComment } from '@/types/social';
import { API_URL as BASE_API_URL } from './api';

const API_URL = `${BASE_API_URL}/social`;

export class SocialFeedService {
    private static instance: SocialFeedService;

    static getInstance(): SocialFeedService {
        if (!SocialFeedService.instance) {
            SocialFeedService.instance = new SocialFeedService();
        }
        return SocialFeedService.instance;
    }

    // Get all posts
    async getPosts(page = 1, limit = 10, userId?: number): Promise<SocialPost[]> {
        try {
            const response = await axios.get(`${API_URL}/posts`, {
                params: { 
                    page, 
                    limit,
                    user_id: userId 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    // Create a new post
    async createPost(postData: any): Promise<SocialPost | null> {
        try {
            // Prepare the payload with marketplace reference support
            const payload = {
                ...postData,
                // Include marketplace_listing_id if marketplace reference exists
                marketplace_listing_id: postData.marketplaceReference?.listing_id || null
            };
            
            console.log('[SocialFeedService] Creating post with payload:', payload);
            const response = await axios.post(`${API_URL}/posts`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            return null;
        }
    }

    // Like/Unlike a post
    async toggleLike(postId: string, userId: number): Promise<{ success: boolean, liked: boolean }> {
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/like`, { user_id: userId });
            return { success: true, liked: response.data.liked };
        } catch (error) {
            console.error('Error toggling like:', error);
            return { success: false, liked: false };
        }
    }

    // Toggle comment like (mock implementation for now)
    toggleCommentLike(postId: string, commentId: string): any {
        // TODO: Implement backend API for comment likes
        return null;
    }

    // Get comments for a post
    async getComments(postId: string): Promise<PostComment[]> {
        try {
            const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // Add a comment
    async addComment(postId: string, content: string, userId?: number): Promise<PostComment | null> {
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { 
                content,
                user_id: userId || 1 // Default to 1 for testing
            });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            return null;
        }
    }

    // Delete a post
    async deletePost(postId: string, userId?: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/posts/${postId}`, {
                data: { user_id: userId || 1 }
            });
            return true;
        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    }

    // Update post
    async updatePost(postId: string, updates: Partial<SocialPost>, userId?: number): Promise<SocialPost | null> {
        try {
            const response = await axios.put(`${API_URL}/posts/${postId}`, {
                ...updates,
                user_id: userId || 1
            });
            return response.data.post;
        } catch (error) {
            console.error('Error updating post:', error);
            return null;
        }
    }

    // Get user posts
    async getUserPosts(authorId: string, viewerId?: number): Promise<SocialPost[]> {
        try {
            const response = await axios.get(`${API_URL}/posts`, {
                params: { 
                    author_id: authorId,
                    user_id: viewerId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            return [];
        }
    }

    // Report a post (toggle)
    async reportPost(postId: string, reason: string, postType: string, userId?: number): Promise<{ reported: boolean; reports: number } | null> {
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/report`, {
                user_id: userId || 1,
                report_reason: reason,
                post_type: postType
            });
            return response.data;
        } catch (error) {
            console.error('Error reporting post:', error);
            return null;
        }
    }

    // Report a comment (toggle)
    async reportComment(postId: string, commentId: string, reason: string, userId?: number): Promise<{ reported: boolean } | null> {
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/comments/${commentId}/report`, {
                user_id: userId || 1,
                report_reason: reason
            });
            return response.data;
        } catch (error) {
            console.error('Error reporting comment:', error);
            return null;
        }
    }
}

export const socialFeedService = SocialFeedService.getInstance();
