export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Types = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: Category | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
variants: {
  weight: string;
  price: number;
}[];

  category: Category | null;

  types: Types | null;

  imageUrl: string;

  stock: number;

  isAvailable: boolean;

  isFeatured: boolean;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
};
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type OrderItem = {
  _id: string;
  product: string | null;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  couponCode?: string;
couponName?: string;
discountType?: string;
discountValue?: number;
discountAmount?: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
export interface Coupon {
  _id: string;

  code: string;

  name: string;

  description: string;

  discountType: "percentage" | "fixed";

  discountValue: number;

  minimumOrderValue: number;

  maximumDiscount: number;

  usageLimit: number;

  usedCount: number;

  startDate: string;

  endDate: string;

  isActive: boolean;
}
export interface CorporateFeature {
  icon: string;
  title: string;
}

export interface CorporatePage {
  heroImage: string;

  eyebrow: string;

  title: string;

  subtitle: string;

  features: CorporateFeature[];

  formLabel: string;

  formTitle: string;

  formDescription: string;
}