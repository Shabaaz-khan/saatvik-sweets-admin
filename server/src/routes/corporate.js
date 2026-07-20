import { Router } from "express";
import CorporateInquiry from "../models/CorporateInquiry.js";
import sendCorporateMail from "../utils/sendCorporateMail.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const inquiry = await CorporateInquiry.create(req.body);

    await sendCorporateMail(inquiry);

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
router.get("/", async (req, res) => {
  try {

    const inquiries =
      await CorporateInquiry
        .find()
        .sort({ createdAt: -1 });

    res.json(inquiries);

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});
router.put("/:id", async (req, res) => {
  try {

    const inquiry =
      await CorporateInquiry.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(inquiry);

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});
export default router;