


/*jshint asi:true*/
/*jshint esversion: 6*/
/* jshint shadow:true */
/* jshint funcscope:true */
/*jshint -W041: false */


// Page for testing if nComplaints and nComplaintsWritten corresponds with complaitsTab
// nComplaints not reduced when deleteAccount is called
// nComplaint, nComplaintGiven, donatedAmount, boImgOwn, image, imTag, displayName, tea.link (linkTeam), tea.imTag (imTagTeam) in roleTab

// cookies aren't allowed, are they?
// viewColumnSorterCreator: Can it be used without creating two instances?
// Obscurifying

// does miles work
// Analytics event from clicking moreinfo link


// comparative price in info, could be displayed inside the button
// remove unnesecary label in langHtml
// test viewTeam
// delete me as buyer resp delete me as driver
// Ability to see and select image in introPop
// 👋🌍



/**********************************************************************
 * Methods of properties (provided by the plugins)
crInp: no arg, no this, creates and returns el
crInfo: no arg, uses this (span), nothing returned
crTabF: no arg, uses this (td), nothing returned

setInp: no arg, uses this, nothing returned
saveInp: no arg, uses this, returns [err val]

setInfo: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
setTabF: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
sortTabF: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
setMapF, setMapMF: rowMTab as arg, uses this, if something is returned...:
  ...and is a string, (it is displayed as a string (see more in mapDiv))
  ...and is an object, (it is used as seen in mapDiv)

crFilterButtF: button index as arg, no this, creates and returns el
setFilterButtF: span,vAll[i],boOn as arg, no this, nothing returned
***********************************************************************/

//0123456789abcdef pluginGeneral.js
"use strict"
app.CreatorPlugin.general=function(){
  
  app.strUnitDist='km';
  app.strUnitTime='h';
    // Some conveniently grouped properties
  app.StrPropPerson=['image', 'idTeam', 'displayName'];
  app.StrPropContact=['boWebPushOK', 'homeTown', 'link', 'tel', 'displayEmail']; if(!boEnablePushNotification) app.StrPropContact=AMinusB(StrPropContact, ['boWebPushOK']);
  app.StrPropContactMinusBoWebPushOK=['homeTown', 'link', 'tel', 'displayEmail']; //AMinusB(StrPropContact, ['boWebPushOK']);
  app.StrPropContactMinusBoWebPushOKNHomeTown=['link', 'tel', 'displayEmail'];  //AMinusB(StrPropContact, ['boWebPushOK', 'homeTown']);
  app.StrPropPos=['dist', 'tPos', 'coordinatePrecisionM'];
  app.StrPropRep=['tCreated', 'tAccumulated', 'donatedAmount', 'nComplaint']; //, 'histActive'


  var oTmp={StrProp:[], StrGroupFirst:[], StrGroup:[]};
  var oRoleProt={ MTab:[], nMTab:0, MGroupTab:[], Main:oTmp, roleSetting:copyDeep(oTmp), filter:copyDeep(oTmp)};  // , colOneMark:"", ColsShow:[] 
  extend(oB,oRoleProt); extend(oS,copyDeep(oRoleProt));
  extend(oB,{ strColor:'pink', strGroupColor:'#fd98a9'});  
  extend(oS,{ strColor:'lightblue', strGroupColor:'#9ca6e8' });
  oS.yOffsetGroupMarker=1;
  
  app.strUnitDistDefault='km'; //if(strLang=='en') {strUnitDistDefault='mile'; }
  if(boNewVersion) { setItem('strUnitDist',strUnitDistDefault);}
  app.strUnitDist=getItem('strUnitDist');  if(strUnitDist===null) strUnitDist=strUnitDistDefault;


    // UnitDistChoise
  app.setUnitDist=function(unit){
    strUnitDist=unit;   setItem('strUnitDist',strUnitDist);
    for(var i=0;i<2;i++) viewTable.ElRole[i].setCell();
    mapDiv.setMarkers();
  };
  app.UnitDistChoise=function(){
    var el=createElement('span'); extend(el, UnitDistChoise.tmpPrototype);
    el.butKM=createElement('button'); el.butKM.myText('km').on('click',function(e){e.stopPropagation(); if(strUnitDist=='mile'){setUnitDist('km'); UnitDistChoise.tmpPrototype.setUpAll(); } });
    el.butMile=createElement('button'); el.butMile.myText('mile').on('click',function(e){e.stopPropagation(); if(strUnitDist=='km'){setUnitDist('mile'); UnitDistChoise.tmpPrototype.setUpAll(); } });
    //var colOn={background:'#4f4'}, colOff={background:'#eee'};
    el.append(el.butKM, createElement('br'), el.butMile);
    UnitDistChoise.tmpPrototype.arrEl.push(el);
    if(typeof strUnitDist!='undefined') UnitDistChoise.tmpPrototype.setUp.call(el);
    return el;
  }
  UnitDistChoise.tmpPrototype={};
  UnitDistChoise.tmpPrototype.arrEl=[];
  UnitDistChoise.tmpPrototype.setUp=function(){ 
    var colOn='#4f4', colOff='#eee';
    this.butKM.css({background:strUnitDist=='km'?colOn:colOff}); this.butMile.css({background:strUnitDist=='km'?colOff:colOn});
  }
  UnitDistChoise.tmpPrototype.setUpAll=function(){  var arrEl=UnitDistChoise.tmpPrototype.arrEl;  for(var i=0;i<arrEl.length;i++){ arrEl[i].setUp(); }  }
  
  //this.rewriteLang=function(){};


  app.rewriteLangContractor=function(){
    langHtml.loginInfo.seller=langHtml.contractor;
    langHtml.Seller=ucfirst(langHtml.contractor);
    langHtml.Sellers=ucfirst(langHtml.contractors);
    langHtml.IndependentSeller=langHtml.IndependentContractor;

    langHtml.seller=langHtml.contractor;   langHtml.sellers=langHtml.contractors;
    langHtml.theSeller=langHtml.theContractor;   langHtml.theSellers=langHtml.theContractors;
    langHtml.theSellers0=langHtml.theContractors0;
  };
  app.rewriteLangCustomer=function(){
    langHtml.loginInfo.buyer=langHtml.customer;
    langHtml.Buyer=ucfirst(langHtml.customer);
    langHtml.Buyers=ucfirst(langHtml.customers);
    langHtml.IndependentBuyer=langHtml.IndependentCustomer;

    langHtml.buyer=langHtml.customer;   langHtml.buyers=langHtml.customers;
    langHtml.theBuyer=langHtml.theCustomer;  langHtml.theBuyers=langHtml.theCustomers;
    langHtml.theBuyers0=langHtml.theCustomers0;
  };
  
  this.rewriteObj=function(){

      // tHeadLabel: Add timeStampButt and distUnitChoise 
    for(var i=0; i<ORole.length; i++){
      ORole[i].Prop.tLastPriceChange.boUseTimeDiff=1;
      ORole[i].Prop.tPos.boUseTimeDiff=1;
      ORole[i].Prop.tCreated.boUseTimeDiff=1;  // Is this used??!!??
      var tmpHead=viewTable.ElRole[i].tHeadLabel;
      var tmp = butTimeStampCreator(i, 'tLastPriceChange').css({padding:'0.3em 0.5em'});    tmpHead.querySelector('[name=tLastPriceChange]').append(tmp);
      var tmp = butTimeStampCreator(i, 'tPos').css({padding:'0.3em 0.5em'});    tmpHead.querySelector('[name=tPos]').append(tmp);
      
      let distUnitChoiseT=new UnitDistChoise();   distUnitChoiseT.addClass('smallButt').css({padding:'0.5em 0.1em'});
      tmpHead.querySelector('[name=dist]').append(distUnitChoiseT);
      
        // filterDiv
      let h=langHtml.timeUnit.h[1], mon=langHtml.timeUnit.mo[3];
      viewFilter.ElRole[i].Unit={tPos:h,tCreated:mon,tAccumulated:mon};
    }
    
      // settingDivW: Add distUnitChoise
    let distUnitChoiseT=new UnitDistChoise();  distUnitChoiseT.querySelector('br').remove(); distUnitChoiseT.prepend(langHtml.DistanceUnit+': ');
    distUnitChoiseT.css({display:'block','margin':'1em 0em 1em 0.6em'});
    viewSettingEntry.querySelector('#divMapMarker').insertAdjacentElement('afterend', distUnitChoiseT);

      //
      // Prop
      //

      // currency
    var tmpf=function(){
      var c=createElement('select'); //.prop('id','currency');
      for(var i=0;i<currencies[0].length;i++){    var opt=createElement('option').myText(currencies[1][i]+' ('+currencies[0][i]+')').prop('value',currencies[1][i]); c.append(opt);    }
      var optT=c.querySelector("option[value='USD']");    optT.prop('selected', 'selected');
      return c;
    }
    var tmpPropProt={strType:'select', crInp:tmpf };
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.currency, tmpPropProt); }

      // tCreated, tLastPriceChange, tPos
    var tmpF=propTimeAgo, tmpPropProt={ setInfo:tmpF, setTabF:tmpF, sortTabF:tmpF, setMapF:tmpF, setMapMF:tmpF };
    for(let i=0;i<ORole.length;i++){   extend(ORole[i].Prop.tCreated, tmpPropProt);   extend(ORole[i].Prop.tLastPriceChange, tmpPropProt);   extend(ORole[i].Prop.tPos, tmpPropProt);   }

      // tAccumulated, IP
    var tmpF=function(rowMTab){ return getSuitableTimeUnitStr(rowMTab.tAccumulated); };
    var tmpPropProt={ setInfo:tmpF, setTabF:tmpF, sortTabF:tmpF, setMapF:tmpF, setMapMF:tmpF };
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.tAccumulated, tmpPropProt); }

      // nComplaint
    const tmpCrNComplaint=function(){  this.append(  complaintButtonCreator(ORole[this.iRole])  ); };
    const tmpSetNComplaint=function(rowMTab){   this.querySelector('button').mySet(rowMTab);   };
    var tmpPropProt={crInfo:tmpCrNComplaint, setInfo:tmpSetNComplaint, crTabF:tmpCrNComplaint, setTabF:tmpSetNComplaint};
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.nComplaint, tmpPropProt); }


/**********************************************************************
 * Methods of properties (provided by the plugins)
crInp: no arg, no this, creates and returns el
crInfo: no arg, uses this (span), nothing returned
crTabF: no arg, uses this (td), nothing returned

setInp: no arg, uses this, nothing returned
saveInp: no arg, uses this, returns [err val]

setInfo: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
setTabF: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
sortTabF: rowMTab as arg, uses this, if something is returned, it is used as textInput to the (existing) element
setMapF, setMapMF: rowMTab as arg, uses this, if something is returned...:
  ...and is a string, (it is displayed as a string (see more in mapDiv))
  ...and is an object, (it is used as seen in mapDiv)

crFilterButtF: button index as arg, no this, creates and returns el
setFilterButtF: span,vAll[i],boOn as arg, no this, nothing returned
***********************************************************************/

      // idTeam
    const tmpCrIdTeam=function(){  this.append(  thumbTeamCreator(ORole[this.iRole])  );   };
    const tmpSetIdTeam=function(rowMTab){   this.querySelector('a').mySet(rowMTab);   };
    const tmpSetFilterButtF=function(span,val,boOn){ span.mySet(val,boOn); }
    const tmpSetMapF=function(rowMTab){
      var {idTeam, imTagTeam}=rowMTab, tmp;
      if(idTeam) { //&& idTeam.length>0 && idTeam!==0
        var strTmp=URoleTeamImage[this.iRole]+idTeam+'?v='+imTagTeam;
        tmp = {url:strTmp, boUseFrame:true};
      } else tmp=(this.iRole?langHtml.IndependentSeller:langHtml.IndependentBuyer).replace("<br>","\n");
      return tmp;
    }
    const tmpSetMapMF=function(rowMTab){
      var {idTeam, imTagTeam, linkTeam}=rowMTab;
      if(typeof linkTeam=='string') {
        if(linkTeam.length==0) return null;
        else if(linkTeam.substring(0,8)=='https://') linkTeam=linkTeam.substring(8);
        else if(linkTeam.substring(0,7)=='http://') linkTeam=linkTeam.substring(7);
        return propSetCropLabelI('idTeam',linkTeam);
      }else return null;
    }
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.idTeam, { crInfo:tmpCrIdTeam, setInfo:tmpSetIdTeam, crTabF:tmpCrIdTeam, setTabF:tmpSetIdTeam,
        setMapF:tmpSetMapF, setMapMF:tmpSetMapMF, 
        crFilterButtF:function(iInit){ return butTeamImgCreator(ORole[i]).css({'margin-right':'0.25em'}); },
        setFilterButtF:tmpSetFilterButtF
      });
    }


      // dist
    let tmpSetDist=function(rowMTab){
      var tmpPoint = [rowMTab.x, rowMTab.y],   latlngT=merProj.fromPointToLatLng(tmpPoint);
      var pC=mapDiv.getPWCC(), latlngMe=merProj.fromPointToLatLng(pC);
      var dist=distCalc(latlngT.lng,latlngT.lat,latlngMe.lng,latlngMe.lat);  if(strUnitDist=='mile') dist=dist/1.609;
      return Number(dist.toFixed(1));
    };
    var tmpSetDistOther=function(rowMTab){return tmpSetDist(rowMTab)+' '+strUnitDist;}
    var tmpPropProt={ setInfo:tmpSetDistOther, setTabF:tmpSetDist,sortTabF:tmpSetDist, setMapF:tmpSetDistOther,setMapMF:tmpSetDistOther };
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.dist, tmpPropProt); }


      // displayName
    var tmpPropProt={strType:'text', inpW:16}; for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.displayName, tmpPropProt); }

      // tel
    var tmpCrTel=function(){  var a=createElement('a').myText(' '); this.append(a);  };
    var tmpSetTel=function(rowMTab){  var tmp=rowMTab.tel.trim(), a=this.querySelector('a'), boL=tmp.length>0;  a.prop({href:'tel:'+tmp}).toggle(boL);   a.firstChild.nodeValue=boL?tmp:' '; }
    for(let i=0;i<ORole.length;i++){  extend(ORole[i].Prop.tel, {  strType:'tel', inpW:16, crInfo:tmpCrTel, setInfo:tmpSetTel, crTabF:tmpCrTel, setTabF:tmpSetTel });  }
    
      // displayEmail
    var tmpCr=function(){  var a=createElement('a').myText(' '); this.append(a);  };
    var tmpSet=function(rowMTab){var tmp=rowMTab.displayEmail.trim(), a=this.querySelector('a'), boL=tmp.length>0;  a.prop({href:'mailto:'+tmp}).toggle(boL);  a.firstChild.nodeValue=boL?tmp:' ';  }
    var tmpPropProt={  strType:'email', inpW:16, crInfo:tmpCr, setInfo:tmpSet, crTabF:tmpCr, setTabF:tmpSet };
    for(let i=0;i<ORole.length;i++){  extend(ORole[i].Prop.displayEmail, tmpPropProt);  }

      // link
    var tmpSetInfo=function(rowMTab){
      var url=rowMTab.link; if(url && !RegExp("^https?:\\/\\/").test(url)) { url='http://'+url; }
      var a=this.querySelector('a'), boL=url.length>0; a.prop({href:url}).toggle(boL);  a.firstChild.nodeValue=boL?url:' ';
    };
    var tmpCrInfo=function(){  var a=createElement('a').myText(' ').prop({target:"_blank"}); this.append(a);   }
    var tmpPropProt={ strType:'url', inpW:16, crInfo:tmpCrInfo, setInfo:tmpSetInfo, setMapF:propSetCrop, setMapMF:propSetCropLabel  };
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.link, tmpPropProt); }

      // idFB, idIdPlace, idOpenId
    var tmpPropProtFB={setMapF:propSetCrop, setMapMF:propSetCropLabel};
    var tmpPropProtIdPlace={setMapF:propSetCrop, setMapMF:propSetCropLabel};
    var tmpPropProtOpenId={setMapF:propSetCrop, setMapMF:propSetCropLabel};
    for(let i=0;i<ORole.length;i++){   extend(ORole[i].Prop.idFB, tmpPropProtFB);   extend(ORole[i].Prop.idIdPlace, tmpPropProtIdPlace);   extend(ORole[i].Prop.idOpenId, tmpPropProtOpenId);  }
    
      // homeTown
    var tmpPropProt={strType:'text', inpW:10};
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.homeTown, tmpPropProt); }

      // idTeamWanted
    var tmpSet=function(){ this.setStat(); }
    var tmpSave=function(){return [null, this.inp.value.trim()];}
    for(let i=0;i<ORole.length;i++){
      var tmpCr=function(){ var c=spanIdTeamWantedCreator(ORole[i]); return c;  }
      extend(ORole[i].Prop.idTeamWanted, {strType:'span', crInp:tmpCr, setInp:tmpSet, saveInp:tmpSave }); //, inpW:3
    }

      // coordinatePrecisionM
    var tmpCr=function(){
      var c=createElement('select'); for(var i=0;i<arrCoordinatePrecisionM.length;i++){ var v=arrCoordinatePrecisionM[i], op=createElement('option').prop('value',v).myText(approxDist(v)); c.append(op); }   return c;
    }
    var tmpSet=function(){  var [bestVal, iBest]=closest2Val(arrCoordinatePrecisionM, userInfoFrDB[ORole[this.iRole].strRole].coordinatePrecisionM); this.value=bestVal;  }
    var tmpPropProt={strType:'select', crInp:tmpCr, setInp:tmpSet};
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.coordinatePrecisionM, tmpPropProt);  }
    
      // experience
    extend(oS.Prop.experience, {strType:'number', inpW:4});
    

      // image
    app.calcImageUrl=function(rT){ // Keys of rT: ["idUser", "boImgOwn", "imTag", "image"]
      var tmp='',  boImgOwn=Number(rT.boImgOwn);
      if(boImgOwn  || rT.image.length==0)  tmp=uUserImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image;
      return tmp;
    };
    var calcImageUrlUser=function(){    return {str:calcImageUrl(userInfoFrDB.user),    boImgOwn:Boolean(Number(userInfoFrDB.user.boImgOwn))};     }
    var tmpCrInp=function(){
      var c=createElement('span');
      var thumb=c.thumb=createElement('img').css({'vertical-align':'middle'});
      c.butDeleteImg=createElement('button').myText(langHtml.Delete).on('click', function(){
        var vec=[['deleteImage',{},function(data){
          if(data.boOK) userInfoFrDB.user.boImgOwn=0;
          //for(var i=0;i<2;i++){viewSetting.ElRole[i].setUp();}
          viewUserSetting.setUp();
        }]];   majax(vec);
      });
      var uploadCallback=function(){
        userInfoFrDB.user.boImgOwn=1; userInfoFrDB.user.imTag=randomHash(); var tmp=calcImageUrlUser(); thumb.attr({src:tmp.str}); c.butDeleteImg.toggle(tmp.boImgOwn);
      }
      var buttUploadImage=createElement('button').myText(langHtml.uploadNewImg).on('click', function(){viewUploadImage.openFunc('u',uploadCallback);});
      c.append(c.thumb, c.butDeleteImg, buttUploadImage);  //langHtml.YourImage+': ',
      return c;
    };
    var tmpSetInp=function(){
      var tmp=calcImageUrlUser();
      this.butDeleteImg.toggle(tmp.boImgOwn);
      this.thumb.prop({src:tmp.str});
    };
    var tmpSaveInp=function(){return [null,null];}
    var tmpCrImage=function(){ this.append(createElement('img'));  };
    var tmpSetImage=function(rowMTab){ this.querySelector('img').prop({src:calcImageUrl(rowMTab)});  };
    var tmpPropProt={  strType:'span',  crInp:tmpCrInp, setInp:tmpSetInp, saveInp:tmpSaveInp, crInfo:tmpCrImage, setInfo:tmpSetImage,
      crTabF:tmpCrImage,
      setTabF:tmpSetImage,
      sortTabF:function(rowMTab){return rowMTab.idUser;},
      setMapF:function(rowMTab){     return {url:calcImageUrl(rowMTab), boUseFrame:true};  },
      setMapMF:function(){return false;}
    };
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.image, tmpPropProt); }
    
    
      // boWebPushOK
    //var cbToggle=function(){this.disabled=true; myWebPush.togglePushNotifications();}
    var tmpCrInp=function(strType){
      const tmpF=function(){ this.mySet(); }
      const tmpFOne=function(err){ if(!err) myWebPush.uploadFun(); }
      var spanInpToggle=new SpanInpWebPushToggle(tmpF,strType=='setting'?tmpFOne:undefined).css({display:'inline-block'});
      //var butToggle=createElement('button').myText('boPushToggle').on('click', cbToggle );
      //myWebPush.ButToggle.push(butToggle);
      var c=createElement('span').myAppend(spanInpToggle); return c;
    }
    var tmpSetInp=function(){ this.querySelector('span').mySet(); }
    var tmpSaveInp=function(){ return [null, JSON.stringify(myWebPush.subscription)]; }
    var tmpCrInfo=function(){
      var butT=createElement('button').myText('Send push notification').on('click', function(){  
        if(!userInfoFrDB.user){ setMess('You need to be logged in to send a message.', 2); return; }
        viewGreeting.setUp(this.idUser, this.iRole); viewGreeting.setVis();
        doHistPush({view:viewGreeting});
      });
      this.append(butT);
    }
    var tmpSetInfo=function(rowMTab){  const b=this.querySelector('button'); b.disabled=!rowMTab.boWebPushOK;  b.idUser=rowMTab.idUser; b.iRole=this.iRole;};
    var tmpPropProt={  strType:'span', crInp:tmpCrInp, setInp:tmpSetInp, saveInp:tmpSaveInp, crInfo:tmpCrInfo, setInfo:tmpSetInfo, crTabF:tmpCrInfo, setTabF:tmpSetInfo }
    for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop.boWebPushOK, tmpPropProt); }
  };
};
//0123456789abcdef


//////////////////////////////////////////////////////////////////////////////////////////////////////////

//0123456789abcdef pluginVehicleType.js
"use strict"
app.CreatorPlugin.vehicleType=function(){

  //enumVehicleType=Enum.vehicleType;
  var enumVehicleType=oS.Prop.vehicleType.Enum;

    // images
  var strPlugin='vehicleType';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uVehicleType=uSpecImageFolder+'vehicleType.png';
  app.uVehicleTypeW=uSpecImageFolder+'vehicleTypeW.png';
  //uVehicleTypeZ=uSpecImageFolder+'vehicleTypeZ.png';
  app.uVehicleTypeInactive=uSpecImageFolder+'vehicleTypeInactive.png';
  app.uVehicleTypeDummy=uSpecImageFolder+'vehicleTypeDummyG.png';
  app.uDummy=uSpecImageFolder+'dummy.png';
  app.uSleepy=uSpecImageFolder+'carSleepy.png';

  //elBody.css({background:'url('+uSpecImageFolder+'tsBackgroundWW.png)'});

  app.vehSprite={
    item:{
      sedan:{x:1,y:1,w:69,h:21},
      wagon:{x:1,y:30,w:68,h:21},
      largeMPV:{x:1,y:60,w:73,h:31},
      MPV:{x:1,y:100,w:62,h:25},
      hatchback:{x:1,y:130,w:55,h:24},
      pickup:{x:1,y:160,w:74,h:22},
      convertible:{x:1,y:190,w:64,h:20},
      rickshaw:{x:1,y:220,w:46,h:30},
      limo:{x:1,y:260,w:114,h:21},
      bus:{x:1,y:290,w:113,h:34},
      smallBus:{x:1,y:330,w:74,h:32},
      boat:{x:1,y:370,w:74,h:20},
      displacingBoat:{x:90,y:370,w:96,h:21},
      airplane:{x:1,y:400,w:39,h:39},
      helicopter:{x:1,y:450,w:98,h:28},
      van:{x:1,y:490,w:74,h:32},
      lorry:{x:1,y:530,w:111,h:37},
      semiTrailer:{x:130,y:530,w:158,h:37},
      lorryWTrailer:{x:1,y:570,w:208,h:37},
      semiTrailerWTrailer:{x:1,y:610,w:255,h:37},
      lorryWDollyTrailer:{x:1,y:650,w:232,h:37},
      semiTrailerWDollyTrailer:{x:1,y:690,w:279,h:37},
      tipper:{x:90,y:460,w:85,h:60},
      bike:{x:90,y:1,w:35,h:20},
      moped:{x:90,y:30,w:32,h:19},
      MC:{x:90,y:60,w:38,h:17},
      foot:{x:90,y:100,w:39,h:18},
      ridingMower:{x:90,y:130,w:35,h:22},
      lorryOpen:{x:180,y:489,w:78,h:31},
      tractor:{x:50,y:213,w:53,h:37}
    },
    order:enumVehicleType,
    //order:['sedan', 'wagon', 'largeMPV', 'MPV', 'hatchback', 'pickup', 'convertible', 'rickshaw', 'limo', 'bus', 'smallBus', 'boat', 'airplane', 'helicopter', 'van', 'lorry', 'semiTrailer',  'lorryWTrailer', 'lorryWDollyTrailer', 'tipper'],
    url:uVehicleType,
    zoom:0.65, sheetW:400, sheetH:800
  };

  app.vehSpriteW=extend({},vehSprite); vehSpriteW.url=uVehicleTypeW;
  for(var i=0;i<enumVehicleType.length;i++) {var k=enumVehicleType[i],fn=vehSpriteW.item[k],fo=vehSprite.item[k]; fn.x=fn.x-1; fn.y=fo.y-1; fn.w=fo.w+2; fn.h=fo.h+2;}
  app.vehSpriteZ=extend({},vehSpriteW); vehSpriteZ.url=uVehicleTypeInactive;
  app.vehSpriteDummy=extend({},vehSpriteW); vehSpriteDummy.url=uVehicleTypeDummy;


  app.rewriteLangDriver=function(){
    //langHtml.sellerRewritten=langHtml.driver;
    langHtml.loginInfo.seller=langHtml.driver;
    langHtml.Seller=ucfirst(langHtml.driver);
    langHtml.Sellers=ucfirst(langHtml.drivers);
    langHtml.IndependentSeller=langHtml.IndependentDriver;

    langHtml.seller=langHtml.driver;   langHtml.sellers=langHtml.drivers;
    langHtml.theSeller=langHtml.theDriver;  langHtml.theSellers=langHtml.theDrivers;
    langHtml.theSellers0=langHtml.theDrivers0;
  };

  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // vehicleType
    var tmpSetVehicleType=function(rowMTab){     this.querySelector('span').mySet(Number(  rowMTab.vehicleType  ));    };
    var tmpSetVehicleTypeM=function(rowMTab){
      var data=rowMTab.vehicleType, strName=enumVehicleType[rowMTab.vehicleType];
      var tmp; if(rowMTab.tPos<curTime-snoreLim) tmp=vehSpriteZ; else tmp=vehSpriteW;
      //if(rowMTab.idUser<=3) tmp=vehSpriteDummy;
      //if(rowMTab.displayName=='Dummy') tmp=vehSpriteDummy;
      if(rowMTab.displayName.match(/^Dummy/)) tmp=vehSpriteDummy;
      var item=tmp.item[strName];
      var zT=tmp.zoom, wSc=Math.ceil(zT*item.w), hSc=Math.ceil(zT*item.h), wSSc=zT*tmp.sheetW, hSSc=zT*tmp.sheetH;
      return {url:tmp.url, size:{width:item.w, height:item.h}, origin:{x:item.x, y:item.y}, anchor:{x:item.w/2, y:item.h}, scaledSize:{width:wSSc, height:hSSc}, zoom:zT};
    };
    var tmpSetVehicleTypeMM=function(rowMTab){return langHtml.vehicleType[enumVehicleType[rowMTab.vehicleType]];};
    var tmpCrVehicleType=function(){   this.append(  spriteCreator(vehSprite)  );   };
    extend(oS.Prop.vehicleType, {
      crInp:function(){ var c=selSpriteCreator(vehSprite); return c; },
      setInp:function(){ this.mySet(userInfoFrDB.seller.vehicleType); },
      saveInp:function(){return [null, this.myGet()];},
      crInfo:tmpCrVehicleType,setInfo:tmpSetVehicleType,
      crTabF:tmpCrVehicleType,setTabF:tmpSetVehicleType,
      setMapF:tmpSetVehicleTypeM, setMapMF:tmpSetVehicleTypeMM,
      crFilterButtF:function(iInit){ var span=spriteCreator(vehSprite);    span.mySet(iInit);  return span;},
      setFilterButtF:function(span,val,boOn){   span.mySet(val);  var opacity=boOn?1:0.4; span.querySelector('img').css({opacity: opacity});  }
    });
  }
}
//0123456789abcdef

//    Notes regarding comparePrice
// comparePriceDataPopCreator

    // Rewrite setUnitDist
    
          // comparePrice  calcComparePrice


//0123456789abcdef pluginDistNTimePrice.js
"use strict"
app.CreatorPlugin.distNTimePrice=function(){
  
  //if(typeof StrMainProt=='undefined') StrMainProt=[];
  StrMainProt.push('comparePriceDataPop');
  
  var comparePrice;
  
  app.comparePriceDataPopCreator=function(){
    var el=createElement('div');
    el.toString=function(){return 'comparePriceDataPop';}
    el.openFunc=function(extraSaveFuncT){
      inpDist.value=comparePrice.dist;
      inpUnit.value=strUnitDist;
      inpTime.value=comparePrice.time;
      divTimeLab.firstChild.nodeValue=langHtml.Time+' ('+langHtml.timeUnit[strUnitTime][3]+'): ';
      mess.firstChild.nodeValue='';
      if(typeof extraSaveFuncT!='undefined') extraSaveFunc=extraSaveFuncT; else extraSaveFunc=null;
      doHistPush({view:viewComparePriceDataPop});
      el.setVis();
    };
    el.setVis=function(){ el.show(); return true;  }
    var saveFunc=function() {
      var dist=Number(inpDist.value), unit=inpUnit.value, time=Number(inpTime.value);
      if(isNaN(dist)) {mess.firstChild.nodeValue='input not valid'; return;}
      if(isNaN(time)) {mess.firstChild.nodeValue='input not valid'; return;}
      strUnitDist=unit; comparePrice.dist=dist; comparePrice.time=time;
      setItem('comparePriceData',{dist:dist, time:time});
      setItem('strUnitDist',strUnitDist);

      ComparePriceButSpan.tmpPrototype.setUpAll();
      viewTable.ElRole[1].tHeadLabel.setPricePerDistLabel();
      UnitDistChoise.tmpPrototype.setUpAll(); //setUnitDistButtons();
      viewTable.ElRole[1].setCell();
      
      for(var i=0;i<ORole.length;i++) {
        if(ORole[i].MTab.length){    mapDiv.ArrMarker[i].setMarkers();  mapDiv.ArrMarker[i].drawMarkers();   }
      }

      if(extraSaveFunc) extraSaveFunc();
      historyBack();
    };
    el.setDefault=function(dist,time){  // Used by plugins
      comparePrice={dataDefault:{dist:dist,time:time}};
      if(boNewVersion) {  setItem('comparePriceData',comparePrice.dataDefault);  }
      var tmp=getItem('comparePriceData');  if(tmp===null) tmp=extend({}, comparePrice.dataDefault);
      comparePrice.dist=tmp.dist; comparePrice.time=tmp.time;
    };

    var extraSaveFunc;
    var inpDist=createElement('input').prop({type:'number', min:0}).css({'width':'3em','margin':'0em 0.5em'}).on('keypress', function(e){if(e.which==13) {saveFunc();return false;}} );
    var inpUnit=createElement('select');  inpUnit.myAppend(createElement('option').prop('value','km').myText('km'), createElement('option').prop('value','mile').myText('mile'));
    var inpTime=createElement('input').prop({type:'number', min:0}).css({'width':'3em'}).on('keypress', function(e){if(e.which==13) {saveFunc();return false;}} );

    var elHead=createElement('h3').myText(langHtml.comparePrice.head);
    //var divDist=createElement('div').myAppend(createTextNode(langHtml.Distance+': '), inpDist, inpUnit);
    var divDist=createElement('div').myAppend(langHtml.Distance, inpDist, inpUnit);
    var divTimeLab=createElement('span').myText('.'), divTime=createElement('div').myAppend(divTimeLab, inpTime);

    var buttDefault=createElement('button').myText(langHtml.Default).css({display:'block','margin':'0.8em 0em'}).on('click', function() { 
      inpDist.value=comparePrice.dataDefault.inpDist; inpUnit.value=strUnitDistDefault; inpTime.value=comparePrice.dataDefault.time;
    });
    var buttCancel=createElement('button').on('click', historyBack).myText(langHtml.Cancel);
    var buttonSave=createElement('button').on('click', saveFunc).myText(langHtml.Done);

    var tmp={'margin-top':'0.8em'}; divDist.css(tmp); divTime.css(tmp);
    //var vSpace=createElement('div').css({height:'0.6em'})
    var mess=createElement('div').myText('.');
    el.append(elHead,divDist,divTime,buttDefault,buttCancel,buttonSave,mess);

    el.css({'text-align':'left'});

    var blanket=createElement('div').addClass("blanket");
    var centerDiv=createElement('div').myAppend(elHead,divDist,divTime,buttDefault,buttCancel,buttonSave,mess);
    centerDiv.addClass("Center").css({'min-width':'220px', padding: '1em'});  // 'width':'20em', height:'18em', 
    el.addClass("Center-Container").myAppend(centerDiv,blanket); //

    return el;
  }
  
  app.viewComparePriceDataPop=comparePriceDataPopCreator();


    // comparePriceButSpan: in settingDivW, infoDivS, tableHead,
  var ComparePriceButSpan=function(strHtml, func){
    var el=createElement('span'); extend(el, ComparePriceButSpan.tmpPrototype);
    //el.strFormat=strFormat;  
    el.elSpan=createElement('span'); el.elSpan.innerHTML=strHtml; //el.elSpan.innerHTML='...';
    var elButPricePref=createElement('button').myAppend(el.elSpan).on('click',function(e){
      viewComparePriceDataPop.openFunc(function(){ ComparePriceButSpan.tmpPrototype.setUpAll(); if(func) func();} );
      e.stopPropagation();return false;
    });
    if(!boTouch) popupHover(elButPricePref, createElement('div').myHtml(langHtml.pricePref.pop));
    el.append(elButPricePref);
    ComparePriceButSpan.tmpPrototype.arrEl.push(el);
    return el;
  }
  ComparePriceButSpan.tmpPrototype={};
  ComparePriceButSpan.tmpPrototype.arrEl=[];
  //ComparePriceButSpan.tmpPrototype.setUp=function(){
    //this.elSpan.innerHTML=String.format(this.strFormat, Number(comparePrice.dist).toFixed(2), strUnitDist, comparePrice.time, langHtml.timeUnit[strUnitTime][1]);
  //};
  ComparePriceButSpan.tmpPrototype.setUp=function(){
    this.elSpan.querySelector('[name=dist]').firstChild.nodeValue=Number(comparePrice.dist).toFixed(2);
    this.elSpan.querySelector('[name=distUnit]').firstChild.nodeValue=strUnitDist;
    this.elSpan.querySelector('[name=time]').firstChild.nodeValue=comparePrice.time;
    this.elSpan.querySelector('[name=timeUnit]').firstChild.nodeValue=langHtml.timeUnit[strUnitTime][1];
  };
  ComparePriceButSpan.tmpPrototype.setUpAll=function(){  var arrEl=ComparePriceButSpan.tmpPrototype.arrEl;  for(var i=0;i<arrEl.length;i++){ arrEl[i].setUp(); }  }

    
    // Rewrite setUnitDist
  let setUnitDistTmp=setUnitDist;
  app.setUnitDist=function(unit){
    if(strUnitDist!=unit) if(unit=='km') comparePrice.dist*=1.609; else comparePrice.dist/=1.609;
    comparePrice.dist=Number(comparePrice.dist).toString();
    setItem('comparePriceData',{dist:comparePrice.dist, time:comparePrice.time});
    //tmpf(unit);
    setUnitDistTmp.apply(this, arguments);
    ComparePriceButSpan.tmpPrototype.setUpAll();
    viewTable.ElRole[1].tHeadLabel.setPricePerDistLabel();
  };



  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // Rewrite viewInfoS.createContainers to add ComparePriceButSpan
    let createContainersTmp=viewInfoS.createContainers;
    viewInfoS.createContainers=function(){
      var setUpUnits=function(){
        var arrStr=['dist','comparePrice','pricePerDist'], iMTab=ListCtrlDiv[oS.ind].tr.iMTab;  //,'strUnitDist'
        for(var i=0;i<arrStr.length;i++){
          var ele=viewInfoS.divCont.querySelector('div>span[name='+arrStr[i]+']');
          var strName=ele.attr('name'), prop=(strName in oS.Prop)?oS.Prop[strName]:{};
          const rowMTab=oS.MTab[iMTab];
          extend(ele,{strName:strName, iRole:oS.ind});
          var tmp=''; if('setInfo' in prop) tmp=prop.setInfo.call(ele,rowMTab);  else tmp=rowMTab[strName];
          removeChildren(ele);
          if(typeof tmp!='undefined') ele.myText(tmp);
          //ele.myText(tmp);
        }
      };
      //var elComparePriceButSpan=new ComparePriceButSpan("({0} {1}, {2} {3})", setUpUnits);    elComparePriceButSpan.css({'font-size':'0.78em'});
      //var elComparePriceButSpan=new ComparePriceButSpan("(<span name=dist/> <span name=distUnit/>, <span name=time/> <span name=distUnit/>)", setUpUnits);    elComparePriceButSpan.css({'font-size':'0.78em'});
      var elComparePriceButSpan=new ComparePriceButSpan("(<span name=dist> </span> <span name=distUnit> </span>, <span name=time> </span> <span name=timeUnit> </span>)", setUpUnits);    elComparePriceButSpan.css({'font-size':'0.78em'});
      createContainersTmp.apply(this, arguments);
      this.divCont.querySelector('div[name=comparePrice]').insertAdjacentElement('afterend', elComparePriceButSpan);
      ComparePriceButSpan.tmpPrototype.setUpAll();
    };

      // Rewrite viewSetting.ElRole[1].createDivs
    let settingDivCreateDivsTmp=viewSetting.ElRole[1].createDivs;
    viewSetting.ElRole[1].createDivs=function(){
      settingDivCreateDivsTmp.apply(this, arguments);
      var tmpU=viewSetting.ElRole[1].querySelector('[name=strUnitDist]').css({'float':'', flex:''});   tmpU.parentNode.remove();
      
      //var tmpPPD=viewSetting.ElRole[1].querySelector('[name=pricePerDist]'); tmpPPD.parentNode.empty().myAppend(langHtml.PricePer+' ',tmpU,tmpPPD);
      var tmpPPD=viewSetting.ElRole[1].querySelector('[name=pricePerDist]'), elLabelTmp=tmpPPD.parentNode.childNodes[0];
      elLabelTmp.myText(langHtml.PricePer).insertAdjacentElement('afterend', tmpU);
    };

      // priceStart
    extend(oS.Prop.priceStart, {strType:'number',inpW:4});
      // pricePerDist
    var tmpSetPricePerDist=function(rowMTab){ var tmp=(strUnitDist=='mile'?1.609:1) * rowMTab.pricePerDist;  return Number(tmp.toFixed(2));};
    var tmpSetPricePerDistStr=function(rowMTab){return tmpSetPricePerDist(rowMTab)+'/'+strUnitDist;};
    extend(oS.Prop.pricePerDist, {
      strType:'number',inpW:4,
      setInfo:tmpSetPricePerDistStr,
      setTabF:tmpSetPricePerDist,sortTabF:tmpSetPricePerDist,
      setMapF:tmpSetPricePerDistStr,setMapMF:tmpSetPricePerDistStr
    });
      // pricePerHour
    extend(oS.Prop.pricePerHour, { strType:'number',inpW:4 });
      // strUnitDist
    var tmpSetUnitDist=function(rowMTab){this.querySelector('button').firstChild.nodeValue='('+Number(comparePrice.dist).toFixed(2)+' '+strUnitDist+', '+comparePrice.time+' '+langHtml.timeUnit.min[3]+')';};
    extend(oS.Prop.strUnitDist, {
      strType:'select',
      crInp:function(){  return createElement('select').myAppend(  createElement('option').myText('km').prop('value',0), createElement('option').myText('mile').prop('value',1)  );  },
      setInfo:tmpSetUnitDist
    });
      // comparePrice
    var calcComparePrice=function(rowMTab){
      var divisor=strUnitTime=='min'?60:1; return Number(rowMTab.priceStart)  +tmpSetPricePerDist(rowMTab)*comparePrice.dist  +rowMTab.pricePerHour/divisor*comparePrice.time;
    };
    var tmpSetComparePriceOneLineWOCur=function(rowMTab){ var tmp=calcComparePrice(rowMTab); return Number(tmp.toFixed(2)); };
    var tmpSetComparePriceOneLineWCur=function(rowMTab){ var tmp=calcComparePrice(rowMTab); return rowMTab.currency+' '+Number(tmp.toFixed(2)); };
    var tmpSetComparePriceSort=function(rowMTab){ var tmp=calcComparePrice(rowMTab); return rowMTab.currency+' '+Number(tmp.toFixed(2)); };
    var tmpCrComparePriceTwoLine=function(){  var s=createElement('span').css({'margin-right':'0.4em'});  this.append(  s, s.cloneNode()  ); };
    var tmpSetComparePriceTwoLine=function(rowMTab){
      var ele=this;
      var flPrice=calcComparePrice(rowMTab);
      var s0=ele.childNodes[0], s1=ele.childNodes[1]; 
      s0.myText(rowMTab.currency);  s1.myText(Number(flPrice.toFixed(2)));
      var boTwoLine=(oS.ColsShow.indexOf('image')!=-1), strType=boTwoLine?'block':'inline';
      var strDisp=boMultCurrency?strType:'none'; s0.css({display:strDisp});
    };
    extend(oS.Prop.comparePrice, {
      setInfo:tmpSetComparePriceOneLineWOCur,
      crTabF:tmpCrComparePriceTwoLine,
      setTabF:tmpSetComparePriceTwoLine,sortTabF:tmpSetComparePriceSort,
      setMapF:tmpSetComparePriceOneLineWCur,setMapMF:tmpSetComparePriceOneLineWCur
    });

    
      // Add ComparePriceButSpan to tHeadTmp
    var tHeadTmp=viewTable.ElRole[1].tHeadLabel;
    var comparePriceButSpanSmall=new ComparePriceButSpan("<span name=dist> </span> <span name=distUnit> </span><br/><span name=time> </span> <span name=timeUnit> </span>"); 
    var butT=comparePriceButSpanSmall.querySelector('button').addClass('smallButt').css({padding:'0.3em 0.1em'});
    butT.firstChild.css({'font-size':'0.8em'});
    tHeadTmp.querySelector('[name=comparePrice]').append(comparePriceButSpanSmall);

      // Add arrDivAdditionalCurrency to tHeadTmp
    var da=createElement('div'),db=da.cloneNode(),dc=da.cloneNode(),dd=da.cloneNode();
    tHeadTmp.querySelector('[name=comparePrice]').querySelector('div').append(da);
    tHeadTmp.querySelector('[name=priceStart]').querySelector('div').append(db);
    tHeadTmp.querySelector('[name=pricePerDist]').querySelector('div').append(dc);
    tHeadTmp.querySelector('[name=pricePerHour]').querySelector('div').append(dd);
    arrDivAdditionalCurrency.push(da,db,dc,dd); arrDivAdditionalCurrency.forEach( (ele)=>{ele.css({'margin-top':'.2em'});} );

      // Create tHeadTmp.setPricePerDistLabel
    tHeadTmp.setPricePerDistLabel=function(){
      var strT=(strUnitDist=='km')?langHtml.PricePerKM:langHtml.PricePerMile;
      this.querySelector('[name=pricePerDist]').children[0].myText(strT);
    };
    tHeadTmp.setPricePerDistLabel();


      // Add ComparePriceButSpan to viewSettingEntry
    var comparePriceButSpan=new ComparePriceButSpan("(<span name=dist> </span> <span name=distUnit> </span>, <span name=time> </span> <span name=timeUnit> </span>)"); comparePriceButSpan.querySelector('button'); //.prepend(langHtml.comparePrice.head+' ');
    //comparePriceButSpan.css({display:'block','margin':'1em 0em 1em 0.6em'});
    var divTmp=createElement('div').myAppend(langHtml.comparePrice.head+' ', comparePriceButSpan).css({'margin':'1em 0em 1em 0.6em'});
    viewSettingEntry.divCont.querySelector('#divMapMarker').insertAdjacentElement('afterend', divTmp);

  };
};
//0123456789abcdef





