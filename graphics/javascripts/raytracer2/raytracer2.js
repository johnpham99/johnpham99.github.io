// John Pham
// Here are the two new routines that you should add to your ray tracer for Part B
  let k = 0;
  let lights = [];
  let ambientLights = [];
  let materials = [];
  let cylinders = [];
  let spheres = [];
  let background = {r:0, g:0, b:0};
  let reflectionDepth = 1;
  
function new_sphere (x, y, z, radius) {
  let newSphere = { x: x,
                    y: y,
                    z: z,
                    radius: radius,
                    material: materials[materials.length - 1] };
  spheres.push(newSphere);
}

function ambient_light (r, g, b) {
  let ambientLight = { r: r,
                       g: g,
                       b: b};
  ambientLights.push(ambientLight);
}

// You should swap in your routines from Part A for the placeholder routines below
function reset_scene() {
  k = 0;
  lights = [];
  ambientLights = [];
  materials = [];
  cylinders = [];
  spheres = [];
  background = {r:0, g:0, b:0};
  reflectionDepth = 1;
}

function set_background (r, g, b) {
  background.r = r;
  background.g = g;
  background.b = b;
}

function set_fov (angle) {
  let rad = radians(angle);
  k = tan((rad/2));
}

function new_light (r, g, b, x, y, z) {
  let newLight = { r: r,
                   g: g,
                   b: b,
                   x: x,
                   y: y,
                   z: z };
  lights.push(newLight);
}

function new_material (dr, dg, db,  ar, ag, ab, sr, sg, sb, pow, k_refl) {
  let newMaterial  = { dr: dr,
                       dg: dg,
                       db: db,
                       ar: ar,
                       ag: ag,
                       ab: ab,
                       sr: sr,
                       sg: sg,
                       sb: sb,
                       pow: pow,
                       k_refl: k_refl };
  materials.push(newMaterial);
}

function new_cylinder (x, y, z, radius, h) {
  let newCylinder = { x: x,
                      y: y,
                      z: z,
                      radius: radius,
                      h: h,
                      material: materials[materials.length - 1] };
  cylinders.push(newCylinder);
}

function draw_scene() {
  
  noStroke();

  // go through all the pixels in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      
      let xPrime = (x - width/2) * ((2*k)/width);
      let yPrime = ((y - height/2) * ((-2*k)/height));

      let direction = new p5.Vector(xPrime, yPrime, -1);
      direction = direction.normalize(); 
      
      let eye = new p5.Vector(0, 0, 0);
      let ray = {point: eye, dir: direction, isReflection: 0};
      
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
        let rayColor = colorRay(ray, intersection);
        r = rayColor.r;
        g = rayColor.g;
        b = rayColor.b;
      }
      
      // draw a little rectangle to fill the pixel      
      fill (r * 255, g * 255, b * 255);
      rect (x, y, 1, 1);
      
    }
  }
  reset_scene();
}

function colorRay(ray, intersection) {
  let intersectVector = calculateIntersect(ray, intersection.t); //points from origin to the intersection
  let normalVector = calculateNormal(intersectVector, intersection.objectType, intersection.objectIndex); //normal unit vector
  let totalLight = calculateTotalLight(intersectVector, normalVector, intersection); //Cl * max(O, N*L) * visible
  
  let diffuse = calculateDiffuse(intersection.objectType, intersection.objectIndex, totalLight);  //Cr * Cl * max(0, N*L) * visible
  let ambience = calculateAmbience(intersection.objectType, intersection.objectIndex);   //Cr (Ca)
  let highlight = calculateHighlight(intersectVector, ray.dir, normalVector, intersection.objectIndex, intersection.objectType); //Cl * Cp * (H*L)^p
  
  let reflection = {r:0, g:0, b:0};
  if (ray.isReflection < 2) {
    reflection = calculateReflection(intersectVector, normalVector, intersection.objectIndex, intersection.objectType);
    if (reflectionDepth == 3) {
      reflectionDepth = 0;
    }
  }
  let r = diffuse.r + ambience.r + highlight.r + reflection.r;
  let g = diffuse.g + ambience.g + highlight.g + reflection.g;
  let b = diffuse.b + ambience.b + highlight.b + reflection.b;
  let rayColor = {r:r, g:g, b:b};
  return rayColor;
}

