let platforms = [];
let leftWall = -500;
let state = 0;


let bg1;
let bg2;
let bg3;
let bg4;
let bg5;
let bg6;

let planet;

let bg1x = 0;
let bg2x = 500;
let bg3x = 0;
let bg4x = 500;
let bg5x = 0;
let bg6x = 500;

let speed1 = 0.1;
let speed2 = 0.3;
let speed3 = 0.5;

let player;

let bodyPallete = [];
let headPallete = [];
let robots = [];
let a = 128;
let interval = 2;


let downArrow, upArrow, leftArrow, rightArrow;
let arrows = [];
let arrowsArr = [];
let arrow;


function preload() {
    bg1 = loadImage("media/sky.png");
    bg2 = loadImage("media/sky.png");
    bg3 = loadImage("media/far-clouds.png");
    bg4 = loadImage("media/far-clouds.png");
    bg5 = loadImage("media/near-clouds.png"); 
    bg6 = loadImage("media/near-clouds.png");

    planet = loadImage("media/planet.png");

    downArrow = loadImage("media/arrow_down.png");
    upArrow = loadImage("media/arrow_up.png");
    leftArrow = loadImage("media/arrow_left.png");
    rightArrow = loadImage("media/arrow_right.png");
  
}

function setup() {
    myCanvas = createCanvas(500, 500);
    myCanvas.parent("game_container");
    planet.resize(500,0);

    bodyPallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
    headPallete = [color('#006d77'), color('#83c5be'), color('#f0f3bd'), color('#ffddd2'), color('#e29578')];

    arrows = [["up", upArrow], ["right", rightArrow], ["down", downArrow], ["left", leftArrow]];

    startArrow = random(arrows);
    arrowsArr.push(new Arrow(64, 50, startArrow));

    player = new Player();
}

function draw() {

  if (state == 0) {
    CloudMode();
  }
  else if (state == 1) {
    SpaceMode();
  }
  else {
    gameEnd();
    }
 

  

   
}

function CloudMode(){
  background(0);
  imageMode(CORNER);

  image(bg1, bg1x, 0);
  image(bg2, bg2x, 0);
  image(bg3, bg3x, 0);
  image(bg4, bg4x, 0);
  image(bg5, bg5x, 0);
  image(bg6, bg6x, 0);

  bg1x -= speed1;
  bg2x -= speed1;
  bg3x -= speed2;
  bg4x -= speed2;
  bg5x -= speed3;
  bg6x -= speed3;

  if (bg1x < leftWall){ 
      bg1x = bg1x + 500;
  }

  if (bg2x < leftWall) {
      bg2x = bg1x + 500;
  }

  if (bg3x < leftWall) {
      bg3x = bg4x + 500;
  }
  
  if (bg4x < leftWall) {
      bg4x = bg3x + 500;
  }

  if (bg5x < leftWall) {
      bg5x = bg6x + 500;
  }

  if (bg6x < leftWall) {
      bg6x = bg5x + 500;
  }

  for(let i = arrowsArr.length - 1; i >= 0; i--){
      arrowsArr[i].display();
      arrowsArr[i].switchFlow();
    }

  if(frameCount % (interval * 30) == 0){
      robots.push(new Robot(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 2));
  }

  for(let i = robots.length - 1; i >= 0; i--){
  robots[i].move();
  robots[i].checkCollision();
  noStroke();
  robots[i].display();
  
  
  if(robots[i].x > width+100 || robots[i].x < -80 || robots[i].y > height || robots[i].y < -50){
      robots.splice(i, 1);
      i = i - 1;
  } 

  }

  player.update();
  player.show();


  if (frameCount % 180 == 0) {
      temp = new Platform(random(width, width + 300), random(height/3, (height/4)*3), random(160,200), 20);
      platforms.push(temp);
  }

  for (let i = 0; i < platforms.length; i++) {
      platforms[i].display();
      platforms[i].move();

      if (platforms[i].x < -400) {
          platforms.splice(i, 1);
      }

      if(player.x > platforms[i].x && player.x < platforms[i].x+platforms[i].width && player.y > platforms[i].y && player.y < platforms[i].y+platforms[i].height){
          console.log("on platform");
          player.velocity = 0;
          player.y = platforms[i].y;
      }

      line(player.x, player.y, platforms[i].x, platforms[i].y);
  }
}

