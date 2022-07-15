// John Pham
// these are the routines that you should write for the project

let k = 0;
let lights = [];
let materials = [];
let cylinders = [];
let background = { r: 0, g: 0, b: 0 };

function reset_scene() {
  k = 0;
  lightSources = [];
  materials = [];
  cylinders = [];

}

function set_background(r, g, b) {
  background.r = r;
  background.g = g;
  background.b = b;
}

function set_fov(angle) {
  let rad = radians(angle);
  k = tan((rad / 2));
}

function new_light(r, g, b, x, y, z) {
  let newLight = {
    r: r,
    g: g,
    b: b,
    x: x,
    y: y,
    z: z
  };
  lights.push(newLight);
}

function new_material(dr, dg, db, ar, ag, ab, sr, sg, sb, pow, k_refl) {
  let newMaterial = {
    dr: dr,
    dg: dg,
    db: db,
    ar: ar,
    ag: ag,
    ab: ab,
    sr: sr,
    sg: sg,
    sb: sb,
    pow: pow,
    k_refl: k_refl
  };
  materials.push(newMaterial);
}

function new_cylinder(x, y, z, radius, h) {
  let newCylinder = {
    x: x,
    y: y,
    z: z,
    radius: radius,
    h: h,
    material: materials[materials.length - 1]
  };
  cylinders.push(newCylinder);
}

function draw_scene() {

  noStroke();

  // go through all the pixels in the image

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      // add your ray creation and scene intersection code here
      let xPrime = (x - width / 2) * ((2 * k) / width);
      let yPrime = ((y - height / 2) * ((-2 * k) / height));

      let direction = new p5.Vector(xPrime, yPrime, -1);
      direction = direction.normalize();

      let eye = new p5.Vector(0, 0, 0);
      let ray = { point: eye, dir: direction };

      let intersection = checkHit(ray);

      // set the pixel color to the shaded color of the ray      
      let r = 0;
      let g = 0;
      let b = 0;

      if (intersection.t == -1) {
        r = background.r;
        g = background.g;
        b = background.b;
      } else {
        // C = Cr * Cl * max(0,N*L)
        let t = intersection.t;
        let intersectX = ray.point.x + (t * ray.dir.x);
        let intersectY = ray.point.y + (t * ray.dir.y);
        let intersectZ = ray.point.z + (t * ray.dir.z);
        let intersectVector = new p5.Vector(intersectX, intersectY, intersectZ);

        let light = lights[0];
        let lightVector = new p5.Vector(light.x, light.y, light.z);
        lightVector = lightVector.sub(intersectVector);
        lightVector = lightVector.normalize();

        let normalVector = new p5.Vector(intersectX - cylinders[intersection.objectHit].x, 0, intersectZ - cylinders[intersection.objectHit].z);
        normalVector = normalVector.normalize();
        let normalTimesLight = (normalVector.x * lightVector.x) + (normalVector.y * lightVector.y) + (normalVector.z * lightVector.z);
        normalTimesLight = max(0, normalTimesLight);

        r = cylinders[intersection.objectHit].material.dr * light.r * normalTimesLight;
        g = cylinders[intersection.objectHit].material.dg * light.g * normalTimesLight;
        b = cylinders[intersection.objectHit].material.db * light.b * normalTimesLight;
      }


      fill(r * 255, g * 255, b * 255);

      // draw a little rectangle to fill the pixel
      rect(x, y, 1, 1);

    }
  }
  reset_scene();
}

function checkHit(ray) {
  let hit = { t: -1, objectHit: null };

  let closestT = -1;
  let closestTindex;

  for (let i = 0; i < cylinders.length; i++) {
    let cylinder = cylinders[i];

    let a = (ray.dir.x * ray.dir.x) + (ray.dir.z * ray.dir.z);
    let b = 2 * ((ray.dir.x * (-cylinder.x + ray.point.x)) + (ray.dir.z * (-cylinder.z + ray.point.z)));
    let c = ((-cylinder.x + ray.point.x) * (-cylinder.x + ray.point.x)) + ((-cylinder.z + ray.point.z) * (-cylinder.z + ray.point.z)) - (cylinder.radius * cylinder.radius);
    let determinant = (b * b) - (4 * a * c);

    if (determinant >= 0) {
      let t1 = (-b + sqrt(determinant)) / (2 * a);
      let t2 = (-b - sqrt(determinant)) / (2 * a);

      let t1product = ray.point.y + (t1 * ray.dir.y);
      let t2product = ray.point.y + (t2 * ray.dir.y);

      if ((t1product >= cylinder.y) && (t1product <= (cylinder.y + cylinder.h))) {
        if (t1 < closestT || closestT == -1) {
          closestT = t1;
          closestTindex = i;
        }
      }

      if ((t2product >= cylinder.y) && (t2product <= (cylinder.y + cylinder.h))) {
        if (t2 < closestT || closestT == -1) {
          closestT = t2;
          closestTindex = i;
        }
      }
    }

  }
  if (closestT == -1) {
    return hit;
  } else {
    hit.t = closestT;
    hit.objectHit = closestTindex;
    return hit;
  }
}
