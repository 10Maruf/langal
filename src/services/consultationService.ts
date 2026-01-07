import api from './api';

// Types
export interface Expert {
  id?: number;
  user_id: number;
  expert_id: number;
  qualification: string;
  specialization: string;
  specialization_bn: string;
  experience_years: number;
  experience_years_bn: string;
  institution: string;
  consultation_fee: number;
  consultation_fee_bn: string;
  rating: number;
  rating_bn: string;
  total_consultations: number;
  total_consultations_bn: string;
  total_reviews?: number;
  is_government_approved: boolean;
  is_online?: boolean;
  last_active_at?: string;
  license_number?: string;
  certification_document_url?: string;
  bio?: string;
  bio_bn?: string;
  qualifications?: string[];
  expertise_areas?: string[];
  recent_feedbacks?: Feedback[];
  user?: User;
  profile?: UserProfile;
}

export interface User {
  user_id: number;
  phone: string;
  user_type: string;
  is_active: boolean;
  is_verified: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  full_name: string;
  full_name_bn?: string;
  avatar_url?: string;
  profile_photo_url?: string;
  profile_photo_url_full?: string;
  division?: string;
  division_bn?: string;
  district?: string;
  district_bn?: string;
  upazila?: string;
  upazila_bn?: string;
}

export interface Availability {
  availability_id: number;
  expert_id: number;
  day_of_week: number;
  day_name: string;
  day_name_bn: string;
  start_time: string;
  end_time: string;
  time_range: string;
  time_range_bn: string;
  slot_duration_minutes: number;
  max_appointments_per_slot: number;
  is_active: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  remaining_capacity: number;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  duration_minutes?: number;
}

export interface AvailabilitySlot {
  availability_id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration?: number;
  is_available?: boolean;
}

export interface Appointment {
  appointment_id: number;
  farmer_id: number;
  expert_id: number;
  appointment_date: string;
  appointment_date_bn: string;
  scheduled_at: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  consultation_type: 'audio_call' | 'video_call' | 'chat' | 'audio' | 'video';
  consultation_type_bn: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'scheduled' | 'rejected';
  status_bn: string;
  problem_description?: string;
  problem_description_bn?: string;
  crop_type?: string;
  urgency_level: number;
  urgency_level_bn: string;
  farmer_notes?: string;
  expert_notes?: string;
  cancellation_reason?: string;
  agora_channel_name?: string;
  has_feedback?: boolean;
  farmer?: User;
  expert?: Expert;
  expert_qualification?: Expert;
  prescription?: Prescription;
  feedback?: Feedback;
}

export interface Message {
  message_id: number;
  appointment_id: number;
  sender_id: number;
  message_type: 'text' | 'image' | 'audio' | 'file' | 'system' | 'document';
  message_type_bn: string;
  content: string;
  content_bn?: string;
  media_url?: string;
  media_thumbnail?: string;
  is_read: boolean;
  read_at?: string;
  sent_at?: string;
  created_at: string;
  time_ago: string;
  time_ago_bn: string;
  sender?: User;
  is_mine: boolean;
}

export interface Conversation {
  appointment_id: number;
  partner: User;
  partner_profile?: UserProfile;
  last_message?: Message;
  unread_count: number;
  consultation_type: string;
  status: string;
  appointment_date: string;
  start_time: string;
}

export interface Call {
  call_id: number;
  appointment_id: number;
  caller_id: number;
  receiver_id: number;
  call_type: 'audio' | 'video';
  call_type_bn: string;
  agora_channel: string;
  agora_token?: string;
  agora_app_id?: string;
  status: 'ringing' | 'ongoing' | 'completed' | 'missed' | 'rejected' | 'failed';
  status_bn: string;
  started_at?: string;
  answered_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  duration_formatted?: string;
  duration_formatted_bn?: string;
}

export interface Prescription {
  prescription_id: number;
  appointment_id: number;
  expert_id: number;
  farmer_id: number;
  diagnosis: string;
  diagnosis_bn?: string;
  prescription_details: string;
  prescription_details_bn?: string;
  medications?: Medication[];
  preventive_measures?: string;
  preventive_measures_bn?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  follow_up_date_bn?: string;
  follow_up_notes?: string;
  attachments?: string[];
  created_at: string;
  created_at_bn?: string;
}

