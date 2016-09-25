"use strict"

/******************************************************************************
 * ReqBE
 ******************************************************************************/
var ReqBE=app.ReqBE=function(req, res, callback){
  this.req=req; this.res=res; this.callback=callback||function(){}; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[]; 
  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
}




ReqBE.prototype.go=function(){
  var self=this, req=this.req, res=this.res, site=req.site;
   
  
  //var objT={userInfoFrDB:specialistDefault, userInfoFrIP:objTmp};
  getSessionMain.call(this); // sets this.sessionMain
  if(!this.sessionMain || typeof this.sessionMain!='object' || !('userInfoFrDB' in this.sessionMain) || !('vendor' in this.sessionMain.userInfoFrDB)) { resetSessionMain.call(this); }  
  var redisVar=this.req.sessionID+'_Main', tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
 
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  
      //form.uploadDir='tmp';
     

      form.parse(req, function(err, fields, files) {
        if(err){self.mesEO(err);  return; } 
        else{
          self.File=files['fileToUpload[]'];
          if('kind' in fields) self.kind=fields.kind; else self.kind='v';
          if(!(self.File instanceof Array)) self.File=[self.File];
          self.jsonInput=fields.vec;
          Fiber( function(){ self.interpretInput.call(self); }).run();
        }
      });

    }else{  
      var myConcat=concat(function(buf){
        var str=buf.toString(); self.jsonInput=buf.toString();
        
        Fiber( function(){ self.interpretInput.call(self); }).run();
      });
      req.pipe(myConcat);
    }
  }
  else if(1){
    var tmp='send me a POST'; self.mesO(tmp);   return;
  }
  else if(req.method=='GET'){
    var objUrl=url.parse(req.url), qs=objUrl.query||''; self.jsonInput=urldecode(qs); 
    Fiber( function(){ self.interpretInput.call(self); }).run();
  }
}

ReqBE.prototype.interpretInput=function(){
  var self=this, req=this.req, res=this.res, site=req.site;

  res.setHeader("Content-type", "application/json");
  
  var jsonInput=this.jsonInput;
  try{ var beArr=JSON.parse(jsonInput); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e); return; }

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
  var redisVar=this.req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    if(!CSRFIn){ var tmp='CSRFCode not set (try reload page)', error=new MyError(tmp); self.mesO(tmp); return;}
    var tmp=wrapRedisSendCommand('get',[redisVar]);
    if(CSRFIn!==tmp){ var tmp='CSRFCode err (try reload page)', error=new MyError(tmp); self.mesO(tmp); return;}
  }
  if(boSetNewCSRF) {
    var CSRFCode=randomHash();
    var tmp=wrapRedisSendCommand('set',[redisVar,CSRFCode]);   var tmp=wrapRedisSendCommand('expire',[redisVar,maxUnactivity]);
    self.GRet.CSRFCode=CSRFCode;
  }

  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0]; 
    if(in_array(strFun,allowed)) { 
      var inObj=beArr[k][1],     tmpf; if(strFun in self) tmpf=self[strFun]; else tmpf=global[strFun];     
      //var fT=thisChangedWArg(tmpf, self, inObj);   Func.push(fT);
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  var fiber = Fiber.current; 
  for(var k=0; k<Func.length; k++){
    var Tmp=Func[k], func=Tmp[0], inObj=Tmp[1];
    var semCB=0, semY=0, boDoExit=0;
    func.call(self, function(err, result) { 
        if(err){ 
          boDoExit=1;
          if(err!='exited') { res.out500(err); }
        }
        else {
          self.Out.dataArr.push(result);
        }      
        if(semY) { fiber.run(); } semCB=1;
      }
      , inObj
    );
    if(!semCB) { semY=1; Fiber.yield();}
    if(boDoExit==1) return;
  }
  self.mesO();

}


/******************************************************************************
 * loginGetGraph
 ******************************************************************************/
