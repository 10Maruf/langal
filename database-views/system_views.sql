-- =====================================================
-- System Functionality Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Notifications with User Details
-- Shows notifications with sender and recipient information
CREATE VIEW `v_notifications_complete` AS
SELECT
    n.notification_id,
    n.notification_type,
    n.title,
    n.message,
    n.related_entity_id,
    n.is_read,
    n.created_at,
    n.read_at,
    DATEDIFF(NOW(), n.created_at) as days_since_created,
    -- Recipient information
    n.recipient_id,
    recipient_prof.full_name as recipient_name,
    recipient_prof.district as recipient_district,
    recipient_u.user_type as recipient_type,
    recipient_u.phone as recipient_phone,
    -- Sender information
    n.sender_id,
    sender_prof.full_name as sender_name,
    sender_prof.district as sender_district,
    sender_u.user_type as sender_type,
    -- Notification priority based on type
    CASE
        WHEN n.notification_type = 'weather_alert' THEN 'High'
        WHEN n.notification_type = 'consultation_request' THEN 'Medium'
        WHEN n.notification_type = 'system' THEN 'Medium'
        WHEN n.notification_type = 'diagnosis' THEN 'Medium'
        WHEN n.notification_type = 'marketplace' THEN 'Low'
        WHEN n.notification_type = 'post_interaction' THEN 'Low'
        ELSE 'Normal'
    END as priority_level
FROM
    notifications n
    INNER JOIN users recipient_u ON n.recipient_id = recipient_u.user_id
    LEFT JOIN user_profiles recipient_prof ON recipient_u.user_id = recipient_prof.user_id
    LEFT JOIN users sender_u ON n.sender_id = sender_u.user_id
    LEFT JOIN user_profiles sender_prof ON sender_u.user_id = sender_prof.user_id
ORDER BY n.created_at DESC;

-- View: User Session Management
-- Shows active and expired user sessions with device information
CREATE VIEW `v_user_sessions_management` AS
SELECT
    us.session_id,
    us.session_token,
    us.device_info,
    us.ip_address,
    us.is_active,
    us.expires_at,
    us.created_at,
    DATEDIFF(us.expires_at, NOW()) as days_until_expiry,
    CASE
        WHEN us.expires_at < NOW() THEN 'Expired'
        WHEN us.is_active = FALSE THEN 'Inactive'
        WHEN DATEDIFF(us.expires_at, NOW()) <= 3 THEN 'Expiring Soon'
        ELSE 'Active'
    END as session_status,
    -- User information
    us.user_id,
    prof.full_name as user_name,
    prof.district as user_district,
    u.user_type,
    u.phone,
    u.email,
    -- Session duration
    TIMESTAMPDIFF(
        HOUR,
        us.created_at,
        COALESCE(us.expires_at, NOW())
    ) as total_session_hours
FROM
    user_sessions us
    INNER JOIN users u ON us.user_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
ORDER BY us.created_at DESC;

-- View: System Settings Management
-- Shows system settings with metadata and access control
CREATE VIEW `v_system_settings_management` AS
SELECT
    ss.setting_id,
    ss.setting_key,
    ss.setting_value,
    ss.setting_type,
    ss.description,
    ss.is_public,
    ss.updated_at,
    ss.created_at,
    -- Updated by user information
    ss.updated_by,
    updater_prof.full_name as updated_by_name,
    updater_u.user_type as updated_by_type,
    -- Setting categorization
    CASE
        WHEN ss.setting_key LIKE 'app_%' THEN 'Application'
        WHEN ss.setting_key LIKE 'notification_%' THEN 'Notifications'
        WHEN ss.setting_key LIKE 'market_%' THEN 'Marketplace'
        WHEN ss.setting_key LIKE 'weather_%' THEN 'Weather'
        WHEN ss.setting_key LIKE 'security_%' THEN 'Security'
        WHEN ss.setting_key LIKE 'system_%' THEN 'System'
        ELSE 'General'
    END as setting_category,
    -- Access level
    CASE
        WHEN ss.is_public = TRUE THEN 'Public'
        ELSE 'Admin Only'
    END as access_level
