# Database Views Documentation

## Langol Krishi Sahayak System

This directory contains comprehensive database views created for the Langol Krishi Sahayak (Agricultural Assistant) system. All views exclude the `active_user_sessions` table as requested.

## 📁 Files Overview

### Core View Files

- **`user_management_views.sql`** - User-related views and authentication
- **`social_feed_views.sql`** - Social media functionality views
- **`marketplace_views.sql`** - Marketplace and trading views
- **`consultation_views.sql`** - Expert consultation system views
- **`diagnosis_views.sql`** - Disease diagnosis and treatment views
- **`agricultural_data_views.sql`** - Weather, crops, and market data views
- **`system_views.sql`** - System administration and monitoring views
- **`comprehensive_views.sql`** - Complex analytics and reporting views
- **`master_views.sql`** - Master file with essential views for quick setup

## 🔍 View Categories

### 1. User Management Views (`user_management_views.sql`)

- **`v_user_complete_info`** - Complete user information with profiles
- **`v_farmer_details`** - Farmer-specific information and farm details
- **`v_expert_details`** - Expert qualifications and ratings
- **`v_customer_details`** - Customer business information
- **`v_data_operator_details`** - Data operator assignments and permissions
- **`v_user_statistics_by_district`** - User distribution by geographic area
- **`v_recent_user_registrations`** - Recently registered users
- **`v_pending_profile_verifications`** - Users awaiting profile verification

### 2. Social Feed Views (`social_feed_views.sql`)

- **`v_posts_with_author`** - Posts with author information and engagement
- **`v_post_tags_with_usage`** - Hashtags and their usage statistics
- **`v_comments_with_author`** - Comments and replies with author details
- **`v_post_engagement_summary`** - Post performance metrics
- **`v_popular_posts_weekly`** - Most popular posts from last week
- **`v_user_social_activity`** - User social media activity summary
- **`v_trending_tags_monthly`** - Trending hashtags analysis
- **`v_post_comments_tree`** - Hierarchical comment structure
- **`v_posts_by_location`** - Geographic post distribution

### 3. Marketplace Views (`marketplace_views.sql`)

- **`v_marketplace_listings_complete`** - Complete listing information with seller details
- **`v_active_marketplace_listings`** - Currently active listings only
- **`v_marketplace_categories_with_counts`** - Categories with listing statistics
- **`v_popular_marketplace_listings`** - Most viewed and saved listings
- **`v_user_saved_listings`** - User favorites and saved items
- **`v_marketplace_activity_by_location`** - Geographic marketplace activity
- **`v_seller_performance`** - Seller success rates and metrics
- **`v_recent_marketplace_activity`** - Recent marketplace events
- **`v_expired_listings_report`** - Expired and expiring listings

### 4. Consultation Views (`consultation_views.sql`)

- **`v_consultations_complete`** - Complete consultation details with participants
- **`v_active_consultations`** - Currently active consultation sessions
- **`v_consultation_responses_complete`** - Expert responses with context
- **`v_expert_performance_metrics`** - Expert performance and statistics
- **`v_pending_consultations_for_assignment`** - Unassigned consultation requests
- **`v_consultation_statistics_by_crop`** - Consultation trends by crop type
- **`v_monthly_consultation_trends`** - Monthly consultation analytics
- **`v_expert_workload_distribution`** - Expert capacity and workload

### 5. Diagnosis Views (`diagnosis_views.sql`)

- **`v_diagnoses_complete`** - Complete diagnosis information with participants
- **`v_disease_treatments_complete`** - Treatment recommendations with context
- **`v_treatment_chemicals_complete`** - Chemical treatments with cost calculations
- **`v_pending_diagnoses_for_verification`** - Diagnoses awaiting expert review
- **`v_disease_statistics_by_crop`** - Disease patterns by crop type
- **`v_expert_verification_performance`** - Expert verification metrics
- **`v_disease_outbreak_alert`** - Disease outbreak monitoring and alerts
- **`v_treatment_cost_analysis`** - Treatment cost analysis by disease/location
- **`v_recent_diagnosis_activity`** - Recent diagnosis activities

### 6. Agricultural Data Views (`agricultural_data_views.sql`)

- **`v_crop_recommendations_complete`** - Crop recommendations with farmer context
- **`v_crops_profitability_analysis`** - Crop profitability and ROI analysis
- **`v_weather_agricultural_insights`** - Weather data with agricultural advice
- **`v_market_prices_with_trends`** - Market prices with trend analysis
- **`v_agricultural_news_enhanced`** - News with categorization and relevance
- **`v_seasonal_crop_recommendations`** - Season-appropriate crop suggestions
- **`v_agricultural_dashboard_summary`** - Key agricultural metrics summary
- **`v_location_agricultural_summary`** - Location-based agricultural data

