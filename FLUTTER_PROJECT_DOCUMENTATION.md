# Langol - Flutter App Conversion Documentation

## 📋 Project Overview

This document provides a comprehensive analysis of the existing React TypeScript web application and detailed specifications for converting it to a Flutter mobile application with PHP Laravel backend.

### Target Tech Stack

- **Frontend**: Flutter (Dart)
- **Backend**: PHP Laravel (separate project)
- **Database**: MySQL
- **Authentication**: JWT tokens
- **State Management**: Flutter Bloc + Clean Architecture

## 🎯 Application Features Analysis

### User Roles & Access Control

1. **Farmer (কৃষক)** - Primary user role

   - Dashboard with agricultural tools and services
   - Crop recommendation and disease diagnosis
   - Marketplace access for selling products
   - Social feed participation
   - Expert consultation requests

2. **Expert/Consultant (বিশেষজ্ঞ)** - Agricultural specialists

   - Consultation management dashboard
   - Disease diagnosis validation
   - Crop information management
   - Response to farmer queries

3. **Customer (ক্রেতা)** - Product buyers

   - Marketplace browsing and purchasing
   - Social feed participation
   - Agricultural news access
   - Order history management

4. **Data Operator (ডেটা অপারেটর)** - Administrative role
   - Profile verification system
   - Crop information verification
   - Field data collection
   - Report generation and statistics
   - Social feed moderation
   - **Note**: This role will be excluded from initial Flutter implementation

### Core Features

#### 1. Authentication & Profile Management

- **Phone number + Password based registration/login**
- **Role-based access control**
- **Profile creation with document verification**
- **Profile editing and password change**
- **Intro animation for new users**

#### 2. Social Feed System (কৃষি ফিড)

- **Create posts with text and images**
- **Like, comment, and share functionality**
- **Community interaction between farmers**
- **Content reporting and moderation**
- **Real-time feed updates**

#### 3. Marketplace (বাজার)

- **Product listing creation by farmers**
- **Category-wise product browsing**
- **Search and filter functionality**
- **Product purchase system**
- **Order management and history**
- **Price negotiation features**

#### 4. Crop Recommendation System (ফসল সুপারিশ)

- **AI-powered crop recommendations**
- **Input parameters: location, season, soil type, budget**
- **Profitability analysis**
- **Seasonal crop suggestions**
- **Historical data analysis**

#### 5. Disease Diagnosis (রোগ নির্ণয়)

- **Image-based plant disease detection**
- **AI-powered diagnosis system**
- **Treatment recommendations**
- **Expert verification of diagnoses**
- **Diagnosis history tracking**
- **Offline diagnosis capability**

#### 6. Expert Consultation (বিশেষজ্ঞ পরামর্শ)

- **Expert discovery and listing**
- **Real-time chat with experts**
- **Video call consultation**
- **Appointment scheduling**
- **Consultation history**
- **Rating and review system**

#### 7. Weather Planning (আবহাওয়া পরিকল্পনা)

- **Current weather information**
- **7-day weather forecast**
- **Agricultural alerts and warnings**
- **Seasonal planning guidance**
- **Location-based weather data**

#### 8. Market Prices (বাজার দর)

- **Real-time crop price information**
- **Historical price trends**
- **Market analysis and predictions**
- **Price alerts and notifications**
- **Multiple market data sources**

#### 9. Agricultural News (কৃষি সংবাদ)

- **Latest agricultural news and updates**
- **Government policy information**
- **Seasonal farming tips**
- **Technology updates**
- **Regional news filtering**

#### 10. Notification System (বিজ্ঞপ্তি)

- **Push notifications for important updates**
- **In-app notification center**
- **Consultation reminders**
- **Price alert notifications**
- **Social feed activity notifications**

## 🏗 Flutter Project Architecture

### Clean Architecture Implementation

