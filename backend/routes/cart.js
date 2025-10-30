const express = require('express');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
	getCart,
	addOrUpdateCartItem,
	removeCartItem,
	checkout,
} = require('../controllers/cartController');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addOrUpdateCartItem);
router.delete('/:productId', removeCartItem);
router.post('/checkout', checkout);

module.exports = router;
