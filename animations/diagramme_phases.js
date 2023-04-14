const m4 = twgl.m4;
const v3 = twgl.v3;
const gl = document.querySelector("#glcanvas").getContext("webgl",{
  alpha: false  
});

const nPointsIsotherme = 200;

const up = [0, 1, 0];

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const programInfoLine = twgl.createProgramInfo(gl, ["vs", "line_fs"]);

var bufferInfo;

var lineArrays = {
  position: { numComponents: 3, data: [0,0,0, 1,1,1], },
  indices:  { numComponents: 2, data: [0,1],},
};
const lineBufferInfo = twgl.createBufferInfoFromArrays(gl, lineArrays);

var isothermeArrays = {
  position : {numComponents:3, data:[]},
  indices : {numComponents:2, data:[]},
}

var isothermeBufferInfo;
var bufferInfos = {};


var state = {
    mouse:{
      lastX:0,
      lastY:0,
      dragging:false,
    },
    touch:{
      identifier:null,
      lastX:0,
      lastY:0,
    },
    angle: {
        x: 0,
        y: 0,
      },
  eye: [-10, 1, 0],
  target: [1, 1, 0],
  };


  toDraw = {
    'liquide':{'couleur':chroma('red').gl(),type:gl.TRIANGLES, program:programInfo}, 
    'vapeur':{'couleur':chroma('green').gl(),type:gl.TRIANGLES, program:programInfo}, 
    'solide':{'couleur':chroma('blue').gl(),type:gl.TRIANGLES, program:programInfo},
    'liquide-solide':{'couleur':chroma('yellow').darken(3).gl(),type:gl.TRIANGLES, program:programInfo},
    'liquide-vapeur':{'couleur':chroma('purple').gl(),type:gl.TRIANGLES, program:programInfo},
    'supercritique':{'couleur':chroma('cyan').gl(),type:gl.TRIANGLES, program:programInfo},
    'solide-vapeur':{'couleur':chroma('orange').gl(),type:gl.TRIANGLES, program:programInfo},

    'txtSolideGaz':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtSolide':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtSolideLiquide':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtGaz':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtSupercritique':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtLiquideGaz':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtLiquide':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},

    'fond':{'couleur':chroma('white').gl(),type:gl.TRIANGLES, program:programInfo},

    'axeV':{'couleur':chroma('black').gl(),type:gl.TRIANGLES, program:programInfo},
    'axeT':{'couleur':chroma('black').gl(),type:gl.TRIANGLES, program:programInfo},
    'axeP':{'couleur':chroma('black').gl(),type:gl.TRIANGLES, program:programInfo},

    'txtV':{'couleur':chroma('black').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtT':{'couleur':chroma('black').gl(),type:gl.TRIANGLES, program:programInfo},
    'txtP':{'couleur':chroma('black').gl(), type:gl.TRIANGLES, program:programInfo},

    'crb_rosee':{'couleur':chroma('white').gl(), type:gl.LINES, program:programInfoLine},
    'crb_ebul':{'couleur':chroma('yellow').gl(), type:gl.LINES, program:programInfoLine},

    'isotherme':{'couleur':chroma('black').gl(), type:gl.LINES, program:programInfoLine},
  };

const tempSlider = document.querySelector("#temperature");


