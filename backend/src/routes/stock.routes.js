const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  createStockGroup,
  getCompanyStockGroups,
  getStockGroupById,
  updateStockGroup,
  deleteStockGroup,
  searchStockGroups,
  createUnit,
  getCompanyUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  searchUnits,
  createStockItem,
  getCompanyStockItems,
  getStockItemById,
  updateStockItem,
  deleteStockItem,
  searchStockItems,
} = require("../controllers/stock.controller");

router.post("/groups", authMiddleware, createStockGroup);
router.get("/groups/search", authMiddleware, searchStockGroups);
router.get("/groups/company/:companyId", authMiddleware, getCompanyStockGroups);
router.get("/groups/:id", authMiddleware, getStockGroupById);
router.put("/groups/:id", authMiddleware, updateStockGroup);
router.delete("/groups/:id", authMiddleware, deleteStockGroup);

router.post("/units", authMiddleware, createUnit);
router.get("/units/search", authMiddleware, searchUnits);
router.get("/units/company/:companyId", authMiddleware, getCompanyUnits);
router.get("/units/:id", authMiddleware, getUnitById);
router.put("/units/:id", authMiddleware, updateUnit);
router.delete("/units/:id", authMiddleware, deleteUnit);

router.post("/items", authMiddleware, createStockItem);
router.get("/items/search", authMiddleware, searchStockItems);
router.get("/items/company/:companyId", authMiddleware, getCompanyStockItems);
router.get("/items/:id", authMiddleware, getStockItemById);
router.put("/items/:id", authMiddleware, updateStockItem);
router.delete("/items/:id", authMiddleware, deleteStockItem);

module.exports = router;
