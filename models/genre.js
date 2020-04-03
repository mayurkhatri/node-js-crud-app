const Joi = require('joi');
const mongoose = require('mongoose');

const GenreModel = mongoose.model('Genre', new mongoose.Schema({
    name: {
      type: String,
      minlength: 5,
      maxlength: 50,
      required: true
    }
  }));

  function validateGenre(inputGenre) {
    const schema = {
      name: Joi.string().min(3).required()
    };

    return Joi.validate(inputGenre, schema);
  }

exports.GenreModel = GenreModel;
exports.validate = validateGenre;