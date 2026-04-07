import mongoose from "mongoose";

const bundleItemSchema = new mongoose.Schema({
  bundle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const BundleItem = mongoose.model("BundleItem", bundleItemSchema);

export default BundleItem;