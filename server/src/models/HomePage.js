import mongoose from "mongoose";

const HomePageSchema = new mongoose.Schema(
  {
    hero: {
      label: {
        type: String,
        default: "",
      },
      titleLine1: {
        type: String,
        default: "",
      },
      titleLine2: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },

      primaryButtonText: {
        type: String,
        default: "",
      },
      primaryButtonLink: {
        type: String,
        default: "",
      },

      secondaryButtonText: {
        type: String,
        default: "",
      },
      secondaryButtonLink: {
        type: String,
        default: "",
      },

      heroPlateImage: {
        type: String,
        default: "",
      },

      ladooImage: {
        type: String,
        default: "",
      },

      katliImage: {
        type: String,
        default: "",
      },

      card1: {
        image: String,
        label: String,
        title: String,
      },

      card2: {
        image: String,
        label: String,
        title: String,
      },

      stats: [
        {
          number: String,
          label: String,
        },
      ],

      badgeYear: {
        type: String,
        default: "",
      },

      badgeCity: {
        type: String,
        default: "",
      },
    },

    marquee: {
      items: [
        {
          type: String,
        },
      ],
    },
valuesSection: [
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
],
    story: {
      label: String,
      title: String,
      description: String,
      image: String,
        // New multiple images
   images: {
    type: [String],
    default: [],
  },
      buttonText: String,
      buttonLink: String,
    },
floatingVideo: {
  enabled: {
    type: Boolean,
    default: true,
  },

  videoUrl: {
    type: String,
    default: "",
  },

  poster: {
    type: String,
    default: "",
  },

  position: {
    type: String,
    default: "right",
  },
},
signature: {
  eyebrow: String,
  title: String,
  subtitle: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  limit: {
    type: Number,
    default: 4,
  },
},

  corporate: {
  label: String,
  title: String,
  description: String,

  primaryButtonText: String,
  primaryButtonLink: String,

  secondaryButtonText: String,
  secondaryButtonLink: String,

featuredProducts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
]
},
videoTestimonials: [
  {
    videoUrl: String,
    name: String,
    designation: String,
  },
],
specialGuests: [
  {
    name: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    backgroundColor: {
      type: String,
      default: "#3A1420",
    },

    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },

        url: {
          type: String,
          default: "",
        },

        title: {
          type: String,
          default: "",
        },
      },
    ],

    sortOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
],
testimonials: [
  {
    name: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
      company: {
      type: String,
      default: "",
    },
      title: {
      type: String,
      default: "",
    },
      companyLogo: {
      type: String,
      default: "",
    },
      linkedin: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
],

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HomePage", HomePageSchema);