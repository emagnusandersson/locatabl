
"use strict"

//mesOMake=function(glue){ return function(str){
  //if(str) this.Str.push(str);
  //var str=this.Str.join(glue);  this.res.end(str);
//}}
//mesEOMake=function(glue){ return function(err){
  //var error=new Error(err); console.log(error.stack);
  //this.Str.push('E: '+err.syscal+' '+err.code);
  //var str=this.Str.join(glue); this.res.end(str);  
//}}
app.mesOMakeJSON=function(glue){ return function(str){
  var res=this.res;
  if(str) this.Str.push(str);
  var str=this.Str.join(glue);
  str=serialize(str);
  if(str.length<lenGZ) res.end(str);
  else{
    res.setHeader("Content-Encoding", 'gzip');
    res.setHeader('Content-Type', MimeType.json);
    Streamify(str).pipe(zlib.createGzip()).pipe(res);
  }
}}
app.mesEOMakeJSON=function(glue){ return function(err){
  var res=this.res;
  console.error(err);
  var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);
  var str=this.Str.join(glue);
  str=serialize(str);
  if(str.length<lenGZ) res.end(str);
  else{
    res.setHeader("Content-Encoding", 'gzip');
    res.setHeader('Content-Type', MimeType.json);
    Streamify(str).pipe(zlib.createGzip()).pipe(res);
  }
}}



"use strict"



/******************************************************************************
 * reqCurlEnd
 ******************************************************************************/
app.reqCurlEnd=function*(){  
  var req=this.req, res=this.res, site=req.site, siteName=site.siteName, objQS=req.objQS; //this.pool=DB[req.site.db].pool
  var flow=req.flow;
  
  this.mes=function(str){ this.Str.push(str); }
  this.mesO=mesOMakeJSON('\n');
  this.mesEO=mesEOMakeJSON('\n');
  var Str=this.Str=[];
  
  res.setHeader('Content-Type', MimeType.json);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  
  //var http_origin = req.uDomain; 
  if('origin' in req.headers){ //if cross site
    var http_origin=req.headers.origin;
    var boAllowDbg=boDbg && RegExp("^http\:\/\/(localhost|192\.168\.0)").test(http_origin);
    if(boAllowDbg || http_origin == "https://control.closeby.market" || http_origin == "https://controlclosebymarket.herokuapp.com" || http_origin == "https://emagnusandersson.github.io" ){
        res.setHeader("Access-Control-Allow-Origin", http_origin);
        res.setHeader("Vary", "Origin"); 
    }
    if(req.method=='OPTIONS'){  this.mesO(); return;}
  }

  var pubKey; if("pubKey" in objQS) { pubKey=objQS.pubKey; }  else{ this.mesO('No public key "pubKey" in the query line'); return;}
  var sixSignature; if("signature" in objQS) { sixSignature=objQS.signature; }  else{ this.mesO('No "signature" in the query line'); return;}
  var data; if("data" in objQS) { data=objQS.data; }  else{ this.mesO('No "data" in the query line'); return;}

  //var pemPub=pubKey, sixPub=pubKey.split('\n').slice(1,-2).join('\n');
  var pemPub="-----BEGIN PUBLIC KEY-----\n"+pubKey+"-----END PUBLIC KEY-----", sixPub=pubKey;
  var keyTmp = new NodeRSA(pemPub);
  var boOK=keyTmp.verify(data, sixSignature, 'utf8', 'base64');
  var boOK; if(!boOK){ this.mesO('Message does NOT authenticate'); return;}
  //console.log('boVerifies: '+boOK);

  var inObj=JSON.parse(data);//json_last_error_msg()
  //inObj=JSON.parse("{iSec:22, lat:59.83934260, lng:17.60569680}");
  var iSeqN; if("iSeq" in inObj) { iSeqN=inObj.iSeq; }  else{  this.mesO('"iSeq" is not set'); return;}

  var Sql=[],Val=[];
  if(inObj.boCheck){
    Sql.push("CALL "+siteName+"GetValuesToController(?, ?, ?, @boShow, @hideTimer, @tDiff, @boOk, @mess);"); Val.push(inObj.iRole, sixPub, iSeqN);
    Sql.push("SELECT @boShow AS boShow, @hideTimer AS hideTimer, @tDiff AS tDiff, @boOk AS boOK, @mess AS mess;");
    var sql=Sql.join('\n');
    var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err){this.mesEO(err); return; } 
    var {boShow, hideTimer, tDiff, boOK, mess}=results[1][0];
    if(!boOK) {this.mesO(mess); return;}
    var str='Hidden';
    if(boShow){ var [ttmp,u]=getSuitableTimeUnit(tDiff), tDiffF=ttmp.toFixed(0);   var str='Visible'; if(hideTimer!=intMax) str+=", Hiding in "+tDiffF+" "+u; };
    this.mes(str);
  }
  else{
    if(!("boShow" in inObj)) { this.mesO('"boShow" is not set'); return;}  var boShow=inObj.boShow;
    if(boShow){
      if(!("lat" in inObj || "lng" in inObj)){this.mesO('"lng" or "lat" are not set'); return;}
      if(!("hideTimer" in inObj)) {this.mesO('"hideTimer" is not set'); return;} 
      var {lat,lng}=inObj;
      var projs=new MercatorProjection(),   tmp=projs.fromLatLngToPointV([lat, lng]),  x=tmp[0],  y=tmp[1], hideTimer=bound(inObj.hideTimer, 0, intMax); 
    }else{var x=128, y=128, lat=0, hideTimer=0;}
    Sql.push("CALL "+siteName+"SetValuesFromController(?, ?, ?, ?, ?, ?, ?, ?,  @boOk, @mess);"); Val.push(inObj.iRole, sixPub, iSeqN, x, y, lat, boShow, hideTimer);
    Sql.push("SELECT @boOk AS boOK, @mess AS mess;");
    var sql=Sql.join('\n');
    var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err){this.mesEO(err); return; } 
    var {boShow, tDiff, boOK, mess}=results[1][0];
    if(!boOK) {this.mesO(mess); return;}
    var str=inObj.boShow?'Visible':'Hidden'; this.mes(str);
  }
  this.mesO();
}



/******************************************************************************
 * reqPubKeyStore
 ******************************************************************************/
app.reqPubKeyStore=function*(){
  var req=this.req, res=this.res, site=req.site, siteName=site.siteName, objQS=req.objQS, uSite=req.uSite; //this.pool=DB[site.db].pool;
  var flow=req.flow;
  //this.mesO=mesOMake('\n');
  
  var pubKey=objQS.pubKey||'';
  var strLang='en';

  //var Str=this.Str=[];
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" id="viewportMy" content="initial-scale=1" />
<meta name="robots" content="noindex">
</head>
<body>`);


  //var uCommon='http://'+wwwCommon;
  var uCommon=req.strSchemeLong+wwwCommon;
  var uJQuery='https://code.jquery.com/jquery-3.3.1.min.js';    if(boDbg) uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/jquery-3.3.1.min.js";
  //Str.push('<script src="'+uJQuery+'" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>');
  //uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/cash.min.js"; Str.push('<script src="'+uJQuery+'"></script>');
 

          // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbg) vTmp=0;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'"></script>');

  var StrTmp=['lang/'+strLang+'.js', 'lib.js', 'libClient.js', 'clientPubKeyStore.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }


  var caller="pubKeyStore",  CSRFCode=randomHash();
  yield* setRedis(flow, req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode, maxUnactivity); 
  

  Str.push("<script>");
  var objOut={CSRFCode:CSRFCode, caller:caller, specialistDefault:specialistDefault, pubKey:pubKey, maxList:maxList, wwwCommon:wwwCommon, leafBE:leafBE, flImageFolder:flImageFolder, UrlOAuth:UrlOAuth, response_type:response_type};
  copySome(objOut,req,['wwwSite', 'boTLS']);

  Str.push(`function indexAssign(){
  var tmp=`+serialize(objOut)+`;
  extend(window, tmp);
}`);
  Str.push("</script>");
  Str.push("</body></html>");
  //this.mesO();

  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n');   res.writeHead(200, "OK");   res.end(str); 
}


/******************************************************************************
 * reqPrev
 ******************************************************************************/
app.reqPrev=function*() {
  var req=this.req, res=this.res;
  res.end(`<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" id="viewportMy" content="initial-scale=1" />
<meta name="robots" content="noindex">
</head><body>
<p>Prev
<p><a href=`+req.uSite+`>index</a>
</body></html>`);
}

/******************************************************************************
 * reqIndex
 ******************************************************************************/

// Stuff that varies with index call parameters: site, lang, boTLS
// Allways same: coordApprox;
// Not used: strLangBrowser
app.reqIndex=function*() {
  var req=this.req, res=this.res;
  var objQS=req.objQS;
  var site=req.site, siteName=site.siteName, wwwSite=req.wwwSite, uSite=req.uSite;

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
  //if(!boOK) coordApprox=[0,0]; else coordApprox=Match.slice(1);
  var coordApprox; if(!boOK) coordApprox=[0,0]; else coordApprox=[Number(Match[1]),Number(Match[2])];


  var strLangBrowser=getBrowserLang(req); if(!checkIfLangIsValid(strLangBrowser)){ strLangBrowser='en'; }

  var ua=req.headers['user-agent']||''; ua=ua.toLowerCase();
  var boMSIE=RegExp('msie').test(ua), boAndroid=RegExp('android').test(ua), boFireFox=RegExp('firefox').test(ua), boIOS= RegExp('iPhone|iPad|iPod','i').test(ua), boUC= RegExp('ucbrowser','i').test(ua);
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

  res.setHeader("Cache-Control", "must-revalidate");  res.setHeader('Last-Modified',tIndexMod.toUTCString());

  if(requesterCacheTime && requesterCacheTime>=tIndexMod && 0) { res.out304(); return false;   } 
  res.statusCode=200;   
  


  //this.sessionLoginIdP={};
  //yield* setRedis(flow, req.sessionID+'_LoginIdP', this.sessionLoginIdP, maxLoginUnactivity); 

  var Str=[];
  Str.push(`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:og="http://ogp.me/ns#"
      xmlns:fb="http://www.facebook.com/2008/fbml">`);
  Str.push('<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');


  //<meta name="apple-mobile-web-app-capable" content="yes" /> 


  var tmpIcon=wwwIcon16; if('wwwIcon16' in site) tmpIcon=site.wwwIcon16;  var uIcon16=req.strSchemeLong+tmpIcon;
  var tmpIcon=wwwIcon114; if('wwwIcon114' in site) tmpIcon=site.wwwIcon114;  var uIcon114=req.strSchemeLong+tmpIcon;
  var tmpIcon=wwwIcon200; if('wwwIcon200' in site) tmpIcon=site.wwwIcon200;  var uIcon200=req.strSchemeLong+tmpIcon;
  Str.push('<link rel="icon" type="image/png" href="'+uIcon16+'" />');
  Str.push('<link rel="apple-touch-icon-precomposed" href="'+uIcon114+'"/>');





  var strTmp='';  //if(boAndroid && boFireFox) {  strTmp=", width=device-width'";}    
  var strTmpB=''; //if(boAndroid || boIOS) strTmpB=", user-scalable=no";

  Str.push("<meta name='viewport' id='viewportMy' content='initial-scale=1"+strTmp+strTmpB+"'/>");

  Str.push('<meta name="theme-color" content="#ff0"/>');

  require('./lang/'+strLang+'.js');  langServerFunc();
  site.langSetup();
  var strTitle=site.serv.strTitle;
  var strH1=site.serv.strH1;
  var strDescription=site.serv.strDescription;
  var strKeywords=site.serv.strKeywords;
  var strSummary=site.serv.strSummary;


  Str.push(`
<meta name="description" content="`+strDescription+`"/>
<meta name="keywords" content="`+strKeywords+`"/>
<link rel="canonical" href="`+uSite+`"/>`);

  var fbTmp=req.rootDomain.fb, fiIdTmp=fbTmp?fbTmp.id:``;
  var tmp=`
<meta property="og:title" content="`+wwwSite+`"/>
<meta property="og:type" content="website" />
<meta property="og:url" content="http://`+wwwSite+`"/>
<meta property="og:image" content="`+uIcon200+`"/>
<meta property="og:site_name" content="`+wwwSite+`"/>
<meta property="fb:admins" content="100002646477985"/>
<meta property="fb:app_id" content="`+fiIdTmp+`"/>
<meta property="og:description" content="`+strDescription+`"/>
<meta property="og:locale:alternate" content="sv_se" />
<meta property="og:locale:alternate" content="en_US" />`;
  if(!boDbg) Str.push(tmp);


  var tmp=`
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : "`+fiIdTmp+`",
      xfbml      : true,
      version    : "v3.2"
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, "script", "facebook-jssdk"));
</script>`;
  Str.push(tmp);


  var strT=''; if('googleAPIKey' in req.rootDomain) strT="?key="+req.rootDomain.googleAPIKey;
  if(typeof boGoogleMap!='undefined' && boGoogleMap) Str.push("<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js"+strT+"'></script>");
  
  //function\([^=\)]*=[^=\)]
  //\[[^\]]*\]=
  //\{[^\}]*\}=
  //function\s*\*\(
  

  Str.push(`<script> (function(){
try { eval("(function *(){})");} catch(err) { alert("This browser does not support generators:\\n"+ err); return;}
try { eval("(function(a=0){})");} catch(err) { alert("This browser does not support default parameters:\\n"+ err); return;}
var tmpf=function(){return {a:1};};
try { eval("var {a}=tmpf();");} catch(err) { alert("This browser does not support destructuring assignment:\\n"+ err); return;}
var tmpf=function(){return [1];}
try { eval("[a]=tmpf();");} catch(err) { alert("This browser does not support destructuring assignment with arrays:\\n"+ err); return;}
})();</script>`);
  //var uCommon='http://'+wwwCommon;
  var uCommon=req.strSchemeLong+wwwCommon;
  var uJQuery='https://code.jquery.com/jquery-3.3.1.min.js';    if(boDbg) uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/jquery-3.3.1.min.js";
  //Str.push('<script src="'+uJQuery+'" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>');
  //var uJQuery=uCommon+'/'+flFoundOnTheInternetFolder+"/cash.js";  Str.push('<script src="'+uJQuery+'"></script>');

  Str.push('<script src="'+uSite+'/lib/foundOnTheInternet/sha1.js"></script>');
  
    // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes

    // Use normal vTmp on iOS (since I don't have any method of disabling cache on iOS devices (nor any debugging interface))
  var boDbgT=boDbg; if(boIOS || boUC) boDbgT=0; if(typeof boSlowNetWork!='undefined' && boSlowNetWork) boDbgT=0;
  
    // Include stylesheets
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbgT) vTmp=0;    Str.push('<link rel="stylesheet" href="'+uCommon+pathTmp+'?v='+vTmp+'" type="text/css">');

    // Include site specific JS-files
  var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbgT) vTmp=0;  Str.push('<script src="'+uSite+'/'+leafSiteSpecific+'?v='+vTmp+'"></script>');

    // Include JS-files
  var StrTmp=['filter.js', 'lib.js', 'libClient.js', 'client.js', 'lang/en.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbgT) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }

    // Include plugins
  Str.push("\n<script type=\"text/javascript\" language=\"JavaScript\" charset=\"UTF-8\"> var CreatorPlugin={};</script>");
  var StrPlugInNArg=site.StrPlugInNArg;
  for(var i=0;i<StrPlugInNArg.length;i++){
    var nameT=StrPlugInNArg[i], n=nameT.length, charRoleUC=nameT[n-1]; if(charRoleUC=='C' || charRoleUC=='S') {nameT=nameT.substr(0, n-1);} else charRoleUC='';
    var Name=ucfirst(nameT); 
    var pathTmp='/plugin'+Name+'.js', vTmp=CacheUri[pathTmp].eTag; if(boDbgT) vTmp=0;    Str.push('<script src="'+uCommon+pathTmp+'?v='+vTmp+'"></script>');
  }


  var strTracker, tmpID=site.googleAnalyticsTrackingID||null;
  if(boDbg||!tmpID){strTracker="<script> ga=function(){};</script>";}else{ 
  strTracker=`
