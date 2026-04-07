import express from "express";
import Company from "../../part-2-db-design/models/Company.js";
import Warehouse from "../../part-2-db-design/models/Warehouse.js";
import Product from "../../part-2-db-design/models/Product.js";
import Inventory from "../../part-2-db-design/models/Inventory.js";
import InventoryLog from "../../part-2-db-design/models/InventoryLog.js";
import Supplier from "../../part-2-db-design/models/Supplier.js";
import ProductSupplier from "../../part-2-db-design/models/ProductSupplier.js";

const router = express.Router();

// Create Company
router.post("/company", async (req, res) => {
  const company = await Company.create({
    name: "Aditi's Store of Books"
  });

  res.json(company);
});

// Create Warehouse
router.post("/warehouse", async (req, res) => {
  const { company_id } = req.body;

  const warehouse = await Warehouse.create({
    name: "Pune Warehouse",
    company_id
  });

  res.json(warehouse);
});

// Create Product
router.post("/product", async (req, res) => {
  const { company_id } = req.body;

  const product = await Product.create({
    name: "Percy Jackson book series",
    sku: "P500",
    price: 2000,
    company_id,
    low_stock_threshold: 10,
  });

  res.json(product);
});

// Create Inventory
router.post("/inventory", async (req, res) => {
  const { product_id, warehouse_id } = req.body;

  const inventory = await Inventory.create({
    product_id,
    warehouse_id,
    quantity: 5
  });

  res.json(inventory);
});

// Create Sales Logs
router.post("/log", async (req, res) => {
  const { product_id, warehouse_id } = req.body;

  const log = await InventoryLog.create({
    product_id,
    warehouse_id,
    change: -5,
    type: "sale"
  });

  res.json(log);
});

// Create Supplier
router.post("/supplier", async (req, res) => {
  try {
    const { name, contact_email } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: "Supplier name is required" });
    }

    const supplier = await Supplier.create({
      name,
      contact_email
    });

    res.status(201).json(supplier);

  } catch (error) {
    res.status(500).json({
      error: "Failed to create supplier",
      details: error.message
    });
  }
});

// Link Product ↔ Supplier
router.post("/product-supplier", async (req, res) => {
  try {
    const { product_id, supplier_id } = req.body;

    // Validation
    if (!product_id || !supplier_id) {
      return res.status(400).json({
        error: "product_id and supplier_id are required"
      });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if supplier exists
    const supplier = await Supplier.findById(supplier_id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Prevent duplicate mapping
    const existing = await ProductSupplier.findOne({
      product_id,
      supplier_id
    });

    if (existing) {
      return res.status(400).json({
        error: "This product is already linked to this supplier"
      });
    }

    // Create mapping
    const mapping = await ProductSupplier.create({
      product_id,
      supplier_id
    });

    res.status(201).json({
      message: "Product linked to supplier successfully",
      mapping
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to link product and supplier",
      details: error.message
    });
  }
});

export default router;