// Provided code for Project 5
let v = [];
let g = [];
let o = [];
let newG = [];
let newV = [];
let palette = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let dual = false;

let tetra, octa, icosa, star, torus;

let animate_flag = 1;
let normal_flag = 0;
let random_flag = 0;

let time = 0;  // records the passage of time, used to move the objects

// read in the polygon mesh files
function preload() {
  tetra = loadStrings('/javascripts/dualmesh/assets/icosa.txt');
  octa = loadStrings('/javascripts/dualmesh/assets/octa.txt');
  icosa = loadStrings('/javascripts/dualmesh/assets/icosa.txt');
  star = loadStrings('/javascripts/dualmesh/assets/star.txt');
  torus = loadStrings('/javascripts/dualmesh/assets/torus.txt');
}

// called once at the start of the program
function setup() {
  var canvas = createCanvas(600, 600, WEBGL);
  canvas.parent('sketch-holder');
  let fov = 60.0;  // 60 degrees field of view
  perspective(PI * fov / 180.0, width / height, 0.1, 2000);
}

// handle key press commands
function keyPressed() {
  console.log("key pressed\n");
  switch (key) {
    case ' ': animate_flag = 1 - animate_flag; break;
    case '1': dual = false; clearTables(); parse_polys(tetra); break;
    case '2': dual = false; clearTables(); parse_polys(octa); break;
    case '3': dual = false; clearTables(); parse_polys(icosa); break;
    case '4': dual = false; clearTables(); parse_polys(star); break;
    case '5': dual = false; clearTables(); parse_polys(torus); break;
    case 'd': create_dual(); dual = true; break;
    case 'n': normal_flag = 1 - normal_flag; break;
    case 'r': random_flag = 1 - random_flag; break;
    case 'q': debugger; break;
  }
}

// called repeatedly to create new per-frame images
function draw() {
  background(200, 200, 255);  // light blue background

  // set the virtual camera position
  camera(0, 0, 85, 0, 0, 0, 0, 1, 0);  // from, at, up

  // include a little bit of light even in shadows
  ambientLight(40, 40, 40);

  // set the light position
  pointLight(255, 255, 255, 100, -100, 300);

  noStroke();  // don't draw polygon outlines

  fill("255,255,255");

  push();
  let mesh_axis = createVector(0, 1, 0);
  rotate(-time, mesh_axis);
  scale(15);

  for (let i = 0; i < v.length; i += 3) {
    if (random_flag == 1) {
      if (normal_flag == 0) {
        fill(palette[i % 7]);
        beginShape();
        normal(surfaceNorm(i));
        vertex(g[v[i]][0], g[v[i]][1], g[v[i]][2]);
        vertex(g[v[i + 1]][0], g[v[i + 1]][1], g[v[i + 1]][2]);
        vertex(g[v[i + 2]][0], g[v[i + 2]][1], g[v[i + 2]][2]);
        endShape(CLOSE);
      } else if (normal_flag == 1) {
        fill(palette[i % 7]);
        beginShape();
        normal(vertNorm(i));
        vertex(g[v[i]][0], g[v[i]][1], g[v[i]][2]);
        normal(vertNorm(i + 1));
        vertex(g[v[i + 1]][0], g[v[i + 1]][1], g[v[i + 1]][2]);
        normal(vertNorm(i + 2));
        vertex(g[v[i + 2]][0], g[v[i + 2]][1], g[v[i + 2]][2]);
        endShape(CLOSE);
      }
    } else if (normal_flag == 0) {
      beginShape();
      normal(surfaceNorm(i));
      vertex(g[v[i]][0], g[v[i]][1], g[v[i]][2]);
      vertex(g[v[i + 1]][0], g[v[i + 1]][1], g[v[i + 1]][2]);
      vertex(g[v[i + 2]][0], g[v[i + 2]][1], g[v[i + 2]][2]);
      endShape(CLOSE);
    } else if (normal_flag == 1) {
      beginShape();
      normal(vertNorm(i));
      vertex(g[v[i]][0], g[v[i]][1], g[v[i]][2]);
      normal(vertNorm(i + 1));
      vertex(g[v[i + 1]][0], g[v[i + 1]][1], g[v[i + 1]][2]);
      normal(vertNorm(i + 2));
      vertex(g[v[i + 2]][0], g[v[i + 2]][1], g[v[i + 2]][2]);
      endShape(CLOSE);
    }
  }
  pop();

  // maybe update time
  if (animate_flag)
    time += 0.02;

}

