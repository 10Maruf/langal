-- =====================================================
-- Social Feed System Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Post Information
-- Shows posts with author details and engagement metrics
CREATE VIEW `v_posts_with_author` AS
SELECT
    p.post_id,
    p.content,
    p.post_type,
    p.marketplace_listing_id,
    p.images,
    p.location,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    p.is_pinned,
    p.is_reported,
    p.created_at,
    p.updated_at,
    -- Author information
    u.user_id as author_id,
    u.user_type as author_type,
    prof.full_name as author_name,
    prof.district as author_district,
    prof.profile_photo_url as author_photo
FROM
    posts p
    INNER JOIN users u ON p.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
WHERE
    p.is_deleted = FALSE;

-- View: Post Tags with Usage
-- Shows all post tags with their usage count and related posts
CREATE VIEW `v_post_tags_with_usage` AS
SELECT
    pt.tag_id,
    pt.tag_name,
    pt.usage_count,
    pt.created_at,
    COUNT(ptr.post_id) as current_usage_count,
    GROUP_CONCAT(DISTINCT ptr.post_id) as related_post_ids
FROM
    post_tags pt
    LEFT JOIN post_tag_relations ptr ON pt.tag_id = ptr.tag_id
GROUP BY
    pt.tag_id,
    pt.tag_name,
    pt.usage_count,
    pt.created_at
ORDER BY pt.usage_count DESC;

-- View: Comments with Author Details
-- Shows comments with author information and engagement
CREATE VIEW `v_comments_with_author` AS
SELECT
    c.comment_id,
    c.post_id,
    c.content,
    c.parent_comment_id,
    c.likes_count,
    c.is_reported,
    c.created_at,
    c.updated_at,
    -- Author information
    u.user_id as author_id,
    u.user_type as author_type,
    prof.full_name as author_name,
    prof.district as author_district,
    prof.profile_photo_url as author_photo,
    -- Parent comment info (for replies)
    parent_u.user_id as parent_author_id,
    parent_prof.full_name as parent_author_name
FROM
    comments c
    INNER JOIN users u ON c.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN comments parent_c ON c.parent_comment_id = parent_c.comment_id
    LEFT JOIN users parent_u ON parent_c.author_id = parent_u.user_id
    LEFT JOIN user_profiles parent_prof ON parent_u.user_id = parent_prof.user_id
WHERE
    c.is_deleted = FALSE;

-- View: Post Engagement Summary
-- Aggregated engagement metrics for posts
CREATE VIEW `v_post_engagement_summary` AS
SELECT
    p.post_id,
    p.post_type,
    p.location,
    p.created_at,
    -- Author info
    prof.full_name as author_name,
    prof.district as author_district,
    -- Engagement metrics
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    (
        p.likes_count + p.comments_count + p.shares_count
    ) as total_interactions,
    -- Engagement rate calculation
    CASE
        WHEN p.views_count > 0 THEN ROUND(
            (
                (
                    p.likes_count + p.comments_count + p.shares_count
                ) / p.views_count
            ) * 100,
            2
        )
        ELSE 0
    END as engagement_rate_percent,
    -- Tags
    GROUP_CONCAT(DISTINCT pt.tag_name) as tags
FROM
    posts p
    INNER JOIN users u ON p.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN post_tag_relations ptr ON p.post_id = ptr.post_id
    LEFT JOIN post_tags pt ON ptr.tag_id = pt.tag_id
WHERE
    p.is_deleted = FALSE
GROUP BY
    p.post_id,
    p.post_type,
    p.location,
    p.created_at,
    prof.full_name,
    prof.district,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count;

-- View: Popular Posts (Last 7 days)
-- Shows most popular posts from the last week
CREATE VIEW `v_popular_posts_weekly` AS
SELECT
    p.post_id,
    p.content,
    p.post_type,
    p.location,
    p.created_at,
    -- Author info
    prof.full_name as author_name,
    prof.district as author_district,
    -- Engagement metrics
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    (
        p.likes_count + p.comments_count + p.shares_count
    ) as total_interactions
FROM
    posts p
    INNER JOIN users u ON p.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
WHERE
    p.is_deleted = FALSE
    AND p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY total_interactions DESC, p.views_count DESC
