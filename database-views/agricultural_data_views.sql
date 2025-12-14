-- =====================================================
-- Agricultural Data Views
-- For Langol Krishi Sahayak System
-- =====================================================

-- View: Complete Crop Recommendations
-- Shows crop recommendations with farmer details and profitability analysis
CREATE VIEW `v_crop_recommendations_complete` AS
SELECT
    cr.recommendation_id,
    cr.location,
    cr.soil_type,
    cr.season,
    cr.land_size,
    cr.land_unit,
    cr.budget,
    cr.recommended_crops,
    cr.climate_data,
    cr.market_analysis,
    cr.profitability_analysis,
    cr.year_plan,
    cr.created_at,
    -- Farmer information
    cr.farmer_id,
    farmer_prof.full_name as farmer_name,
    farmer_prof.district as farmer_district,
    farmer_prof.upazila as farmer_upazila,
    farmer_u.phone as farmer_phone,
    -- Expert information (if recommended by expert)
    cr.expert_id,
    expert_prof.full_name as expert_name,
    expert_prof.district as expert_district,
    eq.specialization as expert_specialization,
    eq.rating as expert_rating,
    -- Farmer's existing farm details
    fd.farm_size as current_farm_size,
    fd.farm_size_unit as current_farm_unit,
    fd.farm_type as current_farm_type,
    fd.experience_years as farmer_experience
FROM
    crop_recommendations cr
    INNER JOIN users farmer_u ON cr.farmer_id = farmer_u.user_id
    LEFT JOIN user_profiles farmer_prof ON farmer_u.user_id = farmer_prof.user_id
    LEFT JOIN farmer_details fd ON farmer_u.user_id = fd.user_id
    LEFT JOIN users expert_u ON cr.expert_id = expert_u.user_id
    LEFT JOIN user_profiles expert_prof ON expert_u.user_id = expert_prof.user_id
    LEFT JOIN expert_qualifications eq ON expert_u.user_id = eq.user_id;

-- View: Crop Database with Profitability Analysis
-- Enhanced crop database with profitability metrics
CREATE VIEW `v_crops_profitability_analysis` AS
SELECT
    cd.crop_id,
    cd.crop_name,
    cd.crop_name_bn,
    cd.season,
    cd.region,
    cd.cost_per_bigha,
    cd.yield_per_bigha,
    cd.market_price_per_unit,
    cd.duration_days,
    cd.profit_per_bigha,
    cd.difficulty_level,
    cd.is_quick_harvest,
    cd.description,
    cd.created_at,
    cd.updated_at,
    -- Profitability calculations
    ROUND(
        (
            cd.profit_per_bigha / cd.cost_per_bigha
        ) * 100,
        2
    ) as profit_margin_percent,
    ROUND(
        cd.profit_per_bigha / cd.duration_days,
        2
    ) as profit_per_day,
    ROUND(
        (
            cd.yield_per_bigha * cd.market_price_per_unit
        ) - cd.cost_per_bigha,
        2
    ) as calculated_profit,
    -- ROI calculation
    ROUND(
        (
            (
                cd.yield_per_bigha * cd.market_price_per_unit - cd.cost_per_bigha
            ) / cd.cost_per_bigha
        ) * 100,
        2
    ) as roi_percent,
    -- Market price trends (from market_prices table)
    AVG(mp.price_per_unit) as avg_market_price_last_30_days,
    MAX(mp.price_per_unit) as max_market_price_last_30_days,
    MIN(mp.price_per_unit) as min_market_price_last_30_days
FROM
    crops_database cd
    LEFT JOIN market_prices mp ON cd.crop_name = mp.crop_name
    AND mp.price_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY
    cd.crop_id,
    cd.crop_name,
    cd.crop_name_bn,
    cd.season,
    cd.region,
    cd.cost_per_bigha,
    cd.yield_per_bigha,
    cd.market_price_per_unit,
    cd.duration_days,
    cd.profit_per_bigha,
    cd.difficulty_level,
    cd.is_quick_harvest,
    cd.description,
    cd.created_at,
    cd.updated_at
