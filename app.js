const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const motionAlarm = require('./lib/motion-alarm');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./api/routes/index'); //importing route
routes(app); //register the route

// motionAlarm.arm();


module.exports = app;
