"use strict"

/******************************************************************************
 * ReqBE
 ******************************************************************************/
var ReqBE=app.ReqBE=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[]; 
  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
}




ReqBE.prototype.go=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
   

    // Extract input data either 'POST' or 'GET'
  var jsonInput;
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  
      //form.uploadDir='tmp';
      
      var err, fields, files;
      form.parse(req, function(errT, fieldsT, filesT) { err=errT; fields=fieldsT; files=filesT; flow.next();  });  yield;
      if(err){this.mesEO(err);  return; } 
      
      this.File=files['fileToUpload[]'];
      if('kind' in fields) this.kind=fields.kind; else this.kind='v';
      if(!(this.File instanceof Array)) this.File=[this.File];
      jsonInput=fields.vec;

    }else{
      var buf, myConcat=concat(function(bufT){ buf=bufT; flow.next();  });    req.pipe(myConcat);    yield;
      jsonInput=buf.toString();
    }
  }
  else if(1){
    var tmp='send me a POST'; this.mesO(tmp);   return;
  }
  else if(req.method=='GET'){
    var objUrl=url.parse(req.url), qs=objUrl.query||''; jsonInput=urldecode(qs);
  }

  try{ var beArr=JSON.parse(jsonInput); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e); return; }
  
  
  yield *getSessionMain.call(this); // sets this.sessionMain
  if(!this.sessionMain || typeof this.sessionMain!='object' || !('userInfoFrDB' in this.sessionMain) || !('vendor' in this.sessionMain.userInfoFrDB)) { yield* resetSessionMain.call(this); }  
  var redisVar=this.req.sessionID+'_Main', tmp=yield* wrapRedisSendCommand(flow, 'expire',[redisVar,maxUnactivity]);
 
  res.setHeader("Content-type", "application/json");


    // Remove 'CSRFCode' and 'caller' form beArr
  var CSRFIn, caller='index';
  for(var i=beArr.length-1;i>=0;i--){ 
    var row=beArr[i];
    if(row[0]=='CSRFCode') {CSRFIn=row[1]; array_removeInd(beArr,i);}
    else if(row[0]=='caller') {caller=row[1]; array_removeInd(beArr,i);}
  }

  var len=beArr.length;
  var StrInFunc=Array(len); for(var i=0;i<len;i++){StrInFunc[i]=beArr[i][0];}
  var arrCSRF, arrNoCSRF, allowed, boCheckCSRF, boSetNewCSRF;
  if(caller=='index'){
      // Arrays of functions
    arrCSRF=['VSetPosCond','VUpdate','VShow','VHide','VDelete','SUseRebateCode','teamLoad','teamSaveName','teamSave','rebateCodeCreate','adminMonitorClear',
    'reportUpdateComment','reportUpdateAnswer','setSetting','deleteImage', 'uploadImage','loginGetGraph'];  // Functions that changes something must check and refresh CSRF-code
    arrNoCSRF=['specSetup','setUpCond','setUp','getList','getGroupList','getHist','VPaymentList','adminNVendor','reportOneGet','reportVGet','reportRGet','logout','getSetting'];  // ,'testA','testB'
    allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
    if(StrComp(StrInFunc,['setUpCond','setUp','getList','getGroupList','getHist']) || StrComp(StrInFunc,['getSetting','specSetup','VSetPosCond', 'setUpCond','setUp','getList','getGroupList','getHist']))
        { boCheckCSRF=0; boSetNewCSRF=1; }
  }else if(caller=='pubKeyStore'){
    arrCSRF=['pubKeyStore','loginGetGraph'];   arrNoCSRF=['specSetup','logout'];   allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0;i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }
    if(StrComp(StrInFunc,['specSetup'])){ boCheckCSRF=0; boSetNewCSRF=1; }
  }else if(caller=='mergeID'){
    arrCSRF=['mergeID','loginGetGraph'];   arrNoCSRF=['specSetup','logout'];   allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0;i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }
    if(StrComp(StrInFunc,['specSetup'])){ boCheckCSRF=0; boSetNewCSRF=1; }

  }else {debugger; }

    // cecking/set CSRF-code
  var redisVar=req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    if(!CSRFIn){ var tmp='CSRFCode not set (try reload page)', error=new MyError(tmp); this.mesO(tmp); return;}
    var tmp=yield* wrapRedisSendCommand(flow, 'get',[redisVar]);
    if(CSRFIn!==tmp){ var tmp='CSRFCode err (try reload page)', error=new MyError(tmp); this.mesO(tmp); return;}
  }
  if(boSetNewCSRF){
    var CSRFCode=randomHash();
    var tmp=yield* wrapRedisSendCommand(flow, 'set',[redisVar,CSRFCode]);
    var tmp=yield* wrapRedisSendCommand(flow, 'expire',[redisVar,maxUnactivity]);
    this.GRet.CSRFCode=CSRFCode;
  }

  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0];
    if(in_array(strFun,allowed)) {
      var inObj=beArr[k][1],     tmpf; if(strFun in this) tmpf=this[strFun]; else tmpf=global[strFun];
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k];
    var objT=yield* func.call(this, inObj);
    if(typeof objT=='undefined' || objT.err || objT instanceof(Error)) {
      if(!res.finished) { res.out500(objT.err); } return;
    }else{
      this.Out.dataArr.push(objT.result);
    }      
  }
  this.mesO();

}


