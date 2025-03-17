export const BASE_URL = 'https://assignment-1-0qq5.onrender.com';

// export const BASE_URL = 'http://localhost:3000';
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
    PROFILE: '/admin/profile',
  },
  COUPONS: {
    LIST: '/admin/coupons',
    DETAIL: (id: string) => `/admin/coupons/${id}`,
    CREATE: '/admin/coupons',
    UPDATE: (id: string) => `/admin/coupons/${id}`,
    DELETE: (id: string) => `/admin/coupons/${id}`,
    TOGGLE: (id: string) => `/admin/coupons/${id}/toggle`,
    BULK: '/admin/coupons/bulk',
  },
  CLAIMS: {
    LIST: '/admin/claims',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard',
  },
};