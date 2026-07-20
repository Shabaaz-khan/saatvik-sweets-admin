import { Router } from "express";
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import upload from "../middleware/upload.js";
import s3 from "../config/s3.js";

const router = Router();

/*
------------------------------------
Upload Image
------------------------------------
*/

router.post("/", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    // Folder name sent from frontend
    const folder = req.body.folder || "others";

    // Create unique filename
    const extension = req.file.originalname.split(".").pop();

    const fileName =
      `${Date.now()}-${Math.round(Math.random() * 1000000)}.${extension}`;

    // Complete S3 path
    const key = `${folder}/${fileName}`;

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,

        Key: key,

        Body: req.file.buffer,

        ContentType: req.file.mimetype,
      })
    );
console.log(process.env.CLOUDFRONT_URL);
    // CloudFront URL
    const imageUrl =
      `${process.env.CLOUDFRONT_URL}/${key}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl,
      fileName,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/*
------------------------------------
Delete Image
------------------------------------
*/

router.delete("/", async (req, res) => {

  try {

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Remove CloudFront URL
    const key = imageUrl.replace(
      `${process.env.CLOUDFRONT_URL}/`,
      ""
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,

        Key: key,
      })
    );

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