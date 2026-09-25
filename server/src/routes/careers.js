import { Router } from "express";
import Career from "../models/Career.js";

const router = Router();

/*
GET ALL CAREERS
*/

router.get("/", async (req, res) => {
  try {
    const careers = await Career.find().sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.json(careers);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
GET SINGLE CAREER
*/

router.get("/:slug", async (req, res) => {
  try {
    const career = await Career.findOne({
      slug: req.params.slug,
    });

    if (!career) {
      return res.status(404).json({
        error: "Career not found",
      });
    }

    res.json(career);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
CREATE CAREER
*/

router.post("/", async (req, res) => {
  try {
    req.body.slug = req.body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const career = await Career.create(req.body);

    res.json(career);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE CAREER
*/

router.put("/:id", async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(career);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
/*
DELETE CAREER
*/

router.delete("/:id", async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;