ReqBE.prototype.loginGetGraph=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site, sessionID=req.sessionID, objQS=req.objQS;
  var fiber=Fiber.current;
  var strFun=inObj.fun;
  var Ou={};
  if(!this.sessionMain.userInfoFrDB){ this.sessionMain.userInfoFrDB=extend({},specialistDefault); setSessionMain.call(this);  }
  

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
    if(semY)fiber.run(); semCB=1;
  });
  reqStream.pipe(myConcat);
  if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) {callback('exited'); return; }

 
  try{ var objT=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e);  callback('exited'); debugger; return; }
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
    if(semY)fiber.run(); semCB=1;
  });
  reqStream.pipe(myConcat);
  if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) {callback('exited'); return; }

  //var tmp=JSON.myParse(buf.toString()), err=tmp[0], objGraph=tmp[1];    if(err) { console.log(err); res.out500('Error in JSON.parse, '+err); callback('exited'); debugger; return; }
  try{ var objGraph=JSON.parse(buf.toString()); }catch(e){ console.log(e); res.out500('Error in JSON.parse, '+e);  callback('exited'); debugger; return; }
  self.objGraph=objGraph;

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
    this.sessionMain.userInfoFrIP=extend({},userInfoFrIPCur);    setSessionMain.call(this);
  }else{
    this.userInfoFrIPAlt=extend({},userInfoFrIPCur); 
  }
  extend(this,userInfoFrIPCur);

  
  if(['vendorFun', 'reporterFun', 'teamFun', 'marketerFun', 'adminFun', 'mergeIDFun'].indexOf(strFun)!=-1){
    var  semCB=0, semY=0, boDoExit=0; 
    this[strFun](function(err,res){
      if(err){  boDoExit=1; if(err!='exited') res.out500(err);  }
      if(semY)fiber.run(); semCB=1;
    });
    if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) {callback('exited'); return; }
  }


  if(this.boRunIdIP){
    var semCB=0, semY=0, boDoExit=0;
    runIdIP.call(this, null, function(err,res){
      if(err){ boDoExit=1; res.out500(err);  } 
      else{   
        extend(self.GRet.userInfoFrDBUpd,res);    extend(self.sessionMain.userInfoFrDB,res);
      }
      if(semY) fiber.run(); semCB=1;
    });
    if(!semCB){semY=1; Fiber.yield();}  if(boDoExit==1) {callback('exited'); return; }

    setSessionMain.call(self);
  }

  callback(null,[Ou]);
}

ReqBE.prototype.reporterFun=function(callback){
  this.boRunIdIP=true;
  callback(null,0);
}
ReqBE.prototype.vendorFun=function(callback){
  this.boRunIdIP=true;
  callback(null,0);
}
ReqBE.prototype.teamFun=function(callback){
  var self=this, req=this.req, res=this.res, site=req.site, userTab=site.TableName.userTab, teamTab=site.TableName.teamTab;
   
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+teamTab+" (idUser,created) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){ res.out500(err); callback('exited'); return; }
    self.boRunIdIP=true;
    callback(null,0);
  });
}
ReqBE.prototype.marketerFun=function(callback){
  var self=this, req=this.req, res=this.res, site=req.site, userTab=site.TableName.userTab, marketerTab=site.TableName.marketerTab;
  
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+marketerTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){ res.out500(err); callback('exited'); return; }
    self.boRunIdIP=true;
    callback(null,0);
  });
}
ReqBE.prototype.adminFun=function(callback){
  var self=this, req=this.req, res=this.res, site=req.site, userTab=site.TableName.userTab, adminTab=site.TableName.adminTab;
  
  var Sql=[], Val=[this.IP, this.idIP, this.nameIP, this.image, this.nameIP, this.image];
  Sql.push("INSERT INTO "+userTab+" (IP,idIP,nameIP,image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), nameIP=?, image=? ;");
  Sql.push("INSERT INTO "+adminTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){ res.out500(err); callback('exited'); return; }
    self.boRunIdIP=true;
    callback(null,0);
  });
}
ReqBE.prototype.mergeIDFun=function(callback){
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;

  if(typeof this.sessionMain.userInfoFrIP!='object' || !('IP' in this.sessionMain.userInfoFrIP)){ res.out500('not logged in to '+strIPPrim); callback('exited'); return;   }

  var Sql=[], Val=[this.userInfoFrIPAlt.IP, this.userInfoFrIPAlt.idIP, this.sessionMain.userInfoFrIP.IP, this.sessionMain.userInfoFrIP.idIP];
  Sql.push("CALL "+siteName+"MergeID(?, ?, ?, ?, @OboOk, @Omess);");
  Sql.push("SELECT @OboOk AS boOK, @Omess AS mess;");
  var sql=Sql.join('\n');
//console.log(Val);
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){ res.out500(err); callback('exited'); return; }
    self.boRunIdIP=results[1][0].boOK;
    self.mes(results[1][0].mess);
    callback(null,0);
  });
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



