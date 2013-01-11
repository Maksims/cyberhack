var events = require('events');
var moo = require('../includes/mootools-core-1.4.5-server.js');

// world is 4 x 4 = 16 sectors size,
//   which is 16 x 16 clusters size,
//   which is 64 x 64 areas size,
//   which is 65536 x 65536 pixels size
//   with FullHD resolution and zoom 2 it is about 68 screens wide and 121 screens height

(function() {

var World = this.World = {
  sectors: [ ],
  getSector: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.sectors[Math.floor(x / 16384) + Math.floor(y / 16384) * 4];
    } else {
      return null;
    }
  },
  getCluster: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.sectors[Math.floor(x / 16384) + Math.floor(y / 16384) * 4].getCluster(x, y);
    } else {
      return null;
    }
  },
  getArea: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.sectors[Math.floor(x / 16384) + Math.floor(y / 16384) * 4].getArea(x, y);
    } else {
      return null;
    }
  },
  getAreaByInd: function(x, y) {
    if (x >= 0 && x < 64 && y >= 0 && y < 64) {
      return this.sectors[Math.floor(x / 16) + Math.floor(y / 16) * 4].getAreaByInd(x, y);
    } else {
      return null;
    }
  }
}

var Sector = this.Sector = new Class({
  initialize: function(world, x, y) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.clusters = [ ];
    for(var y = 0; y < 4; ++y) {
      for(var x = 0; x < 4; ++x) {
        this.clusters[x + y * 4] = new Cluster(this, x + this.x * 4, y + this.y * 4);
      }
    }
  },
  getCluster: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.clusters[(Math.floor(x / 4096) - (this.x * 4)) + (Math.floor(y / 4096) - (this.y * 4)) * 4];
    } else {
      return null;
    }
  },
  getArea: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.clusters[(Math.floor(x / 4096) - (this.x * 4)) + (Math.floor(y / 4096) - (this.y * 4)) * 4].getArea(x, y);
    } else {
      return null;
    }
  },
  getAreaByInd: function(x, y) {
    if (x >= 0 && x < 64 && y >= 0 && y < 64) {
      return this.clusters[(Math.floor(x / 4) - (this.x * 4)) + (Math.floor(y / 4) - (this.y * 4)) * 4].getAreaByInd(x, y);
    } else {
      return null;
    }
  }
});

var Cluster = this.Cluster = new Class({
  initialize: function(sector, x, y) {
    this.sector = sector;
    this.x = x;
    this.y = y;
    this.areas = [ ];
    for(var y = 0; y < 4; ++y) {
      for(var x = 0; x < 4; ++x) {
        this.areas[x + y * 4] = new Area(this, x + this.x * 4, y + this.y * 4);
      }
    }
  },
  getArea: function(x, y) {
    if (x >= 0 && x < 65536 && y >= 0 && y < 65536) {
      return this.areas[(Math.floor(x / 1024) - (this.x * 4)) + (Math.floor(y / 1024) - (this.y * 4)) * 4];
    } else {
      return null;
    }
  },
  getAreaByInd: function(x, y) {
    if (x >= 0 && x < 64 && y >= 0 && y < 64) {
      return this.areas[(x - (this.x * 4)) + (y - (this.y * 4)) * 4];
    } else {
      return null;
    }
  }
});

var Area = this.Area = new Class({
  initialize: function(cluster, x, y) {
    this.cluster = cluster;
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
for(var y = 0; y < 4; ++y) {
  for(var x = 0; x < 4; ++x) {
    World.sectors[x + y * 4] = new Sector(this, x, y);
  }
}

for(var s in World.sectors) {
  var sector = World.sectors[s];
  for(var c in sector.clusters) {
    var cluster = sector.clusters[c];
    for(var a in cluster.areas) {
      var area = cluster.areas[a];
      for(var y = area.y - 1, lenY = area.y + 1; y <= lenY; ++y) {
        for(var x = area.x - 1, lenX = area.x + 1; x <= lenX; ++x) {
          if (y >= 0 && y < 64 && x >= 0 && x < 64) {
            area.neighbours[(x - (area.x - 1)) + (y - (area.y - 1)) * 3] = World.getAreaByInd(x, y);
          }
        }
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
    if (Math.floor(this.x / 1024) != Math.floor(x / 1024)) {
      this.area.remove(this);
      this.area = World.getArea(x, this.y);
      this.area.add(this);
    }
    this.x = x;
  },
  setY: function(y) {
    if (Math.floor(this.y / 1024) != Math.floor(y / 1024)) {
      this.area.remove(this);
      this.area = World.getArea(this.x, y);
      this.area.add(this);
    }
    this.y = y;
  },
  setXY: function(x, y) {
    if (Math.floor(this.y / 1024) != Math.floor(y / 1024) || Math.floor(this.x / 1024) != Math.floor(x / 1024)) {
      this.area.remove(this);
      this.area = World.getArea(x, y);
      this.area.add(this);
    }
    this.x = x;
    this.y = y;
  }
});

})();