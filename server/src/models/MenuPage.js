import mongoose from "mongoose";

const menuPageSchema = new mongoose.Schema({
  allTabName: {
    type: String,
    default: "Everything",
  },

  eyebrow: {
    type: String,
    default: "The Menu",
  },

  title: {
    type: String,
    default: "Every counter, every craft.",
  },

  subtitle: {
    type: String,
    default: "Prices per portion. Items are packed the day of dispatch to preserve freshness.",
  },
  firstTabProducts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
],
});
export default mongoose.model(
  "MenuPage",
  menuPageSchema
);