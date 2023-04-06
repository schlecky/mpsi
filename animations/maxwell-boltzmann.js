const m4 = twgl.m4;
const v3 = twgl.v3;
const gl = document.querySelector("#glcanvas").getContext("webgl",{
  alpha: false  
});

const colorScale = chroma.scale(['blue', 'red']).mode('lch');
const partCoul = chroma('blue').brighten().gl();
const partCoulSel = chroma('red').brighten().gl();
const rayon = 0.04;
const nParticules = 500;
const eye = [2, 4, -6];
const up = [0, 1, 0];

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const programInfo2D = twgl.createProgramInfo(gl, ["vs2d", "fs2d"]);

const sphereBufferInfo = twgl.primitives.createSphereBufferInfo(gl, rayon, 12, 12);

const xmin=-1, xmax=1, ymin=-1, ymax=1, zmin=-1, zmax=1;

var cubeArrays = {
  position: { numComponents: 3, data: [xmin,ymin,zmin, xmax,ymin,zmin, xmax,ymax,zmin, xmin,ymax,zmin, xmin,ymin,zmax, xmax,ymin,zmax, xmax,ymax,zmax, xmin,ymax,zmax], },
  indices:  { numComponents: 2, data: [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7],},
};
const cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);

const xmin_z=-0.8, xmax_z=-0.6, ymin_z=0, ymax_z=0.2, zmin_z=-0.1, zmax_z=0.1;
var cubezArrays = {
  position: { numComponents: 3, data: [xmin_z,ymin_z,zmin_z, xmax_z,ymin_z,zmin_z, xmax_z,ymax_z,zmin_z, xmin_z,ymax_z,zmin_z, xmin_z,ymin_z,zmax_z,
    xmax_z,ymin_z,zmax_z, xmax_z,ymax_z,zmax_z, xmin_z,ymax_z,zmax_z], },
  indices:  { numComponents: 2, data: [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7],},
};
const cubezBufferInfo = twgl.createBufferInfoFromArrays(gl, cubezArrays);

var axesArrays = {
  position: { numComponents: 3, data: [0,0,0, 2,0,0, 0,2,0, 0,0,-2], },
  indices:  { numComponents: 2, data: [0, 1, 0, 2, 0, 3],},
};
const axesBufferInfo = twgl.createBufferInfoFromArrays(gl, axesArrays);

var rectBI = twgl.primitives.createPlaneBufferInfo(gl,1); 

var moyenneHisto = false;
var nbMoyenne = 0;
var histoMoy = [];

const lightPosCube = [8, 8, -10];
const lightPosHist = [0, 10, 0];

