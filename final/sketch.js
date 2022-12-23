// GLOBAL VARIABLES
let platforms = [];
let leftWall = -500;
let state = 0;
let trig;

let bg;
let bg1;
let bg2;
let bg3;
let face;

let dim1Front = [];
let dim1Middle = [];
let dim1Back = [];

let speed1 = 1;
let speed2 = 2;
let speed3 = 3;

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
let animatedRobots = [];
let a = 128;
let b = 128;
let g = 128;
let interval = 2;
let swarm;

let downArrow, upArrow;
let arrowsArr = [];
let arrow;
let arrGr;

let score = 0;
let coin;
let coinArr = [];
let coinAudio;



// GAMEPLAY FUNCTIONS
function preload() {

    // FRONT IMAGES
    for (let i = 0; i < 4; i++) {
      dim1Front[i] = loadImage("media/front/dim1/front" + i + ".png");
    }

    for (let i = 0; i < 6; i++) {
      dim2Front[i] = loadImage("media/front/dim2/front" + i + ".png");
    }

    // MIDDLE IMAGES
    for (let i = 0; i < 7; i++) {
      dim1Middle[i] = loadImage("media/middle/dim1/mid" + i + ".png");
    }

    for (let i = 0; i < 4; i++) {
      dim2Middle[i] = loadImage("media/middle/dim2/mid" + i + ".png");
    }

    // BACK IMAGES
    for (let i = 0; i < 4; i++) {
      dim1Back[i] = loadImage("media/back/dim1/back" + i + ".png");
    }

    for (let i = 0; i < 6; i++) {
      dim2Back[i] = loadImage("media/back/dim2/back" + i + ".png");
    }

    downArrow = loadImage("media/down.png");
    upArrow = loadImage("media/up.png");
    coin = loadImage("media/coin.png");
    face = loadImage("media/face.png");

    coinAudio = loadSound("media/stan_coin.wav");
  
}


function setup() {

    myCanvas = createCanvas(500, 500);
    // myCanvas.style('width', '100%');
    // myCanvas.style('height', '100%');
    myCanvas.parent("game_container");

    swarm = createGraphics(500, 500);
    downArrow.resize(50, 50);
    upArrow.resize(50, 50);

    arrGr = upArrow;

    bodyPallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
    headPallete = [color('#006d77'), color('#83c5be'), color('#f0f3bd'), color('#ffddd2'), color('#e29578')];

    player = new Player();

    // start at dimension 1
    bg = new Background();
    bg.img1 = dim1Back[floor(random(0, dim1Back.length))];
    bg.img2 = dim1Middle[floor(random(0, dim1Middle.length))];
    bg.img3 = dim1Front[floor(random(0, dim1Front.length))];

    for(let i = 20; i >= 0; i--){
      animatedRobots.push(new SpaceMan(random(width+10, width+65), random(height*0.1, height), random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 7.5));
    }

    coin.resize(25, 25);
    face.resize(32, 32);

    coinSpawn = new Coin(random(width+10, width+65), random(height*0.1, height), 1);
  
}


function draw() {

  if (state == 0 || state == 1){

    if (inTransition == false) {
      if (state == 0) {
        L1Mode();
      }
      else if (state == 1) {
        L2Mode();
      }
      swarm.clear();
      L1andL2Mode();
    }

    else {
      transitionMode();
    }

    image(swarm, 0, 0, 500, 500);    
  }

  else if (state == 2) {
    restart();
  }

}


function L1andL2Mode(){

  push();
  stroke(0);
  strokeWeight(2);
  textSize(18);
  text("Score: " + score, 25, 45);
  pop();

  // ARROW PRODUCTION 
  if(frameCount % 360 == 0){
    arrowsArr.push(new Arrow(random(width+10, width+65), random(10, 300), random(1, 3), arrGr));
  }

  for(let i = arrowsArr.length - 1; i >= 0; i--){
    arrowsArr[i].display();

    let d = dist(arrowsArr[i].x, arrowsArr[i].y, player.x, player.y);
    let m = map(d, 20, 200, 3, 0.1);

    if (d < 200){
      stroke(255);
      strokeWeight(m);
    }

    if(arrowsArr[i].x < -80 || arrowsArr[i].y > height || arrowsArr[i].y < -50){
      arrowsArr.splice(i, 1);
      i = i - 1;
    } 

    if (d < 20){  // if the robot is approaching the arrow, swap direction
      arrowsArr.splice(i, 1);
      score++;
      if (state == 0){
        getColor("top");
      }
      else if (state == 1){
        getColor("bottom");
      }
      determineNextBG();
      inTransition = true;
    }

  }

  // COIN PRODUCTION
  if(frameCount % 180 == 0){
  coinArr.push(new Coin(random(width+10, width+65), random(10, 300), 1));
  }

  for(let i = coinArr.length - 1; i >= 0; i--){
    coinArr[i].displayAndMove();
    // coinArr[i].checkCollision();
    noStroke();
    let d = dist(coinArr[i].x, coinArr[i].y, player.x, player.y);
    let m = map(d, 20, 200, 3, 0.1);

     if (d < 200){
      stroke(255);
      strokeWeight(m);
    }

    if (d < 20){  // if the robot is approaching the arrow, swap direction
      coinArr.splice(i, 1);
      coinAudio.play();
      score++;
    }
    
    if(coinArr[i].x > width+100 || coinArr[i].x < -80 || coinArr[i].y > height || coinArr[i].y < -50){
        coinArr.splice(i, 1);
        i = i - 1;
      } 
  }

  // PLATFORM PRODUCTION
  if (frameCount % 240 == 0) {
    temp = new Platform(random(width, width + 300), random(200, 400), random(160,200), 20);
    platforms.push(temp);
  }

  if (platforms.length > 0){
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].display();
      platforms[i].move();

      if (platforms[i].x < -400) {
          platforms.splice(i, 1);
      }

      let floor = (platforms[i].y - player.size/2);  
      if(player.x >= platforms[i].x && player.x <= platforms[i].x+platforms[i].width && player.y>= platforms[i].y-(player.size/2) && player.y <= platforms[i].y+platforms[i].height){
        player.velocity = 0; 
        player.y = floor;
      }  
    }
  }

}


