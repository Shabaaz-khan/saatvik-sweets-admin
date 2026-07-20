import { Router } from "express";
import Coupon from "../models/Coupon.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/*
----------------------------------------------------
GET ALL COUPONS
----------------------------------------------------
*/
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json(coupons);
  } catch (err) {
    next(err);
  }
});

/*
----------------------------------------------------
GET SINGLE COUPON
----------------------------------------------------
*/
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        error: "Coupon not found.",
      });
    }

    res.json(coupon);
  } catch (err) {
    next(err);
  }
});

/*
----------------------------------------------------
CREATE COUPON
----------------------------------------------------
*/
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const exists = await Coupon.findOne({
      code: req.body.code.toUpperCase(),
    });

    if (exists) {
      return res.status(409).json({
        error: "Coupon already exists.",
      });
    }

    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase(),
    });

    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
});

/*
----------------------------------------------------
UPDATE COUPON
----------------------------------------------------
*/
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!coupon) {
      return res.status(404).json({
        error: "Coupon not found.",
      });
    }

    res.json(coupon);
  } catch (err) {
    next(err);
  }
});

/*
----------------------------------------------------
DELETE COUPON
----------------------------------------------------
*/
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        error: "Coupon not found.",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

/*
----------------------------------------------------
VALIDATE COUPON
----------------------------------------------------
*/
router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.json({
        valid: false,
        message: "Invalid Coupon",
      });
    }

    if (!coupon.isActive) {
      return res.json({
        valid: false,
        message: "Coupon Disabled",
      });
    }

    const now = new Date();

    if (now < coupon.startDate) {
      return res.json({
        valid: false,
        message: "Coupon not started yet",
      });
    }

    if (now > coupon.endDate) {
      return res.json({
        valid: false,
        message: "Coupon Expired",
      });
    }

    if (subtotal < coupon.minimumOrderValue) {
      return res.json({
        valid: false,
        message: `Minimum order should be ₹${coupon.minimumOrderValue}`,
      });
    }

    if (
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.json({
        valid: false,
        message: "Coupon usage limit exceeded",
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (subtotal * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscount > 0 &&
        discount > coupon.maximumDiscount
      ) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discount,
      grandTotal: subtotal - discount,
      message: "Coupon Applied Successfully",
    });
  } catch (err) {
    next(err);
  }
});

export default router;