//John Pham

// Matrix and Drawing Library

// Begin by using the matrix transformation routines from part A of this project.
// You should modify the new routines listed below to complete the assignment.
// Feel free to define any classes, global variables and helper routines that you need.


//***************1B*********************//
let vertices = []; //all vertices
let shapeBoolean = 0; //boolean value to know if the state is in between begin and end shape

let projection = 0;
let leftt = 0;
let rightt = 0;
let topp = 0;
let bottomm = 0;
let nearr = 0;
let farr = 0;
let k = 0;

function BeginShape(dummy_value) {
  shapeBoolean = 1;
}

function EndShape(dummy_value) { 
   clearStack(); //Turn transformation stack into 1 transformation matrix
   let transformedVertices = [];
   
   for (let row = 0; row < vertices.length; row++) {
     transformedVertices.push([]);
   }
   
   for (let i = 0; i < vertices.length; i++) {
     transformedVertices[i] = Multiply_Vector(vertices[i], tMatrix);
   }

  vertices = transformedVertices;

   if (projection == 1) {
     for (let i = 0; i < vertices.length; i++) {
       let currentx = vertices[i][0];
       let currenty = vertices[i][1];
       let currentz = vertices[i][2];
       vertices[i][0] = ((currentx/abs(currentz)) + k) * (width/(2*k));
       vertices[i][1] = height - ((currenty/abs(currentz)) + k) * (height/(2*k));
     }       
   } 
  
   if (projection == 2) {
     for (let i = 0; i < vertices.length; i++) {
       vertices[i][0] = (vertices[i][0] - leftt) * (width/(rightt-leftt));
       vertices[i][1] = (vertices[i][1] - topp) * (height/(bottomm-topp));
     }   
   }
  
   
  //Draw all line segments
  for (let i = 0; i < vertices.length; i++) {
     line(vertices[i][0], vertices[i][1],vertices[i+1][0], vertices[i+1][1]);
     i++;
  }
  shapeBoolean = 0;
  vertices = [];
}

function Vertex(x, y, z) {
 if (shapeBoolean) {
     vertices.push([x,y,z,1]);
   }
}

function Perspective(field_of_view, near, far) {
  let rad = radians(field_of_view);
  projection = 1;
  nearr = near;
  farr = far;
  k = tan((rad/2));
}

function Ortho (left, right, bottom, top, near, far) {
   projection = 2;
   leftt = left;
   rightt = right;
   bottomm = bottom;
   topp = top;
   nearr = near;
   farr = far;
}

//***************1A*********************//
let tMatrix = []; //transformation matrix
let tStack = []; //transformation matrix stack

function Init_Matrix() {
  tStack = [];
  tMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]; //sets the transformation matrix to 4x4 identity matrix
}

function Translate(x, y, z) {
  let translation = [[1,0,0,x],[0,1,0,y],[0,0,1,z],[0,0,0,1]]; //creates translation matrix
  tStack.push(translation); //pushes translation matrix onto matrix stack
}

function Scale(x, y, z) {
  let scale = [[x,0,0,0],[0,y,0,0],[0,0,z,0],[0,0,0,1]]; //creates scale matrix
  tStack.push(scale); //pushes scale matrix onto matrix stack
}

function RotateX(theta) {
  let radians = theta * PI/180;  //converts degrees to radians
  //creates rotation matrix
  let rotation = [[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,1]]; 
  rotation[1][1] = cos(radians);  
  rotation[2][2] = cos(radians);
  rotation[1][2] = -sin(radians);
  rotation[2][1] = sin(radians);
  tStack.push(rotation); //pushes rotation matrix onto matrix stack
}

function RotateY(theta) {
  let radians = theta * PI/180; //converts degrees to radians
  //creates rotation matrix
  let rotation = [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,1]];
  rotation[0][0] = cos(radians);
  rotation[2][2] = cos(radians);
  rotation[0][2] = sin(radians);
  rotation[2][0] = -sin(radians);
  tStack.push(rotation); //pushes rotation matrix onto matrix stack
}

function RotateZ(theta) {
  let radians = theta * PI/180; //converts degrees to radians
  //creates rotation matrix
  let rotation = [[0,0,0,0],[0,0,0,0],[0,0,1,0],[0,0,0,1]];
  rotation[0][0] = cos(radians);
  rotation[1][1] = cos(radians);
  rotation[0][1] = -sin(radians);
  rotation[1][0] = sin(radians);
  tStack.push(rotation); //pushes rotation matrix onto matrix stack
}

function Print_Matrix() {
  clearStack();
  for (let row = 0; row < tMatrix.length; row++) {
    let printLine = "";
    for (let col = 0; col < tMatrix[0].length; col++) {
      printLine = printLine + tMatrix[row][col] + " ";
    }
    console.log(printLine);
  }
  console.log("\n");
}

function Multiply_Matrix(m, t) { // performs t x m 
  let product = new Array(t.length);
  for (let row = 0; row < t.length; row++) {
    product[row] = new Array(m[0].length);
    for (let col = 0; col < m[0].length; col++) {
      product[row][col] = 0;
        for (let i = 0; i < t[0].length; i++) {
          product[row][col] += t[row][i] * m[i][col];
        }
    }
  }
  return product;
}

function Multiply_Vector(v, m) { //performs m x v
  let product = [];
  for (let row = 0; row < m.length; row++) {
      sum = 0;
    for (let i = 0; i < v.length; i++) {
      sum += m[row][i] * v[i];
    }
    product.push(sum);
  }
  return product;
}

function clearStack() {
  tMatrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
  let i = tStack.length - 1;
  while(i >= 0) {
    tMatrix = Multiply_Matrix(tMatrix, tStack[i]);
    i--;
  }
}