ReqBE.prototype.checkIfUserInfoFrIP=function(){ 
  if('userInfoFrIP' in this.sessionMain && 'IP' in this.sessionMain.userInfoFrIP){ return true; }
  else{ 
    resetSessionMain.call(this); return false;
  }
}
ReqBE.prototype.checkIfAnySpecialist=function(){
  var tmpEx=this.sessionMain.userInfoFrDB
  return Boolean(tmpEx.reporter || tmpEx.vendor || tmpEx.team || tmpEx.marketer || tmpEx.admin);
}
ReqBE.prototype.clearSession=function(){
  //this.sessionMain.userInfoFrIP={};
  resetSessionMain.call(this);
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
}

ReqBE.prototype.specSetup=function(callback,inObj){
  var self=this, req=this.req, res=this.res, Ou={};
  var Role=null; if(typeof inObj=='object' && 'Role' in inObj) Role=inObj.Role;
  if(!this.checkIfUserInfoFrIP()) { callback(null,[Ou]); return } 
  var fiber = Fiber.current, boDoExit=0;
  runIdIP.call(this, Role, function(err,res){
    if(err){self.mesEO(err);   boDoExit=1;  }
    else{   
      extend(self.GRet.userInfoFrDBUpd,res);    extend(self.sessionMain.userInfoFrDB,res);
    }
    fiber.run();
  });
  Fiber.yield();  if(boDoExit==1) {callback('exited'); return; }

  setSessionMain.call(self);
  if(!self.checkIfAnySpecialist()){self.clearSession();} // If the user once clicked login, but never saved anything then logout
  callback(null,[Ou]);
}


ReqBE.prototype.VSetPosCond=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site, Ou={};
 
  if(!this.sessionMain.userInfoFrDB.vendor){ callback(null, [Ou]); return;}
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var coordinatePrecisionM=this.sessionMain.userInfoFrDB.vendor.coordinatePrecisionM;
  var tmp=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=tmp[0]; inObj[1]=tmp[1];

  var sql="UPDATE "+site.TableName.vendorTab+" SET x=?, y=? WHERE idUser=? ", Val=[inObj[0],inObj[1],idUser];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; }
    else{
      callback(null, [Ou]);
    }
  });
}


ReqBE.prototype.logout=function(callback,inObj){
  var self=this, req=this.req, res=this.res;
  resetSessionMain.call(this); 
  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  self.mes('Logged out'); callback(null,[0]); return;
}



ReqBE.prototype.setUpCond=function(callback,inObj){
  var site=this.req.site, StrOrderFilt=site.StrOrderFilt, Prop=site.Prop;
  var Ou={};
  var tmp=setUpCond(site.KeySel, StrOrderFilt, Prop, inObj);
  copySome(this,tmp,['strCol', 'Where']);
  callback(null, [Ou]);
}


ReqBE.prototype.setUp=function(callback,inObj){  // Set up some properties etc.  (termCond, VPSize, pC, zoom, boShowDummy).
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; }  
    else{
      self.GRet.curTime=results[0][0].now; 
      if(boCalcZoom){
        self.GRet.boShowDummy=results[2][0].boShowDummy;
        self.GRet.nUserReal=results[3][0].nUserReal||0; 
        var distMin=results[5][0].distMin; 
        var minVP=Math.min(wVP,hVP);    
        if(distMin>0.001){
          var zFac=minVP/distMin;
          var z=Math.log2(zFac/2);
          zoom=Math.floor(z);
          zoom=bound(zoom,0,15);
        } else zoom=15;
      }
      self.zoom=zoom;
      callback(null, [Ou]);
    }
  });
}  

//ReqBE.prototype.addMapCond=function(callback,inObj){}

