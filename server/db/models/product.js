const mongoose=require('mongoose');
const products= new mongoose.Schema(
    {
        image : {
            type : String
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
    }
)

module.exports=mongoose.model("products",products)