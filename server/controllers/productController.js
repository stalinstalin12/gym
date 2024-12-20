const products=require('../db/models/product');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const {fileUpload} = require('../utils/file-upload');
const mongoose=require('mongoose');

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
        const product = await products.find({ category: category });

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
exports.blockProduct = async (req, res) => { 
    try { 
        const productId = req.params.id; 
        const updatedProduct = await products.findByIdAndUpdate(productId, { blocked: true }, { new: true }); 
        if (!updatedProduct) { 
            return res.status(404).send({ message: 'Product not found' }); 
        } res.status(200).send({ message: 'Product blocked successfully', data: updatedProduct }); 
    } 
    catch (error) { 
        res.status(500).send({ message: 'Something went wrong', error: error.message }); 
    } 
};