ReqBE.prototype.getList=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var TableName=site.TableName, vendorTab=TableName.vendorTab, userTab=TableName.userTab, teamTab=TableName.teamTab, reportTab=TableName.reportTab;
  var strCol=this.strCol;
  var Ou={};
  self.tab=[];self.NVendor=[0,0];
  var xl,xh,yl,yh;
  if(this.zoom>1){
    var projs=new MercatorProjection();
    //var sw, ne, tmp=projs.getBounds(inObj.pC,this.zoom,inObj.VPSize);   sw=tmp[0]; ne=tmp[1];  xl=sw[0]; xh=ne[0]; yl=ne[1]; yh=sw[1];
    var sw, ne, tmp=projs.getBounds(this.pC,this.zoom,this.VPSize);   sw=tmp[0]; ne=tmp[1];  xl=sw[0]; xh=ne[0]; yl=ne[1]; yh=sw[1];
  }  else {xl=0; xh=256; yl=0; yh=256;}
  if(xh-xl>256) {xl=0; xh=256;}
  var tmp=normalizeAng(xl,128,256); xl=tmp[0];   var tmp=normalizeAng(xh,128,256); xh=tmp[0];
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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var nFound=results[1][0].n;
      self.boUseOrdinaryList=nFound<=maxVendor;
      if(self.boUseOrdinaryList){
        for(var i=0;i<results[0].length;i++) {
          var row=results[0][i], len=site.KeySel.length; 
          var rowN=Array(len); //for(var j=0;j<len;j++) { rowN[j]=row[j];}
          for(var j=0;j<len;j++){ var key=site.KeySel[j]; rowN[j]=row[key]; }
          self.tab.push(rowN);
        }      
      } 
      self.Str.push("Found: "+nFound);  
      self.NVendor=[nFound, results[2][0].n];
      callback(null, [Ou]);
    }
  });
}

ReqBE.prototype.getGroupList=function(callback,inObj){  
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  self.groupTab=[];
  if(this.boUseOrdinaryList) {callback(null, [Ou]); return;}
  var Sql=[];
  //var zoomFac=Math.pow(2,this.zoom-4.3);
  var zoomFac=Math.pow(2,this.zoom-5);
  var WhereTmp=this.Where.concat([this.whereMap, "boShow=1", this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
  Sql.push("SELECT round(x*"+zoomFac+")/"+zoomFac+" AS roundX, round(y*"+zoomFac+")/"+zoomFac+" AS roundY, count(*) AS n FROM "+vendorTab+" v \
                 WHERE "+strCond+" GROUP BY roundX, roundY;");
  var sql=Sql.join('\n'), Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) { 
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      for(var i=0;i<results.length;i++) {var tmp=results[i]; self.groupTab.push([tmp.roundX,tmp.roundY,tmp.n]); }
      callback(null, [Ou]);
    }
  });

}

ReqBE.prototype.getHist=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site, vendorTab=site.TableName.vendorTab;
  var Ou={}
  var arg={strTableRef:vendorTab+' v', Ou:Ou, WhereExtra:[this.whereMap, "boShow=1", this.termCond]};  // , strTableRefCount:vendorTab+' v'
  copySome(arg, site, ['Prop','StrOrderFilt']);
  copySome(arg, this, ['Where','pool']); arg.strDBPrefix=site.siteName;

  getHist(arg, function(err, results){
    if(err){ self.mesEO(err); callback('exited');  return;;  }
    else {
      Ou=results;
      extend(Ou,{zoom:self.zoom, tab:self.tab, NVendor:self.NVendor, groupTab:self.groupTab});
      callback(null, [Ou]);
    }
  });
}



/*********************************************************************************************
 * Vendor-functions
 *********************************************************************************************/

ReqBE.prototype.VUpdate=function(callback,inObj){ // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName, Prop=site.Prop;
  var vendorTab=site.TableName.vendorTab, userTab=site.TableName.userTab;
  //var VendorUpdF=site.VendorUpdF;
  var Ou={}; 
  if(this.checkIfUserInfoFrIP()==0) { self.mes('No session'); callback(null,[Ou]); return;}

  var tmp=this.sessionMain.userInfoFrIP, IP=tmp.IP, idIP=tmp.idIP, nameIP=tmp.nameIP, image=tmp.image;

  var objVar=extend({},inObj);
  
  var boPrice='boPrice' in objVar; if(boPrice) delete objVar.boPrice;
  var boInsert='boInsert' in objVar; if(boInsert) delete objVar.boInsert;
  if('image' in objVar) delete objVar.image;
    
  var arrK=[], arrVal=[], arrUpdQM=[];
  for(var name in objVar){
    if(site.arrAllowed.indexOf(name)==-1) {callback('Forbidden input',0); return;}
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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{ 
      site.boGotNewVendors=Number(results[1][0].boInserted);
      site.nUser=Number(results[2][0].n);
      self.mes('Data updated');      
      callback(null, [Ou]);
    }
  });
}



ReqBE.prototype.VDelete=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No session'); callback(null,[Ou]); return;}
  if(!this.sessionMain.userInfoFrDB.vendor) { self.mes('Vendor does not exist'); callback(null,[Ou]); return;}
  
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  resetSessionMain.call(this);
  extend(this.GRet.userInfoFrDBUpd, specialistDefault); 

  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE !(idIP REGEXP '^Dummy');");
  var sql=Sql.join('\n');  
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      site.boGotNewVendors=1; // variabel should be called boNUsers changed or something..
      site.nUser=Number(results[1][0].n);
      self.mes('deleted');      
      callback(null, [Ou]);
    }
  });
}


