import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },

  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  location: String
}, { timestamps: true });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;