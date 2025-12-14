# Functional Requirements

This document outlines the functional requirements for the Langol Krishi Sahayak application, organized by the core features and informed by the project's source code.

## 1. User Registration & Onboarding

**FR 1: Users can create an account with a phone number and password.**

- **Description:** New users must be able to register for an account by providing their mobile number and creating a password.
- **Stakeholders:** All new users.
- **Priority:** High

**FR 2: Users can log in to their account.**

- **Description:** Registered users must be able to securely log in to the application using their phone number and password.
- **Stakeholders:** All registered users.
- **Priority:** High

**FR 3: New users get a simple onboarding tour.**

- **Description:** Upon first login, new users will be shown a brief, guided tour explaining the main features of the app.
- **Stakeholders:** All new users.
- **Priority:** Medium

## 2. Role-Based Authentication & Access Control

**FR 4: The system assigns a role to each user.**

- **Description:** Every user is assigned a specific role (e.g., Farmer, Expert, Data Operator) which defines their identity in the system.
- **Stakeholders:** All users.
- **Priority:** High

**FR 5: Users can only access features permitted for their role.**

- **Description:** The system must restrict access to certain dashboards, data, and functionalities based on the user's assigned role. For example, a Data Operator cannot access the Expert's dashboard.
- **Stakeholders:** All users.
- **Priority:** High

## 3. User Profile Management

**FR 6: Users can view and edit their profile information.**

- **Description:** Users must be able to see their profile details and edit information such as their name, location, and profile picture.
- **Stakeholders:** All users.
- **Priority:** High

**FR 7: Users can change their password.**

- **Description:** For security, users must have the ability to change their account password from their profile settings.
- **Stakeholders:** All users.
- **Priority:** Medium

## 4. Crop Recommendation System (AI-Based)

**FR 8: Farmers can input cultivation parameters for recommendations.**

- **Description:** The system will allow farmers to enter data such as their district, season, budget, and land size to get personalized crop suggestions.
- **Stakeholders:** Farmers.
- **Priority:** High

**FR 9: An AI model analyzes inputs to recommend suitable crops.**

- **Description:** The system's AI model will process the farmer's input parameters to generate a list of the most suitable crops.
- **Stakeholders:** Farmers, Experts.
- **Priority:** High

**FR 10: Each recommendation includes a detailed profit and cost analysis.**

- **Description:** For each suggested crop, the system will provide a breakdown of the estimated cultivation cost, potential yield, market price, and expected profit.
- **Stakeholders:** Farmers.
- **Priority:** High

## 5. Crop Planning Guideline

**FR 11: Farmers can get a step-by-step guide for crop cultivation.**

- **Description:** For a chosen crop, the system provides a simple, sequential guide covering all stages from planting to harvesting.
- **Stakeholders:** Farmers.
- **Priority:** Medium

**FR 12: The guide includes a schedule for farming activities.**

- **Description:** The system provides a calendar or timeline that reminds farmers about important activities like planting, watering, and fertilizing.
- **Stakeholders:** Farmers.
- **Priority:** Low

## 6. Disease Diagnosis System (AI-Based)

**FR 13: Farmers can upload a crop photo for AI-powered diagnosis.**

- **Description:** Users can upload an image of an affected plant. The AI model will analyze the image to identify potential diseases.
- **Stakeholders:** Farmers.
- **Priority:** High

**FR 14: The system provides a list of possible diseases with probability scores.**

- **Description:** After analysis, the system presents a list of potential diseases, each with a confidence score (probability) to indicate the likelihood of the diagnosis.
- **Stakeholders:** Farmers, Experts.
- **Priority:** High

**FR 15: The system suggests detailed treatment plans for each disease.**

- **Description:** For each identified disease, the system provides information on treatment options, including recommended chemicals, application dosage, and estimated costs.
- **Stakeholders:** Farmers, Experts.
- **Priority:** High

**FR 16: Farmers can view their past diagnosis history.**

- **Description:** The system saves all previous diagnoses, allowing farmers to track recurring crop health issues over time.
- **Stakeholders:** Farmers.
- **Priority:** Medium

## 7. Expert Consultation

**FR 17: Users can find and view a list of available experts.**

- **Description:** The system displays a list of agricultural experts, showing their specialization and availability.
- **Stakeholders:** Farmers, Customers.
- **Priority:** High

**FR 18: Users can start a chat or video call with an expert.**

- **Description:** The system allows users to initiate a real-time conversation with an expert to get personalized advice.
- **Stakeholders:** Farmers, Customers, Experts.
- **Priority:** High

**FR 19: Users can schedule an appointment with an expert.**

- **Description:** Users can book a consultation with an expert for a future date and time.
- **Stakeholders:** Farmers, Customers, Experts.
- **Priority:** Medium

## 8. Social Feed System

**FR 20: Users can create and share posts with text and images.**

- **Description:** Users can publish their own content, including text updates and photos, to the community social feed.
- **Stakeholders:** All users.
- **Priority:** Medium

**FR 21: Users can view a feed of posts from others.**

- **Description:** The system displays a scrollable feed of posts created by other members of the community.
- **Stakeholders:** All users.
- **Priority:** Medium

**FR 22: Users can comment on and like posts.**

- **Description:** To encourage interaction, users can leave comments and "like" posts on the social feed.
- **Stakeholders:** All users.
- **Priority:** Medium

## 9. Weather Forecasting

