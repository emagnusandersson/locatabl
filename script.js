//android-studio-ide-191.6010548-linux.tar.gz


http = require("http");
https = require('https');
url = require("url");
path = require("path");
fs = require("fs");
fsPromises = require("fs/promises");
mysql =  require('mysql');
gm =  require('gm').subClass({ imageMagick: true });
concat = require('concat-stream');
//requestMod = require('request');
fetch = require('node-fetch');
//through = require('through')
querystring = require('querystring');
//async = require('async');
formidable = require("formidable");
NodeRSA = require('node-rsa');
crypto = require('crypto');
tls=require('tls');
//atob = require('atob');
//childProcess = require('child_process');
zlib = require('zlib');
NodeZip=require('node-zip');
//redis = require("then-redis");
redis = require("redis");
UglifyJS = require("uglify-js");
//sendgrid  = require('sendgrid');
sgMail = require('@sendgrid/mail');
ip = require('ip');
Streamify = require('streamify-string');
validator = require('validator');
serialize = require('serialize-javascript');
webPush = require('web-push');
moment = require('moment');
mime = require("mime");
var argv = require('minimist')(process.argv.slice(2));
app=global;


require('./libMath.js');
require('./lib.js');
require('./libServerGeneral.js');
require('./libMysql.js');
require('./libServer.js');
require('./lib/foundOnTheInternet/sha1.js');



strAppName='tracker';

strInfrastructure=process.env.strInfrastructure||'local';
boHeroku=strInfrastructure=='heroku'; 
boAF=strInfrastructure=='af'; 
boLocal=strInfrastructure=='local'; 
boDO=strInfrastructure=='do'; 


StrValidSqlCalls=['createTable', 'dropTable', 'createFunction', 'dropFunction', 'populateSetting', 'truncate', 'createDummies']; // , 'createDummy'
  
