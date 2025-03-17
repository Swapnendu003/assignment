export interface Coupon {
    _id: string;
    code: string;
    description: string;
    isActive: boolean;
    isUsed: boolean;
    expiresAt?: Date | null;
    createdAt: Date;
  }
  
  export interface CouponEligibilityResponse {
    eligible: boolean;
    message?: string;
    availableCoupons?: Coupon[];
    availableCouponsCount?: number;
    timeLeft?: string;
    nextEligibleDate?: Date;
  }
  
  export interface CouponClaimResponse {
    message: string;
    coupon?: {
      code: string;
      description: string;
    };
  }