const mongoose=require('mongoose');
const products= new mongoose.Schema(
    {
        product_images : {
            type : [String]
        },
        title : {
            type : String,
            required : true,
        },
        category : {
            type : String,
            required : true,
        },
        price : {
            type : Number,
            required : true,
        },
        stock : {
            type : Number,
            required : true,
        },
        description : {
            type : String,
        },
        blocked: {
             type: Boolean, default: false 
        },
        userId: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',  
            required: true,
        },
        
    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
    
);

module.exports=mongoose.model("products",products)