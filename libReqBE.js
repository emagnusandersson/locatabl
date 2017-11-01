
// idplace:
//   client.js
//     $createUserSelectorDiv
//       $createUserDiv (calls createUser) (creates user with email and password)
//     $loginSelectorDiv
//       $formLogin (calls loginWEmail, setupById)
//       $idPLoginDiv (calls loginGetGraph, setupById)
//     $changePWPop (calls changePW)
//     $verifyEmailPop (calls verifyEmail)
//     $forgottPWPop (calls verifyPWReset)
//   libReqBE.js
//     createUser 
//     loginWEmail
//     changePW
//     verifyEmail (Sends an email)
//     verifyPWReset (Sends an email)
//   libReq.js
//     reqVerifyEmailReturn (Return from email)
//     reqVerifyPWResetReturn (Return from email)


// closebymarket:
//   client.js
//     $loginWLinkDiv (calls sendLoginLink)
//     $loginWEmailDiv (calls loginWEmail)
//   libReqBE.js
//     sendLoginLink (from $loginWLinkDiv, Sends an email)
//     loginWEmail (from $loginWEmailDiv)
//     createUser
//   libReq.js
//     reqLoginWLink (Return from email)



// closebymarketNew:
//   client.js
//     $loginSelectorDiv
//       $formLogin (calls loginWEmail or sendLoginLink) 
//     $createUserDiv (calls createUser) (creates user with email and password)
//     $changePWPop (calls changePW)
//     //$verifyEmailPop (calls verifyEmail)
//     $forgottPWPop (calls verifyPWReset)
//   libReqBE.js
//     sendLoginLink ( Sends an email)
//     createUser 
//     loginWEmail
//     changePW
//     verifyEmail (Sends an email)
//     verifyPWReset (Sends an email)
//   libReq.js
//     reqLoginWLink (Return from email)
//     reqVerifyEmailReturn (Return from email)
//     reqVerifyPWResetReturn (Return from email)



//           Sign in                               Create account
// [email]/[PW] [forgotPW]  | [FB]      Using password   |  Using Facebook


// $loginSelectorDiv
//       Sign in / Create account
// Using external |    Using                 
// ID-provider    | email/password
// (recommended)  |
//                |
//                |[email]
//     [FB]       |[PW][Login]
//                |[forgottPW] (A new password is generated) | [sendLoginLink] (Password is not changed)
//                |---------------
//                |[Create account]



// $createUserDiv
//Create account
//[Full name]
//[email]
//[PW]
//[PW Again]
//[createAccount]
////[sendVerifyEmailAndCreateAccountLink]

//        Sign in / Create account
//                | If you used to login with (idPlace or) password
//     [FB]       | (not available for new accounts)    
//                |    [email]
//                |    [sendLoginLink]
//                |
//



  // Session variables
//'str'+ucfirst(strAppName)+'Md5Config'

//req.sessionID+'_CSRFCode'+ucfirst(caller)
   //libReqBE->go, libReq->reqPubKeyStore  --->  libReqBE->go
   
//req.sessionID+'_UserInfoFrDB'
   //libReqBE->go, loginGetGraph, setupById, VDelete  --->  libReqBE->go
//req.sessionID+'_LoginIdP'
   //libReqBE->loginGetGraph  --->  libReqBE->go
//req.sessionID+'_LoginIdUser'  (idUser)
   //libReqBE->loginWEmail, libReq->reqLoginWLink, libReq->reqVerifyEmailNCreateUserReturn  --->  libReqBE->setupById


//code+'_LoginWLink'  (email)
   //libReqBE->sendLoginLink  --->  libReq->reqLoginWLink
   
//code+'_verifyEmailNCreateUser';     ({email:email, password:password, name:name})
   //libReqBE->sendVerifyEmailNCreateUserMessage  --->  libReq->reqVerifyEmailNCreateUserReturn
//code+'_verifyEmail'    (idUser)
   //libReqBE->verifyEmail  --->  libReq->reqVerifyEmailReturn
//code+'_verifyPWReset'   (email)
   //libReqBE->verifyPWReset  --->  libReq->reqVerifyPWResetReturn






//BE calls that need to transfer idUser to  setupById
//BE calls that precede setupById
//deleteImage
//SUseRebateCode (payDiv)
//VUpdate (vendorSettingDiv, priceSettingDiv)
//VHide (quickDiv)
//VIntroCB (vendorIntroDiv)
//RIntroCB (reporterIntroDiv)
//UUpdate (userSettingDiv)
//loginGetGraph (userSettingDiv, convertIDDiv, reportCommentButt, moreDiv)
//VUpdate (convertIDDiv, uploadPosNLoadTabStart)
//reportUpdateComment (reportCommentPop)
//(nothing really) (loadTabStart, firstAJAXCall, teamDiv)


"use strict"

/******************************************************************************
 * ReqBE
 ******************************************************************************/
