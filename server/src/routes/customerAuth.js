import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import { customerAuth } from "../middleware/customerAuth.js";
import Order from "../models/Order.js";
const router = Router();
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required.",
      });
    }

    const existing = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        error: "Customer already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone,
      passwordHash,
    });

    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
           expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err) {
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const customer = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (!customer) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      customer.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }
await Order.updateMany(
  {
    customer: null,
    "customer.email": customer.email,
  },
  {
    $set: {
      customer: customer._id,
    },
  }
);
    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
           expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err) {
    next(err);
  }
});
router.get("/me", customerAuth, async (req, res, next) => {
      try {
    const customer = await Customer.findById(req.user.id).select(
      "-passwordHash"
    );

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found.",
      });
    }

    res.json({
      customer,
    });
  } catch (err) {
    next(err);
  }
});
export default router;