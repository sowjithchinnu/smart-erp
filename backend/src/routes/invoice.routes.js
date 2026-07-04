const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  getSalesInvoice,
  downloadSalesInvoice
} = require("../controllers/invoice.controller");

router.get(
  "/sales/:id",
  authMiddleware,
  getSalesInvoice
);

router.get(
  "/sales/:id/pdf",
  authMiddleware,
  downloadSalesInvoice
);

module.exports = router;