var ReqBE=app.ReqBE=function(req, res){
  this.req=req; this.res=res; this.site=req.site; this.pool=DB[this.site.db].pool; this.Str=[]; 
  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
}

  // Method "mesO" and "mesEO" are only called from "go". Method "mes" can be called from any method.
ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(e){
    // Prepare an error-message for the browser.
  var strEBrowser;
  if(typeof e=='string'){strEBrowser=e; }
  else if(typeof e=='object'){
    if(e instanceof Error) {strEBrowser='message: ' + e.message; }
    else { strEBrowser=e.toString(); }
  }
  
    // Write message (and other data) to browser
  this.Str.push(strEBrowser);
  this.GRet.strMessageText=this.Str.join(', '); 
   
    // closebymarket-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  this.res.end(JSON.stringify(this.Out));  
}
ReqBE.prototype.mesEO=function(e){
    // Prepare an error-message for the browser and one for the error log.
  var StrELog=[], strEBrowser;
  if(typeof e=='string'){strEBrowser=e; StrELog.push(e);}
  else if(typeof e=='object'){
    if('syscal' in e) StrELog.push('syscal: '+e.syscal);
    if(e instanceof Error) {strEBrowser='name: '+e.name+', code: '+e.code+', message: ' + e.message; }
    else { strEBrowser=e.toString(); StrELog.push(strEBrowser); }
  }
    
  var strELog=StrELog.join('\n'); console.error(strELog);  // Write message to the error log
  if(e instanceof Error) { console.error(e);}
  
    // Write message (and other data) to browser
  this.Str.push(strEBrowser);
  this.GRet.strMessageText=this.Str.join(', ');
  
    // closebymarket-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  this.res.writeHead(500, {"Content-Type": "text/plain"}); 
  this.res.end(JSON.stringify(this.Out));
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
  else if(1){ this.mesO('send me a POST'); return; }
  else if(req.method=='GET'){
    var objUrl=url.parse(req.url), qs=objUrl.query||''; jsonInput=urldecode(qs);
  }

  try{ var beArr=JSON.parse(jsonInput); }catch(e){ this.mesEO(e);  return; }
  
  
  this.sessionUserInfoFrDB=yield *getRedis(flow, req.sessionID+'_UserInfoFrDB', true);
  if(!this.sessionUserInfoFrDB || typeof this.sessionUserInfoFrDB!='object'  ) {
    this.sessionUserInfoFrDB=extend({}, specialistDefault);
  }
  yield* setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);

  this.sessionLoginIdP=yield *getRedis(flow, req.sessionID+'_LoginIdP', true);
  //if(this.sessionLoginIdP ) { yield* setRedis(flow, req.sessionID+'_LoginIdP', this.sessionLoginIdP, maxLoginUnactivity); }
  if(this.sessionLoginIdP ) { yield* expireRedis(flow, req.sessionID+'_LoginIdP', maxLoginUnactivity); } else this.sessionLoginIdP={};
  
  
  
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
    arrCSRF=['UUpdate','VIntroCB','RIntroCB','VSetPosCond','VUpdate','VShow','VHide','VDelete','SUseRebateCode','teamLoad','teamSaveName','teamSave','rebateCodeCreate','adminMonitorClear',
    'reportUpdateComment','reportUpdateAnswer','setSetting','deleteImage', 'uploadImage','loginGetGraph', 'sendLoginLink', 'loginWEmail', 'changePW', 'verifyEmail', 'verifyPWReset', 'sendVerifyEmailNCreateUserMessage'];   //'createUser'   // Functions that changes something must check and refresh CSRF-code
    arrNoCSRF=['setupById','setUpCond','setUp','getList','getGroupList','getHist','VPaymentList','adminNVendor','reportOneGet','reportVGet','reportRGet','logout','getSetting'];  // ,'testA','testB'
    allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
    if(StrComp(StrInFunc,['setUpCond','setUp','getList','getGroupList','getHist']) || StrComp(StrInFunc,['getSetting','setupById','VSetPosCond', 'setUpCond','setUp','getList','getGroupList','getHist']))
        { boCheckCSRF=0; boSetNewCSRF=1; }
  }else if(caller=='pubKeyStore'){
    arrCSRF=['pubKeyStore','loginGetGraph'];   arrNoCSRF=['setupById','logout'];   allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0;i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }
    if(StrComp(StrInFunc,['setupById'])){ boCheckCSRF=0; boSetNewCSRF=1; }
  }else if(caller=='mergeID'){
    arrCSRF=['mergeID','loginGetGraph'];   arrNoCSRF=['setupById','logout'];   allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0;i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }
    if(StrComp(StrInFunc,['setupById'])){ boCheckCSRF=0; boSetNewCSRF=1; }

  }else {debugger; }

    // cecking/set CSRF-code
  var redisVar=req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode;
  if(boCheckCSRF){
    if(!CSRFIn){ this.mesO('CSRFCode not set (try reload page)'); return;}
    var tmp=yield* getRedis(flow, redisVar);
    if(CSRFIn!==tmp){ this.mesO('CSRFCode err (try reload page)'); return;}
  }
  if(boSetNewCSRF){
    var CSRFCode=randomHash();
    var tmp=yield* setRedis(flow, redisVar, CSRFCode, maxUnactivity);
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

  //for(var k=0; k<Func.length; k++){
    //var [func,inObj]=Func[k],   objT=yield* func.call(this, inObj);
    //var err=null;  if(typeof objT=='undefined') err='unknown error'; else if(objT instanceof(Error)) err=objT; else if(objT.err) err=objT.err;
    //if(err) { if(!res.finished) { this.mesEO(err); } return; }
    //else this.Out.dataArr.push(objT.result);
  //}


  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k],   [err, result]=yield* func.call(this, inObj);
    //if(typeof objT=='object') {    if('err' in objT) err=objT.err; else err=objT;    }    else if(typeof objT=='undefined') err='Error when calling BE-fun: '+k;    else err=objT;
    
    if(res.finished) return;
    else if(err){
      if(typeof err=='object' && err.name=='ErrorClient') this.mesO(err); else this.mesEO(err);     return;
    }
    else this.Out.dataArr.push(result);
  }
  this.mesO();
}


/******************************************************************************
 * sendLoginLink  and loginWEmail
 ******************************************************************************/

ReqBE.prototype.sendLoginLink=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site, userTab=site.TableName.userTab;

  var expirationTime=20*60;
  var Ou={};
  var email=inObj.email;

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE email=?;");
  Val.push(email);

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  if(results.length==0) { return [new ErrorClient('No such email in the database')];}
  
  var code=randomHash();
  var redisVar=code+'_LoginWLink';
  var tmp=yield* setRedis(flow, redisVar, email, expirationTime);
  
  var wwwSite=req.wwwSite;
  var uLink=req.strSchemeLong+wwwSite+'/'+leafLoginWLink+'?code='+code;
  
  var strTxt='<h3>Login link to '+wwwSite+'</h3> \n\
<p>Someone (maybe you) uses '+wwwSite+' and wants to login using '+email+'. Is this you, then click this link to login: <a href="'+uLink+'">'+uLink+'</a> .</p> \n\
<p>Otherwise neglect this message.</p>';
//<p>Note! The link stops working '+expirationTime/60+' minutes after the email was sent.</p>';
  
  if(boDbg) wwwSite="closeby.market";
  const msg = { to:email, from:'noreply@'+wwwSite, subject:'Login link',  html:strTxt};    sgMail.send(msg);
  this.mes('Email sent'); Ou.boOK=1;
  
  return [null, [Ou]];
}


ReqBE.prototype.loginWEmail=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, Ou={};
  var userTab=site.TableName.userTab;
  var Sql=[], Val=[];
  var StrRequired=['email', 'password'];
  for(var i=0; i<StrRequired.length; i++){      var tmp=StrRequired[i]; if(!(tmp in inObj)) { return [new ErrorClient('The parameter: '+tmp+' is required')]; }     }
  

  Sql.push("SELECT idUser, password FROM "+userTab+" WHERE email=?");
  Val.push(inObj.email);

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  
  if(results.length==0) return [new ErrorClient('Email not found')];
  var objT=results[0];
  if(objT.password!==inObj.password) { return [new ErrorClient('Wrong password')]; }
  var idUser=Number(objT.idUser);   yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);

  return [null, [Ou]];
}


