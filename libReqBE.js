
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
   //libReqBE->go, loginGetGraph, setupById, UDelete  --->  libReqBE->go
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
  this.Str=[];  this.Out={GRet:{userInfoFrDBUpd:{}}, dataArr:[]};  this.GRet=this.Out.GRet; 
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
   
    // closebymarket-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  var str=serialize(this.Out);
  if(str.length<lenGZ) res.end(str);
  else{
    res.setHeader("Content-Encoding", 'gzip');
    //res.setHeader('Content-Type', MimeType.txt);
    Streamify(str).pipe(zlib.createGzip()).pipe(res);
  }
}
ReqBE.prototype.mesEO=function(e){
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
  
    // closebymarket-specific
  this.GRet.sessionLoginIdP=this.sessionLoginIdP;
  
  //res.writeHead(500, {"Content-Type": MimeType.txt}); 
  res.end(serialize(this.Out));
}



ReqBE.prototype.go=function*(){
  var req=this.req, flow=req.flow, res=this.res, site=req.site;
  
  if('x-requested-with' in req.headers && req.headers['x-requested-with']=="XMLHttpRequest") ; else { this.mesEO(new Error("Ajax-request: req.headers['x-requested-with']!='XMLHttpRequest'"));  return; }

  if('referer' in req.headers){
    var urlT=req.strSchemeLong+req.wwwSite, lTmp=urlT.length, referer=req.headers.referer, lMin=Math.min(lTmp, referer.length);
    if(referer.slice(0,lMin)!=urlT.slice(0,lMin)) { this.mesEO(new Error("Referer is wrong"));  return; }
  } else { this.mesEO(new Error("Referer not set"));  return; }
  
    // Extract input data either 'POST' or 'GET'
  var jsonInput;
  if(req.method=='POST'){ 
    if('x-type' in req.headers ){ //&& req.headers['x-type']=='single'
      var form = new formidable.IncomingForm();
      form.multiples = true;  
      //form.uploadDir='tmp';
      
      var err, fields, files;
      var semY=0, semCB=0;  form.parse(req, function(errT, fieldsT, filesT) { err=errT; fields=fieldsT; files=filesT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
      //form.parse(req, function(errT, fieldsT, filesT) { err=errT; fields=fieldsT; files=filesT; flow.next();  });  yield;
  
      if(err){this.mesEO(err);  return; } 
      
      this.File=files['fileToUpload[]'];
      if('kind' in fields) this.kind=fields.kind; else this.kind='s';
      if(!(this.File instanceof Array)) this.File=[this.File];
      jsonInput=fields.vec;

    }else{
      var buf, myConcat=concat(function(bufT){ buf=bufT; flow.next();  });    req.pipe(myConcat);    yield;
      jsonInput=buf.toString();
    }
  }
  else if(1){ this.mesO('send me a POST'); return; }
  //else if(req.method=='GET'){ var objUrl=url.parse(req.url), qs=objUrl.query||''; jsonInput=urldecode(qs); }

  try{ var beArr=JSON.parse(jsonInput); }catch(e){ this.mesEO(e);  return; }
  
  if(!req.boCookieStrictOK) {this.mesEO(new Error('Strict cookie not set'));  return;   }
  
  this.sessionUserInfoFrDB=yield *getRedis(flow, req.sessionID+'_UserInfoFrDB', true);
  //var [err,value]=yield* cmdRedis(flow, 'GET', [req.sessionID+'_UserInfoFrDB']); this.sessionUserInfoFrDB=JSON.parse(value);
  if(!this.sessionUserInfoFrDB || typeof this.sessionUserInfoFrDB!='object'  ) {
    this.sessionUserInfoFrDB=extend({}, specialistDefault);
  }
  yield* setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);

  //this.sessionLoginIdP=yield *getRedis(flow, req.sessionID+'_LoginIdP', true);
  //if(this.sessionLoginIdP ) { yield* expireRedis(flow, req.sessionID+'_LoginIdP', maxLoginUnactivity); } else this.sessionLoginIdP={};

  //var [err, value]=yield* cmdRedis(flow, 'GET',[req.sessionID+'_LoginIdP']);  this.sessionLoginIdP=JSON.parse(value);
  //if(this.sessionLoginIdP ) { yield* cmdRedis(flow, 'EXPIRE', [req.sessionID+'_LoginIdP', maxLoginUnactivity]); } else this.sessionLoginIdP={};
  
  var luaCountFunc=`local c=redis.call('GET',KEYS[1]); if(c) then redis.call('EXPIRE',KEYS[1], ARGV[1]); end; return c`;
  var [err, value]=yield* cmdRedis(flow, 'EVAL',[luaCountFunc, 1, req.sessionID+'_LoginIdP', maxLoginUnactivity]);   this.sessionLoginIdP=value?JSON.parse(value):{};
  
  
  
  res.setHeader("Content-type", MimeType.json);


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
    arrCSRF=['UUpdate','RIntroCB','VSetPosCond','RUpdate','RShow','RHide','UDelete','teamLoad','teamSaveName','teamSave',
    'complaintUpdateComment','complaintUpdateAnswer','setSetting','deleteImage', 'uploadImage','loginGetGraph', 'sendLoginLink', 'loginWEmail', 'changePW', 'verifyEmail', 'verifyPWReset', 'sendVerifyEmailNCreateUserMessage'];   //'createUser'   // Functions that changes something must check and refresh CSRF-code
    arrNoCSRF=['setupById','setUpCond','setUp','getList','getGroupList','getHist','complaintOneGet','getComplaintsOnComplainee','getComplaintsFromComplainer','logout','getSetting'];  // ,'testA','testB'
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
      if(typeof inObj=='undefined' || typeof inObj=='object') {} else {this.mesO('inObj should be of type object or undefined'); return;}
      var fT=[tmpf,inObj];   Func.push(fT);
    }
  }

  for(var k=0; k<Func.length; k++){
    var [func,inObj]=Func[k],   [err, result]=yield* func.call(this, inObj);
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  if(results.length==0) { return [new ErrorClient('No such email in the database')];}
  
  var code=randomHash();
  var redisVar=code+'_LoginWLink';
  var tmp=yield* setRedis(flow, redisVar, email, expirationTime);
  
  var wwwSite=req.wwwSite;
  var uLink=req.strSchemeLong+wwwSite+'/'+leafLoginWLink+'?code='+code;
  
  var strTxt=`<h3>Login link to `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and wants to login using `+email+`. Is this you, then click this link to login: <a href="`+uLink+`">`+uLink+`</a> .</p>
<p>Otherwise neglect this message.</p>`;
//<p>Note! The link stops working `+expirationTime/60+` minutes after the email was sent.</p>`;
  
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
  

  Sql.push("SELECT idUser, hashPW AS password FROM "+userTab+" WHERE email=?");
  Val.push(inObj.email);

  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  if(results.length) { return [new ErrorClient('Account (email) already exists.')];}
  

    // Store temporarily
  var expirationTime=20*60;
  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmailNCreateUser';
  var tmp=yield* setRedis(flow, redisVar, {email:email, password:password, name:name}, expirationTime);
  var Ou={};

    // Send email
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailNCreateUserReturn+'?code='+code;
  var strTxt=`<h3>Email verification / account creation on `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and claims that `+email+` is their email address and they want to become a user. Is this you? If so use the link below to create an account.</p>
<p>Otherwise neglect this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
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
  //var Val=[myJSEscape(inObj.email), myJSEscape(inObj.name), inObj.password];
  //Sql.push("SELECT LAST_INSERT_ID() AS idUser;");
  ////Sql.push("UPDATE "+userTab+" SET imageHash=LAST_INSERT_ID()%32 WHERE idUser=LAST_INSERT_ID();");

  //var sql=Sql.join('\n');
  //var [err, results]=yield* this.myMySql.query(flow, sql, Val); 
  
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];

  var mess=results[1][0].mess;
  if(mess=='Password changed') Ou.boOK=1;
  this.mes(mess); 
  
  return [null, [Ou]];
}

