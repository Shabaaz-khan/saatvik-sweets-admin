import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
variants: [
  {
    weight: {
      type: String,
      required: true,
    },
    discount: {
  type: Number,
  default: null,
},
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],
badge: {
  type: String,
  trim: true,
  default: ""
},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    types: { type: mongoose.Schema.Types.ObjectId, ref: "Types", default: null, },
    images: [ { type: String, }, ],
    stock: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }
  next();
});

export default mongoose.model('Product', productSchema);
