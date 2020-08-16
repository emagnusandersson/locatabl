


http = require("http");
url = require("url");
path = require("path");
fs = require("fs");
crypto = require('crypto');
mysql =  require('mysql');
gm =  require('gm').subClass({ imageMagick: true });
concat = require('concat-stream');
requestMod = require('request');
querystring = require('querystring');
redis = require("redis");
UglifyJS = require("uglify-js");
sgMail = require('@sendgrid/mail');
ip = require('ip');



boDbg=1;
require('./lib.js');
require('./libServerGeneral.js');
require('./libServer.js');
require('./libMysql.js');
require('./testLib.js');

app=(typeof window==='undefined')?global:window;

vPassword=aPassword='123'; strSalt='abc'
require('./filterServer.js'); 
require('./variablesCommon.js');
require('./libReqBE.js');
require('./libReq.js'); 

boDbg=0; port=5000

UriDB={default:'mysql://root:jh10k@localhost/mmm'};
var www192=ip.address(), www192WPort=www192+':'+port
Site={
    transport:{wwwSite:www192WPort+'/transport', strRootDomain:"192Loc", googleAnalyticsTrackingID:"", db:"default"}
  }

DBExtend(DB={});


// node --inspect --debug-brk testNeo4j.js --gengetInfoNDataNeo
// node --inspect --debug-brk testNeo4j.js --gensaveByReplaceNeo --dataabc,link:starta,link:startd
// node --inspect --debug-brk testNeo4j.js --gensaveByAddNeo  --pagestart --dataabclink:template:ttt,link:starta,mm,link:template:tttt,
// node --inspect --debug-brk testNeo4j.js --gensaveByAddNeo  --pagestart --dataabclink:template:tt,link:template:ttt,link:starta,mm,link:template:tttt,
// node --inspect --debug-brk testNeo4j.js --gensaveByAddNeo  --pagetemplate:tt --dataabc
// node --inspect --debug-brk testNeo4j.js --gensaveByAddNeo  --pagetemplate:ttt --dataabc
// node --inspect --debug-brk testNeo4jBEReq.js --pageLoad  

var myArg=process.argv.slice(2);
for(var i=0;i<myArg.length;i++){
  var Match=RegExp("^(-{1,2})([^-\\s]+)$").exec(myArg[i]);
  if(Match[1]=='-') {
    var tmp=Match[2][0];
    if(tmp=='p') port=Match[2].substr(1);
    else if(tmp=='h') helpTextExit();
  }else if(Match[1]=='--') {
    var tmpArg=Match[2]; 
    var MatchA=/^gen(.*)/.exec(tmpArg);  if(MatchA) strGenerator=MatchA[1];
    var MatchA=/^www(.*)/.exec(tmpArg);  if(MatchA) www=MatchA[1];
    
    else if(tmp=='help') helpTextExit();
  }
}

if(typeof strGenerator=='undefined') strGenerator='littleTester';
if(typeof www=='undefined') www='localhost:5000';
boTLS=false;


console.log(strGenerator);

headers={'if-none-match':'', "if-modified-since":0};
req={method:'GET', boTLS, www, headers, site:Site.transport};  //, objUrl, strSchemeLong, pathName

tmpf=function(){};
//thisObj={req, res, GRet:{}, mesEO:tmpf, tModBrowser:(new Date()).toUnix(), Str:[]};

objArg={boTLS, www, requesterCacheTime:0}



