
export const BASE_URL = 'https://assignment-1-0qq5.onrender.com/user';
// export const BASE_URL = 'http://localhost:3000/user';
export const USER_ROUTES = {
    GET_AVAILABLE_COUPONS: '/coupons',
    CLAIM_COUPON_BY_ID: (couponId: string) => `/claim/${couponId}`,
    CLAIM_NEXT_COUPON: '/claim-next',
    CHECK_ELIGIBILITY: '/eligibility'
  };