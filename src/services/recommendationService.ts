import api from './api';

// Types
export interface Season {
  key: string;
  name_en: string;
  name_bn: string;
  period: string;
  period_en: string;
  description_bn: string;
  color: string;
}

export interface CropType {
  key: string;
  name_en: string;
  name_bn: string;
  icon: string;
}

export interface CostBreakdown {
  seed: number;
  fertilizer: number;
  pesticide: number;
  irrigation: number;
  labor: number;
  other: number;
}

export interface CultivationPhase {
  phase: string;
  days: string;
  tasks: string[];
}

export interface FertilizerItem {
  name: string;
  amount: string;
}

export interface FertilizerSchedule {
  timing: string;
  fertilizers: FertilizerItem[];
}

export interface CropImage {
  id: string;
  url: string;
  thumb: string;
  small: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  is_fallback?: boolean;
}

export interface Crop {
  name: string;
  name_bn: string;
  type: string;
  cost_per_bigha: number;
  yield_per_bigha: string;
  market_price: string;
  duration_days: number;
  profit_per_bigha: number;
  difficulty: 'easy' | 'medium' | 'hard';
  water_requirement: 'low' | 'medium' | 'high';
  description_bn: string;
  cost_breakdown: CostBreakdown;
  cultivation_plan: CultivationPhase[];
  fertilizer_schedule: FertilizerSchedule[];
  risks: string[];
  tips: string[];
  image?: CropImage;
}

export interface RecommendationResponse {
  success: boolean;
  recommendation_id?: number;
  data: {
    crops: Crop[];
    season_tips: string;
    weather_advisory: string;
  };
  meta: {
    model: string;
    is_fallback: boolean;
    location: string;
    season: string;
    crop_type: string;
  };
}

