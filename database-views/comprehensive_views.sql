-- =====================================================
-- Comprehensive Views for Analytics and Reporting
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete User Activity Dashboard
-- Comprehensive view combining all user activities across the platform
CREATE VIEW `v_comprehensive_user_activity` AS
SELECT
    u.user_id,
    prof.full_name as user_name,
    prof.district,
    prof.upazila,
    u.user_type,
    u.phone,
    u.is_verified,
    u.is_active,
    u.created_at as user_joined_date,
    DATEDIFF(NOW(), u.created_at) as days_since_joining,

-- Social activity
COALESCE(social_stats.total_posts, 0) as total_posts,
COALESCE(
    social_stats.total_comments,
    0
) as total_comments,
COALESCE(
    social_stats.total_likes_given,
    0
) as total_likes_given,
COALESCE(
    social_stats.total_likes_received,
    0
) as total_likes_received,
COALESCE(
    social_stats.posts_last_30_days,
    0
) as posts_last_30_days,

-- Marketplace activity
COALESCE(
    marketplace_stats.total_listings,
    0
) as total_marketplace_listings,
COALESCE(
    marketplace_stats.active_listings,
    0
) as active_marketplace_listings,
COALESCE(
    marketplace_stats.sold_listings,
    0
) as sold_marketplace_listings,
COALESCE(
    marketplace_stats.total_saves,
    0
) as total_marketplace_saves,

-- Consultation activity (farmers)
CASE
    WHEN u.user_type = 'farmer' THEN COALESCE(
        farmer_consultation_stats.total_consultations,
        0
    )
    ELSE 0
END as farmer_total_consultations,
CASE
    WHEN u.user_type = 'farmer' THEN COALESCE(
        farmer_consultation_stats.resolved_consultations,
        0
    )
    ELSE 0
END as farmer_resolved_consultations,

-- Expert activity
CASE
    WHEN u.user_type = 'expert' THEN COALESCE(
        expert_stats.total_consultations_handled,
        0
    )
    ELSE 0
END as expert_consultations_handled,
CASE
    WHEN u.user_type = 'expert' THEN COALESCE(
        expert_stats.total_diagnoses_verified,
        0
    )
    ELSE 0
END as expert_diagnoses_verified,
CASE
    WHEN u.user_type = 'expert' THEN COALESCE(expert_stats.expert_rating, 0)
    ELSE 0
END as expert_rating,

-- Diagnosis activity (farmers)
CASE
    WHEN u.user_type = 'farmer' THEN COALESCE(
        diagnosis_stats.total_diagnoses,
        0
    )
    ELSE 0
END as farmer_total_diagnoses,
CASE
    WHEN u.user_type = 'farmer' THEN COALESCE(
        diagnosis_stats.completed_diagnoses,
        0
    )
    ELSE 0
END as farmer_completed_diagnoses,

-- Data operator activity
CASE
    WHEN u.user_type = 'data_operator' THEN COALESCE(
        operator_stats.total_activities,
        0
    )
    ELSE 0
END as operator_total_activities,
CASE
    WHEN u.user_type = 'data_operator' THEN COALESCE(
        operator_stats.verifications_completed,
        0
    )
    ELSE 0
END as operator_verifications_completed,

-- Engagement score calculation
(
    COALESCE(social_stats.total_posts, 0) * 3 + COALESCE(
        social_stats.total_comments,
        0
    ) * 2 + COALESCE(
        social_stats.total_likes_given,
        0
    ) * 1 + COALESCE(
        marketplace_stats.total_listings,
        0
    ) * 5 + CASE
        WHEN u.user_type = 'farmer' THEN COALESCE(
            farmer_consultation_stats.total_consultations,
            0
        ) * 4
        ELSE 0
    END + CASE
        WHEN u.user_type = 'expert' THEN COALESCE(
            expert_stats.total_consultations_handled,
            0
        ) * 6
        ELSE 0
    END + CASE
        WHEN u.user_type = 'data_operator' THEN COALESCE(
            operator_stats.total_activities,
            0
        ) * 2
        ELSE 0
    END
) as engagement_score
FROM users u
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id

