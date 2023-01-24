var xmin = 0;
var xmax = 1;
var ymin = 0;
var ymax = 3;
var last_t = performance.now();
var t = 0;
var nbPtsX = 1000;
var dx = (xmax-xmin)/(nbPtsX-1);

var tmin = 0;
var tmax = 1;
var nbPtsT = 100;
var dt = (tmax-tmin)/(nbPtsT-1);
var lyt = []
var lt = []

var c=0.5;
var running = false;

var el_InputC;
var el_InputXmin;
var el_InputXmax;
var el_InputTmin;
var el_InputTmax;
var el_Slider;
var el_LabelT;




class Graph{
  constructor(stage, x, y, width, height){
    this.stage = stage;
    this.stage.enableMouseOver(20);
    this.width = width-2;
    this.height = height-2;
    this.x = x-2;
    this.y = y+2;
    
    this.margeGauche = 60;
    this.margeDroite = 10;
    this.margeBas = 60;
    this.margeHaut = 10;


    this.xRect = this.x+this.margeGauche;
    this.yRect = this.y+this.margeHaut;
    this.wRect = this.width-this.margeGauche-this.margeDroite;
    this.hRect = this.height-this.margeBas-this.margeHaut;

    this.dispCross = false;

    this.xmin = 0;
    this.xmax = 10; 
    this.ymin = 0;
    this.ymax = 5;

    this.xTickNum = 11;
    this.yTickNum = 11;

    this.xData = [];
    this.yData = [];
  
    this.xLabels = [];
    this.yLabels = [];

    this.xTitre = "Axe x";
    this.yTitre = "Axe y";

    this.vCursors = [];

    this.dataLines = [];
    this.click_cb;
    this.pressmove_cb;
    this.move_cb;

    this.createGrid();
    this.createTitres();

    this.cross = new createjs.Shape();
    this.crossText = new createjs.Text();
    this.crossText.textAlign = "right";
    this.stage.addChild(this.cross);
    this.stage.addChild(this.crossText);
  }

  setTitreX(titre){
    this.xTitre = titre;
    this.titreXText.text = titre;
    this.stage.update();
  }

  setTitreY(titre){
    this.yTitre = titre;
    this.titreYText.text = titre;
    this.stage.update();
  }

  drawCross(x, y){
    var p = this.coord2screen([x,y]);
    this.cross.graphics.clear().setStrokeStyle(1).beginStroke("black").mt(this.xRect, p[1]).lt(this.xRect+this.wRect, p[1]);
    this.cross.graphics.mt(p[0], this.yRect).lt(p[0], this.yRect+this.hRect);
    this.crossText.text = "("+x.toFixed(2)+","+y.toFixed(2)+")";
    this.crossText.x=p[0]-3;
    this.crossText.y=p[1]+3;
    this.stage.update();
  }

  createTitres(){
    this.titreXText = new createjs.Text(this.xTitre, "20px Arial");
    this.titreYText = new createjs.Text(this.yTitre, "20px Arial");
    this.titreYText.rotation = -90;
    this.titreYText.textAlign = "center";
    this.titreXText.textAlign = "center";
    this.titreYText.x =10;
    this.titreYText.y = this.hRect/2;
    this.titreXText.y = this.hRect+20+this.margeHaut;
    this.titreXText.x = this.margeGauche+this.wRect/2;
    this.stage.addChild(this.titreXText);
    this.stage.addChild(this.titreYText);
  }