export interface SelectedCrop {
  selection_id: number;
  farmer_id: number;
  recommendation_id: number;
  crop_name: string;
  crop_name_bn: string;
  crop_type: string;
  season: string;
  image_url: string;
  start_date: string;
  expected_harvest_date: string;
  land_size: number;
  land_unit: string;
  estimated_cost: number;
  estimated_profit: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  cultivation_plan: CultivationPhase[];
  cost_breakdown: CostBreakdown;
  fertilizer_schedule: FertilizerSchedule[];
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecommendationInput {
  location: string;
  division?: string;
  district?: string;
  upazila?: string;
  season: string;
  crop_type: string;
  land_size?: number;
  land_unit?: string;
  budget?: number;
  soil_type?: string;
  weather_data?: {
    temperature: number;
    humidity: number;
    rainfall_chance: number;
    description: string;
    forecast?: string;
  };
}

// API Functions

/**
 * Get available seasons with auto-detected current season
 */
export const getSeasons = async (): Promise<{
  seasons: Season[];
  current_season: string;
}> => {
  const response = await api.get('/recommendations/seasons');
  return response.data;
};

/**
 * Get available crop types
 */
export const getCropTypes = async (): Promise<{ crop_types: CropType[] }> => {
  const response = await api.get('/recommendations/crop-types');
  return response.data;
};

/**
 * Generate AI-based crop recommendations
 */
export const generateRecommendations = async (
  input: RecommendationInput
): Promise<RecommendationResponse> => {
  const response = await api.post('/recommendations/generate', input);
  return response.data;
};

/**
 * Get recommendation history (requires authentication)
 */
export const getRecommendationHistory = async (
  limit?: number
): Promise<{ recommendations: any[] }> => {
  const response = await api.get('/recommendations/history', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get a single recommendation by ID
 */
export const getRecommendation = async (
  id: number
): Promise<{ recommendation: any }> => {
  const response = await api.get(`/recommendations/${id}`);
  return response.data;
};

/**
 * Select crops from recommendations (requires authentication)
 */
export const selectCrops = async (data: {
  recommendation_id?: number;
  crops: Crop[];
  land_size?: number;
  land_unit?: string;
  start_date?: string;
}): Promise<{ selected_crops: SelectedCrop[] }> => {
  // Transform crops to match backend expectations
  const transformedCrops = data.crops.map((crop) => ({
    name: crop.name,
    name_bn: crop.name_bn,
    crop_type: crop.type,
    season: crop.type, // Add season if available
    image_url: crop.image?.url,
    duration_days: crop.duration_days,
    yield_per_bigha: crop.yield_per_bigha,
    market_price: crop.market_price,
    water_requirement: crop.water_requirement,
    difficulty: crop.difficulty,
    description_bn: crop.description_bn,
    estimated_cost: crop.cost_per_bigha,
    estimated_profit: crop.profit_per_bigha,
    cultivation_plan: crop.cultivation_plan,
    cost_breakdown: crop.cost_breakdown,
    fertilizer_schedule: crop.fertilizer_schedule,
  }));

  const response = await api.post('/recommendations/select-crops', {
    ...data,
    crops: transformedCrops,
  });
  return response.data;
};

/**
 * Get farmer's selected crops (requires authentication)
 */
export const getSelectedCrops = async (
  status?: string
): Promise<{ selected_crops: SelectedCrop[] }> => {
  const response = await api.get('/recommendations/selected', {
    params: { status },
  });
  return response.data;
};

/**
 * Update selected crop status (requires authentication)
 */
export const updateCropStatus = async (
  selectionId: number,
  status: 'planned' | 'active' | 'completed' | 'cancelled'
): Promise<{ crop: SelectedCrop }> => {
  const response = await api.put(
    `/recommendations/selected/${selectionId}/status`,
    { status }
  );
  return response.data;
};

/**
 * Get crop image from Unsplash
 */
export const getCropImage = async (
  cropName: string,
  cropNameBn?: string
): Promise<{ image: CropImage }> => {
  const response = await api.get('/recommendations/crop-image', {
    params: {
      crop_name: cropName,
      crop_name_bn: cropNameBn,
    },
  });
  return response.data;
};

/**
 * Helper: Get current season based on date
 */
export const getCurrentSeason = (): string => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Rabi: Oct 16 - Mar 15
  if (
    (month === 10 && day >= 16) ||
    month === 11 ||
    month === 12 ||
    month === 1 ||
    month === 2 ||
    (month === 3 && day <= 15)
  ) {
    return 'rabi';
  }
  // Kharif-1: Mar 16 - Jul 15
  else if (
    (month === 3 && day >= 16) ||
    month === 4 ||
    month === 5 ||
    month === 6 ||
    (month === 7 && day <= 15)
  ) {
    return 'kharif1';
  }
  // Kharif-2: Jul 16 - Oct 15
  else {
    return 'kharif2';
  }
};

/**
 * Helper: Get difficulty label in Bangla
 */
export const getDifficultyLabel = (
  difficulty: string
): { label: string; color: string } => {
  switch (difficulty) {
    case 'easy':
      return { label: 'সহজ', color: 'text-green-600' };
    case 'medium':
      return { label: 'মাঝারি', color: 'text-yellow-600' };
    case 'hard':
      return { label: 'কঠিন', color: 'text-red-600' };
    default:
      return { label: difficulty, color: 'text-gray-600' };
  }
};

/**
 * Helper: Get water requirement label in Bangla
 */
export const getWaterRequirementLabel = (
  requirement: string
): { label: string; color: string } => {
  switch (requirement) {
    case 'low':
      return { label: 'কম', color: 'text-blue-400' };
    case 'medium':
      return { label: 'মাঝারি', color: 'text-blue-500' };
    case 'high':
      return { label: 'বেশি', color: 'text-blue-600' };
    default:
      return { label: requirement, color: 'text-gray-600' };
  }
};

/**
 * Helper: Format currency in Bangla
 */
export const formatBanglaNumber = (num: number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toLocaleString('en-IN')
    .replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
};

/**
 * Helper: Format currency with Taka symbol
 */
export const formatTaka = (amount: number): string => {
  return `৳${formatBanglaNumber(amount)}`;
};

export default {
  getSeasons,
  getCropTypes,
  generateRecommendations,
  getRecommendationHistory,
  getRecommendation,
  selectCrops,
  getSelectedCrops,
  updateCropStatus,
  getCropImage,
  getCurrentSeason,
  getDifficultyLabel,
  getWaterRequirementLabel,
  formatBanglaNumber,
  formatTaka,
};