ReqBE.prototype.verifyEmail=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  //if(typeof this.sessionUserInfoFrDB!='object' || !('idUser' in this.sessionUserInfoFrDB.user)) { return [new ErrorClient('No session')];}
  //var idUser=this.sessionUserInfoFrDB.user.idUser;
  var {user}=this.sessionUserInfoFrDB; if(!user) { return [new ErrorClient('No session')];}
  var idUser=user.idUser;

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyEmail';
  var tmp=yield* setRedis(flow, redisVar, idUser, expirationTime);
  var Ou={};

  var Sql=[], Val=[];
  Sql.push("SELECT email FROM "+userTab+" WHERE idUser=?;");
  Val.push(idUser);

  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];

  if(results.length==0) { this.mes('No such idUser in the database'); return [null, [Ou]];}
  var email=results[0].email;
  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyEmailReturn+'?code='+code;
  var strTxt=`<h3>Email verification on `+wwwSite+`</h3>
<p>Someone (maybe you) uses `+wwwSite+` and claims that `+email+` is their email address. Is this you? If so use the link below to verify that you are the owner of this email address.</p>
<p>Otherwise neglect this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];

  if(results.length==0) { this.mes('No such email in the database'); return [null, [Ou]];}

  var expirationTime=20*60;

  var code=randomHash()+randomHash();
  var redisVar=code+'_verifyPWReset';
  var tmp=yield* setRedis(flow, redisVar, email, expirationTime);

  var wwwSite=req.wwwSite;
  var uVerification=req.strSchemeLong+wwwSite+'/'+leafVerifyPWResetReturn+'?code='+code;
  var strTxt=`<h3>Password reset request on `+wwwSite+`</h3>
