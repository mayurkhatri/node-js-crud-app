const Joi = require('joi');
const mongoose = require('mongoose');

const CustomerModel = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:10
    }
}));

function validateCustomer(inputCustomer) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        phoneNumber: Joi.string().min(3).max(50).required(),
        isPremium: Joi.boolean(),
    };

    return Joi.validate(inputCustomer, schema);
}

exports.CustomerModel = CustomerModel;
exports.validate = validateCustomer;