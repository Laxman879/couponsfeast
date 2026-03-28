import express from "express";
import * as categoryController from "../../../controllers/categoryController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN CATEGORY APIs (4 endpoints)
// ==========================================

// GET /api/admin/categories/list - List categories
router.get("/list", categoryController.getCategories);

// POST /api/admin/categories/create - Create category
router.post("/create", categoryController.createCategory);

// PUT /api/admin/categories/update/:id - Update category
router.put("/update/:id", categoryController.updateCategory);

// DELETE /api/admin/categories/delete/:id - Delete category
router.delete("/delete/:id", categoryController.deleteCategory);

export default router;