-- =====================================================
-- User Management Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete User Information
-- Combines users table with user profiles for complete user details
CREATE VIEW `v_user_complete_info` AS
SELECT
    u.user_id,
    u.email,
    u.user_type,
    u.phone,
    u.is_verified,
    u.is_active,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,
    -- Profile information
    p.profile_id,
    p.full_name,
    p.nid_number,
    p.date_of_birth,
    p.father_name,
    p.mother_name,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.profile_photo_url,
    p.verification_status,
    p.verified_at,
    p.created_at as profile_created_at,
    -- Verified by user info
    verifier.full_name as verified_by_name
FROM
    users u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    LEFT JOIN user_profiles verifier ON p.verified_by = verifier.user_id;

-- View: Farmer Details with User Info
-- Complete farmer information including user details and farming specifics
CREATE VIEW `v_farmer_details` AS
SELECT
    u.user_id,
    u.email,
    u.phone,
    u.is_verified,
    u.is_active,
    -- Profile information
    p.full_name,
    p.nid_number,
    p.date_of_birth,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.verification_status,
    -- Farmer specific details
    f.farmer_id,
    f.farm_size,
    f.farm_size_unit,
    f.farm_type,
    f.experience_years,
    f.land_ownership,
    f.registration_date,
    f.krishi_card_number,
    f.created_at as farmer_created_at
FROM
    users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
    INNER JOIN farmer_details f ON u.user_id = f.user_id
WHERE
    u.user_type = 'farmer';

-- View: Expert/Consultant Details with User Info
-- Complete expert information including qualifications and ratings
CREATE VIEW `v_expert_details` AS
SELECT
    u.user_id,
    u.email,
    u.phone,
    u.is_verified,
    u.is_active,
    -- Profile information
    p.full_name,
    p.nid_number,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.verification_status,
    -- Expert specific details
    e.expert_id,
    e.qualification,
    e.specialization,
    e.experience_years,
    e.institution,
    e.consultation_fee,
    e.rating,
    e.total_consultations,
    e.is_government_approved,
    e.license_number,
    e.created_at as expert_created_at
FROM
    users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
    INNER JOIN expert_qualifications e ON u.user_id = e.user_id
WHERE
    u.user_type = 'expert';

-- View: Customer Business Details with User Info
-- Complete customer information including business details
CREATE VIEW `v_customer_details` AS
SELECT
    u.user_id,
    u.email,
    u.phone,
    u.is_verified,
    u.is_active,
    -- Profile information
    p.full_name,
    p.nid_number,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.verification_status,
    -- Customer business details
    c.business_id,
    c.business_name,
    c.business_type,
    c.trade_license_number,
    c.business_address,
    c.established_year,
    c.created_at as business_created_at
FROM
    users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
    INNER JOIN customer_business_details c ON u.user_id = c.user_id
WHERE
    u.user_type = 'customer';

-- View: Data Operator Details with User Info
-- Complete data operator information including assigned areas
CREATE VIEW `v_data_operator_details` AS
SELECT
    u.user_id,
    u.email,
    u.phone,
    u.is_verified,
    u.is_active,
    -- Profile information
    p.full_name,
    p.nid_number,
    p.address,
    p.district,
    p.upazila,
    p.division,
    p.verification_status,
    -- Data operator details
    d.operator_id,
    d.operator_code,
    d.assigned_area,
    d.department,
    d.position,
    d.joining_date,
    d.permissions,
    d.last_active,
    d.created_at as operator_created_at,
    -- Supervisor info
    supervisor.full_name as supervisor_name
FROM
    users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
    INNER JOIN data_operators d ON u.user_id = d.user_id
    LEFT JOIN data_operators supervisor_op ON d.supervisor_id = supervisor_op.operator_id
    LEFT JOIN user_profiles supervisor ON supervisor_op.user_id = supervisor.user_id
WHERE
    u.user_type = 'data_operator';

-- View: User Statistics by District
-- Aggregated user statistics grouped by district
CREATE VIEW `v_user_statistics_by_district` AS
SELECT
    p.district,
    p.division,
    u.user_type,
    COUNT(*) as total_users,
    SUM(
        CASE
            WHEN u.is_verified = TRUE THEN 1
            ELSE 0
        END
    ) as verified_users,
    SUM(
        CASE
            WHEN p.verification_status = 'verified' THEN 1
            ELSE 0
        END
    ) as profile_verified_users,
    SUM(
        CASE
            WHEN u.is_active = TRUE THEN 1
            ELSE 0
        END
    ) as active_users
FROM users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
GROUP BY
    p.district,
    p.division,
    u.user_type
ORDER BY p.division, p.district, u.user_type;

-- View: Recent User Registrations
-- Shows recently registered users with their basic information
CREATE VIEW `v_recent_user_registrations` AS
SELECT
    u.user_id,
    u.email,
    u.user_type,
    u.phone,
    u.is_verified,
    u.created_at,
    p.full_name,
    p.district,
    p.upazila,
    p.verification_status,
    DATEDIFF(
        CURRENT_DATE,
        DATE(u.created_at)
    ) as days_since_registration
FROM users u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
WHERE
    u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY u.created_at DESC;

-- View: Pending Profile Verifications
-- Lists all users with pending profile verification
CREATE VIEW `v_pending_profile_verifications` AS
SELECT
    u.user_id,
    u.email,
    u.user_type,
    u.phone,
    u.created_at as user_created_at,
    p.profile_id,
    p.full_name,
    p.nid_number,
    p.district,
    p.upazila,
    p.division,
    p.verification_status,
    p.created_at as profile_created_at,
    DATEDIFF(
        CURRENT_DATE,
        DATE(p.created_at)
    ) as days_pending
FROM users u
    INNER JOIN user_profiles p ON u.user_id = p.user_id
WHERE
    p.verification_status = 'pending'
ORDER BY p.created_at ASC;