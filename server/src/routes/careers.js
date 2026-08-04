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

router.get("/:id", async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

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
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
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