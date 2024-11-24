'use strict';


module.exports = {
  up: (models, mongoose) => {
    
      return models.user_types.insertMany([
        {
          _id : "6738b6c820495c12314f4c4d",
          user_type : "admin"
        },
        {
          _id : "6738b6d920495c12314f4c4e",
          user_type : 'customer'
        },
        {
          _id : "6738b70b20495c12314f4c4f",
          user_type : 'seller'
        }
       
      ]).then(res => {
     
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
   
    return models.user_types.deleteMany({
      _id: {
        $in: [
          "6738b6c820495c12314f4c4d",
          "6738b6d920495c12314f4c4e",
          "6738b70b20495c12314f4c4f"
        ]
      }
    }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};