const uniforms = {
  u_lightWorldPos: [8, 8, -10],
  u_lightColor: [1, 1, 1, 1],
  u_ambient: [0.1, 0.1, 0.1, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 0.1,
  u_diffuse: partCoul,
  //u_opacity: 1.0,
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}

var particules = []
var sumv2 = 0
for(var i=0; i<nParticules; i++){
  part = {};
  part['pos'] = v3.create(rand(-1, 1), rand(-1, 1), rand(-1, 1));
  part['vit'] = v3.create(rand(-1, 1), rand(-1, 1), rand(-1, 1));
  sumv2 += v3.lengthSq(part.vit);
  particules.push(part);
}
var temp = sumv2/nParticules/3;


function chkMoyenneChange(evt){
  const chk = document.querySelector("#chkMoyenne");
  if(chk.checked){
    moyenneHisto = true;
    nbMoyenne = 0;
  } else {
    moyenneHisto = false;
    nbMoyenne = 0;
  }
}


function initPos(particules){
  for(var i=0; i<particules.length; i++){
    particules[i].pos = v3.create(rand(-0.3, 0.3), rand(-0.3, 0.3), rand(-0.3, 0.3));
  }
}
function initVit(particules){
  for(var i=0; i<particules.length; i++){
    particules[i].vit = v3.create(1 + rand(-0.01, 0.01), rand(-0.01, 0.01), rand(-0.01, 0.01));
  }
}
function refroidir(particules){
  for(var i=0; i<particules.length; i++){
    particules[i].vit = v3.mulScalar(particules[i].vit, 0.8);
  }
}

function rechauffer(particules){
  for(var i=0; i<particules.length; i++){
    particules[i].vit = v3.mulScalar(particules[i].vit, 1.2);
  }
}

function calcColorVit(vitesse){
  v = v3.length(vitesse);
  vmax = 2;
  var color = colorScale(v/vmax);
  return color.gl();
}

function updateParticules(particules){
  for(var i=0; i<particules.length; i++){
    particules[i].pos = v3.add(particules[i].pos, v3.mulScalar(particules[i].vit,0.01));
    if(particules[i].pos[0]<xmin){
      particules[i].vit[0] = -particules[i].vit[0];
      particules[i].pos[0] += 2*(xmin-particules[i].pos[0]);
    }
    if(particules[i].pos[1]<ymin){
      particules[i].vit[1] = -particules[i].vit[1];
      particules[i].pos[1] += 2*(xmin-particules[i].pos[1]);
    }
    if(particules[i].pos[2]<xmin){
      particules[i].vit[2] = -particules[i].vit[2];
      particules[i].pos[2] += 2*(xmin-particules[i].pos[2]);
    }
    if(particules[i].pos[0]>xmax){
      particules[i].vit[0] = -particules[i].vit[0];
      particules[i].pos[0] -= 2*(particules[i].pos[0]-xmax);
    }
    if(particules[i].pos[1]>ymax){
      particules[i].vit[1] = -particules[i].vit[1];
      particules[i].pos[1] -= 2*(particules[i].pos[1]-ymax);
    }
    if(particules[i].pos[2]>zmax){
      particules[i].vit[2] = -particules[i].vit[2];
      particules[i].pos[2] -= 2*(particules[i].pos[2]-zmax);
    }
    // Collisions
    for(var j=i+1; j<particules.length; j++){
      var p1 = particules[i];
      var p2 = particules[j];
      var d = v3.distance(p1.pos, p2.pos);
      if(v3.distance(p1.pos, p2.pos)<2*rayon){
        var u = v3.divScalar(v3.subtract(p2.pos, p1.pos),d);
        var v1perp =  v3.mulScalar(u,v3.dot(u, p1.vit));
        var v2perp =  v3.mulScalar(u,v3.dot(u, p2.vit));
        var vp1 = v3.add(v3.subtract(p1.vit,v1perp), v2perp); 
        var vp2 = v3.add(v3.subtract(p2.vit,v2perp), v1perp); 
        p1.vit = vp1;
        p2.vit = vp2;
        p1.pos = v3.add(p1.pos, v3.mulScalar(u, -rayon));
      }
    }
  }
}

function calcHistogramme(){
  const nBin = 15;
  const vmin = 0;
  const vmax = 2;
  var sumu2 = 0;
  var liste = new Array(nBin).fill(0);
  for(var i=0; i<particules.length; i++){
    var v = v3.length(particules[i].vit);
    sumu2 += v*v;
    var iBin = Math.floor((v-vmin)/(vmax-vmin)*nBin) 
    if((iBin>=0) && (iBin<nBin))
      liste[iBin]++;
  }
  temp = sumu2/nParticules/3;
  if(!moyenneHisto)
    return liste;
  else{
    if(nbMoyenne == 0){
      histoMoy = liste;
      nbMoyenne = 1;
      return liste;
    }
    else{
      for(var i=0; i<histoMoy.length; i++){
        histoMoy[i] = (nbMoyenne*histoMoy[i]+liste[i])/(nbMoyenne+1);
      }
      nbMoyenne++;
      return histoMoy;
    }
  }
}

function estDansCube(particule){
  return (particule.pos[0]>xmin_z) && (particule.pos[0]<xmax_z) &&
    (particule.pos[1]>ymin_z) && (particule.pos[1]<ymax_z) &&
    (particule.pos[2]>zmin_z) && (particule.pos[2]<zmax_z);
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


function render_mb_dist(gl, nParticules, T, vmin, vmax){
  var lv=[];
  var ln=[];
  const nPts = 50;
  const arrays = {
    position: {numComponents: 2, data:[]},
    //position: {numComponents: 2, data:[-1,-1,1,1]},
  };
  nMax = nParticules/15*4;
  for(var i=0; i<nPts; i++){
    var v = vmin+(vmax-vmin)/(nPts-1)*i;
    var n = nParticules*Math.sqrt(2/Math.PI)*Math.pow(T,-3/2)*Math.pow(v,2)*Math.exp(-Math.pow(v,2)/(2*T))*(vmax-vmin)/15;
    lv.push(v);
    ln.push(n);
    arrays.position.data.push(-1+2*i/(nPts-1),-1+2*n/nMax);
    //arrays.position.data.push(-1, -1, 1, 1);
    if((i>0) && (i<nPts-1))
      arrays.position.data.push(-1+2*i/(nPts-1),-1+2*n/nMax);
      //arrays.position.data.push(-1, -1, 1, 1);
  }
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  gl.useProgram(programInfo2D.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  gl.lineWidth(2);
  twgl.drawBufferInfo(gl, bufferInfo, gl.LINES);
}

function render_hist(){
  // move the canvas to top of the current scroll position
  gl.canvas.style.transform = `translateY(${window.scrollY}px)`;
  
  element = document.querySelector("#histo_vitesses #graph")
  
  const rect = element.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top  > gl.canvas.clientHeight ||
    rect.right  < 0 || rect.left > gl.canvas.clientWidth) {
    return;  // it's off screen
  }

  const width  = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  const left   = rect.left-8;
  const bottom = gl.canvas.clientHeight - rect.bottom+1;

  gl.viewport(left, bottom, width, height);
  gl.scissor(left, bottom, width, height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  histo = calcHistogramme();

  const nBin = histo.length;
  const barWidth = 1/nBin;
  const nMax = nParticules/nBin*4;


  const aspect = width/height;
  const projection = m4.ortho(0, 1, 0, 1, 0, 1000);
  const camera = m4.lookAt([0,1,0], [0,0,0], [0,0,-1]);
  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);
  uniforms.u_lightWorldPos = lightPosHist;

  for(var i=0; i<nBin; i++){
    //var rectBI = twgl.primitives.createPlaneBufferInfo(gl,1, 1); 
    uniforms.u_diffuse = calcColorVit([i/nBin*2.0, 0, 0]);
    uniforms.u_viewInverse = camera;
    //var world = m4.translate(m4.identity(), v3.create(i*barWidth*10, 0, 1)) 
    var world = m4.translate(m4.identity(), v3.create(i*barWidth+barWidth/2, 0, -histo[i]/nMax/2)) 
    //var world = m4.translate(m4.identity(), v3.create(+barWidth/2, 0, -histo[i]/nMax/2)) 
    world = m4.scale(world,[barWidth, 1, histo[i]/nMax]);
    uniforms.u_world = world;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, rectBI);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, rectBI.numElements, gl.UNSIGNED_SHORT, 0);
  }
  render_mb_dist(gl, nParticules, temp, 0, 2);
}


