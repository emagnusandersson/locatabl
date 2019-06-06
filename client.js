


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
// oBuyer instead of oC
// charCamera='📷'

// does miles work
// Analytics event from clicking moreinfo link


// comparative price in info, could be displayed inside the button
// remove unnesecary label in langHtml
// test viewTeam
// delete me as customer resp delete me as driver
// Ability to see and select image in introPop


//0123456789abcdef pluginGeneral.js
"use strict"
app.CreatorPlugin.general=function(){
  
  app.strUnitDist='km';
  app.strUnitTime='h';
    // Some conveniently grouped properties
  app.StrPropPerson=['image', 'idTeam', 'displayName'];
  app.StrPropContact=['tel', 'displayEmail', 'homeTown', 'link'];
  app.StrPropPos=['dist', 'tPos', 'coordinatePrecisionM'];
  app.StrPropRep=['tCreated', 'tAccumulated', 'donatedAmount', 'nComplaint']; //, 'histActive'


  var oTmp={StrProp:[], StrGroupFirst:[], StrGroup:[]};
  var oRoleProt={ MTab:[], nMTab:0, MGroupTab:[], Main:oTmp, roleSetting:copyDeep(oTmp), filter:copyDeep(oTmp)};  // , colOneMark:"", ColsShow:[] 
  extend(oC,oRoleProt); extend(oS,copyDeep(oRoleProt));
  extend(oC,{ strColor:'pink', strGroupColor:'#fd98a9'});  
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
    viewSettingW.querySelector('#divMapMarker').insertAdjacentElement('afterend', distUnitChoiseT);

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
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.currency, {strType:'select', crInp:tmpf });
    }

      // tCreated, tLastPriceChange, tPos
    app.makeTimeF=function(iRole,strN,dir){return function(iMTab){
      var data=ORole[iRole].MTab[iMTab][strN];
      if(ORole[iRole].Prop[strN].boUseTimeDiff) data=UTC2ReadableDiff(dir*(data-curTime)); else data=UTC2Readable(data); return data;
    }; };
    for(let i=0;i<ORole.length;i++){
      var tmpF=makeTimeF(i,'tCreated',-1);    extend(ORole[i].Prop.tCreated, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
      var tmpF=makeTimeF(i,'tLastPriceChange',-1);   extend(ORole[i].Prop.tLastPriceChange, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
      var tmpF=makeTimeF(i,'tPos',-1);   extend(ORole[i].Prop.tPos, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
      var tmpF=makeTimeF(i,'tPos',-1);   extend(ORole[i].Prop.tPos, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    }

      // tAccumulated, IP
    for(let i=0;i<ORole.length;i++){
      var tmpF=function(iMTab,c){ return UTC2ReadableDiff(ORole[i].MTab[iMTab].tAccumulated); };
      extend(ORole[i].Prop.tAccumulated, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    }

      // nComplaint
    var tmpSetNComplaint=function(iMTab,c){   c.querySelector('button').mySet(iMTab);   };
    for(let i=0;i<ORole.length;i++){
      var tmpCrNComplaint=function(c){  c.append(  complaintButtonCreator(ORole[i])  ); };
      extend(ORole[i].Prop.nComplaint, { setInfo:tmpSetNComplaint, crInfo:tmpCrNComplaint, setTabF:tmpSetNComplaint, crTabF:tmpCrNComplaint});
    }

      // idTeam
    var tmpSetIdTeam=function(iMTab,c){   c.querySelector('a').mySet(iMTab);   };
    var tmpSetRowButtF=function(span,val,boOn){ span.mySet(val,boOn); }
    for(let i=0;i<ORole.length;i++){
      var tmpCrIdTeam=function(c){  c.append(  thumbTeamCreator(ORole[i])  );   };
      extend(ORole[i].Prop.idTeam, { setInfo:tmpSetIdTeam, crInfo:tmpCrIdTeam, setTabF:tmpSetIdTeam, crTabF:tmpCrIdTeam,
        setMapF:function(iMTab){
          var rT=ORole[i].MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam, tmp;
          if(data && data.length>0 && data!==0) {
            var strTmp=uSellerTeamImage+data+'?v='+tag;
            tmp = {url:strTmp, boUseFrame:true};
          } else tmp=langHtml.IndependentSeller.replace("<br>","\n");
          return tmp;
        },
        setRowButtF:tmpSetRowButtF,
        crRowButtF:function(i){ return butTeamImgCreator(ORole[i]).css({'margin-right':'0.25em'}); }
      });
    }


      // dist
    for(let i=0;i<ORole.length;i++){
      let tmpSetDist=function(iMTab){
        var rT=ORole[i].MTab[iMTab],  tmpPoint = [rT.x, rT.y],   latLngT=merProj.fromPointToLatLng(tmpPoint);
        
        var pC=mapDiv.getPWCC(), latLngMe=merProj.fromPointToLatLng(pC);
        var dist=distCalc(latLngT.lng,latLngT.lat,latLngMe.lng,latLngMe.lat);  if(strUnitDist=='mile') dist=dist/1.609;
        return Number(dist.toFixed(1));
      };
      var tmpSetDistOther=function(iMTab,c){return tmpSetDist(iMTab)+' '+strUnitDist;};
      extend(ORole[i].Prop.dist, {
        setInfo:tmpSetDistOther,
        setTabF:tmpSetDist,sortTabF:tmpSetDist,
        setMapF:tmpSetDistOther,setMapMF:tmpSetDistOther
      });
    }


      // displayName
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.displayName, {strType:'text',inpW:9});
    }

      // tel
    var tmpCrTel=function(c){  var a=createElement('a').myText(' '); c.append(a);  };
    for(let i=0;i<ORole.length;i++){
      var tmpSetTel=function(iMTab,c){  var tmp=ORole[i].MTab[iMTab].tel.trim(), a=c.querySelector('a'), boL=tmp.length>0;  a.prop({href:'tel:'+tmp}).toggle(boL);   a.firstChild.nodeValue=boL?tmp:' '; }
      extend(ORole[i].Prop.tel, {  strType:'tel',inpW:6,  setInfo:tmpSetTel, crInfo:tmpCrTel, setTabF:tmpSetTel, crTabF:tmpCrTel });
    }
    
      // displayEmail
    var tmpCr=function(c){  var a=createElement('a').myText(' '); c.append(a);  };
    for(let i=0;i<ORole.length;i++){
      var tmpSet=function(iMTab,c){var tmp=ORole[i].MTab[iMTab].displayEmail.trim(), a=c.querySelector('a'), boL=tmp.length>0;  a.prop({href:'mailto:'+tmp}).toggle(boL);  a.firstChild.nodeValue=boL?tmp:' ';  }
      extend(ORole[i].Prop.displayEmail, {  strType:'email',inpW:6, setInfo:tmpSet, crInfo:tmpCr, setTabF:tmpSet, crTabF:tmpCr });
    }

      // link
    var makeMapF=function(iRole,strName,n){return function(iMTab){var str=ORole[iRole].MTab[iMTab][strName],n=40; return str.length>n?str.substr(0,n)+'…':str;}  };
    var makeMapMF=function(iRole,strName,n){return function(iMTab){var str=ORole[iRole].MTab[iMTab][strName]; return str.length>n?str.substr(0,n)+'…':str;}  };
    var makeInfoF=function(iRole){return function(iMTab,c){
      var url=ORole[iRole].MTab[iMTab].link; if(url && !RegExp("^https?:\\/\\/").test(url)) { url='http://'+url; }
      var a=c.querySelector('a'), boL=url.length>0; a.prop({href:url}).toggle(boL);  a.firstChild.nodeValue=boL?url:' ';
    }};
    var tmpCrInfo=function(c){  var a=createElement('a').myText(' ').prop({target:"_blank"}); c.append(a);   }
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.link, { strType:'url',inpW:9, setInfo:makeInfoF(i), crInfo:tmpCrInfo, setMapF:makeMapF(i, 'link'), setMapMF:makeMapMF(i, 'link', 40-langHtml.prop.link.label.length)  });
    }

      // idFB, idIdPlace, idOpenId
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.idFB, {setMapF:makeMapF(i, 'idFB'), setMapMF:makeMapMF(i, 'idFB', 40-langHtml.prop.idFB.label.length)});
      extend(ORole[i].Prop.idIdPlace, {setMapF:makeMapF(i, 'idIdPlace'), setMapMF:makeMapMF(i, 'idIdPlace', 40-langHtml.prop.idIdPlace.label.length)});
      extend(ORole[i].Prop.idOpenId, {setMapF:makeMapF(i, 'idOpenId'), setMapMF:makeMapMF(i, 'idOpenId', 40-langHtml.prop.idOpenId.label.length)});
    }
    
      // homeTown
    for(let i=0;i<ORole.length;i++){
      extend(ORole[i].Prop.homeTown, {strType:'text',inpW:6});
    }

      // idTeamWanted
    var tmpSet=function(c){ c.setStat(); }
    var tmpSave=function(c){return [null, c.inp.value.trim()];}
    for(let i=0;i<ORole.length;i++){
      var tmpCr=function(){ var c=spanIdTeamWantedCreator(ORole[i]); return c;  }
      extend(ORole[i].Prop.idTeamWanted, {strType:'span',inpW:3, crInp:tmpCr, setInp:tmpSet, saveInp:tmpSave });
    }

      // coordinatePrecisionM
    var tmpCr=function(){
      var c=createElement('select'); for(var i=0;i<arrCoordinatePrecisionM.length;i++){ var v=arrCoordinatePrecisionM[i], op=createElement('option').prop('value',v).myText(approxDist(v)); c.append(op); }   return c;
    }
    for(let i=0;i<ORole.length;i++){
      var tmpSet=function(c){  var [bestVal, iBest]=closest2Val(arrCoordinatePrecisionM, userInfoFrDB[ORole[i].strRole].coordinatePrecisionM); c.value=bestVal;  }
      extend(ORole[i].Prop.coordinatePrecisionM, {strType:'select', crInp:tmpCr, setInp:tmpSet});
    }

      // image
    app.calcImageUrl=function(rT){ // Keys of rT: ["idUser", "boImgOwn", "imTag", "image"]
      var tmp='',  boImgOwn=Number(rT.boImgOwn);
      if(boImgOwn  || rT.image.length==0) tmp=uUserImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image;
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
        }]];   majax(oAJAX,vec);
      });
      var uploadCallback=function(){
        userInfoFrDB.user.boImgOwn=1; userInfoFrDB.user.imTag=randomHash(); var tmp=calcImageUrlUser(); thumb.attr({src:tmp.str}); c.butDeleteImg.toggle(tmp.boImgOwn);
      }
      var buttUploadImage=createElement('button').myText(langHtml.uploadNewImg).on('click', function(){viewUploadImage.openFunc('u',uploadCallback);});
      c.append(c.thumb, c.butDeleteImg, buttUploadImage);  //langHtml.YourImage+': ',
      return c;
    };
    var tmpSetInp=function(c){
      var tmp=calcImageUrlUser();
      c.butDeleteImg.toggle(tmp.boImgOwn);
      c.thumb.prop({src:tmp.str});
    };
    var tmpSaveInp=function(){return [null,null];}
    var tmpCrImage=function(c){ c.append(createElement('img'));  };
    for(let i=0;i<ORole.length;i++){
      var tmpSetImage=function(iMTab,c){ c.querySelector('img').prop({src:calcImageUrl(ORole[i].MTab[iMTab])});  };
      extend(ORole[i].Prop.image, {  strType:'span',  crInp:tmpCrInp, setInp:tmpSetInp, saveInp:tmpSaveInp, setInfo:tmpSetImage, crInfo:tmpCrImage,
        sortTabF:function(iMTab){return ORole[i].MTab[iMTab].idUser;},
        setTabF:tmpSetImage,
        crTabF:tmpCrImage,
        setMapF:function(iMTab){     return {url:calcImageUrl(ORole[i].MTab[iMTab]), boUseFrame:true};  },
        setMapMF:function(iMTab){return false;}
      });
    }

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
    langHtml.sellerRewritten=langHtml.driver;
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
    var tmpSetVehicleType=function(iMTab,c){     c.querySelector('span').mySet(Number(  oS.MTab[iMTab].vehicleType  ));    };
    var tmpSetVehicleTypeM=function(iMTab){
      var MTab=oS.MTab;
      var data=MTab[iMTab].vehicleType, strName=enumVehicleType[MTab[iMTab].vehicleType];
      var tmp; if(MTab[iMTab].tPos<curTime-snoreLim) tmp=vehSpriteZ; else tmp=vehSpriteW;
      //if(MTab[iMTab].idUser<=3) tmp=vehSpriteDummy;
      //if(MTab[iMTab].displayName=='Dummy') tmp=vehSpriteDummy;
      if(MTab[iMTab].displayName.match(/^Dummy/)) tmp=vehSpriteDummy;
      var item=tmp.item[strName];
      var zT=tmp.zoom, wSc=Math.ceil(zT*item.w), hSc=Math.ceil(zT*item.h), wSSc=zT*tmp.sheetW, hSSc=zT*tmp.sheetH;
      return {url:tmp.url, size:{width:item.w, height:item.h}, origin:{x:item.x, y:item.y}, anchor:{x:item.w/2, y:item.h}, scaledSize:{width:wSSc, height:hSSc}, zoom:zT};
    };
    var tmpSetVehicleTypeMM=function(iMTab){return langHtml.vehicleType[enumVehicleType[oS.MTab[iMTab].vehicleType]];};
    var tmpCrVehicleType=function(c){   c.append(  spriteCreator(vehSprite)  );   };
    extend(oS.Prop.vehicleType, {
      crInp:function(){ var c=selSpriteCreator(vehSprite); return c; },
      setInp:function(c){ c.mySet(userInfoFrDB.seller.vehicleType); },
      saveInp:function(c){return [null, c.myGet()];},
      setInfo:tmpSetVehicleType,crInfo:tmpCrVehicleType,
      setTabF:tmpSetVehicleType,crTabF:tmpCrVehicleType,
      setMapF:tmpSetVehicleTypeM, setMapMF:tmpSetVehicleTypeMM,
      crRowButtF:function(i){ var span=spriteCreator(vehSprite);    span.mySet(i);  return span;},
      setRowButtF:function(span,val,boOn){   span.mySet(val);  var opacity=boOn?1:0.4; span.querySelector('img').css({opacity: opacity});  }
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
  
  if(typeof StrMainProt=='undefined') StrMainProt=[]; StrMainProt.push('comparePriceDataPop');
  
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
      doHistBack();
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
    var buttCancel=createElement('button').on('click', doHistBack).myText(langHtml.Cancel);
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
    var elButPricePref=createElement('button').myAppend(el.elSpan).on('click',function(){viewComparePriceDataPop.openFunc(function(){ ComparePriceButSpan.tmpPrototype.setUpAll(); if(func) func();} ); return false;});
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
          var strName=ele.attr('name'), tmpObj=(strName in oS.Prop)?oS.Prop[strName]:{};
          var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,ele);  else tmp=oS.MTab[iMTab][strName];
          removeChildren(ele);
          ele.myText(tmp);
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
      var tmpU=viewSetting.ElRole[1].querySelector('[name=strUnitDist]').css({'float':'none'});   tmpU.parentNode.remove();
      var tmpPPD=viewSetting.ElRole[1].querySelector('[name=pricePerDist]'); tmpPPD.parentNode.empty().myAppend(langHtml.PricePer+' ',tmpU,tmpPPD);
    };

      // priceStart
    extend(oS.Prop.priceStart, {strType:'number',inpW:4});
      // pricePerDist
    var tmpSetPricePerDist=function(iMTab){ var tmp=(strUnitDist=='mile'?1.609:1) * oS.MTab[iMTab].pricePerDist;  return Number(tmp.toFixed(2));};
    var tmpSetPricePerDistStr=function(iMTab){return tmpSetPricePerDist(iMTab)+'/'+strUnitDist;};
    extend(oS.Prop.pricePerDist, {
      strType:'number',inpW:4,
      setInfo:tmpSetPricePerDistStr,
      setTabF:tmpSetPricePerDist,sortTabF:tmpSetPricePerDist,
      setMapF:tmpSetPricePerDistStr,setMapMF:tmpSetPricePerDistStr
    });
      // pricePerHour
    extend(oS.Prop.pricePerHour, { strType:'number',inpW:4 });
      // strUnitDist
    var tmpSetUnitDist=function(iMTab,c){c.querySelector('button').firstChild.nodeValue='('+Number(comparePrice.dist).toFixed(2)+' '+strUnitDist+', '+comparePrice.time+' '+langHtml.timeUnit.min[3]+')';};
    extend(oS.Prop.strUnitDist, {
      strType:'select',
      crInp:function(){  return createElement('select').myAppend(  createElement('option').myText('km').prop('value',0), createElement('option').myText('mile').prop('value',1)  );  },
      setInfo:tmpSetUnitDist
    });
      // comparePrice
    var calcComparePrice=function(iMTab){
      var divisor=strUnitTime=='min'?60:1, rT=oS.MTab[iMTab]; return Number(rT.priceStart)  +tmpSetPricePerDist(iMTab)*comparePrice.dist  +rT.pricePerHour/divisor*comparePrice.time;
    };
    var tmpSetComparePriceOneLineWOCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return Number(tmp.toFixed(2)); };
    var tmpSetComparePriceOneLineWCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return oS.MTab[iMTab].currency+' '+Number(tmp.toFixed(2)); };
    //var tmpSetComparePrice=function(boTryTwoLine){ return function(iMTab){
      //var rT=oS.MTab[iMTab], tmp=calcComparePrice(iMTab);
      //var boTwoLine=(oS.ColsShow.indexOf('image')!=-1) && boTryTwoLine,  strSep=boTwoLine?'<br>':' ';
      //return (boMultCurrency?rT.currency+strSep:'')+Number(tmp.toFixed(2));
    //}};
    var tmpSetComparePriceSort=function(iMTab){ var rT=oS.MTab[iMTab], tmp=calcComparePrice(iMTab); return rT.currency+' '+Number(tmp.toFixed(2)); };
    var tmpCrComparePriceTwoLine=function(c){  var s=createElement('span').css({'margin-right':'0.4em'});  c.append(  s, s.cloneNode()  ); };
    var tmpSetComparePriceTwoLine=function(iMTab,ele){
      var rT=oS.MTab[iMTab], flPrice=calcComparePrice(iMTab);
      var s0=ele.childNodes[0], s1=ele.childNodes[1]; 
      s0.myText(rT.currency);  s1.myText(Number(flPrice.toFixed(2)));
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


      // Add ComparePriceButSpan to viewSettingW
    var comparePriceButSpan=new ComparePriceButSpan("(<span name=dist> </span> <span name=distUnit> </span>, <span name=time> </span> <span name=timeUnit> </span>)"); comparePriceButSpan.querySelector('button').prepend(langHtml.comparePrice.head+' ');
    comparePriceButSpan.css({display:'block','margin':'1em 0em 1em 0.6em'});
    viewSettingW.divCont.querySelector('#divMapMarker').insertAdjacentElement('afterend', comparePriceButSpan);

  };
};
//0123456789abcdef





