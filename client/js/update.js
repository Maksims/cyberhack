var ups = 20;

setInterval(function() {
  camPos.innerHTML = 'camera: ' + camera.x + ', ' + camera.y + ', a: ' + camera.angle + ', z; ' + camera.zoom;

  if (world) {
    var areaX = Math.floor(camera.x / world.areaWidth);
    var areaY = Math.floor(camera.y / world.areaHeight);
    areaPos.innerHTML = 'area: ' + areaX + ', ' + areaY;
  }

  // gamepad
  gamePadUpdate();
  if (gamePad) {
    var nx = gamePad.stickAX;
    var ny = gamePad.stickAY;
    var dist = Math.sqrt(nx * nx + ny * ny);

    if (Math.abs(dist) > 1.0) {
      nx = Math.round(nx / dist * 100) / 100;
      ny = Math.round(ny / dist * 100) / 100;
      dist = 1;
    } else {
      dist = Math.round(dist * 100) / 100;
    }

    var moveSpeed = 20;

    camera.move(nx * moveSpeed / camera.zoom, ny * moveSpeed / camera.zoom);
    if (world) {
      camera.x = Math.max(Math.min(camera.x, world.fullWidth - 1), 0);
      camera.y = Math.max(Math.min(camera.y, world.fullHeight - 1), 0);
    }

    if (gamePad.shoulderLeftTop) {
      camera.zoom -= gamePad.stickBY * .1 * camera.zoom;
    }
    camera.angle -= gamePad.stickBX * 4;

    if (gamePad.select) {
      document.location.reload(true);
    }
  }
}, 1000 / ups);