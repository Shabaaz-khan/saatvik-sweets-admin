import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "Saatvik Sweets & Savouries",
    },

    tagline: {
      type: String,
      default:
        "Three generations of craft. Every ladoo shaped by hand.",
    },

    logo: {
      type: String,
      default: "",
    },

    // favicon: {
    //   type: String,
    //   default: "",
    // },

contacts: [
  {
    name: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "General",
        "Bulk Orders",
        "Corporate Orders",
        "Complaints",
      ],
      default: "General",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },
  },
],

  

    address: {
      type: String,
      default: "",
    },

socialMedia: [
  {
    platform: {
      type: String,
      enum: [
        "Instagram",
        "Facebook",
        "YouTube",
        "LinkedIn",
        "Twitter",
        "WhatsApp"
      ]
    },
    url: String
  }
],

    // copyright: {
    //   type: String,
    //   default: "",
    // }
  },
  {
    timestamps: true,
  }
);
 
export default mongoose.model(
  "Settings",
  settingsSchema
);