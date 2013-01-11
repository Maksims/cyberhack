var camPos = document.getElementById('cameraPosition');
var areaPos = document.getElementById('areaPosition');

var canvas = document.getElementById('realtime');
var ctx = canvas.getContext('2d');

var ar = Math.PI / 180;

var camera = new Camera(100, 0);

var socket = io.connect();

socket.on('connect', function() {
  console.log('connected');

  socket.on('requireLogin', function(data) {
    socket.emit('login', {
      email: 'guest',
      pass: ''
    });
  });

  socket.on('init', function(data) {
    console.log(data.user)
    if (!world) {
      world = new World(data.world.width, data.world.height, data.world.areaWidth, data.world.areaHeight);

      for(var i = 0, len = 100; i < len; ++i) {
        new Line(++counter, Math.random() * world.fullWidth, Math.random() * world.fullHeight, Math.random() * world.fullWidth, Math.random() * world.fullHeight);
      }
    }
  });

  socket.emit('init');
});