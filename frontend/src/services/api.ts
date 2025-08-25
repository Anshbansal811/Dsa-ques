import axios from "axios";
import {
  User,
  Topic,
  Problem,
  UserProgress,
  ProgressSummary,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Topics API
export const topicsAPI = {
  getAll: async (): Promise<{ topics: Topic[] }> => {
    const response = await api.get("/topics");
    return response.data;
  },

  getById: async (id: string): Promise<{ topic: Topic }> => {
    const response = await api.get(`/topics/${id}`);
    return response.data;
  },
};

// Problems API
export const problemsAPI = {
  getAll: async (params?: {
    topicId?: string;
    difficulty?: string;
  }): Promise<{ problems: Problem[] }> => {
    const response = await api.get("/problems", { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ problem: Problem }> => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getAll: async (): Promise<{ progress: UserProgress[] }> => {
    const response = await api.get("/progress");
    return response.data;
  },

  getSummary: async (): Promise<{ summary: ProgressSummary }> => {
    const response = await api.get("/progress/summary");
    return response.data;
  },

  toggleProblem: async (
    problemId: string
  ): Promise<{ progress: UserProgress }> => {
    const response = await api.post(`/progress/toggle/${problemId}`);
    return response.data;
  },

  markCompleted: async (
    problemId: string
  ): Promise<{ progress: UserProgress }> => {
    const response = await api.post(`/progress/${problemId}`);
    return response.data;
  },

  resetAll: async (): Promise<{ message: string }> => {
    const response = await api.delete("/progress");
    return response.data;
  },
};

export default api;
