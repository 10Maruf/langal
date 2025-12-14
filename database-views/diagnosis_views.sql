-- =====================================================
-- Disease Diagnosis System Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Diagnosis Information
-- Shows diagnoses with farmer details and expert verification info
CREATE VIEW `v_diagnoses_complete` AS
SELECT
    d.diagnosis_id,
    d.crop_type,
    d.symptoms_description,
    d.uploaded_images,
    d.farm_area,
    d.area_unit,
    d.ai_analysis_result,
    d.is_verified_by_expert,
    d.urgency,
    d.status,
    d.location,
    d.created_at,
    d.updated_at,
    -- Farmer information
    d.farmer_id,
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    farmer_prof.profile_photo_url as farmer_photo,
    -- Expert verification information
    d.expert_verification_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.qualification as expert_qualification,
    eq.specialization as expert_specialization,
    eq.experience_years as expert_experience,
    eq.rating as expert_rating
FROM
    diagnoses d
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN users expert_u ON d.expert_verification_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id;

-- View: Disease Treatments with Diagnosis Details
-- Shows treatments with related diagnosis and farmer information
CREATE VIEW `v_disease_treatments_complete` AS
SELECT
    dt.treatment_id,
    dt.diagnosis_id,
    dt.disease_name,
    dt.disease_name_bn,
    dt.probability_percentage,
    dt.treatment_description,
    dt.estimated_cost,
    dt.treatment_guidelines,
    dt.prevention_guidelines,
    dt.video_links,
    dt.disease_type,
    dt.created_at as treatment_created_at,
    -- Diagnosis information
    d.crop_type,
    d.symptoms_description,
    d.farm_area,
    d.area_unit,
    d.urgency,
    d.status as diagnosis_status,
    d.location,
    d.created_at as diagnosis_created_at,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone
FROM
    disease_treatments dt
    INNER JOIN diagnoses d ON dt.diagnosis_id = d.diagnosis_id
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
ORDER BY dt.probability_percentage DESC;

-- View: Treatment Chemicals with Complete Details
-- Shows chemicals with treatment and diagnosis information
CREATE VIEW `v_treatment_chemicals_complete` AS
SELECT
    tc.chemical_id,
    tc.treatment_id,
    tc.chemical_name,
    tc.chemical_type,
    tc.dose_per_acre,
    tc.dose_unit,
    tc.price_per_unit,
    tc.application_notes,
    tc.safety_precautions,
    tc.application_method,
    tc.created_at as chemical_created_at,
    -- Treatment information
    dt.disease_name,
    dt.disease_name_bn,
    dt.probability_percentage,
    dt.estimated_cost as total_treatment_cost,
    -- Diagnosis information
    d.diagnosis_id,
    d.crop_type,
    d.farm_area,
    d.area_unit,
    -- Cost calculation for farmer's farm size
    CASE
        WHEN d.area_unit = 'acre' THEN tc.dose_per_acre * tc.price_per_unit * d.farm_area
        WHEN d.area_unit = 'bigha' THEN tc.dose_per_acre * tc.price_per_unit * (d.farm_area * 0.33) -- 1 bigha ≈ 0.33 acre
        WHEN d.area_unit = 'katha' THEN tc.dose_per_acre * tc.price_per_unit * (d.farm_area * 0.0165) -- 1 katha ≈ 0.0165 acre
        ELSE tc.dose_per_acre * tc.price_per_unit * d.farm_area
    END as estimated_chemical_cost_for_farm,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district
FROM
    treatment_chemicals tc
    INNER JOIN disease_treatments dt ON tc.treatment_id = dt.treatment_id
    INNER JOIN diagnoses d ON dt.diagnosis_id = d.diagnosis_id
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id;

-- View: Pending Diagnoses for Expert Verification
-- Shows diagnoses waiting for expert verification
CREATE VIEW `v_pending_diagnoses_for_verification` AS
SELECT
    d.diagnosis_id,
    d.crop_type,
    d.symptoms_description,
    d.uploaded_images,
    d.farm_area,
    d.area_unit,
    d.urgency,
    d.location,
    d.created_at,
    DATEDIFF(NOW(), d.created_at) as days_pending,
    -- Farmer information
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    -- AI analysis summary
    JSON_EXTRACT(
        d.ai_analysis_result,
        '$.predicted_disease'
    ) as ai_predicted_disease,
    JSON_EXTRACT(
        d.ai_analysis_result,
        '$.confidence_score'
    ) as ai_confidence_score,
    -- Available experts for verification
    GROUP_CONCAT(
        DISTINCT CONCAT(
            expert_prof.full_name,
            ' (',
            eq.specialization,
            ', Rating: ',
            eq.rating,
            ')'
        ) SEPARATOR '; '
    ) as available_experts