ReqBE.prototype.sendVerifyEmailNCreateUserMessage=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var {name, email, password}=inObj;
  
    // Check reCaptcha with google
  var uGogCheck = "https://www.google.com/recaptcha/api/siteverify"; 
  var objForm={  secret:strReCaptchaSecretKey, response:inObj['g-recaptcha-response'], remoteip:req.connection.remoteAddress  };
  var semY=0, semCB=0, err, response, body;
  var reqStream=requestMod.post({url:uGogCheck, form:objForm}, function(errT, responseT, bodyT) { err=errT; response=responseT; body=bodyT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
  var buf=body;
  try{ var data = JSON.parse(buf.toString()); }catch(e){ return [e]; }
  //console.log('Data: ', data);
  if(!data.success) return [new ErrorClient('reCaptcha test not successfull')];
  
  if(!/\S+@\S+/.test(email)) return [new ErrorClient('Invalid email')]; 
    
  
    // Check if email exists
  var Sql=[], Val=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE email=?;");
  Val.push(email);
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  if(results.length) { return [new ErrorClient('Email already exists.')];}
  

    // Store temporarily
  var expirationTime=20*60;
  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmailNCreateUser';
  var tmp=yield* setRedis(flow, redisVar, {email:email, password:password, name:name}, expirationTime);
  var Ou={};

    // Send email
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailNCreateUserReturn+'?code='+code;
  var strTxt='<h3>Email verification / account creation on '+wwwSite+'</h3> \n\
<p>Someone (maybe you) uses '+wwwSite+' and claims that '+email+' is their email address and they want to become a user. Is this you? If so use the link below to create an account.</p> \n\
<p>Otherwise neglect this message.</p> \n\
<p><a href='+uVerification+'>'+uVerification+'</a></p>';
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';
  
  if(boDbg) wwwSite="closeby.market";
  const msg = { to: email, from: 'noreply@'+wwwSite, subject: 'Email verification / account creation', html: strTxt }; sgMail.send(msg);
  this.mes('Email sent');
  Ou.boOK=1;
  return [null, [Ou]];
}

//ReqBE.prototype.createUser=function*(inObj){ // writing needSession
  //var req=this.req, flow=req.flow, site=req.site;
  //var userTab=site.TableName.userTab;
  //var Ou={}; //debugger

    //// Check reCaptcha with google
  //var uGogCheck = "https://www.google.com/recaptcha/api/siteverify"; 
  //var objForm={  secret:strReCaptchaSecretKey, response:inObj['g-recaptcha-response'], remoteip:req.connection.remoteAddress  };
  //var semY=0, semCB=0, err, response, body;
  //var reqStream=requestMod.post({url:uGogCheck, form:objForm}, function(errT, responseT, bodyT) { err=errT; response=responseT; body=bodyT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
  //var buf=body;
  //try{ var data = JSON.parse(buf.toString()); }catch(e){ return [e]; }
  ////console.log('Data: ', data);
  //if(!data.success) return [new ErrorClient('reCaptcha test not successfull')];
  
  //if(!/\S+@\S+/.test(inObj.email)) return [new ErrorClient('Invalid email')]; 
  
  //var Sql=[]; 
  //Sql.push("INSERT INTO "+userTab+" SET email=?, nameIP=?, password=?, tCreated=now();");
  //var Val=[inObj.email, inObj.name, inObj.password];
  //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
  ////Sql.push("UPDATE "+userTab+" SET imageHash=LAST_INSERT_ID()%32 WHERE idUser=LAST_INSERT_ID();");

  //var sql=Sql.join('\n');
  //var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); 
  
  //var boOK, mestmp;
  //if(err && (typeof err=='object') && err.code=='ER_DUP_ENTRY'){boOK=0; mestmp='dup email';}
  //else if(err) return [err];
  //else{
    //boOK=1; mestmp="Done"; 
    //var idUser=this.sessionUserInfoFrDB.idUser=Number(results[1][0].idUser);
  //}
  //this.mes(mestmp);
  //extend(Ou, {boOK:boOK});
  //yield* setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  
  //return [null, [Ou]];
//}


ReqBE.prototype.changePW=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var userTab=site.TableName.userTab;
  var Ou={boOK:0};
  if(typeof this.sessionUserInfoFrDB!='object' || !('idUser' in this.sessionUserInfoFrDB.user)) { return [new ErrorClient('No session')];}
  var idUser=this.sessionUserInfoFrDB.user.idUser
  var passwordOld=inObj.passwordOld;
  var passwordNew=inObj.passwordNew;

  var Sql=[], Val=[];
  //Sql.push("UPDATE "+userTab+" SET password=? WHERE password=? AND idUser=?;");
  //Val.push(inObj.password, inObj.passwordOld, idUser);
  Sql.push("CALL "+siteName+"setPassword(?,?,?);"); Val.push(idUser, passwordOld, passwordNew);

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];

  var mess=results[0][0].mess;
  if(mess=='Password changed') Ou.boOK=1;
  this.mes(mess); 
  
  return [null, [Ou]];
}

ReqBE.prototype.verifyEmail=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  if(typeof this.sessionUserInfoFrDB!='object' || !('idUser' in this.sessionUserInfoFrDB.user)) { return [new ErrorClient('No session')];}
  var idUser=this.sessionUserInfoFrDB.user.idUser;

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmail';
  var tmp=yield* setRedis(flow, redisVar, idUser, expirationTime);
  var Ou={};

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE idUser=?;");
  Val.push(idUser);

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];

  if(results.length==0) { this.mes('No such idUser in the database'); return [null, [Ou]];}
  var email=results[0].email;
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailReturn+'?code='+code;
  var strTxt='<h3>Email verification on '+wwwSite+'</h3> \n\
<p>Someone (maybe you) uses '+wwwSite+' and claims that '+email+' is their email address. Is this you? If so use the link below to verify that you are the owner of this email address.</p> \n\
<p>Otherwise neglect this message.</p> \n\
<p><a href='+uVerification+'>'+uVerification+'</a></p>';
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';

  if(boDbg) wwwSite="closeby.market";
  const msg = { to: email, from: 'noreply@'+wwwSite, subject: 'Email verification', html: strTxt }; sgMail.send(msg);
  this.mes('Email sent');
  Ou.boOK=1;
  return [null, [Ou]];

}


ReqBE.prototype.verifyPWReset=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={boOK:0};

  var tmp='email'; if(!(tmp in inObj)) { this.mes('The parameter '+tmp+' is required'); return [null, [Ou]];}
  var email=inObj.email;

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE email=?;");
  Val.push(email);

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];

  if(results.length==0) { this.mes('No such email in the database'); return [null, [Ou]];}

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyPWReset';
  var tmp=yield* setRedis(flow, redisVar, email, expirationTime);

  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyPWResetReturn+'?code='+code;
  var strTxt='<h3>Password reset request on '+wwwSite+'</h3> \n\
<p>Someone (maybe you) tries to reset their '+wwwSite+' password and entered '+email+' as their email.</p> \n\
<p>Is this you, then use the link below to have a new password generated and sent to you.</p> \n\
<p>Otherwise neglect this message.</p> \n\
<p><a href='+uVerification+'>'+uVerification+'</a></p>';
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';
  
  if(boDbg) wwwSite="closeby.market";
  const msg = { to: email, from: 'noreply@'+wwwSite, subject: 'Password reset request', html: strTxt };  sgMail.send(msg);
  this.mes('Email sent'); Ou.boOK=1;
  return [null, [Ou]];
}


