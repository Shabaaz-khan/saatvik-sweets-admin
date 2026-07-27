import { Router } from "express";
import Address from "../models/Address.js";
import { customerAuth } from "../middleware/customerAuth.js";

const router = Router();

export default router;
router.get("/", customerAuth, async (req, res, next) => {
  try {
    const addresses = await Address.find({
      customer: req.user._id,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json(addresses);
  } catch (err) {
    next(err);
  }
});
router.post("/", customerAuth, async (req, res, next) => {
  try {
    const data = req.body;

    if (data.isDefault) {
      await Address.updateMany(
        { customer: req.user._id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      ...data,
      customer: req.user._id,
    });

    res.status(201).json(address);
  } catch (err) {
    next(err);
  }
});
router.put("/:id", customerAuth, async (req, res, next) => {
  try {
    const data = req.body;

    const address = await Address.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    if (data.isDefault) {
      await Address.updateMany(
        { customer: req.user._id },
        { isDefault: false }
      );
    }

    Object.assign(address, data);

    await address.save();

    res.json(address);
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", customerAuth, async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        error: "Address not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});