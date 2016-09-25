

mesOMake=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(str);
}}
mesEOMake=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  this.Str.push('E: '+err.syscal+' '+err.code);
  var str=this.Str.join(glue); this.res.end(str);	
}}
mesOMakeJSON=function(glue){ return function(str){
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);  this.res.end(JSON.stringify(str));
}}
mesEOMakeJSON=function(glue){ return function(err){
  var error=new MyError(err); console.log(error.stack);
  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);
  var str=this.Str.join(glue); this.res.end(JSON.stringify(str));	
}}


"use strict"



/******************************************************************************
 * ReqCurlEnd
 ******************************************************************************/
app.ReqCurlEnd=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[];
}
app.ReqCurlEnd.prototype.mes=function(str){ this.Str.push(str); }
app.ReqCurlEnd.prototype.mesO=mesOMakeJSON('\n');
app.ReqCurlEnd.prototype.mesEO=mesEOMakeJSON('\n');
app.ReqCurlEnd.prototype.go=function(){  
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName, objQS=req.objQS;
  var mes=this.mes, mesO=this.mesO;
  res.setHeader("Content-type", "application/json");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");

  //var http_origin = req.uDomain; 
  if('origin' in req.headers){ //if cross site
    var http_origin=req.headers.origin;
    var boAllowDbg=boDbg && RegExp("^http\:\/\/(localhost|192\.168\.0)").test(http_origin);
    if(boAllowDbg || http_origin == "https://control.closeby.market" || http_origin == "https://controlclosebymarket.herokuapp.com" || http_origin == "https://emandersson.github.io" ){
        res.setHeader("Access-Control-Allow-Origin", http_origin);
    }
    if(req.method=='OPTIONS'){  this.mesO(); return;}
  }

  var pubKey; if("pubKey" in objQS) { pubKey=objQS.pubKey; }  else{ this.mesO('No public key "pubKey" in the query line'); return;}
  var sixSignature; if("signature" in objQS) { sixSignature=objQS.signature; }  else{ this.mesO('No "signature" in the query line'); return;}
  var data; if("data" in objQS) { data=objQS.data; }  else{ this.mesO('No "data" in the query line'); return;}

  //var pemPub=pubKey, sixPub=pubKey.split('\n').slice(1,-2).join('\n');
  var pemPub="-----BEGIN PUBLIC KEY-----\n"+pubKey+"-----END PUBLIC KEY-----", sixPub=pubKey;
  var keyV = new NodeRSA(pemPub);
  var boOK=keyV.verify(data, sixSignature, 'utf8', 'base64');
  var boOK; if(!boOK){ this.mesO('Message does NOT authenticate'); return;}
  //console.log('boVerifies: '+boOK);

  var inObj=JSON.parse(data);//json_last_error_msg()
  //inObj=JSON.parse("{iSec:22, lat:59.83934260, lng:17.60569680}");
  var iSeqN; if("iSeq" in inObj) { iSeqN=inObj.iSeq; }  else{  this.mesO('"iSeq" is not set'); return;}

  var Sql=[],Val=[];
  //Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  if(inObj.boCheck){
    Sql.push("CALL "+siteName+"GetValuesToController(?, ?, @boShow, @tDiff, @boOk, @mess);"); Val.push(sixPub, iSeqN);
    Sql.push("SELECT @boShow AS boShow, @tDiff AS tDiff, @boOk AS boOK, @mess AS mess;");
  }
  else{
    if(!("boShow" in inObj)) { this.mesO('"boShow" is not set'); return;}  var boShow=inObj.boShow;
    if(boShow){
      if(!("lat" in inObj || "lng" in inObj)){this.mesO('"lng" or "lat" are not set'); return;}
      if(!("hideTimer" in inObj)) {this.mesO('"hideTimer" is not set'); return;} 
      var projs=new MercatorProjection(),   tmp=projs.fromLatLngToPointV([inObj["lat"],inObj["lng"]]),  x=tmp[0],  y=tmp[1], hideTimer=inObj.hideTimer; 
    }else{var x=0, y=0, hideTimer=0;}
    Sql.push("CALL "+siteName+"SetValuesFromController(?, ?, ?, ?, ?, ?,  @boOk, @mess);"); Val.push(sixPub, iSeqN, x, y, boShow, hideTimer);
    Sql.push("SELECT @boOk AS boOK, @mess AS mess;");
  }
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); return; } 
    if(inObj.boCheck){
      var tmp=results[1][0];
      if(!tmp.boOK) {self.mesO(tmp.mess); return;}
      var str=tmp.boShow?'Visible':'Hidden';
      if(tmp.boShow){     var tmp=getSuitableTimeUnit(tmp.tDiff), tDiffF=tmp[0].toFixed(0), u=tmp[1];    str+=" Hiding in "+tDiffF+" "+u;   }
      self.mes(str);
    }
    else{  
      var tmp=results[1][0];
      if(!tmp.boOK) {self.mesO(tmp.mess); return;}
      var str=inObj.boShow?'Visible':'Hidden'; self.mes(str);
    }
    self.mesO();
  });
}



/******************************************************************************
 * ReqPubKeyStore
 ******************************************************************************/
app.ReqPubKeyStore=function(req,res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[]
}
app.ReqPubKeyStore.prototype.mesO=mesOMake('\n');
//app.ReqPubKeyStore.prototype.mesEO=mesEOMake('\n');
app.ReqPubKeyStore.prototype.go=function(){
  var req=this.req, res=this.res, objQS=req.objQS, uSite=req.uSite;
  var site=req.site, siteName=site.siteName;
  var pubKey=objQS.pubKey||'';
  var strLang='en';

  var Str=this.Str;
  Str.push('<!DOCTYPE html> \n\
<html><head> \n\
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \n\
<meta name="viewport" id="viewportMy" content="initial-scale=1" /> \n\
<meta name="robots" content="noindex"> \n\
</head> \n\
<body>');


  //var uCommon='http://'+wwwCommon;
  var uCommon=req.strSchemeLong+wwwCommon;
  var uJQuery='https://code.jquery.com/jquery-latest.min.js';    if(boDbg) uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/jquery-latest.js";      Str.push("<script src='"+uJQuery+"'></script>");


          // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbg) vTmp=0;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'"></script>');

  var StrTmp=['lang/'+strLang+'.js', 'lib.js', 'libClient.js', 'clientPubKeyStore.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }


  var caller="pubKeyStore";
  var CSRFCode=randomHash();
  var redisVar=this.req.sessionID+'_'+'CSRFCode'+ucfirst(caller), tmp=wrapRedisSendCommand('set',[redisVar,CSRFCode]);    var tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);

  Str.push("\n\
<script>\n\
CSRFCode="+JSON.stringify(CSRFCode)+";\n\
caller="+JSON.stringify(caller)+";\n\
\n\
specialistDefault="+JSON.stringify(specialistDefault)+";\n\
pubKey="+JSON.stringify(pubKey)+";\n\
maxVendor="+JSON.stringify(maxVendor)+";\n\
\n\
\n\
wwwSite="+JSON.stringify(req.wwwSite)+";\n\
wwwCommon="+JSON.stringify(wwwCommon)+";\n\
boTLS="+JSON.stringify(req.boTLS)+";\n\
leafBE="+JSON.stringify(leafBE)+";\n\
flImageFolder="+JSON.stringify(flImageFolder)+";\n\
urlAuthIdplace="+JSON.stringify(urlAuthIdplace)+";\n\
response_type="+JSON.stringify(response_type)+";\n\
</script>");

  Str.push("</body></html>");
  this.mesO();
}



/******************************************************************************
 * ReqIndex
 ******************************************************************************/
