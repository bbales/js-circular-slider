var mouse = {};
(function(){
  var canvas = document.getElementById("slider");
  var ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 400;

  circles = {
    first : {
      rad : 40,
      bg : "#1bc6da",
      fg : "#108646",
      handleRad : 12
    },
    second : {
      rad : 90,
      bg : "#a02db8",
      fg : "#df75a3",
      handleRad : 15
    }
  };

  mouse.down = {
    x : 0,
    y : 0,
    enabled : false,
  };

  mouse.up = {
    x : 0,
    y : 0,
    enabled : false,
    checked : true,
  };

  mouse.move = {
    x : 0,
    y : 0,
    enabled : false,
  };

  mouse.handlers = {
    down : function(e){
      mouse.down.x = e.offsetX;
      mouse.down.y = e.offsetY;
      mouse.up.enabled = false;
      mouse.down.enabled = true;
      mouse.up.checked = false;
    },
    up : function(e){
      mouse.up.x = e.offsetX;
      mouse.up.y = e.offsetY;
      mouse.up.enabled = true;
      mouse.down.enabled = false;
      // mouse.up.checked = false;
    },
    move : function(e){
      mouse.move.x = e.offsetX;
      mouse.move.y = e.offsetY;
    }
  };

  // Handlers
  canvas.addEventListener("mousedown",mouse.handlers.down);
  canvas.addEventListener("mouseup",mouse.handlers.up);
  canvas.addEventListener("mousemove",mouse.handlers.move);

  // Redraw
  canvas.addEventListener("mousemove",draw);
  canvas.addEventListener("mousedown",draw);
  canvas.addEventListener("mouseup",draw);

  var rad;

  ctx.drawCirc = function(x,y,r,stroke,fill){
    this.beginPath();
    this.arc(x,y,r,0,2*Math.PI);

    if(fill !== undefined){
      this.fillStyle = fill;
      this.fill();
    }

    if(stroke !== undefined) this.strokeStyle = stroke;
    this.stroke();
  }

  function draw(){
    // Clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Inner circle
    ctx.lineWidth = 12;
    ctx.drawCirc(canvas.width/2,canvas.height/2,circles.first.rad,circles.first.bg)

    // Outer circle
    ctx.drawCirc(canvas.width/2,canvas.height/2,circles.second.rad,circles.second.bg);

    ctx.lineWidth = 1;

    // declarations
    var mag, angle, cx, cy;

    // Draw moving circle and stationary
    if(mouse.down.enabled){
      // Get magnitude from Origin
      mag = Math.sqrt(Math.pow(mouse.down.x - canvas.width/2,2) + Math.pow(mouse.down.y - canvas.height/2,2));
      rad = (mag < circles.first.rad * 1.12 ? circles.first.rad : circles.second.rad);

      // Get angle of mouse relative to Origin
      angle = Math.atan((mouse.move.y-canvas.height/2)/(mouse.move.x-canvas.width/2));

      // Draw a circle in a fixed radius at the calculated angle
      cx = Math.cos(angle) * rad;
      cy = Math.sin(angle) * rad;

      // Draw the affected circle
      if(rad != circles.first.rad){
        ctx.drawCirc((mouse.move.x >= canvas.width/2 ? cx : -1*cx)+canvas.width/2,(mouse.move.x >= canvas.width/2 ? cy : -1*cy)+canvas.height/2,circles.second.handleRad,circles.second.fg,circles.second.fg);
        ctx.drawCirc(circles.first.x,circles.first.y,circles.first.handleRad,circles.first.fg,circles.first.fg);
      }else{
        ctx.drawCirc((mouse.move.x >= canvas.width/2 ? cx : -1*cx)+canvas.width/2,(mouse.move.x >= canvas.width/2 ? cy : -1*cy)+canvas.height/2,circles.first.handleRad,circles.first.fg,circles.first.fg);
        ctx.drawCirc(circles.second.x,circles.second.y,circles.second.handleRad,circles.second.fg,circles.second.fg);
      }
    }

    // Save circle positions
    if(!mouse.down.enabled && !mouse.up.checked){
      mouse.up.checked = true;
      // Save last change
      angle = Math.atan((mouse.move.y-canvas.height/2)/(mouse.move.x-canvas.width/2));

      // Draw a circle in a fixed radius at the calculated angle
      cx = Math.cos(angle) * rad;
      cy = Math.sin(angle) * rad;

      // Save position
      if(rad == circles.first.rad){
        circles.first.x = (mouse.move.x > canvas.width/2 ? cx : -1*cx)+canvas.width/2;
        circles.first.y = (mouse.move.x > canvas.width/2 ? cy : -1*cy)+canvas.height/2;
      } else{
        circles.second.x = (mouse.move.x > canvas.width/2 ? cx : -1*cx)+canvas.width/2;
        circles.second.y = (mouse.move.x > canvas.width/2 ? cy : -1*cy)+canvas.height/2;
      }
    }

    // Draw stationary circles
    if(!mouse.down.enabled && mouse.up.checked){
        ctx.drawCirc(circles.first.x,circles.first.y,circles.first.handleRad,circles.first.fg,circles.first.fg);
        ctx.drawCirc(circles.second.x,circles.second.y,circles.second.handleRad,circles.second.fg,circles.second.fg);
    }
  }

  draw();
})();
