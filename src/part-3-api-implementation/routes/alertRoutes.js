import express from "express";
import { getLowStockAlerts } from "../controllers/alertController.js";

const router = express.Router();

router.get("/:company_id/alerts/low-stock", getLowStockAlerts);

export default router;