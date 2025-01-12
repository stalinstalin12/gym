const { sendEmail } = require('../utils/send-email'); // Adjust the path as needed
const products = require('../db/models/product'); // Adjust the path as needed
const users = require('../db/models/users'); // Adjust the path as needed
const { productBlockedNotification } = require('../utils/email-templates/bocked');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const {fileUpload} = require('../utils/file-upload');
const mongoose=require('mongoose');
const Order=require("../db/models/orders")

//authentication middleware
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    console.log("Authorization Header:", authorizationHeader);

    // Extract token from header
    const token = authorizationHeader?.replace(/^Bearer\s+/i, '').trim();
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = { id: decoded.user_id }; // Add user ID to the request
        console.log("Decoded User ID:", req.user.id);
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};



//add product

exports.addProduct = [authenticate, async (req, res) => {
    try {
        // Destructure the form data from the request body
        const { title, category, price, stock, description, product_images } = req.body;

        // Validate product_images array
        if (!Array.isArray(product_images) || product_images.length === 0) {
            return res.status(400).json({ message: "product_images must be an array and cannot be empty." });
        }

        // Call the fileUpload function with the array of base64 image strings
        const uploadedImagePaths = await fileUpload(product_images, 'products');

        // Create a new product record in the database with the uploaded image paths
        const product = new products({
            title,
            category,
            price,
            stock,
            description,
            product_images: uploadedImagePaths, // Store the array of image paths
            userId: req.user.id,
        });

        // Save the product to the database
        await product.save();

        // Return a success response with the created product data
        return res.status(201).json({
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            message: "An error occurred while adding the product. Please try again.",
            error: error.message || error
        });
    }
}];


//view products

exports.viewProducts = async function (req, res) {
    try {
        let productData = await products.find({
            $or: [{ blocked: false }, { blocked: null }, { blocked: { $exists: false } }]
        }).populate('userId', 'name');

        if (productData.length === 0) {
            return res.status(404).send({ 
                statusCode: 404, 
                message: "No products found" 
            });
        }

        console.log(productData);

        let response = success_function({
            statusCode: 200,
            data: productData,
            message: "Products fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
    } catch (error) {
        console.error("Error fetching products:", error);

        let response = error_function({
            statusCode: 400,
            message: error.message || "Something went wrong",
        });

        res.status(response.statusCode).send(response);
        return;
    }
};

// Delete product
exports.deleteProduct = [authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Logged-in user's ID
        const { productId } = req.params; // Product ID from request params

        // Find the product to ensure it exists and belongs to the logged-in user
        const product = await products.findOne({ _id: productId, userId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you do not have permission to delete this product.",
            });
        }

        // Delete the product
        await products.findByIdAndDelete(productId);

        return res.status(200).json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: error.message || "An error occurred while deleting the product.",
        });
    }
}];


exports.viewBlockedProducts=async function (req,res) {
    try{
        

        let productData=await products.find({ blocked: true }).populate('userId', 'name');
        console.log(productData);


        let response = success_function({
            statusCode: 200,
            data: productData,
            message: "products fetched successfully",
        });

        res.status(response.statusCode).send(response);
        return;
    }
    catch(error){
        console.log("error : ", error);

        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : "Something went wrong",
        })

        res.status(response.statusCode).send(response);
        return;
    }
    
}

//view single product

exports.viewSingleProduct=async function (req,res) {
    try {
        let id = req.params.id;
        console.log("id : ", id);
    
        let productData = await products.findOne({_id : id});
        console.log("productdata : ", productData);
    
        res.status(200).send(productData);
        return;
    } catch (error) {
        console.log("error : ", error);
        res.status(400).send(error.message ? error.message : error);
    }
}

//view sellers product uploads
exports.viewProductsByUser = [authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const userProducts = await products.find({ userId });

        return res.status(200).json({
            message: userProducts.length
                ? "Products fetched successfully."
                : "No products found for this user.",
            data: userProducts,
        });
    } catch (error) {
        console.error("Error fetching user products:", error);
        return res.status(500).json({
            message: error.message || "An error occurred while fetching products.",
        });
    }
}];


// View products by category
exports.viewProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params; // Extract category from URL
        console.log("Requested category:", category);

        // Fetch products matching the category
        const product = await products.find({ category: category,
            $or: [{ blocked:  false  }, { blocked: { $exists: false } }]
         });

        // Respond with filtered products
        if (product.length > 0) {
            return res.status(200).json({
                message: "Products fetched successfully",
                data: product,
            });
        } else {
            return res.status(404).json({
                message: "No products found in this category",
            });
        }
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({
            message: error.message || "An error occurred while fetching products",
        });
    }
};

