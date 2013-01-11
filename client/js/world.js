var counter = 0;
var world = null;

var World = new Class({
  initialize: function(width, height, areaWidth, areaHeight) {
    this.width  = width;
    this.height = height;

    this.areaWidth  = areaWidth;
    this.areaHeight = areaHeight;

    this.fullWidth  = this.width  * this.areaWidth;
    this.fullHeight = this.height * this.areaHeight;

    this.objects = { };
  },
  add: function(obj) {
    this.objects[obj.worldId] = obj;
  },
  remove: function(obj) {
    delete this.objects[obj.worldId];
  }
})

WorldObject = new Class({
  initialize: function(worldId, x, y) {
    this.worldId = worldId;
    this.x = x;
    this.y = y;
    if (world) {
      world.add(this);
    }
  },
  remove: function() {
    if (world) {
      world.remove(this);
    }
  }
});