app.ReqIndex=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool;
}
app.ReqIndex.prototype.go=function() {
  var req=this.req, res=this.res;
  var objQS=req.objQS;
  var site=req.site, siteName=site.siteName, wwwSite=req.wwwSite, uSite=req.uSite;
  var boEmulator=0; if("boEmulator" in objQS) {boEmulator=Number(objQS.boEmulator);}
  var startFilter=null; if("idTeam" in objQS) {idTeam=Number(objQS.idTeam).toString(); startFilter=idTeam;}

  //if("boVideo" in objQS) {req.session.boVideo=Number(objQS.boVideo);}   var boVideo=req.session.boVideo|0;
  //var boVideo=0;
  //if("boVideo" in objQS) boVideo=Number(objQS.boVideo);

  var ip='';
    // AppFog ipClient
  if('x-forwarded-for' in req.headers){
    var tmp=req.headers['x-forwarded-for'];
    //tmp="79.136.116.122, 127.0.0.1";
    var Match=/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.exec(tmp);
    ip=Match[0];
  }else if('REMOTE_ADDR' in req.headers){ip=req.headers.REMOTE_ADDR;}
   
  if(boDbg) ip='79.136.116.122';
  var strTmp='43.4,3.00000000009';
  var strTmp="59.33330000000001,18.05000000000001";
  var strTmp="0,0";
  var Match=/^(.*),(.*)$/.exec(strTmp);
  var boOK=Boolean(Match.length);
  if(!boOK) coordApprox=[0,0]; else coordApprox=Match.slice(1);


  var strLangBrowser=getBrowserLang(req); if(!checkIfLangIsValid(strLangBrowser)){ strLangBrowser='en'; }

  var ua=req.headers['user-agent']||''; ua=ua.toLowerCase();
  if(/facebookexternalhit/.test(ua)) {
    objQS.lang='en'; 
  }
  if('fb_locale' in objQS) objQS.lang=objQS.fb_locale.substr(0,2);   

  //var strLang;
  var strLang='en';
  /*
  if('lang' in objQS) strLang=objQS.toLowerCase();   
  else {
    var arrT=[req.qs];arrT.push("lang="+strLangBrowser);
    var str=arrT.join('&'); if(str.length) str='?'+str;
    var uTmp=uSite+str; //echo uTmp; exit;
    res.setHeader("Location",uTmp); res.end(); return false;
  }
  if(!checkIfLangIsValid(strLang)){ strLang=strLangBrowser; }
  */

  var requesterCacheTime=getRequesterTime(req.headers);

  res.setHeader("Cache-Control", "must-revalidate");  res.setHeader('Last-Modified',bootTime.toUTCString());

  //if(boVideo==0 && boEmulator==0){ // In normal case ...
  if(1){ 
    if(requesterCacheTime && requesterCacheTime>=bootTime) { res.out304(); return false;   } 
    res.statusCode=200;   
  }

  //boVideo=1;
  
  var Str=[];
  Str.push('<!DOCTYPE html>\n\
<html xmlns="http://www.w3.org/1999/xhtml"\n\
      xmlns:og="http://ogp.me/ns#"\n\
      xmlns:fb="http://www.facebook.com/2008/fbml">');
  Str.push('<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');


  //<meta name="apple-mobile-web-app-capable" content="yes" /> 
  var boMSIE=RegExp('/msie/').test(ua);
  var boAndroid=RegExp('/android/').test(ua);
  var boFireFox=RegExp('/firefox/').test(ua);
  var boIOS= RegExp('/iPhone|iPad|iPod/i').test(ua);


  var tmpIcon=wwwIcon16; if('wwwIcon16' in site) tmpIcon=site.wwwIcon16;  var uIcon16=req.strSchemeLong+tmpIcon;  //+'?v='+strBootTime
  var tmpIcon=wwwIcon114; if('wwwIcon114' in site) tmpIcon=site.wwwIcon114;  var uIcon114=req.strSchemeLong+tmpIcon;
  var tmpIcon=wwwIcon200; if('wwwIcon200' in site) tmpIcon=site.wwwIcon200;  var uIcon200=req.strSchemeLong+tmpIcon;
  Str.push('<link rel="icon" type="image/png" href="'+uIcon16+'" />');
  Str.push('<link rel="apple-touch-icon-precomposed" href="'+uIcon114+'"/>');





  var strTmp='';  if(boAndroid && boFireFox) {  strTmp=", width=device-width'";}    
  var strTmpB=''; //if(boAndroid || boIOS) strTmpB=", user-scalable=no";

  Str.push("<meta name='viewport' id='viewportMy' content='initial-scale=1"+strTmp+strTmpB+"'/>");


  require('./lang/'+strLang+'.js');  langServerFunc();
  site.langSetup();
  var strTitle=site.serv.strTitle;
  var strH1=site.serv.strH1;
  var strDescription=site.serv.strDescription;
  var strKeywords=site.serv.strKeywords;
  var strSummary=site.serv.strSummary;


  Str.push('\
<meta name="description" content="'+strDescription+'"/>\n\
<meta name="keywords" content="'+strKeywords+'"/>\n\
<link rel="canonical" href="'+uSite+'"/>\n');

  var fbTmp=req.rootDomain.fb, fiIdTmp=fbTmp?fbTmp.id:'';
  var tmp='\
<meta property="og:title" content="'+wwwSite+'"/>\n\
<meta property="og:type" content="website" />\n\
<meta property="og:url" content="http://'+wwwSite+'"/>\n\
<meta property="og:image" content="'+uIcon200+'"/>\n\
<meta property="og:site_name" content="'+wwwSite+'"/>\n\
<meta property="fb:admins" content="100002646477985"/>\n\
<meta property="fb:app_id" content="'+fiIdTmp+'"/>\n\
<meta property="og:description" content="'+strDescription+'"/>\n\
<meta property="og:locale:alternate" content="sv_se" />\n\
<meta property="og:locale:alternate" content="en_US" />\n';
  if(!boDbg) Str.push(tmp);


  var tmp='\
<script>\n\
  window.fbAsyncInit = function() {\n\
    FB.init({\n\
      appId      : "'+fiIdTmp+'",\n\
      xfbml      : true,\n\
      version    : "v2.7"\n\
    });\n\
  };\n\
\n\
  (function(d, s, id){\n\
     var js, fjs = d.getElementsByTagName(s)[0];\n\
     if (d.getElementById(id)) {return;}\n\
     js = d.createElement(s); js.id = id;\n\
     js.src = "//connect.facebook.net/en_US/sdk.js";\n\
     fjs.parentNode.insertBefore(js, fjs);\n\
   }(document, "script", "facebook-jssdk"));\n\
</script>\n';
  Str.push(tmp);


  var strT=''; if('googleAPIKey' in req.rootDomain) strT="?key="+req.rootDomain.googleAPIKey;
  Str.push("<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js"+strT+"'></script>");


  //var uCommon='http://'+wwwCommon;
  var uCommon=req.strSchemeLong+wwwCommon;
  var uJQuery='https://code.jquery.com/jquery-latest.min.js';    if(boDbg) uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/jquery-latest.js";      Str.push("<script src='"+uJQuery+"'></script>");

    // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes

    // Include stylesheets
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbg) vTmp=0;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'"></script>');


    // Include JS-files
  var StrTmp=['filter.js', 'lib.js', 'libClient.js', 'client.js', 'lang/en.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }

    // Include plugins
  Str.push("\n<script type=\"text/javascript\" language=\"JavaScript\" charset=\"UTF-8\"> var CreatorPlugin={};</script>");
  var StrPlugIn=site.StrPlugIn;
  for(var i=0;i<StrPlugIn.length;i++){
    var Name=ucfirst(StrPlugIn[i]); 
    var pathTmp='/plugin'+Name+'.js', vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }


  var strTracker, tmpID=site.googleAnalyticsTrackingID||null;
  if(boDbg||!tmpID){strTracker="<script> ga=function(){};</script>";}else{ 
  strTracker="\n\
<script type=\"text/javascript\">\n\
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n\
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n\
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n\
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n\
  ga('create', '"+tmpID+"', 'auto');\n\
  ga('send', 'pageview');\n\
</script>\n";
  }
  Str.push(strTracker);

  Str.push("</head>");
  Str.push('<body style="visibility:hidden">');

  Str.push("<title>"+strTitle+"</title>\n<h1>"+strH1+"</h1>\n"+strSummary);

  Str.push("\n<script type=\"text/javascript\" language=\"JavaScript\" charset=\"UTF-8\">\n\
\n\
boVideo="+JSON.stringify(boVideo)+";\n\
boEmulator="+JSON.stringify(boEmulator)+";\n\
startFilter="+JSON.stringify(startFilter)+";\n\
\n\
strLang="+JSON.stringify(strLang)+";\n\
\n\
coordApprox="+JSON.stringify(coordApprox)+";\n\
boTLS="+JSON.stringify(req.boTLS)+";\n\
urlAuthIdplace="+JSON.stringify(urlAuthIdplace)+";\n\
response_type="+JSON.stringify(response_type)+";\n\
</script>\n\
</body>\n\
</html>");


  var str=Str.join('\n');   res.writeHead(200, "OK", {'Content-Type': 'text/html'});   res.end(str);    
}






/******************************************************************************
 * ReqImage
 ******************************************************************************/
app.ReqImage=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool;
}
app.ReqImage.prototype.go=function() {
  var self=this, req=this.req, res=this.res;
  var site=req.site, objQS=req.objQS, uSite=req.uSite, siteName=site.siteName, pathName=req.pathName, id, kind;

  this.eTagIn=getETag(req.headers);
  var keyCache=siteName+'/'+pathName;
  if(keyCache in ETagImage && ETagImage[keyCache]===this.eTagIn) { res.out304(); return; }

  //if("id" in objQS) {id=Number(objQS.id);} else {id=0;}    if("kind" in objQS) {kind=objQS.kind;} else {kind='v';}

  var Match=RegExp('^/image/(v|t)([0-9]+)$').exec(pathName);
  if(Match && Match.length>2){kind=Match[1]; id=Number(Match[2]);} else { res.out404('404 Not found'); return; }


  var tab;  if(kind=='v'){tab=site.TableName.vendorImageTab; }else tab=site.TableName.teamImageTab;
  var sql = "SELECT data FROM "+tab+" WHERE idUser=?", Val=[id];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err) { res.out500(err); return;}
    if(results.length>0){
      var strData=results[0].data;
      var eTag=crypto.createHash('md5').update(strData).digest('hex'); 
      ETagImage[keyCache]=eTag;  if(eTag===this.eTagIn) { res.out304(); return; }
      var maxAge=3600*8760, mimeType=MimeType.jpg;
      res.writeHead(200, {"Content-Type": mimeType, "Content-Length":strData.length, ETag: eTag, "Cache-Control":"public, max-age="+maxAge}); // "Last-Modified": maxModTime.toUTCString(),
      res.end(strData);
    }else{
      //res.setHeader("Content-type", "image/png");
      id=id%32;
      var tmp; if(kind=='v'){tmp='anonPng'; }else tmp='anonTeamPng';
      var uNew=uSite+"/lib/image/"+tmp+"/a"+id+".png";
      res.writeHead(302, {'Location': uNew});
      res.end();
    }
  });
}



/******************************************************************************
 * ReqLoginBack
 ******************************************************************************/
var ReqLoginBack=app.ReqLoginBack=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.mess=[];  this.Str=[];
}
ReqLoginBack.prototype.go=function(){
  var self=this, req=this.req, res=this.res, objQS=req.objQS;
  var wwwLoginScopeTmp=null; if('wwwLoginScope' in this.site) wwwLoginScopeTmp=this.site.wwwLoginScope;

  var Str=[];
  Str.push("\n\
<html><head><meta name='robots' content='noindex'></head>\n\
<body>\n\
<script>\n\
var wwwLoginScope="+JSON.stringify(wwwLoginScopeTmp)+";\n\
if(wwwLoginScope) document.domain = wwwLoginScope;\n\
var strQS=location.search;\n\
var strHash=location.hash;\n\
debugger\n\
//alert('strHash: '+strHash);\n\
window.opener.loginReturn(strQS,strHash);\n\
window.close();\n\
</script>\n\
</body>\n\
</html>\n\
");
  var str=Str.join('\n');  this.res.end(str);
}





/******************************************************************************
 * ReqStatic
 ******************************************************************************/
var ReqStatic=app.ReqStatic=function(req, res){
  this.req=req; this.res=res;  this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[];
}
ReqStatic.prototype.go=function() {
  var self=this, req=this.req, res=this.res;
  var site=req.site, objQS=req.objQS, siteName=site.siteName, pathName=req.pathName;

  var eTagIn=getETag(req.headers);
  var keyCache=pathName; if(pathName==='/'+leafSiteSpecific) keyCache=siteName+keyCache; 
  if(!(keyCache in CacheUri)){
    var filename=pathName.substr(1);
    var err=readFileToCache(filename);
    if(err) {
      if(err.code=='ENOENT') {res.out404(); return;}
      if('host' in req.headers) console.log('Faulty request from'+req.headers.host);
      if('Referer' in req.headers) console.log(req.headers.Referer);
      res.out500(err); return;
    }
  }
  var cacheUri=CacheUri[keyCache];
  if(cacheUri.eTag===eTagIn){ res.out304(); return; } 
  var buf=cacheUri.buf, type=cacheUri.type,  eTag=cacheUri.eTag, boZip=cacheUri.boZip, boUglify=cacheUri.boUglify;
  var mimeType=MimeType[type]; 
  if(typeof mimeType!='string') console.log('type: '+type+', mimeType: ', mimeType);
  if(typeof buf!='object' || !('length' in buf)) console.log('typeof buf: '+typeof buf);
  if(typeof eTag!='string') console.log('typeof eTag: '+eTag);
  var objHead={"Content-Type": mimeType, "Content-Length":buf.length, ETag: eTag, "Cache-Control":"public, max-age=31536000"};
  if(boZip) objHead["Content-Encoding"]='gzip';
  res.writeHead(200, objHead); // "Last-Modified": maxModTime.toUTCString(),
  res.write(buf); //, this.encWrite
  res.end();
}





/******************************************************************************
 * ReqMonitor
 ******************************************************************************/
app.ReqMonitor=function(req, res){
  this.req=req; this.res=res;  this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[];
}