function render_cube(time){
  // move the canvas to top of the current scroll position
  gl.canvas.style.transform = `translateY(${window.scrollY}px)`;
  
  element = document.querySelector("#box_particules")
  
  if (!elementEstVisible(element)) {
    return;  // it's off screen
  }

  limitCanvasElement(element)

  var [width, height] = getElementSize(element)
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 30 * Math.PI / 180;
  const aspect = width/height;
  const zNear = 0.5;
  const zFar = 10;
  const projection = m4.perspective(fov, aspect, zNear, zFar);
  const target = [0, 0, 0];

  const camera = m4.lookAt(eye, target, up) ;

  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);
  uniforms.u_lightWorldPos = lightPosCube;


  for(var i=0; i<particules.length; i++){
    uniforms.u_diffuse = calcColorVit(particules[i].vit);
    uniforms.u_viewInverse = camera;
    var world = m4.rotateY(m4.identity(), time*0.1);
    var world = m4.translate(world, particules[i].pos) 
    uniforms.u_world = world;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, sphereBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
  }

  uniforms.u_viewInverse = camera;
  var world = m4.identity(); 
  world = m4.rotateY(world, time*0.1);
  uniforms.u_world = world;
  uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
  uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);

  uniforms.u_diffuse = [1,1,1,0.2];
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElements(gl.LINES, cubeBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}

function render_vitesses(time){
  // move the canvas to top of the current scroll position
  gl.canvas.style.transform = `translateY(${window.scrollY}px)`;
  
  element = document.querySelector("#espace_vitesses")
  
  if (!elementEstVisible(element)) {
    return;  // it's off screen
  }

  limitCanvasElement(element);
  var [width, height] = getElementSize(element)
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 40 * Math.PI / 180;
  const aspect = width/height;
  const zNear = 0.5;
  const zFar = 10;
  const projection = m4.perspective(fov, aspect, zNear, zFar);
  const target = [0, 0, 0];

  const camera = m4.lookAt(eye, target, up) ;

  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);

  uniforms.u_lightWorldPos = lightPosCube;

  for(var i=0; i<particules.length; i++){
    uniforms.u_viewInverse = camera;
    //var world = m4.rotateY(m4.identity(), time*0);
    var world = m4.identity();
    var world = m4.translate(world, particules[i].vit);
    uniforms.u_diffuse = calcColorVit(particules[i].vit);
    uniforms.u_world = world;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);
    //uniforms.u_opacity = 1;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, sphereBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
  }

  uniforms.u_viewInverse = camera;
  var world = m4.identity(); 
  //world = m4.rotateY(world, time*0.1);
  uniforms.u_world = world;
  uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
  uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, axesBufferInfo);

  uniforms.u_diffuse = [0.2,0.2,0.2,1];
  gl.lineWidth(2);
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElements(gl.LINES, axesBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}


function render(time) {
  time *= 0.001;

  gl.canvas.style.transform = `translateY(${window.scrollY}px)`;
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  gl.disable(gl.SCISSOR_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  //gl.enable(gl.BLEND);
  gl.enable(gl.SCISSOR_TEST);



  updateParticules(particules);
  render_cube(time);
  render_vitesses(time);
  render_hist();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
