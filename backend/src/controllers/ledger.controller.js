const db = require("../config/db");

const ensureCompanyAccess = async (companyId, userId) => {
  const result = await db.query(
    "SELECT id FROM companies WHERE id = $1 AND user_id = $2",
    [companyId, userId]
  );

  return result.rows.length > 0;
};

const createLedger = async (req, res) => {
  try {
    console.log("1 - Ledger create request received");

    const userId = req.user.userId;
    const {
      company_id,
      ledger_name,
      ledger_type,
      contact_person,
      email,
      phone,
      gst_number,
      address,
      opening_balance,
    } = req.body;

    if (!company_id || !ledger_name || !ledger_type) {
      return res.status(400).json({
        success: false,
        message: "company_id, ledger_name and ledger_type are required",
      });
    }

    const hasAccess = await ensureCompanyAccess(company_id, userId);

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const result = await db.query(
      `INSERT INTO ledgers
      (
        company_id,
        ledger_name,
        ledger_type,
        contact_person,
        email,
        phone,
        gst_number,
        address,
        opening_balance
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        company_id,
        ledger_name,
        ledger_type,
        contact_person,
        email,
        phone,
        gst_number,
        address,
        opening_balance || 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Ledger created successfully",
      ledger: result.rows[0],
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

const getCompanyLedgers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.companyId;

    const hasAccess = await ensureCompanyAccess(companyId, userId);

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const result = await db.query(
      `SELECT * FROM ledgers
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId]
    );

    res.status(200).json({
      success: true,
      ledgers: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getLedgerById = async (req, res) => {
  try {
    const ledgerId = req.params.id;
    const userId = req.user.userId;

    const result = await db.query(
      `SELECT l.*
       FROM ledgers l
       JOIN companies c ON c.id = l.company_id
       WHERE l.id = $1 AND c.user_id = $2`,
      [ledgerId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.status(200).json({
      success: true,
      ledger: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateLedger = async (req, res) => {
  try {
    const ledgerId = req.params.id;
    const userId = req.user.userId;

    const {
      ledger_name,
      ledger_type,
      contact_person,
      email,
      phone,
      gst_number,
      address,
      opening_balance,
    } = req.body;

    const result = await db.query(
      `UPDATE ledgers
       SET ledger_name = $1,
           ledger_type = $2,
           contact_person = $3,
           email = $4,
           phone = $5,
           gst_number = $6,
           address = $7,
           opening_balance = $8
       FROM companies
       WHERE ledgers.id = $9
         AND ledgers.company_id = companies.id
         AND companies.user_id = $10
       RETURNING ledgers.*`,
      [
        ledger_name,
        ledger_type,
        contact_person,
        email,
        phone,
        gst_number,
        address,
        opening_balance,
        ledgerId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger updated successfully",
      ledger: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteLedger = async (req, res) => {
  try {
    const ledgerId = req.params.id;
    const userId = req.user.userId;

    const result = await db.query(
      `DELETE FROM ledgers
       USING companies
       WHERE ledgers.id = $1
         AND ledgers.company_id = companies.id
         AND companies.user_id = $2
       RETURNING ledgers.*`,
      [ledgerId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const searchLedgers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.query.q || req.query.query || "";
    const companyId = req.query.company_id || null;

    let query = `
      SELECT l.*
      FROM ledgers l
      JOIN companies c ON c.id = l.company_id
      WHERE c.user_id = $1
    `;
    const values = [userId];

    if (companyId) {
      query += `AND l.company_id = $2 `;
      values.push(companyId);
    }

    query += `AND (
      l.ledger_name ILIKE $${values.length + 1}
      OR l.ledger_type ILIKE $${values.length + 1}
      OR l.contact_person ILIKE $${values.length + 1}
      OR l.email ILIKE $${values.length + 1}
      OR l.phone ILIKE $${values.length + 1}
      OR l.gst_number ILIKE $${values.length + 1}
      OR l.address ILIKE $${values.length + 1}
    )
    ORDER BY l.created_at DESC`;

    values.push(`%${searchTerm}%`);

    const result = await db.query(query, values);

    res.status(200).json({
      success: true,
      ledgers: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createLedger,
  getCompanyLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger,
  searchLedgers,
};