function checkHit(ray) {
  let hit = {t:-1, objectIndex: null, objectType: -1};
  
  let closestT = -1; //-1 if ray does not hit anything in scene
  let closestTindex; //index of the closest object being hit
  let objectType = -1; //-1: no object, 0: cylinder, 1: sphere, 2: cylinder endcap
  
  //check to see if ray hits cylinders
  for (let i = 0; i < cylinders.length; i++) {
     let cylinder = cylinders[i];
     
     //checks to see if ray hits wall of cylinder
     let a = (ray.dir.x * ray.dir.x) + (ray.dir.z * ray.dir.z);
     let b = 2 * ((ray.dir.x * (-cylinder.x + ray.point.x)) + (ray.dir.z*(-cylinder.z+ray.point.z)));
     let c = ((-cylinder.x+ray.point.x)*(-cylinder.x+ray.point.x)) + ((-cylinder.z+ray.point.z)*(-cylinder.z+ray.point.z)) - (cylinder.radius * cylinder.radius);
     let determinant = (b*b)-(4*a*c);
     
     if (determinant >= 0) {
       let t1 = (-b + sqrt(determinant)) / (2*a);
       let t2 = (-b - sqrt(determinant)) / (2*a);
       
       let t1product = ray.point.y + (t1 * ray.dir.y);
       let t2product = ray.point.y + (t2 * ray.dir.y);
       
       if ((t1product >= cylinder.y) && (t1product <= (cylinder.y + cylinder.h)) && (t1 >= 0)) {
         if (t1 < closestT || closestT == -1) {
           closestT = t1;
           closestTindex = i;
           objectType = 0;
         }
       }
       
       if ((t2product >= cylinder.y) && (t2product <= (cylinder.y + cylinder.h)) && (t2 >= 0)) {
         if (t2 < closestT || closestT == -1) {
           closestT = t2;
           closestTindex = i;
           objectType = 0;
         }
       }
     }
     
     //checks to see if ray hits the ends of the cylinder
     if (ray.dir.y != 0) {
       let t3 = (-1*(ray.point.y - cylinder.y)) / ray.dir.y; //bot cap
       let t4 = (-1*(ray.point.y - cylinder.y - cylinder.h)) / ray.dir.y; //top cap
       
       let xhit = ray.point.x + (t3 * ray.dir.x);
       xhit = cylinder.x - xhit;
       xhit = xhit * xhit;
       
       let zhit = ray.point.z + (t3 * ray.dir.z);
       zhit = cylinder.z - zhit;
       zhit = zhit * zhit;
       
       if (((xhit + zhit) <= (cylinder.radius*cylinder.radius)) && (t3 >= 0)) { 
         if (t3 < closestT || closestT == -1) {
           closestT = t3;
           closestTindex = i;
           objectType = 2;         
         }
       }
       
       xhit = ray.point.x + (t4 * ray.dir.x);
       xhit = cylinder.x - xhit;
       xhit = xhit * xhit;
       
       zhit = ray.point.z + (t4 * ray.dir.z);
       zhit = cylinder.z - zhit;
       zhit = zhit * zhit;
       
       if (((xhit + zhit) <= (cylinder.radius*cylinder.radius)) && (t4 >= 0)) {
         if (t4 < closestT || closestT == -1) {
           closestT = t4;
           closestTindex = i;
           objectType = 3;         
         }
       }
     }
  }
  
  //check to see if ray hits spheres
  for (let i = 0; i < spheres.length; i++) {
    let sphere = spheres[i];
    // a = dx^2 + dy^2 + dz^2
    let a = (ray.dir.x * ray.dir.x) + (ray.dir.y * ray.dir.y) + (ray.dir.z * ray.dir.z);
    // b = 2 (x_0dx - x_cdx + y_0dy - y_cdy + z_0dz - z_cdz)
    let b = 2 * ((ray.point.x*ray.dir.x)-(ray.dir.x*sphere.x)+(ray.point.y*ray.dir.y)-(ray.dir.y*sphere.y)+(ray.point.z*ray.dir.z)-(ray.dir.z*sphere.z));
    // c = x_0^2 - 2x_0x_c + x_c^2 + y_0^2 - 2y_0y_c + y_c^2 + z_0^2 - 2z_0z_c + z_c^2 - r^2
    let c = (ray.point.x*ray.point.x)-(2*ray.point.x*sphere.x)+(sphere.x*sphere.x)+(ray.point.y*ray.point.y)-(2*ray.point.y*sphere.y)+(sphere.y*sphere.y)+(ray.point.z*ray.point.z)-(2*ray.point.z*sphere.z)+(sphere.z*sphere.z)-(sphere.radius*sphere.radius);
    let determinant = (b*b)-(4*a*c);    
    
    if (determinant >= 0) {
      let t5 = (-b + sqrt(determinant)) / (2*a);
      let t6 = (-b - sqrt(determinant)) / (2*a);
      
      if (t5 < closestT || closestT == -1) {
        if (t5 >= 0) {
          closestT = t5;
          closestTindex = i;
          objectType = 1;
        }
      } 
      if (t6 < closestT || closestT == -1) {
        if (t6 >= 0) {
          closestT = t6;
          closestTindex = i;
          objectType = 1;
        }
      }   
    }
  }
  
  //set values of hit object
  if (closestT == -1) {
    return hit;
  } else {
    hit.t = closestT;
    hit.objectIndex = closestTindex;
    hit.objectType = objectType;
    return hit;
  }
}