app.ReqMonitor.prototype.go=function(){
  var self=this, req=this.req, res=this.res,  site=req.site;
  var timeCur=unixNow(); boRefresh=0;   if(site.timerNUserLast<timeCur-5*60) {boRefresh=1; site.timerNUserLast=timeCur;}
  var site=req.site, siteName=site.siteName, objQS=req.objQS;
  var userTab=site.TableName.userTab, vendorTab=site.TableName.vendorTab;
  var fiber = Fiber.current;

  if(boRefresh){ 
    var Sql=[];
    //var where="!(idIP REGEXP '^Dummy')";      if(siteName=='demo') where="(idIP REGEXP '^Dummy')";
    var where="!(idIP REGEXP '^Dummy')";      if(req.wwwSite.substr(0,4)=='demo') where="(idIP REGEXP '^Dummy')";
    Sql.push("SELECT count(u.idUser) AS n FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser  WHERE boShow=1 AND "+where+";");
    Sql.push("SELECT count(*) AS n FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser WHERE "+where+";");

    var sql=Sql.join('\n'), Val=[], boDoExit=0;
    myQueryF(sql, Val, this.pool, function(err, results) {
      if(err){ res.out500(err); boDoExit=1; return; }
      site.nVis=results[0][0].n;
      site.nUser=results[1][0].n;
      fiber.run();
    });
    Fiber.yield();  if(boDoExit==1) {  return; }
  }

  var nVis=site.nVis, nUser=site.nUser;
  var Str=this.Str;
  Str.push('<!DOCTYPE html> \n\
<html><head><meta name="robots" content="noindex"></head>');
  var strColor='';
  if('admin' in objQS && objQS.admin){
    if(boRefresh) strColor='lightgreen';
    if(site.boGotNewVendors) strColor='red';
  }
  var strUser=nUser;  if(strColor) strUser="<span style=\"background-color:"+strColor+"\">"+nUser+"</span>";
  Str.push("<body style=\"margin: 0px\">"+nVis+" / "+strUser+"</body>");
  Str.push("</html>");

  var str=Str.join('\n');  res.end(str);

}



/******************************************************************************
 * ReqStat
 ******************************************************************************/
var makeTHead=function(K){
  var strD=''; 
  for(var i=0; i<K.length; i++){var d=K[i]; strD+="<th>"+d+"</th>";}
  var strR="<tr>"+strD+"</tr>";
  return "<thead>"+strR+"</thead>";
}
var makeTBody=function(K,M){
  var strR=''; 
  for(var j=0;j<M.length;j++){
    var r=M[j];
    var strD='';
    //for(var i in r){var d=r[i]; strD+="<td>"+d+"</td>";}
    for(var i=0;i<K.length;i++){var d=r[K[i]]; strD+="<td>"+d+"</td>";}
    strR+="<tr>"+strD+"</tr>";
  }
  return "<tbody>"+strR+"</tbody>";
}
var makeTable=function(K,M){
  return "<table>"+makeTHead(K)+makeTBody(K,M)+"</table>";
}

app.ReqStat=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[];
}
app.ReqStat.prototype.go=function(){
  var self=this, req=this.req, res=this.res,  site=req.site;
  var fiber = Fiber.current;

  var  semY=0, semCB=0, boDoExit=0; 
  this.getData(function(err, results) {
    if(err){ boDoExit=1; res.out500(err);  }
    if(semY) fiber.run(); semCB=1;
  });
  if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) return;

  this.writeData(function(err, results) {});  
}

app.ReqStat.prototype.getData=function(callback){
  var self=this, req=this.req, res=this.res;
  var site=req.site, siteName=site.siteName, objQS=req.objQS;
  var userTab=site.TableName.userTab, vendorTab=site.TableName.vendorTab;

  var Sql=[];
  var where="!(idIP REGEXP '^Dummy')";
  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE "+where+";");
  
  var strCols="u.idUser, IP, idIP, displayName, homeTown, currency, boShow, posTime, CONVERT(BIN(histActive),CHAR(30)) AS histActive, tLastWriteOfTA, timeAccumulated, hideTimer";

  Sql.push("SELECT "+strCols+" FROM "+userTab+" u LEFT JOIN "+vendorTab+" s ON u.idUser=s.idUser WHERE "+where+" \
    UNION   SELECT "+strCols+" FROM "+userTab+" u RIGHT JOIN "+vendorTab+" s ON u.idUser=s.idUser  WHERE "+where+";");

  Sql.push("SELECT "+strCols+" FROM "+userTab+" u RIGHT JOIN "+vendorTab+" s ON u.idUser=s.idUser WHERE u.idUser IS NULL;");
  var sql=Sql.join('\n'), Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){ res.out500(err); callback('exited'); return; }
    self.nUser=results[0][0].n;
    if('code' in objQS && objQS.code=='amfoen') {site.boGotNewVendors=0; site.nUser=self.nUser;}
    self.matA=results[1];
    self.matB=results[2];
    callback(null,'getData');
  });
}
app.ReqStat.prototype.writeData=function(callback){
  var self=this, req=this.req, res=this.res, objQS=req.objQS;
  var nVis=this.nVis, nUser=this.nUser;
  var Str=[];
  Str.push('<!DOCTYPE html> \n\
<html><head> \n\
<meta name="robots" content="noindex"> \n\
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \n\
<style> table,td,tr {border: solid 1px;border-collapse:collapse}</style> \n\
</head> \n\
<body>');
  var nA=this.matA.length;
  Str.push("user OUTER JOIN vendor ("+nA+")");
  if(nA>0){
    var Keys=Object.keys(this.matA[0]);
    for(var i=0;i<this.matA.length;i++){ var tmp=getSuitableTimeUnit(this.matA[i].timeAccumulated); this.matA[i].timeAccumulated=Math.round(tmp[0])+tmp[1]; }
    Str.push(makeTable(Keys,this.matA));
  }
  var nB=this.matB.length;
  Str.push("<hr>vendor.idUser with no user.idUser ("+nB+")");
  if(nB>0){
    var Keys=Object.keys(this.matB[0]);
    Str.push(makeTable(Keys,this.matB));
  }
  
  Str.push("</body></html>");
  var str=Str.join('\n');  res.end(str);
  callback(null,1); 
}



/******************************************************************************
 * ReqOffer
 ******************************************************************************/
app.ReqOffer=function(){}
app.ReqOffer.prototype.filesToRam=function(){
  var self=this;
  this.text={};
  var makeDataWriter=function(strLang,payLev){ return function(err, data){
    if(err){  console.log(err);  return;  }
    self.text[strLang][payLev]=data;
  }}
  for(var i=0;i<arrLangShort.length;i++){
    var strLang=arrLangShort[i];
    this.text[strLang]=[];
    for(var j=0;j<3;j++){
      var payLev=j;
      var strFile="lang/offer/"+strLang+payLev+".html"; 
      fs.readFile(strFile, 'utf8', makeDataWriter(strLang,payLev) );
    }
  }
}
app.ReqOffer.prototype.outputData=function(req,res){
  var objQS=req.objQS;
  var strLang='en'; if('lang' in objQS) strLang=objQS.lang.toLowerCase();
  res.setHeader("Content-Type", 'text/html');
  res.writeHead(200);
  var str='<!DOCTYPE html> \n\
<html><head> \n\
<meta name="robots" content="noindex"> \n\
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \n\
<style> \n\
body {font-family:verdana, arial, helvetica;font-size:100%;margin:0em} \n\
div.yellow{border:3px solid;background-color:#ff0;padding:1em;margin:1em 0em} \n\
</style> \n\
</head><body>';
  res.write(str, 'utf8');
  res.write(this.text[strLang][payLev], 'utf8');
  res.write('</body>\n</html>', 'utf8');
  res.end();
}





 

/******************************************************************************
 * SetupSql
 ******************************************************************************/
