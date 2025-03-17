'use client';

import { useEffect, useState } from 'react';
import { useCoupons } from '@/hooks/useCoupons';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Clock, AlertCircle, ArrowLeft, Sparkles, Tag, X } from 'lucide-react';
import Link from 'next/link';
import SpotlightCard from '@/components/SpotlightCard';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-100/40 backdrop-blur-3xl -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-100/30 backdrop-blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/">
          <button className="flex items-center text-purple-700 hover:text-purple-900 mb-6 transition-colors bg-white/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </button>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
            Exclusive Offers
          </span>
          <h1 className="text-4xl font-bold text-indigo-800 mb-3">
            Your Special Coupons
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Claim these exclusive discounts specially selected for you. New offers are added regularly!
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        )}

        {error && (
          <SpotlightCard 
            className="my-6" 
            bgColor="bg-red-50" 
            borderColor="border-red-200"
            spotlightColor="rgba(239, 68, 68, 0.2)"
          >
            <div className="flex items-center text-red-700 px-4 py-3 rounded relative" role="alert">
              <AlertCircle className="mr-3 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </SpotlightCard>
        )}

        {eligibility && !eligibility.eligible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SpotlightCard 
              className="my-8" 
              bgColor="bg-yellow-50" 
              borderColor="border-yellow-200"
              spotlightColor="rgba(245, 158, 11, 0.2)"
            >
              <div className="px-4 py-3 rounded relative flex items-center">
                <Clock className="mr-3 flex-shrink-0 text-yellow-600" />
                <div className="text-yellow-700">
                  <p className="font-medium">{eligibility.message}</p>
                  {eligibility.timeLeft && (
                    <p className="text-sm mt-1">Time left: {eligibility.timeLeft}</p>
                  )}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        )}

        {eligibility && eligibility.eligible && !coupons.length && (
          <SpotlightCard className="mt-8 text-center p-12">
            <Gift className="mx-auto mb-4 text-indigo-600" size={48} />
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">No Coupons Available</h3>
            <p className="text-gray-600">Check back later for new exclusive offers just for you.</p>
          </SpotlightCard>
        )}

        {eligibility && eligibility.eligible && coupons.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <Sparkles size={18} className="text-purple-600" />
              <p className="text-gray-600">Select a coupon below to claim it</p>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon._id}
                  layoutId={coupon._id}
                  whileHover={{ y: -5 }}
                >
                  <SpotlightCard
                    onClick={() => setSelectedCoupon(coupon._id)}
                    className="h-full cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="bg-purple-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Tag className="text-purple-600" size={32} />
                      </div>
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full inline-block mb-3">
                        {coupon.code}
                      </div>
                      <p className="text-gray-600">{coupon.description}</p>
                      <button className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center mx-auto">
                        <span>Claim Now</span>
                        <ArrowLeft className="ml-1 transform rotate-180" size={16} />
                      </button>
                    </div>
                  </SpotlightCard>
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
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setSelectedCoupon(null)}
            >
              <motion.div 
                layoutId={selectedCoupon}
                onClick={(e) => e.stopPropagation()}
                className="relative"
              >
                <SpotlightCard 
                  className="max-w-md w-full p-8"
                  spotlightColor="rgba(147, 51, 234, 0.25)"
                >
                  <button 
                    onClick={() => setSelectedCoupon(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Claim Your Coupon</h2>
                      <p className="text-purple-100 text-sm">Limited time offer</p>
                    </div>
                    <Gift className="text-white" size={32} />
                  </div>
                  
                  <p className="mb-6 text-gray-600">
                    Are you sure you want to claim this coupon? You can only claim one coupon per 24 hours.
                  </p>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleClaimCoupon(selectedCoupon)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium"
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
                </SpotlightCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
