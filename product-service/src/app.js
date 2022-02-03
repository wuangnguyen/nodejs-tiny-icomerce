const express = require('express');
const config = require('./config/config');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const requestExtractor = require('./middlewares/requestExtractor');
const ApiError = require('./utils/ApiError');
const routesV1 = require('./routes/v1');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.assignCorelationId);
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize({ allowDots: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

//jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(requestExtractor());
// v1 api routes
app.use('/v1', routesV1);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
