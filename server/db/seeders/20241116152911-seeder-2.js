'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  up: (models, mongoose) => {

      let password = "admin123";
      let salt = bcrypt.genSaltSync(10);
      const hashed_pass = bcrypt.hashSync(password,salt);
    
      return models.users.insertMany([
        {  "name" : "admin",
          "email" : "admin@gmail.com",
          "password" : hashed_pass,
          "user_type" : "674ddd8ada8e8225185e33b6"
          
        }
        
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
   
    return models.users.deleteMany({
      _id: "674ddd8ada8e8225185e33b6"
    }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};

