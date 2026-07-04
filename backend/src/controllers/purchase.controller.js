const db = require("../config/db");

const createPurchaseVoucher = async (req, res) => {
  const client = await db.connect();

  try {
    const {
      company_id,
      supplier_id,
      voucher_date,
      notes,
      items,
    } = req.body;
    const userId = req.user.userId;

    const companyCheck = await client.query(
      `SELECT id FROM companies WHERE id = $1 AND user_id = $2`,
      [company_id, userId]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Validation
    if (
      !company_id ||
      !supplier_id ||
      !voucher_date ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Calculate total amount
    let totalAmount = 0;

    for (const item of items) {
      totalAmount += Number(item.quantity) * Number(item.rate);
    }

    // Start Transaction
    await client.query("BEGIN");

    // Insert Purchase Voucher
    const voucherResult = await client.query(
      `
      INSERT INTO purchase_vouchers
      (
        company_id,
        supplier_id,
        voucher_number,
        voucher_date,
        total_amount,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
      `,
      [
        company_id,
        supplier_id,
        `PUR-${Date.now()}`,
        voucher_date,
        totalAmount,
        notes,
      ]
    );

    const purchaseVoucherId = voucherResult.rows[0].id;

    console.log("Purchase Voucher ID:", purchaseVoucherId);

    // Insert purchase items and update stock

for (const item of items) {

  const amount = Number(item.quantity) * Number(item.rate);

  // Insert into purchase_voucher_items
  await client.query(
    `
    INSERT INTO purchase_voucher_items
    (
      purchase_voucher_id,
      stock_item_id,
      quantity,
      rate,
      amount
    )
    VALUES ($1,$2,$3,$4,$5)
    `,
    [
      purchaseVoucherId,
      item.stock_item_id,
      item.quantity,
      item.rate,
      amount
    ]
  );
  

  // Increase stock quantity
  await client.query(
    `
    UPDATE stock_items
    SET quantity = quantity + $1
    WHERE id = $2
    `,
    [
      item.quantity,
      item.stock_item_id
    ]
  );

}

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Purchase voucher created successfully.",
      purchaseVoucherId,
      totalAmount,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  } finally {
    client.release();
  }
};

const getPurchaseVouchers = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userId = req.user.userId;

    const companyCheck = await db.query(
      `SELECT id FROM companies WHERE id = $1 AND user_id = $2`,
      [companyId, userId]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const result = await db.query(
      `
      SELECT
        pv.id,
        pv.voucher_number,
        pv.voucher_date,
        pv.total_amount,
        pv.notes,
        l.ledger_name AS supplier_name
      FROM purchase_vouchers pv
      JOIN ledgers l
        ON pv.supplier_id = l.id
      WHERE pv.company_id = $1
      ORDER BY pv.created_at DESC
      `,
      [companyId]
    );

    return res.status(200).json({
      success: true,
      purchaseVouchers: result.rows,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createPurchaseVoucher,
  getPurchaseVouchers,
};