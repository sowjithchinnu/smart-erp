const db = require("../config/db");

// STOCK SUMMARY
const getStockSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await db.query(
      `SELECT id,item_name,sku,quantity,purchase_price,selling_price,gst_percentage
       FROM stock_items
       WHERE company_id=$1
       ORDER BY item_name`,
      [companyId]
    );

    res.json({
      success: true,
      stockSummary: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message:"Internal Server Error"});
  }
};

// LOW STOCK
const getLowStockReport = async (req,res)=>{
    try{

        const {companyId}=req.params;

        const result=await db.query(
            `SELECT *
             FROM stock_items
             WHERE company_id=$1
             AND quantity<10
             ORDER BY quantity ASC`,
             [companyId]
        );

        res.json({
            success:true,
            lowStock:result.rows
        });

    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
};

// DAILY SALES
const getDailySales=async(req,res)=>{
    try{

        const {companyId}=req.params;

        const result=await db.query(
            `SELECT voucher_date,
                    COUNT(*) as total_sales,
                    SUM(total_amount) as revenue
             FROM sales_vouchers
             WHERE company_id=$1
             GROUP BY voucher_date
             ORDER BY voucher_date DESC`,
             [companyId]
        );

        res.json({
            success:true,
            dailySales:result.rows
        });

    }catch(error){
        console.error(error);
        res.status(500).json({success:false});
    }
};

// PURCHASE REGISTER
const getPurchaseRegister=async(req,res)=>{
    try{

        const {companyId}=req.params;

        const result=await db.query(
            `SELECT voucher_number,
                    voucher_date,
                    total_amount
             FROM purchase_vouchers
             WHERE company_id=$1
             ORDER BY voucher_date DESC`,
             [companyId]
        );

        res.json({
            success:true,
            purchaseRegister:result.rows
        });

    }catch(error){
        console.error(error);
        res.status(500).json({success:false});
    }
};

module.exports={
    getStockSummary,
    getLowStockReport,
    getDailySales,
    getPurchaseRegister
};