FROM
    system_settings ss
    LEFT JOIN users updater_u ON ss.updated_by = updater_u.user_id
    LEFT JOIN user_profiles updater_prof ON updater_u.user_id = updater_prof.user_id
ORDER BY setting_category, ss.setting_key;

-- View: Data Operator Workload and Performance
-- Shows data operator performance metrics and current workload
CREATE VIEW `v_data_operator_performance` AS
SELECT
    do.operator_id,
    do.user_id,
    do.operator_code,
    do.assigned_area,
    do.department,
    do.position,
    do.joining_date,
    do.permissions,
    do.is_active,
    do.last_active,
    DATEDIFF(NOW(), do.last_active) as days_since_last_active,
    -- Operator personal information
    prof.full_name as operator_name,
    prof.district as operator_district,
    prof.phone as operator_phone,
    -- Supervisor information
    supervisor_prof.full_name as supervisor_name,
    -- Activity statistics
    COUNT(DISTINCT doal.log_id) as total_activities,
    COUNT(
        DISTINCT CASE
            WHEN doal.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN doal.log_id
        END
    ) as activities_last_7_days,
    COUNT(
        DISTINCT CASE
            WHEN doal.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN doal.log_id
        END
    ) as activities_last_30_days,
    -- Profile verification statistics
    COUNT(DISTINCT pvr.record_id) as profile_verifications,
    COUNT(
        DISTINCT CASE
            WHEN pvr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN pvr.record_id
        END
    ) as profile_verifications_last_30_days,
    -- Crop verification statistics
    COUNT(DISTINCT cvr.record_id) as crop_verifications,
    COUNT(
        DISTINCT CASE
            WHEN cvr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN cvr.record_id
        END
    ) as crop_verifications_last_30_days,
    -- Field data collection statistics
    COUNT(DISTINCT fdc.collection_id) as field_data_collections,
    COUNT(
        DISTINCT CASE
            WHEN fdc.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN fdc.collection_id
        END
    ) as field_data_collections_last_30_days,
    -- Performance indicators
    CASE
        WHEN DATEDIFF(NOW(), do.last_active) <= 1 THEN 'Very Active'
        WHEN DATEDIFF(NOW(), do.last_active) <= 7 THEN 'Active'
        WHEN DATEDIFF(NOW(), do.last_active) <= 30 THEN 'Moderate'
        ELSE 'Inactive'
    END as activity_level
FROM
    data_operators do
    INNER JOIN users u ON do.user_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
    LEFT JOIN data_operators supervisor_do ON do.supervisor_id = supervisor_do.operator_id
    LEFT JOIN user_profiles supervisor_prof ON supervisor_do.user_id = supervisor_prof.user_id
    LEFT JOIN data_operator_activity_logs doal ON do.operator_id = doal.operator_id
    LEFT JOIN profile_verification_records pvr ON do.operator_id = pvr.operator_id
    LEFT JOIN crop_verification_records cvr ON do.operator_id = cvr.operator_id
    LEFT JOIN field_data_collection fdc ON do.operator_id = fdc.operator_id
GROUP BY
    do.operator_id,
    do.user_id,
    do.operator_code,
    do.assigned_area,
    do.department,
    do.position,
    do.joining_date,
    do.permissions,
    do.is_active,
    do.last_active,
    prof.full_name,
    prof.district,
    prof.phone,
    supervisor_prof.full_name
ORDER BY activities_last_30_days DESC;

-- View: Data Operator Activity Logs with Details
-- Shows detailed activity logs with context information
CREATE VIEW `v_data_operator_activity_logs_detailed` AS
SELECT
    doal.log_id,
    doal.activity_type,
    doal.target_id,
    doal.target_type,
    doal.action_performed,
    doal.action_details,
    doal.result,
    doal.created_at,
    -- Operator information
    doal.operator_id,
    prof.full_name as operator_name,
    prof.district as operator_district,
    do.operator_code,
    do.department,
    do.position,
    -- Activity categorization
    CASE
        WHEN doal.activity_type LIKE '%verification%' THEN 'Verification'
        WHEN doal.activity_type LIKE '%registration%' THEN 'Registration'
        WHEN doal.activity_type LIKE '%collection%' THEN 'Data Collection'
        WHEN doal.activity_type LIKE '%report%' THEN 'Reporting'
        ELSE 'Other'
    END as activity_category,
    -- Success indicator
    CASE
        WHEN doal.result = 'success' THEN 'Success'
        WHEN doal.result = 'failed' THEN 'Failed'
        WHEN doal.result = 'pending' THEN 'Pending'
        ELSE 'Unknown'
    END as result_status
