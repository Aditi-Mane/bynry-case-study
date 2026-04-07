import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  warehouse_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },

  quantity: {
    type: Number,
    default: 0,
    min: 0
  }

}, { timestamps: true });

// Prevent duplicates (same product in same warehouse)
inventorySchema.index({ product_id: 1, warehouse_id: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;