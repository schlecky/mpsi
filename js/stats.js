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


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
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
let uuid = getCookie("visitor_id");

function send_initial_click(){
  send_click({'width':width, 'height':height, 'useragent':ua, 'location':window.location.toLocaleString(), "fingerprint":fingerprint, "uuid":uuid}) ;
}


window.addEventListener("load", (event) => {
  width = window.screen.availWidth
  height = window.screen.availHeight
  ua = window.navigator.userAgent
  fingerprint = new Fingerprint().get().toString(16).toUpperCase();
  if(uuid == ""){
    uuid = crypto.randomUUID();
    setCookie("visitor_id", uuid, 730);
  }
  setTimeout(send_initial_click, 100);


  function callback(e) {
      var e = window.e || e;

      if (e.target.tagName !== 'A')
          return;

      send_click({'width':width, 'height':height, 'useragent':ua, 'location':e.target.href, "fingerprint":fingerprint, "uuid":uuid})
  }

  if (document.addEventListener)
      document.addEventListener('click', callback, false);
  else
      document.attachEvent('onclick', callback);
});
