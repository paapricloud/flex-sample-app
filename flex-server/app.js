const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./modules/appError/errorController');
const baseRoutes = require('./routes/baseRoutes');
const fileUpload = require('express-fileupload');


// Start express app
const app = express();


// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors({ origin: '*' }));
app.options('*', cors());


// Set security HTTP headers
app.use(helmet());
app.use(fileUpload())

// Development logging
if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/server/api', limiter);



// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: []
    })
);

//app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log("Requested at:", new Date().toISOString());
    next();
});

// 3) ROUTES
app.use('/server/api/v1/', baseRoutes);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app; 