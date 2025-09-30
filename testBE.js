


globalThis.app=globalThis;

import http from "http";
//import url from "url";
import path from "path";
import fs, {promises as fsPromises} from "fs";
import mysql from 'mysql';
import concat from 'concat-stream';
import redis from "redis";
import UglifyJS from "uglify-js";
import sgMail from '@sendgrid/mail';
import ip from 'ip';
import gmTmp from 'gm';
app.gm=gmTmp.subClass({ imageMagick: true });
var argv = minimist(process.argv.slice(2));

app.extend=Object.assign;


var boDbg=1;
await import('./lib.js');
await import('./libServerGeneral.js');
await import('./libServer.js');
await import('./libMysql.js');
await import('./testLib.js');


var vPassword=aPassword='123'; strSalt='abc'
await import('./filterServer.js'); 
await import('./variablesCommon.js');
await import('./libReqBE.js');
await import('./libReq.js'); 

await import('./config.js')

var port=5000

var www192=ip.address(), www192WPort=www192+':'+port
app.Site={
  transport:{wwwSite:www192WPort+'/transport', strRootDomain:"192Loc", googleAnalyticsTrackingID:"", db:"default"}
}
app.DB={}
DBExtend(DB);


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
var boTLS=false;


console.log(strGenerator);

var headers={'if-none-match':'', "if-modified-since":0};
var req={method:'GET', boTLS, www, headers, site:Site.transport};  //, objUrl, strSchemeLong, pathName

var tmpf=function(){};
//thisObj={req, res, GRet:{}, mesEO:tmpf, tModBrowser:(new Date()).toUnix(), Str:[]};

var objArg={boTLS, www, requesterCacheTime:0}



(async function(){
  
  
  req=extend(req, {sessionID:0});
  var reqBE=new ReqBE(req, res); extend(reqBE,{GRet:{}, mes:tmpf, mesO:tmpf, mesEO:tmpf, tModBrowser:(new Date()).toUnix()})
  if(strGenerator=='littleTester'){
    var objT=await reqBE[strGenerator](objArg); 
  }else if(strGenerator=='saveByReplace'){
    var objT=await reqBE[strGenerator](objArg); 
  }else if(strGenerator=='saveByAdd'){
    var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='pageCompare'){
    objArg.arrVersionCompared=[1,2];  var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPreview'){
    var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPageInfo'){
    extend(objArg,{strKeyDefault:'a45d', objName:{'a45d':['start','starta','startb'],'abc':['start','starta','startb']}});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getImageInfo'){
    //extend(objArg,{arrName:['oak.jpg','maple.jpg']});
       var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='myChMod'){
    extend(objArg,{File:['Z91YJJD0bSx9r0QA','So9yR8W2iy2hHgAO'], boOR:1});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='myChModImage'){
    extend(objArg,{File:['94b3aced1f20f4408a902e12','366ed9f3a6028ba39190e452'], boOther:1});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='deletePage'){
    extend(objArg,{File:['Z91YJJD0bSx9r0QA','So9yR8W2iy2hHgAO']});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='deleteImage'){
    extend(objArg,{File:['94b3aced1f20f4408a902e12','366ed9f3a6028ba39190e452']});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='renamePage'){
    extend(objArg,{id:'Z91YJJD0bSx9r0QA', strNewName:'Oak'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='renameImage'){
    extend(objArg,{id:'94b3aced1f20f4408a902e12', strNewName:'Oak'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getParent'){
    extend(objArg,{idPage:'Z91YJJD0bSx9r0QA'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getParentOfImage'){
    extend(objArg,{idImage:'94b3aced1f20f4408a902e12'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getSingleParentExtraStuff'){
    extend(objArg,{idPage:'GO8jGCUSYLMUJ88Y'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabGet'){
    extend(objArg,{});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabSet'){
    var tmp='SqrhrW5'; extend(objArg,{idSite:tmp, siteName:tmp, boUpd:true, googleAnalyticsTrackingID:'gogo', urlIcon16:'', urlIcon200:''});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabDelete'){
    extend(objArg,{siteName:'SqrhrW5'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='siteTabSetDefault'){
    extend(objArg,{idSite:'SqrhrW5'});   var objT=await reqBE[strGenerator](objArg);
  }else if(strGenerator=='getPageList'){
    var arg={"Filt":[[['GO8jGCUSYLMUJ88Y'],1], [[],0], [0,8], [[],0], [[],0], [[],0], [[],0], [[],0], [[],0], [0,12], [0,12]]};
    extend(objArg,arg);   var objT=await reqBE['setUpPageListCond'](objArg);
    extend(objArg,arg);   var objT=await reqBE[strGenerator]({});
  }else if(strGenerator=='getImageList'){
    var arg={"Filt":[[[],0],[['So9yR8W2iy2hHgAO'],1],[0,11],[0,12],[[],0]]};
    extend(objArg,arg);   var objT=await reqBE['setUpImageListCond'](objArg);
    extend(objArg,arg);   var objT=await reqBE[strGenerator]({});
  }else if(strGenerator=='getPageHist'){
    var arg={"Filt":[[['GO8jGCUSYLMUJ88Y'],1], [[],0], [0,8], [[],0], [[],0], [[],0], [[],0], [[],0], [[],0], [0,12], [0,12]]};
    extend(objArg,arg);   var objT=await reqBE['setUpPageListCond'](objArg);
    extend(objArg,arg);   var objT=await reqBE[strGenerator]({});
  }else if(strGenerator=='getImageHist'){
    var arg={"Filt":[[[],0],[['So9yR8W2iy2hHgAO'],1],[0,11],[0,12],[[],0]]};
    extend(objArg,arg);   var objT=await reqBE['setUpImageListCond'](objArg);
    extend(objArg,arg);   var objT=await reqBE[strGenerator]({});
  }else if(strGenerator=='uploadAdminFS'){
    var arg={};
    extend(objArg,arg);   var objT=await reqBE[strGenerator]({});
  }else{console.log('no such generator');}
  
  console.log(objT);
})();
//flow=app[strGenerator](objArg); flow.flow=flow; flow.next();
