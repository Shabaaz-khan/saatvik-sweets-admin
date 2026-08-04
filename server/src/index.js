import 'dotenv/config';
import express from 'express';
// import path from "path";
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import typesRoutes from './routes/types.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import couponRoutes from './routes/coupon.js';
import razorpayRoutes from './routes/razorpay.js';
import uploadRoutes from './routes/upload.js';
import corporateRoutes from './routes/corporate.js';
import settingsRoutes from "./routes/settings.js";
import corporatePageRoutes from "./routes/corporatePage.js";
import menuPageRoutes from "./routes/menuPage.js";
import aboutPageRoutes from "./routes/aboutPage.js";
import homePageRoutes from "./routes/homePage.js";
import legalRoutes from "./routes/legal.js";
import customerAuthRoutes from "./routes/customerAuth.js";
import addressRoutes from "./routes/address.js";
import ContactPage  from "./routes/contactPage.js";
import careerRoutes from "./routes/careers.js";
import careerApplicationRoutes from "./routes/careerApplications.js";
const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') ?? '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use("/uploads", express.static("uploads"));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api/types", typesRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/corporate", corporateRoutes);
app.use("/api/settings", settingsRoutes);
app.use( "/api/corporate-page", corporatePageRoutes );
app.use("/api/menu-page", menuPageRoutes);
app.use("/api/about-page", aboutPageRoutes);
app.use("/api/home-page", homePageRoutes);
app.use("/api/contact-page", ContactPage);
app.use("/api/legal", legalRoutes);
app.use("/api/customer", customerAuthRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/careers", careerRoutes);
app.use( "/api/career-applications", careerApplicationRoutes );
// Central error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? 'Server error' });
});

const PORT = process.env.PORT ?? 5000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/mithaimart';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // console.log('MongoDB connected:', MONGODB_URI);
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
