// John Pham
// Sample code for Project 2A
// Draws 3D Primitives (box, cylinder, sphere, cone, torus)


let time = 0;  // track the passage of time, used to move the objects

// called once at the start
function setup() {
  var canvas = createCanvas(700, 700, WEBGL);
  canvas.parent('sketch-holder');
  let fov = 60.0;  // 60 degrees FOV
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);
}

// this is called repeatedly to draw new per-frame images
function draw() {

  background(220, 220, 255);  // light blue background

  // set the virtual camera position
  camera(0, 0, 85, 0, 0, 0, 0, 1, 0);  // from, at, up

  // include some light even in shadows
  ambientLight(60, 60, 60);

  // set light position
  pointLight(255, 255, 255, 100, -100, 300);

  noStroke();  // do not draw polygon outlines

  let delta = 25;
  push();
  let car_axis = createVector(0.0, 1.0, 0.0);
  rotate(-time, car_axis);

  //body of car
  fill(255, 212, 92);
  push();
  translate(0, 0);
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

  pop();

  ////back right tire
  //fill(250);
  //push();
  //translate(0, 0);
  //translate (-8.5 * sin(time), 4.0, 4 * cos(time));
  //sphere(2);
  //pop();

  //fill(100, 150, 250);
  //push();
  //translate(-delta, delta);
  //rotateX(PI)
  //let cone_axis = createVector (1.0, 0.0, 0.0);
  //rotate (-time, cone_axis);
  //cone(10, 25);
  //pop();

  //fill(250, 50, 100);
  //push();
  //translate(delta, -delta);
  //let cyl_axis = createVector (0.0, 0.0, 1.0);
  //rotate (-time, cyl_axis);
  //cylinder(10, 20);
  //pop();

  //fill(150, 0, 150);
  //push();
  //translate(delta, delta);
  //scale (0.3 * (sin (time) + 2.5));
  //torus(12, 6, 32, 20);
  //pop();

  time += 0.03;  // update the time
}
