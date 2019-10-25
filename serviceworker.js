
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
//self.addEventListener('push', function(event) {
  //var obj=event.data.json();
  //self.objMess=obj;
  //var {objSender, iRole, message, tSent, latlngSender}=obj;
  //var strRole=myData.langHtml.Role[iRole];
  //var title=ucfirst(strRole)+': '+objSender.displayName;
  ////var title=objSender.displayName;
  //var actions=[{action:'map', title:'Goto map'}]; //, {action:'respond', title:'Respond to message'}, {action:'info', title:'See '+strRole+' info' }
  ////if(Notification.maxActions)
  //const options = {
    //body: message,
    //icon: calcImageUrl(objSender),
    //vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
    //timestamp: new Date(tSent*1000),
    //actions: actions
  //};
    //// Keep the service worker alive until the notification is created.
  //event.waitUntil(
    //self.registration.showNotification(title, options)
  //);
//});

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
//self.addEventListener('notificationclick', function(event) {
  //console.log('On notification click: ', event.notification.tag);
  //var strAction=event.action;
  //event.notification.close();
  
  //var strHash=encodeURIComponent(JSON.stringify(objMess));
  //// This looks to see if the current is already open and
  //// focuses if it is
  //event.waitUntil(clients.matchAll({
    //type: "window"
  //}).then(function(clientList) {
    //for(var i=0; i<clientList.length; i++) {
      //var client=clientList[i];
      //if('focus' in client) { 
        //client.postMessage(objMess);
        ////client.navigate('/#'+strHash);
        //return client.focus();
      //} //client.url=='/' && 
    //}
    //if(clients.openWindow) return clients.openWindow('/#'+strHash);
  //}).then(function(client) {
    ////return client.navigate('/#hello');
  //})
  
  //);
//});
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
//addEventListener('notificationclick', event => {
  //event.waitUntil(async function() {
    //const clientList = await clients.matchAll({type: "window" });

    //let myClient;

    //// Let's see if we already have a chat window open:
    //for(const client of clientList) {
      ////const url = new URL(client.url);
      //client.focus();
      //myClient = client;
      //break;
    //}

    //if(!myClient) {
      ////var strHash=encodeURIComponent(JSON.stringify(objMess));
      //myClient = await clients.openWindow('');  //'/#'+strHash
    //}
    //myClient.postMessage(objMess);

    //// Message the client:
  //}());
//});