<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', '`+tmpID+`', 'auto');
  ga('send', 'pageview');
</script>`;
  }
  Str.push(strTracker);
  
  Str.push("<script src='https://www.google.com/recaptcha/api.js?render=explicit' defer></script>");

  Str.push("</head>");
  Str.push('<body style="visibility:hidden">');

  Str.push("<title>"+strTitle+"</title>\n<h1>"+strH1+"</h1>\n"+strSummary);

  Str.push(`<script type="text/javascript" language="JavaScript" charset="UTF-8">`);

  var objOut={strLang:strLang, coordApprox:coordApprox, UrlOAuth:UrlOAuth, strReCaptchaSiteKey:strReCaptchaSiteKey, strSalt:strSalt, m2wc:m2wc, nHash:nHash};
  copySome(objOut,req, ['boTLS']);

  Str.push(`var tmp=`+serialize(objOut)+`;\n extend(window, tmp);`);
  
  Str.push(`
</script>
<form  id=formLogin>
<label name=email>Email</label><input type=email name=email>
<label name=password>Password</label><input type=password name=password>
<button type=submit name=submit class=highStyle value="Sign in">Sign in</button> 
</form>
<form  id=formCreateAccount>
<label name=name>Full name</label><input type=text name=name>
<label name=email>Email</label><input type=email name=email>
<label name=password>Password</label><input type=password name=password>
<label name=passwordB>Password again</label><input type=password name=passwordB>
</form>
</body>
</html>`);


  var str=Str.join('\n');
  //res.writeHead(200, "OK", {'Content-Type': MimeType.html});   res.end(str);    
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}




/******************************************************************************
 * reqLoginWLink
 ******************************************************************************/
app.reqLoginWLink=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var userTab=site.TableName.userTab;
  var objQS=req.objQS;
  var tmp='code'; if(!(tmp in objQS)) { res.out200('The parameter '+tmp+' is required'); return;}
  var code=objQS.code;
  //var email=yield* getRedis(flow, code+'_LoginWLink');
  var [err,email]=yield* cmdRedis(flow, 'GET', [code+'_LoginWLink']); 
  if(!email) {  res.out200('No such code'); return;  }
  //if(email!=inObj.email) {  res.out200('email does not match'); return; }


  var sql="SELECT idUser FROM "+userTab+" WHERE email=?;", Val=[email];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) {  res.out500(err); return; }
  if(results.length==0) { res.out200('No such email in the database'); return;}
  
  var idUser=results[0].idUser;
  yield *setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  //var [err,tmp]=yield* cmdRedis(flow, 'SET', [req.sessionID+'_LoginIdUser',idUser,'EX', maxLoginUnactivity]);

  res.end("You are now logged in, close this tab, go back the web app and reload.");
}




/******************************************************************************
 * reqImage
 ******************************************************************************/
app.reqImage=function*() {
  var req=this.req, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var flow=req.flow;
  
  var site=req.site, objQS=req.objQS, uSite=req.uSite, siteName=site.siteName, pathName=req.pathName, id, kind;

  this.eTagIn=getETag(req.headers);
  var keyCache=siteName+'/'+pathName;
  if(keyCache in ETagImage && ETagImage[keyCache]===this.eTagIn) { res.out304(); return; }

  var Match=RegExp('^/image/(u|c|s)([0-9]+)$').exec(pathName);
  if(Match && Match.length>2){kind=Match[1]; id=Number(Match[2]);} else { res.out404('404 Not found'); return; }

  var {userImageTab, customerTeamImageTab, sellerTeamImageTab}=site.TableName;
  
  var tab;
  if(kind=='u')tab=userImageTab; 
  else if(kind=='c') tab=customerTeamImageTab;
  else if(kind=='s')tab=sellerTeamImageTab; 
  var sql = "SELECT data FROM "+tab+" WHERE idUser=?", Val=[id];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val);  if(err) { res.out500(err); return;}
  if(results.length>0){
    var strData=results[0].data;
    var eTag=crypto.createHash('md5').update(strData).digest('hex'); 
    ETagImage[keyCache]=eTag;  if(eTag===this.eTagIn) { res.out304(); return; }
    var maxAge=3600*8760, mimeType=MimeType.jpg;
    res.writeHead(200, {"Content-Type": mimeType, "Content-Length":strData.length, ETag: eTag, "Cache-Control":"public, max-age="+maxAge}); // "Last-Modified": maxModTime.toUTCString(),
    res.end(strData);
  }else{
    //res.setHeader("Content-type", MimeType.png);
    id=id%32;
    var tmp; if(kind=='u'){tmp='anonPng'; }else tmp='anonTeamPng';
    var uNew=uSite+"/lib/image/"+tmp+"/a"+id+".png";
    res.writeHead(302, {'Location': uNew});
    res.end();
  }
}


/******************************************************************************
 * reqLoginBack
 ******************************************************************************/
app.reqLoginBack=function*(){
  var req=this.req, res=this.res;
  var wwwLoginScopeTmp=null; if('wwwLoginScope' in req.site) wwwLoginScopeTmp=req.site.wwwLoginScope;
  var uSite=req.strSchemeLong+req.wwwSite;
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html><head><meta name='robots' content='noindex'>
<link rel='canonical' href='`+uSite+`'/>
</head>
<body>
<script>
var wwwLoginScope=`+JSON.stringify(wwwLoginScopeTmp)+`;
if(wwwLoginScope) document.domain = wwwLoginScope;
var strQS=location.search;
var strHash=location.hash;
debugger
//alert('strHash: '+strHash);
window.opener.loginReturn(strQS,strHash);
window.close();
</script>
</body>
</html>
`);
  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n');  res.end(str);
}


app.reqVerifyEmailReturn=function*() {
  var req=this.req, flow=req.flow, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var userTab=site.TableName.userTab;
  var objQS=req.objQS;
  var tmp='code'; if(!(tmp in objQS)) { res.out200('The parameter '+tmp+' is required'); return;}
  var codeIn=objQS.code;
  //var idUser=yield* getRedis(flow, codeIn+'_verifyEmail');
  var [err,idUser]=yield* cmdRedis(flow, 'GET', [codeIn+'_verifyEmail']); 
  
  if(idUser===null) { res.out200('No such code'); return;}

  var Sql=[], Val=[];
  Sql.push("UPDATE "+userTab+" SET boEmailVerified=1 WHERE idUser=?;");
  Val.push(idUser);

  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) {  res.out500(err); return; }

  var c=results.affectedRows, mestmp; 
  if(c==1) { mestmp="Email verified"; } else {mestmp="Error (Nothing done)"; }
  res.end(mestmp);
}

