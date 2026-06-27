const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const companyRoutes = require("./routes/company.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SmartERP Backend Running 🚀"
    });
});

module.exports = app;