// ON LAND MODE
function L1Mode() {

  background(0);
  imageMode(CORNER);

  bg.display();
  bg.move();

  if(frameCount % 180 == 0){
      robots.push(new Robot(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), random(7, 10)));
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

}


// IN SPACE MODE
function L2Mode() { 

  background(0);
  imageMode(CORNER);

  bg.display();
  bg.move();

  if(frameCount % 180 == 0){
      robots.push(new SpaceMan(width+50, height/2, random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), random(7, 10)));
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

}


function getColor(dr) {

  // get average color of the top of the screen
  let r = 0;
  let g = 0;
  let b = 0;
  for(let i = 0; i < 500; i++){
    if (dr == "top") {
      let c = get(i, 1);
      r += red(c);
      g += green(c);
      b += blue(c);
    }

    else if (dr == "bottom") {
      let c = get(i, 499);
      r += red(c);
      g += green(c);
      b += blue(c);
    }
  }

  r = r/500;
  g = g/500;
  b = b/500;

  transColor = color(r, g, b);

}


function animation(){

  if(animatedRobots.length != 0){
    for(let i = animatedRobots.length-1; i >= 0; i--){
      animatedRobots[i].moveAnimated();
      noStroke();
      animatedRobots[i].displayAnimated();
      if(animatedRobots[i].x < -30 || animatedRobots[i].y > height || animatedRobots[i].y < -30){
        animatedRobots.splice(i, 1);
          i = i - 1;
      }
    }
  } 
  
  else {
    swarm.clear();
  }

}


function transitionMode() {

  player.show();
  animation();

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
    }  
    
    else {
      for(let i = 20; i >= 0; i--){
        animatedRobots.push(new Robot(random(width+10, width+65), random(0, height), random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 7.5));
      }
      
      state = 1;
      arrGr = downArrow;
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
      platforms = [];
      robots = [];
      coinArr = [];
      arrowsArr = [];
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
      for(let i = 20; i >= 0; i--){
        animatedRobots.push(new SpaceMan(random(width+10, width+65), random(0, height), random(40, 50),random(30, 35), random(headPallete), random(bodyPallete), 7.5));
      }

      state = 0;
      arrGr = upArrow
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
      platforms = [];
      robots = [];
      coinArr = [];
      arrowsArr = [];
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

}


function restart(){

  background(0);
  textSize(20);
  fill(255);
  text("Your score: " + score, 180, 200);
  text("Press 'S' key to restart", 150, 300);

  if(keyIsDown(83)){
    score = 0;
    player.y = floorY;
    bg = new Background();
    bg.img1 = dim1Back[floor(random(0, dim1Back.length))];
    bg.img2 = dim1Middle[floor(random(0, dim1Middle.length))];
    bg.img3 = dim1Front[floor(random(0, dim1Front.length))];
    inTransition = false;
    state = 0;
    robots = [];
    platforms = [];
    coinArray = [];
    determineNextBG();
  }

}


// CONTROL HANDLING
function keyPressed() {
  if (key === ' ') {
    player.up();
  }
}