//0123456789abcdef pluginPrice.js
"use strict"
app.CreatorPlugin.price=function(charRoleUC){
  this.rewriteObj=function(){
    var oRole=charRoleUC=='B'?oB:oS;
    extend(oRole.Prop.price, {strType:'number', inpW:4});
  }
};
//0123456789abcdef

//0123456789abcdef pluginTransportBuyer.js
"use strict"
app.CreatorPlugin.transportBuyer=function(){
  this.rewriteObj=function(){
      // distStartToGoal
    var tmpSet=function(rowMTab){  const strCompass=langHtml.compassPoint[Number(  rowMTab.compassPoint  )]; return rowMTab.distStartToGoal+' km ('+strCompass+')'; }
    extend(oB.Prop.distStartToGoal, { inpW:4, setInfo:tmpSet, setTabF:tmpSet, setMapF:tmpSet });
      // compassPoint
    var tmpSet=function(rowMTab){  return langHtml.compassPoint[Number(  rowMTab.compassPoint  )]; }
    var crInpFunc=function(){
      var c=createElement('select'), arrTmp=langHtml.compassPoint;
      for(var i=0;i<arrTmp.length;i++){  var opt=createElement('option').myText(arrTmp[i]).prop('value',i);   c.append(opt);    }
      return c;
    };
    extend(oB.Prop.compassPoint, {
      strType:'select',
      crInp:crInpFunc,
      setInfo:tmpSet,
      setTabF:tmpSet,
      setMapF:tmpSet,
      setFilterButtF:function(span,val,boOn){ var tmp=langHtml.compassPoint[val]; span.firstChild.nodeValue=tmp;  }
    });
      // destination
    extend(oB.Prop.destination, {inpW:8});
    
  }
};
//0123456789abcdef


//0123456789abcdef pluginStandingByMethod.js
"use strict"
app.CreatorPlugin.standingByMethod=function(){
  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // standingByMethod
    var tmpSet=function(rowMTab){  return langHtml.standingByMethodsLong[Number(  rowMTab.standingByMethod  )]; }
    var crInpFunc=function(){
      var c=createElement('select'), arrTmp=langHtml.standingByMethodsLong;
      for(var i=0;i<arrTmp.length;i++){  var opt=createElement('option').myText(arrTmp[i]).prop('value',i);   c.append(opt);    }
      return c;
    };
    extend(oS.Prop.standingByMethod, {
      strType:'select',
      crInp:crInpFunc,
      setInfo:tmpSet,
      setTabF:tmpSet,
      setMapF:function(rowMTab){  return langHtml.standingByMethodsLong[Number(  rowMTab.standingByMethod  )]; },
      setFilterButtF:function(span,val,boOn){ var tmp=langHtml.standingByMethodsLong[val]; span.firstChild.nodeValue=tmp;  }
    });
  };
};
//0123456789abcdef

//0123456789abcdef pluginShiftEnd.js
"use strict"
app.CreatorPlugin.shiftEnd=function(){

  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // shiftEnd
    //var tmpSetShiftEnd=makeTimeF(oS.ind,'shiftEnd',1);
    oS.Prop.shiftEnd.boUseTimeDiff=1;
    var tmp = butTimeStampCreator(oS.ind, 'shiftEnd').css({padding:'0.3em 0.5em'});    viewTable.ElRole[1].tHeadLabel.querySelector('[name=shiftEnd]').append(tmp);
    viewFilter.ElRole[1].Unit.shiftEnd=langHtml.timeUnit.h[1];

    extend(oS.Prop.shiftEnd, {strType:'select',
      crInp:function(){  var c=createElement('select'); for(var i=0;i<225;i++){ var o=createElement('option').myText(' '); c.append(o); }   return c; },
      setInp:function(){
        var d=new Date(); d.setMilliseconds(0); d.setSeconds(0); var tmp= Math.round(d.getMinutes()/15);  d.setMinutes(tmp*15);
        var d=d.valueOf(); //alert(d);  alert(Date(d));
        [...this.querySelectorAll('option')].forEach(function(ele, i){
          var dv=d+i*15*60*1000, dt=new Date(dv);
          var str=dt.toLocaleTimeString(); str=str.replace(/(\d\d):00/,'$1');
          //ele.myText(str).prop('value',dv/1000);
          ele.value=(dv/1000).toString(); ele.firstChild.nodeValue=str;
        });
        //if(typeof userInfoFrDB.seller=='array' && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
        if(userInfoFrDB.seller instanceof Array && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
          var tmp="option[value='"+userInfoFrDB.seller.shiftEnd+"']";
          //var opttmp=this.querySelector(tmp);   if(opttmp.length==1) opttmp.prop('selected', 'selected');
          this.querySelector(tmp).prop('selected', 'selected');
        }
      },
      setInfo:propTimeRemain,
      setTabF:propTimeRemain, sortTabF:propTimeRemain,
      setMapF:propTimeRemain, setMapMF:propTimeRemain
    });

    // oS.Prop.shiftEnd.feat.minName[0]='0';
    oS.Prop.shiftEnd.feat.bucketLabel[0]='-';        // Rewrite filterDiv range label
  }
};
//0123456789abcdef


//0123456789abcdef pluginHourlyPrice.js
"use strict"
app.CreatorPlugin.hourlyPrice=function(charRoleUC){
  var oRole=charRoleUC=='B'?oB:oS;
  
  this.rewriteObj=function(){
      // pricePerHour
    var tmpSet=function(rowMTab){ var tmp=Number(rowMTab.pricePerHour); return rowMTab.currency+' '+Number(tmp.toFixed(2)); };
    //var tmpSetComparePriceTryTwoLine=function(rowMTab){
      //var tmp=Number(rowMTab.pricePerHour);
      //var boTwoLine=(oRole.ColsShow.indexOf('image')!=-1),  strSep=boTwoLine?'<br>':' ';      return rowMTab.currency+strSep+Number(tmp.toFixed(2));
    //}
    var tmpCrComparePriceTwoLine=function(){  var s=createElement('span').css({'margin-right':'0.4em'});  this.append(  s, s.cloneNode()  ); };
    var tmpSetComparePriceTwoLine=function(rowMTab){
      var flPrice=Number(rowMTab.pricePerHour);
      var s0=this.childNodes[0], s1=this.childNodes[1]; 
      s0.myText(rowMTab.currency);  s1.myText(Number(flPrice.toFixed(2)));
      var boTwoLine=(oRole.ColsShow.indexOf('image')!=-1), strType=boTwoLine?'block':'inline';
      var strDisp=boMultCurrency?strType:'none'; s0.css({display:strDisp});
    };
    extend(oRole.Prop.pricePerHour, { strType:'number',inpW:4, setInfo:tmpSet, crTabF:tmpCrComparePriceTwoLine, setTabF:tmpSetComparePriceTwoLine, sortTabF:tmpSet, setMapF:tmpSet, setMapMF:tmpSet});
  }
};
//0123456789abcdef


//0123456789abcdef pluginFixedPricePerUnit.js
"use strict"
app.CreatorPlugin.fixedPricePerUnit=function(){
}
//0123456789abcdef

//////////////////////////////////////////////////////////////////////////////////////////////////////////

//0123456789abcdef pluginTaxi.js
"use strict"
app.CreatorPlugin.taxi=function(){
  app.strUnitTime='min';
  var StrS=oS.StrPropE;  // ['brand', 'idDriverGovernment', 'nExtraSeat']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
  var {StrPropE}=site;  // ['nPassenger','nChildSeat','nWheelChairPlace']
  var {StrTransportBuyer}=oB;  // ['distStartToGoal','compassPoint','destination']
  
  
    // oRole.Main: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson],
  ['Contact', ...AMinusB(StrPropContact, ['homeTown'])],
  ['Destination', ...StrTransportBuyer, 'price', 'currency'],
  ['RequestedVehicle', ...StrPropE],
  ['Price', 'price', 'currency', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'standingByMethod', 'shiftEnd', 'idDriverGovernment'],
  ['Vehicle', 'vehicleType', 'brand', ...StrPropE, 'nExtraSeat'],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
    
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', 'tel', 'displayEmail', 'link', 'idTeamWanted', 'coordinatePrecisionM'],
  ['Destination', ...StrTransportBuyer],
  ['Vehicle', ...StrPropE],
  ['Price', 'currency', 'price']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'idDriverGovernment', 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM'],
  ['Vehicle', 'vehicleType', ...StrPropE, 'brand', 'nExtraSeat'],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', ...StrPropE, 'tPos', 'idTeam'],
  ['Destination', ...StrTransportBuyer],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'standingByMethod', 'currency', 'tPos', 'shiftEnd', 'idTeam'],
  ['Vehicle', 'vehicleType', ...StrPropE, 'brand', 'nExtraSeat'],
  ['Reputation', ...StrPropRep]]);

  
    // Default columns
  oB.ColsShowDefault= ['image', ...StrTransportBuyer, 'idTeam', 'price'];  //'distStartToGoal', 'compassPoint', 'destination'
  oB.ColsShowDefaultS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oB.ColsShowDefaultRS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oB.colOneMarkDefault='image';
  
  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'brand', 'nPassengers', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'brand', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'brand', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,15); // Arg: dist, time

    // images
  var strPlugin='taxi';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uExtraSeat=uSpecImageFolder+'extraSeat.png';
  app.uChildSeat=uSpecImageFolder+'childSeat.jpg';
  app.uChildSeat2=uSpecImageFolder+'childSeat2.jpg';
  //uDummy=uSpecImageFolder+'dummy.png';
  //uSleepy=uSpecImageFolder+'carSleepy.png';


  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangDriver();
    var tmp=createElement('span').myHtml(langHtml.helpBub.nExtraSeat);
    tmp.querySelector('img:nth-of-type(1)').prop({src:uExtraSeat,width:200});
    langHtml.helpBub.nExtraSeat=tmp.innerHTML;
    
    var tmp=createElement('span').myHtml(langHtml.helpBub.nChildSeat);
    tmp.querySelector('img:nth-of-type(1)').prop({src:uChildSeat}); tmp.querySelector('img:nth-of-type(2)').prop({src:uChildSeat2});
    langHtml.helpBub.nChildSeat=tmp.innerHTML;
  };

  this.rewriteObj=function(){
      // nPassengers, nChildSeat, nWheelChairPlaces, nExtraSeat
    var tmp={strType:'number', inpW:3, saveInp:posNumOrEmptyF};
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.nPassengers, tmp);
      extend(ORole[i].Prop.nChildSeat, tmp);
      extend(ORole[i].Prop.nWheelChairPlaces, tmp);
    }
    extend(oS.Prop.nExtraSeat, tmp);
      // brand, idDriverGovernment
    extend(oS.Prop.brand, {strType:'text',inpW:6});
    extend(oS.Prop.idDriverGovernment, {strType:'text',inpW:8});
  };
};
//0123456789abcdef


//0123456789abcdef pluginTransport.js
"use strict"
app.CreatorPlugin.transport=function(){
  app.strUnitTime='min';
  var StrS=oS.StrPropE;  // ['brand']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  var {StrPropE}=site;
  var {StrTransportBuyer}=oB;  // ['distStartToGoal','compassPoint','destination']
 

  //var StrTransportBool=['generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer'];
  var StrTransportBool=site.StrTransportBool;
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson],
  ['Contact', ...AMinusB(StrPropContact, ['homeTown'])],
  ['Destination', ...StrTransportBuyer, 'price', 'currency'],
  ['RequestedVehicle', ...StrPropE],
  ['Price', 'price', 'currency', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'standingByMethod', 'shiftEnd'],
  ['Vehicle', 'vehicleType', ...StrPropE],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', 'tel', 'displayEmail', 'link', 'idTeamWanted', 'coordinatePrecisionM'],
  ['Destination', ...StrTransportBuyer],
  ['Cargo', ...StrPropE],
  ['Price', 'currency', 'price']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM'],
  ['Vehicle', 'vehicleType', ...StrPropE],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'tPos', 'idTeam'],
  ['Cargo', ...StrPropE],
  ['Destination', ...StrTransportBuyer],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'standingByMethod', 'currency', 'tPos', 'shiftEnd', 'idTeam'],
  ['Vehicle', 'vehicleType', ...StrPropE],
  ['Reputation', ...StrPropRep]]);

    // Default columns
  oB.ColsShowDefault= ['image', ...StrTransportBuyer, 'idTeam', 'price'];
  oB.ColsShowDefaultS= ['image', 'compassPoint', 'distStartToGoal', 'idTeam', 'price'];
  oB.ColsShowDefaultRS= ['image', 'compassPoint', 'distStartToGoal', 'idTeam', 'price'];
  oB.colOneMarkDefault='image';
  
  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';
  

  viewComparePriceDataPop.setDefault(10,15); // Arg: dist, time

    // images
  var strPlugin='transport';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uDummy=uSpecImageFolder+'dummy.png';
  app.uSleepy=uSpecImageFolder+'carSleepy.png';

  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangDriver();
    var Tmp=StrTransportBool.slice(0,-1);
    for(var i=0;i<Tmp.length;i++) {
      var strName=Tmp[i], tmp=createElement('span').myHtml(langHtml.helpBub[strName]);
      tmp.querySelector('img:nth-of-type(1)').prop({src:uSpecImageFolder+strName+'.jpg',width:200});
      langHtml.helpBub[strName]=tmp.innerHTML;
    }
  };

  this.rewriteObj=function(){
      // StrTransportBool
    for(var j=0;j<StrTransportBool.length;j++) {
      var strName=StrTransportBool[j];
      for(let i=0;i<ORole.length;i++){ extend(ORole[i].Prop[strName], propBoolProt); }
    }
      // brand
    extend(oS.Prop.brand, {strType:'text', inpW:6});
      // payload
    var tmp={strType:'number', inpW:3, saveInp:posNumF}; extend(oB.Prop.payload, tmp); extend(oS.Prop.payload, tmp);
  }
};
//0123456789abcdef
    


//0123456789abcdef pluginCleaner.js
"use strict"
app.CreatorPlugin.cleaner=function(){
  var StrB=oB.StrPropE;  // ['household','janitor','sanitation', 'exterior','customerHasEquipment']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson],
  ['Contact', ...StrPropContact],
  ['Type', ...StrB],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'vehicleType', 'shiftEnd'],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM'],
  ['Type', ...StrB],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'shiftEnd', 'coordinatePrecisionM', 'vehicleType'],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', 'idTeam'],
  ['Type', ...StrB],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'shiftEnd', 'vehicleType', 'tPos', 'idTeam'],
  ['Reputation', ...StrPropRep]]);
  
  
    // Default columns
  oB.ColsShowDefault=['image', 'displayName', ...StrB, 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', ...StrB, 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', ...StrB, 'pricePerHour'];
  oB.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,2); // Arg: dist, time

    // images
  var strPlugin='cleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangContractor();
  };
  this.rewriteObj=function(){
      // StrB
    for(var i=0;i<StrB.length;i++) { var strName=StrB[i]; extend(oB.Prop[strName], propBoolProt); }
  };
};
//0123456789abcdef



//0123456789abcdef pluginWindowcleaner.js
"use strict"
app.CreatorPlugin.windowcleaner=function(){
  var StrB=oB.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson, ...StrB],
  ['Contact', ...StrPropContact],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'vehicleType'],
  ['Tools', ...StrS],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM'],
  ['Other', ...StrB],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType'],
  ['Tools', ...StrS],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', ...StrB, 'idTeam'],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'vehicleType', 'tPos', 'idTeam'],
  ['Tools', ...StrS],
  ['Reputation', ...StrPropRep]]);
  
    // Default columns
  oB.ColsShowDefault=['image', 'displayName', ...StrB, 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', ...StrB, 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', ...StrB, 'pricePerHour'];
  oB.colOneMarkDefault='image';

  oS.ColsShowDefault=['image', 'displayName', ...StrS, 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS=['image', 'displayName', ...StrS, 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS=['image', ...StrS, 'vehicleType', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';


  viewComparePriceDataPop.setDefault(10,2); // Arg: dist, time

    // images
  var strPlugin='windowcleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangContractor();
  };

  this.rewriteObj=function(){
      // customerHasEquipment
    var strName='customerHasEquipment';  extend(oB.Prop[strName], propBoolProt);
      // nWindow
    extend(oB.Prop.nWindow, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // StrS
    for(var i=0;i<StrS.length;i++) { var strName=StrS[i]; extend(oS.Prop[strName], propBoolProt); }
  };
};
//0123456789abcdef


//0123456789abcdef pluginLawnmowing.js
"use strict"
app.CreatorPlugin.lawnmowing=function(){
  var StrB=oB.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice'],   ['pushMower','ridingMower', 'edger']
  
      // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson, ...StrB],
  ['Contact', ...StrPropContact],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'vehicleType', ...StrS],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM', ...StrB],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType', ...StrS],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', ...StrB, 'idTeam'],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'vehicleType', 'tPos', ...StrS, 'idTeam'],
  ['Reputation', ...StrPropRep]]);

    // Default columns
  oB.ColsShowDefault=['image', 'displayName', ...StrB, 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', ...StrB, 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', ...StrB, 'pricePerHour'];
  oB.colOneMarkDefault='image';

  oS.ColsShowDefault=['image', 'displayName', 'tel', 'vehicleType', ...StrS, 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS=['image', 'displayName', 'vehicleType', ...StrS, 'comparePrice'];
  oS.ColsShowDefaultRS=['image', 'displayName', 'vehicleType', ...oS.StrBool, 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='lawnmowing';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangContractor();
  };

  this.rewriteObj=function(){
      // customerHasEquipment
    var strName='customerHasEquipment';  extend(oB.Prop[strName], propBoolProt);
      // area
    extend(oB.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // oS.StrBool
    for(var i=0;i<oS.StrBool.length;i++) { var strName=oS.StrBool[i]; extend(oS.Prop[strName], propBoolProt); }
      // cuttingWidth
    extend(oS.Prop.cuttingWidth, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


//0123456789abcdef pluginSnowremoval.js
"use strict"
app.CreatorPlugin.snowremoval=function(){
  var StrB=oB.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson, ...oB.StrBool, 'area'],
  ['Contact', ...StrPropContact],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'vehicleType', ...oS.StrBool],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM', ...oB.StrBool, 'area'],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'coordinatePrecisionM', ...oS.StrBool, 'vehicleType'],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', ...StrB, 'idTeam'],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'tPos', 'idTeam'],
  ['Tools', 'vehicleType', ...StrS],
  ['Reputation', ...StrPropRep]]);
  
    // Default columns
  oB.ColsShowDefault=['image', 'displayName', ...oB.StrBool, 'area', 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', ...oB.StrBool, 'area', 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', ...oB.StrBool, 'area', 'pricePerHour'];
  oB.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', ...oS.StrBool, 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', ...oS.StrBool, 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', ...oS.StrBool, 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='snowremoval';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    rewriteLangCustomer();
    rewriteLangContractor();
  };

  this.rewriteObj=function(){
    for(var i=0;i<oB.StrBool.length;i++) { var strName=oB.StrBool[i]; extend(oB.Prop[strName], propBoolProt); }
    for(var i=0;i<oS.StrBool.length;i++) { var strName=oS.StrBool[i]; extend(oS.Prop[strName], propBoolProt); }
      // area
    extend(oB.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


//0123456789abcdef pluginFruitpicker.js
"use strict"
app.CreatorPlugin.fruitpicker=function(){
  var StrB=oB.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson, ...StrB],
  ['Contact', ...StrPropContact],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson, 'experience', 'vehicleType'],
  ['Contact', ...StrPropContact],
  ['Price', 'currency', ...StrDistTimePrice, 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM', ...StrB],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType'],
  ['Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour']]);

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', ...StrB, 'idTeam'],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'tPos', 'vehicleType', 'idTeam'],
  ['Reputation', ...StrPropRep]]);
  
    // Default columns
  oB.ColsShowDefault=['image', 'displayName', 'fruit', 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', 'fruit', 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', 'fruit', 'pricePerHour'];
  oB.colOneMarkDefault='fruit';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,8); // Arg: dist, time
  
    // images
  var strPlugin='fruitpicker';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    //langHtml.sellerRewritten=langHtml.picker;
    langHtml.loginInfo.seller=langHtml.picker;
    langHtml.Seller=ucfirst(langHtml.picker);
    langHtml.Sellers=ucfirst(langHtml.pickers);
    langHtml.IndependentSeller=langHtml.IndependentPicker;

    langHtml.seller=langHtml.picker;     langHtml.sellers=langHtml.pickers;
    langHtml.theSeller=langHtml.thePicker;   langHtml.theSellers=langHtml.thePickers;
    langHtml.theSellers0=langHtml.thePickers0;
  }
  this.rewriteObj=function(){
      // fruit
    extend(oB.Prop.fruit, {strType:'text', inpW:8});
  }
};
//0123456789abcdef

