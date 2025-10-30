const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

/**
 * GET /api/cart
 * Returns all cart items belonging to the authenticated user.
 */
const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cart
 * Adds a product to the cart or updates quantity if it already exists.
 */
const addOrUpdateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    const parsedQuantity = Math.max(1, Number(quantity) || 1);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const filter = { user: req.user.id, product: productId };
    let cartItem = await CartItem.findOne(filter);

    if (cartItem) {
      cartItem.quantity = parsedQuantity;
      cartItem.name = product.name;
      cartItem.price = product.price;
      await cartItem.save();
      return res.json(cartItem);
    }

    cartItem = await CartItem.create({
      user: req.user.id,
      product: productId,
      name: product.name,
      price: product.price,
      quantity: parsedQuantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart/:productId
 * Removes a product from the user's cart.
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const deleted = await CartItem.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/checkout
 * Generates a mock receipt and clears the current cart.
 */
const checkout = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user.id });

    if (!items.length) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items: items.map((item) => ({
        productId: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
    };

    await CartItem.deleteMany({ user: req.user.id });

    res.json(receipt);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
  checkout,
};
