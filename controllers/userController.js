const { Coupon } = require("../models/coupons");
const { Claim } = require("../models/claim");

const getAvailableCoupons = async (req, res) => {
  console.log("[DEBUG] getAvailableCoupons called", {
    ipAddress: req.ip,
    sessionId: req.cookies?.sessionId || req.headers['x-session-id']
  });

  try {
    const ipAddress = req.ip;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
    
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    const cooldownDate = new Date(Date.now() - cooldownPeriod);
    
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { sessionId }
      ],
      claimedAt: { $gt: cooldownDate }
    });
    
    if (recentClaim) {
      const timeLeft = calculateTimeLeft(recentClaim.claimedAt, cooldownPeriod);
      return res.status(200).json({
        eligible: false,
        message: "You have already claimed a coupon recently",
        timeLeft,
        nextEligibleDate: new Date(recentClaim.claimedAt.getTime() + cooldownPeriod)
      });
    }
    
    const availableCoupons = await Coupon.find({
      isActive: true,
      isUsed: false,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    }).sort({ createdAt: 1 })
      .select('code description')
      .limit(5);
    
    res.status(200).json({
      eligible: true,
      availableCoupons,
      message: "You can claim one of these coupons"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const claimCouponById = async (req, res) => {
  console.log("[DEBUG] claimCouponById called", {
    couponId: req.params.couponId,
    ipAddress: req.ip,
    sessionId: req.cookies?.sessionId || req.headers['x-session-id']
  });

  try {
    const { couponId } = req.params;
    const ipAddress = req.ip;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] || 'fallback-session-id';
    const userAgent = req.headers['user-agent'];
    
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    const cooldownDate = new Date(Date.now() - cooldownPeriod);
    
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { sessionId }
      ],
      claimedAt: { $gt: cooldownDate }
    });
    
    if (recentClaim) {
      const timeLeft = calculateTimeLeft(recentClaim.claimedAt, cooldownPeriod);
      return res.status(429).json({
        message: "You have already claimed a coupon recently",
        timeLeft
      });
    }
    
    const coupon = await Coupon.findById(couponId);
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    if (!coupon.isActive) {
      return res.status(400).json({ message: "This coupon is not active" });
    }
    
    if (coupon.isUsed) {
      return res.status(400).json({ message: "This coupon has already been claimed" });
    }
    
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "This coupon has expired" });
    }
    
    coupon.isUsed = true;
    coupon.usedAt = new Date();
    await coupon.save();
    
    const claim = new Claim({
      couponId: coupon._id,
      ipAddress,
      sessionId,
      userAgent
    });
    
    await claim.save();
    
    res.status(200).json({
      message: "Coupon claimed successfully",
      coupon: {
        code: coupon.code,
        description: coupon.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const claimNextAvailableCoupon = async (req, res) => {
  console.log("[DEBUG] claimNextAvailableCoupon called", {
    ipAddress: req.ip,
    sessionId: req.cookies?.sessionId || req.headers['x-session-id']
  });

  try {
    const ipAddress = req.ip;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'] || 'fallback-session-id';
    const userAgent = req.headers['user-agent'];
    
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    const cooldownDate = new Date(Date.now() - cooldownPeriod);
    
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { sessionId }
      ],
      claimedAt: { $gt: cooldownDate }
    });
    
    if (recentClaim) {
      const timeLeft = calculateTimeLeft(recentClaim.claimedAt, cooldownPeriod);
      return res.status(429).json({
        message: "You have already claimed a coupon recently",
        timeLeft
      });
    }
    
    const availableCoupon = await Coupon.findOne({
      isActive: true,
      isUsed: false,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    }).sort({ createdAt: 1 });
    
    if (!availableCoupon) {
      return res.status(404).json({ message: "No coupons available at the moment" });
    }
    
    availableCoupon.isUsed = true;
    availableCoupon.usedAt = new Date();
    await availableCoupon.save();
    
    const claim = new Claim({
      couponId: availableCoupon._id,
      ipAddress,
      sessionId,
      userAgent
    });
    
    await claim.save();
    
    res.status(200).json({
      message: "Coupon claimed successfully",
      coupon: {
        code: availableCoupon.code,
        description: availableCoupon.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkEligibility = async (req, res) => {
  console.log("[DEBUG] checkEligibility called", {
    ipAddress: req.ip,
    sessionId: req.cookies?.sessionId || req.headers['x-session-id']
  });

  try {
    const ipAddress = req.ip;
    const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
    
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    const cooldownDate = new Date(Date.now() - cooldownPeriod);
    
    const recentClaim = await Claim.findOne({
      $or: [
        { ipAddress },
        { sessionId }
      ],
      claimedAt: { $gt: cooldownDate }
    });
    
    if (recentClaim) {
      const timeLeft = calculateTimeLeft(recentClaim.claimedAt, cooldownPeriod);
      return res.status(200).json({
        eligible: false,
        message: "You have already claimed a coupon recently",
        timeLeft,
        nextEligibleDate: new Date(recentClaim.claimedAt.getTime() + cooldownPeriod)
      });
    }
    
    const availableCouponsCount = await Coupon.countDocuments({
      isActive: true,
      isUsed: false,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    });
    
    res.status(200).json({
      eligible: true,
      availableCouponsCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const calculateTimeLeft = (claimDate, cooldownPeriod) => {
  const now = new Date();
  const cooldownEnds = new Date(claimDate.getTime() + cooldownPeriod);
  const msLeft = cooldownEnds - now;
  
  if (msLeft <= 0) return "0 hours";
  
  const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  return `${hoursLeft} hours`;
};

module.exports = {
  getAvailableCoupons,
  claimCouponById,
  claimNextAvailableCoupon,
  checkEligibility
};