-- Social activity stats
LEFT JOIN (
    SELECT
        p.author_id as user_id,
        COUNT(DISTINCT p.post_id) as total_posts,
        COUNT(DISTINCT c.comment_id) as total_comments,
        COUNT(DISTINCT pl_given.like_id) as total_likes_given,
        COUNT(DISTINCT pl_received.like_id) as total_likes_received,
        COUNT(
            DISTINCT CASE
                WHEN p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN p.post_id
            END
        ) as posts_last_30_days
    FROM
        users u_sub
        LEFT JOIN posts p ON u_sub.user_id = p.author_id
        AND p.is_deleted = FALSE
        LEFT JOIN comments c ON u_sub.user_id = c.author_id
        AND c.is_deleted = FALSE
        LEFT JOIN post_likes pl_given ON u_sub.user_id = pl_given.user_id
        LEFT JOIN posts p_for_likes ON p_for_likes.author_id = u_sub.user_id
        LEFT JOIN post_likes pl_received ON p_for_likes.post_id = pl_received.post_id
    GROUP BY
        u_sub.user_id
) social_stats ON u.user_id = social_stats.user_id

-- Marketplace activity stats
LEFT JOIN (
    SELECT
        ml.seller_id as user_id,
        COUNT(*) as total_listings,
        COUNT(
            CASE
                WHEN ml.status = 'active' THEN ml.listing_id
            END
        ) as active_listings,
        COUNT(
            CASE
                WHEN ml.status = 'sold' THEN ml.listing_id
            END
        ) as sold_listings,
        COUNT(DISTINCT mls.save_id) as total_saves
    FROM
        marketplace_listings ml
        LEFT JOIN marketplace_listing_saves mls ON ml.listing_id = mls.listing_id
    GROUP BY
        ml.seller_id
) marketplace_stats ON u.user_id = marketplace_stats.user_id

-- Farmer consultation stats
LEFT JOIN (
    SELECT
        c.farmer_id as user_id,
        COUNT(*) as total_consultations,
        COUNT(
            CASE
                WHEN c.status = 'resolved' THEN c.consultation_id
            END
        ) as resolved_consultations
    FROM consultations c
    GROUP BY
        c.farmer_id
) farmer_consultation_stats ON u.user_id = farmer_consultation_stats.user_id

-- Expert stats
LEFT JOIN (
    SELECT
        eq.user_id,
        COUNT(DISTINCT c.consultation_id) as total_consultations_handled,
        COUNT(DISTINCT d.diagnosis_id) as total_diagnoses_verified,
        AVG(eq.rating) as expert_rating
    FROM
        expert_qualifications eq
        LEFT JOIN consultations c ON eq.user_id = c.expert_id
        LEFT JOIN diagnoses d ON eq.user_id = d.expert_verification_id
    GROUP BY
        eq.user_id
) expert_stats ON u.user_id = expert_stats.user_id

-- Diagnosis stats (for farmers)
LEFT JOIN (
    SELECT
        d.farmer_id as user_id,
        COUNT(*) as total_diagnoses,
        COUNT(
            CASE
                WHEN d.status = 'completed' THEN d.diagnosis_id
            END
        ) as completed_diagnoses
    FROM diagnoses d
    GROUP BY
        d.farmer_id
) diagnosis_stats ON u.user_id = diagnosis_stats.user_id

-- Data operator stats
LEFT JOIN (
    SELECT
        do.user_id,
        COUNT(DISTINCT doal.log_id) as total_activities,
        COUNT(DISTINCT pvr.record_id) + COUNT(DISTINCT cvr.record_id) as verifications_completed
    FROM
        data_operators do
        LEFT JOIN data_operator_activity_logs doal ON do.operator_id = doal.operator_id
        LEFT JOIN profile_verification_records pvr ON do.operator_id = pvr.operator_id
        LEFT JOIN crop_verification_records cvr ON do.operator_id = cvr.operator_id
    GROUP BY
        do.user_id
) operator_stats ON u.user_id = operator_stats.user_id
ORDER BY engagement_score DESC;

-- View: Location-based Agricultural Intelligence
-- Comprehensive agricultural insights by geographic location
CREATE VIEW `v_location_agricultural_intelligence` AS
SELECT location_data.location, location_data.district, location_data.division,

-- User demographics
user_demographics.total_users,
user_demographics.farmers_count,
user_demographics.experts_count,
user_demographics.customers_count,
user_demographics.verified_users,

