
globalThis.app=globalThis;
import http from "http";
import https from 'https';
import url from "url";
import path from "path";
import fs, {promises as fsPromises} from "fs";
import concat from 'concat-stream';
import fetch from 'node-fetch';
import formidable from "formidable";
//import NodeRSA from 'node-rsa';
import crypto from 'crypto';
import zlib from 'zlib';
import redis from "redis";
import Streamify from 'streamify-string';
import validator from 'validator';
import serialize from 'serialize-javascript';
import UglifyJS from "uglify-js";
//import sgMail from '@sendgrid/mail';
import ip from 'ip';
import webPush from 'web-push';
import mime from "mime";
import mysql from 'mysql';
import minimist from 'minimist';
import gmTmp from 'gm';
app.gm=gmTmp.subClass({ imageMagick: true });
import nodemailer from 'nodemailer';
//import dotenv from 'dotenv';
//dotenv.config()

var argv = minimist(process.argv.slice(2));

app.extend=Object.assign;
extend(app, {http, url, path, fsPromises, concat, fetch, formidable, crypto, zlib, redis, Streamify, validator, serialize, UglifyJS, ip, webPush, mime, mysql, gm});
//, sgMail

await import('./lib.js')
await import('./libMath.js');;
await import('./libServerGeneral.js');
await import('./libMysql.js');
await import('./libServer.js');
await import('./lib/foundOnTheInternet/sha1.js');



var strAppName='tracker';

var strInfrastructure=process.env.strInfrastructure||'local';
app.boHeroku=strInfrastructure=='heroku'; 
app.boAF=strInfrastructure=='af'; 
app.boLocal=strInfrastructure=='local'; 
app.boDO=strInfrastructure=='do'; 


app.StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'populateSetting', 'truncate', 'createDummies']; // , 'createDummy'
  
app.helpTextExit=function(){
  var arr=[];
  arr.push('USAGE script [OPTION]...');
  arr.push('  -h, --help          Display this text');
  arr.push('  -p, --port [PORT]   Port number (default: 5000)');
  arr.push('  --sql [SQL_ACTION]  Run a sql action.');
  arr.push('    SQL_ACTION='+StrValidSqlCalls.join('|'));
  console.log(arr.join('\n'));
  process.exit(0);
}

var StrUnknown=AMinusB(Object.keys(argv),['_', 'h', 'help', 'p', 'port', 'sql']);
var StrUnknown=[].concat(StrUnknown, argv._);
if(StrUnknown.length){ console.log('Unknown arguments: '+StrUnknown.join(', ')); helpTextExit(); }


    // Set up redisClient
var urlRedis=process.env.REDIS_URL;
if(  urlRedis ) {
  app.redisClient=redis.createClient(urlRedis, {no_ready_check: true}); //
}else { app.redisClient=redis.createClient();}

  // WebPush subscription (for testing)
var globSubscription=null;

//strCookieProp="; SameSite=Lax; HttpOnly";



  // Default config variables (If you want to change them I suggest you create a file config.js and overwrite them there)
extend(app, {UriDB:{},
boDbg:0, port:5000, levelMaintenance:0, googleSiteVerification:'googleXXX.html',
wwwCommon:'',
boShowTeam:false,
maxUnactivity:3600*24,  // Used on _Main, CSRFCode, _UserInfoFrDB
maxLoginUnactivity:10*60,  // Used on _LoginIdP, _LoginIdUser
boVideo:0,
boUseSelfSignedCert:false,
wsIconDefaultProt:"/Site/Icon/icon<size>.png",
boAllowEmailLoginOnSomeSites:false,
intDDOSMax:100, // intDDOSMax: How many requests before DDOSBlocking occurs. 
tDDOSBan:5, // tDDOSBan: How long in seconds til the blocking is lifted
intDDOSIPMax:200, // intDDOSIPMax: How many requests before DDOSBlocking occurs. 
tDDOSIPBan:10, // tDDOSIPBan: How long in seconds til the blocking is lifted
boUseDBIndex:0,
timeOutAccumulatedUpdate:3600, // How long to wait before updating tAccumulated in buyer/seller tabs
timeOutDeleteStatusInfo:3600,
RegRedir:[],
strSalt:'abcdefghijklmnopqrstuvxyz', // Random letters to prevent that the hashed passwords looks the same as on other sites.
strIPPrim:'fb', 
strIPAlt:'idplace',
//apiKeySendGrid:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
emailRegisterdUser:"mail@example.com",
RootDomain:{},
Site:{},
wwwLoginRet:undefined,
//wwwLoginScope:"",
leafLoginBack:"loginBack.html", 
leafLogin:"login.html", 
boShowTeam:1,
boSlowNetWork:0,
strReCaptchaSiteKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",   strReCaptchaSecretKey:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
VAPID_PUBLIC_KEY:'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
VAPID_PRIVATE_KEY:'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
boEnablePushNotification:true,
});