/******************************************************************************
 * loginGetGraph
 ******************************************************************************/
ReqBE.prototype.loginGetGraph=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, objQS=req.objQS;
  var strFun=inObj.fun;
  var Ou={};
  if(!this.sessionUserInfoFrDB){ this.sessionUserInfoFrDB=extend({},specialistDefault); yield *setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);  }
  

  var strIP=inObj.IP;
  var rootDomain=req.rootDomain, objIPCred=rootDomain[strIP];
  var uRedir=req.strSchemeLong+site.wwwLoginRet;
    // getToken
  var objForm={grant_type:'authorization_code', client_id:objIPCred.id, redirect_uri:uRedir, client_secret:objIPCred.secret, code:inObj.code};
  var uToGetToken=UrlToken[strIP]; 

  var arrT = Object.keys(objForm).map(function (key) { return key+'='+objForm[key]; }), strQuery=arrT.join('&'); 
  //if(strQuery.length) uToGetToken+='?'+strQuery;
  var semY=0, semCB=0, err, response, body;
  var reqStream=requestMod.post({url:uToGetToken, form: objForm},  function(errT, responseT, bodyT) { err=errT; response=responseT; body=bodyT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
  var buf=body;
 
  try{ var objT=JSON.parse(buf.toString()); }catch(e){ return [e]; }
  var access_token=this.access_token=objT.access_token;
  //var access_token=this.access_token=inObj.access_token;


    // Get Graph
  if(strIP=='fb') {
    var objForm={access_token:this.access_token, fields:"id,name,verified,picture,email"};
  }else if(strIP=='google') {
    var objForm={access_token:this.access_token, fields:"id,name,verified,image,email"};
  }else if(strIP=='idplace') {
    var objForm={access_token:this.access_token};
  } 
  var uGraph=UrlGraph[strIP];
  
  var arrT = Object.keys(objForm).map(function (key) { return key+'='+objForm[key]; }), strQuery=arrT.join('&'); 
  if(strQuery.length) uGraph+='?'+strQuery;
  var semY=0, semCB=0, err, response, body;
  var reqStream=requestMod.get(uGraph,  function(errT, responseT, bodyT) { err=errT; response=responseT; body=bodyT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
  var buf=body;
  

  try{ var objGraph=JSON.parse(buf.toString()); }catch(e){ return [e]; }
  this.objGraph=objGraph;

    // interpretGraph
  if('error' in objGraph) {var {type,message}=objGraph.error, tmp='Error accessing data from ID provider: '+type+' '+message+'<br>';  return [new Error(tmp)]; }

  var idFB, idIdPlace, idOpenId;
  if(strIP=='fb'){ 
    if(!objGraph.verified) { var tmp="Your facebook account is not verified. Try search internet for  \"How to verify facebook account\".";   return [new ErrorClient(tmp)];  }
    var idFB=objGraph.id, email=objGraph.email, nameIP=objGraph.name, image=objGraph.picture.data.url;
  }else if(strIP=='google'){
    var idGoogle=objGraph.id, email=objGraph.email, nameIP=objGraph.name.givenName+' '+objGraph.name.familyName, image=objGraph.image.url;
  }else if(strIP=='idplace'){
    var idIdPlace=objGraph.id, email=objGraph.email, nameIP=objGraph.name, image=objGraph.image;
  }

  if(typeof idFB=='undefined') { return [new Error("Error idFB is empty")];}
  if(typeof nameIP=='undefined' ) {nameIP=idFB;}
  this.sessionLoginIdP={IP:strIP, idFB:idFB, idIdPlace, idOpenId, email:email, nameIP:nameIP, image:image};
  yield *setRedis(flow, req.sessionID+'_LoginIdP', this.sessionLoginIdP, maxLoginUnactivity);
  
  
  var [err,con]=yield*mysqlGetConnection(flow, this.pool);  if(err) return [err];   this.con=con;
  var [err]=yield*mysqlStartTransaction(flow, con);  if(err) return [err];
  if(['vendorFun', 'reporterFun', 'teamFun', 'marketerFun', 'adminFun', 'refreshFun', 'mergeIDFun'].indexOf(strFun)!=-1){ 
    var [err, result]=yield *this[strFun](inObj);  if(err) return [err];
  }
  if(err){ yield*mysqlRollbackNRelease(flow, con); return [err]; } else{ [err]=yield*mysqlCommitNRelease(flow, con); if(err) return [err]; }
  return [null, [Ou]];
}

ReqBE.prototype.reporterFun=function*(){
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeTwo.call(this, objT); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.vendorFun=function*(){
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeTwo.call(this, objT); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.teamFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab, teamTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeTwo.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?,?,?,?,?,?,?, MD5(RAND())) \n\
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;");
  
  Sql.push("INSERT INTO "+teamTab+" (idUser,created) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  //var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.marketerFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab, marketerTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeTwo.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?,?,?,?,?,?,?, MD5(RAND())) \n\
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;");
  Sql.push("INSERT INTO "+marketerTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  //var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.adminFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab, adminTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeTwo.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?,?,?,?,?,?,?, MD5(RAND())) \n\
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;");
  Sql.push("INSERT INTO "+adminTab+" VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE created=VALUES(created);");
  var sql=Sql.join('\n');
  var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  //var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.refetchFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab, teamTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMergeThree.call(this, objT); if(err) return [err];
  
  var idUser=this.sessionUserInfoFrDB.user.idUser;
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image, idUser];
  Sql.push("UPDATE "+userTab+" SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=? WHERE idUser=?;");
  var sql=Sql.join('\n');
  var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  //var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  return [null, Ou];
}



ReqBE.prototype.setupById=function*(inObj){ //check  idFB (or idUser) against the vendor-table and return diverse data
"use strict"
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, Ou={};
  
  var StrRole=null; if(inObj && typeof inObj=='object' && 'Role' in inObj) StrRole=inObj.Role;
  
  var StrRoleAll=['vendor','team','marketer','admin','reporter'];
  if(typeof StrRole=='undefined' || !StrRole) StrRole=StrRoleAll; 
  if(typeof StrRole=='string') StrRole=[StrRole];

  var userInfoFrDBUpd={};
  
  var idUser=this.sessionUserInfoFrDB.user.idUser||null;
  var {idFB, idIdPlace, idOpenId}=this.sessionLoginIdP;
  if(!idUser) { idUser=yield* getRedis(flow, req.sessionID+'_LoginIdUser'); }
  var BoTest={};
  for(var i=0;i<StrRoleAll.length;i++) { var strRole=StrRoleAll[i]; BoTest[strRole]=StrRole.indexOf(strRole)!=-1; }
  var Sql=[], Val=[idUser, idFB, idIdPlace, idOpenId, BoTest.vendor, BoTest.team, BoTest.marketer, BoTest.admin, BoTest.reporter];
  Sql.push("CALL "+siteName+"GetUserInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, @OboOk, @Omess);");
  var sql=Sql.join('\n');
  
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var res=results[0], c=res.length; 
  if(c==1) {
    userInfoFrDBUpd.user=res[0];
    var res=results[1], c=res.length; if(BoTest.vendor) userInfoFrDBUpd.vendor=c==1?res[0]:0; //if(typeof userInfoFrDBUpd.vendor=='object') extend(userInfoFrDBUpd.vendor,userInfoFrDBU);
    var res=results[2]; if(BoTest.vendor && res.length && 'n' in res[0]  &&  userInfoFrDBUpd.vendor) userInfoFrDBUpd.vendor.nPayment=res[0].n;  
    var res=results[3], c=res.length; if(BoTest.team) userInfoFrDBUpd.team=c==1?res[0]:0; //if(typeof userInfoFrDBUpd.team=='object') extend(userInfoFrDBUpd.team,userInfoFrDBU);
    var res=results[4], c=res.length; if(BoTest.marketer) userInfoFrDBUpd.marketer=c==1?res[0]:0; //if(typeof userInfoFrDBUpd.marketer=='object') extend(userInfoFrDBUpd.marketer,userInfoFrDBU); 
    var res=results[5], c=res.length; if(BoTest.admin) userInfoFrDBUpd.admin=c==1?res[0]:0; //if(typeof userInfoFrDBUpd.admin=='object') extend(userInfoFrDBUpd.admin,userInfoFrDBU);
    var res=results[6]; if(BoTest.reporter ) {   var  c=res[0].n;  userInfoFrDBUpd.reporter=c?{idUser:userInfoFrDBUpd.user.idUser, c:c}:0;    }
  } else extend(userInfoFrDBUpd, specialistDefault);
  
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBUpd);   extend(this.sessionUserInfoFrDB, userInfoFrDBUpd);
  yield *setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  
  return [null, [Ou]];
}



ReqBE.prototype.VSetPosCond=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, Ou={};
 
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) {  return [null, [Ou]];}  // this.mes('No session');  // VSetPosCond is allways called when page is loaded (for vendors as well as any visitor) 
  var {idUser,coordinatePrecisionM}=vendor;
  var [xtmp,ytmp]=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=xtmp; inObj[1]=ytmp;

  var sql="UPDATE "+site.TableName.vendorTab+" SET x=?, y=? WHERE idUser=? ", Val=[inObj[0],inObj[1],idUser];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  return [null, [Ou]];
}