-- Agricultural activity
agricultural_activity.total_consultations,
agricultural_activity.total_diagnoses,
agricultural_activity.active_marketplace_listings,
agricultural_activity.total_posts,

-- Weather and environment
weather_data.avg_temperature,
weather_data.avg_rainfall,
weather_data.avg_humidity,
weather_data.weather_records_count,

-- Market insights
market_insights.crops_in_market,
market_insights.avg_market_price,
market_insights.price_trend_positive,

-- Crop recommendations
crop_recommendations.total_recommendations,
crop_recommendations.most_recommended_crop,
crop_recommendations.avg_profit_potential,

-- Disease outbreaks
disease_activity.active_disease_cases,
disease_activity.most_common_disease,
disease_activity.affected_area,

-- Activity score calculation
(
    user_demographics.total_users * 0.1 + agricultural_activity.total_consultations * 0.2 + agricultural_activity.total_diagnoses * 0.2 + agricultural_activity.active_marketplace_listings * 0.1 + weather_data.weather_records_count * 0.05 + market_insights.crops_in_market * 0.1 + crop_recommendations.total_recommendations * 0.15 + COALESCE(
        disease_activity.active_disease_cases,
        0
    ) * -0.1
) as agricultural_activity_score
FROM (
        -- Base location data
        SELECT DISTINCT
            COALESCE(up.district, 'Unknown') as location,
            up.district,
            up.division
        FROM user_profiles up
        WHERE
            up.district IS NOT NULL
    ) location_data
    LEFT JOIN (
        -- User demographics by location
        SELECT
            prof.district as location,
            COUNT(DISTINCT u.user_id) as total_users,
            COUNT(
                DISTINCT CASE
                    WHEN u.user_type = 'farmer' THEN u.user_id
                END
            ) as farmers_count,
            COUNT(
                DISTINCT CASE
                    WHEN u.user_type = 'expert' THEN u.user_id
                END
            ) as experts_count,
            COUNT(
                DISTINCT CASE
                    WHEN u.user_type = 'customer' THEN u.user_id
                END
            ) as customers_count,
            COUNT(
                DISTINCT CASE
                    WHEN u.is_verified = TRUE THEN u.user_id
                END
            ) as verified_users
        FROM users u
            LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
        WHERE
            prof.district IS NOT NULL
        GROUP BY
            prof.district
    ) user_demographics ON location_data.district = user_demographics.location
    LEFT JOIN (
        -- Agricultural activity by location
        SELECT
            farmer_prof.district as location,
            COUNT(DISTINCT c.consultation_id) as total_consultations,
            COUNT(DISTINCT d.diagnosis_id) as total_diagnoses,
            COUNT(DISTINCT ml.listing_id) as active_marketplace_listings,
            COUNT(DISTINCT p.post_id) as total_posts
        FROM
            user_profiles farmer_prof
            LEFT JOIN users farmer_u ON farmer_prof.user_id = farmer_u.user_id
            LEFT JOIN consultations c ON farmer_u.user_id = c.farmer_id
            LEFT JOIN diagnoses d ON farmer_u.user_id = d.farmer_id
            LEFT JOIN marketplace_listings ml ON farmer_u.user_id = ml.seller_id
            AND ml.status = 'active'
            LEFT JOIN posts p ON farmer_u.user_id = p.author_id
            AND p.is_deleted = FALSE
        WHERE
            farmer_prof.district IS NOT NULL
        GROUP BY
            farmer_prof.district
    ) agricultural_activity ON location_data.district = agricultural_activity.location
    LEFT JOIN (
        -- Weather data by location
        SELECT
            wd.location,
            AVG(wd.temperature_max) as avg_temperature,
            AVG(wd.rainfall) as avg_rainfall,
            AVG(wd.humidity) as avg_humidity,
            COUNT(*) as weather_records_count
        FROM weather_data wd
        WHERE
            wd.date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
        GROUP BY
            wd.location
    ) weather_data ON location_data.district = weather_data.location
    LEFT JOIN (
        -- Market insights by location
        SELECT
            mp.market_location as location,
            COUNT(DISTINCT mp.crop_name) as crops_in_market,
            AVG(mp.price_per_unit) as avg_market_price,
            COUNT(
                CASE
                    WHEN mp.price_trend = 'up' THEN mp.price_id
                END
            ) as price_trend_positive
        FROM market_prices mp
        WHERE
            mp.price_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY
            mp.market_location
    ) market_insights ON location_data.district = market_insights.location
    LEFT JOIN (
        -- Crop recommendations by location
        SELECT
            cr.location,
            COUNT(*) as total_recommendations,
            MODE () WITHIN GROUP (
                ORDER BY JSON_UNQUOTE(
                        JSON_EXTRACT(
                            cr.recommended_crops, '$[0].crop_name'
                        )
                    )
            ) as most_recommended_crop,
            AVG(
                CAST(
                    JSON_UNQUOTE(
                        JSON_EXTRACT(
                            cr.profitability_analysis,
                            '$.total_profit'
                        )
                    ) AS DECIMAL(10, 2)
                )
            ) as avg_profit_potential
        FROM crop_recommendations cr
        WHERE
            cr.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
        GROUP BY
            cr.location
    ) crop_recommendations ON location_data.district = crop_recommendations.location
    LEFT JOIN (
        -- Disease activity by location
        SELECT
            farmer_prof.district as location,
            COUNT(DISTINCT d.diagnosis_id) as active_disease_cases,
            MODE () WITHIN GROUP (
                ORDER BY dt.disease_name
            ) as most_common_disease,
            SUM(d.farm_area) as affected_area
        FROM
            diagnoses d
            INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
            LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
            LEFT JOIN disease_treatments dt ON d.diagnosis_id = dt.diagnosis_id
        WHERE
            d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND farmer_prof.district IS NOT NULL
        GROUP BY
            farmer_prof.district
    ) disease_activity ON location_data.district = disease_activity.location
