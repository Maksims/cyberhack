require('../includes/mootools-core-1.4.5-server');
var mongo = require('mongodb');
var Db = mongo.Db;

var Database = new Class({
  Implements: [process.EventEmitter],
  initialize: function(host, catalog) {
    this.host = host;
    this.catalog = catalog;
    this.collections = { };
    this.connected = false;
    this.handle = null;
  },
  connect: function() {
    Db.connect('mongodb://' + this.host + '/' + this.catalog, (function(err, database) {
      if (!err) {
        this.connected = true;
        this.handle = database;
        this.emit('connect');
      }
    }).bind(this));
  },
  colAdd: function(name, callback) {
    this.handle.collection(name, (function(err, collection) {
      if (!err) {
        this.collections[name] = collection;
        if (callback) {
          callback.apply(this);
        }
      }
    }).bind(this));
  },
  col: function(name) {
    if (this.collections[name]) {
      return this.collections[name];
    } else {
      return null;
    }
  }
});

(function() {


var ObjectID = this.ObjectID = mongo.ObjectID;
var db = this.db = new Database('localhost', 'cyberhack');


})();