var JmolApplet0; // set up in HTML table, below
function readyfunc()
{
  //Jmol.script(JmolApplet0, "select all ; zoom 60;");
};

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
  Jmol.script(JmolApplet0, "load diamant.cif 1 {333 666 1}; wireframe off;unitcell off;axes off;");
        Jmol.script(JmolApplet0, "define maille @2,@24,@45,@46,@47,@48,@50,@53,@54,@56,@62,@72,@77,@78,@80,@84,@86,@108;");
  Jmol.script(JmolApplet0, "data \"element_vdw\" 6 0.77 END \"element_vdw\"");
  Jmol.script(JmolApplet0, "set defaultVDW USER");
  Jmol.script(JmolApplet0, "select all;spacefill 103%");

  Jmol.script(JmolApplet0, "");
  maille();
}

function maille(){
  Jmol.script(JmolApplet0, "display maille;");
  showBBox(true);
}

function tous(){
  Jmol.script(JmolApplet0, "display (all)");
  showBBox(false);
}

function effacer(){
  Jmol.script(JmolApplet0, "hide (all)");
  showBBox(false);
}

function dispTetra(){
  Jmol.script(JmolApplet0, " "+
  "polyhedra 4 BONDS @47 flat edges;"+
  "polyhedra 4 BONDS @45 flat edges;"+
  "polyhedra 4 BONDS @77 flat edges;"+
  "polyhedra 4 BONDS @53 flat edges;"+
  "select @47,@53,@77,@45;"+
  "color polyhedra pink translucent 0.4;");
}

function hideTetra(){
  Jmol.script(JmolApplet0, "select @47,@53,@77,@45;polyhedra OFF;");
}

function dispLiaisons(disp){
  if(disp){
    Jmol.script(JmolApplet0, "wireframe 0.1;");
    
  } else {
    Jmol.script(JmolApplet0, "wireframe off;");
  }
}



function showBBox(show){
  if(show){
    Jmol.script(JmolApplet0, "unitcell [{0 0 0}, {-2.527 -1.459 2.0633}, {-2.527 1.458 -2.0633}, {0 -2.9179 -2.0633}];");
  } else {
    Jmol.script(JmolApplet0, "unitcell off");
  }
}


$( document ).ready(function() {
  configApplet();
  var opacitySlider = document.getElementById("opacitySlider");
  opacitySlider.oninput = function() {
    Jmol.script(JmolApplet0, "color atom translucent "+(100-this.value)/100.0);
  } 

  var sizeSlider = document.getElementById("sizeSlider");
  sizeSlider.oninput = function() {
    console.log("taille"+this.value+"%");
    Jmol.script(JmolApplet0, "select all; spacefill "+this.value+"%");
  } 

  var chkTetra = document.getElementById("chkTetra");
  chkTetra.onclick = function(){
    if(chkTetra.checked){
      dispTetra();
    } else {
      hideTetra();
    }
  }

  var chkLiaisons = document.getElementById("chkLiaisons");
  chkLiaisons.onclick = function(){
  dispLiaisons(chkLiaisons.checked);
  }
});