generatorWrap=function*(){
  
  
  req=extend(req, {flow, sessionID:0});
  var reqBE=new ReqBE(req, res); extend(reqBE,{GRet:{}, mes:tmpf, mesO:tmpf, mesEO:tmpf, tModBrowser:(new Date()).toUnix()})
  if(strGenerator=='littleTester'){
    var objT=yield* reqBE[strGenerator](objArg); 
  }else if(strGenerator=='saveByReplace'){
    var objT=yield* reqBE[strGenerator](objArg); 
  }else if(strGenerator=='saveByAdd'){
    var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='pageCompare'){
    objArg.arrVersionCompared=[1,2];  var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPreview'){
    var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPageInfo'){
    extend(objArg,{strKeyDefault:'a45d', objName:{'a45d':['start','starta','startb'],'abc':['start','starta','startb']}});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getImageInfo'){
    //extend(objArg,{arrName:['oak.jpg','maple.jpg']});
       var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='myChMod'){
    extend(objArg,{File:['Z91YJJD0bSx9r0QA','So9yR8W2iy2hHgAO'], boOR:1});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='myChModImage'){
    extend(objArg,{File:['94b3aced1f20f4408a902e12','366ed9f3a6028ba39190e452'], boOther:1});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='deletePage'){
    extend(objArg,{File:['Z91YJJD0bSx9r0QA','So9yR8W2iy2hHgAO']});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='deleteImage'){
    extend(objArg,{File:['94b3aced1f20f4408a902e12','366ed9f3a6028ba39190e452']});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='renamePage'){
    extend(objArg,{id:'Z91YJJD0bSx9r0QA', strNewName:'Oak'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='renameImage'){
    extend(objArg,{id:'94b3aced1f20f4408a902e12', strNewName:'Oak'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getParent'){
    extend(objArg,{idPage:'Z91YJJD0bSx9r0QA'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getParentOfImage'){
    extend(objArg,{idImage:'94b3aced1f20f4408a902e12'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getSingleParentExtraStuff'){
    extend(objArg,{idPage:'GO8jGCUSYLMUJ88Y'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabGet'){
    extend(objArg,{});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabSet'){
    var tmp='SqrhrW5'; extend(objArg,{idSite:tmp, siteName:tmp, boUpd:true, googleAnalyticsTrackingID:'gogo', urlIcon16:'', urlIcon200:''});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabDelete'){
    extend(objArg,{siteName:'SqrhrW5'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabSetDefault'){
    extend(objArg,{idSite:'SqrhrW5'});   var objT=yield* reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPageList'){
    var arg={"Filt":[[['GO8jGCUSYLMUJ88Y'],1], [[],0], [0,8], [[],0], [[],0], [[],0], [[],0], [[],0], [[],0], [0,12], [0,12]]};
    extend(objArg,arg);   var objT=yield* reqBE['setUpPageListCond'](objArg);
    extend(objArg,arg);   var objT=yield* reqBE[strGenerator]({});
  }else if(strGenerator=='getImageList'){
    var arg={"Filt":[[[],0],[['So9yR8W2iy2hHgAO'],1],[0,11],[0,12],[[],0]]};
    extend(objArg,arg);   var objT=yield* reqBE['setUpImageListCond'](objArg);
    extend(objArg,arg);   var objT=yield* reqBE[strGenerator]({});
  }else if(strGenerator=='getPageHist'){
    var arg={"Filt":[[['GO8jGCUSYLMUJ88Y'],1], [[],0], [0,8], [[],0], [[],0], [[],0], [[],0], [[],0], [[],0], [0,12], [0,12]]};
    extend(objArg,arg);   var objT=yield* reqBE['setUpPageListCond'](objArg);
    extend(objArg,arg);   var objT=yield* reqBE[strGenerator]({});
  }else if(strGenerator=='getImageHist'){
    var arg={"Filt":[[[],0],[['So9yR8W2iy2hHgAO'],1],[0,11],[0,12],[[],0]]};
    extend(objArg,arg);   var objT=yield* reqBE['setUpImageListCond'](objArg);
    extend(objArg,arg);   var objT=yield* reqBE[strGenerator]({});
  }else if(strGenerator=='uploadAdminFS'){
    var arg={};
    extend(objArg,arg);   var objT=yield* reqBE[strGenerator]({});
  }else{console.log('no such generator');}
  
  console.log(objT);
}
flow=generatorWrap(); flow.next();
//flow=app[strGenerator](objArg); flow.flow=flow; flow.next();
