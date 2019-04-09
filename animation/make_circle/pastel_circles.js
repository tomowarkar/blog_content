//https://www.colordic.org/p/
//https://qiita.com/_shimizu/items/eb6834f255d76b1ed8cf
//https://h3manth.com/content/html5-canvas-full-screen-and-full-page
//https://ourcodeworld.com/articles/read/49/draw-points-on-a-canvas-with-javascript-html5
var canvas = document.getElementById( 'canvas' );
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

canvas.onclick = function(e) {
  getPosition(e);
};

var pointSize = 100;

function getPosition(event){
     var rect = canvas.getBoundingClientRect();
     var x = event.clientX - rect.left;
     var y = event.clientY - rect.top;

     drawCoordinates(x,y);
}

function drawCoordinates(x,y){
  	var ctx = document.getElementById("canvas").getContext("2d");

    var array = ["#ff7f7f", "#ff7fbf", "#ff7fff", "#bf7fff", "#7f7fff", "#7fbfff", "#7fffff", "#7fffbf", "#7fff7f", "#bfff7f", "#ffff7f", "#ffbf7f"];

  	ctx.fillStyle = array[Math.floor(Math.random() * array.length)];

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}
