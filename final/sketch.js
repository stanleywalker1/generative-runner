let platforms = [];
let leftWall = -500;
let state = 0;

let bg;
let bg1;
let bg2;
let bg3;

let dim1Front = [];
let dim1Middle = [];
let dim1Back = [];

let speed1 = 0.1;
let speed2 = 0.3;
let speed3 = 0.5;

let dim2Front = [];
let dim2Middle = [];
let dim2Back = [];

let nextImg1;
let nextImg2;
let nextImg3;

let player;
let floorY = 450;
let inTransition = false;
let transColor;

let bodyPallete = [];
let headPallete = [];
let robots = [];
let a = 128;
let interval = 2;


let downArrow, upArrow;
let arrows = [];
let arrowsArr = [];
let arrow;


function preload() {

    // FRONT IMAGES
    for (let i = 0; i < 2; i++) {
      dim1Front[i] = loadImage("media/front/dim1/front" + i + ".png");
    }

    for (let i = 0; i < 1; i++) {
      dim2Front[i] = loadImage("media/front/dim2/front" + i + ".png");
    }

    // MIDDLE IMAGES
    for (let i = 0; i < 1; i++) {
      dim1Middle[i] = loadImage("media/middle/dim1/mid" + i + ".png");
    }

    for (let i = 0; i < 1; i++) {
      dim2Middle[i] = loadImage("media/middle/dim2/mid" + i + ".png");
    }

    // BACK IMAGES
    for (let i = 0; i < 1; i++) {
      dim1Back[i] = loadImage("media/back/dim1/back" + i + ".png");
    }

    for (let i = 0; i < 1; i++) {
      dim2Back[i] = loadImage("media/back/dim2/back" + i + ".png");
    }

    downArrow = loadImage("media/arrow_down.png");
    upArrow = loadImage("media/arrow_up.png");
  
}

function setup() {
    myCanvas = createCanvas(500, 500);
    myCanvas.parent("game_container");

    bodyPallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
    headPallete = [color('#006d77'), color('#83c5be'), color('#f0f3bd'), color('#ffddd2'), color('#e29578')];

    arrows = [["up", upArrow], ["down", downArrow]];

    startArrow = random(arrows);
    arrowsArr.push(new Arrow(64, 50, startArrow));

    player = new Player();

    // start at dimension 1
    bg = new Background();
    bg.img1 = dim1Back[floor(random(0, dim1Back.length))];
    bg.img2 = dim1Middle[floor(random(0, dim1Middle.length))];
    bg.img3 = dim1Front[floor(random(0, dim1Front.length))];

}

function draw() {

  if (inTransition == false) {

    if (state == 0) {
      L1Mode();
    }
    else if (state == 1) {
      L2Mode();
    }
  
  }

  else {
    transitionMode();
  }

   
}



