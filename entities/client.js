var cookie = require('cookie');
require('./user');

(function() {



})();

exports.init = function(app, express, io, dir) {


  // setup

  var sessionStore = new express.session.MemoryStore();
  app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session({
      store: sessionStore,
      secret: 'secret',
      key: 'express.sid'
    }));
    app.use("/css", express.static(dir + 'css/'));
    app.use("/js", express.static(dir + 'js/'));
  });



  // routes

  app.get('/', function(req, res) {
    res.sendfile(dir + '/core.html');
  });

  app.get('/session', function(req, res) {
    res.send({ id: req.sessionID });
  });


  // sockets session restore

  io.set('authorization', function(data, accept) {
    if (data.headers.cookie) {
      data.sessionID = cookie.parse(data.headers.cookie)['express.sid'].split('.')[0].split(':')[1];

      sessionStore.get(data.sessionID, function(err, session) {
        if (err || !session) {
          accept('Error', false);
        } else {
          accept(null, true);
        }
      });
    } else {
      return accept('No cookie transmitted.', false);
    }
  });


  // sockets

  io.sockets.on('connection', function(socket) {
    socket.on('login', function(data) {
      var user = Sessions.get(this.handshake.sessionID);
      if (user) {
        this.emit('init', {
          user: {
            id: user.id, name: user.name
          },
          world: {
            width: World.width,
            height: World.height,
            areaWidth: World.areaWidth,
            areaHeight: World.areaHeight
          }
        });
      } else {
        if (data.email && data.pass) {
          Users.login({
            email: data.email,
            pass: data.pass
          }, (function(user) {
            if (user) {
              user.attach(this);

              this.emit('init', {
                user: {
                  id: user.id, name: user.name
                },
                world: {
                  width: World.width,
                  height: World.height,
                  areaWidth: World.areaWidth,
                  areaHeight: World.areaHeight
                }
              });
            } else {
              // wrong credentials
            }
          }).bind(this));
        } else {
          // credentials are not provided
        }
      }
    });

    socket.on('logout', function() {
      var user = Sessions.get(this.handshake.sessionID);
      if (user) {
        user.destroy();
      }
    });

    socket.on('init', function() {
      var user = Sessions.get(this.handshake.sessionID);
      if (user) {
        this.emit('init', {
          user: {
            id: user.id, name: user.name
          },
          world: {
            width: World.width,
            height: World.height,
            areaWidth: World.areaWidth,
            areaHeight: World.areaHeight
          }
        });
      } else {
        this.emit('requireLogin');
      }
    });
  });
}