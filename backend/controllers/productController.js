const Product = require('../models/Product');

/**
 * GET /api/products
 * Fetches all products from the catalog.
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
};
