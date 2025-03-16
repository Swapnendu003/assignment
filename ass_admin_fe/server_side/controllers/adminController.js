const { Admin } = require("../models/admin");
const { Coupon } = require("../models/coupons");
const { Claim } = require("../models/claim");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email
      }
    });
  } catch (error) {
    console.error("Register admin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Login admin error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.status(200).json({ coupons });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const getCouponById = async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      res.status(200).json({ coupon });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const createCoupon = async (req, res) => {
    try {
      const { code, description, expiresAt } = req.body;
      
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon with this code already exists" });
      }
      
      const newCoupon = new Coupon({
        code,
        description,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      });
      
      await newCoupon.save();
      
      res.status(201).json({
        message: "Coupon created successfully",
        coupon: newCoupon
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const createCouponsBulk = async (req, res) => {
    try {
      const coupons = req.body.coupons;
      
      if (!Array.isArray(coupons) || coupons.length === 0) {
        return res.status(400).json({ message: "No coupons provided or invalid format" });
      }
      
      const codes = coupons.map(coupon => coupon.code);
      const uniqueCodes = new Set(codes);
      
      if (uniqueCodes.size !== coupons.length) {
        return res.status(400).json({ message: "Duplicate coupon codes in request" });
      }
      
      const existingCoupons = await Coupon.find({ code: { $in: codes } });
      
      if (existingCoupons.length > 0) {
        const existingCodes = existingCoupons.map(coupon => coupon.code);
        return res.status(400).json({
          message: "Some coupon codes already exist",
          existingCodes
        });
      }
      
      const couponsToInsert = coupons.map(coupon => ({
        code: coupon.code,
        description: coupon.description,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt) : null,
        isActive: true,
        isUsed: false
      }));
      
      const result = await Coupon.insertMany(couponsToInsert);
      
      res.status(201).json({
        message: `${result.length} coupons created successfully`,
        coupons: result
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const updateCoupon = async (req, res) => {
    try {
      const { code, description, isActive, expiresAt } = req.body;
      
      if (code) {
        const existingCoupon = await Coupon.findOne({
          code,
          _id: { $ne: req.params.id }
        });
        
        if (existingCoupon) {
          return res.status(400).json({ message: "Coupon with this code already exists" });
        }
      }
      
      const coupon = await Coupon.findById(req.params.id);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      if (coupon.isUsed && (code || isActive !== undefined && !isActive)) {
        return res.status(400).json({ message: "Cannot modify code or deactivate a used coupon" });
      }
      
      if (code) coupon.code = code;
      if (description) coupon.description = description;
      if (isActive !== undefined) coupon.isActive = isActive;
      if (expiresAt) coupon.expiresAt = new Date(expiresAt);
      
      await coupon.save();
      
      res.status(200).json({
        message: "Coupon updated successfully",
        coupon
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const deleteCoupon = async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      if (coupon.isUsed) {
        return res.status(400).json({ message: "Cannot delete a used coupon" });
      }
      
      await coupon.deleteOne();
      
      res.status(200).json({
        message: "Coupon deleted successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const toggleCouponAvailability = async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      
      if (coupon.isUsed && !coupon.isActive) {
        return res.status(400).json({ message: "Cannot activate a used coupon" });
      }
      
      coupon.isActive = !coupon.isActive;
      await coupon.save();
      
      res.status(200).json({
        message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
        coupon
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const getClaimHistory = async (req, res) => {
    try {
      const claims = await Claim.find().populate('couponId').sort({ claimedAt: -1 });
      res.status(200).json({ claims });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const getDashboardStats = async (req, res) => {
    try {
      const totalCoupons = await Coupon.countDocuments();
      const usedCoupons = await Coupon.countDocuments({ isUsed: true });
      const activeCoupons = await Coupon.countDocuments({ isActive: true, isUsed: false });
      const expiredCoupons = await Coupon.countDocuments({
        expiresAt: { $lt: new Date() },
        isUsed: false
      });
      
      const recentClaims = await Claim.find()
        .populate('couponId')
        .sort({ claimedAt: -1 })
        .limit(5);
      
      res.status(200).json({
        stats: {
          totalCoupons,
          usedCoupons,
          activeCoupons,
          expiredCoupons,
          availableCoupons: activeCoupons - expiredCoupons
        },
        recentClaims
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


module.exports = {
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
  getDashboardStats,
};