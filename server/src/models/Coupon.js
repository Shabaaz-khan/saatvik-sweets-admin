import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    minimumOrderValue: {
      type: Number,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);