// Parse a polygon mesh file.
//
// This function currently prints the vertices and faces to the console,
// but you should modify it to save this data in your own mesh data structure.
function parse_polys(s) {
  console.log("in read_polys()");

  let vertex_count, face_count;
  let tokens = [];

  // go through all the lines in the file and separate the tokens
  for (let i = 0; i < s.length; i++) {
    tokens[i] = s[i].split(" ");
    //console.log (tokens[i]);
  }

  vertex_count = parseInt(tokens[0][1]);
  face_count = parseInt(tokens[1][1]);

  console.log("vertex count = " + vertex_count);
  console.log("face count = " + face_count);

  //---------------------------------------------------Populate G Table---------------------------------------------------
  // read in the vertex coordinates
  for (let i = 0; i < vertex_count; i++) {
    let tlist = tokens[i + 2];
    let x = parseFloat(tlist[0]);
    let y = parseFloat(tlist[1]);
    let z = parseFloat(tlist[2]);
    //console.log ("xyz: " + x + " " + y + " " + z);
    let vertex = [];
    vertex.push(x);
    vertex.push(y);
    vertex.push(z);
    g.push(vertex);
  }

  //---------------------------------------------------Populates the V Table---------------------------------------------------
  // read in the face indices
  for (let i = 0; i < face_count; i++) {
    let tlist = tokens[i + vertex_count + 2];
    let nverts = parseInt(tlist[0]);
    let v1 = parseInt(tlist[1]);
    let v2 = parseInt(tlist[2]);
    let v3 = parseInt(tlist[3]);
    //console.log ("verts: " + v1 + " " + v2 + " " + v3);
    v.push(v1);
    v.push(v2);
    v.push(v3);
  }

  populateO();
  console.log("end of read_polys()");
}

//---------------------------------------------------Populates the O Table---------------------------------------------------
function populateO() {
  for (let i = 0; i < v.length; i++) {
    for (let j = 0; j < v.length; j++) {
      if ((v[next(i)] == v[previous(j)]) && (v[previous(i)] == v[next(j)])) {
        o[i] = j;
        o[j] = i;
      }
    }
  }
}

//---------------------------------------------------Clear G,V,O table---------------------------------------------------
function clearTables() {
  g = [];
  v = [];
  o = [];
}

//---------------------------------------------------Create Dual---------------------------------------------------
// This function should produce the triangulated dual of your current mesh
function create_dual() {
  if (!dual) {
    newG = [];
    newV = [];
    let checkpoint = 0;
    let offset = 0;

    for (let i = 0; i < g.length; i++) {
      let centroids = centroid(i);
      let mid = middle(centroids);
      checkpoint = newG.length;

      for (let j = 0; j < centroids.length; j++) {
        newG.push(centroids[j]);
      }

      newG.push(mid);
      for (let k = 0; k < centroids.length; k++) {
        let index = k + checkpoint;
        if (k != centroids.length - 1) {
          newV.push(index);
          newV.push(index + 1);
          newV.push(newG.length - 1);
        } else {
          newV.push(newG.length - 1);
          newV.push(index);
          newV.push(checkpoint);
        }
      }
    }

    clearTables();
    g = newG;
    v = newV;
    populateO();
  }
}

