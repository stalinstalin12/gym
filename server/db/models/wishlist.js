const mongoose=require ('mongoose');

const wishlist=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    fav: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products', 
            required: true,
          },
        },
      ],
});
module.exports = mongoose.model("wishlist", wishlist);