ReqBE.prototype.logout=function*(inObj){
  var req=this.req, flow=req.flow, Ou={};
  var tmp=yield* cmdRedis(flow, 'del',[req.sessionID+'_UserInfoFrDB', req.sessionID+'_LoginIdP', req.sessionID+'_LoginIdUser']);
  this.sessionLoginIdP={};  this.sessionUserInfoFrDB=extend({}, specialistDefault);  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return [null, [Ou]];
}



ReqBE.prototype.setUpCond=function*(inObj){
  var site=this.req.site, req=this.req, flow=req.flow, StrOrderFilt=site.StrOrderFilt, Prop=site.Prop;
  var Ou={};
  var tmp=setUpCond(site.KeySel, StrOrderFilt, Prop, inObj);
  copySome(this,tmp,['strCol', 'Where']);
  return [null, [Ou]];
}


ReqBE.prototype.setUp=function*(inObj){  // Set up some properties etc.  (termCond, VPSize, pC, zoom, boShowDummy).
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {userTab, vendorTab}=site.TableName;
  
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
    var whereDummyFilter="!(idOpenId REGEXP '^Dummy') OR idOpenID IS NULL";
    Sql.push("SELECT (@boShowDummy:=count(u.idUser)<1) AS boShowDummy FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser  WHERE boShow=1 AND ("+whereDummyFilter+");");
    Sql.push("SELECT count(u.idUser) AS nUserReal FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser  WHERE  "+whereDummyFilter+";");
    Sql.push("UPDATE "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser SET boShow=@boShowDummy, posTime=now() WHERE idOpenId REGEXP '^Dummy';");  

    
    //strCond=array_filter(Where).join(' AND '); if(strCond.length>0) strCond='AND '+strCond;
    var WhereTmp=this.Where.concat(["boShow=1",this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
    
    var xOpp, xAddTerm; if(xC>128) {xOpp=xC-128; xAddTerm="IF(x<"+xOpp+",256,0)";}  else {xOpp=xC+128;  xAddTerm="IF(x>"+xOpp+",-256,0)"; } // xOpp : x of opposite side of planet
    var tmp="min(greatest(abs(x+"+xAddTerm+"-"+xC+"),abs(y-"+yC+")))";
    Sql.push("SELECT "+tmp+" AS distMin FROM "+vendorTab+" v WHERE "+strCond+";");
  }
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
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
  return [null, [Ou]];
}  

//ReqBE.prototype.addMapCond=function*(inObj){}

ReqBE.prototype.getList=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {userTab, vendorTab, teamTab, reportTab, reportTab}=site.TableName;
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
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
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
  return [null, [Ou]];
}

ReqBE.prototype.getGroupList=function*(inObj){  
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  this.groupTab=[];
  if(this.boUseOrdinaryList) {return [null, [Ou]];}
  var Sql=[];
  //var zoomFac=Math.pow(2,this.zoom-4.3);
  var zoomFac=Math.pow(2,this.zoom-5);
  var WhereTmp=this.Where.concat([this.whereMap, "boShow=1", this.termCond]),  strCond=array_filter(WhereTmp).join(' AND ');
  Sql.push("SELECT round(x*"+zoomFac+")/"+zoomFac+" AS roundX, round(y*"+zoomFac+")/"+zoomFac+" AS roundY, count(*) AS n FROM "+vendorTab+" v \
                 WHERE "+strCond+" GROUP BY roundX, roundY;");
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  for(var i=0;i<results.length;i++) {var {roundX,roundY,n}=results[i]; this.groupTab.push([roundX,roundY,n]); }
  return [null, [Ou]];
}

ReqBE.prototype.getHist=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, vendorTab=site.TableName.vendorTab;
  var Ou={}
  var arg={strTableRef:vendorTab+' v', Ou:Ou, WhereExtra:[this.whereMap, "boShow=1", this.termCond]};  // , strTableRefCount:vendorTab+' v'
  copySome(arg, site, ['Prop','StrOrderFilt']);
  copySome(arg, this, ['Where']); arg.strDBPrefix=site.siteName;

  var [err, Hist]=yield* getHist(flow, this.pool, arg); if(err) return [err];
  Ou.Hist=Hist; copySome(Ou, this,['zoom', 'tab', 'NVendor', 'groupTab']);
  return [null, [Ou]];
}


/*********************************************************************************************
 * User-function
 *********************************************************************************************/

ReqBE.prototype.UUpdate=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;
  
  var Sql=[], Val=[];
  Val.push(inObj.email, idUser);
  Sql.push("UPDATE "+userTab+" SET email=? WHERE idUser=?;");
  
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var c=results.affectedRows, mestmp=c+" affected row"; if(c!=1) mestmp+='s';
  
  this.mes(mestmp);      
  return [null, [Ou]];
}