**FR 23: Users can see the weather forecast for their location.**

- **Description:** The system provides current and future weather information, including temperature, rainfall, and humidity, for the user's area.
- **Stakeholders:** Farmers, Data Operators.
- **Priority:** High

**FR 24: The system provides a 7-day weather forecast.**

- **Description:** Users can view a forecast for the upcoming week to help them plan their agricultural activities in advance.
- **Stakeholders:** Farmers.
- **Priority:** Medium

## 10. Marketplace System

**FR 25: Farmers can list their agricultural products for sale.**

- **Description:** Farmers can create listings for their products, including details like price, quantity, and photos.
- **Stakeholders:** Farmers.
- **Priority:** High

**FR 26: Customers can browse and search for products.**

- **Description:** Customers can view all available products in the marketplace and use a search function to find specific items.
- **Stakeholders:** Customers.
- **Priority:** High

**FR 27: Customers can purchase products through the app.**

- **Description:** The system must provide a way for customers to place an order and complete the purchase of products listed in the marketplace.
- **Stakeholders:** Customers, Farmers.
- **Priority:** High

## 11. Market Price Monitoring

**FR 28: Users can view current market prices for various crops.**

- **Description:** The system displays a list of major crops and their real-time average market prices.
- **Stakeholders:** Farmers, Customers.
- **Priority:** High

**FR 29: Users can view historical price trends for a crop.**

- **Description:** The system shows a simple chart illustrating how the price of a specific crop has changed over time.
- **Stakeholders:** Farmers.
- **Priority:** Low

## 12. Agricultural News and Policy Updates

**FR 30: The system displays a feed of agricultural news.**

- **Description:** Users can read recent articles and updates related to the agriculture sector.
- **Stakeholders:** All users.
- **Priority:** Medium

**FR 31: The system provides information on new government policies.**

- **Description:** The app informs users about new or updated government policies and schemes relevant to farmers.
- **Stakeholders:** All users.
- **Priority:** Medium

## 13. Expert Service Dashboard

**FR 32: Experts can view and manage consultation requests.**

- **Description:** Experts have a dashboard where they can see all incoming consultation requests and accept or decline them.
- **Stakeholders:** Experts.
- **Priority:** High

**FR 33: Experts can manage their appointment schedule.**

- **Description:** The dashboard allows experts to set their availability and view their calendar of scheduled appointments.
- **Stakeholders:** Experts.
- **Priority:** High

## 14. Crop & Diagnosis Management

**FR 34: Experts can add or edit crop information.**

- **Description:** Authorized experts can contribute to the system's database by adding new crops or updating details of existing ones.
- **Stakeholders:** Experts, Admins.
- **Priority:** Medium

**FR 35: Experts can review and improve AI diagnosis data.**

- **Description:** Experts can validate the accuracy of the automated diagnosis system and update the disease information and treatment suggestions to retrain the model.
- **Stakeholders:** Experts, Admins.
- **Priority:** Medium

## 15. Profile Verification

**FR 36: Data operators can review and verify new user profiles.**

- **Description:** Data operators are responsible for checking the documents and information provided by new Farmers and Experts to verify their identity.
- **Stakeholders:** Data Operators, Farmers, Experts.
- **Priority:** High

**FR 37: Verified users get a "verified" badge on their profile.**

- **Description:** Once a user's profile is successfully verified, a badge will appear on their profile to build trust within the community.
- **Stakeholders:** All users.
- **Priority:** Medium

## 16. Field Data Collection

**FR 38: Data operators can input field data using a form.**

- **Description:** Data operators can use a digital form in the app to record data collected from the field, such as soil test results and crop conditions.
- **Stakeholders:** Data Operators.
- **Priority:** High

**FR 39: The collected data is automatically tagged with a location.**

- **Description:** All data submitted by data operators is geotagged to ensure it is linked to the correct farm or location.
- **Stakeholders:** Data Operators, Admins.
- **Priority:** High

## 17. Crop Info Verification

**FR 40: Data operators can verify crop listings in the marketplace.**

- **Description:** Data operators can be assigned to check the quality and accuracy of the crop information that farmers post on the marketplace.
- **Stakeholders:** Data Operators, Farmers, Customers.
- **Priority:** Medium

## 18. Social Feed Report Management

**FR 41: Users can report inappropriate posts or comments.**

- **Description:** Users must have an option to flag content on the social feed that they believe is harmful, spam, or inappropriate.
- **Stakeholders:** All users.
- **Priority:** Medium

**FR 42: Admins can review and take action on reported content.**

- **Description:** Admins have a dashboard to see all reported content and can decide whether to remove the content or warn the user.
- **Stakeholders:** Admins.
- **Priority:** High

## 19. Data Operator Report Analysis

**FR 43: Admins can view summary reports of data operator activities.**

- **Description:** The system generates reports summarizing the amount and type of data collected by each data operator.
- **Stakeholders:** Admins.
- **Priority:** Low

## 20. Administrative Report Review & Export

**FR 44: Admins can generate reports on system usage.**

- **Description:** Admins can create reports on metrics like the number of active users, consultations, and marketplace transactions.
- **Stakeholders:** Admins.
- **Priority:** Medium

**FR 45: Admins can export reports as PDF or CSV files.**

- **Description:** The system allows administrators to download the generated reports in standard file formats for offline analysis or record-keeping.
- **Stakeholders:** Admins.
- **Priority:** Medium