<p>Someone (maybe you) tries to reset their `+wwwSite+` password and entered `+email+` as their email.</p>
<p>Is this you, then use the link below to have a new password generated and sent to you.</p>
<p>Otherwise neglect this message.</p>
<p><a href=`+uVerification+`>`+uVerification+`</a></p>`;
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
  if('error' in objT) { var m=objT.error.message; return [new Error(m)]; }
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
  
  var arrT = Object.keys(objForm).map(function (key) { return key+'='+objForm[key]; }), strQuery=arrT.join('&'); 
  if(strQuery.length) uGraph+='?'+strQuery;
  var semY=0, semCB=0, err, response, body;
  var reqStream=requestMod.get(uGraph,  function(errT, responseT, bodyT) { err=errT; response=responseT; body=bodyT; if(semY)flow.next(); semCB=1;  }); if(!semCB){semY=1; yield;}
  var buf=body;
  

  try{ var objGraph=JSON.parse(buf.toString()); }catch(e){ return [e]; }
  this.objGraph=objGraph;

    // interpretGraph
  if('error' in objGraph) {var {type,message}=objGraph.error, tmp='Error accessing data from ID provider: '+type+' '+message+'\n';  return [new Error(tmp)]; }

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
  if(typeof idFB=='undefined') { return [new Error("Error idFB is empty")];}
  if(typeof nameIP=='undefined' ) {nameIP=idFB;}
  this.sessionLoginIdP={IP:strIP, idFB:idFB, idIdPlace, idOpenId, email:email, nameIP:nameIP, image:image};
  yield *setRedis(flow, req.sessionID+'_LoginIdP', this.sessionLoginIdP, maxLoginUnactivity);
  
  
  //var [err,con]=yield*mysqlGetConnection(flow, this.pool);  if(err) return [err];   this.con=con;
  //var [err]=yield*mysqlStartTransaction(flow, con);  if(err) return [err];
  var [err]=yield* this.myMySql.startTransaction(flow);  if(err) return [err]; 
  if(['userFun', 'complainerFun', 'customerFun', 'sellerFun', 'teamFun', 'adminFun', 'refetchFun', 'mergeIDFun'].indexOf(strFun)!=-1){ 
    var [err, result]=yield *this[strFun](inObj);  //if(err) return [err];
  }
  //if(err){ yield*mysqlRollbackNRelease(flow, con); return [err]; } else{ [err]=yield*mysqlCommitNRelease(flow, con); if(err) return [err]; }
  if(err){ yield* this.myMySql.rollbackNRelease(flow); return [err]; } else{ [err]=yield* this.myMySql.commitNRelease(flow); if(err) return [err]; }
  return [null, [Ou]];
}


ReqBE.prototype.userFun=
ReqBE.prototype.complainerFun=
ReqBE.prototype.customerFun=
ReqBE.prototype.sellerFun=function*(){
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMerge.call(this, objT); if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.teamFun=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, customerTeamTab, sellerTeamTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMerge.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push(`INSERT INTO `+userTab+` (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW) VALUES (?,?,?,?,?,?,?, MD5(RAND()))
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;`);
  
  if(inObj.strRole=='customer'){
    Sql.push("INSERT INTO "+customerTeamTab+" (idUser,tCreated) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);");
  }else{
    Sql.push("INSERT INTO "+sellerTeamTab+" (idUser,tCreated) VALUES (LAST_INSERT_ID(),now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);");
  }
  var sql=Sql.join('\n');
  var [err, results, fields]=yield* this.myMySql.query(flow, sql, Val);  if(err) return [err];
  //var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.adminFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab, adminTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMerge.call(this, objT); if(err) return [err];
  
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image,      idFB, idIdPlace, idOpenId, email, nameIP, image];
  Sql.push(`INSERT INTO `+userTab+` (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW) VALUES (?,?,?,?,?,?,?, MD5(RAND()))
  ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), idFB=IF(?,?,idFB), idIdPlace=IF(?,?,idIdPlace), idOpenId=IF(?,?,idOpenId), email=IF(email,email,?), nameIP=?, image=?;`);
  Sql.push(`INSERT INTO `+adminTab+` VALUES (LAST_INSERT_ID(),0,now()) ON DUPLICATE KEY UPDATE tCreated=VALUES(tCreated);`);
  var sql=Sql.join('\n');
  var [err, results, fields]=yield* this.myMySql.query(flow, sql, Val);  if(err) return [err];
  //var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  return [null, Ou];
}
ReqBE.prototype.refetchFun=function*(){
  var req=this.req, flow=req.flow, site=req.site, {userTab}=site.TableName;
  var Ou={};
  var objT=this.sessionLoginIdP, [err, results]=yield* accountMerge.call(this, objT); if(err) return [err];
  
  var idUser=this.sessionUserInfoFrDB.user.idUser;
  var Sql=[], {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;
  var Val=[idFB, idIdPlace, idOpenId, email, nameIP, image, idUser];
  Sql.push(`UPDATE `+userTab+` SET idFB=?, idIdPlace=?, idOpenId=?, email=?, nameIP=?, image=? WHERE idUser=?;`);
  var sql=Sql.join('\n');
  var [err, results, fields]=yield* this.myMySql.query(flow, sql, Val);  if(err) return [err];
  //var [err, results, fields]=yield*mysqlQuery(flow, this.con, sql, Val);  if(err) return [err];
  return [null, Ou];
}



ReqBE.prototype.setupById=function*(inObj){ //check  idFB (or idUser) against the seller-table and return diverse data
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, Ou={};
  
  var StrRole=null; if(inObj && typeof inObj=='object' && 'Role' in inObj) StrRole=inObj.Role;
  
  var StrRoleAll=['customer', 'seller','customerTeam','sellerTeam','admin','complainer','complainee'];
  if(typeof StrRole=='undefined' || !StrRole) StrRole=StrRoleAll; 
  if(typeof StrRole=='string') StrRole=[StrRole];
  var BoTest={};
  for(var i=0;i<StrRoleAll.length;i++) { var strRole=StrRoleAll[i]; BoTest[strRole]=StrRole.indexOf(strRole)!=-1; }
  
  var userInfoFrDBUpd={};
  
  var idUser=this.sessionUserInfoFrDB.user.idUser||null;
  var {idFB, idIdPlace, idOpenId}=this.sessionLoginIdP;
  if(!idUser) { idUser=yield* getRedis(flow, req.sessionID+'_LoginIdUser'); }
  //if(!idUser) { var [err,idUser]=yield* cmdRedis(flow, 'GET', [req.sessionID+'_LoginIdUser']); }
    
  var Sql=[], Val=[idUser, idFB, idIdPlace, idOpenId, BoTest.customer, BoTest.seller, BoTest.customerTeam, BoTest.sellerTeam, BoTest.admin, BoTest.complainer, BoTest.complainee];
  Sql.push("CALL "+siteName+"GetUserInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
  var sql=Sql.join('\n');
  
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var res=results[0], c=res.length; 
  if(c==1) {
    userInfoFrDBUpd.user=res[0];
    var res=results[1], c=res.length; if(BoTest.customer) userInfoFrDBUpd.customer=c==1?res[0]:0;
    var res=results[2], c=res.length; if(BoTest.seller) userInfoFrDBUpd.seller=c==1?res[0]:0;
    var res=results[3], c=res.length; if(BoTest.customerTeam) userInfoFrDBUpd.customerTeam=c==1?res[0]:0;
    var res=results[4], c=res.length; if(BoTest.sellerTeam) userInfoFrDBUpd.sellerTeam=c==1?res[0]:0;
    var res=results[5], c=res.length; if(BoTest.admin) userInfoFrDBUpd.admin=c==1?res[0]:0;
    var n=results[6][0].n;   if(BoTest.complainer) userInfoFrDBUpd.complainer=n?{idUser:userInfoFrDBUpd.user.idUser, n:n}:0; 
    var n=results[7][0].n;   if(BoTest.complainee) userInfoFrDBUpd.complainee=n?{idUser:userInfoFrDBUpd.user.idUser, n:n}:0;  
  } else extend(userInfoFrDBUpd, specialistDefault);
  
  extend(this.GRet.userInfoFrDBUpd, userInfoFrDBUpd);   extend(this.sessionUserInfoFrDB, userInfoFrDBUpd);
  yield *setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  
  return [null, [Ou]];
}

ReqBE.prototype.VSetPosCond=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, Ou={}, {customerTab, sellerTab}=site.TableName;
  var {user, customer, seller}=this.sessionUserInfoFrDB; if(!customer && !seller) {  return [null, [Ou]];}  // this.mes('No session');  // VSetPosCond is allways called when page is loaded (for sellers as well as any visitor) 
  var {x,y}=inObj;
  var projs=new MercatorProjection(),  lat=projs.fromYToLat(y);
  if(seller){
    var {idUser,coordinatePrecisionM}=seller;
    var [xtmp,ytmp]=roundXY(coordinatePrecisionM, x, y, lat);
    var sql="UPDATE "+sellerTab+" SET x=?, y=? WHERE idUser=? ", Val=[xtmp,ytmp,idUser];
    var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  }
  if(customer){
    var {idUser,coordinatePrecisionM}=customer;
    var [xtmp,ytmp]=roundXY(coordinatePrecisionM, x, y, lat);
    var sql="UPDATE "+customerTab+" SET x=?, y=? WHERE idUser=? ", Val=[xtmp,ytmp,idUser];
    var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  }
  return [null, [Ou]];
}


ReqBE.prototype.logout=function*(inObj){
  var req=this.req, flow=req.flow, Ou={};
  var [err,tmp]=yield* cmdRedis(flow, 'DEL', [req.sessionID+'_UserInfoFrDB', req.sessionID+'_LoginIdP', req.sessionID+'_LoginIdUser']);
  this.sessionLoginIdP={};  this.sessionUserInfoFrDB=extend({}, specialistDefault);  this.GRet.userInfoFrDBUpd=extend({},specialistDefault);
  this.mes('Logged out'); return [null, [Ou]];
}

ReqBE.prototype.setUpCond=function*(inObj){
  var site=this.req.site, req=this.req, flow=req.flow, ORole=site.ORole;  //[oC, oS]
  if(typeof inObj.CharRole!='string') return [new ErrorClient("typeof inObj.CharRole!='string'")];
  if(inObj.CharRole.length>2) return [new ErrorClient("inObj.CharRole.length>2")];
    // Check CharRole input
  var oFound={}
  for(var i=0;i<inObj.CharRole.length;i++){
    var charRole=inObj.CharRole[i];
    if("cs".indexOf(charRole)==-1) return [new ErrorClient('"cs".indexOf(charRole)==-1')];
    if(charRole in oFound) return [new ErrorClient("charRole in oFound")];
    oFound[charRole]=1;
  }
    // Check OFilt input
  if(!(inObj.OFilt instanceof Array)) return [new ErrorClient('!(inObj.OFilt instanceof Array)')]; 
  if(typeof inObj.OFilt[0]!='object') return [new ErrorClient('typeof inObj.OFilt[0]!="object"')]; 
  if(typeof inObj.OFilt[1]!='object') return [new ErrorClient('typeof inObj.OFilt[1]!="object"')]; 
  
  this.CharRole=inObj.CharRole;
  this.OFilt=inObj.OFilt;
  
  var Ou={};  this.OQueryPart=[];
  for(var i=0;i<this.CharRole.length;i++){
    var oR=ORole[i],  arg={KeySel:oR.KeySel, Prop:oR.Prop, Filt:inObj.OFilt[i]};
    this.OQueryPart[i]=setUpCond(arg);
  }
  return [null, [Ou]];
} 
ReqBE.prototype.setUp=function*(inObj){  // Set up some properties etc.  (VPSize, pC, zoom).
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {userTab, customerTab, sellerTab}=site.TableName;
  
  var Ou={},  Sql=[];
  Sql.push("SELECT UNIX_TIMESTAMP(now()) AS now;");

  //var zoom=Number(inObj.zoom), boCalcZoom=zoom==-1; 
  var zoom=Number(inObj.zoom), boCalcZoom=!('zoom' in inObj);
  this.VPSize=inObj.VPSize;  
  this.pC=inObj.pC; var xC=Number(this.pC.x), yC=Number(this.pC.y), wVP=Number(this.VPSize[0]), hVP=Number(this.VPSize[1]); 
  //Sql.push("SET @xC="+xC+"; SET @yC="+yC+"; SET @wVP="+wVP+"; SET @hVP="+hVP+";
  
  //sql="UPDATE "+sellerTab+" SET boShow=0, tPos=now() WHERE boShow=1 AND now()>DATE_ADD(tPos, INTERVAL hideTimer SECOND)";
  Sql.push("CALL "+siteName+"IFunPoll;"); 

  if(boCalcZoom){  
    Sql.push("SELECT count(u.idUser) AS nCustomerReal FROM "+userTab+" u JOIN "+customerTab+" ro ON u.idUser=ro.idUser;");
    Sql.push("SELECT count(u.idUser) AS nSellerReal FROM "+userTab+" u JOIN "+sellerTab+" ro ON u.idUser=ro.idUser;");
 
    var WhereTmpC=this.OQueryPart[0].Where.concat("boShow=1", sqlBeforeHiding),  strCondC=array_filter(WhereTmpC).join(' AND ');
    var WhereTmpS=this.OQueryPart[1].Where.concat("boShow=1", sqlBeforeHiding),  strCondS=array_filter(WhereTmpS).join(' AND ');
    
    var xOpp, xAddTerm; if(xC>128) {xOpp=xC-128; xAddTerm="IF(x<"+xOpp+",256,0)";}  else {xOpp=xC+128;  xAddTerm="IF(x>"+xOpp+",-256,0)"; } // xOpp : x of opposite side of planet
    var tmp="min(greatest(abs(x+"+xAddTerm+"-"+xC+"),abs(y-"+yC+")))";
    Sql.push("SELECT "+tmp+" AS distMin FROM "+customerTab+" ro WHERE "+strCondC+";");
    Sql.push("SELECT "+tmp+" AS distMin FROM "+sellerTab+" ro WHERE "+strCondS+";");
  }
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  this.GRet.curTime=results[0][0].now; 
  if(boCalcZoom){
    this.GRet.nCustomerReal=results[2][0].nCustomerReal||0; 
    this.GRet.nSellerReal=results[3][0].nSellerReal||0; 
    var distMinC=results[4][0].distMin,   distMinS=results[5][0].distMin;
    if(distMinC===null) distMinC=intMax;  if(distMinS===null) distMinS=intMax;
    var distMin=Math.min(distMinC,distMinS);  
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

//ReqBE.prototype.addMapCond=function*(inObj){}


ReqBE.prototype.getList=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {userTab, sellerTab, sellerTeamTab, customerTab, customerTeamTab, complaintTab}=site.TableName;

  var Ou={};
  var xl,xh,yl,yh;
  if(this.zoom>1){
    var projs=new MercatorProjection();
    var {sw, ne}=projs.getBounds(this.pC,this.zoom,this.VPSize); xl=sw.x; xh=ne.x; yl=ne.y; yh=sw.y;
  }  else {xl=0; xh=256; yl=0; yh=256;}
  if(xh-xl>256) {xl=0; xh=256;}
  [xl]=normalizeAng(xl,128,256);   [xh]=normalizeAng(xh,128,256);
  this.whereMap="y>"+yl+" AND y<"+yh+" AND "; if(xl<xh) this.whereMap+="x>"+xl+" AND x<"+xh; else this.whereMap+="(x>"+xl+" OR x<"+xh+")";
  
  var Sql=[];
  for(var i=0;i<this.CharRole.length;i++){
    var charRole=this.CharRole[i];
    var roleTab=charRole=='c'?customerTab:sellerTab;
    var roleTeamTab=charRole=='c'?customerTeamTab:sellerTeamTab;
    
    var WhereTmp=this.OQueryPart[i].Where.concat(this.whereMap, "boShow=1", sqlBeforeHiding),  strCond=array_filter(WhereTmp).join(' AND ');
    var strColT=this.OQueryPart[i].strCol;
//Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strColT+" FROM (("+roleTab+" ro JOIN "+userTab+" u ON ro.idUser=u.idUser) LEFT JOIN "+roleTeamTab+" tea on tea.idUser=ro.idTeam) LEFT JOIN "+complaintTab+" rb ON rb.idComplainee=ro.idUser WHERE "+strCond+" GROUP BY ro.idUser ORDER BY tPos DESC LIMIT 0, "+maxList+";");
    Sql.push("SELECT SQL_CALC_FOUND_ROWS "+strColT+" FROM ("+roleTab+" ro JOIN "+userTab+" u ON ro.idUser=u.idUser) LEFT JOIN "+roleTeamTab+" tea on tea.idUser=ro.idTeam  WHERE "+strCond+" LIMIT 0, "+maxList+";"); // ORDER BY tPos DESC GROUP BY ro.idUser
    Sql.push("SELECT FOUND_ROWS() AS n;"); // nFound

    var WhereTmp=[this.whereMap, "boShow=1", sqlBeforeHiding],  strCond=array_filter(WhereTmp).join(' AND ');
    Sql.push("SELECT count(*) AS n FROM "+roleTab+" ro WHERE "+strCond+";"); // nUnFiltered
  }
  
  
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];

  Ou.NTotNFilt=[]; Ou.arrList=[]; this.BoUseList=[];
  for(var i=0;i<this.CharRole.length;i++){
    var nFound=results[3*i+1][0].n;
    this.BoUseList[i]=nFound<=maxList;
    var tmp=[]; if(this.BoUseList[i]){ tmp=results[3*i]; } Ou.arrList[i]=arrObj2TabNStrCol(tmp);
    //var tmp=this.CharRole[i]=='c'?'Customers':'Sellers';  this.mes(tmp+": "+nFound);
    Ou.NTotNFilt[i]=[nFound, results[3*i+2][0].n];
  }
  //copySome(Ou, this, ['arrGroup']);
  return [null, [Ou]];
} 



ReqBE.prototype.getGroupList=function*(inObj){  
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName, {userTab, customerTab, sellerTab}=site.TableName;
  
  //var zoomFac=Math.pow(2,this.zoom-4.3);
  var zoomFac=Math.pow(2,this.zoom-5);
  
  var Ou={}, Sql=[];
  for(var i=0;i<this.CharRole.length;i++){
    if(!this.BoUseList[i]){
      var charRole=this.CharRole[i];
      var WhereTmp=this.OQueryPart[i].Where.concat([this.whereMap, "boShow=1", sqlBeforeHiding]),  strCond=array_filter(WhereTmp).join(' AND ');
      var roleTab=charRole=='c'?customerTab:sellerTab;
      //var strTableRef=roleTab+' ro';
      var strTableRef=userTab+' u JOIN '+roleTab+' ro ON u.idUser=ro.idUser';
      Sql.push("SELECT round(x*"+zoomFac+")/"+zoomFac+" AS roundX, round(y*"+zoomFac+")/"+zoomFac+" AS roundY, count(*) AS n FROM "+strTableRef+" WHERE "+strCond+" GROUP BY roundX, roundY;");
    } else Sql.push("SELECT 1 FROM DUAL;");
  }
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  
  //if(!(results instanceof Array)) results=[results];
  if(this.CharRole.length==1) results=[results];
  Ou.arrGroup=[];
  for(var i=0;i<this.CharRole.length;i++){
    //if(!this.BoUseList[i])  Ou.arrGroup[i]=arrObj2TabNStrCol(results[i]);
    //else Ou.arrGroup[i]=[];
    var tmp=[]; if(!this.BoUseList[i]) tmp=results[i];  Ou.arrGroup[i]=arrObj2TabNStrCol(tmp);
  }
  return [null, [Ou]];
} 


ReqBE.prototype.getHist=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, customerTab, sellerTab}=site.TableName;
  var Ou={arrHist:[]};
  for(var i=0;i<this.CharRole.length;i++){
    var charRole=this.CharRole[i], charRoleUC=charRole.toUpperCase();
    var roleTab=charRole=='c'?customerTab:sellerTab;
    
    
    var strTableRef=roleTab+' ro';
    var strTableRef=userTab+' u JOIN '+roleTab+' ro ON u.idUser=ro.idUser';
    
    var arg={strTableRef:strTableRef, WhereExtra:[this.whereMap, "boShow=1", sqlBeforeHiding], myMySql:this.myMySql};  //, Ou:Ou
    arg.Filt=this.OFilt[i];
    //arg.mysqlPool=this.pool;
    //arg.oRole=site['o'+charRoleUC];
    arg.Prop=site['o'+charRoleUC].Prop;
    arg.Where=this.OQueryPart[i].Where;
    arg.strDBPrefix=site.siteName;

    var [err, Hist]=yield* getHist(flow, arg); if(err) return [err];  //Ou.Hist=Hist;
    //var [err, Hist]=yield* getHist(flow, arg); if(err) return [err];
    Ou.arrHist[i]=Hist;
  }

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
  Val.push(myJSEscape(inObj.displayName), idUser);
  Sql.push("UPDATE "+userTab+" SET displayName=? WHERE idUser=?;");
  
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var c=results.affectedRows, mestmp=c+" affected row"; if(c!=1) mestmp+='s';
  
  this.mes(mestmp);      
  return [null, [Ou]];
}


ReqBE.prototype.UDelete=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var userTab=site.TableName.userTab;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser; 
  
  var Sql=[], Val=[];
  Sql.push("DELETE FROM "+userTab+" WHERE idUser=?;"); Val.push(idUser);
  
  this.sessionUserInfoFrDB=extend({}, specialistDefault);    yield *setRedis(flow, req.sessionID+'_UserInfoFrDB', this.sessionUserInfoFrDB, maxUnactivity);
  extend(this.GRet.userInfoFrDBUpd, specialistDefault); 

  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  site.boGotNewSellers=1; // variabel should be called boNUsers changed or something..
  site.nUser=Number(results[1][0].n);
  this.mes('deleted');      
  return [null, [Ou]];
}


/*********************************************************************************************
 * Role-functions
 *********************************************************************************************/

ReqBE.prototype.RIntroCB=function*(inObj){ // writing needSession
  var req=this.req, flow=req.flow, site=req.site, {userTab, customerTab, sellerTab}=site.TableName, [oC, oS]=site.ORole;
  var Ou={}; 
  if(isEmpty(this.sessionLoginIdP)) {this.mes('No session'); return [null, [Ou]]; }
  var {idFB, idIdPlace, idOpenId, email, nameIP, image}=this.sessionLoginIdP;

  //if(inObj.email) email=inObj.email;
  var {tel, displayName, currency, charRole, boIdIPImage, displayEmail}=inObj;
  tel=myJSEscape(tel); displayName=myJSEscape(displayName); currency=myJSEscape(currency);
  var boImgOwn=1-Number(boIdIPImage);
  
  if(displayEmail) {
    var boOK=validator.isEmail(displayEmail); if(!boOK) return [new ErrorClient("displayEmail didn't pass validation test.")];
  }
  
  
  var charRole=inObj.charRole; if('cs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  var roleTab=charRole=='c'?customerTab:sellerTab;
  var oRole=charRole=='c'?oC:oS;
  
  
    // An entry in userTab may exist (if the user is a complainer). However an entry in roleTab is something one can assume does not exist.
  var Sql=[], Val=[];
  Sql.push("INSERT INTO "+userTab+" (idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, displayName, boImgOwn) VALUES (?, ?, ?, ?, ?, ?, MD5(RAND()), ?, ?) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser), email=?, nameIP=?, image=?;");
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Val.push(idFB, idIdPlace, idOpenId, email, nameIP, image, displayName, boImgOwn,   email, nameIP, image);
  Sql.push("INSERT INTO "+roleTab+" (idUser, tCreated, tLastPriceChange, tPos, tLastWriteOfTA, histActive, tel, currency, displayEmail) VALUES (@idUser, now(), now(), now(), now(), 1, ?, ?, ?) ON DUPLICATE KEY UPDATE idUser=idUser;");
  Val.push(tel, currency, displayEmail);
  //Sql.push("SET OboInserted=(ROW_COUNT()=1);");  Sql.push("SELECT @boInserted AS boInserted;");
  Sql.push("SELECT @boInserted:=(ROW_COUNT()=1) AS boInserted;");

  Sql.push("SELECT count(*) AS n FROM "+userTab+";");
  
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var c=results[0].affectedRows; if(c>1) return [new Error(c+" userTab rows affected")];
  var idUser=Number(results[1][0].idUser);    yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var boIns=site.boGotNewSellers=Number(results[3][0].boInserted);
  site.nUser=Number(results[4][0].n);
  var  tmpMes='Data '+(boIns?'inserted':'updated'); this.mes(tmpMes);
  return [null, [Ou]];
}


ReqBE.prototype.RUpdate=function*(inObj){ // writing needSession
  var req=this.req, flow=req.flow, site=req.site, [oC, oS]=site.ORole, {userTab, customerTab, sellerTab}=site.TableName;
  var Ou={}; 

  var user=this.sessionUserInfoFrDB.user, objT;
  if(user) objT=user;  else if(isSet(this.sessionLoginIdP)) objT=this.sessionLoginIdP;  else {this.mes('No session'); return [null, [Ou]]; }
  var {idUser, idFB, idIdPlace, idOpenId, email, nameIP, image}=objT; 
  if(typeof idUser=='undefined') {return [new Error('no idUser')];}
  
  var charRole=inObj.charRole; if('cs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  var roleTab=charRole=='c'?customerTab:sellerTab;
  var oRole=charRole=='c'?oC:oS;

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
    var strQ='?', value=objVar[name];
    if('roleUpdF' in oRole.Prop[name]) { var [strQ,value]=oRole.Prop[name].roleUpdF.call(oRole.Prop, name, value);  }

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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  this.mes('Data updated');      
  return [null, [Ou]];
}

ReqBE.prototype.RShow=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var {customerTab, sellerTab}=site.TableName;
  var Ou={};
  var charRole=inObj.charRole; if('cs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  var {user, customer, seller}=this.sessionUserInfoFrDB; if(!user || (!customer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var roleTab=charRole=='c'?customerTab:sellerTab;
  var role=charRole=='c'?customer:seller;
  
  var roleTabAlt=charRole=='c'?sellerTab:customerTab;
  
  var {idUser,coordinatePrecisionM}=role;
  var {x,y}=inObj;
  var projs=new MercatorProjection(),  lat=projs.fromYToLat(y);
  var [xtmp,ytmp]=roundXY(coordinatePrecisionM, x, y, lat);

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne(?);"); 
  Sql.push("UPDATE "+roleTab+" SET x=?, y=?, boShow=1, tPos=now(), histActive=histActive|1 WHERE idUser=?;");
  Sql.push("UPDATE "+roleTabAlt+" SET boShow=0, tPos=0, histActive=histActive|1 WHERE idUser=?;");
  Val=[idUser,xtmp,ytmp,idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var strTmp=charRole=='c'?'Customer':'Seller';   this.mes(strTmp+' visible');    
  return [null, [Ou]];
}
ReqBE.prototype.RHide=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var {customerTab, sellerTab}=site.TableName;
  var Ou={};
  var charRole=inObj.charRole; if('cs'.indexOf(charRole)==-1) { this.mes('No such charRole'); return [null, [Ou,'errFunc']];}
  var {user, customer, seller}=this.sessionUserInfoFrDB; if(!user || (!customer && !seller)) { this.mes('No session'); return [null, [Ou,'errFunc']];}
  var idUser=user.idUser;
  var roleTab=charRole=='c'?customerTab:sellerTab;

  var Sql=[], Val=[];
  Sql.push("CALL "+siteName+"TimeAccumulatedUpdOne(?);"); 
  Sql.push("UPDATE "+roleTab+" SET boShow=0, tPos=0, histActive=histActive|1 WHERE idUser=?;");
  Val=[idUser,idUser];
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var strTmp=charRole=='c'?'Customer':'Seller';   this.mes(strTmp+' hidden');      
  return [null, [Ou]];
}


//
// Complaints
//

ReqBE.prototype.complaintUpdateComment=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var StrMes=[];
  
  var idUser=Number(results[1][0].idUser);    yield* setRedis(flow, req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  //var c=results[2].affectedRows; if(c==1) StrMes.push("Entry inserted"); else if(c==2) StrMes.push("Entry updated");
  //var c=results[3].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  //var n=results[4][0].n; if(n==0) StrMes.push("No comments remaining");

  var mess=results[2][0].mess; StrMes.push(mess);
  
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);

  return [null, [Ou]];
}
ReqBE.prototype.complaintUpdateAnswer=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
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
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var StrMes=[];
  //var c=results[0].affectedRows; if(c==1) StrMes.push("Entry updated"); else if(c>1) StrMes.push(c+" entries updated");
  //var c=results[1].affectedRows; if(c==1) StrMes.push("Entry deleted"); else if(c>1) StrMes.push(c+" entries deleted");
  
  var mess=results[0][0].mess; StrMes.push(mess);
  var mestmp=StrMes.join(', ');
  this.mes(mestmp);
  return [null, [Ou]];
}

ReqBE.prototype.complaintOneGet=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, complaintTab}=site.TableName;
  var Ou={};   
  //debugger
  var {user}=this.sessionUserInfoFrDB; //if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idComplainer, idComplainee;
  if('idComplainer' in inObj) idComplainer=inObj.idComplainer;  else if(user) idComplainer=user.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  if('idComplainee' in inObj) idComplainee=inObj.idComplainee; else if(user) idComplainee=user.idUser; else{ this.mes('Not Logged in'); return [null, [Ou]]; }
  
  var sql="SELECT comment, answer FROM "+userTab+" u JOIN "+complaintTab+" co ON u.idUser=co.idComplainee WHERE idComplainee=? AND idComplainer=? "; 
  var Val=[idComplainee,idComplainer];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var c=results.length; 
  var mestmp; if(c>0){ Ou.row=results[0]; mestmp="Feedback fetched"; }else{ Ou.row={}; mestmp="No existing feedback";}
  this.mes(mestmp);
  return [null, [Ou]];
}

ReqBE.prototype.getComplaintsOnComplainee=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, complaintTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);
  
  var idComplainee=inObj.idComplainee;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS idComplainer, IF(boImgOwn,'',image) AS image, displayName, boImgOwn, comment, answer, UNIX_TIMESTAMP(co.tCreated) AS tCreated FROM "+complaintTab+" co JOIN "+userTab+" u ON co.idComplainer=u.idUser WHERE idComplainee=? ORDER BY co.tCreated DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idComplainee);
  Sql.push("SELECT FOUND_ROWS() AS n;");
  var sql=Sql.join("\n ");
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;
  return [null, [Ou]];
}
ReqBE.prototype.getComplaintsFromComplainer=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site, {userTab, sellerTab, complaintTab}=site.TableName;
  var Ou={};   
  var offset=Number(inObj.offset), rowCount=Number(inObj.rowCount);

  var idComplainer=inObj.idComplainer;
  var Sql=[], Val=[];
  Sql.push("SELECT SQL_CALC_FOUND_ROWS u.idUser AS idUser, IF(boImgOwn,'',image) AS image, displayName, boImgOwn, imTag, comment, answer, UNIX_TIMESTAMP(co.tCreated) AS tCreated FROM "+userTab+" u JOIN "+complaintTab+" co ON u.idUser=co.idComplainee WHERE idComplainer=? ORDER BY co.tCreated DESC LIMIT "+offset+","+rowCount+";"); 
  Val.push(idComplainer); 
  Sql.push("SELECT FOUND_ROWS() AS n;"); 
  var sql=Sql.join("\n ");
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var Ou=arrObj2TabNStrCol(results[0]);
  Ou.nCur=results[0].length; 
  Ou.nTot=results[1][0].n;   
  //this.mes("Found: "+nCur);
  return [null, [Ou]];
}


//
// Team
//

ReqBE.prototype.teamSaveName=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var Ou={};
  var strRole=inObj.strRole; if(strRole!='customer' && strRole!='seller') { this.mes('No such strRole: '+strRole); return [null, [Ou,'errFunc']];}
  var roleTeamTab=site.TableName[strRole+'TeamTab'];

  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved}=roleTeam; if(!boApproved){this.mes('Team not approved'); return [null, [Ou]];}
  
  
  var boOK=validator.isURL(inObj.link, {protocols: ['http','https']}); if(!boOK) return [new ErrorClient('Link url is not approved')];
  
  var sql="UPDATE "+roleTeamTab+" SET link=? WHERE idUser=?;", Val=[inObj.link, idUser];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}
ReqBE.prototype.teamSave=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site;
  var Ou={};
  var strRole=inObj.strRole; if(strRole!='customer' && strRole!='seller') { this.mes('No such strRole: '+strRole); return [null, [Ou,'errFunc']];}
  var roleTab=site.TableName[strRole+'Tab'];
  
  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  if(!roleTeam.boApproved){ this.mes('Team not approved'); return [null, [Ou]];}
  
  var idUser=Number(inObj.idUser),   boOn=Number(inObj.boOn); 
  var sql="UPDATE "+roleTab+" SET idTeam=IF(?,idTeamWanted,0) WHERE idUser=?;", Val=[boOn,idUser];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  this.mes('Data saved');
  return [null, [Ou]];
}

ReqBE.prototype.teamLoad=function*(inObj){  // writing needSession
  var req=this.req, flow=req.flow, site=req.site, {userTab}=site.TableName;
  var Ou={};
  var strRole=inObj.strRole; if(strRole!='customer' && strRole!='seller') { this.mes('No such strRole: '+strRole); return [null, [Ou,'errFunc']];}
  var roleTab=site.TableName[strRole+'Tab'];
  
  var {user}=this.sessionUserInfoFrDB, roleTeam=this.sessionUserInfoFrDB[strRole+'Team'];
  if(!user || !roleTeam) { this.mes('No session'); return [null, [Ou]];}
  var {idUser, boApproved, imTag, link}=roleTeam;  if(boApproved==0){ this.mes('Team not approved'); return [null, [Ou]];}
  
  copySome(Ou, roleTeam, ['idUser', 'imTag', 'link']);

  var TmpCol=['u.idUser', 'idFB', 'idIdPlace', 'idOpenId', 'displayName', 'idTeam', 'imTag'];
  for(var i=0;i<TmpCol.length;i++){TmpCol[i]+=" AS '"+i+"'";} 
  var strCol=TmpCol.join(', ');
  var sql="SELECT "+strCol+" FROM "+roleTab+" r JOIN "+userTab+" u ON r.idUser=u.idUser WHERE idTeamWanted=?";
  var Val=[idUser];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var nRow=results.length;
  if(nRow==0) { this.mes('No '+strRole+'s connected');  }
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
  var req=this.req, flow=req.flow, site=req.site, {userTab, userImageTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  var idUser=user.idUser;

  var Sql=[];
  Sql.push("DELETE FROM "+userImageTab+" WHERE idUser="+idUser+";");
  Sql.push("UPDATE "+userTab+" SET boImgOwn=0 WHERE idUser="+idUser+";");
  var sql=Sql.join("\n "), Val=[];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var nDel=results[0].affectedRows; 
  Ou.boOK=0; if(nDel==1) {Ou.boOK=1; this.mes('Image deleted'); } else { this.mes(nDel+" images deleted!?");}
  return [null, [Ou]];
}


ReqBE.prototype.pubKeyStore=function*(inObj){
  var req=this.req, flow=req.flow, site=req.site;
  var {userTab}=site.TableName;
  var Ou={};
  var {user}=this.sessionUserInfoFrDB; if(!user) { this.mes('No session'); return [null, [Ou]];}
  //var idUser=user.idUser, pubKey=inObj.pubKey;
  var sql="UPDATE "+userTab+" SET pubKey=?, iSeq=0 WHERE idUser=?",   Val=[myJSEscape(inObj.pubKey),  user.idUser];
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];
  var boOK=0, nUpd=results.affectedRows, mestmp; 
  //if(nUpd==1) {boOK=1; mestmp="Key inserted"; } else if(nUpd==2) {boOK=1; mestmp="Key updated";} else {boOK=1; mestmp="Nothing changed (same key as before)";}
  if(nUpd==1) {boOK=1; mestmp="Key-half updated";} else {boOK=1; mestmp="Nothing changed (same key-half as before)";}
  Ou.boOK=boOK;    Ou.strMess=mestmp;
  return [null, [Ou]];
}


ReqBE.prototype.getSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site;
  var Var=inObj.Var;
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var Str=['boShowTeam','boAllowEmailAccountCreation'];
  if(!isAWithinB(Var,Str)) {this.mes('Illegal invariable'); return [null, [Ou]]; }
  for(var i=0;i<Var.length;i++){ var name=Var[i]; Ou[name]=app[name]; }
  return [null, [Ou]];
}
ReqBE.prototype.setSetting=function*(inObj){ 
  var req=this.req, flow=req.flow, site=req.site; 
  var settingTab=site.TableName.settingTab;
  var Ou={};
  var StrApp=[],  StrServ=[];
  if(this.sessionUserInfoFrDB.admin) StrApp=['boShowTeam','boAllowEmailAccountCreation'];  
  var Str=StrApp.concat(StrServ);
  var Key=Object.keys(inObj);
  if(!isAWithinB(Key, Str)) { this.mes('Illegal invariable'); return [null, [Ou]];}
  for(var i=0;i<Key.length;i++){ var name=Key[i], tmp=Ou[name]=inObj[name]; if(StrApp.indexOf(name)!=-1) app[name]=tmp; else serv[name]=tmp; }
  return [null, [Ou]];    
}




ReqBE.prototype.uploadImage=function*(inObj){
  var self=this, req=this.req, flow=req.flow, site=req.site, siteName=site.siteName;
  var {userTab, sellerTeamTab, sellerTeamImageTab, customerTeamTab, customerTeamImageTab, userImageTab}=site.TableName;
  var Ou={};
  var regImg=RegExp("^(png|jpeg|jpg|gif|svg)$");

  var File=this.File;
  var n=File.length; this.mes("nFile: "+n);

  var file=File[0], tmpname=file.path, fileName=file.name; 
  var Match=RegExp('\\.(\\w{1,4})$').exec(fileName); 
  if(!Match){ Ou.strMessage="The file name should have a three or four letter extension, ex: \".jpg\""; return [null, [Ou]]; }
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

  var {user, customer, seller, customerTeam, sellerTeam}=this.sessionUserInfoFrDB;
  
  var kind=this.kind;
  if(kind=='u'){
    if(!customer && !seller) { this.mes('No session'); return [null, [Ou]];}
    var idUser=user.idUser, tab=userImageTab;
  }
  else if(kind=='c'){
    if(!customerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=customerTeam.idUser, tab=customerTeamImageTab;
  }
  else if(kind=='s'){
    if(!sellerTeam) { this.mes('No session'); return [null, [Ou]];}
    var idUser=sellerTeam.idUser, tab=sellerTeamImageTab;
  }
  else return [new ErrorClient("kind="+kind)];



  console.log('uploadImage data.length: '+data.length);
  if(data.length==0) return [new Error('data.length==0')];
  
  var Sql=[], Val=[];
  Sql.push("REPLACE INTO "+tab+" (idUser,data) VALUES (?,?);"); Val.push(idUser,data);
  if(kind=='u') {    Sql.push("UPDATE "+userTab+" SET boImgOwn=1,imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser);    }
  else if(kind=='c'){     Sql.push("UPDATE "+customerTeamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser); }
  else if(kind=='s'){     Sql.push("UPDATE "+sellerTeamTab+" SET imTag=imTag+1 WHERE idUser=?;");  Val.push(idUser); }
  
  //var sql='INSERT INTO imgTab SET ?';
  var sql=Sql.join('\n');
  var [err, results]=yield* this.myMySql.query(flow, sql, Val); if(err) return [err];

  Ou.strMessage="Done";
  return [null, [Ou]];
}



