// Array.prototype.shift = function(a, b) {
//   if (a != b) {
//     if (b > a) {
//       var temp = this[a];
//       for(var i = a; i < b; ++i) {
//         this[i] = this[i + 1];
//       }
//       this[b] = temp;
//     } else {
//       var temp = this[a];
//       for(var i = a; i > b; --i) {
//         this[i] = this[i - 1];
//       }
//       this[b] = temp;
//     }
//   }
// }

// shuffle = function(o){
//   for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//   return o;
// };

scripts = [{
  name: 'mootools',
  file: '/js/mootools-core-1.4.5-server.js'
}, {
  name: 'socket.io',
  file: './socket.io/socket.io.js'
}, {
  name: 'world',
  file: '/js/world.js',
  requires: [
    'mootools'
  ]
}, {
  name: 'camera',
  file: '/js/camera.js',
  requires: [
    'mootools'
  ]
}, {
  name: 'primitives',
  file: '/js/primitives.js',
  requires: [
    'mootools',
    'world'
  ]
}, {
  name: 'gamepad',
  file: '/js/gamepad.js',
  requires: [
    'mootools'
  ]
}, {
  name: 'core',
  file: '/js/core.js',
  requires: [
    'mootools',
    'socket.io',
    'camera',
    'world',
    'primitives',
    'gamepad'
  ]
}, {
  name: 'update',
  file: '/js/update.js',
  requires: [
    'core'
  ]
}, {
  name: 'render',
  file: '/js/render.js',
  requires: [
    'core'
  ]
}];

var scriptsTotal = scripts.length;
var scriptsLoaded = 0;

loadScrits();

function loadScrits() {
  if (scriptsTotal == scriptsLoaded) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('game').style.display = 'block';
  } else {
    document.getElementById('loadingProgress').style.width = Math.round(100 / scriptsTotal * scriptsLoaded) + '%';
    for(var i = 0; i < scripts.length; ++i) {
      if (!scripts[i].loaded) {
        var delay = false;
        for(var d = 0; d < scripts.length; ++d) {
          if (scripts[d].loaded != 1 && scripts[i].requires && scripts[i].requires.indexOf(scripts[d].name) != -1) {
            delay = true;
          }
        }
        if (!delay) {
          loadScript(scripts[i], loadScrits);
        }
      }
    }
  }
}
function loadScript(script, callback) {
  if (script.loaded != false) {
    script.loaded = false;
    var element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = script.file;
    element.onload = element.onreadystatechange = function() {
      if (script.loaded == false && (!this.readyState || this.readyState == 'complete')) {
        script.loaded = true;
        ++scriptsLoaded;
        callback.apply(script);
      }
    };
    document.body.appendChild(element);
    document.getElementById('loadingStatus').innerHTML = script.name;
  }
}