```
lib/
├── core/
│   ├── constants/
│   │   ├── app_constants.dart          # App-wide constants
│   │   ├── api_endpoints.dart          # API endpoint URLs
│   │   ├── asset_constants.dart        # Asset paths
│   │   └── theme_constants.dart        # UI theme constants
│   ├── errors/
│   │   ├── failures.dart               # Abstract failure classes
│   │   ├── exceptions.dart             # Custom exceptions
│   │   └── error_handler.dart          # Global error handling
│   ├── network/
│   │   ├── dio_client.dart             # HTTP client configuration
│   │   ├── api_client.dart             # API service wrapper
│   │   ├── network_info.dart           # Internet connectivity check
│   │   └── interceptors/
│   │       ├── auth_interceptor.dart   # JWT token handling
│   │       ├── logging_interceptor.dart # Request/response logging
│   │       └── error_interceptor.dart  # Error response handling
│   ├── storage/
│   │   ├── secure_storage.dart         # Secure data storage
│   │   ├── cache_storage.dart          # Local cache management
│   │   └── preferences_storage.dart    # App preferences
│   ├── utils/
│   │   ├── validators.dart             # Form validation utilities
│   │   ├── helpers.dart                # Helper functions
│   │   ├── date_formatter.dart         # Date/time formatting
│   │   ├── image_utils.dart            # Image processing utilities
│   │   ├── location_utils.dart         # Location services
│   │   └── notification_utils.dart     # Notification helpers
│   ├── services/
│   │   ├── location_service.dart       # GPS location service
│   │   ├── camera_service.dart         # Camera functionality
│   │   ├── notification_service.dart   # Push notifications
│   │   ├── file_service.dart           # File operations
│   │   └── permission_service.dart     # App permissions
│   └── widgets/
│       ├── loading_widget.dart         # Loading indicators
│       ├── error_widget.dart           # Error display
│       ├── empty_state_widget.dart     # Empty state UI
│       ├── network_image_widget.dart   # Cached network images
│       └── custom_dialogs.dart         # Reusable dialogs
├── data/
│   ├── datasources/
│   │   ├── remote/
│   │   │   ├── auth_remote_datasource.dart
│   │   │   ├── user_remote_datasource.dart
│   │   │   ├── social_feed_remote_datasource.dart
│   │   │   ├── marketplace_remote_datasource.dart
│   │   │   ├── consultation_remote_datasource.dart
│   │   │   ├── diagnosis_remote_datasource.dart
│   │   │   ├── recommendation_remote_datasource.dart
│   │   │   ├── weather_remote_datasource.dart
│   │   │   ├── news_remote_datasource.dart
│   │   │   └── notification_remote_datasource.dart
│   │   └── local/
│   │       ├── auth_local_datasource.dart
│   │       ├── user_local_datasource.dart
│   │       ├── cache_datasource.dart
│   │       ├── offline_data_datasource.dart
│   │       └── settings_datasource.dart
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── auth_model.dart
│   │   ├── social_post_model.dart
│   │   ├── marketplace_listing_model.dart
│   │   ├── consultation_model.dart
│   │   ├── expert_model.dart
│   │   ├── diagnosis_model.dart
│   │   ├── crop_recommendation_model.dart
│   │   ├── weather_model.dart
│   │   ├── news_model.dart
│   │   └── notification_model.dart
│   └── repositories/
│       ├── auth_repository_impl.dart
│       ├── user_repository_impl.dart
│       ├── social_feed_repository_impl.dart
│       ├── marketplace_repository_impl.dart
│       ├── consultation_repository_impl.dart
│       ├── diagnosis_repository_impl.dart
│       ├── recommendation_repository_impl.dart
│       ├── weather_repository_impl.dart
│       ├── news_repository_impl.dart
│       └── notification_repository_impl.dart
├── domain/
│   ├── entities/
│   │   ├── user.dart
│   │   ├── auth_response.dart
│   │   ├── social_post.dart
│   │   ├── marketplace_listing.dart
│   │   ├── consultation.dart
│   │   ├── expert.dart
│   │   ├── diagnosis.dart
│   │   ├── crop_recommendation.dart
│   │   ├── weather.dart
│   │   ├── news_article.dart
│   │   └── notification.dart
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── user_repository.dart
│   │   ├── social_feed_repository.dart
│   │   ├── marketplace_repository.dart
│   │   ├── consultation_repository.dart
│   │   ├── diagnosis_repository.dart
│   │   ├── recommendation_repository.dart
│   │   ├── weather_repository.dart
│   │   ├── news_repository.dart
│   │   └── notification_repository.dart
│   └── usecases/
│       ├── auth/
│       │   ├── login_usecase.dart
│       │   ├── register_usecase.dart
│       │   ├── logout_usecase.dart
│       │   ├── refresh_token_usecase.dart
│       │   └── check_auth_status_usecase.dart
│       ├── user/
│       │   ├── get_user_profile_usecase.dart
│       │   ├── update_user_profile_usecase.dart
│       │   ├── upload_profile_image_usecase.dart
│       │   └── change_password_usecase.dart
│       ├── social/
│       │   ├── get_social_posts_usecase.dart
│       │   ├── create_post_usecase.dart
│       │   ├── like_post_usecase.dart
│       │   ├── comment_post_usecase.dart
│       │   ├── share_post_usecase.dart
│       │   └── report_post_usecase.dart
│       ├── marketplace/
│       │   ├── get_marketplace_listings_usecase.dart
│       │   ├── create_listing_usecase.dart
│       │   ├── update_listing_usecase.dart
│       │   ├── delete_listing_usecase.dart
│       │   ├── purchase_product_usecase.dart
│       │   ├── search_products_usecase.dart
│       │   └── get_order_history_usecase.dart
│       ├── consultation/
│       │   ├── get_experts_usecase.dart
│       │   ├── get_consultations_usecase.dart
│       │   ├── request_consultation_usecase.dart
│       │   ├── respond_consultation_usecase.dart
│       │   ├── rate_expert_usecase.dart
│       │   └── schedule_appointment_usecase.dart
│       ├── diagnosis/
│       │   ├── upload_crop_image_usecase.dart
│       │   ├── get_diagnosis_usecase.dart
│       │   ├── save_diagnosis_usecase.dart
│       │   ├── get_diagnosis_history_usecase.dart
│       │   └── request_expert_verification_usecase.dart
│       ├── recommendation/
│       │   ├── get_crop_recommendations_usecase.dart
│       │   ├── submit_farm_parameters_usecase.dart
│       │   ├── save_crop_selection_usecase.dart
│       │   └── get_recommendation_history_usecase.dart
│       ├── weather/
│       │   ├── get_current_weather_usecase.dart
│       │   ├── get_weather_forecast_usecase.dart
│       │   ├── get_weather_alerts_usecase.dart
│       │   └── set_location_usecase.dart
│       ├── news/
│       │   ├── get_news_articles_usecase.dart
│       │   ├── get_news_categories_usecase.dart
│       │   ├── bookmark_article_usecase.dart
│       │   └── share_article_usecase.dart
│       └── notification/
│           ├── get_notifications_usecase.dart
│           ├── mark_notification_read_usecase.dart
│           ├── clear_all_notifications_usecase.dart
│           └── update_notification_settings_usecase.dart
├── presentation/
│   ├── blocs/
│   │   ├── auth/
│   │   │   ├── auth_bloc.dart
│   │   │   ├── auth_event.dart
│   │   │   └── auth_state.dart
│   │   ├── user/
│   │   │   ├── user_bloc.dart
│   │   │   ├── user_event.dart
│   │   │   └── user_state.dart
│   │   ├── social/
│   │   │   ├── social_feed_bloc.dart
│   │   │   ├── social_feed_event.dart
│   │   │   ├── social_feed_state.dart
│   │   │   ├── post_creation_bloc.dart
│   │   │   ├── post_creation_event.dart
│   │   │   └── post_creation_state.dart
│   │   ├── marketplace/
│   │   │   ├── marketplace_bloc.dart
│   │   │   ├── marketplace_event.dart
│   │   │   ├── marketplace_state.dart
│   │   │   ├── listing_creation_bloc.dart
│   │   │   ├── listing_creation_event.dart
│   │   │   └── listing_creation_state.dart
│   │   ├── consultation/
│   │   │   ├── consultation_bloc.dart
│   │   │   ├── consultation_event.dart
│   │   │   ├── consultation_state.dart
│   │   │   ├── expert_list_bloc.dart
│   │   │   ├── expert_list_event.dart
│   │   │   └── expert_list_state.dart
│   │   ├── diagnosis/
│   │   │   ├── diagnosis_bloc.dart
│   │   │   ├── diagnosis_event.dart
│   │   │   ├── diagnosis_state.dart
│   │   │   ├── camera_bloc.dart
│   │   │   ├── camera_event.dart
│   │   │   └── camera_state.dart
│   │   ├── recommendation/
│   │   │   ├── recommendation_bloc.dart
│   │   │   ├── recommendation_event.dart
│   │   │   └── recommendation_state.dart
│   │   ├── weather/
│   │   │   ├── weather_bloc.dart
│   │   │   ├── weather_event.dart
│   │   │   └── weather_state.dart
│   │   ├── news/
│   │   │   ├── news_bloc.dart
│   │   │   ├── news_event.dart
│   │   │   └── news_state.dart
│   │   └── notification/
│   │       ├── notification_bloc.dart
│   │       ├── notification_event.dart
│   │       └── notification_state.dart
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── intro_animation_page.dart
│   │   │   ├── login_page.dart
│   │   │   ├── register_page.dart
│   │   │   ├── phone_verification_page.dart
│   │   │   └── password_reset_page.dart
│   │   ├── dashboard/
│   │   │   ├── farmer_dashboard_page.dart
│   │   │   ├── expert_dashboard_page.dart
│   │   │   └── customer_dashboard_page.dart
│   │   ├── social/
│   │   │   ├── social_feed_page.dart
│   │   │   ├── create_post_page.dart
│   │   │   ├── post_details_page.dart
│   │   │   └── user_profile_page.dart
│   │   ├── marketplace/
│   │   │   ├── marketplace_page.dart
│   │   │   ├── create_listing_page.dart
│   │   │   ├── product_details_page.dart
│   │   │   ├── purchase_page.dart
│   │   │   ├── order_history_page.dart
│   │   │   └── my_listings_page.dart
│   │   ├── consultation/
│   │   │   ├── consultation_list_page.dart
│   │   │   ├── expert_list_page.dart
│   │   │   ├── expert_profile_page.dart
│   │   │   ├── consultation_details_page.dart
│   │   │   ├── chat_page.dart
│   │   │   ├── video_call_page.dart
│   │   │   └── appointment_booking_page.dart
│   │   ├── diagnosis/
│   │   │   ├── diagnosis_page.dart
│   │   │   ├── camera_capture_page.dart
│   │   │   ├── image_preview_page.dart
│   │   │   ├── diagnosis_result_page.dart
│   │   │   ├── diagnosis_history_page.dart
│   │   │   └── treatment_details_page.dart
│   │   ├── recommendation/
│   │   │   ├── crop_recommendation_page.dart
│   │   │   ├── farm_parameter_form_page.dart
│   │   │   ├── recommendation_result_page.dart
│   │   │   ├── crop_details_page.dart
│   │   │   └── recommendation_history_page.dart
│   │   ├── weather/
│   │   │   ├── weather_dashboard_page.dart
│   │   │   ├── weather_forecast_page.dart
│   │   │   ├── weather_alerts_page.dart
│   │   │   └── location_settings_page.dart
│   │   ├── news/
│   │   │   ├── news_feed_page.dart
│   │   │   ├── news_details_page.dart
│   │   │   ├── news_categories_page.dart
│   │   │   └── bookmarked_articles_page.dart
│   │   ├── market/
│   │   │   ├── market_prices_page.dart
│   │   │   ├── price_history_page.dart
│   │   │   ├── price_alerts_page.dart
│   │   │   └── market_analysis_page.dart
│   │   ├── profile/
│   │   │   ├── profile_page.dart
│   │   │   ├── edit_profile_page.dart
│   │   │   ├── settings_page.dart
│   │   │   ├── change_password_page.dart
│   │   │   ├── notification_settings_page.dart
│   │   │   └── privacy_settings_page.dart
│   │   └── notification/
│   │       ├── notification_page.dart
│   │       └── notification_details_page.dart
│   ├── widgets/
│   │   ├── common/
│   │   │   ├── app_bar.dart
│   │   │   ├── bottom_navigation.dart
│   │   │   ├── drawer.dart
│   │   │   ├── custom_button.dart
│   │   │   ├── custom_text_field.dart
│   │   │   ├── custom_dropdown.dart
│   │   │   ├── image_picker_widget.dart
│   │   │   ├── location_picker_widget.dart
│   │   │   ├── date_picker_widget.dart
│   │   │   ├── search_bar.dart
│   │   │   ├── filter_chips.dart
│   │   │   ├── pagination_widget.dart
│   │   │   └── refresh_indicator_widget.dart
│   │   ├── social/
│   │   │   ├── post_card.dart
│   │   │   ├── comment_widget.dart
│   │   │   ├── like_button.dart
│   │   │   ├── share_button.dart
│   │   │   ├── user_avatar.dart
│   │   │   └── hashtag_widget.dart
│   │   ├── marketplace/
│   │   │   ├── product_card.dart
│   │   │   ├── category_selector.dart
│   │   │   ├── price_filter.dart
│   │   │   ├── location_filter.dart
│   │   │   ├── product_image_carousel.dart
│   │   │   ├── rating_widget.dart
│   │   │   └── add_to_cart_button.dart
│   │   ├── consultation/
│   │   │   ├── expert_card.dart
│   │   │   ├── consultation_card.dart
│   │   │   ├── appointment_card.dart
│   │   │   ├── chat_bubble.dart
│   │   │   ├── voice_message_widget.dart
│   │   │   ├── file_attachment_widget.dart
│   │   │   └── rating_input_widget.dart
│   │   ├── diagnosis/
│   │   │   ├── image_preview_card.dart
│   │   │   ├── diagnosis_result_card.dart
│   │   │   ├── treatment_step_widget.dart
│   │   │   ├── progress_indicator.dart
│   │   │   ├── confidence_meter.dart
│   │   │   └── expert_verification_badge.dart
│   │   ├── recommendation/
│   │   │   ├── crop_card.dart
│   │   │   ├── recommendation_card.dart
│   │   │   ├── parameter_input_widget.dart
│   │   │   ├── profit_calculator.dart
│   │   │   ├── seasonal_indicator.dart
│   │   │   └── comparison_chart.dart
│   │   ├── weather/
│   │   │   ├── current_weather_card.dart
│   │   │   ├── forecast_card.dart
│   │   │   ├── weather_alert_card.dart
│   │   │   ├── temperature_chart.dart
│   │   │   └── weather_icon_widget.dart
│   │   ├── news/
│   │   │   ├── news_card.dart
│   │   │   ├── news_category_chip.dart
│   │   │   ├── bookmark_button.dart
│   │   │   └── news_image_widget.dart
│   │   └── market/
│   │       ├── price_card.dart
│   │       ├── price_trend_chart.dart
│   │       ├── price_alert_card.dart
│   │       └── market_indicator.dart
│   └── themes/
│       ├── app_theme.dart
│       ├── light_theme.dart
│       ├── dark_theme.dart
│       ├── app_colors.dart
│       ├── app_typography.dart
│       └── app_dimensions.dart
├── l10n/
│   ├── app_en.arb
│   ├── app_bn.arb
│   └── l10n.yaml
├── injection_container.dart
└── main.dart
```