//0123456789abcdef pluginPrice.js
"use strict"
app.CreatorPlugin.price=function(){
  this.rewriteObj=function(){}
};
//0123456789abcdef

//0123456789abcdef pluginTransportCustomer.js
"use strict"
app.CreatorPlugin.transportCustomer=function(){
  this.rewriteObj=function(){
    var tmpSet=function(iMTab,c){  return oC.MTab[iMTab].distStartToGoal+' km ('+oC.MTab[iMTab].compassPoint+')'; }
    extend(oC.Prop.distStartToGoal, {
      setInfo:tmpSet,
      setTabF:tmpSet,
      setMapF:tmpSet
    });
    
    
  }
};
//0123456789abcdef


//0123456789abcdef pluginStandingByMethod.js
"use strict"
app.CreatorPlugin.standingByMethod=function(){
  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // standingByMethod
    var tmpSet=function(iMTab,c){  return langHtml.standingByMethodsLong[Number(  oS.MTab[iMTab].standingByMethod  )]; }
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
      setMapF:function(iMTab,c){  return langHtml.standingByMethodsLong[Number(  oS.MTab[iMTab].standingByMethod  )]; },
      setRowButtF:function(span,val,boOn){ var tmp=langHtml.standingByMethodsLong[val]; span.firstChild.nodeValue=tmp;  }
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
    var tmpSetShiftEnd=makeTimeF(oS.ind,'shiftEnd',1);
    oS.Prop.shiftEnd.boUseTimeDiff=1;
    var tmp = butTimeStampCreator(oS.ind, 'shiftEnd').css({padding:'0.3em 0.5em'});    viewTable.ElRole[1].tHeadLabel.querySelector('[name=shiftEnd]').append(tmp);
    viewFilter.ElRole[1].Unit.shiftEnd=langHtml.timeUnit.h[1];

    extend(oS.Prop.shiftEnd, {strType:'select',
      crInp:function(){  var c=createElement('select'); for(var i=0;i<225;i++){ var o=createElement('option').myText(' '); c.append(o); }   return c; },
      setInp:function(c){
        var d=new Date(); d.setMilliseconds(0); d.setSeconds(0); var tmp= Math.round(d.getMinutes()/15);  d.setMinutes(tmp*15);
        var d=d.valueOf(); //alert(d);  alert(Date(d));
        [...c.querySelectorAll('option')].forEach(function(ele, i){
          var dv=d+i*15*60*1000, dt=new Date(dv);
          var str=dt.toLocaleTimeString(); str=str.replace(/(\d\d):00/,'$1');
          //ele.myText(str).prop('value',dv/1000);
          ele.value=(dv/1000).toString(); ele.firstChild.nodeValue=str;
        });
        //if(typeof userInfoFrDB.seller=='array' && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
        if(userInfoFrDB.seller instanceof Array && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
          var tmp="option[value='"+userInfoFrDB.seller.shiftEnd+"']";
          //var opttmp=c.querySelector(tmp);   if(opttmp.length==1) opttmp.prop('selected', 'selected');
          c.querySelector(tmp).prop('selected', 'selected');
        }
      },
      setInfo:tmpSetShiftEnd,
      sortTabF:tmpSetShiftEnd, setTabF:tmpSetShiftEnd,
      setMapF:tmpSetShiftEnd,setMapMF:tmpSetShiftEnd
    });

    // oS.Prop.shiftEnd.feat.minName[0]='0';
    oS.Prop.shiftEnd.feat.bucketLabel[0]='-';        // Rewrite filterDiv range label
  }
};
//0123456789abcdef


//0123456789abcdef pluginHourlyPrice.js
"use strict"
app.CreatorPlugin.hourlyPrice=function(charRoleUC){
  var oRole=charRoleUC=='C'?oC:oS;
  
  this.rewriteObj=function(){
      // pricePerHour
    var tmpSet=function(iMTab){ var rT=oRole.MTab[iMTab], tmp=Number(rT.pricePerHour); return rT.currency+' '+Number(tmp.toFixed(2)); };
    //var tmpSetComparePriceTryTwoLine=function(iMTab){
      //var rT=oRole.MTab[iMTab], tmp=Number(rT.pricePerHour);
      //var boTwoLine=(oRole.ColsShow.indexOf('image')!=-1),  strSep=boTwoLine?'<br>':' ';      return rT.currency+strSep+Number(tmp.toFixed(2));
    //}
    var tmpCrComparePriceTwoLine=function(c){  var s=createElement('span').css({'margin-right':'0.4em'});  c.append(  s, s.cloneNode()  ); };
    var tmpSetComparePriceTwoLine=function(iMTab,ele){
      var rT=oRole.MTab[iMTab], flPrice=Number(rT.pricePerHour);
      var s0=ele.childNodes[0], s1=ele.childNodes[1]; 
      s0.myText(rT.currency);  s1.myText(Number(flPrice.toFixed(2)));
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
  var {StrTransportCustomer}=oC;  // ['distStartToGoal','compassPoint','destination']
  
  
    // oRole.Main: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson),
  [].concat('Contact', 'tel', 'displayEmail', 'link'),
  [].concat('Destination', 'distStartToGoal','destination', 'price', 'currency'),
  [].concat('RequestedVehicle', StrPropE),
  [].concat('Price', 'price', 'currency', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'standingByMethod', 'shiftEnd', 'idDriverGovernment'),
  [].concat('Vehicle', 'vehicleType', 'brand', StrPropE, 'nExtraSeat'),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
    
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', 'tel', 'displayEmail', 'link', 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('Destination', StrTransportCustomer),
  [].concat('Vehicle', StrPropE),
  [].concat('Price', 'currency', 'price')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'idDriverGovernment', 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM'),
  [].concat('Vehicle', 'vehicleType', StrPropE, 'brand', 'nExtraSeat'),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', StrPropE, 'tPos'),
  [].concat('Destination', 'distStartToGoal', 'compassPoint', 'destination'),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'standingByMethod', 'currency', 'tPos', 'shiftEnd'),
  [].concat('Vehicle', 'vehicleType', StrPropE, 'brand', 'nExtraSeat'),
  [].concat('Reputation', StrPropRep)]);

  
    // Default columns
  oC.ColsShowDefault= ['image', 'distStartToGoal', 'compassPoint', 'destination', 'idTeam', 'price'];
  oC.ColsShowDefaultS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oC.ColsShowDefaultRS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oC.colOneMarkDefault='image';
  
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
    extend(oS.Prop.idDriverGovernment, {strType:'text',inpW:6});
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
  var {StrTransportCustomer}=oC;  // ['distStartToGoal','compassPoint','destination']
 

  //var StrTransportBool=['generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer'];
  var StrTransportBool=site.StrTransportBool;
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson),
  [].concat('Contact', 'tel', 'displayEmail', 'link'),
  [].concat('Destination', 'distStartToGoal','destination', 'price', 'currency'),
  [].concat('RequestedVehicle', StrPropE),
  [].concat('Price', 'price', 'currency', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'standingByMethod', 'shiftEnd'),
  [].concat('Vehicle', 'vehicleType', StrPropE),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', 'tel', 'displayEmail', 'link', 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('Destination', StrTransportCustomer),
  [].concat('Cargo', StrPropE),
  [].concat('Price', 'currency', 'price')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM'),
  [].concat('Vehicle', 'vehicleType', StrPropE),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'tPos'),
  [].concat('Cargo', StrPropE),
  [].concat('Destination', 'distStartToGoal', 'compassPoint', 'destination'),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'standingByMethod', 'currency', 'tPos', 'shiftEnd'),
  [].concat('Vehicle', 'vehicleType', StrPropE),
  [].concat('Reputation', StrPropRep)]);

    // Default columns
  oC.ColsShowDefault= ['image', 'distStartToGoal', 'compassPoint', 'destination', 'idTeam', 'price'];
  oC.ColsShowDefaultS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oC.ColsShowDefaultRS= ['image', 'distStartToGoal', 'compassPoint', 'idTeam', 'price'];
  oC.colOneMarkDefault='image';
  
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
    var tmpRowButtf=function(span,val,boOn){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };
    for(let i=0;i<ORole.length;i++){
      var tmpSetBool=function(iMTab,ele){
        var data=ORole[i].MTab[iMTab][ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
        ele.css({'background':colT});
        return Number(data)?langHtml.Yes:'-';
      }
      for(var j=0;j<StrTransportBool.length;j++) {
        var strName=StrTransportBool[j];
        var tmpSetMap=function(iMTab){ return Number(ORole[i].MTab[iMTab][strName])?langHtml.Yes:langHtml.No; };
        extend(ORole[i].Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBool, setTabF:tmpSetBool, setMapF:tmpSetMap,setMapMF:tmpSetMap, setRowButtF:tmpRowButtf });
      }
    }
      // brand
    extend(oS.Prop.brand, {strType:'text', inpW:6});
      // payload
    var tmp={strType:'number', inpW:3, saveInp:posNumF}; extend(oC.Prop.payload, tmp); extend(oS.Prop.payload, tmp);
  }
};
//0123456789abcdef


