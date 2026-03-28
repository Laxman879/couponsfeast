import express from "express";
import Deal from "../../../models/Deal.js";

const router = express.Router();

// GET /api/admin/deals - List all deals
router.get("/", async (req, res) => {
  try {
    const deals = await Deal.find().populate("store", "storeName slug logo websiteUrl").sort({ createdAt: -1 });
    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/deals/create - Create deal
router.post("/create", async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/deals/update/:id - Update deal
router.put("/update/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deal) return res.status(404).json({ success: false, error: "Deal not found" });
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/deals/delete/:id - Delete deal
router.delete("/delete/:id", async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ success: false, error: "Deal not found" });
    res.json({ success: true, message: "Deal deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