## 📱 Required Flutter Packages

### pubspec.yaml Configuration

```yaml
name: langol_krishi_sahayak
description: Agricultural assistance app for farmers, experts, and customers
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  bloc_concurrency: ^0.2.2

  # Dependency Injection
  get_it: ^7.6.4
  injectable: ^2.3.2

  # Networking
  dio: ^5.3.2
  retrofit: ^4.0.3
  json_annotation: ^4.8.1
  pretty_dio_logger: ^1.3.1
  connectivity_plus: ^5.0.1

  # Local Storage & Cache
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  cached_network_image: ^3.3.0

  # UI Components & Navigation
  auto_route: ^7.9.2
  flutter_screenutil: ^5.9.0
  flutter_svg: ^2.0.9
  lottie: ^2.7.0
  shimmer: ^3.0.0

  # Media & Files
  image_picker: ^1.0.4
  file_picker: ^6.1.1
  image_cropper: ^5.0.1
  photo_view: ^0.14.0
  video_player: ^2.7.2

  # Communication
  flutter_webrtc: ^0.9.48
  agora_rtc_engine: ^6.3.2
  socket_io_client: ^2.0.3+1

  # Location & Maps
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  google_maps_flutter: ^2.5.0
  location: ^5.0.3

  # Firebase Services
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  firebase_messaging: ^14.7.10
  firebase_storage: ^11.5.6
  firebase_crashlytics: ^3.4.9
  firebase_analytics: ^10.7.4

  # Notifications
  flutter_local_notifications: ^16.3.0
  awesome_notifications: ^0.8.2

  # Permissions & Security
  permission_handler: ^11.0.1
  crypto: ^3.0.3
  device_info_plus: ^9.1.1

  # Utilities
  intl: ^0.18.1
  url_launcher: ^6.2.1
  share_plus: ^7.2.1
  path_provider: ^2.1.1
  uuid: ^4.1.0
  logger: ^2.0.2+1

  # Charts & Analytics
  fl_chart: ^0.65.0
  syncfusion_flutter_charts: ^23.2.7

  # Form Handling
  reactive_forms: ^16.1.1
  mask_text_input_formatter: ^2.5.0

  # Animation
  flutter_animate: ^4.3.0
  rive: ^0.11.17

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

  # Code Generation
  build_runner: ^2.4.7
  injectable_generator: ^2.4.1
  hive_generator: ^2.0.1
  retrofit_generator: ^8.0.6
  json_serializable: ^6.7.1
  auto_route_generator: ^7.3.2

  # Testing
  mockito: ^5.4.2
  bloc_test: ^9.1.5
  integration_test:
    sdk: flutter

flutter:
  uses-material-design: true
  generate: true

  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/
    - assets/fonts/

  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins-Regular.ttf
        - asset: assets/fonts/Poppins-Medium.ttf
          weight: 500
        - asset: assets/fonts/Poppins-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Poppins-Bold.ttf
          weight: 700
    - family: SolaimanLipi
      fonts:
        - asset: assets/fonts/SolaimanLipi.ttf
```

