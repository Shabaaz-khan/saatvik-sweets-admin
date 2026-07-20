import { Router } from 'express';
import Order from '../models/Order.js';
import { authMiddleware } from '../middleware/auth.js';
import { customerAuth } from '../middleware/customerAuth.js';
const router = Router();

// Admin: list all orders
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ orderNumber: re }, { customerName: re }, { customerEmail: re }];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
});
// Customer: My Orders
router.get("/my-orders", customerAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
});
// Admin: single order
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

// Admin: update order status
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
});

// Admin: delete order
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
