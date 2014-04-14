#!/usr/bin/env node
"use strict";

var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path');

var routes = require('./routes');

// connect to db
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect("mongodb://localhost/fundachile", options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.error(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/add', routes.getAdd);
app.post('/add', routes.add);
app.get('/search', routes.getSearch);
app.post('/remove', routes.remove);
app.get('/getAll', routes.getAll);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
