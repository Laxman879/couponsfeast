import express from "express";
import * as couponController from "../../../controllers/couponController.js";
import { trackGA4APIMiddleware } from "../../../middleware/ga4Analytics.js";

const router = express.Router();

// Add GA4 analytics middleware
router.use(trackGA4APIMiddleware);

// ==========================================
// ADMIN COUPON APIs (5 endpoints)
// ==========================================

// GET /api/admin/coupons/list - List all coupons
router.get("/list", couponController.getCoupons);

// GET /api/admin/coupons/details/:id - Get coupon details
router.get("/details/:id", couponController.getCouponById);

// POST /api/admin/coupons/create - Create new coupon
router.post("/create", couponController.createCoupon);

// PUT /api/admin/coupons/update/:id - Update coupon
router.put("/update/:id", couponController.updateCoupon);

// DELETE /api/admin/coupons/delete/:id - Delete coupon
router.delete("/delete/:id", couponController.deleteCoupon);

export default router;