//0123456789abcdef pluginCleaner.js
"use strict"
app.CreatorPlugin.cleaner=function(){
  var StrC=oC.StrPropE;  // ['household','janitor','sanitation', 'exterior','customerHasEquipment']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson),
  [].concat('Contact', StrPropContact),
  [].concat('Type', StrC),
  [].concat('Price', 'pricePerHour', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'vehicleType', 'shiftEnd'),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('Type', StrC),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'shiftEnd', 'coordinatePrecisionM', 'vehicleType'),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos'),
  [].concat('Type', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'shiftEnd', 'vehicleType', 'tPos'),
  [].concat('Reputation', StrPropRep)]);
  
  
    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', StrC, 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', StrC, 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', StrC, 'pricePerHour');
  oC.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,2); // Arg: dist, time

    // images
  var strPlugin='cleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.cleaner;
    //langHtml.loginInfo.seller=langHtml.cleaner;
    //langHtml.Seller=ucfirst(langHtml.cleaner);
    //langHtml.Sellers=ucfirst(langHtml.cleaners);
    //langHtml.IndependentSeller=langHtml.IndependentCleaner;

    //langHtml.seller=langHtml.cleaner;   langHtml.sellers=langHtml.cleaners;
    //langHtml.theSeller=langHtml.theCleaner;   langHtml.theSellers=langHtml.theCleaners;
    //langHtml.theSellers0=langHtml.theCleaners0;
  };
  this.rewriteObj=function(){
      // StrC
    var tmpSetBool=function(iMTab,ele){
      var data=oC.MTab[iMTab][ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function(span,val,boOn){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };

    for(var i=0;i<StrC.length;i++) {
      var strName=StrC[i];
      var tmpSetMap=makeSetMapF(oC, strName);
      extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBool, setTabF:tmpSetBool, setMapF:tmpSetMap,setMapMF:tmpSetMap, setRowButtF:tmpRowButtf });
    }
  };
};
//0123456789abcdef


//0123456789abcdef pluginWindowcleaner.js
"use strict"
app.CreatorPlugin.windowcleaner=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson, StrC),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'pricePerHour', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'vehicleType'),
  [].concat('Tools', StrS),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('Other', StrC),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType'),
  [].concat('Tools', StrS),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'vehicleType', 'tPos'),
  [].concat('Tools', StrS),
  [].concat('Reputation', StrPropRep)]);
  
    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', StrC, 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', StrC, 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', StrC, 'pricePerHour');
  oC.colOneMarkDefault='image';

  oS.ColsShowDefault=[].concat('image', 'displayName', StrS, 'tel', 'vehicleType', 'idTeam', 'comparePrice');
  oS.ColsShowDefaultS=[].concat('image', 'displayName', StrS, 'vehicleType', 'comparePrice');
  oS.ColsShowDefaultRS=[].concat('image', StrS, 'vehicleType', 'comparePrice');
  oS.colOneMarkDefault='vehicleType';


  viewComparePriceDataPop.setDefault(10,2); // Arg: dist, time

    // images
  var strPlugin='windowcleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.windowcleaner;
  };

  this.rewriteObj=function(){

      // For boolean properties
    var makeSetBoolF=function(oRole){ return function(iMTab,ele){
      var data=oRole.MTab[iMTab][ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function(span,val,boOn){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };

      // customerHasEquipment
    var strName='customerHasEquipment', tmpSetMap=makeSetMapF(oC, strName);
    extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
      // nWindow
    extend(oC.Prop.nWindow, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // StrS
    for(var i=0;i<StrS.length;i++) {
      var strName=StrS[i], tmpSetMap=makeSetMapF(oS, strName);
      extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
  };
};
//0123456789abcdef

//0123456789abcdef pluginLawnmower.js
"use strict"
app.CreatorPlugin.lawnmower=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice'],   ['pushMower','ridingMower', 'edger']
  
      // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson, StrC),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'pricePerHour', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'vehicleType', StrS),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM', StrC),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType', StrS),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'vehicleType', 'tPos', StrS),
  [].concat('Reputation', StrPropRep)]);

    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', StrC, 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', StrC, 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', StrC, 'pricePerHour');
  oC.colOneMarkDefault='image';

  oS.ColsShowDefault=[].concat('image', 'displayName', 'tel', 'vehicleType', StrS, 'idTeam', 'comparePrice');
  oS.ColsShowDefaultS=[].concat('image', 'displayName', 'vehicleType', StrS, 'comparePrice');
  oS.ColsShowDefaultRS=[].concat('image', 'displayName', 'vehicleType', oS.StrBool, 'comparePrice');
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='lawnmower';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.lawnmower;
  };

  this.rewriteObj=function(){

      // For boolean properties
    var makeSetBoolF=function(oRole){ return function(iMTab,ele){
      var data=oRole.MTab[iMTab][ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function(span,val,boOn){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };

      // customerHasEquipment
    var strName='customerHasEquipment', tmpSetMap=makeSetMapF(oC, strName);
    extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
      // area
    extend(oC.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // oS.StrBool
    for(var i=0;i<oS.StrBool.length;i++) {
      var strName=oS.StrBool[i], tmpSetMap=makeSetMapF(oS, strName);
      extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
      // cuttingWidth
    extend(oS.Prop.cuttingWidth, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


//0123456789abcdef pluginSnowremoval.js
"use strict"
app.CreatorPlugin.snowremoval=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson, oC.StrBool, 'area'),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'pricePerHour', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'vehicleType', oS.StrBool),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM', oC.StrBool, 'area'),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'coordinatePrecisionM', oS.StrBool, 'vehicleType'),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'tPos'),
  [].concat('Tools', 'vehicleType', StrS),
  [].concat('Reputation', StrPropRep)]);
  
    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', oC.StrBool, 'area', 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', oC.StrBool, 'area', 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', oC.StrBool, 'area', 'pricePerHour');
  oC.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', oS.StrBool, 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', oS.StrBool, 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', oS.StrBool, 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='snowremoval';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  app.uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.snowRemovalWorker;
    //langHtml.loginInfo.seller=langHtml.snowShoveler;
    //langHtml.Seller=ucfirst(langHtml.snowShoveler);
    //langHtml.Sellers=ucfirst(langHtml.snowShovelers);
    //langHtml.IndependentSeller=langHtml.IndependentSnowShoveler;

    //langHtml.seller=langHtml.snowShoveler;   langHtml.sellers=langHtml.snowShovelers;
    //langHtml.theSeller=langHtml.theSnowShoveler;  langHtml.theSellers=langHtml.theSnowShovelers;
    //langHtml.theSellers0=langHtml.theSnowShoveler0;
  };

  this.rewriteObj=function(){
    
      // oC.StrBool, oS.StrBool
    var makeSetBoolF=function(oRole){ return function(iMTab,ele){
      var data=oRole.MTab[iMTab][ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function(span,val,boOn){   span.firstChild.nodeValue=Number(val)?langHtml.Yes:langHtml.No;   };

    for(var i=0;i<oC.StrBool.length;i++) {
      var strName=oC.StrBool[i], tmpSetMap=makeSetMapF(oC, strName);
      extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
    for(var i=0;i<oS.StrBool.length;i++) {
      var strName=oS.StrBool[i], tmpSetMap=makeSetMapF(oS, strName);
      extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
      // area
    extend(oC.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


//0123456789abcdef pluginFruitpicker.js
"use strict"
app.CreatorPlugin.fruitpicker=function(){
  var StrC=oC.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson, StrC),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'pricePerHour', 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson, 'experience', 'vehicleType'),
  [].concat('Contact', StrPropContact),
  [].concat('Price', 'currency', StrDistTimePrice, 'tLastPriceChange'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM', StrC),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'experience', 'coordinatePrecisionM', 'vehicleType'),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'tPos', 'vehicleType'),
  [].concat('Reputation', StrPropRep)]);
  
    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', 'fruit', 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', 'fruit', 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', 'fruit', 'pricePerHour');
  oC.colOneMarkDefault='fruit';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  oS.colOneMarkDefault='vehicleType';

  viewComparePriceDataPop.setDefault(10,8); // Arg: dist, time
  
    // images
  var strPlugin='fruitpicker';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.picker;
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
    extend(oC.Prop.fruit, {strType:'text', inpW:6});

  }
};
//0123456789abcdef

//0123456789abcdef pluginProgrammer.js
"use strict"
app.CreatorPlugin.programmer=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  
  var StrProgrammerLang=oS.StrProgrammerLang;

    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, viewColumnSelector, tHeadLabel, TableDiv
  oC.Main=separateGroupLabels([
  [].concat('Customer', StrPropPerson),
  [].concat('Contact', StrPropContact),
  [].concat('RequestedSkills', StrC),
  [].concat('Price', 'pricePerHour'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  oS.Main=separateGroupLabels([
  [].concat('Seller', StrPropPerson),
  [].concat('Contact', StrPropContact),
  [].concat('Languages', StrS),
  [].concat('Price', 'currency', 'pricePerHour'),
  [].concat('Position', StrPropPos),
  [].concat('Reputation', StrPropRep)]);
  
    // Properties in roleSettingDiv
  oC.roleSetting=separateGroupLabels([
  [].concat('Customer', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('RequestedSkills', StrC),
  [].concat('Price', 'currency', 'pricePerHour')]);
  oS.roleSetting=separateGroupLabels([
  [].concat('Seller', StrPropContact, 'idTeamWanted', 'coordinatePrecisionM'),
  [].concat('Languages', StrS),
  [].concat('Price', 'currency', 'pricePerHour')]);
  

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'homeTown', 'currency', 'tPos'),
  [].concat('RequestedSkills', StrC),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'currency', 'tPos'),
  [].concat('Languages', StrS),
  [].concat('Reputation', StrPropRep)]);

    // Default columns
  oC.ColsShowDefault=[].concat('image', 'displayName', 'language', 'database', 'tel', 'idTeam', 'pricePerHour');
  oC.ColsShowDefaultS=[].concat('image', 'displayName', 'language', 'database', 'pricePerHour');
  oC.ColsShowDefaultRS=[].concat('image', 'language', 'database', 'pricePerHour');
  oC.colOneMarkDefault='image';

  oS.ColsShowDefault= ['image', 'displayName', 'tel', 'idTeam', 'pricePerHour','c','java','php','javascript'];
  oS.ColsShowDefaultS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  oS.ColsShowDefaultRS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  oS.colOneMarkDefault='image';

    // images
  var strPlugin='programmer';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  //uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.programmer;
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
    extend(oC.Prop.database, {strType:'text',inpW:6});
      // language
    extend(oC.Prop.language, {strType:'text',inpW:6});

      // StrProgrammerLang
    var crInpFunc=function(){
      var c=createElement('select'), arrTmp=[0,1,2,3,4,5];
      for(var j=0;j<arrTmp.length;j++){  var opt=createElement('option').myText(arrTmp[j]).prop('value',j);   c.append(opt);    }
      return c;
    };
    var tmpSetGrade=function(iMTab,ele){
      var data=oS.MTab[iMTab][ele.attr('name')]; data=bound(data,0,5); var ColT=['','lightblue','lightgreen','yellow','orange','red'], colT=ColT[data];
      ele.css({'background':colT});
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
 * Some tools (could be placed in a library file)
 *   calcLabel
 *   spanMessageTextCreate
 *   popUpCreator
 *   toastCreator
 *   selSpriteCreator
 *   spriteCreator
 *******************************************************************************************************************
 *******************************************************************************************************************/
 
 
//calcLabel=function(Label,strName){ return Label[strName]||ucfirst(strName); }
app.calcLabel=function(obj,strName){ var objA=obj[strName]; return (objA&&objA.label)?objA.label:ucfirst(strName); }

var spanMessageTextCreate=function(){
  var el=createElement('span');
  var spanInner=createElement('span');
  el.appendChild(spanInner, imgBusy.hide());
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    spanInner.myText(' ');
    imgBusy.hide();
  }
  el.setMess=function(str,time,boRot){
    spanInner.myText(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    imgBusy.toggle(Boolean(boRot));
  };
  el.setHtml=function(str,time,boRot){
    spanInner.myHtml(str);
    clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    imgBusy.toggle(Boolean(boRot));
  };
  var messTimer;
  el.addClass('message');//.css({'z-index':8100,position:'fixed'});
  return el;
}

var popUpExtend=function(el){
  el.openPop=function() {
    el.append(spanMessageText);
    container.empty().append(el);  elBody.append(blanket);  elBody.append(container);
  }
  el.closePop=function() {  el.remove();  container.remove();  blanket.remove();  elBody.append(spanMessageText);  }

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

  // Plugin class



var trackConv=function(google_conversion_id,google_conversion_label) {
  var image = new Image(1,1);
  image.src = "https://www.googleadservices.com/pagead/conversion/"+google_conversion_id+"/?label="+google_conversion_label+"&script=0";
}


var charRoleDefault='s';
var charRole=getItem('charRole');  if(charRole===null) charRole=charRoleDefault;
var roleTogglerCreator=function(viewTarget){
  var el=createElement('button');
  el.setStat=function(charRole){
    var charRoleAlt=charRole=='c'?'s':'c';
    var strCol=charRoleAlt=='s'?'lightblue':'pink';
    var strRoleUC=charRoleAlt=='s'?'Sellers':'Customers';
    el.css({'background':strCol}).myText(langHtml[strRoleUC]);
  }
  el.getStat=function(){  return el.style.background=='lightblue'?'c':'s';   }
  el.prop('title', langHtml.ToggleBetweenCustomerAndSeller).on('click',function(){
    charRole=el.getStat();
    charRole=charRole=='c'?'s':'c';
    el.setStat(charRole);
    setItem('charRole', charRole);

    viewTarget.setVis();  //doHistReplace({view:ViewTarget[iTmp]});
  });
  el.addClass('flexWidth').css({'font-size':'70%'});
  return el;
}
/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * History stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


app.histGoTo=function(view){}
app.doHistBack=function(){  history.back();}
app.doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var view=obj.view;
  var scrollT=window.scrollTop();
  if(typeof view.setScroll=='function') view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
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
  
  var boE=Boolean(userInfoFrDB.admin); viewSettingW.adminButton.toggle(boE);
  
  var boAny=0, boBoth=1;
  for(var i=0;i<2;i++){
    var strRole=i?'seller':'customer', objTeam=userInfoFrDB[strRole+'Team'];
    var boTeamExist=Boolean(objTeam), boTeamApproved=boTeamExist&&objTeam.boApproved;
    viewSettingW.TeamButton[i].toggle(Boolean(boTeamApproved));
    ViewEntry[i].teamApprovedMess.toggle(Boolean(boTeamExist && !boTeamApproved));
    
    var boE=Boolean(userInfoFrDB[strRole]); boAny=boAny||boE; boBoth=boBoth&&boE;
    viewFront.QuickDiv[i].toggle(boE);
    viewSettingW.userDiv.SettingButton[i].toggle(boE);
  }
  viewSettingW.userDiv.toggle(boAny);
  
  for(var i=0;i<2;i++){
    viewFront.QuickDiv[i].butTogW.toggle(boBoth);
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
  if('wwwLoginScope' in site) document.domain = site.wwwLoginScope;
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
      var vec=[['loginWEmail',{email:inpEmail.value, password:hashPW}], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      history.fastBack(viewFront);

    })(); flow.next();
    return false;
  }
  var sendEmail=function(e){
    var vec=[['sendLoginLink',{email:inpEmail.value}]];   majax(oAJAX,vec);  e.preventDefault();
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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
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
      ga('send', 'event', 'button', 'click', 'login');
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:strRole+'Fun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

      var boE=Boolean(userInfoFrDB[strRole]);
      var tmpIntroPop=strRole=='customer'?mainIntroPopC:mainIntroPopS;
      //var tmpQuickDiv=strRole=='customer'?viewFront.quickDivC:viewFront.quickDivS;
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

    //var vec=[['createUser',o], ['setupById',{}, el.cb]];   majax(oAJAX,vec);
    var vec=[['sendVerifyEmailNCreateUserMessage', o, saveRet]];   majax(oAJAX,vec);

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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
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

    var vec=[['changePW',o,changePWRet]];   majax(oAJAX,vec);
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
    if(data.boOK) { inpPassOld.value=''; inpPass.value=''; inpPassB.value='';  doHistBack(); }
  }

  var h1=createElement('h3').myText('Change your password');
  var blanket=createElement('div').addClass("blanket");
  var messDiv=createElement('div').css({color:'red'});
  var labPassOld=createElement('label').myText('Old password'), labPass=createElement('label').myText('New password'),  labPassB=createElement('label').myText('New password again');
  var inpPassOld=createElement('input').prop('type','password'), inpPass=createElement('input').prop({type:'password', placeholder:"at least 6 characters"}),  inpPassB=createElement('input').prop('type','password');

  [inpPassOld, inpPass, inpPassB].forEach( (ele)=>ele.css({display:'block', 'margin-bottom':'0.5em'}).on('keypress', function(e){ if(e.which==13) {okF();return false;}} ) );

  var ok=createElement('button').myText(langHtml.OK).addClass('highStyle').on('click', save);
  var cancel=createElement('button').myText(langHtml.Cancel).addClass('highStyle').on('click', doHistBack);
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
    var vec=[['verifyPWReset',{email:inpEmail.value.trim()}, okRet]];   majax(oAJAX,vec);

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
    if(data.boOK) { inpEmail.value='';  doHistBack(); }
  }

  var h1=createElement('h3').myText('Forgott your password?');
  var blanket=createElement('div').addClass("blanket");
  var labEmail=createElement('label').myText('Email');
  var inpEmail=createElement('input').prop('type','email').on('keypress', function(e){ if(e.which==13) {okF();return false;}} );
  inpEmail.css({display:'block', 'margin-bottom':'0.5em'});

  var ok=createElement('button').myText(langHtml.OK).addClass('highStyle').on('click', okF);
  var cancel=createElement('button').myText(langHtml.Cancel).addClass('highStyle').on('click', doHistBack);
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
  el.myResetNBack=function(){   el.myReset(); doHistBack();    }
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
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
    })(); flow.next();
  });

  var uImageAlt=window['u'+ucfirst(strIPAlt)];
  var imAlt=createElement('img').prop({src:uImageAlt}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPAlt, fun:'mergeIDFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

    })(); flow.next();
  });

  var fragRows=createFragment(pendingMess, cancelMess, headA, headB, imPrim, headC, imAlt).cssChildren({'margin':'1em 0em 1em 0.6em'});
  var divCont=createElement('div').myAppend(fragRows).addClass('contDiv');

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
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

