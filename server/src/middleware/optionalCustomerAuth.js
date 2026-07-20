import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

export async function optionalCustomerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id);

    req.user = customer || null;

    next();
  } catch (err) {
    req.user = null;
    next();
  }
}