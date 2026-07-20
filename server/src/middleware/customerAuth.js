import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

export async function customerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id);

    if (!customer) {
      return res.status(401).json({
        error: "Customer not found.",
      });
    }

    req.user = customer;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}