FROM
    data_operator_activity_logs doal
    INNER JOIN data_operators do ON doal.operator_id = do.operator_id
    INNER JOIN users u ON do.user_id = u.user_id
    LEFT JOIN user_profiles prof ON u.user_id = prof.user_id
ORDER BY doal.created_at DESC;

-- View: Profile Verification Records with Context
-- Shows profile verification records with operator and applicant details
CREATE VIEW `v_profile_verification_records_detailed` AS
SELECT
    pvr.record_id,
    pvr.profile_id,
    pvr.verification_status,
    pvr.verification_notes,
    pvr.documents_verified,
    pvr.rejection_reason,
    pvr.created_at as verification_date,
    pvr.updated_at,
    -- Operator information
    pvr.operator_id,
    operator_prof.full_name as operator_name,
    operator_prof.district as operator_district,
    do.operator_code,
    -- Applicant information
    prof.full_name as applicant_name,
    prof.nid_number,
    prof.district as applicant_district,
    prof.upazila as applicant_upazila,
    u.user_type as applicant_type,
    u.phone as applicant_phone,
    prof.created_at as profile_created_at,
    DATEDIFF(
        pvr.created_at,
        prof.created_at
    ) as days_from_profile_to_verification
FROM
    profile_verification_records pvr
    INNER JOIN user_profiles prof ON pvr.profile_id = prof.profile_id
    INNER JOIN users u ON prof.user_id = u.user_id
    INNER JOIN data_operators do ON pvr.operator_id = do.operator_id
    INNER JOIN users operator_u ON do.user_id = operator_u.user_id
    LEFT JOIN user_profiles operator_prof ON operator_u.user_id = operator_prof.user_id
ORDER BY pvr.created_at DESC;

-- View: Field Data Collection Summary
-- Shows field data collection activities with location and crop information
CREATE VIEW `v_field_data_collection_summary` AS
SELECT
    fdc.collection_id,
    fdc.farmer_id,
    fdc.crop_type,
    fdc.field_location,
    fdc.field_size,
    fdc.field_size_unit,
    fdc.collection_date,
    fdc.data_collected,
    fdc.photos,
    fdc.notes,
    fdc.verification_status,
    fdc.created_at,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    -- Operator information
    fdc.operator_id,
    operator_prof.full_name as operator_name,
    operator_prof.district as operator_district,
    do.operator_code,
    -- Data analysis
    JSON_EXTRACT(
        fdc.data_collected,
        '$.soil_type'
    ) as soil_type,
    JSON_EXTRACT(
        fdc.data_collected,
        '$.irrigation_method'
    ) as irrigation_method,
    JSON_EXTRACT(
        fdc.data_collected,
        '$.fertilizer_used'
    ) as fertilizer_used,
    -- Collection efficiency
    DATEDIFF(
        fdc.created_at,
        fdc.collection_date
    ) as data_entry_delay_days
FROM
    field_data_collection fdc
    INNER JOIN users farmer_u ON fdc.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    INNER JOIN data_operators do ON fdc.operator_id = do.operator_id
    INNER JOIN users operator_u ON do.user_id = operator_u.user_id
    LEFT JOIN user_profiles operator_prof ON operator_u.user_id = operator_prof.user_id
ORDER BY fdc.collection_date DESC;

