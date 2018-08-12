


messExtend=function($el){
  $el.resetMess=function(time){ 
    if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    else {$el.html(''); clearTimeout(messTimer);} 
  }
  $el.setMess=function(str,time,boRot){  
    $el.html(str);  clearTimeout(messTimer); 
    if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    if(boRot) $el.append($imgBusy);
  };
  var messTimer;
  $el.addClass('message').css({'z-index':8100,position:'fixed'}); 
  return $el;
}


var loginInfoExtend=function($el){
"use strict"
  $el.setStat=function(){
    var arrKind=[];
    for(var key in userInfoFrDB){   if(userInfoFrDB[key] && key!='user') {  arrKind.push(langHtml.loginInfo[key]); }   }
    var boShow=Boolean(arrKind.length);
    if(boShow){
      $spanName.html(userInfoFrDB.user.nameIP);
      var strTmp=arrKind.join(', '); if(strTmp) strTmp='('+strTmp+')';
      $spanKind.html(strTmp);
      $el.show();
    }else {
      $el.hide(); 
    } 
  }
  var $spanName=$('<span>'), $spanKind=$('<span>'); 
  var $logoutButt=$('<a>').prop({href:''}).text(langHtml.loginInfo.logoutButt).css({'float':'right'});
  $logoutButt.on('click', function(){ 
    sessionLoginIdP={}; userInfoFrDB=$.extend({}, specialistDefault);
    var vec=[['logout',1, function(data){$yesDiv.setStat();}]];   majax(oAJAX,vec);
    return false;
  });
  
  $el.append($spanName,' ',$spanKind,' ',$logoutButt);
  $el.hide();
  return $el;
}



window.loginReturnC=function(data){
  $yesDiv.setStat();
  $loginInfo.setStat();
  $messageText.html('');
}

window.loginReturn=function(strQS, strHash){
  var params=parseQS(strQS.substring(1));
  if(!('state' in params) || params.state !== OAuth.nonce) {    alert('Invalid state parameter.'); return;  } 
  OAuth.cb(params);
}

var OAuthT=function(){
  this.createUrlNSetStatVar=function(IP, uRedir, fun, caller, cb){
    $.extend(this, {IP:IP, fun:fun, caller:caller, cb:cb});
    this.nonce=randomHash(); //CSRF protection
    var arrQ=["client_id="+site.client_id[IP], "redirect_uri="+encodeURIComponent(uRedir), "state="+this.nonce, "response_type=code"];
    if(IP=='fb')   arrQ.push("display=popup");
    else if(IP=='google')    arrQ.push("scope=profile");
    else if(IP=='idplace')    arrQ.push("scope=name");
    return UrlOAuth[IP]+'?'+arrQ.join('&');
  }
}


loginDivExtend=function($el){
  var popupWin=function(IP) {
    var uPop=OAuth.createUrlNSetStatVar(IP, strSchemeLong+site.wwwLoginRet, strType+'Fun', caller, $el.loginReturn);

    if('wwwLoginScope' in site) document.domain = site.wwwLoginScope;

    $el.winMy=window.open(uPop, '_blank', 'width=580,height=400');

    if($el.winMy && $el.winMy.closed){
      $mess.empty();  $mess.append('Signing you in ',$imgBusy);
      clearInterval(timerClosePoll);
      timerClosePoll = setInterval(function() { if($el.winMy.closed){ clearInterval(timerClosePoll); $mess.html('Sign-in canceled'); }  }, 500);  
    }
    return 0;
  }
  $el.loginReturn=function(params){ 
    if('error' in params) { setMess(params.error); }
    else{
      if('code' in params) { 
        var oT={IP:OAuth.IP, fun:OAuth.fun, caller:OAuth.caller, code:params.code};
        var vec=[ ['loginGetGraph', oT], ['setupById', null, function(data){
          if(typeof loginReturnC!=='undefined' && loginReturnC) {loginReturnC(); loginReturnC=null;}
        }]];   majax(oAJAX,vec);
      } else setMess('no "code" parameter in response');
    }
    $el.myReset();
  }
  window.OAuth=new OAuthT();
  var strType="seller";
  var timerClosePoll=null;
  $el.myReset=function(){     $mess.empty(); clearInterval(timerClosePoll);   }

  var uLoginImage=window['u'+ucfirst(strIPPrim)];

  var $mess=$('<span>').css({"margin-left":"0.3em"});
  var strButtonSize='2em';
  var $fbIm=$('<img>').on('click', function(){popupWin(strIPPrim);}).prop({src:uLoginImage}).css({position:'relative',top:'0.4em',heigth:strButtonSize}); //width:strButtonSize
  var $fbHelp=$imgHelp.clone().css({margin:'0 0 0 1em'}),  $bub=$('<div>').html(langHtml.helpLoginSeller);     popupHoverJQ($fbHelp,$bub);  

  var $label=$('<span>').append('Login first, then click yes: ').css({'font-size':'1.3em','font-weight':'bold'});
  $el.append($label,$fbIm,$mess); //,$fbHelp
  return $el;
}


