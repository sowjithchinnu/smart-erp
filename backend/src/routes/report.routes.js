const express=require("express");
const router=express.Router();

const authMiddleware=require("../middlewares/auth.middleware");

const{
getStockSummary,
getLowStockReport,
getDailySales,
getPurchaseRegister
}=require("../controllers/report.controller");

router.get("/stock-summary/:companyId",authMiddleware,getStockSummary);

router.get("/low-stock/:companyId",authMiddleware,getLowStockReport);

router.get("/daily-sales/:companyId",authMiddleware,getDailySales);

router.get("/purchase-register/:companyId",authMiddleware,getPurchaseRegister);

module.exports=router;