FROM
    diagnoses d
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN expert_qualifications eq ON (
        eq.specialization LIKE CONCAT('%', d.crop_type, '%')
        OR d.crop_type LIKE CONCAT('%', eq.specialization, '%')
    )
    LEFT JOIN users expert_u ON eq.user_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
WHERE
    d.is_verified_by_expert = FALSE
    AND d.status = 'pending'
GROUP BY
    d.diagnosis_id,
    d.crop_type,
    d.symptoms_description,
    d.uploaded_images,
    d.farm_area,
    d.area_unit,
    d.urgency,
    d.location,
    d.created_at,
    farmer_prof.full_name,
    farmer_prof.district,
    farmer_prof.upazila,
    farmer_u.phone,
    d.ai_analysis_result
ORDER BY d.urgency DESC, d.created_at ASC;

-- View: Disease Statistics by Crop Type
-- Shows disease statistics grouped by crop type
CREATE VIEW `v_disease_statistics_by_crop` AS
SELECT
    d.crop_type,
    COUNT(DISTINCT d.diagnosis_id) as total_diagnoses,
    COUNT(DISTINCT d.farmer_id) as unique_farmers_affected,
    COUNT(DISTINCT dt.disease_name) as unique_diseases_identified,
    COUNT(
        CASE
            WHEN d.status = 'diagnosed' THEN d.diagnosis_id
        END
    ) as diagnosed_cases,
    COUNT(
        CASE
            WHEN d.status = 'completed' THEN d.diagnosis_id
        END
    ) as completed_cases,
    COUNT(
        CASE
            WHEN d.is_verified_by_expert = TRUE THEN d.diagnosis_id
        END
    ) as expert_verified_cases,
    AVG(dt.estimated_cost) as avg_treatment_cost,
    SUM(d.farm_area) as total_affected_area,
    COUNT(
        CASE
            WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN d.diagnosis_id
        END
    ) as cases_last_30_days,
    -- Most common disease for this crop
    (
        SELECT dt2.disease_name
        FROM
            disease_treatments dt2
            INNER JOIN diagnoses d2 ON dt2.diagnosis_id = d2.diagnosis_id
        WHERE
            d2.crop_type = d.crop_type
        GROUP BY
            dt2.disease_name
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) as most_common_disease
FROM
    diagnoses d
    LEFT JOIN disease_treatments dt ON d.diagnosis_id = dt.diagnosis_id
WHERE
    d.crop_type IS NOT NULL
    AND d.crop_type != ''
GROUP BY
    d.crop_type
ORDER BY total_diagnoses DESC;

-- View: Expert Verification Performance
-- Shows expert performance in disease verification
CREATE VIEW `v_expert_verification_performance` AS
SELECT
    expert_u.user_id as expert_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.specialization,
    eq.rating,
    -- Verification statistics
    COUNT(DISTINCT d.diagnosis_id) as total_verifications,
    COUNT(
        CASE
            WHEN d.status = 'diagnosed' THEN d.diagnosis_id
        END
    ) as successful_diagnoses,
    COUNT(
        CASE
            WHEN d.status = 'completed' THEN d.diagnosis_id
        END
    ) as completed_cases,
    COUNT(
        CASE
            WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN d.diagnosis_id
        END
    ) as verifications_last_30_days,
    -- Performance metrics
    AVG(
        DATEDIFF(d.updated_at, d.created_at)
    ) as avg_verification_days,
    CASE
        WHEN COUNT(DISTINCT d.diagnosis_id) > 0 THEN ROUND(
            (
                COUNT(
                    CASE
                        WHEN d.status = 'completed' THEN d.diagnosis_id
                    END
                ) / COUNT(DISTINCT d.diagnosis_id)
            ) * 100,
            2
        )
        ELSE 0
    END as completion_rate_percent,
    -- Most verified crop types
    GROUP_CONCAT(
        DISTINCT d.crop_type
        ORDER BY d.crop_type
    ) as verified_crop_types
FROM
    users expert_u
    INNER JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN diagnoses d ON expert_u.user_id = d.expert_verification_id
WHERE
    expert_u.user_type = 'expert'
GROUP BY
    expert_u.user_id,
    expert_prof.full_name,
    expert_prof.district,
    eq.specialization,
    eq.rating
