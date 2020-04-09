const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const users = require('./routes/users');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var bodyParser = require('body-parser');

require('./config/passport')(passport);

// connect to DB
mongoose.connect("mongodb://localhost/nodejscrudapp")
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB'));

app.use(express.json());

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
// app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))

// Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', users);
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));