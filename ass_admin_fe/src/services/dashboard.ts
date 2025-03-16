
import axiosInstance from './axios';

export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};