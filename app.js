var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var messagesRoute = require('./routes/messages');

var app = express();

// Store messages and next ID in memory.
// Should move this to seperate file.
var nextMsgId = 1000;
var messages = [];
app.locals.messages = messages;
app.locals.nextMsgId = () => nextMsgId++;

app.use(logger('dev'));
app.use(bodyParser.text());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/messages', messagesRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.send(err.message);
});

module.exports = app;