function L1Mode() {
  background(0);
  imageMode(CORNER);

  bg.display();
  bg.move();

  for(let i = arrowsArr.length - 1; i >= 0; i--){
      arrowsArr[i].display();
    }

  if(frameCount % (interval * 30) == 0){
     // robots.push(new Robot(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 2));
      robots.push(new SpaceMan(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 2));
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



function L2Mode() { 
  background(0);
  imageMode(CORNER);

  bg.display();
  bg.move();

  for(let i = arrowsArr.length - 1; i >= 0; i--){
    arrowsArr[i].display();
    
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
    this.y = floorY;
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

    if (this.y + this.size/2 > floorY) {
      this.y = floorY - this.size/2;
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

  // function helmet(){
  //   return rect(this.x, this.y-this.bodySize/2-(this.headSize/3)*2, this.headSize/2, 15);
  // }
  
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

  checkClick(testX, testY) {
    if (testX > this.x && testX < this.x+50 && testY > this.y && testY < this.y + 50) {
      return true;
    }
    else {
      return false;
    }
  }
}
  
  
function mousePressed() {
  // see if the user is clicking on the button
  for(let i = arrowsArr.length-1; i >=0;i--){
  let clicked = arrowsArr[i].checkClick(mouseX, mouseY);

    if (clicked == true) {

      if(arrowsArr[i].dir=="up"){
        arrowsArr[i].graphic = downArrow;
        arrowsArr[i].dir = "down";
        getColor("top");
        determineNextBG();
        inTransition = true;
      }
      else if(arrowsArr[i].dir=="down"){
        arrowsArr[i].graphic = upArrow;
        arrowsArr[i].dir = "up";
        getColor("bottom");
        determineNextBG();
        inTransition = true;
      }

    }
  }
}

class Background {
  constructor(img1, img2, img3){    
    this.img1 = img1;
    this.img2 = img2;
    this.img3 = img3;

    this.y = 0;

    this.layer1X1 = 0;
    this.layer1X2 = width;
    this.layer2X1 = 0;
    this.layer2X2 = width;
    this.layer3X1 = 0;
    this.layer3X2 = width;
  }

  display(){
    // parallax background composed of 3 layers
    noStroke();
    imageMode(CORNER);
    image(this.img1, this.layer1X1, this.y);
    image(this.img1, this.layer1X2, this.y);

    image(this.img2, this.layer2X1, this.y);
    image(this.img2, this.layer2X2, this.y);

    image(this.img3, this.layer3X1, this.y);
    image(this.img3, this.layer3X2, this.y);
  }

  move(){

    this.layer1X1 -= speed1;
    this.layer1X2 -= speed1;

    this.layer2X1 -= speed2;
    this.layer2X2 -= speed2;

    this.layer3X1 -= speed3;
    this.layer3X2 -= speed3;

    if (this.layer1X1 < leftWall){
      this.layer1X1 = this.layer1X2 + width;
    }

    if (this.layer1X2 < leftWall){
      this.layer1X2 = this.layer1X1 + width;
    }

    if (this.layer2X1 < leftWall){
      this.layer2X1 = this.layer2X2 + width;
    }

    if (this.layer2X2 < leftWall){
      this.layer2X2 = this.layer2X1 + width;
    }

    if (this.layer3X1 < leftWall){
      this.layer3X1 = this.layer3X2 + width;
    }

    if (this.layer3X2 < leftWall){
      this.layer3X2 = this.layer3X1 + width;
    }

  }

  transition(direction){
    if(direction=="up"){
      if(this.y < height * 2){
        this.y += 10;
      }
    }

    if(direction=="down"){
      if(this.y > height * -2){
        this.y -= 10;
      }
    }
  }

}

function getColor(dr) {
  // get average color of the top of the screen
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for(let i = 0; i < 500; i++){
    if (dr == "top") {
      let c = get(i, 0);
      r += red(c);
      g += green(c);
      b += blue(c);
      count++;
    }

    else if (dr == "bottom") {
      let c = get(i, 450);
      r += red(c);
      g += green(c);
      b += blue(c);
      count++;
    }
  }

  r = r/count;
  g = g/count;
  b = b/count;

  transColor = color(r, g, b);
}

function transitionMode() {

  if (state == 0) {

    let tHeight = bg.y-height;
    noStroke();
    fill(transColor);

    if (tHeight < height){
      rect(0, tHeight, width, height);
      bg.transition("up");
      bg.display();
      image(nextImg1, 0, tHeight - height, width, height);  
      image(nextImg2, 0, tHeight - height, width, height);
      image(nextImg3, 0, tHeight - height, width, height);
      player.show();
    }

    else {
      state = 1;
      bg.y = 0;
      bg.layer1X1 = 0;
      bg.layer1X2 = width;
      bg.layer2X1 = 0;
      bg.layer2X2 = width;
      bg.layer3X1 = 0;
      bg.layer3X2 = width;
      bg.img1 = nextImg1;
      bg.img2 = nextImg2;
      bg.img3 = nextImg3;
      inTransition = false;
    }

  }

  else if (state == 1) {
  
    let tHeight = bg.y+height;
    noStroke();
    fill(transColor);

    if (tHeight > -height){
      rect(0, tHeight, width, height);
      bg.transition("down");
      bg.display();
      image(nextImg1, 0, tHeight + height, width, height);
      image(nextImg2, 0, tHeight + height, width, height);
      image(nextImg3, 0, tHeight + height, width, height);
      player.show();
    }

    else {
      state = 0;
      bg.y = 0;
      bg.layer1X1 = 0;
      bg.layer1X2 = width;
      bg.layer2X1 = 0;
      bg.layer2X2 = width;
      bg.layer3X1 = 0;
      bg.layer3X2 = width;
      bg.img1 = nextImg1;
      bg.img2 = nextImg2;
      bg.img3 = nextImg3;
      inTransition = false;
    }

  }


}

function determineNextBG(){
  if(state==0){
    nextImg1 = dim2Back[floor(random(0, dim2Back.length))];
    nextImg2 = dim2Middle[floor(random(0, dim2Middle.length))];
    nextImg3 = dim2Front[floor(random(0, dim2Front.length))];
  }
  else if(state==1){
    nextImg1 = dim1Back[floor(random(0, dim1Back.length))];
    nextImg2 = dim1Middle[floor(random(0, dim1Middle.length))];
    nextImg3 = dim1Front[floor(random(0, dim1Front.length))];
  }

  class SpaceMan {
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
      fill(255, 255, 255, 90);
      ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize+8, this.headSize+8);
      fill(255);
      rect(this.x, this.y, this.bodySize, this.bodySize, 10);
      fill(this.bodyColor);
     // rect(this.x, this.y, 10, , this.y);
      fill(this.headColor);
      ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize, this.headSize);
      fill(0, 0, 0, 90);
      ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize-2, this.headSize-10);
      
      fill(40);
     // this.eyes();
  //   ellipse(this.x, this.y-this.bodySize/2-(this.headSize/3)*2, 30, 20);
      
     fill(255);
     // this.mouth();
     
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