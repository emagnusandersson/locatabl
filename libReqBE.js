
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


// locatabl:
//   client.js
//     $loginWLinkDiv (calls sendLoginLink)
//     $loginWEmailDiv (calls loginWEmail)
//   libReqBE.js
//     sendLoginLink (from $loginWLinkDiv, Sends an email)
//     loginWEmail (from $loginWEmailDiv)
//     createUser
//   libReq.js
//     reqLoginWLink (Return from email)



// locatablNew:
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
   //libReqBE->go, libReq->reqKeyRemoteControlSave  --->  libReqBE->go
   
//req.sessionID+'_UserInfoFrDB'
   //libReqBE->go, loginGetGraph, setupById, UDelete  --->  libReqBE->go
//req.sessionID+'_LoginIdP'
   //libReqBE->loginGetGraph  --->  libReqBE->go
//req.sessionID+'_LoginIdUser'  (idUser)
   //libReqBE->loginWEmail, libReq->reqLoginWLink, libReq->reqVerifyEmailNCreateUserReturn  --->  libReqBE->setupById


//code+'_LoginWLink'  (email)
   //libReqBE->sendLoginLink  --->  libReq->reqLoginWLink
   
//code+'_verifyEmailNCreateUser';     ({email, password, name})
   //libReqBE->sendVerifyEmailNCreateUserMessage  --->  libReq->reqVerifyEmailNCreateUserReturn
//code+'_verifyEmail'    (idUser)
   //libReqBE->verifyEmail  --->  libReq->reqVerifyEmailReturn
//code+'_verifyPWReset'   (email)
   //libReqBE->verifyPWReset  --->  libReq->reqVerifyPWResetReturn


//req.sessionID+'_Main'




//BE calls that need to transfer idUser to  setupById
//BE calls that precede setupById
//deleteImage
//RUpdate (roleSettingDiv)
//RHide (quickDiv)
//RIntroCB (sellerIntroDiv)
//RIntroCB (complainerIntroDiv)
//UUpdate (userSettingDiv)
//loginGetGraph (userSettingDiv, convertIDDiv, complaintCommentButt, moreDiv)
//RUpdate (convertIDDiv, uploadPosNLoadTabStart)
//complaintUpdateComment (complaintCommentPop)
//(nothing really) (loadTabStart, firstAJAXCall, teamDiv)


"use strict"

/******************************************************************************
 * ReqBE
 ******************************************************************************/
//app.ReqBE=function(req, res){
  //this.req=req; this.res=res; this.site=req.site; this.Str=[];  //this.pool=DB[this.site.db].pool;
  //this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]}; this.GRet=this.Out.GRet; 
//}
app.ReqBE=function(objReqRes){
  Object.assign(this, objReqRes);
  this.site=this.req.site
  //this.Str=[];  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]};  this.GRet=this.Out.GRet; 
  this.Str=[];  this.dataArr=[];  this.GRet={userInfoFrDBUpd:{}}; 
}

  // Method "mesO" and "mesEO" are only called from "go". Method "mes" can be called from any method.
ReqBE.prototype.mes=function(str){ this.Str.push(str); }
ReqBE.prototype.mesO=function(e){
  var res=this.res;
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
   
    // locatabl-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  var str=serialize(objOut);
  if(str.length<lenGZ) res.end(str);
  else{
    res.setHeader("Content-Encoding", 'gzip');
    //res.setHeader('Content-Type', MimeType.txt);
    Streamify(str).pipe(zlib.createGzip()).pipe(res);
  }
}
ReqBE.prototype.mesEO=function(e, statusCode=500){
  var res=this.res;
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
  
    // locatabl-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  //res.writeHead(500, {"Content-Type": MimeType.txt}); 
  var objOut=copySome({}, this, ["dataArr", "GRet"]);
  res.end(serialize(objOut));
}



ReqBE.prototype.go=async function(){
  var {req, res}=this, {site}=req;
  
  var strT=req.headers['sec-fetch-site'];
  if(strT && strT!='same-origin') { this.mesEO(Error("sec-fetch-site header is not 'same-origin' ("+strT+")"));  return;}
  

  if('x-requested-with' in req.headers){
    var str=req.headers['x-requested-with'];   if(str!=="XMLHttpRequest") { this.mesEO(Error("x-requested-with: "+str));  return; }
  } else {  this.mesEO(Error("x-requested-with not set"));  return;  }

  if('referer' in req.headers) {
    var urlT=req.strSchemeLong+req.wwwSite, lTmp=urlT.length, referer=req.headers.referer, lMin=Math.min(lTmp, referer.length);
    if(referer.slice(0,lMin)!=urlT.slice(0,lMin)) { this.mesEO(Error('Referer does not match,  got: '+referer+', expected: '+urlT));  return;  }
  } else { this.mesEO(Error("Referer not set"));  return; }
  
  if(req.method!='POST'){ this.mesO('send me a POST'); return; }
  
  var jsonInput=await app.getPost.call(this, req);
  try{ var beArr=JSON.parse(jsonInput); }catch(e){ this.mesEO(e);  return; }
  
  if(!req.boGotSessionCookie) {
    var StrTmp=Array(beArr.length);
    for(var i=0;i<beArr.length;i++){  StrTmp[i]=beArr[i][0]; }
    console.log("Cookie not set, be.json: "+StrTmp.join(', '));
    console.log('user-agent: '+req.headers['user-agent']);
    console.log('host: '+req.headers.host);
    console.log('origin: '+req.headers.origin);
    console.log('referer: '+req.headers.referer);
    console.log('x-requested-with: '+req.headers['x-requested-with']);
    this.mesEO(Error('Cookie not set'));  return
  } // Should check for boCookieStrictOK but iOS seem not to send it when the ajax-request comes from javascript called from a cross-tab call (from a popup-window) (The problem occurs when loginGetGraph is called)
  // Hmm!! When tested 20211010 on the idPlace app (on IOS), it worked to log in (and that javascript is also called from a popup-window). So perhaps the iOS sends the strict cookie now.
  
  var [err,val]=await getRedis(req.sessionID+'_UserInfoFrDB', true); if(err) { this.mesEO(err);  return; }   this.sessionUserInfoFrDB=val;
  //var [err,value]=await getRedis(req.sessionID+'_UserInfoFrDB'); this.sessionUserInfoFrDB=JSON.parse(value);
  if(!this.sessionUserInfoFrDB || typeof this.sessionUserInfoFrDB!='object'  ) {
    this.sessionUserInfoFrDB=extend({}, userInfoFrDBZero);
  }
  await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);

  //var [err,val]=await getRedis(req.sessionID+'_LoginIdP', true);  if(err) { this.mesEO(err);  return; } this.sessionLoginIdP=val;
  //if(this.sessionLoginIdP ) { await expireRedis(req.sessionID+'_LoginIdP', maxLoginUnactivity); } else this.sessionLoginIdP={};

  //var [err, value]=await getRedis(req.sessionID+'_LoginIdP');  this.sessionLoginIdP=JSON.parse(value);
  //if(this.sessionLoginIdP ) { await expireRedis(req.sessionID+'_LoginIdP', maxLoginUnactivity); } else this.sessionLoginIdP={};
  
  ///var [err, value]=await cmdRedis('EVAL',[luaGetNExpire, 1, req.sessionID+'_LoginIdP', maxLoginUnactivity]);   this.sessionLoginIdP=value?JSON.parse(value):{};
  var [err, value]=await redis.myGetNExpire(req.sessionID+'_LoginIdP', maxLoginUnactivity).toNBP(); this.sessionLoginIdP=value?JSON.parse(value):{};
  
  //try{ var data = JSON.parse(value); }catch(e){ return [e]; }
  
  
  res.setHeader("Content-type", MimeType.json);
  res.setHeader("X-Robots-Tag", 'noindex, nofollow');
  


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
    arrCSRF=['UUpdate','USetIRoleActive', 'RIntroCB','VSetPosCond','RUpdate','RShow','RHide','UDelete','teamLoad','teamSaveName','teamSave',
    'complaintUpdateComment', 'complaintUpdateAnswer','setSetting', 'uploadImage', 'uploadImageB64', 'clearUserImage', 'clearTeamImage', 'loginGetGraph', 'sendLoginLink', 'loginWEmail', 'changePW', 'verifyEmail', 'verifyPWReset', 'sendVerifyEmailNCreateUserMessage', 'setWebPushSubcription', 'sendNotification', 'keyRemoteControlSave'];   //'createUser'   // Functions that changes something must check and refresh CSRF-code
    arrNoCSRF=['setupById','setUpCond','setUp','getList','getSingleUser','getGroupList','getHist','complaintOneGet','getComplaintsOnComplainee','getComplaintsFromComplainer','logout','getSetting'];  // ,'testA','testB'
    allowed=arrCSRF.concat(arrNoCSRF);

      // Assign boCheckCSRF and boSetNewCSRF
    boCheckCSRF=0; boSetNewCSRF=0;   for(var i=0; i<beArr.length; i++){ var row=beArr[i]; if(in_array(row[0],arrCSRF)) {  boCheckCSRF=1; boSetNewCSRF=1;}  }    
    if(StrComp(StrInFunc,['setUpCond','setUp','getList','getGroupList','getHist']) || StrComp(StrInFunc,['getSetting','setupById','VSetPosCond', 'setUpCond','setUp','getList','getGroupList','getHist']))
        { boCheckCSRF=0; boSetNewCSRF=1; }
    if(StrComp(StrInFunc,['RShow']) || StrComp(StrInFunc,['RHide'])) { boCheckCSRF=0; boSetNewCSRF=0; } // Request from service worker
  }else if(caller=='keyRemoteControlSave'){
    arrCSRF=['keyRemoteControlSave','loginGetGraph'];   arrNoCSRF=['setupById','logout'];   allowed=arrCSRF.concat(arrNoCSRF);

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
    var [err, CSRFStored]=await getRedis(redisVar); if(err) { this.mesEO(err);  return; }
    if(CSRFIn!==CSRFStored){ this.mesO('CSRFCode err (try reload page)'); return;}
  }
  if(boSetNewCSRF){
    var CSRFCode=randomHash();
    var tmp=await setRedis(redisVar, CSRFCode, maxUnactivity);
    this.GRet.CSRFCode=CSRFCode;
  }

  var Func=[];
  for(var k=0; k<beArr.length; k++){
    var strFun=beArr[k][0];
    if(in_array(strFun,allowed)) {
      var inObj=beArr[k][1],     tmpf; if(strFun in this) tmpf=this[strFun]; else tmpf=globalThis[strFun];
      if(typeof inObj=='undefined' || typeof inObj=='object') {} else {this.mesO('inObj should be of type object or undefined'); return;}
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k],   [err, result]=await func.call(this, inObj);
    if(res.finished) return;
    else if(err){
      if(typeof err=='object' && err.name=='ErrorClient') this.mesO(err); else this.mesEO(err);     return;
    }
    else this.dataArr.push(result);
  }
  this.mesO();
  
}


