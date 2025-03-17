import { useState, useCallback } from 'react';
import { couponService } from '@/services/api';
import { 
  Coupon, 
  CouponEligibilityResponse, 
  CouponClaimResponse 
} from '@/types/coupon';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [eligibility, setEligibility] = useState<CouponEligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await couponService.getAvailableCoupons();
      const { availableCoupons, eligible, message } = response.data;
      
      setCoupons(availableCoupons || []);
      setEligibility({
        eligible,
        message,
        availableCoupons
      });
    } catch (err) {
      setError('Failed to fetch coupons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkEligibility = useCallback(async () => {
    setLoading(true);
    try {
      const response = await couponService.checkEligibility();
      setEligibility(response.data);
    } catch (err) {
      setError('Failed to check eligibility');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const claimCoupon = useCallback(async (couponId?: string) => {
    setLoading(true);
    try {
      let response: { data: CouponClaimResponse };
      
      if (couponId) {
        response = await couponService.claimCouponById(couponId);
      } else {
        response = await couponService.claimNextCoupon();
      }

      
      await fetchAvailableCoupons();
      await checkEligibility();

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to claim coupon');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAvailableCoupons, checkEligibility]);

  return {
    coupons,
    eligibility,
    loading,
    error,
    fetchAvailableCoupons,
    checkEligibility,
    claimCoupon
  };
};