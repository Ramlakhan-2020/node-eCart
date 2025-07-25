const mongoose = require('mongoose');

const {Schema} = mongoose;

const cartSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'userData', // same name used when defining userModel
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'productModel',
          required: true
        },
        productName: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ]
  });

  const cartModel = new mongoose.model('cartData',cartSchema);

  module.exports ={
    cartModel
  }
  