app.reqVerifyPWResetReturn=function*() {
  var req=this.req, flow=req.flow, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var userTab=site.TableName.userTab;
  var objQS=req.objQS;
  var tmp='code'; if(!(tmp in objQS)) { res.out200('The parameter '+tmp+' is required'); return;}
  var codeIn=objQS.code;
  //var email=yield* getRedis(flow, codeIn+'_verifyPWReset');
  var [err,email]=yield* cmdRedis(flow, 'GET', [codeIn+'_verifyPWReset']); 
  
  if(email===null) { res.out200('No such code'); return;}

  var password=randomHash();
  //var passwordHash=SHA1(password+strSalt);
  var hashPW=password+strSalt; for(var i=0;i<nHash;i++) hashPW=SHA1(hashPW);

  var Sql=[], Val=[];
  Sql.push("UPDATE "+userTab+" SET hashPW=? WHERE email=?;");
  Val.push(hashPW, email);

  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) {  res.out500(err); return; }

  var c=results.affectedRows, mestmp; 
  if(c!=1) { res.out500("Error ("+c+" affectedRows)"); return; }


  var wwwSite=req.wwwSite;
  var strTxt=`<h3>New password on `+wwwSite+`</h3>
<p>Your new password on `+wwwSite+` is `+password+`</p>`;
  
  if(boDbg) wwwSite="closeby.market";
  const msg = { to: email, from: 'noreply@'+wwwSite, subject: 'Password reset', html: strTxt }; sgMail.send(msg);
  res.end("A new password has been generated and sent to your email address.");
}

app.reqVerifyEmailNCreateUserReturn=function*() {
  var req=this.req, flow=req.flow, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var {userTab, sellerTab, customerTab}=site.TableName;
  var objQS=req.objQS;
  var tmp='code'; if(!(tmp in objQS)) { res.out200('The parameter '+tmp+' is required'); return;}
  var codeIn=objQS.code;
  
  //var objT=yield* getRedis(flow, codeIn+'_verifyEmailNCreateUser', true); if(!objT) { res.out200('No such code'); return;}
  var [err,value]=yield* cmdRedis(flow, 'GET', [codeIn+'_verifyEmailNCreateUser']),   objT=JSON.parse(value);  if(!objT) { res.out200('No such code'); return;}
  var {name, email, password}=objT;
  name=myJSEscape(name); email=myJSEscape(email); //password=myJSEscape(password);

  
  var Sql=[], Val=[];
  Sql.push("INSERT INTO "+userTab+" (email, nameIP, hashPW, tCreated) VALUES (?, ?, ?, now()) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser);");
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Val.push(email, name, password, name);
  Sql.push("INSERT INTO "+sellerTab+" (idUser, tCreated, tLastPriceChange, tPos, tLastWriteOfTA, histActive, displayName) VALUES (@idUser, now(), now(), now(), now(), 1, ? ) ON DUPLICATE KEY UPDATE idUser=idUser;");
  //Sql.push("SET OboInserted=(ROW_COUNT()=1);");  Sql.push("SELECT @boInserted AS boInserted;");
  Sql.push("SELECT @boInserted:=(ROW_COUNT()=1) AS boInserted;");

  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) {  res.out500(err); return; }
  var c=results[0].affectedRows; if(c!=1) { res.out500("Error ("+c+" affectedRows)"); return; }
  var idUser=Number(results[1][0].idUser);    yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var boIns=site.boGotNewSellers=Number(results[3][0].boInserted);
  site.nUser=Number(results[4][0].n);
  var tmp=boIns?'created':'updated';
  var Str=[`<!DOCTYPE html><html><head>
<meta name='viewport' id='viewportMy' content='initial-scale=1'/>
</head><body>`];
  var uSite=req.strSchemeLong+req.wwwSite
  //if(boIns) Str.push("An account has been created. Go back to <a href=\""+uSite+"\">"+req.wwwSite+"</a>."); else Str.push("Your account was updated."); //and you can login with the email / password you 
  if(boIns) Str.push("Account created! Please return to your previous browser / tab and hit reload to continue."); else Str.push("Your account was updated."); //and you can login with the email / password you selected
  //Str.push("<a href=\"javascript:window.open('','_self').close();\">close</a>, ");
  //Str.push("<a href=\""+uSite+"\">"+req.wwwSite+"</a>");
  Str.push('</body></html>');
  res.end(Str.join('\n'));
}





/******************************************************************************
 * reqStatic (request for static files)
 ******************************************************************************/
app.reqStatic=function*() {
  var req=this.req, res=this.res, flow=req.flow, site=req.site; //this.pool=DB[site.db].pool;
  var site=req.site, objQS=req.objQS, siteName=site.siteName, pathName=req.pathName;

  var eTagIn=getETag(req.headers);
  var keyCache=pathName; if(pathName==='/'+leafSiteSpecific) keyCache=siteName+keyCache; 
  if(!(keyCache in CacheUri)){
    var filename=pathName.substr(1);
    var [err]=yield *readFileToCache(flow, filename);
    if(err) {
      if(err.code=='ENOENT') {res.out404(); return;}
      if('host' in req.headers) console.error('Faulty request from'+req.headers.host);
      if('Referer' in req.headers) console.error(req.headers.Referer);
      res.out500(err); return;
    }
  }
  var {buf, type, eTag, boZip, boUglify}=CacheUri[keyCache];
  if(eTag===eTagIn){ res.out304(); return; }
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
 * reqMonitor
 ******************************************************************************/
app.reqMonitor=function*(){
  var req=this.req, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var timeCur=unixNow(), boRefresh=0;   if(site.timerNUserLast<timeCur-5*60) {boRefresh=1; site.timerNUserLast=timeCur;}
  var site=req.site, siteName=site.siteName, objQS=req.objQS, {userTab, sellerTab, customerTab}=site.TableName;
  var flow=req.flow;
  
  //if(!req.boCookieLaxOK) {res.outCode(401, "Lax cookie not set");  return;  }

  if(boRefresh){ 
    var Sql=[];
    Sql.push("SELECT count(u.idUser) AS n FROM "+userTab+" u JOIN "+sellerTab+" ro ON u.idUser=ro.idUser  WHERE boShow=1 AND "+ sqlBeforeHiding+";");
    //Sql.push("SELECT count(*) AS n FROM "+userTab+" u JOIN "+sellerTab+" ro ON u.idUser=ro.idUser;");
    Sql.push("SELECT count(*) AS n FROM "+userTab+";");

    var sql=Sql.join('\n'), Val=[];
    var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err){ res.out500(err); return; }
    site.nVis=results[0][0].n;
    site.nUser=results[1][0].n;
  }

  var nVis=site.nVis, nUser=site.nUser;
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html><head><meta name="robots" content="noindex"></head>`);
  var strColor='';
  if('admin' in objQS && objQS.admin){
    if(boRefresh) strColor='lightgreen';
    if(site.boGotNewSellers) strColor='red';
  }
  var strUser=nUser;  if(strColor) strUser="<span style=\"background-color:"+strColor+"\">"+nUser+"</span>";
  Str.push("<body style=\"margin: 0px\">"+nVis+" / "+strUser+"</body>");
  Str.push("</html>");
  
  res.removeHeader("Content-Security-Policy");
  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n'); res.end(str);
}



/******************************************************************************
 * reqStat (request for status of the tables)
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

app.reqStat=function*(){
  var req=this.req, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var flow=req.flow;
  
  if(!req.boCookieLaxOK) {res.outCode(401, "Lax cookie not set");  return;  }

  var siteName=site.siteName, objQS=req.objQS, {userTab, sellerTab, customerTab}=site.TableName;
  
  var charRole=objQS.role||'s';

  var Sql=[];
  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  
  var strCols="u.idUser, idFB, idIdPlace, idOpenId, displayName, homeTown, currency, boShow, tPos, CONVERT(BIN(histActive),CHAR(30)) AS histActive, tLastWriteOfTA, tAccumulated, hideTimer";

  Sql.push("SELECT "+strCols+" FROM "+userTab+" u LEFT JOIN "+sellerTab+" s ON u.idUser=s.idUser  UNION   SELECT "+strCols+" FROM "+userTab+" u RIGHT JOIN "+sellerTab+" s ON u.idUser=s.idUser;");

  Sql.push("SELECT "+strCols+" FROM "+userTab+" u RIGHT JOIN "+sellerTab+" s ON u.idUser=s.idUser WHERE u.idUser IS NULL;");
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err){ res.out500(err); return;  }
  var nUser=results[0][0].n;
  if('code' in objQS && objQS.code=='amfoen') {site.boGotNewSellers=0; site.nUser=nUser;}
  var matA=results[1];
  var matB=results[2];
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html><head>
<meta name="robots" content="noindex">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style> table,td,tr {border: solid 1px;border-collapse:collapse}</style>
</head>
<body>`);
  var nA=matA.length;
  Str.push("user OUTER JOIN seller ("+nA+")");
  if(nA>0){
    var Keys=Object.keys(matA[0]);
    for(var i=0;i<matA.length;i++){ var [ttmp,u]=getSuitableTimeUnit(matA[i].tAccumulated); matA[i].tAccumulated=Math.round(ttmp)+u; }
    Str.push(makeTable(Keys,matA));
  }
  var nB=matB.length;
  Str.push("<hr>seller.idUser with no user.idUser ("+nB+")");
  if(nB>0){
    var Keys=Object.keys(matB[0]);
    Str.push(makeTable(Keys,matB));
  }
  
  Str.push("</body></html>");
  var str=Str.join('\n');
  //res.end(str);
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}


