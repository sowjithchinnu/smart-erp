const db = require("./db");

const initializeStockTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS stock_groups (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        group_name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS units_of_measure (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        unit_name VARCHAR(255) NOT NULL,
        symbol VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS stock_items (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL,
        stock_group_id INTEGER REFERENCES stock_groups(id) ON DELETE SET NULL,
        unit_id INTEGER REFERENCES units_of_measure(id) ON DELETE SET NULL,
        purchase_price NUMERIC(12, 2) DEFAULT 0,
        selling_price NUMERIC(12, 2) DEFAULT 0,
        quantity NUMERIC(12, 2) DEFAULT 0,
        gst_percentage NUMERIC(5, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Stock management tables are ready");
  } catch (error) {
    console.error("Stock table initialization failed:", error.message);
  }
};

initializeStockTables();

module.exports = initializeStockTables;
