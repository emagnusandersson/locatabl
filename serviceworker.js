
//importScripts('lib.js');
const ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  } 
const calcImageUrl=function(rT){ // Keys of rT: ["idUser", "boImgOwn", "imTag", "image"]
  var tmp='',  boImgOwn=Number(rT.boImgOwn);
  if(boImgOwn  || rT.image.length==0) tmp=myData.uUserImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image;
  return tmp;
};
const setItemS=function(name,value){  sessionStorage[name]=JSON.stringify(value); }
const tryGetDataFrClient=async function() {
  const clientList = await clients.matchAll({type: "window" });
  let myClient;  for(const client of clientList) { myClient=client; break;}
  if(myClient) myClient.postMessage('dataLacking');
}

self.addEventListener('install', function(event) {
  console.log('install');
  //self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  console.log('activate');
  //clients.claim();
  if(self.myData) return;
  event.waitUntil(tryGetDataFrClient());
});

self.addEventListener('push', function(event) {
  event.waitUntil(async function() {
    var obj=event.data.json();
    self.objMess=obj;
    var {objSender, iRole, message, tSent, latlngSender}=obj;
    //console.log(Notification.actions.length());
    var actions=[{action:'map', title:'Goto map'}]; //, {action:'respond', title:'Respond to message'}, {action:'info', title:'See '+strRole+' info' }
    //if(Notification.maxActions)
    const options = {
      body: message,
      vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
      timestamp: new Date(tSent*1000),
    };
      //actions: actions
    if(!self.myData) await tryGetDataFrClient();
    if(self.myData) {
      var strRole=myData.langHtml.Role[iRole];
      var title=ucfirst(strRole)+': '+objSender.displayName;
      options.icon=calcImageUrl(objSender);
    }else {  var title=objSender.displayName; }
    
    await self.registration.showNotification(title, options)
  }());
});

self.addEventListener("message", function(e) { self.myData=e.data; }, false);
addEventListener('notificationclick', event => {
  event.waitUntil(async function() {
    const clientList = await clients.matchAll({type: "window" });
    event.notification.close();
    console.log(self.registration.scope);
    // Let's see if we already have a chat window open:
    for(const client of clientList) {
      //const url = new URL(client.url);
      if(client.focus) await client.focus();
      client.postMessage(objMess);
      return;
    }

    var strHash=encodeURIComponent(JSON.stringify(objMess));
    //await clients.openWindow('/#'+strHash);
    await clients.openWindow(self.registration.scope+'#jsonMess='+strHash);

    // Message the client:
  }());
});

self.addEventListener('sync', function(event) {
  var objIn=JSON.parse(event.tag);
  //var objIn=event.tag;
  
  event.waitUntil( (async function() {
    //const clientList = await clients.matchAll({type: "window" });
    //let myClient;  for(const client of clientList) { myClient=client; break;}
    //if(myClient) myClient.postMessage('dataLacking');
    var dataOut=JSON.stringify(objIn.vec);
    const client = await clients.get(event.clientId);
    
    const request = new Request(objIn.url, {method:'POST', headers:new Headers({'X-Requested-With':'XMLHttpRequest'}), body:dataOut}); 
    var response=await fetch(request);
    var data=await response.json();
    if(typeof data=='object' && 'GRet' in data) console.log(data.GRet.strMessageText);
  })() );
});


