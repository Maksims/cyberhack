Point = new Class({
  Implements: [ WorldObject ],
  draw: function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.rect(this.x, this.y, 1, 1);
    ctx.fill();
  }
});

Circle = new Class({
  Implements: [ WorldObject ],
  draw: function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
});

Line = new Class({
  Extends: WorldObject,
  initialize: function(worldId, sX, sY, dX, dY) {
    this.parent(worldId, sX, sY);
    this.dX = dX;
    this.dY = dY;
  },
  draw: function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.dX, this.dY);
    ctx.stroke();
  }
});