export interface Medication {
  name: string;
  name_bn?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Feedback {
  feedback_id: number;
  appointment_id: number;
  overall_rating: number;
  overall_rating_bn: string;
  communication_rating?: number;
  knowledge_rating?: number;
  helpfulness_rating?: number;
  review_text?: string;
  review_text_bn?: string;
  would_recommend: boolean;
  is_anonymous: boolean;
  farmer_name?: string;
  farmer?: User;
  tags?: string[];
  comment?: string;
  rating?: number;
  created_at: string;
  created_at_bn?: string;
}

// API Functions

// Expert APIs
export const getAllExperts = async (params?: {
  specialization?: string;
  page?: number;
  per_page?: number;
  online_only?: boolean;
}) => {
  const response = await api.get('/experts', { params });
  return response.data;
};

// Send heartbeat to update online status
export const sendExpertHeartbeat = async () => {
  const response = await api.post('/expert/heartbeat');
  return response.data;
};

export const getExpertById = async (expertId: number | string) => {
  const response = await api.get(`/experts/${expertId}`);
  return response.data;
};

export const getExpertAvailability = async (expertId: number | string) => {
  const response = await api.get(`/experts/${expertId}/availability`);
  return response.data;
};

export const getExpertSlots = async (expertId: number, date: string) => {
  const response = await api.get(`/experts/${expertId}/slots`, {
    params: { date }
  });
  return response.data;
};

export const getExpertReviews = async (expertId: number, params?: {
  rating?: number;
  page?: number;
  per_page?: number;
}) => {
  const response = await api.get(`/experts/${expertId}/reviews`, { params });
  return response.data;
};

export const getExpertAvailableSlots = async (expertId: string, date: string) => {
  const response = await api.get(`/experts/${expertId}/slots`, {
    params: { date }
  });
  return response.data;
};

export const getMyAppointments = async (params?: {
  status?: string;
  page?: number;
  per_page?: number;
}) => {
  const response = await api.get('/appointments/my', { params });
  return response.data;
};

export const updateAppointmentStatus = async (
  appointmentId: number, 
  action: 'confirm' | 'reject' | 'complete',
  reason?: string
) => {
  const response = await api.put(`/appointments/${appointmentId}/${action}`, {
    reason
  });
  return response.data;
};

export const getExpertStats = async () => {
  const response = await api.get('/expert/stats');
  return response.data;
};

export const getMyAvailability = async () => {
  const response = await api.get('/expert/my-availability');
  return response.data;
};

export const setAvailability = async (data: {
  slots: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    slot_duration?: number;
    is_available?: boolean;
  }[];
}) => {
  const response = await api.post('/expert/set-availability', data);
  return response.data;
};

export const getConversationMessages = async (appointmentId: number, params?: {
  per_page?: number;
  before?: number;
}) => {
  const response = await api.get(`/conversations/${appointmentId}/messages`, { params });
  return response.data;
};

// Expert Availability Management (for experts)
export const setExpertAvailability = async (schedules: {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes?: number;
  max_appointments_per_slot?: number;
}[]) => {
  const response = await api.post('/expert/availability', { schedules });
  return response.data;
};

export const deleteAvailabilitySlot = async (slotId: number) => {
  const response = await api.delete(`/expert/availability/${slotId}`);
  return response.data;
};

export const addUnavailableDate = async (data: {
  unavailable_date: string;
  reason?: string;
  reason_bn?: string;
}) => {
  const response = await api.post('/expert/unavailable-dates', data);
  return response.data;
};

export const removeUnavailableDate = async (id: number) => {
  const response = await api.delete(`/expert/unavailable-dates/${id}`);
  return response.data;
};

// Appointment APIs
export const getAppointments = async (params?: {
  status?: string;
  type?: 'upcoming' | 'past' | 'all';
  page?: number;
  per_page?: number;
}) => {
  const response = await api.get('/appointments', { params });
  return response.data;
};

export const getAppointmentById = async (appointmentId: number) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

export const createAppointment = async (data: {
  expert_id: number;
  appointment_date?: string;
  scheduled_at?: string;
  start_time?: string;
  duration_minutes?: number;
  consultation_type: 'audio_call' | 'video_call' | 'chat' | 'audio' | 'video';
  problem_description?: string;
  problem_description_bn?: string;
  crop_type?: string;
  urgency_level?: number | string;
  farmer_notes?: string;
}) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const approveAppointment = async (appointmentId: number) => {
  const response = await api.put(`/appointments/${appointmentId}/approve`);
  return response.data;
};

export const rejectAppointment = async (appointmentId: number, cancellationReason?: string) => {
  const response = await api.put(`/appointments/${appointmentId}/reject`, {
    cancellation_reason: cancellationReason
  });
  return response.data;
};

export const rescheduleAppointment = async (appointmentId: number, data: {
  new_date: string;
  new_start_time: string;
  reason?: string;
}) => {
  const response = await api.put(`/appointments/${appointmentId}/reschedule`, data);
  return response.data;
};

export const cancelAppointment = async (appointmentId: number, cancellationReason?: string) => {
  const response = await api.put(`/appointments/${appointmentId}/cancel`, {
    cancellation_reason: cancellationReason
  });
  return response.data;
};

export const completeAppointment = async (appointmentId: number) => {
  const response = await api.put(`/appointments/${appointmentId}/complete`);
  return response.data;
};

export const getTodayAppointmentCount = async () => {
  const response = await api.get('/appointments/today-count');
  return response.data;
};

// Conversation/Message APIs
export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

export const getMessages = async (appointmentId: number, params?: {
  per_page?: number;
  before?: number;
}) => {
  const response = await api.get(`/conversations/${appointmentId}/messages`, { params });
  return response.data;
};

