import express from "express";
import Legal from "../models/Legal.js";

const router = express.Router();

/**
 * GET /api/legal
 * Get legal content
 */
router.get("/", async (req, res) => {
  try {
    let legal = await Legal.findOne();

    // Create default document if it doesn't exist
    if (!legal) {
      legal = await Legal.create({});
    }

    res.json(legal);
  } catch (error) {
    console.error("Error fetching legal content:", error);
    res.status(500).json({
      message: "Failed to fetch legal content",
    });
  }
});

/**
 * PUT /api/legal
 * Update legal content
 */
router.put("/", async (req, res) => {
  try {
    let legal = await Legal.findOne();

    if (!legal) {
      legal = new Legal();
    }

    legal.privacy = req.body.privacy;
    legal.terms = req.body.terms;

    await legal.save();

    res.json(legal);
  } catch (error) {
    console.error("Error updating legal content:", error);
    res.status(500).json({
      message: "Failed to update legal content",
    });
  }
});

export default router;