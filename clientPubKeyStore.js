


spanMessageTextCreate=function(){
  var el=createElement('span'); //, txt=createTextNode('');  el.appendChild(txt);
  var spanInner=createElement('span');
  el.appendChild(spanInner, imgBusy)
  //var el=createElement('span');  el.textContent='';
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    //txt.nodeValue='';
    el.myText(' ');
    imgBusy.hide();
  }
  el.setMess=function(str,time,boRot){
    //txt.nodeValue=str;
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //if(boRot) el.appendChild(imgBusy);
    imgBusy.toggle(Boolean(boRot));
  };
  el.setHtml=function(str,time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //if(boRot) el.appendChild(imgBusy);
    imgBusy.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message').css({'z-index':8100,position:'fixed'});
  return el;
}

var loginInfoExtend=function(el){
"use strict"
  el.setStat=function(){
    var arrKind=[];
    for(var key in userInfoFrDB){   if(userInfoFrDB[key] && key!='user') {  arrKind.push(langHtml.loginInfo[key]); }   }
    var boShow=Boolean(arrKind.length);
    if(boShow){
      spanName.myText(userInfoFrDB.user.nameIP);
      var strTmp=arrKind.join(', '); if(strTmp) strTmp='('+strTmp+')';
      spanKind.myText(strTmp);
      el.show();
    }else {
      el.hide(); 
    } 
  }
  var spanName=createElement('span'), spanKind=createElement('span').css({'margin':'0,0.4em'}); 
  var logoutButt=createElement('a').prop({href:''}).myText(langHtml.loginInfo.logoutButt).css({'float':'right'});
  logoutButt.on('click', function(){ 
    sessionLoginIdP={}; userInfoFrDB=extend({}, specialistDefault);
    var vec=[['logout',1, function(data){yesDiv.setStat();}]];   majax(oAJAX,vec);
    return false;
  });
  
  el.append(spanName,spanKind,logoutButt);
  el.hide();
  return el;
}



window.loginReturnC=function(data){
  yesDiv.setStat();
  loginInfo.setStat();
  setMess('');
}

window.loginReturn=function(strQS, strHash){
  var params=parseQS(strQS.substring(1));
  if(!('state' in params) || params.state !== OAuth.nonce) {    alert('Invalid state parameter.'); return;  } 
  OAuth.cb(params);
}

var OAuthT=function(){
  this.createUrlNSetStatVar=function(IP, uRedir, fun, caller, cb){
    extend(this, {IP:IP, fun:fun, caller:caller, cb:cb});
    this.nonce=randomHash(); //CSRF protection
    var arrQ=["client_id="+site.client_id[IP], "redirect_uri="+encodeURIComponent(uRedir), "state="+this.nonce, "response_type=code"];
    if(IP=='fb')   arrQ.push("display=popup");
    else if(IP=='google')    arrQ.push("scope=profile");
    else if(IP=='idplace')    arrQ.push("scope=name");
    return UrlOAuth[IP]+'?'+arrQ.join('&');
  }
}


loginDivExtend=function(el){
  var popupWin=function(IP) {
    var uPop=OAuth.createUrlNSetStatVar(IP, strSchemeLong+site.wwwLoginRet, strType+'Fun', caller, el.loginReturn);

    if('wwwLoginScope' in site) document.domain = site.wwwLoginScope;

    el.winMy=window.open(uPop, '_blank', 'width=580,height=400');

    if(el.winMy && el.winMy.closed){
      mess.empty();  mess.append(createTextNode('Signing you in '),imgBusy);
      clearInterval(timerClosePoll);
      timerClosePoll = setInterval(function() { if(el.winMy.closed){ clearInterval(timerClosePoll); mess.myText('Sign-in canceled'); }  }, 500);  
    }
    return 0;
  }
  el.loginReturn=function(params){ 
    if('error' in params) { setMess(params.error); }
    else{
      if('code' in params) { 
        var oT={IP:OAuth.IP, fun:OAuth.fun, caller:OAuth.caller, code:params.code};
        var vec=[ ['loginGetGraph', oT], ['setupById', null, function(data){
          if(typeof loginReturnC!=='undefined' && loginReturnC) {loginReturnC(); loginReturnC=null;}
        }]];   majax(oAJAX,vec);
      } else setMess('no "code" parameter in response');
    }
    el.myReset();
  }
  window.OAuth=new OAuthT();
  var strType="seller";
  var timerClosePoll=null;
  el.myReset=function(){     mess.empty(); clearInterval(timerClosePoll);   }

  var uLoginImage=window['u'+ucfirst(strIPPrim)];

  var mess=createElement('span').css({"margin-left":"0.3em"});
  var strButtonSize='2em';
  var fbIm=createElement('img').on('click', function(){popupWin(strIPPrim);}).prop({src:uLoginImage}).css({position:'relative',top:'0.4em',heigth:strButtonSize}); //width:strButtonSize
  var fbHelp=imgHelp.cloneNode().css({margin:'0 0 0 1em'}),  bub=createElement('div').myText(langHtml.helpLoginSeller);     popupHover(fbHelp,bub);  

  var label=createElement('span').myText('Login first, then click yes: ').css({'font-size':'1.3em','font-weight':'bold'});
  el.append(label,fbIm,mess); //,fbHelp
  return el;
}