function calculateIntersect(ray, t) {
  let intersectX = ray.point.x + (t * ray.dir.x); 
  let intersectY = ray.point.y + (t * ray.dir.y);
  let intersectZ = ray.point.z + (t * ray.dir.z); 
  let intersectVector = new p5.Vector(intersectX,intersectY,intersectZ);
  return intersectVector;
}

function calculateNormal(intersect, objectType, objectIndex) {
  let normalVector = new p5.Vector(0,0,0);
  if (objectType == 0) { //cylinder wall
    normalVector = new p5.Vector(intersect.x - cylinders[objectIndex].x, 0, intersect.z - cylinders[objectIndex].z);
  }
  if (objectType == 1) { //sphere
    normalVector = new p5.Vector(intersect.x - spheres[objectIndex].x, intersect.y - spheres[objectIndex].y, intersect.z - spheres[objectIndex].z);
  }
  if (objectType == 2) { //bot endcap
    normalVector = new p5.Vector(0, -1, 0);
  }
  if (objectType == 3) { //top endcap
    normalVector = new p5.Vector(0, 1, 0);
  }
  normalVector = normalVector.normalize();
  return normalVector;
}

function calculateTotalLight(intersectVector, normalVector, intersection) {
  //Cl * max(O, N*L) * Visible
  let totalLightR = 0;
  let totalLightG = 0;
  let totalLightB = 0;
  for (let i = 0; i < lights.length; i++) {
    let visible = 1;
    let light = lights[i];
    let lightVector = new p5.Vector(light.x,light.y,light.z);  
    lightVector = new p5.Vector.sub(lightVector, intersectVector);
    lightVector = lightVector.normalize();      //unit vector that points from intersection to the light
    
    let origin = new p5.Vector.mult(normalVector, 0.0001);
    origin = new p5.Vector.add(intersectVector, origin);
    
    let shadowRay = {point:origin, dir:lightVector, isReflection: 0};
    let shadowHit = checkHit(shadowRay);
    if (shadowHit.t != -1) {
          visible = 0; 
    }
    
    let normalTimesLight = p5.Vector.dot(normalVector, lightVector);
    normalTimesLight = max(0, normalTimesLight);
    totalLightR += (light.r * normalTimesLight * visible);
    totalLightG += (light.g * normalTimesLight * visible);
    totalLightB += (light.b * normalTimesLight * visible);
  }
  let totalLight = { r: totalLightR, g: totalLightG, b: totalLightB};
  return totalLight;
}

function calculateDiffuse(objectType, objectIndex, totalLight){
  // C = Cr * Cl * max(0, N*L);
  let r = 0;
  let b = 0;
  let g = 0;
  let lightR = totalLight.r;
  let lightG = totalLight.g;
  let lightB = totalLight.b;
  if (objectType == 0 || objectType == 2 || objectType == 3) {
    r = cylinders[objectIndex].material.dr * lightR;
    g = cylinders[objectIndex].material.dg * lightG;
    b = cylinders[objectIndex].material.db * lightB;    
  }
  if (objectType == 1) {
    r = spheres[objectIndex].material.dr * lightR;
    g = spheres[objectIndex].material.dg * lightG;
    b = spheres[objectIndex].material.db * lightB;        
  }
  let diffuse = { r:r, g:g, b:b};
  return diffuse;
}

