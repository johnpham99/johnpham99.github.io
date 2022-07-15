// John Pham

//////////////////////////////State & Position Data//////////////////////////////
let state = 1;
let translateX = 0;
let translateY = 0;
let translateZ = 0;
let rotateYvalue = 0;
let rotateZvalue = 0;
let translateYramp = 0;
let rotatePic = 0;
let translateYGreg = 0;

//////////////////////////////Starting Camera Position//////////////////////////////
//where we are
let fromX = 350;
let fromY = -20;
let fromZ = 0;

////where we are looking
let atX = 0;
let atY = -5;
let atZ = 0;

//up direction
let upX = 0;
let upY = 1;
let upZ = 0;

//////////////////////////////Background Color, Graphic//////////////////////////////
let r = 220;
let g = 220;
let b = 255;

let greg;
let audience;

//////////////////////////////Called Once at the Start//////////////////////////////
function setup() {
  var canvas = createCanvas(700, 700, WEBGL);
  canvas.parent('sketch-holder');
  let fov = 60.0;  // 60 degrees FOV
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);
}

//////////////////////////////This is Called Repeatedly to Draw New Per-frame Images//////////////////////////////
function draw() {

  background(r, g, b);  // light blue background

  //directional light
  directionalLight(200, 200, 200, -1, 1, -1);
  directionalLight(200, 200, 200, -10000, -1, -2000);

  // include some light even in shadows
  ambientLight(100, 100, 100);

  // set light position
  pointLight(100, 100, 100, 100, -100, 300);

  // set the virtual camera position
  camera(fromX, fromY, fromZ, atX, atY, atZ, upX, upY, upZ);


  noStroke();  // do not draw polygon outlines
  let car_axis = createVector(0, 1.0, 0.0);

  push();
  drawGT();
  pop();

  push();
  translate(0, -500, 1000);
  pop();

  push();
  rotateY(PI / 2);
  translate(0, -500, 1000);
  pop();

  push();
  translate(0, -500, -1000);
  pop();

  push();
  rotateY(PI / 2);
  translate(0, -500, -1000);
  pop();


  push();
  translate(180, translateYramp, 300);
  rotate(PI / 2, car_axis);
  drawRamp();
  pop();

  push();
  translate(180, translateYramp, -630);
  rotate(-PI / 2, car_axis);
  drawRamp();
  pop();

  push();
  rotateY(rotatePic);
  drawFloor();
  pop();

  push();
  switch (state) {
    case 1:
      if (translateX < 230) {
        translateX += 3;
        translateZ += 0.05;
        rotateYvalue += 0.02;
      }
      if (translateX > 230) {
        state = 2;
      }
      break;
    case 2:
      car_axis = createVector(0, 10, 0);

      if (rotateYvalue < 2.00) {
        rotateYvalue += 0.3;
        translateX += 0.6;
        translateZ += 0.15;
      }
      if (rotateYvalue > 2.00) {
        state = 3;
      }
      break;
    case 3:
      if (translateZ < 70) {
        translateX += 0.05;
        translateZ += 2;
        rotateYvalue += 0.02;
        fromZ -= 1;
        atZ -= 1;
      }
      if (translateZ > 70) {
        state = 4;
      }
      break;
    case 4:
      if (translateX > 130) {
        translateX -= 2;
        translateZ += 1;
        rotateYvalue -= 0.02;
        fromZ -= 1;
        atZ -= 1;
      }
      if (translateX < 130) {
        state = 5;
      }
      break;
    case 5:
      if (translateZ < 290) {
        rotateYvalue -= 0.01;
        translateZ += 2;
        fromZ -= 3;
        atZ -= 1;
        fromX += 1;
      }
      if (translateZ > 290) {
        state = 6;
      }
      break;
    case 6:
      if (translateX < 250) {
        translateX += 2.5;
        translateZ += 1.35;
        rotateYvalue -= 0.03;
        atX += 3;
        fromZ -= 1;
      }
      if (translateX > 250) {
        state = 7;
      }
      break;
    case 7:
      if (translateX < 340) {
        translateX += 2.5;
        translateZ -= 1.75;
        rotateYvalue -= 0.04;
        atX += 3;
      }
      if (translateX > 340) {
        state = 8;
      }
      break;
    case 8:
      if (translateZ > 200) {
        translateZ -= 2;
        rotateYvalue += 0.008;
        fromX -= 8;
        atX += 3;
      }
      if (translateZ < 200) {
        state = 9;
      }
      break;
    case 9:
      if (translateZ > -250) {
        translateZ -= 4;
        fromY -= 5;
        fromZ += 2.5;
        atX -= 2;
        atZ += 0.56;
      }
      if (translateZ < -250) {
        state = 10;
      }
      break;
    case 10:
      if (translateZ > -450) {
        translateZ -= 3;
        translateX -= 2;
        rotateYvalue -= 0.046;
        fromY -= 4;
        fromZ -= 1;
        atZ -= 1;
      }
      if (translateZ < -450) {
        state = 11;
      }
      break;
    case 11:
      if (translateZ > -480) {
        translateX -= 4.5;
        translateZ -= 4;
        fromY -= 4.5;
        fromZ -= 1;
        atZ -= 1;
      }
      if (translateZ < -480) {
        state = 12;
      }
      break;
    case 12:
      if (translateZ < -345) {
        translateZ += 4;
      }
      if (translateZ > -345) {
        state = 13;
      }
      break;
    case 13:
      if (translateZ < -275) {
        translateZ += 4.2;
        rotateZvalue -= 0.038;
        translateY += 2.5;
      }
      if (translateZ > -275) {
        state = 14;
      }
      break;
    case 14:
      if (translateZ < 150) {
        translateZ += 4.2;
        rotateZvalue -= 0.038;
        translateY += 2;
      }
      if (translateZ > 150) {
        state = 15;
      }
      break;
    case 15:
      if (translateZ < 355) {
        translateZ += 4.2;
        rotateZvalue -= 0.038;
        translateY -= 1.0;
      }
      if (translateZ > 355) {
        state = 16;
      }
    case 16:
      r = 255;
      g = 255;
      b = 255;
      if (translateZ < 600) {
        translateZ += 4.2;
        rotateZvalue -= 0.008;
        translateY -= 2.00;
      }
      if (translateZ > 600) {
        state = 17;
      }
      break;
    case 17:
      if (translateZ < 675) {
        translateZ += 4.2;
        rotateZvalue -= 0.01;
        translateY -= 3.0;
      }
      if (translateZ > 675) {
        state = 18;
      }
      break;
    case 18:
      if (translateZ < 1000) {
        translateZ += 4.2;
      }
      if (translateZ > 1000) {
        state = 19;
      }
      break;
    case 19:
      if (rotatePic < 6.50) {
        translateYramp += 50;
        rotatePic += 0.03;
      }
      if (rotatePic > 6.50) {
        translateYGreg += 10;
      }
      break;
  }

  translate(translateX, -translateY, -translateZ);
  rotate(rotateYvalue, car_axis);
  rotateZ(rotateZvalue);
  drawCar();
  pop();
}