-- View: Social Feed Reports Management
-- Shows social feed reports with content and reporter details
CREATE VIEW `v_social_feed_reports_management` AS
SELECT
    sfr.report_id,
    sfr.reported_content_id,
    sfr.content_type,
    sfr.report_reason,
    sfr.report_details,
    sfr.status,
    sfr.action_taken,
    sfr.created_at as report_date,
    sfr.resolved_at,
    DATEDIFF(
        COALESCE(sfr.resolved_at, NOW()),
        sfr.created_at
    ) as resolution_days,
    -- Reporter information
    sfr.reported_by,
    reporter_prof.full_name as reporter_name,
    reporter_prof.district as reporter_district,
    reporter_u.user_type as reporter_type,
    -- Handler information
    sfr.handled_by,
    handler_prof.full_name as handler_name,
    handler_do.operator_code as handler_operator_code,
    -- Content details (based on content type)
    CASE
        WHEN sfr.content_type = 'post' THEN (
            SELECT LEFT(p.content, 100)
            FROM posts p
            WHERE
                p.post_id = sfr.reported_content_id
        )
        WHEN sfr.content_type = 'comment' THEN (
            SELECT LEFT(c.content, 100)
            FROM comments c
            WHERE
                c.comment_id = sfr.reported_content_id
        )
        ELSE 'Content not found'
    END as content_preview,
    -- Priority based on report reason
    CASE
        WHEN sfr.report_reason IN (
            'spam',
            'harassment',
            'inappropriate_content'
        ) THEN 'High'
        WHEN sfr.report_reason IN ('misinformation', 'off_topic') THEN 'Medium'
        ELSE 'Low'
    END as priority_level
FROM
    social_feed_reports sfr
    INNER JOIN users reporter_u ON sfr.reported_by = reporter_u.user_id
    LEFT JOIN user_profiles reporter_prof ON reporter_u.user_id = reporter_prof.user_id
    LEFT JOIN data_operators handler_do ON sfr.handled_by = handler_do.operator_id
    LEFT JOIN users handler_u ON handler_do.user_id = handler_u.user_id
    LEFT JOIN user_profiles handler_prof ON handler_u.user_id = handler_prof.user_id
ORDER BY sfr.created_at DESC;

-- View: System Health Dashboard
-- Provides overall system health metrics and statistics
CREATE VIEW `v_system_health_dashboard` AS
SELECT
    -- User statistics
    (
        SELECT COUNT(*)
        FROM users
        WHERE
            is_active = TRUE
    ) as active_users_count,
    (
        SELECT COUNT(*)
        FROM users
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as new_users_last_7_days,
    (
        SELECT COUNT(*)
        FROM user_sessions
        WHERE
            is_active = TRUE
            AND expires_at > NOW()
    ) as active_sessions_count,
    -- Content statistics
    (
        SELECT COUNT(*)
        FROM posts
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            AND is_deleted = FALSE
    ) as posts_last_24_hours,
    (
        SELECT COUNT(*)
        FROM marketplace_listings
        WHERE
            status = 'active'
    ) as active_marketplace_listings,
    (
        SELECT COUNT(*)
        FROM consultations
        WHERE
            status IN ('pending', 'in_progress')
    ) as active_consultations,
    (
        SELECT COUNT(*)
        FROM diagnoses
        WHERE
            status = 'pending'
    ) as pending_diagnoses,
    -- Notification statistics
    (
        SELECT COUNT(*)
        FROM notifications
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ) as notifications_sent_last_24_hours,
    (
        SELECT COUNT(*)
        FROM notifications
        WHERE
            is_read = FALSE
    ) as unread_notifications_count,
    -- Data operator statistics
    (
        SELECT COUNT(*)
        FROM data_operators
        WHERE
            is_active = TRUE
    ) as active_data_operators,
    (
        SELECT COUNT(*)
        FROM data_operator_activity_logs
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ) as operator_activities_last_24_hours,
    -- Report statistics
    (
        SELECT COUNT(*)
        FROM social_feed_reports
        WHERE
            status = 'pending'
    ) as pending_reports,
    (
        SELECT COUNT(*)
        FROM profile_verification_records
        WHERE
            verification_status = 'pending'
    ) as pending_profile_verifications,
    -- System timestamp
    NOW() as system_current_time,
    DATE(NOW()) as system_current_date;