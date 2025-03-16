const mongoose = require("mongoose");

const claimSchema = mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: false,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = {
  Claim: mongoose.model("Claim", claimSchema, "claims"),
};