ORDER BY roi_percent DESC;

-- View: Weather Data with Agricultural Insights
-- Weather data with agricultural advice and seasonal information
CREATE VIEW `v_weather_agricultural_insights` AS
SELECT
    wd.weather_id,
    wd.location,
    wd.date,
    wd.temperature_min,
    wd.temperature_max,
    wd.humidity,
    wd.rainfall,
    wd.wind_speed,
    wd.weather_condition,
    wd.weather_condition_bn,
    wd.agricultural_advice,
    wd.agricultural_advice_bn,
    wd.season,
    wd.created_at,
    -- Weather analysis
    (
        wd.temperature_min + wd.temperature_max
    ) / 2 as avg_temperature,
    CASE
        WHEN wd.rainfall > 50 THEN 'Heavy Rain'
        WHEN wd.rainfall > 20 THEN 'Moderate Rain'
        WHEN wd.rainfall > 5 THEN 'Light Rain'
        ELSE 'No Rain'
    END as rainfall_category,
    CASE
        WHEN wd.humidity > 80 THEN 'Very High'
        WHEN wd.humidity > 60 THEN 'High'
        WHEN wd.humidity > 40 THEN 'Moderate'
        ELSE 'Low'
    END as humidity_level,
    -- Suitable crops for current weather
    GROUP_CONCAT(
        DISTINCT cd.crop_name
        ORDER BY cd.profit_per_bigha DESC
        LIMIT 5
    ) as suitable_crops_for_season
FROM
    weather_data wd
    LEFT JOIN crops_database cd ON wd.season = cd.season
GROUP BY
    wd.weather_id,
    wd.location,
    wd.date,
    wd.temperature_min,
    wd.temperature_max,
    wd.humidity,
    wd.rainfall,
    wd.wind_speed,
    wd.weather_condition,
    wd.weather_condition_bn,
    wd.agricultural_advice,
    wd.agricultural_advice_bn,
    wd.season,
    wd.created_at
ORDER BY wd.date DESC;

-- View: Market Prices with Trends
-- Market prices with trend analysis and price predictions
CREATE VIEW `v_market_prices_with_trends` AS
SELECT
    mp.price_id,
    mp.crop_name,
    mp.crop_name_bn,
    mp.market_location,
    mp.price_per_unit,
    mp.unit,
    mp.price_date,
    mp.price_trend,
    mp.source,
    mp.wholesale_price,
    mp.retail_price,
    mp.created_at,
    -- Price analysis
    ROUND(
        mp.retail_price - mp.wholesale_price,
        2
    ) as price_margin,
    ROUND(
        (
            (
                mp.retail_price - mp.wholesale_price
            ) / mp.wholesale_price
        ) * 100,
        2
    ) as margin_percent,
    -- Historical price comparison
    LAG(mp.price_per_unit) OVER (
        PARTITION BY
            mp.crop_name,
            mp.market_location
        ORDER BY mp.price_date
    ) as previous_price,
    ROUND(
        mp.price_per_unit - LAG(mp.price_per_unit) OVER (
            PARTITION BY
                mp.crop_name,
                mp.market_location
            ORDER BY mp.price_date
        ),
        2
    ) as price_change,
    -- Weekly and monthly averages
    AVG(mp.price_per_unit) OVER (
        PARTITION BY
            mp.crop_name,
            mp.market_location
        ORDER BY mp.price_date ROWS BETWEEN 6 PRECEDING
            AND CURRENT ROW
    ) as week_avg_price,
    AVG(mp.price_per_unit) OVER (
        PARTITION BY
            mp.crop_name,
            mp.market_location
        ORDER BY mp.price_date ROWS BETWEEN 29 PRECEDING
            AND CURRENT ROW
    ) as month_avg_price
FROM market_prices mp
ORDER BY mp.crop_name, mp.market_location, mp.price_date DESC;

