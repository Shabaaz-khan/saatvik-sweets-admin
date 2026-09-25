import mongoose from "mongoose";

const PortfolioPageSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    navigation: [
      {
        number: {
          type: String,
          default: "",
        },

        label: {
          type: String,
          default: "",
        },

        link: {
          type: String,
          default: "",
        },

        target: {
          type: String,
          default: "_self",
        },

        order: {
          type: Number,
          default: 0,
        },

        active: {
          type: Boolean,
          default: true,
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Hero / Intro Section
    |--------------------------------------------------------------------------
    */

    hero: {
      logo: {
        type: String,
        default: "",
      },

      title: {
        type: String,
        default: "",
      },

      highlightedTitle: {
        type: String,
        default: "",
      },

      description: {
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

      backgroundImage: {
        type: String,
        default: "",
      },

      modelImage: {
        type: String,
        default: "",
      },

      architectImage: {
        type: String,
        default: "",
      },

      singerImage: {
        type: String,
        default: "",
      },

      photographerImage: {
        type: String,
        default: "",
      },

      macImage: {
        type: String,
        default: "",
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Demo Sections
    |--------------------------------------------------------------------------
    */

  demos: [
  {
    number: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
slug: {
  type: String,
  default: "",
  trim: true,
},
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
    celebrityProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CelebrityProfile",
      default: null,
    },
    image: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    alignment: {
      type: String,
      enum: ["left", "right"],
      default: "right",
    },

    backgroundClass: {
      type: String,
      default: "",
    },

    backgroundColor: {
      type: String,
      default: "#FFF200",
    },

    parallaxImages: [
      {
        image: String,
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },
    ],

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
],

    /*
    |--------------------------------------------------------------------------
    | Responsive Section
    |--------------------------------------------------------------------------
    */

    responsive: {
      title: {
        type: String,
        default: "",
      },

      highlightedText: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },

      layers: [
        {
          image: {
            type: String,
            default: "",
          },

          x: {
            type: Number,
            default: 0,
          },

          y: {
            type: Number,
            default: 0,
          },

          order: {
            type: Number,
            default: 0,
          },
        },
      ],

      active: {
        type: Boolean,
        default: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    */

    features: [
      {
        icon: {
          type: String,
          default: "",
        },

        title: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },

        order: {
          type: Number,
          default: 0,
        },

        active: {
          type: Boolean,
          default: true,
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    footer: {
      title: {
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

      buyText: {
        type: String,
        default: "",
      },

      price: {
        type: String,
        default: "",
      },

      logo: {
        type: String,
        default: "",
      },

      active: {
        type: Boolean,
        default: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Page Status
    |--------------------------------------------------------------------------
    */

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PortfolioPage",
  PortfolioPageSchema
);