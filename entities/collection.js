require('../includes/mootools-core-1.4.5-server');

(function() {

var Collection = this.Collection = new Class({
  initialize: function() {
    this.collection = { };
  }
});

Collection.implement({
  add: function(obj) {
    this.collection[obj.id] = obj;
  },
  remove: function(obj) {
    delete this.collection[obj.id];
  },
  get: function(id) {
    if (this.collection[id] != undefined && this.collection[id]) {
      return this.collection[id];
    } else {
      return null;
    }
  }
});

})();