### 7. System Views (`system_views.sql`)

- **`v_notifications_complete`** - Notifications with sender/recipient details
- **`v_user_sessions_management`** - User session monitoring and management
- **`v_system_settings_management`** - System configuration management
- **`v_data_operator_performance`** - Data operator workload and performance
- **`v_data_operator_activity_logs_detailed`** - Detailed operator activity logs
- **`v_profile_verification_records_detailed`** - Profile verification process tracking
- **`v_field_data_collection_summary`** - Field data collection activities
- **`v_social_feed_reports_management`** - Content moderation and reporting
- **`v_system_health_dashboard`** - Overall system health metrics

### 8. Comprehensive Views (`comprehensive_views.sql`)

- **`v_comprehensive_user_activity`** - Complete user activity across all modules
- **`v_location_agricultural_intelligence`** - Geographic agricultural insights
- **`v_platform_analytics_dashboard`** - Platform-wide analytics and KPIs
- **`v_master_data_export`** - Data export view for backup and analysis

## 🚀 Installation and Usage

### Quick Setup

```sql
-- Execute the master views file for essential views
mysql -u username -p langol_krishi_sahayak < database-views/master_views.sql
```

### Complete Setup

```sql
-- Execute all view files in order
mysql -u username -p langol_krishi_sahayak < database-views/user_management_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/social_feed_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/marketplace_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/consultation_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/diagnosis_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/agricultural_data_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/system_views.sql
mysql -u username -p langol_krishi_sahayak < database-views/comprehensive_views.sql
```

### Prerequisites

- MySQL 8.0+ (for JSON functions and window functions)
- The main `langol_krishi_sahayak_database.sql` schema must be created first
- Proper user permissions for creating views

## 📊 Key Features

### Performance Optimizations

- **Indexed Columns**: Views utilize indexed columns for optimal performance
- **Aggregated Data**: Pre-calculated metrics to reduce query load
- **Filtered Results**: Built-in filtering for active/valid records
- **JSON Functions**: Utilizes MySQL JSON functions for complex data

### Analytics Capabilities

- **Geographic Analysis**: Location-based insights and trends
- **Temporal Analysis**: Time-based trends and seasonal patterns
- **Performance Metrics**: KPIs and success rates across modules
- **Engagement Scoring**: User and content engagement calculations

### Business Intelligence

- **Dashboard Ready**: Views optimized for dashboard consumption
- **Report Generation**: Structured data for automated reporting
- **Trend Analysis**: Historical data and trend calculations
- **Alert Systems**: Built-in alert conditions and thresholds

## 💡 Usage Examples

### Get Active Users by District

```sql
SELECT district, active_users, verified_users
FROM v_user_statistics_by_district
WHERE user_type = 'farmer'
ORDER BY active_users DESC;
```

### Monitor System Health

```sql
SELECT * FROM v_system_health_dashboard;
```

### Analyze Marketplace Performance

```sql
SELECT seller_name, total_listings, success_rate_percent
FROM v_seller_performance
WHERE total_listings >= 5
ORDER BY success_rate_percent DESC;
```

### Track Disease Outbreaks

```sql
SELECT disease_name, location, cases_last_7_days, alert_level
FROM v_disease_outbreak_alert
WHERE alert_level IN ('High Alert', 'Medium Alert');
```

## 🔧 Maintenance

### Regular Maintenance Tasks

1. **Performance Monitoring**: Monitor view query performance
2. **Index Optimization**: Ensure underlying tables have proper indexes
3. **Data Validation**: Verify view results match expected business logic
4. **Documentation Updates**: Keep view documentation current

### Troubleshooting

- **Missing Data**: Check if base tables have required data
- **Slow Queries**: Analyze execution plans and optimize indexes
- **Permission Issues**: Ensure proper database permissions
- **Version Compatibility**: Verify MySQL version compatibility

## 📝 Notes

- All views exclude `active_user_sessions` table as specifically requested
- Views are designed to work with the existing database schema
- JSON columns are utilized where appropriate for complex data structures
- Geographic data is based on Bangladesh's administrative divisions
- Financial calculations use BDT (Bangladeshi Taka) currency
- Date calculations consider Bangladesh's agricultural seasons

## 🤝 Contributing

When modifying or adding new views:

1. Follow the existing naming convention (`v_module_description`)
2. Include proper documentation in comments
3. Test performance with realistic data volumes
4. Update this README with new view descriptions
5. Consider data privacy and security implications

## 📄 License

These database views are part of the Langol Krishi Sahayak system and follow the same licensing terms as the main project.