//0123456789abcdef pluginProgrammer.js
"use strict"
app.CreatorPlugin.programmer=function(){
  var StrB=oB.StrPropE, StrS=oS.StrPropE;
  
  var StrProgrammerLang=oS.StrProgrammerLang;

    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oB.Main=separateGroupLabels([
  ['Buyer', ...StrPropPerson],
  ['Contact', ...StrPropContact],
  ['RequestedSkills', ...StrB],
  ['Price', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  oS.Main=separateGroupLabels([
  ['Seller', ...StrPropPerson],
  ['Contact', ...StrPropContact],
  ['Languages', ...StrS],
  ['Price', 'currency', 'pricePerHour', 'tLastPriceChange'],
  ['Position', ...StrPropPos],
  ['Reputation', ...StrPropRep]]);
  
    // Properties in roleSettingDiv
  oB.roleSetting=separateGroupLabels([
  ['Buyer', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM'],
  ['RequestedSkills', ...StrB],
  ['Price', 'currency', 'pricePerHour']]);
  oS.roleSetting=separateGroupLabels([
  ['Seller', ...StrPropContactMinusBoWebPushOK, 'idTeamWanted', 'coordinatePrecisionM'],
  ['Languages', ...StrS],
  ['Price', 'currency', 'pricePerHour']]);
  

    // Properties in filterDiv
  oB.filter=separateGroupLabels([
  ['Buyer', 'homeTown', 'currency', 'tPos', 'idTeam'],
  ['RequestedSkills', ...StrB],
  ['Reputation', 'tCreated', 'donatedAmount', 'nComplaint']]);
  oS.filter=separateGroupLabels([
  ['Seller', 'homeTown', 'currency', 'tPos', 'idTeam'],
  ['Languages', ...StrS],
  ['Reputation', ...StrPropRep]]);

    // Default columns
  oB.ColsShowDefault=['image', 'displayName', 'language', 'database', 'tel', 'idTeam', 'pricePerHour'];
  oB.ColsShowDefaultS=['image', 'displayName', 'language', 'database', 'pricePerHour'];
  oB.ColsShowDefaultRS=['image', 'language', 'database', 'pricePerHour'];
  oB.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'idTeam', 'pricePerHour','c','java','php','javascript'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  oS.colOneMarkDefault='image';

    // images
  var strPlugin='programmer';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  //uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    //langHtml.sellerRewritten=langHtml.programmer;
    langHtml.loginInfo.seller=langHtml.programmer;
    langHtml.Seller=ucfirst(langHtml.programmer);
    langHtml.Sellers=ucfirst(langHtml.programmers);
    langHtml.IndependentSeller=langHtml.IndependentProgrammer;

    langHtml.seller=langHtml.programmer;    langHtml.sellers=langHtml.programmers;
    langHtml.theSeller=langHtml.theProgrammer; langHtml.theSellers=langHtml.theProgrammers;
    langHtml.theSellers0=langHtml.theProgrammers0;
  }
  this.rewriteObj=function(){

      // database
    extend(oB.Prop.database, {strType:'text',inpW:6});
      // language
    extend(oB.Prop.language, {strType:'text',inpW:6});

      // StrProgrammerLang
    var crInpFunc=function(){
      var c=createElement('select'), arrTmp=[0,1,2,3,4,5];
      for(var j=0;j<arrTmp.length;j++){  var opt=createElement('option').myText(arrTmp[j]).prop('value',j);   c.append(opt);    }
      return c;
    };
    var tmpSetGrade=function(rowMTab){
      //var data=rowMTab[ele.attr('name')];
      var data=rowMTab[this.strName];
      data=bound(data,0,5); var ColT=['','lightblue','lightgreen','yellow','orange','red'], colT=ColT[data];
      if(this instanceof Node) this.css({'background':colT});
      return data;
    }
    for(var i=0;i<StrProgrammerLang.length;i++) {
      var strName=StrProgrammerLang[i];
      extend(oS.Prop[strName], { strType:'select', crInp:crInpFunc, setInfo:tmpSetGrade, setTabF:tmpSetGrade });
    }
      // otherLang
    extend(oS.Prop.otherLang, {strType:'text',inpW:6});
  }
};
//0123456789abcdef

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//0123456789abcdef client.js
"use strict"
window.onload=function(){

/*******************************************************************************************************************
 *******************************************************************************************************************
 * Functions used in plugins
 *   posNumF, mustBeSetF, posNumOrEmptyF, inpAsNum
 *   butTimeStampCreator
 *   thumbTeamCreator
 *   complaintButtonCreator
 *******************************************************************************************************************
 *******************************************************************************************************************/
app.posNumF=function(){var val=this.value.trim(), strName=this.attr('name'); if(isNumber(val) && val>=0) return [null,val]; else return [strName+' must be nummeric and positive']; }
app.mustBeSetF=function(){var val=this.value.trim(), strName=this.attr('name'); if(val.length) return [null,val]; else return [strName+' can not be empty'];  }
app.posNumOrEmptyF=function(){
  var val=this.value.trim(), strName=this.attr('name'); if(val.length==0 || (isNumber(val) && val>=0) ) return [null,val]; else return [strName+' must be nummeric and positive'];
}
app.inpAsNum=function(){return [null, Number(this.prop('checked'))]; }

app.butTimeStampCreator=function(iRole, colName){ // Used in plugins (in viewTable.ElRole[1].tHeadLabel)
  var el=createElement("button");
  el.setStat=function(){  var boTmp=ORole[iRole].Prop[colName].boUseTimeDiff;  el.myText(boTmp?'+':'-');  }
  el.on('click', function(e) {
    e.stopPropagation();
    ORole[iRole].Prop[colName].boUseTimeDiff=1-ORole[iRole].Prop[colName].boUseTimeDiff;
    el.setStat();
    for(var i=0;i<ORole.length;i++) {
      viewTable.ElRole[i].setCell();
      if(ORole[i].MTab.length){    mapDiv.ArrMarker[i].setMarkers();  mapDiv.ArrMarker[i].drawMarkers();   }
    }
  });
  el.prop('title',langHtml.tsPopup);
  el.addClass('smallButt');
  el.setStat();
  return el;
}

app.thumbTeamCreator=function(oRole){
  var el=createElement('a');
  //var uRoleTeamImage=oRole==oB?uBuyerTeamImage:uSellerTeamImage;
  el.mySet=function(rT){
    //var rT=oRole.MTab[iMTab];
    var data=rT.idTeam, tag=rT.imTagTeam;
    if(data!=0) {
      el.show();
      var strTmp=URoleTeamImage[oRole.ind]+data+'?v='+tag;
      img.prop({src:strTmp});
      var url=rT.linkTeam;  if(url && url.length && !RegExp("^https?:\/\/","i").test(url)) { url='http://'+url; }      el.prop({href:url});
    }else el.hide();

  }
  var img=createElement('img');    el.prop({target:"_blank"}).append(img);    return el;
}

app.complaintButtonCreator=function(oRole){
  var el=createElement('button');
  //el.mySet=function(iMTab){    var rT=oRole.MTab[iMTab]; idUser=rT.idUser;   el.firstChild.nodeValue=rT.nComplaint;     }
  //el.mySet=function(rT){     idUser=rT.idUser;   el.firstChild.nodeValue=rT.nComplaint;     }
  el.mySet=function(rT){     row=rT;   el.firstChild.nodeValue=rT.nComplaint;     }
  el.on('click', function(){
    viewComplainee.setUp(oRole, row); viewComplainee.load();
    viewComplainee.setVis();
    doHistPush({view:viewComplainee});
  });
  el.innerHTML=' ';
  var row; //idUser;
  return el;
}



  // These function must not write to "this" unless "this instanceof Node". because setMapF and setMapMF uses them
  // For time properties
var makeTimeF=function(dir){return function(rowMTab){
  var data=rowMTab[this.strName];
  if(ORole[this.iRole].Prop[this.strName].boUseTimeDiff) data=getSuitableTimeUnitStr(dir*(data-curTime)); else data=UTC2Readable(data); return data;  // this.myText(data);
}; };
app.propTimeAgo=makeTimeF(-1); app.propTimeRemain=makeTimeF(1);
    
    
  // For boolean properties
var tmpSet=function(rowMTab){
  const data=bound(rowMTab[this.strName],0,1), strText=Number(data)?langHtml.Yes:'-';
  if(this instanceof Node) { const ColT=['','lightgreen'], colT=ColT[data]; this.css({'background':colT}); this.myText(strText); } else return strText;
};
var tmpSetMap=function(rowMTab){ return Number(rowMTab[this.strName])?langHtml.Yes:langHtml.No; };
var tmpSetFilterButt=function(span,val){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };

app.propBoolProt={ strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSet, setTabF:tmpSet, setMapF:tmpSetMap, setMapMF:tmpSetMap, setFilterButtF:tmpSetFilterButt}


  // For string properties that might be too long.
//var makeMapF=function(strName,n){return function(rowMTab){var str=rowMTab[strName],n=40; return str.length>n?str.substr(0,n)+'…':str;}  };
//var makeMapMF=function(strName,n){return function(rowMTab){var str=rowMTab[strName]; return str.length>n?str.substr(0,n)+'…':str;}  };
window.NMAXMAPLABEL=40;
app.propSetCrop=function(rowMTab){var str=rowMTab[this.strName], n=NMAXMAPLABEL; return str.length>n?str.substr(0,n)+'…':str;};
//app.propSetCropLabel=function(rowMTab){var str=rowMTab[this.strName], n=NMAXMAPLABEL-langHtml.prop[this.strName].label.length; return str.length>n?str.substr(0,n)+'…':str;};
app.propSetCropLabelI=function(propName, strVal){var n=NMAXMAPLABEL-langHtml.prop[propName].label.length; return strVal.length>n?strVal.substr(0,n)+'…':strVal;};  
app.propSetCropLabel=function(rowMTab){var propName=this.strName, str=rowMTab[propName]; return propSetCropLabelI(propName, str);};

/*******************************************************************************************************************
 *******************************************************************************************************************
 * Some tools (could be placed in a library file)
 *   calcLabel
 *   divMessageTextCreate
 *   popUpCreator
 *   toastCreator
 *   selSpriteCreator
 *   spriteCreator
 *******************************************************************************************************************
 *******************************************************************************************************************/
 
 
//calcLabel=function(Label,strName){ return Label[strName]||ucfirst(strName); }
app.calcLabel=function(obj,strName){ var objA=obj[strName]; return (objA&&objA.label)?objA.label:ucfirst(strName); }

//var spanMessageTextCreate=function(){
  //var el=createElement('span');
  //var spanInner=createElement('span');
  //el.append(spanInner, imgBusy.hide());
  //el.resetMess=function(time){
    //clearTimeout(messTimer);
    //if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    //spanInner.myText(' ');
    //imgBusy.hide();
  //}
  //el.setMess=function(str,time,boRot){
    //spanInner.myText(str);
    //clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //imgBusy.toggle(Boolean(boRot));
  //};
  //el.setHtml=function(str,time,boRot){
    //spanInner.myHtml(str);
    //clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    //imgBusy.toggle(Boolean(boRot));
  //};
  //var messTimer;
  //el.addClass('message');//.css({'z-index':8100,position:'fixed'});
  //return el;
//}

var divMessageTextCreate=function(){
  var spanInner=createElement('span');
  var imgBusyLoc=imgBusy.cloneNode().css({zoom:'65%','margin-left':'0.4em'}).hide();
  var span=createElement('span').myAppend(spanInner, imgBusyLoc);
  var el=createElement('div').myAppend(span);
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(time) { messTimer=setTimeout(resetMess, time*1000); return; }
    spanInner.myText(' ');
    imgBusyLoc.hide();
  }
  el.setMess=function(str='',time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  el.setHtml=function(str='',time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(time)     messTimer=setTimeout(resetMess, time*1000);
    imgBusyLoc.toggle(Boolean(boRot));
  };
  var messTimer;
  span.addClass('message');//.css({'z-index':8100,position:'fixed'});
  return el;
}

var popUpExtend=function(el){
  el.openPop=function() {
    el.append(divMessageTextW);
    container.empty().append(el);  elBody.append(blanket);  elBody.append(container);
  }
  el.closePop=function() {  el.remove();  container.remove();  blanket.remove();  elBody.append(divMessageTextW);  }

  el.addClass('Center');
  var blanket=createElement('div').addClass('blanket');
  var container=createElement('div').addClass('Center-Container');
  return el;
}


app.toastExtend=function(el){
  var hideToast=function(){  el.hide();  }
  el.showToast=function(t=4000){
    el.show();
    t=setTimeout(hideToast, t);
  }
  var t;
  el.on('click', function(){clearTimeout(t); hideToast();});
  el.addClass('toast').hide();
  return el;
}


app.selSpriteCreator=function(iObj){
  var el=createElement('span');
  el.isOpen=function() { return divMenu.style.display!='none'; }
  var openFunc=function(e) {
    e.stopPropagation();
    var i=spriteOnButt.iCur;
    divMenu.show();
    divMenu.cssChildren(colOff);
    divMenu.querySelector('div:nth-of-type('+(i+1)+')').css(colOn);
  }
  el.closeFunc=function() {
    divMenu.hide();
  }
  el.mySet=function(i){
    spriteOnButt.mySet(i);
  }
  var menuClickF=function() {
    var i=getNodeIndex(this);  divMenu.hide();  spriteOnButt.mySet(i);
  }
  el.myGet=function(){ return spriteOnButt.iCur;  }
  var mouseOver=function(ele){var tmp=colSel; if(this.i==spriteOnButt.iCur) tmp=colOn; this.css(tmp);}
  var mouseOut=function(ele){var tmp=colOff; if(this.i==spriteOnButt.iCur) tmp=colOn; this.css(tmp);}

  var colOn={background:'#f92'}, colOff={background:''}, colSel={background:'pink'};
  el.css({display:'inline-block',position: 'relative'});
  
  var spriteOnButt=spriteCreator(iObj);

  var button=createElement('button').myAppend(spriteOnButt).on('click', function(e){   if(el.isOpen()) { el.closeFunc();}  else { openFunc(e);}  });
  var divMenu=createElement('div').css({position:'absolute',border:'black 1px solid',background:'#fff',left:0+'px',top:28+'px','z-index':1});
  el.append(button,divMenu);

  for(var i=0;i<iObj.order.length;i++){
    var span=spriteCreator(iObj);
    span.css({position:'relative', top:'50%',  transform:'translateY(-50%)'})
    var div=createElement('div').css({'height':'2em'}).myAppend(span).on('click', menuClickF).on('mouseover', mouseOver).on('mouseout', mouseOut);
    div.i=i
    span.mySet(i); divMenu.append(div);
  }

  divMenu.hide();
  elHtml.on('click', el.closeFunc);
  return el;
}

app.spriteCreator=function(iObj){
  var el=createElement('span');
  el.mySet=function(iItem){
    el.iCur=iItem; var strName=iObj.order[iItem];
    var item=iObj.item[strName];
    var wSc=Math.ceil(zT*item.w),  hSc=Math.ceil(zT*item.h);  //el.strName=strName; el.iCur=iObj.order.indexOf(strName);
    el.css({width:wSc+'px',height:hSc+'px'});
    var lef=-zT*item.x, to=-zT*item.y;
    img.css({left:lef+'px', top:to+'px'});
  }
  el.iCur=undefined;
  var zT=iObj.zoom;

  el.css({display:'inline-block',position: 'relative',overflow:'hidden',bottom:'0px'});
  var wSSc=zT*iObj.sheetW, hSSc=zT*iObj.sheetH;
  var img=createElement('img').css({position:'absolute',width:wSSc+'px',height:hSSc+'px'}).prop({src:iObj.url});
  el.append(img);
  return el;
}



/*******************************************************************************************************************
 * Some loose functions
 *******************************************************************************************************************/

app.separateGroupLabels=function(arr){
  var objOut={StrProp:[], StrGroupFirst:[], StrGroup:[]};
  for(var i=0;i<arr.length;i++){
    objOut.StrProp=objOut.StrProp.concat(arr[i].slice(1));
    objOut.StrGroupFirst.push(arr[i][1]);
    objOut.StrGroup.push(arr[i][0]);
  }
  return objOut;
}

var startPopExtend=function(el){
  el=popUpExtend(el);
  el.css({ width:'14em', padding: '1.1em'});
  el.openFunc=el.openPop;    el.closeFunc=el.closePop;
  return el;
}

var startPopExtendTouch=function(el){
  el.css({width:'100%',padding: '1em 0',position:'fixed',top:'0px','border':'solid 1px','background':'lightgrey','z-index':'9004'});
  el.openPop=function() {
    elBody.prepend(el);
  }
  el.closePop=function() {  el.remove(); }
  el.openFunc=el.openPop;    el.closeFunc=el.closePop;
  return el;
}

var noOneIsVisibleToastCreator=function(){
  var el=createElement('div');
  el=toastExtend(el).css({bottom:'10em'});
  var im=createElement('img').prop({src:uDummy}).css({margin:'auto',display:'block'});
  var p1=createElement('span').myText(langHtml.CurrentlyNoOneIsVisible);
  el.append(p1);
  return el;
}

var agreementStartCreator=function(){
  var el=createElement('div');
  el=popUpExtend(el);
  el.openFunc=el.openPop;
  el.compareLocalDates=function(boSeller){
    var boFirst=0;
    dateLocal=getItem('agreInformedDate'); if(dateLocal===null) {dateLocal=[0,0]; }
    if(dateLocal[boSeller]===0) boFirst=1;  //if the local stored time is 0 then boFirst shall be true
    var boNew=0;  if(dateTextComp[boSeller]>dateLocal[boSeller]) {boNew=1;}

    //el.querySelector('span').hide();
    //var d0=el.querySelector('span:eq(0)'), d1=el.querySelector('span:eq(1)');
    //if(boFirst) d0.show(); else d1.show();
    d0.toggle(Boolean(boFirst));  d1.toggle(Boolean(1-boFirst));
    //return [boFirst,boNew];
    return {boFirst:boFirst,boNew:boNew};
    //return boNew;
  }
  el.setLocalDates=function(boSeller){
    //setItem('agreInformedDate',dateTextComp);
    if(boSeller) setItem('agreInformedDate',dateTextComp); // Write both
    else {var dateTextTmp=[dateTextComp[0],dateLocal[1]]; setItem('agreInformedDate',dateTextTmp);} // Write only the first
  }
  el.css({ width:'25em', padding: '2em'});
  //el.querySelector('button:eq(0)').on('click', el.closePop);
  var buttonOK=createElement('button').myText(langHtml.OK).on('click', el.closePop);
  var d0=createElement('span').myHtml(langHtml.agreement[0]), d1=createElement('span').myHtml(langHtml.agreement[1]);

  var dateLocal=[];
  var vStr=['agreementComplainerHead','agreementSellerHead'];
  var dateText=[];
  for(var i=0;i<vStr.length;i++){
    var arrT=langHtml[vStr[i]].match(/(\d\d\d\d)-(\d\d)-(\d\d)/);
    dateText[i]=(new Date(arrT[1],arrT[2],arrT[3]))/1000;
  }
  var dateTextComp=[0,0]; dateTextComp[0]=dateText[0];  // dateTextComp: date of text to compare with dateLocal (for complainer resp complainee) (complainee shall read both texts)
  for(var i=0;i<vStr.length;i++){
    if(dateText[i]>dateTextComp[1]) dateTextComp[1]=dateText[i];
  }

  return el;
}



var trackConv=function(google_conversion_id,google_conversion_label) {
  var image = new Image(1,1);
  image.src = "https://www.googleadservices.com/pagead/conversion/"+google_conversion_id+"/?label="+google_conversion_label+"&script=0";
}


var charRoleDefault='s';
var charRole=getItem('charRole');  if(charRole===null) charRole=charRoleDefault;
var roleTogglerCreator=function(viewTarget){
  var el=createElement('button');
  el.setStat=function(charRole){
    var charRoleAlt=charRole=='b'?'s':'b';
    var strCol=charRoleAlt=='s'?'lightblue':'pink';
    var strRoleUC=charRoleAlt=='s'?'Sellers':'Buyers';
    el.css({'background':strCol}).myText(langHtml[strRoleUC]);
  }
  el.getStat=function(){  return el.style.background=='lightblue'?'b':'s';   }
  el.prop('title', langHtml.ToggleBetweenBuyerAndSeller).on('click',function(){
    charRole=el.getStat();
    charRole=charRole=='b'?'s':'b';
    el.setStat(charRole);
    setItem('charRole', charRole);

    viewTarget.setVis();  //doHistReplace({view:ViewTarget[iTmp]});
  });
  el.addClass('flexWidth').css({'font-size':'70%'});
  return el;
}


  //
  // History stuff
  //

app.histGoTo=function(view){}
app.historyBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateMem={hash:history.state.hash, ind:indNew};
  history.pushState(stateMem, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0, indNew);
  history.StateMy[indNew]=obj;
}
app.doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
app.changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
app.getHistStatName=function(){
  return history.StateMy[history.state.ind].view.toString();
}
history.distToGoal=function(viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var view; if(typeof obj=='object') view=obj.view; else continue;
    if(view===viewGoal) {indGoal=i; break;}
  }
  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function(viewGoal, boRefreshHash){
  var dist=history.distToGoal(viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * login stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var toggleSpecialistButts=function(){
  mainLoginInfo.setStat();

  var boE=Boolean(userInfoFrDB.user); viewFront.entryButtonW.toggle(!boE);
  
  var boE=Boolean(userInfoFrDB.admin); viewSettingEntry.adminButton.toggle(boE);
  
  var boAny=0, boBoth=1;
  for(var i=0;i<2;i++){
    var strRole=i?'seller':'buyer', objTeam=userInfoFrDB[strRole+'Team'];
    var boTeamExist=Boolean(objTeam), boTeamApproved=boTeamExist&&objTeam.boApproved;
    viewSettingEntry.TeamButton[i].toggle(Boolean(boTeamApproved));
    ViewEntry[i].teamApprovedMess.toggle(Boolean(boTeamExist && !boTeamApproved));
    
    var boE=Boolean(userInfoFrDB[strRole]); boAny=boAny||boE; boBoth=boBoth&&boE;
    viewFront.QuickDiv[i].toggle(boE);
    viewSettingEntry.userDiv.SettingButton[i].toggle(boE);
  }
  viewSettingEntry.userDiv.toggle(boAny);
  
  for(var i=0;i<2;i++){
    viewFront.QuickDiv[i].butTogW.toggle(boBoth);
  }

  var boSubscribed=boE?userInfoFrDB.user.boWebPushOK:false;
  myWebPush.boSubscribed=boSubscribed;
  if(boSubscribed && ('Notification' in window) && (Notification.permission!='granted')) {
    myWebPush.subscription=null; myWebPush.boSubscribed=false;
    //var vec=[['setWebPushSubcription',{ strSubscription: JSON.stringify(myWebPush.subscription)}]];   majax(vec);
    myWebPush.cbFun(null);
  }else{
    SpanInpWebPushToggle.Span.forEach(ele=>ele.mySet());
  }

  /* if(userInfoFrDB.seller){
    var tmp=agreementStart.compareLocalDates(1); if(tmp.boNew) {agreementStart.setLocalDates(1); agreementStart.openFunc(); }
  }*/
}


var createUPop=function(IP, uRedir, nonce){
  var arrQ=["client_id="+site.client_id[IP], "redirect_uri="+encodeURIComponent(uRedir), "state="+nonce, "response_type=code"];
  if(IP=='fb')   arrQ.push("scope=email", "display=popup"); //
  else if(IP=='google')    arrQ.push("scope=profile,email");
  else if(IP=='idplace')    arrQ.push("scope=name,image,email");
  //arrQ.push("auth_type=reauthenticate");
  return UrlOAuth[IP]+'?'+arrQ.join('&');
}
var getOAuthCode=function*(flow){
  var strQS, nonce=randomHash(), uPop=createUPop(strIPPrim, strSchemeLong+site.wwwLoginRet, nonce);
  window.loginReturn=function(strQST){ strQS=strQST; flow.next();}
  //if('wwwLoginScope' in site) document.domain = site.wwwLoginScope;
  if(site.wwwLoginScope) document.domain = site.wwwLoginScope;
  window.open(uPop, '_blank', 'width=580,height=400'); //, '_blank', 'popup', 'width=580,height=400'
  yield;

  var params=parseQS(strQS.substring(1));
  if(!('state' in params) || params.state !== nonce) {   return ['Invalid state parameter: '+params.state]; }
  if('error' in params) { return [params.error]; }
  if(!('code' in params)) { return ['No "code" parameter in response from IdP']; }
  return [null, params.code];
}



var idPLoginCreator=function(){
  var el=createElement('div')
  return el;
}


var viewFormLoginCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'formLoginDiv';}


  el.setUp=function(){
    inpEmail.value='';    inpPass.value='';
  }

  var loginWEmail=function(e){
    e.preventDefault();
    var flow=(function*(){
      //var tmp=SHA1(inpPass.value+strSalt);
      var hashPW=inpPass.value+strSalt; for(var i=0;i<nHash;i++) hashPW=SHA1(hashPW);
      var vec=[['loginWEmail',{email:inpEmail.value, password:hashPW}], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;
      history.fastBack(viewFront);

    })(); flow.next();
    return false;
  }
  var sendEmail=function(e){
    var vec=[['sendLoginLink',{email:inpEmail.value}]];   majax(vec);  e.preventDefault();
  }

  var divHead=createElement('h3').myText('Sign in using email / password').css({'text-align':'center'});

  var formLogin=document.querySelector('#formLogin');
  var inpEmail=formLogin.querySelector("input[name='email']").css({'max-width':'100%'});
  var inpPass=formLogin.querySelector("input[name='password']").css({'max-width':'100%'});
  var buttLogin=formLogin.querySelector("button[name='submit']").css({"margin-top": "1em"}).on('click',loginWEmail);
  [...formLogin.querySelectorAll('input[type=text],[type=email],[type=number],[type=password]')].forEach( ele=>ele.css({display:'block'}).on('keypress',(e)=>{if(e.which==13) loginWEmail(e);} ) );

  var messDiv=createElement('div').css({color:'red'});
  var buttForgot=createElement('a').prop({href:''}).myText('Forgot your password?').on('click', function(e){  viewForgottPWPop.openFunc(); e.preventDefault(); });
  var imgH=imgHelp.cloneNode(); popupHover(imgH, createElement('div').myText("A new password is generated and sent to the email address."));
  var divForgot=createElement('div').css({'margin-top':'1em'}).myAppend(buttForgot, imgH);
  var butSendLink=createElement('a').prop({href:''}).myText('Login with email link').on('click', sendEmail);
  var imgH=imgHelp.cloneNode(); popupHover(imgH, createElement('div').myText("An email is sent with a link which will log you in. Your password is not changed."));
  var divSendLink=createElement('div').css({'margin-top':'1em'}).myAppend(butSendLink, imgH);

  var buttonCreateAccount=createElement('button').addClass('highStyle').myText('Create an account').on('click', function(){
    doHistPush({view:viewCreateUser});
    viewCreateUser.setVis();
  });

  var divCont=createElement('div').addClass('contDiv').myAppend(divHead, messDiv, formLogin, divForgot, divSendLink, '<hr>', buttonCreateAccount);

  
      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText('Login with email / password').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var divLoginSelectorCreator=function(oRole){
  var el=createElement('div');
  var {strRole, charRoleUC}=oRole;
  el.toString=function(){return 'divLoginSelector';}

  var strButtonSize='2em';
  var imgFb=createElement('img').prop({src:uFb}).on('click', function(){
    var flow=(function*(){
      ga('send', 'event', 'button', 'click', 'idPClick');
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:strRole+'Fun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;

      var boE=Boolean(userInfoFrDB[strRole]);
      var tmpIntroPop=strRole=='buyer'?mainIntroPopB:mainIntroPopS;
      //var tmpQuickDiv=strRole=='buyer'?viewFront.quickDivB:viewFront.quickDivS;
      var tmpQuickDiv=viewFront.QuickDiv[Number(strRole=='seller')];
      if(boE) tmpQuickDiv.setUp(); else tmpIntroPop.openFunc(); 
      history.fastBack(viewFront);
    })(); flow.next();
  });
  imgFb.css({align:'center', display:'block', 'margin': '0.7em auto'}); //     , position:'relative',top:'0.4em',heigth:strButtonSize,width:strButtonSize

  var divHead=createElement('h3').myText('Sign in / Create account').css({'text-align':'center'});

  var emailToggleEventF=function(){
    var now=Date.now(); if(now>timeSpecialR+1000*10) {timeSpecialR=now; nSpecialReq=0;}    nSpecialReq++;
    //if(nSpecialReq==3) { nSpecialReq=0;boAllowEmailLogin=!boAllowEmailLogin; divRight.toggle(boAllowEmailLogin);   }
    if(nSpecialReq==3) { nSpecialReq=0; divRight.toggle();   }
  }
  var timeSpecialR=0, nSpecialReq=0;
  divHead.on('click', emailToggleEventF);

  var cssCol={display:'inline-block','box-sizing': 'border-box',padding:'1em',flex:1}; //width:'50%',
  var buttonViaEmail=createElement('button').addClass('highStyle').myText('Email and password').on('click', function(){
    doHistPush({view:viewFormLogin});
    viewFormLogin.setVis();
  });
  var divLeft=createElement('div').css(cssCol).css({'text-align':'center'}).myAppend(imgFb); divLeft.insertAdjacentHTML('beforeend', '<p>Email, name and image are used, although not shown publicly unless you want to.</p><p>Nothing is written to your Facebook flow.</p>' ); // <p>You can delete your account at any time., '(recommended)' <br>(fewer passwords to remember) (no new password to remember)
  var divRight=createElement('div').css(cssCol).css({'border-left':'2px solid grey', 'text-align':'center'}).myAppend( buttonViaEmail);        divRight.hide();
  var divRow=createElement('div').myAppend(divLeft, divRight).css({display: 'flex', 'justify-content':'space-around'});  //

  divHead.css({display:'block', 'margin':'1em 0em 1em 0.6em'});
  el.myAppend(divHead, divRow);

  el.css({'text-align':'left'});
  return el;
}


var viewCreateUserCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'createUser';}
  var save=function(){
    resetMess();
    var strPassword=inpPass.value.trim();
    if(strPassword!==inpPassB.value.trim()) { var tmp='Password-fields are not equal'; setMess(tmp, 5); return; }
    if(strPassword.length<lPWMin) { var tmp='The password must be at least '+lPWMin+' characters long'; setMess(tmp, 5); return; }

    var strName=inpName.value.trim();
    var strEmail=inpEmail.value.trim(); if(/\S+@\S+/.test(strEmail)) ; else {setMess('Invalid email', 5); return;}

    var strTmp=grecaptcha.getResponse(); if(!strTmp) {setMess("Captcha response is empty", 5); return; }
    var hashPW=strPassword+strSalt; for(var i=0;i<nHash;i++) hashPW=SHA1(hashPW);
    var o={name:strName, email:strEmail, password:hashPW,  'g-recaptcha-response': grecaptcha.getResponse()};

    //var vec=[['createUser',o], ['setupById',{}, el.cb]];   majax(vec);
    var vec=[['sendVerifyEmailNCreateUserMessage', o, saveRet]];   majax(vec);

    inpPass.value=''; inpPassB.value='';
    setMess('',null,true);
  }
  var saveRet=function(data){
    if(data.boOK){
      var strTmp='Check your mailbox, an email was sent which contains a link which will create the account.';
      setMess(strTmp);  messEndDiv.myText(strTmp);
    }
  }

  var lPWMin=boDbg?2:6;

  el.setUp=function(){
    //if(divReCaptcha.is(':empty')){
    if(divReCaptcha.hasChildNodes()){
      if(typeof grecaptcha=='undefined') var grecaptcha={render:function(){console.log('no grecaptcha');}};
      grecaptcha.render(divReCaptcha, {sitekey:strReCaptchaSiteKey});
    }
    //messDiv.firstChild.nodeValue=' ';  messEndDiv.firstChild.nodeValue=' ';
    messDiv.myText('');  messEndDiv.myText('');
    return true;
  }
  el.cb=null;

  var h1=createElement('h1').myText('Create account');

  var formCreateAccount=document.querySelector('#formCreateAccount');
  var inpName=formCreateAccount.querySelector("input[name='name']").css({'max-width':'100%'});
  var inpEmail=formCreateAccount.querySelector("input[name='email']").css({'max-width':'100%'});
  var inpPass=formCreateAccount.querySelector("input[name='password']").css({'max-width':'100%'});
  var inpPassB=formCreateAccount.querySelector("input[name='passwordB']").css({'max-width':'100%'});
  [...formCreateAccount.querySelectorAll('input[type=text],[type=email],[type=number],[type=password]')].forEach( ele=>ele.css({display:'block', 'margin-bottom':'0.5em'}) );
  inpPass.attr("placeholder", 'at least '+lPWMin+' characters');

  var divReCaptcha=createElement('div');
  el.divDisclaimerW=createElement('div').css({'margin':'0em', 'padding':'0em'});

  var messDiv=createElement('div').css({color:'red'});


  var buttonVerifyNCreate=createElement('button').myText('Verify email and create account').on('click', save).addClass('flexWidth').css({'margin':'0.5em 0em 0.3em'})
  var messEndDiv=createElement('div');  //=createElement('span').css({'margin-left':'.4em'});

  var divCont=createElement('div').addClass('contDiv').myAppend(h1, el.divDisclaimerW, messDiv,   formCreateAccount, divReCaptcha, buttonVerifyNCreate, messEndDiv);
  
      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText(langHtml.CreateAccount).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var viewChangePWPopCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'changePWPop';}
  var save=function(){
    resetMess();
    messDiv.myText('');
    if(inpPass.value.trim()!==inpPassB.value.trim()) { setMess('The new password fields are not equal', 5); return; }
    var lTmp=boDbg?2:6; if(inpPass.value.trim().length<lTmp) { setMess('The password must be at least '+lTmp+' characters long', 5); return; }

    var hashPWO=inpPassOld.value.trim()+strSalt; for(var i=0;i<nHash;i++) hashPWO=SHA1(hashPWO);
    var hashPWN=inpPass.value.trim()+strSalt; for(var i=0;i<nHash;i++) hashPWN=SHA1(hashPWN);
    var o={passwordOld:hashPWO, passwordNew:hashPWN};

    var vec=[['changePW',o,changePWRet]];   majax(vec);
    setMess('',null,true);
  }

  el.openFunc=function(){
    doHistPush({view:viewChangePWPop});
    el.setVis();
    inpPassOld.value=''; inpPass.value=''; inpPassB.value='';
  }
  el.setVis=function(){
    el.show();
    return true;
  }
  var changePWRet=function(data){
    if(data.boOK) { inpPassOld.value=''; inpPass.value=''; inpPassB.value='';  historyBack(); }
  }

  var h1=createElement('h3').myText('Change your password');
  var blanket=createElement('div').addClass("blanket");
  var messDiv=createElement('div').css({color:'red'});
  var labPassOld=createElement('label').myText('Old password'), labPass=createElement('label').myText('New password'),  labPassB=createElement('label').myText('New password again');
  var inpPassOld=createElement('input').prop('type','password'), inpPass=createElement('input').prop({type:'password', placeholder:"at least 6 characters"}),  inpPassB=createElement('input').prop('type','password');

  [inpPassOld, inpPass, inpPassB].forEach( (ele)=>ele.css({display:'block', 'margin-bottom':'0.5em'}).on('keypress', function(e){ if(e.which==13) {okF();return false;}} ) );

  var ok=createElement('button').myText(langHtml.OK).addClass('highStyle').on('click', save);
  var cancel=createElement('button').myText(langHtml.Cancel).addClass('highStyle').on('click', historyBack);
  var divBottom=createElement('div').myAppend(cancel,ok);  //viewbuttonCancel,

  var centerDiv=createElement('div').myAppend(h1, messDiv,   labPassOld, inpPassOld, labPass, inpPass, labPassB, inpPassB, divBottom);
  centerDiv.addClass("Center").css({padding:'1.1em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  return el;
}

var viewForgottPWPopCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'forgottPWPop';}
  var okF=function(){
    var vec=[['verifyPWReset',{email:inpEmail.value.trim()}, okRet]];   majax(vec);

  };
  el.openFunc=function(){
    doHistPush({view:viewForgottPWPop});
    el.setVis();
    inpEmail.value='';
  }
  el.setVis=function(){
    el.show();
    return true;
  }
  var okRet=function(data){
    if(data.boOK) { inpEmail.value='';  historyBack(); }
  }

  var h1=createElement('h3').myText('Forgott your password?');
  var blanket=createElement('div').addClass("blanket");
  var labEmail=createElement('label').myText('Email');
  var inpEmail=createElement('input').prop('type','email').on('keypress', function(e){ if(e.which==13) {okF();return false;}} );
  inpEmail.css({display:'block', 'margin-bottom':'0.5em'});

  var ok=createElement('button').myText(langHtml.OK).addClass('highStyle').on('click', okF);
  var cancel=createElement('button').myText(langHtml.Cancel).addClass('highStyle').on('click', historyBack);
  var divBottom=createElement('div').myAppend(cancel,ok);

  var centerDiv=createElement('div').myAppend(h1, labEmail, inpEmail, divBottom);
  centerDiv.addClass("Center").css({padding:'1.1em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  return el;
}

var viewConvertIDCreator=function(){
  var el=createElement('div')
  el.toString=function(){return 'convertID';}
  el.setUp=function(){}
  el.openFunc=function(){
    pendingMess.hide(); cancelMess.hide();
    doHistPush({view:viewConvertID});
    el.setVis();
  };
  el.myReset=function(){   clearInterval(timerClosePoll);     }
  el.myResetNBack=function(){   el.myReset(); historyBack();    }
  var imgT=imgBusy.cloneNode().css({'margin-left':'0.4em'});
  var pendingMess=createElement('span').hide().css({"margin-left":"0.3em"}).myAppend(langHtml.pendingMessLogin, imgT);
  var cancelMess=createElement('span').hide().myText(langHtml.cancelMessLogin);

  var headA=createElement('h2').myText('This site has changed ID-provider').css({'margin-top':'0.5em'});
  var headB=createElement('div').myAppend('<p>Before '+strIPAltLong+' was used as ID-provider now '+strIPPrimLong+' is used instead. Sorry if you think its an inconvenience.<p>Login with '+strIPPrimLong+' (You\'ll be asked to create an account if you don\'t have one).').css({'margin-top':'0.5em'});
  var headC=createElement('div').myAppend('<p>After that login with your old ('+strIPAltLong+') ID to convert reputation and comments to the '+strIPPrimLong+' ID.').css({'margin-top':'0.5em'});

  var timerClosePoll;

  var uImagePrim=window['u'+ucfirst(strIPPrim)];
  var imPrim=createElement('img').prop({src:uImagePrim}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'userFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;
    })(); flow.next();
  });

  var uImageAlt=window['u'+ucfirst(strIPAlt)];
  var imAlt=createElement('img').prop({src:uImageAlt}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPAlt, fun:'mergeIDFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;

    })(); flow.next();
  });

  var fragRows=createFragment(pendingMess, cancelMess, headA, headB, imPrim, headC, imAlt).cssChildren({'margin':'1em 0em 1em 0.6em'});
  var divCont=createElement('div').myAppend(fragRows).addClass('contDiv');

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText('Convert ID').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Filter
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

app.butTeamImgCreator=function(oRole){
  var el=createElement('span');
  el.mySet=function(idTeam,boOn){
    var boId=Number(idTeam)!=0;
    spanIndependent.toggle(!boId);   im.toggle(boId);
    if(boId){
      var strTmp=URoleTeamImage[oRole.ind]+idTeam;
      im.prop({src:strTmp});
    }
    let opacity=boOn?1:0.4; im.css({opacity: opacity});
  }
  var spanIndependent=createElement('span'); spanIndependent.myText(langHtml.Independent);
  var im=createElement('img');
  el.myAppend(spanIndependent,im);
  return el;
}


      // filt (client-side): 'B/BF'-features: [vOffNames,vOnNames, boWhite],     'S'-features: [iOn,iOff]
      // filt (server-side): 'B/BF'-features: [vSpec, boWhite],     'S'-features: [iOn,iOff]
      // hist (client-side): 'B'-features: [vPosName,vPosVal],       'S'/'BF'-features: [vPosInd,vPosVal]
      // histPHP (server-side): histPHP[buttonNumber]=['name',value], (converts to:) hist[0]=names,  hist[1]=values
var viewFilterCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'filterDiv';}
  
  el.setUp=function() {
    var indRole=Number(charRole=='s'), oRole=ORole[indRole];  elRole=ElRole[indRole];
    spanLab.css({background:oRole.strColor});
    var strTmp=langHtml[indRole?'Sellers':'Buyers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(charRole);
    ElRole[indRole].show(); //.setUp();
    ElRole[1-indRole].hide();
    el.FilterInfoSpan[indRole].show();
    el.FilterInfoSpan[1-indRole].hide();
  }
  var elRole, ElRole=[];
  el.FilterInfoSpan=[];
  for(var i=0;i<2;i++){
    var oRole=ORole[i];
    var oArg=copySome({}, oRole, ['Prop', 'Label']); copySome(oArg, oRole.filter, ['StrGroupFirst', 'StrGroup']); oArg.StrOrderFilt=oRole.filter.StrProp; oArg.objSetting=objFilterSetting;
    oArg.helpBub=extend({},oRole.helpBub);
    ElRole[i]=filterDivICreator(oArg, loadTabStart).addClass('contDiv');
    el.FilterInfoSpan[i]=filterInfoSpanCreator();
  }
  el.ElRole=ElRole;
  el.addClass('unselectable');    el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em'});

  var tmpImg=createElement('img').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  
  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'});
  
  var buttAll=createElement('a').prop({href:''}).myText(langHtml.All).on('click', function(e){elRole.Filt.filtAll(); loadTabStart(); e.preventDefault();}).css({ 'margin':'0em 1em', 'font-size':'80%'});
  var buttNone=createElement('a').prop({href:''}).myText(langHtml.None).on('click', function(e){elRole.Filt.filtNone(); loadTabStart(); e.preventDefault();}).css({ 'margin':'0em 1em', 'font-size':'80%'});
  
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(tmpImg, langHtml.Filter, spanRole, ' (',...el.FilterInfoSpan,')').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, buttAll, buttNone, spanLab).addClass('footDiv'); //.css({'padding-top':'0em'});  // , 'text-align':'center' ,overflow:'hidden'

  [...ElRole, divFoot].forEach(ele=>ele.css({'background-color':'#eee'}));
  el.myAppend(...ElRole, divFoot).css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}

var filterInfoSpanCreator=function(){
  var el=createElement('span');
  el.setRatio=function(arr){ txt.nodeValue=arr[0]+'/'+arr[1];  }
  var txt=createTextNode('/');  el.append(txt);
  return el;
}

var filterButtonCreator=function(){
  var el=createElement('button');
  el.setUp=function(NTotNFilt){
    for(var i=0;i<2;i++){ FilterInfoSpan[i].setRatio(NTotNFilt[i]); }
  }
  var FilterInfoSpan=[], Div=[];
  for(var i=0;i<2;i++){
    FilterInfoSpan[i]=filterInfoSpanCreator();
    Div[i]=createElement('div').myAppend(FilterInfoSpan[i]).css({background:ORole[i].strColor});
  }
  var tmpDivW=createElement('div').myAppend(...Div).css({'font-size':'.7em'})

  var tmpImg=createElement('img').prop({src:uFilter}).css({height:'1em', width:'1em', 'margin-right':'0.5em'});// height:'1em', width:'1em',   //,'vertical-align':'middle'  //,'vertical-align':'text-bottom'
  el.myAppend(tmpImg, tmpDivW).addClass('flexWidth').prop('title',langHtml.FilterTitle);
  el.on('click',function(){
    viewFilter.setVis();  doHistPush({view:viewFilter});
    ga('send', 'event', 'button', 'click', 'filter');
  });
  el.css({'padding-left':'0.3em', 'padding-right':'0.3em', display:'flex', 'align-items':'center'});
  return el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Settings
 *   viewSettingEntryCreator
 *     viewUserSettingCreator
 *         divIPSettingCreator
 *       viewUploadImageCreator
 *       viewDeleteAccountPopCreator
 *     viewSettingCreator
 *         spanIdTeamWantedCreator
 *     viewAdminCreator
 *     viewTeamCreator
 *   mainLoginInfoCreator
 *     viewEntryCreator
 *     mainIntroPopCreator
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var viewSettingEntryCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'settingEntry';}
  
  
  //var buttShowMarkSelectB=createElement('button').myText(langHtml.Buyers).css({background:oB.strColor, 'margin-left':'0.4em'}).on('click', function(){
    //var viewTmp=viewMarkSelector.ElRole[0]; viewTmp.setVis();doHistPush({view:viewTmp});
  //});
  //var buttShowMarkSelectS=createElement('button').myText(langHtml.Sellers).css({background:oS.strColor}).on('click', function(){
    //var viewTmp=viewMarkSelector.ElRole[1]; viewTmp.setVis();doHistPush({view:viewTmp});
  //});
  el.setUp=function(){
    for(let i=0;i<2;i++) {
      var oRole=ORole[i];
      ButtShowMarkSelect[i].querySelector('span').myText(oRole.colOneMark);
    }
  }
  el.userDiv=createElement('div');
  el.userDiv.SettingButton=[];
  el.TeamButton=[];
  var ButtShowMarkSelect=[];
  for(let i=0;i<2;i++) {
    var oRole=ORole[i], strTmp=i?'Sellers':'Buyers';
    var spanTmp=createElement('span');
    ButtShowMarkSelect[i]=createElement('button').myAppend(langHtml[strTmp]+' (', spanTmp, ')').css({background:oRole.strColor}).on('click', function(){
      charRole=ORole[i].charRole; // Temporary
      viewMarkSelector.setVis(); doHistPush({view:viewMarkSelector});
    });
    var strTmp=i?'Seller':'Buyer';
    el.userDiv.SettingButton[i]=createElement('button').myText(langHtml[strTmp+'Settings']).on('click',function(){
      charRole=i?'s':'b';
      viewSetting.setVis(); doHistPush({view:viewSetting});
    });
    el.TeamButton[i]=createElement('button').myText(strTmp+' team settings').on('click', function(){
      ViewTeam[i].setUp(); ViewTeam[i].setVis(); doHistPush({view:ViewTeam[i]});
    }); //.css({display:'block'})
  }
  //ButtShowMarkSelect[0].css({'margin-left':'0.4em'});
  
  var divMapMarkerI=createElement('div').myAppend(...ButtShowMarkSelect).css({display:'flex'});
  var divMapMarker=createElement('div').prop('id','divMapMarker').myText(langHtml.ChangeMapMarkers+':').myAppend(divMapMarkerI);

  
  var userSettingButton=createElement('button').myText(langHtml.UserSettings).on('click',function(){
    viewUserSetting.setVis(); doHistPush({view:viewUserSetting});
  });
  var complainerButton=createElement('button').myText('Complaints from me').on('click',function(){
    var userT=userInfoFrDB.user, objT={idComplainer:userT.idUser}; copySome(objT, userT, ['image', 'displayName']);
    viewComplainer.setUp(objT);
    //viewComplainer.setUp(userInfoFrDB.user);
    viewComplainer.load();
    viewComplainer.setVis(); doHistPush({view:viewComplainer});
  });
  //var butts=createFragment(userSettingButton, ...el.userDiv.SettingButton, createElement('br'), complainerButton).cssChildren({margin:'.5em 0.1em'});
  var h=createElement('p').myText("Settings for logged in users").css({'font-weight':'bold'});
  
  el.adminButton=createElement('button').myText('Admin').css({display:'block'}).on('click',function(){
    viewAdmin.setVis(); doHistPush({view:viewAdmin});
  });
  var divA=createElement('div').myAppend(userSettingButton, ...el.userDiv.SettingButton).css({display:'flex'}); //divA.cssChildren({});
  var divTeam=createElement('div').myAppend(...el.TeamButton).css({display:'flex'});
  el.userDiv.myAppend(h, divA, complainerButton, el.adminButton, divTeam);
  el.userDiv.css({'background':'#ccc', 'border':'solid 1px', 'padding':'0.2em 0', 'margin':'1em 0.6em 1em 0.6em'});
  el.userDiv.cssChildren({margin:'.5em 0.1em'});
  
  var fragOpt=createFragment(divMapMarker, el.userDiv);
  fragOpt.cssChildren({'margin':'1em 0em 1em 0.6em'});
  
  [el.userDiv.SettingButton[0], el.TeamButton[0]].forEach((ele)=>{ele.css({background:oB.strColor}) });
  [el.userDiv.SettingButton[1], el.TeamButton[1]].forEach((ele)=>{ele.css({background:oS.strColor})});
  

  
  el.divCont=createElement('div').addClass('contDiv').myAppend(fragOpt);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  //var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var span=createElement('span').myAppend('⚙ ', langHtml.Settings).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');

  
  el.myAppend(el.divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var viewUserSettingCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'userSetting';}

  el.setUp=function(){
    var tmp=userInfoFrDB.user;
    inpDisplayName.value=tmp.displayName;  
    oB.Prop.image.setInp.call(spanImg);
    oB.Prop.boWebPushOK.setInp.call(spanBoWebPushOK);
    cbBoGeoWatch.checked=boGeoWatch;
    divIPSetting.setUp();
    return true;
  }
  var divIPSetting=divIPSettingCreator().css({background:'lightgrey', margin:'0.2em', border:'1px black solid'});
  
  var saveDisplayName=function(){ var vec=[['UUpdate',{displayName:inpDisplayName.value.trim()}], ['setupById', {}]];   majax(vec); }
  var inpDisplayName=createElement('input').prop({type:'text'}).on('keypress', function(e){if(e.which==13) {saveDisplayName();return false;}} );
  var butDisplayName=createElement('button').myText('Change').on('click', saveDisplayName);
  var divDisplayName=createElement('div').myAppend('Display name: ', inpDisplayName, butDisplayName);
  

  el.createDivs=function(){
    spanImg=oB.Prop.image.crInp();
    divImage.myAppend('Display image: ', spanImg);
    
    spanBoWebPushOK=oB.Prop.boWebPushOK.crInp('setting');
    divBoWebPushOK.myAppend("Enable Push Messages: ", spanBoWebPushOK);
  }
  var spanImg, divImage=createElement('div');
    // change PW
  var buttChangePW=createElement('button').myText('Change password').on('click', function(e){ viewChangePWPop.openFunc(); });
  var divPW=createElement('div').myAppend('Change password: ', buttChangePW);

      // divBoWebPushOK
  var spanBoWebPushOK, divBoWebPushOK=createElement('div');
  divBoWebPushOK.toggle(boEnablePushNotification);
  
    // boGeoWatch
  var imgH=imgHelp.cloneNode(); popupHover(imgH,createElement('div').myText('For continuous tracking to work on mobile devices, the device must be prevented from going to sleep, and the browser must be in the foreground.'));
  var cbBoGeoWatch=createElement('input').prop({type:'checkbox'}).on('click',function(){
    boGeoWatch=this.checked;
  });
  var divBoGeoWatch=createElement('div').myAppend('Continuous tracking: ', cbBoGeoWatch, imgH);
  
      // deleteDiv
  //var imgH=imgHelp.cloneNode(); popupHover(imgH,createElement('div').myText(langHtml.deleteBox));
  var butDelete=createElement('button').myText(langHtml.DeleteAccount).css({'margin-right':'1em'}).on('click', function(){doHistPush({view:viewDeleteAccountPop}); viewDeleteAccountPop.setVis();});
  var deleteDiv=createElement('div').myAppend(butDelete); //,imgH

  var fragDiv=createFragment(divIPSetting, divDisplayName, divImage, divPW, divBoWebPushOK, divBoGeoWatch, deleteDiv).cssChildren({'margin-top':'1em'});
  var divCont=createElement('div').myAppend(fragDiv).addClass('contDiv');
  
    // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText('User settings').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var divIPSettingCreator=function(){  // Div in userSettingDiv
  var el=createElement('div');
  el.setUp=function(){
    var tmp=userInfoFrDB.user;
    //spanIdUser.myText(tmp.idUser);   spanIdFB.myText(tmp.idFB);  spanIdIdPlace.myText(tmp.idIdPlace);  spanIdOpenId.myText(tmp.idOpenId);
    //spanIdUser.firstChild.nodeValue=tmp.idUser||' ';   spanIdFB.firstChild.nodeValue=tmp.idFB||' ';  spanIdIdPlace.firstChild.nodeValue=tmp.idIdPlace||' ';  spanIdOpenId.firstChild.nodeValue=tmp.idOpenId||' ';
    spanIdUser.myText(tmp.idUser);   spanIdFB.myText(tmp.idFB);  spanIdIdPlace.myText(tmp.idIdPlace);  spanIdOpenId.myText(tmp.idOpenId);
    imgImage.prop({src:tmp.image});
    //spanNameIP.myText(tmp.nameIP);  spanEmail.myText(tmp.email);
    //spanNameIP.firstChild.nodeValue=tmp.nameIP||' ';  spanEmail.firstChild.nodeValue=tmp.email||' ';
    spanNameIP.myText(tmp.nameIP);  spanEmail.myText(tmp.email);
    return true;
  }
  
  var divHead=createElement('div').css({'margin-bottom':'0.5em','font-weight':'bold'});  divHead.myText('Data from Id-provider (user info): ')

  var uImagePrim=window['u'+ucfirst(strIPPrim)+'22'];
  var buttRefetch=createElement('img').prop({src:uImagePrim}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'refetchFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;
      el.setUp();
    })(); flow.next();
    return false;
  });
  var divRefresh=createElement('div'); divRefresh.myAppend('Refetch data: ', buttRefetch);

  //var spanIdUser=createElement('span').myText(' '), spanIdFB=createElement('span').myText(' '), spanIdIdPlace=createElement('span').myText(' '), spanIdOpenId=createElement('span').myText(' ');
  var spanIdUser=createElement('span'), spanIdFB=createElement('span'), spanIdIdPlace=createElement('span'), spanIdOpenId=createElement('span');
  //spanIdFB.add(spanIdIdPlace).add(spanIdOpenId).css({margin:'0 0.2em 0 0', 'font-weight':'bold'});
  [spanIdFB,spanIdIdPlace,spanIdOpenId].forEach( (ele)=>ele.css({margin:'0 0.2em 0 0', 'font-weight':'bold'}) );

  var divIdUser=createElement('div').myAppend(createTextNode('idUser (db): '), spanIdUser);
  var divIdIP=createElement('div').myAppend('FB: ', spanIdFB); //, ', IdPlace: ', spanIdIdPlace, ', OpenID: ', spanIdOpenId
  
  var imgImage=createElement('img').css({'vertical-align':'middle'}), spanNameIP=createElement('span');
  var divImageName=createElement('div').myAppend(imgImage, spanNameIP);

  var spanEmail=createElement('span');
  var bub=createElement('div').myText("This email is not shown to the public.");
  var imgH=imgHelp.cloneNode();  popupHover(imgH,bub);
  var divEmail=createElement('div').myAppend('Email: ', spanEmail, imgH);

    // change PW
  var buttChangePW=createElement("button").myText('Change password').on('click', function(e){ viewChangePWPop.openFunc(); });
  var divPW=createElement('div').myText('Change password: ').myAppend(buttChangePW);

      // deleteDiv
  //var imgH=imgHelp.cloneNode(); popupHover(imgH,createElement('div').myText(langHtml.deleteBox));
  var butDelete=createElement('button').myText(langHtml.DeleteAccount).css({'margin-right':'1em'}).on('click', function(){doHistPush({view:viewDeleteAccountPop}); viewDeleteAccountPop.setVis();});
  var deleteDiv=createElement('div').myAppend(butDelete);


  var fragDiv=createFragment(divHead, divRefresh, divIdIP, divImageName, divEmail).cssChildren({'margin-top':'1em'});
  el.append(fragDiv);
  return el;
}



var viewUploadImageCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'uploadImage';}
  var progressHandlingFunction=function(e){      if(e.lengthComputable){   progress.attr({value:e.loaded,max:e.total});      }      }
  var errorFunc=function(jqXHR, textStatus, errorThrown){
    setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
  }

  var setMess=function(str) {divMess.myText(str);}
  var clearMess=function() {divMess.myText(' ');}
  var toggleVerified=function(boT){  boT=Boolean(boT);   uploadButton.prop("disabled",!boT); }
  var verifyFun=function(){
    clearMess();
    var arrFile=this.files;
    if(arrFile.length>1) {setMess('Max 1 file',5); toggleVerified(0); return;}
    if(arrFile.length==0) {setMess('No file selected',5); toggleVerified(0); return;}
    objFile=arrFile[0];
    if(objFile.size==0){ setMess("objFile.size==0",5); toggleVerified(0); return; }
    var tmpMB=(objFile.size/(1024*1024)).toFixed(2);

    toggleVerified(1);
  }
  var sendFun=function(){
    clearMess();
    if(typeof FormData=='undefined') {alert("Your browser doesn't support FormData"); return; }
    var formData = new FormData();
    formData.append("type", 'single');
    formData.append("kind", strKind);
    formData.append("fileToUpload[]", objFile);



    //var vecIn=[['uploadImage', {}], ['CSRFCode',CSRFCode]];
    var vecIn=[['uploadImage', {}], ['CSRFCode',getItem('CSRFCode')]];
    var arrRet=[sendFunRet];
    formData.append('vec', JSON.stringify(vecIn));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', uBE, true);
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
    
    progress.visible(); //progress.visible();
    xhr.onprogress=progressHandlingFunction;
    xhr.onload=function() {
      var dataFetched=this.response;
      var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
      
      
      var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
      delete data.dataArr;
      beRet(data);
      for(var i=0;i<dataArr.length;i++){
        var r=dataArr[i];
        //if(r.length) { if('strMessage' in r[0]) setMess(r[0].strMessage);   }
        if(r.length==1) {var f=arrRet[i]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
      }
      progress.attr({value:0});  progress.invisible(); 
    }
    xhr.onerror=function(e){ progress.invisible(); errorFunc.call(this,arguments); }
    
    xhr.send(dataOut); 
    busyLarge.show();


    //majax(oAJAXL,[['uploadImage',formData,sendFunRet]], true);
    setMess('Uploading ...');
    uploadButton.prop("disabled",true);
  }
  var sendFunRet=function(data){
      if('strMessage' in data) setMess(data.strMessage); progress.invisible(); uploadButton.prop("disabled",false);
      callback();
  }
  el.openFunc=function(strKindT, callbackT){
    strKind=strKindT; callback=callbackT; setMess('');  inpFile.value='';
    doHistPush({view:viewUploadImage});
    el.setVis();
  };
  el.setVis=function(){
    el.show();
    return true;
  }
  var strKind='u', callback;
  //el.css({'max-width':'20em', padding: '0.3em 0.5em 1.2em 0.6em'});

  var head=createElement('h3').myText('Upload Image: ').css({'font-weight':'bold'});
  var formFile=createElement('form'); //enctype="multipart/form-data"
  var inpFile=createElement('input').prop({type:'file', name:'file', id:'file', accept:'image/*'}).css({background:'lightgrey'});
  //var inpUploadButton=createElement('input type="button" value="Upload"');
  var uploadButton=createElement('button').myText('Upload').prop("disabled",true).css({'margin-right':'0.5em'});
  var progress=createElement('progress').prop({max:100,value:0}).css({'display':'block','margin-top':'1em'}).invisible();
  var divMess=createElement('div').css({'margin-top':'1.2em', 'min-height':'1em'});

  var objFile;
  inpFile.on('change',verifyFun).on('click', function(){uploadButton.prop("disabled",true);});
  formFile.myAppend(inpFile);   formFile.css({display:'inline'});


  var closeButton=createElement('button').myText('Close').on('click', historyBack);
  var menuBottom=createElement('div').myAppend(closeButton, uploadButton).css({'margin-top':'1.2em'});

  //el.myAppend(head, formFile, progress, divMess, menuBottom);

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(head, formFile, progress, divMess, menuBottom);
  centerDiv.addClass("Center").css({'max-width':'21em', padding: '0.3em 0.5em 1.2em 0.6em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  uploadButton.on('click', sendFun);
  el.css({'text-align':'left'});
  return el;
}



var viewDeleteAccountPopCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'deleteAccountPop';}
  var yes=createElement('button').myText(langHtml.Yes).on('click', function(){
    //var vec=[['UDelete',1,function(data){historyBack();historyBack();}]];   majax(vec);
    sessionLoginIdP={};  userInfoFrDB=extend({}, specialistDefault);
    var vec=[['UDelete',{}], ['logout',{}, function(data){
      history.fastBack(viewFront,true);
    }]];   majax(vec);

  });
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', historyBack);
  el.setVis=function(){
    el.show();
    return true;
  }
  var h1=createElement('div').myText(langHtml.deleteBox.regret);
  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(h1,cancel,yes);
  centerDiv.addClass("Center").css({padding:'1.1em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket); 
  el.css({'text-align':'left'});
  return el;
}


var settingCreator=function(oRole){
  var el=createElement('div');
  el.save=function(){
    resetMess();
    var o={charRole:charRole},boErr=0;
    arrInp.forEach(function(ele,i){
      var inp=ele,  strName=inp.attr('name'), prop=(strName in oRole.Prop)?oRole.Prop[strName]:{};
      //if('saveInp' in prop) {var tmp=prop.saveInp(inp); if(tmp===false) boErr=1; else if(tmp===null); else o[strName]=tmp;} else o[strName]=inp.value.trim();
      if('saveInp' in prop) {var [err,val]=prop.saveInp.call(inp); if(err) {setMess(err, 10); boErr=1; } else o[strName]=val;}
      else {var tmp=inp.value; if(typeof tmp=='string') tmp=tmp.trim(); o[strName]=tmp; }
    });
    if(boErr) return;
    var vec=[['RUpdate', o, el.setUp], ['setupById',{Role:strRole}]];   majax(vec);
    setMess('',null,true);
  }

  el.createDivs=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var imgH=''; if(strName in oRole.helpBub ) {    var imgH=imgHelp.cloneNode().css({'margin-left':'0', 'margin-right':'0.4em'});   popupHover(imgH,oRole.helpBub[strName]);         }

      //var strLabel=ucfirst(strName)+': '; if(strName in langHtml.prop) strLabel=langHtml.prop[strName].label+': ';
      var strLabel=calcLabel(langHtml.prop, strName);
      var elLabel=createElement('label').myText(strLabel).css({flex:'0 1 auto', 'margin-right':'0.4em'}); //
      var spanSpace=createElement('span').css({flex:'2 2 auto'}); //

      var inp='', prop=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in prop)?prop.strType:'';
      if('crInp' in prop) inp=prop.crInp.call(inp); else inp=createElement('input').prop('type',strType);
      extend(inp, {strName:strName, iRole:oRole.ind});
      if('inpW' in prop)  inp.css({width:prop.inpW+'em'});
      inp.css({flex:'0 1 auto'});
      inp.attr('name',strName);
      //var divLCH=createElement('div').myAppend(strLabel,imgH,inp).css({position:'relative', margin:'.8em 0','min-height':'2em'});
      var divLCH=createElement('div').myAppend(elLabel,imgH,spanSpace, inp).css({display:'flex', 'justify-content':'space-between', 'align-items':'center', margin:'.8em 0','min-height':'2em'});
      arrDiv[i]=divLCH;
      arrInp[i]=inp;
    }
    el.append(...arrDiv);
    var Tmp=el.querySelectorAll('input[type=text],[type=number],[type=tel],[type=email],[type=url]');
    [...Tmp].forEach( (ele)=>ele.on( 'keypress', function(e){ if(e.which==13) {el.save();return false;} } ) );
    var Tmp=el.querySelectorAll('input[type=number]'); 
    [...Tmp].forEach( (ele)=>ele.prop({min:0}) );
    //[...el.querySelectorAll('input,select')].forEach( (ele)=>ele.css({'float':'right',clear:'both'}) );

    var checkBoxes=el.querySelectorAll('input[type=checkbox]');
    var tmp=boAndroid?{'-webkit-transform':'scale(2,2)'}:{width:'1.4em',height:'1.4em'}; extend(tmp,{flex:'0 0 auto'});  [...checkBoxes].forEach((ele)=>ele.css(tmp));

      // Add labels
    for(var i=0;i<StrGroup.length;i++){
      var h=createElement('span').myText(langHtml[StrGroup[i]]+':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      var tmp=el.querySelector('[name='+StrGroupFirst[i]+']').parentNode; tmp.insertAdjacentElement('beforebegin', createElement('hr').css('clear','both')); tmp.insertAdjacentElement('beforebegin', h);
    }
  }
  el.setUp=function(){
    arrInp.forEach(function(ele, i){
      var inp=ele, strName=inp.attr('name'), prop=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in prop)?prop.strType:'';
      if('setInp' in prop) prop.setInp.call(inp);
      else {
        var data=userInfoFrDB[strRole][strName];
        if(strType==='checkbox') inp.prop('checked',Number(data));   else inp.value=data;
      }
    });
    return true;
  }
  var {charRole, strRole, charRoleUC}=oRole;
  var {StrProp, StrGroup, StrGroupFirst}=oRole.roleSetting;
  
  var arrInp=Array(StrProp.length);
  var arrDiv=Array(StrProp.length);
  return el;
}

var viewSettingCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'setting';}
  el.setUp=function(){
    var indRole=Number(charRole=='s'), oRole=ORole[indRole], oRoleAlt=ORole[1-indRole], elRoleAlt=ElRole[1-indRole];
    elRole=ElRole[indRole];
      // span
    spanLab.css({background:oRole.strColor});
    var strTmp=indRole?'SellerSettings':'BuyerSettings';  strTmp=langHtml[strTmp]; spanRole.myText(strTmp);
    var boAlt=userInfoFrDB[oRoleAlt.strRole]; roleToggler.toggle(boAlt);
    var boCur=userInfoFrDB[oRole.strRole];
    elRoleAlt.hide(); roleToggler.setStat(charRole);
    if(boCur) {
      elRole.show(); elRole.setUp();
      return true;
    }else {elRole.hide(); return false; }
  }
  var save=function(){ elRole.save();}
  var elRole;
  var ElRole=[];   for(var i=0;i<2;i++){ElRole[i]=settingCreator(ORole[i]); }
  var divCont=createElement('div').addClass('contDiv').myAppend(...ElRole);
  el.ElRole=ElRole;
  
    // divFoot
  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'}); if(boIE) roleToggler.css({display:''});
  
  var buttonSave=createElement('button').on('click', save).myText(langHtml.Save).addClass('flexWidth').css({'margin-right':'.2em'});
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(spanRole).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, buttonSave, spanLab).addClass('footDiv');

  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}





app.spanIdTeamWantedCreator=function(oRole){
  var el=createElement('span');
  var strRole=oRole.strRole;
  //var uRoleTeamImage=strRole=='buyer'?uBuyerTeamImage:uSellerTeamImage;
  el.setStat=function(){
    var idTmp=userInfoFrDB[strRole].idTeamWanted, tag=userInfoFrDB[strRole].imTagTeam;
    if(idTmp!=0){ var strTmp=URoleTeamImage[oRole.ind]+idTmp+'?v='+tag; thumbDis.prop({src:strTmp}); thumbDis.show(); spanDisNApproved.show(); inp.value=idTmp;}
    else { thumbDis.hide(); spanDisNApproved.hide(); inp.value='';}

    var idTeam=userInfoFrDB[strRole].idTeam; spanDisNApproved.toggle(idTmp!=idTeam);
  }
  var inp=createElement('input').prop('type','text').css({width:'3em'});
  var thumbDis=createElement('img').css({'vertical-align':'middle','margin':'0 0.4em'}); //'float':'right',clear:'both'
  var spanDisNApproved=createElement('span').myText(langHtml.NotYetApproved).css({'vertical-align':'middle','margin-right':'0.4em', 'white-space':'nowrap'}); //'float':'right',clear:'both'
  el.myAppend(thumbDis, spanDisNApproved, inp);
  el.css({display:'flex', 'align-items':'center'});
  el.inp=inp; return el;
}



var viewAdminCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'admin';}
  el.setUp=function(data){
    //boShowTeam=Boolean(Number(data.boShowTeam)); inpBoShowTeam.prop({checked:boShowTeam});
    //for(var i=0;i<ORole.length;i++){
      //viewFilter.ElRole[i].querySelectorAll('[name=idTeam]').toggle(boShowTeam);
      //viewMarkSelector.ElRole[i].tBody.querySelector('[name=idTeam]').toggle(boShowTeam);
      //viewColumnSelector.ElRole[i].tBody.querySelector('[name=idTeam]').toggle(boShowTeam);
      //viewSetting.ElRole[i].querySelector('[name=idTeamWanted]').parentNode.toggle(boShowTeam);
      //if(!boShowTeam) {
        //arrValRemove(ORole[i].ColsShowDefault,'idTeam');
        //arrValRemove(ORole[i].ColsShow,'idTeam');  setItem('ColsShow'+ORole[i].charRoleUC, ORole[i].ColsShow);
        //if(ORole[i].colOneMark=='idTeam') ORole[i].colOneMark=ORole[i].colOneMarkDefault;
      //}
    //}   
  }

    //set 
  el.saveFunc=function(){
    //var data={boShowTeam:Number(inpBoShowTeam.checked)}; el.setUp(data);
    //var vec=[['setSetting',data]];   majax(vec);
  }

  //var inpBoShowTeam=createElement('input').prop({type:'checkbox'});
  //var pBoShowTeam=createElement('p').css({'margin-top':'1em'}).myAppend('boShowTeam:',inpBoShowTeam);
  var divCont=createElement('div').addClass('contDiv');  //.myAppend(pBoShowTeam)

      // divFoot
  var buttonSave=createElement('button').on('click', el.saveFunc).myText(langHtml.Save).addClass('flexWidth').css({ 'margin-right':'.2em'});
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText('Admin settings').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, buttonSave, span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}



var viewTeamCreator=function(oRole){
  var el=createElement('div');
  var {strRole, charRoleUC}=oRole;
  el.toString=function(){return 'team'+charRoleUC;}
  el.setUp=function(boShow){
    elId.value='';  elLink.value='';
    var vec=[['teamLoad',{strRole:strRole},disLoadRet]];   majax(vec);
    el.boLoaded=1;
  }
  var disLoadRet=function(data){
    var {idUser, link}=userInfoFrDB[strRole+'Team'];
    elId.myText(idUser);
    //thumb.attr({src:uRoleTeamImage+idUser+'?v='+imTag});
    thumb.attr({src:calcTeamImageUrl()});
    elLink.value=link;
    //var tmp=data.link;   if(typeof tmp==="undefined")  tmp='';
    //var tmp=data.tab;  if(typeof tmp==='undefined') tmp=[]; el.tab=tmp;
    el.tab=[]; if('tabWannaBe' in data) el.tab=tabNStrCol2ArrObj(data.tabWannaBe);
    el.divList.empty();
    //if(el.tab.length==0) return;
    for(var i=0; i<el.tab.length; i++) {
      var rT=el.tab[i]
      var {nameIP, idTeam}=el.tab[i];
      //var id=createElement('span').myAppend(idFB);
      //var boTmp=Boolean(Number(idTeam==idTeamWanted));
      var boTmp=idTeam==idUser;
      var cb=createElement('input').prop('type','checkbox').on('click', save).prop('checked',boTmp).css({'margin-right':'0.4em', 'vertical-align':'middle'});
      var img=createElement('img').prop({src:calcImageUrl(rT)}).css({'margin-left':'0.4em', 'vertical-align':'middle'});
      var row=createElement('div').myAppend(cb, nameIP, img);
      el.divList.append(row);
    }

    //resetMess(10);
  };
  var save=function(){
    var cb=this, span=cb.parentNode, i=getNodeIndex(span), idUserMember=el.tab[i].idUser;
    var vec=[['teamSave',{idUser:idUserMember, strRole:strRole, boOn:this.checked}]];   majax(vec);
  }
  var saveName=function(){
    var link=elLink.value.trim();
    var vec=[['teamSaveName', {link:link, strRole:strRole}]];   majax(vec);
  }
  var calcTeamImageUrl=function(){
    var {idUser, imTag}=userInfoFrDB[strRole+'Team'];  return URoleTeamImage[oRole.ind]+idUser+'?v='+imTag;
  }
  //var uRoleTeamImage=strRole=='buyer'?uBuyerTeamImage:uSellerTeamImage;
  el.boLoaded=0;
  var elId=createElement('span').css({'font-weight':'bold'});
  var elLink=createElement('input').attr({type:'text',size:10}).on('keypress', function(e){ if(e.which==13) {saveName();return false;}} );
  var thumb=createElement('img').css({'vertical-align':'middle'});
  var uploadCallback=function(){
    userInfoFrDB[strRole+'Team'].imTag=randomHash(); thumb.attr({src:calcTeamImageUrl()});
    //var tmpF=function(){thumb.attr({src:calcTeamImageUrl()});};    var vec=[ ['setupById',{Role:'team'},tmpF]];   majax(vec);
  }
  var buttUploadImage=createElement('button').myText('Upload image').on('click', function(){viewUploadImage.openFunc(oRole.charRole, uploadCallback);}).css({'margin-right':'0.4em'});
  var buttSaveName=createElement('button').myText('Save link').on('click', saveName).css({'margin-left':'0.4em'});
  el.divList=createElement('div');

  var strId='Inform the team members of this number, they should enter it in their repective settings tab.';
  var hId=createElement('div').myText(strId);
  var hLink=createElement('div').myText('A link to any other site of yours.');
  var hList=createElement('div').myText('A list of users who wants to belong to your team. Mark those who you approve.');

  var hImg0=imgHelp.cloneNode().css({'margin-left':'1em'}), hImg1=imgHelp.cloneNode().css({'margin-left':'1em'}), hImg2=imgHelp.cloneNode().css({'margin-left':'1em'});
  popupHover(hImg0,hId);   popupHover(hImg1,hLink);   popupHover(hImg2,hList);
  var divA=createElement('div').myAppend('Team-Id: ',elId,',',hImg0);
  var divB=createElement('div').myAppend('Thumb image: ',thumb,' ',buttUploadImage,' (will be shrunk to fit a 50 x 50 pixel square)');
  var divC=createElement('div').myAppend('Link: (optional)',elLink,buttSaveName,hImg1);
  
  var divHeadUserList=createElement('div').myAppend('List of users', hImg2).css({'font-weight':'bold'});

  //var divCont=createElement('div').addClass('contDiv').myAppendB('Team-Id: ',elId,',',hImg0,'<br>',
          //'Thumb image: ',thumb,' ',buttUploadImage,' &nbsp;&nbsp;(will be shrunk to fit a 50 x 50 pixel square)<br>',
          //'Link: (optional)',elLink,' &nbsp;',buttSaveName,hImg1,'<hr>','<b>List of users</b>',hImg2,el.divList);
          
  var divCont=createElement('div').addClass('contDiv').myAppend(divA, divB, divC, createElement('hr'), divHeadUserList, el.divList);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').css({background:oRole.strColor}).addClass('footDivLabel').myText(ucfirst(langHtml[strRole])+' team settings');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var mainLoginInfoCreator=function(){
  var el=createElement('div');
  el.setStat=function(){
    var arrKind=[], boIn=0;
    if('user' in userInfoFrDB && userInfoFrDB.user){
      boIn=1;
      var arrTmp=['buyer','seller','complainer', 'admin']
      for(var i=0; i<arrTmp.length; i++){  var key=arrTmp[i]; if(userInfoFrDB[key]) {  arrKind.push(langHtml.loginInfo[key]); }   }
    }
    if(boIn){
      spanName.firstChild.nodeValue=userInfoFrDB.user.nameIP;
      var strTmp=arrKind.join(', '); if(strTmp) strTmp='('+strTmp+')';
      spanKind.firstChild.nodeValue=strTmp;
      //el.css({visibility:''});
      el.show();
    }else {
      //el.css({visibility:'hidden'});
      el.hide();
    }
  }
  var spanName=createElement('span').myText('.'), spanKind=createElement('span').myText('.').css({'margin-left':'.4em', 'margin-right':'0.4em'});
  //var logoutButt=createElement('a').prop({href:''}).myText(langHtml.loginInfo.logoutButt).css({'float':'right'});
  var logoutButt=createElement('button').myText(langHtml.loginInfo.logoutButt).css({'margin-left':'auto', 'font-size':'90%'});
  logoutButt.on('click', function(){
    sessionLoginIdP={}; userInfoFrDB=extend({}, specialistDefault);
    var vec=[['logout', {}, function(data){
      history.fastBack(viewFront,true);
    }]];
    majax(vec);
    return false;
  });

  //el.myAppend(spanName,' ',spanKind,' ',logoutButt,'<br clear=all>');
  el.myAppend(spanName,spanKind,logoutButt);
  el.css({'text-align':'left', display:'flex', 'justify-content':'space-between', width:'100%', 'max-width':'800px'});
  el.hide();
  return el;
}


