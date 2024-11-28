const mongoose=require ('mongoose');

const Cart=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products', 
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
          },
        },
      ],
});
module.exports = mongoose.model("Cart", Cart);