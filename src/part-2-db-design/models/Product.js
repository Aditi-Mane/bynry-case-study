import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  sku: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  product_type: {
    type: String,
    enum: ["normal", "bundle"],
    default: "normal"
  }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;