var viewEntryCreator=function(oRole){
  var el=createElement('div');
  var {strRole, charRoleUC}=oRole;
  el.toString=function(){return 'entry'+charRoleUC;}
  el.setUp=function(){
    var nTmp=strRole=='buyer'?nBuyerReal:nSellerReal;
    var nNext=nTmp+1; //if(nNext==13) nNext=14;
    var ending=makeOrdinalEndingEn(nNext);
    spanNNext.myText(nNext); //+ending
  }
  var headOrdinal=createElement('span').myHtml(langHtml['headOrdinal'+charRoleUC]).css({'font-weight':'bold'});
  var labOrdinal=createElement('span').myHtml(langHtml['labOrdinal'+charRoleUC]), spanNNext=labOrdinal.querySelector(':nth-child(1)').css({'font-weight':'bold'});
  var labOrdinalB=createElement('div').myHtml(langHtml['labOrdinalB'+charRoleUC]);
  var divOrdinal=createElement('div').myAppend(headOrdinal, ' ', labOrdinal).css({border:'solid green 2px', padding:'0.3em'});
  //var func=function(){}; if(!boDbg) func=function(){trackConv(949679695,"wCpMCPHKhQUQz-zrxAM");}

  var specialRequstF=function(){
    var now=Date.now(); if(timeSpecialR+1000*10<now) {timeSpecialR=now; nSpecialReq=1;} else nSpecialReq++;
    if(nSpecialReq==3) { buttLoginTeam.show();    }
  }
  var timeSpecialR=0, nSpecialReq=0;

  var infoLinkSeller=createElement('a').prop({href:uWiki+'/'+'New_User',target:"_blank"}).myText(langHtml.gettingStartedLink);
  var aTOS=createElement('a').prop({href:uWiki+'/'+'ToS',target:"_blank"}).myText('Terms of service');
  //var pSeeAlso=createElement('p').myAppend(langHtml.SeeAlso+': ',aTOS);
  var pSeeAlso=createElement('p').myAppend(aTOS);


  var buttLoginTeam=createElement('button').myText(langHtml.SignInAs+' ('+langHtml.TeamAdmin+')').css({display:'block'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'teamFun', strRole:strRole, caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;

      history.fastBack(viewFront);

    })(); flow.next();
    return false;
  }).hide();


  if(document.domain.substr(0,4)=='demo') viewbuttLoginSeller.hide();

  var pWiki=createElement('div').myAppend(pSeeAlso);

  var divLoginSelector=divLoginSelectorCreator(oRole);

  //var hovWhyIsFBNeeded=hovHelp.cloneNode().myText(langHtml.WhyIsFBNeededQ).css({margin:'1em 0 0 0', display:'block', 'vertical-align':'middle'}),  bub=createElement('div').myText(langHtml.WhyIsFBNeededA);     popupHover(hovWhyIsFBNeeded,bub,15000);
  //var NothingIsWrittenToYourFBFlow=createElement('div').myText(langHtml.NothingIsWrittenToYourFBFlow);
  //var YouCanUseCustomImage=createElement('div').myText(langHtml.YouCanUseCustomImage);
  var NoteYouCanDeleteYourAccount=createElement('div').myText(langHtml.NoteYouCanDeleteYourAccount);
  //var FBToPreventMultipleAccounts=createElement('div').myText(langHtml.FBToPreventMultipleAccounts);
  //var aPrivacyPolicy=createElement('a').prop({href:'https://closeby.market/Privacy_policy_2016-Oct-12'}).myText("Privacy policy 2016-Oct-12");
  //var aDisclaimer=createElement('a').prop({href:'https://closeby.market/Disclaimer_2016-Oct-12'}).myText("Disclaimer 2016-Oct-12").css({display:'block'});
  var aMoreAboutWhyAnIdPIsUsed=createElement('a').prop({href:'https://closeby.market/WhyIsAnIdPUsed'}).myText(langHtml.MoreAboutWhyAnIdPIsUsed).css({display:'block'});

  
  el.teamApprovedMess=createElement('div').css({display:'block'}).myText('Team/brand not approved, Contact '+domainName+' to become approved.');
  var fragRow=createFragment(divOrdinal, divLoginSelector, pWiki, buttLoginTeam, el.teamApprovedMess).cssChildren({'margin':'1em 0em 1em 0.6em'});;
  
    // , NoteYouCanDeleteYourAccount  FBToPreventMultipleAccounts, NothingIsWrittenToYourFBFlow, YouCanUseCustomImage, , langSpan, NoteYouCanDeleteYourAccount
    
  if(0){
    var iframeLike=createElement('iframe').prop({src:"//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fgavott&amp;width&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;stream=false&amp;show_border=false&amp;appId=237613486273256", scrolling:"no", frameborder:"0", style:"border:none; overflow:hidden; height:62px;", allowTransparency:"true"});
  }else{var iframeLike=createElement('span');}
  iframeLike.css({'float':'right',clear:'both'});
  var topDivA=createElement('div').myAppend(iframeLike).css({'margin-top':'1em',overflow:'hidden'});  //buttonBack,  , aMoreAboutWhyAnIdPIsUsed
  var divCont=createElement('div').addClass('contDiv').myAppend(topDivA,fragRow);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var divFoot=createElement('div').myAppend(buttonBack).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var mainIntroPopCreator=function(oRole){
  var el=createElement('div');
  var {charRole, strRole, charRoleUC}=oRole;
  var save=function(){ 
    ga('send', 'event', 'button', 'click', 'introCont');
    resetMess();  
    var strTel=inpTel.value.trim(); inpTel.value=strTel;
    var strEmail=inpEmail.value.trim(); inpEmail.value=strEmail;
    if(boEnablePushNotification){
      if(strTel.length==0 && strEmail.length==0 && !myWebPush.boSubscribed) {setMess('At least one of WebPush / tel / email must be used.'); return; }
    }else{
      if(strTel.length==0 && strEmail.length==0) {setMess('At least one of tel / email must be supplied'); return; }
    }
    //if(strTel.length==0) {setMess('tel is empty'); return; }
    var curT; if(strLang=='sv') curT='SEK'; else curT='USD';
    var nameT=inpName.value.trim();  inpName.value=nameT;
    var boIdIPImage=Number(cbIdIPImage.prop('checked'));
    var o1={displayName:nameT, strSubscription:JSON.stringify(myWebPush.subscription), tel:strTel, displayEmail:strEmail, currency:curT, charRole:charRole, boIdIPImage:boIdIPImage};
    var vec=[['RIntroCB',o1,function(data){el.closePop();}], ['setupById', {}]];   majax(vec);

    var iframeConversion=createElement('iframe').prop({src:uConversion, scrolling:"no", frameborder:0,  allowTransparency:true}).css({border:'none', overflow:'hidden', width:'292px', height:'62px', display:'none'});
    elBody.myAppend(iframeConversion);

    setMess('',null,true);  
  }
  el.setUp=function(){
    inpTel.value=''; inpTel.focus();
    var nameT=isSet(sessionLoginIdP)?sessionLoginIdP.nameIP:'';
    inpName.value=nameT;
    cbIdIPImage.prop('checked', true);
    oB.Prop.boWebPushOK.setInp.call(spanBoWebPushOK);
    return true;
  }
  el.openFunc=function(){   el.openPop(); el.setUp(); }
 
  el.createDivs=function(){
    spanBoWebPushOK=oB.Prop.boWebPushOK.crInp('intro');
    divBoWebPushOK.myAppend("Enable Push Messages*: ", spanBoWebPushOK);
  }
  popUpExtend(el);  
  el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em', 'text-align':'left', 'width':'90%'}); 

  
  var helpPopup=createElement('div').myText('You may want to use a separate phone if you use this service often.');
  var imgH=imgHelp.cloneNode().css({'margin-left':'1em'});   popupHover(imgH,helpPopup);
         
  var head=createElement('h3').myText(langHtml['introHead'+charRoleUC]);
  //var pBread=createElement('p').myText("These data are shown to everyone. You may want to use a separate phone if you use this service often.");
  var pBread=createElement('h4').myText("Choose how you want to appear...");
  var pBread2=createElement('h4').myText("...and how you want to be contacted.");  // You may want to use a separate phone if you use this service often.
  var inpName=createElement('input').prop('type','text').css({width:'70%', 'box-sizing':'border-box'});
  var divName=createElement('p'); divName.myAppend('Name', ': ',inpName);
  
  var cbIdIPImage=createElement('input').prop({"type":"checkbox"});
  var divIdIPImage=createElement('p'); divIdIPImage.myAppend('Use image from ID provider', ': ',cbIdIPImage);
  
  //var butToggle=createElement('button').myText('boPushToggle').on('click', function(){this.disabled=true; myWebPush.togglePushNotifications();} );
  
  var spanBoWebPushOK, divBoWebPushOK=createElement('div');
  divBoWebPushOK.toggle(boEnablePushNotification);
  
  var inpTel=createElement('input').prop('type','tel').css({width:'70%', 'box-sizing':'border-box'});
  var divTel=createElement('p'); divTel.myAppend(langHtml.Tel, '*: ',inpTel);
  
  var inpEmail=createElement('input').prop('type','email').css({width:'70%', 'box-sizing':'border-box'});
  var divEmail=createElement('p'); divEmail.myAppend(langHtml.Email, '*: ',inpEmail);
  var strTmp=boEnablePushNotification?"*At least one of these must be enabled/supplied.":"*At least one of these must be supplied.";
  var pBread3=createElement('p').myText(strTmp).css({'font-size':'78%'});
  //divName.add(divTel).add(divIdIPImage).css({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});
  //[divName, divTel, divIdIPImage].cssChildren({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});
  [divName, divIdIPImage, divTel, divEmail].forEach((ele)=>ele.css({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'}));
  //cssChildren([divName, divTel, divIdIPImage], {display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});

  var saveButton=createElement('button').myText(langHtml.Continue).on('click', save).css({display:'block', 'margin':'2em auto 1em'});
  el.myAppend(head, pBread, divName, divIdIPImage, pBread2, divBoWebPushOK, divTel, divEmail, pBread3, saveButton).css({padding:'0.5em'}); //   , divEmail

  return el;
}







/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Complainer views
 *
 *  Summary:
 *  viewComplaintCommentPop   // Popup where a complainer can write a complaint
 *  viewComplaintAnswerPop    // Popup where a complainee can answer a complaint
 *  viewComplaintCommentButt  // Opens viewComplaintCommentPop, placed in viewComplainee
 *  viewComplaintAnswerButt   // Opens viewComplaintAnswerPop, placed in viewComplainee
 *  viewComplainee         // List of complaints on a certain complainee
 *  viewComplainer         // List of complaints from a certain complainer
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var viewComplaintCommentPopCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'complaintCommentPop';}
  el.openFunc=function(idComplaineeT){
    idComplainee=idComplaineeT; spanIdComplainee.myText(idComplaineeT);

    if(isSet(sessionLoginIdP) || typeof userInfoFrDB.user=='object'){} else {setMess('not logged in', 5); return;}
    var vec=[['complaintOneGet', {idComplainee:idComplainee}, complaintCommentOneGet]];   majax(vec);
    el.setVis();
    comment.focus();
  };
  el.setVis=function(){
    el.show();
    return true;
  }
  el.closeFunc=function(){    historyBack();    }
  var sendFunc=function() {
    var o1={idComplainee:idComplainee,comment:comment.value.trim()};
    var vec=[['complaintUpdateComment',o1], ['getComplaintsOnComplainee', viewComplainee.getLoadArg(), viewComplainee.getComplaintsOnComplaineeRet], ['setupById', {}]];   majax(vec);
    historyBack();
  }
  var complaintCommentOneGet=function(data){
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; comment.value=tmp;
    var tmp=row.answer;   if(typeof tmp==="undefined") tmp='';    answer.myText(tmp);  answerHead.toggle(tmp && tmp.length);
  };
  //el.css({'max-width':'16em', padding: '1em'});

  var idComplainee, spanIdComplainee=createElement('span');

  var commentHead=createElement('div').myText(langHtml.Complaint+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var comment=createElement('textarea').css({display:'block',margin:'0em 0em 0.7em'}).on('keypress', function(e){ if(e.which==13) {sendFunc();return false;}} );
  var save=createElement('button').myText(langHtml.Save).on('click', function(){sendFunc();});
  var del=createElement('button').myText(langHtml.vote.deleteComplaint).on('click', function(){comment.value=''; sendFunc();});
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', historyBack);
  var butts=createFragment(save, del, cancel).cssChildren({margin:'0.5em 0'});
  var answerHead=createElement('div').myText(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'}); answerHead.hide();
  var answer=createElement('div');

  el.css({'text-align':'left'});

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(commentHead,comment,butts,answerHead,answer);
  centerDiv.addClass("Center").css({padding: '1em'}); // 'width':'20em', height:'22em', 
  el.addClass("Center-Container").myAppend(centerDiv,blanket); //

  return el;
}


var viewComplaintAnswerPopCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'complaintAnswerPop';}
  el.openFunc=function(idT){
    idComplainer=idT;  spanIdComplainer.myText(idT);
    var o1={idComplainer:idComplainer}, vec=[['complaintOneGet',o1,complaintAnswerOneGet]];   majax(vec);
    answer.focus();
    doHistPush({view:viewComplaintAnswerPop});
    el.setVis();
  };
  el.setVis=function(){
    el.show();
    return true;
  }
  el.closeFunc=function(){    historyBack();    }
  var sendFunc=function() {
    var o1={idComplainer:idComplainer,answer:answer.value.trim()};
    var vecG; 
    if(viewComplainee.css('display')!='none') { vecG=['getComplaintsOnComplainee', viewComplainee.getLoadArg(), viewComplainee.getComplaintsOnComplaineeRet];  }
    else { vecG=['getComplaintsFromComplainer', viewComplainer.getLoadArg(), viewComplainer.getComplaintsFromComplainerRet];   }
    var vec=[['complaintUpdateAnswer',o1],vecG];   majax(vec);
    historyBack();
  }

  var complaintAnswerOneGet=function(data){
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; comment.myText(tmp);
    var tmp=row.answer;   if(typeof tmp==="undefined")  tmp=''; answer.value=tmp;
  };
  //el.css({'max-width':'16em', padding: '1em'});

  var idComplainer, spanIdComplainer=createElement('span');

  var commentHead=createElement('div').myText(langHtml.Complaint+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var comment=createElement('div');
  var answerHead=createElement('div').myText(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var answer=createElement('textarea').css({display:'block',margin:'0em 0em 0.7em'}).on('keypress', function(e){ if(e.which==13) {sendFunc();return false;}} );
  var save=createElement('button').myText(langHtml.Save).on('click', function(){sendFunc();});
  var del=createElement('button').myText(langHtml.vote.deleteAnswer).on('click', function(){answer.value=''; sendFunc();});
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', historyBack);
  var butts=createFragment(save, del, cancel).cssChildren({margin:'0.5em 0'});

  el.css({'text-align':'left'});

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(commentHead,comment,answerHead,answer,butts);
  centerDiv.addClass("Center").css({padding: '1em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket);

  return el;
}
// Note! your device does not support "push notifications", so make sure you have email / phone number provided.
// Note! you don't have "push notifications" enabled, so make sure you have email / phone number provided.

var viewComplaineeCreator=function(){    // Complaints on a certain complainee
  var el=createElement('div');
  el.toString=function(){return 'complainee';}
  el.setUp=function(oRoleT, rowComplainee){
    //var id=rMTab.idUser;
    oRole=oRoleT; el.indRole=oRole.ind;
    //var iMTab=viewTable.ElRole[oRole.ind].getMTabInd(id);
    //rowComplainee=oRole.MTab[iMTab];
    var iMTab=oRole.MTab.indexOf(rowComplainee), boMTab=iMTab!=-1;
    el.idComplainee=rowComplainee.idUser;
    nameSpan.myText(rowComplainee.displayName);

    var strTmp; //var IPTmp=enumIP[Number(rowComplainee.IP)];
    strTmp=calcImageUrl(rowComplainee);
    imgComplainee.prop({src:strTmp});
    if(boMTab) ListCtrlDiv[oRole.ind].mySet(iMTab);
    el.listCtrlDivW.toggle(boMTab);
    spanRole.myText(langHtml[ucfirst(oRole.strRole)]);
    span.myText('Complaints on a user ('+langHtml[oRole.strRole]+')').css({background:oRole.strColor}); // divFoot label
  }
  el.getLoadArg=function(){ return {offset:offset, rowCount:rowCount, idComplainee:el.idComplainee};   }
  el.load=function(){
    setMess('',null,true);  majax([['getComplaintsOnComplainee', el.getLoadArg(), el.getComplaintsOnComplaineeRet]]);
    el.boLoaded=1;
  }
  var makeImgClickFun=function(objArg){return function(){
    viewComplainer.setUp(objArg);
    viewComplainer.load();
    viewComplainer.setVis();
    doHistPush({view:viewComplainer});
  }}
  var ansButClick=function(){
    var idComplainer=this.closest('tr').idComplainer;
    viewComplaintAnswerPop.openFunc(idComplainer);
  }
  el.getComplaintsOnComplaineeRet=function(data){
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);

    tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var idComplainerTmp=tab[i].idComplainer;
      var image=tab[i].image;
      var strTmp=image || uUserImage+idComplainerTmp;
      var img=createElement('img').prop({src:strTmp}).css({'float':'left', width:"50px", height:"50px", background:"eee"});
      
      img.on('click', makeImgClickFun(tab[i]));

      var d=(new Date(tab[i].tCreated*1000)).toLocaleDateString(),   tCreated=createElement('p').myAppend(d).css({'font-weight':'bold'});
      var comm=createElement('p').myText(tab[i].comment);

      var strAns=tab[i].answer, ans='';
      if(strAns) {
        var ansLab=createElement('p').myText(langHtml.vote.answer+':').css({'font-weight':'bold'});
        ans=createElement('p').myAppend(ansLab,strAns).css({background:'#ff3',overflow:'hidden'});
      }

      var butAns=''
      if(userInfoFrDB.user && el.idComplainee==userInfoFrDB.user.idUser){
        var idR=tab[i].idComplainer;
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        butAns=createElement('button').myText(strtmp).css({'float':'right'}).on('click', ansButClick);
      }

      var td=createElement('td').myAppend(img,tCreated,comm,ans,butAns);
      if(strAns) ans.myAppend(butAns);
      var row=createElement('tr').myAppend(td); row.idComplainer=idR;  tBody.myAppend(row);
    }


    if(nTot>offset+tab.length) butNext.prop({disabled:false}); else butNext.prop({disabled:1});
    if(offset>0) butPrev.prop({disabled:false}); else butPrev.prop({disabled:1});
    spanOffsetInfo.myText('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }
  var complaintCommentButtClick=function(){
    var flow=(function*(){
      if(isEmpty(sessionLoginIdP) && typeof userInfoFrDB.user!='object'){
        var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
        var oT={IP:strIPPrim, fun:'complainerFun', caller:'index', code:code};
        var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(vec);   yield;
      }
      doHistPush({view:viewComplaintCommentPop});   viewComplaintCommentPop.openFunc(viewComplainee.idComplainee);
    })(); flow.next();
  }
  
  var oRole;
  el.listCtrlDivW=createElement('span').css({'float':'right'});
  
  var complaintCommentButt=createElement('button').myText(langHtml.vote.writeComment+' ('+langHtml.IdProviderNeeded+')').css({'margin-right':'1em'}).on('click', complaintCommentButtClick);
  var topDiv=createElement('div').myAppend(complaintCommentButt, el.listCtrlDivW).css({'margin-top':'1em',overflow:'hidden'});
  
  var offset=0,rowCount=20;
  el.boLoaded=0; //el.idComplainee;
  var tab=[], imgComplainee=createElement('img').css({'vertical-align':'middle'}), nameSpan=createElement('span'), spanRole=createElement('span');
  var complaineeInfo=createElement('div').myAppend(spanRole,': ',imgComplainee,' ',nameSpan).css({'margin':'0.5em',display:'inline-block', 'float':'right'}); //,'float':'right'
  var bub=createElement('div').myText(langHtml.writeComplaintPopup);
  var imgH=imgHelp.cloneNode();  popupHover(imgH,bub);

  var tBody=createElement('tbody'),   table=createElement('table').myAppend(tBody).css({'width':'100%'});//.addClass('complaintTab');

  var butPrev=createElement('button').myText('Prev page').on('click', function(){ offset-=rowCount; offset=offset>=0?offset:0; el.load();});
  var butNext=createElement('button').myText('Next page').on('click', function(){ offset+=rowCount; el.load();});
  var spanOffsetInfo=createElement('span').css({'white-space':'nowrap'});
  var divCont=createElement('div').addClass('contDiv').myAppend(topDiv, complaineeInfo, table, butPrev, butNext, spanOffsetInfo);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', historyBack);
  var span=createElement('span').myText('Complaints on a user').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var viewComplainerCreator=function(){  // Complaints from a certain Complainer
  var el=createElement('div');
  el.toString=function(){return 'complainer';}
  el.setUp=function(objArg){
    var {idComplainer:idTmp, image, displayName}=objArg;
    idComplainer=idTmp;
    var strTmp=image || uUserImage+idComplainer;
    imgComplainer.prop({src:strTmp}); spanName.myText(displayName);
  }
  el.getLoadArg=function(){ return {offset:offset,rowCount:rowCount,idComplainer:idComplainer}; }
  el.load=function(){
    setMess('',null,true); majax([['getComplaintsFromComplainer', el.getLoadArg(), el.getComplaintsFromComplainerRet]]);
    el.boLoaded=1;
  }
  var ansButClick=function(e){
    var idComplainer=this.closest('tr').idComplainer;
    viewComplaintAnswerPop.openFunc(idComplainer);
  }
  el.getComplaintsFromComplainerRet=function(data){
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    //tab.length=0; tmp=data.tab;  if(typeof tmp !='undefined') tab.push.apply(tab,tmp);

    tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var strTmp=calcImageUrl({idUser:tab[i].idUser, boImgOwn:tab[i].boImgOwn, imTag:tab[i].imTag, image:tab[i].image}); //
      //var strTmp=tab[i].image;

      var img=createElement('img').prop({src:strTmp}).css({'float':'right','border-left':'solid #ff3 15px'});

      var d=(new Date(tab[i].tCreated*1000)).toLocaleDateString(), tCreated=createElement('p').myAppend(d).css({'font-weight':'bold'});
      var comm=createElement('p').myText(tab[i].comment);

      var strAns=tab[i].answer, ans='';
      if(strAns) {
        var ansLab=createElement('p').myText(langHtml.vote.answer+':').css({'font-weight':'bold'});
        ans=createElement('p').myAppend(ansLab,strAns).css({background:'#ff3',overflow:'hidden'});
      }else ans='';

      var butAns=''
      if(userInfoFrDB.user && tab[i].idUser==userInfoFrDB.user.idUser){
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        butAns=createElement('button').myText(strtmp).css({'float':'right'}).on('click', ansButClick);
      }

      var td=createElement('td').myAppend(img,tCreated,comm,ans,butAns);
      if(strAns) ans.prepend(img,butAns);
      var row=createElement('tr').myAppend(td); row.idComplainer=idComplainer;    tBody.myAppend(row);
    }

    if(nTot>offset+tab.length) butNext.prop({disabled:false}); else butNext.prop({disabled:1});
    if(offset>0) butPrev.prop({disabled:false}); else butPrev.prop({disabled:1});
    spanOffsetInfo.myText('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }

  var offset=0,rowCount=20;
  el.boLoaded=0;
  var idComplainer, tab=[], imgComplainer=createElement('img').css({'vertical-align':'middle', 'margin-top':'1em'}), spanName=createElement('span');
  var complainerInfo=createElement('div').myAppend(langHtml.Complainer,': ',imgComplainer, spanName);

  var tBody=createElement('tbody'),   table=createElement('table').myAppend(tBody).css({'width':'100%'});//.addClass('complaintTab');

  var butPrev=createElement('button').myText('Prev page').on('click', function(){ offset-=rowCount; offset=offset>=0?offset:0; el.load();});
  var butNext=createElement('button').myText('Next page').on('click', function(){ offset+=rowCount; el.load();});
  var spanOffsetInfo=createElement('span').css({'white-space':'nowrap'});
  var divCont=createElement('div').addClass('contDiv').myAppend(complainerInfo, table, butPrev, butNext, spanOffsetInfo);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', historyBack);
  var span=createElement('span').myText('Complaints from complainer').addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Info view
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var mapThumbCreator=function(){  // Little map
  var el=createElement('div');
  el.updateMapThumb=function(oRole,iRow){
    var canvas=mapThumb,  ctx = canvas.getContext("2d");

    var zoomDiff=3, zoomDiffFac=Math.pow(2,zoomDiff),  Div=zoomDiffFac;
  
    var {pC:pMerCent, zoom, VPSize}=mapDiv.getMapStatus();
    var zoomFac=Math.pow(2,zoom),  thumbFac=zoomFac/Div,  widthBox=VPSize[0]/Div,  heightBox=VPSize[1]/Div;

    canvas.width=widthBox;   canvas.height=heightBox;

    //var iMTab=viewTable.ElRole[oRole.ind].tBody.children('tr:nth-of-type('+(iRow+1)+')').data('iMTab');
    var iMTab=viewTable.ElRole[oRole.ind].tBody.querySelector('tr:nth-of-type('+(iRow+1)+')').iMTab;

    arrInd.length=0; for(var i=0;i<oRole.nMTab;i++) arrInd[i]=i;  arrValRemove(arrInd,iMTab);   arrInd.push(iMTab);  // Put iMTab last

    var dotSizeH=2;
    for(var i=0;i<arrInd.length;i++){

      var itmp=arrInd[i];
      //if(i==oRole.nMTab) itmp=iRow; else itmp=i;
      var cx=oRole.MTab[itmp].x-pMerCent.x, cy=oRole.MTab[itmp].y-pMerCent.y;
      cx=cx*thumbFac+widthBox/2;cy=cy*thumbFac+heightBox/2;
      var tmp=1; if(itmp==iMTab) tmp=dotSizeH;
      ctx.beginPath(); //so start going clockwise from upper left corner
      ctx.moveTo(cx-tmp,cy-tmp);
      ctx.lineTo(cx+tmp,cy-tmp);
      ctx.lineTo(cx+tmp,cy+tmp);
      ctx.lineTo(cx-tmp,cy+tmp);
      ctx.closePath();
      var col='black'; if(itmp==iMTab) col='red';
      ctx.fillStyle=col;  ctx.fill();
    }

    el.css({width:widthBox+'px',height:heightBox+'px'});

    var zoomThumb=zoom-zoomDiff+1, zoomThumbFac=Math.pow(2,zoomThumb);
    var pixXRC=pMerCent.x*zoomThumbFac,   pixYRC=pMerCent.y*zoomThumbFac;  // tileXRC=pixXRC*256,tileYRC=pixYRC*256;
    var pixXR=[pixXRC-widthBox/2*2,pixXRC+widthBox/2*2,pixXRC+widthBox/2*2,pixXRC-widthBox/2*2];
    var pixYR=[pixYRC-heightBox/2*2,pixYRC-heightBox/2*2,pixYRC+heightBox/2*2,pixYRC+heightBox/2*2];

    var arrtmp=[], tileXRZ, tileYRZ
    for(var i=0;i<4;i++){
      var tileXR=pixXR[i]/256, tileYR=pixYR[i]/256,   tileX=Math.floor(tileXR), tileY=Math.floor(tileYR);
      if(i==0) { tileXRZ=tileXR; tileYRZ=tileYR;}
      var lef=-(tileXRZ-tileX)*128, to=-(tileYRZ-tileY)*128;
      var uTmp=uMapSourceDir+'/'+zoomThumb+'/'+tileX+'/'+tileY+'.png';
      //if(zoomThumb<0) {uTmp=window['uMapm'+-Number(zoomThumb)]; }
      if(zoomThumb<0) {uTmp=uImageFolder+'/mapm'+(-Number(zoomThumb))+'.png'; }
      arrImage[i].prop({src:uTmp}).css({left:lef+'px',top:to+'px'});
      var tmpName=lef+' '+to;
      if(arrtmp.indexOf(tmpName)==-1) {arrImage[i].show(); arrtmp.push(tmpName);} else arrImage[i].hide();
    }
  }

  var arrInd=[];
  var mapThumb=createElement('canvas').css({position:'absolute'});
  var arrImage=Array(4);
  for(var i=0;i<arrImage.length;i++){var imgT=createElement('img').css({position:'absolute',width:'128px',height:'128px',opacity:0.9}); arrImage[i]=imgT;  }
  el.append(...arrImage); el.append(mapThumb);
  el.css({display:'inline-block',position: 'relative',overflow:'hidden'});
  return el;
}


var updateTableThumb=function(el, iRow, nRow){  // Little symbol next to little map showing on which row you are.
  var canvas=el,  ctx = canvas.getContext("2d");
  //var heightRow=2; if(nRow<4) heightRow=5; if(nRow<4) heightRow=10;
  var heightRow=2; if(nRow*2<15) heightRow=Math.round(15/nRow); if(nRow==1) heightRow=10;
  var widthBox=25;
  canvas.width=widthBox;   canvas.height=nRow*heightRow-1;
  for(var i=0;i<nRow;i++){
    ctx.beginPath();
    ctx.moveTo(0, i*heightRow);
    ctx.lineTo(widthBox,i*heightRow);
    ctx.lineTo(widthBox, (i+1)*heightRow);
    ctx.lineTo(0, (i+1)*heightRow);
    ctx.closePath();
    var col='white'; //if(i%2) col='lightgrey';
    if(i==iRow) col='red';
    ctx.fillStyle=col;  ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, i*heightRow-0.5);
    ctx.lineTo(widthBox,i*heightRow-0.5);
    ctx.strokeStyle = "grey";   ctx.stroke();
  }
}


var listCtrlCreator=function(oRole){ // The little map and up/down arrows
  var el=createElement('div');
  el.mySet=function(iMTab){
    arrowDiv.toggle(oRole.nMTab>1);
    el.tr=viewTable.ElRole[oRole.ind].getRow(iMTab);
    var iRow=iMTab;

    updateTableThumb(tableThumb, iRow, oRole.nMTab);
    mapThumbDiv.updateMapThumb(oRole, iRow);
  }
  var mapThumbDiv=mapThumbCreator().css({'display':'inline-block','margin-right':'1em',border:'1px solid grey','vertical-align':'top'});

  var tableThumb=createElement('canvas').css({'margin-right':'1.5em',border:'1px solid grey','vertical-align':'top'}); //.on('click', function(){tableButtonClick();});

  var tmpf=function(iDiff){
    var trCur=el.tr, trt;
    if(iDiff==1) {
      trt=trCur.nextElementSibling;
      if(trt===null || trt.style.display=='none') trt=trCur.parentNode.firstElementChild;
    }
    else {
      trt=trCur.previousElementSibling;
      if(trt===null) trt=trCur.parentNode.querySelector('tr:nth-of-type('+oRole.nMTab+')');
    }
    var iTmp=trt.iMTab;
    ViewInfo[oRole.ind].setContainers(iTmp);
    //if(viewComplainee.is(':visible')){viewComplainee.setUp(oRole, oRole.MTab[iTmp].idUser); viewComplainee.load(); }
    if(viewComplainee.style.display!='none'){viewComplainee.setUp(oRole, oRole.MTab[iTmp]); viewComplainee.load(); }
  }
  var buttonPrev=createElement('button').myText('▲').css({display:'block','margin':'0em'}).on('click', function(){tmpf(-1);})
  var buttonNext=createElement('button').myText('▼').css({display:'block','margin':'1.5em 0em 0em'}).on('click', function(){tmpf(1);})
  var arrowSpan=createElement('span').css({display:'inline-block'}); arrowSpan.append(buttonPrev,buttonNext);
  var arrowDiv=createElement('div').css({display:'inline-block','margin':'0em 1.5em 0em 0em'}); arrowDiv.append(tableThumb,arrowSpan);
  el.append(mapThumbDiv,arrowDiv);
  return el;
}


var viewInfoCreator=function(oRole){
  var el=createElement('div');
  var {strRole, Prop, charRoleUC}=oRole, {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  el.indRole=oRole.ind;
  el.toString=function(){return 'info'+charRoleUC;}
  el.setContainers=function(arg){ // arg is iMTab or rowMTab
    var boMTab=typeof arg=='number';
    if(boMTab) { var iMTab=arg, rowMTab=oRole.MTab[iMTab]; } else rowMTab=arg;
    containers.forEach(function(ele){
      var strName=ele.attr('name'), prop=(strName in Prop)?Prop[strName]:{};
      var objT={strName:strName, iRole:oRole.ind}; extend(ele,objT);
      var tmp=''; if('setInfo' in prop) tmp=prop.setInfo.call(ele, rowMTab);  else tmp=rowMTab[strName];
      if(typeof tmp!='undefined') ele.myText(tmp);
    });
    el.boLoaded=1;
    if(boMTab) ListCtrlDiv[oRole.ind].mySet(iMTab);
    menuDiv.toggle(boMTab);
  }
  el.createContainers=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i], prop=(strName in Prop)?Prop[strName]:{};
      var imgH=''; if(strName in oRole.helpBub && Number(Prop[strName].b[oRole.bFlip.help])) { imgH=imgHelp.cloneNode().css({margin:'0em 0.3em 0em 0.4em'});   popupHover(imgH,oRole.helpBub[strName]); }

      var strDisp,strMargRight,strWW; if(Number(Prop[strName].b[oRole.bFlip.block])) {strDisp='block'; strMargRight='0em'; strWW='';} else {strDisp='inline'; strMargRight='.2em'; strWW='nowrap';}

      var strLabel=''; if(Number(Prop[strName].b[oRole.bFlip.label])) { strLabel=calcLabel(langHtml.prop, strName)+': ';      }

      var spanC=createElement('span').myText(' ').css({'font-weight':'bold',margin:'0 0.2em 0 0em'}).prop({strName:strName, iRole:oRole.ind}).attr({name:strName});
      if('crInfo' in prop) prop.crInfo.call(spanC);
      var divLCH=createElement('div').css({display:strDisp,'margin-right':strMargRight,'white-space':strWW}).attr({name:strName}).myAppend(strLabel,spanC,imgH)
      el.divCont.myAppend(divLCH,' ');
    }
    containers=el.divCont.querySelectorAll('div>span');

    for(var i=0;i<StrGroup.length;i++){
      var h=createElement('span').css({'font-size':'120%','font-weight':'bold', display:'block'}).myAppend(langHtml[StrGroup[i]]+':');
      var tmp=el.divCont.querySelector('div[name='+StrGroupFirst[i]+']'); tmp.myBefore(createElement('hr')).myBefore(h); 
    }
  }
  el.divCont=createElement('div').addClass('contDiv');
  var containers;

  el.boLoaded=0;

  el.listCtrlDivW=createElement('div');
  var menuDiv=createElement('div').css({flex:"0 0 auto", 'margin-top':'1em','padding':'0'}).myAppend(el.listCtrlDivW);
  
      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).css({'margin-left':'0.8em','margin-right':'1em'}).addClass('fixWidth').on('click', historyBack)
  var span=createElement('span').css({background:oRole.strColor}).addClass('footDivLabel').myAppend(ucfirst(langHtml[strRole])+' info');
  var divFoot=createElement('div').myAppend(buttonBack,span).addClass('footDiv');
  
  el.myAppend(menuDiv,el.divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}




/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Map stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


//
// Naming conventions:
// Prefixes:
//   Prefixes to zoom variables: (hopefully I'm consistent)
// zoom, zoomFac or sometimes zFac: zoomFactor (integer) of a world coordinate (see below)
// zoomR: same as zoom but real (that is with decimals)
// zoomLev=log2(zoomFac): 2-logaritm of zoomFactor. Function to convert back:  zoomFac=Math.pow(2,zoomLev)
// z: "relative zoom" to the last time the tiles where laid out. Typically zoomR will be equal to z*zoom.
//
//   Coordinate-prefixes:
// frame: coordinate from upper left corner of el (dom-tree resolution).
// pWC={x:x,y:y}  (point with world coordinate):  where x resp y ∈ [0,256) regardles of zoom
// pix={x:x,y:y}: (scaled world coordinate) pix.x=pWC.x*zFac (same for y) (for whatever zFac that is currently used)
// brd: same as pix although with origo at the board origo (upper left coorner of the board)
//


// State variables:
//   pWCC keeps the state (must be set) before laying out the tiles (calling setTile)
//   zoomFacW: zoom factor written (when the tiles where placed)
//   zCur, leftCur, topCur:  Quick access of the css "transform" parameter of elBoard
//
//   TouO: array of touches (only used on touch deviced)
//   xavgL, yavgL: (only used with "mouse"-panning)
//   pixBoardX, pixBoardY: (I forgotten what these are) 



//pixMult=function(pixT,fac){pixT.x*=fac; pixT.y*=fac;}
var boDbgCheckered=0;
var pixMult=function(pixT,fac){return {x:pixT.x*fac, y:pixT.y*fac};}
var mapDivCreator=function(){
  var el=createElement('div');
  var leftCurStart, topCurStart; // If leftCur resp topCur has changed relative to these at gesture end, then the 'idle'-event is fired.
  
  //
  // Touch events
  //

  var handleStart=function(evt) {
    evt.stopPropagation();
    //evt.preventDefault(); // Allow default, to allow click-event
    var Tou = evt.touches;
    storeTouches(Tou);
    if(Tou.length==1) {leftCurStart=leftCur; topCurStart=topCur;}
  }

  var TouO=[];
  var storeTouches=function(Tou){
    TouO=[];
    for(var i=0; i<Tou.length; i++) { var t=Tou[i]; TouO[i]={pageX:t.pageX, pageY:t.pageY, identifier:t.identifier};}
  }
  var getStoredTouch=function(identifier) {
    for (var i=0; i<TouO.length; i++) {
      if(TouO[i].identifier == identifier) { return TouO[i]; }
    }
    return null;
  }

  var calcD=function(tA,tB){  var xD=tB.pageX-tA.pageX, yD=tB.pageY-tA.pageY;  return Math.sqrt(xD*xD +yD*yD);  }
  var calcTwoTouchCenterNDist=function(Tou){
    var tA=Tou[0], tB=Tou[1], xA=tA.pageX, xB=tB.pageX, xavg=(xA+xB)/2,     yA=tA.pageY, yB=tB.pageY, yavg=(yA+yB)/2;
    var d=calcD(tA,tB);
    return {x:xavg, y:yavg, d:d};
  }

  var zCur,leftCur,topCur;  // Quick access of the css "transform" parameter of elBoard
  var panNZoom=function(Tou,boEnd){
    var TouL=[];    for(var i=0;i<Tou.length;i++){    var touT=getStoredTouch(Tou[i].identifier); if(touT) TouL.push(touT);      }
    var mode=TouL.length;
    if(mode==1){
      var xavgL=TouL[0].pageX, yavgL=TouL[0].pageY;
      var xavg=Tou[0].pageX, yavg=Tou[0].pageY;
      var dXScreen=xavg-xavgL;    leftCur+=dXScreen;
      var dYScreen=yavg-yavgL;    topCur+=dYScreen;
      boundTransformVariables();
      elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    }else if(mode==2){

      var doub=calcTwoTouchCenterNDist(Tou);
      var doubL=calcTwoTouchCenterNDist(TouL);

      var rat=doub.d/doubL.d;
      var zL=zCur;
      zCur=rat*zL;
      var {left:leftContainer, top:topContainer}=findPos(el);
      //var leftContainer=el.offset().left,  topContainer=el.offset().top;
      var widthBox=el.clientWidth, heightBox=el.clientHeight;


      var brdTilePiv=calcBrdTilePiv(doubL.x-leftContainer, doubL.y-topContainer, zL, leftCur, topCur);
      [leftCur,topCur]=calcLeftTop(doub.x-leftContainer, doub.y-topContainer, zCur, brdTilePiv);

 
      boundTransformVariables();
      elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
      elDivPivotDbg.css({left:brdTilePiv.x+'px',top:brdTilePiv.y+'px'}); // little black square
    }
    else if(mode==0){ // boEnd

      var zL=zCur;
      var zCurLev=round(log2(zCur)); zCur=Math.pow(2,zCurLev);
      var {left:leftContainer, top:topContainer}=findPos(el);
      //var leftContainer=el.offset().left,  topContainer=el.offset().top;
      var widthBox=el.clientWidth, heightBox=el.clientHeight;

      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zL, leftCur, topCur);
      [leftCur,topCur]=calcLeftTop(widthBox/2, heightBox/2, zCur, brdTilePiv);

      boundTransformVariables();
      elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});

        // Converting to pWCC
      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
      var pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};
      pWCC=pixMult(pixC,1/(zCur*zoomFacW));

      var zoomFacRTmp=zCur*zoomFacW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
      var boRefresh=el.setTile(zoomLevT);
      if(leftCurStart!=leftCur || topCurStart!=topCur) {  el.dispatchEvent(new Event('idle'));  }
    }
  }
  var elDivPivotDbg=createElement('div'); elDivPivotDbg.css({position:'absolute',background:'black',width:'5px',height:'5px','z-index':5});
  var pixBoardX, pixBoardY

  var handleMove=function(evt) {
    evt.stopPropagation();
    evt.preventDefault(); // Prevent default, to prevent iOS-zoom
    var Tou=evt.touches;
    panNZoom(Tou,0);
    storeTouches(Tou);
  }
  var handleEnd=function(evt) {
    evt.stopPropagation();
    //evt.preventDefault(); // Allow default, to allow click-event 
    var Tou=evt.touches;
    panNZoom(Tou,1);
    storeTouches(Tou);
    //return false;
  }
  var handleCancel=function(evt) {
    evt.stopPropagation();
    //evt.preventDefault(); // Allow default, to allow click-event
    var Tou=evt.touches;
    panNZoom(Tou,1);
    storeTouches(Tou);
    strMess=' C'+Tou.length;
    setMess(strMess);
  }


  //////////////////////////////////////////////////////////////////////////

  //
  // Mouse events
  //
  
  var myMousewheel=function(e) {
    //var rat; if(boFF) rat=e.detail>=0?0.5:2; else  rat=e.originalEvent.wheelDelta>=0?2:0.5;
    var rat; if(boFF) rat=e.detail>=0?0.5:2; else  rat=e.wheelDelta>=0?2:0.5;
    var xavg=e.pageX, yavg=e.pageY;

    leftCurStart=leftCur; topCurStart=topCur;
    var zL=zCur;
    zCur=rat;
    var {left:leftContainer, top:topContainer}=findPos(el);
    //var leftContainer=el.offset().left,  topContainer=el.offset().top;
    var widthBox=el.clientWidth, heightBox=el.clientHeight;


    var brdTilePiv=calcBrdTilePiv(xavg-leftContainer, yavg-topContainer, zL, leftCur, topCur);
    [leftCur,topCur]=calcLeftTop(xavg-leftContainer, yavg-topContainer, zCur, brdTilePiv);

    boundTransformVariables();
    elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});

      // Converting to pWCC; (might seem unnecessary, in a future version the amount of statevariables might be reduced) See comment below on state variables
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    var pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};
    pWCC=pixMult(pixC,1/(zCur*zoomFacW));

    var zoomFacRTmp=zCur*zoomFacW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
    var boRefresh=el.setTile(zoomLevT);
    if(leftCurStart!=leftCur || topCurStart!=topCur) {  el.dispatchEvent(new Event('idle'));  }

  }
  var xavgL, yavgL;
  var panF=function(e){
    var xavg=e.pageX, yavg=e.pageY;
    var dXScreen=xavg-xavgL;    leftCur=leftCur+dXScreen;
    var dYScreen=yavg-yavgL;    topCur=topCur+dYScreen;
    boundTransformVariables();
    elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    
    if(boDbg) setMess('topCur: '+round(topCur-dYScreen)+', dYScreen: '+round(dYScreen)+', topCur: '+round(topCur));
    xavgL=xavg; yavgL=yavg;
  }
  var myMousedown=function(e){
    var e = e || window.event; if(e.which==3) return;
    xavgL=e.pageX; yavgL=e.pageY;
    document.on('mousemove',myMousemove); document.on('mouseup',myMouseup);
    elGlas.css({cursor:'move'});
    e.preventDefault();
    leftCurStart=leftCur;topCurStart=topCur;
  }
  var myMouseup=function(e){
    panF(e);
    document.off('mousemove',myMousemove); document.off('mouseup',myMouseup);
    elGlas.css({cursor:''});
    e.preventDefault();
    boundTransformVariables();
    elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    //pixC=calcPixC();
    pWCC=pixMult(calcPixC(),1/zoomFacW);
    //var zFac=round(zCur)*zoomFacW, zLev=log2(zFac);
    var zoomLevT=log2(zoomFacW);
    var boRefresh=el.setTile(zoomLevT);
    if(leftCurStart!=leftCur || topCurStart!=topCur) {  el.dispatchEvent(new Event('idle'));  }

  }
  var myMousemove=function(e){
    panF(e);
    e.preventDefault();
  };


  //
  // Handy functions
  //

  var calcBrdTilePiv=function(framePivX, framePivY, z, left, top){
    var brdTilePivX=framePivX/z  -left/z ;
    var brdTilePivY=framePivY/z  -top/z ;
    return {x:brdTilePivX,y:brdTilePivY};
  }

  var calcLeftTop=function(framePivX, framePivY, z, brdTilePiv){
    var left=framePivX  -brdTilePiv.x*z ;
    var top=framePivY  -brdTilePiv.y*z ;
    return [left,top];
  }


  var calcPixC=function(){
    var widthBox=el.clientWidth, heightBox=el.clientHeight;
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    var pixCN={x:pixBoardX+brdTilePiv.x, y:pixBoardY+brdTilePiv.y};
    return pixCN;
  }

  var boundTransformVariables=function(){ // Bounds zCur, leftCur and topCur (so that the world doesn't gets dragged out of frame or gets zoomed unnecessary small) (should perhaps be a property of elBoard)
    var zL=zCur;
    var zoomFac=zCur*zoomFacW;
    var widthBox=el.clientWidth, heightBox=el.clientHeight, minDim=Math.min(widthBox,heightBox);
    var zoomFacWorld=minDim/WCMAX;  // zoomFacWorld: The zoom factor that will make the whole world fit into el
    var zoomLevCenter=Math.floor(log2(zoomFacWorld)), zoomFacCenter=Math.pow(2,zoomLevCenter);  // Smallest allowed zoom; "The world" will be centered if below this level

    var brdTilePiv=calcBrdTilePiv(0, 0, zCur, leftCur, topCur);
    var pixFrameNorth=pixBoardY +brdTilePiv.y,   pixFrameSouth=pixFrameNorth+heightBox/zCur;

    //var brdTilePivY=-topCur/zCur ;
    //var pixFrameNorth=pixBoardY +brdTilePivY,   pixFrameSouth=pixFrameNorth+heightBox/zCur;

    var zCurN=zCur,leftCurN=leftCur,topCurN=topCur;
    var boBound=0;
    if(zoomFac<=zoomFacWorld) {
      if(zoomFac<=zoomFacCenter){
        zoomFac=zoomFacCenter; zCurN=zoomFac/zoomFacW;
      }
      boBound=1;

      leftCurN=-WCMID*zoomFac +pixBoardX*zCurN +widthBox/2;
      topCurN=-WCMID*zoomFac +pixBoardY*zCurN  +heightBox/2;
    }else {
      var boSpaceAbove=pixFrameNorth<0;
      var boSpaceBelow=pixFrameSouth>WCMAX*zoomFacW;
      if(boSpaceAbove) {
        boBound=1;

        topCurN=pixBoardY*zCur +(zCur-1)*heightBox/2;
        topCurN=pixBoardY*zCur;
      }
      else if(boSpaceBelow) {
        boBound=1;

        topCurN=-WCMAX*zoomFac +pixBoardY*zCur +heightBox  +(zCur-1)*heightBox/2;
        topCurN=-WCMAX*zoomFac +pixBoardY*zCur +heightBox;
      }
    }
    zCur=zCurN; leftCur=round(leftCurN); topCur=round(topCurN);
  }

  el.setTile=function(zoomLev){
    var [widthBox, heightBox]=el.getVPSize();

    var boRefresh=0;

    var zoomFac=Math.pow(2,zoomLev);
    var pixC=pixMult(pWCC,zoomFac);
    var pixFrameX=pixC.x-widthBox/2, iTileRFirst=pixFrameX/TILESIZE, iTileFirst=Math.floor(iTileRFirst);  leftCur=-(iTileRFirst-iTileFirst)*TILESIZE;
    var pixFrameY=pixC.y-heightBox/2, jTileRFirst=pixFrameY/TILESIZE, jTileFirst=Math.floor(jTileRFirst); topCur=-(jTileRFirst-jTileFirst)*TILESIZE;
    leftCur=round(leftCur); topCur=round(topCur);
    pixBoardX=pixFrameX+leftCur; pixBoardY=pixFrameY+topCur;
      var nTileX=Math.ceil(widthBox/TILESIZE)+1, nTileY=Math.ceil(heightBox/TILESIZE)+1;

    if(iTileFirst!=iTileFirstLast || jTileFirst!=jTileFirstLast || zoomLev!=zoomLevLast || drLev!=drLevLast){
      boRefresh=1; iTileFirstLast=iTileFirst; jTileFirstLast=jTileFirst; zoomLevLast=zoomLev; drLevLast=drLev;}
    zoomFacW=zoomFac;
    if(boRefresh){
      var zoomLevPlusDRLev=zoomLev+drLev;
      var elTileTmp=elBoard.childNodes;
      //elTileTmp.forEach(function(el){if(el.nodeName=='IMG'){ TileStack.push(el); el.remove();} });
      for(var i=elTileTmp.length-1;i>=0;i--){var elA=elTileTmp.item(i); if(elA.nodeName=='IMG'){ TileStack.push(elA); elA.src=''; elA.remove();} } 
      //TileStack.concat(elTileTmp);
      var iTileZ=iTileFirst, jTileZ=jTileFirst;
      for(var i=0;i<nTileX;i++){
        var iTile=iTileZ+i, left=i*TILESIZE;
        for(var j=0;j<nTileY;j++){
          var jTile=jTileZ+j, top=j*TILESIZE;
          [iTile]=normalizeAng(iTile, zoomFac/2*dr, zoomFac*dr);
          var boBlue=0, [,nCorrectionY]=normalizeAng(jTile, zoomFac/2*dr, zoomFac*dr);

          var wTmp;
          if(nCorrectionY<0) wTmp=''; //uImageFolder+'northPole.png';
          else if(nCorrectionY>0) wTmp='' //uImageFolder+'southPole.png';
          else {
            if(zoomLevPlusDRLev>=0) wTmp=uMapSourceDir+'/'+zoomLevPlusDRLev+'/'+iTile+'/'+jTile+'.png';
            else wTmp=uImageFolder+'mapm'+(-zoomLevPlusDRLev)+'.png';
            //else if(zoomLev==-1) wTmp='mapm1.png';
            //else if(zoomLev==-2) wTmp='mapm2.png';
            //else if(zoomLev==-3) wTmp='mapm3.png';
            if(boDbgCheckered) { 
              var byte0=zoomFac%8, byte1=zoomFac>>8; 
              var boIOddOpac=iTile%(2*byte1)>=byte1, boJOddOpac=jTile%(2*byte1)>=byte1, floatOpacity=0.7;  if(byte1 &&  (boIOddOpac+boJOddOpac)%2) floatOpacity=0.4; 
              wTmp='/lib/image/'+(zoomLevPlusDRLev%8)+'.png';
            }
          }
          var elTile; if(TileStack.length) elTile=TileStack.pop(); else { elTile=createElement('img').css({position:'absolute',opacity:0.7});  } //,border:'solid 1px grey'
          elTile.src=wTmp; elTile.css({left:left+'px',top:top+'px', 'transform-origin':'left top', transform:'scale('+1/dr+')'});
          if(boDbgCheckered) elTile.css({opacity:floatOpacity});
          elBoard.append(elTile);
        }
      }
      elBoard.append(elGlasBack, elGlas); // To place the elGlasBack and elGlas last in the elBoard
    }else{
    }
    zCur=1;
    elBoard.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    return boRefresh;
  }


  el.setMe=function(latlng, boAndCenter=false){
    if(window.boVideo) latlng=latlngDebug;
    el.latlngMe=latlng;
    el.pWCMe=merProj.fromLatLngToPoint(latlng);   if(boAndCenter) copySome(pWCC, el.pWCMe, ['x','y']);
  }
  el.setOpponent=function(data, url){
    var {objSender, iRole, message, tSent, latlngSender}=data;
    el.latlngOpponent=latlngSender;
    el.pWCOpponent=merProj.fromLatLngToPoint(latlngSender); el.elImgOpponent.prop({src:url, myData:data});
  }
  el.setCenter=function(latlng){ pWCC=merProj.fromLatLngToPoint(latlng); }
  el.getMapStatus=function(){
    //if(!el.storedPWCC || !el.storedZoom || !el.storedVPSize) el.storeVPSize();
    //return {pC:el.storedPWCC, zoom:el.storedZoom, VPSize:el.storedVPSize};
    if(!el.storedVPSize) el.storeVPSize();
    return {pC:pWCC, zoom:log2(zoomFacW), VPSize:el.storedVPSize};
  }
  el.getPWCC=function(){
    //if(!el.storedPWCC) el.storedPWCC=pWCC;    return el.storedPWCC;
    return pWCC;
  }
  el.storeVPSize=function(){    // Store values for times when the map is not visible.
    //el.storedPWCC=pWCC;
    //el.storedZoom=zoomFacW;
    el.storedVPSize=[Number(String(el.clientWidth)), Number(String(el.clientHeight))];
  }
  //el.set1=function(zoomLevel, latlngFirst){
    //el.setMe(latlngFirst, 1);
  //}
  el.getVPSize=function(){
    //if(el.is(':visible')) el.storedVPSize=[Number(String(el.clientWidth)), Number(String(el.clientHeight))];
    if(isVisible(el)) el.storedVPSize=[Number(String(el.clientWidth)), Number(String(el.clientHeight))];
    return el.storedVPSize;
  }
  
  
  //
  // Markers
  //

  var ArrMarkerT=function(oRole){
    var arr=[]; extend(arr,ArrMarkerT.tmpPrototype);
    arr.oRole=oRole;
    return arr;
  }
  ArrMarkerT.tmpPrototype={};
  ArrMarkerT.tmpPrototype.condAddMarker=function(){
    for(var i=this.length; i<this.oRole.nMTab;i++){
      var elMark=new MarkerT(this.oRole); elMark.dataInd=i;
      elMark.css({transform:'translate(-50%, -100%)', position:'absolute', 'z-index':1, position: 'absolute'}).on('click',MarkerT.tmpPrototype.funcInfoClick);
      if(!boTouch){
        elMark.on('mouseover',MarkerT.tmpPrototype.funcOver);
        elMark.on('mouseout',MarkerT.tmpPrototype.funcOut);
      }
      this.push(elMark);
      elGlas.append(elMark);
      var strColor=this.oRole.strColor, tmpBorder=this.oRole.ind?'blue':'red';
      var elDivUnCertain=createElement('div').css({width:'40px',height:'40px', border:'solid 1px '+tmpBorder, background:strColor, opacity:flUncertainOpacityOff, position:'absolute', transform:'translate(-50%, -50%)'});
      elMark.elDivUnCertain=elDivUnCertain;
      //arrDivUnCertain.push(elDivUnCertain);
      elGlasBack.append(elDivUnCertain);
    }
  }
  ArrMarkerT.tmpPrototype.setMarkers=function(){
    this.condAddMarker();
    for(var i=0;i<this.oRole.nMTab;i++){
      var elMark=this[i];
      elMark.makeOneRowIconObj(i);
      elMark.dataObjMarkerMultCache=null;
      //MarkerT.tmpPrototype.setImg.call(elMark);
      elMark.setImg();
      elMark.dataX=this.oRole.MTab[i].x; elMark.dataY=this.oRole.MTab[i].y; elMark.dataCoordinatePrecisionM=this.oRole.MTab[i].coordinatePrecisionM;
      elMark.style.display=''; 
      elMark.elDivUnCertain.style.display='';
      //arrDivUnCertain[i].style.display='';
    }
    for(var i=this.oRole.nMTab;i<this.length;i++){
      this[i].style.display='none';
      //arrDivUnCertain[i].style.display='none';
      this[i].elDivUnCertain.style.display='none';
    }
     
  }
  //el.setMarkers=function(){ el.arrMarkerB.setMarkers(); el.arrMarkerS.setMarkers();}
  //el.drawMarkers=function(){el.arrMarkerB.drawMarkers(); el.arrMarkerS.drawMarkers();}
  el.setMarkers=function(){  for(var i=0;i<ORole.length;i++) el.ArrMarker[i].setMarkers();  }
  el.drawMarkers=function(){  for(var i=0;i<ORole.length;i++) el.ArrMarker[i].drawMarkers();  }
  
  ArrMarkerT.tmpPrototype.hideMarkers=function(){
    for(var i=0;i<this.length;i++) {
      this[i].style.display='none';
      //arrDivUnCertain[i].style.display='none';
      this[i].elDivUnCertain.style.display='none';
    }
  }
  ArrMarkerT.tmpPrototype.drawMarkers=function(){
    for(var i=0;i<this.oRole.nMTab;i++){
      var elMark=this[i], x=elMark.dataX, y=elMark.dataY, left=x*zoomFacW-pixBoardX, top=y*zoomFacW-pixBoardY;
      elMark.css({left:left+'px',top:top+'px'});
      var resM=elMark.dataCoordinatePrecisionM;
      var lat=merProj.fromYToLat(y);
      var resWC=resM2resWC(resM,lat);
      var w=resWC*zoomFacW, h=resWC*zoomFacW;
      //arrDivUnCertain[i].css({left:left+'px', top:top+'px', width:w+'px', height:h+'px'});
      elMark.elDivUnCertain.css({left:left+'px', top:top+'px', width:w+'px', height:h+'px'});
    };
  }
  el.ArrMarker=[]; for(var i=0;i<ORole.length;i++) el.ArrMarker[i]=new ArrMarkerT(ORole[i]);
  //var arrDivUnCertain=[];
  
  
  var MarkerT=function(oRole){
    var elDiv=createElement('div'); elDiv.elImg=createElement('img');
    elDiv.append(elDiv.elImg);
    extend(elDiv, MarkerT.tmpPrototype);
    elDiv.oRole=oRole;
    elDiv.elImg.style['vertical-align']='bottom';
    return elDiv;
  }
  var flUncertainOpacityOff=0.2, flUncertainOpacityOn=0.4;
  MarkerT.tmpPrototype={};
  MarkerT.tmpPrototype.makeOneRowIconObj=function(i){
    var objTmp;
    if(i>=this.oRole.nMTab) objTmp=makeMarkerBubble({text:'  ', color:this.oRole.strColor});
    else{
      var strName=this.oRole.colOneMark, rowMTab=this.oRole.MTab[i];
      var tmp=rowMTab[strName], prop=(strName in this.oRole.Prop)?this.oRole.Prop[strName]:{};
      if('setMapF' in prop)  tmp=prop.setMapF.call({strName:strName, iRole:this.oRole.ind}, rowMTab);
      if(typeof tmp!='object'){
        if((typeof tmp=='string' && tmp.length==0) || tmp===null){tmp='  ';}
        objTmp=makeMarkerBubble({text:tmp, color:this.oRole.strColor});
      }else objTmp=tmp;
    }
    this.dataObjMarkerOne=objTmp;
  }
  MarkerT.tmpPrototype.arrFuncOverData=[]; // Just for reducing garbage
  MarkerT.tmpPrototype.makeMultiRowIconObj=function(i){
    if(i>=this.oRole.nMTab) {console.log('err');}
    var k=0;
    //for(var jSel in this.oRole.ColsShow){
    for(var j=0;j<this.oRole.ColsShow.length;j++){
      var strName=this.oRole.ColsShow[j], tmp, prop=(strName in this.oRole.Prop)?this.oRole.Prop[strName]:{};
      var rowMTab=this.oRole.MTab[i];
      if('setMapMF' in prop) {  var tmp=prop.setMapMF.call({strName:strName, iRole:this.oRole.ind}, rowMTab);  } else tmp=rowMTab[strName];
      if(typeof tmp=='string' || typeof tmp=='number') {
        this.arrFuncOverData[k]=calcLabel(langHtml.prop, strName)+': '+tmp; k++;
        //tmp=calcLabel(langHtml.prop, strName)+': '+tmp; 
        //this.arrFuncOverData[k]=tmp; k++;
      }
    }
    this.arrFuncOverData.length=k;
    var tmp=this.arrFuncOverData.join('\n');
    return makeMarkerBubble({text:tmp, color:this.oRole.strColor});
    //return makeMapMultBubble({arrObj:this.arrFuncOverData, color:this.oRole.strColor});
  }
  MarkerT.tmpPrototype.funcOver=function() {
    var elMark=this, i=elMark.dataInd;
    var obj=elMark.dataObjMarkerMultCache;
    if(!obj) {
      //obj=MarkerT.tmpPrototype.makeMultiRowIconObj.call(this,i);
      obj=elMark.makeMultiRowIconObj(i);
      elMark.dataObjMarkerMultCache=obj;
    }
    var xTrans=Math.round(obj.anchor.x), yTrans=obj.anchor.y, strTrans='-'+xTrans+'px, -'+yTrans+'px';
    elMark.elImg.src=obj.url; elMark.css({width:'', height:'', background:'', transform:'translate('+strTrans+')', 'z-index':maxZ, border:''}); 
    //arrDivUnCertain[i].css({opacity:flUncertainOpacityOn});
    elMark.elDivUnCertain.css({opacity:flUncertainOpacityOn});
    return false;
  }
  MarkerT.tmpPrototype.funcOut=function(){
    var elMark=this, i=elMark.dataInd;
    //MarkerT.tmpPrototype.setImg.call(elMark);
    elMark.setImg();
    elMark.css({'z-index':maxList-i});
    //arrDivUnCertain[i].css({opacity:flUncertainOpacityOff});
    elMark.elDivUnCertain.css({opacity:flUncertainOpacityOff});
  }
  MarkerT.tmpPrototype.funcInfoClick=function(){
    var i=this.dataInd;
    var viewTmp=this.oRole==oB?viewInfoB:viewInfoS;
    viewTmp.setContainers(i);
    viewTmp.setVis();
    doHistPush({view:viewTmp});
    return false;
  }
  MarkerT.tmpPrototype.setImg=function(){
    var elMark=this;
    var obj=elMark.dataObjMarkerOne;
    var strScale='', boUseFrame=false;
    var strTrans='-50%, -100%', strBorder='', strWidth='', strHeight='', strBackground='', strSrc=obj;
    if(typeof obj=='object'){
      var {url, origin, zoom, size, anchor, boUseFrame}=obj;
      strSrc=url;
      if(origin){
        var strScale='scale('+zoom+')';
        strWidth=size.width+'px'; strHeight=size.height+'px';
        var lef=-origin.x, to=-origin.y;
        strSrc=uOnePixTransparent; strBackground='url('+url+') '+lef+'px '+to+'px ';
      }
      if(boUseFrame) strBorder='solid 1px '+this.oRole.strColor;
      if(anchor){  var xTrans=Math.round(anchor.x), yTrans=anchor.y; strTrans='-'+xTrans+'px, -'+yTrans+'px';  }
    }
    elMark.css({transform:'translate('+strTrans+') '+strScale, border:strBorder, width:strWidth, height:strHeight, background:strBackground});
    elMark.elImg.src=strSrc;
  }
  
  
  var strFont="8pt Arial";
  var ctxMeas = document.createElement("canvas").getContext("2d");  ctxMeas.font = strFont;     // Create context for measuring text width
  var ElImgGroupOverlayT=function(oRole){
    var elImgGroupOverlay = createElement('img').css({transform:'translate(-50%, -50%)', position:'absolute', display:'none'});
    extend(elImgGroupOverlay, ElImgGroupOverlayT.tmpPrototype);
    elImgGroupOverlay.oRole=oRole;
    return elImgGroupOverlay;
  }
  ElImgGroupOverlayT.tmpPrototype={};
  ElImgGroupOverlayT.tmpPrototype.hideGroupOverlay=function(){ this.style.display='none';}
  ElImgGroupOverlayT.tmpPrototype.setGroupOverlay=function(){
    //for(var i=0;i<this.oRole.length;i++) el.ArrMarker[i].hideMarkers();

    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    var zoomFac=zoomFacW; // zoomFacW zoom factor written.
    var pixC=pixMult(pWCC,zoomFac);
    var [w, h]=el.storedVPSize;

    canvas.width=w;   canvas.height=h;
    var wH=w/2, hH=h/2;

    var MGroupTab=this.oRole.MGroupTab;
    for(var i=0; i<MGroupTab.length;i++) {
      var xZ=MGroupTab[i][0]*zoomFac, yZ=MGroupTab[i][1]*zoomFac;
      var nD=MGroupTab[i][2], str=nD+'';
      var cx=xZ-pixC.x+wH, cy=yZ-pixC.y+hH;
      var widthText=ctxMeas.measureText(str).width;
      var widthBox=widthText+4, heightBox=10,  widthBoxHalf=widthBox/2, heightBoxHalf=heightBox/2,  wTH=widthBox/2, hTH=heightBox/2;
      cy+=heightBox*this.oRole.yOffsetGroupMarker||0;

      ctx.beginPath(); ctx.moveTo(cx-wTH, cy-hTH); ctx.lineTo(cx+wTH,cy-hTH);  ctx.lineTo(cx+wTH, cy+hTH); ctx.lineTo(cx-wTH, cy+hTH);   ctx.closePath();   ctx.fillStyle=this.oRole.strGroupColor; ctx.fill();
      ctx.fillStyle = "black";     ctx.fillText(str, cx-widthText/2, cy+heightBoxHalf-1 );    // Write text
    }
    
    this.src=canvas.toDataURL("image/png");//.css({background:'green'});
    this.style.display='';
  }
  ElImgGroupOverlayT.tmpPrototype.drawGroupOverlay=function(){
    var left=pWCC.x*zoomFacW-pixBoardX, top=pWCC.y*zoomFacW-pixBoardY;
    this.css({left:left+'px', top:top+'px'});
  }


  el.drawMe=function(){
    var left=el.pWCMe.x*zoomFacW-pixBoardX, top=el.pWCMe.y*zoomFacW-pixBoardY;    elImgMe.css({left:left+'px', top:top+'px'});
  }
  el.drawOpponent=function(){
    var left=el.pWCOpponent.x*zoomFacW-pixBoardX, top=el.pWCOpponent.y*zoomFacW-pixBoardY;    el.elImgOpponent.css({left:left+'px', top:top+'px'});
  }
  var zoomFacW;
  var maxZ=intMax;
  el.pWCMe={x:128,y:128};
  el.pWCOpponent={x:128,y:128};
  var pWCC={x:128,y:128};
  var iTileFirstLast=-1, jTileFirstLast=-1, zoomLevLast=-20, drLevLast=-20;
  var TileStack=[];
  var arrInd=[];
  var elBoard=createElement('div').css({position:'absolute','box-sizing': 'border-box'});
  
  //elBoard.css({width:2*256,height:2*256}); //,border:'solid 3px red' ,'zoom':0.5
  elBoard.css({width:'100%',height:'100%'}); //,border:'solid 3px red' ,'zoom':0.5
  elBoard.css({'transform-origin':'left top'}); //,border:'solid 3px red' ,'zoom':0.5
  //elBoard.css({width:50,height:50}); //,border:'solid 3px red' ,'zoom':0.5
  //var elPinDiv=createElement('div').css({position:'relative', width:'100%',height:'100%'});

  var elGlas=createElement('div').css({position:'absolute', top:0, left:0, width:'512',height:'512'});
  //elGlas=createElement('div').css({position:'absolute', top:0, left:0, width:"calc(100% + 256px)",height:"calc(100% + 256px)"});
  elGlas.css({'box-sizing': 'border-box'});
  elGlas.css({width:"calc(200% + 512px)",height:"calc(200% + 512px)"});
  if(boDbg) elGlas.css({border:'pink solid'});
  var elGlasBack=elGlas.cloneNode(true);

  var elImgMe=createElement('img').css({transform:'translate(-50%, -100%)', position:'absolute','z-index':1}); elImgMe.src=uMarkerMe;
  el.elImgOpponent=createElement('img').css({transform:'translate(-50%, -100%)', position:'absolute','z-index':2}).prop({'src':uMarkerOpponent}).on('click',function(){
    var {objSender, iRole, message, tSent, latlngSender}=this.myData;
    var {idUser, displayName, boImgOwn, image, imTag}=objSender;
    //var iMTab=null; ORole[iRole].MTab.forEach(function(item,i){ if(item.idUser==idUser) iMTab=i;});
    //if(iMTab==null){ return; }
    var viewInfoT=ViewInfo[iRole];
    //var data=extend({}, userInfoFrDB[ORole[iRole].strRole]);
    //copySome(data, userInfoFrDB.user, ['boImgOwn', 'image', 'imTag', 'displayName']);
    //viewInfoT.setContainers(data);
    //viewInfoT.setVis();
    //doHistPush({view:viewInfoT});
    var retFunc=function(data){
      viewInfoT.setContainers(data[iRole]);
      viewInfoT.setVis();
      doHistPush({view:viewInfoT});
    }
    var vec=[['getSingleUser',{IRole:[iRole], idUser:idUser}, retFunc]];  majax(vec); 
  });
  elGlas.append(elImgMe, el.elImgOpponent);
  
  el.ElImgGroupOverlay=[]; for(var i=0;i<ORole.length;i++) el.ElImgGroupOverlay[i]=new ElImgGroupOverlayT(ORole[i]);
  elGlas.append(...el.ElImgGroupOverlay);
  
  if(boDbg) elBoard.append(elDivPivotDbg);
  elBoard.append(elGlasBack, elGlas);

  if(!boTouch){
    if(boFF) elGlas.on("DOMMouseScroll", myMousewheel, false);
    else {
      //elGlas.bind('mousewheel', myMousewheel);
      elGlas.on("mousewheel", myMousewheel, false);
    }
    elGlas.on('mousedown',myMousedown);
  }


  elGlas.on("touchstart", handleStart, false);
  elGlas.on("touchend", handleEnd, false);
  elGlas.on("touchcancel", handleCancel, false);
  //elGlas.on("touchleave", handleEnd, false);
  elGlas.on("touchmove", handleMove, false);
  
  
  el.on("myResize", function(){
    el.storeVPSize();
  });
  //el.on("idle", function(){ el.storeVPSize(); });
  el.on('idle', function(){
    if(isVisible(el)) el.storeVPSize();
    for(var i=0;i<ORole.length;i++) {
      el.ArrMarker[i].hideMarkers();
      el.ElImgGroupOverlay[i].hideGroupOverlay();
    }
    el.drawMe();
    el.drawOpponent();
    if(window.loadTabStart) loadTabStart(1);
  });

  el.append(elBoard);
  el.css({position: 'relative',overflow:'hidden'});
  el.elBoard=elBoard;
  return el;
}