  createGrid(){
    this.rect = new createjs.Shape();
    this.rect.graphics.setStrokeStyle(3).beginFill("white").beginStroke("black").drawRect(this.xRect, this.yRect, this.wRect, this.hRect);
    this.rect.on("click",this.onClick.bind(this)); 
    this.rect.on("pressmove",this.onPressMove.bind(this)); 
    this.rect.on("mouseout",(function(evt){this.cross.visible=false;this.crossText.visible=false;this.stage.update()}).bind(this)); 
    this.rect.on("mouseover",(function(evt){this.cross.visible=true;this.crossText.visible=true;this.stage.update()}).bind(this)); 
    this.stage.on("stagemousemove",this.onMove.bind(this)); 
    this.stage.addChild(this.rect);
    this.xLines = new createjs.Shape();
    this.xLines.graphics.beginStroke("gray");
    var dx = this.wRect/(this.xTickNum-1);
    var x = this.xRect;
    var y = this.yRect;
    for(var i=0; i<this.xTickNum; i++){
      this.xLines.graphics.mt(x,y).lt(x, this.yRect+this.hRect);
      var p = this.screen2coord([x,y])
      var text = new createjs.Text(p[0].toFixed(2));
      text.textAlign = "center";
      this.xLabels.push(text);
      text.x = x;
      text.y = this.hRect+9+this.margeHaut;
      this.stage.addChild(text);
      x+=dx;
    }
    this.yLines = new createjs.Shape();
    this.yLines.graphics.beginStroke("gray");
    var dy = this.hRect/(this.yTickNum-1);
    var x = this.xRect;
    var y = this.yRect;
    for(var i=0; i<this.yTickNum; i++){
      this.yLines.graphics.mt(x,y).lt(this.xRect+this.wRect,y);
      var p = this.screen2coord([x,y])
      var text = new createjs.Text(p[1].toFixed(2));
      this.yLabels.push(text);
      text.textAlign = 'right';
      text.textBaseline = 'middle';
      text.x = this.margeGauche-5;
      text.y = y;
      this.stage.addChild(text);
      y+=dy;
    }
    this.stage.addChild(this.xLines);
    this.stage.addChild(this.yLines);

    this.stage.update();
  }

  setYLim(ymin, ymax){
    this.ymin = ymin;
    this.ymax = ymax;
    var dy = this.hRect/(this.yTickNum-1);
    var x = this.xRect;
    var y = this.yRect;
    for(var i=0; i<this.yTickNum; i++){
      var p = this.screen2coord([x,y])
      this.yLabels[i].text = p[1].toFixed(2);
      y+=dy;
    }
  }

  setXLim(xmin, xmax){
    this.xmin = xmin;
    this.xmax = xmax;
    var dx = this.wRect/(this.xTickNum-1);
    var x = this.xRect;
    var y = this.yRect;
    for(var i=0; i<this.xTickNum; i++){
      var p = this.screen2coord([x,y])
      this.xLabels[i].text = p[0].toFixed(2);
      x+=dx;
    }
  }

  addVCursor(x){
    var line = new createjs.Shape();
    this.vCursors.push(line);
    this.setVCursor(this.vCursors.length-1, x);
    this.stage.addChild(line);
  }

  setVCursor(n,x){
    if(n>=this.vCursors.length){return;}
    var line = this.vCursors[n];
    line.graphics.clear();
    line.graphics.setStrokeStyle(2).beginStroke("red");
    var p1 = this.coord2screen([x, this.ymin])
    var p2 = this.coord2screen([x, this.ymax])
    line.graphics.mt(p1[0], p1[1]);
    line.graphics.lt(p2[0], p2[1]);
    this.stage.update();
  }
 
  setVCursorVisiblity(n, vis){
    this.vCursors[n].visible = vis;
    this.stage.update();
  }
    
  setData(x, y){
    if(x.length != y.length){
      throw Error("x et y n'ont pas la même dimension");
    }
    this.xData = x;
    this.yData = y;
    var dataLine = new createjs.Shape();
    dataLine.graphics.setStrokeStyle(2).beginStroke("black");
    for(var i=0; i<x.length; i++){
      var p = this.coord2screen([x[i], y[i]])
      if(i==0)
        dataLine.graphics.mt(p[0], p[1]);
      else
        dataLine.graphics.lt(p[0], p[1]);
    }
    this.dataLines.push(dataLine);
    this.stage.addChild(dataLine); 
    this.stage.update();
  }

