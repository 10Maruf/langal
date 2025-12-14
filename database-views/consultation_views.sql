-- =====================================================
-- Consultation System Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Consultation Details
-- Shows consultations with farmer and expert details
CREATE VIEW `v_consultations_complete` AS
SELECT
    c.consultation_id,
    c.topic,
    c.crop_type,
    c.issue_description,
    c.priority,
    c.status,
    c.location,
    c.images,
    c.consultation_fee,
    c.payment_status,
    c.preferred_time,
    c.consultation_type,
    c.urgency,
    c.created_at,
    c.updated_at,
    c.resolved_at,
    DATEDIFF(
        COALESCE(c.resolved_at, NOW()),
        c.created_at
    ) as resolution_days,
    -- Farmer information
    c.farmer_id,
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    farmer_prof.profile_photo_url as farmer_photo,
    -- Expert information
    c.expert_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    expert_u.phone as expert_phone,
    expert_prof.profile_photo_url as expert_photo,
    -- Expert qualification details
    eq.qualification as expert_qualification,
    eq.specialization as expert_specialization,
    eq.experience_years as expert_experience,
    eq.rating as expert_rating,
    eq.total_consultations as expert_total_consultations
FROM
    consultations c
    INNER JOIN users farmer_u ON c.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN users expert_u ON c.expert_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id;

-- View: Active Consultations
-- Shows currently active consultations
CREATE VIEW `v_active_consultations` AS
SELECT
    c.consultation_id,
    c.topic,
    c.crop_type,
    c.issue_description,
    c.priority,
    c.status,
    c.consultation_type,
    c.urgency,
    c.created_at,
    DATEDIFF(NOW(), c.created_at) as days_since_created,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_u.phone as farmer_phone,
    -- Expert information
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.specialization as expert_specialization,
    eq.rating as expert_rating
FROM
    consultations c
    INNER JOIN users farmer_u ON c.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN users expert_u ON c.expert_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id
WHERE
    c.status IN ('pending', 'in_progress');

-- View: Consultation Responses with Expert Details
-- Shows consultation responses with expert information
CREATE VIEW `v_consultation_responses_complete` AS
SELECT
    cr.response_id,
    cr.consultation_id,
    cr.response_text,
    cr.attachments,
    cr.is_final_response,
    cr.diagnosis,
    cr.treatment,
    cr.created_at,
    -- Expert information
    cr.expert_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.qualification as expert_qualification,
    eq.specialization as expert_specialization,
    eq.experience_years as expert_experience,
    eq.rating as expert_rating,
    -- Consultation information
    c.topic as consultation_topic,
    c.crop_type,
    c.priority,
    c.urgency,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district
FROM
    consultation_responses cr
    INNER JOIN consultations c ON cr.consultation_id = c.consultation_id
    INNER JOIN users expert_u ON cr.expert_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id
    INNER JOIN users farmer_u ON c.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
ORDER BY cr.created_at DESC;