-- View: Agricultural News with Categorization
-- Agricultural news with enhanced categorization and relevance scoring
CREATE VIEW `v_agricultural_news_enhanced` AS
SELECT
    an.news_id,
    an.title,
    an.title_bn,
    an.content,
    an.content_bn,
    an.summary,
    an.summary_bn,
    an.author,
    an.source_url,
    an.featured_image_url,
    an.category,
    an.tags,
    an.is_government_notice,
    an.is_featured,
    an.publish_date,
    an.created_at,
    an.updated_at,
    -- Content analysis
    CASE
        WHEN an.title LIKE '%price%'
        OR an.title LIKE '%market%'
        OR an.title LIKE '%দাম%' THEN 'market_related'
        WHEN an.title LIKE '%weather%'
        OR an.title LIKE '%climate%'
        OR an.title LIKE '%আবহাওয়া%' THEN 'weather_related'
        WHEN an.title LIKE '%disease%'
        OR an.title LIKE '%pest%'
        OR an.title LIKE '%রোগ%' THEN 'disease_related'
        WHEN an.title LIKE '%technology%'
        OR an.title LIKE '%modern%'
        OR an.title LIKE '%প্রযুক্তি%' THEN 'technology_related'
        WHEN an.title LIKE '%subsidy%'
        OR an.title LIKE '%government%'
        OR an.title LIKE '%ভর্তুকি%' THEN 'policy_related'
        ELSE 'general'
    END as content_type,
    -- Relevance scoring based on recency and importance
    CASE
        WHEN an.is_government_notice = TRUE THEN 100
        WHEN an.is_featured = TRUE THEN 80
        WHEN an.publish_date >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 70
        WHEN an.publish_date >= DATE_SUB(NOW(), INTERVAL 3 DAY) THEN 60
        WHEN an.publish_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 50
        WHEN an.publish_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 40
        ELSE 30
    END as relevance_score,
    DATEDIFF(NOW(), an.publish_date) as days_since_published
FROM agricultural_news an
WHERE
    an.publish_date IS NOT NULL
ORDER BY relevance_score DESC, an.publish_date DESC;

-- View: Seasonal Crop Recommendations
-- Provides seasonal crop recommendations based on current date and location
CREATE VIEW `v_seasonal_crop_recommendations` AS
SELECT
    cd.crop_id,
    cd.crop_name,
    cd.crop_name_bn,
    cd.season,
    cd.region,
    cd.cost_per_bigha,
    cd.yield_per_bigha,
    cd.market_price_per_unit,
    cd.duration_days,
    cd.profit_per_bigha,
    cd.difficulty_level,
    cd.is_quick_harvest,
    -- Profitability metrics
    ROUND(
        (
            cd.profit_per_bigha / cd.cost_per_bigha
        ) * 100,
        2
    ) as roi_percent,
    ROUND(
        cd.profit_per_bigha / cd.duration_days,
        2
    ) as profit_per_day,
    -- Current season suitability
    CASE
        WHEN MONTH(NOW()) IN (11, 12, 1, 2, 3)
        AND cd.season = 'Rabi' THEN 'Highly Suitable'
        WHEN MONTH(NOW()) IN (4, 5, 6, 7, 8, 9, 10)
        AND cd.season = 'Kharif' THEN 'Highly Suitable'
        WHEN cd.season = 'All seasons' THEN 'Suitable'
        ELSE 'Not Suitable for Current Season'
    END as current_season_suitability,
    -- Market price trends
    AVG(mp.price_per_unit) as avg_recent_market_price,
    COUNT(mp.price_id) as price_data_points,
    -- Weather suitability
    AVG(wd.temperature_max) as avg_temperature,
    AVG(wd.rainfall) as avg_rainfall
FROM
    crops_database cd
    LEFT JOIN market_prices mp ON cd.crop_name = mp.crop_name
    AND mp.price_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    LEFT JOIN weather_data wd ON cd.region = wd.location
    AND wd.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY
    cd.crop_id,
    cd.crop_name,
    cd.crop_name_bn,
    cd.season,
    cd.region,
    cd.cost_per_bigha,
    cd.yield_per_bigha,
    cd.market_price_per_unit,
    cd.duration_days,
    cd.profit_per_bigha,
    cd.difficulty_level,
    cd.is_quick_harvest