app.SetupSql=function(){
}
app.SetupSql.prototype.table=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlTabDrop=[], SqlTab=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]
  var site=Site[siteName]; 
  var Prop=site.Prop, TableName=site.TableName, ViewName=site.ViewName; //, Enum=site.Enum;
  eval(extractLoc(TableName,'TableName'));
  eval(extractLoc(ViewName,'ViewName'));

  var StrTabName=object_values(TableName);
  var tmp=StrTabName.join(', ');
  SqlTabDrop.push("DROP TABLE IF EXISTS "+tmp);     
  SqlTabDrop.push('DROP TABLE IF EXISTS '+userTab);     
  var tmp=object_values(ViewName).join(', ');   if(tmp.length) SqlTabDrop.push("DROP VIEW IF EXISTS "+tmp+"");


  //var nameDB=DB[db].nameDB;
  var collate="utf8_general_ci";
  var engine='INNODB';  //engine='MyISAM';
  var auto_increment=1;

  var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  var strIPDefault=Prop.IP.Enum[0];

	  // Create users
  SqlTab.push("CREATE TABLE "+userTab+" ( \n\
  idUser int(4) NOT NULL auto_increment, \n\
  IP "+strIPEnum+" CHARSET utf8 NOT NULL DEFAULT '"+strIPDefault+"', \n\
  idIP varchar(128) CHARSET utf8 NOT NULL, \n\
  nameIP varchar(128) CHARSET utf8 NOT NULL DEFAULT '', \n\
  image varchar(256) CHARSET utf8 NOT NULL DEFAULT '', \n\
  PRIMARY KEY (idUser), \n\
  UNIQUE KEY (IP,idIP) \n\
  ) AUTO_INCREMENT = "+auto_increment+", ENGINE="+engine+" COLLATE "+collate+""); 


	  // Create vendorTab
  var arrCols=[];
  for(var i=0;i<site.StrOrderDB.length;i++){
    var name=site.StrOrderDB[i];
    var arr=Prop[name];
    var b=arr.b;
    if(Number(b[bFlip.vendorTab])){
      var strType=arr.type || '';
      if(strType=='ENUM'){
        //$tmpName='enum'.ucfirst($name);
        //$arra=$$tmpName;$str=implode("','",$arra); if(count($arra)>0) $str="'$str'";
        var arra=Prop[name].Enum, str=arra.join("','"); if(arra.length) str="'"+str+"'";
        strType="ENUM("+str+")";
      }
      var strNull=Number(b[bFlip.notNull])?'NOT NULL':'';
      var strDefault=''; 
      if('default' in arr){
        var tmp; if(typeof arr.default=='string') tmp="'"+arr.default+"'"; else tmp=arr.default;
        strDefault="DEFAULT "+tmp;
      }
      arrCols.push("`"+name+"` "+strType+" "+strNull+" "+strDefault);
    }//``
  }
  var strSql=arrCols.join(",\n");

  SqlTab.push("CREATE TABLE "+vendorTab+" (\
  "+strSql+",\
  PRIMARY KEY (idUser),\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE\
  ) ENGINE="+engine+" COLLATE "+collate+""); 



    // Create VendorTab indexes
  for(var name in Prop){
  //for(var i=0;i<StrDBCol.length;i++){
    //var name=StrDBCol[i];
    var arr=Prop[name];
    var b=arr.b;
    if(Number(b[bFlip.vendorTabIndex])){
      if(0) SqlFunction.push("CREATE INDEX "+name+"Index ON "+vendorTab+"("+name+")");
    }
  }

  SqlTab.push("CREATE TABLE "+vendorImageTab+" ( \
  idUser int(4) NOT NULL, \
  data BLOB NOT NULL, \
  UNIQUE KEY (idUser), \
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE \
  ) ENGINE="+engine+" COLLATE "+collate+""); 

  SqlTab.push("CREATE TABLE "+teamImageTab+" ( \
  idUser int(4) NOT NULL, \
  data BLOB NOT NULL, \
  UNIQUE KEY (idUser), \
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE \
  ) ENGINE="+engine+" COLLATE "+collate+""); 

  SqlTab.push("CREATE VIEW "+histView+" (idUser, histActive, posTime) AS SELECT idUser, BIN(histActive), posTime FROM "+vendorTab+"");


  SqlTab.push("CREATE TABLE "+paymentTab+" ( \n\
  paymentNumber int(4) NOT NULL auto_increment, \n\
  txn_id varchar(65) CHARSET utf8 NOT NULL, \n\
  payer_email varchar(65) CHARSET utf8 NOT NULL DEFAULT '', \n\
  idUser int(4) NOT NULL, \n\
  amount decimal(5,2) NOT NULL DEFAULT 0, \n\
  currency varchar(3) CHARSET utf8 NOT NULL, \n\
  tax decimal(5,2) NOT NULL DEFAULT 0, \n\
  VATNumber varchar(65) CHARSET utf8 NOT NULL DEFAULT '', \n\
  monthsToAdd int(4) NOT NULL DEFAULT 0, \n\
  payment_date TIMESTAMP DEFAULT 0, \n\
  created TIMESTAMP default CURRENT_TIMESTAMP, \n\
  PRIMARY KEY (paymentNumber), \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");


  SqlTab.push("CREATE TABLE "+settingTab+" ( \n\
  name varchar(65) CHARSET utf8 NOT NULL, \n\
  value varchar(65) CHARSET utf8 NOT NULL, \n\
  UNIQUE KEY (name) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");


	  // Create admin
  SqlTab.push("CREATE TABLE "+adminTab+" ( \n\
  idUser int(4) NOT NULL, \n\
  boApproved tinyint(1) NOT NULL DEFAULT 0, \n\
  created TIMESTAMP default CURRENT_TIMESTAMP, \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  UNIQUE KEY (idUser) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");



	  // Create reportTab
  SqlTab.push("CREATE TABLE "+reportTab+" ( \n\
  idVendor  int(4) NOT NULL, \n\
  idReporter int(4) NOT NULL, \n\
  comment text CHARSET utf8, \n\
  answer text CHARSET utf8, \n\
  created TIMESTAMP NOT NULL default 0, \n\
  modified TIMESTAMP NOT NULL default CURRENT_TIMESTAMP, \n\
  UNIQUE KEY (idVendor,idReporter), \n\
  FOREIGN KEY (idVendor) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  FOREIGN KEY (idReporter) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");



	  // Create teamTab
  SqlTab.push("CREATE TABLE "+teamTab+" ( \n\
  idUser int(4) NOT NULL, \n\
  link varchar(128) CHARSET utf8 NOT NULL DEFAULT '', \n\
  imTag int(4) NOT NULL default 0, \n\
  boApproved tinyint(1) NOT NULL default 0, \n\
  created TIMESTAMP default CURRENT_TIMESTAMP, \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  UNIQUE KEY (idUser) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");

  //name varchar(64) CHARSET utf8 NOT NULL,
  //boFB tinyint(1) NOT NULL,

	  // Create marketers
  SqlTab.push("CREATE TABLE "+marketerTab+" ( \n\
  idUser int(4) NOT NULL, \n\
  boApproved tinyint(1) NOT NULL default 0, \n\
  created TIMESTAMP default CURRENT_TIMESTAMP, \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  UNIQUE KEY (idUser) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");



	  // Create rebateCodeTab
  SqlTab.push("CREATE TABLE "+rebateCodeTab+" ( \n\
  id int(4) NOT NULL auto_increment, \n\
  idUser  int(4) NOT NULL, \n\
  amount  decimal(5,2) NOT NULL default 0, \n\
  months  int(4) NOT NULL default 0, \n\
  code  varchar(20) NOT NULL default '', \n\
  created TIMESTAMP default CURRENT_TIMESTAMP, \n\
  validTill TIMESTAMP DEFAULT 0, \n\
  nLeft int(4) NOT NULL DEFAULT 1, \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  PRIMARY KEY (id), \n\
  UNIQUE KEY (code) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");

	  // Create pubKeyTab
  SqlTab.push("CREATE TABLE "+pubKeyTab+" ( \n\
  idUser  int(4) NOT NULL, \n\
  pubKey  varchar(256) NOT NULL default '', \n\
  iSeq  int(4) NOT NULL default 0, \n\
  FOREIGN KEY (idUser) REFERENCES "+userTab+"(idUser) ON DELETE CASCADE, \n\
  UNIQUE KEY (idUser) \n\
  ) ENGINE="+engine+" COLLATE "+collate+"");


  addBinTableSql(SqlTabDrop,SqlTab,siteName,Prop,engine,collate);



  //SqlTab.push("TRUNCATE "+settingTab+"");
  SqlTab.push("INSERT INTO "+settingTab+" VALUES \
  ('payLev','0'), \
  ('boTerminationCheck','1'), \
  ('boShowTeam','0'), \
  ('tLastWriteOfHA',floor( UNIX_TIMESTAMP(now())/"+sPerDay+" )), \
  ('boGotNewVendors','0'), \
  ('nUser','0')"); 

  }
  if(boDropOnly) return SqlTabDrop;
  else return array_merge(SqlTabDrop, SqlTab);
}


app.SetupSql.prototype.fun=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlFunctionDrop=[], SqlFunction=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite];
  
  var site=Site[siteName]; 
  var Prop=site.Prop, TableName=site.TableName, ViewName=site.ViewName; //, Enum=site.Enum;
  eval(extractLoc(TableName,'TableName'));
  eval(extractLoc(ViewName,'ViewName'));


  var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  var strIPDefault=Prop.IP.Enum[0];


  //VShow "+siteName+"TimeAccumulatedUpdOne -> UPDATE "+vendorTab+" SET boShow=1, posTime=now(), hideTime=date_add(now(), INTERVALL hideTimer SECOND) WHERE idUser=id
  //VHide "+siteName+"TimeAccumulatedUpdOne -> UPDATE "+vendorTab+" SET boShow=0, posTime=0, hideTime=0 WHERE idUser=id
  //IFun "+siteName+"TimeAccumulatedUpdMult -> "+siteName+"AutoHideMult

  // If setting boShow then one must call "+siteName+"TimeAccumulatedUpdOne before. Hence tLastWriteOfTA will never be < than posTime
  var sqlTimeSinceWriteOfTA="UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(tLastWriteOfTA)";  // tLastWriteOfTA, posTime, hideTimer are a columns in vendorTab
  var sqlTWritten="UNIX_TIMESTAMP(tLastWriteOfTA)-UNIX_TIMESTAMP(posTime)";
  var sqlHideTime="DATE_ADD(posTime, INTERVAL hideTimer SECOND)";  
  var sqlTRemaining="GREATEST(hideTimer-("+sqlTWritten+"),0)";
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"TimeAccumulatedUpdOne");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"TimeAccumulatedUpdOne(IN id INT) \
      BEGIN \
        UPDATE "+vendorTab+" SET timeAccumulated=timeAccumulated+LEAST("+sqlTimeSinceWriteOfTA+","+sqlTRemaining+")*boShow, tLastWriteOfTA=now() WHERE idUser=id; \
      END");
  //SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"AutoHideOne");
  //SqlFunction.push("CREATE PROCEDURE "+siteName+"AutoHideOne (IN id INT) BEGIN      UPDATE "+vendorTab+" SET boShow=IF(now()>hideTime,0,boShow) WHERE idUser=id;    END");

    // IFunPoll
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"TimeAccumulatedUpdMult");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"TimeAccumulatedUpdMult() \
      BEGIN       \
        UPDATE "+vendorTab+" SET timeAccumulated=timeAccumulated+LEAST("+sqlTimeSinceWriteOfTA+","+sqlTRemaining+")*boShow, tLastWriteOfTA=now() WHERE boShow=1; \
      END");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"AutoHideMult");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"AutoHideMult() BEGIN      UPDATE "+vendorTab+" SET boShow=IF(now()>"+sqlHideTime+",0,boShow) WHERE boShow=1;    END");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"IFunPoll");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"IFunPoll() BEGIN      CALL "+siteName+"TimeAccumulatedUpdMult; CALL "+siteName+"AutoHideMult; CALL "+siteName+"HistActiveUpdMult;   END");



  
  //sPerDay=10;
  //var dayDiff="floor( UNIX_TIMESTAMP(now())/"+sPerDay+" )  -  floor( UNIX_TIMESTAMP(posTime)/"+sPerDay+" )";
  // tLastWriteOfHA lastHistActiveWrite

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"HistActiveUpdMult");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"HistActiveUpdMult() \n\
    BEGIN \n\
      DECLARE tLastWriteOfHA, recentDay, dayDiff INT; \n\
      START TRANSACTION; \n\
      SELECT value INTO tLastWriteOfHA FROM "+settingTab+" WHERE name='tLastWriteOfHA'; \n\
      SET recentDay=floor( UNIX_TIMESTAMP(now())/"+sPerDay+" );   SET dayDiff=recentDay-tLastWriteOfHA; \n\
      IF dayDiff>0 THEN \n\
        UPDATE "+vendorTab+" SET histActive= (histActive<<dayDiff | boShow) "+sqlMaskHistActive+";    \n\
        UPDATE "+settingTab+" SET value=recentDay WHERE name='tLastWriteOfHA';      \n\
      END IF; \n\
      COMMIT; \n\
    END");

/*
    // HistActiveUpd
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"HistActiveUpdMult");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"HistActiveUpdMult()    BEGIN \
              UPDATE "+vendorTab+" SET histActive= (histActive<<1 | boShow) "+sqlMaskHistActive+";     END");

  //AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE 
  SqlFunctionDrop.push("DROP EVENT IF EXISTS "+siteName+"HistActUpdEv");
  SqlFunction.push("CREATE EVENT "+siteName+"HistActUpdEv \n\
      ON SCHEDULE EVERY 2 SECOND \n\
      DO \n\
        CALL "+siteName+"HistActiveUpdMult;");
  */



      // Create an array from KeyCol/colsDBMask
  var  arrCol=[];
  for(var i=0;i<site.nCol;i++) {
    var name=site.KeyCol[i], b=Prop[name].b;
    if(Number(b[bFlip.DBSelOne]))  {   
      var tmp;   if('selOneF' in Prop[name]){tmp=Prop[name].selOneF(name)+" AS `"+name+"`";}    else tmp="`"+name+"`";
      arrCol.push(tmp);
    }
  }
  var strColTmp=arrCol.join(', ');	

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetUserInfo");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"GetUserInfo(IIP "+strIPEnum+", IidIP varchar(128), IboVendor INT, IboTeam INT, IboMarketer INT, IboAdmin INT, IboReporter INT, OUT OboOk INT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE Vc, Vn, intMax, VidUser INT; \n\
      START TRANSACTION; \n\
      SELECT SQL_CALC_FOUND_ROWS IP-1 AS IP, @idUserTmp:=idUser AS idUser, nameIP, image FROM "+userTab+" WHERE IP=IIP AND idIP=IidIP;\n\
      IF FOUND_ROWS()=0 THEN ROLLBACK; LEAVE proc_label; END IF; \n\
      SET VidUser=@idUserTmp; \n\
      IF IboVendor THEN \n\
        SELECT "+strColTmp+" FROM ("+vendorTab+" v LEFT JOIN "+teamTab+" dis on dis.idUser=v.idTeam) WHERE v.idUser=VidUser; \n\
        SELECT count(paymentNumber) AS n FROM "+paymentTab+" p WHERE idUser=VidUser; \n\
      ELSE SELECT 1 FROM dual WHERE 0; SELECT 1 FROM dual WHERE 0; END IF; \n\
      IF IboTeam THEN  SELECT * FROM "+teamTab+" WHERE idUser=VidUser; ELSE SELECT 1 FROM dual WHERE 0; END IF; \n\
      IF IboMarketer THEN  SELECT * FROM "+marketerTab+" WHERE idUser=VidUser; ELSE SELECT 1 FROM dual WHERE 0; END IF; \n\
      IF IboAdmin THEN SELECT * FROM "+adminTab+" WHERE idUser=VidUser; ELSE SELECT 1 FROM dual WHERE 0; END IF; \n\
      IF IboReporter THEN SELECT count(*) AS n FROM "+reportTab+" WHERE idReporter=VidUser; ELSE SELECT 1 FROM dual WHERE 0; END IF; \n\
      COMMIT; \n\
    END");

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"vendorSetup");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"vendorSetup(IIP "+strIPEnum+", IidIP varchar(128), InameIP varchar(128), Iimage varchar(256), OUT OboInserted INT, OUT OidUser INT) \n\
    BEGIN \n\
      DECLARE Vc INT; \n\
      START TRANSACTION; \n\
      INSERT INTO "+userTab+" (IP, idIP, nameIP, image) VALUES (IIP, IidIP, InameIP, Iimage ) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=InameIP, image=Iimage; \n\
      SET OidUser=LAST_INSERT_ID(); \n\
       \n\
      INSERT INTO "+vendorTab+" (idUser,created, lastPriceChange, posTime, tLastWriteOfTA, histActive) VALUES (OidUser, now(), now(), now(), now(), 1 ) \n\
        ON DUPLICATE KEY UPDATE idUser=idUser; \n\
       \n\
      SET OboInserted=(ROW_COUNT()=1); \n\
       \n\
      COMMIT; \n\
    END");
  var id='100002646477985';
