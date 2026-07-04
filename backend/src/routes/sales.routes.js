const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createSalesVoucher,
  getSalesVouchers,
} = require("../controllers/sales.controller");

router.post("/", authMiddleware, createSalesVoucher);

router.get(
  "/company/:companyId",
  authMiddleware,
  getSalesVouchers
);

module.exports = router;