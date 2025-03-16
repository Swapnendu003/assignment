const express = require("express");
const adminrouter = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile,
  getAllCoupons,
  getCouponById,
  createCoupon,
  createCouponsBulk,
  updateCoupon,
  deleteCoupon,
  toggleCouponAvailability,
  getClaimHistory,
  getDashboardStats
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth");

adminrouter.post("/register", registerAdmin);
adminrouter.post("/login", loginAdmin);
adminrouter.get("/profile", authMiddleware, getAdminProfile);
adminrouter.get("/coupons", authMiddleware, getAllCoupons);
adminrouter.get("/coupons/:id", authMiddleware, getCouponById);
adminrouter.post("/coupons", authMiddleware, createCoupon);
adminrouter.post("/coupons/bulk", authMiddleware, createCouponsBulk);
adminrouter.put("/coupons/:id", authMiddleware, updateCoupon);
adminrouter.delete("/coupons/:id", authMiddleware, deleteCoupon);
adminrouter.patch("/coupons/:id/toggle", authMiddleware, toggleCouponAvailability);
adminrouter.get("/claims", authMiddleware, getClaimHistory);
adminrouter.get("/dashboard", authMiddleware, getDashboardStats);

module.exports = adminrouter;