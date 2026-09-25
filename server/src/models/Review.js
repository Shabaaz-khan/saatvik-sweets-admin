import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    customerImage: {
      type: String,
      default: "",
    },

    platformName: {
      type: String,
      required: true,
    },

    platformLogo: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 5,
    },

    review: {
      type: String,
      required: true,
    },

    reviewDate: {
      type: Date,
      required: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);