ORDER BY agricultural_activity_score DESC;

-- View: Platform Health and Analytics Dashboard
-- Comprehensive platform analytics for administrative monitoring
CREATE VIEW `v_platform_analytics_dashboard` AS
SELECT
    -- User growth metrics
    users_total.total_users, users_growth.new_users_this_month, users_growth.new_users_last_month, users_active.active_users_last_30_days, users_active.active_users_last_7_days,

-- Content creation metrics
content_creation.posts_this_month,
content_creation.marketplace_listings_this_month,
content_creation.consultations_this_month,
content_creation.diagnoses_this_month,

-- Engagement metrics
engagement.total_post_likes,
engagement.total_comments,
engagement.avg_posts_per_active_user,
engagement.marketplace_conversion_rate,

-- Service utilization
services.consultation_completion_rate,
services.diagnosis_completion_rate,
services.expert_utilization_rate,

-- Geographic distribution
geographic.top_district_by_users,
geographic.districts_with_activity,
geographic.locations_with_weather_data,

-- Revenue potential
revenue.total_consultation_fees_potential,
revenue.total_marketplace_transaction_value,

-- System health indicators
system_health.pending_verifications,
system_health.pending_reports,
system_health.active_data_operators,
system_health.system_uptime_score,

-- Growth rate calculations
CASE
    WHEN users_growth.new_users_last_month > 0 THEN ROUND(
        (
            (
                users_growth.new_users_this_month - users_growth.new_users_last_month
            ) / users_growth.new_users_last_month
        ) * 100,
        2
    )
    ELSE 0
END as user_growth_rate_percent,

