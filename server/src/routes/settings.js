import { Router } from "express";
import Settings from "../models/Settings.js";

const router = Router();

/*
GET Settings
*/
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/*
Update Settings
*/
router.put("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);

      await settings.save();
    }

    res.json({
      success: true,
      message: "Settings Updated Successfully",
      settings,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;