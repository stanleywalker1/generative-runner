let nameInput, nameButton, greeting, startButton;
var socket;
let playerName;
let state = 0;
let sketchHeight, sketchWidth;
let img, song, test;
let studio, github, info;
let canvas, playerLayer, drawingLayer, pixelLayer;


function preload() {
  img = loadImage('media/agariomush.png');
}


function setup() {
  sketchWidth = document.getElementById("p5").offsetWidth;
  sketchHeight = document.getElementById("p5").offsetHeight;
  canvas = createCanvas(sketchWidth, sketchHeight);
  canvas.parent("p5");
  playerLayer = createGraphics(sketchWidth, sketchHeight);
  drawingLayer = createGraphics(sketchWidth, sketchHeight);
  pixelLayer = createGraphics(sketchWidth, sketchHeight);
  studio = document.getElementById("personalweb");
  github = document.getElementById("github");
  info = document.getElementById("infoContainter");

  startPageLayout();

  // ****** Server Side Communication ******
    // https for running on online server
    // socket = io.connect('https://doodle-sandbox.herokuapp.com');

    //  local host for - you guessed it - running local 
    //  socket = io.connect('localhost:3000');

    // sending server data about current client
    // var data = {
        // x: player.position.x,
        // y: player.position.y,
        // color: player.color,
        // name: player.name

        // delete above, replace with score var
    //  };
    //  socket.emit('start', data);

  }

function draw() {
  
  startPage();


  //  ****** state controller  ******
  // if (state == 0) {
  //   startPage();
  // } else if (state == 1){
  //  gamePlay();
  // } 

  //   ****** adapting for mobile  ******
  // if (window.matchMedia("(max-width: 767px)").matches) {
  //   mobileButton.display();
  //   test.mousePressed(changeBG);
  // } 
}

//  ****** html elements for start page  ******
function startPageLayout(){
  startLayer = createGraphics(sketchWidth, sketchHeight);
  nameInput = createInput().attribute('placeholder', 'Enter a name');;
  nameInput.parent("startElements");
  nameInput.id("input");
  let div = createDiv();
  div.parent('startElements');
  div.style('margin-left', '10px');
  nameButton = createButton('start');
  nameButton.parent(div);
  nameButton.id("start");
  nameButton.mousePressed(nameSent);
}

//  ****** p5 elements for start page ******
function startPage(){
  background(50);
  img.resize(width, height);
  image(img, 0, 0);

  fill(255);
  textSize(40);
  textAlign(CENTER);
  textFont('monospace');
  text('Final Project (working title)', width/2, height*0.4);
}
// when start button is pressed, switch to game state and play song
function nameSent(){
  playerName = nameInput.value();
  state = 1;
  song.play();
  song.loop();
}

function gamePlay(){
  nameInput.remove();
  nameButton.remove();
  studio.remove();
  github.remove();
  info.remove();
  background(0);
}

  function windowResized() {
   sketchWidth = document.getElementById("p5").offsetWidth;
   sketchHeight = document.getElementById("p5").offsetHeight;
   canvas.resize(sketchWidth, sketchHeight);

    //trying to fix buffers on window resize, ignore
    // playerLayer.size(sketchWidth, sketchHeight);
    // drawingLayer.size(sketchWidth, sketchHeight);
    // pixelLayer.size(sketchWidth, sketchHeight);
    // startLayer.size(sketchWidth, sketchHeight);
  
}

// stop space bar from moving the page down
window.onkeydown = function(e) { 
  return !(e.keyCode == 32);
};