-- Platform utilization score
ROUND(
    (
        users_active.active_users_last_30_days / GREATEST(users_total.total_users, 1)
    ) * 30 + (
        content_creation.posts_this_month / GREATEST(
            users_active.active_users_last_30_days,
            1
        )
    ) * 20 + (
        services.consultation_completion_rate
    ) * 25 + (
        services.diagnosis_completion_rate
    ) * 25,
    2
) as platform_utilization_score
FROM (
        SELECT COUNT(*) as total_users
        FROM users
        WHERE
            is_active = TRUE
    ) users_total
    CROSS JOIN (
        SELECT
            COUNT(
                CASE
                    WHEN MONTH(created_at) = MONTH(NOW())
                    AND YEAR(created_at) = YEAR(NOW()) THEN user_id
                END
            ) as new_users_this_month,
            COUNT(
                CASE
                    WHEN MONTH(created_at) = MONTH(
                        DATE_SUB(NOW(), INTERVAL 1 MONTH)
                    )
                    AND YEAR(created_at) = YEAR(
                        DATE_SUB(NOW(), INTERVAL 1 MONTH)
                    ) THEN user_id
                END
            ) as new_users_last_month
        FROM users
    ) users_growth
    CROSS JOIN (
        SELECT
            COUNT(
                DISTINCT CASE
                    WHEN us.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN us.user_id
                END
            ) as active_users_last_30_days,
            COUNT(
                DISTINCT CASE
                    WHEN us.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN us.user_id
                END
            ) as active_users_last_7_days
        FROM user_sessions us
        WHERE
            us.is_active = TRUE
    ) users_active
    CROSS JOIN (
        SELECT
            COUNT(
                CASE
                    WHEN MONTH(p.created_at) = MONTH(NOW()) THEN p.post_id
                END
            ) as posts_this_month,
            COUNT(
                CASE
                    WHEN MONTH(ml.created_at) = MONTH(NOW()) THEN ml.listing_id
                END
            ) as marketplace_listings_this_month,
            COUNT(
                CASE
                    WHEN MONTH(c.created_at) = MONTH(NOW()) THEN c.consultation_id
                END
            ) as consultations_this_month,
            COUNT(
                CASE
                    WHEN MONTH(d.created_at) = MONTH(NOW()) THEN d.diagnosis_id
                END
            ) as diagnoses_this_month
        FROM
            posts p
            CROSS JOIN marketplace_listings ml
            CROSS JOIN consultations c
            CROSS JOIN diagnoses d
        WHERE
            p.is_deleted = FALSE
    ) content_creation
    CROSS JOIN (
        SELECT
            COUNT(pl.like_id) as total_post_likes,
            COUNT(c.comment_id) as total_comments,
            ROUND(
                COUNT(p.post_id) / GREATEST(
                    COUNT(DISTINCT p.author_id),
                    1
                ),
                2
            ) as avg_posts_per_active_user,
            ROUND(
                (
                    COUNT(
                        CASE
                            WHEN ml.status = 'sold' THEN ml.listing_id
                        END
                    ) / GREATEST(COUNT(ml.listing_id), 1)
                ) * 100,
                2
            ) as marketplace_conversion_rate
        FROM
            posts p
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            LEFT JOIN comments c ON p.post_id = c.post_id
            CROSS JOIN marketplace_listings ml
        WHERE
            p.is_deleted = FALSE
            AND c.is_deleted = FALSE
    ) engagement
    CROSS JOIN (
        SELECT
            ROUND(
                (
                    COUNT(
                        CASE
                            WHEN cons.status = 'resolved' THEN cons.consultation_id
                        END
                    ) / GREATEST(
                        COUNT(cons.consultation_id),
                        1
                    )
                ) * 100,
                2
            ) as consultation_completion_rate,
            ROUND(
                (
                    COUNT(
                        CASE
                            WHEN diag.status = 'completed' THEN diag.diagnosis_id
                        END
                    ) / GREATEST(COUNT(diag.diagnosis_id), 1)
                ) * 100,
                2
            ) as diagnosis_completion_rate,
            ROUND(
                (
                    COUNT(DISTINCT cons.expert_id) / GREATEST(
                        (
                            SELECT COUNT(*)
                            FROM expert_qualifications
                        ),
                        1
                    )
                ) * 100,
                2
            ) as expert_utilization_rate
        FROM
            consultations cons
            CROSS JOIN diagnoses diag
    ) services
    CROSS JOIN (
        SELECT (
                SELECT prof.district
                FROM user_profiles prof
                    INNER JOIN users u ON prof.user_id = u.user_id
                GROUP BY
                    prof.district
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) as top_district_by_users,
            COUNT(DISTINCT prof.district) as districts_with_activity,
            (
                SELECT COUNT(DISTINCT location)
                FROM weather_data
                WHERE
                    date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ) as locations_with_weather_data
        FROM user_profiles prof
        WHERE
            prof.district IS NOT NULL
    ) geographic
    CROSS JOIN (
        SELECT
            SUM(cons.consultation_fee) as total_consultation_fees_potential,
            SUM(ml.price) as total_marketplace_transaction_value
        FROM
            consultations cons
            CROSS JOIN marketplace_listings ml
        WHERE
            cons.payment_status = 'paid'
            AND ml.status = 'sold'
    ) revenue
    CROSS JOIN (
        SELECT (
                SELECT COUNT(*)
                FROM profile_verification_records
                WHERE
                    verification_status = 'pending'
            ) as pending_verifications,
            (
                SELECT COUNT(*)
                FROM social_feed_reports
                WHERE
                    status = 'pending'
            ) as pending_reports,
            (
                SELECT COUNT(*)
                FROM data_operators
                WHERE
                    is_active = TRUE
            ) as active_data_operators,
            95.5 as system_uptime_score -- This would typically come from system monitoring
    ) system_health;