function SpaceMode(){ 
  background(0);
  background(0);
  imageMode(CORNER);

  image(planet, 0, 0);
  player.update();
  player.show();


  for(let i = arrowsArr.length - 1; i >= 0; i--){
    arrowsArr[i].display();
    arrowsArr[i].switchFlow();
    
  }

if(frameCount % (interval * 30) == 0){
    robots.push(new Robot(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 2));
}

for(let i = robots.length - 1; i >= 0; i--){
robots[i].move();
robots[i].checkCollision();
noStroke();
robots[i].display();


if(robots[i].x > width+100 || robots[i].x < -80 || robots[i].y > height || robots[i].y < -50){
    robots.splice(i, 1);
    i = i - 1;
} 

}

player.update();
player.show();


if (frameCount % 180 == 0) {
    temp = new Platform(random(30, width), random(height, height+20), 80, 40);
    platforms.push(temp);
}

for (let i = 0; i < platforms.length; i++) {
    platforms[i].display();


    platforms[i].y -=2.5;
    

    if (platforms[i].y < -100) {
        platforms.splice(i, 1);
    }

    if(player.x > platforms[i].x && player.x < platforms[i].x+platforms[i].width && player.y > platforms[i].y && player.y < platforms[i].y+platforms[i].height){
        console.log("on platform");
        player.velocity = 0;
        player.y = platforms[i].y;
    }

    line(player.x, player.y, platforms[i].x, platforms[i].y);
}


}

function keyPressed() {
    if (key === ' ') {
        player.up();
      }
}

class Player {
    constructor() {
      this.x = 64;
      this.y = height / 2;
      this.gravity = 0.6;
      this.lift = -11;
      this.velocity = 0;
      this.size = 32;
    }
  
    up() {
        if(this.y > 40){
            this.velocity += this.lift;
        }
    }
  
    update() {
      this.velocity += this.gravity;
      this.y += this.velocity;
  
      if (this.y > height) {
        this.y = height;
        this.velocity = 0;
      }
    }
  
    show() {
      fill(255);
      stroke(255, 255, 255, 70);
      strokeWeight(3);
      ellipse(this.x, this.y, this.size, this.size);
    }
  }

function circRect(cx, cy, rad, rx, ry, rw, rh) {
    let testX = cx;
     let testY = cy;
     
     if (cx < rx)         testX = rx;      // test left edge
     else if (cx > rx+rw) testX = rx+rw;   // right edge
     if (cy < ry)         testY = ry;      // top edge
     else if (cy > ry+rh) testY = ry+rh;   // bottom edge
     
     let d = dist(cx, cy, testX, testY);
     
       if (d <= rad) { 
       return true;
     }
     return false;
   
   }

class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w; 
        this.height = h;
        this.red = 23;
        this.green = 120;
        this.blue = 200;
    }

   
    display() {
        // Set the x position of the rectangle based on its horizontal speed and the amount of time that has elapsed
          let xpos = 100 + (100 * cos(millis() / 1000));
        
        // rectMode(CORNER);
        fill(this.red, this.green, this.blue);

        rect(this.x, this.y, this.width, this.height);

        noFill();

        let hit = circRect(player.x, player.y, 32, this.x,this.y,this.width,this.height);
  
        if (hit) {
           this.red = 200;
           this.green = 50; 
           this.blue = 100;
        }
        else {
            this.red = 23;
            this.green = 120;
            this.blue = 200;
        }
        stroke(255, 255, 255, 70);
        strokeWeight(3);
       // rect(xpos - 5, 100 - 5, 50 + 10, 50 + 10);
    }

    move() {
        this.x -= 3;
    }
}

class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
    }
    
    display() {
        fill(255);
        rect(this.x, this.y, this.width, this.height);
    }
}


