const { GenreModel, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const genres = await GenreModel.find().sort('name');
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new GenreModel({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre = await GenreModel.findByIdAndRemove(req.params.id);

  if(!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await GenreModel.findById(req.params.id);

  if(!genre) return res.status(404).send('The genre with the given ID was not found');

  res.send(genre);
});

module.exports = router;