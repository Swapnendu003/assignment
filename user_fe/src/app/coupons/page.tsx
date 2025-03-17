'use client';

import { useEffect, useState } from 'react';
import { useCoupons } from '@/hooks/useCoupons';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CouponPage() {
  const { 
    coupons, 
    eligibility, 
    loading, 
    error, 
    fetchAvailableCoupons, 
    checkEligibility, 
    claimCoupon 
  } = useCoupons();

  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableCoupons();
    checkEligibility();
  }, [fetchAvailableCoupons, checkEligibility]);

  const handleClaimCoupon = async (couponId?: string) => {
    try {
      await claimCoupon(couponId);
      setSelectedCoupon(null);
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <button className="flex items-center text-purple-700 hover:text-purple-900 mb-6 transition-colors">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </button>
        </Link>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold text-center text-indigo-800 mb-8"
        >
          Available Coupons
        </motion.h1>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
            <AlertCircle className="inline-block mr-2" />
            {error}
          </div>
        )}

        {eligibility && !eligibility.eligible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg relative flex items-center my-8"
          >
            <Clock className="mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">{eligibility.message}</p>
              {eligibility.timeLeft && (
                <p className="text-sm mt-1">Time left: {eligibility.timeLeft}</p>
              )}
            </div>
          </motion.div>
        )}

        {eligibility && eligibility.eligible && !coupons.length && (
          <div className="mt-6 p-8 bg-white shadow-md text-gray-700 rounded-lg text-center">
            <Gift className="mx-auto mb-4 text-indigo-600" size={48} />
            <p className="text-lg">No coupons available at the moment. Please check back later.</p>
          </div>
        )}

        {eligibility && eligibility.eligible && coupons.length > 0 && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 mb-8"
            >
              Select a coupon below to claim it
            </motion.p>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon._id}
                  layoutId={coupon._id}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer border border-purple-100"
                  onClick={() => setSelectedCoupon(coupon._id)}
                >
                  <div className="text-center">
                    <div className="bg-purple-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Gift className="text-purple-600" size={32} />
                    </div>
                    <h2 className="text-xl font-semibold text-purple-800 mb-3">
                      {coupon.code}
                    </h2>
                    <p className="text-gray-600">{coupon.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <AnimatePresence>
          {selectedCoupon && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              onClick={() => setSelectedCoupon(null)}
            >
              <motion.div 
                layoutId={selectedCoupon}
                className="bg-white rounded-xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-purple-800 mb-4">
                  Claim Coupon
                </h2>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to claim this coupon? You can only claim one coupon per 24 hours.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleClaimCoupon(selectedCoupon)}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Confirm Claim
                  </button>
                  <button 
                    onClick={() => setSelectedCoupon(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
