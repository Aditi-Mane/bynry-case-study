import Inventory from "../../part-2-db-design/models/Inventory.js";
import InventoryLog from "../../part-2-db-design/models/InventoryLog.js";
import ProductSupplier from "../../part-2-db-design/models/ProductSupplier.js";
import Supplier from "../../part-2-db-design/models/Supplier.js";
import Warehouse from "../../part-2-db-design/models/Warehouse.js";

export const getLowStockAlerts = async (req, res) => {
  try {
    // Extract company ID from request params
    const { company_id } = req.params;

    // This array will store all low stock alerts
    const alerts = [];

    // Fetch all warehouses belonging to the company
    const warehouses = await Warehouse.find({ company_id });

    // If no warehouses exist, return empty response
    if (!warehouses.length) {
      return res.json({ alerts: [], total_alerts: 0 });
    }

    // Extract warehouse IDs for further queries
    const warehouseIds = warehouses.map(w => w._id);

    // Fetch inventory entries for these warehouses
    // Populate replaces IDs with actual product and warehouse data
    const inventories = await Inventory.find({
      warehouse_id: { $in: warehouseIds }
    })
      .populate("product_id")
      .populate("warehouse_id");

    // Process each inventory record
    for (let inv of inventories) {
      const product = inv.product_id;
      const warehouse = inv.warehouse_id;

      // Skip if product or warehouse data is missing
      if (!product || !warehouse) continue;

      // Get low stock threshold from product (default to 10 if not set)
      const threshold = product.low_stock_threshold || 10;

      // Define time window for "recent sales" (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Fetch inventory logs representing sales (negative changes)
      const recentSales = await InventoryLog.find({
        product_id: product._id,
        warehouse_id: warehouse._id,
        change: { $lt: 0 }, // negative values represent sales
        created_at: { $gte: sevenDaysAgo }
      });

      // Skip this product if there has been no recent sales activity
      if (recentSales.length === 0) continue;

      // Calculate total units sold in last 7 days
      const totalSold = recentSales.reduce(
        (sum, log) => sum + Math.abs(log.change),
        0
      );

      // Calculate average daily sales
      const avgDailySales = totalSold / 7;

      // Avoid division by zero or meaningless calculations
      if (avgDailySales === 0) continue;

      // Check if current stock is below threshold
      if (inv.quantity < threshold) {

        // Estimate how many days until stock runs out
        const daysUntilStockout = Math.floor(
          inv.quantity / avgDailySales
        );

        // Fetch supplier linked to this product
        const productSupplier = await ProductSupplier.findOne({
          product_id: product._id
        });

        let supplierData = null;

        // If mapping exists, fetch supplier details
        if (productSupplier) {
          const supplier = await Supplier.findById(
            productSupplier.supplier_id
          );

          if (supplier) {
            supplierData = {
              id: supplier._id,
              name: supplier.name,
              contact_email: supplier.contact_email
            };
          }
        }

        // Add this product to alert list
        alerts.push({
          product_id: product._id,
          product_name: product.name,
          sku: product.sku,
          warehouse_id: warehouse._id,
          warehouse_name: warehouse.name,
          current_stock: inv.quantity,
          threshold,
          days_until_stockout: daysUntilStockout,
          supplier: supplierData
        });
      }
    }

    // Return all alerts with total count
    return res.json({
      alerts,
      total_alerts: alerts.length
    });

  } catch (error) {
    
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};