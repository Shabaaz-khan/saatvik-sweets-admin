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
  discount:number;
  price: number;
}[];
 badge?: string;
  category: Category | null;

  types: Types | null;

  images: string[];

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

// New Address Fields
firstName: string;
lastName: string;

address1: string;
address2: string;
landmark: string;
state: string;

// Existing Address Fields
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
export type Review = {
  _id: string;

  customerName: string;
  customerImage: string;

  platformName: string;
  platformLogo: string;

  rating: number;

  review: string;

  reviewDate: string;

  cardPosition: "left" | "right" | "bottom";

  displayOrder: number;

  featured: boolean;

  isActive: boolean;

  // Review Section CMS

  sectionHeading: string;

  sectionSubHeading: string;

  centerImage: string;

  averageRating: string;

  totalCustomers: string;

  totalProducts: string;

  purityPercentage: string;

  createdAt?: string;

  updatedAt?: string;
};
export type ReviewSettings = {
  _id: string;

  heading: string;

  subHeading: string;

  centerImage: string;

  averageRating: string;

  totalCustomers: string;

  totalProducts: string;

  purityPercentage: string;

  autoSlide: boolean;

  slideDuration: number;

  showStats: boolean;
};