HAVING
    current_season_suitability != 'Not Suitable for Current Season'
ORDER BY
    current_season_suitability DESC,
    roi_percent DESC;

-- View: Agricultural Data Dashboard Summary
-- Summary view for dashboard displaying key agricultural metrics
CREATE VIEW `v_agricultural_dashboard_summary` AS
SELECT
    -- Crop statistics
    (
        SELECT COUNT(*)
        FROM crops_database
    ) as total_crops_in_database,
    (
        SELECT COUNT(DISTINCT crop_name)
        FROM market_prices
        WHERE
            price_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as crops_with_recent_prices,
    (
        SELECT COUNT(*)
        FROM crop_recommendations
        WHERE
            created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ) as recommendations_last_30_days,
    -- Market statistics
    (
        SELECT COUNT(DISTINCT crop_name)
        FROM market_prices
    ) as total_crops_in_market,
    (
        SELECT COUNT(DISTINCT market_location)
        FROM market_prices
    ) as total_market_locations,
    (
        SELECT AVG(price_per_unit)
        FROM market_prices
        WHERE
            price_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as avg_market_price_last_week,
    -- Weather statistics
    (
        SELECT COUNT(DISTINCT location)
        FROM weather_data
        WHERE
            date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as locations_with_recent_weather,
    (
        SELECT AVG(temperature_max)
        FROM weather_data
        WHERE
            date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as avg_max_temperature_last_week,
    (
        SELECT AVG(rainfall)
        FROM weather_data
        WHERE
            date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as avg_rainfall_last_week,
    -- News statistics
    (
        SELECT COUNT(*)
        FROM agricultural_news
        WHERE
            publish_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ) as news_articles_last_week,
    (
        SELECT COUNT(*)
        FROM agricultural_news
        WHERE
            is_government_notice = TRUE
            AND publish_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ) as government_notices_last_30_days,
    -- Current date and season
    CURDATE() as current_date,
    CASE
        WHEN MONTH(NOW()) IN (11, 12, 1, 2, 3) THEN 'Rabi Season'
        WHEN MONTH(NOW()) IN (4, 5, 6, 7, 8, 9, 10) THEN 'Kharif Season'
        ELSE 'Transition Period'
    END as current_agricultural_season;

-- View: Location-based Agricultural Summary
-- Agricultural data summary grouped by location
CREATE VIEW `v_location_agricultural_summary` AS
SELECT
    COALESCE(
        wd.location,
        mp.market_location,
        'Unknown'
    ) as location,
    -- Weather data
    COUNT(DISTINCT wd.weather_id) as weather_records_count,
    AVG(wd.temperature_max) as avg_max_temperature,
    AVG(wd.rainfall) as avg_rainfall,
    AVG(wd.humidity) as avg_humidity,
    -- Market data
    COUNT(DISTINCT mp.crop_name) as crops_available_in_market,
    COUNT(DISTINCT mp.price_id) as price_records_count,
    AVG(mp.price_per_unit) as avg_crop_price,
    -- Crop recommendations
    COUNT(DISTINCT cr.recommendation_id) as total_recommendations,
    COUNT(DISTINCT cr.farmer_id) as farmers_received_recommendations,
    -- Suitable crops for the location
    GROUP_CONCAT(
        DISTINCT cd.crop_name
        ORDER BY cd.profit_per_bigha DESC
        LIMIT 5
    ) as top_profitable_crops
FROM
    weather_data wd FULL OUTER
    JOIN market_prices mp ON wd.location = mp.market_location
    LEFT JOIN crop_recommendations cr ON wd.location = cr.location
    LEFT JOIN crops_database cd ON wd.season = cd.season
WHERE
    wd.date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
    OR mp.price_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
    OR cr.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY
    COALESCE(
        wd.location,
        mp.market_location
    )
ORDER BY
    total_recommendations DESC,
    weather_records_count DESC;