function drawCar() {
  //body of car
  fill(255, 212, 92);
  push();
  scale(6, 1, 3);
  box(5, 5, 5);
  pop();

  //hood of car
  fill(255, 212, 92);
  push();
  translate(0.0, -5.0);
  scale(5, 5, 5);
  box(3, 1, 3);
  pop();

  //back left tire
  fill(0);
  push();
  translate(-9.5, 3.0, -7.5);
  sphere(2.5);
  pop();

  //back right tire
  fill(0);
  push();
  translate(-9.5, 3.0, 7.5);
  sphere(2.5);
  pop();

  //front right tire
  fill(0);
  push();
  translate(9.5, 3.0, 7.5);
  sphere(2.5);
  pop();

  //front left tire
  fill(0);
  push();
  translate(9.5, 3.0, -7.5);
  sphere(2.5);
  pop();

  //left eye
  fill(0, 0, 0);
  push();
  translate(7.5, -4.5, -4);
  rotateY(PI / 2);
  torus(1, 0.5, 20, 20);
  pop();

  //right eye
  fill(0, 0, 0);
  push();
  translate(7.5, -4.5, 4);
  rotateY(PI / 2);
  torus(1, 0.5, 20, 16);
  pop();

  //beak
  fill(255, 0, 0);
  push();
  translate(16, 0);
  rotateX(PI / 2);
  rotateZ(3 * PI / 2);
  scale(3, 2, 1);
  cone(2, 3);
  pop();

  //left exhaust
  fill(142, 142, 142);
  push();
  translate(-16, 1.0, -4);
  rotateX(PI / 2);
  rotateZ(PI / 2);
  cylinder(1, 3);
  pop();

  //right exhaust
  fill(142, 142, 142);
  push();
  translate(-16, 1.0, 4);
  rotateX(PI / 2);
  rotateZ(PI / 2);
  cylinder(1, 3);
  pop();

  //plane
  fill(0, 0, 255);
  push();
  translate(-9, -6.8, 0);
  rotateZ(-PI / 5);
  rotateX(PI / 2);
  plane(15, 15);
  pop();
}

