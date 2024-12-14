const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const products = require('../db/models/product');
const Wishlist = require('../db/models/wishlist');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('bearer', '').trim();

  if (!token) {
    return res.status(401).json({ message: "No token found. Please login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = { id: decoded.user_id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Add to Wishlist
exports.addToWishlist = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      // Check if the product exists
      const product = await products.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // Find the user's wishlist, if it exists
      let wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        wishlist = new Wishlist({ userId, fav: [] }); // Create a new wishlist if it doesn't exist
      }

      // Check if the product is already in the wishlist
      const existingProduct = wishlist.fav.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        return res.status(400).json({ message: 'Product already in wishlist.' });
      }

      // Add the product to the wishlist
      wishlist.fav.push({ productId, quantity: 1 });
      await wishlist.save();

      return res.status(200).json({ message: 'Product added to wishlist.', wishlist });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
    }
  },
];

// Get Wishlist
exports.getWishlist = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const wishlist = await Wishlist.findOne({ userId }).populate('fav.productId');
      if (!wishlist || wishlist.fav.length === 0) {
        return res.status(200).json({ message: 'Wishlist is empty.', items: [] });
      }

      return res.status(200).json({
        message: 'Wishlist fetched successfully.',
        items: wishlist.fav,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
    }
  },
];

// Remove from Wishlist
exports.removeFromWishlist = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = new mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { fav: { productId } } }, // Remove the product
        { new: true } // Return the updated wishlist
      );

      if (wishlist) {
        return res
          .status(200)
          .json({ message: 'Product removed from wishlist.', wishlist });
      } else {
        return res.status(404).json({ message: 'Wishlist not found.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
    }
  },
];