/******************************************************************************
 * sendLoginLink  and loginWEmail
 ******************************************************************************/

ReqBE.prototype.sendLoginLink=async function(inObj){
  var {req}=this, {site}=req, userTab=site.TableName.userTab;

  var expirationTime=20*60;
  var Ou={};
  var email=inObj.email;

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE email=?;");
  Val.push(email);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(results.length==0) { return [new ErrorClient('No such email in the database')];}
  
  var code=randomHash();
  var redisVar=code+'_LoginWLink';
  var tmp=await setRedis(redisVar, email, expirationTime);
  
  var wwwSite=req.wwwSite;
  var uLink=req.strSchemeLong+wwwSite+'/'+leafLoginWLink+'?code='+code;
  
  var strTxt=`<h3>Login link to `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and wants to login using `+email+`. Is this you, then click this link to login: <a href="`+uLink+`">`+uLink+`</a> .</p>
<p>Otherwise ignore this message.</p>`;
//<p>Note! The link stops working `+expirationTime/60+` minutes after the email was sent.</p>`;
  
  if(boDbg) wwwSite="locatabl.com";
  const msg = { to:email, from:emailRegisterdUser, subject:'Login link',  html:strTxt};

  // var [err]=await sgMail.send(msg).toNBP();
  // if(err) {console.log(err); return [new ErrorClient(err.body)]; }
  // this.mes('Email sent');

  let sendResult=await smtpTransport.sendMail(msg)
  this.mes(sendResult.response);
  
  Ou.boOK=1;
  
  return [null, [Ou]];
}


ReqBE.prototype.loginWEmail=async function(inObj){
  var {req}=this, {site}=req, Ou={};
  var {userTab}=site.TableName;
  var Sql=[], Val=[];
  var StrRequired=['email', 'password'];
  for(var i=0; i<StrRequired.length; i++){      var tmp=StrRequired[i]; if(!(tmp in inObj)) { return [new ErrorClient('The parameter: '+tmp+' is required')]; }     }
  

  Sql.push("SELECT idUser, hashPW AS password FROM "+userTab+" WHERE email=?");
  Val.push(inObj.email);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  
  if(results.length==0) return [new ErrorClient('Email not found')];
  var objT=results[0];
  if(objT.password!==inObj.password) { return [new ErrorClient('Wrong password')]; }
  var idUser=Number(objT.idUser);   await setRedis(req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);

  return [null, [Ou]];
}


ReqBE.prototype.sendVerifyEmailNCreateUserMessage=async function(inObj){
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  var {name, email, password, iRole}=inObj;

    // Check reCaptcha with google
  var strCaptchaIn=inObj['g-recaptcha-response'];
  var uGogCheck = "https://www.google.com/recaptcha/api/siteverify"; 
  var objForm={  secret:strReCaptchaSecretKey, response:strCaptchaIn, remoteip:req.connection.remoteAddress  };


  const params = new URLSearchParams(objForm);
  var [err,response]=await fetch(uGogCheck, {method:'POST', body:params}).toNBP(); if(err) return [err];
  var [err, data]=await response.json().toNBP(); if(err) return [err];

  //console.log('Data: ', data);
  if(!data.success) return [new ErrorClient('reCaptcha test not successfull')];
  
  if(!/\S+@\S+/.test(email)) return [new ErrorClient('Invalid email')]; 
    
  
    // Check if email exists
  var Sql=[], Val=[];
  Sql.push("SELECT * FROM "+userTab+" WHERE email=?;");
  Val.push(email);
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(results.length) { return [new ErrorClient('Account (email) already exists.')];}
  

    // Store temporarily
  var expirationTime=20*60;
  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmailNCreateUser';
  var tmp=await setRedis(redisVar, {email, password, name, iRole}, expirationTime);
  var Ou={};

    // Send email
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailNCreateUserReturn+'?code='+code;
  var strTxt=`<h3>Email verification / account creation on `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and claims that `+email+` is their email address and they want to become a user. Is this you? If so use the link below to create an account.</p>
<p>Otherwise ignore this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';
  
  if(boDbg) wwwSite="locatabl.com";
  const msg = { to:email, from:emailRegisterdUser, subject:'Email verification / account creation', html:strTxt };

  // var [err]=await sgMail.send(msg).toNBP();
  // if(err) {console.log(err); return [new ErrorClient(err.body)]; }
  // this.mes('Email sent');

  let sendResult=await smtpTransport.sendMail(msg)
  this.mes(sendResult.response);

  Ou.boOK=1;
  return [null, [Ou]];
}

//ReqBE.prototype.createUser=async function(inObj){ // writing needSession
  //var {req}=this, {site}=req;
  //var {userTab}=site.TableName;
  //var Ou={}; //debugger

    //// Check reCaptcha with google
  //var uGogCheck = "https://www.google.com/recaptcha/api/siteverify"; 
  //var objForm={  secret:strReCaptchaSecretKey, response:inObj['g-recaptcha-response'], remoteip:req.connection.remoteAddress  };

  // const params = new URLSearchParams(objForm);
  // var [err,response]=await fetch(uGogCheck, {method:'POST', body:params}).toNBP(); if(err) return [err];
  // var [err, data]=await response.json().toNBP(); if(err) return [err];
  
  ////console.log('Data: ', data);
  //if(!data.success) return [new ErrorClient('reCaptcha test not successfull')];
  
  //if(!/\S+@\S+/.test(inObj.email)) return [new ErrorClient('Invalid email')]; 
  
  //var Sql=[]; 
  //Sql.push("INSERT INTO "+userTab+" SET email=?, nameIP=?, password=?, tCreated=now();");
  //var Val=[myJSEscape(inObj.email), myJSEscape(inObj.name), inObj.password];
  //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
  ////Sql.push("UPDATE "+userTab+" SET imageHash=LAST_INSERT_ID()%32 WHERE idUser=LAST_INSERT_ID();");

  //var sql=Sql.join('\n');
  //var [err, results]=await this.myMySql.query(sql, Val); 
  
  //var boOK, mestmp;
  //if(err && (typeof err=='object') && err.code=='ER_DUP_ENTRY'){boOK=0; mestmp='dup email';}
  //else if(err) return [err];
  //else{
    //boOK=1; mestmp="Done"; 
    //var idUser=this.sessionUserInfoFrDB.idUser=Number(results[1][0].idUser);
  //}
  //this.mes(mestmp);
  //extend(Ou, {boOK});
  //await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  
  //return [null, [Ou]];
//}


ReqBE.prototype.changePW=async function(inObj){ 
  var {req}=this, {site}=req, {siteName}=site;
  var {userTab}=site.TableName;
  var Ou={boOK:0};
  //if(typeof this.sessionUserInfoFrDB!='object' || !('idUser' in this.sessionUserInfoFrDB.user)) { return [new ErrorClient('No session')];}
  //var idUser=this.sessionUserInfoFrDB.user.idUser;
  var {user}=this.sessionUserInfoFrDB; if(!user) { return [new ErrorClient('No session')];}
  var idUser=user.idUser;
  var passwordOld=inObj.passwordOld;
  var passwordNew=inObj.passwordNew;

  var Sql=[], Val=[];
  //Sql.push("UPDATE "+userTab+" SET hashPW=? WHERE hashPW=? AND idUser=?;");
  //Val.push(inObj.password, inObj.passwordOld, idUser);
  Sql.push("START TRANSACTION;");
  Sql.push("CALL "+siteName+"setPassword(?,?,?);"); Val.push(idUser, passwordOld, passwordNew);
  Sql.push("COMMIT;");

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  var mess=results[1][0].mess;
  if(mess=='Password changed') Ou.boOK=1;
  this.mes(mess); 
  
  return [null, [Ou]];
}

ReqBE.prototype.verifyEmail=async function(inObj){ 
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  //if(typeof this.sessionUserInfoFrDB!='object' || !('idUser' in this.sessionUserInfoFrDB.user)) { return [new ErrorClient('No session')];}
  //var idUser=this.sessionUserInfoFrDB.user.idUser;
  var {user}=this.sessionUserInfoFrDB; if(!user) { return [new ErrorClient('No session')];}
  var idUser=user.idUser;

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmail';
  var tmp=await setRedis(redisVar, idUser, expirationTime);
  var Ou={};

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE idUser=?;");
  Val.push(idUser);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  if(results.length==0) { this.mes('No such idUser in the database'); return [null, [Ou]];}
  var email=results[0].email;
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailReturn+'?code='+code;
  var strTxt=`<h3>Email verification on `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and claims that `+email+` is their email address. Is this you? If so use the link below to verify that you are the owner of this email address.</p>
<p>Otherwise ignore this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';

  if(boDbg) wwwSite="locatabl.com";
  const msg = { to:email, from:emailRegisterdUser, subject:'Email verification', html:strTxt };

  // var [err]=await sgMail.send(msg).toNBP();
  // if(err) {console.log(err); return [new ErrorClient(err.body)]; }
  // this.mes('Email sent');

  let sendResult=await smtpTransport.sendMail(msg)
  this.mes(sendResult.response);

  Ou.boOK=1;
  return [null, [Ou]];
}