ReqBE.prototype.runIdIP=function*(StrRole){ //check  idIP against the vendor-table and return diverse data
"use strict"
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName; 
  
  var StrRoleAll=['vendor','team','marketer','admin','reporter'];
  if(typeof StrRole=='undefined') StrRole=StrRoleAll; 
  StrRole=StrRole||StrRoleAll;   if(typeof StrRole=='string') StrRole=[StrRole];

  var userInfoFrDBUpd={};
  
  var tmp=this.sessionMain.userInfoFrIP; 
  var BoTest={};
  for(var i=0;i<StrRoleAll.length;i++) { var strRole=StrRoleAll[i]; BoTest[strRole]=StrRole.indexOf(strRole)!=-1; }
  var Sql=[], Val=[tmp.IP, tmp.idIP, BoTest.vendor, BoTest.team, BoTest.marketer, BoTest.admin, BoTest.reporter];
  Sql.push("CALL "+siteName+"GetUserInfo(?, ?, ?, ?, ?, ?, ?, @OboOk, @Omess);");
  var sql=Sql.join('\n');
  
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err) {return [err];}
  var res=results[0], c=res.length; 
  if(c==1) {
    var userInfoFrDBGen=res[0];
    var res=results[1], c=res.length; if(BoTest.vendor) userInfoFrDBUpd.vendor=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.vendor=='object') extend(userInfoFrDBUpd.vendor,userInfoFrDBU);
    var res=results[2]; if(BoTest.vendor && res.length && 'n' in res[0]  &&  typeof userInfoFrDBUpd.vendor=='object') userInfoFrDBUpd.vendor.nPayment=res[0].n;  
    var res=results[3], c=res.length; if(BoTest.team) userInfoFrDBUpd.team=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.team=='object') extend(userInfoFrDBUpd.team,userInfoFrDBU);
    var res=results[4], c=res.length; if(BoTest.marketer) userInfoFrDBUpd.marketer=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.marketer=='object') extend(userInfoFrDBUpd.marketer,userInfoFrDBU); 
    var res=results[5], c=res.length; if(BoTest.admin) userInfoFrDBUpd.admin=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.admin=='object') extend(userInfoFrDBUpd.admin,userInfoFrDBU);
    var res=results[6]; if(BoTest.reporter ) {   var  c=res[0].n;  userInfoFrDBUpd.reporter=c?{idUser:userInfoFrDBGen.idUser, c:c}:null;    }
  } else extend(userInfoFrDBUpd, specialistDefault);
  
  return [null, userInfoFrDBUpd]; 
}

/******************************************************************************
 * loginGetGraph
 ******************************************************************************/
ReqBE.prototype.loginGetGraph=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, sessionID=req.sessionID, objQS=req.objQS;
  var strFun=inObj.fun;
  var Ou={};
  if(!this.sessionMain.userInfoFrDB){ this.sessionMain.userInfoFrDB=extend({},specialistDefault); yield *setSessionMain.call(this);  }
  

  var strIP=inObj.IP;
  var rootDomain=req.rootDomain, objIPCred=rootDomain[strIP];
  var uRedir=req.strSchemeLong+site.wwwLoginRet;
    // getToken
  var objForm={grant_type:'authorization_code', client_id:objIPCred.id, redirect_uri:uRedir, client_secret:objIPCred.secret, code:inObj.code};
  if(strIP=='fb') {
    var uToGetToken = "https://graph.facebook.com/v2.5/oauth/access_token";
  }else if(strIP=='google') {
    var uToGetToken = "https://accounts.google.com/o/oauth2/token"; 
  }else if(strIP=='idplace') {
    var uToGetToken = urlAuthIdplace+"/access_token";
  } 

  var arrT = Object.keys(objForm).map(function (key) { return key+'='+objForm[key]; }), strQuery=arrT.join('&'); 
  //if(strQuery.length) uToGetToken+='?'+strQuery;
  //var reqStream=requestMod.get(uToGetToken).on('error', function(err) { if(err) console.log(err);  })
  var reqStream=requestMod.post({url:uToGetToken, form: objForm},  function(err) { if(err) console.log(err);  })
  var semCB=0, semY=0, boDoExit=0, buf;
  var myConcat=concat(function(bufT){ 
    buf=bufT
    if(semY)flow.next(); semCB=1;
  });
  reqStream.pipe(myConcat);
  if(!semCB){semY=1; yield;}  if(boDoExit==1) {return {err:'exited'}; }

 
  try{ var objT=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e);  return {err:'exited'}; }
  var access_token=this.access_token=objT.access_token;
  //var access_token=this.access_token=inObj.access_token;



    // Get Graph
  if(strIP=='fb') {
    var uGraph = "https://graph.facebook.com/v2.5/me";
    var objForm={access_token:this.access_token, fields:"id,name,verified,picture"};
  }else if(strIP=='google') {
    var uGraph = "https://www.googleapis.com/plus/v1/people/me";
    var objForm={access_token:this.access_token, fields:"id,name,verified,image"};
  }else if(strIP=='idplace') {
    var uGraph = urlAuthIdplace+"/me";
    var objForm={access_token:this.access_token};
  } 
  var arrT = Object.keys(objForm).map(function (key) { return key+'='+objForm[key]; }), strQuery=arrT.join('&'); 
  if(strQuery.length) uGraph+='?'+strQuery;
  var reqStream=requestMod.get(uGraph).on('error', function(err) { if(err) console.log(err);  });
  //var reqStream=requestMod.post({url:uGraph, form: objForm},  function(err) { if(err) console.log(err);  })
  var semCB=0, semY=0, boDoExit=0, buf;
  var myConcat=concat(function(bufT){ 
    buf=bufT
    if(semY)flow.next(); semCB=1;
  });
  reqStream.pipe(myConcat);
  if(!semCB){semY=1; yield;}  if(boDoExit==1) {return {err:'exited'}; }

  //var tmp=JSON.myParse(buf.toString()), err=tmp[0], objGraph=tmp[1];    if(err) { console.log(err); res.out500('Error in JSON.parse, '+err); return {err:'exited'}; }
  try{ var objGraph=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e);  return {err:'exited'}; }
  this.objGraph=objGraph;

    // interpretGraph
  if('error' in objGraph) {console.log('Error accessing data from ID provider: '+objGraph.error.type+' '+objGraph.error.message+'<br>');  debugger; return; }


  if(strIP=='fb'){ 
    if(!objGraph.verified) { var tmp="Your facebook account is not verified. Try search internet for  \"How to verify facebook account\".";  res.out500(tmp);  debugger; return; }
    var IP='fb', idIP=objGraph.id, nameIP=objGraph.name, image=objGraph.picture.data.url;
  }else if(strIP=='google'){
    var IP='google', idIP=objGraph.id, nameIP=objGraph.name.givenName+' '+objGraph.name.familyName, image=objGraph.image.url;
  }else if(strIP=='idplace'){
    var IP='idplace', idIP=objGraph.id, nameIP=objGraph.name, image=objGraph.image;
  }

  if(typeof idIP=='undefined') {console.log("Error idIP is empty");}  else if(typeof nameIP=='undefined' ) {nameIP=idIP;}
  var userInfoFrIPCur={IP:IP, idIP:idIP, nameIP:nameIP, image:image};

  if(IP==strIPPrim){
    if('userInfoFrIP' in this.sessionMain   &&   (this.sessionMain.userInfoFrIP.IP!==IP || this.sessionMain.userInfoFrIP.idIP!==idIP)  ){
        this.sessionMain.userInfoFrDB=extend({},specialistDefault);    
    }
    this.sessionMain.userInfoFrIP=extend({},userInfoFrIPCur);   yield *setSessionMain.call(this);
  }else{
    this.userInfoFrIPAlt=extend({},userInfoFrIPCur); 
  }
  extend(this,userInfoFrIPCur);

  
  if(['vendorFun', 'reporterFun', 'teamFun', 'marketerFun', 'adminFun', 'mergeIDFun'].indexOf(strFun)!=-1){
    var {err}=yield *this[strFun]();
    if(err){   if(err!='exited') res.out500(err); return {err:'exited'};  }
  }


  if(this.boRunIdIP){
    var [err,resultA]=yield *this.runIdIP();
    if(err){ res.out500(err); return {err:'exited'}; } 
    extend(this.GRet.userInfoFrDBUpd, resultA);    extend(this.sessionMain.userInfoFrDB, resultA);
    
    yield *setSessionMain.call(this);
  }

  return {err:null, result:[Ou]};
}