function calculateAmbience(objectType, objectIndex) {
  // C = Cr (Ca + Cl * max(0, N*L)
  let r = 0;
  let b = 0;
  let g = 0;
  if (ambientLights.length != 0) {
    let ambienceR = ambientLights[0].r;
    let ambienceG = ambientLights[0].g;
    let ambienceB = ambientLights[0].b;
    if (objectType == 0 || objectType == 2 || objectType == 3) {
      r = cylinders[objectIndex].material.dr * ((ambienceR * cylinders[objectIndex].material.ar));
      g = cylinders[objectIndex].material.dg * ((ambienceG * cylinders[objectIndex].material.ag));
      b = cylinders[objectIndex].material.db * ((ambienceB * cylinders[objectIndex].material.ab));       
    }
    if (objectType == 1) {
      r = spheres[objectIndex].material.dr * ((ambienceR * spheres[objectIndex].material.ar));
      g = spheres[objectIndex].material.dg * ((ambienceG * spheres[objectIndex].material.ag));
      b = spheres[objectIndex].material.db * ((ambienceB * spheres[objectIndex].material.ab));       
    }
  }
  let ambience = {r:r, g:g, b:b};
  return ambience;
}

function calculateHighlight(intersectVector, rayDir, normalVector, objectIndex, objectType) {
  // C = Cl * Cp * (H*N)^P
  let highlightR = 0;
  let highlightG = 0;
  let highlightB = 0;
  for (let i = 0; i < lights.length; i++) {
    
    // Halfway Vector = L+E / ||L+E||
    let light = lights[i];
    let lightVector = new p5.Vector(light.x,light.y,light.z);  
    lightVector = new p5.Vector.sub(lightVector, intersectVector);
    lightVector = lightVector.normalize();
    
    let eVector = new p5.Vector.mult(rayDir, -1);  //vector from intersection to eye, which is negative direction of ray

    hVector = new p5.Vector.add(lightVector, eVector); 
    hVector = hVector.normalize();
    let hDotNormal = p5.Vector.dot(hVector, normalVector);
    
    let r = 0;
    let g = 0;
    let b = 0;
    if (objectType == 0 || objectType == 2 || objectType == 3) {
      let specPower = cylinders[objectIndex].material.pow;
      let hdotNormalPower = Math.pow(hDotNormal, specPower);
      
      r = light.r * cylinders[objectIndex].material.sr * hdotNormalPower;
      g = light.g * cylinders[objectIndex].material.sg * hdotNormalPower;
      b = light.b * cylinders[objectIndex].material.sb * hdotNormalPower;    
    }
    if (objectType == 1) {
      let specPower = spheres[objectIndex].material.pow;
      let hdotNormalPower = Math.pow(hDotNormal, specPower);
      
      r = light.r * spheres[objectIndex].material.sr * hdotNormalPower;
      g = light.g * spheres[objectIndex].material.sg * hdotNormalPower;
      b = light.b * spheres[objectIndex].material.sb * hdotNormalPower;    
    }
    highlightR += r;
    highlightG += g;
    highlightB += b;
  }
  let highlight = { r: highlightR, g: highlightG, b: highlightB};
  return highlight;
}

function calculateReflection(intersectVector, normalVector, objectIndex, objectType) { 
  
  let vVector = new p5.Vector.mult(intersectVector, -1);
  vVector = vVector.normalize();
  
  //let nMinusv = new p5.Vector.sub(normalVector, vVector);
  //nMinusv = nMinusv.normalize();
  
  let nDotv = p5.Vector.dot(normalVector, vVector);
  nDotv = nDotv * 2;
 
  let rDir = new p5.Vector.mult(normalVector, nDotv);
  rDir = new p5.Vector.sub(rDir, vVector);
  rDir = rDir.normalize();
  
  let origin = new p5.Vector.mult(normalVector, 0.0001);
  origin = new p5.Vector.add(intersectVector, origin);
  
  let rRay = {point:origin, dir:rDir, isReflection:reflectionDepth};
  reflectionDepth++;
  let rHit = checkHit(rRay);
  let rColor = colorRay(rRay, rHit);
  
  let r = 0;
  let g = 0;
  let b = 0;
  if (objectType == 0 || objectType == 2 || objectType == 3) {
    let k_refl = cylinders[objectIndex].material.k_refl;
    r = k_refl * rColor.r;
    g = k_refl * rColor.g;
    b = k_refl * rColor.b;
  }
  if (objectType == 1) {
    let k_refl = spheres[objectIndex].material.k_refl;     
    r = k_refl * rColor.r;
    g = k_refl * rColor.g;
    b = k_refl * rColor.b;
    
    if (rColor.r == 0 && rColor.g == 0 && rColor.b == 0 && k_refl != 0 && rHit.t == -1) {
      r = k_refl * background.r;
      g = k_refl * background.g;
      b = k_refl * background.b;
    }
  }
  let reflection = {r:r, g:g, b:b};
  return reflection;
}

    
