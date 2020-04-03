const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const GenreModel = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  }
}));

router.get('/', async (req, res) => {
  const genres = await GenreModel.find().sort('name');
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new GenreModel({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = GenreModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre = await GenreModel.findByIdAndRemove(req.params.id);

  if(!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

router.get('/:id', (req, res) => {
  const genre = GenreModel.findById(req.params.id);

  if(!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

function validateGenre(inputGenre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(inputGenre, schema);
}

module.exports = router;