Camera = new Class({
  initialize: function(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.zoom = 1;
    this.angle = 0;
  },
  draw: function(ctx, width, height) {
    this.x = Math.floor(this.x * 100) / 100;
    this.y = Math.floor(this.y * 100) / 100;

    this.zoom = Math.min(Math.max(Math.floor(this.zoom * 10000) / 10000, .01), 4);

    if (this.angle < 0) {
      this.angle += Math.ceil(Math.abs(this.angle) / 360) * 360;
    }
    this.angle = Math.floor((this.angle % 360) * 10) / 10;

    ctx.translate(Math.floor(width / 2), Math.floor(height / 2));
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.angle * ar);
    ctx.translate(-this.x, -this.y);
  },
  move: function(x, y) {
    var dist = Math.sqrt(x * x + y * y);
    var angle = 180 - Math.atan2(x, y) / ar - this.angle;

    x = Math.sin(angle * ar) * dist;
    y = -Math.cos(angle * ar) * dist;

    this.x += x;
    this.y += y;
  }
});