yesDivExtend=function($el){
  $el.setStat=function(){ 
    var boDb=Boolean(userInfoFrDB.user);//Boolean(userInfoFrDB);
    var boIp=isSet(sessionLoginIdP), boWannaBe=boIp && !boDb; $loginDiv.toggle(!boDb);  $buttStore.prop({disabled:!boDb}); $spanErr.toggle(boWannaBe); 
  }
  var storeF=function(){
    var vec=[['pubKeyStore',{pubKey:pubKey},retF]];   majax(oAJAX,vec);
  }
  var retF=function(data){   
    var tmp,strMess="";//boOK=false;
    tmp=data.boOK;   if(typeof tmp!="undefined") boOK=tmp; if(boOK) setTimeout(function(){ $divLeaveMess.toggle(Boolean(boOK)); }, 2000);
    tmp=data.strMess;   if(typeof tmp!="undefined") strMess=tmp; $divStrMess.text(strMess); 
    
  }
  //var $yesSpan=$('<div>').append('Yes').css({'text-align':'center'});
  var $buttStore=$('<button>').html('Yes').on('click', storeF).prop({disabled:true}).css({'margin-bottom':'1em'});
  var $aTmp=$('<a>').attr({href:uSite,target:"_blank"}).text(wwwSite);
  var $spanErr=$('<div>').css({'margin-bottom':'.5em'}).append('Not registered! Go to the main page: ',$aTmp, ' and register first.').hide();

  var $divStrMess=$('<div>').css({'margin-top': '1em'});//.hide();
  var $divLeaveMess=$('<div>').append(strLeaveMess).css({'margin-top': '1em'}).hide();
  $el.append($buttStore, $loginDiv, $spanErr, $divStrMess,$divLeaveMess);    
  
  return $el;
}


majax=function(oAJAX,vec){  // Each argument of vec is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  //$body.prepend('t');
  var makeRetF=function(vecT){ return function(data,textStatus,jqXHR){ 
      var dataArr=data.dataArr;  // Each argument of dataArr is an array either [argument] or [altFuncArg,altFunc]
      delete data.dataArr;
      beRet(data,textStatus,jqXHR);
      for(var i=0;i<dataArr.length;i++){ 
        var r=dataArr[i];
        if(r.length==1) {var f=vecT[i][2]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   } 
      }
      
    }; 
  }
  $.ajaxSetup(oAJAX);
  var vecN=$.extend(true, [], vec);
  for(var i=0; i<vecN.length; i++){delete vecN[i][2];}
  vecN.push(['CSRFCode',CSRFCode]);
  vecN.push(['caller',caller]);
  var tmp=JSON.stringify(vecN);
  
  var func=makeRetF(vec);
  if(oAJAX.crossDomain) $.ajax({success:func,data:o});   
  else   $.ajax({success:func,data:tmp});

  setMess('');
}


beRet=function(data,textStatus,jqXHR){
  var tmp=jqXHR.responseText;
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
  
  $loginInfo.setStat();
  $yesDiv.setStat();
}