ReqBE.prototype.verifyPWReset=async function(inObj){
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  var Ou={boOK:0};

  var tmp='email'; if(!(tmp in inObj)) { this.mes('The parameter '+tmp+' is required'); return [null, [Ou]];}
  var email=inObj.email;

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE email=?;");
  Val.push(email);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  if(results.length==0) { this.mes('No such email in the database'); return [null, [Ou]];}

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyPWReset';
  var tmp=await setRedis(redisVar, email, expirationTime);

  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyPWResetReturn+'?code='+code;
  var strTxt=`<h3>Password reset request on `+wwwSite+`</h3>
<p>Someone (maybe you) tries to reset the password for this email (`+email+`) on `+wwwSite+`.</p>
<p>Is this you, then use the link below to have a new password generated and sent to you.</p>
<p>Otherwise ignore this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
//<p>Note! The links stops working '+expirationTime/60+' minutes after the email was sent.</p>';
  
  if(boDbg) wwwSite="locatabl.com";
  const msg = { to:email, from:emailRegisterdUser, subject:'Password reset request', html:strTxt };

  if(err) {console.log(err); return [new ErrorClient(err.body)]; }

  this.mes('Email sent'); Ou.boOK=1;
  return [null, [Ou]];
}



/******************************************************************************
 * loginGetGraph
 ******************************************************************************/
ReqBE.prototype.loginGetGraph=async function(inObj){
  var {req}=this, {site, rootDomain}=req;
  var {fun:strFun,IP:strIP}=inObj;
  var Ou={};
  if(!this.sessionUserInfoFrDB){ this.sessionUserInfoFrDB=extend({},userInfoFrDBZero); await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);  }
  

  var objIPCred=rootDomain[strIP];
  var uRedir=req.strSchemeLong+site.wwwLoginRet;
    // getToken
  var objForm={grant_type:'authorization_code', client_id:objIPCred.id, redirect_uri:uRedir, client_secret:objIPCred.secret, code:inObj.code};

  var params = new URLSearchParams(objForm);
  var [err,response]=await fetch(UrlToken[strIP], {method:'POST', body:params}).toNBP(); if(err) return [err];
  var [err, objT]=await response.json().toNBP(); if(err) return [err];

  if('error' in objT) { var m=objT.error.message; return [Error(m)]; }
  var access_token=this.access_token=objT.access_token;
  //var access_token=this.access_token=inObj.access_token;


    // Get Graph
  var uGraph=UrlGraph[strIP];
  if(strIP=='fb') {
    var objForm={access_token:this.access_token, fields:"id,name,verified,picture,email"};
  }else if(strIP=='google') {
    var objForm={access_token:this.access_token, fields:"id,name,verified,image,email"};
  }else if(strIP=='idplace') {
    var objForm={access_token:this.access_token};
  } 

  var params = new URLSearchParams(objForm);
  var [err,response]=await fetch(uGraph, {method:'POST', body:params}).toNBP(); if(err) return [err];
  var [err, objGraph]=await response.json().toNBP(); if(err) return [err];


  this.objGraph=objGraph;

    // interpretGraph
  if('error' in objGraph) {var {type,message}=objGraph.error, tmp='Error accessing data from ID provider: '+type+' '+message+'\n';  return [Error(tmp)]; }

  var idFB, idIdPlace, idOpenId;
  if(strIP=='fb'){ 
    //if(!objGraph.verified) { var tmp="Your facebook account is not verified. Try search internet for  \"How to verify facebook account\".";   return [new ErrorClient(tmp)];  }
    var idFB=objGraph.id, email=objGraph.email, nameIP=objGraph.name, image=objGraph.picture.data.url;
  }else if(strIP=='google'){
    var idGoogle=objGraph.id, email=objGraph.email, nameIP=objGraph.name.givenName+' '+objGraph.name.familyName, image=objGraph.image.url;
  }else if(strIP=='idplace'){
    var idIdPlace=objGraph.id, email=objGraph.email, nameIP=objGraph.name, image=objGraph.image;
  }

  if(typeof email=='undefined') { return [new ErrorClient("Email is required (incase the site changes Id-provider)")];}
  if(typeof idFB=='undefined') { return [Error("Error idFB is empty")];}
  if(typeof nameIP=='undefined' ) {nameIP=idFB;}
  this.sessionLoginIdP={IP:strIP, idFB, idIdPlace, idOpenId, email, nameIP, image};
  await setRedis(req.sessionID+'_LoginIdP', this.sessionLoginIdP, maxLoginUnactivity);
  
  
  var [err]=await this.myMySql.startTransaction();  if(err) return [err]; 
  if(['userFun', 'complainerFun', 'buyerFun', 'sellerFun', 'teamFun', 'adminFun', 'refetchFun', 'mergeIDFun'].indexOf(strFun)!=-1){ 
    var [err, result]=await this[strFun](inObj);  //if(err) return [err];
  }
  if(err){ await this.myMySql.rollbackNRelease(); return [err]; } else{ [err]=await this.myMySql.commitNRelease(); if(err) return [err]; }
  return [null, [Ou]];
}


ReqBE.prototype.userFun=
ReqBE.prototype.complainerFun=
ReqBE.prototype.buyerFun=
ReqBE.prototype.sellerFun=async function(){
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=await accountMerge.call(this, objT); if(err) return [err];
  return [null, Ou];
}
//ReqBE.prototype.teamFun=async function(inObj){
  //var {req}=this, {site}=req, {userTab, buyerTeamTab, sellerTeamTab}=site.TableName;
  //var Ou={};
  //var objT=this.sessionLoginIdP, [err, results]=await accountMerge.call(this, objT); if(err) return [err];
  
  //var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  //var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  //Sql.push(`INSERT INTO `+userTab+` (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW) VALUES (?,?,?,?,?,?,?, MD5(RAND()))
  //ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;`);
  
  //if(inObj.strRole=='buyer'){
    //Sql.push("INSERT INTO "+buyerTeamTab+" (idUser,tCreated) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);");
  //}else{
    //Sql.push("INSERT INTO "+sellerTeamTab+" (idUser,tCreated) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);");
  //}
  //var sql=Sql.join('\n');
  //var [err, results, fields]=await this.myMySql.query(sql, Val);  if(err) return [err];
  ////var [err, results, fields]=yield*mysqlQuery(this.con, sql, Val);  if(err) return [err];
  //return [null, Ou];
//}
ReqBE.prototype.adminFun=async function(){
  var {req}=this, {site}=req, {userTab, adminTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=await accountMerge.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push(`INSERT INTO `+userTab+` (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW) VALUES (?,?,?,?,?,?,?, MD5(RAND()))
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;`);
  Sql.push(`INSERT INTO `+adminTab+` VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);`);
  var sql=Sql.join('\n');
  var [err, results, fields]=await this.myMySql.query(sql, Val);  if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.refetchFun=async function(){
  var {req}=this, {site}=req, {userTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=await accountMerge.call(this, objT); if(err) return [err];
  
  var idUser=this.sessionUserInfoFrDB.user.idUser;
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image, idUser];
  Sql.push(`UPDATE `+userTab+` SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=? WHERE idUser=?;`);
  var sql=Sql.join('\n');
  var [err, results, fields]=await this.myMySql.query(sql, Val);  if(err) return [err];
  return [null, Ou];
}



ReqBE.prototype.setupById=async function(inObj){ //check  idFB (or idUser) against the seller-table and return diverse data
  var {req}=this, {site}=req, {siteName}=site, Ou={};
  
  var StrRole=null; if(inObj && typeof inObj=='object' && 'Role' in inObj) StrRole=inObj.Role;
  
  if(typeof StrRole=='undefined' || !StrRole) StrRole=KeySpecialist.concat(); 
  if(typeof StrRole=='string') StrRole=[StrRole];
  var BoTest={};
  for(var i=0;i<KeySpecialist.length;i++) { var strRole=KeySpecialist[i]; BoTest[strRole]=StrRole.indexOf(strRole)!=-1; }
  
  var userInfoFrDBUpd={};
  
  var idUser=this.sessionUserInfoFrDB.user.idUser||null;
  var {idFB, idIdPlace, idOpenId}=this.sessionLoginIdP;
  if(!idUser) {  var [err,idUser]=await getRedis(req.sessionID+'_LoginIdUser'); if(err) return [err];  }
  //if(!idUser) { var [err,idUser]=await getRedis(req.sessionID+'_LoginIdUser'); }
    
  var Sql=[], Val=[idUser, idFB, idIdPlace, idOpenId, BoTest.buyer, BoTest.seller, BoTest.buyerTeam, BoTest.sellerTeam, BoTest.admin, BoTest.complainer, BoTest.complainee];
  Sql.push("CALL "+siteName+"GetUserInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
  var sql=Sql.join('\n');
  
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var res=results[0], c=res.length; 
  if(c==1) {
    userInfoFrDBUpd.user=res[0];
    var res=results[1], c=res.length; if(BoTest.buyer) userInfoFrDBUpd.buyer=c==1?res[0]:0;
    var res=results[2], c=res.length; if(BoTest.seller) userInfoFrDBUpd.seller=c==1?res[0]:0;
    var res=results[3], c=res.length; if(BoTest.buyerTeam) userInfoFrDBUpd.buyerTeam=c==1?res[0]:0;
    var res=results[4], c=res.length; if(BoTest.sellerTeam) userInfoFrDBUpd.sellerTeam=c==1?res[0]:0;
    var res=results[5], c=res.length; if(BoTest.admin) userInfoFrDBUpd.admin=c==1?res[0]:0;
    var n=results[6][0].n;   if(BoTest.complainer) userInfoFrDBUpd.complainer=n?{idUser:userInfoFrDBUpd.user.idUser, n}:0; 
    var n=results[7][0].n;   if(BoTest.complainee) userInfoFrDBUpd.complainee=n?{idUser:userInfoFrDBUpd.user.idUser, n}:0;  
  } else extend(userInfoFrDBUpd, userInfoFrDBZero);
  
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBUpd);   extend(this.sessionUserInfoFrDB, userInfoFrDBUpd);
  await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  
  return [null, [Ou]];
}

ReqBE.prototype.VSetPosCond=async function(inObj){  // writing needSession
  var {req}=this, {site}=req, Ou={}, {buyerTab, sellerTab}=site.TableName;
  var {user, buyer, seller}=this.sessionUserInfoFrDB; if(!buyer && !seller) {  return [null, [Ou]];}  // this.mes('No session');  // VSetPosCond is allways called when page is loaded (for sellers as well as any visitor) 
  var {x,y}=inObj;
  var projs=new MercatorProjection(),  lat=projs.fromYToLat(y);
  var strGeoHash=GeoHash.pWC2GeoHash({x,y}), bigIntGeoHash=BigInt('0b'+strGeoHash);
  if(seller){
    var {idUser,coordinatePrecisionM}=seller;
    //var [xtmp,ytmp]=roundXY(coordinatePrecisionM, x, y, lat);
    var [xtmp,ytmp]=roundNObscure(coordinatePrecisionM, x, y, lat);
    var sql="UPDATE "+sellerTab+" SET x=?, y=?, geoHash=? WHERE idUser=? ", Val=[xtmp,ytmp,bigIntGeoHash,idUser];
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  }
  if(buyer){
    var {idUser,coordinatePrecisionM}=buyer;
    //var [xtmp,ytmp]=roundXY(coordinatePrecisionM, x, y, lat);
    var [xtmp,ytmp]=roundNObscure(coordinatePrecisionM, x, y, lat);
    var sql="UPDATE "+buyerTab+" SET x=?, y=?, geoHash=? WHERE idUser=? ", Val=[xtmp,ytmp,bigIntGeoHash,idUser];
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  }
  return [null, [Ou]];
}


ReqBE.prototype.logout=async function(inObj){
  var {req}=this, Ou={};
  var [err,tmp]=await delRedis(req.sessionID+'_UserInfoFrDB', req.sessionID+'_LoginIdP', req.sessionID+'_LoginIdUser');
  this.sessionLoginIdP={};  this.sessionUserInfoFrDB=extend({}, userInfoFrDBZero);  this.GRet.userInfoFrDBUpd=extend({},userInfoFrDBZero);
  this.mes('Logged out'); return [null, [Ou]];
}

ReqBE.prototype.setUpCond=async function(inObj){
  var {req}=this, {site}=req, {ORole}=site;

    // Check OFilt input
  if(!(inObj.OFilt instanceof Array)) return [new ErrorClient('!(inObj.OFilt instanceof Array)')]; 
  if(typeof inObj.OFilt[0]!='object') return [new ErrorClient('typeof inObj.OFilt[0]!="object"')]; 
  if(typeof inObj.OFilt[1]!='object') return [new ErrorClient('typeof inObj.OFilt[1]!="object"')]; 
  
  this.OFilt=inObj.OFilt;
  
  var Ou={};  this.OQueryPart=[];
  for(var i=0;i<2;i++){
    var oR=ORole[i],  arg={Prop:oR.Prop, Filt:inObj.OFilt[i]}; //KeySel:oR.KeySel, 
    this.OQueryPart[i]=setUpCond(arg);
  }
  return [null, [Ou]];
} 
ReqBE.prototype.setUp=async function(inObj){  // Set up some properties etc.  (VPSize, pC, zoom).
  var {req}=this, {site}=req, {siteName}=site, {userTab, buyerTab, sellerTab}=site.TableName;
  
  var Ou={},  Sql=[];
  Sql.push("SELECT UNIX_TIMESTAMP(now()) AS now;");

  //var zoom=Number(inObj.zoom), boCalcZoom=zoom==-1; 
  var zoom=Number(inObj.zoom), boCalcZoom=!('zoom' in inObj);
  this.VPSize=inObj.VPSize;  
  this.pC=inObj.pC; var xC=Number(this.pC.x), yC=Number(this.pC.y), wVP=Number(this.VPSize[0]), hVP=Number(this.VPSize[1]); 
  //Sql.push("SET @xC="+xC+"; SET @yC="+yC+"; SET @wVP="+wVP+"; SET @hVP="+hVP+";
  
  Sql.push("CALL "+siteName+"IFunPoll("+timeOutAccumulatedUpdate+");"); 

  if(boCalcZoom){  
    //Sql.push("SELECT count(u.idUser) AS nBuyerReal FROM "+userTab+" u JOIN "+buyerTab+" ro ON u.idUser=ro.idUser;");
    //Sql.push("SELECT count(u.idUser) AS nSellerReal FROM "+userTab+" u JOIN "+sellerTab+" ro ON u.idUser=ro.idUser;");
    //Sql.push("SELECT count(*) AS nBuyerReal FROM "+buyerTab+";");
    //Sql.push("SELECT count(*) AS nSellerReal FROM "+sellerTab+";");
    Sql.push('SELECT AUTO_INCREMENT AS idAutoIncrement FROM information_schema.TABLES WHERE TABLE_SCHEMA = "mmm" AND TABLE_NAME = "'+userTab+'";');
    
 
    var WhereTmpB=this.OQueryPart[0].Where.concat("boShow=1", "now()<tHide"),  strCondB=array_filter(WhereTmpB).join(' AND ');
    var WhereTmpS=this.OQueryPart[1].Where.concat("boShow=1", "now()<tHide"),  strCondS=array_filter(WhereTmpS).join(' AND ');
    
    var xOpp, xAddTerm; if(xC>128) {xOpp=xC-128; xAddTerm="IF(x<"+xOpp+",256,0)";}  else {xOpp=xC+128;  xAddTerm="IF(x>"+xOpp+",-256,0)"; } // xOpp : x of opposite side of planet
    var tmp="MIN(GREATEST(ABS(x+"+xAddTerm+"-"+xC+"),ABS(y-"+yC+")))";
    Sql.push("SELECT "+tmp+" AS distMin FROM "+buyerTab+" ro WHERE "+strCondB+";");
    Sql.push("SELECT "+tmp+" AS distMin FROM "+sellerTab+" ro WHERE "+strCondS+";");
  }
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  this.GRet.curTime=results[0][0].now; 
  if(boCalcZoom){
    //this.GRet.nBuyerReal=results[2][0].nBuyerReal||0; 
    //this.GRet.nSellerReal=results[3][0].nSellerReal||0; 
    this.GRet.idAutoIncrement=results[2][0].idAutoIncrement||0; 
    var distMinB=results[3][0].distMin,   distMinS=results[4][0].distMin;
    if(distMinB===null) distMinB=intMax;  if(distMinS===null) distMinS=intMax;
    var distMin=Math.min(distMinB,distMinS);  
    var minVP=Math.min(wVP,hVP);    
    if(distMin>0.001){
      var zFac=minVP/distMin;
      var z=Math.log2(zFac/2);
      zoom=Math.floor(z);
      zoom=bound(zoom,0,15);
    } else zoom=4; //zoom=15;
  }
  this.zoom=zoom;
  Ou.zoom=zoom;
  return [null, [Ou]];
}

//dydx=hVP/wVP;
//Sql.push("SELECT x, y FROM "+buyerTab+" ro WHERE geoHash<=? AND "+strCondB+" UNION ");
//Sql.push("SELECT x, y FROM "+sellerTab+" ro WHERE geoHash<=? AND "+strCondS+" UNION ");
//Sql.push("SELECT x, y FROM "+buyerTab+" ro WHERE geoHash>? AND "+strCondB+" UNION ");
//Sql.push("SELECT x, y FROM "+sellerTab+" ro WHERE geoHash>? AND "+strCondS+";");
  //var sql=Sql.join('\n'), Val=[strGeoHash, strGeoHash, strGeoHash, strGeoHash];
  //var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  //var fitBest=Infinity, xBest, yBest;
  //for(var i=0;i<results.length;i++){
    //var {x,y}=results[i], xDist=Math.abs(x+(x<xOpp?256:0)-xC), yDist=Math.abs(y-yC), fit=Math.max(xDist, yDist/dydx);
    //if(fit<fitBest) {fitBest=fit; xBest=xDist; yBest=yDist; }
  //} 

    
//ReqBE.prototype.addMapCond=async function(inObj){}


ReqBE.prototype.getList=async function(inObj){
  var {req}=this, {site}=req, {siteName}=site, {userTab, sellerTab, sellerTeamTab, buyerTab, buyerTeamTab, complaintTab}=site.TableName;

  var Ou={};
  var xl,xh,yl,yh,xho,yho;  // o for "open set" 
  if(this.zoom<=1){xl=0; xh=256; yl=0; yh=256; }
  else{
    var projs=new MercatorProjection();
    //var {sw, ne}=projs.getBounds(this.pC,this.zoom,this.VPSize); xl=sw.x; xh=ne.x; yl=ne.y; yh=sw.y;
    var [xl, xh, yl, yh]=projs.getBounds(this.pC,this.zoom,this.VPSize);
    if(xh-xl>256) {xl=0; xh=256; xho=wcUpperLim;}
    [xl]=normalizeAng(xl,128,256);   [xh]=normalizeAng(xh,128,256);
    var xl=bound(xl,0,256), xh=bound(xh,0,256), yl=bound(yl,0,256), yh=bound(yh,0,256);
    //var xl=bound(xl,0,256), xh=bound(xh,0), yl=bound(yl,0,256), yh=bound(yh,0);
  }
  xho=xh;yho=yh; if(xh==256) xho=wcUpperLim;  if(yh==256) yho=wcUpperLim;
  var strXCond=(xl<xh)?("x>="+xl+" AND x<"+xh):("(x>="+xl+" OR x<"+xh+")");
  this.whereMap="y>="+yl+" AND y<"+yh+" AND "+strXCond;
  
  
    // Add geoHash condition
  var arrInp=[xl,xho,yl,yho];
  arrInp=arrInp.map((a,i)=>{a=wc2uint32(a); if(i%2) a-=1; return a;}); // Interpret upper limits as the first number outside the range.
  var {arrRangeHash, arrBigIntHash, arrBigIntHashSta, arrBigIntHashEnd, arrRange, arrRangeStr, IntPotSizeLev, nW, nH }=GeoHash.getRectangleSelection(...arrInp);
  var WhereGeoHash=[]
  for(var i=0;i<arrRangeHash.length;i++){
    var {IntStart:{x:xSta,y:ySta},IntEnd:{x:xEnd,y:yEnd}}=arrRange[i];
    //var nPad=10;  console.log(xSta.toString().padStart(nPad)+','+ySta.toString().padStart(nPad)+' '+xEnd.toString().padStart(nPad)+','+yEnd.toString().padStart(nPad));
    //console.log(arrRangeHash[i].join(',')+': '+arrBigIntHashSta[i].toString().padStart(20)+' '+arrBigIntHashEnd[i].toString().padStart(20));
    WhereGeoHash.push('(geoHash>='+arrBigIntHashSta[i] + ' AND ' + 'geoHash<='+(arrBigIntHashEnd[i]) + ')');
  }
  var whereGeoHash=WhereGeoHash.join(' OR '); if(WhereGeoHash.length>1) whereGeoHash='( '+whereGeoHash+' )';
  this.whereMap+=' AND '+whereGeoHash;
  
  var Sql=[];
  for(var i=0;i<2;i++){
    var iRole=i;
    var oRole=site.ORole[iRole];
    var roleTab=iRole?sellerTab:buyerTab,    roleTeamTab=iRole?sellerTeamTab:buyerTeamTab;
    
    var WhereTmp=this.OQueryPart[i].Where.concat(this.whereMap, "boShow=1", "now()<tHide"),  strCond=array_filter(WhereTmp).join(' AND ');
    //var strColT=this.OQueryPart[i].strCol;
    var sqlColT=oRole.sqlColList;
//Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strColT+" FROM (("+roleTab+" ro JOIN "+userTab+" u ON ro.idUser=u.idUser) LEFT JOIN "+roleTeamTab+" tea on tea.idUser=ro.idTeam) LEFT JOIN "+complaintTab+" rb ON rb.idComplainee=ro.idUser WHERE "+strCond+" GROUP BY ro.idUser ORDER BY tPos DESC LIMIT 0, "+maxList+";");
    Sql.push("SELECT SQL_CALC_FOUND_ROWS "+sqlColT+" FROM ("+roleTab+" ro JOIN "+userTab+" u ON ro.idUser=u.idUser) LEFT JOIN "+roleTeamTab+" tea on tea.idUser=ro.idTeam  WHERE "+strCond+" LIMIT 0, "+maxList+";"); // ORDER BY tPos DESC GROUP BY ro.idUser
    Sql.push("SELECT FOUND_ROWS() AS n;"); // nFound

    var WhereTmp=[this.whereMap, "boShow=1", "now()<tHide"],  strCond=array_filter(WhereTmp).join(' AND ');
    Sql.push("SELECT count(*) AS n FROM "+roleTab+" ro WHERE "+strCond+";"); // nUnFiltered
  }
  
  
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  Ou.NTotNFilt=[]; Ou.arrList=[]; this.BoUseList=[];
  for(var i=0;i<2;i++){
    var nFound=results[3*i+1][0].n;
    this.BoUseList[i]=nFound<=maxList;
    var tmp=[]; if(this.BoUseList[i]){ tmp=results[3*i]; } Ou.arrList[i]=arrObj2TabNStrCol(tmp);
    Ou.NTotNFilt[i]=[nFound, results[3*i+2][0].n];
  }
  
  //copySome(Ou, this, ['arrGroup']);
  return [null, [Ou]];
} 
ReqBE.prototype.getSingleUser=async function(inObj){  // Not really used: Used in mapDiv elImgOpponent.
  var {req}=this, {site}=req, {userTab, sellerTab, sellerTeamTab, buyerTab, buyerTeamTab, complaintTab}=site.TableName;

  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, IRole}=inObj, len=IRole.length;   if(len==0) return [new ErrorClient('this.IRole.length==0')];
  
  var Sql=[], Val=[];
  for(var i=0;i<len;i++){
    var iRole=IRole[i];
    var oRole=site.ORole[iRole];
    var roleTab=iRole?sellerTab:buyerTab,    roleTeamTab=iRole?sellerTeamTab:buyerTeamTab;
    
    //var strColT=this.OQueryPart[i].strCol;
    var sqlColT=oRole.sqlColList;
    Sql.push("SELECT SQL_CALC_FOUND_ROWS "+sqlColT+" FROM ("+roleTab+" ro JOIN "+userTab+" u ON ro.idUser=u.idUser) LEFT JOIN "+roleTeamTab+" tea on tea.idUser=ro.idTeam  WHERE u.idUser=? ;"); Val.push(idUser);
  }
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(len==1){ Ou[IRole[0]]=results[0]; }
  else{    for(var i=0;i<len;i++){   Ou[IRole[i]]=results[i][0];   }    }

  return [null, [Ou]];
} 


ReqBE.prototype.getGroupList=async function(inObj){  
  var {req}=this, {site}=req, {siteName}=site, {userTab, buyerTab, sellerTab}=site.TableName;
  
  //var zoomFac=Math.pow(2,this.zoom-4.3);
  var zoomFac=Math.pow(2,this.zoom-5);
  
  var Ou={}, Sql=[];
  for(var i=0;i<2;i++){
    if(!this.BoUseList[i]){
      var WhereTmp=this.OQueryPart[i].Where.concat([this.whereMap, "boShow=1", "now()<tHide"]),  strCond=array_filter(WhereTmp).join(' AND ');
      var roleTab=i?sellerTab:buyerTab;
      var strTableRef=roleTab+' ro';
      Sql.push("SELECT round(x*"+zoomFac+")/"+zoomFac+" AS roundX, round(y*"+zoomFac+")/"+zoomFac+" AS roundY, count(*) AS n FROM "+strTableRef+" WHERE "+strCond+" GROUP BY roundX, roundY;");
    } else Sql.push("SELECT 1 FROM DUAL;");
  }
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  
  Ou.arrGroup=[];
  for(var i=0;i<2;i++){
    //if(!this.BoUseList[i])  Ou.arrGroup[i]=arrObj2TabNStrCol(results[i]);
    //else Ou.arrGroup[i]=[];
    var tmp=[]; if(!this.BoUseList[i]) tmp=results[i];  Ou.arrGroup[i]=arrObj2TabNStrCol(tmp);
  }
  return [null, [Ou]];
} 


ReqBE.prototype.getHist=async function(inObj){
  var {req}=this, {site}=req, {userTab, buyerTab, sellerTab}=site.TableName;
  var Ou={arrHist:[]};
  for(var i=0;i<2;i++){
    var oRole=site.ORole[i];
    //var charRole=oRole.charRole, charRoleUC=charRole.toUpperCase();
    var roleTab=i?sellerTab:buyerTab;
    
    var strTableRef=roleTab+' ro';
    
    var arg={strTableRef, WhereExtra:[this.whereMap, "boShow=1", "now()<tHide"], myMySql:this.myMySql};  //, Ou
    arg.Filt=this.OFilt[i];
    //arg.mysqlPool=this.pool;
    //arg.oRole=site['o'+charRoleUC];
    //arg.Prop=site['o'+charRoleUC].Prop;
    arg.Prop=oRole.Prop;
    arg.Where=this.OQueryPart[i].Where;
    arg.strDBPrefix=site.siteName;

    //var [err, Hist]=await getHist(arg); if(err) return [err];
    var histCalc=new HistCalc(arg);   var [err, Hist]=await histCalc.getHist(arg); if(err) return [err];
    Ou.arrHist[i]=Hist;
  }

  return [null, [Ou]];
}

/*********************************************************************************************
 * User-function
 *********************************************************************************************/

ReqBE.prototype.UUpdate=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;
  
  var Sql=[], Val=[];
  Val.push(myJSEscape(inObj.displayName), idUser);
  Sql.push("UPDATE "+userTab+" SET displayName=? WHERE idUser=?;");
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results.affectedRows, mestmp=c+" affected row"; if(c!=1) mestmp+='s';
  
  this.mes(mestmp);      
  return [null, [Ou]];
}
ReqBE.prototype.USetIRoleActive=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var {idUser}=user,   {iRoleActive}=inObj;
  
  var Sql=[], Val=[];
  Val.push(iRoleActive, idUser);
  Sql.push("UPDATE "+userTab+" SET iRoleActive=? WHERE idUser=?;");
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results.affectedRows, mestmp=c+" affected row"; if(c!=1) mestmp+='s';
  
  this.mes(mestmp);      
  return [null, [Ou]];
}