ReqBE.prototype.reporterFun=function*(){
  this.boRunIdIP=true;
  return {err:null};
}
ReqBE.prototype.vendorFun=function*(){
  this.boRunIdIP=true;
  return {err:null};
}
ReqBE.prototype.teamFun=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, userTab=site.TableName.userTab, teamTab=site.TableName.teamTab;
   
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+teamTab+" (idUser,created) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){ res.out500(err); return {err:'exited'}; }
  this.boRunIdIP=true;
  return {err:null};
  
}
ReqBE.prototype.marketerFun=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, userTab=site.TableName.userTab, marketerTab=site.TableName.marketerTab;
  
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+marketerTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){ res.out500(err); return {err:'exited'}; }
  this.boRunIdIP=true;
  return {err:null};
  
}
ReqBE.prototype.adminFun=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, userTab=site.TableName.userTab, adminTab=site.TableName.adminTab;
  
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+adminTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){ res.out500(err); return {err:'exited'}; }
  this.boRunIdIP=true;
  return {err:null};
  
}
ReqBE.prototype.mergeIDFun=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;

  if(typeof this.sessionMain.userInfoFrIP!='object' || !('IP' in this.sessionMain.userInfoFrIP)){ res.out500('not logged in to '+strIPPrim); return {err:'exited'};   }

  var Sql=[], Val=[this.userInfoFrIPAlt.IP, this.userInfoFrIPAlt.idIP, this.sessionMain.userInfoFrIP.IP, this.sessionMain.userInfoFrIP.idIP];
  Sql.push("CALL "+siteName+"MergeID(?, ?, ?, ?, @OboOk, @Omess);");
  Sql.push("SELECT @OboOk AS boOK, @Omess AS mess;");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){ res.out500(err); return {err:'exited'}; }
  this.boRunIdIP=results[1][0].boOK;
  this.mes(results[1][0].mess);
  return {err:null};
}


ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(str){
  if(str) this.Str.push(str);
  this.GRet.strMessageText=this.Str.join(', ');
  this.GRet.userInfoFrIP=this.sessionMain.userInfoFrIP;
  this.res.end(JSON.stringify(this.Out));  
}
ReqBE.prototype.mesEO=function(err){
  var error=new MyError(err); console.log(error.stack);
  var strTmp;   
  if(typeof err=='object' && 'syscal' in err) strTmp='E: '+err.syscal+' '+err.code; else strTmp=err;
  this.Str.push(strTmp);
  //var tmp=err.syscal||''; this.Str.push('E: '+tmp+' '+err.code);
  this.GRet.strMessageText=this.Str.join(', ');
  this.GRet.userInfoFrIP=this.sessionMain.userInfoFrIP;
  this.res.end(JSON.stringify(this.Out));  
}



ReqBE.prototype.checkIfUserInfoFrIP=function*(){ 
  if('userInfoFrIP' in this.sessionMain && 'IP' in this.sessionMain.userInfoFrIP){ return true; }
  else{ 
    yield *resetSessionMain.call(this); return false;
  }
}
ReqBE.prototype.checkIfAnySpecialist=function(){
  var tmpEx=this.sessionMain.userInfoFrDB
  return Boolean(tmpEx.reporter || tmpEx.vendor || tmpEx.team || tmpEx.marketer || tmpEx.admin);
}
ReqBE.prototype.clearSession=function*(){
  //this.sessionMain.userInfoFrIP={};
  yield *resetSessionMain.call(this);
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
}

ReqBE.prototype.specSetup=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, Ou={};
  var Role=null; if(typeof inObj=='object' && 'Role' in inObj) Role=inObj.Role;
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(!boTmp) { return {err:null, result:[Ou]};} 
  
  var [err,resultA]=yield *this.runIdIP(Role);
  if(err){this.mesEO(err);   return {err:'exited'};  }
  extend(this.GRet.userInfoFrDBUpd,resultA);    extend(this.sessionMain.userInfoFrDB,resultA);
  

  yield *setSessionMain.call(this);
  if(!this.checkIfAnySpecialist()){yield *this.clearSession();} // If the user once clicked login, but never saved anything then logout
  return {err:null, result:[Ou]};
}


ReqBE.prototype.VSetPosCond=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site, Ou={};
 
  if(!this.sessionMain.userInfoFrDB.vendor){ return {err:null, result:[Ou]};}
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var coordinatePrecisionM=this.sessionMain.userInfoFrDB.vendor.coordinatePrecisionM;
  var [xtmp,ytmp]=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=xtmp; inObj[1]=ytmp;

  var sql="UPDATE "+site.TableName.vendorTab+" SET x=?, y=? WHERE idUser=? ", Val=[inObj[0],inObj[1],idUser];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  return {err:null, result:[Ou]};
}


ReqBE.prototype.logout=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res;
  yield *resetSessionMain.call(this); 
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return {err:null, result:[0]};
}



