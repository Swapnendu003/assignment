
import axiosInstance from './axios';

export interface Coupon {
  code: string;
  description: string;
  expiresAt?: string;
}

export const getCoupons = async () => {
  try {
    const response = await axiosInstance.get('/admin/coupons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCouponById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/admin/coupons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCoupon = async (couponData: Coupon) => {
  try {
    const response = await axiosInstance.post('/admin/coupons', couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCouponsBulk = async (data: { coupons: Coupon[] }) => {
  try {
    const response = await axiosInstance.post('/admin/coupons/bulk', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
  try {
    const response = await axiosInstance.put(`/admin/coupons/${id}`, couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/admin/coupons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleCouponStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/coupons/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw error;
  }
};