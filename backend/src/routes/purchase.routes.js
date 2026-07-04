const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createPurchaseVoucher, 
  getPurchaseVouchers
} = require("../controllers/purchase.controller");

router.post("/", authMiddleware, createPurchaseVoucher);

router.get(
  "/company/:companyId",
  authMiddleware,
  getPurchaseVouchers
);

module.exports = router;