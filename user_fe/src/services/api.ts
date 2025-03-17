import axios from 'axios';

import { USER_ROUTES, BASE_URL } from '@/constants/routes';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export const couponService = {
  getAvailableCoupons: () => 
    api.get(USER_ROUTES.GET_AVAILABLE_COUPONS),
  
  claimCouponById: (couponId: string) => 
    api.post(USER_ROUTES.CLAIM_COUPON_BY_ID(couponId)),
  
  claimNextCoupon: () => 
    api.post(USER_ROUTES.CLAIM_NEXT_COUPON),
  
  checkEligibility: () => 
    api.get(USER_ROUTES.CHECK_ELIGIBILITY)
};

export default api;