app.reqStatBoth=function*(){
  var req=this.req, res=this.res, site=req.site; //this.pool=DB[site.db].pool;
  var flow=req.flow;
  
  if(!req.boCookieLaxOK) {res.outCode(401, "Lax cookie not set");  return;  }

  var siteName=site.siteName, objQS=req.objQS, {userTab, sellerTab, customerTab}=site.TableName;
  
  var charRole=objQS.role||'s';

  var Sql=[];
  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  
  var strColsU="u.idUser, idFB, idIdPlace, idOpenId, displayName";
  //var strColsC="c.homeTown, c.currency, c.boShow, c.tPos, CONVERT(BIN(c.histActive),CHAR(30)) AS c_histActive, c.tLastWriteOfTA, c.tAccumulated, c.hideTimer";
  //var strColsS="s.homeTown, s.currency, s.boShow, s.tPos, CONVERT(BIN(s.histActive),CHAR(30)) AS s_histActive, s.tLastWriteOfTA, s.tAccumulated, s.hideTimer";

  var StrRoleCols=[];
  var StrColsProt=["homeTown", "currency", "boShow", "tPos", "tLastWriteOfTA", "tAccumulated", "hideTimer"];
  for(var i=0;i<2;i++){
    var strRole=i?'s':'c', StrTmp=[];
    for(var j=0;j<StrColsProt.length;j++){
      StrTmp[j]=strRole+'.'+StrColsProt[j]+" AS "+strRole+'_'+StrColsProt[j];
    }
    StrTmp.push("CONVERT(BIN("+strRole+".histActive),CHAR(30)) AS "+strRole+"_histActive");
    StrRoleCols[i]=StrTmp.join(', ');
  }
  var [strColsC, strColsS]=StrRoleCols;

  Sql.push("SELECT "+strColsU+", "+strColsC+", "+strColsS+" FROM "+userTab+" u LEFT JOIN "+customerTab+" c ON u.idUser=c.idUser LEFT JOIN "+sellerTab+" s ON u.idUser=s.idUser;");

  Sql.push("SELECT "+strColsU+", "+strColsC+" FROM "+userTab+" u RIGHT JOIN "+customerTab+" c ON u.idUser=c.idUser WHERE u.idUser IS NULL;");
  Sql.push("SELECT "+strColsU+", "+strColsS+" FROM "+userTab+" u RIGHT JOIN "+sellerTab+" s ON u.idUser=s.idUser WHERE u.idUser IS NULL;");
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err){ res.out500(err); return;  }
  var nUser=results[0][0].n;
  if('code' in objQS && objQS.code=='amfoen') {site.boGotNewSellers=0; site.nUser=nUser;}
  var matA=results[1];
  var matB=results[2];
  var matC=results[3];
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html><head>
<meta name="robots" content="noindex">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style> table,td,tr {border: solid 1px;border-collapse:collapse}
td:nth-child(n+6):nth-child(-n+13){background:pink}
td:nth-child(n+14){background:lightblue}
</style>
</head>
<body>`);
  var nA=matA.length;
  Str.push("user OUTER JOIN seller ("+nA+")");
  if(nA>0){
    var Keys=Object.keys(matA[0]);
    for(var i=0;i<matA.length;i++){
      var row=matA[i];
      for(var j=0;j<Keys.length;j++){
        var key=Keys[j], t=row[key];
          // Format t
        if(/^[cs]_(tAccumulated|hideTimer)/.test(key)) {
          var [ttmp,u]=getSuitableTimeUnit(t); row[key]=Math.round(ttmp)+u;
        }else if(t instanceof Date){
          var unixT=t.valueOf()/1000;
          var [ttmp,u]=getSuitableTimeUnit(unixNow()-unixT); row[key]=Math.round(ttmp)+u;
        }
      }
    }
    Str.push(makeTable(Keys,matA));
  }
  var nB=matB.length;
  Str.push("<hr>customers with no user ("+nB+")");
  if(nB>0){
    var Keys=Object.keys(matB[0]);
    Str.push(makeTable(Keys,matB));
  }
  var nC=matC.length;
  Str.push("<hr>sellers with no user ("+nC+")");
  if(nC>0){
    var Keys=Object.keys(matC[0]);
    Str.push(makeTable(Keys,matC));
  }
  
  Str.push("</body></html>");
  var str=Str.join('\n');
  //res.end(str);
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}
 

/******************************************************************************
 * SetupSqlT
 ******************************************************************************/
app.SetupSqlT=function(){
}
app.SetupSqlT.prototype.createTable=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlTabDrop=[], SqlTab=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite]
  var site=Site[siteName]; 
  var {TableName, ViewName, ORole}=site, [oC, oS]=ORole;
  //eval(extractLoc(TableName,'TableName'));
  var {sellerTab, sellerTeamTab, sellerTeamImageTab, customerTab, customerTeamTab, customerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));
  var {histView}=site.ViewName;

  var StrTabName=object_values(TableName);
  var tmp=StrTabName.join(', ');
  SqlTabDrop.push("DROP TABLE IF EXISTS "+siteName+"_teamImage, "+siteName+"_sellerImage, "+siteName+"_team,"+siteName+"_marketer,"+siteName+"_payment,"+siteName+"_rebateCode");  // temporary thing
  SqlTabDrop.push("DROP TABLE IF EXISTS "+siteName+"_binsCreated, "+siteName+"_binsPosTime, "+siteName+"_binsTimeAccumulated");  // temporary thing
  SqlTabDrop.push("DROP TABLE IF EXISTS "+tmp);     
  SqlTabDrop.push('DROP TABLE IF EXISTS '+userTab);     
  var tmp=object_values(ViewName).join(', ');   if(tmp.length) SqlTabDrop.push("DROP VIEW IF EXISTS "+tmp+"");


  //var nameDB=DB[db].nameDB;
  var collate="utf8_general_ci";
  var engine='INNODB';  //engine='MyISAM';
  var auto_increment=1;

  //var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  //var strIPDefault=Prop.IP.Enum[0];


    // Create users
  SqlTab.push(`CREATE TABLE `+userTab+` ( 
  idUser int(4) NOT NULL auto_increment, 
  tCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  idFB varchar(128) CHARSET utf8 NULL, 
  idIdPlace varchar(128) CHARSET utf8 NULL, 
  idOpenId varchar(128) CHARSET utf8 NULL, 
  email varchar(65) CHARSET utf8 NOT NULL DEFAULT '', 
  nameIP varchar(128) CHARSET utf8 NOT NULL DEFAULT '', 
  image varchar(256) CHARSET utf8 NOT NULL DEFAULT '', 
  hashPW char(40) NOT NULL DEFAULT '', 
  imTag int(4) NOT NULL DEFAULT 0, 
  boImgOwn tinyint(1) NOT NULL DEFAULT 0, 
  displayName VARCHAR(32) NOT NULL DEFAULT '', 
  donatedAmount DOUBLE NOT NULL DEFAULT 0, 
  pubKey VARCHAR(256) NOT NULL DEFAULT '', 
  iSeq int(4) NOT NULL DEFAULT 0, 
  nComplaint int(4) NOT NULL DEFAULT 0, 
  nComplaintCum int(4) NOT NULL DEFAULT 0, 
  nComplaintGiven int(4) NOT NULL DEFAULT 0, 
  nComplaintGivenCum int(4) NOT NULL DEFAULT 0, 
  PRIMARY KEY (idUser), 
  UNIQUE KEY (idFB), 
  UNIQUE KEY (idIdPlace), 
  UNIQUE KEY (idOpenId), 
  UNIQUE KEY (email) 
  ) AUTO_INCREMENT = `+auto_increment+`, ENGINE=`+engine+` COLLATE `+collate); 
 



    // Create sellerTab
  //var StrProp=Object.keys(oS.Prop);
  var arrCols=[];
  for(var i=0;i<oS.StrOrder.length;i++){
    var name=oS.StrOrder[i];
    var arr=oS.Prop[name];
    var b=arr.b;
    if(Number(b[oS.bFlip.sellerTab])){
      var strType=arr.type || '';
      if(strType=='ENUM'){
        //$tmpName='enum'.ucfirst($name);
        //$arra=$$tmpName;$str=implode("','",$arra); if(count($arra)>0) $str="'$str'";
        var arra=oS.Prop[name].Enum, str=arra.join("','"); if(arra.length) str="'"+str+"'";
        strType="ENUM("+str+")";
      }
      var strNull=Number(b[oS.bFlip.notNull])?'NOT NULL':'';
      var strDefault=''; 
      if('default' in arr){
        if(arr.type.toUpperCase()=='TIMESTAMP'){strDefault=arr.default;}
        else {
          if(typeof arr.default=='string') strDefault="'"+arr.default+"'"; else strDefault=arr.default;
        }
        strDefault="DEFAULT "+strDefault;
      }
      arrCols.push("`"+name+"` "+strType+" "+strNull+" "+strDefault);
    }//``
  }
  var strSql=arrCols.join(",\n");

  SqlTab.push(`CREATE TABLE `+sellerTab+` (
  `+strSql+`,
  PRIMARY KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate+``); 


    // Create SellerTab indexes
  for(var name in oS.Prop){
    var arr=oS.Prop[name];
    var b=arr.b;
    if(Number(b[oS.bFlip.sellerTabIndex])){
      if(0) SqlFunction.push("CREATE INDEX "+name+"Index ON "+sellerTab+"("+name+")");
    }
  }


    // Create customerTab
  //var StrProp=Object.keys(oC.Prop);
  var arrCols=[];
  for(var i=0;i<oC.StrOrder.length;i++){
    var name=oC.StrOrder[i];
    var arr=oC.Prop[name];
    var b=arr.b;
    if(Number(b[oC.bFlip.customerTab])){
      var strType=arr.type || '';
      if(strType=='ENUM'){
        //$tmpName='enum'.ucfirst($name);
        //$arra=$$tmpName;$str=implode("','",$arra); if(count($arra)>0) $str="'$str'";
        var arra=oC.Prop[name].Enum, str=arra.join("','"); if(arra.length) str="'"+str+"'";
        strType="ENUM("+str+")";
      }
      var strNull=Number(b[oC.bFlip.notNull])?'NOT NULL':'';
      var strDefault=''; 
      if('default' in arr){
        if(arr.type.toUpperCase()=='TIMESTAMP'){strDefault=arr.default;}
        else {
          if(typeof arr.default=='string') strDefault="'"+arr.default+"'"; else strDefault=arr.default;
        }
        strDefault="DEFAULT "+strDefault;
      }
      arrCols.push("`"+name+"` "+strType+" "+strNull+" "+strDefault);
    }//``
  }
  var strSql=arrCols.join(",\n");

  SqlTab.push(`CREATE TABLE `+customerTab+` (
  `+strSql+`,
  PRIMARY KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate+``); 


    // Create CustomerTab indexes
  for(var name in oC.Prop){
    var arr=oC.Prop[name];
    var b=arr.b;
    if(Number(b[oC.bFlip.customerTabIndex])){
      if(0) SqlFunction.push("CREATE INDEX "+name+"Index ON "+customerTab+"("+name+")");
    }
  }
  
    //
    // Image tables
    //
    
  SqlTab.push(`CREATE TABLE `+userImageTab+` (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate); 


  SqlTab.push(`CREATE TABLE `+customerTeamImageTab+` (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate); 
  
  SqlTab.push(`CREATE TABLE `+sellerTeamImageTab+` (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate);
  
  

  SqlTab.push("CREATE VIEW "+histView+" (idUser, histActive, tPos) AS SELECT idUser, BIN(histActive), tPos FROM "+sellerTab+"");



  SqlTab.push(`CREATE TABLE `+settingTab+` (
  name varchar(65) CHARSET utf8 NOT NULL,
  value varchar(65) CHARSET utf8 NOT NULL,
  UNIQUE KEY (name)
  ) ENGINE=`+engine+` COLLATE `+collate);


    // Create admin
  SqlTab.push(`CREATE TABLE `+adminTab+` (
  idUser int(4) NOT NULL,
  boApproved tinyint(1) NOT NULL DEFAULT 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=`+engine+` COLLATE `+collate);



    // Create complaintTab
  SqlTab.push(`CREATE TABLE `+complaintTab+` (
  idComplainee  int(4) NOT NULL,
  idComplainer int(4) NOT NULL,
  comment TEXT CHARSET utf8,
  answer TEXT CHARSET utf8,
  tCreated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  tCommentModified TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  tAnswerModified TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  UNIQUE KEY (idComplainee,idComplainer),
  FOREIGN KEY (idComplainee) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE,
  FOREIGN KEY (idComplainer) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE
  ) ENGINE=`+engine+` COLLATE `+collate);



    // Create customerTeamTab
  SqlTab.push(`CREATE TABLE `+customerTeamTab+` (
  idUser int(4) NOT NULL,
  link varchar(128) CHARSET utf8 NOT NULL DEFAULT '',
  imTag int(4) NOT NULL default 0,
  boApproved tinyint(1) NOT NULL default 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=`+engine+` COLLATE `+collate);
  
    // Create sellerTeamTab
  SqlTab.push(`CREATE TABLE `+sellerTeamTab+` (
  idUser int(4) NOT NULL,
  link varchar(128) CHARSET utf8 NOT NULL DEFAULT '',
  imTag int(4) NOT NULL default 0,
  boApproved tinyint(1) NOT NULL default 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES `+userTab+`(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=`+engine+` COLLATE `+collate);

  //name varchar(64) CHARSET utf8 NOT NULL,
  //boFB tinyint(1) NOT NULL,

  addBinTableSql(SqlTabDrop, SqlTab, siteName, oS.Prop, engine, collate);
  addBinTableSql(SqlTabDrop, SqlTab, siteName, oC.Prop, engine, collate);

  }
  if(boDropOnly) return SqlTabDrop;
  else return array_merge(SqlTabDrop, SqlTab);
}


  
app.SetupSqlT.prototype.createFunction=function(SiteName,boDropOnly){
  if(typeof SiteName=='string') SiteName=[SiteName];
  
  var SqlFunctionDrop=[], SqlFunction=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite];
  
  var site=Site[siteName]; 
  var {TableName, ViewName, ORole}=site, [oC, oS]=ORole;
  var {sellerTab, sellerTeamTab, sellerTeamImageTab, customerTab, customerTeamTab, customerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));
  var {histView}=site.ViewName;


  //var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  //var strIPDefault=Prop.IP.Enum[0];


  //RShow "+siteName+"TimeAccumulatedUpdOne -> UPDATE "+sellerTab+" SET boShow=1, tPos=now(), hideTime=date_add(now(), INTERVALL hideTimer SECOND) WHERE idUser=id
  //RHide "+siteName+"TimeAccumulatedUpdOne -> UPDATE "+sellerTab+" SET boShow=0, tPos=0, hideTime=0 WHERE idUser=id
  //IFun "+siteName+"TimeAccumulatedUpdMult

  // If setting boShow then one must call "+siteName+"TimeAccumulatedUpdOne before. Hence tLastWriteOfTA will never be < than tPos
  var sqlTimeSinceWriteOfTA="UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(tLastWriteOfTA)";  // tLastWriteOfTA, tPos, hideTimer are a columns in sellerTab
  var sqlTWritten="UNIX_TIMESTAMP(tLastWriteOfTA)-UNIX_TIMESTAMP(tPos)";
  var sqlTRemaining="GREATEST(hideTimer-("+sqlTWritten+"),0)";
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"TimeAccumulatedUpdOne");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`TimeAccumulatedUpdOne(IN IidUser INT)
      BEGIN
        UPDATE `+customerTab+` SET tAccumulated=tAccumulated+LEAST(`+sqlTimeSinceWriteOfTA+`,`+sqlTRemaining+`)*boShow, tLastWriteOfTA=now() WHERE idUser=IidUser;
        UPDATE `+sellerTab+` SET tAccumulated=tAccumulated+LEAST(`+sqlTimeSinceWriteOfTA+`,`+sqlTRemaining+`)*boShow, tLastWriteOfTA=now() WHERE idUser=IidUser;
      END`);
  //SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"AutoHideOne");
  //SqlFunction.push(`CREATE PROCEDURE `+siteName+`AutoHideOne (IN id INT) BEGIN      UPDATE `+sellerTab+` SET boShow=IF(now()>hideTime,0,boShow) WHERE idUser=id;    END`);

    // IFunPoll
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"IFunPoll");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`IFunPoll() BEGIN      CALL `+siteName+`TimeAccumulatedUpdMult;   CALL `+siteName+`HistActiveUpdMult;   END`);
  
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"TimeAccumulatedUpdMult");  // Update tAccumulated, tLastWriteOfTA and boShow
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`TimeAccumulatedUpdMult()
      BEGIN
        DECLARE tLastWriteOfBoShow INT;
        SELECT value INTO tLastWriteOfBoShow FROM `+settingTab+` WHERE name='tLastWriteOfBoShow';
        IF UNIX_TIMESTAMP(now())>tLastWriteOfBoShow+10 THEN
          UPDATE `+sellerTab+` SET tAccumulated=tAccumulated+LEAST(`+sqlTimeSinceWriteOfTA+`,`+sqlTRemaining+`)*boShow, tLastWriteOfTA=now(), boShow=IF(`+sqlBeforeHiding+`,boShow,0) WHERE boShow=1;
          UPDATE `+customerTab+` SET tAccumulated=tAccumulated+LEAST(`+sqlTimeSinceWriteOfTA+`,`+sqlTRemaining+`)*boShow, tLastWriteOfTA=now(), boShow=IF(`+sqlBeforeHiding+`,boShow,0) WHERE boShow=1;
          UPDATE `+settingTab+` SET value=UNIX_TIMESTAMP(now()) WHERE name='tLastWriteOfBoShow';
        END IF;
      END`);
      

  //sPerDay=10;
  //var dayDiff="floor( UNIX_TIMESTAMP(now())/"+sPerDay+" )  -  floor( UNIX_TIMESTAMP(tPos)/"+sPerDay+" )";
  // tLastWriteOfHA lastHistActiveWrite

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"HistActiveUpdMult");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`HistActiveUpdMult()
    BEGIN
      DECLARE tLastWriteOfHA, recentDay, dayDiff INT;
      START TRANSACTION;
      SELECT value INTO tLastWriteOfHA FROM `+settingTab+` WHERE name='tLastWriteOfHA';
      SET recentDay=floor( UNIX_TIMESTAMP(now())/`+sPerDay+` );   SET dayDiff=recentDay-tLastWriteOfHA;
      IF dayDiff>0 THEN
        UPDATE `+sellerTab+` SET histActive= (histActive<<dayDiff | boShow) `+sqlMaskHistActive+`;
        UPDATE `+customerTab+` SET histActive= (histActive<<dayDiff | boShow) `+sqlMaskHistActive+`;
        UPDATE `+settingTab+` SET value=recentDay WHERE name='tLastWriteOfHA';
      END IF;
      COMMIT;
    END`);


      // Create an array from KeyCol/colsDBMask
  var SqlColOTmp=[];
  for(var i=0;i<ORole.length;i++) {
    var oR=ORole[i], arrCol=[];
    for(var j=0;j<oR.nCol;j++) {
      var name=oR.KeyCol[j], b=oR.Prop[name].b;
      if(Number(b[oR.bFlip.DBSelOne]))  {   
        var tmp;   if('selOneF' in oR.Prop[name]){tmp=oR.Prop[name].selOneF(name)+" AS `"+name+"`";}    else tmp="`"+name+"`";
        arrCol.push(tmp);
      }
    }
    SqlColOTmp[i]=arrCol.join(', ');
  }
  var sqlColUTmp="@idUserTmp:=idUser AS idUser, idFB, idIdPlace, idOpenId, email, nameIP, image, displayName, boImgOwn, imTag";

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetUserInfo");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`GetUserInfo(IidUser INT, IidFB varchar(128), IidIdPlace varchar(128), IidOpenId varchar(128), IboCustomer INT, IboSeller INT, IboCustomerTeam INT, IboSellerTeam INT, IboAdmin INT, IboComplainer INT, IboComplainee INT)
    proc_label:BEGIN
      START TRANSACTION;
      IF IidUser IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS `+sqlColUTmp+` FROM `+userTab+` WHERE idUser=IidUser;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT 'idUserNotFound' AS mess; LEAVE proc_label; END IF;
      ELSEIF IidFB IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS `+sqlColUTmp+` FROM `+userTab+` WHERE idFB=IidFB;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idFB not found: ', IidFB) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      ELSEIF IidIdPlace IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS `+sqlColUTmp+` FROM `+userTab+` WHERE idIdPlace=IidIdPlace;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idIdPlace not found: ', IidIdPlace) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      ELSE
        SELECT SQL_CALC_FOUND_ROWS `+sqlColUTmp+` FROM `+userTab+` WHERE idOpenId=IidOpenId;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idOpenId not found: ', IidOpenId) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      END IF;
      IF IboCustomer THEN     SELECT `+SqlColOTmp[0]+` FROM (`+customerTab+` ro LEFT JOIN `+customerTeamTab+` tea on tea.idUser=ro.idTeam) WHERE ro.idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboSeller THEN       SELECT `+SqlColOTmp[1]+` FROM (`+sellerTab+` ro LEFT JOIN `+sellerTeamTab+` tea on tea.idUser=ro.idTeam) WHERE ro.idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboCustomerTeam THEN SELECT * FROM `+customerTeamTab+` WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboSellerTeam THEN   SELECT * FROM `+sellerTeamTab+` WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboAdmin THEN        SELECT * FROM `+adminTab+` WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboComplainer THEN   SELECT count(*) AS n FROM `+complaintTab+` WHERE idComplainer=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboComplainee THEN   SELECT count(*) AS n FROM `+complaintTab+` WHERE idComplainee=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      COMMIT;
    END`);

  
  
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"UpdateComplaint");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`UpdateComplaint(IidComplainee INT, IidComplainer INT, Icomment TEXT)
    proc_label:BEGIN
      START TRANSACTION;
      IF Icomment IS NULL OR LENGTH(Icomment)=0 THEN
        UPDATE `+complaintTab+` SET comment=NULL WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        DELETE FROM `+complaintTab+` WHERE idComplainer=IidComplainer AND idComplainee=IidComplainee AND answer IS NULL;
        IF ROW_COUNT() THEN
          UPDATE `+userTab+` SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE `+userTab+` SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
        END IF;
        SELECT 'entry deleted' AS mess;
      ELSE
        INSERT INTO `+complaintTab+` (idComplainee,idComplainer,comment,tCreated,tCommentModified) VALUES (IidComplainee,IidComplainer,Icomment,now(),now()) ON DUPLICATE KEY UPDATE comment=Icomment, tCommentModified=now();
        IF ROW_COUNT()=1 THEN   # If inserted
          UPDATE `+userTab+` SET nComplaint=GREATEST(0, nComplaint+1), nComplaintCum=GREATEST(0, nComplaintCum+1) WHERE idUser=IidComplainee;
          UPDATE `+userTab+` SET nComplaintGiven=GREATEST(0, nComplaintGiven+1), nComplaintGivenCum=GREATEST(0, nComplaintGivenCum+1) WHERE idUser=IidComplainer;
          SELECT 'entry inserted' AS mess;
        ELSE
          SELECT 'entry updated' AS mess;
        END IF;
      END IF;
      #SELECT count(*) AS nComplaintFromComplainer FROM `+complaintTab+` WHERE idComplainer=IidComplainer;
      #SELECT count(*) AS nComplaintsOnComplainee FROM `+complaintTab+` WHERE idComplainee=IidComplainee;
      COMMIT;
    END`);
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"UpdateAnswer");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`UpdateAnswer(IidComplainee INT, IidComplainer INT, Ianswer TEXT)
    proc_label:BEGIN
      START TRANSACTION;
      IF Ianswer IS NULL OR LENGTH(Ianswer)=0 THEN
        UPDATE `+complaintTab+` SET answer=NULL WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        DELETE FROM `+complaintTab+` WHERE idComplainer=IidComplainer AND idComplainee=IidComplainee AND comment IS NULL;
        IF ROW_COUNT() THEN
          UPDATE `+userTab+` SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE `+userTab+` SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
        END IF;
        SELECT 'entry deleted' AS mess;
      ELSE
        #INSERT INTO `+complaintTab+` (idComplainee,idComplainer,answer,tCreated,tAnswerModified) VALUES (IidComplainee,IidComplainer,Ianswer,now(),now()) ON DUPLICATE KEY UPDATE answer=Ianswer, tAnswerModified=now();
        #IF ROW_COUNT()=1 THEN   # If inserted
        #  UPDATE `+userTab+` SET nComplaint=GREATEST(0, nComplaint+1) WHERE idUser=IidComplainee;
        #  UPDATE `+userTab+` SET nComplaintGiven=GREATEST(0, nComplaintGiven+1) WHERE idUser=IidComplainer;
        #END IF;
        UPDATE `+complaintTab+` SET answer=Ianswer WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        SELECT 'entry updated' AS mess;
      END IF;
      #SELECT count(*) AS nComplaintFromComplainer FROM `+complaintTab+` WHERE idComplainer=IidComplainer;
      #SELECT count(*) AS nComplaintsOnComplainee FROM `+complaintTab+` WHERE idComplainee=IidComplainee;
      COMMIT;
    END`);

/*
      SELECT idUser, count(*) INTO OidUser,Vc FROM "+userTab+" WHERE IP=IIP AND idFB=IidFB;
      IF Vc=0 THEN
        INSERT INTO "+userTab+" (IP,idFB) VALUES (IIP,IidFB);
        SELECT LAST_INSERT_ID() INTO OidUser;
      END IF;
CLIENT_FOUND_ROWS
*/


  
    //IF VcreatedA<VcreatedB THEN SET VidUserNew=VidUserA, VidUserOld=VidUserB; ELSE SET VidUserNew=VidUserB, VidUserOld=VidUserA; END IF;


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"sellerSetup");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"userSetup");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"reporterSetup");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"complainerSetup");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"MergeID");

/*
    SELECT idUser, count(*) INTO OidComplainer,Vc FROM "+userTab+" WHERE IP=IIP AND idFB=IidFB;
      IF Vc=0 THEN
        INSERT INTO "+userTab+" (IP,idFB) VALUES (IIP,IidFB);
        SELECT LAST_INSERT_ID() INTO OidComplainer;
      END IF;

      SELECT LAST_INSERT_ID() INTO OidComplainer;
*/
  //SqlFunction.push("INSERT INTO "+userTab+" (IP,idFB) VALUES ('fb',$id)"); 

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"setPassword");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`setPassword(IidUser int(4), IpwOld VARCHAR(40), IpwNew VARCHAR(40))
    proc_label:BEGIN
      DECLARE VpwOld VARCHAR(40);
      SELECT hashPW INTO VpwOld FROM `+userTab+` WHERE idUser=IidUser;
      IF FOUND_ROWS()!=1 THEN SELECT CONCAT('Found ', FOUND_ROWS(), ' users') AS mess; LEAVE proc_label; END IF;
      IF VpwOld!=IpwOld THEN SELECT 'Old password does not match' AS mess; LEAVE proc_label; END IF;
      UPDATE `+userTab+` SET hashPW=IpwNew WHERE idUser=IidUser;
      SELECT 'Password changed' AS mess;
    END`);




  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetIdUserNSetISeq");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`GetIdUserNSetISeq(Ikey varchar(256), iSeqN INT, OUT OidUser INT, OUT OboOK TINYINT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE Vc, Vn, ViSeq INT;
      SELECT SQL_CALC_FOUND_ROWS idUser, iSeq INTO OidUser, ViSeq FROM `+userTab+` WHERE pubKey=Ikey;
      SET Vc=FOUND_ROWS();
      IF Vc>1 THEN SET OboOK=0, Omess=CONCAT('pubKey exist multiple times Vc=',Vc); LEAVE proc_label; END IF;
      IF Vc=0 THEN SET OboOK=0, Omess='No such pubKey stored!'; LEAVE proc_label; END IF;

      IF iSeqN<=ViSeq THEN SET OboOK=0, Omess='Sequence error, try refresh the keys'; LEAVE proc_label; END IF;
      UPDATE `+userTab+` SET iSeq=iSeqN WHERE idUser=OidUser;
      SET OboOK=1, Omess='';
    END`);

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"GetValuesToController");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`GetValuesToController(IiRole INT, Ikey varchar(256), iSeqN INT, OUT OboShow TINYINT, OUT OhideTimer INT , OUT OtDiff INT, OUT OboOK INT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE Vc, Vn, VidUser, ViSeq, intMax INT;
      CALL `+siteName+`GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OboOK, Omess);
      IF OboOK=0 THEN LEAVE proc_label; END IF;
      CALL `+siteName+`TimeAccumulatedUpdOne(VidUser);

      IF IiRole=0 THEN
        SELECT SQL_CALC_FOUND_ROWS boShow, hideTimer, hideTimer-(UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(tPos)) INTO OboShow, OhideTimer, OtDiff FROM `+customerTab+` r JOIN `+userTab+` u ON r.idUser=u.idUser WHERE r.idUser=VidUser;
      ELSE
        SELECT SQL_CALC_FOUND_ROWS boShow, hideTimer, hideTimer-(UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(tPos)) INTO OboShow, OhideTimer, OtDiff FROM `+sellerTab+` r JOIN `+userTab+` u ON r.idUser=u.idUser WHERE r.idUser=VidUser;
      END IF;
      SET Vc=FOUND_ROWS();
      IF Vc=0 THEN SET OboOK=0, Omess='No such idUser!';  LEAVE proc_label; END IF;
      IF OtDiff<0 THEN SET OboShow=0; END IF;
      SET OboOK=1, Omess='';

    END`);

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"SetValuesFromController");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`SetValuesFromController(IiRole INT, Ikey varchar(256), iSeqN INT, Ix DOUBLE, Iy DOUBLE, Ilat DOUBLE, IboShow TINYINT, IhideTimer INT, OUT OboOK TINYINT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE Vc, Vn, VidUser, ViSeq, VresM INT;
      START TRANSACTION;
      CALL `+siteName+`GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OboOK, Omess);
      IF OboOK=0 THEN ROLLBACK; LEAVE proc_label; END IF;
      CALL `+siteName+`TimeAccumulatedUpdOne(VidUser);

      IF IboShow=0 THEN
        IF IiRole=0 THEN
          UPDATE `+customerTab+` SET boShow=IboShow, tPos=now(), histActive=histActive|1 WHERE idUser=VidUser;
        ELSE
          UPDATE `+sellerTab+` SET boShow=IboShow, tPos=now(), histActive=histActive|1 WHERE idUser=VidUser;
        END IF;
        SET OboOK=1, Omess='';
      ELSE
        IF IiRole=0 THEN
          SELECT SQL_CALC_FOUND_ROWS coordinatePrecisionM INTO VresM FROM `+customerTab+` WHERE idUser=VidUser;
        ELSE
          SELECT SQL_CALC_FOUND_ROWS coordinatePrecisionM INTO VresM FROM `+sellerTab+` WHERE idUser=VidUser;
        END IF;
        SET Vc=FOUND_ROWS();
        IF Vc=0 THEN SET OboOK=0, Omess='No such idUser!'; ROLLBACK; LEAVE proc_label; END IF;
        IF VresM<1 THEN SET VresM=1; END IF;
        CALL roundXY(VresM, Ix, Iy, Ilat, Ix, Iy);

        IF IiRole=0 THEN
          UPDATE `+customerTab+` SET x=Ix, y=Iy, histActive=histActive|1, boShow=IboShow, hideTimer=IhideTimer, tPos=now() WHERE idUser=VidUser;
          UPDATE `+sellerTab+` SET histActive=histActive|boShow, boShow=0, tPos=now() WHERE idUser=VidUser;
        ELSE
          UPDATE `+customerTab+` SET histActive=histActive|boShow, boShow=0, tPos=now() WHERE idUser=VidUser;
          UPDATE `+sellerTab+` SET x=Ix, y=Iy, histActive=histActive|1, boShow=IboShow, hideTimer=IhideTimer, tPos=now() WHERE idUser=VidUser;
        END IF;
        SET OboOK=1, Omess='';
      END IF;
      COMMIT;
    END`);


  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupMake");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`dupMake()
      BEGIN
        CALL copyTable('`+userTab+`_dup','`+userTab+`');
        CALL copyTable('`+sellerTab+`_dup','`+sellerTab+`');
        CALL copyTable('`+sellerTeamTab+`_dup','`+sellerTeamTab+`');
        CALL copyTable('`+sellerTeamImageTab+`_dup','`+sellerTeamImageTab+`');
        CALL copyTable('`+customerTab+`_dup','`+customerTab+`');
        CALL copyTable('`+customerTeamTab+`_dup','`+customerTeamTab+`');
        CALL copyTable('`+customerTeamImageTab+`_dup','`+customerTeamImageTab+`');
        CALL copyTable('`+userImageTab+`_dup','`+userImageTab+`');
        CALL copyTable('`+complaintTab+`_dup','`+complaintTab+`');
        CALL copyTable('`+adminTab+`_dup','`+adminTab+`');
      END`);




  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupTrunkOrgNCopyBack");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`dupTrunkOrgNCopyBack()
      BEGIN
        DELETE FROM `+sellerTab+` WHERE 1;
        DELETE FROM `+sellerTeamTab+` WHERE 1;
        DELETE FROM `+sellerTeamImageTab+` WHERE 1;
        DELETE FROM `+customerTab+` WHERE 1;
        DELETE FROM `+customerTeamTab+` WHERE 1;
        DELETE FROM `+customerTeamImageTab+` WHERE 1;
        DELETE FROM `+userImageTab+` WHERE 1;
        DELETE FROM `+complaintTab+` WHERE 1;
        DELETE FROM `+adminTab+` WHERE 1;
        DELETE FROM `+userTab+` WHERE 1;

        INSERT INTO `+userTab+` SELECT * FROM `+userTab+`_dup;
        INSERT INTO `+sellerTab+` SELECT * FROM `+sellerTab+`_dup;
        INSERT INTO `+sellerTeamTab+` SELECT * FROM `+sellerTeamTab+`_dup;
        INSERT INTO `+sellerTeamImageTab+` SELECT * FROM `+sellerTeamImageTab+`_dup;
        INSERT INTO `+customerTab+` SELECT * FROM `+customerTab+`_dup;
        INSERT INTO `+customerTeamTab+` SELECT * FROM `+customerTeamTab+`_dup;
        INSERT INTO `+customerTeamImageTab+` SELECT * FROM `+customerTeamImageTab+`_dup;
        INSERT INTO `+userImageTab+` SELECT * FROM `+userImageTab+`_dup;
        INSERT INTO `+complaintTab+` SELECT * FROM `+complaintTab+`_dup;
        INSERT INTO `+adminTab+` SELECT * FROM `+adminTab+`_dup;
      END`);

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS "+siteName+"dupDrop");
  SqlFunction.push(`CREATE PROCEDURE `+siteName+`dupDrop()
      BEGIN
        DROP TABLE IF EXISTS `+sellerTab+`_dup;
        DROP TABLE IF EXISTS `+sellerTeamTab+`_dup;
        DROP TABLE IF EXISTS `+sellerTeamImageTab+`_dup;
        DROP TABLE IF EXISTS `+customerTab+`_dup;
        DROP TABLE IF EXISTS `+customerTeamTab+`_dup;
        DROP TABLE IF EXISTS `+customerTeamImageTab+`_dup;
        DROP TABLE IF EXISTS `+userImageTab+`_dup;
        DROP TABLE IF EXISTS `+complaintTab+`_dup;
        DROP TABLE IF EXISTS `+adminTab+`_dup;
        DROP TABLE IF EXISTS `+userTab+`_dup;
      END`);

  }
  var SqlA=this.funcGen(boDropOnly);
  if(boDropOnly) var SqlB=SqlFunctionDrop;
  else var SqlB=array_merge(SqlFunctionDrop, SqlFunction);
  return array_merge(SqlA, SqlB);
}

app.SetupSqlT.prototype.funcGen=function(boDropOnly){
  var SqlFunction=[], SqlFunctionDrop=[];
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS copyTable");
  SqlFunction.push(`CREATE PROCEDURE copyTable(INameN varchar(128),IName varchar(128))
    BEGIN
      SET @q=CONCAT('DROP TABLE IF EXISTS ', INameN,';');     PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1;
      SET @q=CONCAT('CREATE TABLE ',INameN,' LIKE ',IName,';');   PREPARE stmt1 FROM @q;  EXECUTE stmt1; DEALLOCATE PREPARE stmt1;
      SET @q=CONCAT('INSERT INTO ',INameN, ' SELECT * FROM ',IName,';');    PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1;
    END`);


  //SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundXY");
  //SqlFunction.push(`CREATE PROCEDURE roundXY(resM DOUBLE, x DOUBLE, y DOUBLE, OUT Ox DOUBLE, OUT Oy DOUBLE)
    //proc_label:BEGIN
      //DECLARE resT DOUBLE;
      //DECLARE resP DOUBLE;
      //SET resT=resM;
      //IF ABS(y-128)>53.66 THEN SET resT=ROUND(resT/2); END IF;
      //IF ABS(y-128)>84.08 THEN SET resT=ROUND(resT/2); END IF;
      //SET resP=resT*`+m2wc+`, Ox=ROUND(x/resP)*resP, Oy=ROUND(y/resP)*resP;
    //END`);


  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS resM2resP");
  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS resM2resWC");
  SqlFunction.push(`CREATE FUNCTION resM2resWC(resM DOUBLE, lat DOUBLE) RETURNS DOUBLE DETERMINISTIC
    BEGIN
      DECLARE resT, fac DOUBLE;
      SET fac=COS(`+deg2r+`*lat);
      SET resT=fac*resM;
      IF resT<1 THEN SET resT=1; END IF;
      RETURN resT*`+m2wc+`;
    END`);
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundXY");
  SqlFunction.push(`CREATE PROCEDURE roundXY(resM DOUBLE, x DOUBLE, y DOUBLE, lat DOUBLE, OUT Ox DOUBLE, OUT Oy DOUBLE)
    proc_label:BEGIN
      DECLARE resP DOUBLE;
      SET resP=resM2resWC(resM,lat), Ox=ROUND(x/resP)*resP, Oy=ROUND(y/resP)*resP;
    END`);
    
  if(boDropOnly) return SqlFunctionDrop;
  else return array_merge(SqlFunctionDrop, SqlFunction);
}





