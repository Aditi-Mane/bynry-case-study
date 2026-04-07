import mongoose from "mongoose";

const productSupplierSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  }
});

// Optional: prevent duplicates
productSupplierSchema.index(
  { product_id: 1, supplier_id: 1 },
  { unique: true }
);

const ProductSupplier = mongoose.model("ProductSupplier", productSupplierSchema);

export default ProductSupplier;