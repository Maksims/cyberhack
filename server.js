var express = require('express');
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server, { log: false });

require('./entities/database');

require('./entities/client').init(app, express, io, __dirname + '/client/');
require('./entities/world');

// start

db.on('connect', function() {
  server.listen(8080);
  console.log('start');
});

db.connect();

// temp

// function len(x, y) {
//   return Math.sqrt(x * x + y * y);
// }
// function dist(sX, sY, dX, dY) {
//   return Math.sqrt((sX - dX) * (sX - dX) + (sY - dY) * (sY - dY));
// }
// function norm(x, y) {
//   var l = len(x, y);
//   return { x: x / l, y: y / l };
// }