/*
      SELECT idUser, count(*) INTO OidUser,Vc FROM "+userTab+" WHERE IP=IIP AND idIP=IidIP; \n\
      IF Vc=0 THEN \n\
        INSERT INTO "+userTab+" (IP,idIP) VALUES (IIP,IidIP);  \n\
        SELECT LAST_INSERT_ID() INTO OidUser; \n\
      END IF; \n\
CLIENT_FOUND_ROWS
*/

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"MergeID");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"MergeID(IIPOld "+strIPEnum+", IidIPOld varchar(128), IIPNew "+strIPEnum+", IidIPNew varchar(128), OUT OboOk INT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE VidUserNew, VidUserOld INT; \n\
      DECLARE VnameIPNew varchar(128); \n\
      DECLARE VimageNew varchar(256); \n\
      START TRANSACTION; \n\
      SET OboOk=1; \n\
      SELECT SQL_CALC_FOUND_ROWS idUser INTO VidUserOld FROM "+userTab+"  WHERE IP=IIPOld AND idIP=IidIPOld;\n\
      IF FOUND_ROWS()=0 THEN SET OboOk=0, Omess='Old id does not exist'; ROLLBACK; LEAVE proc_label; END IF; \n\
      SELECT SQL_CALC_FOUND_ROWS idUser, nameIP, image INTO VidUserNew, VnameIPNew, VimageNew FROM "+userTab+" WHERE IP=IIPNew AND idIP=IidIPNew;\n\
      IF FOUND_ROWS()=0 THEN SET OboOk=0, Omess='New id does not exist'; ROLLBACK; LEAVE proc_label; END IF; \n\
\n\
      DELETE FROM "+userTab+" WHERE idUser=VidUserNew; \n\
      UPDATE "+userTab+" SET IP=IIPNew, idIP=IidIPNew, nameIP=VnameIPNew, image=VimageNew WHERE idUser=VidUserOld; \n\
      COMMIT; \n\
    END");
  
    //IF VcreatedA<VcreatedB THEN SET VidUserNew=VidUserA, VidUserOld=VidUserB; ELSE SET VidUserNew=VidUserB, VidUserOld=VidUserA; END IF; \n\


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"reporterSetup");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"reporterSetup(IIP "+strIPEnum+", IidIP varchar(128), InameIP varchar(128), Iimage varchar(256), OUT OboInserted INT, OUT OidReporter INT) \n\
    BEGIN \n\
      START TRANSACTION; \n\
      INSERT INTO "+userTab+" (IP, idIP, nameIP, image) VALUES (IIP, IidIP, InameIP, Iimage ) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=InameIP, image=Iimage; \n\
      SET OboInserted=(ROW_COUNT()=1), OidReporter=LAST_INSERT_ID(); \n\
      COMMIT; \n\
    END");

/*
    SELECT idUser, count(*) INTO OidReporter,Vc FROM "+userTab+" WHERE IP=IIP AND idIP=IidIP; \n\
      IF Vc=0 THEN \n\
        INSERT INTO "+userTab+" (IP,idIP) VALUES (IIP,IidIP);  \n\
        SELECT LAST_INSERT_ID() INTO OidReporter; \n\
      END IF; \n\

      SELECT LAST_INSERT_ID() INTO OidReporter; \n\
*/
  //SqlFunction.push("INSERT INTO "+userTab+" (IP,idIP) VALUES ('fb',$id)"); 



  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"UseRebateCode");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"UseRebateCode(Icode varchar(128), IidUser INT, OUT OmonthsToAdd INT, OUT OboOk INT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE Vc, Vn, intMax INT; \n\
      START TRANSACTION; \n\
      SELECT SQL_CALC_FOUND_ROWS months INTO OmonthsToAdd FROM "+rebateCodeTab+" WHERE code=Icode AND validTill>now() AND nLeft!=0; \n\
      SELECT FOUND_ROWS() INTO Vc; \n\
      IF Vc!=1 THEN SET OboOk=0, Omess=CONCAT('rebateCode is not valid, count=',Vc); ROLLBACK; LEAVE proc_label; END IF; \n\
  \n\
      SELECT SQL_CALC_FOUND_ROWS nMonthsStartOffer INTO Vn FROM "+vendorTab+" WHERE idUser=IidUser; \n\
      SELECT FOUND_ROWS() INTO Vc; \n\
      IF Vc!=1 THEN SET OboOk=0, Omess=CONCAT('Vc=',Vc); ROLLBACK; LEAVE proc_label; END IF; \n\
      IF Vn!=0 THEN SET OboOk=0, Omess='Only one startoffer'; ROLLBACK; LEAVE proc_label; END IF; \n\
  \n\
      SET intMax="+intMax+"; \n\
      UPDATE "+vendorTab+" SET nMonthsStartOffer=OmonthsToAdd, \n\
          terminationDate=IF(OmonthsToAdd=intMax, FROM_UNIXTIME(intMax), DATE_ADD(greatest(terminationDate,now()), INTERVAL OmonthsToAdd MONTH) ) WHERE idUser=IidUser; \n\
      UPDATE "+rebateCodeTab+" SET nLeft=nLeft-1 WHERE code=Icode; \n\
      SET OboOK=1, Omess='OK'; \n\
      COMMIT; \n\
    END");
  //SqlFunction.push("CALL "+siteName+"UseRebateCode('abc', 1, @boOK, @mess)"); //echo sqlToVar(SqlFunction.push("SELECT @boInserted"));
  //CALL taxiUseRebateCode('abc', 1, @boOK, @mess); SELECT @boOK, @mess;
  //SET Omess=Vc;   LEAVE proc_label; \


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetIdUserNSetISeq");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"GetIdUserNSetISeq(Ikey varchar(256), iSeqN INT, OUT OidUser INT, OUT OboOK TINYINT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE Vc, Vn, ViSeq INT; \n\
      SELECT SQL_CALC_FOUND_ROWS idUser, iSeq INTO OidUser, ViSeq FROM "+pubKeyTab+" WHERE pubKey=Ikey; \n\
      SET Vc=FOUND_ROWS(); \n\
      IF Vc>1 THEN SET OboOk=0, Omess=CONCAT('pubKey exist multiple times Vc=',Vc); LEAVE proc_label; END IF; \n\
      IF Vc=0 THEN SET OboOk=0, Omess='No such pubKey stored!'; LEAVE proc_label; END IF; \n\
  \n\
      IF iSeqN<=ViSeq THEN SET OboOk=0, Omess='Sequence error, try refresh the keys'; LEAVE proc_label; END IF; \n\
      UPDATE "+pubKeyTab+" SET iSeq=iSeqN WHERE idUser=OidUser; \n\
      SET OboOk=1, Omess=''; \n\
    END");

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetValuesToController");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"GetValuesToController(Ikey varchar(256), iSeqN INT, \n\
       OUT OboShow TINYINT, OUT OtDiff INT, OUT OboOk INT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE Vc, Vn, VIdUser, ViSeq, intMax INT; \n\
      CALL "+siteName+"GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OboOK, Omess); \n\
      IF OboOK=0 THEN LEAVE proc_label; END IF; \n\
      CALL "+siteName+"TimeAccumulatedUpdOne(VidUser); \n\
  \n\
      SELECT SQL_CALC_FOUND_ROWS boShow, UNIX_TIMESTAMP(posTime)+hideTimer -UNIX_TIMESTAMP(now()) INTO OboShow, OtDiff FROM "+vendorTab+" WHERE idUser=VidUser;\n\
      SET Vc=FOUND_ROWS(); \n\
      IF Vc=0 THEN SET OboOk=0, Omess='No such idUser!';  LEAVE proc_label; END IF; \n\
      IF OtDiff<0 THEN SET OboShow=0; END IF; \n\
      SET OboOK=1, Omess=''; \n\
  \n\
    END");

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"SetValuesFromController");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"SetValuesFromController(Ikey varchar(256), iSeqN INT, Ix DOUBLE, Iy DOUBLE, IboShow TINYINT, IhideTimer INT, \n\
      OUT OboOK TINYINT, OUT Omess varchar(128)) \n\
    proc_label:BEGIN \n\
      DECLARE Vc, Vn, VIdUser, ViSeq, VresM INT; \n\
      START TRANSACTION; \n\
      CALL "+siteName+"GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OboOK, Omess); \n\
      IF OboOK=0 THEN ROLLBACK; LEAVE proc_label; END IF; \n\
      CALL "+siteName+"TimeAccumulatedUpdOne(VidUser); \n\
  \n\
      IF IboShow=0 THEN  # If hiding\n\
        UPDATE "+vendorTab+" SET boShow=IboShow, posTime=now(), histActive=histActive|1 WHERE idUser=VIdUser; \n\
        SET OboOK=1, Omess='';\n\
        COMMIT; LEAVE proc_label; \n\
      END IF; \n\
  \n\
         # If showing \n\
      SELECT SQL_CALC_FOUND_ROWS coordinatePrecisionM INTO VresM FROM "+vendorTab+" WHERE idUser=VIdUser; \n\
      SET Vc=FOUND_ROWS(); \n\
      IF Vc=0 THEN SET OboOk=0, Omess='No such idUser!'; ROLLBACK; LEAVE proc_label; END IF; \n\
      IF VresM<1 THEN SET VresM=1; END IF; \n\
      CALL roundXY(VresM, Ix, Iy, Ix, Iy); \n\
  \n\
      UPDATE "+vendorTab+" SET x=Ix, y=Iy, boShow=IboShow, hideTimer=IhideTimer, posTime=now(), histActive=histActive|1 WHERE idUser=VIdUser; \n\
      SET OboOK=1, Omess='';\n\
      COMMIT; \n\
    END");


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupMake");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"dupMake() \n\
      BEGIN \n\
        CALL copyTable('"+userTab+"_dup','"+userTab+"'); \n\
        CALL copyTable('"+vendorTab+"_dup','"+vendorTab+"'); \n\
        CALL copyTable('"+vendorImageTab+"_dup','"+vendorImageTab+"'); \n\
        CALL copyTable('"+teamTab+"_dup','"+teamTab+"'); \n\
        CALL copyTable('"+teamImageTab+"_dup','"+teamImageTab+"'); \n\
        CALL copyTable('"+reportTab+"_dup','"+reportTab+"'); \n\
        CALL copyTable('"+paymentTab+"_dup','"+paymentTab+"'); \n\
        CALL copyTable('"+marketerTab+"_dup','"+marketerTab+"'); \n\
        CALL copyTable('"+rebateCodeTab+"_dup','"+rebateCodeTab+"'); \n\
        CALL copyTable('"+adminTab+"_dup','"+adminTab+"'); \n\
        CALL copyTable('"+pubKeyTab+"_dup','"+pubKeyTab+"'); \n\
      END");


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupRename");
 /* SqlFunction.push("CREATE PROCEDURE "+siteName+"dupRename() \n\
      BEGIN \n\
RENAME TABLE "+userTab+" TO "+userTab+"_dup,\n\
             "+vendorTab+" TO "+vendorTab+"_dup,\n\
             "+vendorImageTab+" TO "+vendorImageTab+"_dup,\n\
             "+teamTab+" TO "+teamTab+"_dup,\n\
             "+teamImageTab+" TO "+teamImageTab+"_dup,\n\
             "+reportTab+" TO "+reportTab+"_dup,\n\
             "+paymentTab+" TO "+paymentTab+"_dup,\n\
             "+marketerTab+" TO "+marketerTab+"_dup,\n\
             "+rebateCodeTab+" TO "+rebateCodeTab+"_dup,\n\
             "+adminTab+" TO "+adminTab+"_dup,\n\
             "+pubKeyTab+" TO "+pubKeyTab+"_dup;\n\
      END");*/

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupTrunkOrgNCopyBack");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"dupTrunkOrgNCopyBack() \n\
      BEGIN \n\
        DELETE FROM "+pubKeyTab+" WHERE 1; \n\
        DELETE FROM "+vendorTab+" WHERE 1; \n\
        DELETE FROM "+vendorImageTab+" WHERE 1; \n\
        DELETE FROM "+teamTab+" WHERE 1; \n\
        DELETE FROM "+teamImageTab+" WHERE 1; \n\
        DELETE FROM "+reportTab+" WHERE 1; \n\
        DELETE FROM "+paymentTab+" WHERE 1; \n\
        DELETE FROM "+marketerTab+" WHERE 1; \n\
        DELETE FROM "+rebateCodeTab+" WHERE 1; \n\
        DELETE FROM "+adminTab+" WHERE 1; \n\
        DELETE FROM "+userTab+" WHERE 1; \n\
         \n\
        INSERT INTO "+userTab+" SELECT * FROM "+userTab+"_dup; \n\
        INSERT INTO "+vendorTab+" SELECT * FROM "+vendorTab+"_dup; \n\
        INSERT INTO "+vendorImageTab+" SELECT * FROM "+vendorImageTab+"_dup; \n\
        INSERT INTO "+teamTab+" SELECT * FROM "+teamTab+"_dup; \n\
        INSERT INTO "+teamImageTab+" SELECT * FROM "+teamImageTab+"_dup; \n\
        INSERT INTO "+reportTab+" SELECT * FROM "+reportTab+"_dup; \n\
        INSERT INTO "+paymentTab+" SELECT * FROM "+paymentTab+"_dup; \n\
        INSERT INTO "+marketerTab+" SELECT * FROM "+marketerTab+"_dup; \n\
        INSERT INTO "+rebateCodeTab+" SELECT * FROM "+rebateCodeTab+"_dup; \n\
        INSERT INTO "+adminTab+" SELECT * FROM "+adminTab+"_dup; \n\
        INSERT INTO "+pubKeyTab+" SELECT * FROM "+pubKeyTab+"_dup; \n\
      END");

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupDrop");
  SqlFunction.push("CREATE PROCEDURE "+siteName+"dupDrop() \n\
      BEGIN \n\
        DROP TABLE IF EXISTS "+pubKeyTab+"_dup; \n\
        DROP TABLE IF EXISTS "+vendorTab+"_dup; \n\
        DROP TABLE IF EXISTS "+vendorImageTab+"_dup; \n\
        DROP TABLE IF EXISTS "+teamTab+"_dup; \n\
        DROP TABLE IF EXISTS "+teamImageTab+"_dup; \n\
        DROP TABLE IF EXISTS "+reportTab+"_dup; \n\
        DROP TABLE IF EXISTS "+paymentTab+"_dup; \n\
        DROP TABLE IF EXISTS "+marketerTab+"_dup; \n\
        DROP TABLE IF EXISTS "+rebateCodeTab+"_dup; \n\
        DROP TABLE IF EXISTS "+adminTab+"_dup; \n\
        DROP TABLE IF EXISTS "+userTab+"_dup; \n\
      END");

  }
  var SqlA=this.funcGen(boDropOnly);
  if(boDropOnly) var SqlB=SqlFunctionDrop;
  else var SqlB=array_merge(SqlFunctionDrop, SqlFunction);
  return array_merge(SqlA, SqlB);
}


