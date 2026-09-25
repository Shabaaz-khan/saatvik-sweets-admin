import mongoose from "mongoose";

/*
==================================================
WORK SCHEMA
==================================================
*/

const WorkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    link: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
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


/*
==================================================
GALLERY SCHEMA
==================================================
*/

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
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


/*
==================================================
AWARD SCHEMA
==================================================
*/

const AwardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    organization: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
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


/*
==================================================
EVENT SCHEMA
==================================================
*/

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    month: {
      type: String,
      default: "",
    },

    day: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
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


/*
==================================================
MAIN PORTFOLIO SCHEMA
==================================================
*/

const  CelebrityProfileSchema = new mongoose.Schema(
  {
      /*
    ==============================================
    CELEBRITY INFORMATION
    ==============================================
    */

    name: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      default: "",
      unique: true,
      trim: true,
    },

    /*
    ==============================================
    01 INTRO
    ==============================================
    */

    intro: {
      label: {
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

      description: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      backgroundImage: {
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

      isActive: {
        type: Boolean,
        default: true,
      },
    },


    /*
    ==============================================
    02 ABOUT
    ==============================================
    */

    about: {
      label: {
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

      description: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      secondaryImage: {
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

      isActive: {
        type: Boolean,
        default: true,
      },
    },


    /*
    ==============================================
    03 WORK
    ==============================================
    */

    works: {
      type: [WorkSchema],
      default: [],
    },


    /*
    ==============================================
    04 GALLERY
    ==============================================
    */

    gallery: {
      type: [GallerySchema],
      default: [],
    },


    /*
    ==============================================
    05 AWARDS
    ==============================================
    */

    awards: {
      type: [AwardSchema],
      default: [],
    },


    /*
    ==============================================
    06 EVENTS
    ==============================================
    */

    events: {
      type: [EventSchema],
      default: [],
    },


    /*
    ==============================================
    SECTION SETTINGS
    ==============================================
    */

    sections: {
      intro: {
        type: Boolean,
        default: true,
      },

      about: {
        type: Boolean,
        default: true,
      },

      work: {
        type: Boolean,
        default: true,
      },

      gallery: {
        type: Boolean,
        default: true,
      },

      awards: {
        type: Boolean,
        default: true,
      },

      events: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("CelebrityProfile", CelebrityProfileSchema);