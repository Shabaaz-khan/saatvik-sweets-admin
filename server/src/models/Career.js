import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    department: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Contract",
      ],
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    responsibilities: [
      {
        type: String,
      },
    ],

    requirements: [
      {
        type: String,
      },
    ],

    benefits: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CareerSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  next();
});

export default mongoose.model("Career", CareerSchema);