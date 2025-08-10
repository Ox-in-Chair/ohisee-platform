// API Configuration for OhISee Platform

// Use environment variable or default to production backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ohisee-backend.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  // Health check
  health: `${API_BASE_URL}/health`,
  
  // Reports
  reports: `${API_BASE_URL}/api/reports`,
  getReport: (id: string) => `${API_BASE_URL}/api/reports/${id}`,
  
  // AI Assistant
  aiAssist: `${API_BASE_URL}/api/ai/assist`,
  aiTasks: `${API_BASE_URL}/api/ai/tasks`,
  
  // Authentication (future)
  login: `${API_BASE_URL}/api/auth/login`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  register: `${API_BASE_URL}/api/auth/register`,
};

// Helper function to make API calls
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': 'kangopak', // Add tenant ID for multi-tenant support
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Specific API functions
export const api = {
  // Report functions
  async submitReport(data: {
    title: string;
    description: string;
    category: string;
    priority?: string;
  }) {
    return apiCall(API_ENDPOINTS.reports, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getReports() {
    return apiCall(API_ENDPOINTS.reports);
  },

  async getReport(id: string) {
    return apiCall(API_ENDPOINTS.getReport(id));
  },

  // AI Assistant functions
  async improveText(taskType: string, text: string) {
    return apiCall(API_ENDPOINTS.aiAssist, {
      method: 'POST',
      body: JSON.stringify({ taskType, text }),
    });
  },

  async getAITasks() {
    return apiCall(API_ENDPOINTS.aiTasks);
  },

  // Health check
  async checkHealth() {
    return apiCall(API_ENDPOINTS.health);
  },
};