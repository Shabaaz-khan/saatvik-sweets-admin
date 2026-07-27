import express from "express";
import ContactPage from "../models/ContactPage.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    let page = await ContactPage.findOne();

    if (!page) {
      page = await ContactPage.create({
        hero: {
          image: "",
          title: "Contact Us",
          subtitle: "",
        },

        form: {
          label: "Contact Us",
          title: "Get In Touch",
          description:
            "Fill out the form below and our team will contact you shortly.",
          image: "",
        },

        contact: {
          companyName: "",
          phone: "",
          whatsapp: "",
          email: "",
          supportEmail: "",
          address: "",
          mapEmbed: "",
        },

        workingHours: {
          mondayFriday: "",
          saturday: "",
          sunday: "",
          holidays: "",
        },

        social: {
          facebook: "",
          instagram: "",
          youtube: "",
          linkedin: "",
          whatsapp: "",
        },
      });
    }

    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load contact page",
    });
  }
});
router.put("/", async (req, res) => {
  try {
    let page = await ContactPage.findOne();

    if (!page) {
      page = new ContactPage();
    }

    Object.assign(page, req.body);

    await page.save();

    res.json(page);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to save contact page",
    });
  }
});
export default router;