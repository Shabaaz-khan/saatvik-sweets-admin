import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    body: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const AboutPageSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: "Our Story",
    },

    title: {
      type: String,
      default: "A recipe passed down. A counter built up.",
    },

    subtitle: {
      type: String,
      default:
        "From a single glass counter in 1962 to a modern kitchen serving 400+ cities — the ingredients haven't changed.",
    },

    videoUrl: {
      type: String,
      default: "",
    },
videoFile: {
  type: String,
  default: "",
},
    quote: {
      type: String,
      default:
        "The best mithai isn't made faster. It's made slower.",
    },

    paragraph1: {
      type: String,
      default: "",
    },
team: [
  {
    name: String,
    designation: String,
    image: String,
    description: String,
  },
],
    paragraph2: {
      type: String,
      default: "",
    },

    timeline: {
      type: [TimelineSchema],
      default: [
        {
          year: "1962",
          title: "The counter opens",
          body: "A single glass shelf, four ladoo trays, and one cast-iron kadhai.",
        },
        {
          year: "1998",
          title: "A modern kitchen",
          body: "The next generation opens a certified, temperature-controlled kitchen.",
        },
        {
          year: "Today",
          title: "Made for the world",
          body: "Corporate gifting, pan-India delivery, and international shipping.",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AboutPage",
  AboutPageSchema
);