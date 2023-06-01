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
	height: "100%",
	//height: 500,
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
  Jmol.script(JmolApplet0, "load hc.cif 1 {113 886 1}; wireframe off;unitcell off;axes off;spacefill 1.3; moveto 0 {-1 1 0}  125");
  Jmol.script(JmolApplet0, "define planA (titanium) AND WITHIN(0.1, PLANE, @{plane(@1,@1069,@901)})");
  Jmol.script(JmolApplet0, "select planA; color atoms [xCCA2F3];"); 
  Jmol.script(JmolApplet0, "define planB (titanium) AND WITHIN(0.1, PLANE, @{plane(@2,@1070,@902)})");
  Jmol.script(JmolApplet0, "select planB; color atoms [xF3CCA2];"); 
  Jmol.script(JmolApplet0, "define planC (titanium) AND WITHIN(0, PLANE, @{plane(@883,@1075,@907)})");
  Jmol.script(JmolApplet0, "select planC; color atoms [xCCA2F3];"); 
  Jmol.script(JmolApplet0, "define planD (titanium) AND WITHIN(0, PLANE, @{plane(@884,@1076,@908)})");
  Jmol.script(JmolApplet0, "select planD; color atoms [xF3CCA2];"); 
  Jmol.script(JmolApplet0, "define mailleHC (titanium) AND (cell=555); ")
  Jmol.script(JmolApplet0, "data \"element_vdw\" 22 1.91 ; 82 0.8585 END \"element_vdw\"");
  Jmol.script(JmolApplet0, "set defaultVDW USER");
  Jmol.script(JmolApplet0, "select all;spacefill 100%");

  Jmol.script(JmolApplet0, "");
  Jmol.script(JmolApplet0, "hide all;"); 
}

function display_tous(){
 Jmol.script(JmolApplet0, "display (planA),(planB),(planC),(planD);select all;color atoms TRANSLUCENT 0;");
}

function mailleHC(){
  effacer();
  showBBox(true);
  Jmol.script(JmolApplet0, "display (titanium) and cell=555;");
}

function mailleConv(){
  effacer();
  let atomes1 = [883, 697, 721, 931, 1123, 1099];
  let atomes2 = [1, 691, 715, 925, 1117, 1093];
  let ligne1 = "@"+atomes1[0];
  let ligne2 = "@"+atomes2[0];
  for(let i=0; i<6; i++){
    ligne1 +=" @"+atomes1[(i+1)%6];
    ligne2 +=" @"+atomes2[(i+1)%6];
    Jmol.script(JmolApplet0, "draw L"+(i+3)+" WIDTH 0.01 line [@"+atomes1[i]+" @"+atomes2[i]+"] color BLACK");
  }
  Jmol.script(JmolApplet0, "display (titanium) and (cell=555 or cell=455 or cell=565); display remove @1075,@1069");
Jmol.script(JmolApplet0, "draw L1 WIDTH 0.01 line ["+ligne1+"] color BLACK "); 
Jmol.script(JmolApplet0, "draw L2 WIDTH 0.01 line ["+ligne2+"] color BLACK "); 
//Jmol.script(JmolApplet0, "draw L1 WIDTH 0.01 line [@1 @691 @715 @925 @1117 @1093 @1] color BLACK "); 
  showBBox(false);
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

function dispOcta(){
  let dispOcta_script = "display ADD @5;"+
  "display ADD @5,@6;"+
  "display ADD (titanium) and WITHIN(3.0,@5);"+
  "display ADD (titanium) and WITHIN(3.0,@6);"+
  "polyhedra octa 6 3.0 @5 to (titanium) flat edges;"+
  "select @5;"+
  "color polyhedra red translucent 0.4;"+
  "polyhedra octa2 6 3.0 @6 to (titanium) flat edges;"+
  "select @6;"+
  "color polyhedra yellow translucent 0.4;";

  Jmol.script(JmolApplet0, dispOcta_script);
}

function hideOcta(){
  Jmol.script(JmolApplet0, "polyhedra octa OFF;"+
  "polyhedra octa2 OFF;"+
  "display REMOVE @860,@1070;"+
  "display REMOVE @5,@6");
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
  Jmol.script(JmolApplet0, "hide (all);");
  Jmol.script(JmolApplet0, "draw L1 OFF;");
  Jmol.script(JmolApplet0, "draw L2 OFF;");
  Jmol.script(JmolApplet0, "draw L3 OFF;");
  Jmol.script(JmolApplet0, "draw L4 OFF;");
  Jmol.script(JmolApplet0, "draw L5 OFF;");
  Jmol.script(JmolApplet0, "draw L6 OFF;");
  Jmol.script(JmolApplet0, "draw L7 OFF;");
  Jmol.script(JmolApplet0, "draw L8 OFF;");
  
  effacerPlans();
  showBBox(false);
}

function dispTetra(){
  Jmol.script(JmolApplet0, " "+
  "display add @3;"+
  "polyhedra tetra 4 3.0 @3 to (titanium) flat edges;"+
  "display add @4;"+
  "polyhedra tetra 4 3.0 @4 to (titanium) flat edges;"+
  "select @3,@4;"+
  "color polyhedra pink translucent 0.4;");
}

function hideTetra(){
  Jmol.script(JmolApplet0, "polyhedra tetra OFF;"+
  "display REMOVE @3,@4");
}

function showBBox(show){
  if(show){
    Jmol.script(JmolApplet0, "unitcell on");
  } else {
    Jmol.script(JmolApplet0, "unitcell off");
  }
}

function resetOrientation(){
  Jmol.script(JmolApplet0, "moveto 0 {1 -1 0}  -55");
}


$( document ).ready(function() {
  configApplet();
  var opacitySlider = document.getElementById("opacitySlider");
  opacitySlider.oninput = function() {
    Jmol.script(JmolApplet0, "color atom translucent "+(100-this.value)/100.0);
  } 

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