//view products uploaded by user for admin
exports.getProductsByUser = async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters
  
    try {
      // Ensure userId is converted to ObjectId
      const product = await products.find({ userId: new  mongoose.Types.ObjectId(userId) });
  
      // Debug log to check fetched products
      console.log('Products fetched:', product);
  
      // Check if products exist for the given user
      if (!product.length) {
        return res.status(404).json({
          success: false,
          message: 'No products found for this user.',
        });
      }
  
      // Return the products
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      // Debug error
      console.error('Error fetching products by userId:', error);
  
      // Handle server errors
      return res.status(500).json({
        success: false,
        message: 'Server Error. Could not fetch products.',
      });
    }
  };

//block product
exports.blockProduct = async function (req, res) {
    try {
      const productId = req.params.id;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).send({ message: 'Please provide a reason for blocking the product' });
      }
  
      // Find and block the product
      const updatedProduct = await products.findByIdAndUpdate(
        productId,
        { blocked: true },
        { new: true }
      );
  
      if (!updatedProduct) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }
  
      // Fetch the seller of the product
      const seller = await users.findById(updatedProduct.userId);

      if (!seller) {
        res.status(404).send({ message: 'Seller not found' });
        return;
      }
  
      // Generate email content
      const emailContent = await productBlockedNotification(
        seller.name, 
        updatedProduct.title, 
       reason, 
        'flex@fitness.com' 
      );
  
      // Send email notification
      const emailSent = await sendEmail(
        seller.email, 
        'Product Blocked Notification', 
        emailContent 
      );
  
      if (!emailSent) {
        res.status(500).send({ message: 'Failed to send email to seller' });
        return;
      }
  
      // Return success response
      res.status(200).send({
        message: 'Product blocked successfully and email sent to the seller',
        data: updatedProduct
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(400).send(error.message ? error.message : 'Something went wrong');
    }
};
//block product
exports.unblockProduct = async function (req, res) {
    try {
      const productId = req.params.id;
      const { reason } = req.body;
      
  
      // Find and block the product
      const updatedProduct = await products.findByIdAndUpdate(
        productId,
        { blocked: false },
        { new: true }
      );
  
      if (!updatedProduct) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }
  
      // Fetch the seller of the product
      const seller = await users.findById(updatedProduct.userId);

      if (!seller) {
        res.status(404).send({ message: 'Seller not found' });
        return;
      }
  
     
  
      // Return success response
      res.status(200).send({
        message: 'Product blocked successfully and email sent to the seller',
        data: updatedProduct
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(400).send(error.message ? error.message : 'Something went wrong');
    }
};

//update product
exports.updateProduct = [authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Logged-in user's ID
        const { productId } = req.params; // Product ID from request params
        const updateData = req.body; // Product data to update from request body

        // Find the product to ensure it exists and belongs to the logged-in user
        const product = await products.findOne({ _id: productId, userId });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you do not have permission to update this product.",
            });
        }

        // Update the product with new details
        const updatedProduct = await products.findByIdAndUpdate(productId, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure schema validations are applied
        });

        return res.status(200).json({
            message: "Product updated successfully.",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: error.message || "An error occurred while updating the product.",
        });
    }
}];


//seller's purchases
exports.getPurchasedProductsBySeller = [
    authenticate,
    async (req, res) => {
        try {
            const sellerId = req.user.id; // Logged-in seller's ID

            // Find all products uploaded by the seller
            const sellerProducts = await products.find({ userId: sellerId });

            if (!sellerProducts.length) {
                return res.status(404).json({
                    message: "No products found for the seller.",
                });
            }

            const productIds = sellerProducts.map((product) => product._id.toString()); // Get product IDs as strings

            // Find orders that include the seller's products
            const orders = await Order.find({
                "products.productId": { $in: productIds }, // Match against product IDs
            })
                .populate("userId", "name email") // Populate buyer details
                .populate("products.productId", "title price"); // Populate product details

            if (!orders.length) {
                return res.status(404).json({
                    message: "No purchases found for the seller's products.",
                });
            }

            // Format the response
            const purchasedProducts = orders.map((order) => ({
                orderId: order._id,
                buyer: order.userId, // Buyer details
                products: order.products
                    .filter((product) =>
                        product.productId && productIds.includes(product.productId._id.toString()) // Compare IDs as strings
                    )
                    .map((product) => ({
                        productId: product.productId._id,
                        title: product.productId.title,
                        price: product.productId.price,
                        quantity: product.quantity,
                    })), // Extract required fields
                total: order.products
                    .filter((product) =>
                        product.productId && productIds.includes(product.productId._id.toString()) // Same check for total calculation
                    )
                    .reduce((sum, product) => sum + product.productId.price * product.quantity, 0), // Calculate total for seller's products
                address: order.address,
                createdAt: order.createdAt,
            }));

            return res.status(200).json({
                message: "Purchased products fetched successfully.",
                data: purchasedProducts,
            });
        } catch (error) {
            console.error("Error fetching purchased products:", error);
            return res.status(500).json({
                message: error.message || "An error occurred while fetching purchased products.",
            });
        }
    },
];



  