app.SetupSql.prototype.funcGen=function(boDropOnly){
  var SqlFunction=[], SqlFunctionDrop=[];
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS copyTable");
  SqlFunction.push("CREATE PROCEDURE copyTable(INameN varchar(128),IName varchar(128)) \n\
    BEGIN \n\
      SET @q=CONCAT('DROP TABLE IF EXISTS ', INameN,';');     PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1; \n\
      SET @q=CONCAT('CREATE TABLE ',INameN,' LIKE ',IName,';');   PREPARE stmt1 FROM @q;  EXECUTE stmt1; DEALLOCATE PREPARE stmt1; \n\
      SET @q=CONCAT('INSERT INTO ',INameN, ' SELECT * FROM ',IName,';');    PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1; \n\
    END");


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundXY");
  SqlFunction.push("CREATE PROCEDURE roundXY(resM DOUBLE, x DOUBLE, y DOUBLE, OUT Ox DOUBLE, OUT Oy DOUBLE) \n\
    proc_label:BEGIN \n\
      DECLARE resT DOUBLE; \n\
      DECLARE resP DOUBLE; \n\
      SET resT=resM; \n\
      IF ABS(y-128)>53.66 THEN SET resT=ROUND(resT/2); END IF; \n\
      IF ABS(y-128)>84.08 THEN SET resT=ROUND(resT/2); END IF;\n\
      SET resP=resT*"+m2p+", Ox=ROUND(x/resP)*resP, Oy=ROUND(y/resP)*resP; \n\
    END");

  if(boDropOnly) return SqlFunctionDrop;
  else return array_merge(SqlFunctionDrop, SqlFunction);
}