-- View: Expert Performance Metrics
-- Shows performance statistics for experts
CREATE VIEW `v_expert_performance_metrics` AS
SELECT
    e.expert_id,
    expert_u.user_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.qualification,
    eq.specialization,
    eq.experience_years,
    eq.consultation_fee,
    eq.rating,
    eq.total_consultations as eq_total_consultations,
    -- Consultation statistics
    COUNT(DISTINCT c.consultation_id) as actual_total_consultations,
    COUNT(
        DISTINCT CASE
            WHEN c.status = 'pending' THEN c.consultation_id
        END
    ) as pending_consultations,
    COUNT(
        DISTINCT CASE
            WHEN c.status = 'in_progress' THEN c.consultation_id
        END
    ) as in_progress_consultations,
    COUNT(
        DISTINCT CASE
            WHEN c.status = 'resolved' THEN c.consultation_id
        END
    ) as resolved_consultations,
    COUNT(
        DISTINCT CASE
            WHEN c.status = 'cancelled' THEN c.consultation_id
        END
    ) as cancelled_consultations,
    COUNT(
        DISTINCT CASE
            WHEN c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN c.consultation_id
        END
    ) as consultations_last_30_days,
    -- Response statistics
    COUNT(DISTINCT cr.response_id) as total_responses,
    COUNT(
        DISTINCT CASE
            WHEN cr.is_final_response = TRUE THEN cr.response_id
        END
    ) as final_responses,
    -- Performance metrics
    CASE
        WHEN COUNT(DISTINCT c.consultation_id) > 0 THEN ROUND(
            (
                COUNT(
                    DISTINCT CASE
                        WHEN c.status = 'resolved' THEN c.consultation_id
                    END
                ) / COUNT(DISTINCT c.consultation_id)
            ) * 100,
            2
        )
        ELSE 0
    END as resolution_rate_percent,
    AVG(
        CASE
            WHEN c.resolved_at IS NOT NULL THEN DATEDIFF(c.resolved_at, c.created_at)
        END
    ) as avg_resolution_days,
    -- Revenue metrics
    SUM(
        CASE
            WHEN c.payment_status = 'paid' THEN c.consultation_fee
            ELSE 0
        END
    ) as total_earnings,
    SUM(
        CASE
            WHEN c.payment_status = 'paid'
            AND c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN c.consultation_fee
            ELSE 0
        END
    ) as earnings_last_30_days
FROM
    expert_qualifications eq
    INNER JOIN users expert_u ON eq.user_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN consultations c ON expert_u.user_id = c.expert_id
    LEFT JOIN consultation_responses cr ON expert_u.user_id = cr.expert_id
GROUP BY
    e.expert_id,
    expert_u.user_id,
    expert_prof.full_name,
    expert_prof.district,
    eq.qualification,
    eq.specialization,
    eq.experience_years,
    eq.consultation_fee,
    eq.rating,
    eq.total_consultations
ORDER BY actual_total_consultations DESC;

-- View: Pending Consultations for Assignment
-- Shows consultations waiting for expert assignment
CREATE VIEW `v_pending_consultations_for_assignment` AS
SELECT
    c.consultation_id,
    c.topic,
    c.crop_type,
    c.issue_description,
    c.priority,
    c.urgency,
    c.location,
    c.consultation_type,
    c.created_at,
    DATEDIFF(NOW(), c.created_at) as days_pending,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    -- Suggested experts (based on specialization and location)
    GROUP_CONCAT(
        DISTINCT CONCAT(
            expert_prof.full_name,
            ' (',
            eq.specialization,
            ', Rating: ',
            eq.rating,
            ')'
        ) SEPARATOR '; '
    ) as suggested_experts
FROM
    consultations c
    INNER JOIN users farmer_u ON c.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN expert_qualifications eq ON (
        eq.specialization LIKE CONCAT('%', c.crop_type, '%')
        OR c.crop_type LIKE CONCAT('%', eq.specialization, '%')
    )
    LEFT JOIN users expert_u ON eq.user_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
WHERE
    c.status = 'pending'
    AND c.expert_id IS NULL
GROUP BY
    c.consultation_id,
    c.topic,
    c.crop_type,
    c.issue_description,
    c.priority,
    c.urgency,
    c.location,
    c.consultation_type,
    c.created_at,
    farmer_prof.full_name,
    farmer_prof.district,
    farmer_prof.upazila,
    farmer_u.phone
ORDER BY c.priority DESC, c.urgency DESC, c.created_at ASC;