-- View: Master Data Export View
-- Comprehensive view for data export and backup purposes
CREATE VIEW `v_master_data_export` AS
SELECT
    'user' as record_type,
    u.user_id as primary_id,
    JSON_OBJECT(
        'user_info',
        JSON_OBJECT(
            'user_id',
            u.user_id,
            'email',
            u.email,
            'user_type',
            u.user_type,
            'phone',
            u.phone,
            'is_verified',
            u.is_verified,
            'is_active',
            u.is_active,
            'created_at',
            u.created_at
        ),
        'profile_info',
        JSON_OBJECT(
            'full_name',
            prof.full_name,
            'district',
            prof.district,
            'upazila',
            prof.upazila,
            'division',
            prof.division,
            'verification_status',
            prof.verification_status
        )
    ) as data_json,
    u.created_at as record_created_at,
    u.updated_at as record_updated_at
FROM users u
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
UNION ALL
SELECT
    'post' as record_type,
    p.post_id as primary_id,
    JSON_OBJECT(
        'post_info',
        JSON_OBJECT(
            'post_id',
            p.post_id,
            'content',
            p.content,
            'post_type',
            p.post_type,
            'location',
            p.location,
            'likes_count',
            p.likes_count,
            'comments_count',
            p.comments_count,
            'views_count',
            p.views_count
        ),
        'author_info',
        JSON_OBJECT(
            'author_id',
            p.author_id,
            'author_name',
            prof.full_name,
            'author_district',
            prof.district
        )
    ) as data_json,
    p.created_at as record_created_at,
    p.updated_at as record_updated_at
FROM
    posts p
    LEFT JOIN users u ON p.author_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
WHERE
    p.is_deleted = FALSE
UNION ALL
SELECT
    'marketplace_listing' as record_type,
    ml.listing_id as primary_id,
    JSON_OBJECT(
        'listing_info',
        JSON_OBJECT(
            'listing_id',
            ml.listing_id,
            'title',
            ml.title,
            'price',
            ml.price,
            'currency',
            ml.currency,
            'listing_type',
            ml.listing_type,
            'status',
            ml.status,
            'location',
            ml.location
        ),
        'seller_info',
        JSON_OBJECT(
            'seller_id',
            ml.seller_id,
            'seller_name',
            prof.full_name,
            'seller_district',
            prof.district
        )
    ) as data_json,
    ml.created_at as record_created_at,
    ml.updated_at as record_updated_at
FROM
    marketplace_listings ml
    LEFT JOIN users u ON ml.seller_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
UNION ALL
SELECT
    'consultation' as record_type,
    c.consultation_id as primary_id,
    JSON_OBJECT(
        'consultation_info',
        JSON_OBJECT(
            'consultation_id',
            c.consultation_id,
            'topic',
            c.topic,
            'crop_type',
            c.crop_type,
            'priority',
            c.priority,
            'status',
            c.status,
            'consultation_fee',
            c.consultation_fee,
            'payment_status',
            c.payment_status
        ),
        'farmer_info',
        JSON_OBJECT(
            'farmer_id',
            c.farmer_id,
            'farmer_name',
            farmer_prof.full_name,
            'farmer_district',
            farmer_prof.district
        ),
        'expert_info',
        JSON_OBJECT(
            'expert_id',
            c.expert_id,
            'expert_name',
            expert_prof.full_name,
            'expert_specialization',
            eq.specialization
        )
    ) as data_json,
    c.created_at as record_created_at,
    c.updated_at as record_updated_at
FROM
    consultations c
    LEFT JOIN users farmer_u ON c.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN users expert_u ON c.expert_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id
ORDER BY record_created_at DESC;