const products=require('../db/models/product');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const fileUpload = require('../utils/file-upload').fileUpload;

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

exports.addProduct = [authenticate , async (req, res)=> {
    try {
        let { title, category, price, image: base64Image, ...otherData } = req.body;

        // Validation checks
        if (!title) {
            return res.status(400).send({
                statusCode: 400,
                message: "Title is required",
            });
        }
        if (!price) {
            return res.status(400).send({
                statusCode: 400,
                message: "Price is required",
            });
        }
        if (!category) {
            return res.status(400).send({
                statusCode: 400,
                message: "Category is required",
            });
        }

        let uploadedImageUrl = null;

        // Image upload logic if base64 string is provided
        if (base64Image) {
            try {
                uploadedImageUrl = await fileUpload(base64Image, 'products');
            } catch (uploadError) {
                console.error("Image upload error:", uploadError);
                return res.status(500).send({
                    statusCode: 500,
                    message: "Error uploading image: " + uploadError.message,
                });
            }
        }

        // Create product object to save
        const productData = {
            title,
            category,
            price,
            image: uploadedImageUrl || null,
            userId: req.user.id,
            ...otherData, // Include any other data from the request body
        };

        // Create new product
        const newProduct = await products.create(productData);

        if (newProduct) {
            return res.status(201).send({
                statusCode: 201,
                message: "Product added successfully",
                data: newProduct,
            });
        } else {
            return res.status(400).send({
                statusCode: 400,
                message: "Product creation failed",
            });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).send({
            statusCode: 500,
            message: error.message || "Something went wrong",
        });
    }
}];

//view products

exports.viewProducts=async function (req,res) {
    try{
        

        let productData=await products.find();
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

//view by category
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



