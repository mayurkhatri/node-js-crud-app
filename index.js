const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const app = express();

mongoose.connect("mongodb://localhost/nodejscrudapp")
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB'));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));