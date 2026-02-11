import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'your_admin_secret';

// ✅ Get businessId - Priority: localStorage > env > default
const getBusinessId = () => {
  return localStorage.getItem('businessId') || 
         import.meta.env.VITE_BUSINESS_ID || 
         'nab-consultancy';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin secret to requests when needed
const apiAdmin = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-admin-secret': ADMIN_SECRET,
  },
});

// ==================== PUBLIC SETTINGS (for booking page) ====================

export const getPublicSettings = async () => {
  try {
    const businessId = getBusinessId();
    console.log('📡 Fetching public settings for:', businessId);
    
    const response = await api.get(`/booking/settings?businessId=${businessId}`);
    
    console.log('📥 Received settings:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching public settings:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      data: {}
    };
  }
};

// ==================== BOOKING APIs (PUBLIC) ====================

export const getAvailableSlots = async (date, caId = null) => {
  try {
    const businessId = getBusinessId();
    let url = `/booking/slots?date=${date}&businessId=${businessId}`;
    
    if (caId && caId !== '' && caId !== 'null') {
      url += `&ca_id=${caId}`;
    }
    
    console.log('📡 Fetching available slots:', url);
    
    const response = await api.get(url);
    
    console.log('📥 Received slots data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching available slots:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      data: { appointments: [] }
    };
  }
};

export const createBooking = async (bookingData) => {
  const businessId = getBusinessId();
  const response = await api.post('/booking/create-order', {
    ...bookingData,
    businessId
  });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const businessId = getBusinessId();
  const response = await api.post('/booking/verify-payment', {
    ...paymentData,
    businessId
  });
  return response.data;
};

export const getBookingById = async (bookingId) => {
  const businessId = getBusinessId();
  const response = await api.get(`/booking/${bookingId}?businessId=${businessId}`);
  return response.data;
};

// ==================== ADMIN APIs ====================

export const getAllAppointments = async (filters = {}) => {
  const businessId = getBusinessId();
  const params = new URLSearchParams({
    businessId,
    ...filters
  });
  const response = await apiAdmin.get(`/admin/appointments?${params}`);
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.patch(
    `/admin/appointments/${appointmentId}/status`, 
    { businessId, status }
  );
  return response.data;
};

export const updateAppointment = async (appointmentId, updateData) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.patch(
    `/admin/appointments/${appointmentId}`, 
    { businessId, ...updateData }
  );
  return response.data;
};

export const assignCA = async (appointmentId, caId) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.patch(
    `/admin/appointments/${appointmentId}/assign`, 
    { businessId, ca_id: caId }
  );
  return response.data;
};

export const getDashboardStats = async () => {
  const businessId = getBusinessId();
  const response = await apiAdmin.get(`/admin/dashboard/stats?businessId=${businessId}`);
  return response.data;
};

// ==================== CA MANAGEMENT ====================

export const getCAList = async () => {
  const businessId = getBusinessId();
  const response = await apiAdmin.get(`/admin/ca/list?businessId=${businessId}`);
  return response.data;
};

export const createCA = async (caData) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.post('/admin/ca/create', {
    businessId,
    ...caData
  });
  return response.data;
};

export const updateCA = async (caId, caData) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.patch(`/admin/ca/${caId}`, {
    businessId,
    ...caData
  });
  return response.data;
};

export const deleteCA = async (caId) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.delete(`/admin/ca/${caId}?businessId=${businessId}`);
  return response.data;
};

// ==================== SETTINGS ====================

export const getSettings = async () => {
  const businessId = getBusinessId();
  const response = await apiAdmin.get(`/admin/settings?businessId=${businessId}`);
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.patch('/admin/settings', {
    businessId,
    ...settingsData
  });
  return response.data;
};

export const addOffDay = async (date, reason = '') => {
  const businessId = getBusinessId();
  const response = await apiAdmin.post('/admin/settings/off-day', {
    businessId,
    date,
    reason
  });
  return response.data;
};

export const removeOffDay = async (date) => {
  const businessId = getBusinessId();
  const response = await apiAdmin.delete('/admin/settings/off-day', {
    data: { businessId, date }
  });
  return response.data;
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Set business ID in localStorage
 * Call this on login or business selection
 */
export const setBusinessId = (businessId, businessName = '') => {
  localStorage.setItem('businessId', businessId);
  if (businessName) {
    localStorage.setItem('businessName', businessName);
  }
  console.log('✅ Business ID set:', businessId);
};

/**
 * Get current business info
 */
export const getBusinessInfo = () => {
  return {
    id: getBusinessId(),
    name: localStorage.getItem('businessName') || 'NAB Consultancy'
  };
};

/**
 * Clear business data (on logout)
 */
export const clearBusinessData = () => {
  localStorage.removeItem('businessId');
  localStorage.removeItem('businessName');
};

export default api;