ReqBE.prototype.VShow=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {  self.mes('No session'); callback(null, [Ou,'errFunc']); return;  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
	var coordinatePrecisionM=this.sessionMain.userInfoFrDB.vendor.coordinatePrecisionM;
  var tmp=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=tmp[0]; inObj[1]=tmp[1];

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET x=?, y=?, boShow=1, posTime=now(), histActive=histActive|1 WHERE idUser="+idUser+";");
  Val=[inObj[0],inObj[1]];
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      self.mes('Vendor visible');      
      callback(null, [Ou]);
    }
  });
}
ReqBE.prototype.VHide=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {   self.mes('No session'); callback(null, [Ou,'errFunc']); return;  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET boShow=0, posTime=0, histActive=histActive|1 WHERE idUser="+idUser+";");
  var sql=Sql.join('\n'); 
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      self.mes('Vendor hidden');      
      callback(null, [Ou]);
    }
  });
}



ReqBE.prototype.SUseRebateCode=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var vendorTab=site.TableName.vendorTab, rebateCodeTab=site.TableName.rebateCodeTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {  self.mes('No session'); callback(null, [Ou,'errFunc']); return;  }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var Sql=[], Val=[];
  var code=this.pool.escape(inObj.rebateCode);
  Sql.push("CALL "+siteName+"UseRebateCode("+code+", "+idUser+", @monthsToAdd, @boOK, @mess);");
  Sql.push("SELECT @monthsToAdd AS monthsToAdd, @boOK AS boOK, @mess AS mess;");
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var monthsToAdd=results[1][0].monthsToAdd, boOK=results[1][0].boOK, mess=results[1][0].mess;
      if(!boOK) self.mes(mess);
      else {
        if(monthsToAdd!=intMax) tmpStr=monthsToAdd+" months added "; else tmpStr='Free account';     self.mes(tmpStr);
      }
      callback(null, [Ou]);
    }
  });
}



ReqBE.prototype.VPaymentList=function(callback,inObj){ // needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var paymentTab=site.TableName.paymentTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) { self.mes('No session'); callback(null, [Ou,'errFunc']); return; }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser; 
  
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  var Sql=[], Val=[];
  var strCol="txn_id, payer_email, amount, currency, tax, VATNumber, monthsToAdd, UNIX_TIMESTAMP(payment_date) AS payment_date, UNIX_TIMESTAMP(created) AS created";
  Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strCol+" FROM "+paymentTab+" WHERE idUser="+idUser+" ORDER BY paymentNumber ASC LIMIT "+offset+", "+rowCount+";"); 

  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join('\n');
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var Ou=arrObj2TabNStrCol(results[0]);
      Ou.nCur=results[0].length;
      Ou.nTot=results[1][0].n;
      callback(null, [Ou]);
    }
  });
}


ReqBE.prototype.adminNVendor=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site, vendorTab=site.TableName.vendorTab;
  var sql="SELECT count(*) AS n FROM "+vendorTab, Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var Ou={}; Ou.n=results[0].n;
      callback(null,[Ou]);
    }
  });
}
ReqBE.prototype.adminMonitorClear=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  if(!this.sessionMain.userInfoFrDB.admin.boApproved) { self.mes('Not approved'); callback(null, [Ou,'errFunc']); return; }
  var sql="SELECT count(*) AS n FROM "+userTab+" WHERE !(idIP REGEXP '^Dummy');", Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      Ou.n=results[0].n;
      callback(null,[Ou]);
    }
  });
}