/*********************************************************************************************
 * Vendor-functions
 *********************************************************************************************/

ReqBE.prototype.VIntroCB=function*(inObj){ // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, Prop=site.Prop, {userTab, vendorTab}=site.TableName;
  var Ou={}; 
  var objT=this.sessionLoginIdP;  if(!objT) {this.mes('No session'); return [null, [Ou]]; }
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=objT;

  if(inObj.email) email=inObj.email;
  
    // An entry in userTab may exist if the user is a reporter. However an entry in vendorTab is something one can assume does not exist.
  var Sql=[], Val=[];
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) ) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=?, nameIP=?, image=?;");
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Val.push(idFB, idIdPlace, idOpenId, email, nameIP, image,   email, nameIP, image);
  Sql.push("INSERT INTO "+vendorTab+" (idUser,created, lastPriceChange, posTime, tLastWriteOfTA, histActive) VALUES (@idUser, now(), now(), now(), now(), 1 ) ON DUPLICATE KEY UPDATE idUser=idUser;");
  //Sql.push("SET OboInserted=(ROW_COUNT()=1);");  Sql.push("SELECT @boInserted AS boInserted;");
  Sql.push("SELECT @boInserted:=(ROW_COUNT()=1) AS boInserted;");

  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE !(idOpenId REGEXP '^Dummy') OR idOpenID IS NULL;");
  
  if(payLev==0) {
    Sql.push("UPDATE "+vendorTab+" SET nMonthsStartOffer='"+intMax+"', terminationDate=FROM_UNIXTIME("+intMax+") WHERE idUser =LAST_INSERT_ID() AND @boInserted;");  
  }
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var c=results[0][0].affectedRows; if(c!=1) return [new Error(c+" userTab rows affected")];
  var idUser=Number(results[1][0].idUser);    yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var boIns=site.boGotNewVendors=Number(results[3][0].boInserted);
  site.nUser=Number(results[4][0].n);
  var  tmpMes='Data '+(boIns?'inserted':'updated'); this.mes(tmpMes);
  return [null, [Ou]];
}


ReqBE.prototype.VUpdate=function*(inObj){ // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, Prop=site.Prop, {userTab, vendorTab}=site.TableName;
  //var VendorUpdF=site.VendorUpdF;
  var Ou={}; 
  var user=this.sessionUserInfoFrDB.user, objT;
  if(user) objT=user;  else if(this.sessionLoginIdP) objT=this.sessionLoginIdP;  else {this.mes('No session'); return [null, [Ou]]; }
  var {idUser, idFB, idIdPlace, idOpenId, email, nameIP, image}=objT; 
  if(typeof idUser=='undefined') {return [new Error('no idUser')];}

  var objVar=extend({},inObj);
  
  var boPrice='boPrice' in objVar; if(boPrice) delete objVar.boPrice;
  //var boInsert='boInsert' in objVar; if(boInsert) delete objVar.boInsert;
  if('image' in objVar) delete objVar.image;
    
  var arrK=[], arrVal=[], arrUpdQM=[];
  for(var name in objVar){
    if(site.arrAllowed.indexOf(name)==-1) {return [new Error('Forbidden input')];}
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

  var strTeamTmp='';     if('idTeamWanted' in objVar) {    var idTmp=Number(objVar.idTeamWanted);    strTeamTmp=", idTeamWanted="+idTmp+", idTeam= IF(idTeam="+idTmp+",idTeam,0)";      }
  var strPriceTmp='';  if(boPrice) strPriceTmp=', lastPriceChange=now()';
  var tmp=strUpdQM+" "+strPriceTmp+" "+strTeamTmp;
  if(tmp.length>2) {
    Sql.push("UPDATE "+vendorTab+" SET "+tmp+" WHERE idUser=?;");
    Val=Val.concat(arrVal); Val.push(idUser);
  }

  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes('Data updated');      
  return [null, [Ou]];
}



ReqBE.prototype.VDelete=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser; 
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  this.sessionUserInfoFrDB=extend({}, specialistDefault);    yield *setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  extend(this.GRet.userInfoFrDBUpd, specialistDefault); 

  Sql.push("SELECT count(*) AS n FROM "+userTab+" WHERE !(idOpenId REGEXP '^Dummy') OR idOpenID IS NULL;");
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  site.boGotNewVendors=1; // variabel should be called boNUsers changed or something..
  site.nUser=Number(results[1][0].n);
  this.mes('deleted');      
  return [null, [Ou]];
}


ReqBE.prototype.VShow=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var {idUser,coordinatePrecisionM}=vendor;
  var [xtmp,ytmp]=roundXY(coordinatePrecisionM,inObj[0],inObj[1]); inObj[0]=xtmp; inObj[1]=ytmp;

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET x=?, y=?, boShow=1, posTime=now(), histActive=histActive|1 WHERE idUser="+idUser+";");
  Val=[inObj[0],inObj[1]];
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes('Vendor visible');      
  return [null, [Ou]];
}
ReqBE.prototype.VHide=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var idUser=user.idUser; 

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne("+idUser+");"); 
  Sql.push("UPDATE "+vendorTab+" SET boShow=0, posTime=0, histActive=histActive|1 WHERE idUser="+idUser+";");
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes('Vendor hidden');      
  return [null, [Ou]];
}



ReqBE.prototype.SUseRebateCode=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, {vendorTab, rebateCodeTab}=site.TableName;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var idUser=user.idUser; 
  
  var Sql=[], Val=[];
  var code=this.pool.escape(inObj.rebateCode);
  Sql.push("CALL "+siteName+"UseRebateCode("+code+", "+idUser+", @monthsToAdd, @boOK, @mess);");
  Sql.push("SELECT @monthsToAdd AS monthsToAdd, @boOK AS boOK, @mess AS mess;");
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var monthsToAdd=results[1][0].monthsToAdd, boOK=results[1][0].boOK, mess=results[1][0].mess;
  if(!boOK) this.mes(mess);
  else {
    if(monthsToAdd!=intMax) tmpStr=monthsToAdd+" months added "; else tmpStr='Free account';     this.mes(tmpStr);
  }
  return [null, [Ou]];
}



ReqBE.prototype.VPaymentList=function*(inObj){ // needSession
  var req=this.req, flow=req.flow, site=req.site;
  var paymentTab=site.TableName.paymentTab;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var idUser=user.idUser; 

  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  var Sql=[], Val=[];
  var strCol="txn_id, payer_email, amount, currency, tax, VATNumber, monthsToAdd, UNIX_TIMESTAMP(payment_date) AS payment_date, UNIX_TIMESTAMP(created) AS created";
  Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strCol+" FROM "+paymentTab+" WHERE idUser="+idUser+" ORDER BY paymentNumber ASC LIMIT "+offset+", "+rowCount+";"); 

  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length;
  Ou.nTot=results[1][0].n;
  return [null, [Ou]];
}