ReqBE.prototype.setUpCond=function*(inObj){
  var site=this.req.site, req=this.req, flow=req.flow, StrOrderFilt=site.StrOrderFilt, Prop=site.Prop;
  var Ou={};
  var tmp=setUpCond(site.KeySel, StrOrderFilt, Prop, inObj);
  copySome(this,tmp,['strCol', 'Where']);
  return {err:null, result:[Ou]};
}


ReqBE.prototype.setUp=function*(inObj){  // Set up some properties etc.  (termCond, VPSize, pC, zoom, boShowDummy).
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab, userTab=site.TableName.userTab;
  
  var Ou={},  Sql=[];
  Sql.push("SELECT UNIX_TIMESTAMP(now()) AS now;");

  this.termCond=''; if(boTerminationCheck) this.termCond="now()<terminationDate";
  
  var zoom=Number(inObj.zoom), boCalcZoom=zoom==-1?1:0; 
  this.VPSize=inObj.VPSize;  
  this.pC=inObj.pC; var xC=Number(this.pC[0]), yC=Number(this.pC[1]), wVP=Number(this.VPSize[0]), hVP=Number(this.VPSize[1]); 
  //Sql.push("SET @xC="+xC+"; SET @yC="+yC+"; SET @wVP="+wVP+"; SET @hVP="+hVP+";
  

  //sql="UPDATE "+vendorTab+" SET boShow=0, posTime=now() WHERE boShow=1 AND now()>DATE_ADD(posTime, INTERVAL hideTimer SECOND)";
  Sql.push("CALL "+siteName+"IFunPoll;"); 

  if(boCalcZoom){  
      // If too few vehicles are visible then show the dummies
    Sql.push("SELECT (@boShowDummy:=count(u.idUser)<1) AS boShowDummy FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser  WHERE boShow=1 AND !(idIP REGEXP '^Dummy');");
    Sql.push("SELECT count(u.idUser) AS nUserReal FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser  WHERE  !(idIP REGEXP '^Dummy');");
    Sql.push("UPDATE "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser SET boShow=@boShowDummy, posTime=now() WHERE idIP REGEXP '^Dummy';");  

    
    //strCond=array_filter(Where).join(' AND '); if(strCond.length>0) strCond='AND '+strCond;
    var WhereTmp=this.Where.concat(["boShow=1",this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
    
    var xOpp, xAddTerm; if(xC>128) {xOpp=xC-128; xAddTerm="IF(x<"+xOpp+",256,0)";}  else {xOpp=xC+128;  xAddTerm="IF(x>"+xOpp+",-256,0)"; } // xOpp : x of opposite side of planet
    var tmp="min(greatest(abs(x+"+xAddTerm+"-"+xC+"),abs(y-"+yC+")))";
    Sql.push("SELECT "+tmp+" AS distMin FROM "+vendorTab+" v WHERE "+strCond+";");
  }
  var sql=Sql.join('\n'), Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }  
  this.GRet.curTime=results[0][0].now; 
  if(boCalcZoom){
    this.GRet.boShowDummy=results[2][0].boShowDummy;
    this.GRet.nUserReal=results[3][0].nUserReal||0; 
    var distMin=results[5][0].distMin; 
    var minVP=Math.min(wVP,hVP);    
    if(distMin>0.001){
      var zFac=minVP/distMin;
      var z=Math.log2(zFac/2);
      zoom=Math.floor(z);
      zoom=bound(zoom,0,15);
    } else zoom=15;
  }
  this.zoom=zoom;
  return {err:null, result:[Ou]};
}  

//ReqBE.prototype.addMapCond=function*(inObj){}

ReqBE.prototype.getList=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var TableName=site.TableName, vendorTab=TableName.vendorTab, userTab=TableName.userTab, teamTab=TableName.teamTab, reportTab=TableName.reportTab;
  var strCol=this.strCol;
  var Ou={};
  this.tab=[];this.NVendor=[0,0];
  var xl,xh,yl,yh;
  if(this.zoom>1){
    var projs=new MercatorProjection();
    //var sw, ne, tmp=projs.getBounds(inObj.pC,this.zoom,inObj.VPSize);   sw=tmp[0]; ne=tmp[1];  xl=sw[0]; xh=ne[0]; yl=ne[1]; yh=sw[1];
    var sw, ne, tmp=projs.getBounds(this.pC,this.zoom,this.VPSize);   sw=tmp[0]; ne=tmp[1];  xl=sw[0]; xh=ne[0]; yl=ne[1]; yh=sw[1];
  }  else {xl=0; xh=256; yl=0; yh=256;}
  if(xh-xl>256) {xl=0; xh=256;}
  [xl]=normalizeAng(xl,128,256);   [xh]=normalizeAng(xh,128,256);
  this.whereMap="y>"+yl+" AND y<"+yh+" AND "; if(xl<xh) this.whereMap+="x>"+xl+" AND x<"+xh; else this.whereMap+="(x>"+xl+" OR x<"+xh+")";
  //this.WhereM=this.Where.concat(whereMap);
  
  var Sql=[];
  var WhereTmp=this.Where.concat([this.whereMap,"boShow=1",this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
  Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strCol+" FROM (("+vendorTab+" v NATURAL JOIN "+userTab+" u) LEFT JOIN "+teamTab+" dis on dis.idUser=v.idTeam) LEFT JOIN "+reportTab+" rb ON rb.idVendor=v.idUser \
WHERE "+strCond+" GROUP BY v.idUser ORDER BY posTime DESC LIMIT 0, "+maxVendor+";");

  Sql.push("SELECT FOUND_ROWS() AS n;"); // nFound

  var WhereTmp=[this.whereMap,"boShow=1",this.termCond],  strCond=array_filter(WhereTmp).join(' AND ');
  Sql.push("SELECT count(*) AS n FROM "+vendorTab+" v WHERE "+strCond+";"); // nUnFiltered
 
  var sql=Sql.join('\n'), Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  var nFound=results[1][0].n;
  this.boUseOrdinaryList=nFound<=maxVendor;
  if(this.boUseOrdinaryList){
    for(var i=0;i<results[0].length;i++) {
      var row=results[0][i], len=site.KeySel.length; 
      var rowN=Array(len); //for(var j=0;j<len;j++) { rowN[j]=row[j];}
      for(var j=0;j<len;j++){ var key=site.KeySel[j]; rowN[j]=row[key]; }
      this.tab.push(rowN);
    }      
  } 
  this.Str.push("Found: "+nFound);  
  this.NVendor=[nFound, results[2][0].n];
  return {err:null, result:[Ou]};
}

ReqBE.prototype.getGroupList=function*(inObj){  
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  this.groupTab=[];
  if(this.boUseOrdinaryList) {return {err:null, result:[Ou]};}
  var Sql=[];
  //var zoomFac=Math.pow(2,this.zoom-4.3);
  var zoomFac=Math.pow(2,this.zoom-5);
  var WhereTmp=this.Where.concat([this.whereMap, "boShow=1", this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
  Sql.push("SELECT round(x*"+zoomFac+")/"+zoomFac+" AS roundX, round(y*"+zoomFac+")/"+zoomFac+" AS roundY, count(*) AS n FROM "+vendorTab+" v \
                 WHERE "+strCond+" GROUP BY roundX, roundY;");
  var sql=Sql.join('\n'), Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  for(var i=0;i<results.length;i++) {var {roundX,roundY,n}=results[i]; this.groupTab.push([roundX,roundY,n]); }
  return {err:null, result:[Ou]};
}

ReqBE.prototype.getHist=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, vendorTab=site.TableName.vendorTab;
  var Ou={}
  var arg={strTableRef:vendorTab+' v', Ou:Ou, WhereExtra:[this.whereMap, "boShow=1", this.termCond]};  // , strTableRefCount:vendorTab+' v'
  copySome(arg, site, ['Prop','StrOrderFilt']);
  copySome(arg, this, ['Where']); arg.strDBPrefix=site.siteName;

  var {err, Hist}=yield* getHist(flow, this.pool, arg); if(err){ this.mesEO(err); return {err:'exited'};  } 
  Ou.Hist=Hist; copySome(Ou, this,['zoom', 'tab', 'NVendor', 'groupTab']);
  return {err:null, result:[Ou]};
}



/*********************************************************************************************
 * Vendor-functions
 *********************************************************************************************/

ReqBE.prototype.VUpdate=function*(inObj){ // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName, Prop=site.Prop;
  var vendorTab=site.TableName.vendorTab, userTab=site.TableName.userTab;
  //var VendorUpdF=site.VendorUpdF;
  var Ou={}; 
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) { this.mes('No session'); return {err:null, result:[Ou]};}

  var tmp=this.sessionMain.userInfoFrIP, IP=tmp.IP, idIP=tmp.idIP, nameIP=tmp.nameIP, image=tmp.image;

  var objVar=extend({},inObj);
  
  var boPrice='boPrice' in objVar; if(boPrice) delete objVar.boPrice;
  var boInsert='boInsert' in objVar; if(boInsert) delete objVar.boInsert;
  if('image' in objVar) delete objVar.image;
    
  var arrK=[], arrVal=[], arrUpdQM=[];
  for(var name in objVar){
    if(site.arrAllowed.indexOf(name)==-1) {return {err:'Forbidden input'};}
    arrK.push(name);
    var value=objVar[name]; if(typeof value!='number') {value=this.pool.escape(value);  value=value.slice(1, -1); }
    var QMark='?';
    //if(name in VendorUpdF) { var tmp=VendorUpdF[name].call(site.Enum,name,value);  QMark=tmp[0]; value=tmp[1]; }
    if('vendorUpdF' in Prop[name]) { var tmp=Prop[name].vendorUpdF.call(Prop,name,value);  QMark=tmp[0]; value=tmp[1]; }

    objVar[name]=value;
    arrVal.push(value);
    //QMark=QMark.replace(/\?/,value); 
    arrUpdQM.push("`"+name+"`="+QMark);
  }
  var strCol=arrK.join(', ');
  var strUpdQM=arrUpdQM.join(', ');
    
  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"vendorSetup(?,?,?,?,@boInserted,@idUser);");
  Val.push(IP, idIP, nameIP, image);
  Sql.push("SELECT @boInserted AS boInserted;");

  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE !(idIP REGEXP '^Dummy');");

  var strTeamTmp='';     if('idTeamWanted' in objVar) {    var idTmp=Number(objVar.idTeamWanted);    strTeamTmp=", idTeamWanted="+idTmp+", idTeam= IF(idTeam="+idTmp+",idTeam,0)";      }
  var strPriceTmp='';  if(boPrice) strPriceTmp=', lastPriceChange=now()';
  var tmp=strUpdQM+" "+strPriceTmp+" "+strTeamTmp;
  if(tmp.length>2) {
    Sql.push("UPDATE "+vendorTab+" SET "+tmp+" WHERE idUser=@idUser;");
    Val=Val.concat(arrVal);
  }

  if(payLev==0) {
    Sql.push("UPDATE "+vendorTab+" SET nMonthsStartOffer='"+intMax+"', terminationDate=FROM_UNIXTIME("+intMax+") WHERE idUser =LAST_INSERT_ID() AND @boInserted;");  
  }
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  site.boGotNewVendors=Number(results[1][0].boInserted);
  site.nUser=Number(results[2][0].n);
  this.mes('Data updated');      
  return {err:null, result:[Ou]};
}



ReqBE.prototype.VDelete=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No session'); return {err:null, result:[Ou]};}
  if(!this.sessionMain.userInfoFrDB.vendor) { this.mes('Vendor does not exist'); return {err:null, result:[Ou]};}
  
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  yield *resetSessionMain.call(this);
  extend(this.GRet.userInfoFrDBUpd, specialistDefault); 

  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE !(idIP REGEXP '^Dummy');");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  site.boGotNewVendors=1; // variabel should be called boNUsers changed or something..
  site.nUser=Number(results[1][0].n);
  this.mes('deleted');      
  return {err:null, result:[Ou]};
}


