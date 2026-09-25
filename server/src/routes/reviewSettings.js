import { Router } from "express";
import ReviewSettings from "../models/ReviewSettings.js";

const router = Router();

/*
GET REVIEW SETTINGS
*/

router.get("/", async (req, res) => {
  try {
    let settings = await ReviewSettings.findOne();

    if (!settings) {
      settings = await ReviewSettings.create({});
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE REVIEW SETTINGS
*/

router.put("/", async (req, res) => {
  try {
    let settings = await ReviewSettings.findOne();

    if (!settings) {
      settings = await ReviewSettings.create(req.body);
    } else {
      settings = await ReviewSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;