export const sendMessage = async (appointmentId: number, data: {
  message_type: 'text' | 'image' | 'audio' | 'file' | 'document';
  content?: string;
  content_bn?: string;
  media?: File;
} | FormData) => {
  let formData: FormData;
  
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    formData.append('message_type', data.message_type);
    if (data.content) formData.append('content', data.content);
    if (data.content_bn) formData.append('content_bn', data.content_bn);
    if (data.media) formData.append('media', data.media);
  }

  const response = await api.post(`/conversations/${appointmentId}/messages`, formData);
  return response.data;
};

export const markMessagesAsRead = async (appointmentId: number) => {
  const response = await api.post(`/conversations/${appointmentId}/read`);
  return response.data;
};

export const getUnreadMessageCount = async () => {
  const response = await api.get('/messages/unread-count');
  return response.data;
};

export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

// Call APIs
export const generateCallToken = async (appointmentId: number) => {
  const response = await api.post('/calls/token', { appointment_id: appointmentId });
  return response.data;
};

export const startCall = async (data: {
  appointment_id: number;
  call_type: string;
}) => {
  const response = await api.post('/calls/start', data);
  return response.data;
};

export const answerCall = async (callId: number) => {
  const response = await api.put(`/calls/${callId}/answer`);
  return response.data;
};

export const rejectCall = async (callId: number) => {
  const response = await api.put(`/calls/${callId}/reject`);
  return response.data;
};

export const endCall = async (callId: number) => {
  const response = await api.put(`/calls/${callId}/end`);
  return response.data;
};

export const getCallStatus = async (callId: number) => {
  const response = await api.get(`/calls/${callId}/status`);
  return response.data;
};

export const getCallHistory = async (appointmentId: number) => {
  const response = await api.get(`/appointments/${appointmentId}/calls`);
  return response.data;
};

// Feedback APIs
export const submitFeedback = async (data: {
  appointment_id: number;
  rating: number;
  comment?: string;
  tags?: string[];
  overall_rating?: number;
  communication_rating?: number;
  knowledge_rating?: number;
  helpfulness_rating?: number;
  review_text?: string;
  review_text_bn?: string;
  is_anonymous?: boolean;
  would_recommend?: boolean;
}) => {
  const response = await api.post(`/appointments/${data.appointment_id}/feedback`, data);
  return response.data;
};

export const getAppointmentFeedback = async (appointmentId: number) => {
  const response = await api.get(`/appointments/${appointmentId}/feedback`);
  return response.data;
};

export const reportReview = async (reviewId: number, reason: string) => {
  const response = await api.post(`/reviews/${reviewId}/report`, { reason });
  return response.data;
};

// Prescription APIs
export const createPrescription = async (appointmentId: number, data: {
  diagnosis: string;
  diagnosis_bn?: string;
  prescription_details: string;
  prescription_details_bn?: string;
  medications?: Medication[];
  preventive_measures?: string;
  preventive_measures_bn?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  attachments?: File[];
}) => {
  const formData = new FormData();
  formData.append('diagnosis', data.diagnosis);
  formData.append('prescription_details', data.prescription_details);
  
  if (data.diagnosis_bn) formData.append('diagnosis_bn', data.diagnosis_bn);
  if (data.prescription_details_bn) formData.append('prescription_details_bn', data.prescription_details_bn);
  if (data.medications) formData.append('medications', JSON.stringify(data.medications));
  if (data.preventive_measures) formData.append('preventive_measures', data.preventive_measures);
  if (data.preventive_measures_bn) formData.append('preventive_measures_bn', data.preventive_measures_bn);
  if (data.follow_up_required !== undefined) formData.append('follow_up_required', String(data.follow_up_required));
  if (data.follow_up_date) formData.append('follow_up_date', data.follow_up_date);
  if (data.follow_up_notes) formData.append('follow_up_notes', data.follow_up_notes);
  
  if (data.attachments) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  const response = await api.post(`/appointments/${appointmentId}/prescription`, formData);
  return response.data;
};

export const getPrescriptions = async (params?: {
  page?: number;
  per_page?: number;
}) => {
  const response = await api.get('/prescriptions', { params });
  return response.data;
};

export const getPrescriptionById = async (prescriptionId: number) => {
  const response = await api.get(`/prescriptions/${prescriptionId}`);
  return response.data;
};

export const updatePrescription = async (prescriptionId: number, data: Partial<{
  diagnosis: string;
  diagnosis_bn: string;
  prescription_details: string;
  prescription_details_bn: string;
  medications: Medication[];
  preventive_measures: string;
  preventive_measures_bn: string;
  follow_up_required: boolean;
  follow_up_date: string;
  follow_up_notes: string;
}>) => {
  const response = await api.put(`/prescriptions/${prescriptionId}`, data);
  return response.data;
};

export const downloadPrescription = async (prescriptionId: number) => {
  const response = await api.get(`/prescriptions/${prescriptionId}/download`);
  return response.data;
};

// Utility functions
export const getConsultationTypeIcon = (type: string): string => {
  switch (type) {
    case 'video_call': return '🎥';
    case 'audio_call': return '📞';
    case 'chat': return '💬';
    default: return '📞';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'no_show': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getUrgencyColor = (level: number): string => {
  switch (level) {
    case 1: return 'bg-gray-100 text-gray-700';
    case 2: return 'bg-amber-100 text-amber-700';
    case 3: return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
