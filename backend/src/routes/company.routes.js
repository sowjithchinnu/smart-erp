const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    createCompany,
    getCompanies,
    getCompanyById,
    getCompanyDashboard,
    updateCompany,
    deleteCompany
} = require("../controllers/company.controller");

router.get(
    "/",

    (req, res, next) => {
        console.log("1 - Route hit");
        next();
    },

    authMiddleware,

    (req, res, next) => {
        console.log("2 - Middleware passed");
        console.log(req.user);
        next();
    },

    getCompanies
);

router.post("/", authMiddleware, createCompany);

router.get("/:id/dashboard", authMiddleware, getCompanyDashboard);

router.get("/:id", authMiddleware, getCompanyById);

router.put("/:id", authMiddleware, updateCompany);

router.delete("/:id", authMiddleware, deleteCompany);
module.exports = router;