import { Router } from "express";
import AboutPage from "../models/AboutPage.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let page = await AboutPage.findOne();

    if (!page) {
      page = await AboutPage.create({});
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    let page = await AboutPage.findOne();

    if (!page) {
      page = await AboutPage.create(req.body);
    } else {
      Object.assign(page, req.body);
      await page.save();
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;