var butTeamImgCreator=function(oRole){
  var el=createElement('span');
  var strRole=oRole.strRole;
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  el.mySet=function(idTeam,boOn){
    var boId=Number(idTeam)!=0;
    spanIndependent.toggle(!boId);   im.toggle(boId);
    if(boId){
      var strTmp=uRoleTeamImage+idTeam;
      im.prop({src:strTmp});
    }
    if(boOn) opacity=1; else opacity=0.4; im.css({opacity: opacity});
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
    var strTmp=langHtml[indRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em'});

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
  var txt=createTextNode('/');  el.appendChild(txt);
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
 *   viewSettingWCreator
 *     viewUserSettingCreator
 *         divIPSettingCreator
 *       viewUploadImageCreator
 *       viewDeleteAccountPopCreator
 *     viewSettingCreator
 *         posNumF, mustBeSetF, posNumOrEmptyF, inpAsNum
 *         spanIdTeamWantedCreator
 *     viewAdminCreator
 *     viewTeamCreator
 *   mainLoginInfoCreator
 *     viewEntryCreator
 *     mainIntroPopCreator
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var viewSettingWCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'settingW';}
  
  
  //var buttShowMarkSelectC=createElement('button').myText(langHtml.Customers).css({background:oC.strColor, 'margin-left':'0.4em'}).on('click', function(){
    //var viewTmp=viewMarkSelector.ElRole[0]; viewTmp.setVis();doHistPush({view:viewTmp});
  //});
  //var buttShowMarkSelectS=createElement('button').myText(langHtml.Sellers).css({background:oS.strColor}).on('click', function(){
    //var viewTmp=viewMarkSelector.ElRole[1]; viewTmp.setVis();doHistPush({view:viewTmp});
  //});
  
  el.userDiv=createElement('div');
  el.userDiv.SettingButton=[];
  el.TeamButton=[];
  var ButtShowMarkSelect=[];
  for(let i=0;i<2;i++) {
    var oRole=ORole[i], strTmp=i?'Sellers':'Customers';
    ButtShowMarkSelect[i]=createElement('button').myText(langHtml[strTmp]).css({background:oRole.strColor}).on('click', function(){
      charRole=ORole[i].charRole; // Temporary
      viewMarkSelector.setVis(); doHistPush({view:viewMarkSelector});
    });
    var strTmp=i?'Seller':'Customer';
    el.userDiv.SettingButton[i]=createElement('button').myText(langHtml[strTmp+'Settings']).on('click',function(){
      charRole=i?'s':'c';
      viewSetting.setVis(); doHistPush({view:viewSetting});
    });
    el.TeamButton[i]=createElement('button').css({display:'block'}).myText(strTmp+' team settings').on('click', function(){
      ViewTeam[i].setUp(); ViewTeam[i].setVis(); doHistPush({view:ViewTeam[i]});
    });
  }
  ButtShowMarkSelect[0].css({'margin-left':'0.4em'});
  
  var divMapMarker=createElement('div').prop('id','divMapMarker').myText(langHtml.MapMarkers+':').myAppend(...ButtShowMarkSelect);

  
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
  var butts=createFragment().myAppend(userSettingButton, ...el.userDiv.SettingButton, createElement('br'), complainerButton).cssChildren({margin:'1em 0.1em'});
  var h=createElement('p').myText("Settings for logged in user").css({'font-weight':'bold'});
  el.userDiv.myAppend(h,butts);
  el.userDiv.css({'background':'#ccc', 'border':'solid 1px', 'padding':'0.2em 0', 'margin':'1em 0.6em 1em 0.6em'});
  
  el.adminButton=createElement('button').myText('Admin').css({display:'block'}).on('click',function(){
    viewAdmin.setVis(); doHistPush({view:viewAdmin});
  });
  
  var fragOpt=createFragment().myAppend(divMapMarker, el.userDiv, el.adminButton, ...el.TeamButton);
  fragOpt.cssChildren({display:'block','margin':'1em 0em 1em 0.6em'});
  
  [el.userDiv.SettingButton[0], el.TeamButton[0]].forEach((ele)=>{ele.css({background:oC.strColor}) });
  [el.userDiv.SettingButton[1], el.TeamButton[1]].forEach((ele)=>{ele.css({background:oS.strColor})});

  el.divCont=createElement('div').addClass('contDiv').myAppend(fragOpt);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var span=createElement('span').myAppend(tmpImg, langHtml.Settings).addClass('footDivLabel');
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
    oC.Prop.image.setInp(spanImg);
    divIPSetting.setUp();
    return true;
  }
  var divIPSetting=divIPSettingCreator().css({background:'lightgrey', margin:'0.2em', border:'1px black solid'});
  
  var saveDisplayName=function(){ var vec=[['UUpdate',{displayName:inpDisplayName.value.trim()}], ['setupById', {}]];   majax(oAJAX,vec); }
  var inpDisplayName=createElement('input').prop({type:'text'}).on('keypress', function(e){if(e.which==13) {saveDisplayName();return false;}} );
  var butDisplayName=createElement('button').myText('Change').on('click', saveDisplayName);
  var divDisplayName=createElement('div').myAppend('Display name: ', inpDisplayName, butDisplayName);
  

  el.createDivs=function(){
    spanImg=oC.Prop.image.crInp();
    divImage.myAppend('Display image: ', spanImg);
  }
  var spanImg;
  var divImage=createElement('div');
    // change PW
  var buttChangePW=createElement('button').myText('Change password').on('click', function(e){ viewChangePWPop.openFunc(); });
  var divPW=createElement('div').myAppend('Change password: ', buttChangePW);

      // deleteDiv
  //var imgH=imgHelp.cloneNode(); popupHover(imgH,createElement('div').myText(langHtml.deleteBox));
  var butDelete=createElement('button').myText(langHtml.DeleteAccount).css({'margin-right':'1em'}).on('click', function(){doHistPush({view:viewDeleteAccountPop}); viewDeleteAccountPop.setVis();});
  var deleteDiv=createElement('div').myAppend(butDelete); //,imgH


  var fragDiv=createFragment().myAppend(divIPSetting, divDisplayName, divImage, divPW, deleteDiv).cssChildren({'margin-top':'1em'});
  var divCont=createElement('div').myAppend(fragDiv).addClass('contDiv');
  
    // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
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
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
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
  var divIdIP=createElement('div').myAppend('FB: ', spanIdFB, ', IdPlace: ', spanIdIdPlace, ', OpenID: ', spanIdOpenId);
  
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


  var fragDiv=createFragment().myAppend(divHead, divRefresh, divIdIP, divImageName, divEmail).cssChildren({'margin-top':'1em'});
  el.myAppend(fragDiv);
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



    var vecIn=[['uploadImage', {}], ['CSRFCode',CSRFCode]];
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


  var closeButton=createElement('button').myText('Close').on('click', doHistBack);
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
    //var vec=[['UDelete',1,function(data){doHistBack();doHistBack();}]];   majax(oAJAX,vec);
    sessionLoginIdP={};  userInfoFrDB=extend({}, specialistDefault);
    var vec=[['UDelete',{}], ['logout',{}, function(data){
      history.fastBack(viewFront,true);
    }]];   majax(oAJAX,vec);

  });
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
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
      var inp=ele,  strName=inp.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
      //if('saveInp' in tmpObj) {var tmp=tmpObj.saveInp(inp); if(tmp===false) boErr=1; else if(tmp===null); else o[strName]=tmp;} else o[strName]=inp.value.trim();
      if('saveInp' in tmpObj) {var [err,val]=tmpObj.saveInp(inp); if(err) {setMess(err, 10); boErr=1; } else o[strName]=val;}
      else {var tmp=inp.value; if(typeof tmp=='string') tmp=tmp.trim(); o[strName]=tmp; }
    });
    if(boErr) return;
    var vec=[['RUpdate', o, el.setUp], ['setupById',{Role:strRole}]];   majax(oAJAX,vec);
    setMess('',null,true);
  }

  el.createDivs=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var imgH=''; if(strName in oRole.helpBub ) {    var imgH=imgHelp.cloneNode();   popupHover(imgH,oRole.helpBub[strName]);         }

      //var strLabel=ucfirst(strName)+': '; if(strName in langHtml.prop) strLabel=langHtml.prop[strName].label+': ';
      var strLabel=calcLabel(langHtml.prop, strName)+': ';

      var inp='', tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('crInp' in tmpObj) inp=tmpObj.crInp(); else inp=createElement('input').prop('type',strType);
      if('inpW' in tmpObj)  inp.css({width:tmpObj.inpW+'em'});
      inp.attr('name',strName);
      var divLCH=createElement('div').myAppend(strLabel,imgH,inp).css({position:'relative', margin:'.8em 0','min-height':'2em'});
      arrDiv[i]=divLCH;
      arrInp[i]=inp;
    }
    el.append(...arrDiv);
    var Tmp=el.querySelectorAll('input[type=text],[type=number],[type=tel],[type=email],[type=url]');
    [...Tmp].forEach( (ele)=>ele.on( 'keypress', function(e){ if(e.which==13) {el.save();return false;} } ) );
    el.querySelector('input[type=number]').prop({min:0});
    [...el.querySelectorAll('input,select')].forEach( (ele)=>ele.css({'float':'right',clear:'both'}) );

    var checkBoxes=el.querySelectorAll('input[type=checkbox]');
    var tmp=boAndroid?{'-webkit-transform':'scale(2,2)'}:{width:'1.4em',height:'1.4em'};   [...checkBoxes].forEach((ele)=>ele.css(tmp));

      // Add labels
    for(var i=0;i<StrGroup.length;i++){
      var h=createElement('span').myText(langHtml[StrGroup[i]]+':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      var tmp=el.querySelector('[name='+StrGroupFirst[i]+']').parentNode; tmp.insertAdjacentElement('beforebegin', createElement('hr').css('clear','both')); tmp.insertAdjacentElement('beforebegin', h);
    }
  }
  el.setUp=function(){
    arrInp.forEach(function(ele, i){
      var inp=ele, strName=inp.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('setInp' in tmpObj) tmpObj.setInp(inp);
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
    var strTmp=indRole?'SellerSettings':'CustomerSettings';  strTmp=langHtml[strTmp]; spanRole.myText(strTmp);
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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var spanRole=createElement('span');
  var spanLab=createElement('span').myAppend(spanRole).addClass('footDivLabel');
  var divFoot=createElement('div').myAppend(buttonBack, roleToggler, buttonSave, spanLab).addClass('footDiv');

  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


app.posNumF=function(inp){var val=inp.value.trim(), strName=inp.attr('name'); if(isNumber(val) && val>=0) return [null,val]; else return [strName+' must be nummeric and positive']; }
app.mustBeSetF=function(inp){var val=inp.value.trim(), strName=inp.attr('name'); if(val.length) return [null,val]; else return [strName+' can not be empty'];  }
app.posNumOrEmptyF=function(inp){
  var val=inp.value.trim(), strName=inp.attr('name'); if(val.length==0 || (isNumber(val) && val>=0) ) return [null,val]; else return [strName+' must be nummeric and positive'];
}
app.inpAsNum=function(inp){return [null, Number(inp.prop('checked'))]; }



app.spanIdTeamWantedCreator=function(oRole){
  var el=createElement('span');
  var strRole=oRole.strRole;
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  el.setStat=function(){
    var idTmp=userInfoFrDB[strRole].idTeamWanted, tag=userInfoFrDB[strRole].imTagTeam;
    if(idTmp!=0){ var strTmp=uRoleTeamImage+idTmp+'?v='+tag; thumbDis.prop({src:strTmp}); thumbDis.show(); spanDisNApproved.show(); inp.value=idTmp;}
    else { thumbDis.hide(); spanDisNApproved.hide(); inp.value='';}

    var idTeam=userInfoFrDB[strRole].idTeam; spanDisNApproved.toggle(idTmp!=idTeam);
  }
  var inp=createElement('input').prop('type','text').css({width:'3em'});
  var thumbDis=createElement('img').css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  var spanDisNApproved=createElement('span').myText(langHtml.NotYetApproved).css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  el.myAppend(inp, thumbDis,spanDisNApproved);
  el.inp=inp; return el;
}



var viewAdminCreator=function(){
  var el=createElement('div');
  el.toString=function(){return 'admin';}
  el.setUp=function(data){
    boShowTeam=Boolean(Number(data.boShowTeam)); inpBoShowTeam.prop({checked:boShowTeam});
    for(var i=0;i<ORole.length;i++){
      viewFilter.ElRole[i].querySelectorAll('[name=idTeam]').toggle(boShowTeam);
      viewMarkSelector.ElRole[i].tBody.querySelector('[name=idTeam]').toggle(boShowTeam);
      viewColumnSelector.ElRole[i].tBody.querySelector('[name=idTeam]').toggle(boShowTeam);
      viewSetting.ElRole[i].querySelector('[name=idTeamWanted]').parentNode.toggle(boShowTeam);
      if(!boShowTeam) {
        arrValRemove(ORole[i].ColsShowDefault,'idTeam');
        arrValRemove(ORole[i].ColsShow,'idTeam');  setItem('ColsShow'+ORole[i].charRoleUC, ORole[i].ColsShow);
        if(ORole[i].colOneMark=='idTeam') ORole[i].colOneMark=ORole[i].colOneMarkDefault;
      }
    }   
  }

    //set 
  el.saveFunc=function(){
    var data={boShowTeam:Number(inpBoShowTeam.checked)}; el.setUp(data);
    var vec=[['setSetting',data]];   majax(oAJAX,vec);
  }

  var inpBoShowTeam=createElement('input').prop({type:'checkbox'});
  var pBoShowTeam=createElement('p').css({'margin-top':'1em'}).myAppend('boShowTeam:',inpBoShowTeam);
  
  var divCont=createElement('div').myAppend(pBoShowTeam).addClass('contDiv');

      // divFoot
  var buttonSave=createElement('button').on('click', el.saveFunc).myText(langHtml.Save).addClass('flexWidth').css({ 'margin-right':'.2em'});
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
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
    var vec=[['teamLoad',{strRole:strRole},disLoadRet]];   majax(oAJAX,vec);
    el.boLoaded=1;
  }
  var disLoadRet=function(data){
    var idUser='', imTag=''
    var tmp=data.idUser;   if(typeof tmp==="undefined")  tmp=''; elId.myText(tmp); idUser=tmp;
    var tmp=data.imTag;   if(typeof tmp==="undefined")  tmp=''; imTag=tmp; thumb.attr({src:uRoleTeamImage+idUser+'?v='+imTag});
    var tmp=data.link;   if(typeof tmp==="undefined")  tmp=''; elLink.value=tmp;
    var tmp=data.tab;  if(typeof tmp==='undefined') tmp=[]; el.tab=tmp;
    el.divList.empty();
    //if(el.tab.length==0) return;
    for(var i=0; i<el.tab.length; i++) {
      var id=createElement('span').myAppend(el.tab[i][1],' ',el.tab[i][2],' ',el.tab[i][3]);
      var cb=createElement('input').prop('type','checkbox').on('click', save);
      //if(Number(el.tab[i][4])) cb.attr('checked','checked');
      var boTmp=Boolean(Number(el.tab[i][4])); cb.attr('checked',boTmp);
      var row=createElement('div').myAppend(cb,' ',id);
      el.divList.append(row);
    }

    //resetMess(10);
  };
  var save=function(){
    var cb=this, span=cb.parentNode, i=getNodeIndex(span), idUser=el.tab[i][0];
    var vec=[['teamSave',{idUser:idUser,boOn:this.checked}]];   majax(oAJAX,vec);
  }
  var saveName=function(){
    var link=elLink.value.trim();
    var vec=[['teamSaveName',{link:link}]];   majax(oAJAX,vec);
  }
  var calcTeamImageUrl=function(){
    var idUser=userInfoFrDB[strRole+'Team'].idUser, tag=userInfoFrDB[strRole+'Team'].imTag;  return uRoleTeamImage+idUser+'?v='+tag;
  }
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  el.boLoaded=0;
  var elId=createElement('span').css({'font-weight':'bold'});
  var elLink=createElement('input').attr({type:'text',size:10}).on('keypress', function(e){ if(e.which==13) {saveName();return false;}} );
  var thumb=createElement('img').css({'vertical-align':'middle'});
  var uploadCallback=function(){
    userInfoFrDB[strRole+'Team'].imTag=randomHash(); thumb.attr({src:calcTeamImageUrl()});
    //var tmpF=function(){thumb.attr({src:calcTeamImageUrl()});};    var vec=[ ['setupById',{Role:'team'},tmpF]];   majax(oAJAX,vec);
  }
  var buttUploadImage=createElement('button').myText('Upload image').on('click', function(){viewUploadImage.openFunc(oRole.charRole, uploadCallback);});
  var buttSaveName=createElement('button').myText('Save link').on('click', saveName);
  el.divList=createElement('div');

  var hId=createElement('div').myText('Inform the team members of this number, they should enter it in their repective settings tab.');
  var hLink=createElement('div').myText('A link to any other site of yours.');
  var hList=createElement('div').myText('A list of userss who wants to belong to your team. Mark those who you approve.');

  var hImg0=imgHelp.cloneNode().css({'margin-left':'1em'}), hImg1=imgHelp.cloneNode().css({'margin-left':'1em'}), hImg2=imgHelp.cloneNode().css({'margin-left':'1em'});
  popupHover(hImg0,hId);   popupHover(hImg1,hLink);   popupHover(hImg2,hList);


  var divCont=createElement('div').addClass('contDiv').myAppend('Team-Id: ',elId,',',hImg0,'<br>',
          'Thumb image: ',thumb,' ',buttUploadImage,' &nbsp;&nbsp;(will be shrunk to fit a 50 x 50 pixel square)<br>',
          'Link: (optional)',elLink,' &nbsp;',buttSaveName,hImg1,'<hr>','<b>List of users</b>',hImg2,el.divList);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var span=createElement('span').myText('Team settings').addClass('footDivLabel');
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
      var arrTmp=['customer','seller','complainer', 'admin']
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
    majax(oAJAX,vec);
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
    var nTmp=strRole=='customer'?nCustomerReal:nSellerReal;
    var nNext=nSellerReal+1; //if(nNext==13) nNext=14;
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
      var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

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
  var fragRow=createFragment().myAppend(divOrdinal, divLoginSelector, pWiki, buttLoginTeam, el.teamApprovedMess).cssChildren({'margin':'1em 0em 1em 0.6em'});;
  
    // , NoteYouCanDeleteYourAccount  FBToPreventMultipleAccounts, NothingIsWrittenToYourFBFlow, YouCanUseCustomImage, , langSpan, NoteYouCanDeleteYourAccount
    
  if(0){
    var iframeLike=createElement('iframe').prop({src:"//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fgavott&amp;width&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;stream=false&amp;show_border=false&amp;appId=237613486273256", scrolling:"no", frameborder:"0", style:"border:none; overflow:hidden; height:62px;", allowTransparency:"true"});
  }else{var iframeLike=createElement('span');}
  iframeLike.css({'float':'right',clear:'both'});
  var topDivA=createElement('div').myAppend(iframeLike).css({'margin-top':'1em',overflow:'hidden'});  //buttonBack,  , aMoreAboutWhyAnIdPIsUsed
  var divCont=createElement('div').addClass('contDiv').myAppend(topDivA,fragRow);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var divFoot=createElement('div').myAppend(buttonBack).addClass('footDiv');
  
  el.myAppend(divCont, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el;
}


var mainIntroPopCreator=function(oRole){
  var el=createElement('div');
  var {charRole, strRole, charRoleUC}=oRole;
  var save=function(){ 
    resetMess();  
    var strTel=inpTel.value.trim(); inpTel.value=strTel; if(strTel.length==0) {setMess('telephone number can not be empty'); return; }
    var curT; if(strLang=='sv') curT='SEK'; else curT='USD';
    var nameT=inpName.value.trim();  inpName.value=nameT;
    var boIdIPImage=Number(cbIdIPImage.prop('checked'));
    var o1={tel:strTel, displayName:nameT, currency:curT, charRole:charRole, boIdIPImage:boIdIPImage};
    var vec=[['RIntroCB',o1,function(data){el.closePop();}], ['setupById', {}]];   majax(oAJAX,vec);

    var iframeConversion=createElement('iframe').prop({src:uConversion, scrolling:"no", frameborder:0,  allowTransparency:true}).css({border:'none', overflow:'hidden', width:'292px', height:'62px', display:'none'});
    elBody.myAppend(iframeConversion);

    setMess('',null,true);  
  }
  el.setUp=function(){
    inpTel.value=''; inpTel.focus();
    var nameT=sessionLoginIdP?sessionLoginIdP.nameIP:'';
    inpName.value=nameT;
    cbIdIPImage.prop('checked', true);
    return true;
  }
  el.openFunc=function(){   el.openPop(); el.setUp(); }
 
  popUpExtend(el);  
  el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em', 'text-align':'left'}); 

  
  var helpPopup=createElement('div').myText('At least one of email or phone should be entered');
  var imgH=imgHelp.cloneNode().css({'margin-left':'1em'});   popupHover(imgH,helpPopup);
         
  var head=createElement('h3').myText(langHtml['introHead'+charRoleUC]);
  var pBread=createElement('p').myText("Data shown to other users (can be changed later in the settings).");
  //var pBread=createElement('p').myText("A telephone number is needed for customers to contact you. You may want to use a separate phone for this.");
  var inpName=createElement('input').prop('type','text').css({width:'70%', 'box-sizing':'border-box'});
  var inpTel=createElement('input').prop('type','tel').css({width:'70%', 'box-sizing':'border-box'});
  var cbIdIPImage=createElement('input').prop({"type":"checkbox"});
  var divName=createElement('p'); divName.myAppend('Name', ': ',inpName);
  var divTel=createElement('p'); divTel.myAppend(langHtml.Tel, ': ',inpTel);
  var divIdIPImage=createElement('p'); divIdIPImage.myAppend('Use image from ID provider', ': ',cbIdIPImage);
  //divName.add(divTel).add(divIdIPImage).css({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});
  //[divName, divTel, divIdIPImage].cssChildren({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});
  [divName, divTel, divIdIPImage].forEach((ele)=>ele.css({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'}));
  //cssChildren([divName, divTel, divIdIPImage], {display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});

  var saveButton=createElement('button').myText(langHtml.Continue).on('click', save).css({display:'block', 'margin':'1em auto'});
  el.myAppend(head, pBread, divName, divTel, divIdIPImage, saveButton).css({padding:'0.5em'}); 

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
    var vec=[['complaintOneGet', {idComplainee:idComplainee}, complaintCommentOneGet]];   majax(oAJAX,vec);
    el.setVis();
    comment.focus();
  };
  el.setVis=function(){
    el.show();
    return true;
  }
  el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() {
    var o1={idComplainee:idComplainee,comment:comment.value.trim()};
    var vec=[['complaintUpdateComment',o1], ['getComplaintsOnComplainee', viewComplainee.getLoadArg(), viewComplainee.getComplaintsOnComplaineeRet], ['setupById', {}]];   majax(oAJAX,vec);
    doHistBack();
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
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
  var butts=createFragment().myAppend(save, del, cancel).cssChildren({margin:'0.5em 0'});
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
    var o1={idComplainer:idComplainer}, vec=[['complaintOneGet',o1,complaintAnswerOneGet]];   majax(oAJAX,vec);
    answer.focus();
    doHistPush({view:viewComplaintAnswerPop});
    el.setVis();
  };
  el.setVis=function(){
    el.show();
    return true;
  }
  el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() {
    var o1={idComplainer:idComplainer,answer:answer.value.trim()};
    var vecG; 
    if(viewComplainee.css('display')!='none') { vecG=['getComplaintsOnComplainee', viewComplainee.getLoadArg(), viewComplainee.getComplaintsOnComplaineeRet];  }
    else { vecG=['getComplaintsFromComplainer', viewComplainer.getLoadArg(), viewComplainer.getComplaintsFromComplainerRet];   }
    var vec=[['complaintUpdateAnswer',o1],vecG];   majax(oAJAX,vec);
    doHistBack();
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
  var cancel=createElement('button').myText(langHtml.Cancel).on('click', doHistBack);
  var butts=createFragment().myAppend(save, del, cancel).cssChildren({margin:'0.5em 0'});

  el.css({'text-align':'left'});

  var blanket=createElement('div').addClass("blanket");
  var centerDiv=createElement('div').myAppend(commentHead,comment,answerHead,answer,butts);
  centerDiv.addClass("Center").css({padding: '1em'});
  el.addClass("Center-Container").myAppend(centerDiv,blanket);

  return el;
}


var viewComplaineeCreator=function(){    // Complaints on a certain complainee
  var el=createElement('div');
  el.toString=function(){return 'complainee';}
  el.setUp=function(oRoleT, id){
    oRole=oRoleT; el.indRole=oRole.ind;
    var iMTab=viewTable.ElRole[oRole.ind].getMTabInd(id);
    rowComplainee=oRole.MTab[iMTab];
    el.idComplainee=rowComplainee.idUser;
    nameSpan.myText(rowComplainee.displayName);

    var strTmp; //var IPTmp=enumIP[Number(rowComplainee.IP)];
    strTmp=calcImageUrl(rowComplainee);
    imgComplainee.prop({src:strTmp});
    ListCtrlDiv[oRole.ind].mySet(iMTab);
    spanRole.myText(langHtml[ucfirst(oRole.strRole)]);
    span.myText('Complaints on a user ('+langHtml[oRole.strRole]+')').css({background:oRole.strColor}); // divFoot label
  }
  el.getLoadArg=function(){ return {offset:offset, rowCount:rowCount, idComplainee:el.idComplainee};   }
  el.load=function(){
    setMess('',null,true);  majax(oAJAX,[['getComplaintsOnComplainee', el.getLoadArg(), el.getComplaintsOnComplaineeRet]]);
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
        var vec=[['loginGetGraph', oT], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
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
  var tab=[], rowComplainee, imgComplainee=createElement('img').css({'vertical-align':'middle'}), nameSpan=createElement('span'), spanRole=createElement('span');
  var complaineeInfo=createElement('div').myAppend(spanRole,': ',imgComplainee,' ',nameSpan).css({'margin':'0.5em',display:'inline-block', 'float':'right'}); //,'float':'right'
  var bub=createElement('div').myText(langHtml.writeComplaintPopup);
  var imgH=imgHelp.cloneNode();  popupHover(imgH,bub);

  var tBody=createElement('tbody'),   table=createElement('table').myAppend(tBody).css({'width':'100%'});//.addClass('complaintTab');

  var butPrev=createElement('button').myText('Prev page').on('click', function(){ offset-=rowCount; offset=offset>=0?offset:0; el.load();});
  var butNext=createElement('button').myText('Next page').on('click', function(){ offset+=rowCount; el.load();});
  var spanOffsetInfo=createElement('span').css({'white-space':'nowrap'});
  var divCont=createElement('div').addClass('contDiv').myAppend(topDiv, complaineeInfo, table, butPrev, butNext, spanOffsetInfo);

      // divFoot
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', doHistBack);
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
    setMess('',null,true); majax(oAJAX,[['getComplaintsFromComplainer', el.getLoadArg(), el.getComplaintsFromComplainerRet]]);
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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', doHistBack);
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
    if(viewComplainee.style.display!='none'){viewComplainee.setUp(oRole, oRole.MTab[iTmp].idUser); viewComplainee.load(); }
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
  el.setContainers=function(iMTab){
    containers.forEach(function(ele){
      var strName=ele.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:{};
      var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,ele);  else tmp=oRole.MTab[iMTab][strName];
      if(typeof tmp!='undefined') ele.myText(tmp);
    });
    el.boLoaded=1;
    ListCtrlDiv[oRole.ind].mySet(iMTab);
  }
  el.createContainers=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i], tmpObj=(strName in Prop)?Prop[strName]:{};
      var imgH=''; if(strName in oRole.helpBub && Number(Prop[strName].b[oRole.bFlip.help])) { imgH=imgHelp.cloneNode();   popupHover(imgH,oRole.helpBub[strName]); }

      var strDisp,strMargRight,strWW; if(Number(Prop[strName].b[oRole.bFlip.block])) {strDisp='block'; strMargRight='0em'; strWW='';} else {strDisp='inline'; strMargRight='.2em'; strWW='nowrap';}

      var strLabel=''; if(Number(Prop[strName].b[oRole.bFlip.label])) { strLabel=calcLabel(langHtml.prop, strName)+': ';      }

      var spanC=createElement('span').myText(' ').css({'font-weight':'bold',margin:'0 0.2em 0 0em'}); spanC.attr({name:strName});
      if('crInfo' in tmpObj) tmpObj.crInfo(spanC);
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
  var buttonBack=createElement('button').myText(strBackSymbol).css({'margin-left':'0.8em','margin-right':'1em'}).addClass('fixWidth').on('click', doHistBack)
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


  el.setCentNMe=function(latLng){
    if(window.boVideo) latLng=latLngDebug;
    var tmp=el.pWCMe=merProj.fromLatLngToPoint(latLng);   pWCC={x:tmp.x, y:tmp.y};
  }
  el.getMapStatus=function(){
    //if(!el.storedPWCC || !el.storedZoom || !el.storedVPSize) el.storeVar();
    //return {pC:el.storedPWCC, zoom:el.storedZoom, VPSize:el.storedVPSize};
    if(!el.storedVPSize) el.storeVar();
    return {pC:pWCC, zoom:log2(zoomFacW), VPSize:el.storedVPSize};
  }
  el.getPWCC=function(){
    //if(!el.storedPWCC) el.storedPWCC=pWCC;    return el.storedPWCC;
    return pWCC;
  }
  el.storeVar=function(){    // Store values for times when the map is not visible.
    //el.storedPWCC=pWCC;
    //el.storedZoom=zoomFacW;
    el.storedVPSize=[Number(String(el.clientWidth)), Number(String(el.clientHeight))];
  }
  el.set1=function(zoomLevel, latLngFirst){
    el.setCentNMe(latLngFirst);
  }
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
      var elDivUnCertain=createElement('div').css({width:'40px',height:'40px', border:'solid 1px red', background:'pink', opacity:flUncertainOpacityOff, position:'absolute', transform:'translate(-50%, -50%)'});
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
  //el.setMarkers=function(){ el.arrMarkerC.setMarkers(); el.arrMarkerS.setMarkers();}
  //el.drawMarkers=function(){el.arrMarkerC.drawMarkers(); el.arrMarkerS.drawMarkers();}
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
      var strName=this.oRole.colOneMark;
      var tmp=this.oRole.MTab[i][strName], tmpObj=(strName in this.oRole.Prop)?this.oRole.Prop[strName]:{};
      if('setMapF' in tmpObj)  tmp=tmpObj.setMapF(i);
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
      var strName=this.oRole.ColsShow[j], tmp, tmpObj=(strName in this.oRole.Prop)?this.oRole.Prop[strName]:{};
      if('setMapMF' in tmpObj) {  var tmp=tmpObj.setMapMF(i);  } else tmp=this.oRole.MTab[i][strName];
      if(typeof tmp=='string' || typeof tmp=='number') { this.arrFuncOverData[k]=calcLabel(langHtml.prop, strName)+': '+tmp; k++; }
    }
    this.arrFuncOverData.length=k;
    var tmp=this.arrFuncOverData.join('\n');
    return makeMarkerBubble({text:tmp,color:this.oRole.strColor});
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
    var viewTmp=this.oRole==oC?viewInfoC:viewInfoS;
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
    var left=el.pWCMe.x*zoomFacW-pixBoardX, top=el.pWCMe.y*zoomFacW-pixBoardY;    elImgCurLoc.css({left:left+'px', top:top+'px'});
  }
  var zoomFacW;
  var maxZ=intMax;
  el.pWCMe={x:128,y:128};
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

  var elImgCurLoc=createElement('img').css({transform:'translate(-50%, -100%)', position:'absolute','z-index':1}); elImgCurLoc.src=uMyMarker;
  elGlas.appendChild(elImgCurLoc);
  
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
    el.storeVar();
  });
  //el.on("idle", function(){ el.storeVar(); });
  el.on('idle', function(){
    if(isVisible(el)) el.storeVar();
    for(var i=0;i<ORole.length;i++) {
      el.ArrMarker[i].hideMarkers();
      el.ElImgGroupOverlay[i].hideGroupOverlay();
    }
    el.drawMe();
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
  var entryButtonC=createElement('button').myText(langHtml.AppearAsCustomer).addClass('flexWidth').css({'width':'initial','font-size':'0.7em', background:ORole[0].strColor}).on('click',function(){
    viewEntryC.setVis(); doHistPush({view:viewEntryC});
    ga('send', 'event', 'button', 'click', 'entryDivC');
  });
  var entryButtonS=createElement('button').myText(langHtml.AppearAsSeller).addClass('flexWidth').css({'width':'initial','font-size':'0.7em', background:ORole[1].strColor}).on('click',function(){
    viewEntryS.setVis(); doHistPush({view:viewEntryS});
    ga('send', 'event', 'button', 'click', 'entryDivS');
  });
  if(document.domain.substr(0,4)=='demo') {entryButtonC.hide(); entryButtonS.hide();}
  
  el.entryButtonW=createElement('div').css({background:'', "box-sizing":"border-box",color:'black','font-size':'1.2em','line-height':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.2em 0em 0.2em', margin:'1px 0em 0em 0em', flex:'0 0 auto', display:"flex", "justify-content":"space-around"}); //, 'border-top':'solid 1px', "justify-content":"space-evenly"
  el.entryButtonW.append(entryButtonC, entryButtonS);
  
  
  var settingButtonClick=function(){
    viewSettingW.setVis(); doHistPush({view:viewSettingW});
    ga('send', 'event', 'button', 'click', 'setting');
  }
  var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var settingButton=createElement('button').myAppend(tmpImg).addClass('fixWidth').css({'margin-left':'0.8em', 'margin-right':'1em'}).prop('title',langHtml.Settings).on('click',settingButtonClick);

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
  el.tableButton=createElement('button').myAppend(tmpImg).addClass('fixWidth').css({'margin-left':'0.8em'}).prop('title',langHtml.ComparisonTable).on('click',tableButtonClick);  // , background:'transparent'
  
  
  el.filterButton=filterButtonCreator().css({'margin-left':'0.4em', 'white-space':'nowrap'}); //, background:'transparent'

      // QuickFilterButtons
  var setBut=function(boOn){
    boOn=Boolean(boOn); var b=this, iRole=this==ButRole[1]?1:0; 
    if(boOn) b.css({color:'black', background:ORole[iRole].strColor}); else b.css({color:'graytext', background:''});
  }
  var clickF=function(){
    var iRole=this==ButRole[1]?1:0;
    var b=this, bAlt=ButRole[1-iRole];
    var boOn=this.style.color=='black',  boOnAlt=bAlt.style.color=='black'; 
    
    var iRoleT=iRole;
    
    if(boOn && boOnAlt) boOnAlt=false;
    else if(!boOn && boOnAlt) boOn=true;
    else if(boOn && !boOnAlt) boOnAlt=true;
    else if(!boOn && !boOnAlt) boOn=true;
    
    charRole=ORole[iRoleT].charRole;  setItem('charRole', charRole);
    
    if(boOn) viewFilter.ElRole[iRole].Filt.filtAll(); else viewFilter.ElRole[iRole].Filt.filtNone(); 
    if(boOnAlt) viewFilter.ElRole[1-iRole].Filt.filtAll(); else viewFilter.ElRole[1-iRole].Filt.filtNone(); 
    loadTabStart(); 
    
    setBut.call(b, boOn);
    setBut.call(bAlt, boOnAlt);
    
    //if(boOn && boOnAlt) {
      //spanLab.css({background:'linear-gradient(to bottom, pink 50%, lightblue 50%)'});
      //spanRole.myText(' ('+langHtml['Customers']+' + '+langHtml['Sellers']+')');
    //}else{
      //spanLab.css({background:ORole[iRole].strColor});
      //var strTmp=langHtml[iRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
    //}
  }
 
  
  var QuickDiv=[];
  for(var i=0;i<ORole.length;i++){
    QuickDiv[i]=quickCreator(ORole[i]).css({padding:'0.7em 0.2em 0.1em',margin:'0em 0em 0em',display:'flex','border-top':'solid 1px'});   QuickDiv[i].hide();
  }
  el.QuickDiv=QuickDiv;
  
  
  //var spanRole=createElement('span');
  //var spanLab=createElement('span').myAppend(langHtml.Map, spanRole).addClass('footDivLabel');
  
  var ButRole=[];
  for(var i=0;i<2;i++){
    var strRole=i?'Sellers':'Customers', strTmp=langHtml[strRole], oRole=ORole[i];
    ButRole[i]=createElement('button').myText(strTmp).css({background:oRole.strColor, 'word-break':'break-word', 'font-size':'70%', padding:'0.1em'}).addClass('flexWidth').prop('title','Show / hide '+strTmp).on('click',clickF);
    setBut.call(ButRole[i], true);
  }
  ButRole[0].css({'margin-left':'0.8em'});
  ButRole[1].css({'margin-left':'0.4em'});

  
  var divFoot=createElement('div').myAppend(settingButton, infoLink, ...ButRole, el.tableButton, el.filterButton).addClass('footDiv'); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-between'});

  
  var quickDivOuter=createElement('div').css({flex:'0 0 auto'}); quickDivOuter.myAppend.apply(quickDivOuter, QuickDiv);
  //if(boIOS && boTouch) quickDivOuter.css({padding:'0em 0em 1.7em'});
  
  el.append(el.entryButtonW, mapDiv, quickDivOuter, divFoot);

  el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return el
}

var quickCreator=function(oRole){
  var el=createElement('div');
  var {charRole, strRole}=oRole;
  var myHide=function(){
    setMess('',null,true);
    var vec=[['RHide',{charRole:charRole}], ['setupById', {Role:strRole}]];  majax(oAJAX,vec); 
  }

  el.setUp=function(){
    var boShow=Number(userInfoFrDB[strRole].boShow); 
    var hideTimer=Number(userInfoFrDB[strRole].hideTimer);
    var tHide=Number(userInfoFrDB[strRole].tPos)+hideTimer, tDiff=tHide-curTime;
    var tDiffForm=UTC2ReadableDiff(tDiff);
    var tmpShow,tmpHide,str; if(boShow) { str=hideTimer==intMax?'∞':tDiffForm; tmpShow='#0f0'; tmpHide=colGray;}else { str=langHtml.On; tmpShow=colGray; tmpHide='#f00'; }
    butShowWPos.css('background-color', tmpShow); butShowWPos.firstChild.nodeValue=str; buthide.css('background-color', tmpHide);
    spanDragMess.toggle(Boolean(1-boShow));

    var [bestVal, iBest]=closest2Val(arrHideTime, userInfoFrDB[strRole].hideTimer);
    selHideTimer.value=bestVal;
  }

  var colGray='#eee'
  var butShowWPos=createElement('button').myText(langHtml.On).css({'margin-left':'1em'});
  var buthide=createElement('button').myText(langHtml.Off).css({'margin-left':'1em'});
  var divButts=createElement('span').myAppend(butShowWPos,buthide);

  var myShow=function(pos){
    var latLng={lat:pos.coords.latitude, lng:pos.coords.longitude}; if(boVideo) latLng=latLngDebug;
    uploadPosNLoadTabStart(latLng, Number(selHideTimer.value), oRole);
  }

  butShowWPos.on('click', function(){
    if(boDbg) {  setMess('... using origo ... ',null,true); myShow({coords:{latitude:0, longitude:0}});  return;  }
      
    if(boFirstPosOK==0) {setMess('You must agree to sending your position.'); return;}
    setMess('... getting position ... ',null,true);
    if(boEmulator){ myShow(posDebug); }else{ navigator.geolocation.getCurrentPosition(myShow, geoError);  }  //, {maximumAge:Infinity, timeout:5000}
  });

  buthide.on('click', myHide);

  var tu=langHtml.timeUnit, mi=tu.min[1], h=tu.h[1], d=tu.d[1];
  var selHideTimer=createElement('select');
  //var arrHideTime=[0.25,1,2, 5,10,15,20,30,40,60,90,2*60,3*60,4*60,5*60,6*60,8*60,10*60,12*60,18*60,24*60,36*60,2*24*60,3*24*60,4*24*60,5*24*60,6*24*60,7*24*60,14*24*60,30*24*60,365*24*60]; // Minutes
  //for(var i=0;i<arrHideTime.length;i++) arrHideTime[i]*=60;
  var arrHideTime=[15,60,120, 300,600,15*60,20*60,30*60,40*60,3600,1.5*3600,2*3600,3*3600,4*3600,5*3600,6*3600,8*3600,10*3600,12*3600,18*3600,86400,1.5*86400,2*86400,3*86400,4*86400,5*86400,6*86400,7*86400,14*86400,30*86400,intMax], len=arrHideTime.length;
  for(var i=0;i<len;i++){  var str=UTC2ReadableDiff(arrHideTime[i]); if(i==len-1) str='∞'; var opt=createElement('option').myText(str).prop('value',arrHideTime[i]);   selHideTimer.append(opt);    }

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
      QDCur.ElToggleble.forEach((ele)=>{ele.hide()});  QDCur.butTog.myText('+');  QDCur.css({'padding-top':'.2em'});  QDCur.butTog.css(oRole==oC?'top':'bottom','0em');  QDAlt.butTog.hide();
    }else {
      for(var i=0;i<ORole.length;i++) {
        QuickDiv[i].ElToggleble.forEach((ele)=>{ele.show()});  QuickDiv[i].butTog.myText('-').show();   QuickDiv[i].css({'padding-top':'.7em'});
        QuickDiv[i].butTog.css(ORole[i]==oC?'top':'bottom','0.3em');
      }
    }
  });
  el.butTog.css(oRole==oC?'top':'bottom','0.3em');
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
      var rb=createElement('input').prop({"type":"radio",name:'markSel'}).css({'margin':'0.6em 1.2em'}).prop('value',strName).on('change', changeFunc);
      if(boAndroid) rb.css({'-webkit-transform':'scale(2,2)'}); else rb.css({width:'1.4em',height:'1.4em'});
      var imgH=''; if(strName in oRole.helpBub) { imgH=imgHelp.cloneNode().css({'margin-right':'1em'});  popupHover(imgH,oRole.helpBub[strName]);  }
      var tdL=createElement('td').myAppend(calcLabel(langHtml.prop, strName),' ',imgH), tdRB=createElement('td').myAppend(rb);
      var r=createElement('tr').myAppend(tdL,tdRB).attr({name:strName});
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
    var strTmp=langHtml[indRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
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
  var buttonBack=createElement('button').myText(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'}).on('click', doHistBack);
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
    var strTmp=langHtml[indRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
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
    //var viewTmp=oRole.strRole=='customer'?viewColumnSorterC:viewColumnSorterS;
    //viewTmp.setVis();    doHistPush({view:viewTmp});
    viewColumnSorter.setVis();    doHistPush({view:viewColumnSorter});
  });
  var buttonBack=createElement('button').myText(strBackSymbol).css({'margin-left':'0.8em','margin-right':'1em'}).addClass('fixWidth').on('click', doHistBack);

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
    var strTmp=langHtml[indRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
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
  var buttonBack=createElement('button').css({'margin-left':'0.8em','margin-right':'1em'}).myText(strBackSymbol).addClass('fixWidth').on('click', doHistBack);
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


app.thumbTeamCreator=function(oRole){  // Used in plugin
  var el=createElement('a');
  var uRoleTeamImage=oRole==oC?uCustomerTeamImage:uSellerTeamImage;
  el.mySet=function(iMTab){
    var rT=oRole.MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam;
    if(data!=0) {
      el.show();
      var strTmp=uRoleTeamImage+data+'?v='+tag;
      img.prop({src:strTmp});
      var url=rT.linkTeam;  if(url && url.length && !RegExp("^https?:\/\/","i").test(url)) { url='http://'+url; }      el.prop({href:url});
    }else el.hide();

  }
  var img=createElement('img');    el.prop({target:"_blank"}).append(img);    return el;
}

app.complaintButtonCreator=function(oRole){
  var el=createElement('button');
  el.mySet=function(iMTab){    var rT=oRole.MTab[iMTab]; idUser=rT.idUser;   el.firstChild.nodeValue=rT.nComplaint;     }
  el.on('click', function(){
    viewComplainee.setUp(oRole, idUser); viewComplainee.load();
    viewComplainee.setVis();
    doHistPush({view:viewComplainee});
  });
  el.innerHTML=' ';
  var idUser;      return el;
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
        var strName=ele.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        var tmp=''; if('sortTabF' in tmpObj) tmp=tmpObj.sortTabF(i,ele);  else tmp=oRole.MTab[i][strName];     ele.valSort=tmp;
        var tmp=''; if('setTabF' in tmpObj) tmp=tmpObj.setTabF(i,ele);  else tmp=oRole.MTab[i][strName];
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
        var strName=ColsTmp[j], tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        var td=createElement('td').css({'max-width':'200px','max-height':'40px',overflow:'hidden'}).attr({'name':strName});
        if('crTabF' in tmpObj) tmpObj.crTabF(td);
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
      if(strName=='tel' && val.length || strName=='displayEmail' && val.length || strName=='link' && val.length || strName=='nComplaint') return;
      var viewroleInfo=strRole=='customer'?viewInfoC:viewInfoS;
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
    var strTmp=langHtml[indRole?'Sellers':'Customers']; spanRole.myText(' ('+strTmp+')');
    roleToggler.setStat(charRole);
    ElRole[indRole].show(); //.setUp();
    ElRole[1-indRole].hide();
  }

  var elRole;
  var ElRole=[];   for(var i=0;i<2;i++){ElRole[i]=tableCreator(ORole[i]); }
  var divCont=createElement('div').addClass('contDiv').myAppend(...ElRole);
  el.ElRole=ElRole;
  

      // divFoot
  var buttonBack=createElement('button').css({'margin-left':'0.8em'}).addClass('fixWidth').on('click', doHistBack).myText(strBackSymbol);

  var tmpf=function(){
    //var i=oRole.ind;  ViewColumnSelector[i].setVis(); doHistPush({view:ViewColumnSelector[i]});
    viewColumnSelector.setVis();  doHistPush({view:viewColumnSelector});
  };
  var tmpImg=createElement('img').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var buttShowSelect=createElement('button').css({'margin-left':'0.8em'}).prop('title',langHtml.AddRemoveColumns).addClass('fixWidth').on('click', tmpf).myAppend(tmpImg);

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
 * LoadTab-callbacks
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

var firstAJAXCall=function(latLngFirst){
  var setUpRet=function(data){
    var zoomLevel;  if('zoom' in data) zoomLevel=data.zoom;
    mapDiv.set1(zoomLevel, latLngFirstTmp);
    var boRefresh=mapDiv.setTile(zoomLevel);
  }
  clearTimeout(startPopTimer);  startPop.closeFunc();
  if(boVideo) latLngFirst=latLngDebug;
  window.latLngFirstTmp=latLngFirst;
  var pC=merProj.fromLatLngToPoint(latLngFirst);

  var rect=mapDiv.getBoundingClientRect(), VPSizeT=[rect.width,rect.height];

  var o1={pC:pC, VPSize:VPSizeT}, OFilt=[];
  for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
  var vec=[['getSetting',{Var:['boShowTeam']},viewAdmin.setUp], ['setupById', {}], ['VSetPosCond',pC],
    ['setUpCond',{CharRole:'cs', OFilt:OFilt}], ['setUp',o1,setUpRet], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];   majax(oAJAX,vec);
  setMess('',null,true);
}

app.loadTabStart=function(boSetupById=0){
  ga('send', 'event', 'tab', 'loadTab');
  var o1=mapDiv.getMapStatus(); // pC, zoom, VPSize

  var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
  var vec=[['setUpCond',{CharRole:'cs', OFilt:OFilt}], ['setUp',o1], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
  if(boSetupById){
    var arrRole=[]; if(userInfoFrDB.customer) arrRole.push('customer'); if(userInfoFrDB.seller) arrRole.push('seller');
    if(arrRole.length) vec.unshift(['setupById', {Role:arrRole}]);
  }
  majax(oAJAX,vec);

  setMess('',null,true);
}

var uploadPosNLoadTabStart=function(latLng, hideTimer, oRole){
  var setUpRet=function(data){
    var zoomLevel;  if('zoom' in data) zoomLevel=data.zoom;
    mapDiv.set1(zoomLevel, latLngFirstTmp);
    var boRefresh=mapDiv.setTile(zoomLevel);
  }
  mapDiv.setCentNMe(latLng);
  var o1=mapDiv.getMapStatus(), {pC}=o1;
  
  var arrRole=[]; if(userInfoFrDB.customer) arrRole.push('customer'); if(userInfoFrDB.seller) arrRole.push('seller');
  
  var OFilt=[]; for(var i=0;i<2;i++){ OFilt[i]=viewFilter.ElRole[i].gatherFiltData(); }
  var vec=[['RUpdate',{hideTimer: hideTimer, charRole:oRole.charRole}], ['RShow', {x:pC.x, y:pC.y, charRole:oRole.charRole}],  // copySome(o1, oRole, ['charRole'])],
    ['setupById', {Role:arrRole}], ['setUpCond',{CharRole:'cs', OFilt:OFilt}], ['setUp',o1,setUpRet], ['getList',{},getListRet], ['getGroupList',{},getGroupListRet], ['getHist',{},getHistRet]];
  
  majax(oAJAX,vec);
  setMess('',null,true);
}



var majax=function(trash, vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
  var xhr = new XMLHttpRequest();
  xhr.open('POST', uBE, true);
  xhr.setRequestHeader('X-Requested-With','XMLHttpRequest'); 
  var arrRet=[]; vecIn.forEach(function(el,i){var f=null; if(el.length==3) f=el.pop(); arrRet[i]=f;}); // Put return functions in a separate array
  vecIn.push(['CSRFCode',CSRFCode]);
  if(vecIn.length==2 && vecIn[0][1] instanceof FormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    formData.append('vec', JSON.stringify(vecIn));
    var dataOut=formData;
    xhr.setRequestHeader('x-type','single');
  } else { var dataOut=JSON.stringify(vecIn); }
  
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
  if('CSRFCode' in data) CSRFCode=data.CSRFCode;
  if('sessionLoginIdP' in data) sessionLoginIdP=data.sessionLoginIdP;
  //var WBD=[]; tmp=data.boSpecialistWannaBe; if(typeof tmp!="undefined") {
  //    for(var key in tmp){   if(boSpecialistWannaBe[key]==tmp[key]) {delete tmp[key];} else {boSpecialistWannaBe[key]=tmp[key]; }  } mainLoginInfo.setStat(); WBD=tmp; }
  var tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }  if(tmp.customer) viewFront.QuickDiv[0].setUp();  if(tmp.seller) viewFront.QuickDiv[1].setUp(); }
  if('nCustomerReal' in data) window.nCustomerReal=data.nCustomerReal;
  if('nSellerReal' in data) window.nSellerReal=data.nSellerReal;


  toggleSpecialistButts();
  mainLoginInfo.setStat();

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
  boFirstLoadTab=0;
}

var getHistRet=function(data){
  for(var i=0;i<ORole.length;i++) {
    viewFilter.ElRole[i].interpretHistPHP(data.arrHist[i])
    viewFilter.ElRole[i].update();
  }
};



var geoError=function(errObj) {
  var str='';
  var type='str';
  if(typeof errObj == 'string') str=errObj;
  else {
    if(errObj.code==errObj.PERMISSION_DENIED){
      type='PERMISSION_DENIED';
      str="geoLocation: PERMISSION_DENIED";
    }else if(errObj.code==errObj.POSITION_UNAVAILABLE){
      type='POSITION_UNAVAILABLE';
      str="getCurrentPosition failed: "+type+', '+errObj.message;
    }else if(errObj.code==errObj.TIMEOUT){
      type='TIMEOUT';
      str="getCurrentPosition failed: "+type+', '+errObj.message;
    }
    boGeoOK=false; setItem('boGeoOK',boGeoOK);

  }
  var strB='';
  if(browser.brand=='mozilla' && type!='PERMISSION_DENIED') strB=', Firefox might need Wifi to be on'; //langHtml.worksBetterWithWifi;
  if(browser.brand=='opera' && type!='PERMISSION_DENIED') strB=', Opera might need Wifi to be on';
  if(type=='POSITION_UNAVAILABLE') {
    if(boTouch)      strB=', Android: check that sharing of wifi-positioning / gps is enabled on your device.';
    else strB=', Wifi might need to be on.';
  }
  //if(boTouch && type=='TIMEOUT' && !boAndroid) strB=', Android: Geolocation stops working every once in a while (A bug). Try reboot the device.';
  //if(boTouch && type=='TIMEOUT' && boAndroid) {strB='Android: To use your exact location, you have to reboot your device. Read more in the FAQ.'; }
  //if(boTouch && type=='TIMEOUT' && boAndroid) {str=''; strB='Android user: GeoLocation is not working! Reboot your device might solve the problem. Read more in the FAQ.'; } //speciale

  var strB='';
  setMess(str+' '+strB);
  mapDiv.boGeoStatSucc=0;
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
var strHash=window.location.hash||"&",  params=parseQS(strHash.substring(1));
window.boEmulator=params.boEmulator||null;   window.startFilterC=params.idTeamC||null;   window.startFilterS=params.idTeamS||null;   window.boVideo=params.boVideo||null;

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
//var [oC,oS]=site.ORole;
//app.oC=site.oC; app.oS=site.oS;
[app.oC, app.oS]=ORole;

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
app.uCustomerTeamImage=uSite+'/image/c';
app.uSellerTeamImage=uSite+'/image/s';


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
app.uSetting1=uImageFolder+'setting1.png';
app.uFilter=uImageFolder+'filter.png';
app.uEqualizer=uImageFolder+'equalizer.png';
app.uMapm1=uImageFolder+'mapm1.png';
app.uMapm2=uImageFolder+'mapm2.png';
app.uColumn16=uImageFolder+'column16.png';
app.uMyMarker=uImageFolder+'myMarker.gif';
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
    var nameT=site.StrPlugInNArg[i], n=nameT.length, charRoleUC=nameT[n-1]; if(charRoleUC=='C' || charRoleUC=='S') {nameT=nameT.substr(0, n-1);} else charRoleUC='';
    PlugIn[i]=new CreatorPlugin[nameT](charRoleUC);
  }
};

rewriteProg();


   //
   // Make changes to langHtml
   //

   // Create ucfirst versions
var StrMakeUCase=['seller', 'sellers', 'customer', 'customers', 'column', 'visible', 'show'];
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
//replaceNom(langHtml,'SellerLogin'); // Not used
replaceNom(langHtml,'AppearAsCustomer');
replaceNom(langHtml,'AppearAsSeller');
replaceNom(langHtml,'FilterTitle');
replaceNom(langHtml,'ToggleBetweenCustomerAndSeller');
//replaceNom(langHtml,'gettingStartedLink');
replaceNom(langHtml,'toManyMess');
//replaceNom(langHtml,'SeeUnActivePopMess');
replaceNom(langHtml,'writeComplaintPopup');
replaceNom(langHtml,'introHeadC');
replaceNom(langHtml,'introHeadS');
replaceNom(langHtml,'LoginSingInAsSeller');

replaceNom(langHtml,'FilterC');
replaceNom(langHtml,'FilterS');
replaceNom(langHtml,'TableC');
replaceNom(langHtml,'TableS');

//replaceNom(langHtml,'DummiesShowingMess');


replaceNom(langHtml,'headOrdinalC');
replaceNom(langHtml,'headOrdinalDoubleC');
if(langHtml.customerRewritten!=langHtml.customer)  langHtml.headOrdinalC=langHtml.headOrdinalDoubleC;
replaceNom(langHtml,'labOrdinalC');

replaceNom(langHtml,'headOrdinalS');
replaceNom(langHtml,'headOrdinalDoubleS');
if(langHtml.sellerRewritten!=langHtml.seller)  langHtml.headOrdinalS=langHtml.headOrdinalDoubleS;
replaceNom(langHtml,'labOrdinalS');

replaceNom(langHtml,'ChangeMapMarkersC');
replaceNom(langHtml,'ChangeMapMarkersS');

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

var CSRFCode='';

app.curTime=0;


app.currencies=[['UAE Dirham','Afghani','Lek','Armenian Dram','Netherlands Antillean Guilder','Kwanza','Argentine Peso','Australian Dollar','Aruban Florin','Azerbaijanian Manat','Convertible Mark','Barbados Dollar','Taka','Bulgarian Lev','Bahraini Dinar','Burundi Franc','Bermudian Dollar','Brunei Dollar','Boliviano','Mvdol','Brazilian Real','Bahamian Dollar','Ngultrum','Pula','Belarussian Ruble','Belize Dollar','Canadian Dollar','Congolese Franc','WIR Euro','Swiss Franc','WIR Franc','Unidades de fomento','Chilean Peso','Yuan Renminbi','Colombian Peso','Unidad de Valor Real','Costa Rican Colon','Peso Convertible','Cuban Peso','Cape Verde Escudo','Czech Koruna','Djibouti Franc','Danish Krone','Dominican Peso','Algerian Dinar','Egyptian Pound','Nakfa','Ethiopian Birr','Euro','Fiji Dollar','Falkland Islands Pound','Pound Sterling','Lari','Ghana Cedi','Gibraltar Pound','Dalasi','Guinea Franc','Quetzal','Guyana Dollar','Hong Kong Dollar','Lempira','Croatian Kuna','Gourde','Forint','Rupiah','New Israeli Sheqel','Indian Rupee','Iraqi Dinar','Iranian Rial','Iceland Krona','Jamaican Dollar','Jordanian Dinar','Yen','Kenyan Shilling','Som','Riel','Comoro Franc','North Korean Won','Won','Kuwaiti Dinar','Cayman Islands Dollar','Tenge','Kip','Lebanese Pound','Sri Lanka Rupee','Liberian Dollar','Loti','Lithuanian Litas','Latvian Lats','Libyan Dinar','Moroccan Dirham','Moldovan Leu','Malagasy Ariary','Denar','Kyat','Tugrik','Pataca','Ouguiya','Mauritius Rupee','Rufiyaa','Kwacha','Mexican Peso','Malaysian Ringgit','Mozambique Metical','Namibia Dollar','Naira','Cordoba Oro','Norwegian Krone','Nepalese Rupee','New Zealand Dollar','Rial Omani','Balboa','Nuevo Sol','Kina','Philippine Peso','Pakistan Rupee','Zloty','Guarani','Qatari Rial','New Romanian Leu','Serbian Dinar','Russian Ruble','Rwanda Franc','Saudi Riyal','Solomon Islands Dollar','Seychelles Rupee','Sudanese Pound','Swedish Krona','Singapore Dollar','Saint Helena Pound','Leone','Somali Shilling','Surinam Dollar','South Sudanese Pound','Dobra','El Salvador Colon','Syrian Pound','Lilangeni','Baht','Somoni','Turkmenistan New Manat','Tunisian Dinar','Pa´anga','Turkish Lira','Trinidad and Tobago Dollar','New Taiwan Dollar','Tanzanian Shilling','Hryvnia','Uganda Shilling','US Dollar','Peso Uruguayo','Uzbekistan Sum','Bolivar Fuerte','Dong','Vatu','Tala','CFA Franc BEAC','East Caribbean Dollar','CFA Franc BCEAO','CFP Franc','Yemeni Rial','Rand','Zambian Kwacha','Zimbabwe Dollar',],
['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BOV','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHE','CHF','CHW','CLF','CLP','CNY','COP','COU','CRC','CUC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','FKP','GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LTL','LVL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','SSP','STD','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VEF','VND','VUV','WST','XAF','XCD','XOF','XPF','YER','ZAR','ZMK','ZWL',],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,3,2,0,2,3,0,2,2,2,0,2,0,3,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,0,0,2,0,2,0,0,2,2,2,2,]
];



var imgBusy=createElement('img').prop({src:uBusy});
var spanMessageText=spanMessageTextCreate();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  elBody.append(spanMessageText)

var busyLarge=createElement('img').prop({src:uBusyLarge}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
elBody.append(busyLarge);


app.merProj=new MercatorProjection();

var tmp=getItem('boFirstVisit'),  boFirstVisit=tmp===null;      setItem('boFirstVisit',0);

app.imgHelp=createElement('img').prop({src:uHelpFile}).css({'vertical-align':'-0.4em', 'margin-left':'0.6em'});
app.hovHelp=createElement('span').myText('?').css({'font-size':'88%',color:'#a7a7a7','vertical-align':'-0.4em'}); //on('click', function(){return false;})    //'pointer-events':'none',

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




var strHistTitle=site.wwwSite;
var histList=[];
var stateLoaded=history.state;
var tmpi=stateLoaded?stateLoaded.ind:0,    stateLoadedNew={hash:randomHash(), ind:tmpi};
history.replaceState(stateLoadedNew, '', uCanonical);
var stateTrans=stateLoadedNew;
history.StateMy=[];
window.on('popstate', function(event) {
  var dir=history.state.ind-stateTrans.ind;
  //if(Math.abs(dir)>1) {debugger; alert('dir=',dir); }
  var boSameHash=history.state.hash==stateTrans.hash;
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

    stateTrans=extend({}, tmpObj);
  }else{
    stateTrans=history.state; extend(stateTrans, {hash:randomHash()}); history.replaceState(stateTrans, '', uCanonical);
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
[app.mainIntroPopC, app.mainIntroPopS]=MainIntroPop;  [app.listCtrlDivC, app.listCtrlDivS]=ListCtrlDiv;
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
app.viewSettingW=viewSettingWCreator().addClass('mainDiv');
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
//[viewSettingC,viewSettingS]=ViewSetting;
[app.viewTeamC, app.viewTeamS]=ViewTeam;
//[viewFilterC, viewFilterS]=ViewFilter;   //[viewColumnSelectorC, viewColumnSelectorS]=ViewColumnSelector;   //[viewColumnSorterC, viewColumnSorterS]=ViewColumnSorter;
//[viewTableC, viewTableS]=ViewTable;
[app.viewEntryC, app.viewEntryS]=ViewEntry;
[app.viewInfoC, app.viewInfoS]=ViewInfo;  // [viewMarkSelectorC, viewMarkSelectorS]=ViewMarkSelector;


   // Let plugins rewrite objects
for(var i=0;i<PlugIn.length;i++){  var tmp=PlugIn[i].rewriteObj; if(tmp) tmp();   }

viewUserSetting.createDivs();
for(var i=0;i<ORole.length;i++){
  viewSetting.ElRole[i].createDivs();
  viewFilter.ElRole[i].createDivs();
  var tmpStartFilter=ORole[i].strRole=='customer'?startFilterC:startFilterS;
  if(tmpStartFilter){
    var StrOrderFilt=ORole[i].filter.StrProp, StrOrderFiltFlip=array_flip(StrOrderFilt);
    viewFilter.ElRole[i].Filt[StrOrderFiltFlip.idTeam]=[[],[tmpStartFilter],1];
  }

  viewTable.ElRole[i].createTBody();   viewTable.ElRole[i].setRowDisp();

  ViewInfo[i].createContainers();
  //ViewColumnSelector[i].createTable();
  viewColumnSelector.ElRole[i].createTable();
  viewMarkSelector.ElRole[i].createTable();
}

if(typeof StrMainProt=='undefined') var StrMainProt=[];
StrMainProt.push('front', 'userSetting', 'admin', 'complainee', 'complainer', 'formLogin', 'createUser', 'convertID', 'settingW', 'deleteAccountPop', 'complaintCommentPop', 'complaintAnswerPop', 'uploadImage', 'changePWPop', 'forgottPWPop', 'columnSorter', 'columnSelector', 'table', 'markSelector', 'filter', 'setting');

if(typeof StrMainProtDual=='undefined') var StrMainProtDual=[];
StrMainProtDual.push( 'info', 'entry', 'team');

var MainDiv=[];
for(var i=0;i<StrMainProt.length;i++){ var key='view'+ucfirst(StrMainProt[i]); MainDiv.push(window[key]); }
for(var i=0;i<StrMainProtDual.length;i++){ var key='view'+ucfirst(StrMainProtDual[i]);  MainDiv.push(window[key+'C']); MainDiv.push(window[key+'S']); }



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
//viewTableC.setVis=
viewTable.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.prepend(...DivTopMain);
  this.setUp();
  //$('meta[name=viewport]').prop({'user-scalable':'true'});
  scalableTog(1);
  return true;
}
//viewFilterC.setVis=
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
//viewSettingC.setVis=function(){
  //if(!userInfoFrDB.customer) return false;
  //MainDiv.forEach(ele=>ele.hide()); this.show();
  //this.setUp();
  //scalableTog(1);
  //return true;
//}
//viewSettingS.setVis=function(){
  //if(!userInfoFrDB.seller) return false;
  //MainDiv.forEach(ele=>ele.hide()); this.show();
  //this.setUp();
  //scalableTog(1);
  //return true;
//}
viewSetting.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewInfoC.setVis=
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
viewEntryC.setVis=
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
viewSettingW.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  //this.setUp();
  this.prepend(...DivTopMain);
  scalableTog(1);
  return true;
}
//viewColumnSelectorC.setVis=
viewColumnSelector.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
//viewColumnSorterC.setVis=
viewColumnSorter.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
//viewMarkSelectorC.setVis=
viewMarkSelector.setVis=function(){
  MainDiv.forEach(ele=>ele.hide()); this.show();
  this.setUp();
  scalableTog(1);
  return true;
}
viewTeamC.setVis=
viewTeamS.setVis=function(){
  if(this.boLoaded==0) return false;
  MainDiv.forEach(ele=>ele.hide()); this.show();
  scalableTog(1);
  return true;
}

//viewLogin.setVis=function(){
  //MainDiv.forEach(ele=>ele.hide()); this.show();
  //scalableTog(1);
  //return true;
//}


busyLarge.show();

var boFirstLoadTab=1;

if(boEmulator || boVideo) {
  var latLngDebug={lat:59.330454370984235, lng:18.059076067697106};
  var posDebug={coords:{latitude:latLngDebug.lat,longitude:latLngDebug.lng}};
}
window.addEventListener("resize", function(){
  mapDiv.dispatchEvent(new Event('myResize'));
});

//ga('send', 'event', 'button', 'click', 'geoOK');

var boFirstPosOK=0;

var tmpFGeoSuccess=function(pos){
  //tmpFUseApprox=doNothing;
  if(typeof timerCoordApprox!='undefined') clearTimeout(timerCoordApprox);
  //clearTimeout(timerGeoNotOK);
  boFirstPosOK=1;
  boGeoOK=true; setItem('boGeoOK',boGeoOK);
  var latLng={lat:pos.coords.latitude, lng:pos.coords.longitude};
  if(typeof boApproxCalled!='undefined') { 
    mapDiv.setCentNMe(latLng);
  } else firstAJAXCall(latLng);
  
}

if(boEmulator){ tmpFGeoSuccess(posDebug); }else{ navigator.geolocation.getCurrentPosition(function(pos){tmpFGeoSuccess(pos);}, geoError,{timeout:20000,maximumAge:60000});  }
//, {maximumAge:Infinity, timeout:5000,enableHighAccuracy:false}
//setMess('... getting position ... ',null,true);
var tmpFUseApprox=function(){
  var latLng={lat:coordApprox[0],lng:coordApprox[1]};  if(boVideo) latLng=latLngDebug;
  var boApproxCalled=true;
  firstAJAXCall(latLng);
}
//var tmpFGeoNotOK=function(){ boGeoOK=false; setItem('boGeoOK',boGeoOK); }
var boGeoOK=getItem('boGeoOK');  if(boGeoOK===null) boGeoOK=false;
//var tTmp=2; if(boAndroid && boGeoOK) tTmp=10;
var tTmp=2; if(boGeoOK) tTmp=10;
var timerCoordApprox=setTimeout(tmpFUseApprox,(tTmp)*1000);
boGeoOK=false;  setItem('boGeoOK',boGeoOK);
//timerGeoNotOK=setTimeout(tmpFGeoNotOK,20*1000);


};

//0123456789abcdef






