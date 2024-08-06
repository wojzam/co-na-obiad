const createError = require('http-errors');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet")
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./db');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

const app = express();

const globalRateLimiter = rateLimit({limit: 100});
const authRateLimiter = rateLimit({max: 10});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(globalRateLimiter);
app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(cors({credentials: true, origin: process.env.FRONETND_URL || "http://localhost:3000"}));

connectDB();

app.use('/', indexRouter);
app.use('/auth', authRateLimiter, authRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;