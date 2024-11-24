const products=require('../db/models/product');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const fileUpload = require('../utils/file-upload').fileUpload;

exports.addProduct=async function (req,res) {

    try{
        let body=req.body;
        let title=req.body.title;
        let category=req.body.category;
        let price=req.body.price;
        let image=null;

        console.log("body",body);

        if(image){
            let image=req.body.image;
        }

        if(!title){
            let response=error_function({
                statusCode:400,
                message:"title is required"
            });
            res.status(response.statusCode).send(response);
            return;
        }
        else if(!price){
            let response=error_function({
                statusCode:400,
                message:"price is required"
            });
            res.status(response.statusCode).send(response);
            return;
        }
        else if(!category){
            let response=error_function({
                statusCode:400,
                message:"category is required"
            });
            res.status(response.statusCode).send(response);
            return;
        }
        
        if(req.body.image){
            
            try{
                image=await fileUpload(req.body.image,'products');
            }
            catch(uploadError){
                let response = error_function({
                    statusCode: 500,
                    message: "Error uploading image: " + uploadError,
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }

        body.image=image||null;
        let newProduct=await products.create(body);

        if(newProduct){
            let response=success_function({
                statusCode:201,
                message:"Product added successfully",
                data:newProduct,
            });
            res.status(response.statusCode).send(response);
            return;
        }
        else{
            let response = error_function({
                statusCode: 400,
                message: "Product creation failed",
            });
            res.status(response.statusCode).send(response);
            return;
        }



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

//get all products

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