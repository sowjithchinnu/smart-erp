const db = require("../config/db");
const {
  validateStockGroupPayload,
  validateUnitPayload,
  validateStockItemPayload,
} = require("../validators/stock.validator");

const ensureCompanyAccess = async (companyId, userId) => {
  const result = await db.query(
    "SELECT id FROM companies WHERE id = $1 AND user_id = $2",
    [companyId, userId]
  );

  return result.rows.length > 0;
};

const ensureStockGroupForCompany = async (companyId, stockGroupId) => {
  const result = await db.query(
    "SELECT id FROM stock_groups WHERE id = $1 AND company_id = $2",
    [stockGroupId, companyId]
  );

  return result.rows.length > 0;
};

const ensureUnitForCompany = async (companyId, unitId) => {
  const result = await db.query(
    "SELECT id FROM units_of_measure WHERE id = $1 AND company_id = $2",
    [unitId, companyId]
  );

  return result.rows.length > 0;
};

const createStockGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { company_id, group_name, description } = req.body;

    const validation = validateStockGroupPayload({ group_name });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
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
      `INSERT INTO stock_groups (company_id, group_name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [company_id, group_name.trim(), description || ""]
    );

    res.status(201).json({
      success: true,
      message: "Stock group created successfully",
      stockGroup: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getCompanyStockGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.companyId;

    const hasAccess = await ensureCompanyAccess(companyId, userId);
    if (!hasAccess) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const result = await db.query(
      `SELECT * FROM stock_groups
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId]
    );

    res.status(200).json({ success: true, stockGroups: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getStockGroupById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockGroupId = req.params.id;

    const result = await db.query(
      `SELECT sg.*
       FROM stock_groups sg
       JOIN companies c ON c.id = sg.company_id
       WHERE sg.id = $1 AND c.user_id = $2`,
      [stockGroupId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock group not found" });
    }

    res.status(200).json({ success: true, stockGroup: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateStockGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockGroupId = req.params.id;
    const { group_name, description } = req.body;

    const validation = validateStockGroupPayload({ group_name });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const result = await db.query(
      `UPDATE stock_groups sg
       SET group_name = $1,
           description = $2
       FROM companies c
       WHERE sg.id = $3
         AND sg.company_id = c.id
         AND c.user_id = $4
       RETURNING sg.*`,
      [group_name.trim(), description || "", stockGroupId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Stock group updated successfully",
      stockGroup: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteStockGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockGroupId = req.params.id;

    const existingItems = await db.query(
      `SELECT id FROM stock_items WHERE stock_group_id = $1`,
      [stockGroupId]
    );

    if (existingItems.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete this stock group because stock items are linked to it.",
      });
    }

    const result = await db.query(
      `DELETE FROM stock_groups sg
       USING companies c
       WHERE sg.id = $1
         AND sg.company_id = c.id
         AND c.user_id = $2
       RETURNING sg.*`,
      [stockGroupId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock group not found" });
    }

    res.status(200).json({ success: true, message: "Stock group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchStockGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.query.q || req.query.query || "";
    const companyId = req.query.company_id || null;

    let query = `
      SELECT sg.*
      FROM stock_groups sg
      JOIN companies c ON c.id = sg.company_id
      WHERE c.user_id = $1
    `;
    const values = [userId];

    if (companyId) {
      query += `AND sg.company_id = $2 `;
      values.push(companyId);
    }

    query += `AND (
      sg.group_name ILIKE $${values.length + 1}
      OR sg.description ILIKE $${values.length + 1}
    ) ORDER BY sg.created_at DESC`;

    values.push(`%${searchTerm}%`);

    const result = await db.query(query, values);

    res.status(200).json({ success: true, stockGroups: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createUnit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { company_id, unit_name, symbol } = req.body;

    const validation = validateUnitPayload({ unit_name, symbol });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }

    const hasAccess = await ensureCompanyAccess(company_id, userId);
    if (!hasAccess) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const result = await db.query(
      `INSERT INTO units_of_measure (company_id, unit_name, symbol)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [company_id, unit_name.trim(), symbol.trim()]
    );

    res.status(201).json({ success: true, message: "Unit created successfully", unit: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getCompanyUnits = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.companyId;

    const hasAccess = await ensureCompanyAccess(companyId, userId);
    if (!hasAccess) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const result = await db.query(
      `SELECT * FROM units_of_measure
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId]
    );

    res.status(200).json({ success: true, units: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUnitById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const unitId = req.params.id;

    const result = await db.query(
      `SELECT u.*
       FROM units_of_measure u
       JOIN companies c ON c.id = u.company_id
       WHERE u.id = $1 AND c.user_id = $2`,
      [unitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    res.status(200).json({ success: true, unit: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateUnit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const unitId = req.params.id;
    const { unit_name, symbol } = req.body;

    const validation = validateUnitPayload({ unit_name, symbol });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const result = await db.query(
      `UPDATE units_of_measure u
       SET unit_name = $1,
           symbol = $2
       FROM companies c
       WHERE u.id = $3
         AND u.company_id = c.id
         AND c.user_id = $4
       RETURNING u.*`,
      [unit_name.trim(), symbol.trim(), unitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    res.status(200).json({ success: true, message: "Unit updated successfully", unit: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const unitId = req.params.id;

    const existingItems = await db.query(
      `SELECT id FROM stock_items WHERE unit_id = $1`,
      [unitId]
    );

    if (existingItems.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete this unit because stock items are linked to it.",
      });
    }

    const result = await db.query(
      `DELETE FROM units_of_measure u
       USING companies c
       WHERE u.id = $1
         AND u.company_id = c.id
         AND c.user_id = $2
       RETURNING u.*`,
      [unitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    res.status(200).json({ success: true, message: "Unit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchUnits = async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.query.q || req.query.query || "";
    const companyId = req.query.company_id || null;

    let query = `
      SELECT u.*
      FROM units_of_measure u
      JOIN companies c ON c.id = u.company_id
      WHERE c.user_id = $1
    `;
    const values = [userId];

    if (companyId) {
      query += `AND u.company_id = $2 `;
      values.push(companyId);
    }

    query += `AND (
      u.unit_name ILIKE $${values.length + 1}
      OR u.symbol ILIKE $${values.length + 1}
    ) ORDER BY u.created_at DESC`;

    values.push(`%${searchTerm}%`);

    const result = await db.query(query, values);

    res.status(200).json({ success: true, units: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createStockItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      company_id,
      item_name,
      sku,
      stock_group_id,
      unit_id,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    } = req.body;

    const validation = validateStockItemPayload({
      item_name,
      sku,
      stock_group_id,
      unit_id,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }

    const hasAccess = await ensureCompanyAccess(company_id, userId);
    if (!hasAccess) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const groupBelongsToCompany = await ensureStockGroupForCompany(company_id, stock_group_id);
    const unitBelongsToCompany = await ensureUnitForCompany(company_id, unit_id);

    if (!groupBelongsToCompany || !unitBelongsToCompany) {
      return res.status(400).json({
        success: false,
        message: "Selected stock group or unit is invalid for this company",
      });
    }

    const result = await db.query(
      `INSERT INTO stock_items (
        company_id,
        item_name,
        sku,
        stock_group_id,
        unit_id,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        company_id,
        item_name.trim(),
        sku.trim(),
        stock_group_id,
        unit_id,
        purchase_price || 0,
        selling_price || 0,
        quantity || 0,
        gst_percentage || 0,
      ]
    );

    res.status(201).json({ success: true, message: "Stock item created successfully", stockItem: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getCompanyStockItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.params.companyId;

    const hasAccess = await ensureCompanyAccess(companyId, userId);
    if (!hasAccess) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const result = await db.query(
      `SELECT si.*,
              sg.group_name AS stock_group_name,
              u.unit_name AS unit_name
       FROM stock_items si
       LEFT JOIN stock_groups sg ON sg.id = si.stock_group_id AND sg.company_id = si.company_id
       LEFT JOIN units_of_measure u ON u.id = si.unit_id AND u.company_id = si.company_id
       WHERE si.company_id = $1
       ORDER BY si.created_at DESC`,
      [companyId]
    );

    res.status(200).json({ success: true, stockItems: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getStockItemById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockItemId = req.params.id;

    const result = await db.query(
      `SELECT si.*
       FROM stock_items si
       JOIN companies c ON c.id = si.company_id
       WHERE si.id = $1 AND c.user_id = $2`,
      [stockItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }

    res.status(200).json({ success: true, stockItem: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateStockItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockItemId = req.params.id;
    const {
      item_name,
      sku,
      stock_group_id,
      unit_id,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    } = req.body;

    const validation = validateStockItemPayload({
      item_name,
      sku,
      stock_group_id,
      unit_id,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const result = await db.query(
      `SELECT s.company_id
       FROM stock_items s
       JOIN companies c ON c.id = s.company_id
       WHERE s.id = $1 AND c.user_id = $2`,
      [stockItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }

    const companyId = result.rows[0].company_id;

    const groupBelongsToCompany = await ensureStockGroupForCompany(companyId, stock_group_id);
    const unitBelongsToCompany = await ensureUnitForCompany(companyId, unit_id);

    if (!groupBelongsToCompany || !unitBelongsToCompany) {
      return res.status(400).json({
        success: false,
        message: "Selected stock group or unit is invalid for this company",
      });
    }

    const updatedResult = await db.query(
      `UPDATE stock_items
       SET item_name = $1,
           sku = $2,
           stock_group_id = $3,
           unit_id = $4,
           purchase_price = $5,
           selling_price = $6,
           quantity = $7,
           gst_percentage = $8
       WHERE id = $9
       RETURNING *`,
      [
        item_name.trim(),
        sku.trim(),
        stock_group_id,
        unit_id,
        purchase_price || 0,
        selling_price || 0,
        quantity || 0,
        gst_percentage || 0,
        stockItemId,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Stock item updated successfully",
      stockItem: updatedResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteStockItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stockItemId = req.params.id;

    const result = await db.query(
      `DELETE FROM stock_items si
       USING companies c
       WHERE si.id = $1
         AND si.company_id = c.id
         AND c.user_id = $2
       RETURNING si.*`,
      [stockItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }

    res.status(200).json({ success: true, message: "Stock item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const searchStockItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.query.q || req.query.query || "";
    const companyId = req.query.company_id || null;

    let query = `
      SELECT si.*,
             sg.group_name AS stock_group_name,
             u.unit_name AS unit_name
      FROM stock_items si
      LEFT JOIN stock_groups sg ON sg.id = si.stock_group_id AND sg.company_id = si.company_id
      LEFT JOIN units_of_measure u ON u.id = si.unit_id AND u.company_id = si.company_id
      JOIN companies c ON c.id = si.company_id
      WHERE c.user_id = $1
    `;
    const values = [userId];

    if (companyId) {
      query += `AND si.company_id = $2 `;
      values.push(companyId);
    }

    query += `AND (
      si.item_name ILIKE $${values.length + 1}
      OR si.sku ILIKE $${values.length + 1}
      OR sg.group_name ILIKE $${values.length + 1}
      OR u.unit_name ILIKE $${values.length + 1}
    ) ORDER BY si.created_at DESC`;

    values.push(`%${searchTerm}%`);

    const result = await db.query(query, values);

    res.status(200).json({ success: true, stockItems: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
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
};