app.SetupSqlT.prototype.createDummies=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  var nData=10;
  var SqlDummies=[];
  

  var SEK2CUR={SEK:1,USD:0.14,GBP:0.1,EUR:0.12,CNY:0.72,JPY:14.37,INR:7.35,DKK:1,NOK:1}
        
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

    //arrAddress.push({country:'UK', homeTown:'London', currency:'GBP', x:127.92629919892141, y:85.11312706193192, n:10, std:0.5});
    ////arrAddress.push({country:'France', homeTown:'Paris', currency:'EUR', x:129.6294241989214, y:88.07406456193192, n:10, std:0.5});
    ////arrAddress.push({country:'Italy', homeTown:'Rom', currency:'EUR', x:136.8811346138079, y:95.13470489701334, n:10, std:0.5});
    ////arrAddress.push({country:'Spain', homeTown:'Madrid', currency:'EUR', x:125.37955748049507, y:96.54275866022407, n:10, std:0.5});
    //arrAddress.push({country:'USA', homeTown:'NY', currency:'USD', x:75.39355286293579, y:96.21422827476029, n:10, std:0.5});
    ////arrAddress.push({country:'USA', homeTown:'Chicago', currency:'USD', x:65.67872790747845, y:95.16096079575951, n:10, std:0.5});
    //arrAddress.push({country:'USA', homeTown:'LA', currency:'USD', x:43.95576759128889, y:102.2555423122189, n:10, std:0.5});
    //arrAddress.push({country:'Japan', homeTown:'Tokyo', currency:'JPY', x:227.3887757633159, y:100.80702770236107, n:10, std:0.5});
    //arrAddress.push({country:'China', homeTown:'Beijing', currency:'CNY', x:210.7708451431501, y:96.99141526807438, n:10, std:0.5});
    //arrAddress.push({country:'India', homeTown:'Mumbai', currency:'INR', x:179.7837377942387, y:114.25584433021675, n:10, std:0.5});
    arrAddress.push({country:'ACountry', homeTown:'ATown', currency:'USD', x: 135.5377777777778, y: 81.46571534506883, n:10, std:20});

  }
  //merProj.fromLatLngToPoint({lat:54.6, lng:10.6})
  
  var arrBucket=[]; // To make users from big cities more likely to appear than users from small cities
  for(var i=0;i<arrAddress.length;i++){
    var objT=arrAddress[i];
    arrBucket=array_mergeM(arrBucket,array_fill(objT.n,i.toString()));
  }
  
  var getRandomPostAddress=function(){
    var key=arrBucket[randomInt(0, arrBucket.length-1)];
    var AddressT=extend({}, arrAddress[key]);
    AddressT.x+=gauss_ms(0,AddressT.std); AddressT.y+=gauss_ms(0,AddressT.std);  
    return AddressT;
  }

  
  var makeEnumRandF=function(name){  var enumT=PropBucket[name].Enum; return enumT[randomInt(0, enumT.length-1)];  };
  var getRandomDate=function(diff){ var now=unixNow(), t0, t1; if(diff>0){t0=now; t1=now+diff;} else{t0=now+diff; t1=now;} return randomInt(t0, t1);}; // Random historic time in [now-diff,now]
  var makeDateRandF=function(name){ var dateSpan=PropBucket[name].dateSpan; return getRandomDate(dateSpan);};
  var makeRandSpanF=function(name){ var [tmpl,tmpu]=PropBucket[name].RandSpanData; return randomInt(tmpl,tmpu);};
  var makeRandSpanPriceF=function(name){ var [tmpl,tmpu]=PropBucket[name].RandSpanDataPrice,  tmp=randomInt(tmpl,tmpu), cur='SEK', fac=SEK2CUR[cur];  tmp=tmp*fac; return tmp;};
  var makeFixedF=function(name){ return PropBucket[name].FixedData; };


  var PropBucket={
    vehicleType:{Enum:['sedan']},
    
    brand:{Enum:['Volvo','Saab','VW','Toyota','Ford','Hyundai','Mercedes','Fiat','Dodge','Mazda','BMW','Audi','Lloyd','Opel','Skoda','Ferrari','Lamborgini','Seat','Chrysler','Chevrolet','Scania','Aston Martin','Bentley','Jaguar','Land Rover','Honda','Nissan','Rolls Royce']},
    link:{Enum:['example.com','www.example.com','closeby.market','gavott.com','example.com','']},
    nPassengers:{Enum:range(2,20,1)},
    nChildSeat:{Enum:[0,1,2]}, nExtraSeat:{Enum:[0,1,2]}, nWheelChairPlaces:{Enum:[0,1,2]},
    idTeam:{Enum:[1,2,3]}, idTeamWanted:{Enum:[1,2,3]},
    strUnitDist:{Enum:["km","mile"]},
    payload:{Enum:range(0,15,0.5)},
    cuttingWidth:{Enum:range(30,150,2)},
    otherLang:{Enum:['','Matlab','Babyloninan','D']},

    tCreated:{dateSpan:-2*8760*3600},
    tPos:{dateSpan:-12*3600},
    tLastWriteOfTA:{dateSpan:0},
    //terminationDate:{dateSpan:4*30*24*3600},
    tLastPriceChange:{dateSpan:-30*24*3600},
    shiftEnd:{dateSpan:12*3600},

    donatedAmount:{RandSpanData:[0, 1000]},
    tAccumulated:{RandSpanData:[0, 2*8760*3600]},
    priceStart:{RandSpanDataPrice:[20,45]},
    pricePerDist:{RandSpanDataPrice:[10,20]},
    //pricePerTravelHour:{RandSpanDataPrice:[200,400]},
    pricePerHour:{RandSpanDataPrice:[200,400]},
    idDriverGovernment:{RandSpanData:[1000,2000]},
    
    hideTimer:{FixedData:3600*24*365},
    boShow:{Enum:[0,1]},
    histActive:{FixedData:1},
    coordinatePrecisionM:{FixedData:1},
    
    otherContainer:{Enum:[0,1]},
    boCustomerHasEquipment:{Enum:[0,1]},
    nWindows:{Enum:range(1,30,1)},
    area:{Enum:range(1,1000,1)},
    boRoad:{Enum:[0,1]},
    boDriveWay:{Enum:[0,1]},
    boRoof:{Enum:[0,1]},
    fruit:{Enum:['apple', 'strawberry', 'cabbage']},
    database:{Enum:['mysql', 'neo4j', 'redis']},
    language:{Enum:['c', 'javascript', 'java']},
    distStartToGoal:{RandSpanData:[1000,20000]},
    price:{RandSpanDataPrice:[100,200]},
    //compassPoint,
    destination:{Enum:['Göteborg', 'Umeå', 'Oslo']},
    fixedPricePerUnit:{RandSpanDataPrice:[100,200]},
    fixedPricePerUnitUnit:{Enum:["apple","kg"]},
    //compassPoint:{Enum:['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']},
    //standingByMethod:{Enum:['inCar','atHome','5min','10min']}
  };
  for(var iSite=0;iSite<SiteName.length;iSite++){
    var siteName=SiteName[iSite], {ORole}=Site[siteName];
    for(var iRole=0;iRole<ORole.length;iRole++){
      var Prop=ORole[iRole].Prop;
      for(var name in Prop){
        if(!(name in PropBucket)){
          PropBucket[name]={};
          if('Enum' in Prop[name]) PropBucket[name].Enum=Prop[name].Enum.concat([]);
        }
      }
    }
  }
  

  var StringData=['displayName', 'tel', 'link', 'homeTown', 'currency', 'vehicleType', 'strUnitDist', 'standingByMethod', 'idDriverGovernment', 'brand', 'otherLang', 'compassPoint', 'destination', 'fixedPricePerUnitUnit', 'fruit', 'database', 'language'];
        
    
    
  for(var iSite=0;iSite<SiteName.length;iSite++){
    var siteName=SiteName[iSite];
    var site=Site[siteName];
    var {TableName, ViewName, ORole}=site;
    var {sellerTab, sellerTeamTab, sellerTeamImageTab, customerTab, customerTeamTab, customerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
    var {histView}=site.ViewName;
    
      // Insert into userTab
    var arrUser=Array(nData), SqlAllU=Array(nData);
    for(var i=0;i<nData;i++){
      let strName="dummy"+i, strNameUC=ucfirst(strName), email=strName+'@example.com', donatedAmount=makeRandSpanF('donatedAmount'); 
      arrUser[i]={idFB:strName, email:email, displayName:strNameUC, tel:"07000000"+i};

      var idTmp=i+1;  
      //var SqlT=[idTmp, 'null', 'null', "'"+strNameUC+"'", "'"+email+"'", "'"+strNameUC+"'", "''", "'"+strNameUC+"'", donatedAmount];
      //SqlAllU[i]="("+SqlT.join(', ')+")";
      var SqlT=[idTmp, null, null, strNameUC, email, strNameUC, "", strNameUC, donatedAmount];
      var SqlT=DB.default.pool.escape(SqlT);
      SqlAllU[i]="("+SqlT+")";

      arrUser[i]=extend(arrUser[i],getRandomPostAddress());
    }
    var tmp=SqlAllU.join(",\n");
    SqlDummies.push("INSERT INTO "+userTab+" (idUser, idFB, idIdPlace, idOpenId, email, nameIP, image, displayName, donatedAmount) VALUES \n"+tmp);
    
    
      // Insert into complaintTab
    var IdComplainer=[2, 3, 4];
    var StrComplaint=['He never answered the phone', 'No good', 'Bad bad bad'];
    var StrAns=['I was on the toilet', "Sorry, it was my first time.", ''];
    var nComplainer=IdComplainer.length;
    for(var j=0;j<10;j++){ //loop through drivers
      for(var i=0;i<nComplainer;i++){
        var idRep=IdComplainer[i], iRep=(i+j)%nComplainer, strRep=StrComplaint[iRep], iAns=(i+2*j)%nComplainer, strAns=StrAns[iAns];
        SqlDummies.push("INSERT INTO "+complaintTab+" (idComplainee, idComplainer, comment, answer, tCreated, tCommentModified, tAnswerModified) SELECT idUser, "+idRep+", \""+strRep+"\", \""+strAns+"\", now(), now(), now() FROM "+userTab+" WHERE idUser%10="+j);
      }
    }
    
      // Update nComplaint and nComplaintGiven
    SqlDummies.push(`
    UPDATE `+userTab+` u
    JOIN
      (SELECT idComplainee, COUNT(*) AS n FROM `+complaintTab+` c GROUP BY c.idComplainee) tmp ON u.idUser=tmp.idComplainee
    SET u.nComplaint = n, u.nComplaintCum = n`);

    SqlDummies.push(`
    UPDATE `+userTab+` u
    JOIN
      (SELECT idComplainer, COUNT(*) AS n FROM `+complaintTab+` c GROUP BY c.idComplainer) tmp ON u.idUser=tmp.idComplainer
    SET u.nComplaintGiven = n, u.nComplaintGivenCum = n`);
    
      // Insert into roleTabs
    var StrPlugInNArg=site.StrPlugInNArg;
    var StrPlugIn=[];
    for(var i=0;i<StrPlugInNArg.length;i++){var strTmp=StrPlugInNArg[i], n=strTmp.length, charLast=strTmp[n-1]; if(charLast=='C' || charLast=='S') { strTmp=strTmp.substr(0,n-1); } StrPlugIn.push(strTmp); }
    
    for(var iRole=0;iRole<ORole.length;iRole++){
      var oRole=ORole[iRole];
      var Prop=oRole.Prop;
      var {charRole, charRoleUC}=oRole;
      var roleTab=charRole=='c'?customerTab:sellerTab;



      var arrAssign=[]; // arrAssign: as in draw a random number from a bucket
      if(in_array("general", StrPlugInNArg)){ 
        arrAssign=['boShow', 'tCreated', 'tPos', 'histActive', 'tLastWriteOfTA', 'tAccumulated', 'hideTimer', 'tel', 'link', 'homeTown', 'currency', 'tLastPriceChange', 'x', 'y', 'idTeam', 'idTeamWanted', 'coordinatePrecisionM'];
        if(charRole=='s') arrAssign.push('experience');
      }

      if(in_array("vehicleType", StrPlugInNArg) && charRole=='s'){ arrAssign.push('vehicleType');  }
      if(in_array("distNTimePrice", StrPlugInNArg) && charRole=='s'){ arrAssign.push('priceStart', 'strUnitDist', 'pricePerDist', 'pricePerHour');  }
      if(in_array("transportCustomer", StrPlugInNArg) && charRole=='c'){ arrAssign.push('distStartToGoal', 'compassPoint', 'destination'); }
      if(in_array("standingByMethod", StrPlugInNArg) && charRole=='s'){  arrAssign.push('standingByMethod');   }
      if(in_array("shiftEnd", StrPlugInNArg) && charRole=='s'){ arrAssign.push('shiftEnd');  }
      if(in_array("hourlyPrice"+charRoleUC, StrPlugInNArg)){   arrAssign.push('pricePerHour');    }
      if(in_array("price"+charRoleUC, StrPlugInNArg)){   arrAssign.push('price');    }

      if(in_array("fixedPricePerUnit", StrPlugInNArg) && charRole=='c'){  arrAssign.push('fixedPricePerUnit', 'fixedPricePerUnitUnit');}

      if(in_array("taxi", StrPlugInNArg)){
        array_mergeM(arrAssign, site.StrPropE);
        if(charRole=='s') array_mergeM(arrAssign, oRole.StrPropE);
      }
      if(in_array("transport", StrPlugInNArg)){
        var StrTmp=site.StrTransportBool;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, ['payload'], StrTmp);
        if(charRole=='s') array_mergeM(arrAssign, oRole.StrPropE);
      }
      if(intersectBool(["cleaner"], StrPlugInNArg)){ 
        if(charRole=='c') { 
          var StrTmp=oRole.StrPropE;
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
          array_mergeM(arrAssign, StrTmp);
        }
      }
      if(intersectBool(["windowcleaner"], StrPlugInNArg)){ 
        if(charRole=='c') array_mergeM(arrAssign, oRole.StrPropE); // 'nWindows', 'boCustomerHasEquipment'
        if(charRole=='s') { 
          var StrTmp=oRole.StrPropE;
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
          array_mergeM(arrAssign, StrTmp);
        }
      }
      if(in_array("lawnmower", StrPlugInNArg)){ 
        if(charRole=='c') array_mergeM(arrAssign, oRole.StrPropE);   // 'area', 'boCustomerHasEquipment'
        if(charRole=='s') { 
          var StrTmp=oRole.StrBool;
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
          array_mergeM(arrAssign, StrTmp, ['cuttingWidth']);
        }
      }
      if(in_array("snowremoval", StrPlugInNArg)){
        if(charRole=='c') {
          var StrTmp=oRole.StrBool;  //
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
          array_mergeM(arrAssign, StrTmp, ['area']);
        }
        if(charRole=='s') { 
          var StrTmp=oRole.StrBool;
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
          array_mergeM(arrAssign, StrTmp);
        }
      }
      if(in_array("fruitpicker", StrPlugInNArg)){ 
        if(charRole=='c') arrAssign.push('fruit');
      }
      if(in_array("programmer", StrPlugInNArg)){ 
        if(charRole=='c') arrAssign.push('database', 'language');
        if(charRole=='s') { 
          var StrTmp=oRole.StrProgrammerLang;
          for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1,2,3,4,5]; }
          array_mergeM(arrAssign, StrTmp, ['otherLang']);
          arrValRemove(arrAssign, 'experience');
        }
      }


      var SqlAllRole=Array(nData);

      for(var i=0;i<nData;i++){

        var StrName=[];
        var StrIns=[];
        for(var j=0;j<arrAssign.length;j++){
          var name=arrAssign[j], QMark="?", value=0;
          if(name in arrUser[i]) value=arrUser[i][name]; 
          //if(name in person) value=person[name]; 
          //else if(name in AddressT) value=AddressT[name];
          else if('Enum' in PropBucket[name]){ value=makeEnumRandF(name);  }
          else if('dateSpan' in PropBucket[name]){ value=makeDateRandF(name);  }
          else if('RandSpanData' in PropBucket[name]){ value=makeRandSpanF(name);  }
          else if('RandSpanDataPrice' in PropBucket[name]){ value=makeRandSpanPriceF(name);  }
          else if('FixedData' in PropBucket[name]){ value=makeFixedF(name);  }
          if(name in Prop && 'roleUpdF' in Prop[name]){ [QMark]=Prop[name].roleUpdF.call(Prop,name,value);  }
          var valT=QMark.replace(/\?/,value);     
          if(in_array(name,StringData) && value!==null){ valT="'"+valT+"'";}
          
          StrName.push("`"+name+"`");
          StrIns.push(valT);
        }
        var strName=StrName.join(', ');
        var strIns=StrIns.join(', ');  

        var idTmp=i+1, sqlCurRole="("+idTmp+", "+strIns+")";

        SqlAllRole[i]=sqlCurRole;
        
      }

      var tmp=SqlAllRole.join(",\n");
      SqlDummies.push("INSERT INTO "+roleTab+" (idUser, "+strName+") VALUES \n"+tmp);


    } // end of loop through ORole
  } // end of loop through SiteName
  return SqlDummies;
}