const uniforms = {
  u_lightWorldPos: [-5, 4, 1],
  u_lightColor: [1, 1, 1, 1],
  u_ambient: [0.2, 0.2, 0.2, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 30,
  u_specularFactor: 0.3,
  u_diffuse: [1,1,1,1],
  //u_opacity: 1.0,
};

//lightBI = twgl.primitives.createSphereBufferInfo(gl, 0.2, 12, 12);
gl.lineWidth(3);

gl.canvas.onmousedown = mousedown;
gl.canvas.ontouchstart = touchstart;
gl.canvas.onmouseup = mouseup;
gl.canvas.ontouchend = touchend;
gl.canvas.onmousemove = mousemove;
gl.canvas.ontouchmove = touchmove;


function temperatureChanged(e){
  calcIsothermeArray(e.target.value);
}
tempSlider.addEventListener('input', temperatureChanged);


function createIsothermeBufferInfo(){
  for(var i=0; i<nPointsIsotherme; i++){
    isothermeArrays.indices.data.push(i);
    if((i>0) && (i<nPointsIsotherme-1))
      isothermeArrays.indices.data.push(i);
  }
  isothermeArrays.position.data = Array(nPointsIsotherme*3).fill(0);
  isothermeBufferInfo = twgl.createBufferInfoFromArrays(gl, isothermeArrays);
  bufferInfos['isotherme'] = isothermeBufferInfo;
}


function calcIsothermeArray(temp){
  var vmin = -5;
  var vmax = 5;
  var x = temp;
  isothermeArrays.position.data.length = 0;
  for(var i=0; i<nPointsIsotherme; i++){
    var z = vmin+i*(vmax-vmin)/nPointsIsotherme;
    var coord = coordinatesOnSurface(v3.create(x,5,z));
    isothermeArrays.position.data.push(coord[0]-0.1);
    //isothermeArrays.position.data.push(temp);
    isothermeArrays.position.data.push(coord[1]+0.1);
    //isothermeArrays.position.data.push(3);
    isothermeArrays.position.data.push(coord[2]+0.1);
    //isothermeArrays.position.data.push(z);
  }

  twgl.setAttribInfoBufferFromArray(gl, isothermeBufferInfo.attribs.position, isothermeArrays.position);
}

function coordinatesOnSurface(point){
  indices = data['total'].indices;
  position = data['total'].position;
  var px = point[0];
  var py = point[1];
  var pz = point[2];
  for(var i=0; i<indices.length; i+=3){
    var ind1 = indices[i];
    var ind2 = indices[i+1];
    var ind3 = indices[i+2];
    var p0x = position[3*ind1];
    var p0y = position[3*ind1+1];
    var p0z = position[3*ind1+2];
    var p1x = position[3*ind2];
    var p1y = position[3*ind2+1];
    var p1z = position[3*ind2+2];
    var p2x = position[3*ind3];
    var p2y = position[3*ind3+1];
    var p2z = position[3*ind3+2];
    var Area = 0.5 *(-p1z*p2x + p0z*(-p1x + p2x) + p0x*(p1z - p2z) + p1x*p2z);
    var s = 1/(2*Area)*(p0z*p2x - p0x*p2z + (p2z - p0z)*px + (p0x - p2x)*pz);
    var t = 1/(2*Area)*(p0x*p1z - p0z*p1x + (p0z - p1z)*px + (p1x - p0x)*pz);
    if((s>=0) && (t>=0) && (1-s-t>=0)){
      return v3.create(
        p0x+(p1x-p0x)*s+(p2x-p0x)*t,
        p0y+(p1y-p0y)*s+(p2y-p0y)*t,
        p0z+(p1z-p0z)*s+(p2z-p0z)*t,
      )
    }
  }
  return point ;

}


function diagrammePV(){
anime({
  targets: state.angle,
  x: 0,
  y: 0,
  easing: 'spring(0.2,100, 7, 0)',
  duration:100,
});
}

function diagrammePT(){
anime({
  targets: state.angle,
  x: 0,
  y: -90*Math.PI/180,
  easing: 'spring(0.2,100, 7, 0)',
  duration:100,
});
}

 function mousedown(event) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    // If we're within the rectangle, mouse is down within canvas.
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      state.mouse.lastX = x;
      state.mouse.lastY = y;
      state.mouse.dragging = true;
    }
  }

  function touchstart(event){
    console.log('touchstart');
    event.preventDefault();
    var touches = event.changedTouches;
    if(state.touch.identifier == null){
      state.touch.identifier = touches[0].identifier;
      state.touch.lastX = touches[0].pageX;
      state.touch.lastY = touches[0].pageY;
    }
  }

  function touchend(event) {
    event.preventDefault();
    console.log('touchend');
    var touches = event.changedTouches;
    for(var j = 0; j < touches.length; j++) {
        if(state.touch.identifier == touches[j].identifier){
          state.touch.identifier = null;
        }
    }
  }

  function touchmove(event) {
    event.preventDefault();
    console.log('touchmove');
    var touches = event.changedTouches;

    for(var j = 0; j < touches.length; j++) {
      if(state.touch.identifier == touches[j].identifier){
        var factor = 3/gl.canvas.height;
        var dx = factor*(touches[j].pageX - state.touch.lastX);  /* x-distance moved since touchstart */
        var dy = factor*(touches[j].pageY - state.touch.lastY);  /* y-distance moved since touchstart */
        state.touch.lastX = touches[j].pageX;
        state.touch.lastY = touches[j].pageY;

        // update the latest angle
        //state.angle.x = state.angle.x + dy;
        state.angle.y = state.angle.y + dx;
        if(state.angle.y<-90*Math.PI/180) state.angle.y=-90*Math.PI/180;
        if(state.angle.y>0) state.angle.y=0;
      }
    }
  }

  function mouseup(event) {
    state.mouse.dragging = false;
  }

  function mousemove(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (state.mouse.dragging) {
      // The rotation speed factor
      // dx and dy here are how for in the x or y direction the mouse moved
      var factor = 3/gl.canvas.height;
      var dx = factor * (x - state.mouse.lastX);
      var dy = factor * (y - state.mouse.lastY);

      // update the latest angle
      //state.angle.x = state.angle.x + dy;
      state.angle.y = state.angle.y + dx;
      if(state.angle.y<-90*Math.PI/180) state.angle.y=-90*Math.PI/180;
      if(state.angle.y>0) state.angle.y=0;
    }
    // update the last mouse position
    state.mouse.lastX = x;
    state.mouse.lastY = y;
  }

