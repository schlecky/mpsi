let url_stats = "https://stats2.schleck.ovh/"

function send_click(data){
  fetch(url_stats, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}


function test_click(){
data = {'width':1, 'height':3, 'useragent':'testua', 'location':'ici', "fingerprint":"1234"}
  console.log(data);
  send_click(data);
}

let width ;
let height ;
let ua ; 
let fingerprint = "undef";
let wf = new WasmFingerprint();

function send_initial_click(){
  send_click({'width':width, 'height':height, 'useragent':ua, 'location':window.location.toLocaleString(), "fingerprint":fingerprint.print}) ;
}


window.addEventListener("load", (event) => {
  width = window.screen.availWidth
  height = window.screen.availHeight
  ua = window.navigator.userAgent
  fingerprint = "undef";
  setTimeout(()=>{fingerprint = wf.make_fingerprint()}, 200);
  setTimeout(send_initial_click, 400);


  function callback(e) {
      var e = window.e || e;

      if (e.target.tagName !== 'A')
          return;

      send_click({'width':width, 'height':height, 'useragent':ua, 'location':e.target.href, "fingerprint":fingerprint.print})
  }

  if (document.addEventListener)
      document.addEventListener('click', callback, false);
  else
      document.attachEvent('onclick', callback);
});