  updateData(x,y,n){
    this.xData = x;
    this.yData = y;
    var line = this.dataLines[n];
    line.graphics.c().setStrokeStyle(3).beginStroke("black");
    for(var i=0; i<x.length; i++){
      var p = this.coord2screen([x[i], y[i]])
      if(i==0)
        line.graphics.mt(p[0], p[1]);
      else
        line.graphics.lt(p[0], p[1]);
    }
    this.stage.update();
  }
  coord2screen(p){
      var x = this.xRect + (p[0]-this.xmin)*this.wRect/(this.xmax-this.xmin);
      var y = this.yRect + (this.ymax-p[1])*this.hRect/(this.ymax-this.ymin);
      return [x,y];
  }

  screen2coord(p){
      var x = this.xmin + (this.xmax-this.xmin)*(p[0]-this.xRect)/this.wRect;
      var y = this.ymax - (this.ymax-this.ymin)*(p[1]-this.yRect)/this.hRect;
      return [x,y];
  }

  onClick(evt){
    if(this.click_cb){
      this.click_cb(evt.stageX, evt.stageY);
    }
  }

  getInterpolatedY(x){
    if(x<this.xData[0]){
      return 0;
    }
    if(x>this.xData.slice(-1)){
      return 0;
    }
    var i=0;
    while(this.xData[i+1]<x){i++;}
    return this.yData[i]+(x-this.xData[i])/(this.xData[i+1]-this.xData[i])*(this.yData[i+1]-this.yData[i]);
  }

  onPressMove(evt){
    if(this.pressmove_cb){
      this.pressmove_cb(evt.stageX, evt.stageY);
    }
  }

  onMove(evt){
    if(this.move_cb){
      this.move_cb(evt.stageX, evt.stageY);
    }
    var p = this.screen2coord([evt.stageX, evt.stageY]);
    this.drawCross(p[0], p[1]);
  }

  setClickCb(fun){
    this.click_cb = fun;
  }
  setPressMoveCb(fun){
    this.pressmove_cb = fun;
  }
  setMoveCb(fun){
    this.move_cb = fun;
  }
}

function init(){
  setupElements()
  graphX = new Graph(stageGraphX, 0, 0, 800, 400);
  graphX.setYLim(-2, 2);
  graphX.setXLim(xmin, xmax);
  graphX.setData([0,2,3, 7, 10], [1, 2, 3, 4, 5]);
  graphX.setTitreX("x (m)");
  graphX.setTitreY("y (m)");

  graphT = new Graph(stageGraphT, 0, 0, 800, 200);
  graphT.setPressMoveCb(graphTPressMove);
  graphT.setTitreX("t (s)");
  graphT.setTitreY("y (m)");
  initGraphT();
  last_t = performance.now();
  updateGraph();
}

function graphTPressMove(x,y){
  p = graphT.screen2coord([x,y]);
  it = Math.floor((p[0]+dt/2-tmin)*(nbPtsT-1)/(tmax-tmin))
  lyt[it] = p[1];
  graphT.updateData(lt, lyt, 0);
}


function initGraphT(){
  graphT.setYLim(-1, 1);
  graphT.setXLim(tmin, tmax);
  var dt = (tmax-tmin)/(nbPtsT-1);
  var mt = tmin;
  for(var i=0; i<nbPtsT; i++){
    lt.push(mt);
    lyt.push(0);
    mt += dt;
  }
  graphT.setData(lt, lyt);
  graphT.addVCursor(0);
  graphT.setVCursorVisiblity(0, false)
}

function updateGraph(){ 
  t += performance.now()-last_t;
  last_t = performance.now();
  updateSliderT(t/1000);
  updateLabelT(t/1000);
  updateGraphAtT(t);
  if(t/1000>xmax/c+tmax){
    running = false;
    console.log("STOP");
    t=0;
  }
  if(running){
    window.requestAnimationFrame(updateGraph);
  }
}



function updateGraphAtT(t){
  lx = []
  ly = []
  var x = xmin;
  for(var i=0; i<nbPtsX; i++){
    lx.push(x);
    ly.push(graphT.getInterpolatedY(t/1000-x/c));
    x+=dx;
  }
  graphX.updateData(lx,ly, 0);
  if(t/1000<tmax){
    graphT.setVCursorVisiblity(0, true)
    graphT.setVCursor(0, t/1000);
  } else {
    graphT.setVCursorVisiblity(0, false)
  }
}

