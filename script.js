
http = require("http");
https = require('https');
url = require("url");
path = require("path");
fs = require("fs");
mysql =  require('mysql');
gm =  require('gm').subClass({ imageMagick: true });
util =  require('util');
concat = require('concat-stream');
requestMod = require('request');
through = require('through')
querystring = require('querystring');
async = require('async');
formidable = require("formidable");
NodeRSA = require('node-rsa');
crypto = require('crypto');
tls=require('tls');
atob = require('atob');
childProcess = require('child_process');
zlib = require('zlib');
NodeZip=require('node-zip');
//redis = require("then-redis");
redis = require("redis");
UglifyJS = require("uglify-js");
require('./lib.js');
require('./libServerGeneral.js');
require('./libServer.js');
//require('./store.js');

strAppName='tracker';
app=(typeof window==='undefined')?global:window;
extend=util._extend;

strInfrastructure=process.env.strInfrastructure||'local';
boHeroku=strInfrastructure=='heroku'; 
boAF=strInfrastructure=='af'; 
boLocal=strInfrastructure=='local'; 
boDO=strInfrastructure=='do'; 


interpretArgv=function(){
  var myArg=process.argv.slice(2);
  for(var i=0;i<myArg.length;i++){
    var Match=RegExp("^(-{1,2})([^-\\s]+)$").exec(myArg[i]);
    if(Match[1]=='-') {
      var tmp=Match[2][0];
      if(tmp=='p') port=Match[2].substr(1);
      else if(tmp=='h') helpTextExit();
    }else if(Match[1]=='--') {
      var tmp=Match[2], tmpSql='sql';
      if(tmp.slice(0,tmpSql.length)==tmpSql) strCreateSql=Match[2].substr(tmpSql.length).toLowerCase();
      else if(tmp=='help') helpTextExit();
      else if(tmp=='boVideo') boVideo=1;
    }
  }
}

helpTextExit=function(){
  var arr=[];
  arr.push('USAGE script [OPTION]...');
  arr.push('\t-h, --help\t\tDisplay this text');
  arr.push('\t-p[PORT]\t\tPort number (default: 5000)');
  arr.push('\t--sql[SQL_ACTION]\tRun a sql action:');
  var StrValid=['table', 'dropTable', 'fun', 'dropFun', 'truncate', 'dummy', 'dummies'];
  arr.push('\t\tSQL_ACTION='+StrValid.join('|'));
  console.log(arr.join('\n'));
  process.exit(0);
}
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