port=argv.p||argv.port||5000;
if(argv.h || argv.help) {helpTextExit(); }


var strConfig;
if(boHeroku){ 
  if(!process.env.jsConfig) { console.error('jsConfig-environment-variable is not set'); process.exit(-1);}
  strConfig=process.env.jsConfig||'';
}
else{
  var [err, buf]=await fsPromises.readFile('./config.js').toNBP();    if(err) {console.error(err); process.exit(-1);}
  strConfig=buf.toString();
} 
var strMd5Config=md5(strConfig);
eval(strConfig);
if(typeof strSalt=='undefined') {console.error("typeof strSalt=='undefined'"); process.exit(-1); }

var redisVar='str'+ucfirst(strAppName)+'Md5Config';
var [err,tmp]=await getRedis(redisVar); if(err) {console.error(err); process.exit(-1);   }
var boNewConfig=strMd5Config!==tmp; 
if(boNewConfig) { var tmp=await setRedis(redisVar, strMd5Config);  }

//var redisVar='str'+ucfirst(strAppName)+'Md5Config';
//var [err,tmp]=await cmdRedis('GET', [redisVar]);
//var boNewConfig=strMd5Config!==tmp; 
//if(boNewConfig) { var [err,tmp]=await cmdRedis('SET',[redisVar,strMd5Config]);  }


if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;
app.SiteName=Object.keys(Site);



  // Set up mail
//sgMail.setApiKey(apiKeySendGrid);
app.smtpTransport=nodemailer.createTransport({
  host:'smtp-relay.sendinblue.com',
  port:587,
  auth:objSendinblueAuth
})

  // Set up webPush
