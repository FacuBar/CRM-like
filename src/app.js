const express = require('express');
const path = require('path');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');

const app = express();

// Parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sanitization against xss and query injenction
app.use(xss());
app.use(mongoSanitize());

// Secure HTTP headers
app.use(helmet());

// Enabling cors
app.use(cors());

// Avoid parameter polution
app.use(
  hpp({
    whitelist: ['page', 'limit', 'search', 'status'],
  })
);

// Setting view template engine -pug-
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`));
});

// Error handling middleware
app.use((err, _, res, _) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', { err });
});

module.exports = app;
