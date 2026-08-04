import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: "Briefcase",
  },

  title: {
    type: String,
    default: "",
  },
});

const showcaseImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);
const corporatePageSchema = new mongoose.Schema(
  {
    heroImage: {
      type: String,
      default: "",
    },

    eyebrow: {
      type: String,
      default: "For teams & brands",
    },

    title: {
      type: String,
      default: "Corporate gifting, done with taste.",
    },

    subtitle: {
      type: String,
      default:
        "Trusted by 120+ companies for Diwali, product launches, board rooms, and everyday appreciation.",
    },

    features: [featureSchema],
showcase: {
  badge: {
    type: String,
    default: "",
  },

  title: {
    type: String,
    default: "",
  },

  subtitle: {
    type: String,
    default: "",
  },

  buttonText: {
    type: String,
    default: "",
  },

  buttonLink: {
    type: String,
    default: "",
  },

  images: {
    type: [showcaseImageSchema],
    default: [],
  },
},
    formLabel: {
      type: String,
      default: "Request a quote",
    },

    formTitle: {
      type: String,
      default: "Tell us about your order.",
    },

    formDescription: {
      type: String,
      default:
        "Share a few details — we'll reply with samples, pricing, and packaging options.",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CorporatePage",
  corporatePageSchema
);