app.SetupSql.prototype.dummies=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlDummies=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite];

  var site=Site[siteName]; 

  var arrAddress=[];
  //arrAddress.push({country:'Sweden', homeTown:'Uppsala', currency:'SEK', x:140.51976455111, y:74.570362445619, n:5, std:0.1});
  //arrAddress.push({country:'Sweden', homeTown:'Stockholm', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});

  if(1){
  /*
  arrAddress.push({country:'Sweden', homeTown:'Solna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Upplands Väsby', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Sollentuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Nortälje', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Södertälje', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Sigtuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Värmdö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Haninge', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Nynäshamn', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Nykvarn', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Ekerö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  */
  /*arrAddress.push({country:'Sweden', homeTown:'Salem', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Botkyrka', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Huddinge', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Tyresö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Nacka', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Lindingö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Sundbyberg', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Järfälla', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Danderyd', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Vaxholm', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Täby', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Vallentuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  arrAddress.push({country:'Sweden', homeTown:'Österåker', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
  */
  /*
  arrAddress.push({country:'Sweden', homeTown:'Göteborg', currency:'SEK', x:136.51532755738089, y:77.49346382340636, n:7, std:0.3});
  arrAddress.push({country:'Denmark', homeTown:'København', currency:'DKK', x:136.93473555466124, y:80.13125508448312, n:7, std:0.3});
  arrAddress.push({country:'Norway', homeTown:'Oslo', currency:'NOK', x:135.64994551559874, y:74.46792500635812, n:7, std:0.3});
  arrAddress.push({country:'Finland', homeTown:'Helsinki', currency:'EUR', x:145.73099340101697, y:74.05775005653538, n:7, std:0.3});
  */

  arrAddress.push({country:'UK', homeTown:'London', currency:'GBP', x:127.92629919892141, y:85.11312706193192, n:10, std:0.5});
  //arrAddress.push({country:'France', homeTown:'Paris', currency:'EUR', x:129.6294241989214, y:88.07406456193192, n:10, std:0.5});
  //arrAddress.push({country:'Italy', homeTown:'Rom', currency:'EUR', x:136.8811346138079, y:95.13470489701334, n:10, std:0.5});
  //arrAddress.push({country:'Spain', homeTown:'Madrid', currency:'EUR', x:125.37955748049507, y:96.54275866022407, n:10, std:0.5});
  arrAddress.push({country:'USA', homeTown:'NY', currency:'USD', x:75.39355286293579, y:96.21422827476029, n:10, std:0.5});
  //arrAddress.push({country:'USA', homeTown:'Chicago', currency:'USD', x:65.67872790747845, y:95.16096079575951, n:10, std:0.5});
  arrAddress.push({country:'USA', homeTown:'LA', currency:'USD', x:43.95576759128889, y:102.2555423122189, n:10, std:0.5});
  arrAddress.push({country:'Japan', homeTown:'Tokyo', currency:'JPY', x:227.3887757633159, y:100.80702770236107, n:10, std:0.5});
  arrAddress.push({country:'China', homeTown:'Beijing', currency:'CNY', x:210.7708451431501, y:96.99141526807438, n:10, std:0.5});
  arrAddress.push({country:'India', homeTown:'Mumbai', currency:'INR', x:179.7837377942387, y:114.25584433021675, n:10, std:0.5});

  }

  var SEK2CUR={SEK:1,USD:0.14,GBP:0.1,EUR:0.12,CNY:0.72,JPY:14.37,INR:7.35,DKK:1,NOK:1}

  var arrBucket=[]; // To make vendors from big cities more likely to appear than vendors from small cities
  for(var i=0;i<arrAddress.length;i++){
    var objT=arrAddress[i];
    arrBucket=array_mergeM(arrBucket,array_fill(objT.n,i.toString()));
  }

  var getRandomPostAddress=function(){
    var key=arrBucket[randomInt(0, arrBucket.length-1)];
    var AddressT=arrAddress[key];
    AddressT.x+=gauss_ms(0,AddressT.std); AddressT.y+=gauss_ms(0,AddressT.std);  
    return AddressT;
  }


  var TableName=site.TableName, ViewName=site.ViewName, Prop=site.Prop;
  var Enum={};   for(var name in Prop) {if('Enum' in Prop[name]) Enum[name]=Prop[name].Enum.concat([]); }   //extend(Enum,site.Enum);
  eval(extractLoc(TableName,'TableName'));
  eval(extractLoc(ViewName,'ViewName'));
  //var VendorUpdF=site.VendorUpdF;

  var makeEnumRandF=function(name){  var enumT=Enum[name]; return enumT[randomInt(0, enumT.length-1)];  };
  var getRandomDate=function(diff){ var now=unixNow(), v0, v1; if(diff>0){t0=now; t1=now+diff;} else{t0=now+diff; t1=now;} return randomInt(t0, t1);}; // Random historic time in [now-diff,now]
  var makeDateRandF=function(name){ var dateSpan=DateSpan[name]; return getRandomDate(dateSpan);};
  var makeRandSpanF=function(name){ var tmp=RandSpanData[name]; return randomInt(tmp[0],tmp[1]);};
  var makeRandSpanPriceF=function(name){ var tmp=makeRandSpanF(name), cur=this.currency, fac=SEK2CUR[cur];  tmp=tmp*fac; return tmp;};
  var makeFixedF=function(name){ return FixedData[name]; };

  //if(siteName=='taxi' || siteName=='demo' || siteName=='test') Enum.vehicleType=['sedan', 'wagon', 'largeMPV', 'MPV', 'hatchback'];
  if(siteName=='taxi') Enum.vehicleType=['sedan', 'wagon', 'largeMPV', 'MPV', 'hatchback'];
  if(siteName=='transport') Enum.vehicleType=['sedan', 'wagon', 'largeMPV', 'MPV','pickup', 'van', 'lorry'];
  var MakeRandF={}, DateSpan={}, RandSpanData={}, FixedData={};
  MakeRandF.vehicleType=makeEnumRandF;

  MakeRandF.standingByMethod=makeEnumRandF;

  Enum.brand=['Volvo','Saab','VW','Toyota','Ford','Hyundai','Mercedes','Fiat','Dodge','Mazda','BMW','Audi','Lloyd','Opel','Skoda','Ferrari','Lamborgini','Seat','Chrysler','Chevrolet','Scania','Aston Martin','Bentley','Jaguar','Land Rover','Honda','Nissan','Rolls Royce'];  MakeRandF.brand=makeEnumRandF;
  Enum.link=['example.com','www.example.com','closeby.market','gavott.com','example.com',''];    MakeRandF.link=makeEnumRandF;
  Enum.nPassengers=[2,3,4,5,6,7,8];     MakeRandF.nPassengers=makeEnumRandF;
  Enum.childSeat=Enum.extraSeat=Enum.wheelChairPlaces=[0,1,2];     MakeRandF.childSeat=MakeRandF.extraSeat=MakeRandF.wheelChairPlaces=makeEnumRandF;
  Enum.idTeam=Enum.idTeamWanted=[1,2,3];    MakeRandF.idTeam=MakeRandF.idTeamWanted=makeEnumRandF;

   
  DateSpan.created=-2*8760*3600;   MakeRandF.created=makeDateRandF;
  DateSpan.posTime=-12*3600;   MakeRandF.posTime=makeDateRandF;
  DateSpan.tLastWriteOfTA=0;   MakeRandF.tLastWriteOfTA=makeDateRandF;
  DateSpan.terminationDate=4*30*24*3600;   MakeRandF.terminationDate=makeDateRandF;
  DateSpan.lastPriceChange=-30*24*3600;   MakeRandF.lastPriceChange=makeDateRandF;
  DateSpan.shiftEnd=12*3600;   MakeRandF.shiftEnd=makeDateRandF;

  RandSpanData.donatedAmount=[0, 1000];  MakeRandF.donatedAmount=makeRandSpanF;
  RandSpanData.timeAccumulated=[0, 2*8760*3600];  MakeRandF.timeAccumulated=makeRandSpanF;
  FixedData.hideTimer=3600*24*365;  MakeRandF.hideTimer=makeFixedF;
  RandSpanData.priceStart=[20,45];  MakeRandF.priceStart=makeRandSpanPriceF;
  Enum.distUnit=["km","mile"];  MakeRandF.distUnit=makeEnumRandF;
  RandSpanData.pricePerDist=[10,20];   MakeRandF.pricePerDist=makeRandSpanPriceF;
  RandSpanData.pricePerHour=[200,400];   MakeRandF.pricePerHour=makeRandSpanPriceF;
  RandSpanData.idDriverGovernment=[1000,2000];   MakeRandF.idDriverGovernment=makeRandSpanF;
  FixedData.boShow=1;  MakeRandF.boShow=makeFixedF;
  FixedData.histActive=1;  MakeRandF.histActive=makeFixedF;
  FixedData.coordinatePrecisionM=1;  MakeRandF.coordinatePrecisionM=makeFixedF;



  var nData=10;
  //var nData=1000;
  //var nData=10000;

  //if(siteName=='demo') nData=500;
  if(boLocal) nData=5;
  if(site.wwwSite.substr(0,4)=='demo') nData=50;

  var StringData=['displayName', 'tel', 'link', 'homeTown', 'currency', 'vehicleType', 'distUnit', 'standingByMethod', 'idDriverGovernment', 'brand', 'otherLang'];

  var StrPlugIn=site.StrPlugIn;
  if(in_array("general", StrPlugIn)){ arrUpd=['donatedAmount', 'boShow', 'created', 'posTime', 'histActive', 'tLastWriteOfTA', 'timeAccumulated', 'hideTimer', 'terminationDate', 'displayName', 'tel', 'link', 'homeTown', 'currency', 'lastPriceChange', 'x', 'y', 'nMonthsStartOffer', 'imTag', 'idTeam', 'idTeamWanted', 'boImgOwn', 'coordinatePrecisionM']; }

  if(in_array("transportProt", StrPlugIn)){ arrUpd=arrUpd.concat(['vehicleType']);  }
  if(in_array("transportPrice", StrPlugIn)){ arrUpd=arrUpd.concat(['priceStart', 'distUnit', 'pricePerDist', 'pricePerHour']);  }
  if(in_array("transportUrgent", StrPlugIn)){  Str_insertM(arrUpd,'homeTown',['standingByMethod']);   }
  if(in_array("night", StrPlugIn)){ arrUpd=arrUpd.concat(['shiftEnd']);  }


  //if(intersectBool(["taxi", "demo", "test"], StrPlugIn)){
  if(in_array("taxi", StrPlugIn)){
    Enum.nPassengers=range(2,20,1);

    arrUpd=arrUpd.concat(['brand','idDriverGovernment'], site.StrPropTaxi);
  }

  if(in_array("transport", StrPlugIn)){
    var StrTransportBool=site.StrTransportBool;
    for(var i=0;i<StrTransportBool.length;i++){ var name=StrTransportBool[i]; Enum[name]=[0,1]; MakeRandF[name]=makeEnumRandF; }
    var name='payload';Enum[name]=range(0,15,0.5); MakeRandF[name]=makeEnumRandF;

    arrUpd=arrUpd.concat(['payload','brand'],StrTransportBool);
  }
  if(intersectBool(["cleaner", "windowcleaner"], StrPlugIn)){ 
    var StrCleanerBool=site.StrCleanerBool;
    for(var i=0;i<StrCleanerBool.length;i++){ var name=StrCleanerBool[i]; Enum[name]=[0,1]; MakeRandF[name]=makeEnumRandF; }
    arrUpd=arrUpd.concat(StrCleanerBool);
  }
  if(in_array("lawnmower", StrPlugIn)){ 
    var StrToolBool=site.StrToolBool;
    for(var i=0;i<StrToolBool.length;i++){ var name=StrToolBool[i]; Enum[name]=[0,1]; MakeRandF[name]=makeEnumRandF; }
    var name='cuttingWidth';Enum[name]=range(30,150,2); MakeRandF[name]=makeEnumRandF;
    arrUpd=arrUpd.concat(StrToolBool,['cuttingWidth']);
  }
  if(in_array("snowremoval", StrPlugIn)){ 
    var StrToolBool=site.StrToolBool;
    for(var i=0;i<StrToolBool.length;i++){ var name=StrToolBool[i]; Enum[name]=[0,1]; MakeRandF[name]=makeEnumRandF; }
    arrUpd=arrUpd.concat(StrToolBool);
  }
  if(in_array("hourlyPrice", StrPlugIn)){ 
    arrUpd=arrUpd.concat(['pricePerHour']);
  }
  if(in_array("programmer", StrPlugIn)){ 
    var StrProgrammerLang=site.StrProgrammerLang;
    for(var i=0;i<StrProgrammerLang.length;i++){ var name=StrProgrammerLang[i]; Enum[name]=[0,1,2,3,4,5]; MakeRandF[name]=makeEnumRandF; }
    var name='otherLang';Enum[name]=['','Matlab','Babyloninan','Bad language']; MakeRandF[name]=makeEnumRandF;
    arrUpd=arrUpd.concat(StrProgrammerLang,['otherLang']);
  }



  var StrUpd=[]; 
  var SqlAllU=[], SqlAllV=[];

  var ValAll=[], SqlAll=[];
  var AddressT={};
  for(var i=1;i<nData+1;i++){  
      // Add a call to vendorSetup and add values
    var tmp="Dummy"+i, person={idIP:tmp, displayName:tmp, tel:"07000000"+i};
    var ValCurU=[];

    var idTmp=i+1,  sqlCurU="("+idTmp+", 'openid', '"+person.idIP+"', 'Dummy')"; 

            // Add a query to update vendorTab and add values
    var AddressT=extend(AddressT,getRandomPostAddress());
    //var xd=gauss_ms(0,AddressT.std), xOrg=AddressT.x; 
    //if(AddressT.homeTown=='London') console.log(xOrg.toFixed(2)+' '+AddressT.x.toFixed(2)+' '+xd.toFixed(2));



    var StrName=[];
    var StrIns=[];
    var ValCurV=[];
    for(var j=0;j<arrUpd.length;j++){
      var name=arrUpd[j], QMark="?", value=0;
      if(name in person) value=person[name]; 
      else if(name in AddressT) value=AddressT[name];
      else if(name in MakeRandF){ value=MakeRandF[name].call(AddressT,name);  }
      //if(name in VendorUpdF){ var tmp=VendorUpdF[name].call(site.Enum,name,value); QMark=tmp[0]; var trash=tmp[1];  }
      if('vendorUpdF' in Prop[name]){ var tmp=Prop[name].vendorUpdF.call(Prop,name,value); QMark=tmp[0]; var trash=tmp[1];  }
      var valT=QMark.replace(/\?/,value);     
      if(in_array(name,StringData) && value!==null){ valT="'"+valT+"'";}

      StrName.push("`"+name+"`");
      StrIns.push(valT);
      ValCurV.push(value);
    }
    var strName=StrName.join(', ');
    var strIns=StrIns.join(', ');  

    var sqlCurV="("+idTmp+", "+strIns+")";

    SqlAllU.push(sqlCurU); SqlAllV.push(sqlCurV);
    
  }

  var tmp=SqlAllU.join(",");
  SqlDummies.push("INSERT INTO "+userTab+" (idUser, IP, idIP, nameIP) VALUES "+tmp);
  
  var tmp=SqlAllV.join(",");
  SqlDummies.push("INSERT INTO "+vendorTab+" (idUser, "+strName+") VALUES "+tmp);


  //var idPre='10000',  idNum=2646477985;
  //var idPre='10000000000000';  idNum=0;
  //var IdReporter=[idPre+(idNum+1), idPre+(idNum+2), idPre+(idNum+5)];
  var IdReporter=[2, 3, 4];
  //var StrName=['Al Alba', 'Bob Bee', 'Cody Colt'];

  var StrReport=['He never answered the phone', 'No good', 'Bad bad bad'];
  var StrAns=['I was on the toilet', "Sorry, I'm a bit new.", ''];

  var nReporter=IdReporter.length;

  for(var j=0;j<10;j++){ //loop through drivers
    for(var i=0;i<nReporter;i++){
      var idRep=IdReporter[i], iRep=(i+j)%nReporter, strRep=StrReport[iRep], iAns=(i+2*j)%nReporter, strAns=StrAns[iAns];
      SqlDummies.push("INSERT INTO "+reportTab+" (idVendor, idReporter, comment, answer, created, modified) SELECT idUser, "+idRep+", \""+strRep+"\", \""+strAns+"\", now(), now() FROM "+userTab+" WHERE idIP REGEXP '^Dummy' AND idUser%10="+j);
    }
  }
  }
  return SqlDummies;
}

