import mongoose from "mongoose";

const ContactPageSchema = new mongoose.Schema(
  {
    hero: {
      image: String,
      title: String,
      subtitle: String,
    },

    form: {
      label: String,
      title: String,
      description: String,
      image: String,
    },

    contact: {
      companyName: String,
      phone: String,
      whatsapp: String,
      email: String,
      supportEmail: String,
      address: String,
      mapEmbed: String,
    },

    workingHours: {
      mondayFriday: String,
      saturday: String,
      sunday: String,
      holidays: String,
    },

    social: {
      facebook: String,
      instagram: String,
      youtube: String,
      linkedin: String,
      whatsapp: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ContactPage", ContactPageSchema);