## 🎨 UI/UX Design Specifications

### Design System

- **Primary Colors**: Green theme (Agricultural focus)
- **Typography**: Poppins (English) + SolaimanLipi (Bengali)
- **Language Support**: Bengali (primary) + English
- **Screen Sizes**: Mobile-first responsive design
- **Dark Mode**: Optional implementation

### Key UI Components

1. **Bottom Navigation**: Role-based navigation items
2. **Custom App Bar**: With notifications and search
3. **Dashboard Cards**: Feature access cards with icons
4. **Image Galleries**: Product and diagnosis images
5. **Chat Interface**: Real-time messaging UI
6. **Form Components**: Agricultural data input forms
7. **Charts**: Weather, price trends, analytics
8. **Maps**: Location selection and display

## 🔧 Technical Implementation Guidelines

### State Management Pattern

```dart
// Example BLoC structure
abstract class AuthEvent extends Equatable {}

class LoginRequested extends AuthEvent {
  final String phoneNumber;
  final String password;

  const LoginRequested({required this.phoneNumber, required this.password});
}

abstract class AuthState extends Equatable {}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthAuthenticated extends AuthState {
  final User user;
  const AuthAuthenticated(this.user);
}
class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
}
```

### API Integration Pattern

```dart
// Repository pattern with clean architecture
abstract class AuthRepository {
  Future<Either<Failure, AuthResponse>> login(String phone, String password);
  Future<Either<Failure, AuthResponse>> register(RegisterRequest request);
  Future<Either<Failure, void>> logout();
}

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  @override
  Future<Either<Failure, AuthResponse>> login(String phone, String password) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.login(phone, password);
        await localDataSource.saveAuthData(result);
        return Right(result.toDomain());
      } catch (e) {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
```

