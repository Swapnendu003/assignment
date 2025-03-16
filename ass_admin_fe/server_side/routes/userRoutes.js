const express = require("express");
const userrouter = express.Router();
const { 
  getAvailableCoupons, 
  claimCouponById, 
  claimNextAvailableCoupon, 
  checkEligibility 
} = require("../controllers/userController");

userrouter.get("/coupons", getAvailableCoupons);
userrouter.post("/claim/:couponId", claimCouponById);
userrouter.post("/claim-next", claimNextAvailableCoupon);
userrouter.get("/eligibility", checkEligibility);

module.exports = userrouter;