app.SetupSqlT.prototype.truncate=function(SiteName){
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


app.SetupSqlT.prototype.populateSetting=function(SiteName){
  if(typeof SiteName=='string') SiteName=[SiteName];
  var SqlTab=[];
  for(var iSite=0;iSite<SiteName.length;iSite++){
  var siteName=SiteName[iSite];
  var site=Site[siteName]; 
  var {TableName}=site, {settingTab}=TableName;

  SqlTab.push(`INSERT INTO `+settingTab+` VALUES
  ('boShowTeam', '0'),
  ('tLastWriteOfHA', floor( UNIX_TIMESTAMP(now())/`+sPerDay+` )),
  ('tLastWriteOfBoShow', 0),
  ('boGotNewSellers', '0'),
  ('nUser', '0'),
  ('boAllowEmailAccountCreation', '0')`); 

  }
  return SqlTab;
}


  // Called when --sql command line option is used
app.SetupSqlT.prototype.doQuery=function*(flow, strCreateSql){
  //var StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'populateSetting', 'truncate', 'createDummies'];  // , 'createDummy'
  if(StrValidSqlCalls.indexOf(strCreateSql)==-1){var tmp=strCreateSql+' is not valid input, try any of these: '+StrValidSqlCalls.join(', '); console.log(tmp); return; }
  var Match=RegExp("^(drop|create)?(.*?)$").exec(strCreateSql);
  if(!Match) { debugger;  return; }

  var boDropOnly=false, strMeth=Match[2];
  if(Match[1]=='drop') { boDropOnly=true; strMeth='create'+strMeth;}
  else if(Match[1]=='create')  { strMeth='create'+strMeth; }
  
  if(!('default' in DB)) {console.log('no DB.default');}
  this.myMySql=new MyMySql(DB.default.pool);
  
  var SqlA=this[strMeth](SiteName, boDropOnly); 
  var strDelim=';', sql=SqlA.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val);
  var tmp=createMessTextOfMultQuery(SqlA, err, results);  console.log(tmp);
  this.myMySql.fin();
  if(err){ debugger;  return; }
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



app.createDumpCommand=function(){ 
  var strCommand='', StrTabType=['seller','sellerTeam','sellerTeamImage','customer','customerTeam','customerTeamImage','userImage','complaint','admin','setting','user'];
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