class Robot {
    constructor(x, y, bodySize, headSize, headColor, bodyColor, speed){
      this.x = x;
      this.y = y;
      this.bodySize = bodySize;
      this.headSize = headSize;
      this.headColor = headColor;
      this.bodyColor = bodyColor;
      this.eyes = random(eyeArray);
      this.Xspeed = speed;
      this.Yspeed = speed;
      this.mouth = random(mouthArr);

      this.xNoiseOffset = random(0,1000);
      this.yNoiseOffset = random(1000,2000);
    }
  
    display() {
        push();
      rectMode(CENTER);
      fill(this.bodyColor);
      rect(this.x, this.y, this.bodySize, this.bodySize);
      fill(this.headColor);
      rect(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize, this.headSize);
      fill(255);
      this.eyes();
      
      this.mouth();
      pop();

    }
  
    move(){
        a = (128 + 128 * sin(millis() / 700));

            let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
            // update our position
            this.x -= this.Xspeed;
            this.y += yMovement;

            this.yNoiseOffset += 0.01;
      }
      checkCollision(){
  
  
      }
  }

  function visor(){
    return rect(this.x, this.y-this.bodySize/2-(this.headSize/3)*2, this.headSize/2, 10);
  }
  
  function twoEyes(){
    rect(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
    rect(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
  }
  
  function glasses(){
    fill(0);
    ellipse(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);
    ellipse(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);
  
    stroke(0);
    strokeWeight(2);
    line(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2);
  }
  
  function mouth(){
    fill(255);
    rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
  }
  
  function mouth1(){
    stroke(255);
    fill(0);
    rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
  }
  
  const mouthArr = [
    mouth,
    mouth1
  ]
  
  
  const eyeArray = [
    visor,
    twoEyes,
    glasses
  ]

  class Arrow {
    constructor(x, y, startArrow){
      this.x = x;
      this.y = y;
      this.dir = startArrow[0];
      this.graphic = startArrow[1];
    }
  
    display(){
      image(this.graphic, this.x, this.y);
    }
  
    switchFlow() {
        let d = dist(player.x, player.y, this.x, this.y);
        line(player.x, player.y, this.x, this.y);
        if(d < 20){
        if(this.dir=="up"){
    // switch to state 1   
          platforms = [];
          player.x = 64;
          player.y = height / 2;
          player.gravity = 0.6;
          player.lift = -11;
          player.velocity = 0;
          player.size = 32;
           state = 1;

          }
          else if(this.dir=="down"){

            state = 2;


          }
          else {
            state = 0;
          }
         
        }
  
     
    }

      
  


    checkClick(testX, testY) {

      if (testX > this.x && testX < this.x+50 && testY > this.y && testY < this.y + 50) {
        return true;
      }
      else {
        return false;
      }
    }
  
    checkPressed(){
         if(this.dir=="up"){
            this.graphic = rightArrow;
            this.dir = "right";
          
          }
          else if(this.dir=="right"){
            this.graphic = downArrow;
            this.dir = "down";
          }
          else if(this.dir=="down"){
            this.graphic = leftArrow;
            this.dir = "left";
          }
          else if(this.dir=="left"){
            this.graphic = upArrow;
            this.dir = "up";
          }
        }
    }
  
  
  function mousePressed() {
    // see if the user is clicking on the button
    for(let i = arrowsArr.length-1; i >=0;i--){
    let clicked = arrowsArr[i].checkClick(mouseX, mouseY);
  
    if (clicked == true) {
      
  
      if(arrowsArr[i].dir=="up"){
        arrowsArr[i].graphic = rightArrow;
        arrowsArr[i].dir = "right";
        state = 1;
      }
      else if(arrowsArr[i].dir=="right"){
        arrowsArr[i].graphic = downArrow;
        arrowsArr[i].dir = "down";
        state = 0;
  
      }
      else if(arrowsArr[i].dir=="down"){
        arrowsArr[i].graphic = leftArrow;
        arrowsArr[i].dir = "left";
  
      }
      else if(arrowsArr[i].dir=="left"){
        arrowsArr[i].graphic = upArrow;
        arrowsArr[i].dir = "up";
  
      }
    }
  }
  }