ReqBE.prototype.rebateCodeCreate=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var rebateCodeTab=site.TableName.rebateCodeTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {  self.mes('No session'); callback(null, [Ou]); return;  }
  var idUser=this.sessionMain.userInfoFrDB.marketer.idUser;
  if(!this.sessionMain.userInfoFrDB.marketer.boApproved) { self.mes('Marketer not approved'); callback(null, [Ou]); return; }
    
  var months=Number(inObj.months); 
  var code=genRandomString(rebateCodeLen);


  var sql="INSERT INTO "+rebateCodeTab+" ( idUser, months, code, created, validTill) VALUES (?,?,?, now(), DATE_ADD(now(), INTERVAL 1 MONTH))";
  var Val=[idUser, months, code];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      self.mes(months+" months, Code: "+code);
      callback(null, [Ou]);
    }
  });
}
ReqBE.prototype.reportUpdateComment=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var reportTab=site.TableName.reportTab;
  var Ou={};   
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No logged in'); callback(null, [Ou]); return; }
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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{ 
      var c=results[1].affectedRows, mestmp; if(c==1) mestmp="Entry inserted"; else if(c==2)  mestmp="Entry updated";
      var c=results[2].affectedRows; if(c==1) mestmp="Entry deleted"; else mestmp=c+ " entries deleted!?";
      var n=results[3][0].n; if(n==0) mestmp="All comments deleted";
      self.mes(mestmp);

      callback(null, [Ou]);
    }
  });
}
ReqBE.prototype.reportUpdateAnswer=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var reportTab=site.TableName.reportTab;
  var Ou={};   
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No session'); callback(null,[Ou]); return;}
  if(!this.sessionMain.userInfoFrDB.vendor) { self.mes('Vendor does not exist'); callback(null,[Ou]); return;}

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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var c=results.length; if(c>0) mestmp="Entry deleted";
      self.mes(mestmp);
      callback(null, [Ou]);
    }
  });
}

ReqBE.prototype.reportOneGet=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var userTab=site.TableName.userTab,  reportTab=site.TableName.reportTab;
  var Ou={};   
  //debugger
  var idReporter; if('idReporter' in inObj){ idReporter=inObj.idReporter;}
  else{
    if(this.sessionMain.userInfoFrDB.reporter) idReporter=this.sessionMain.userInfoFrDB.reporter.idUser;    else{ self.mes('Not Logged in'); callback(null, [Ou]); return; }
  }
  var idVendor; if('idVendor' in inObj){ idVendor=inObj.idVendor;}
  else{
    if(this.sessionMain.userInfoFrDB.vendor) idVendor=this.sessionMain.userInfoFrDB.vendor.idUser;    else{ self.mes('Not Logged in'); callback(null, [Ou]); return; }
  }
  var sql="SELECT comment, answer FROM "+userTab+" u JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idVendor=? AND idReporter=? "; 
  var Val=[idVendor,idReporter];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var c=results.length; 
      var mestmp; if(c>0){ Ou.row=results[0]; mestmp="Feedback fetched"; }else{ Ou.row={}; mestmp="No existing feedback";}
      self.mes(mestmp);
      callback(null, [Ou]);
    }
  });
}



ReqBE.prototype.reportVGet=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var reportTab=site.TableName.reportTab, userTab=site.TableName.userTab;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  
  var idVendor=inObj.idVendor;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS idReporter, nameIP, image, comment, answer, UNIX_TIMESTAMP(created) AS created FROM "+reportTab+" r JOIN "+userTab+" u ON r.idReporter=u.idUser WHERE idVendor=? ORDER BY created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idVendor);
  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join("\n ");
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var Ou=arrObj2TabNStrCol(results[0]);
      Ou.nCur=results[0].length; 
      Ou.nTot=results[1][0].n;
      callback(null,[Ou]);
    }
  });
}
ReqBE.prototype.reportRGet=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var TableName=site.TableName, userTab=TableName.userTab, vendorTab=TableName.vendorTab, reportTab=TableName.reportTab;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);

  var idReporter=inObj.idReporter;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS u.idUser, IP, idIP, image, displayName, boImgOwn, imTag, comment, answer, UNIX_TIMESTAMP(r.created) AS created FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idReporter=? ORDER BY r.created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idReporter); 
  Sql.push("SELECT FOUND_ROWS() AS n;"); 
  var sql=Sql.join("\n ");
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var Ou=arrObj2TabNStrCol(results[0]);
      Ou.nCur=results[0].length; 
      Ou.nTot=results[1][0].n;   
      //self.mes("Found: "+nCur);
      callback(null,[Ou]);
    }
  });
} 



