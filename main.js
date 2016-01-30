var mouse = {};
(function(){
  var canvas = document.getElementById("slider");
  var ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 400;

circles = {
  first : {
    rad : 40
  },
  second : {
    rad : 90
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
      mouse.up.checked = true;
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

  function draw(){
    // Clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Origin
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(199,199,2,2);

    // Inner circle
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,circles.first.rad,0,2*Math.PI);
    ctx.stroke();

    // Outer circle
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,circles.second.rad,0,2*Math.PI);
    ctx.stroke();

    // declarations
    var mag, angle, cx, cy;
    if(mouse.down.enabled){
      // Get magnitude from Origin
      mag = Math.sqrt(Math.pow(mouse.down.x - canvas.width/2,2) + Math.pow(mouse.down.y - canvas.height/2,2));
      rad = (mag < circles.first.rad * 1.12 ? circles.first.rad : circles.second.rad);
      // Get angle of mouse relative to Origin
      angle = Math.atan((mouse.move.y-canvas.height/2)/(mouse.move.x-canvas.width/2));
      // Draw a circle in a fixed radius at the calculated angle
      cx = Math.cos(angle) * rad;
      cy = Math.sin(angle) * rad;

      ctx.beginPath();
      ctx.arc((mouse.move.x >= canvas.width/2 ? cx : -1*cx)+canvas.width/2,(mouse.move.x >= canvas.width/2 ? cy : -1*cy)+canvas.height/2,10,0,2*Math.PI);
      ctx.stroke();

      // Draw unaffected circle
      if(rad != circles.first.rad){
        ctx.beginPath();
        ctx.arc(circles.first.x,circles.first.y,10,0,2*Math.PI);
        ctx.stroke();
      }else{
        ctx.beginPath();
        ctx.arc(circles.second.x,circles.second.y,10,0,2*Math.PI);
        ctx.stroke();
      }
    }

    if(!mouse.down.enabled && mouse.up.checked){
      mouse.up.checked = false;
      // Save last change
      angle = Math.atan((mouse.move.y-canvas.height/2)/(mouse.move.x-canvas.width/2));
      // Draw a circle in a fixed radius at the calculated angle
      cx = Math.cos(angle) * rad;
      cy = Math.sin(angle) * rad;

      // Draw affected circle
      ctx.beginPath();
      ctx.arc((mouse.move.x > canvas.width/2 ? cx : -1*cx)+canvas.width/2,(mouse.move.x > canvas.width/2 ? cy : -1*cy)+canvas.height/2,10,0,2*Math.PI);
      ctx.stroke();

      // Save position
      if(rad == circles.first.rad){
        circles.first.x = (mouse.move.x > canvas.width/2 ? cx : -1*cx)+canvas.width/2;
        circles.first.y = (mouse.move.x > canvas.width/2 ? cy : -1*cy)+canvas.height/2;
      } else{
        circles.second.x = (mouse.move.x > canvas.width/2 ? cx : -1*cx)+canvas.width/2;
        circles.second.y = (mouse.move.x > canvas.width/2 ? cy : -1*cy)+canvas.height/2;
      }
    }

    if(!mouse.down.enabled && !mouse.up.checked){
        ctx.beginPath();
        ctx.arc(circles.first.x,circles.first.y,10,0,2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(circles.second.x,circles.second.y,10,0,2*Math.PI);
        ctx.stroke();
    }
  }

  draw();
})();
