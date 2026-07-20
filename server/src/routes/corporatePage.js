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