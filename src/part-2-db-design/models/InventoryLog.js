import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema({
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

  change: {
    type: Number,
    required: true
  },

  reason: String,

  created_at: {
    type: Date,
    default: Date.now
  },

  type: {
    type: String,
    enum: ["sale", "restock", "adjustment"],
    required: true
  }

});

const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;