//---------------------------------------------------Calculate Middle Point from Centroids---------------------------------------------------
function middle(centroids) {
  let midX = 0;
  let midY = 0;
  let midZ = 0;

  for (let i = 0; i < centroids.length; i++) {
    midX += centroids[i][0];
    midY += centroids[i][1];
    midZ += centroids[i][2];
  }

  midX = midX / centroids.length;
  midY = midY / centroids.length;
  midZ = midZ / centroids.length;

  return [midX, midY, midZ];
}

//---------------------------------------------------Calculate Centroids from Vertex---------------------------------------------------
function centroid(vertex) {
  let corner = -1;

  let faces = []; //each corner in this array represents a corner of a different face

  //find a corner that maps to vertex
  for (let i = 0; i < v.length; i++) {
    if (v[i] == vertex) {
      faces.push(i);
      corner = i;
      break;
    }
  }

  curr = swing(corner);
  while (curr != corner) {
    faces.push(curr);
    curr = swing(curr);
  }


  //for each face calcualte the centroid
  let centroids = [];
  for (let i = 0; i < faces.length; i++) {
    centroids.push(calcCentroid(faces[i]));
  }

  return centroids;
}

//---------------------------------------------------Calculate Centroid of a Face---------------------------------------------------
function calcCentroid(corner) {
  let a = v[corner];
  let b = v[next(corner)];
  let c = v[previous(corner)];

  let aVec = new p5.Vector(g[a][0], g[a][1], g[a][2]);
  let bVec = new p5.Vector(g[b][0], g[b][1], g[b][2]);
  let cVec = new p5.Vector(g[c][0], g[c][1], g[c][2]);

  let ab = new p5.Vector.add(aVec, bVec);
  let p = new p5.Vector.add(ab, cVec);
  mid = new p5.Vector.div(p, 3);
  return [mid.x, mid.y, mid.z];
}

//---------------------------------------------------Corner Operations---------------------------------------------------
function triNum(corner) {
  return Math.floor(corner / 3);
}

function next(corner) {
  return 3 * triNum(corner) + (corner + 1) % 3;
}

function previous(corner) {
  return 3 * triNum(corner) + (corner + 2) % 3;
}

function swing(corner) {
  let nex = next(corner);
  let opposite = o[nex];
  return next(opposite);
}


//---------------------------------------------------Calculate Surface Normal---------------------------------------------------
function surfaceNorm(corner) {
  let a = v[corner];
  let b = v[next(corner)];
  let c = v[previous(corner)];

  let aVec = new p5.Vector(g[a][0], g[a][1], g[a][2]);
  let bVec = new p5.Vector(g[b][0], g[b][1], g[b][2]);
  let cVec = new p5.Vector(g[c][0], g[c][1], g[c][2]);

  let ab = new p5.Vector.sub(bVec, aVec);
  let ac = new p5.Vector.sub(cVec, aVec);

  let normal = new p5.Vector.cross(ab, ac);
  normal = normal.normalize();
  normal = new p5.Vector.mult(normal, -1);

  return normal;
}

//---------------------------------------------------Calculate Vertex Normal---------------------------------------------------
function vertNorm(corner) {
  let faces = [];

  for (let i = 0; i < v.length; i++) {
    if (v[i] == v[corner]) {
      faces.push(i);
    }
  }

  let surfaceNormals = [];
  for (let i = 0; i < faces.length; i++) {
    surfaceNormals.push(surfaceNorm(faces[i]));
  }

  let avgX = 0;
  let avgY = 0;
  let avgZ = 0;

  for (let i = 0; i < surfaceNormals.length; i++) {
    avgX += surfaceNormals[i].x;
    avgY += surfaceNormals[i].y;
    avgZ += surfaceNormals[i].z;
  }

  avgX = avgX / surfaceNormals.length;
  avgY = avgY / surfaceNormals.length;
  avgZ = avgZ / surfaceNormals.length;

  let normal = new p5.Vector(avgX, avgY, avgZ);
  normal = normal.normalize();

  return normal;
}