ReqBE.prototype.adminNVendor=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site, vendorTab=site.TableName.vendorTab;
  var sql="SELECT count(*) AS n FROM "+vendorTab, Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var Ou={}; Ou.n=results[0].n;
  return [null, [Ou]];
}
ReqBE.prototype.adminMonitorClear=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  var {user, admin}=this.sessionUserInfoFrDB; if(!user || !admin) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  if(!admin.boApproved) { this.mes('Not approved'); return [null, [Ou,'errFunc']]; }
  var sql="SELECT count(*) AS n FROM "+userTab+" WHERE !(idOpenId REGEXP '^Dummy') OR idOpenID IS NULL;", Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  Ou.n=results[0].n;
  return [null, [Ou]];
}


ReqBE.prototype.rebateCodeCreate=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var rebateCodeTab=site.TableName.rebateCodeTab;
  var Ou={};
  var {user, marketer}=this.sessionUserInfoFrDB; if(!user || !marketer) { this.mes('No session'); return [null, [Ou]];}
  var {idUser,boApproved}=marketer;
  if(!boApproved) { this.mes('Marketer not approved'); return [null, [Ou]]; }
    
  var months=Number(inObj.months); 
  var code=genRandomString(rebateCodeLen);


  var sql="INSERT INTO "+rebateCodeTab+" ( idUser, months, code, created, validTill) VALUES (?,?,?, now(), DATE_ADD(now(), INTERVAL 1 MONTH))";
  var Val=[idUser, months, code];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes(months+" months, Code: "+code);
  return [null, [Ou]];
}


ReqBE.prototype.reportUpdateComment=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var {userTab,reportTab}=site.TableName;
  var Ou={};
  var objT=this.sessionUserInfoFrDB.user||this.sessionLoginIdP;  if(!objT) {this.mes('No session'); return [null, [Ou]]; }
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=objT;


  var idVendor=inObj.idVendor;
  var comment=inObj.comment;  comment=comment.substr(0,10000);
  if(comment.length==0) comment=null;

  var Sql=[], Val=[];
  Val.push(idFB, idIdPlace, idOpenId, email, nameIP, image,   email, nameIP, image);
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, password) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()) ) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=?, nameIP=?, image=?;");
  Sql.push("SELECT @idReporter:=LAST_INSERT_ID() AS idUser;");
  
  Sql.push("INSERT INTO "+reportTab+" (idVendor,idReporter,comment,created) VALUES (?,@idReporter,?,now()) ON DUPLICATE KEY UPDATE comment=?, modified=now();");
  Val.push(idVendor,comment,comment);
  Sql.push("DELETE FROM "+reportTab+" WHERE comment IS NULL AND answer IS NULL;");
  Sql.push("SELECT count(*) AS n FROM "+reportTab+" WHERE idReporter=@idReporter;"); 
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var StrMes=[];
  
  var idUser=Number(results[1][0].idUser);    yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var c=results[2].affectedRows; if(c==1) StrMes.push("Entry inserted"); else if(c==2) StrMes.push("Entry updated");
  var c=results[3].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  var n=results[4][0].n; if(n==0) StrMes.push("No comments remaining");

  
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);

  return [null, [Ou]];
}
ReqBE.prototype.reportUpdateAnswer=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site;
  var reportTab=site.TableName.reportTab;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou]];}

  var idReporter=inObj.idReporter;
  var idVendor=user.idUser;
  var answer=inObj.answer;  answer=answer.substr(0,10000);
  if(answer.length==0) answer=null;
  var Sql=[], Val=[];
  Sql.push("UPDATE "+reportTab+" SET answer=? WHERE idVendor=? AND idReporter=?;");
  Val.push(answer,idVendor,idReporter);
  Sql.push("DELETE FROM "+reportTab+" WHERE  comment IS NULL AND answer IS NULL;");
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var StrMes=[];
  var c=results[0].affectedRows; if(c==1) StrMes.push("Entry updated"); else if(c>1) StrMes.push(c+" entries updated");
  var c=results[1].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);
  return [null, [Ou]];
}

ReqBE.prototype.reportOneGet=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, reportTab}=site.TableName;
  var Ou={};   
  //debugger
  var {user, vendor, reporter}=this.sessionUserInfoFrDB; //if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idReporter, idVendor;
  if('idReporter' in inObj) idReporter=inObj.idReporter;  else if(reporter) idReporter=reporter.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  if('idVendor' in inObj) idVendor=inObj.idVendor; else if(vendor) idVendor=vendor.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  
  var sql="SELECT comment, answer FROM "+userTab+" u JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idVendor=? AND idReporter=? "; 
  var Val=[idVendor,idReporter];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var c=results.length; 
  var mestmp; if(c>0){ Ou.row=results[0]; mestmp="Feedback fetched"; }else{ Ou.row={}; mestmp="No existing feedback";}
  this.mes(mestmp);
  return [null, [Ou]];
}



ReqBE.prototype.reportVGet=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, reportTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  
  var idVendor=inObj.idVendor;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS idReporter, nameIP, image, comment, answer, UNIX_TIMESTAMP(created) AS created FROM "+reportTab+" r JOIN "+userTab+" u ON r.idReporter=u.idUser WHERE idVendor=? ORDER BY created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idVendor);
  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join("\n ");
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;
  return [null, [Ou]];
}
ReqBE.prototype.reportRGet=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, vendorTab, reportTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);

  var idReporter=inObj.idReporter;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS u.idUser, idFB, idIdPlace, idOpenId, image, displayName, boImgOwn, imTag, comment, answer, UNIX_TIMESTAMP(r.created) AS created FROM "+userTab+" u JOIN "+vendorTab+" v ON u.idUser=v.idUser JOIN "+reportTab+" r ON u.idUser=r.idVendor WHERE idReporter=? ORDER BY r.created DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idReporter); 
  Sql.push("SELECT FOUND_ROWS() AS n;"); 
  var sql=Sql.join("\n ");
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;   
  //this.mes("Found: "+nCur);
  return [null, [Ou]];
}



ReqBE.prototype.teamSaveName=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var teamTab=site.TableName.teamTab;
  var Ou={};
  var {user, team}=this.sessionUserInfoFrDB; if(!user || !team) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved}=team; if(!boApproved){this.mes('Team not approved'); return [null, [Ou]];}

  var link=this.pool.escape(inObj.link);  
  var sql="UPDATE "+teamTab+" SET link=? WHERE idUser=?;", Val=[link, idUser];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}
ReqBE.prototype.teamSave=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var vendorTab=site.TableName.vendorTab;
  var Ou={};
  var {user, team}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  if(!team.boApproved){ this.mes('Team not approved'); return [null, [Ou]];}
  
  var idUser=Number(inObj.idUser),   boOn=Number(inObj.boOn); 
  var sql="UPDATE "+vendorTab+" SET idTeam=IF(?,idTeamWanted,0) WHERE idUser=?;", Val=[boOn,idUser];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}