yesDivExtend=function(el){
  el.setStat=function(){ 
    var boDb=Boolean(userInfoFrDB.user);//Boolean(userInfoFrDB);
    var boIp=isSet(sessionLoginIdP), boWannaBe=boIp && !boDb; loginDiv.toggle(!boDb);  buttStore.prop({disabled:!boDb}); spanErr.toggle(boWannaBe); 
  }
  var storeF=function(){
    var vec=[['pubKeyStore',{pubKey:pubKey},retF]];   majax(oAJAX,vec);
  }
  var retF=function(data){   
    var tmp,strMess="";//boOK=false;
    tmp=data.boOK;   if(typeof tmp!="undefined") boOK=tmp; if(boOK) setTimeout(function(){ divLeaveMess.toggle(Boolean(boOK)); }, 2000);
    tmp=data.strMess;   if(typeof tmp!="undefined") strMess=tmp; divStrMess.myText(strMess); 
    
  }
  //var yesSpan=createElement('div').myText('Yes').css({'text-align':'center'});
  var buttStore=createElement('button').myText('Yes').on('click', storeF).prop({disabled:true}).css({'margin-bottom':'1em'});
  var aTmp=createElement('a').attr({href:uSite,target:"_blank"}).myText(wwwSite);
  var spanErr=createElement('div').css({'margin-bottom':'.5em'}).myAppend('Not registered! Go to the main page: ',aTmp, ' and register first.').hide();

  var divStrMess=createElement('div').css({'margin-top': '1em'});//.hide();
  var divLeaveMess=createElement('div').myText(strLeaveMess).css({'margin-top': '1em'}).hide();
  el.append(buttStore, loginDiv, spanErr, divStrMess,divLeaveMess);    
  
  return el;
}



'use strict';
majax=function(trash, vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  //var vecMod=vecIn.map(el=>{return el.slice(0,2)});
  //var arrRet=[]; vecIn.forEach(function(el,i){arrRet[i]=el[2]||null; delete el[2];}); // Put return functions in a separate array
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  vecIn.push(['CSRFCode',CSRFCode]);
  vecIn.push(['caller',caller]);
  //if(boFormData){
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var tmp=window.btoa(Math.random().toString()).substr(0, 12);
    //xhr.setRequestHeader("Content-Type", "multipart/form-data;boundary=----WebKitFormBoundary" + tmp);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader("Content-Length", formData.length);
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else {  var dataOut=JSON.stringify(vecIn); }
  
  xhr.onload=function () {
    var dataFetched=this.response;
    var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
    
    var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
    delete data.dataArr;
    beRet(data);
    for(var i=0;i<dataArr.length;i++){
      var r=dataArr[i];
      if(r.length==1) {var f=arrRet[i]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
    }
  }
  xhr.onerror=function(e){ var tmp='statusText : '+xhr.statusText;  setMess(tmp); console.log(tmp);   throw 'bla';}
  
  xhr.send(dataOut);
}



//beRet=function(data,textStatus,jqXHR){
  //var tmp=jqXHR.responseText;
  //for(var key in data){
    //window[key].call(this,data[key]); 
  //}
//}
var beRet=function(data){
"use strict"
  for(var key in data){
    window[key].call(this,data[key]);
  }
}

GRet=function(data){
  var tmp;
  tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp;
  tmp=data.sessionLoginIdP; if(typeof tmp!="undefined") {sessionLoginIdP=tmp;}
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }   }
  
  loginInfo.setStat();
  yesDiv.setStat();
}


