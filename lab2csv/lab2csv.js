const dropArea = document.getElementById('drop-area');
var result;
var vecteurs = [];
var courbes = [];

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
  readLabFile(fileList[0]);
});




function afficheVecteurs(vecteurs){
  var table = document.getElementById("table");
  var maxPoints = 0;
  for(i=0;i<vecteurs.length; i++){
    if(vecteurs[i].points.length>maxPoints)
      maxPoints = vecteurs[i].points.length;
  }
  console.log(maxPoints);

  table.insertRow(0);
  for(i=0; i<maxPoints; i++){
    table.insertRow(i);
  }
  console.log(table.rows.length);
  for(i=0;i<vecteurs.length; i++){
    table.rows[0].insertCell(i).innerHTML = vecteurs[i].nom;
    console.log("taille vecteur", vecteurs[i].points.length);
    for(j=0; j<vecteurs[i].points.length; j++){
      table.rows[j+1].insertCell(i).innerHTML = vecteurs[i].points[j];
    }
    while(j<maxPoints){
      table.rows[j+1].insertCell(i).innerHTML ="";
      j++;
    }
  }
}


function setSelects(){
  cSelect = document.getElementById("courbes_select");
  for(var i=0; i<courbes.length; i++){
    cSelect.add(new Option(courbes[i].nom, i));
  }
  cSelect.onchange = cSelectChanged;
} 

function cSelectChanged(){
  cSelect = document.getElementById("courbes_select");
  var data = []
  for(i=0; i<cSelect.selectedOptions.length; i++){
    crb = courbes[cSelect.selectedOptions[i].value]
    var vx, vy;
    for(var j=0; j<vecteurs.length; j++){
      if(vecteurs[j].oid == crb.vx){
        vx = vecteurs[j].points
      }
      if(vecteurs[j].oid == crb.vy){
        vy = vecteurs[j].points
      }
    }
    data.push({
      type:'scatter',
      mode:'markers',
      name:crb.nom,
      hovertext:crb.commentaire,
      // A labels array that can contain any sort of values
      x: vx,
      // Our series array that contains series objects or in this case series data arrays
      y: vy,
    });
  }
  graphContainer = document.getElementById("graph-container");
  Plotly.newPlot(graphContainer, data,  {margin: { t: 0 }});
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function exportBtnClick(){
  console.log("Export en csv");
  cSelect = document.getElementById("courbes_select");
  vxs = []
  vys = []
  maxpoints = 0;
  var nCourbes = cSelect.selectedOptions.length;
  var csvText = "#";
  for(var i=0; i<nCourbes; i++){
    crb = courbes[cSelect.selectedOptions[i].value]
    csvText = csvText+crb.nom+"_x\t"+crb.nom+"_y\t";
    var vx, vy;
    for(var j=0; j<vecteurs.length; j++){
      if(vecteurs[j].oid == crb.vx){
        vx = vecteurs[j].points
      }
      if(vecteurs[j].oid == crb.vy){
        vy = vecteurs[j].points
      }
    }
    vxs.push(vx);
    vys.push(vy);
    if(vx.length>maxpoints) 
      maxpoints=vx.length;
  }
  csvText = csvText+"\n";

  // Génération du fichier csv
  for(var i=0; i<maxpoints; i++){
    for(var j=0; j<nCourbes; j++){
      if(i<vxs[j].length){
        csvText=csvText+vxs[j][i]+"\t"+vys[j][i]+"\t";
      }
      else
      {
        csvText=csvText+"NaN\tNaN\t";
      }
    }
    csvText = csvText+"\n";
  }
  download("export.csv", csvText);
}


function fileLoaded(event){
  lines = event.target.result.split(["\n"])
  var i=0;
  vecteurs = [];
  courbes = [];
  while(i<lines.length){
    const line = lines[i].trim();
    // Check if the line is the start of a [vecteur] section
    if (line.startsWith('[vecteur]')) {
      const section = {};
      // Parse the section and get the points
      while (i < lines.length) {
        i++;
        var currentLine = lines[i].trim();

        if (currentLine.startsWith('[')) {
          vecteurs.push(section);
          i--;
          // End of section
          break;
        }

        const [key, value] = currentLine.split('=');
        console.log("Key :",key, "Value :",value);
        section[key.trim()] = value.trim().replace(/\"/g,"");
          if(value.trim().startsWith("table ")){
            nbpoints = parseInt( value.replace(/\s+/g, ' ').trim().split(" ")[1]);
            console.log("Nombre de points : ",nbpoints)
            np = 0;
            vals = [];
            while(np<nbpoints){
              i++
              currentLine = lines[i]
              valeurs = currentLine.trim().replace(/\s+/g, ' ').trim().split(" ")
              for(j=0; j<valeurs.length; j++){
                vals.push(parseFloat(valeurs[j]));
                np++;
              }
            }
            section[key.trim()] = vals;
            i++
            console.log(vals)
          }
      }
    }
    if (line.startsWith('[courbe]')) {
      const section = {};
      // Parse the section and get the points
      while (i < lines.length) {
        i++;
        var currentLine = lines[i].trim();

        if (currentLine.startsWith('[')) {
          courbes.push(section);
          i--;
          // End of section
          break;
        }

        const [key, value] = currentLine.split('=');
        var value2 = value;
        if(value2 && value2.trim().startsWith("\"") && !value2.trim().endsWith("\"")){
          while(!lines[i+1].trim().endsWith("\"")){
            value2 = value2+lines[++i];
          }
            value2 = value2+lines[++i];
        }
        console.log("Key :",key, "Value :",value2);
        section[key.trim()] = value2.trim().replace(/\"/g,"");
      }
    }
    i++;
  }
  console.log(event.target.result);
  dac = document.getElementById("drop-area-container")
  dac.remove();
  setSelects();
  //afficheVecteurs(vecteurs);
}


function readLabFile(file) {
  // Check if the file is an image.
  //if (file.type && !file.type.startsWith('image/')) {
    //console.log('File is not an image.', file.type, file);
    //return;
  //}
  result = {};
  const reader = new FileReader();
  reader.addEventListener('load', fileLoaded);
  reader.readAsText(file);
}