function loadModels(){
  //const fetchPromise = fetch('./test.obj');
  const fetchPromise = fetch('./diagramme_etats.obj');

  fetchPromise.then((response) => {
    textPromise = response.text();
    textPromise.then((txt) => {
      objFetched(txt);
    });
  });
}
var data;
function objFetched(txt){
  //console.log(txt);
  data = parseOBJ(txt);

  bufferInfos = {};
  for(let k in data){
    bufferInfos[k] = twgl.createBufferInfoFromArrays(gl, {
    position:data[k]['position'], 
    indices:data[k]['indices'],
    normal:data[k]['normal'],
  });
  }
  createIsothermeBufferInfo();
  calcIsothermeArray(0);
  requestAnimationFrame(render);
}

function parseOBJ(text) {

  var currentObject = null;
  const objects = {};
  // same order as `f` indices

  // same order as `f` indices
  let normalData = [] ;  // normals
  let basePos = 1;
  let baseNorm = 1;

  function addVertex(vert) {
    const ptn = vert.split('/');
    let iVert = parseInt(ptn[0])-basePos;
    let iNorm = parseInt(ptn[2])-baseNorm;
    currentObject['indices'].push(iVert);
    currentObject['normal'][3*iVert] = normalData[iNorm][0];
    currentObject['normal'][3*iVert+1] = normalData[iNorm][1];
    currentObject['normal'][3*iVert+2] = normalData[iNorm][2];
  }

  const keywords = {
    o(parts) {
      objects[parts[0]] = {};
      //console.log(parts[0]);
      if(currentObject != null){
        baseNorm += normalData.length;
        basePos += currentObject['position'].length/3;
        //console.log(baseNorm);
        //console.log(basePos);
      }
      currentObject = objects[parts[0]];
      currentObject['position']=[];
      currentObject['indices']=[];
      currentObject['texcoord'] = [];
      currentObject['normal'] = [];
      normalData.length =0;

    },
    v(parts) {
      currentObject['position'].push(...parts.map(parseFloat));
      currentObject['normal'].push(0,0,0);
    },
    vn(parts) {
      normalData.push(parts.map(parseFloat))
      //currentObject['normal'].push(...parts.map(parseFloat));
    },
    vt(parts) {
      currentObject['texcoord'].push(...parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
    l(parts) {
      const numLines = parts.length - 1;
      for (let li = 0; li < numLines; ++li) {
        let iVert1 = parseInt(parts[0])-basePos;
        let iVert2 = parseInt(parts[1])-basePos;
        currentObject['indices'].push(iVert1);
        currentObject['indices'].push(iVert2);
      }
    },
  };
  var parts;
  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    parts = line.split(/\s+/);
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
      continue;
    }
    handler(parts, unparsedArgs);
  }
  return objects;
}

function elementEstVisible(element){
  const rect = element.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top  > gl.canvas.clientHeight ||
    rect.right  < 0 || rect.left > gl.canvas.clientWidth) {
    return false;  // it's off screen
  } else {
    return true;
  }
}

function getElementSize(element){
  const rect = element.getBoundingClientRect();
  const width  = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  return [width, height]
}

function limitCanvasElement(element){
  const rect = element.getBoundingClientRect();
  const width  = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  const left   = rect.left;
  const bottom = gl.canvas.clientHeight - rect.bottom - 1;

  gl.viewport(left, bottom, width, height);
  gl.scissor(left, bottom, width, height);
}


function render_cube(time){
  // move the canvas to top of the current scroll position
  

  var width = gl.canvas.width;
  var height = gl.canvas.height;

  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 60 * Math.PI / 180;
  const aspect = width/height;
  const zNear = 0.5;
  const zFar = 100;
  //const projection = m4.perspective(fov, aspect, zNear, zFar);
  var projection;
  if(aspect>=1){ 
    projection = m4.ortho(-5*aspect, 5*aspect, -5, 5, 5, 100);
  } else {
    projection = m4.ortho(-5, 5, -5/aspect, 5/aspect, 5, 100);
  }

  const camera = m4.lookAt(state.eye, state.target, state.target, up) ;

  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);

  uniforms.u_viewInverse = camera;
  var world = m4.identity(); 
  //world = m4.rotateY(world, time*0.1);
  world = m4.rotateX(world, state.angle.x);
  world = m4.rotateY(world, state.angle.y);
  uniforms.u_world = world;
  uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
  uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

  for(let k in bufferInfos){
    if(k in toDraw){
      //gl.useProgram(toDraw[k]['program']);
      gl.useProgram(toDraw[k]['program'].program);
      twgl.setBuffersAndAttributes(gl, toDraw[k]['program'], bufferInfos[k]);
      uniforms.u_diffuse = toDraw[k]['couleur'];
      twgl.setUniforms(toDraw[k]['program'], uniforms);
      gl.drawElements(toDraw[k]['type'], bufferInfos[k].numElements, gl.UNSIGNED_SHORT, 0);
    }
  }
}


function render(time) {
  time *= 0.001;

  twgl.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_FACE);
  //gl.enable(gl.BLEND);

  render_cube(time);
  requestAnimationFrame(render);
}

loadModels();
//requestAnimationFrame(render);