helpTextExit=function(){
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
if(StrUnknown.length){ console.log('Unknown arguments: '+StrUnknown.join(', ')); helpTextExit(); return;}

    // Set up redisClient
var urlRedis;
if(  (urlRedis=process.env.REDISTOGO_URL)  || (urlRedis=process.env.REDISCLOUD_URL)  ) {
  var objRedisUrl=url.parse(urlRedis),    password=objRedisUrl.auth.split(":")[1];
  var objConnect={host: objRedisUrl.hostname, port: objRedisUrl.port,  password: password};
  //redisClient=redis.createClient(objConnect); // , {no_ready_check: true}
  redisClient=redis.createClient(urlRedis, {no_ready_check: true}); //
}else {
  //var objConnect={host: 'localhost', port: 6379,  password: 'password'};
  redisClient=redis.createClient();
}


  // WebPush subscription (for testing)
var globSubscription=null;

//strCookieProp="; SameSite=Lax; HttpOnly";


(async function(){
  
    // Default config variables (If you want to change them I suggest you create a file config.js and overwrite them there)
  UriDB={};
  boDbg=0; port=5000; levelMaintenance=0; googleSiteVerification='googleXXX.html';
  wwwCommon='';
  boShowTeam=false;
  intDDOSMax=100; timeOutDDOSBan=5; 
  maxUnactivity=3600*24;  // Used on _Main, CSRFCode, _UserInfoFrDB
  maxLoginUnactivity=10*60;  // Used on _LoginIdP, _LoginIdUser
  leafLoginBack="loginBack.html"; 
  boVideo=0;
  boUseSSLViaNodeJS=false;
  wsIconDefaultProt="/Site/Icon/icon<size>.png";
  boGoogleReview=false;
  
  port=argv.p||argv.port||5000;
  if(argv.h || argv.help) {helpTextExit(); return;}


  var strConfig;
  if(boHeroku){ 
    if(!process.env.jsConfig) { console.error('jsConfig-environment-variable is not set'); return;} //process.exit(1);
    strConfig=process.env.jsConfig||'';
  }
  else{
    var [err, buf]=await fsPromises.readFile('./config.js').toNBP();    if(err) {console.error(err); return;}
    strConfig=buf.toString();
  } 
  var strMd5Config=md5(strConfig);
  eval(strConfig);
  if(typeof strSalt=='undefined') {console.error("typeof strSalt=='undefined'"); return; }
  
  var redisVar='str'+ucfirst(strAppName)+'Md5Config';
  var [err,tmp]=await getRedis(redisVar); if(err) {console.error(err); return;   }
  var boNewConfig=strMd5Config!==tmp; 
  if(boNewConfig) { var tmp=await setRedis(redisVar, strMd5Config);  }
  
  //var redisVar='str'+ucfirst(strAppName)+'Md5Config';
  //var [err,tmp]=await cmdRedis('GET', [redisVar]);
  //var boNewConfig=strMd5Config!==tmp; 
  //if(boNewConfig) { var [err,tmp]=await cmdRedis('SET',[redisVar,strMd5Config]);  }
  

  if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;
  SiteName=Object.keys(Site);



    // Set up mail
  sgMail.setApiKey(apiKeySendGrid);
  //objSendgrid  = sendgrid(sendgridName, sendgridPassword);
  
  
    // Set up webPush
  webPush.setVapidDetails('https://closeby.market', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  require('./filterServer.js'); 
  require('./variablesCommon.js');
  require('./libReqBE.js');
  require('./libReq.js'); 


  DBExtend(DB={});


  //createPlugins();
  SiteExtend();

    // Do db-query if --sql XXXX was set in the argument
  if(typeof argv.sql!='undefined'){
    if(typeof argv.sql!='string') {console.log('sql argument is not a string'); process.exit(-1); return; }
    var tTmp=new Date().getTime();
    var setupSql=new SetupSql();
    setupSql.myMySql=new MyMySql(DB.default.pool);
    var [err]=await setupSql.doQuery(argv.sql);
    setupSql.myMySql.fin();
    if(err) { 
      if(err.strLab=='erraticInput') {console.log(err.message); process.exit(-1); return;}
      else {  console.error(err);  return;}
    }
    console.log('Time elapsed: '+(new Date().getTime()-tTmp)/1000+' s'); 
    process.exit(0);
  }

  CacheUri=new CacheUriT();
  StrFilePreCache=['filter.js', 'lib.js', 'libClient.js', 'lang/en.js', 'clientKeyRemoteControlSave.js', 'stylesheets/style.css', 'serviceworker.js', 'lib/foundOnTheInternet/sha1.js']; //, 'clientMergeID.js'
  splitterPlugIn=new SplitterPlugIn();
  for(var i=0;i<StrFilePreCache.length;i++) {
    var [err]=await readFileToCache(StrFilePreCache[i]); if(err) {  console.error(err);  return;}
  }
  var [err]=await splitterPlugIn.readFileToCacheClientJs(); if(err) console.error(err);
  await createSiteSpecificClientJSAll();


    // Write manifest to Cache
  var [err]=await createManifestNStoreToCacheMult(SiteName); if(err) {  console.error(err.message);  return;}


  if(boDbg){
    fs.watchFile('client.js',async function () {
      console.log('client.js changed: ');
      var [err]=await splitterPlugIn.readFileToCacheClientJs(); if(err) console.error(err);
      
    });
    fs.watch('.', makeWatchCB('.', ['filter.js', 'clientKeyRemoteControlSave.js', 'libClient.js', 'lib.js', 'serviceworker.js']) );
    fs.watch('stylesheets', makeWatchCB('stylesheets', ['style.css']) );
    fs.watch('lang', makeWatchCB('lang', ['en.js', 'sv.js']) );
  }


  tIndexMod=new Date(); tIndexMod.setMilliseconds(0);

  ETagImage={};

  regexpLib=RegExp('^/(stylesheets|lib|pluginLib|Site|lang)/');
  regexpLooseJS=RegExp('^/(lib|libClient|client|clientProt|clientKeyRemoteControlSave|filter|siteSpecific|serviceworker)\\.js'); //|clientMergeID
  regexpPlugin=RegExp('^/plugin(\\w+)\\.js');

  regexpHerokuDomain=RegExp("\\.herokuapp\\.com$");
  regexpAFDomain=RegExp("\\.af\\.cm$");  

  if(boHeroku || boAF){
    var regInfra=boHeroku?regexpHerokuDomain:regexpAFDomain;
    RegRedir.push(function(req){
      var Str=regInfra.exec(req.headers.host); 
      if(Str && req.headers['x-forwarded-proto']!='https') {    return 'https://'+req.headers.host+'/'+req.url;   }
      return null;
    });
  }

  var StrCookiePropProt=["HttpOnly", "Path=/", "Max-Age="+3600*24*30];
  //if(boDO) { StrCookiePropProt.push("Secure"); }
  if(!boLocal || boUseSSLViaNodeJS) StrCookiePropProt.push("Secure");
  //app.strCookiePropEmpty=";"+StrCookiePropProt.concat("").join(';');
  //app.strCookiePropNormal=";"+StrCookiePropProt.concat("SameSite=None").join(';');
  app.strCookiePropNormal=";"+StrCookiePropProt.concat("").join(';');
  app.strCookiePropLax=";"+StrCookiePropProt.concat("SameSite=Lax").join(';');
  app.strCookiePropStrict=";"+StrCookiePropProt.concat("SameSite=Strict").join(';');    

  const handler=async function(req, res){
  
    if(typeof isRedirAppropriate!='undefined'){ 
      var tmpUrl=isRedirAppropriate(req); if(tmpUrl) { res.out301(tmpUrl); return; }
    }
    var boTLS=false;
    if(boHeroku || boAF) boTLS=req.headers['x-forwarded-proto']=='https';
    else if(boLocal) boTLS=Boolean('encrypted' in req.connection); 
    else if(boDO) { boTLS=true; }


      //res.setHeader("X-Frame-Options", "deny");  // Deny for all (note: this header is removed for images (see reqMediaImage) (should also be removed for videos))
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");  // Deny for all (note: this header is removed in certain requests)
    res.setHeader("X-Content-Type-Options", "nosniff");  // Don't try to guess the mime-type (I prefer the rendering of the page to fail if the mime-type is wrong)
    if(!boLocal || boUseSSLViaNodeJS) res.setHeader("Strict-Transport-Security", "max-age="+3600*24*365); // All future requests must be with https (forget this after a year)
    res.setHeader("Referrer-Policy", "origin");  //  Don't write the refer unless the request comes from the origin
    


    var domainName=req.headers.host; 
    var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=querystring.parse(qs),  pathNameOrg=objUrl.pathname;
    var wwwReq=domainName+pathNameOrg;
    var {siteName,wwwSite}=Site.getSite(wwwReq);  
    if(!siteName){ res.out404("404 Nothing at that url\n"); return; }
    var pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';
    var site=Site[siteName];

    if(boDbg) {console.log(pathName);}
    
    
    var cookies =req.cookies= parseCookies(req);
    //var StrCookieKeys=Object.keys(cookies);
    //if(req.url=='/') console.log('\nReferer: '+req.headers.referer);
    //console.log(req.headers.host+' '+req.url+' '+ JSON.stringify(StrCookieKeys));



    var boCookieDDOSOK=false; //req.boCookieLaxOK=req.boCookieStrictOK=
    
      // Check if a valid sessionIDDDos-cookie came in
    var sessionIDDDos=null, redisVarDDos;
    if('sessionIDDDos' in cookies) {
      sessionIDDDos=cookies.sessionIDDDos;  redisVarDDos=sessionIDDDos+'_DDOS';
      var [err, tmp]=await cmdRedis('EXISTS', redisVarDDos); boCookieDDOSOK=tmp;
    }
      // If non-valid sessionIDDDos, then create a new one.
    if(!boCookieDDOSOK) { sessionIDDDos=randomHash();  redisVarDDos=sessionIDDDos+'_DDOS'; }
    
      // Increase redisVarDDos 
    var luaCountFunc=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
    var [err, intCount]=await cmdRedis('EVAL',[luaCountFunc, 1, redisVarDDos, timeOutDDOSBan]);
    
      // Increase redisVarDDosIP.
    var ipClient=getIP(req), redisVarDDosIP=ipClient+'_DDOS';
    var luaCountFunc=`local c=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1], ARGV[1]); return c`;
    var [err, intCountIP]=await cmdRedis('EVAL',[luaCountFunc, 1, redisVarDDosIP, timeOutDDOSIPBan]);
      
    res.setHeader("Set-Cookie", "sessionIDDDos="+sessionIDDDos+strCookiePropNormal);
    
      // If to many, then ban
    if(boCookieDDOSOK) {  var intCountT=intCount, intDDOSMaxT=intDDOSMax, timeOutDDOSBanT=timeOutDDOSBan;   }   else   {    intCountT=intCountIP; intDDOSMaxT=intDDOSIPMax; timeOutDDOSBanT=timeOutDDOSIPBan;   }
    if(intCountT>intDDOSMaxT) {
      var strMess="Too Many Requests ("+intCountT+"), wait "+timeOutDDOSBanT+"s\n";
      if(pathName=='/'+leafBE){ var reqBE=new ReqBE({req, res}); reqBE.mesEO(strMess,429); }
      else res.outCode(429,strMess);
      return;
    }
    
    req.boCookieOK=false;
      // Check if a valid sessionID-cookie came in
    var boSessionCookieInInput='sessionID' in cookies, sessionID=null, redisVarSessionMain;
    if(boSessionCookieInInput) {
      sessionID=cookies.sessionID;  redisVarSessionMain=sessionID+'_Main';
      var [err, tmp]=await cmdRedis('EXISTS', redisVarSessionMain); req.boCookieOK=tmp;
    } 
    
    if(!req.boCookieOK){ sessionID=randomHash();  redisVarSessionMain=sessionID+'_Main'; }
    
    
    res.setHeader("Set-Cookie", ["sessionID="+sessionID+strCookiePropLax]);
    

        //Refresh / create  redisVarSessionMain
    if(req.boCookieOK){
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

    if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;}
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
    else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || regexpPlugin.test(pathName) || pathName=='/conversion.html' || pathName=='/'+leafManifest){
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
      const payload = null;
      const options = {
        TTL: req.body.ttl
      };

      setTimeout(function() {
        webPush.sendNotification(subscription, payload, options)
        .then(function() {
          res.outCode(201);
        })
        .catch(function(error) {
          res.outCode(500);
          console.log(error);
        });
      }, req.body.delay * 1000);
    }
    else if(pathName=='/ttt'){ 
      res.end('ttt');
    }
    else {res.out404("404 Not Found\n"); return; }
    objReqRes.myMySql.fin();
    
    
  
  
  }

  if(boUseSSLViaNodeJS){
    var strName='192.168.0.3';
    //var strName='r50.local';
    //var strName='localhost';
    //const options = { key: fs.readFileSync('0SSLCert/server.key'), cert: fs.readFileSync('0SSLCert/server.cert') };
    const options = { key: fs.readFileSync('0SSLCert/'+strName+'.key'), cert: fs.readFileSync('0SSLCert/'+strName+'.crt') };
    https.createServer(options, handler).listen(port);   console.log("Listening to HTTPS requests at port " + port);
  } else{
    http.createServer(handler).listen(port);   console.log("Listening to HTTP requests at port " + port);
  }
})();

