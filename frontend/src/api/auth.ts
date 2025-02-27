import {
  AuthResponse,
  LinkInput,
  LoginInput,
  ForgotPasswordInput,
  RegisterFormInput,
  ResetPasswordInput,
  ProfileInput,
} from "@/schemas";
import axios, {
  AxiosError,
  AxiosResponse,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

type LinkData = {
  platform: string;
  url: string;
};

interface UpdateLink extends LinkData {
  id: string;
}

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // Ensure the Content-Type matches
  },
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    if (isRefreshing) {
      console.log(1, isRefreshing);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      console.log(2, isRefreshing);
      const response = await API.post<AuthResponse>("/auth/refresh");
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      processQueue(null, accessToken);
      return API(originalRequest);
    } catch (error) {
      processQueue(error as Error, null);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      console.log(3, isRefreshing);
      isRefreshing = false;
    }
  }
);

export const refreshToken = () => API.post("/auth/refresh");

export const getUser = async () =>
  API.get<AuthResponse>("/auth/verify-session");

export const createUser = async (data: RegisterFormInput) =>
  API.post("/auth/register", data);
export const login = async (data: LoginInput) => {
  const response = await API.post("/auth/login", data);
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
  }
  return response;
};

export const verifyEmail = async (data: string) =>
  API.post("/auth/verify-email", data);
export const logout = () => API.post("/auth/logout");

export const forgotPassword = async (data: ForgotPasswordInput) =>
  API.post("/auth/forgot-password", data);

export const resetPassword = async (data: ResetPasswordInput) => {
  const { token, ...rest } = data;
  API.post(`/auth/reset-password/${token}`, rest);
};

export const createProfile = async (data: ProfileInput) =>
  API.post("/auth/create-profile", data);

export const getPreview = async (id: string) => API.get(`/users/${id}`);

export const createLink = async (data: LinkInput[]) =>
  API.post("/create-link", data);

export const getLinks = async () => API.get("/links");

export const deleteLink = async (id: string) => API.delete(`/links/${id}`);

export const updateLink = async (data: UpdateLink) => {
  const { id, ...rest } = data;
  API.put(`/links/${id}`, rest);
};
