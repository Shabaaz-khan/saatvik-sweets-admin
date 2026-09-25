import { Router } from "express";
import Review from "../models/Review.js";

const router = Router();

/*
GET ALL REVIEWS
*/

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.active === "true") {
      filter.isActive = true;
    }

    const reviews = await Review.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
GET SINGLE REVIEW
*/

router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
CREATE REVIEW
*/

router.post("/", async (req, res) => {
  try {
    const review = await Review.create(req.body);

    res.json(review);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
UPDATE REVIEW
*/

router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
DELETE REVIEW
*/

router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;