var acted=0;
var chkCentreMaille;
var chkCentreFace;
var chkInfos;
var tailleFace;
var tailleMaille;
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
  Jmol.script(JmolApplet0, "load WO3.cif 1 {113 886 1}; wireframe off;unitcell off;axes off;spacefill 100%; moveto 0 {-1 1 0}  125");
  Jmol.script(JmolApplet0, "set zShade ON");
  tous();
  sizeChanged();
}

function tous(){
  Jmol.script(JmolApplet0, "display (not lead)");
  Jmol.script(JmolApplet0, "set zShade ON");
  showBBox(false);
}

function maille(){
  Jmol.script(JmolApplet0, "display not lead and cell=555;center cell=555");
  Jmol.script(JmolApplet0, "set zShade OFF");
  showBBox(true);
}

function showBBox(show){
  if(show){
    Jmol.script(JmolApplet0, "unitcell on");
  } else {
    Jmol.script(JmolApplet0, "unitcell off");
  }
}

function chkCentreMailleClick(){
  if(chkCentreMaille.checked){
    Jmol.script(JmolApplet0, "display ADD Pb1 and (cell=555)");
  } else {
    Jmol.script(JmolApplet0, "display REMOVE Pb1");
  }
}

function chkCentreFaceClick(){
  if(chkCentreFace.checked){
    Jmol.script(JmolApplet0, "display ADD Pb2 and (cell=555);");
  } else {
    Jmol.script(JmolApplet0, "display REMOVE Pb2");
  }
}

function chkInfosClick(){
  if(chkInfos.checked){
    Jmol.script(JmolApplet0, "select @884,@910; label r=%[radius]Å;color label black;set labeloffset 0 0");
  } else {
    Jmol.script(JmolApplet0, "select @884,@910; label OFF");
  }
}

function tailleFaceChanged(){
  taille = tailleFace.value;
  Jmol.script(JmolApplet0, "select Pb2;spacefill "+parseFloat(taille).toFixed(1)+";");
}
function tailleMailleChanged(){
  taille = tailleCentre.value;
  Jmol.script(JmolApplet0, "select Pb1;spacefill "+parseFloat(taille).toFixed(1)+";");
}

function sizeChanged(){
  var sizeSlider = document.getElementById("sizeSlider");
  Jmol.script(JmolApplet0, "select all; spacefill "+sizeSlider.value+"%")
}

$( document ).ready(function() {
  configApplet();
  chkCentreMaille = document.getElementById("chkCentreMaille");
  chkCentreFace = document.getElementById("chkCentreFace");
  chkInfos = document.getElementById("chkInfos");
  tailleFace = document.getElementById("tailleCentreFace");
  tailleCentre = document.getElementById("tailleCentreMaille");

  var opacitySlider = document.getElementById("opacitySlider");
  opacitySlider.oninput = function() {
    Jmol.script(JmolApplet0, "color atom translucent "+(100-this.value)/100.0);
  } 
});

