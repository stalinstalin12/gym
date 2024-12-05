


const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const products = require('../db/models/product');
const Cart = require('../db/models/cart');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('bearer', '').trim();
  console.log("token", token);

  if (!token) {
    return res.status(401).json({ message: "No token.. please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = { id: decoded.user_id };
    console.log("Decoded user ID:", req.user.id);
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid or expired token.' });
  }
};

// Add product to cart
exports.addToCart = [authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if the product exists
    const product = await products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart, if it exists
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] }); // Create a new cart if it doesn't exist
    }

    // Check if the product is already in the cart
    const existingProduct = cart.items.find(item => item.productId.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in cart' });
    }

    // Add the product to the cart
    cart.items.push({ productId, quantity: 1 });
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}];

// View cart
exports.getCart = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate('items.productId'); // Populate product info

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: 'Cart is empty', items: [] });
      }

      return res.status(200).json({ message: 'Cart fetched successfully', items: cart.items });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
];

// Delete item from cart
exports.deleteCart = [authenticate,async  (req, res)=> {
  try {
    console.log('Request Params:', req.params);
     console.log('Request User:', req.user);
    const userId = req.user.id; 
    const productId =new mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId
    console.log('User ID:', userId); console.log('Product ID:');
    if (!userId || !productId) {
      const response = error_function({
        statusCode: 400,
        message: "Invalid user or product ID.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Find and update the cart, removing the specified product
    const updatedCart = await Cart.findOneAndUpdate(
      { userId }, // Match the cart for the logged-in user
      { $pull: { items: { productId } } }, // Remove the item with the specified product ID
      { new: true } // Return the updated cart
    );

    if (updatedCart) {
      const response = success_function({
        statusCode: 200,
        message: "Item Removed From Cart",
        data: updatedCart,
      });
      return res.status(response.statusCode).send(response);
    } else {
      const response = error_function({
        statusCode: 400,
        message: "Failed to remove item from cart.",
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    console.error("Error:", error);
    const response = error_function({
      statusCode: 500,
      message: error.message || "An error occurred while removing the item.",
    });
    res.status(response.statusCode).send(response);
  }
}];