ORDER BY total_verifications DESC;

-- View: Disease Outbreak Alert
-- Identifies potential disease outbreaks by location and time
CREATE VIEW `v_disease_outbreak_alert` AS
SELECT
    dt.disease_name,
    dt.disease_name_bn,
    d.crop_type,
    d.location,
    farmer_prof.district,
    farmer_prof.upazila,
    COUNT(*) as cases_count,
    COUNT(
        CASE
            WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN d.diagnosis_id
        END
    ) as cases_last_7_days,
    COUNT(
        CASE
            WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN d.diagnosis_id
        END
    ) as cases_last_30_days,
    AVG(dt.probability_percentage) as avg_probability,
    SUM(d.farm_area) as total_affected_area,
    MIN(d.created_at) as first_case_date,
    MAX(d.created_at) as latest_case_date,
    -- Alert level based on recent cases and affected area
    CASE
        WHEN COUNT(
            CASE
                WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN d.diagnosis_id
            END
        ) >= 5 THEN 'High Alert'
        WHEN COUNT(
            CASE
                WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN d.diagnosis_id
            END
        ) >= 3 THEN 'Medium Alert'
        WHEN COUNT(
            CASE
                WHEN d.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN d.diagnosis_id
            END
        ) >= 5 THEN 'Low Alert'
        ELSE 'Normal'
    END as alert_level
FROM
    diagnoses d
    INNER JOIN disease_treatments dt ON d.diagnosis_id = dt.diagnosis_id
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
WHERE
    d.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY
    dt.disease_name,
    dt.disease_name_bn,
    d.crop_type,
    d.location,
    farmer_prof.district,
    farmer_prof.upazila
HAVING
    cases_count >= 2
ORDER BY
    cases_last_7_days DESC,
    total_affected_area DESC;

-- View: Treatment Cost Analysis
-- Analyzes treatment costs by disease and location
CREATE VIEW `v_treatment_cost_analysis` AS
SELECT
    dt.disease_name,
    dt.disease_name_bn,
    d.crop_type,
    farmer_prof.district,
    COUNT(DISTINCT d.diagnosis_id) as total_cases,
    AVG(dt.estimated_cost) as avg_treatment_cost,
    MIN(dt.estimated_cost) as min_treatment_cost,
    MAX(dt.estimated_cost) as max_treatment_cost,
    -- Chemical cost analysis
    AVG(tc.price_per_unit) as avg_chemical_price_per_unit,
    COUNT(DISTINCT tc.chemical_id) as different_chemicals_used,
    GROUP_CONCAT(
        DISTINCT tc.chemical_name
        ORDER BY tc.price_per_unit DESC
        LIMIT 3
    ) as most_expensive_chemicals,
    -- Area and total cost projections
    AVG(d.farm_area) as avg_affected_farm_size,
    SUM(d.farm_area) as total_affected_area,
    SUM(dt.estimated_cost) as total_estimated_treatment_cost
FROM
    diagnoses d
    INNER JOIN disease_treatments dt ON d.diagnosis_id = dt.diagnosis_id
    LEFT JOIN treatment_chemicals tc ON dt.treatment_id = tc.treatment_id
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
WHERE
    dt.estimated_cost IS NOT NULL
GROUP BY
    dt.disease_name,
    dt.disease_name_bn,
    d.crop_type,
    farmer_prof.district
HAVING
    total_cases >= 1
ORDER BY avg_treatment_cost DESC;

-- View: Recent Diagnosis Activity
-- Shows recent diagnosis activities across the system
CREATE VIEW `v_recent_diagnosis_activity` AS
SELECT
    'diagnosis_created' as activity_type,
    d.diagnosis_id as entity_id,
    CONCAT(
        d.crop_type,
        ' - ',
        LEFT(d.symptoms_description, 50),
        '...'
    ) as entity_description,
    d.created_at as activity_date,
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    d.urgency,
    d.status
FROM
    diagnoses d
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
WHERE
    d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
UNION ALL
SELECT
    'diagnosis_verified' as activity_type,
    d.diagnosis_id as entity_id,
    CONCAT(
        d.crop_type,
        ' - Verified by ',
        expert_prof.full_name
    ) as entity_description,
    d.updated_at as activity_date,
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    d.urgency,
    d.status
FROM
    diagnoses d
    INNER JOIN users farmer_u ON d.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN users expert_u ON d.expert_verification_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
WHERE
    d.is_verified_by_expert = TRUE
    AND d.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY activity_date DESC
LIMIT 50;