ReqBE.prototype.UDelete=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var {userTab, buyerTab, sellerTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser; 
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  this.sessionUserInfoFrDB=extend({}, userInfoFrDBZero);    await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBZero); 

  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  Sql.push("SELECT count(*) AS n FROM "+buyerTab+";");
  Sql.push("SELECT count(*) AS n FROM "+sellerTab+";");
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  site.boGotNewSellers=1; site.boGotNewBuyers=1;
  site.nUser=Number(results[1][0].n);
  site.nTotB=Number(results[2][0].n);
  site.nTotS=Number(results[3][0].n);
  this.mes('deleted');      
  return [null, [Ou]];
}


/*********************************************************************************************
 * Role-functions
 *********************************************************************************************/

ReqBE.prototype.RIntroCB=async function(inObj){ // writing needSession
  var {req}=this, {site}=req, {userTab, buyerTab, sellerTab, webPushSubscriptionTab, userImageTab}=site.TableName;
  var Ou={}; 
  if(isEmpty(this.sessionLoginIdP)) {this.mes('No session'); return [null, [Ou]]; }
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;

  var {tel, displayName, currency, charRole, displayEmail, strSubscription, base64Img, boUseIdPImg}=inObj;  // boIdIPImage
  tel=myJSEscape(tel); displayName=myJSEscape(displayName); currency=myJSEscape(currency);
  //var boUseIdPImg=false; //1-Number(boIdIPImage);
  
  if(displayEmail) {
    var boOK=validator.isEmail(displayEmail); if(!boOK) return [new ErrorClient("displayEmail didn't pass validation test.")];
  }
  //var boWebPushOK=false;
  const boWebPushOK=strSubscription!='null';
  
  if('bs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  
  var iRole=Number(charRole=='s');
  var oRole=site.ORole[iRole];
  var {charRole, strRole}=oRole;
  var roleTab=iRole?sellerTab:buyerTab;

  var sqlSetMetaExtra=boUseIdPImg?"":", imTag=imTag+1";
  
  
    // An entry in userTab may exist (if the user is a complainer). However an entry in roleTab is something one can assume does not exist.
  var Sql=[], Val=[];
  //Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, boWebPushOK=?, nameIP, image, hashPW, displayName, boUseIdPImg) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()), ?, ?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=?, boWebPushOK=?, nameIP=?, image=?;");
  //Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  //Val.push(idFB, idIdPlace, idOpenId, email, boWebPushOK, nameIP, image, displayName, boUseIdPImg,   email, boWebPushOK, nameIP, image);
  
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, boWebPushOK, nameIP, image, hashPW, displayName, boUseIdPImg, iRoleActive) VALUES (?, ?, ?, ?, ?, ?, ?, MD5(RAND()), ?, ?, ?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=email, boWebPushOK=boWebPushOK, nameIP=nameIP, image=image, iRoleActive=iRoleActive"+sqlSetMetaExtra+";");
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Val.push(idFB, idIdPlace, idOpenId, email, boWebPushOK, nameIP, image, displayName, boUseIdPImg, iRole);
  Sql.push("INSERT INTO "+roleTab+" (idUser, tCreated, tLastPriceChange, tPos, tLastWriteOfTA, histActive, tel, currency, displayEmail, boWebPushOK) VALUES (@idUser, now(), now(), now(), now(), 1, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idUser=idUser, boWebPushOK=boWebPushOK;");
  Val.push(tel, currency, displayEmail, boWebPushOK);
  //Sql.push("SET OboInserted=(ROW_COUNT()=1);");  Sql.push("SELECT @boInserted AS boInserted;");
  Sql.push("SELECT @boInserted:=(ROW_COUNT()=1) AS boInserted;");

  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  Sql.push("SELECT count(*) AS n FROM "+buyerTab+";");
  Sql.push("SELECT count(*) AS n FROM "+sellerTab+";");

  if(!boUseIdPImg){
      // base64Img
    var bufImg = Buffer.from(base64Img.split(",")[1], 'base64');
    console.log('bufImg.length: '+bufImg.length);
    if(bufImg.length==0) return [Error('bufImg.length==0')];
    if(bufImg.length>10000) return [Error('bufImg.length>10000 !?!, aborting!')];
    Sql.push("REPLACE INTO "+userImageTab+" (idUser,data) VALUES (@idUser,?);"); Val.push(bufImg);
  }
  
  if(boWebPushOK){
    Sql.push("REPLACE INTO "+webPushSubscriptionTab+" VALUES (@idUser, ?);");  Val.push(strSubscription);
  } else { Sql.push("DELETE FROM "+webPushSubscriptionTab+" WHERE idUser=@idUser;");   }
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results[0].affectedRows; if(c>1) return [Error(c+" userTab rows affected")];
  var idUser=Number(results[1][0].idUser);    await setRedis(req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var boIns=Number(results[3][0].boInserted);   if(iRole) site.boGotNewSellers=boIns; else site.boGotNewBuyers=boIns;
  site.nUser=Number(results[4][0].n);
  site.nTotB=Number(results[5][0].n);
  site.nTotS=Number(results[6][0].n);
  var  tmpMes='Data '+(boIns?'inserted':'updated'); this.mes(tmpMes);
  return [null, [Ou]];
}


ReqBE.prototype.RUpdate=async function(inObj){ // writing needSession
  var {req}=this, {site}=req, [oB, oS]=site.ORole, {userTab, buyerTab, sellerTab}=site.TableName;
  var Ou={}; 

  var user=this.sessionUserInfoFrDB.user, objT;
  if(user) objT=user;  else if(isSet(this.sessionLoginIdP)) objT=this.sessionLoginIdP;  else {this.mes('No session'); return [null, [Ou]]; }
  var {idUser, idFB, idIdPlace, idOpenId, email, nameIP, image}=objT; 
  if(typeof idUser=='undefined') {return [Error('no idUser')];}
  
  var charRole=inObj.charRole; if('bs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  var roleTab=charRole=='b'?buyerTab:sellerTab;
  var oRole=charRole=='b'?oB:oS;

  var objVar=extend({},inObj); delete objVar.charRole;
  
  //var boInsert='boInsert' in objVar; if(boInsert) delete objVar.boInsert;
  if('image' in objVar) delete objVar.image;
  
  //var boPrice='boPrice' in objVar; if(boPrice) delete objVar.boPrice;
  //var boPrice=intersectBool(['currency', 'price', 'priceStart', 'pricePerDist', 'pricePerHour', 'fixedPricePerUnit','fixedPricePerUnitUnit'], Object.keys(objVar));
  
  for(var name in objVar){
    var value=objVar[name];
    //if(/link/.test(name)) objVar[name]=myLinkEscape(value);
    if(/link/.test(name) && value.length) {
      var boOK=validator.isURL(value, {protocols: ['http','https']}); if(!boOK) return [new ErrorClient(name+' validation failed.')];
    } else if(/email/i.test(name) && value.length) {
      var boOK=validator.isEmail(value); if(!boOK) return [new ErrorClient(name+" didn't pass validation test.")];
    } else if(typeof value=='string') objVar[name]=myJSEscape(value);
  }
  
    // Create SqlPriceComp, ValPriceComp 
  var arrPriceAllowed=['currency', 'price', 'priceStart', 'pricePerDist', 'pricePerHour', 'fixedPricePerUnit','fixedPricePerUnitUnit'];
  var arrPriceT=[], ValPriceComp=[];
  for(var name in objVar){
    if(arrPriceAllowed.indexOf(name)!=-1) {arrPriceT.push(name+"!=?"); ValPriceComp.push(objVar[name]);}
  }
  var SqlPriceComp=[]; if(arrPriceT.length) SqlPriceComp.push("tLastPriceChange= IF("+arrPriceT.join(' OR ')+",now(),tLastPriceChange)");
  
    // Create SqlVar, ValVar 
  var SqlVar=[], ValVar=[];
  for(var name in objVar){
    if(oRole.arrAllowed.indexOf(name)==-1) {return [new ErrorClient('Forbidden input')];}
    var strQ='?', value=objVar[name], prop=oRole.Prop[name];
    if('roleUpdF' in prop) { var [strQ,value]=prop.roleUpdF.call(oRole.Prop, name, value);  }

    objVar[name]=value;
    SqlVar.push("`"+name+"`="+strQ);
    ValVar.push(value);
  }
 
    // Create SqlTeam, ValTeam 
  var SqlTeam=[], ValTeam=[];   if('idTeamWanted' in objVar) {    SqlTeam.push("idTeamWanted=?", "idTeam= IF(idTeam=?,idTeam,0)");  ValTeam.push(objVar.idTeamWanted, objVar.idTeamWanted);     }

  var SqlUpd=[].concat(SqlPriceComp, SqlTeam, SqlVar);
  var ValUpd=[].concat(ValPriceComp, ValTeam, ValVar);
  
    // Create Sql, Val 
  var Sql=[], Val=[];
  if(SqlUpd.length) {
    var tmp=SqlUpd.join(', ').trim();
    Sql.push("UPDATE "+roleTab+" SET "+tmp+" WHERE idUser=?;");
    Val=Val.concat(ValUpd, idUser);
  }

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  this.mes('Data updated');      
  return [null, [Ou]];
}

ReqBE.prototype.RShow=async function(inObj){  // writing needSession
  var {req}=this, {site}=req, {siteName}=site;
  var {userTab, buyerTab, sellerTab}=site.TableName;
  var Ou={};
  var {user, buyer, seller}=this.sessionUserInfoFrDB; if(!user || (!buyer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var {idUser}=user;

     // Get iRole
  // var charRole=inObj.charRole; if('bs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  // var iRole=charRole=='s'?1:0;
  var Sql=[];
  Sql.push("SELECT iRoleActive FROM "+userTab+" WHERE idUser=?"); var Val=[idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(results.length==0) { this.mes('No such idUser in the database'); return [null, [Ou]];}
  var iRole=results[0].iRoleActive
  var role=iRole?seller:buyer,    roleTab=iRole?sellerTab:buyerTab,    roleTabAlt=iRole?buyerTab:sellerTab;

  var {coordinatePrecisionM}=role;
  var {x, y, hideTimer}=inObj; if(hideTimer==undefined) hideTimer=0;
  var projs=new MercatorProjection(),  lat=projs.fromYToLat(y);
  //var [x,y]=roundXY(coordinatePrecisionM, x, y, lat);
  var [x,y]=roundNObscure(coordinatePrecisionM, x, y, lat);


  var strGeoHash=GeoHash.pWC2GeoHash({x,y}), bigIntGeoHash=BigInt('0b'+strGeoHash);


  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne(?);"); 
  Sql.push("SET @hideTimer=?;"); 
  Sql.push("UPDATE "+roleTab+" SET x=?, y=?, geoHash=?, boShow=1, tPos=now(), hideTimer=IF(@hideTimer=0,hideTimer,@hideTimer), tHide=FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(now())+hideTimer,"+intMax+")), histActive=histActive|1 WHERE idUser=?;");
  Sql.push("UPDATE "+roleTabAlt+" SET tPos=0, tHide=0, histActive=histActive|boShow, boShow=0 WHERE idUser=?;");
  Val=[idUser,hideTimer,x,y,bigIntGeoHash,idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var strTmp=iRole?'Seller':'Buyer';   this.mes(strTmp+' visible');    
  return [null, [Ou]];
}
ReqBE.prototype.RHide=async function(inObj){  // writing needSession
  var {req}=this, {site}=req, {siteName}=site;
  var {userTab, buyerTab, sellerTab, buyerTeamTab, sellerTeamTab}=site.TableName;
  var Ou={};
  var {user, buyer, seller}=this.sessionUserInfoFrDB; if(!user || (!buyer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var {idUser}=user;

     // Get iRole
  // var charRole=inObj.charRole; if('bs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  // var iRole=charRole=='s'?1:0;
  var Sql=[];
  Sql.push("SELECT iRoleActive FROM "+userTab+" WHERE idUser=?"); var Val=[idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(results.length==0) { this.mes('No such idUser in the database'); return [null, [Ou]];}
  var iRole=results[0].iRoleActive
  var roleTab=iRole?sellerTab:buyerTab;
  var roleTeamTab=iRole?sellerTeamTab:buyerTeamTab;

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne(?);"); 
  Sql.push("UPDATE "+roleTab+" SET tPos=0, tHide=0, histActive=histActive|1, boShow=0 WHERE idUser=?;");
  Sql.push(`SELECT `+site.SqlColSelOne[iRole]+` FROM (`+roleTab+` ro LEFT JOIN `+roleTeamTab+` tea on tea.idUser=ro.idTeam) WHERE ro.idUser=?;`);
  Val=[idUser,idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

    // Set userInfoFrDB and userInfoFrDBUpd
  var objTmp=results[2][0];
  var userInfoFrDBUpd={};   if(iRole) userInfoFrDBUpd.seller=objTmp; else userInfoFrDBUpd.buyer=objTmp;
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBUpd);   extend(this.sessionUserInfoFrDB, userInfoFrDBUpd);
  await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);

  var strTmp=iRole?'Seller':'Buyer';   this.mes(strTmp+' hidden');      
  return [null, [Ou]];
}


ReqBE.prototype.RHide=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var Ou={};
  var {user, buyer, seller}=this.sessionUserInfoFrDB; if(!user || (!buyer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var {idUser}=user;

  var objArg={site, idUser};
  var [err, {iRole, objR}]=await RHide.call(this, objArg); if(err) return [err];
  var strRole=site.ORole[iRole].strRole, strRoleUCFirst=ucfirst(strRole); 
    // Set userInfoFrDB and userInfoFrDBUpd
  var userInfoFrDBUpd={};  userInfoFrDBUpd[strRole]=objR;
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBUpd);   extend(this.sessionUserInfoFrDB, userInfoFrDBUpd);
  await setRedis(req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  this.mes(strRoleUCFirst+' hidden');
  return [null, [Ou]];
}
//
// Complaints
//

ReqBE.prototype.complaintUpdateComment=async function(inObj){
  var {req}=this, {site}=req, {siteName}=site;
  var {userTab,complaintTab}=site.TableName;
  var Ou={};
  var objT=this.sessionUserInfoFrDB.user||this.sessionLoginIdP;  if(isEmpty(objT)) {this.mes('No session'); return [null, [Ou]]; }
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=objT;


  var idComplainee=inObj.idComplainee;
  var comment=inObj.comment;  comment=comment.substr(0,10000); comment=myJSEscape(comment);
  if(comment.length==0) comment=null;

  var Sql=[], Val=[];
  Val.push(idFB, idIdPlace, idOpenId, email, nameIP, image, nameIP,   email, nameIP, image);
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, displayName) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()), ? ) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=?, nameIP=?, image=?;");
  
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Sql.push("SELECT @idComplainer:=LAST_INSERT_ID() AS idUser;");
  
  //Sql.push("INSERT INTO "+complaintTab+" (idComplainee,idComplainer,comment,tCreated) VALUES (?,@idComplainer,?,now()) ON DUPLICATE KEY UPDATE comment=?, tCommentModified=now();");
  //Val.push(idComplainee,comment,comment);
  //Sql.push("DELETE FROM "+complaintTab+" WHERE comment IS NULL AND answer IS NULL;");
  //Sql.push("SELECT count(*) AS n FROM "+complaintTab+" WHERE idComplainer=@idComplainer;"); 
  
  
  Val.push(idComplainee,comment);
  Sql.push("CALL "+siteName+"UpdateComplaint(?, @idComplainer, ?);");
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var StrMes=[];
  
  var idUser=Number(results[1][0].idUser);    await setRedis(req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  //var c=results[2].affectedRows; if(c==1) StrMes.push("Entry inserted"); else if(c==2) StrMes.push("Entry updated");
  //var c=results[3].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  //var n=results[4][0].n; if(n==0) StrMes.push("No comments remaining");

  var mess=results[2][0].mess; StrMes.push(mess);
  
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);

  return [null, [Ou]];
}
ReqBE.prototype.complaintUpdateAnswer=async function(inObj){
  var {req}=this, {site}=req, {siteName}=site;
  var complaintTab=site.TableName.complaintTab;
  var Ou={};
  //var {user, seller}=this.sessionUserInfoFrDB; if(!user || !seller) { this.mes('No session'); return [null, [Ou]];}
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}

  var idComplainer=inObj.idComplainer;
  var idComplainee=user.idUser;
  var answer=inObj.answer;  answer=answer.substr(0,10000); answer=myJSEscape(answer);
  if(answer.length==0) answer=null;
  var Sql=[], Val=[];
  //Sql.push("UPDATE "+complaintTab+" SET answer=? WHERE idComplainee=? AND idComplainer=?;");
  //Val.push(answer,idComplainee,idComplainer);
  //Sql.push("DELETE FROM "+complaintTab+" WHERE  comment IS NULL AND answer IS NULL;");
  
  Val.push(idComplainee, idComplainer, answer);
  Sql.push("CALL "+siteName+"UpdateAnswer(?, ?, ?);");
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var StrMes=[];
  //var c=results[0].affectedRows; if(c==1) StrMes.push("Entry updated"); else if(c>1) StrMes.push(c+" entries updated");
  //var c=results[1].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  
  var mess=results[0][0].mess; StrMes.push(mess);
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);
  return [null, [Ou]];
}

ReqBE.prototype.complaintOneGet=async function(inObj){
  var {req}=this, {site}=req, {userTab, complaintTab}=site.TableName;
  var Ou={};   
  //debugger
  var {user}=this.sessionUserInfoFrDB; //if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idComplainer, idComplainee;
  if('idComplainer' in inObj) idComplainer=inObj.idComplainer;  else if(user) idComplainer=user.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  if('idComplainee' in inObj) idComplainee=inObj.idComplainee; else if(user) idComplainee=user.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  
  //var sql="SELECT comment, answer FROM "+userTab+" u JOIN "+complaintTab+" co ON u.idUser=co.idComplainee WHERE idComplainee=? AND idComplainer=? "; 
  var sql="SELECT comment, answer FROM "+complaintTab+" WHERE idComplainee=? AND idComplainer=? "; 
  var Val=[idComplainee,idComplainer];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results.length; 
  var mestmp; if(c>0){ Ou.row=results[0]; mestmp="Feedback fetched"; }else{ Ou.row={}; mestmp="No existing feedback";}
  this.mes(mestmp);
  return [null, [Ou]];
}

ReqBE.prototype.getComplaintsOnComplainee=async function(inObj){
  var {req}=this, {site}=req, {userTab, complaintTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  
  var idComplainee=inObj.idComplainee;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS idComplainer, IF(boUseIdPImg,image,'') AS image, displayName, boUseIdPImg, comment, answer, UNIX_TIMESTAMP(co.tCreated) AS tCreated FROM "+complaintTab+" co JOIN "+userTab+" u ON co.idComplainer=u.idUser WHERE idComplainee=? ORDER BY co.tCreated DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idComplainee);
  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join("\n ");
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;
  return [null, [Ou]];
}
ReqBE.prototype.getComplaintsFromComplainer=async function(inObj){
  var {req}=this, {site}=req, {userTab, sellerTab, complaintTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);

  var idComplainer=inObj.idComplainer;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS u.idUser AS idUser, IF(boUseIdPImg,image,'') AS image, displayName, boUseIdPImg, imTag, comment, answer, UNIX_TIMESTAMP(co.tCreated) AS tCreated FROM "+userTab+" u JOIN "+complaintTab+" co ON u.idUser=co.idComplainee WHERE idComplainer=? ORDER BY co.tCreated DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idComplainer); 
  Sql.push("SELECT FOUND_ROWS() AS n;"); 
  var sql=Sql.join("\n ");
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;   
  //this.mes("Found: "+nCur);
  return [null, [Ou]];
}


//
// Team
//

ReqBE.prototype.teamSaveName=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var Ou={};
  var {link,iRole}=inObj;
  if(!Number.isInteger(iRole)) { this.mes('iRole is not an integer'); return [null, [Ou,'errFunc']];}
  iRole=bound(iRole,0,1);
  var strRole=site.ORole[iRole].charRole;
  var roleTeamTab=site.TableName[strRole+'TeamTab'];

  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved}=roleTeam; if(!boApproved){this.mes('Team not approved'); return [null, [Ou]];}
  
  
  var boOK=validator.isURL(link, {protocols: ['http','https']}); if(!boOK) return [new ErrorClient('Link url is not approved')];
  
  var sql="UPDATE "+roleTeamTab+" SET link=? WHERE idUser=?;", Val=[link, idUser];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}
ReqBE.prototype.teamSave=async function(inObj){  // writing needSession
  var {req}=this, {site}=req;
  var Ou={};
  var {idUser, iRole, boOn}=inObj;
  if(!Number.isInteger(iRole)) { this.mes('iRole is not an integer'); return [null, [Ou,'errFunc']];}
  iRole=bound(iRole,0,1);
  var strRole=site.ORole[iRole].charRole;
  var roleTab=site.TableName[strRole+'Tab'];
  
  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  if(!roleTeam.boApproved){ this.mes('Team not approved'); return [null, [Ou]];}
  
  var idUser=Number(idUser),   boOn=Number(boOn); 
  var sql="UPDATE "+roleTab+" SET idTeam=IF(?,idTeamWanted,0) WHERE idUser=?;", Val=[boOn,idUser];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}

ReqBE.prototype.teamLoad=async function(inObj){  // writing needSession
  var {req}=this, {site}=req, {userTab}=site.TableName;
  var Ou={};
  var {iRole}=inObj;
  if(!Number.isInteger(iRole)) { this.mes('iRole is not an integer'); return [null, [Ou,'errFunc']];}
  iRole=bound(iRole,0,1);
  var strRole=site.ORole[iRole].charRole;
  var roleTab=site.TableName[strRole+'Tab'];
  
  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved, imTag, link}=roleTeam;  if(boApproved==0){ this.mes('Team not approved'); return [null, [Ou]];}
  
  //copySome(Ou, roleTeam, ['idUser', 'imTag', 'link']);

  var TmpCol=['u.idUser', 'nameIP', 'idTeam', 'image', 'imTag', 'boUseIdPImg'];
  //for(var i=0;i<TmpCol.length;i++){TmpCol[i]+=" AS '"+i+"'";} 
  var strCol=TmpCol.join(', ');
  var sql="SELECT "+strCol+" FROM "+roleTab+" r JOIN "+userTab+" u ON r.idUser=u.idUser WHERE idTeamWanted=?";
  var Val=[idUser];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var nRow=results.length;
  if(nRow==0) { this.mes('No '+strRole+'s connected');  }
  else{
    Ou.tabWannaBe=arrObj2TabNStrCol(results);
    //Ou.tab=[];
    //for(var i=0;i<nRow;i++) {
      //var row=results[i], len=5;
      //var rowN=Array(len); for(var j=0;j<len;j++) { rowN[j]=row[j];}
      //Ou.tab.push(rowN);
    //}
  }
  return [null, [Ou]];
}




ReqBE.prototype.keyRemoteControlSave=async function(inObj){
  var {req}=this, {site}=req;
  var {userTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  //var idUser=user.idUser, keyRemoteControl=inObj.keyRemoteControl;
  var sql="UPDATE "+userTab+" SET keyRemoteControl=?, iSeq=0 WHERE idUser=?",   Val=[myJSEscape(inObj.keyRemoteControl),  user.idUser];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var boOK=0, nUpd=results.affectedRows, mestmp; 
  //if(nUpd==1) {boOK=1; mestmp="Key inserted"; } else if(nUpd==2) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="Nothing changed (same key as before)";}
  if(nUpd==1) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="Nothing changed (same key as before)";}
  Ou.boOK=boOK;    Ou.strMess=mestmp;
  this.mes(mestmp);
  return [null, [Ou]];
}


ReqBE.prototype.getSetting=async function(inObj){ 
  var {req}=this, {site}=req;
  var Var=inObj.Var;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['boAllowEmailAccountCreation'];  // 'boShowTeam',
  if(!isAWithinB(Var,Str)) {this.mes('Illegal invariable'); return [null, [Ou]]; }
  for(var i=0;i<Var.length;i++){ var name=Var[i]; Ou[name]=app[name]; }
  return [null, [Ou]];
}
ReqBE.prototype.setSetting=async function(inObj){ 
  var {req}=this, {site}=req; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(this.sessionUserInfoFrDB.admin) StrApp=['boAllowEmailAccountCreation'];  //'boShowTeam',
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return [null, [Ou]];}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  return [null, [Ou]];    
}




