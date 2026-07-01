const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
  createLedger,
  getCompanyLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
  searchLedgers,
} = require("../controllers/ledger.controller");

router.post("/", authMiddleware, createLedger);
router.get("/search", authMiddleware, searchLedgers);
router.get("/company/:companyId", authMiddleware, getCompanyLedgers);
router.get("/:id", authMiddleware, getLedgerById);
router.put("/:id", authMiddleware, updateLedger);
router.delete("/:id", authMiddleware, deleteLedger);

module.exports = router;
