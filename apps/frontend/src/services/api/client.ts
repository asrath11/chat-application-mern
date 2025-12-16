import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipRefresh?: boolean;
}

axiosInstance.interceptors.response.use(
  // ✅ Success handler
  (response) => response,

  // ✅ Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Don't retry if it's a logout request, refresh endpoint, or explicitly skipped
    const isLogoutRequest = originalRequest.url?.includes('/auth/logout');
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipRefresh &&
      !isLogoutRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        // refresh access token
        await axiosInstance.post('/auth/refresh');

        // retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or clear auth state
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
