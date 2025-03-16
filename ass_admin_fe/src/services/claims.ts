
import axiosInstance from './axios';

export const getClaimHistory = async () => {
  try {
    const response = await axiosInstance.get('/admin/claims');
    return response.data;
  } catch (error) {
    throw error;
  }
};