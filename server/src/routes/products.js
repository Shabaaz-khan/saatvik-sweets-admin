import { Router } from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Types from '../models/Types.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: list products (storefront sees only available)
router.get('/', async (req, res, next) => {
  try {
    const { available, category, featured, search } = req.query;
    const filter = {};
    if (available === 'true') filter.isAvailable = true;
    if (featured === 'true') filter.isFeatured = true;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate("category")
.populate("types")
      .sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (err) { next(err); }
});

// Public: single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category")
.populate("types");
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) { next(err); }
});

// Admin: create
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Validate category if provided
    if (req.body.category) {
      const cat = await Category.findById(req.body.category);
      if (!cat) return res.status(400).json({ error: 'Category not found.' });
    }
    if (req.body.types) {
  const type = await Types.findById(req.body.types);

  if (!type) {
    return res.status(400).json({
      error: "Type not found.",
    });
  }
}
    const product = await Product.create(req.body);
    await product.populate("category")
.populate("types");
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A product with this slug already exists.' });
    next(err);
  }
});

// Admin: update
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (req.body.category) {
      const cat = await Category.findById(req.body.category);
      if (!cat) return res.status(400).json({ error: 'Category not found.' });
    }
    if (req.body.types) {
  const type = await Types.findById(req.body.types);

  if (!type) {
    return res.status(400).json({
      error: "Type not found.",
    });
  }
}
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("category")
.populate("types");
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A product with this slug already exists.' });
    next(err);
  }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
