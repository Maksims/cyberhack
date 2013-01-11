require('../includes/mootools-core-1.4.5-server');
require('./collection');
require('./database');


(function() {

db.on('connect', function() {
  db.colAdd('users');
});

var SessionsCollection = new Class({
  Implements: Collection,
  add: function(obj) {
    this.collection[obj.sessionID] = obj;
  },
  remove: function(obj) {
    delete this.collection[obj.sessionID];
  }
});

var Sessions = this.Sessions = new SessionsCollection();

var UsersCollection = new Class({
  Implements: Collection,
  get: function(id, callback) {
    if (this.collection[id]) {
      callback(this.collection[id]);
    } else {
      db.col('users').findOne({ _id: new ObjectID(id) }, function(err, dbUser) {
        if (!err) {
          if (dbUser) {
            callback(new User(dbUser._id, dbUser.email, dbUser.name));
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    }
  },
  getByName: function(name, callback) {
    name = name.trim().toLowerCase();
    db.col('users').findOne({ login: name }, (function(err, dbUser) {
      if (!err) {
        if (dbUser) {
          var user = this.collection[dbUser._id];
          if (!user) {
            user = new User(dbUser._id, dbUser.email, dbUser.name);
            this.collection[user.id] = user;
          }
          callback(user);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }).bind(this));
  },
  register: function(data, callback) {
    data.email = data.email.trim().toLowerCase();
    data.name = data.name.trim();
    // hash pass
    db.col('users').findOne({ email: data.email }, (function(err, dbUser) {
      if (!err) {
        if (!dbUser) {
          db.col('users').insert({
            email: data.email,
            pass: data.pass,
            name: data.name,
            login: data.name.toLowerCase()
          }, (function(err, dbUser) {
            if (!err) {
              var user = new User(dbUser[0]._id, dbUser[0].email, dbUser[0].name);
              this.collection[user.id] = user;
              callback(user);
            } else {
              callback(null);
            }
          }).bind(this));
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }).bind(this));
  },
  login: function(data, callback) {
    data.email = data.email.trim().toLowerCase();
    // hash pass
    db.col('users').findOne({ email: data.email, pass: data.pass }, (function(err, dbUser) {
      if (!err) {
        if (dbUser) {
          var user = this.collection[dbUser._id];
          if (!user) {
            user = new User(dbUser._id, dbUser.email, dbUser.name);
            this.collection[user.id] = user;
          }
          callback(user);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }).bind(this));
  }
});

var Users = this.Users = new UsersCollection();

var User = this.User = new Class({
  Implements: [process.EventEmitter],
  initialize: function(id, email, name) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.sessionID = null;
    this.socket = null;

    Users.add(this);
  },
  attach: function(socket) {
    this.sessionID = socket.handshake.sessionID;
    this.socket = socket;

    Sessions.add(this);
  },
  destroy: function() {
    Users.remove(this);

    if (this.sessionID) {
      Sessions.remove(this);
      this.sessionID = null;
    }

    this.socket = null;
    this.emit('destroy');
  }
});

})();