ReqBE.prototype.VShow=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {  this.mes('No session'); return {err:null, result:[Ou,'errFunc']};  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  var coordinatePrecisionM=this.sessionMain.userInfoFrDB.vendor.coordinatePrecisionM;
  var [xtmp,ytmp]=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=xtmp; inObj[1]=ytmp;

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET x=?, y=?, boShow=1, posTime=now(), histActive=histActive|1 WHERE idUser="+idUser+";");
  Val=[inObj[0],inObj[1]];
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  this.mes('Vendor visible');      
  return {err:null, result:[Ou]};
}
ReqBE.prototype.VHide=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {   this.mes('No session'); return {err:null, result:[Ou,'errFunc']};  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET boShow=0, posTime=0, histActive=histActive|1 WHERE idUser="+idUser+";");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  this.mes('Vendor hidden');      
  return {err:null, result:[Ou]};
}



ReqBE.prototype.SUseRebateCode=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var vendorTab=site.TableName.vendorTab, rebateCodeTab=site.TableName.rebateCodeTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {  this.mes('No session'); return {err:null, result:[Ou,'errFunc']};  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var Sql=[], Val=[];
  var code=this.pool.escape(inObj.rebateCode);
  Sql.push("CALL "+siteName+"UseRebateCode("+code+", "+idUser+", @monthsToAdd, @boOK, @mess);");
  Sql.push("SELECT @monthsToAdd AS monthsToAdd, @boOK AS boOK, @mess AS mess;");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var monthsToAdd=results[1][0].monthsToAdd, boOK=results[1][0].boOK, mess=results[1][0].mess;
  if(!boOK) this.mes(mess);
  else {
    if(monthsToAdd!=intMax) tmpStr=monthsToAdd+" months added "; else tmpStr='Free account';     this.mes(tmpStr);
  }
  return {err:null, result:[Ou]};
}