function updateSliderT(t){
  el_Slider.value = 100.0*t/(tmax+xmax/c);
}

function updateLabelT(t){
  el_LabelT.innerHTML = "t="+t.toFixed(2)+"s";
}

function sliderMoved(val){
  running = false;
  var t2 = val*(tmax+xmax/c)*10;
  updateGraphAtT(t2);
  updateLabelT(t2/1000)
}

function envoyer(){
  running = true;
  last_t = performance.now();
  updateGraph();
  console.log("Envoyer");
}

function setupElements(){
  el_InputC = document.getElementById("cInput");
  el_InputXmax = document.getElementById("xmaxInput");
  el_InputXmin = document.getElementById("xminInput");
  el_InputTmax = document.getElementById("tmaxInput");
  el_InputTmin = document.getElementById("tminInput");
  el_Slider = document.getElementById("tSlider");
  el_LabelT = document.getElementById("tLabel");
}

function changeC(){
  c = el_InputC.value; 
}

function changeXScale(){
  xmin = parseFloat(el_InputXmin.value); 
  xmax = parseFloat(el_InputXmax.value); 
  dx = (xmax-xmin)/(nbPtsX-1);
  graphX.setXLim(xmin,xmax);
  var t2 = el_Slider.value*(tmax+xmax/c)*10;
  updateGraphAtT(t2);
}

function changeTScale(){
  tmin = parseFloat(el_InputTmin.value); 
  tmax = parseFloat(el_InputTmax.value); 
  graphT.setXLim(tmin,tmax);

  var dt = (tmax-tmin)/(nbPtsT-1);
  var mt = tmin;
  lt = []
  lyt = [];
  for(var i=0; i<nbPtsT; i++){
    lt.push(mt);
    lyt.push(graphT.getInterpolatedY(mt));
    mt += dt;
  }
  graphT.updateData(lt, lyt, 0);
}

function setupTD9ex1(){
  el_InputC.value = "3.9";
  changeC();
  el_InputTmin.value = "0";
  el_InputTmax.value = "0.7";
  changeTScale();
  var dt = (tmax-tmin)/(nbPtsT-1);
  var mt = tmin;
  lt = []
  lyt = [];
  for(var i=0; i<nbPtsT; i++){
    lt.push(mt);
    if(mt<0.5/3.9){
      lyt.push(mt/0.5*3.9);
    } else if (mt<2/3.9){
      lyt.push(1-(mt-0.5/3.9)/1.5*3.9);
    } else {
      lyt.push(0);
    }
    mt += dt;
  }
  graphT.updateData(lt, lyt, 0);
  el_InputXmin.value = "0.0";
  el_InputXmax.value = "12";
  changeXScale();
}


function setupTD9ex2(){
  el_InputC.value = "2";
  changeC();
  el_InputTmin.value = "0";
  el_InputTmax.value = "2.2";
  graphT.setYLim(-0.5, 1.5);
  changeTScale();
  var dt = (tmax-tmin)/(nbPtsT-1);
  var mt = tmin;
  lt = []
  lyt = [];
  for(var i=0; i<nbPtsT; i++){
    lt.push(mt);
    if(mt<0.2){
      lyt.push[0];
    } else if(mt<0.4){
      lyt.push((mt-0.2)*1.5/0.2);
    } else if (mt<0.6){
      lyt.push(1.5-(mt-0.4)*1.5/0.2);
    } else if (mt<1.4){
      lyt.push(0);
    } else if(mt<1.5){
      lyt.push((mt-1.4)*1/0.1);
    } else if(mt<1.6){
      lyt.push(1-(mt-1.5)*1/0.1);
    } else {
      lyt.push(0);
    }
    mt += dt;
  }
  graphT.updateData(lt, lyt, 0);
  el_InputXmin.value = "0.0";
  el_InputXmax.value = "12";
  changeXScale();
}
