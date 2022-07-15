function setup() {
  var canvas = createCanvas(700, 700); //set size of screen
  canvas.parent('sketch-holder');
  background(255, 0, 200);
}

function draw() {
  background(229, 229, 229); //set background color
  noStroke(); //don't draw shape outlines

  let angle = (PI / 3);
  let k = 1 - (mouseY / height);
  let rotationRate = mouseX * (PI / 2097);

  function makeCircles(mainCircle) {
    let newCircles = [];
    for (let i = 0; i < 6; i++) {
      newCircles[i] = {
        object: circle(mainCircle.x + mainCircle.d * cos(i * angle + mainCircle.r), mainCircle.y + mainCircle.d * sin(i * angle + mainCircle.r), mainCircle.d * k),
        x: mainCircle.x + mainCircle.d * cos(i * angle + mainCircle.r),
        y: mainCircle.y + mainCircle.d * sin(i * angle + mainCircle.r),
        d: mainCircle.d * k,
        r: rotationRate * 2
      };
    }
    return newCircles;
  }

  if (mouseX === width / 2 && mouseY === height / 2) {
    background(255, 255, 255);
  }

  if (mouseX < width && mouseY < height) {
    fill(0, 0, 0);
    let centerCircle = { object: circle(width / 2, height / 2, width / 4), x: width / 2, y: height / 2, d: width / 4, r: rotationRate };
    fill(252, 163, 17);
    let newCircles1 = makeCircles(centerCircle);

    for (let i = 0; i < 6; i++) {
      fill(252, 163, 17);
      let newCircles2 = makeCircles(newCircles1[i]);
      for (let i = 0; i < 6; i++) {
        fill(0, 0, 0);
        let newCircles3 = makeCircles(newCircles2[i]);
        for (let i = 0; i < 6; i++) {
          fill(255, 255, 255);
          let newCircles4 = makeCircles(newCircles3[i]);
        }
      }
    }
  }

}