ReqBE.prototype.teamLoad=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, {userTab, vendorTab}=site.TableName;
  var Ou={};
  var {user, team}=this.sessionUserInfoFrDB; if(!user || !team) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved, imTag, link}=team;  if(boApproved==0){ this.mes('Team not approved'); return [null, [Ou]];}
  
  copySome(Ou, team, ['idUser', 'imTag', 'link']);

  var TmpCol=['u.idUser', 'idFB', 'idIdPlace', 'idOpenId', 'displayName', 'idTeam', 'imTag'];
  for(var i=0;i<TmpCol.length;i++){TmpCol[i]+=" AS '"+i+"'";} 
  var strCol=TmpCol.join(', ');
  var sql="SELECT "+strCol+" FROM "+vendorTab+" v JOIN "+userTab+" u ON v.idUser=u.idUser WHERE idTeamWanted=?";
  var Val=[idUser];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
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
  return [null, [Ou]];
}


ReqBE.prototype.deleteImage=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {vendorTab, vendorImageTab}=site.TableName;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;

  var Sql=[];
  Sql.push("DELETE FROM "+vendorImageTab+" WHERE idUser="+idUser+";");
  Sql.push("UPDATE "+vendorTab+" SET boImgOwn=0 WHERE idUser="+idUser+";");
  var sql=Sql.join("\n "), Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var nDel=results[0].affectedRows; 
  Ou.boOK=0; if(nDel==1) {Ou.boOK=1; this.mes('Image deleted'); } else { this.mes(nDel+" images deleted!?");}
  return [null, [Ou]];
}


ReqBE.prototype.pubKeyStore=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site;
  var pubKeyTab=site.TableName.pubKeyTab;
  var Ou={};
  var {user, vendor}=this.sessionUserInfoFrDB; if(!user || !vendor) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;
  var pubKey=inObj.pubKey;
  var sql="INSERT INTO "+pubKeyTab+" (idUser,pubKey) VALUES (?, ?) ON DUPLICATE KEY UPDATE pubKey=VALUES(pubKey), iSeq=0";
  var Val=[idUser,pubKey];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  var boOK=0, nUpd=results.affectedRows, mestmp; 
  if(nUpd==1) {boOK=1; mestmp="Key inserted"; } else if(nUpd==2) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="(same key)";}
  Ou.boOK=boOK;    Ou.strMess=mestmp;
  return [null, [Ou]];
}


ReqBE.prototype.getSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['payLev','boTerminationCheck','boShowTeam'];
  if(!isAWithinB(inObj,Str)) {this.mes('Illegal invariable'); return [null, [Ou]]; }
  for(var i=0;i<inObj.length;i++){ var name=inObj[i]; Ou[name]=app[name]; }
  return [null, [Ou]];
}
ReqBE.prototype.setSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(this.sessionUserInfoFrDB.admin) StrApp=['payLev','boTerminationCheck','boShowTeam'];  
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return [null, [Ou]];}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  return [null, [Ou]];    
}

ReqBE.prototype.getDBSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  if(!isAWithinB(inObj,['payLev','boTerminationCheck','boShowTeam'])) {this.mes('Illegal invariable'); return [null, [Ou]];}
  var strV=inObj.join("', '");
  var sql="SELECT * FROM "+settingTab+" WHERE name IN('"+strV+"')";
  var Val=[];
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  for(var i=0; i<results.length;i++){ var tmp=results[i]; Ou[tmp.name]=tmp.value;  }
  return [null, [Ou]];
}

ReqBE.prototype.setDBSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=[];
  if(this.sessionUserInfoFrDB.admin) Str=['payLev','boTerminationCheck','boShowTeam','boGotNewVendors','nUser'];  
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return [null, [Ou]];}

  var Sql=[], sqlA="INSERT INTO "+settingTab+" (name,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?";
  for(var name in inObj){
    var value=inObj[name];
    Sql.push(sqlA); Val.push(name,value,value);
    Ou[name]=value;
  }
  var sql=Sql.join("\n ");
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];
  for(var name in inObj){
    var value=inObj[name];        Ou[name]=value;
  }
  return [null, [Ou]];
}




ReqBE.prototype.uploadImage=function*(inObj){
  var self=this, req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {vendorTab, teamTab, teamImageTab, vendorImageTab}=site.TableName;
  var Ou={};
  var regImg=RegExp("^(png|jpeg|jpg|gif|svg)$");

  var File=this.File;
  var n=File.length; this.mes("nFile: "+n);

  var file=File[0], tmpname=file.path, fileName=file.name; 
  var Match=RegExp('\\.(\\w{1,3})$').exec(fileName); 
  if(!Match){ Ou.strMessage="The file name should have a three or four letter extension, ex: \".xxx\""; return [null, [Ou]]; }
  var type=Match[1].toLowerCase();
  var err, buf;  fs.readFile(tmpname, function(errT, bufT) { err=errT; buf=bufT;  flow.next();  }); yield;  if(err) return [err];
  var data=buf; 
  if(data.length==0){ this.mes("data.length==0"); return [null, [Ou]]; }

  if(!regImg.test(type)){ Ou.strMessage="Unrecognized file type: "+type; return [null, [Ou]]; }


    // autoOrient, create thumb
  var semY=0, semCB=0, err;
  var myCollector=concat(function(buf){  data=buf;  if(semY) flow.next(); semCB=1;  });
  var streamImg=gm(data).autoOrient().resize(50, 50).stream(function streamOut(errT, stdout, stderr) {
    err=errT; if(err){ if(semY) flow.next(); semCB=1; return; }
    stdout.pipe(myCollector);
  });
  if(!semCB) { semY=1; yield;}
  if(err) return [err];

  //var kind=this.kind||'v';
  var boTeam=this.kind=='t';

  var {user, vendor, team}=this.sessionUserInfoFrDB; if(!user || !vendor || (boTeam && !team)) { this.mes('No session'); return [null, [Ou]];}
  var strKind=boTeam?'team':'vendor', idUser=this.sessionUserInfoFrDB[strKind].idUser;
  
  console.log('uploadImage data.length: '+data.length);
  if(data.length==0) {  return [new Error('data.length==0')]; }
  
  var tab; if(boTeam) tab=teamImageTab; else tab=vendorImageTab;
  var Sql=[], Val=[];
  Sql.push("REPLACE INTO "+tab+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  if(boTeam){     Sql.push("UPDATE "+teamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser); }
  else {    Sql.push("UPDATE "+vendorTab+" SET boImgOwn=1,imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  
  //var sql='INSERT INTO imgTab SET ?';
  var sql=Sql.join('\n');
  var [err, results]=yield* myQueryGen(flow, sql, Val, this.pool); if(err) return [err];

  Ou.strMessage="Done";
  return [null, [Ou]];
}



