const db = require("../config/db");

const createCompany = async (req, res) => {
  try {
    console.log("1 - Request received");
    console.log("User:", req.user);

    const userId = req.user.userId;

    console.log("2 - Checking company count");

    const countResult = await db.query(
      "SELECT COUNT(*) FROM companies WHERE user_id = $1",
      [userId]
    );

    console.log("3 - Company count fetched");

    if (parseInt(countResult.rows[0].count) >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 companies allowed",
      });
    }

    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
      contact_person,
      contact_email,
      contact_phone,
    } = req.body;

    console.log("4 - Inserting company");

    const result = await db.query(
      `INSERT INTO companies
      (
        user_id,
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_person,
        contact_email,
        contact_phone
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        userId,
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_person,
        contact_email,
        contact_phone,
      ]
    );

    console.log("5 - Company inserted successfully");

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: result.rows[0],
    });
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            "SELECT * FROM companies WHERE user_id = $1",
            [userId]
        );

        res.status(200).json({
            success: true,
            companies: result.rows
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.user.userId;

        const result = await db.query(
            `SELECT * FROM companies
             WHERE id = $1 AND user_id = $2`,
            [companyId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            company: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.userId;

    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
      contact_person,
      contact_email,
      contact_phone
    } = req.body;

    const result = await db.query(
      `UPDATE companies
       SET company_name = $1,
           address = $2,
           gst_number = $3,
           financial_year = $4,
           state = $5,
           contact_person = $6,
           contact_email = $7,
           contact_phone = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_person,
        contact_email,
        contact_phone,
        companyId,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: result.rows[0]
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.userId;

    const result = await db.query(
      "DELETE FROM companies WHERE id = $1 AND user_id = $2 RETURNING *",
      [companyId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};