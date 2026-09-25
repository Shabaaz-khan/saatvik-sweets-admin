import mongoose from "mongoose";

const reviewSettingsSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Loved by Thousands of Sweet Lovers",
    },

    subHeading: {
      type: String,
      default:
        "Every review reflects our commitment to authentic taste and uncompromising quality.",
    },

    centerImage: {
      type: String,
      default: "",
    },

    averageRating: {
      type: String,
      default: "4.9",
    },

    totalCustomers: {
      type: String,
      default: "10000+",
    },

    totalProducts: {
      type: String,
      default: "50+",
    },

    purityPercentage: {
      type: String,
      default: "100%",
    },

    autoSlide: {
      type: Boolean,
      default: true,
    },

    slideDuration: {
      type: Number,
      default: 5000,
    },

    showStats: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ReviewSettings",
  reviewSettingsSchema
);