ReqBE.prototype.VPaymentList=function*(inObj){ // needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var paymentTab=site.TableName.paymentTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) { this.mes('No session'); return {err:null, result:[Ou,'errFunc']}; }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  var Sql=[], Val=[];
  var strCol="txn_id, payer_email, amount, currency, tax, VATNumber, monthsToAdd, UNIX_TIMESTAMP(payment_date) AS payment_date, UNIX_TIMESTAMP(created) AS created";
  Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strCol+" FROM "+paymentTab+" WHERE idUser="+idUser+" ORDER BY paymentNumber ASC LIMIT "+offset+", "+rowCount+";"); 

  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length;
  Ou.nTot=results[1][0].n;
  return {err:null, result:[Ou]};
}


ReqBE.prototype.adminNVendor=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site, vendorTab=site.TableName.vendorTab;
  var sql="SELECT count(*) AS n FROM "+vendorTab, Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var Ou={}; Ou.n=results[0].n;
  return {err:null, result:[Ou]};
}
ReqBE.prototype.adminMonitorClear=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  if(!this.sessionMain.userInfoFrDB.admin.boApproved) { this.mes('Not approved'); return {err:null, result:[Ou,'errFunc']}; }
  var sql="SELECT count(*) AS n FROM "+userTab+" WHERE !(idIP REGEXP '^Dummy');", Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  Ou.n=results[0].n;
  return {err:null, result:[Ou]};
}


ReqBE.prototype.rebateCodeCreate=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var rebateCodeTab=site.TableName.rebateCodeTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {  this.mes('No session'); return {err:null, result:[Ou]};  }
  var idUser=this.sessionMain.userInfoFrDB.marketer.idUser;
  if(!this.sessionMain.userInfoFrDB.marketer.boApproved) { this.mes('Marketer not approved'); return {err:null, result:[Ou]}; }
    
  var months=Number(inObj.months); 
  var code=genRandomString(rebateCodeLen);


  var sql="INSERT INTO "+rebateCodeTab+" ( idUser, months, code, created, validTill) VALUES (?,?,?, now(), DATE_ADD(now(), INTERVAL 1 MONTH))";
  var Val=[idUser, months, code];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  this.mes(months+" months, Code: "+code);
  return {err:null, result:[Ou]};
}
ReqBE.prototype.reportUpdateComment=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var reportTab=site.TableName.reportTab;
  var Ou={};   
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No logged in'); return {err:null, result:[Ou]}; }
  var objT=copySome({},this.sessionMain.userInfoFrIP,['IP', 'idIP', 'nameIP', 'image']);
  var idVendor=inObj.idVendor;
  var comment=inObj.comment;  comment=comment.substr(0,10000);
  if(comment.length==0) comment=null;
  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"reporterSetup(?, ?, ?, ?, @boInserted, @idReporter);");  Val.push(objT.IP, objT.idIP, objT.nameIP, objT.image);
  Sql.push("INSERT INTO "+reportTab+" (idVendor,idReporter,comment,created) VALUES (?,@idReporter,?,now()) ON DUPLICATE KEY UPDATE comment=?, modified=now();");
  Val.push(idVendor,comment,comment);
  Sql.push("DELETE FROM "+reportTab+" WHERE comment IS NULL AND answer IS NULL;");
  Sql.push("SELECT count(*) AS n FROM "+reportTab+" WHERE idReporter=@idReporter;");  
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; } 
  var c=results[1].affectedRows, mestmp; if(c==1) mestmp="Entry inserted"; else if(c==2)  mestmp="Entry updated";
  var c=results[2].affectedRows; if(c==1) mestmp="Entry deleted"; else mestmp=c+ " entries deleted!?";
  var n=results[3][0].n; if(n==0) mestmp="All comments deleted";
  this.mes(mestmp);

  return {err:null, result:[Ou]};
}
ReqBE.prototype.reportUpdateAnswer=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var reportTab=site.TableName.reportTab;
  var Ou={};   
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No session'); return {err:null, result:[Ou]};}
  if(!this.sessionMain.userInfoFrDB.vendor) { this.mes('Vendor does not exist'); return {err:null, result:[Ou]};}

  var idReporter=inObj.idReporter;
  var idVendor=this.sessionMain.userInfoFrDB.vendor.idUser;
  var answer=inObj.answer;  answer=answer.substr(0,10000);
  if(answer.length==0) answer=null;
  var Sql=[], Val=[];
  Sql.push("UPDATE "+reportTab+" SET answer=? WHERE idVendor=? AND idReporter=?;");
  Val.push(answer,idVendor,idReporter);
  var mestmp="Entry updated";
  Sql.push("DELETE FROM "+reportTab+" WHERE  comment IS NULL AND answer IS NULL;");
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var c=results.length; if(c>0) mestmp="Entry deleted";
  this.mes(mestmp);
  return {err:null, result:[Ou]};
}

