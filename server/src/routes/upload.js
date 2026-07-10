import { Router } from "express";
import fs from "fs";
import path from "path";
import upload from "../middleware/upload.js";

const router = Router();

// Upload single image
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: `/${req.file.path.replace(/\\/g, "/")}`,
      fileName: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.delete("/", (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const filePath = path.join(
      process.cwd(),
      imageUrl.replace(/^\/+/, "")
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({
      success: true,
      message: "Image deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
export default router;