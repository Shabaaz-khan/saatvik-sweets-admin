import { Router } from "express";
import CareerApplication from "../models/CareerApplication.js";

const router = Router();

/*
GET ALL APPLICATIONS
*/

router.get("/", async (req, res) => {
  try {
    const applications = await CareerApplication.find()
      .populate("career", "title department location")
      .sort({
        createdAt: -1,
      });

    res.json(applications);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
GET SINGLE APPLICATION
*/

router.get("/:id", async (req, res) => {
  try {
    const application = await CareerApplication.findById(
      req.params.id
    ).populate("career", "title");

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
CREATE APPLICATION
*/

router.post("/", async (req, res) => {
  try {
    const application =
      await CareerApplication.create(req.body);

    res.json(application);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE APPLICATION STATUS
*/

router.put("/:id", async (req, res) => {
  try {
    const application =
      await CareerApplication.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(application);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
DELETE APPLICATION
*/

router.delete("/:id", async (req, res) => {
  try {
    await CareerApplication.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;