var acted=0;
var JmolApplet0; // set up in HTML table, below
function readyfunc()
{
  //Jmol.script(JmolApplet0, "select all ; zoom 60;");
};

var planA = false;
var planB = false;
var planC = false;
var planD = false;

var Info = {
	width: "70%",
	height: 500,
	debug: false,
	color: "0xFFFFFF",
	addSelectionOptions: false,
	use: "HTML5",   // JAVA HTML5 WEBGL are all options
	j2sPath: "./j2s", // this needs to point to where the j2s directory is.
	jarPath: "./java",// this needs to point to where the java directory is.
	jarFile: "JmolAppletSigned.jar",
	isSigned: true,
	script: "",
	serverURL: "https://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
	readyFunction: readyfunc,
	disableJ2SLoadMonitor: true,
  disableInitialConsole: true,
  allowJavaScript: true
	//defaultModel: "$dopamine",
	//console: "none", // default will be jmolApplet0_infodiv, but you can designate another div here or "none"
}

function configApplet(){
  Info.height = window.innerHeight;
  $("#appdiv").html(Jmol.getAppletHtml("JmolApplet0", Info))
  Jmol.script(JmolApplet0, "load cfc.cif 1 {333 666 1}; wireframe off;unitcell off;axes off;spacefill 1.3; moveto 0 {-1 1 0}  125");
  Jmol.script(JmolApplet0, "define planA (copper) AND WITHIN(0, PLANE, @{plane(@260,@261,@151)})");
  Jmol.script(JmolApplet0, "select planA; color atoms [xCCA2F3];"); 
  Jmol.script(JmolApplet0, "define planB (copper) AND WITHIN(0, PLANE, @{plane(@149,@39,@64)})");
  Jmol.script(JmolApplet0, "select planB; color atoms [xF3CCA2];"); 
  Jmol.script(JmolApplet0, "define planC (copper) AND WITHIN(0, PLANE, @{plane(@155,@156,@157)})");
  Jmol.script(JmolApplet0, "select planC; color atoms [xA2F3CC];"); 
  Jmol.script(JmolApplet0, "define planD (copper) AND WITHIN(0, PLANE, @{plane(@44,@45,@162)})");
  Jmol.script(JmolApplet0, "select planD; color atoms [xCCA2F3];"); 
  Jmol.script(JmolApplet0, "define mailleCFC (copper) AND (cell=444); ")
  Jmol.script(JmolApplet0, "polyhedra octa @159 to (copper) and WITHIN(2, @159)");
  Jmol.script(JmolApplet0, "polyhedra octa2 @167 to (copper) and WITHIN(2, @167)");
  Jmol.script(JmolApplet0, "polyhedra octa off");
  Jmol.script(JmolApplet0, "polyhedra octa2 off");
  Jmol.script(JmolApplet0, "data \"element_vdw\" 29 1.3; 82 0.4 END \"element_vdw\"");
  Jmol.script(JmolApplet0, "set defaultVDW USER");
  Jmol.script(JmolApplet0, "select all;spacefill 100%");

  Jmol.script(JmolApplet0, "");
  Jmol.script(JmolApplet0, "hide all;"); 
}

function display_tous(){
 Jmol.script(JmolApplet0, "display (planA),(planB),(planC),(planD);select all;color atoms TRANSLUCENT 0;");
}

function mailleCFC(){
  effacer();
  showBBox(true);
  Jmol.script(JmolApplet0, "display mailleCFC;");
}

function display_spheres(){
  Jmol.script(JmolApplet0, "select all;spacefill 100%; wireframe off;");
}
function display_balls(){
  Jmol.script(JmolApplet0, "select all;spacefill 0.5; wireframe off;");
}
        
function disp_plan(plan){
  Jmol.script(JmolApplet0,"display ADD plan"+plan);
}

function hide_plan(plan){ // set up in HTML table, belowunction hide_plan(plan){
  Jmol.script(JmolApplet0,"display REMOVE plan"+plan);
}


function coordinence(){
  effacer();
  Jmol.script(JmolApplet0, "display @1 or (copper AND WITHIN(3.0, @1));"); 
  Jmol.script(JmolApplet0, "select (copper AND WITHIN(3.0, @1)); color atom TRANSLUCENT 0.7"); 
  Jmol.script(JmolApplet0, "select @1; color atom TRANSLUCENT 0.0; halos ON; color HALOS GOLD;"); 
  Jmol.script(JmolApplet0, "select (copper AND WITHIN(3.0, @1) AND not @1);"); 
}

