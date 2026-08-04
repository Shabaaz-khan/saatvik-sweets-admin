import mongoose from "mongoose";

const CareerApplicationSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      default: "",
    },

    currentLocation: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CareerApplication",
  CareerApplicationSchema
);