### Database Schema Integration

The Flutter app should integrate with the existing MySQL database structure found in the `database-views` folder. Key tables include:

- **users** - User authentication and basic info
- **user_profiles** - Detailed user profiles
- **consultations** - Expert consultation records
- **diagnoses** - Disease diagnosis data
- **marketplace_listings** - Product listings
- **social_feed_posts** - Social media posts
- **weather_data** - Weather information
- **notifications** - Push notification records

## 🚀 Development Phases

### Phase 1: Project Setup & Core Architecture (Week 1-2)

- [ ] Flutter project initialization
- [ ] Clean architecture setup
- [ ] Dependency injection configuration
- [ ] Network layer implementation
- [ ] Local storage setup
- [ ] Theme and localization setup

### Phase 2: Authentication & User Management (Week 3-4)

- [ ] Login/Register UI implementation
- [ ] Phone number verification
- [ ] JWT token management
- [ ] User profile management
- [ ] Role-based access control
- [ ] Intro animation

### Phase 3: Core Features Implementation (Week 5-8)

- [ ] Social Feed functionality
- [ ] Marketplace implementation
- [ ] Basic navigation structure
- [ ] Image upload/display
- [ ] Search and filtering
- [ ] Basic notifications

### Phase 4: Advanced Features (Week 9-12)