app.SetupSql.prototype.dummy=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlDummy=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]

  var site=Site[siteName]; 
  var TableName=site.TableName, ViewName=site.ViewName; //, Enum=site.Enum;
  eval(extractLoc(TableName,'TableName'));

  var id=100002646477985;
  SqlDummy.push("CALL "+siteName+"vendorSetup('fb', "+id+", 'Minnie the Moocher', 'http://example.com/abc.jpg', @boInserted, @idUser)");
  SqlDummy.push("CALL "+siteName+"reporterSetup('fb', "+id+", 'Minnie the Moocher', 'http://example.com/abc.jpg', @boInserted, @idReporter)"); //echo sqlToVar(SqlFunction.push("SELECT @boInserted"));

  SqlDummy.push("UPDATE "+vendorTab+" SET terminationDate=DATE_ADD(now(),INTERVAL 10 YEAR)"); 
  SqlDummy.push("REPLACE INTO "+adminTab+" (idUser,boApproved,created) VALUES (@idUser,1,now())"); 


  SqlDummy.push("REPLACE INTO "+marketerTab+" (idUser,boApproved,created) VALUES (@idUser,1,now())");

  SqlDummy.push("REPLACE INTO "+rebateCodeTab+" (id, idUser, amount, months, code, created, validTill, nLeft) VALUES (1,@idUser,0,4,'abc',now(),DATE_ADD(now(),INTERVAL 1 YEAR),10)");

  SqlDummy.push("REPLACE INTO "+teamTab+" (idUser,link,boApproved,created) VALUES (@idUser,'http://closeby.market',1,now())"); 
  }
  return SqlDummy;
}

app.SetupSql.prototype.truncate=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlTableTruncate=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]
  var site=Site[siteName]; 

  var StrTabName=object_values(site.TableName);

  var SqlTmp=[];
  for(var i=0;i<StrTabName.length;i++){
    SqlTmp.push(StrTabName[i]+" WRITE");
  }
  var tmp="LOCK TABLES "+SqlTmp.join(', ');
  SqlTableTruncate.push(tmp);
  for(var i=0;i<StrTabName.length;i++){
    SqlTableTruncate.push("DELETE FROM "+StrTabName[i]);
    SqlTableTruncate.push("ALTER TABLE "+StrTabName[i]+" AUTO_INCREMENT = 1");
  }
  SqlTableTruncate.push('UNLOCK TABLES');
  }
  return SqlTableTruncate;
}

app.SetupSql.prototype.StrValid=['table', 'dropTable', 'fun', 'dropFun', 'truncate', 'dummy', 'dummies'];
app.SetupSql.prototype.doQuery=function(strCreateSql){
  var fiber = Fiber.current;
  //var StrValid=['table', 'dropTable', 'fun', 'dropFun', 'truncate', 'dummy', 'dummies'];
  var StrValidMeth=['table', 'fun', 'truncate', 'dummy', 'dummies'];
  var Match=RegExp("^(drop)?(.*?)(All)?$").exec(strCreateSql);
  //var Match=RegExp("^(drop)?(.*?)All$").exec(strCreateSql);
  var boErr=true;
  if(Match) {
    var boDropOnly=Match[1]=='drop', strMeth=Match[2].toLowerCase(); //, boAll=Match[3]=='All';
    //var objProtT=Object.getPrototypeOf(this); 
    if(StrValidMeth.indexOf(strMeth)!=-1){
      //var SqlA=objProtT[strMeth].call(this, SiteName, boDropOnly); 
      var SqlA=this[strMeth](SiteName, boDropOnly); 
      var strDelim=';', sql=SqlA.join(strDelim+'\n')+strDelim, Val=[], boDoExit=0;
      //var keys=Object.keys(UriDB), poolTmp=DB[keys[0]].pool;
      if(!('default' in DB)) {console.log('no DB.default');}
      var poolTmp=DB.default.pool; 
      myQueryF(sql, Val, poolTmp, function(err, results){ 
        var tmp=createMessTextOfMultQuery(SqlA, err, results);  console.log(tmp); 
        if(err){            boDoExit=1;  debugger;         } 
        fiber.run();
      });
      Fiber.yield();  if(boDoExit==1) return;

      boErr=false;
    }
  }
  if(boErr) {var tmp=strCreateSql+' is not valid input, try: '+this.StrValid+' (suffixed with "All")'; console.log(tmp); }
}

var createMessTextOfMultQuery=function(Sql, err, results){
  var nSql=Sql.length, nResults='na'; if(results instanceof Array) nResults=results.length;
  var StrMess=[];   StrMess.push('nSql='+nSql+', nResults='+nResults);
  if(err){
    StrMess.push('err.index: '+err.index+', err: '+err);
    if(nSql==nResults){
      var tmp=Sql.slice(bound(err.index-1,0,nSql), bound(err.index+2,0,nSql)),  sql=tmp.join('\n');
      StrMess.push('Since "Sql" and "results" seem correctly aligned (has the same size), then here, in the middle, is printed the query with the corresponding index (surounded by the preceding and following query to get a context):\n'+sql); 
    }
  }
  return StrMess.join('\n');
}


/******************************************************************************
 * ReqSql
 ******************************************************************************/
app.ReqSql=function(req, res){
  this.req=req; this.res=res;
  this.StrType=['table', 'fun', 'dropTable', 'dropFun', 'truncate', 'dummy', 'dummies']; 
}
app.ReqSql.prototype.createZip=function(objSetupSql){
  var res=this.res, StrType=this.StrType;

  var zipfile = new NodeZip();
  for(var i=0;i<StrType.length;i++) {
    var strType=StrType[i], SqlA;
    var Match=RegExp("^(drop)?(.*)$").exec(strType), boDropOnly=Match[1]=='drop';
    var SqlA=objSetupSql[Match[2].toLowerCase()](SiteName, boDropOnly);
    var strDelim=';;', sql='-- DELIMITER '+strDelim+'\n'      +SqlA.join(strDelim+'\n')+strDelim      +'\n-- DELIMITER ;\n';
    zipfile.file(strType+".sql", sql, {date:new Date(), compression:'DEFLATE'});
  }

  //var objArg={base64:false}; if(boCompress) objArg.compression='DEFLATE';
  var objArg={type:'string'}; //if(boCompress) objArg.compression='DEFLATE';
  var outdata = zipfile.generate(objArg);


  var outFileName=strAppName+'Setup.zip';
  var objHead={"Content-Type": 'application/zip', "Content-Length":outdata.length, 'Content-Disposition':'attachment; filename='+outFileName};
  res.writeHead(200,objHead);
  res.end(outdata,'binary');
}
ReqSql.prototype.toBrowser=function(objSetupSql){
  var req=this.req, res=this.res, StrType=this.StrType;
  var Match=RegExp("^(drop)?(.*?)(All)?$").exec(req.pathNameWOPrefix), boDropOnly=Match[1]=='drop', strMeth=Match[2].toLowerCase(), boAll=Match[3]=='All', SiteNameT=boAll?SiteName:[req.siteName];
  var StrValidMeth=['table', 'fun', 'truncate',  'dummy', 'dummies'];
  //var objTmp=Object.getPrototypeOf(objSetupSql);
  if(StrValidMeth.indexOf(strMeth)!=-1){
    var SqlA=objSetupSql[strMeth](SiteNameT, boDropOnly); 
    var strDelim=';;', sql='-- DELIMITER '+strDelim+'\n'      +SqlA.join(strDelim+'\n')+strDelim      +'\n-- DELIMITER ;\n';
    res.out200(sql);
  }else{ var tmp=req.pathNameWOPrefix+' is not valid input, try: '+this.StrType+' (suffixed with "All" if you want to)'; console.log(tmp); res.out404(tmp); }
}  





app.createDumpCommand=function(){ 
  var strCommand='', StrTabType=['user','vendor','vendorImage','team','teamImage','setting','report','rebateCode','pubKey','payment','marketer','admin'];
  for(var i=0;i<StrTabType.length;i++){
    var strTabType=StrTabType[i], StrTab=[];
    for(var j=0;j<SiteName.length;j++){
      var siteName=SiteName[j];
      StrTab.push(siteName+'_'+strTabType);
    }
    strCommand+='          '+StrTab.join(' ');
  }
  strCommand="mysqldump mmm --user=root -p --no-create-info --hex-blob"+strCommand+'          >tracker.sql';

  return strCommand;
}


/*
CREATE DATABASE ip2location;
USE ip2location;

CREATE TABLE `ip2location_db1`(
	`ip_from` INT(10) UNSIGNED,
	`ip_to` INT(10) UNSIGNED,
	`country_code` CHAR(2),
	`country_name` VARCHAR(64),
	INDEX `idx_ip_from` (`ip_from`),
	INDEX `idx_ip_to` (`ip_to`),
	INDEX `idx_ip_from_to` (`ip_from`, `ip_to`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOAD DATA LOCAL
	INFILE '/home/magnus/Downloads/IP2LOCATION-LITE-DB1.CSV/IP2LOCATION-LITE-DB1.CSV'
INTO TABLE
	`ip2location_db1`
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 0 LINES;



CREATE TABLE `countries`(
	`country_code` CHAR(2),
	`longitude` float,
	`latitude` float,
	`name` VARCHAR(128),
   
	INDEX `idx_country_code` (`country_code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin


LOAD DATA LOCAL
	INFILE '/home/magnus/Downloads/IP2LOCATION-LITE-DB1.CSV/countries.txt'
INTO TABLE
	`countries`
FIELDS TERMINATED BY '\t'
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 0 LINES;


SELECT * FROM ip2location_db1 WHERE country_code='-'

SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL AND ip.country_code!='-'
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL AND ip.country_code!='-' GROUP BY ip.country_code


SET @a=79, @b=136, @c=116, @d=124;
SET @ip=(((@a*256+@b)*256)+@c)*256+@d;
SELECT @a, @b, @c, @d, @ip;
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE @ip>=ip.ip_from AND @ip<=ip.ip_to;

*/