ReqBE.prototype.reportOneGet=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var userTab=site.TableName.userTab,  reportTab=site.TableName.reportTab;
  var Ou={};   
  //debugger
  var idReporter; if('idReporter' in inObj){ idReporter=inObj.idReporter;}
  else{
    if(this.sessionMain.userInfoFrDB.reporter) idReporter=this.sessionMain.userInfoFrDB.reporter.idUser;    else{ this.mes('Not Logged in'); return {err:null, result:[Ou]}; }
  }
  var idVendor; if('idVendor' in inObj){ idVendor=inObj.idVendor;}
  else{
    if(this.sessionMain.userInfoFrDB.vendor) idVendor=this.sessionMain.userInfoFrDB.vendor.idUser;    else{ this.mes('Not Logged in'); return {err:null, result:[Ou]}; }
  }
  var sql="SELECT comment, answer FROM "+userTab+" u JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idVendor=? AND idReporter=? "; 
  var Val=[idVendor,idReporter];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var c=results.length; 
  var mestmp; if(c>0){ Ou.row=results[0]; mestmp="Feedback fetched"; }else{ Ou.row={}; mestmp="No existing feedback";}
  this.mes(mestmp);
  return {err:null, result:[Ou]};
}



ReqBE.prototype.reportVGet=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var reportTab=site.TableName.reportTab, userTab=site.TableName.userTab;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  
  var idVendor=inObj.idVendor;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS idReporter, nameIP, image, comment, answer, UNIX_TIMESTAMP(created) AS created FROM "+reportTab+" r JOIN "+userTab+" u ON r.idReporter=u.idUser WHERE idVendor=? ORDER BY created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idVendor);
  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join("\n ");
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;
  return {err:null, result:[Ou]};
}
ReqBE.prototype.reportRGet=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var TableName=site.TableName, userTab=TableName.userTab, vendorTab=TableName.vendorTab, reportTab=TableName.reportTab;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);

  var idReporter=inObj.idReporter;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS u.idUser, IP, idIP, image, displayName, boImgOwn, imTag, comment, answer, UNIX_TIMESTAMP(r.created) AS created FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idReporter=? ORDER BY r.created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idReporter); 
  Sql.push("SELECT FOUND_ROWS() AS n;"); 
  var sql=Sql.join("\n ");
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;   
  //this.mes("Found: "+nCur);
  return {err:null, result:[Ou]};
}



ReqBE.prototype.teamSaveName=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var teamTab=site.TableName.teamTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No session'); return {err:null, result:[Ou]};}
  var idUser=Number(this.sessionMain.userInfoFrDB.team.idUser);
  if(!this.sessionMain.userInfoFrDB.team.boApproved){this.mes('Team not approved'); return {err:null, result:[Ou]};}

  var link=this.pool.escape(inObj.link);  
  var sql="UPDATE "+teamTab+" SET link=? WHERE idUser=?;", Val=[link, idUser];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  this.mes('Data saved');
  return {err:null, result:[Ou]};
}
ReqBE.prototype.teamSave=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No session'); return {err:null, result:[Ou]};}
  if(!this.sessionMain.userInfoFrDB.team.boApproved){ this.mes('Team not approved'); return {err:null, result:[Ou]};}
  
  var idUser=Number(inObj.idUser),   boOn=Number(inObj.boOn); 
  var sql="UPDATE "+vendorTab+" SET idTeam=IF("+boOn+",idTeamWanted,0) WHERE idUser="+idUser+";", Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  this.mes('Data saved');
  return {err:null, result:[Ou]};
}

ReqBE.prototype.teamLoad=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var userTab=site.TableName.userTab, vendorTab=site.TableName.vendorTab;
  var Ou={};  
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No session'); return {err:null, result:[Ou]};}
  if(!this.sessionMain.userInfoFrDB.team) { this.mes('Team does not exist'); return {err:null, result:[Ou]};}

  var idUser=this.sessionMain.userInfoFrDB.team.idUser;
  if(this.sessionMain.userInfoFrDB.team.boApproved==0){ this.mes('Team not approved'); return {err:null, result:[Ou]};}
  
  Ou.idUser=idUser;
  Ou.imTag=this.sessionMain.userInfoFrDB.team.imTag;
  Ou.link=this.sessionMain.userInfoFrDB.team.link;

  var TmpCol=['u.idUser', 'IP', 'idIP', 'displayName', 'idTeam', 'imTag'];
  for(var i=0;i<TmpCol.length;i++){TmpCol[i]+=" AS '"+i+"'";} 
  var strCol=TmpCol.join(', ');
  //var sql="SELECT u.idUser, IP, idIP, displayName, idTeam FROM "+vendorTab+" v JOIN "+userTab+" u ON v.idUser=u.idUser WHERE idTeamWanted=?";
  //var sql="SELECT u.idUser AS '0', IP AS '1', idIP AS '2', displayName AS '3', idTeam AS '4' FROM "+vendorTab+" v JOIN "+userTab+" u ON v.idUser=u.idUser WHERE idTeamWanted=?";
  var sql="SELECT "+strCol+" FROM "+vendorTab+" v JOIN "+userTab+" u ON v.idUser=u.idUser WHERE idTeamWanted=?";
  var Val=[idUser];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var nRow=results.length;
  if(nRow==0) { this.mes('No vendors connected');  }
  else{
    Ou.tab=[];
    for(var i=0;i<nRow;i++) {
      var row=results[i], len=5;
      var rowN=Array(len); for(var j=0;j<len;j++) { rowN[j]=row[j];}
      Ou.tab.push(rowN);
    }
  }
  return {err:null, result:[Ou]};
}


ReqBE.prototype.deleteImage=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var vendorImageTab=site.TableName.vendorImageTab, vendorTab=site.TableName.vendorTab;
  var Ou={};   
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No logged in'); return {err:null, result:[Ou]};}
  if(!('userInfoFrDB' in this.sessionMain)) {this.mes('No account'); return {err:null, result:[Ou]};}
  var idUser=Number(this.sessionMain.userInfoFrDB.vendor.idUser);

  var Sql=[];
  Sql.push("DELETE FROM "+vendorImageTab+" WHERE idUser="+idUser+";");
  Sql.push("UPDATE "+vendorTab+" SET boImgOwn=0 WHERE idUser="+idUser+";");
  var sql=Sql.join("\n "), Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var nDel=results[0].affectedRows; 
  if(nDel==1) {this.mes('Image deleted'); } else { this.mes(nDel+" images deleted!?");}
  return {err:null, result:[Ou]};
}


