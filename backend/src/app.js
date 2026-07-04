const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const companyRoutes = require("./routes/company.routes");
const authRoutes = require("./routes/auth.routes");
const ledgerRoutes = require("./routes/ledger.routes");
const stockRoutes = require("./routes/stock.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const salesRoutes = require("./routes/sales.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const reportRoutes = require("./routes/report.routes");
const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SmartERP Backend Running 🚀"
    });
});

module.exports = app;