function drawGT() {
  push();
  fill(179, 163, 105);
  translate(0, 6.25, 0);
  box(50, 1, 175);
  pop();
  push();
  fill(179, 163, 105);
  translate(125, 6.25, 0);
  box(200, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(250, 6.25, -20);
  box(50, 1, 325);
  pop();
  push();
  fill(179, 163, 105);
  translate(200, 6.25, 120);
  box(50, 1, 45);
  pop();
  push();
  fill(179, 163, 105);
  translate(200, 6.25, -160);
  box(50, 1, 45);
  pop();
  push();
  fill(179, 163, 105);
  translate(200, 6.25, -90);
  box(50, 1, 45);
  pop();
  push();
  fill(179, 163, 105);
  translate(165, 6.25, -105);
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(140, 6.25, -205);
  box(25, 1, 225);
  pop();
  push();
  fill(179, 163, 105);
  translate(115, 6.25, -205);
  box(25, 1, 175);
  pop();
  push();
  fill(179, 163, 105);
  translate(160, 6.25, -305);  ////
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(185, 6.25, -330);
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(235, 6.25, -343);
  box(75, 1, 50);
  pop();
  push();
  fill(179, 163, 105);
  translate(285, 6.25, -330);
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(310, 6.25, -305);
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(310, 6.25, -107);
  box(25, 1, 75);
  pop();
  push();
  fill(179, 163, 105);
  translate(335, 6.25, -195);
  box(25, 1, 250);
  pop();
  push();
  fill(179, 163, 105);
  translate(360, 6.25, -225);
  box(25, 1, 155);
  pop();
  push();
  fill(179, 163, 105);
  translate(365, 6.25, -95);
  box(50, 1, 50);
  pop();
}

function drawRamp() {
  push();
  fill(255, 0, 0);
  translate(0, -15, 0);
  rotateZ(-PI / 5);
  rotateX(PI / 2);
  plane(75, 75);
  pop();
  push();
  fill(255, 0, 0);
  translate(25, -15, 30);
  cylinder(3, 40);
  pop();
  push();
  fill(255, 0, 0);
  translate(25, -15, -30);
  cylinder(3, 40);
  pop();
}

function drawFloor() {
  push();
  fill(255, 255, 255);
  translate(25, 7, -150);
  rotateX(PI / 2);
  rotateZ(PI / 2);
  plane(3000, 3000);
  pop();
}