var flow=( function*(){

    // Default config variables
  UriDB={};
  boDbg=0; boAllowSql=1; port=5000; levelMaintenance=0; googleSiteVerification='googleXXX.html';
  wwwCommon='';
  domainPayPal='www.paypal.com';
  urlPayPal='https://www.paypal.com/cgi-bin/webscr';
  payLev=0; boShowTeam=false; boTerminationCheck=1;
  intDDOSMax=100; tDDOSBan=5; 
  maxUnactivity=3600*24;
  leafLoginBack="loginBack.html"; 
  boVideo=0;
  interpretArgv();


  var strConfig;
  if(boHeroku){ 
    if(!process.env.jsConfig) { console.log('jsConfig-environment-variable is not set'); process.exit(1);}
    strConfig=process.env.jsConfig||'';
  }
  else{
    fs.readFile('./config.js', function(errT, bufT) { //, this.encRead
      if(errT){  console.log(errT); }
      strConfig=bufT.toString();
      flow.next();
    });
    yield;
    //require('./config.js');    //require('./config.example.js');
  } 
  var strMd5Config=md5(strConfig);
  eval(strConfig);
  var redisVar='str'+ucfirst(strAppName)+'Md5Config';
  var tmp=yield *wrapRedisSendCommand(flow, 'get',[redisVar]);
  var boNewConfig=strMd5Config!==tmp; 
  if(boNewConfig) { var tmp=yield *wrapRedisSendCommand(flow, 'set',[redisVar,strMd5Config]);  }

  if('levelMaintenance' in process.env) levelMaintenance=process.env.levelMaintenance;
  SiteName=Object.keys(Site);


  require('./filterServer.js'); 
  require('./variablesCommon.js');
  require('./libReqBE.js');
  require('./libReq.js'); 

  reqOffer=new ReqOffer(); yield *reqOffer.filesToRam(flow);

  DBExtend(DB={});


  createPlugins();
  SiteExtend();


    // Do db-query if --sqlXXXX was set in the argument
  if(typeof strCreateSql!='undefined'){
    var tTmp=new Date().getTime();
    var objSetupSql=new SetupSql(); yield *objSetupSql.doQuery(flow, strCreateSql);
    console.log('Time elapsed: '+(new Date().getTime()-tTmp)/1000+' s'); 
    process.exit(0);
  }


  StrFilePreCache=['filter.js', 'lib.js', 'libClient.js', 'client.js', 'lang/en.js', 'clientPubKeyStore.js', 'stylesheets/style.css']; //, 'clientMergeID.js'
  //'Site/'+siteName+'/'+siteName+'200.png', wwwIcon16, wwwIcon114
  if(boDbg){
    fs.watch('.',function (ev,filename) {
      var StrFile=['filter.js','client.js', 'clientPubKeyStore.js'];  //, 'clientMergeID.js'
        //console.log(filename+' changed: '+ev);
      if(StrFile.indexOf(filename)!=-1){
        console.log(filename+' changed: '+ev);
        var flowWatch=( function*(){ 
          var err=yield* readFileToCache(flowWatch, filename); if(err) console.log(err.message);
        })(); flowWatch.next();
      }
    });
    fs.watch('stylesheets',function (ev,filename) {
      var StrFile=['style.css'];
        //console.log(filename+' changed: '+ev);
      if(StrFile.indexOf(filename)!=-1){
        console.log(filename+' changed: '+ev);
        var flowWatch=( function*(){ 
          var err=yield* readFileToCache(flowWatch, 'stylesheets/'+filename); if(err) console.log(err.message);
        })(); flowWatch.next();
      }
    });
  }


  splitterPlugIn=new SplitterPlugIn();
  CacheUri=new CacheUriT();
  for(var i=0;i<StrFilePreCache.length;i++) {
    var filename=StrFilePreCache[i];
    var err=yield *readFileToCache(flow, filename); if(err) {  console.log(err.message);  return;}
  }
  yield *createSiteSpecificClientJSAll(flow);
  

  bootTime=new Date();  strBootTime=bootTime.toISOStringMy();

  ETagImage={};

  regexpLib=RegExp('^/(stylesheets|lib|pluginLib|Site|lang)/');
  regexpLooseJS=RegExp('^/(lib|libClient|client|clientProt|clientPubKeyStore|filter|siteSpecific)\\.js'); //|clientMergeID
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

  handler=function(req, res){
    req.flow=(function*(){
    
      if(typeof isRedirAppropriate!='undefined'){ 
        var tmpUrl=isRedirAppropriate(req); if(tmpUrl) { res.out301(tmpUrl); return; }
      }
      var boTLS=false;
      if(boHeroku || boAF) boTLS=req.headers['x-forwarded-proto']=='https';
      else if(boLocal) boTLS=Boolean('encrypted' in req.connection); 
      else if(boDO) { boTLS=true; }


      var cookies = parseCookies(req);
      var sessionID;  if('sessionID' in cookies) sessionID=cookies.sessionID; else { sessionID=randomHash();   res.setHeader("Set-Cookie", "sessionID="+sessionID+"; SameSite=Lax"); }  //+ " HttpOnly" 

      
      var ipClient=getIP(req);
      var redisVarSession=sessionID+'_Main';
      var redisVarCounter=sessionID+'_Counter', redisVarCounterIP=ipClient+'_Counter'; 
      
        // get intCount
      var semY=0, semCB=0, err, intCount;
      var tmp=redisClient.send_command('eval',[luaCountFunc, 3, redisVarSession, redisVarCounter, redisVarCounterIP, tDDOSBan], function(errT,intCountT){
        err=errT; intCount=intCountT; if(semY) { req.flow.next(); } semCB=1;
      });
      if(!semCB) { semY=1; yield;}
      if(err) {console.log(err); return;}
      if(intCount>intDDOSMax) {res.outCode(429,"Too Many Requests, wait "+tDDOSBan+"s\n"); return; }


      var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=querystring.parse(qs),  pathNameOrg=objUrl.pathname;
      var wwwReq=req.headers.host+pathNameOrg;
      var {siteName,wwwSite}=Site.getSite(wwwReq);  
      if(!siteName){ res.out404("404 Nothing at that url\n"); return; }
      var pathName=wwwReq.substr(wwwSite.length); if(pathName.length==0) pathName='/';
      var site=Site[siteName];

      if(boDbg) console.log(pathName);



      var strScheme='http'+(boTLS?'s':''),   strSchemeLong=strScheme+'://';
      var uDomain=strSchemeLong+req.headers.host;
      var uSite=strSchemeLong+wwwSite;
      req.site=site;  req.sessionID=sessionID; req.qs=qs; req.objQS=objQS;  req.boTLS=boTLS;  req.strSchemeLong=strSchemeLong;  req.wwwSite=wwwSite;  req.uSite=uSite;  req.pathName=pathName;   req.siteName=siteName;
      req.uDomain=uDomain;
      req.rootDomain=RootDomain[site.strRootDomain];
      //req.app_id=req.rootDomain.fb.app_id;   req.app_secret=req.rootDomain.fb.app_secret;


      var objReqRes={req:req, res:res};
      if(pathName.substr(0,5)=='/sql/'){
        if(!boDbg && !boAllowSql){ res.out200('Set boAllowSql=1 (or boDbg=1) in the config.js-file');  return }
        var reqSql=new ReqSql(req, res),  objSetupSql=new SetupSql();
        req.pathNameWOPrefix=pathName.substr(5);
        if(req.pathNameWOPrefix=='zip'){       reqSql.createZip(objSetupSql);     }
        else {  reqSql.toBrowser(objSetupSql); }
      }
      else {
        if(levelMaintenance){res.outCode(503, "Down for maintenance, try again in a little while."); return;}
        if(pathName=='/'){
          if("pubKey" in objQS && "data" in objQS) {      yield* reqCurlEnd.call(objReqRes);     }
          else if("pubKey" in objQS){      yield* reqPubKeyStore.call(objReqRes);    }
          else{      yield* reqIndex.call(objReqRes);      }
        }
        //else if(pathName=='/'+leafAssign){    var reqAssign=new ReqAssign(req, res);    reqAssign.go();    }
        else if(pathName.indexOf('/image/')==0){      yield* reqImage.call(objReqRes);   } //RegExp('^/image/').test(pathName)
        else if(pathName=='/'+leafBE){        var reqBE=new ReqBE(req, res);  yield* reqBE.go();    }
        else if(regexpLib.test(pathName) || regexpLooseJS.test(pathName) || regexpPlugin.test(pathName) || pathName=='/conversion.html'){   yield* reqStatic.call(objReqRes);  }
        else if(pathName=='/'+leafLoginBack){   yield* reqLoginBack.call(objReqRes);   }
        else if(pathName=='/monitor.html'){     yield* reqMonitor.call(objReqRes);     }
        else if(pathName=='/stat.html'){        yield* reqStat.call(objReqRes);        }
        else if(pathName=='/offer.html'){  reqOffer.outputData(req,res);    }
        //else if(pathName=='/mergeID'){  var reqMergeID=new ReqMergeID(req, res);      reqMergeID.go();      }
        else if(pathName=='/createDumpCommand'){  var str=createDumpCommand(); res.out200(str);     }
        else if(pathName=='/debug'){    debugger  }
        else if(pathName=='/'+googleSiteVerification) res.end('google-site-verification: '+googleSiteVerification);
        else {res.out404("404 Not Found\n"); return; }
      }
      
    
    })(); req.flow.next();
  }

  /*
  if(boLocal){
    if(typeof TLSData!='undefined' && TLSData instanceof Array && TLSData.length){
      TLSDataExtend.call(TLSData);
      var options = {
        SNICallback: function(domain, cb) {
          console.log('SNI '+domain); 
          //return TLSData.getContext(domain);
          cb(null, TLSData.getContext(domain));
        },
        key: TLSData[0].strKey,
        cert: TLSData[0].strCert  
      }; 
      https.createServer(options, handler).listen(portS);   console.log("Listening to HTTPS requests at port " + portS);
    }
  }
  */
  http.createServer(handler).listen(port);   console.log("Listening to HTTP requests at port " + port);

})(); flow.next();