ReqBE.prototype.pubKeyStore=function*(inObj){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var pubKeyTab=site.TableName.pubKeyTab;
  var Ou={};   
  var boTmp=yield *this.checkIfUserInfoFrIP(); if(boTmp==0) {this.mes('No logged in'); return {err:null, result:[Ou]};}
  if(!('userInfoFrDB' in this.sessionMain)) {this.mes('No account'); return {err:null, result:[Ou]}; }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser;
  var pubKey=inObj.pubKey;
  var sql="INSERT INTO "+pubKeyTab+" (idUser,pubKey) VALUES (?, ?) ON DUPLICATE KEY UPDATE pubKey=VALUES(pubKey), iSeq=0";
  var Val=[idUser,pubKey];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  var boOK=0, nUpd=results.affectedRows, mestmp; 
  if(nUpd==1) {boOK=1; mestmp="Key inserted"; } else if(nUpd==2) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="(same key)";}
  Ou.boOK=boOK;    Ou.strMess=mestmp;
  return {err:null, result:[Ou]};
}


ReqBE.prototype.getSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['payLev','boTerminationCheck','boShowTeam'];
  if(!isAWithinB(inObj,Str)) {this.mes('Illegal invariable'); return {err:null, result:'getSetting'}; }
  for(var i=0;i<inObj.length;i++){ var name=inObj[i]; Ou[name]=app[name]; }
  return {err:null, result:[Ou]};
}
ReqBE.prototype.setSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(this.sessionMain.userInfoFrDB.admin) StrApp=['payLev','boTerminationCheck','boShowTeam'];  
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return {err:null, result:'setSetting'};}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  return {err:null, result:[Ou]};    
}

ReqBE.prototype.getDBSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  if(!isAWithinB(inObj,['payLev','boTerminationCheck','boShowTeam'])) {this.mes('Illegal invariable'); return {err:null, result:'getSetting'};}
  var strV=inObj.join("', '");
  var sql="SELECT * FROM "+settingTab+" WHERE name IN('"+strV+"')";
  var Val=[];
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  for(var i=0; i<results.length;i++){ var tmp=results[i]; Ou[tmp.name]=tmp.value;  }
  return {err:null, result:[Ou]};
}

ReqBE.prototype.setDBSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=[];
  if(this.sessionMain.userInfoFrDB.admin) Str=['payLev','boTerminationCheck','boShowTeam','boGotNewVendors','nUser'];  
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return {err:null, result:'setSetting'};}

  var Sql=[], sqlA="INSERT INTO "+settingTab+" (name,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?";
  for(var name in inObj){
    var value=inObj[name];
    Sql.push(sqlA); Val.push(name,value,value);
    Ou[name]=value;
  }
  var sql=Sql.join("\n ");
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){this.mesEO(err); return {err:'exited'}; }
  for(var name in inObj){
    var value=inObj[name];        Ou[name]=value;
  }
  return {err:null, result:[Ou]};
}




ReqBE.prototype.uploadImage=function*(inObj){
  var self=this, req=this.req, flow=req.flow, res=this.res, site=req.site, siteName=site.siteName;
  var Ou={};
  var regImg=RegExp("^(png|jpeg|jpg|gif|svg)$");

  var File=this.File;
  var n=File.length; this.mes("nFile: "+n);

  var file=File[0], tmpname=file.path, fileName=file.name; 
  var Match=RegExp('\\.(\\w{1,3})$').exec(fileName); 
  if(!Match){ Ou.strMessage="The file name should have a three or four letter extension, ex: \".xxx\""; return {err:null, result:[Ou]}; }
  var type=Match[1].toLowerCase();
  var err, buf;
  fs.readFile(tmpname, function(errT, bufT) { err=errT; buf=bufT;  flow.next();  }); yield;
  if(err){ this.mesEO(err); return {err:'exited'}; }
  var data=buf; 
  if(data.length==0){ this.mes("data.length==0"); return {err:null, result:[Ou]}; }

  if(!regImg.test(type)){ Ou.strMessage="Unrecognized file type: "+type; return {err:null, result:[Ou]}; }


  var semY=0, semCB=0, boDoExit=0;
  var myCollector=concat(function(buf){
    data=buf;
    if(semY) { flow.next(); } semCB=1;
  }); 
  var streamImg=gm(data).autoOrient().resize(50, 50).stream(function streamOut(err, stdout, stderr) {
    if(err){ boDoExit=1; self.mesEO(err); return; } 
    stdout.pipe(myCollector); 
  });
  if(!semCB) { semY=1; yield;}
  if(boDoExit==1) {return {err:'exited'}; }


  var TableName=site.TableName, vendorTab=TableName.vendorTab, teamTab=TableName.teamTab, vendorImageTab=TableName.vendorImageTab, teamImageTab=TableName.teamImageTab;
  if(!('userInfoFrDB' in this.sessionMain)){  this.mesO("!('userInfoFrDB' in sessionMain)",'uploadImage'); return;}
  var kind=this.kind||'v';
  var strKind=kind=='v'?'vendor':'team', idUser=this.sessionMain.userInfoFrDB[strKind].idUser;
  
  console.log('uploadImage data.length: '+data.length);
  if(data.length==0) {this.mesEO('data.length==0');  return {err:'exited'}; }
  
  var tab; if(kind=='v'){tab=vendorImageTab; }else tab=teamImageTab;
  var Sql=[], Val=[];
  Sql.push("REPLACE INTO "+tab+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  if(kind=='v'){      Sql.push("UPDATE "+vendorTab+" SET boImgOwn=1,imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  else{      Sql.push("UPDATE "+teamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  
  //var sql='INSERT INTO imgTab SET ?';
  var sql=Sql.join('\n');
  var {err, results}=yield* myQueryGen(flow, sql, Val, this.pool);
  if(err){res.out500(err);  return {err:'exited'};   } 

  Ou.strMessage="Done";
  return {err:null, result:[Ou]};
}