ReqBE.prototype.uploadImage=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTeamTab, sellerTeamImageTab, buyerTeamTab, buyerTeamImageTab, userImageTab}=site.TableName;
  var Ou={};
  var regImg=RegExp("^(png|jpeg|jpg|gif|svg)$");

  var File=this.File;
  var n=File.length; this.mes("nFile: "+n);

  //var file=File[0], tmpname=file.path, fileName=file.name; 
  var file=File[0], {filepath:tmpname, originalFilename:fileName}=file; //if(this.strName.length) fileName=this.strName;
  var Match=RegExp('\\.(\\w{1,4})$').exec(fileName); 
  if(!Match){ Ou.strMessage='The file name should have a three or four letter extension, ex: ".jpg"'; return [null, [Ou]]; }
  var type=Match[1].toLowerCase();
  var [err, buf]=await fsPromises.readFile(tmpname).toNBP();    if(err) return [err];
  var data=buf; 
  if(data.length==0){ this.mes("data.length==0"); return [null, [Ou]]; }

  if(!regImg.test(type)){ Ou.strMessage="Unrecognized file type: "+type; return [null, [Ou]]; }

  var wNew=50, hNew=50;
  var [err,data]=await new Promise(resolve=>{
    var myCollector=concat(function(buf){  resolve([null,buf]);   });
    var streamImg=gm(data).autoOrient().resize(wNew, hNew).stream(function streamOut(err, stdout, stderr) {
      if(err) {resolve([err]); return;}
      stdout.pipe(myCollector); 
    });
  });
  if(err) return [err];

  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  
  var kind=this.kind, sqlSetExtra="";
  if(kind=='u'){
    if(!buyer && !seller) { this.mes('No session'); return [null, [Ou]];}
    var idUser=user.idUser, tabImage=userImageTab, tabMeta=userTab, sqlSetExtra="boUseIdPImg=0, ";
  } else if(kind=='b'){
    if(!buyerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=buyerTeam.idUser, tabImage=buyerTeamImageTab, tabMeta=buyerTeamTab;
  } else if(kind=='s'){
    if(!sellerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=sellerTeam.idUser, tabImage=sellerTeamImageTab, tabMeta=sellerTeamTab;;
  } else return [new ErrorClient("kind="+kind)];


  console.log('uploadImage data.length: '+data.length);
  if(data.length==0) return [Error('data.length==0')];
  
  var Sql=[], Val=[];
  Sql.push("REPLACE INTO "+tabImage+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  Sql.push("UPDATE "+tabMeta+" SET "+sqlSetExtra+"imTag=imTag+1 WHERE idUser=?;"); Val.push(idUser);
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  Ou.strMessage="Done";
  return [null, [Ou]];
}



ReqBE.prototype.uploadImageB64=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTeamTab, sellerTeamImageTab, buyerTeamTab, buyerTeamImageTab, userImageTab}=site.TableName;
  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  var Ou={};

  var {kind, base64Img, boUseIdPImg=false}=inObj;

  var Sql=[], Val=[];
  var sqlSetExtra="";
  if(kind=='u'){
    if(!buyer && !seller) { this.mes('No session'); return [null, [Ou]];}
    var idUser=user.idUser, tabImage=userImageTab, tabMeta=userTab, sqlSetExtra="boUseIdPImg=?, ";
  } else if(kind=='b'){
    if(!buyerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=buyerTeam.idUser, tabImage=buyerTeamImageTab, tabMeta=buyerTeamTab;
  } else if(kind=='s'){
    if(!sellerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=sellerTeam.idUser, tabImage=sellerTeamImageTab, tabMeta=sellerTeamTab;;
  } else return [new ErrorClient("kind="+kind)];

    // base64Img
  var data = Buffer.from(base64Img.split(",")[1], 'base64');
  console.log('data.length: '+data.length);
  if(data.length==0) return [Error('data.length==0')];
  if(data.length>10000) return [Error('data.length>10000 !?!, aborting!')];

  Sql.push("REPLACE INTO "+tabImage+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  if(kind=='u'){
    Sql.push("UPDATE "+tabMeta+" SET "+sqlSetExtra+"imTag=imTag+1 WHERE idUser=?;"); 
    if(sqlSetExtra) Val.push(boUseIdPImg);      Val.push(idUser);
    Sql.push("SELECT imTag, boUseIdPImg FROM "+tabMeta+" WHERE idUser=?;"); Val.push(idUser);
    var sql=Sql.join('\n');
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    copySome(Ou,results[2][0],["imTag","boUseIdPImg"]);
  }else{
    Sql.push("UPDATE "+tabMeta+" SET "+sqlSetExtra+"imTag=imTag+1 WHERE idUser=?;"); Val.push(idUser);
    Sql.push("SELECT imTag FROM "+tabMeta+" WHERE idUser=?;"); Val.push(idUser);
    var sql=Sql.join('\n');
    var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
    copySome(Ou,results[2][0],["imTag"]);
  } 

  Ou.strMessage="Image stored";
  return [null, [Ou]];
}

ReqBE.prototype.clearUserImage=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTeamTab, sellerTeamImageTab, buyerTeamTab, buyerTeamImageTab, userImageTab}=site.TableName;
  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  var Ou={};

  if(!buyer && !seller) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser, tabImage=userImageTab, tabMeta=userTab;
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+tabImage+" WHERE idUser=?;"); Val.push(idUser);
  Sql.push("UPDATE "+tabMeta+" SET boUseIdPImg=1 WHERE idUser=?;"); Val.push(idUser);
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var nDel=results[0].affectedRows; 
  Ou.boOK=0; if(nDel==1) {Ou.boOK=1; this.mes('Image deleted'); } else { this.mes(nDel+" images deleted!?");}

  return [null, [Ou]];
}

