let myX;
let myY;
let floorY;
let mySpeed;
let jumpMode;
let jumpEnabled;
let jumpSpeed;
let gravity;

let platforms = [];

let bg1;
let bg2;
let bg3;
let bg4;
let bg5;
let bg6;

let bg1x = 0;
let bg2x = 500;
let bg3x = 0;
let bg4x = 500;
let bg5x = 0;
let bg6x = 500;

let speed1 = 0.1;
let speed2 = 0.3;
let speed3 = 0.5;

function preload() {

    bg1 = loadImage("bkgd/sky.png");
    bg2 = loadImage("bkgd/sky.png");

    bg3 = loadImage("bkgd/far-clouds.png");
    bg4 = loadImage("bkgd/far-clouds.png");

    bg5 = loadImage("bkgd/near-clouds.png"); 
    bg6 = loadImage("bkgd/near-clouds.png");

}

function setup() {
    myCanvas = createCanvas(500, 500);
    myCanvas.parent("game_container");
    floorY = 400;
    myX = 100;
    myY = floorY;
    mySpeed = 3;
    jumpMode = false;
    jumpEnabled = true;
    jumpSpeed = 10;
    gravity = 0.8;
}

function draw() {

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

    if (bg1x < -500) {
        bg1x = bg2x + 500;
    }

    if (bg2x < -500) {
        bg2x = bg1x + 500;
    }

    if (bg3x < -500) {
        bg3x = bg4x + 500;
    }
    
    if (bg4x < -500) {
        bg4x = bg3x + 500;
    }

    if (bg5x < -500) {
        bg5x = bg6x + 500;
    }

    if (bg6x < -500) {
        bg6x = bg5x + 500;
    }

    fill(255);
    ellipse(myX, myY, 50, 50);

    myX += mySpeed;
    if (myX > width) {
        myX = 0;
    }

    if (jumpMode == true) {
        jumpEnabled = false;
        myY -= jumpSpeed;
        jumpSpeed -= gravity;

        if (myY >= floorY) {
            myY = floorY;
            jumpSpeed = 0;
            jumpMode = false;
        }
    }

    if (jumpMode == false) {
        jumpEnabled = true;
    }

    if (frameCount % 180 == 0) {
        temp = new Platform();
        platforms.push(temp);
    }

    for (let i = 0; i < platforms.length; i++) {
        platforms[i].display();
        platforms[i].move();
        platforms[i].support();

        if (platforms[i].x < -100) {
            platforms.splice(i, 1);
        }
    }


}

function keyPressed() {
    if (keyCode == 87 && jumpEnabled) {
        jumpMode = true;
        jumpSpeed = 15;
    }
}

class Platform {
    constructor() {
        this.x = random(width, width + 100);
        this.y = floorY - 20;
        this.width = random(100, 300);
        this.height = random(10, 50);
    }

    display() {
        fill(255);
        rect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.x -= 3;
    }

    support() { 
        if (myX > this.x && myX < this.x + this.width && myY + 25 >= this.y && myY <= this.y + this.height) {
            floorY = 200;
        }

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
