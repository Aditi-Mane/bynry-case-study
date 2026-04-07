import Inventory from "../part-2-db-design/models/Inventory.js";
import InventoryLog from "../part-2-db-design/models/InventoryLog.js";
import Product from "../part-2-db-design/models/Product.js";
import Warehouse from "../part-2-db-design/models/Warehouse.js";

export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = ["name", "sku", "price", "warehouse_id"];
    for (let field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({
          error: `${field} is required`
        });
      }
    }

    // Check SKU uniqueness
    const existingProduct = await Product.findOne({ sku: data.sku });
    if (existingProduct) {
      return res.status(400).json({
        error: "SKU already exists"
      });
    }

    // Validate warehouse
    const warehouse = await Warehouse.findById(data.warehouse_id);
    if (!warehouse) {
      return res.status(400).json({
        error: "Invalid warehouse_id"
      });
    }

    // Validate price
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        error: "Invalid price"
      });
    }

    // Validate quantity (optional field)
    const quantity = data.initial_quantity ?? 0;
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Invalid quantity"
      });
    }

    // Create product (no warehouse_id here)
    const product = await Product.create({
      name: data.name,
      sku: data.sku,
      price: price,
      company_id: warehouse.company_id
    });

    // Create or update inventory (prevent duplicates)
    let inventory = await Inventory.findOne({
      product_id: product._id,
      warehouse_id: data.warehouse_id
    });

    if (inventory) {
      inventory.quantity += quantity;
      await inventory.save();
    } else {
      inventory = await Inventory.create({
        product_id: product._id,
        warehouse_id: data.warehouse_id,
        quantity: quantity
      });
    }

    // Log inventory change
    await InventoryLog.create({
      product_id: product._id,
      warehouse_id: data.warehouse_id,
      change: quantity,
      reason: "initial_stock"
    });

    // Return response
    return res.status(201).json({
      message: "Product created successfully",
      product_id: product._id
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
};