ReqBE.prototype.clearTeamImage=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTeamTab, sellerTeamImageTab, buyerTeamTab, buyerTeamImageTab, userImageTab}=site.TableName;
  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  var Ou={};

  var {kind}=inObj;

  var Sql=[], Val=[];
  if(kind=='b'){
    if(!buyerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=buyerTeam.idUser, tabImage=buyerTeamImageTab, tabMeta=buyerTeamTab;
  } else if(kind=='s'){
    if(!sellerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=sellerTeam.idUser, tabImage=sellerTeamImageTab, tabMeta=sellerTeamTab;;
  } else return [new ErrorClient("kind="+kind)];

  Sql.push("DELETE FROM "+tabImage+" WHERE idUser=?;"); Val.push(idUser);
  Sql.push("UPDATE "+tabMeta+" SET imTag=imTag+1 WHERE idUser=?;"); Val.push(idUser);
  Sql.push("SELECT imTag FROM "+tabMeta+" WHERE idUser=?;"); Val.push(idUser);
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var c=results[0].affectedRows
  copySome(Ou,results[2][0],["imTag"]);
  
  Ou.strMessage=c+" image(s) deleted";
  return [null, [Ou]];
}



ReqBE.prototype.setWebPushSubcription=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTab, buyerTab, webPushSubscriptionTab}=site.TableName;
  var Ou={};

  var strSubscription=inObj.strSubscription;

  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  
  var idUser=user.idUser;
  //const boWebPushOK=Boolean(strSubscription);
  const boWebPushOK=strSubscription!='null';
  
  var hashSubScription=''; if(boWebPushOK) hashSubScription=md5(strSubscription);

  var Sql=[], Val=[];
  //Sql.push("REPLACE INTO "+tab+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data)
  Sql.push("UPDATE "+userTab+" SET boWebPushOK=? WHERE idUser=?;");
  Sql.push("UPDATE "+buyerTab+" SET boWebPushOK=? WHERE idUser=?;");
  Sql.push("UPDATE "+sellerTab+" SET boWebPushOK=? WHERE idUser=?;");
  var arrT=[boWebPushOK, idUser]; Val.push(...arrT,...arrT,...arrT);
  if(boWebPushOK){
    Sql.push("REPLACE INTO "+webPushSubscriptionTab+" VALUES (?, ?);");  Val.push(idUser, strSubscription);
  } else { Sql.push("DELETE FROM "+webPushSubscriptionTab+" WHERE idUser=?;");  Val.push(idUser); }
  //else if(kind=='b'){     Sql.push("UPDATE "+buyerTeamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser); }
  //else if(kind=='s'){     Sql.push("UPDATE "+sellerTeamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser); }
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];

  Ou.strMessage="Done";
  return [null, [Ou]];
}