ReqBE.prototype.teamSaveName=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var teamTab=site.TableName.teamTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No session'); callback(null,[Ou]); return;}
  var idUser=Number(this.sessionMain.userInfoFrDB.team.idUser);
  if(!this.sessionMain.userInfoFrDB.team.boApproved){self.mes('Team not approved'); callback(null,[Ou]); return;}

  var link=this.pool.escape(inObj.link);  
  var sql="UPDATE "+teamTab+" SET link=? WHERE idUser=?;", Val=[link, idUser];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      self.mes('Data saved');
      callback(null,[Ou]);
    }
  });
}
ReqBE.prototype.teamSave=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No session'); callback(null,[Ou]); return;}
  if(!this.sessionMain.userInfoFrDB.team.boApproved){ self.mes('Team not approved'); callback(null,[Ou]); return;}
  
  var idUser=Number(inObj.idUser),   boOn=Number(inObj.boOn); 
  var sql="UPDATE "+vendorTab+" SET idTeam=IF("+boOn+",idTeamWanted,0) WHERE idUser="+idUser+";", Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      self.mes('Data saved');
      callback(null,[Ou]);
    }
  });
}

ReqBE.prototype.teamLoad=function(callback,inObj){  // writing needSession
  var self=this, req=this.req, res=this.res, site=req.site;
  var userTab=site.TableName.userTab, vendorTab=site.TableName.vendorTab;
  var Ou={};  
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No session'); callback(null,[Ou]); return;}
  if(!this.sessionMain.userInfoFrDB.team) { self.mes('Team does not exist'); callback(null,[Ou]); return;}

  var idUser=this.sessionMain.userInfoFrDB.team.idUser;
  if(this.sessionMain.userInfoFrDB.team.boApproved==0){ self.mes('Team not approved'); callback(null,[Ou]); return;}
  
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
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var nRow=results.length;
      if(nRow==0) { self.mes('No vendors connected');  }
      else{
        Ou.tab=[];
        for(var i=0;i<nRow;i++) {
          var row=results[i], len=5;
          var rowN=Array(len); for(var j=0;j<len;j++) { rowN[j]=row[j];}
          Ou.tab.push(rowN);
        }
      }
      callback(null,[Ou]);
    }
  });
}


ReqBE.prototype.deleteImage=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var vendorImageTab=site.TableName.vendorImageTab, vendorTab=site.TableName.vendorTab;
  var Ou={};   
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No logged in'); callback(null,[Ou]); return;}
  if(!('userInfoFrDB' in this.sessionMain)) {self.mes('No account'); callback(null,[Ou]); return;}
  var idUser=Number(this.sessionMain.userInfoFrDB.vendor.idUser);

  var Sql=[];
  Sql.push("DELETE FROM "+vendorImageTab+" WHERE idUser="+idUser+";");
  Sql.push("UPDATE "+vendorTab+" SET boImgOwn=0 WHERE idUser="+idUser+";");
  var sql=Sql.join("\n "), Val=[];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      var nDel=results[0].affectedRows; 
      if(nDel==1) {self.mes('Image deleted'); } else { self.mes(nDel+" images deleted!?");}
      callback(null,[Ou]);
    }
  });
}


ReqBE.prototype.pubKeyStore=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site;
  var pubKeyTab=site.TableName.pubKeyTab;
  var Ou={};   
  if(this.checkIfUserInfoFrIP()==0) {self.mes('No logged in'); callback(null,[Ou]); return;}
  if(!('userInfoFrDB' in this.sessionMain)) {self.mes('No account'); callback(null,[Ou]); return; }
  var idUser=this.sessionMain.userInfoFrDB.vendor.idUser;
  var pubKey=inObj.pubKey;
  var sql="INSERT INTO "+pubKeyTab+" (idUser,pubKey) VALUES (?, ?) ON DUPLICATE KEY UPDATE pubKey=VALUES(pubKey), iSeq=0";
  var Val=[idUser,pubKey];
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{     
      var boOK=0, nUpd=results.affectedRows, mestmp; 
      if(nUpd==1) {boOK=1; mestmp="Key inserted"; } else if(nUpd==2) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="(same key)";}
      Ou.boOK=boOK;    Ou.strMess=mestmp;
      callback(null,[Ou]);
    }
  });
}


ReqBE.prototype.getSetting=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['payLev','boTerminationCheck','boShowTeam'];
  if(!isAWithinB(inObj,Str)) {self.mes('Illegal invariable'); callback(null,'getSetting'); return;}
  for(var i=0;i<inObj.length;i++){ var name=inObj[i]; Ou[name]=app[name]; }
  callback(null,[Ou]); return;
}
ReqBE.prototype.setSetting=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(this.sessionMain.userInfoFrDB.admin) StrApp=['payLev','boTerminationCheck','boShowTeam'];  
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { self.mes('Illegal invariable'); callback(null,'setSetting'); return;}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  callback(null,[Ou]); return;    
}

