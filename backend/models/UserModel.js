const mongoose = require('mongoose');
const validator = require('validator');

const {Schema}= mongoose;

const userSchema = new Schema({
    fullName : {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    email : {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) =>
              validator.isStrongPassword(value, {
                minLength: 8,
                maxLength: 15,
              }),
            message:
              "Password must be 8-15 characters long",
          },
      },
})

const userModel = new mongoose.model('userData', userSchema);

module.exports ={
    userModel
}