-- View: Consultation Statistics by Crop Type
-- Shows consultation statistics grouped by crop type
CREATE VIEW `v_consultation_statistics_by_crop` AS
SELECT
    c.crop_type,
    COUNT(*) as total_consultations,
    COUNT(DISTINCT c.farmer_id) as unique_farmers,
    COUNT(DISTINCT c.expert_id) as unique_experts,
    COUNT(
        CASE
            WHEN c.status = 'resolved' THEN c.consultation_id
        END
    ) as resolved_consultations,
    COUNT(
        CASE
            WHEN c.status = 'pending' THEN c.consultation_id
        END
    ) as pending_consultations,
    COUNT(
        CASE
            WHEN c.status = 'in_progress' THEN c.consultation_id
        END
    ) as in_progress_consultations,
    COUNT(
        CASE
            WHEN c.status = 'cancelled' THEN c.consultation_id
        END
    ) as cancelled_consultations,
    AVG(c.consultation_fee) as avg_consultation_fee,
    AVG(
        CASE
            WHEN c.resolved_at IS NOT NULL THEN DATEDIFF(c.resolved_at, c.created_at)
        END
    ) as avg_resolution_days,
    COUNT(
        CASE
            WHEN c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN c.consultation_id
        END
    ) as consultations_last_30_days
FROM consultations c
WHERE
    c.crop_type IS NOT NULL
    AND c.crop_type != ''
GROUP BY
    c.crop_type
ORDER BY total_consultations DESC;

-- View: Monthly Consultation Trends
-- Shows consultation trends by month
CREATE VIEW `v_monthly_consultation_trends` AS
SELECT
    YEAR(c.created_at) as year,
    MONTH(c.created_at) as month,
    MONTHNAME(c.created_at) as month_name,
    COUNT(*) as total_consultations,
    COUNT(DISTINCT c.farmer_id) as unique_farmers,
    COUNT(DISTINCT c.expert_id) as unique_experts,
    COUNT(
        CASE
            WHEN c.status = 'resolved' THEN c.consultation_id
        END
    ) as resolved_consultations,
    AVG(c.consultation_fee) as avg_consultation_fee,
    SUM(
        CASE
            WHEN c.payment_status = 'paid' THEN c.consultation_fee
            ELSE 0
        END
    ) as total_revenue,
    AVG(
        CASE
            WHEN c.resolved_at IS NOT NULL THEN DATEDIFF(c.resolved_at, c.created_at)
        END
    ) as avg_resolution_days
FROM consultations c
WHERE
    c.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY
    YEAR(c.created_at),
    MONTH(c.created_at),
    MONTHNAME(c.created_at)
ORDER BY year DESC, month DESC;

-- View: Expert Workload Distribution
-- Shows current workload distribution among experts
CREATE VIEW `v_expert_workload_distribution` AS
SELECT
    expert_u.user_id as expert_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.specialization,
    eq.rating,
    -- Current workload
    COUNT(
        CASE
            WHEN c.status IN ('pending', 'in_progress') THEN c.consultation_id
        END
    ) as current_active_consultations,
    COUNT(
        CASE
            WHEN c.status = 'pending' THEN c.consultation_id
        END
    ) as pending_consultations,
    COUNT(
        CASE
            WHEN c.status = 'in_progress' THEN c.consultation_id
        END
    ) as in_progress_consultations,
    -- Weekly statistics
    COUNT(
        CASE
            WHEN c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN c.consultation_id
        END
    ) as consultations_this_week,
    COUNT(
        CASE
            WHEN c.resolved_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN c.consultation_id
        END
    ) as resolved_this_week,
    -- Capacity indicators
    CASE
        WHEN COUNT(
            CASE
                WHEN c.status IN ('pending', 'in_progress') THEN c.consultation_id
            END
        ) >= 10 THEN 'Overloaded'
        WHEN COUNT(
            CASE
                WHEN c.status IN ('pending', 'in_progress') THEN c.consultation_id
            END
        ) >= 5 THEN 'Busy'
        WHEN COUNT(
            CASE
                WHEN c.status IN ('pending', 'in_progress') THEN c.consultation_id
            END
        ) >= 1 THEN 'Normal'
        ELSE 'Available'
    END as workload_status
FROM
    users expert_u
    INNER JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN consultations c ON expert_u.user_id = c.expert_id
WHERE
    expert_u.user_type = 'expert'
GROUP BY
    expert_u.user_id,
    expert_prof.full_name,
    expert_prof.district,
    eq.specialization,
    eq.rating
ORDER BY
    current_active_consultations ASC,
    eq.rating DESC;