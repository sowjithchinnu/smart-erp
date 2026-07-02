const validateRequiredString = (value, fieldName, errors) => {
  if (!value || !String(value).trim()) {
    errors[fieldName] = `${fieldName.replace(/_/g, " ")} is required.`;
  }
};

const validateNumericField = (value, fieldName, errors, allowZero = true) => {
  if (value === undefined || value === null || value === "") {
    if (!allowZero) {
      errors[fieldName] = `${fieldName.replace(/_/g, " ")} is required.`;
    }
    return;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    errors[fieldName] = `${fieldName.replace(/_/g, " ")} must be a number.`;
  }
};

const validateStockGroupPayload = (payload = {}) => {
  const errors = {};

  validateRequiredString(payload.group_name, "group_name", errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUnitPayload = (payload = {}) => {
  const errors = {};

  validateRequiredString(payload.unit_name, "unit_name", errors);
  validateRequiredString(payload.symbol, "symbol", errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateStockItemPayload = (payload = {}) => {
  const errors = {};

  validateRequiredString(payload.item_name, "item_name", errors);
  validateRequiredString(payload.sku, "sku", errors);

  if (!payload.stock_group_id) {
    errors.stock_group_id = "Stock group is required.";
  }

  if (!payload.unit_id) {
    errors.unit_id = "Unit is required.";
  }

  validateNumericField(payload.purchase_price, "purchase_price", errors);
  validateNumericField(payload.selling_price, "selling_price", errors);
  validateNumericField(payload.quantity, "quantity", errors);
  validateNumericField(payload.gst_percentage, "gst_percentage", errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateStockGroupPayload,
  validateUnitPayload,
  validateStockItemPayload,
};