function dispOcta(){
  let dispOcta_script = "display ADD @272;"+
  "display ADD @159;"+
  "polyhedra octa 6 2.0 @159 to (copper) flat edges;"+
  "select @159;"+
  "color polyhedra red translucent 0.4;"+
  "polyhedra octa2 6 2.0 @272 to (copper) flat edges;"+
  "select @272;"+
  "color polyhedra yellow translucent 0.4;";

  Jmol.script(JmolApplet0, dispOcta_script);
}

function hideOcta(){
  Jmol.script(JmolApplet0, "polyhedra octa OFF;"+
  "polyhedra octa2 OFF;"+
  "display REMOVE (atomno=272) OR (atomno=159)");
}

function effacerPlans(){
  var btnPlanA = document.getElementById("btnPlanA");
  var btnPlanB = document.getElementById("btnPlanB");
  var btnPlanC = document.getElementById("btnPlanC");
  var btnPlanD = document.getElementById("btnPlanD");
  btnPlanA.classList.remove("checked");
  planA = false;
  btnPlanB.classList.remove("checked");
  planB = false;
  btnPlanC.classList.remove("checked");
  planC = false;
  btnPlanD.classList.remove("checked");
  planD = false;
}

function effacer(){
  Jmol.script(JmolApplet0, "hide (all)");
  Jmol.script(JmolApplet0, "select (all); halos off;");
  effacerPlans();
  showBBox(false);
  opacityChanged()
}

function dispTetra(){
  Jmol.script(JmolApplet0, " "+
  "display add @161;"+
  "polyhedra tetra 4 3.0 @161 to (copper) flat edges;"+
  "select @161;"+
  "color polyhedra pink translucent 0.4;");
}

function hideTetra(){
  Jmol.script(JmolApplet0, "polyhedra tetra OFF;"+
  "display REMOVE (atomno=161)");
}

function showBBox(show){
  if(show){
    Jmol.script(JmolApplet0, "boundbox (cell=444) on");
  } else {
    Jmol.script(JmolApplet0, "boundbox off");
  }
}

function resetOrientation(){
  Jmol.script(JmolApplet0, "moveto 0 {1 -1 0}  -55");
}

function opacityChanged(){
    var opacitySlider = document.getElementById("opacitySlider");
    Jmol.script(JmolApplet0, "color atom translucent "+(100-opacitySlider.value)/100.0);
}

$( document ).ready(function() {
  configApplet();
  var opacitySlider = document.getElementById("opacitySlider");
  opacitySlider.oninput = opacityChanged; 

  var sizeSlider = document.getElementById("sizeSlider");
  sizeSlider.oninput = function() {
    Jmol.script(JmolApplet0, "select all; spacefill "+this.value+"%");
  } 

  var btnPlanA = document.getElementById("btnPlanA");
  btnPlanA.onclick = function() {
    planA = !planA;
    btnPlanA.classList.toggle("checked");
    if(planA){disp_plan("A");} else {hide_plan("A");}
  } 
  btnPlanB.onclick = function() {
    planB = !planB;
    btnPlanB.classList.toggle("checked");
    if(planB){disp_plan("B");} else {hide_plan("B");}
  } 
  btnPlanC.onclick = function() {
    planC = !planC;
    btnPlanC.classList.toggle("checked");
    if(planC){disp_plan("C");} else {hide_plan("C");}
  } 
  btnPlanD.onclick = function() {
    planD = !planD;
    btnPlanD.classList.toggle("checked");
    if(planD){disp_plan("D");} else {hide_plan("D");}
  } 

  var chkOcta = document.getElementById("chkOcta");
  chkOcta.onclick = function(){
    console.log("OK !");
    if(chkOcta.checked){
      dispOcta();
    } else {
      hideOcta();
    }
  }

  var chkTetra = document.getElementById("chkTetra");
  chkTetra.onclick = function(){
    console.log("OK !");
    if(chkTetra.checked){
      dispTetra();
    } else {
      hideTetra();
    }
  }
});