- [ ] Crop recommendation system
- [ ] Disease diagnosis with ML
- [ ] Expert consultation system
- [ ] Video calling integration
- [ ] Weather integration
- [ ] News feed implementation

### Phase 5: Enhancement & Optimization (Week 13-14)

- [ ] Push notifications
- [ ] Offline capabilities
- [ ] Performance optimization
- [ ] Testing and debugging
- [ ] UI/UX refinements

### Phase 6: Testing & Deployment (Week 15-16)

- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] App store preparation
- [ ] Documentation completion

## 📋 API Endpoints Specification

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/verify-phone
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### User Management Endpoints

```
GET /api/user/profile
PUT /api/user/profile
POST /api/user/upload-avatar
PUT /api/user/change-password
GET /api/user/settings
PUT /api/user/settings
```

### Social Feed Endpoints

```
GET /api/social/posts
POST /api/social/posts
PUT /api/social/posts/{id}
DELETE /api/social/posts/{id}
POST /api/social/posts/{id}/like
POST /api/social/posts/{id}/comment
POST /api/social/posts/{id}/share
POST /api/social/posts/{id}/report
```

### Marketplace Endpoints

```
GET /api/marketplace/listings
POST /api/marketplace/listings
PUT /api/marketplace/listings/{id}
DELETE /api/marketplace/listings/{id}
GET /api/marketplace/categories
POST /api/marketplace/purchase
GET /api/marketplace/orders
GET /api/marketplace/search
```