ReqBE.prototype.sendNotification=async function(inObj){
  var self=this, {req}=this, {site}=req, {siteName}=site;
  var {userTab, sellerTab, buyerTab, webPushSubscriptionTab}=site.TableName;
  var Ou={};
  var {idReceiver, message, latlngSender}=inObj;
  var {user, buyer, seller, buyerTeam, sellerTeam}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;
  
  
  var Sql=[], Val=[];
  Sql.push("SELECT strSubscription FROM "+webPushSubscriptionTab+" WHERE idUser=?;"); Val.push(idReceiver);
  Sql.push("SELECT * FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  if(results[0].length==0) return [new ErrorClient("No subscription for that idReceiver")];
  //const subscription = JSON.parse(results[0][0].strSubscription);
  try{ var subscription=JSON.parse(results[0][0].strSubscription); }catch(e){ return [new ErrorClient(e)]; }
  var objSender=copySome({}, results[1][0], ["idUser", 'displayName', 'boUseIdPImg', 'image', 'imTag', 'iRoleActive']);
  objSender.iRole=objSender.iRoleActive;
  delete objSender.iRoleActive
  if(!objSender.boUseIdPImg) objSender.image='';
  
  const payload = JSON.stringify({ objSender, message, tSent:unixNow(), latlngSender });//iRole: (should be called iRoleSender (or skipped))
  const options = {TTL: 0};

  if(boDbg) { await new Promise(resolve=>{setTimeout(resolve, 5000);  }); }
  
  var [err]=await webPush.sendNotification(subscription, payload, options).toNBP();
  if(err) {console.log(err); return [new ErrorClient(err.body)]; }
  

  Ou.strMessage="OK";
  return [null, [Ou]];
}