ReqBE.prototype.getDBSetting=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  if(!isAWithinB(inObj,['payLev','boTerminationCheck','boShowTeam'])) {self.mes('Illegal invariable'); callback(null,'getSetting'); return;}
  var strV=inObj.join("', '");
  var sql="SELECT * FROM "+settingTab+" WHERE name IN('"+strV+"')";
  var Val=[];  
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      for(var i=0; i<results.length;i++){ var tmp=results[i]; Ou[tmp.name]=tmp.value;  }
      callback(null,[Ou]);
    }
  }); 
}

ReqBE.prototype.setDBSetting=function(callback,inObj){ 
  var self=this, req=this.req, res=this.res, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=[];
  if(this.sessionMain.userInfoFrDB.admin) Str=['payLev','boTerminationCheck','boShowTeam','boGotNewVendors','nUser'];  
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { self.mes('Illegal invariable'); callback(null,'setSetting'); return;}

  var Sql=[], sqlA="INSERT INTO "+settingTab+" (name,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?";
  for(var name in inObj){
    var value=inObj[name];
    Sql.push(sqlA); Val.push(name,value,value);
    Ou[name]=value;
  }
  var sql=Sql.join("\n ");
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){self.mesEO(err); callback('exited');  return; } 
    else{
      for(var name in inObj){
        var value=inObj[name];        Ou[name]=value;
      }
      callback(null,[Ou]);
    }
  });
}




ReqBE.prototype.uploadImage=function(callback,inObj){
  var self=this, req=this.req, res=this.res, site=req.site, siteName=site.siteName;
  var Ou={};
  var fiber = Fiber.current;
  var regImg=RegExp("^(png|jpeg|jpg|gif|svg)$");

  var File=self.File;
  var n=File.length; self.mes("nFile: "+n);

  var file=File[0], tmpname=file.path, fileName=file.name; 
  var Match=RegExp('\\.(\\w{1,3})$').exec(fileName); 
  if(!Match){ Ou.strMessage="The file name should have a three or four letter extension, ex: \".xxx\""; callback(null,[Ou]); return; }
  var type=Match[1].toLowerCase(),data, boDoExit=0;
  fs.readFile(tmpname, function(err, buf) { //, this.encRead
    if(err){ boDoExit=1; self.mesEO(err);  }
    else data=buf;//.toString();
    fiber.run();
  });
  Fiber.yield();  if(boDoExit==1) {callback('exited'); return; }
  if(data.length==0){ self.mes("data.length==0"); callback(null,[Ou]); return; }

  if(!regImg.test(type)){ Ou.strMessage="Unrecognized file type: "+type; callback(null,[Ou]); return; }


  var semY=0, semCB=0, boDoExit=0;
  var myCollector=concat(function(buf){
    data=buf;
    if(semY) { fiber.run(); } semCB=1;
  }); 
  var streamImg=gm(data).autoOrient().resize(50, 50).stream(function streamOut(err, stdout, stderr) {
    if(err){ boDoExit=1; self.mesEO(err); return; } 
    stdout.pipe(myCollector); 
  });
  if(!semCB) { semY=1; Fiber.yield();}
  if(boDoExit==1) {callback('exited'); return; }


  var TableName=site.TableName, vendorTab=TableName.vendorTab, teamTab=TableName.teamTab, vendorImageTab=TableName.vendorImageTab, teamImageTab=TableName.teamImageTab;
  if(!('userInfoFrDB' in this.sessionMain)){  this.mesO("!('userInfoFrDB' in sessionMain)",'uploadImage'); return;}
  var kind=self.kind||'v';
  var strKind=kind=='v'?'vendor':'team', idUser=this.sessionMain.userInfoFrDB[strKind].idUser;
  
  console.log('uploadImage data.length: '+data.length);
  if(data.length==0) {self.mesEO('data.length==0');  callback('exited'); return; }
  
  var tab; if(kind=='v'){tab=vendorImageTab; }else tab=teamImageTab;
  var Sql=[], Val=[];
  Sql.push("REPLACE INTO "+tab+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  if(kind=='v'){      Sql.push("UPDATE "+vendorTab+" SET boImgOwn=1,imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  else{      Sql.push("UPDATE "+teamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  
  //var sql='INSERT INTO imgTab SET ?';
  var sql=Sql.join('\n'), boDoExit=0; 
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err){res.out500(err);  boDoExit=1;  } 
    fiber.run(); 
  });
  Fiber.yield();  if(boDoExit==1) {callback('exited'); return; }

  Ou.strMessage="Done";
  callback(null, [Ou]);
}



