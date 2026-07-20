import mongoose from "mongoose";

const corporateInquirySchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    eventDate: {
      type: String,
      default: "",
    },

    budget: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CorporateInquiry",
  corporateInquirySchema
);