### Consultation Endpoints

```
GET /api/consultation/experts
GET /api/consultation/consultations
POST /api/consultation/request
PUT /api/consultation/respond/{id}
POST /api/consultation/rate/{id}
GET /api/consultation/appointments
POST /api/consultation/schedule
```

### Diagnosis Endpoints

```
POST /api/diagnosis/upload-image
GET /api/diagnosis/result/{id}
POST /api/diagnosis/save
GET /api/diagnosis/history
POST /api/diagnosis/expert-verify
```

### Recommendation Endpoints

```
POST /api/recommendation/analyze
GET /api/recommendation/crops
POST /api/recommendation/save-selection
GET /api/recommendation/history
```

### Weather Endpoints

```
GET /api/weather/current
GET /api/weather/forecast
GET /api/weather/alerts
POST /api/weather/set-location
```

### News Endpoints

```
GET /api/news/articles
GET /api/news/categories
POST /api/news/bookmark/{id}
GET /api/news/bookmarks
```

### Notification Endpoints

```
GET /api/notifications
PUT /api/notifications/{id}/read
DELETE /api/notifications/{id}
POST /api/notifications/settings
GET /api/notifications/settings
```

## 🔐 Security Considerations

### Authentication Security

- JWT token-based authentication
- Refresh token rotation
- Phone number verification via OTP
- Secure token storage using Flutter Secure Storage
- Biometric authentication option

### Data Security

- HTTPS only communication
- Request/response encryption for sensitive data
- Image compression and secure upload
- Local data encryption
- Privacy compliance (user data protection)

### App Security

- Code obfuscation for release builds
- Certificate pinning
- Root/jailbreak detection
- App signing and verification

## 📱 Platform-Specific Features

### Android

- Material Design 3 components
- Android notifications
- File system access
- Camera and gallery permissions
- Location services
- Biometric authentication

### iOS

