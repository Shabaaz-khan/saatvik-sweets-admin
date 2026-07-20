import mongoose from "mongoose";

const legalSchema = new mongoose.Schema(
  {
    privacy: {
      title: {
        type: String,
        default: "Privacy Policy",
      },
      content: {
        type: String,
        default: "",
      },
    },

    terms: {
      title: {
        type: String,
        default: "Terms & Conditions",
      },
      content: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Legal", legalSchema);