LIMIT 50;

-- View: User Social Activity
-- Shows user's social media activity summary
CREATE VIEW `v_user_social_activity` AS
SELECT
    u.user_id,
    prof.full_name,
    prof.district,
    u.user_type,
    -- Post statistics
    COUNT(DISTINCT p.post_id) as total_posts,
    COUNT(
        DISTINCT CASE
            WHEN p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN p.post_id
        END
    ) as posts_last_30_days,
    AVG(p.likes_count) as avg_post_likes,
    AVG(p.comments_count) as avg_post_comments,
    -- Comment statistics
    COUNT(DISTINCT c.comment_id) as total_comments,
    COUNT(
        DISTINCT CASE
            WHEN c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN c.comment_id
        END
    ) as comments_last_30_days,
    -- Like statistics
    COUNT(DISTINCT pl.like_id) as total_likes_given,
    COUNT(
        DISTINCT CASE
            WHEN pl.liked_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN pl.like_id
        END
    ) as likes_given_last_30_days
FROM
    users u
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN posts p ON u.user_id = p.author_id
    AND p.is_deleted = FALSE
    LEFT JOIN comments c ON u.user_id = c.author_id
    AND c.is_deleted = FALSE
    LEFT JOIN post_likes pl ON u.user_id = pl.user_id
GROUP BY
    u.user_id,
    prof.full_name,
    prof.district,
    u.user_type;

-- View: Trending Tags (Last 30 days)
-- Shows trending hashtags based on recent usage
CREATE VIEW `v_trending_tags_monthly` AS
SELECT
    pt.tag_id,
    pt.tag_name,
    COUNT(ptr.post_id) as usage_last_30_days,
    COUNT(DISTINCT p.author_id) as unique_users_using,
    AVG(
        p.likes_count + p.comments_count + p.shares_count
    ) as avg_engagement_per_post,
    MAX(p.created_at) as last_used_at
FROM
    post_tags pt
    INNER JOIN post_tag_relations ptr ON pt.tag_id = ptr.tag_id
    INNER JOIN posts p ON ptr.post_id = p.post_id
WHERE
    p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND p.is_deleted = FALSE
GROUP BY
    pt.tag_id,
    pt.tag_name
HAVING
    usage_last_30_days >= 3
ORDER BY
    usage_last_30_days DESC,
    avg_engagement_per_post DESC;

-- View: Post Comments Tree
-- Hierarchical view of comments and replies
CREATE VIEW `v_post_comments_tree` AS
SELECT
    c.comment_id,
    c.post_id,
    c.content,
    c.parent_comment_id,
    c.likes_count,
    c.created_at,
    -- Author info
    prof.full_name as author_name,
    prof.district as author_district,
    u.user_type as author_type,
    -- Comment level (0 = top level, 1 = reply, etc.)
    CASE
        WHEN c.parent_comment_id IS NULL THEN 0
        ELSE 1
    END as comment_level,
    -- Parent comment content (for context)
    parent_c.content as parent_comment_content,
    parent_prof.full_name as parent_author_name
FROM
    comments c
    INNER JOIN users u ON c.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN comments parent_c ON c.parent_comment_id = parent_c.comment_id
    LEFT JOIN users parent_u ON parent_c.author_id = parent_u.user_id
    LEFT JOIN user_profiles parent_prof ON parent_u.user_id = parent_prof.user_id
WHERE
    c.is_deleted = FALSE
ORDER BY c.post_id, c.parent_comment_id, c.created_at;

-- View: Posts by Location
-- Groups posts by location with engagement metrics
CREATE VIEW `v_posts_by_location` AS
SELECT
    p.location,
    COUNT(*) as total_posts,
    COUNT(DISTINCT p.author_id) as unique_authors,
    AVG(p.likes_count) as avg_likes,
    AVG(p.comments_count) as avg_comments,
    AVG(p.views_count) as avg_views,
    MAX(p.created_at) as latest_post_date,
    MIN(p.created_at) as earliest_post_date
FROM posts p
WHERE
    p.is_deleted = FALSE
    AND p.location IS NOT NULL
    AND p.location != ''
GROUP BY
    p.location
HAVING
    total_posts >= 1
ORDER BY total_posts DESC;