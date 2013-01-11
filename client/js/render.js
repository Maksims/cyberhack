var fps = 60;
setInterval(function() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  camera.draw(ctx, canvas.width, canvas.height);

  if (world) {
    // clusters
    if (camera.x >= 0 && camera.x < world.fullWidth && camera.y >= 0 && camera.y < world.fullHeight) {
      var areaX = Math.floor(camera.x / world.areaWidth);
      var areaY = Math.floor(camera.y / world.areaHeight);

      ctx.strokeStyle = '#356';
      ctx.lineWidth = 2 / camera.zoom;
      ctx.beginPath();

      for(var sY = Math.max(areaY - 1, 0), lenY = Math.min(areaY + 2, world.height - 1); sY <= lenY; ++sY) {
        ctx.moveTo(Math.max(areaX - 1, 0) * world.areaWidth, sY * world.areaHeight);
        ctx.lineTo(Math.min(areaX + 2, world.width) * world.areaWidth, sY * world.areaHeight);
      }

      for(var sX = Math.max(areaX - 1, 0), lenX = Math.min(areaX + 2, world.width - 1); sX <= lenX; ++sX) {
        ctx.moveTo(sX * world.areaWidth, Math.max(areaY - 1, 0) * world.areaHeight);
        ctx.lineTo(sX * world.areaWidth, Math.min(areaY + 2, world.height) * world.areaHeight);
      }

      ctx.stroke();
    }

    // world borders
    ctx.strokeStyle = '#356';
    ctx.lineWidth = 4 / camera.zoom;
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(0, world.fullHeight);
    ctx.lineTo(world.fullWidth, world.fullHeight);
    ctx.lineTo(world.fullWidth, 0);
    ctx.lineTo(0, 0);

    ctx.stroke();

    // draw objects
    ctx.lineWidth = 1;
    for(var i in world.objects) {
      if (world.objects[i].draw) {
        world.objects[i].draw(ctx);
      }
    }
  }
}, 1000 / fps);