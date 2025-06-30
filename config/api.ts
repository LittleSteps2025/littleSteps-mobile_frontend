// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.114.156:3001', // Replace with your server URL
  ENDPOINTS: {
    // Admin endpoints
    ADD_PARENT: '/api/parent/add-parent',
    
    // Parent sign-up endpoints
    VERIFY_EMAIL: '/api/parent/verify-email',
    VERIFY_OTP: '/api/parent/verify-otp',
    COMPLETE_REGISTRATION: '/api/parent/complete-registration',
    RESEND_OTP: '/api/parent/resend-otp',
    
    // Login endpoints
    PARENT_LOGIN: '/api/parent/login',
    FIREBASE_LOGIN: '/api/parent/firebase-login',
    
    // Other endpoints
    USER_ROUTES: '/api/users', // if you have user-related routes
  }
};

// Helper function to make API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
