import { Router } from "express";
import CorporatePage from "../models/CorporatePage.js";

const router = Router();

/*
GET
*/

router.get("/", async (req, res) => {
  try {
    let page = await CorporatePage.findOne();

    if (!page) {
page = await CorporatePage.create({
  features: [
    {
      icon: "Briefcase",
      title: "GST invoicing",
    },
    {
      icon: "Package",
      title: "Custom branding",
    },
    {
      icon: "Sparkles",
      title: "Dedicated manager",
    },
  ],

showcase: {
  badge: "Luxury Collection",

  title: "Corporate Gifting That Leaves A Lasting Impression",

  subtitle:
    "Premium handcrafted sweets for memorable gifting.",

  buttonText: "Request Quote",

  buttonLink: "/gifting",

  images: [
    {
      image: "",
    },
    {
      image: "",
    },
    {
      image: "",
    },
  ],
},
});   
 }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE
*/

router.put("/", async (req, res) => {
  try {
    let page = await CorporatePage.findOne();

    if (!page) {
      page = await CorporatePage.create(req.body);
    } else {
      Object.assign(page, req.body);
      await page.save();
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;