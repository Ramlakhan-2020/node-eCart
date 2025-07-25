const mongoose = require("mongoose");
const validator = require('validator');


const {Schema} = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (url)=> {
                return validator.isURL(url, {protocols: ['http','https','ftp']});
            }
        }
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    }
})

const productModel = mongoose.model("productModel",productSchema);

module.exports ={
    productModel
}