- Cupertino design elements
- iOS notifications
- Photo library access
- Camera permissions
- Location services
- Face ID/Touch ID integration

## 🧪 Testing Strategy

### Unit Tests

- BLoC state management testing
- Repository layer testing
- Use case testing
- Utility function testing
- Model serialization testing

### Integration Tests

- API integration testing
- Database operations testing
- Authentication flow testing
- Navigation testing

### Widget Tests

- UI component testing
- Form validation testing
- User interaction testing
- Responsive design testing

### End-to-End Tests

- Complete user journey testing
- Cross-platform compatibility
- Performance testing
- Stress testing

## 📊 Performance Optimization

### App Performance

- Lazy loading for lists
- Image caching and optimization
- Memory management
- Battery optimization
- Network request optimization

### UI Performance

- Widget rebuilding optimization
- Animation performance
- List view optimization
- Image loading optimization
- State management efficiency

## 🌐 Internationalization

### Language Support

- Bengali (primary language)
- English (secondary language)
- RTL text support for Bengali
- Number and date formatting
- Currency formatting

### Content Localization

- UI text translation
- Error message translation
- Agricultural term translations
- Region-specific content
- Cultural adaptation

## 📈 Analytics & Monitoring

### User Analytics

- Screen view tracking
- User action tracking
- Feature usage analytics
- Performance monitoring
- Crash reporting

### Business Analytics

- Marketplace transaction tracking
- Consultation completion rates
- User engagement metrics
- Agricultural data insights
- Regional usage patterns

## 🔄 Offline Capabilities

### Offline Features

- Cached news articles
- Downloaded diagnosis history
- Offline consultation messages
- Cached weather data
- Stored user preferences

### Sync Strategy

- Background data synchronization
- Conflict resolution
- Queue management for offline actions
- Progressive data loading
- Smart caching policies

## 📋 Deployment & Distribution

### App Store Requirements

- Android: Google Play Store
- iOS: Apple App Store
- Age rating: 4+ (Everyone)
- Content rating compliance
- Store listing optimization

### Release Management

- Version control strategy
- Staged rollout
- A/B testing capabilities
- Feature flagging
- Rollback procedures

## 🔧 Backend Integration Requirements

### Laravel Backend Setup

The Flutter app requires a PHP Laravel backend with the following specifications:

#### Required Laravel Packages

```json
{
  "laravel/framework": "^10.0",
  "laravel/sanctum": "^3.0",
  "spatie/laravel-permission": "^5.0",
  "intervention/image": "^2.7",
  "pusher/pusher-php-server": "^7.0",
  "laravel/horizon": "^5.0",
  "predis/predis": "^2.0"
}
```

#### API Features Required

- RESTful API endpoints
- JWT authentication with Laravel Sanctum
- File upload handling (images, documents)
- Real-time notifications via Pusher/WebSocket
- Queue system for heavy operations
- Rate limiting and throttling
- API documentation with Swagger

#### Database Requirements

- MySQL 8.0+ database
- Redis for caching and sessions
- Full-text search capabilities
- Spatial data support for location features
- Image storage optimization

## 💡 Additional Recommendations

### Code Quality

- Follow Clean Architecture principles
- Implement comprehensive error handling
- Use meaningful naming conventions
- Write comprehensive documentation
- Follow Dart/Flutter best practices

### User Experience

- Implement smooth animations and transitions
- Provide clear loading states and feedback
- Design intuitive navigation patterns
- Ensure accessibility compliance
- Optimize for different screen sizes

### Scalability

- Design modular and reusable components
- Implement efficient caching strategies
- Plan for horizontal scaling
- Design flexible data models
- Implement proper logging and monitoring

## 📞 Development Support

### Resources Required

- Access to existing React codebase for reference
- API documentation from Laravel backend
- Design assets and branding guidelines
- Test user accounts for different roles
- Sample agricultural data for testing

### Team Collaboration

- Regular code reviews
- Agile development methodology
- Continuous integration/deployment
- Comprehensive testing protocols
- Documentation maintenance

---

This documentation provides a complete roadmap for converting the existing React web application to a Flutter mobile application. The architecture follows clean code principles and industry best practices to ensure maintainability, scalability, and performance.