/***********************************************
 *
 *   viewFrontCreator
 *
 **********************************************/
 
var viewFrontCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'front';}
  
    // entryButtonW
  var entryButtonB=createElement('button').myText(langHtml.AppearAsBuyer).addClass('flexWidth').css({'width':'initial','font-size':'0.7em', background:ORole[0].strColor}).on('click',function(){
    viewEntryB.setVis(); doHistPush({view:viewEntryB});
    ga('send', 'event', 'button', 'click', 'entryDivB');
  });
  var entryButtonS=createElement('button').myText(langHtml.AppearAsSeller).addClass('flexWidth').css({'width':'initial','font-size':'0.7em', background:ORole[1].strColor}).on('click',function(){
    viewEntryS.setVis(); doHistPush({view:viewEntryS});
    ga('send', 'event', 'button', 'click', 'entryDivS');
  });
  if(document.domain.substr(0,4)=='demo') {entryButtonB.hide(); entryButtonS.hide();}
  
  el.entryButtonW=createElement('div').css({background:'', "box-sizing":"border-box",color:'black','font-size':'1.2em','line-height':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.2em 0em 0.2em', margin:'1px 0em 0em 0em', flex:'0 0 auto', display:"flex", "justify-content":"space-around"}); //, 'border-top':'solid 1px', "justify-content":"space-evenly"
  el.entryButtonW.append(entryButtonB, entryButtonS);
  
  
    // QuickDiv
  var QuickDiv=[];
  for(var i=0;i<ORole.length;i++){
    QuickDiv[i]=quickCreator(ORole[i]).css({padding:'0.7em 0.2em 0.1em',margin:'0em 0em 0em',display:'flex','border-top':'solid 1px'});   QuickDiv[i].hide();
  }
  el.QuickDiv=QuickDiv;
  
  var quickDivOuter=createElement('div').css({flex:'0 0 auto'}); quickDivOuter.myAppend.apply(quickDivOuter, QuickDiv);
  //if(boIOS && boTouch) quickDivOuter.css({padding:'0em 0em 1.7em'});
  
  
    // divFoot
  var settingButtonClick=function(){
    viewSettingEntry.setVis(); doHistPush({view:viewSettingEntry});
    ga('send', 'event', 'button', 'click', 'setting');
  }
  //var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var settingButton=createElement('button').myAppend('⚙').addClass('fixWidth').css({'margin-left':'0.8em', 'margin-right':'1em'}).prop('title',langHtml.Settings).on('click',settingButtonClick);

  //var uWikiT=uWiki,tmp='trackerSites'; if(strLang!='en') tmp+='_'+strLang; uWikiT+='/'+tmp;
  var uWikiT=uWiki; if(strLang!='en') uWikiT=uWiki+'/'+strLang;
  var infoLink=createElement('a').prop({href:uWikiT}).myText(langHtml.OtherMarkets).css({'margin':'0em auto'}).on('click', function(){
    ga('send', 'event', 'button', 'click', 'wiki');
  });
  
  var tableButtonClick=function(){
    viewTable.setVis();  doHistPush({view:viewTable});
    ga('send', 'event', 'button', 'click', 'table');
  }
  var tmpImg=createElement('img').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  el.tableButton=createElement('button').myAppend(tmpImg).addClass('fixWidth').css({'margin':'0 0.8em 0 0.4em'}).prop('title',langHtml.ComparisonTable).on('click',tableButtonClick);  // , background:'transparent'
  
  
  el.filterButton=filterButtonCreator().css({'margin-left':'0.0em', 'white-space':'nowrap'}); //, background:'transparent'

      // QuickFilterButtons
  var clickF=function(){
    var iRole=this==CbRole[1]?1:0, iRoleAlt=1-iRole;
    var b=this, bAlt=CbRole[iRoleAlt];
    //var boOn=this.style.color=='black',  boOnAlt=bAlt.style.color=='black'; 
    var boOn=this.checked,  boOnAlt=bAlt.checked; 
    
    if(!boOn && !boOnAlt) { bAlt.checked=true; boOnAlt=true;}
    
    var iRoleT=boOn?iRole:iRoleAlt;
    charRole=ORole[iRoleT].charRole;  setItem('charRole', charRole);
    
    if(boOn) viewFilter.ElRole[iRole].Filt.filtAll(); else viewFilter.ElRole[iRole].Filt.filtNone(); 
    if(boOnAlt) viewFilter.ElRole[iRoleAlt].Filt.filtAll(); else viewFilter.ElRole[iRoleAlt].Filt.filtNone(); 
    loadTabStart(); 
  }
 
  var DivButRole=[], CbRole=[], Label=[];
  for(var i=0;i<2;i++){
    var strRole=i?'Sellers':'Buyers', strTmp=langHtml[strRole], oRole=ORole[i]; //.toUpperCase()
    Label[i]=createElement('div').myText(strTmp).css({background:oRole.strColor, 'word-break':'break-word', 'font-size':'70%', padding:'0 0.1em', position:'absolute', top:'80%', left:'0px', 'box-sizing':'border-box', width:'100%', 'line-height':'90%'});  //, 'z-index':'-1'
    CbRole[i]=createElement('input').prop({type:'checkbox', checked:true}).css({background:oRole.strColor, margin:'0em 0 0.4em',width:'1.4em',height:'1.4em'}).prop('title','Show / hide '+strTmp).on('click',clickF); //, transform:'scale(2,2)', zoom:'1.4'
    DivButRole[i]=createElement('div').myAppend(CbRole[i], Label[i]).css({background:oRole.strColor, position:'relative', 'padding':'0em .6em 0'}); //, padding:'0.2em'
  }
  
  
  //var DivButRole=[], CbRole=[], Label=[];
  //for(var i=0;i<2;i++){
    //var strRole=i?'Sellers':'Buyers', strTmp=langHtml[strRole], oRole=ORole[i]; //.toUpperCase()
    //Label[i]=createElement('div').myText(strTmp).css({background:oRole.strColor, 'word-break':'break-word', 'font-size':'70%', padding:'0 0.1em', position:'absolute', top:'100%', left:'0px', 'box-sizing':'border-box', width:'100%', 'line-height':'100%'});  //, 'z-index':'-1'
    //CbRole[i]=createElement('input').prop({type:'checkbox', checked:true}).css({background:oRole.strColor, margin:'0 0 0.4em',transform:'scale(1.6)'}).prop('title','Show / hide '+strTmp).on('click',clickF); //, transform:'scale(2,2)', zoom:'1.4'
    //DivButRole[i]=createElement('div').myAppend(CbRole[i], Label[i]).css({background:oRole.strColor, position:'relative', 'padding':'.3em .8em 0', top:'-3px'}); //, padding:'0.2em'
  //}
  
  //var DivButRole=[], CbRole=[], Label=[];
  //for(var i=0;i<2;i++){
    //var strRole=i?'Sellers':'Buyers', strTmp=langHtml[strRole], oRole=ORole[i];
    //Label[i]=createElement('div').myText(strTmp).css({background:oRole.strColor, 'word-break':'break-word', 'font-size':'70%', padding:'0.1em'});
    //CbRole[i]=createElement('input').prop({type:'checkbox', checked:true}).css({background:oRole.strColor, padding:'0.1em', transform:'scale(1.6)', margin:'0.3em 0 0.1em'}).prop('title','Show / hide '+strTmp).on('click',clickF); //, transform:'scale(2,2)', zoom:'1.4'
    //DivButRole[i]=createElement('div').myAppend(CbRole[i], Label[i]).css({background:oRole.strColor, display:'flex', 'flex-direction':'column', 'align-items':'center'}); //, padding:'0.2em'
  //}
  
  
  var labelFilterBut=createElement('div').myText('Filtering').css({'font-size':'70%', padding:'0.1em', position:'absolute', bottom:'100%', width:'100%', 'text-align':'center'});
  var divFilterBut=createElement('div').myAppend(...DivButRole, el.filterButton, labelFilterBut).css({position:'relative', 'box-sizing': 'border-box', flex:'0 0 auto', display:'flex', 'align-items':'center', 'justify-content':'space-between'});
  
  var divFoot=createElement('div').myAppend(settingButton, infoLink, el.tableButton, divFilterBut).addClass('footDiv'); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-between'});

  
  el.append(el.entryButtonW, mapDiv, quickDivOuter, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el
}

var quickCreator=function(oRole){
  var el=createElement('div');
  var {charRole, strRole}=oRole;
  

  el.setUp=function(){
    var boShow=Number(userInfoFrDB[strRole].boShow); 
    var hideTimer=Number(userInfoFrDB[strRole].hideTimer);
    var tHide=Number(userInfoFrDB[strRole].tPos)+hideTimer, tDiff=tHide-curTime;
    var tDiffForm=getSuitableTimeUnitStr(tDiff);
    var tmpShow,tmpHide,str; if(boShow) { str=hideTimer==intMax?'∞':tDiffForm; tmpShow='#0f0'; tmpHide=colGray;}else { str=langHtml.On; tmpShow=colGray; tmpHide='#f00'; }
    butShowWPos.css('background-color', tmpShow); butShowWPos.firstChild.nodeValue=str; buthide.css('background-color', tmpHide);
    spanDragMess.toggle(Boolean(1-boShow));

    var [bestVal, iBest]=closest2Val(arrHideTime, userInfoFrDB[strRole].hideTimer);
    selHideTimer.value=bestVal;
  }

  var colGray='#eee'
  
  var myShow=function(pos){
    uploadPosNLoadTabStart(pos, Number(selHideTimer.value), oRole);
  }

  var butShowWPos=createElement('button').myText(langHtml.On).css({'margin-left':'1em'}).on('click', function(){
    if(boDbg && window.location.hostname!='localhost') { myShow({coords:{latitude:0, longitude:0}});  return;  } // setMess('... using origo ... ',null,true);
      
    if(boGeoApproved==0) {setMess('You must agree to sending your position.'); return;}
    setMess('... getting position ... ',null,true);
    navigator.geolocation.getCurrentPosition(myShow, geoError);  //, {maximumAge:Infinity, timeout:5000}

  });

  
  var buthide=createElement('button').myText(langHtml.Off).css({'margin-left':'1em'}).on('click', function(){
    if(window.navigator.onLine){
      setMess('',null,true);
      var vec=[['RHide',{charRole:charRole}], ['setupById', {Role:strRole}]];  majax(vec); 
    }else{
      if(swRegistration && 'sync' in swRegistration){
        swRegistration.sync.register(JSON.stringify({url:uBE, vec:[['RHide',{charRole:charRole}]]}));
        setMess('waiting for sync');
      } else {
        setMess("offline");
      }
    }
  });

  var divButts=createElement('span').myAppend(butShowWPos,buthide);
  
  var tu=langHtml.timeUnit, mi=tu.min[1], h=tu.h[1], d=tu.d[1];
  var selHideTimer=createElement('select');
  //var arrHideTime=[0.25,1,2, 5,10,15,20,30,40,60,90,2*60,3*60,4*60,5*60,6*60,8*60,10*60,12*60,18*60,24*60,36*60,2*24*60,3*24*60,4*24*60,5*24*60,6*24*60,7*24*60,14*24*60,30*24*60,365*24*60]; // Minutes
  //for(var i=0;i<arrHideTime.length;i++) arrHideTime[i]*=60;
  var arrHideTime=[15,60,120, 300,600,15*60,20*60,30*60,40*60,3600,1.5*3600,2*3600,3*3600,4*3600,5*3600,6*3600,8*3600,10*3600,12*3600,18*3600,86400,1.5*86400,2*86400,3*86400,4*86400,5*86400,6*86400,7*86400,14*86400,30*86400,intMax], len=arrHideTime.length;
  for(var i=0;i<len;i++){  var str=getSuitableTimeUnitStr(arrHideTime[i]); if(i==len-1) str='∞'; var opt=createElement('option').myText(str).prop('value',arrHideTime[i]);   selHideTimer.append(opt);    }

  var spanDragMess=createElement('span').myText(langHtml.DragOrZoom).css({'font-size':'75%',position:'absolute',top:'-1.15em',left:'50%', transform:'translate(-50%, 0)', 'white-space':'nowrap'}).hide();
  
  var imgH=imgHelp.cloneNode().css({'margin-left':'1em'});   popupHover(imgH,createElement('div').myHtml(langHtml.quickHelp));
  var spanLabel=el.spanLabel=createElement('span').myText(langHtml[ucfirst(oRole.strRole)]).addClass('footDivLabel').css({'font-size':'80%', top:'-.1em'});
  
    // butTog
  el.ElToggleble=[selHideTimer, divButts, imgH, spanLabel];
  el.butTog=createElement('button').myText('-').css({'margin-left':'.4em', position:'absolute', right:'0em', 'z-index':'1'}).on('click', function(){
    var QuickDiv=viewFront.QuickDiv, QDCur=QuickDiv[oRole.ind], QDAlt=QuickDiv[1-oRole.ind] ;
    //var boVis=QuickDiv[oRole.ind].spanLabel.is(':visible');
    //var boAltVis=QuickDiv[1-oRole.ind].spanLabel.is(':visible');
    var boVis=QDCur.spanLabel.style.display!='none';
    var boAltVis=QuickDiv[1-oRole.ind].spanLabel.style.display!='none';
    if(boVis && boAltVis){
      QDCur.ElToggleble.forEach((ele)=>{ele.hide()});  QDCur.butTog.myText('+');  QDCur.css({'padding-top':'.2em'});  QDCur.butTog.css(oRole==oB?'top':'bottom','0em');  QDAlt.butTog.hide();
    }else {
      for(var i=0;i<ORole.length;i++) {
        QuickDiv[i].ElToggleble.forEach((ele)=>{ele.show()});  QuickDiv[i].butTog.myText('-').show();   QuickDiv[i].css({'padding-top':'.7em'});
        QuickDiv[i].butTog.css(ORole[i]==oB?'top':'bottom','0.3em');
      }
    }
  });
  el.butTog.css(oRole==oB?'top':'bottom','0.3em');
  el.butTogW=createElement('span').myAppend(el.butTog);

  el.append(...el.ElToggleble);
  el.append(el.butTogW);
  
  
  el.css({position:'relative'});
  el.css({'text-align':'left', position:'relative', background:oRole.strColor});
  return el;
}



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Table stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var markSelectorCreator=function(oRole){
  var el=createElement('div');
  var {charRoleUC}=oRole;
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  el.setUp=function() {  tBody.querySelector('input[type=radio][value='+oRole.colOneMark+']').prop({checked:true});  }

  var saveRB=function(colOneMarkNew) {
    if(colOneMarkNew!=oRole.colOneMark){
      oRole.colOneMark=colOneMarkNew; setItem('colOneMark'+charRoleUC, oRole.colOneMark);
      var ind=oRole.ind;
      if(oRole.MTab.length){    mapDiv.ArrMarker[ind].setMarkers();  mapDiv.ArrMarker[ind].drawMarkers();   }
    }
  }
  var changeFunc=function(){ saveRB(this.value); }
  el.createTable=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var rb=createElement('input').prop({"type":"radio",name:'markSel'}).prop('value',strName).on('change', changeFunc);
      //if(i%2) rb.css({'margin':'0.5em 1.6em 0.5em 0'}); else rb.css({'margin':'0.5em 0em 0.5em 1.6em'})
      var cssTmp; if(i%2) cssTmp={'margin-left':'2em'}; else cssTmp={'margin-right':'2em'};  rb.css(cssTmp);
      if(boAndroid) rb.css({'-webkit-transform':'scale(2,2)'}); else rb.css({width:'1.4em',height:'1.4em'});
      var imgH=''; if(strName in oRole.helpBub) { imgH=imgHelp.cloneNode().css({'margin-right':'1em'});  popupHover(imgH,oRole.helpBub[strName]);  }
      var tdL=createElement('td').myAppend(calcLabel(langHtml.prop, strName),' ',imgH), tdRB=createElement('td').myAppend(rb);
      var r=createElement('tr').myAppend(tdL,tdRB).attr({name:strName});
      if(i%2) r.css({background:'lightgrey'});
      tBody.append(r);
    }
      // Add labels
    for(var i=0;i<StrGroup.length;i++){
      var th=createElement('th').myText(langHtml[StrGroup[i]]+':').css({'font-size':'120%','text-align':'center'});
      var h=createElement('tr').myAppend(th, createElement('td'));
      el.querySelector('tr[name='+StrGroupFirst[i]+']').insertAdjacentElement('beforebegin', h);
    }
  }
  var tBody=createElement('tbody');  el.tBody=tBody;
  var table=createElement('table').css({'margin':'0.3em 0em 0.8em',border:'1px'}).myAppend(tBody);
  el.myAppend(table);
  return el;
}


var viewMarkSelectorCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'markSelector';}
  el.setUp=function() {  
    var indRole=Number(charRole=='s'), oRole=ORole[indRole];  elRole=ElRole[indRole];
    spanLab.css({background:oRole.strColor});
    var strTmp=langHtml[indRole?'Sellers':'Buyers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(charRole);
    ElRole[indRole].show().setUp();
    ElRole[1-indRole].hide();
  }

  var elRole;
  var ElRole=[];   for(var i=0;i<2;i++){ElRole[i]=markSelectorCreator(ORole[i]); }
  var divCont=createElement('div').addClass('contDiv').myAppend(...ElRole);
  el.ElRole=ElRole;
  
      // divFoot
  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'}); if(boIE) roleToggler.css({display:''});
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', historyBack);
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(langHtml.MapMarkers, spanRole).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, spanLab).addClass('footDiv');
  
  el.append(divCont, divFoot);
  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var columnSelectorCreator=function(oRole){
  var el=createElement('div');
  var {charRoleUC}=oRole;
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  
  el.setUp=function() {
    //oRole=ORole[Number(charRole=='s')];
    arrCB.forEach(function(el, i){ var strName=el.value, boOn=oRole.ColsShow.indexOf(strName)!=-1;  el.prop({checked:boOn}); });
  }
  el.defaultFunc=function() {
    myCopy(ColsShowLoc,oRole.ColsShowDefault); saveCB(); el.setUp();
  }
  var StrColsByTypeTmp=[];  // To be more GC friendly
  el.allFunc=function() {  myCopy(StrColsByTypeTmp,StrProp); if(!boShowTeam) arrValRemove(StrColsByTypeTmp,'idTeam'); myCopy(ColsShowLoc,StrColsByTypeTmp); saveCB(); el.setUp(); }
  el.noneFunc=function() {  ColsShowLoc.length=0; saveCB(); el.setUp();  }

  var getCurrentInd=function(ColsShowOut){  // Capture the checked checkboxes to ColsShowOut in a way that keeps the order of ColsShow
    myCopy(ColsShowOut,oRole.ColsShow);
    arrCB.forEach(function(ele,i){
      var strName=ele.value, boOn=Number(ele.prop('checked')), ind=ColsShowOut.indexOf(strName), boExist=ind!=-1;
      if(!boExist && boOn) ColsShowOut.push(strName); else if(boExist && !boOn) mySplice1(ColsShowOut,ind);
    });
    return ColsShowOut;
  }
  var saveCB=function() {
    if(!myCompare(oRole.ColsShow, ColsShowLoc) ){
      myCopy(oRole.ColsShow, ColsShowLoc); setItem('ColsShow'+charRoleUC, oRole.ColsShow);
      viewTable.ElRole[oRole.ind].colOrderRefresh();
    }
  }
  var changeFunc=function(){
    var ele=this;
    getCurrentInd(ColsShowLoc);
    myCopy(oRole.ColsShow, ColsShowLoc); setItem('ColsShow'+charRoleUC, oRole.ColsShow);
    var boOn=Boolean(ele.prop('checked'));
    viewTable.ElRole[oRole.ind].colToggle(ele.value,boOn);
    var indNew=boOn?oRole.ColsShow.length-1:oRole.ColsShow.length;
    viewTable.ElRole[oRole.ind].colMove(ele.value,indNew);
  }
  el.createTable=function(){
    var ha=createElement('th').myText(langHtml.Column), hb=createElement('th').myText(langHtml.Show), rh=createElement('tr').myAppend(ha);
    tHead.append(rh);
    
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var cb=createElement('input').prop({"type":"checkbox"}).css({'margin':'0.6em 1.2em'}).on('change', changeFunc);
      if(boAndroid) cb.css({'-webkit-transform':'scale(2,2)'}); else cb.css({width:'1.4em',height:'1.4em'});
      cb.value=strName;  arrCB[i]=cb;
      var imgH=''; if(strName in oRole.helpBub) { imgH=imgHelp.cloneNode().css({'margin-right':'1em'});  popupHover(imgH,oRole.helpBub[strName]);  }
      var tdL=createElement('td').myAppend(calcLabel(langHtml.prop, strName),' ',imgH), tdCB=createElement('td').myAppend(cb);
      var r=createElement('tr').myAppend(tdL,tdCB).attr({name:strName});
      tBody.append(r);
    }

      // add labels
    for(var i=0;i<StrGroup.length;i++){
      var th=createElement('th').myText(langHtml[StrGroup[i]]+':').prop('colspan',2).css({'font-size':'120%','text-align':'center'});
      var h=createElement('tr').myAppend(th);
      el.querySelector('tr[name='+StrGroupFirst[i]+']').insertAdjacentElement('beforebegin', h);
    }
  }
  var arrCB=Array(StrProp.length);
  var ColsShowLoc=[];

  var tHead=createElement('thead');
  var tBody=createElement('tbody');  el.tBody=tBody;
  var table=createElement('table').css({'margin':'0.3em auto 0.8em',border:'1px'});
  el.myAppend(tHead, tBody);
  return el;
}

var viewColumnSelectorCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'columnSelector';}
  el.setUp=function() {
    var indRole=Number(charRole=='s'), oRole=ORole[indRole];  elRole=ElRole[indRole];
    spanLab.css({background:oRole.strColor});
    var strTmp=langHtml[indRole?'Sellers':'Buyers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(charRole);
    ElRole[indRole].show().setUp();
    ElRole[1-indRole].hide();
  }
  var defaultFunc=function() { elRole.defaultFunc();}
  var allFunc=function() { elRole.allFunc(); }
  var noneFunc=function() { elRole.noneFunc(); }

  var elRole;
  var ElRole=[];   for(var i=0;i<2;i++){ElRole[i]=columnSelectorCreator(ORole[i]); }
  var divCont=createElement('div').addClass('contDiv').myAppend(...ElRole);
  el.ElRole=ElRole;
  
      // divFoot
  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'}); if(boIE) roleToggler.css({display:''});
  
  var buttDefault=createElement('button').myText(langHtml.Default).on('click', defaultFunc);
  var buttAll=createElement('button').myText(langHtml.All).on('click', allFunc);
  var buttNone=createElement('button').myText(langHtml.None).on('click', noneFunc);
  var tmpImg=createElement('img').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//, 'margin-right':'0.5em'
  //var buttSort=createElement('button').myAppend(tmpImg).css({'margin-left':'auto', 'margin-right':'1em', 'font-size':'0.72rem'}).addClass('flexWidth');
  var buttSort=createElement('button').myAppend('sort').css({'margin-left':'auto', 'margin-right':'1em'}).addClass('flexWidth').on('click', function(){
    //var viewTmp=oRole.strRole=='buyer'?viewColumnSorterB:viewColumnSorterS;
    //viewTmp.setVis();    doHistPush({view:viewTmp});
    viewColumnSorter.setVis();    doHistPush({view:viewColumnSorter});
  });
  var buttonBack=createElement('button').myText(strBackSymbol).css({'margin-left':'0.8em','margin-right':'1em'}).addClass('fixWidth').on('click', historyBack);

  var tmpImg=createElement('img').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});// uSetting1
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(tmpImg, langHtml.Columns, spanRole).addClass('footDivLabel');
  buttAll.css({'font-size':'80%'}); buttDefault.css({'font-size':'80%'}); buttNone.css({'font-size':'80%'});
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, buttSort, spanLab, buttNone, buttDefault, buttAll).addClass('footDiv'); //,overflow:'hidden'
  
  el.append(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}

var dragSorterCreator=function(cbMouseup){
  var el=createElement('div');
  var myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    movedRow=this.parentNode.css({position:'relative',opacity:0.55,'z-index':'auto'});
    document.on(strMoveEv,myMousemove); document.on(strEndEv,el.myMouseup);
    e.preventDefault(); // to prevent mobile crome from reloading page
  }
  el.myMouseup= function(e){
    //movedRow.css({position:'relative',opacity:1,'z-index':'auto',top:'0px'});
    movedRow.css({'transform':'translateY(0px)',opacity:1,'z-index':'auto'});
    document.off(strMoveEv,myMousemove); document.off(strEndEv,el.myMouseup);
    cbMouseup();
  }

  var y, topCur;
  var myMousemove= function(e){
    var x,y;
    if(boTouch) {e.preventDefault();  x=e.changedTouches[0].pageX; y=e.changedTouches[0].pageY;}
    else {y=e.clientY;}

    var iCur=getNodeIndex(movedRow);
    var hCur=movedRow.offsetHeight, yMouseOff=y-hCur/2;

    var len=el.children.length;

    if(iCur>0) {  //Check if previous is better
      var tmp=movedRow.previousElementSibling;
      var yPrevOff=tmp.getBoundingClientRect().top;
      var hPrev=tmp.offsetHeight;
      if(y<yPrevOff+hPrev/2) { tmp.insertAdjacentElement('beforebegin', movedRow); }
    }
    if(iCur<len-1) { //Check if next is better
      var tmp=movedRow.nextElementSibling;
      var yNextOff=tmp.getBoundingClientRect().top;
      var hNext=tmp.offsetHeight;
      if(y>yNextOff+hNext/2) { tmp.insertAdjacentElement('afterend', movedRow); }
    }
    var yCurOff=movedRow.offsetTop;
    movedRow.css({'transform':'translateY('+(yMouseOff-yCurOff)+'px)'});
  };

  el.myAdd=function(arrName,arrLabel){
    for(var i=0;i<arrName.length;i++){
      var span=createElement('span').css({display:'inline-block',padding:'0.6em 0.7em',width:'150px',margin:'2px 0px','background':'#aaa'}).prop({UNSELECTABLE:"on"}).addClass('grabbable').myAppend(arrLabel[i]); //cursor:'pointer',
      var r=createElement('div').attr({name:arrName[i]}).myAppend(span);
      el.append(r);
      var strEvTmp=boTouch?'touchstart':'mousedown'; span.on(strEvTmp,myMousedown);
    }
  }
  el.getMovedRow=function(){return movedRow;}
  el.setUp=function(arrName,arrLabel){    el.empty();    el.myAdd(arrName,arrLabel);  }
  el.myRemove=function(arrName){  for(var i=0;i<arrName.length;i++){ el.querySelector('[name='+arrName[i]+']').remove(); }  }
  el.myGet=function(arrO=[]){  arrO.length=0;  [...el.childNodes].forEach(function(ele,i){ arrO[i]=ele.attr("name"); }); return arrO;   }

  el.addClass('unselectable');    el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie
  var movedRow;
  if(boTouch){  var strMoveEv='touchmove', strEndEv='touchend'; }  else{   var strMoveEv='mousemove', strEndEv='mouseup';    }

  return el;
}


var viewColumnSorterCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'columnSorter';}
  el.setUp=function(){
    var indRole=Number(charRole=='s'); oRole=ORole[indRole];
    arrLabel.length=0;  for(var i=0;i<oRole.ColsShow.length;i++){ arrLabel[i]=calcLabel(langHtml.prop, oRole.ColsShow[i]);  }
    dragSorter.setUp(oRole.ColsShow,arrLabel);
    spanLab.css({background:oRole.strColor});
    var strTmp=langHtml[indRole?'Sellers':'Buyers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(oRole.charRole);
  }

  var cbMouseup=function(){
    var tmp=dragSorter.getMovedRow(), ind=getNodeIndex(tmp);
    oRole.ColsShow=dragSorter.myGet(oRole.ColsShow);
    setItem('ColsShow'+oRole.charRoleUC, oRole.ColsShow);
    viewTable.ElRole[oRole.ind].colMove(tmp.attr('name'),ind);
  }
  
  var oRole;
  var head=createElement('h3').myText(langHtml.SortColumns);
  var dragSorter=dragSorterCreator(cbMouseup).css({margin:'1em auto',display:'inline-block', 'text-align':'left'});

  var arrLabel=[];
  var divCont=createElement('div').addClass('contDiv').myAppend(dragSorter);

    // divFoot
  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'}); if(boIE) roleToggler.css({display:''});
  var buttonBack=createElement('button').css({'margin-left':'0.8em','margin-right':'1em'}).myText(strBackSymbol).addClass('fixWidth').on('click', historyBack);
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(langHtml.SortColumns, spanRole).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, spanLab).addClass('footDiv');
  
  el.append(divCont, divFoot);

  el.css({'text-align':'center', display:"flex","flex-direction":"column"});
  return el;
}


/*
 * tHeadLabel
 */

var tHeadLabelCreator=function(oRole){
  var el=createElement('thead');
  el.setArrow=function(strName,dir){
    boAsc=dir==1;
    arrImgSort.forEach(function(ele){ele.prop({src:uUnsorted}); });
    //viewSortImages.prop({src:uUnsorted});
    var tmp=boAsc?uIncreasing:uDecreasing;
    r.querySelector('th[name='+strName+']').querySelector('img[data-type=sort]').prop({src:tmp});
  }

  el.setUpCurrencyInfo=function(){
    var strCurrency='';      boMultCurrency=0;
    for(var i=0;i<oRole.MTab.length;i++) { var tmp=oRole.MTab[i].currency; if(strCurrency=='') {strCurrency=tmp;} else if(tmp!=strCurrency){boMultCurrency=1; strCurrency=''; break;} }
    if(oRole.MTab.length==0) boMultCurrency=1;

    arrDivAdditionalCurrency.forEach(function(ele){ ele.myText(strCurrency); });
  };

  var thClick=function() {
    var ele=this;  //, strName=ele.attr('name');
    boAsc=(thSorted===this)?!boAsc:true;  thSorted=this;
    //viewSortImages.prop({src:uUnsorted});
    arrImgSort.forEach(function(ele){ele.prop({src:uUnsorted}); });
    var tmp=boAsc?uIncreasing:uDecreasing;  ele.querySelector('img[data-type=sort]').prop({src:tmp});
    var tBody=viewTable.ElRole[oRole.ind].tBody;
    var arrT=tBody.querySelectorAll('tr');
    var arrTT=[...arrT], arrToSort=arrTT.slice(0, oRole.nMTab);
    var iChild=getNodeIndex(ele);
    var comparator=function(aT, bT){
      //var  a = aT.valSort,  b = bT.valSort,   dire=boAsc?1:-1; 
      var  a = aT.children[iChild].valSort,  b = bT.children[iChild].valSort,   dire=boAsc?1:-1; 
      var boAStr=0,boBStr=0;
      var aN=Number(a); if(!isNaN(aN) && a!=='') {a=aN;} else {a=a.toLowerCase(); boAStr=1;}
      var bN=Number(b); if(!isNaN(bN) && b!=='') {b=bN;} else {b=b.toLowerCase(); boBStr=1;}
      if(boAStr!=boBStr) return ((boAStr<boBStr)?-1:1)*dire;
      if(a==b) {return 0;} else return ((a<b)?-1:1)*dire;
    }
    var arrToSortN=msort.call(arrToSort,comparator);
    tBody.prepend.apply(tBody,arrToSortN);

    viewTable.ElRole[oRole.ind].setIndex();
  }
  
  el.myCreate=function(){
    var ColsTmp=myCopy([],oRole.ColsShow);
    for(var j=0;j<oRole.Main.StrProp.length;j++){var strName=oRole.Main.StrProp[j]; if(oRole.ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }


    for(var i=0;i<ColsTmp.length;i++){
      var strName=ColsTmp[i], jtmp=oRole.colsFlip[strName];
      //var canvas=headerCanvas[strName], div=createElement('div'); div.append(canvas);
      var colText=calcLabel(langHtml.prop, strName);
      if(strName=='index') colText='';
      var divLab=createElement('div').myAppend(colText)
      if(strName in langHtml.prop && langHtml.prop[strName].boRot) divLab.css({'writing-mode':'vertical-rl', transform:'rotate(-180deg)'});
    
      var imgH=''; if(strName in oRole.helpBub) { var imgH=imgHelp.cloneNode().css({'margin-left':'', 'margin-top':'0.2em'});  popupHover(imgH,oRole.helpBub[strName]); }
      var imgSort=createElement('img').attr('data-type','sort').prop({src:uUnsorted}).css({display:'block',zoom:1.5,'margin':'auto','margin-top':'0.3em','margin-bottom':'0.3em'});
      arrImgSort[i]=imgSort;
      var h=createElement("th").attr('name',strName).css({cursor:'pointer'}).addClass('unselectable').on('click', thClick).myAppend(divLab,imgH,imgSort);

      if(i>=oRole.ColsShow.length) h.hide();
      r.append(h);
    }

    var hBut=createElement("th").css({'box-shadow':'0 0', background:'white'}).myAppend(butSel); r.append(hBut);
  }
  var r=createElement("tr"), boAsc=false, thSorted=null;

  var tmpImg=createElement('img').prop({src:uColumn16}).css({height:'1rem',width:'1rem','vertical-align':'text-bottom'});// uSetting1
  var butSel=createElement('button').prop('title',langHtml.AddRemoveColumns).addClass('fixWidth').myAppend(tmpImg).on('click', function(){
    //var i=oRole.ind;  ViewColumnSelector[i].setVis();  doHistPush({view:ViewColumnSelector[i]});
    viewColumnSelector.setVis();  doHistPush({view:viewColumnSelector});
  });
  
  el.append(r);
  var arrImgSort=Array(oRole.Main.StrProp.length);

  el.myCreate();

  return el;
}



var tableCreator=function(oRole){
  var el=createElement('div');
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  var {strRole}=oRole;
  el.toString=function(){return 'table'+oRole.charRoleUC;}
  el.setIndex=function(){  for(var i=0;i<arrRow.length;i++){var tmp=arrRow[i].querySelector('[name=index]'); if(tmp) tmp.myText(i);} }
  el.setRowDisp=function(){
    var arrT=[...tBody.querySelectorAll('tr')], arrShow=arrT.slice(0, oRole.nMTab), arrHide=arrT.slice(oRole.nMTab, maxList);
    arrShow.forEach(function(ele){ele.show();});
    arrHide.forEach(function(ele){ele.hide();});
  }
  el.colOrderRefresh=function(){
        // Show and prepend the columns in ColsShow
    var len=oRole.ColsShow.length; 
    for(var i=len-1;i>=0;i--) {
      var strName=oRole.ColsShow[i];
      for(var j=0;j<arrRow.length;j++){
        var tr=arrRow[j];
        var td=tr.querySelector('td[name='+strName+']');  td.show(); td.parentNode.prepend(td);
      }
      var td=tHeadLabel.children[0].querySelector('th[name='+strName+']'); td.show(); td.parentNode.prepend(td);
    }
      // Hide the columns not in ColsShow
    var StrTmp=StrProp.concat([]); AMMinusB(StrTmp, oRole.ColsShow);
    for(var i=0;i<StrTmp.length;i++) {  
      var strName=StrTmp[i];
      for(var j=0;j<arrRow.length;j++){
        var tr=arrRow[j];
        var td=tr.querySelector('td[name='+strName+']');  td.hide();
      }
      var td=tHeadLabel.children[0].querySelector('th[name='+strName+']');  td.hide();
    }
  }
  el.colToggle=function(strName,boOn){
    //viewTHeadLabel.find('tr>th[name='+strName+']').toggle(boOn);
    var tr=tHeadLabel.children[0]; tr.querySelector('th[name='+strName+']').toggle(boOn);
    for(var i=0;i<arrRow.length;i++){ arrRow[i].querySelector('td[name='+strName+']').toggle(boOn); }
  }
  el.colMove=function(strName,ind){
    var tr=tHeadLabel.children[0], tdMove=tr.querySelector('th[name='+strName+']');
    if(ind==0) { tr.prepend(tdMove); }
    else {
      var tdRef=tr.querySelector('th[name='+oRole.ColsShow[ind-1]+']');
      tdRef.insertAdjacentElement('afterend',tdMove);
    }

    for(var i=0;i<arrRow.length;i++){
      var tr=arrRow[i], tdMove=tr.querySelector('td[name='+strName+']');
      if(ind==0) { tr.prepend(tdMove); }
      else {
        var tdRef=tr.querySelector('td[name='+oRole.ColsShow[ind-1]+']');
        tdRef.insertAdjacentElement('afterend',tdMove);
      }
    }
  }
  el.setCell=function(){
    var tr=tBody.querySelectorAll('tr');
    for(var i=0;i<oRole.nMTab;i++){
      var r=tr[i]; 
      r.querySelectorAll('td').forEach(function(ele){
        var strName=ele.attr('name'), prop=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        var rowMTab=oRole.MTab[i];
        var objT={strName:strName, iRole:oRole.ind}; extend(ele,objT);
        var tmp=''; if('sortTabF' in prop) tmp=prop.sortTabF.call(objT, rowMTab);  else tmp=rowMTab[strName];     ele.valSort=tmp;
        var tmp=''; if('setTabF' in prop) tmp=prop.setTabF.call(ele, rowMTab);  else tmp=rowMTab[strName];
        if(typeof tmp!='undefined') ele.myHtml(tmp);
      });
    }
    el.setIndex();
  }
  
  var arrRow=Array(maxList);
  el.createTBody=function(){
    var ColsTmp=myCopy([],oRole.ColsShow);
    for(var j=0;j<StrProp.length;j++){var strName=StrProp[j]; if(oRole.ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }

    for(var i=0;i<maxList;i++) {
      var row=createElement('tr'); row.iMTab=i;
      if(!boTouch) row.on('mouseover',function(){this.css({background:'yellow'});}); row.on('mouseout',function(){this.css({background:''});});
      for(var j=0;j<ColsTmp.length;j++){
        var strName=ColsTmp[j], prop=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        var td=createElement('td').css({'max-width':'200px','max-height':'40px',overflow:'hidden'}).attr({'name':strName}).prop({strName:strName, iRole:oRole.ind});
        if('crTabF' in prop) prop.crTabF.call(td);
        if(j>=oRole.ColsShow.length) td.hide();
        row.append(td);  //,'word-break':'break-all'
      }
      arrRow[i]=row;
    }
    tBody.append(...arrRow);
    tBody.on('click',function(e){
      var ele=e.target, elC=ele;
      while(1){ if(elC.nodeName=='TD') break;  elC=elC.parentNode;  }   // Set elC to closest td above
      //if(ele.nodeName!='TD') return true;
      var strName=elC.attr('name');
      var iMTab=elC.parentNode.iMTab, val=oRole.MTab[iMTab][strName];
      if(strName=='tel' && val.length || strName=='displayEmail' && val.length || strName=='link' && val.length || strName=='nComplaint' || strName=='boWebPushOK') return;
      var viewroleInfo=strRole=='buyer'?viewInfoB:viewInfoS;
      viewroleInfo.setContainers(iMTab);
      viewroleInfo.setVis();
      doHistPush({view:viewroleInfo});
    });
  }
  el.getRow=function(iMTab){ if(iMTab<oRole.nMTab) return arrRow[iMTab]; else return null;  }
  el.getMTabInd=function(idU){
    for(var i=0;i<oRole.nMTab;i++){
      if(oRole.MTab[i].idUser==idU) return i;
    }
    return NaN;
  }

  el.toManyMess=createElement('div').myText(langHtml.toManyMess).hide();

  var tHeadLabel=el.tHeadLabel=tHeadLabelCreator(oRole).css({'text-align':'center'});
  
  var tBody=createElement("tbody");  el.tBody=tBody;
  var table=createElement('table').css({background:'#fff', margin:'0em auto 0em'}).addClass('tableDiv');
  el.table=table; 
  table.append(el.tHeadLabel,tBody);
  
  el.myAppend(table,el.toManyMess);

  return el;
}


var viewTableCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'table';}
  el.setUp=function(){
    var indRole=Number(charRole=='s'), oRole=ORole[indRole];  elRole=ElRole[indRole];
    spanLab.css({background:oRole.strColor});
    var strTmp=langHtml[indRole?'Sellers':'Buyers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(charRole);
    ElRole[indRole].show(); //.setUp();
    ElRole[1-indRole].hide();
  }

  var elRole;
  var ElRole=[];   for(var i=0;i<2;i++){ElRole[i]=tableCreator(ORole[i]); }
  var divCont=createElement('div').addClass('contDiv').myAppend(...ElRole);
  el.ElRole=ElRole;
  

      // divFoot
  var buttonBack=createElement('button').css({'margin-left':'0.8em'}).addClass('fixWidth').on('click', historyBack).myText(strBackSymbol);

  var tmpf=function(){
    //var i=oRole.ind;  ViewColumnSelector[i].setVis(); doHistPush({view:ViewColumnSelector[i]});
    viewColumnSelector.setVis();  doHistPush({view:viewColumnSelector});
  };
  //var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var buttShowSelect=createElement('button').css({'margin-left':'0.8em'}).prop('title',langHtml.AddRemoveColumns).addClass('fixWidth').on('click', tmpf).myAppend('⚙');

  var roleToggler=roleTogglerCreator(el).css({'margin':'0 auto', padding:'0px', display:'flex'}); if(boIE) roleToggler.css({display:''});
  
  el.filterButton=filterButtonCreator().css({'margin-left':'0.8em'});
  
  var tmpImg=createElement('img').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(tmpImg, langHtml.Table, spanRole).addClass('footDivLabel');
  var divFoot=createElement('div').addClass('footDiv').myAppend(buttonBack, roleToggler, el.filterButton, spanLab); //, buttShowSelect
  
  el.append(divCont, divFoot);

  el.css({'text-align':'left', display:"flex", "flex-direction":"column"});
  return el;
}




/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Greeting
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var viewGreetingCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'chat';}
  el.initMyWebPush=function(){ 
    
    app.myWebPush=new MyWebPush();

    myWebPush.uploadFun=function(){ 
      var vec=[['setWebPushSubcription',{strSubscription: JSON.stringify(myWebPush.subscription)}], ['setupById', {Role:['buyer', 'seller']}]];   majax(vec);
    }
    myWebPush.cbFun=function(err, elSpan){
      if(err) console.log(err);
      SpanInpWebPushToggle.Span.forEach(ele=>ele.myCBAny(err));
      if(typeof elSpan!='undefined' && typeof elSpan.myCB!='undefined') elSpan.myCB();
    }
    var setOpponentNLoadTabStart=function(){ // Called with postMessage from serviceWorker
      var {objSender, iRole, message, tSent, latlngSender}=data;
      var {displayName}=objSender;
      //mapDiv.setOpponent(latlngSender, 1);
      var o1=mapDiv.getMapStatus(), {pC}=o1;
      var boRefresh=mapDiv.setTile(o1.zoom);
      
      var objTmp=makeMarkerBubble({text:displayName+' says:\n'+message, color:ORole[iRole].strColor});
      mapDiv.setOpponent(data, objTmp.url); 
      mapDiv.elImgOpponent.toggle(1);
      
      var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
      var vec=[['setUpCond',{CharRole:'bs', OFilt:OFilt}], ['setUp',o1], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
      
      var arrRole=[]; if(userInfoFrDB.buyer) arrRole.push('buyer'); if(userInfoFrDB.seller) arrRole.push('seller');
      if(arrRole.length) vec.unshift(['setupById', {Role:arrRole}]);
      
      //var arrRole=[]; if(userInfoFrDB.buyer) arrRole.push('buyer'); if(userInfoFrDB.seller) arrRole.push('seller');
      //var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
      //var vec=[['setupById', {Role:arrRole}], ['setUpCond',{CharRole:'bs', OFilt:OFilt}], ['setUp',o1], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
      
      majax(vec);
      setMess('',null,true);
    }

    window.cbOnSWMessage=function(dataT){
      data=dataT;
      var dist=history.distToGoal(viewFront);
      if(dist){  history.funOverRule=setOpponentNLoadTabStart; history.fastBack(viewFront,1); } 
      else setOpponentNLoadTabStart();
    }
    if(myWebPush.boPushSupported) registerSW();

  }
  el.setUp=function(idUserT, iRoleT){ // Called when pushing button leading to this view
    idUser=idUserT; iRole=iRoleT;
    butSendMess.prop({disabled:Boolean(strGeoErrCode)});
    var strMess='';
    if(strGeoErrCode) strMess='Geolocation must be enabled and work. ('+strGeoErrCode+', '+strGeoErrMessage+')';
    divDisabledMess.toggle(Boolean(strGeoErrCode)).myText(strMess);
  }
  el.setUpB=function(){ // Called in setVis
    butSendMess.disabled=true;  elText.value=''; elText.focus();
    //clearTimeout(timerButSendDelay); timerButSendDelay=setTimeout(function(){butSendMess.disabled=false; imgSendMessTimer.hide();},5000);
    clearTimeout(timerButSendDelay); countButSendDelay=boDbg?2:3; spanSendMessTimer.myText(countButSendDelay.toString()).show();
    timerButSendDelay=setInterval(function(){
      countButSendDelay--; spanSendMessTimer.myText(countButSendDelay.toString()); if(countButSendDelay==0){butSendMess.disabled=false; spanSendMessTimer.hide(); clearTimeout(timerButSendDelay);}
    },1000);
  }
  
  var timerButSendDelay=null, countButSendDelay;
  var data;
  var idUser=null, iRole=null;

  var elText=createElement('textarea');
  //var imgSendMessTimer=createElement('img').prop('src',uBusy).css({'margin-left':'.4em', zoom:0.9});
  var spanSendMessTimer=createElement('span').css({'margin-left':'.4em', zoom:0.9});
  var butSendMess=createElement('button').myAppend('sendMess', spanSendMessTimer).prop({disabled:false}).on('click', function(){
    if(!elText.value) {setMess('empty text',5); return;}
    var vec=[['sendNotification',{idReceiver: idUser, iRole:iRole, message:elText.value, latlngSender:mapDiv.latlngMe}]];   majax(vec);
    history.back();
  }).css({display:'block'});
  var divDisabledMess=createElement('div').css({'background':'lightgrey'});

  //.cssChildren({'margin':'1em 0em 1em 0.6em'});;
   

  var divCont=createElement('div').addClass('contDiv').myAppend(elText, butSendMess, divDisabledMess);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', historyBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var divFoot=createElement('div').myAppend(buttonBack).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * LoadTab-callbacks
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var firstAJAXCall=function(latlngFirst){ // Called after first geosuccess
  var setUpRet=function(data){
    var zoomLevel;  if('zoom' in data) zoomLevel=data.zoom;
    var boRefresh=mapDiv.setTile(zoomLevel);
  }
  mapDiv.setMe(latlngFirst, 1);
  
    // If opponent exist then focus on him
  var boOpponent='latlngSender' in objMess;
  if(boOpponent) {
    var {objSender, iRole, message, tSent, latlngSender}=objMess;
    var {displayName}=objSender;
    latlngFirst=latlngSender;
    var objTmp=makeMarkerBubble({text:displayName+' says:\n'+message, color:ORole[iRole].strColor});
    //mapDiv.setOpponent(latlngFirst, objTmp.url);
    mapDiv.setOpponent(objMess, objTmp.url);
  }
  mapDiv.elImgOpponent.toggle(boOpponent);
  
  var pC=merProj.fromLatLngToPoint(latlngFirst);
  var rect=mapDiv.getBoundingClientRect(), VPSizeT=[rect.width,rect.height];

  var o1={pC:pC, VPSize:VPSizeT};
  var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
  var vec=[['getSetting',{Var:[]},viewAdmin.setUp], ['setupById', {}], ['VSetPosCond',pC],
    ['setUpCond',{CharRole:'bs', OFilt:OFilt}], ['setUp',o1,setUpRet], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];  //'boShowTeam'
  majax(vec);
  setMess('',null,true);
}
app.myGeoWatchId=null
app.geoCB=function(pos){
  console.log('geoCB');
  var latlng={lat:pos.coords.latitude, lng:pos.coords.longitude}; if(boVideo) latlng=latlngDebug;
  mapDiv.setMe(latlng, 1);
  var o1=mapDiv.getMapStatus(), {pC}=o1;
  var boB=userInfoFrDB.buyer.boShow, boS=userInfoFrDB.seller.boShow;
  var boShowAny=boB||boS, boShowBoth=boB&&boS;    if(boShowBoth) console.log('boB && boS ????');
  if(myGeoWatchId && (!boShowAny || !boGeoWatch)) {navigator.geolocation.clearWatch(myGeoWatchId); myGeoWatchId=null; return; }
  var charRole=''; if(boB) charRole='b'; else if(boS) charRole='s';
  if(charRole.length==0) {  return; }
  
  var vec=[['RShow', {x:pC.x, y:pC.y, charRole}]]; majax(vec);
}
app.loadTabStart=function(boSetupById=0){ // Called when mapDiv becomes idle(boSetupById=1), when filter changes, and when pink/blue buttons are clicked on viewFront
  ga('send', 'event', 'tab', 'loadTab');
  var o1=mapDiv.getMapStatus(); // pC, zoom, VPSize

  var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
  var vec=[['setUpCond',{CharRole:'bs', OFilt:OFilt}], ['setUp',o1], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
  if(boSetupById){
    var arrRole=[]; if(userInfoFrDB.buyer) arrRole.push('buyer'); if(userInfoFrDB.seller) arrRole.push('seller');
    if(arrRole.length) vec.unshift(['setupById', {Role:arrRole}]);
  }
  majax(vec);
  setMess('',null,true);
}

var uploadPosNLoadTabStart=function(pos, hideTimer, oRole){ // Called when butShow is clicked
  var {charRole}=oRole;
  var latlng={lat:pos.coords.latitude, lng:pos.coords.longitude}; if(boVideo) latlng=latlngDebug;
  mapDiv.setMe(latlng, 1);
  var o1=mapDiv.getMapStatus(), {pC}=o1;
  var boRefresh=mapDiv.setTile(o1.zoom);
  
  var arrRole=[]; if(userInfoFrDB.buyer) arrRole.push('buyer'); if(userInfoFrDB.seller) arrRole.push('seller');
  
  if(window.navigator.onLine){
    var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
    var vec=[['RUpdate',{hideTimer: hideTimer, charRole}], ['RShow', {x:pC.x, y:pC.y, charRole}],  // copySome(o1, oRole, ['charRole'])],
      ['setupById', {Role:arrRole}], ['setUpCond',{CharRole:'bs', OFilt:OFilt}], ['setUp',o1], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
    majax(vec);
    setMess('... uploading ...',null,true);
  }else{
    if(swRegistration && 'sync' in swRegistration){
      swRegistration.sync.register(JSON.stringify({url:uBE, vec:[['RShow',{x:pC.x, y:pC.y, charRole}]]}));
      setMess('waiting for sync');
    } else setMess('offline');
  }
    
}



app.majax=function(vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  //vecIn.push(['CSRFCode',CSRFCode]);
  vecIn.push(['CSRFCode',getItem('CSRFCode')]);
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else { var dataOut=JSON.stringify(vecIn); }
  
  xhr.onload=function () {
    var dataFetched=this.response;
    //var data; try{ data=JSON.parse(this.response); }catch(e){ setMess(e);  return; }
    var data=deserialize(this.response);
    
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
  busyLarge.show();
}



  
var beRet=function(data){
  for(var key in data){
    window[key].call(this,data[key]);
  }
  busyLarge.hide();
}


window.GRet=function(data){
  if('curTime' in data) curTime=data.curTime;
  if('strMessageText' in data) {var strMess=data.strMessageText, tmp=strMess.length?'Server: ':''; setMess(tmp+strMess,10); if(/error/i.test(strMess)) navigator.vibrate(100);}
  //if('CSRFCode' in data) CSRFCode=data.CSRFCode;
  if('CSRFCode' in data) setItem('CSRFCode',data.CSRFCode);
  if('sessionLoginIdP' in data) sessionLoginIdP=data.sessionLoginIdP;
  //var WBD=[]; tmp=data.boSpecialistWannaBe; if(typeof tmp!="undefined") {
  //    for(var key in tmp){   if(boSpecialistWannaBe[key]==tmp[key]) {delete tmp[key];} else {boSpecialistWannaBe[key]=tmp[key]; }  } mainLoginInfo.setStat(); WBD=tmp; }
  var tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }  if(tmp.buyer) viewFront.QuickDiv[0].setUp();  if(tmp.seller) viewFront.QuickDiv[1].setUp(); }
  if('nBuyerReal' in data) window.nBuyerReal=data.nBuyerReal;
  if('nSellerReal' in data) window.nSellerReal=data.nSellerReal;

  //var err=myWebPush.init(boSubscribed); if(err) { console.log(err); setMess(err); throw err; }

  toggleSpecialistButts();
  mainLoginInfo.setStat();
  
  
  var boB=userInfoFrDB.buyer.boShow, boS=userInfoFrDB.seller.boShow;
  var boShowAny=boB||boS, boShowBoth=boB&&boS;    if(boShowBoth) console.log('boB && boS ????');
  if(boShowAny  && !myGeoWatchId && boGeoWatch) { myGeoWatchId=navigator.geolocation.watchPosition(geoCB, geoError, {timeout:20000,maximumAge:60000}); }
  if(myGeoWatchId && (!boShowAny || !boGeoWatch)) {navigator.geolocation.clearWatch(myGeoWatchId); myGeoWatchId=null; }

  //var boE=Boolean(userInfoFrDB.seller);

  if(boFirstLoadTab) {
    viewFront.setVis();
  }

  /*if(userInfoFrDB.seller){  //check for changes in the fineprint
    var tmp=agreementStart.compareLocalDates(1);  if(!tmp.boFirst && tmp.boNew) { agreementStart.setLocalDates(1); agreementStart.openFunc(); }
  }  */
}

window.errFunc=function(data){ resetMess(10); navigator.vibrate(100); }

var getListRet=function(data){
  viewFront.filterButton.setUp(data.NTotNFilt);
  viewTable.filterButton.setUp(data.NTotNFilt);

  for(var i=0;i<ORole.length;i++){
    viewFilter.FilterInfoSpan[i].setRatio(data.NTotNFilt[i]);
    
    ORole[i].MTab=tabNStrCol2ArrObj(data.arrList[i]);
    ORole[i].nMTab=ORole[i].MTab.length;
  }
  
}
var getGroupListRet=function(data){
  var boGroupAny=0, boGroupBoth=1;
  for(var i=0;i<2;i++){
    var boGroupTmp=Boolean(data.arrGroup[i].tab.length);
    boGroupAny=boGroupAny||boGroupTmp;
    boGroupBoth=boGroupBoth&&boGroupTmp;
    
    var elTabRoleTmp=viewTable.ElRole[i];    elTabRoleTmp.toManyMess.toggle(boGroupTmp);       //tmp.querySelector('table').toggle(!boGroupTmp);
    elTabRoleTmp.tHeadLabel.setUpCurrencyInfo();    elTabRoleTmp.setCell();    elTabRoleTmp.setRowDisp();    elTabRoleTmp.tHeadLabel.setArrow('tPos',-1);
    if(boGroupTmp) {
      ORole[i].MGroupTab=data.arrGroup[i].tab;
      mapDiv.ArrMarker[i].hideMarkers();
      mapDiv.ElImgGroupOverlay[i].setGroupOverlay(); mapDiv.ElImgGroupOverlay[i].drawGroupOverlay();
      
    } else{
      mapDiv.ArrMarker[i].setMarkers();  mapDiv.ArrMarker[i].drawMarkers();
      mapDiv.ElImgGroupOverlay[i].hideGroupOverlay();
    }
  }
  var tmp=boGroupBoth?('\n ('+langHtml.toManyMess+')'):'';
  viewFront.tableButton.prop({disabled:boGroupBoth, title:langHtml.ComparisonTable+tmp});  viewFront.tableButton.querySelector('img').css({opacity:boGroupBoth?0.4:1});
  
  mapDiv.drawMe();
  mapDiv.drawOpponent();
  boFirstLoadTab=0;
}

var getHistRet=function(data){
  for(var i=0;i<ORole.length;i++) {
    viewFilter.ElRole[i].interpretHistPHP(data.arrHist[i])
    viewFilter.ElRole[i].update();
  }
};


app.strGeoErrCode='';
app.strGeoErrMessage='';
var geoError=function(errObj) {
  var str='';
  var strCode='';
  if(typeof errObj == 'string') str=errObj;
  else {
    if(errObj.code==errObj.PERMISSION_DENIED){
      strCode='PERMISSION_DENIED';
      str="geoLocation: PERMISSION_DENIED";
    }else if(errObj.code==errObj.POSITION_UNAVAILABLE){
      strCode='POSITION_UNAVAILABLE';
      str="getCurrentPosition failed: "+strCode+', '+errObj.message;
    }else if(errObj.code==errObj.TIMEOUT){
      strCode='TIMEOUT';
      str="getCurrentPosition failed: "+strCode+', '+errObj.message;
    }
    boGeoOK=false; setItem('boGeoOK',boGeoOK);

  }
  var strB='';
  if(browser.brand=='mozilla' && strCode!='PERMISSION_DENIED') strB=', Firefox might need Wifi to be on'; //langHtml.worksBetterWithWifi;
  if(browser.brand=='opera' && strCode!='PERMISSION_DENIED') strB=', Opera might need Wifi to be on';
  if(strCode=='POSITION_UNAVAILABLE') {
    if(boTouch)      strB=', Android: check that sharing of wifi-positioning / gps is enabled on your device.';
    else strB=', Wifi might need to be on.';
  }
  //if(boTouch && strCode=='TIMEOUT' && !boAndroid) strB=', Android: Geolocation stops working every once in a while (A bug). Try reboot the device.';
  //if(boTouch && strCode=='TIMEOUT' && boAndroid) {strB='Android: To use your exact location, you have to reboot your device. Read more in the FAQ.'; }
  //if(boTouch && strCode=='TIMEOUT' && boAndroid) {str=''; strB='Android user: GeoLocation is not working! Reboot your device might solve the problem. Read more in the FAQ.'; } //speciale

  var strB='';
  setMess(str+' '+strB);
  mapDiv.boGeoStatSucc=0;
  app.strGeoErrCode=strCode;
  app.strGeoErrMessage=errObj.message;
}

/********************************************************************************************************************
 ********************************************************************************************************************/


window.elHtml=document.documentElement;  window.elBody=document.body
elHtml.css({height:'100%'});
elBody.css({height:'100%', margin:0, padding:0, padding:'0 0 0 0', margin:'0 0 0 0', 'text-align':'center'});


var browser=getBrowser();
window.boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;

var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
window.boAndroid = uaLC.indexOf("android") > -1;
window.boFF = uaLC.indexOf("firefox") > -1;
//boIE = uaLC.indexOf("msie") > -1;
var versionIE=detectIE();
window.boIE=versionIE>0; if(boIE) browser.brand='msie';

window.boChrome= /chrome/i.test(uaLC);
window.boIOS= /iPhone|iPad|iPod/i.test(uaLC);
window.boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround
window.boUCBrowser = 0;

window.boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

window.boReallySmall=0;
if(boTouch){
  if(boIOS) {
    var tmp={"-webkit-overflow-scrolling":"touch", "overflow":"hidden", height:'100%', overflow:'hidden'};
    elBody.css(tmp);  elHtml.css(tmp);
  } 
}

var dr=window.devicePixelRatio; // dr=Math.round(dr); //dr=2; //alert(dr);  //Settings text: "Use hardware resolution for the map"
var drLev=log2(dr);
drLev=Math.floor(drLev); //drLev=0;
dr=Math.pow(2,drLev);

//if(typeof URLSearchParams!='undefined') {
  //searchParams = new URLSearchParams(window.location.search);
  //window.boEmulator=searchParams.get('boEmulator');    window.startFilter=searchParams.get('idTeam');
//} else {
  //console.log('This browser does not support URLSearchParams');
  //window.boEmulator=null;    window.startFilter=null;
//}
//var objMess={}; if(window.location.hash) {
  //var jsonHash=decodeURIComponent(window.location.hash.substr(1));
  //objMess=JSON.parse(jsonHash);
  //console.log(jsonHash);
//}
window.interpretHashVariables=function(){
  var strHash=window.location.hash||"&",  params=parseQS(strHash.substring(1));
  //window.boEmulator=params.boEmulator||null;
  window.StartFilter=[params.idTeamB||null, params.idTeamS||null];   window.boVideo=params.boVideo||null;
  window.objMess={}; if('jsonMess' in params) {
    try {objMess=JSON.parse(params.jsonMess);} catch(e){ setMess(e);  return; }
  }
}
interpretHashVariables();

var strBackSymbol=(boIOS || boIE)?'◄':'◀';

var WCMIN=0, WCMAX=256, WCMID=WCMAX/2;
var TILESIZE=256/dr, TILESIZEHALF=TILESIZE/2;

//var uMapSourceDir='http://otile1.mqcdn.com/tiles/1.0.0/map';
var uMapSourceDir='http://c.tile.openstreetmap.org';


var boHistoryOK=1, tmp='';
if(!('pushState' in history)) { boHistoryOK=0; }
if(!('state' in history)) { boHistoryOK=0; tmp=".state"; }
if(!boHistoryOK) {tmp="This browser doesn't support the history"+tmp+" object, and this is really killing me.... aaahhhhhggggg....";  alert(tmp); return;}

if(!navigator.geolocation) { alert('This browers does not support geolocation '); return;}

if(!(typeof sessionStorage=='object' && sessionStorage.getItem)) {alert("Your browser doesn't support sessionStorage"); return;}

//boTouch=true;

//if(boVideo) boTouch=true;

assignSiteSpecific();
console.log('boDbg='+boDbg);

app.ORole=site.ORole;
//var [oB,oS]=site.ORole;
//app.oB=site.oB; app.oS=site.oS;
[app.oB, app.oS]=ORole;

var objLong={fb:'Facebook',google:"Google",idplace:"idPlace"};
var strIPPrimLong=objLong[strIPPrim];
var strIPAltLong=objLong[strIPAlt];


var Match=RegExp("^[^/]+").exec(site.wwwSite),    domainName=Match[0];

var strScheme='http'+(boTLS?'s':''),    strSchemeLong=strScheme+'://',    uSite=strSchemeLong+site.wwwSite,    uBE=uSite+"/"+leafBE;
app.uCommon=strSchemeLong+wwwCommon;
var uCanonical=uSite;

var uConversion=uSite+'/conversion.html';
//var uTeamImage=uSite+'/image/t';
//var uSellerImage=uSite+'/image/s';
app.uUserImage=uSite+'/image/u';
app.uBuyerTeamImage=uSite+'/image/b';
app.uSellerTeamImage=uSite+'/image/s';
app.URoleTeamImage=[uBuyerTeamImage, uSellerTeamImage];

app.wseImageFolder='/'+flImageFolder+'/';
app.uImageFolder=uCommon+wseImageFolder;
app.uSleepy=uImageFolder+'sleepy.png';
app.uDummy=uImageFolder+'dummy.png';

app.uHelpFile=uImageFolder+'help.png';
app.uVipp0=uImageFolder+'vipp0.png';
app.uVipp1=uImageFolder+'vipp1.png';
app.uFb22=uImageFolder+'fb22.png';
app.uGoogle22=uImageFolder+'google22.jpg';
app.uIdplace22=uImageFolder+'idPlaceOrg64Login.png';
app.uFb=uImageFolder+'fb68.png';
app.uGoogle=uImageFolder+'google69.jpg';
app.uIdplace=uImageFolder+'idPlaceOrg64Login.png';
app.uIncreasing=uImageFolder+'increasingFlip.png';
app.uDecreasing=uImageFolder+'decreasingFlip.png';
//uUnsorted=uImageFolder+'unsortedFlip.png';
app.uUnsorted='';
app.uBusy=uImageFolder+'busy.gif';
app.uBusyLarge=uImageFolder+'busyLarge.gif';
app.uList16=uImageFolder+'list16.png';
//app.uSetting1=uImageFolder+'setting1.png';
app.uFilter=uImageFolder+'filter.png';
app.uEqualizer=uImageFolder+'equalizer.png';
app.uMapm1=uImageFolder+'mapm1.png';
app.uMapm2=uImageFolder+'mapm2.png';
app.uColumn16=uImageFolder+'column16.png';
app.uMarkerMe=uImageFolder+'markerMe.gif';
app.uMarkerOpponent=uImageFolder+'markerOpponent.gif';
app.uOnePixTransparent=uImageFolder+'dummy.png';
//uTogButPinkBlue=uImageFolder+'toggleButtonVerticalPinkBlueBlack.png';
app.uTogVertical=uImageFolder+'toggleButtonVerticalBlack.png';
app.uTogVertical=uImageFolder+'toggleButtonVerticalGreenGrey.png';
app.uTogVertical=uImageFolder+'toggleButtonVerticalGreenGreyNoFrame.png';
app.uWheel3Sprite=uImageFolder+'wheel3Sprite.png';



var uWiki='https://closeby.market';

//uMapSourceDir='http://otile1.mqcdn.com/tiles/1.0.0/map';
var uMapSourceDir='https://c.tile.openstreetmap.org';


var oVersion=getItem('version'); app.boNewVersion=version!==oVersion;        setItem('version',version);


langClientFunc();


window.PlugIn=[];
var rewriteProg=function(){
  for(var i=0;i<site.StrPlugInNArg.length;i++){
    var nameT=site.StrPlugInNArg[i], n=nameT.length, charRoleUC=nameT[n-1]; if(charRoleUC=='B' || charRoleUC=='S') {nameT=nameT.substr(0, n-1);} else charRoleUC='';
    PlugIn[i]=new CreatorPlugin[nameT](charRoleUC);
  }
};

rewriteProg();


   //
   // Make changes to langHtml
   //

   // Create ucfirst versions
var StrMakeUCase=['seller', 'sellers', 'buyer', 'buyers', 'column', 'visible', 'show'];
for(var i=0;i<StrMakeUCase.length;i++){var name=StrMakeUCase[i]; langHtml[ucfirst(name)]=ucfirst(langHtml[name]); }


   // Store vanilla version
var StrStoreVanilla=['seller', 'sellers', 'Seller', 'Sellers', 'theSeller', 'theSellers', 'theSellers0', 'IndependentSeller'];
for(var i=0;i<StrStoreVanilla.length;i++){var name=StrStoreVanilla[i]; langHtml[name+'Vanilla']=langHtml[name]; }

   // Let plugins rewrite langHtml
for(var i=0;i<PlugIn.length;i++){  var tmp=PlugIn[i].rewriteLang; if(tmp) tmp();   }

//langHtml.prop.histActive.label=langHtml.prop.histActive.label.replace(/<span><\/span>/,lenHistActive);
//langHtml.helpBub.histActive=langHtml.helpBub.histActive.replace(/<span><\/span>/,lenHistActive);



var regNom=new RegExp("<span nom=\"([^\"]+)\">.*?</span>",'g');
var nomFunc=function(m,n){return langHtml[n]};
//var nomFunc=function(m,n){return "<span nom="+n+">"+langHtml[n]+"</span>"};
var replaceNom=function(parent,strName){
  parent[strName]=parent[strName].replace(regNom,nomFunc);
}
//replaceNom(langHtml.prop.label,'standingByMethod');
replaceNom(langHtml.prop.standingByMethod,'label');


replaceNom(langHtml.helpBub,'link');
//replaceNom(langHtml.helpBub,'tPos');
replaceNom(langHtml.helpBub,'shiftEnd');
//replaceNom(langHtml.helpBub,'donatedAmount');

replaceNom(langHtml,'SellerSettings');
replaceNom(langHtml,'BuyerSettings');
//replaceNom(langHtml,'SellerLogin'); // Not used
replaceNom(langHtml,'AppearAsBuyer');
replaceNom(langHtml,'AppearAsSeller');
replaceNom(langHtml,'FilterTitle');
replaceNom(langHtml,'ToggleBetweenBuyerAndSeller');
//replaceNom(langHtml,'gettingStartedLink');
replaceNom(langHtml,'toManyMess');
//replaceNom(langHtml,'SeeUnActivePopMess');
replaceNom(langHtml,'writeComplaintPopup');
replaceNom(langHtml,'introHeadB');
replaceNom(langHtml,'introHeadS');
replaceNom(langHtml,'LoginSingInAsSeller');

replaceNom(langHtml,'FilterB');
replaceNom(langHtml,'FilterS');
replaceNom(langHtml,'TableB');
replaceNom(langHtml,'TableS');

//replaceNom(langHtml,'DummiesShowingMess');


replaceNom(langHtml,'headOrdinalB');
//replaceNom(langHtml,'headOrdinalDoubleB');
//if(langHtml.buyerRewritten!=langHtml.buyer)  langHtml.headOrdinalB=langHtml.headOrdinalDoubleB;
//if(langHtml.buyerVanilla!=langHtml.buyer)  langHtml.headOrdinalB=langHtml.headOrdinalDoubleB;
replaceNom(langHtml,'labOrdinalB');

replaceNom(langHtml,'headOrdinalS');
//replaceNom(langHtml,'headOrdinalDoubleS');
//if(langHtml.sellerRewritten!=langHtml.seller)  langHtml.headOrdinalS=langHtml.headOrdinalDoubleS;
//if(langHtml.sellerVanilla!=langHtml.seller)  langHtml.headOrdinalS=langHtml.headOrdinalDoubleS;
replaceNom(langHtml,'labOrdinalS');

replaceNom(langHtml,'ChangeMapMarkersB');
replaceNom(langHtml,'ChangeMapMarkersS');

//langHtml.RoleRewritten=[langHtml.buyerRewritten||langHtml.buyer, langHtml.sellerRewritten||langHtml.seller];
langHtml.Role=[langHtml.buyer, langHtml.seller];

langHtml.DidYouUseAltIPBefore=langHtml.DidYouUseAltIPBefore.replace(regNom,strIPAltLong);


for(var i=0;i<ORole.length;i++){
  let oRole=ORole[i];
  if(boTouch) oRole.ColsShowDefault=oRole.ColsShowDefaultS;
  if(boReallySmall) oRole.ColsShowDefault=oRole.ColsShowDefaultRS;
  if(boShowTeam==0) { arrValRemove(oRole.ColsShowDefault,'idTeam');}
  oRole.ColsShow=[]; oRole.ColsShowCurrency=[];

  let tmpColOneMark='colOneMark'+oRole.charRoleUC, tmpColsShow='ColsShow'+oRole.charRoleUC;
  let {colOneMarkDefault, ColsShowDefault}=oRole;
  if(boNewVersion) { setItem(tmpColOneMark, colOneMarkDefault);  setItem(tmpColsShow, ColsShowDefault);}
  let colOneMark=getItem(tmpColOneMark);    if(colOneMark===null) colOneMark=colOneMarkDefault;
  let ColsShow=getItem(tmpColsShow);   if(ColsShow===null) ColsShow=[].concat(ColsShowDefault);
  if(oRole.Main.StrProp.indexOf(colOneMark)==-1) colOneMark=colOneMarkDefault; setItem(tmpColOneMark, colOneMark);
  intersectionAB(ColsShow, oRole.Main.StrProp);   setItem(tmpColsShow, ColsShow);
  extend(oRole, {colOneMark:colOneMark, ColsShow:ColsShow});
}

app.boMultCurrency=0;


var sessionLoginIdP={};
app.userInfoFrDB=extend({}, specialistDefault);

//var CSRFCode='';

app.curTime=0;


app.currencies=[['UAE Dirham','Afghani','Lek','Armenian Dram','Netherlands Antillean Guilder','Kwanza','Argentine Peso','Australian Dollar','Aruban Florin','Azerbaijanian Manat','Convertible Mark','Barbados Dollar','Taka','Bulgarian Lev','Bahraini Dinar','Burundi Franc','Bermudian Dollar','Brunei Dollar','Boliviano','Mvdol','Brazilian Real','Bahamian Dollar','Ngultrum','Pula','Belarussian Ruble','Belize Dollar','Canadian Dollar','Congolese Franc','WIR Euro','Swiss Franc','WIR Franc','Unidades de fomento','Chilean Peso','Yuan Renminbi','Colombian Peso','Unidad de Valor Real','Costa Rican Colon','Peso Convertible','Cuban Peso','Cape Verde Escudo','Czech Koruna','Djibouti Franc','Danish Krone','Dominican Peso','Algerian Dinar','Egyptian Pound','Nakfa','Ethiopian Birr','Euro','Fiji Dollar','Falkland Islands Pound','Pound Sterling','Lari','Ghana Cedi','Gibraltar Pound','Dalasi','Guinea Franc','Quetzal','Guyana Dollar','Hong Kong Dollar','Lempira','Croatian Kuna','Gourde','Forint','Rupiah','New Israeli Sheqel','Indian Rupee','Iraqi Dinar','Iranian Rial','Iceland Krona','Jamaican Dollar','Jordanian Dinar','Yen','Kenyan Shilling','Som','Riel','Comoro Franc','North Korean Won','Won','Kuwaiti Dinar','Cayman Islands Dollar','Tenge','Kip','Lebanese Pound','Sri Lanka Rupee','Liberian Dollar','Loti','Lithuanian Litas','Latvian Lats','Libyan Dinar','Moroccan Dirham','Moldovan Leu','Malagasy Ariary','Denar','Kyat','Tugrik','Pataca','Ouguiya','Mauritius Rupee','Rufiyaa','Kwacha','Mexican Peso','Malaysian Ringgit','Mozambique Metical','Namibia Dollar','Naira','Cordoba Oro','Norwegian Krone','Nepalese Rupee','New Zealand Dollar','Rial Omani','Balboa','Nuevo Sol','Kina','Philippine Peso','Pakistan Rupee','Zloty','Guarani','Qatari Rial','New Romanian Leu','Serbian Dinar','Russian Ruble','Rwanda Franc','Saudi Riyal','Solomon Islands Dollar','Seychelles Rupee','Sudanese Pound','Swedish Krona','Singapore Dollar','Saint Helena Pound','Leone','Somali Shilling','Surinam Dollar','South Sudanese Pound','Dobra','El Salvador Colon','Syrian Pound','Lilangeni','Baht','Somoni','Turkmenistan New Manat','Tunisian Dinar','Pa´anga','Turkish Lira','Trinidad and Tobago Dollar','New Taiwan Dollar','Tanzanian Shilling','Hryvnia','Uganda Shilling','US Dollar','Peso Uruguayo','Uzbekistan Sum','Bolivar Fuerte','Dong','Vatu','Tala','CFA Franc BEAC','East Caribbean Dollar','CFA Franc BCEAO','CFP Franc','Yemeni Rial','Rand','Zambian Kwacha','Zimbabwe Dollar',],
['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BOV','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHE','CHF','CHW','CLF','CLP','CNY','COP','COU','CRC','CUC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','FKP','GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LTL','LVL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','SSP','STD','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VEF','VND','VUV','WST','XAF','XCD','XOF','XPF','YER','ZAR','ZMK','ZWL',],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,3,2,0,2,3,0,2,2,2,0,2,0,3,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,0,0,2,0,2,0,0,2,2,2,2,]
];



var imgBusy=createElement('img').prop({src:uBusy});
//var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)
var divMessageText=divMessageTextCreate().css({margin:'0em auto', width:'100%', 'max-width':'800px', 'text-align':'center', position:'relative'});
var divMessageTextW=createElement('div').myAppend(divMessageText).css({width:'100%', position:'fixed', bottom:'0px', left:'0px', 'z-index':'2'});
  //.addClass('mainDiv'); 
elBody.append(divMessageTextW);
window.setMess=divMessageText.setMess;  window.resetMess=divMessageText.resetMess;  window.appendMess=divMessageText.appendMess;

//var busyLarge=createElement('img').prop({src:uBusyLarge}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
var busyLarge=createElement('img').prop({src:uBusyLarge}).addClass("Center").hide();
elBody.append(busyLarge);


app.merProj=new MercatorProjection();

var tmp=getItem('boFirstVisit'),  boFirstVisit=tmp===null;      setItem('boFirstVisit',0);

app.imgHelp=createElement('img').prop({src:uHelpFile}).css({'vertical-align':'-0.4em', 'margin-left':'0.6em'});
app.hovHelp=createElement('span').myText('?').css({'font-size':'88%',color:'#a7a7a7','vertical-align':'-0.4em'}); //on('click', function(){return false;})    //'pointer-events':'none',
app.hovHelpMy=createElement('span').myText('?').addClass('btn-round').css({color:'white', background:'blue'}); //on('click', function(){return false;})    //'pointer-events':'none',

//elBody.append(hovHelpMy);

for(var i=0;i<ORole.length;i++){
  ORole[i].KeyCol=Object.keys(ORole[i].Prop);
  let nCol=ORole[i].KeyCol.length;
  ORole[i].colsFlip=array_flip(ORole[i].KeyCol);
  ORole[i].helpBub={};
  for(var j=0;j<nCol;j++){
    var strName=ORole[i].KeyCol[j], text='';
    if(strName in langHtml.helpBub)  text=langHtml.helpBub[strName];
    if(text!='') { ORole[i].helpBub[strName]=createElement('div').myHtml(text);  }
  }
  ORole[i].Label=extend({},langHtml.prop);
}

var h1=elBody.querySelector('h1:nth-of-type(1)').detach();
h1.css({background:'#ff0', "box-sizing":"border-box", border:'solid 1px',color:'black','font-size':'1.6em','font-weight':'bold','text-align':'center',
    padding:'0.4em 0em 0.4em 0em',margin:'0em auto', 'max-width':'800px', width:'100%'});
//h1.css({'border-top':'1px solid black'});


  //
  // History
  //
  
var strHistTitle=site.wwwSite;

var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateMem={hash:randomHash(), ind:tmpi};
history.replaceState(stateMem, '', uCanonical);
history.StateMy=[];

window.on('popstate', function(event) {
  if(!history.state) {
    interpretHashVariables(); setUpStartFilter();
    stateMem.ind++; history.replaceState(stateMem, '', uCanonical);
    return;
  }
  var dir=history.state.ind-stateMem.ind;
  //if(Math.abs(dir)>1) {debugger; alert('dir=',dir); }
  var boSameHash=history.state.hash==stateMem.hash;
  if(boSameHash){
    var tmpObj=history.state;
    if('boResetHashCurrent' in history && history.boResetHashCurrent) {
      tmpObj.hash=randomHash();
      history.replaceState(tmpObj, '', uCanonical);
      history.boResetHashCurrent=false;
    }

    var stateMy=history.StateMy[history.state.ind];
    if(typeof stateMy!='object' ) {
      var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy)+', history.state.ind:'+history.state.ind+', history.StateMy.length:'+history.StateMy.length+', Object.keys(history.StateMy):'+Object.keys(history.StateMy);
      if(!boEpiphany) alert(tmpStr); else  console.log(tmpStr);
      debugger;
      return;
    }
    var view=stateMy.view;
    view.setVis();
    if(typeof view.getScroll=='function') {
      var scrollT=view.getScroll();
      setTimeout(function(){window.scrollTop(scrollT);}, 1);
    } else {
      //var scrollT=stateMy.scroll;  setTimeout(function(){  window.scrollTop(scrollT);}, 1);
    }
    
    if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
    else{
      if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
    }

    stateMem=extend({}, tmpObj);
  }else{
    stateMem=history.state; extend(stateMem, {hash:randomHash()}); history.replaceState(stateMem, '', uCanonical);
    history.go(sign(dir));
  }
});
if(boFF){
  window.on('beforeunload', function(){   });
}
//window.on('beforeunload', function(){  console.log("beforeunload"); });