setUp=function(){

  elHtml=document.documentElement;  elBody=document.body
  elBody.css({margin:0, padding:0});

  boTouch = Number('ontouchstart' in document.documentElement);  //boTouch=1;

  var ua = navigator.userAgent.toLowerCase();
  boAndroid = ua.indexOf("android") > -1;
  boFennec = ua.indexOf("firefox") > -1; 
  boIE = ua.indexOf("msie") > -1; 

  boChrome= /chrome/i.test(ua);
  boIOS= /iPhone|iPad|iPod/i.test(ua);

  strScheme='http'+(boTLS?'s':'');    strSchemeLong=strScheme+'://';    uSite=strSchemeLong+wwwSite;     uCommon=strSchemeLong+wwwCommon;    uBE=uSite+"/"+leafBE;

  wseImageFolder='/'+flImageFolder+'/';
  uImageFolder=uCommon+wseImageFolder;

  uHelpFile=uImageFolder+'help.png';
  uFb=uImageFolder+'fbLogin.png';
  uGoogle=uImageFolder+'googleWide.jpg';
  uIdplace=uImageFolder+'idPlace.png';
  
  uBusy=uImageFolder+'busy.gif';


  imgBusy=createElement('img').attr({src:uBusy});
  imgHelp=createElement('img').prop({src:uHelpFile}).css({'vertical-align':'-0.4em'});


  sessionLoginIdP={};
  userInfoFrDB=extend({}, specialistDefault);

  oAJAX={};
   //uPubKeyStoreBE

  assignSiteSpecific();
  langClientFunc();


  loginDiv=loginDivExtend(createElement('div')).hide();
  loginInfo=loginInfoExtend(createElement('div'));  loginInfo.css({padding:'0em 0em 0em 0em','font-size':'75%'});


  tmpB=createElement('b').myAppend(wwwSite);
  aTmp=createElement('a').attr({href:'https://wikipedia.org/wiki/Key_pair',target:"_blank"}).myText('key pair');
  strShow='Show key'; strHide='Hide key';
  buttonShowKey=createElement('button').myText(strShow).prop({'boOn':false}).css({'margin-left':'1em'}).on('click', function(){
    var b=this; b.boOn=!b.boOn;  b.myText(b.boOn?strHide:strShow); divKey.toggle(b.boOn);
  });
  divKey=createElement('div').myText(pubKey).hide().css({'font-weight':'bold'});
  headA=createElement('div').myAppend('You are now on ',tmpB, ' with one part of a ',aTmp,'.',buttonShowKey,divKey).css({'margin-top':'0.5em'});

  var imgTmp=imgHelp.cloneNode().css({margin:'0 0 0 1em'}),  bub=createElement('div').myText("Storing the key will allow the sender (the owner of the other part of the key pair) to write certain data on this site: (position (lat/lang), visibility (on/off), hideTimer)");     popupHover(imgTmp,bub);  
  headB=createElement('div').myAppend('Do you want to store this key?',imgTmp);
  //<b>position</b>, <b>last activity</b> and <b>visibility</b>

  //messageText=messExtend(createElement('span'));  window.setMess=messageText.setMess;  window.resetMess=messageText.resetMess;  messageText.css({font:'courier'});  
  spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)


  buttCancel=createElement('button').myText('Cancel').on('click', function(){window.close();});

  strLeaveMess="(Click browser-back-button to leave.)";
  cssAns={width:'50%',display:'inline-block','box-sizing': 'border-box','text-align':'center',padding:'1em',flex:1};
  //cssAns={'text-align':'center',padding:'1em'};
  yesDiv=yesDivExtend(createElement('div')).css(cssAns).css({'background':'lightgreen'});
  noSpan=createElement('div').myText('No').css({'text-align':'center','margin-bottom':'1em'});
  noDiv=createElement('div').css(cssAns).css({'border-left':'2px solid grey','vertical-align':'top','background':'pink'}).myAppend(noSpan,strLeaveMess);
  answerDiv=createElement('div').myAppend(yesDiv,noDiv).css({display:'flex'}); //
  //mainDivs=([]).push(loginInfo).push(headA).push(headB).push(answerDiv);
  var MainDiv=[loginInfo, headA, headB, answerDiv];


  elBody.append(...MainDiv,spanMessageText); 

  elBody.css({'text-align':'center'});
  MainDiv.forEach(ele=>ele.css({'margin-left':'auto','margin-right':'auto','text-align':'left',background:'#fff','max-width':'800px'}) )

  var vec=[['setupById']];   majax(oAJAX,vec);
}

window.onload=function(){  setUp(); };