webPush.setVapidDetails('https://locatabl.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

await import('./filterServer.js'); 
await import('./variablesCommon.js');
await import('./libReqBE.js');
await import('./libReq.js'); 

app.DB={}
DBExtend(DB);


//createPlugins();
SiteExtend();

  // Do db-query if --sql XXXX was set in the argument
if(typeof argv.sql!='undefined'){
  if(typeof argv.sql!='string') {console.log('sql argument is not a string'); process.exit(-1);  }
  var tTmp=new Date().getTime();
  var setupSql=new SetupSql();
  setupSql.myMySql=new MyMySql(DB.default.pool);
  var [err]=await setupSql.doQuery(argv.sql);
  setupSql.myMySql.fin();
  if(err) { 
    if(err.strLab=='erraticInput') {console.log(err.message); process.exit(-1); }
    else {  console.error(err);  process.exit(-1);}
  }
  console.log('Time elapsed: '+(new Date().getTime()-tTmp)/1000+' s'); 
  process.exit(0);
}

app.CacheUri=new CacheUriT();
var StrFilePreCache=['filter.js', 'lib.js', 'libClient.js', 'lang/en.js', 'clientKeyRemoteControlSave.js', 'stylesheets/style.css', 'serviceworker.js', 'lib/foundOnTheInternet/sha1.js']; //, 'clientMergeID.js'
for(var i=0;i<StrFilePreCache.length;i++) {
  var [err]=await readFileToCache(StrFilePreCache[i]); if(err) {  console.error(err);  process.exit(-1);}
}
  // Split client.js to extract plugins
var splitterPlugIn=new SplitterPlugIn();
var [err]=await splitterPlugIn.readFileToCacheClientJs(); if(err) {  console.error(err);  process.exit(-1);}
await createSiteSpecificClientJSAll();


  // Write manifest to Cache
var [err]=await createManifestNStoreToCacheMult(SiteName); if(err) {  console.error(err.message);  process.exit(-1);}


if(boDbg){
  fs.watchFile('client.js',async function () {
    console.log('client.js changed: ');
    var [err]=await splitterPlugIn.readFileToCacheClientJs(); if(err) {  console.error(err);  process.exit(-1);}
    
  });
  fs.watch('.', makeWatchCB('.', ['filter.js', 'clientKeyRemoteControlSave.js', 'libClient.js', 'lib.js', 'serviceworker.js']) );
  fs.watch('stylesheets', makeWatchCB('stylesheets', ['style.css']) );
  fs.watch('lang', makeWatchCB('lang', ['en.js', 'sv.js']) );
}


app.tIndexMod=new Date(); tIndexMod.setMilliseconds(0);

app.ETagImage={};

var regexpLib=RegExp('^/(stylesheets|lib|pluginLib|Site|lang)/');
var regexpLooseJS=RegExp('^/(lib|libClient|client|clientKeyRemoteControlSave|filter|serviceworker)\\.js'); //|clientProt|clientMergeID
var regexpLooseJS2=RegExp('^/[a-zA-Z]*_('+leafSiteSpecific+'|'+leafManifest+')'); 
var regexpPlugin=RegExp('^/plugin(\\w+)\\.js');

var regexpHerokuDomain=RegExp("\\.herokuapp\\.com$"),  regexpAFDomain=RegExp("\\.af\\.cm$");  

if(boHeroku || boAF){
  var regInfra=boHeroku?regexpHerokuDomain:regexpAFDomain;
  RegRedir.push(function(req){
    var Str=regInfra.exec(req.headers.host); 
    if(Str && req.headers['x-forwarded-proto']!='https') {    return 'https://'+req.headers.host+'/'+req.url;   }
    return null;
  });
}


var tLoginTimeout=300;

app.StrCookiePropProt={"HttpOnly":1, Path:"/", "Max-Age":3600*24*30, "SameSite":"Lax"};
if(!boLocal || boUseSelfSignedCert) StrCookiePropProt["Secure"]=1;
var oTmp=extend({},StrCookiePropProt); 
oTmp["SameSite"]="None"; app.strCookiePropNormal=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["SameSite"]="Lax"; app.strCookiePropLax=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["SameSite"]="Strict"; app.strCookiePropStrict=";"+arrayifyCookiePropObj(oTmp).join(';');

var oTmp=extend({},StrCookiePropProt); 
oTmp["Max-Age"]=tLoginTimeout; var str1=";"+arrayifyCookiePropObj(oTmp).join(';');
oTmp["Max-Age"]=0; var str0=";"+arrayifyCookiePropObj(oTmp).join(';');
app.StrSessionIDLoginProp=[str0,str1];


const handler=async function(req, res){

  if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;} // If levelMaintenance

    // If isRedirAppropriate
  if(typeof isRedirAppropriate!='undefined'){   var uTmp=isRedirAppropriate(req); if(uTmp){res.out301(uTmp); return;}   }

    // Set boTLS
  var boTLS=false;
  if(boHeroku || boAF) boTLS=req.headers['x-forwarded-proto']=='https';
  else if(boLocal) boTLS=Boolean('encrypted' in req.connection); 
  else if(boDO) { boTLS=true; }


    //res.setHeader("X-Frame-Options", "deny");  // Deny for all (note: this header is removed for images (see reqMediaImage) (should also be removed for videos))
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");  // Deny for all (note: this header is removed in certain requests)
  res.setHeader("X-Content-Type-Options", "nosniff");  // Don't try to guess the mime-type (I prefer the rendering of the page to fail if the mime-type is wrong)
  if(!boLocal || boUseSelfSignedCert) res.setHeader("Strict-Transport-Security", "max-age="+3600*24*365); // All future requests must be with https (forget this after a year)
  res.setHeader("Referrer-Policy", "origin");  //  Don't write the refer unless the request comes from the origin
  

    // Extract qs, objQS
  var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=parseQS2(qs);

    // Extract siteName, wwwSite, boCommon, pathName
  var domainName=req.headers.host; 
  var pathNameOrg=objUrl.pathname;
  var wwwReq=domainName+pathNameOrg;
  var boCommon=domainName===wwwCommon;
  var boCommon=false;
  if(boCommon){ var siteName='common', wwwSite=wwwCommon;}
  else{
    var {siteName,wwwSite}=Site.getSite(wwwReq);  
    if(!siteName) { res.out404("404 Nothing at that url\n"); return; }
    var site=Site[siteName];  // Set site
  }
  var pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';


  if(boDbg) {console.log(pathName);}
  
  
  var cookies =req.cookies= parseCookies(req);


    //
    // DDOS Checking
    //

    // Assign boCookieDDOSCameNExist
  var boCookieDDOSCameNExist=false;
  var {sessionIDDDos=null}=cookies, redisVarDDos;
  if(sessionIDDDos) {
    redisVarDDos=sessionIDDDos+'_DDOS';
    var [err, tmp]=await cmdRedis('EXISTS', redisVarDDos); boCookieDDOSCameNExist=tmp;
  }
    // If !boCookieDDOSCameNExist then create a new sessionIDDDos (and redisVarDDos).
  if(!boCookieDDOSCameNExist) { sessionIDDDos=randomHash();  redisVarDDos=sessionIDDDos+'_DDOS'; }
    // Update redisVarDDos counter
  var luaCountFunc=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
  var [err, intCount]=await cmdRedis('EVAL',[luaCountFunc, 1, redisVarDDos, tDDOSBan]);
    // Write to response
  res.replaceCookie("sessionIDDDos="+sessionIDDDos+strCookiePropNormal);

    // Update redisVarDDosIP counter
  var ipClient=getIP(req), redisVarDDosIP=ipClient+'_DDOS';
  var luaCountFunc=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
  var [err, intCountIP]=await cmdRedis('EVAL',[luaCountFunc, 1, redisVarDDosIP, tDDOSIPBan]);
  
    // Determine which DDOS counter to use
  if(boCookieDDOSCameNExist) {  var intCountT=intCount, intDDOSMaxT=intDDOSMax, tDDOSBanT=tDDOSBan;   }
  else{  var intCountT=intCountIP, intDDOSMaxT=intDDOSIPMax, tDDOSBanT=tDDOSIPBan;   }
  
    // If the counter is to high, then respond with 429
  if(intCountT>intDDOSMaxT) {
    var strMess="Too Many Requests ("+intCountT+"), wait "+tDDOSBanT+"s\n";
    if(pathName=='/'+leafBE){ var reqBE=new ReqBE({req, res}); reqBE.mesEO(strMess, 429); }
    else res.outCode(429, strMess);
    return;
  }


  
    // Check if a valid sessionID-cookie came in
  req.boGotSessionCookie=false;
  var boSessionCookieInInput='sessionID' in cookies, sessionID=null, redisVarSessionMain;
  if(boSessionCookieInInput) {
    sessionID=cookies.sessionID;  redisVarSessionMain=sessionID+'_Main';
    var [err, tmp]=await cmdRedis('EXISTS', redisVarSessionMain); req.boGotSessionCookie=tmp;
  } 
  
  if(!req.boGotSessionCookie){ sessionID=randomHash();  redisVarSessionMain=sessionID+'_Main'; }
  
  res.replaceCookie("sessionID="+sessionID+strCookiePropLax);
  
      // Refresh / create  redisVarSessionMain
  if(req.boGotSessionCookie){
    var luaCountFunc=`local c=redis.call('GET',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
    var [err, value]=await cmdRedis('EVAL',[luaCountFunc, 1, redisVarSessionMain, maxUnactivity]); req.sessionCache=JSON.parse(value)
  } else { 
    await setRedis(redisVarSessionMain, 1, maxUnactivity); 
    req.sessionCache={};
  }



    // Set mimetype if the extention is recognized
  var regexpExt=RegExp('\.([a-zA-Z0-9]+)$');
  var Match=pathName.match(regexpExt), strExt; if(Match) strExt=Match[1];
  if(strExt in MimeType) res.setHeader('Content-type', MimeType[strExt]);


  var strScheme='http'+(boTLS?'s':''),   strSchemeLong=strScheme+'://';
  var uDomain=strSchemeLong+req.headers.host;
  var uSite=strSchemeLong+wwwSite;

  extend(req, {site, sessionID, qs, objQS, boTLS, strSchemeLong, wwwSite, uSite, pathName, siteName, uDomain, rootDomain:RootDomain[site.strRootDomain]});


  var objReqRes={req, res};
  objReqRes.myMySql=new MyMySql(DB[site.db].pool);
  if(pathName=='/'){
    //if("keyRemoteControl" in objQS && "data" in objQS) {      await reqCurlEnd.call(objReqRes);     }
    if("dataFromRemoteControl" in objQS) {      await reqCurlEnd.call(objReqRes);     }
    else if("keyRemoteControl" in objQS){      await reqKeyRemoteControlSave.call(objReqRes);    }
    else{      await reqIndex.call(objReqRes);      }
  }
  //else if(pathName=='/'+leafAssign){    var reqAssign=new ReqAssign(req, res);    reqAssign.go();    }
  else if(pathName.indexOf('/image/')==0){      await reqImage.call(objReqRes);   } //RegExp('^/image/').test(pathName)
  else if(pathName=='/'+leafBE){        var reqBE=new ReqBE(objReqRes);  await reqBE.go();    }
  else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || regexpPlugin.test(pathName) || pathName=='/conversion.html' || regexpLooseJS2.test(pathName) ){
    if(pathName=='/conversion.html') res.removeHeader("Content-Security-Policy");
    await reqStatic.call(objReqRes);
  }
  else if(pathName=='/'+leafLoginBack){   await reqLoginBack.call(objReqRes);   }
  else if(pathName=='/monitor.html'){     await reqMonitor.call(objReqRes);     }
  else if(pathName=='/stat.html'){        await reqStat.call(objReqRes);        }
  else if(pathName=='/statBoth.html'){        await reqStatBoth.call(objReqRes);        }
  else if(pathName=='/statTeam.html'){        await reqStatTeam.call(objReqRes);        }
  //else if(pathName=='/offer.html'){  reqOffer.outputData(req,res);    }
  else if(pathName=='/'+leafLoginWLink){  await reqLoginWLink.call(objReqRes);  }
  else if(pathName=='/'+leafVerifyPWResetReturn){  await reqVerifyPWResetReturn.call(objReqRes);  }
  else if(pathName=='/'+leafVerifyEmailNCreateUserReturn){  await reqVerifyEmailNCreateUserReturn.call(objReqRes);  }
  else if(pathName=='/'+leafDataDelete){  await reqDataDelete.call(objReqRes);  }
  else if(pathName=='/'+leafDataDeleteStatus){  await reqDataDeleteStatus.call(objReqRes);  }
  else if(pathName=='/'+leafDeAuthorize){  await reqDeAuthorize.call(objReqRes);  }
  //else if(pathName=='/mergeID'){  var reqMergeID=new ReqMergeID(req, res);      reqMergeID.go();      }
  else if(pathName=='/createDumpCommand'){  var str=createDumpCommand(); res.out200(str);     }
  else if(pathName=='/debug'){    debugger  }
  else if(pathName=='/prev.html'){        await reqPrev.call(objReqRes);        }
  else if(pathName=='/'+googleSiteVerification) res.end('google-site-verification: '+googleSiteVerification);
  //else if(pathName=='/vapidPublicKey'){    res.end(VAPID_PUBLIC_KEY);   }
  else if(pathName=='/register'){
    var jsonInput=await app.getPost(req);
    try{ var objT=JSON.parse(jsonInput); }catch(e){ res.out500(e);  return; }
    req.body=objT;
    globSubscription = req.body.subscription;
    res.outCode(201);
  }
  else if(pathName=='/sendNotification'){
    var jsonInput=await app.getPost(req);
    try{ var objT=JSON.parse(jsonInput); }catch(e){ res.out500(e);  return; }
    req.body=objT;
    const subscription = req.body.subscription||globSubscription;
    const payload = null, options = { TTL: req.body.ttl };
    await mySleepMS(req.body.delay * 1000);
    var [e,result]=await webPush.sendNotification(subscription, payload, options).toNBP();  if(e){res.out500(e); return;}
  }
  else {res.out404("404 Not Found\n"); return; }
  objReqRes.myMySql.fin();
  

}

if(boUseSelfSignedCert){
  var strName='192.168.0.3';
  //var strName='r50.local';
  //var strName='localhost';
  //const options = { key: fs.readFileSync('0SSLCert/server.key'), cert: fs.readFileSync('0SSLCert/server.cert') };
  //const options = { key: fs.readFileSync('0SSLCert/'+strName+'.key'), cert: fs.readFileSync('0SSLCert/'+strName+'.crt') };

  var [err, bufK]=await fsPromises.readFile('0SSLCert/'+strName+'.key').toNBP(); if(err) {console.error(err); process.exit(-1);}
  var [err, bufC]=await fsPromises.readFile('0SSLCert/'+strName+'.crt').toNBP(); if(err) {console.error(err); process.exit(-1);}
  const options= {key:bufK.toString(), cert:bufC.toString()};

  https.createServer(options, handler).listen(port);   console.log("Listening to HTTPS requests at port " + port);
} else{
  http.createServer(handler).listen(port);   console.log("Listening to HTTP requests at port " + port);
}