//oAJAX={
  //url:uBE,
  //global: false,
  //type: "POST",
  //dataType:'json',
  //contentType:'application/json',
  //processData:false,
  //success: beRet,
  //error: function(jqXHR, textStatus, errorThrown){
    //setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
  //}
//};
var oAJAX={};


  //filter colors
//colButtAllOn='#9f9'; colButtOn='#0f0'; colButtOff='#ddd'; colFiltOn='#bfb'; colFiltOff='#ddd'; colFontOn='#000'; colFontOff='#777'; colActive='#65c1ff'; colStapleOn='#f70'; colStapleOff='#bbb';
//maxStaple=20;
window.objFilterSetting={colButtAllOn:'#9f9', colButtOn:'#0f0', colButtOff:'#ddd', colFiltOn:'#bfb', colFiltOff:'#ddd', colFontOn:'#000', colFontOff:'#777', colActive:'#65c1ff', colStapleOn:'#f70', colStapleOff:'#bbb', maxStaple:20};
app.arrDivAdditionalCurrency=[];

//elBody.querySelector('body>div:not(:last-of-type)').detach();
elBody.querySelector('body>div').detach();
elBody.css({visibility:'visible',background:''});



var pa=createElement('p').myText(langHtml.WaitingForYourPosition);
var pb=createElement('p').myText('('+langHtml.WaitingForYourPositionHelp+')');
var startPop=createElement('div').myAppend(pa,pb);
if(!boTouch) startPop=startPopExtend(startPop); else  startPop=startPopExtendTouch(startPop);
var startPopTimer=null;
//if(boTouch && boIOS) startPop.openFunc(); else startPopTimer=setTimeout(startPop.openFunc,1000);

//agreementStart=agreementStartCreator();
//if(boFirstVisit) agreementStart.setLocalDates(1);

var noOneIsVisibleToast=noOneIsVisibleToastCreator().css({padding:'0.5em','text-align':'center',left:'50%',width:'12em','margin-left':'-6em','z-index':6});
elBody.append(noOneIsVisibleToast);


  // Main divs not having its own history state
  // and a div that moves around: ListCtrlDiv
  // and an other big div: mapDiv
var mainLoginInfo=mainLoginInfoCreator();  mainLoginInfo.css({'font-size':'75%', flex:'0 0 auto', margin:'0.4em auto','line-height':'1.6em'});

app.MainIntroPop=[]; app.ListCtrlDiv=[];
for(var i=0;i<ORole.length;i++){
  MainIntroPop[i]=mainIntroPopCreator(ORole[i]);
  ListCtrlDiv[i]=listCtrlCreator(ORole[i]).css({display:'inline-block','float':'right'});
}
[app.mainIntroPopB, app.mainIntroPopS]=MainIntroPop;  [app.listCtrlDivB, app.listCtrlDivS]=ListCtrlDiv;
app.mapDiv=mapDivCreator().css({overflow:'hidden', flex:"auto"});  // "overflow-y":"scroll", "-webkit-overflow-scrolling":"touch",


  // view divs (main divs having its own history state)
app.viewUserSetting=viewUserSettingCreator().addClass('mainDiv');
app.viewDeleteAccountPop=viewDeleteAccountPopCreator();
app.viewUploadImage=viewUploadImageCreator();
app.viewAdmin=viewAdminCreator().addClass('mainDiv');

app.viewComplainee=viewComplaineeCreator().addClass('mainDiv');
app.viewComplainer=viewComplainerCreator().addClass('mainDiv');
app.viewComplaintCommentPop=viewComplaintCommentPopCreator().css({border:'1px solid #000'});
app.viewComplaintAnswerPop=viewComplaintAnswerPopCreator().css({border:'1px solid #000'});

app.viewFormLogin=viewFormLoginCreator().addClass('mainDiv').css({'text-align':'left'});

app.viewConvertID=viewConvertIDCreator().addClass('mainDiv');
app.viewCreateUser=viewCreateUserCreator().addClass('mainDiv').css({'text-align':'left'});
app.viewChangePWPop=viewChangePWPopCreator().css({'text-align':'left'});
app.viewForgottPWPop=viewForgottPWPopCreator().css({'text-align':'left'});
app.viewSettingEntry=viewSettingEntryCreator().addClass('mainDiv');
app.viewFront=viewFrontCreator().addClass('mainDiv');

app.viewColumnSorter=viewColumnSorterCreator().addClass('mainDiv');
app.viewColumnSelector=viewColumnSelectorCreator().addClass('mainDiv');
app.viewTable=viewTableCreator().addClass('mainDiv').css({'max-width':'none'});
app.viewMarkSelector=viewMarkSelectorCreator().addClass('mainDiv');
app.viewFilter=viewFilterCreator().addClass('mainDiv');  //,'padding-bottom':'0.6em'
app.viewSetting=viewSettingCreator().addClass('mainDiv');
  
app.ViewTeam=[];  //ViewSetting=[];
//ViewFilter=[]; //ViewColumnSelector=[]; //ViewColumnSorter=[]; ViewTable=[];
app.ViewEntry=[];
app.ViewInfo=[]; // ViewMarkSelector=[];
for(var i=0;i<ORole.length;i++){
  ViewTeam[i]=viewTeamCreator(ORole[i]).addClass('mainDiv');
  ViewEntry[i]=viewEntryCreator(ORole[i]).addClass('mainDiv');
  ViewInfo[i]=viewInfoCreator(ORole[i]).addClass('mainDiv');
}
//[viewSettingB,viewSettingS]=ViewSetting;
[app.viewTeamB, app.viewTeamS]=ViewTeam;
//[viewFilterB, viewFilterS]=ViewFilter;   //[viewColumnSelectorB, viewColumnSelectorS]=ViewColumnSelector;   //[viewColumnSorterB, viewColumnSorterS]=ViewColumnSorter;
//[viewTableB, viewTableS]=ViewTable;
[app.viewEntryB, app.viewEntryS]=ViewEntry;
[app.viewInfoB, app.viewInfoS]=ViewInfo;  // [viewMarkSelectorB, viewMarkSelectorS]=ViewMarkSelector;

app.viewGreeting=viewGreetingCreator().addClass('mainDiv');
viewGreeting.initMyWebPush();

   // Let plugins rewrite objects
for(var i=0;i<PlugIn.length;i++){  var tmp=PlugIn[i].rewriteObj; if(tmp) tmp();   }

window.setUpStartFilter=function(){
  for(var i=0;i<ORole.length;i++){
    var idTeam=StartFilter[i]; if(idTeam===null) return;
    var StrOrderFilt=ORole[i].filter.StrProp, StrOrderFiltFlip=array_flip(StrOrderFilt);
    myCopy(viewFilter.ElRole[i].Filt[StrOrderFiltFlip.idTeam], [[],[Number(idTeam)],1]);
  }
}

viewUserSetting.createDivs();
for(var i=0;i<ORole.length;i++){
  viewSetting.ElRole[i].createDivs();
  viewFilter.ElRole[i].createDivs();
  //var tmpStartFilter=ORole[i].strRole=='buyer'?startFilterB:startFilterS;
  //if(tmpStartFilter){
    //var StrOrderFilt=ORole[i].filter.StrProp, StrOrderFiltFlip=array_flip(StrOrderFilt);
    //myCopy(viewFilter.ElRole[i].Filt[StrOrderFiltFlip.idTeam], [[],[Number(tmpStartFilter)],1]);
  //}

  viewTable.ElRole[i].createTBody();   viewTable.ElRole[i].setRowDisp();

  ViewInfo[i].createContainers();
  //ViewColumnSelector[i].createTable();
  viewColumnSelector.ElRole[i].createTable();
  viewMarkSelector.ElRole[i].createTable();
  MainIntroPop[i].createDivs();
}
setUpStartFilter();

//if(typeof StrMainProt=='undefined') var StrMainProt=[];
StrMainProt.push('front', 'userSetting', 'admin', 'complainee', 'complainer', 'formLogin', 'createUser', 'convertID', 'settingEntry', 'deleteAccountPop', 'complaintCommentPop', 'complaintAnswerPop', 'uploadImage', 'changePWPop', 'forgottPWPop', 'columnSorter', 'columnSelector', 'table', 'markSelector', 'filter', 'setting', 'greeting');

//if(typeof StrMainProtRole=='undefined') var StrMainProtRole=[];
StrMainProtRole.push( 'info', 'entry', 'team');

var MainDiv=[];
for(var i=0;i<StrMainProt.length;i++){ var key='view'+ucfirst(StrMainProt[i]); MainDiv.push(window[key]); }
for(var i=0;i<StrMainProtRole.length;i++){ var key='view'+ucfirst(StrMainProtRole[i]);  MainDiv.push(window[key+'B']); MainDiv.push(window[key+'S']); }



history.StateMy[history.state.ind]={view:viewFront};


MainDiv.forEach(ele=>ele.hide());
elBody.append(...MainDiv);

viewFront.show();

var DivTopMain=[mainLoginInfo];  if(!boTouch) DivTopMain.push(h1);

var scalableTog=function(boOn){ return;
  if(typeof boOn=='undefined') boOn=document.body.style.opacity!=0.9999;
  var floatOpacity=boOn?1:0.9999;
  var strVPContent='width=device-width, initial-scale=1, '+(boOn?'maximum-scale=4':'maximum-scale=1, user-scalable=no');
  //$('meta[name=viewport]').attr('content', strVPContent);
  document.querySelector('head>meta[name=viewport]').attr('content', strVPContent);
  document.body.style.opacity=floatOpacity;
  //setTimeout(function(){ document.body.style.opacity = 1;  }, 1);
}

viewFront.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.entryButtonW.after(...DivTopMain);
  //$('meta[name=viewport]').prop({'user-scalable':'false'});
  scalableTog(0);
  mapDiv.dispatchEvent(new Event('myResize'));
  return true;
}
viewTable.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.prepend(...DivTopMain);
  this.setUp();
  //$('meta[name=viewport]').prop({'user-scalable':'true'});
  scalableTog(1);
  return true;
}
viewFilter.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.prepend(...DivTopMain);
  this.setUp();
  scalableTog(1);
  return true;
}
viewUserSetting.setVis=function(){
  if(!userInfoFrDB.user) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewSetting.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewInfoB.setVis=
viewInfoS.setVis=function(){
  if(this.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.listCtrlDivW.append(ListCtrlDiv[this.indRole]);
  scalableTog(1);
  return true;
}
viewComplainee.setVis=function(){
  if(this.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  ListCtrlDiv[1-this.indRole].detach();
  this.listCtrlDivW.append(ListCtrlDiv[this.indRole]);
  scalableTog(1);
  return true;
}
viewComplainer.setVis=function(){
  if(this.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  scalableTog(1);
  return true;
}
viewAdmin.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  scalableTog(1);
  return true;
}
viewEntryB.setVis=
viewEntryS.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewFormLogin.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewCreateUser.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewConvertID.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewSettingEntry.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  this.prepend(...DivTopMain);
  scalableTog(1);
  return true;
}
//viewColumnSelectorB.setVis=
viewColumnSelector.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
//viewColumnSorterB.setVis=
viewColumnSorter.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
//viewMarkSelectorB.setVis=
viewMarkSelector.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewTeamB.setVis=
viewTeamS.setVis=function(){
  if(this.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  scalableTog(1);
  return true;
}
viewGreeting.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  scalableTog(1);
  this.setUpB();
  return true;
}
//viewLogin.setVis=function(){
  //MainDiv.forEach(ele=>ele.hide()); this.show();
  //scalableTog(1);
  //return true;
//}



busyLarge.show();

window.addEventListener("resize", function(){
  mapDiv.dispatchEvent(new Event('myResize'));
});


var boFirstLoadTab=1, boGeoApproved=0;

if(boVideo) {
  var latlngDebug={lat:59.330454370984235, lng:18.059076067697106};
  var posDebug={coords:{latitude:latlngDebug.lat,longitude:latlngDebug.lng}};
}

//ga('send', 'event', 'button', 'click', 'geoOK');

var boGeoWatch=getItem('boGeoWatch');  if(boGeoWatch===null) boGeoWatch=false;

var semGeoApprox=false, semGeoReal=false, boGeoOK=false;
var geoCBFirst=function(pos){
  var latlng, boCallerGeo=typeof pos=='object';
  if(boCallerGeo) {
    boGeoOK=true; setItem('boGeoOK',boGeoOK); boGeoApproved=true;  // boGeoApproved should be replaced with navigator.permissions once supported by iOS.
    latlng={lat:pos.coords.latitude, lng:pos.coords.longitude};
  } else { latlng={lat:coordApprox[0], lng:coordApprox[1]}; }
  
  if(boVideo) latlng=latlngDebug;
  if(semGeoReal) { return; }
  if(semGeoApprox) { mapDiv.setMe(latlng, 1);return;}
  clearTimeout(startPopTimer);  startPop.closeFunc();
  firstAJAXCall(latlng);
  //else mapDiv.setMe(latlng, 1);
  
  if(boCallerGeo) semGeoReal=true; else semGeoApprox=true;
}

navigator.geolocation.getCurrentPosition(geoCBFirst, geoError, {timeout:20000,maximumAge:60000});

var boGeoOK=getItem('boGeoOK');  if(boGeoOK===null) boGeoOK=false;
setTimeout(geoCBFirst,  boGeoOK?10000:2000);
boGeoOK=false; setItem('boGeoOK',boGeoOK)

//window.addEventListener('online', () => console.log('came online'));
//window.addEventListener('offline', () => console.log('came offline'));


};

//0123456789abcdef




