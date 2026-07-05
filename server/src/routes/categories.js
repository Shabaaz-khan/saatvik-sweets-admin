import { Router } from 'express';
import Category from '../models/Category.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: list active categories (for storefront)
router.get('/', async (req, res, next) => {
  try {
    const onlyActive = req.query.active === 'true';
    const filter = onlyActive ? { isActive: true } : {};
    const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (err) { next(err); }
});

// Public: single category
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) { next(err); }
});

// Admin: create
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A category with this slug already exists.' });
    next(err);
  }
});

// Admin: update
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A category with this slug already exists.' });
    next(err);
  }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