setUp=function(){

  elHtml=document.documentElement;  elBody=document.body
  $body=$('body');  $html=$('html');
  $body.css({margin:0, padding:0});

  boTouch = Number('ontouchstart' in document.documentElement);  //boTouch=1;

  var ua = navigator.userAgent.toLowerCase();
  boAndroid = ua.indexOf("android") > -1;
  boFennec = ua.indexOf("firefox") > -1; 
  boIE = ua.indexOf("msie") > -1; 

  boChrome= /chrome/i.test(ua);
  boIOS= /iPhone|iPad|iPod/i.test(ua);
  if(boTouch){
    if(boIOS) {  
      dr=window.devicePixelRatio;      sc=1/dr; 
      if(dr>=2) {      sc=1;    }
      $('#viewportMy').prop('content','initial-scale='+sc);
    } else if(boFennec){
      dr=window.devicePixelRatio;      sc=1/dr; 
      var h=screen.height, w=screen.width;  
    }  
    else {
      sc=1;
      var h=window.innerHeight, w=window.innerWidth;
      if(boTouch && h*w>230400) $body.css({'font-size':'120%'}); // between 320*480=153600 and 480*640=307200
      if(boTouch && h*w<115200) $body.css({'font-size':'85%'});  // between 240*320=76800 and 320*480=153600
    }
  }  



  strScheme='http'+(boTLS?'s':'');    strSchemeLong=strScheme+'://';    uSite=strSchemeLong+wwwSite;     uCommon=strSchemeLong+wwwCommon;    uBE=uSite+"/"+leafBE;

  wseImageFolder='/'+flImageFolder+'/';
  uImageFolder=uCommon+wseImageFolder;

  uHelpFile=uImageFolder+'help.png';
  uFb=uImageFolder+'fbLogin.png';
  uGoogle=uImageFolder+'googleWide.jpg';
  uIdplace=uImageFolder+'idPlace.png';
  
  uBusy=uImageFolder+'busy.gif';


  $imgBusy=$('<img>').attr({src:uBusy});
  $imgHelp=$('<img>').prop({src:uHelpFile}).css({'vertical-align':'-0.4em'});



  sessionLoginIdP={};
  userInfoFrDB=$.extend({}, specialistDefault);

  $.ajaxSetup({
    url: uBE,
    global: false,
    type: "POST",
    //dataType:'json',
    contentType:'application/json',
    processData:false,
    success: beRet,
    //success: function(data){alert('ss');},
    error: function(jqXHR, textStatus, errorThrown){
      setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
    }
  });
  oAJAX={url:uBE,type: "POST",dataType:'json', processData:false,success: beRet};
   //uPubKeyStoreBE


  assignSiteSpecific();
  langClientFunc();








  $loginDiv=loginDivExtend($('<div>')).hide();
  $loginInfo=loginInfoExtend($('<div>'));  $loginInfo.css({padding:'0em 0em 0em 0em','font-size':'75%'});


  $tmpB=$('<b>').append(wwwSite);
  $aTmp=$('<a>').attr({href:'https://wikipedia.org/wiki/Key_pair',target:"_blank"}).text('key pair');
  strShow='Show key'; strHide='Hide key';
  $buttonShowKey=$('<button>').append(strShow).data({'boOn':false}).css({'margin-left':'1em'}).on('click', function(){
    var $b=$(this), boOn=!$b.data('boOn'); $b.data({'boOn':boOn}); $b.html(boOn?strHide:strShow); $divKey.toggle(boOn);
  });
  $divKey=$('<div>').append(pubKey).hide().css({'font-weight':'bold'});
  $headA=$('<div>').append('You are now on ',$tmpB, ' with one part of a ',$aTmp,'.',$buttonShowKey,$divKey).css({'margin-top':'0.5em'});

  var $imgTmp=$imgHelp.clone().css({margin:'0 0 0 1em'}),  $bub=$('<div>').html("Storing the key will allow the sender (the owner of the other part of the key pair) to write certain data on this site: (position (lat/lang), visibility (on/off), hideTimer)");     popupHoverJQ($imgTmp,$bub);  
  $headB=$('<div>').append('Do you want to store this key?',$imgTmp);
  //<b>position</b>, <b>last activity</b> and <b>visibility</b>

  $messageText=messExtend($("<span>"));  window.setMess=$messageText.setMess;  window.resetMess=$messageText.resetMess;  $messageText.css({font:'courier'});  


  $buttCancel=$('<button>').append('Cancel').on('click', function(){window.close();});

  strLeaveMess="(Click browser-back-button to leave.)";
  cssAns={width:'50%',display:'inline-block','box-sizing': 'border-box','text-align':'center',padding:'1em',flex:1};
  //cssAns={'text-align':'center',padding:'1em'};
  $yesDiv=yesDivExtend($('<div>')).css(cssAns).css({'background':'lightgreen'});
  $noSpan=$('<div>').append('No').css({'text-align':'center','margin-bottom':'1em'});
  $noDiv=$('<div>').css(cssAns).css({'border-left':'2px solid grey','vertical-align':'top','background':'pink'}).append($noSpan,strLeaveMess);
  $answerDiv=$('<div>').append($yesDiv,$noDiv).css({display:'flex'}); //
  $mainDivs=$([]).push($loginInfo).push($headA).push($headB).push($answerDiv);


  $body.append($mainDivs,$messageText); 

  $body.css({'text-align':'center'});
  $mainDivs.css({'margin-left':'auto','margin-right':'auto','text-align':'left',background:'#fff','max-width':'800px'});

  var vec=[['setupById']];   majax(oAJAX,vec);
}

window.onload=function(){  setUp(); };


