var gamePad = null;
var gamePadSupported = !!navigator.webkitGetGamepads ||  !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1);

var GamePad = new Class({
  initialize: function(handle) {
    this.handle = handle;

    this.stickAX = 0;
    this.stickAY = 0;
    this.stickBX = 0;
    this.stickBY = 0;

    this.select = false;

    this.up    = false;
    this.right = false;
    this.down  = false;
    this.left  = false;

    this.shoulderLeftTop    = false;
    this.shoulderLeftBottom = 0;

    this.shoulderRightTop    = false;
    this.shoulderRightBottom = 0;

    this.update();
  },
  update: function() {
    var min = .19;

    this.stickAX = Math.round(this.handle.axes[0] * 100) / 100;
    if (Math.abs(this.stickAX) < min) {
      this.stickAX = 0;
    }

    this.stickAY = Math.round(this.handle.axes[1] * 100) / 100;
    if (Math.abs(this.stickAY) < min) {
      this.stickAY = 0;
    }

    this.stickBX = Math.round(this.handle.axes[2] * 100) / 100;
    if (Math.abs(this.stickBX) < min) {
      this.stickBX = 0;
    }

    this.stickBY = Math.round(this.handle.axes[3] * 100) / 100;
    if (Math.abs(this.stickBY) < min) {
      this.stickBY = 0;
    }

    this.select = this.handle.buttons[8] == 1;

    this.up    = this.handle.buttons[12] == 1;
    this.right = this.handle.buttons[15] == 1;
    this.down  = this.handle.buttons[13] == 1;
    this.left  = this.handle.buttons[14] == 1;

    this.shoulderLeftTop    = this.handle.buttons[4] == 1;
    this.shoulderLeftBottom = Math.round(this.handle.buttons[6] * 100) / 100;
    if (Math.abs(this.shoulderLeftBottom) < min) {
      this.shoulderLeftBottom = 0;
    }

    this.shoulderRightTop    = this.handle.buttons[5] == 1;
    this.shoulderRightBottom = Math.round(this.handle.buttons[7] * 100) / 100;
    if (Math.abs(this.shoulderRightBottom) < min) {
      this.shoulderRightBottom = 0;
    }
  }
});

function gamePadUpdate() {
  if (gamePadSupported) {
    if (navigator.webkitGetGamepads) {
      var data = navigator.webkitGetGamepads()[0];
      if (data) {
        if (!gamePad) {
          gamePad = new GamePad(data);
        } else {
          gamePad.update();
        }
      }
    }
  }
}