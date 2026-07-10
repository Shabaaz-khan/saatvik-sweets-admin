import { Router } from "express";
import Types from "../models/Types.js";
import Category from "../models/Category.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public - Get All Types
router.get("/", async (req, res, next) => {
  try {
    const onlyActive = req.query.active === "true";

    const filter = {};

    if (onlyActive) filter.isActive = true;

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const types = await Types.find(filter)
      .populate("category")
      .sort({ sortOrder: 1, name: 1 });

    res.json(types);
  } catch (err) {
    next(err);
  }
});

// Public - Get Single Type
router.get("/:id", async (req, res, next) => {
  try {
    const type = await Types.findById(req.params.id).populate("category");

    if (!type) {
      return res.status(404).json({
        error: "Type not found.",
      });
    }

    res.json(type);
  } catch (err) {
    next(err);
  }
});

// Admin - Create
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(400).json({
        error: "Category not found.",
      });
    }

    const type = await Types.create(req.body);

    await type.populate("category");

    res.status(201).json(type);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A type with this slug already exists.",
      });
    }

    next(err);
  }
});

// Admin - Update
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(400).json({
        error: "Category not found.",
      });
    }

    const type = await Types.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category");

    if (!type) {
      return res.status(404).json({
        error: "Type not found.",
      });
    }

    res.json(type);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A type with this slug already exists.",
      });
    }

    next(err);
  }
});

// Admin - Delete
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const type = await Types.findByIdAndDelete(req.params.id);

    if (!type) {
      return res.status(404).json({
        error: "Type not found.",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;