function mousePressed() {
  if (key === ' ') {
    player.up();
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



// CLASSES
class Coin {
  constructor(x, y, speed){
    this.x = x;
    this.y = y;
    this.Xspeed = speed;
    this.Yspeed = speed;
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
  }
  displayAndMove(){
    
    imageMode(CENTER);
    let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    // update our position
    this.x -= this.Xspeed;
    this.y += yMovement;
  
    this.yNoiseOffset += 0.01;
      
    image(coin, this.x, this.y);
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
    this.graphic = face;
  }

  up() {
    this.velocity += this.lift;
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
    imageMode(CENTER);
    image(face, this.x, this.y);
  }
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

      fill(this.red, this.green, this.blue, 70);
      stroke(255, 255, 255, 70); 
      strokeWeight(3);
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

  }

  move() {
      this.x -= 3;
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
    let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    // update our position
    this.x -= this.Xspeed;
    this.y += yMovement;

    this.yNoiseOffset += 0.01;
  }
  displayAnimated() {
    push();
      swarm.rectMode(CENTER);
      swarm.fill(this.bodyColor);
      swarm.rect(this.x, this.y, this.bodySize, this.bodySize);
      swarm.fill(this.headColor);
      swarm.rect(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize, this.headSize);
      swarm.fill(255);
      this.eyes();
      this.mouth();
    pop();

  }
  moveAnimated(){
    let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    this.x -= this.Xspeed;
    this.y += yMovement;

    this.yNoiseOffset += 0.01;
  }

  checkCollision(){
    if (dist(this.x, this.y, player.x, player.y) < 50) {
      state = 2;
    }
  }
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
    a = (128 + 128 * sin(millis() / 700));

    push();
    rectMode(CORNER);
    stroke(170, 0, 0);
    strokeWeight(4);
    line(this.x-2, this.y,this.x+34, this.y-41); 
    stroke(0);
    strokeWeight(1);
    fill(255, 255, 0, a);
    ellipse(this.x+37, this.y-44, 10, 10);
    rectMode(CENTER);
    fill(255, 255, 255, 90);
    ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize+8, this.headSize+8);
    fill(255);
    rect(this.x, this.y, this.bodySize, this.bodySize, 10);
    fill(this.bodyColor);
    fill(this.headColor);
    ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize, this.headSize);
    fill(0, 0, 0, 90);
    ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize-2, this.headSize-10);
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

  displayAnimated() {
    a = (128 + 128 * sin(millis() / 700));

    push();
    swarm.rectMode(CORNER);
    swarm.stroke(170, 0, 0);
    swarm.strokeWeight(4);
    swarm.line(this.x-2, this.y,this.x+34, this.y-41); 
    swarm.stroke(0);
    swarm.strokeWeight(1);
    swarm.fill(255, 255, 0, a);
    swarm.ellipse(this.x+37, this.y-44, 10, 10);
    swarm.rectMode(CENTER);
    swarm.fill(255, 255, 255, 90);
    swarm.ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize+8, this.headSize+8);
    swarm.fill(255);
    swarm.rect(this.x, this.y, this.bodySize, this.bodySize, 10);
    swarm.fill(this.bodyColor);
    swarm.fill(this.headColor);
    swarm.ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize, this.headSize);
    swarm.fill(0, 0, 0, 90);
    swarm.ellipse(this.x, this.y-this.bodySize/2-this.headSize/2, this.headSize-2, this.headSize-10);
    pop();

  }
  moveAnimated(){
    let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    // update our position
    this.x -= this.Xspeed;
    this.y += yMovement;

    this.yNoiseOffset += 0.01;
  }
  checkCollision(){
    if(dist(this.x, this.y, player.x, player.y) < 50){
      state = 2;
    }
  }

}


class Arrow {
  constructor(x, y, speed, graphic){
    this.x = x;
    this.y = y;
    this.graphic = graphic;
    this.Xspeed = speed;
    this.Yspeed = speed;

    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
  }

  display(){
    g = (128 * sin(millis() / 700));
    b = (128 + 128 * sin(millis() / 700));
    let yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1 );
    this.x -= this.Xspeed;
    this.y += yMovement;
    this.yNoiseOffset += 0.01;
    
    push();
    imageMode(CENTER);
    fill(g, 255, b);
    ellipse(this.x, this.y, 54, 54);
    image(this.graphic, this.x, this.y);
    pop();

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


// ENEMY GENERATION
function visor(){
  rect(this.x, this.y-this.bodySize/2-(this.headSize/3)*2, this.headSize/2, 10);
  swarm.rect(this.x, this.y-this.bodySize/2-(this.headSize/3)*2, this.headSize/2, 10);
}

function twoEyes(){
  rect(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
  rect(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
  swarm.rect(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
  swarm.rect(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 6, 10);
}

function glasses(){
  fill(0);
  ellipse(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);
  ellipse(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);

  stroke(0);
  strokeWeight(2);
  line(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2);

  swarm.fill(0);
  swarm.ellipse(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);
  swarm.ellipse(this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, 15, 10);

  swarm.stroke(0);
  swarm.strokeWeight(2);
  swarm.line(this.x-this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2, this.x+this.headSize/4, this.y-this.bodySize/2-(this.headSize/3)*2);
}

function mouth(){
  fill(255);
  rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
  swarm.fill(255);
  swarm.rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
}

function mouth1(){
  stroke(255);
  fill(0);
  rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
  swarm.stroke(255);
  swarm.fill(0);
  swarm.rect(this.x, this.y-this.bodySize/2-(this.headSize/3), this.headSize/2, 4);
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
