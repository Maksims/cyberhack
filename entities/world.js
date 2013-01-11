var events = require('events');
require('../includes/mootools-core-1.4.5-server');

// world is 64 x 64 = 4096 areas size
// each area is 1024 x 1024 pixels size

//   with FullHD resolution and zoom 2
//   it is about 68 screens wide and 121
//   screens tall

(function() {

var World = this.World = {
  areas: [ ],
  width: 64,
  height: 64,
  areaWidth: 1024,
  areaHeight: 1024,
  fullWidth: this.width * this.areaWidth,
  fullHeight: this.height * this.areaHeight,
  getArea: function(x, y) {
    if (x >= 0 && x < fullWidth && y >= 0 && y < fullHeight) {
      return this.areas[Math.floor(x / this.areaWidth) + Math.floor(y / this.areaHeight) * this.width];
    } else {
      return null;
    }
  },
  getAreaByInd: function(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.areas[x + y * this.width];
    } else {
      return null;
    }
  }
}

var Area = this.Area = new Class({
  initialize: function(world, x, y) {
    this.world = world;
    this.neighbours = [ ];
    this.x = x;
    this.y = y;
    this.objects = { };
  },
  add: function(obj) {
    this.objects[obj.worldId] = obj;
  },
  remove: function(obj) {
    delete this.objects[obj.worldId];
  }
});

// initialize world
for(var y = 0; y < World.height; ++y) {
  for(var x = 0; x < World.width; ++x) {
    World.areas[x + y * World.width] = new Area(this, x, y);
  }
}


// find neighbours
for(var a in World.areas) {
  var area = World.areas[a];
  for(var y = area.y - 1, lenY = area.y + 1; y <= lenY; ++y) {
    for(var x = area.x - 1, lenX = area.x + 1; x <= lenX; ++x) {
      if (y >= 0 && y < World.height && x >= 0 && x < World.width) {
        area.neighbours[(x - (area.x - 1)) + (y - (area.y - 1)) * 3] = World.getAreaByInd(x, y);
      }
    }
  }
}


var worldObjects = 0;

var WorldObject = this.WorldObject = new Class({
  initialize: function(x, y) {
    this.worldId = ++worldObjects;
    this.x = x;
    this.y = y;
    this.area = World.getArea(this.x, this.y);
    this.area.add(this);
  },
  remove: function() {
    this.area.remove(this);
    this.area = null;
  },
  setX: function(x) {
    if (Math.floor(this.x / World.areaWidth) != Math.floor(x / World.areaWidth)) {
      this.area.remove(this);
      this.area = World.getArea(x, this.y);
      this.area.add(this);
    }
    this.x = x;
  },
  setY: function(y) {
    if (Math.floor(this.y / World.areaHeight) != Math.floor(y / World.areaHeight)) {
      this.area.remove(this);
      this.area = World.getArea(this.x, y);
      this.area.add(this);
    }
    this.y = y;
  },
  setXY: function(x, y) {
    if (Math.floor(this.x / World.areaWidth) != Math.floor(x / World.areaWidth) || Math.floor(this.y / World.areaHeight) != Math.floor(y / World.areaHeight)) {
      this.area.remove(this);
      this.area = World.getArea(x, y);
      this.area.add(this);
    }
    this.x = x;
    this.y = y;
  }
});

})();