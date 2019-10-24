
//importScripts('lib.js');
const ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  } 
const calcImageUrl=function(rT){ // Keys of rT: ["idUser", "boImgOwn", "imTag", "image"]
  var tmp='',  boImgOwn=Number(rT.boImgOwn);
  if(boImgOwn  || rT.image.length==0) tmp=uUserImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image;
  return tmp;
};
const setItemS=function(name,value){  sessionStorage[name]=JSON.stringify(value); }
 
self.addEventListener('push', function(event) {
  var obj=event.data.json();
  self.objMess=obj;
  var {objSender, iRole, message, tSent, latlngSender}=obj;
  var strRole=langHtml.RoleRewritten[iRole];
  var title=ucfirst(strRole)+': '+objSender.displayName;
  //var title=objSender.displayName;
  const options = {
    body: message,
    icon: calcImageUrl(objSender),
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
    timestamp: new Date(tSent*1000),
    //actions: [
        //{
          //action: 'map',
          //title: 'Goto map'
        //},
        //{
          //action: 'info',
          //title: 'See '+strRole+' info'
        //},
        //{
          //action: 'respond',
          //title: 'Respond to message'
        //}]
  };
    // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("message", function(e) {
    self.globVar=e.data;
    self.langHtml=globVar.langHtml;
    self.uUserImage=globVar.uUserImage;
    
    //eval("self.ucfirst="+globVar.ucfirst);
    //eval("self.calcImageUrl="+globVar.calcImageUrl);
}, false);
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  var strAction=event.action;
  event.notification.close();
  
  var strHash=encodeURIComponent(JSON.stringify(objMess));
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for(var i=0; i<clientList.length; i++) {
      var client=clientList[i];
      if('focus' in client) { 
        client.postMessage(objMess);
        //client.navigate('/#'+strHash);
        return client.focus();
      } //client.url=='/' && 
    }
    if(clients.openWindow) return clients.openWindow('/#'+strHash);
  }).then(function(client) {
    //return client.navigate('/#hello');
  })
  
  );
});
