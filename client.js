

/*jshint asi:true*/
/*jshint esversion: 6*/
/* jshint shadow:true */
/* jshint funcscope:true */
/*jshint -W041: false */


// Page for testing if nComplaints and nComplaintsWritten corresponds with complaitsTab
// nComplaints not reduced when deleteAccount is called
// nComplaint, nComplaintGiven, donatedAmount, boImgOwn, image, imTag, displayName, tea.link (linkTeam), tea.imTag (imTagTeam) in roleTab

// cookie aren't allowed, are they?
// columnSorterDivExtend: Can it be used without creating two instances?
// Obscurifying
// oBuyer instead of oC
// charCamera='📷'

// does miles work
// Analytics event from clicking moreinfo link

var CreatorPlugin={};


CreatorPlugin.general=function(){
  
  strUnitDist='km';
  strUnitTime='h';
    // Some conveniently grouped properties
  StrPropPerson=['image', 'idTeam', 'displayName'];
  StrPropContact=['tel', 'displayEmail', 'homeTown', 'link'];
  StrPropPos=['dist', 'tPos', 'coordinatePrecisionM'];
  StrPropRep=['tCreated', 'tAccumulated', 'donatedAmount', 'nComplaint']; //, 'histActive'


  var oTmp={StrProp:[], StrGroupFirst:[], StrGroup:[]};
  var oRoleProt={ MTab:[], nMTab:0, MGroupTab:[], Main:oTmp, roleSetting:copyDeep(oTmp), filter:copyDeep(oTmp)};  // , colOneMark:"", ColsShow:[] 
  extend(oC,oRoleProt); extend(oS,copyDeep(oRoleProt));
  extend(oC,{ strColor:'pink', strGroupColor:'#fd98a9'});  
  extend(oS,{ strColor:'lightblue', strGroupColor:'#9ca6e8' });
  oS.yOffsetGroupMarker=1;
  
  strUnitDistDefault='km'; //if(strLang=='en') {strUnitDistDefault='mile'; }
  if(boNewVersion) { setItem('strUnitDist',strUnitDistDefault);}
  strUnitDist=getItem('strUnitDist');  if(strUnitDist===null) strUnitDist=strUnitDistDefault;


    // UnitDistChoise
  setUnitDist=function(unit){
    strUnitDist=unit;   setItem('strUnitDist',strUnitDist);
    $tableDivS.setCell();
    $tableDivC.setCell();  $mapDiv.setMarkers();
  };
  UnitDistChoise=function(){
    var el=createElement('span'); $.extend(el, UnitDistChoise.tmpPrototype);
    el.butKM=createElement('button'); el.butKM.innerHTML='km'; el.butKM.on('click',function(e){e.stopPropagation(); if(strUnitDist=='mile'){setUnitDist('km'); UnitDistChoise.tmpPrototype.setUpAll(); } });
    el.butMile=createElement('button'); el.butMile.innerHTML='mile'; el.butMile.on('click',function(e){e.stopPropagation(); if(strUnitDist=='km'){setUnitDist('mile'); UnitDistChoise.tmpPrototype.setUpAll(); } });
    //var colOn={background:'#4f4'}, colOff={background:'#eee'};
    el.appendChildren(el.butKM, createElement('br'), el.butMile);
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
      var $tmp = timeStampButtExtend($("<button>"), i, 'tLastPriceChange').css({padding:'0.3em 0.5em'});    $TableDiv[i].$tHeadLabel.find('[name=tLastPriceChange]').append($tmp);
      var $tmp = timeStampButtExtend($("<button>"), i, 'tPos').css({padding:'0.3em 0.5em'});    $TableDiv[i].$tHeadLabel.find('[name=tPos]').append($tmp);
      
      let $distUnitChoiseT=$(new UnitDistChoise());   $distUnitChoiseT.addClass('smallButt').css({padding:'0.5em 0.1em'});
      $TableDiv[i].$tHeadLabel.find('[name=dist]').append($distUnitChoiseT);
      
        // filterDiv
      let h=langHtml.timeUnit.h[1], mon=langHtml.timeUnit.mo[3];
      $FilterDiv[i].$filterDivI.Unit={tPos:h,tCreated:mon,tAccumulated:mon};
    }
    
      // settingDivW: Add distUnitChoise
    let $distUnitChoiseT=$(new UnitDistChoise());  $distUnitChoiseT.children('br').remove(); $distUnitChoiseT.prepend(langHtml.DistanceUnit,': ');
    let $opt=$([]).push($distUnitChoiseT);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
    $settingDivW.children('#buttShowMarkSelectS').after($opt);

      //
      // Prop
      //

      // currency
    var tmpf=function(){
      var $c=$('<select>').prop('id','currency');
      for(var i=0;i<currencies[0].length;i++){    var $opt=$("<option>").text(currencies[1][i]+' ('+currencies[0][i]+')').val(currencies[1][i]);   $c.append($opt);    }
      var $optT=$c.find("option[value='USD']");    $optT.prop('selected', 'selected');
      return $c;
    }
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.currency, {strType:'select', crInp:tmpf });
    }

      // tCreated, tLastPriceChange, tPos
    makeTimeF=function(iRole,strN,dir){return function(iMTab){
      var data=ORole[iRole].MTab[iMTab][strN];
      if(ORole[iRole].Prop[strN].boUseTimeDiff) data=UTC2ReadableDiff(dir*(data-curTime)); else data=UTC2Readable(data); return data;
    }; };
    for(let i=0;i<ORole.length;i++){
      var tmpF=makeTimeF(i,'tCreated',-1);    $.extend(ORole[i].Prop.tCreated, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
      var tmpF=makeTimeF(i,'tLastPriceChange',-1);   $.extend(ORole[i].Prop.tLastPriceChange, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
      var tmpF=makeTimeF(i,'tPos',-1);   $.extend(ORole[i].Prop.tPos, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    }

      // tAccumulated, IP
    for(let i=0;i<ORole.length;i++){
      var tmpF=function(iMTab,$c){ return UTC2ReadableDiff(ORole[i].MTab[iMTab].tAccumulated); };
      $.extend(ORole[i].Prop.tAccumulated, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    }

      // nComplaint
    var tmpSetNComplaint=function(iMTab,$c){   $c.children('button')[0].mySet(iMTab);   };
    for(let i=0;i<ORole.length;i++){
      var tmpCrNComplaint=function($c){  $c.append(  $(complaintButtonExtend($('<button>')[0], ORole[i]))  ); };
      $.extend(ORole[i].Prop.nComplaint, { setInfo:tmpSetNComplaint, crInfo:tmpCrNComplaint, setTabF:tmpSetNComplaint, crTabF:tmpCrNComplaint});
    }

      // idTeam
    var tmpSetIdTeam=function(iMTab,$c){   $c.children('a')[0].mySet(iMTab);   };
    var tmpSetRowButtF=function($span,val,boOn){ $span.mySet(val,boOn); }
    for(let i=0;i<ORole.length;i++){
      var tmpCrIdTeam=function($c){  $c.append(  $(thumbTeamExtend($('<a>')[0], ORole[i]))  );   };
      $.extend(ORole[i].Prop.idTeam, { setInfo:tmpSetIdTeam, crInfo:tmpCrIdTeam, setTabF:tmpSetIdTeam, crTabF:tmpCrIdTeam,
        setMapF:function(iMTab){
          var rT=ORole[i].MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam, tmp;
          if(data && data.length>0 && data!==0) {
            var strTmp=uSellerTeamImage+data+'?v='+tag;
            tmp = {url:strTmp, boUseFrame:true};
          } else tmp=langHtml.IndependentSeller.replace("<br>","\n");
          return tmp;
        },
        setRowButtF:tmpSetRowButtF,
        crRowButtF:function(i){ return teamImgButtonExtend($('<span>'), ORole[i]).css({'margin-right':'0.25em'}); }
      });
    }


      // dist
    for(let i=0;i<ORole.length;i++){
      let tmpSetDist=function(iMTab){
        var rT=ORole[i].MTab[iMTab],  tmpPoint = [rT.x, rT.y],   latLngT=merProj.fromPointToLatLng(tmpPoint);
        
        var pC=$mapDiv.getPWCC(), latLngMe=merProj.fromPointToLatLng(pC);
        var dist=distCalc(latLngT.lng,latLngT.lat,latLngMe.lng,latLngMe.lat);  if(strUnitDist=='mile') dist=dist/1.609;
        return Number(dist.toFixed(1));
      };
      var tmpSetDistOther=function(iMTab,$c){return tmpSetDist(iMTab,$c)+' '+strUnitDist;};
      $.extend(ORole[i].Prop.dist, {
        setInfo:tmpSetDistOther,
        setTabF:tmpSetDist,sortTabF:tmpSetDist,
        setMapF:tmpSetDistOther,setMapMF:tmpSetDistOther
      });
    }


      // displayName
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.displayName, {strType:'text',inpW:9});
    }

      // tel
    var tmpCrTel=function($c){   $c.append($('<a>'));  };
    for(let i=0;i<ORole.length;i++){
      var tmpSetTel=function(iMTab,$c){  var tmp=ORole[i].MTab[iMTab].tel.trim();    $c.children('a').prop({href:'tel:'+tmp}).text(tmp).toggle(tmp.length>0);  }
      $.extend(ORole[i].Prop.tel, {  strType:'tel',inpW:6,  setInfo:tmpSetTel, crInfo:tmpCrTel, setTabF:tmpSetTel, crTabF:tmpCrTel });
    }
    
      // displayEmail
    for(let i=0;i<ORole.length;i++){
      var tmpSet=function(iMTab,$c){  var tmp=ORole[i].MTab[iMTab].displayEmail.trim();    $c.children('a').prop({href:'mailto:'+tmp}).text(tmp).toggle(tmp.length>0);  }
      $.extend(ORole[i].Prop.displayEmail, {  strType:'email',inpW:6, setInfo:tmpSet, crInfo:tmpCr, setTabF:tmpSet, crTabF:tmpCr });
    }

      // link
    var makeMapF=function(iRole,strName,n){return function(iMTab){var str=ORole[iRole].MTab[iMTab][strName],n=40; return str.length>n?str.substr(0,n)+'…':str;}  };
    var makeMapMF=function(iRole,strName,n){return function(iMTab){var str=ORole[iRole].MTab[iMTab][strName]; return str.length>n?str.substr(0,n)+'…':str;}  };
    var makeInfoF=function(iRole){return function(iMTab,$c){
        var url=ORole[iRole].MTab[iMTab].link; if(url && !RegExp("^https?:\\/\\/").test(url)) { url='http://'+url; }
        $c.children('a').prop({href:url}).text(url).toggle(url.length>0);
      }};
    var tmpCrInfo=function($c){  $c.append(  $('<a>').prop({target:"_blank"})  );   }
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.link, { strType:'url',inpW:9, setInfo:makeInfoF(i), crInfo:tmpCrInfo, setMapF:makeMapF(i, 'link'), setMapMF:makeMapMF(i, 'link', 40-langHtml.label.link.length)  });
    }

      // idFB, idIdPlace, idOpenId
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.idFB, {setMapF:makeMapF(i, 'idFB'), setMapMF:makeMapMF(i, 'idFB', 40-langHtml.label.idFB.length)});
      $.extend(ORole[i].Prop.idIdPlace, {setMapF:makeMapF(i, 'idIdPlace'), setMapMF:makeMapMF(i, 'idIdPlace', 40-langHtml.label.idIdPlace.length)});
      $.extend(ORole[i].Prop.idOpenId, {setMapF:makeMapF(i, 'idOpenId'), setMapMF:makeMapMF(i, 'idOpenId', 40-langHtml.label.idOpenId.length)});
    }
    
      // homeTown
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.homeTown, {strType:'text',inpW:6});
    }

      // idTeamWanted
    var tmpSet=function($c){ $c[0].setStat(); }
    var tmpSave=function($c){return [null, $c[0].$inp.val().trim()];}
    for(let i=0;i<ORole.length;i++){
      var tmpCr=function(){ var $c=$(spanIdTeamWantedExtend($('<span>')[0], ORole[i])); return $c;  }
      $.extend(ORole[i].Prop.idTeamWanted, {strType:'span',inpW:3, crInp:tmpCr, setInp:tmpSet, saveInp:tmpSave });
    }

      // coordinatePrecisionM
    var tmpCr=function(){
      var $c=$('<select>'); for(var i=0;i<arrCoordinatePrecisionM.length;i++){ var v=arrCoordinatePrecisionM[i], $op=$("<option>").val(v).append(approxDist(v)); $c.append($op); }   return $c;
    }
    for(let i=0;i<ORole.length;i++){
      var tmpSet=function($c){  var [bestVal, iBest]=closest2Val(arrCoordinatePrecisionM, userInfoFrDB[ORole[i].strRole].coordinatePrecisionM); $c.val(bestVal);  }
      $.extend(ORole[i].Prop.coordinatePrecisionM, {strType:'select', crInp:tmpCr, setInp:tmpSet});
    }

      // image
    calcImageUrl=function(rT){ // Keys of rT: ["idUser", "boImgOwn", "imTag", "image"]
      var tmp='',  boImgOwn=Number(rT.boImgOwn);
      if(boImgOwn  || rT.image.length==0) tmp=uUserImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image;
      return tmp;
    };
    calcImageUrlUser=function(){    return {str:calcImageUrl(userInfoFrDB.user),    boImgOwn:Boolean(Number(userInfoFrDB.user.boImgOwn))};     }
    var tmpCrInp=function(){
      var $c=$('<span>');
      var $thumb=$c[0].$thumb=$('<img>').css({'vertical-align':'middle'});
      $c[0].$butDeleteImg=$('<button>').append(langHtml.Delete).on('click', function(){
        var vec=[['deleteImage',1,function(data){
          if(data.boOK) userInfoFrDB.user.boImgOwn=0;
          $settingDivC.setUp();
          $settingDivS.setUp();
        }]];   majax(oAJAX,vec);
      });
      var uploadCallback=function(){
        userInfoFrDB.user.boImgOwn=1; userInfoFrDB.user.imTag=randomHash(); var tmp=calcImageUrlUser(); $thumb.attr({src:tmp.str}); $c[0].$butDeleteImg.toggle(tmp.boImgOwn);
      }
      var $buttUploadImage=$('<button>').html(langHtml.uploadNewImg).on('click', function(){$uploadImageDiv.openFunc('u',uploadCallback);});
      $c.append($c[0].$thumb, $c[0].$butDeleteImg, $buttUploadImage);  //langHtml.YourImage+': ',
      return $c;
    };
    var tmpSetInp=function($c){
      var tmp=calcImageUrlUser();
      $c[0].$butDeleteImg.toggle(tmp.boImgOwn);
      $c[0].$thumb.prop({src:tmp.str});
    };
    var tmpSaveInp=function(){return [null,null];}
    var tmpCrImage=function($c){ $c.append($('<img>'));  };
    for(let i=0;i<ORole.length;i++){
      var tmpSetImage=function(iMTab,$c){ $c.children('img').prop({src:calcImageUrl(ORole[i].MTab[iMTab])});  };
      $.extend(ORole[i].Prop.image, {  strType:'span',  crInp:tmpCrInp, setInp:tmpSetInp, saveInp:tmpSaveInp, setInfo:tmpSetImage, crInfo:tmpCrImage,
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

CreatorPlugin.vehicleType=function(){

  //enumVehicleType=Enum.vehicleType;
  var enumVehicleType=oS.Prop.vehicleType.Enum;

    // images
  var strPlugin='vehicleType';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  uVehicleType=uSpecImageFolder+'vehicleType.png';
  uVehicleTypeW=uSpecImageFolder+'vehicleTypeW.png';
  //uVehicleTypeZ=uSpecImageFolder+'vehicleTypeZ.png';
  uVehicleTypeInactive=uSpecImageFolder+'vehicleTypeInactive.png';
  uVehicleTypeDummy=uSpecImageFolder+'vehicleTypeDummyG.png';
  uDummy=uSpecImageFolder+'dummy.png';
  uSleepy=uSpecImageFolder+'carSleepy.png';

  //$body.css({background:'url('+uSpecImageFolder+'tsBackgroundWW.png)'});

  vehSprite={
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

  vehSpriteW=$.extend({},vehSprite); vehSpriteW.url=uVehicleTypeW;
  for(var i=0;i<enumVehicleType.length;i++) {var k=enumVehicleType[i],fn=vehSpriteW.item[k],fo=vehSprite.item[k]; fn.x=fn.x-1; fn.y=fo.y-1; fn.w=fo.w+2; fn.h=fo.h+2;}
  vehSpriteZ=$.extend({},vehSpriteW); vehSpriteZ.url=uVehicleTypeInactive;
  vehSpriteDummy=$.extend({},vehSpriteW); vehSpriteDummy.url=uVehicleTypeDummy;


  rewriteLangDriver=function(){
    langHtml.sellerRewritten=langHtml.driver;
    boRewriteSeller=true;
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
    var tmpSetVehicleType=function(iMTab,$c){     $c.children('span')[0].mySet(Number(  oS.MTab[iMTab].vehicleType  ));    };
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
    var tmpCrVehicleType=function($c){   $c.append(  $(spriteExtend($('<span>')[0], vehSprite))  );   };
    $.extend(oS.Prop.vehicleType, {
      crInp:function(){ var $c=$(selSpriteExtend($('<span>')[0],vehSprite)); return $c; },
      setInp:function($c){ $c[0].mySet(userInfoFrDB.seller.vehicleType); },
      saveInp:function($c){return [null, $c[0].myGet()];},
      setInfo:tmpSetVehicleType,crInfo:tmpCrVehicleType,
      setTabF:tmpSetVehicleType,crTabF:tmpCrVehicleType,
      setMapF:tmpSetVehicleTypeM, setMapMF:tmpSetVehicleTypeMM,
      crRowButtF:function(i){ $span=$(spriteExtend($('<span>')[0],vehSprite));    $span[0].mySet(i);  return $span;},
      setRowButtF:function($span,val,boOn){   $span[0].mySet(val);  if(boOn) opacity=1; else opacity=0.4; $span.children('img').css({opacity: opacity});  }
    });
  }
}
//0123456789abcdef

//    Notes regarding comparePrice
// comparePriceDataPopExtend
// ComparePriceButSpan
      // Rewrite $infoDivS.createContainers to add ComparePriceButSpan
      // Add ComparePriceButSpan to $tableDivS.$tHeadLabel
      // Add ComparePriceButSpan to $settingDivW

    // Rewrite setUnitDist
    
          // comparePrice  calcComparePrice


CreatorPlugin.distNTimePrice=function(){
  
  if(typeof StrMainDiv=='undefined') StrMainDiv=[];
  StrMainDiv.push('comparePriceDataPop');
  
  
  comparePriceDataPopExtend=function($el){
    $el.toString=function(){return 'comparePriceDataPop';}
    $el.openFunc=function(extraSaveFuncT){
      $dist.val(comparePrice.dist);
      $unit.val(strUnitDist);
      $time.val(comparePrice.time);
      $divTimeLab.html(langHtml.Time+' ('+langHtml.timeUnit[strUnitTime][3]+'): ');
      $mess.html('');
      if(typeof extraSaveFuncT!='undefined') extraSaveFunc=extraSaveFuncT; else extraSaveFunc=null;
      doHistPush({$view:$comparePriceDataPop});
      $el.setVis();
    };
    $el.setVis=function(){ $el.show(); return true;  }
    var saveFunc=function() {
      var dist=Number($dist.val()), unit=$unit.val(), time=Number($time.val());
      if(isNaN(dist)) {$mess.html('input not valid'); return;}
      if(isNaN(time)) {$mess.html('input not valid'); return;}
      strUnitDist=unit; comparePrice.dist=dist; comparePrice.time=time;
      setItem('comparePriceData',{dist:dist, time:time});
      setItem('strUnitDist',strUnitDist);

      ComparePriceButSpan.tmpPrototype.setUpAll();
      $tableDivS.$tHeadLabel.setPricePerDistCanvas();
      UnitDistChoise.tmpPrototype.setUpAll(); //setUnitDistButtons();
      $tableDivS.setCell();
      
      for(var i=0;i<ORole.length;i++) {
        if(ORole[i].MTab.length){    $mapDiv[0].ArrMarker[i].setMarkers();  $mapDiv[0].ArrMarker[i].drawMarkers();   }
      }

      if(extraSaveFunc) extraSaveFunc();
      doHistBack();
    };
    $el.setDefault=function(dist,time){  // Used by plugins
      comparePrice={dataDefault:{dist:dist,time:time}};
      if(boNewVersion) {  setItem('comparePriceData',comparePrice.dataDefault);  }
      var tmp=getItem('comparePriceData');  if(tmp===null) tmp=$.extend({}, comparePrice.dataDefault);
      comparePrice.dist=tmp.dist; comparePrice.time=tmp.time;
    };

    var extraSaveFunc;
    var $dist=$('<input type=number>').prop({min:0}).css({'width':'3em','margin':'0em 0.5em'}).on('keypress', function(e){if(e.which==13) {saveFunc();return false;}} );
    var $unit=$('<select>');  $unit.append($('<option>').val('km').text('km')).append($('<option>').val('mile').text('mile'));
    var $time=$('<input type=number>').prop({min:0}).css({'width':'3em'}).on('keypress', function(e){if(e.which==13) {saveFunc();return false;}} );

    var $head=$('<h3>').append(langHtml.comparePrice.head);
    //var $divDist=$('<div>').append(createTextNode(langHtml.Distance+': '), $dist, $unit);
    var $divDist=$('<div>').append(langHtml.Distance, $dist, $unit);
    var $divTimeLab=$('<span>'), $divTime=$('<div>').append($divTimeLab, $time);

    var $buttDefault=$('<button>').append(langHtml.Default).css({display:'block','margin':'0.8em 0em'}).on('click', function() { 
      $dist.val(comparePrice.dataDefault.dist); $unit.val(strUnitDistDefault); $time.val(comparePrice.dataDefault.time);
    });
    var $buttCancel=$('<button>').on('click', doHistBack).append(langHtml.Cancel);
    var $buttonSave=$('<button>').on('click', saveFunc).append(langHtml.Done);

    $el.find('p').css({'margin':'0.8em'});
    $divDist.add($divTime).css({'margin-top':'0.8em'});
    var $vSpace=$('<div>').css({height:'0.6em'}),  $mess=$('<div>');
    $el.append($head,$divDist,$divTime,$buttDefault,$buttCancel,$buttonSave,$mess);

    $el.css({'text-align':'left'});

    var $blanket=$('<div>').addClass("blanket");
    var $centerDiv=$('<div>').append($head,$divDist,$divTime,$buttDefault,$buttCancel,$buttonSave,$mess);
    $centerDiv.addClass("Center").css({'min-width':'220px', padding: '1em'});  // 'width':'20em', height:'18em', 
    $el.addClass("Center-Container").append($centerDiv,$blanket); //

    return $el;
  }
  
  $comparePriceDataPop=comparePriceDataPopExtend($('<div>'));


    // comparePriceButSpan: in settingDivW, infoDivS, tableHead,
  var ComparePriceButSpan=function(strFormat, func){
    var el=createElement('span'); $.extend(el, ComparePriceButSpan.tmpPrototype);
    el.strFormat=strFormat;  el.elSpan=createElement('span');
    var elButPricePref=createElement('button'); elButPricePref.append(el.elSpan); elButPricePref.on('click',function(){$comparePriceDataPop.openFunc(function(){ ComparePriceButSpan.tmpPrototype.setUpAll(); if(func) func();} ); return false;});
    if(!boTouch) popupHoverJQ($(elButPricePref), $('<div>').html(langHtml.pricePref.pop));
    el.append(elButPricePref);
    ComparePriceButSpan.tmpPrototype.arrEl.push(el);
    return el;
  }
  ComparePriceButSpan.tmpPrototype={};
  ComparePriceButSpan.tmpPrototype.arrEl=[];
  ComparePriceButSpan.tmpPrototype.setUp=function(){
    this.elSpan.innerHTML=String.format(this.strFormat, Number(comparePrice.dist).toFixed(2), strUnitDist, comparePrice.time, langHtml.timeUnit[strUnitTime][1]);
  };
  ComparePriceButSpan.tmpPrototype.setUpAll=function(){  var arrEl=ComparePriceButSpan.tmpPrototype.arrEl;  for(var i=0;i<arrEl.length;i++){ arrEl[i].setUp(); }  }

    
    // Rewrite setUnitDist
  let setUnitDistTmp=setUnitDist;
  setUnitDist=function(unit){
    if(strUnitDist!=unit) if(unit=='km') comparePrice.dist*=1.609; else comparePrice.dist/=1.609;
    comparePrice.dist=Number(comparePrice.dist).toString();
    setItem('comparePriceData',{dist:comparePrice.dist, time:comparePrice.time});
    //tmpf(unit);
    setUnitDistTmp.apply(this, arguments);
    ComparePriceButSpan.tmpPrototype.setUpAll();
    $tableDivS.$tHeadLabel.setPricePerDistCanvas();
  };



  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // Rewrite $infoDivS.createContainers to add ComparePriceButSpan
    let createContainersTmp=$infoDivS.createContainers;
    $infoDivS.createContainers=function(){
      var setUpUnits=function(){
        var arrStr=['dist','comparePrice','pricePerDist','strUnitDist'], iMTab=$ListCtrlDiv[oS.ind].$tr.data('iMTab');
        for(var i=0;i<arrStr.length;i++){
          var $ele=$infoDivS.$divCont.find('div>span[name='+arrStr[i]+']'), strName=$ele.attr('name'), tmpObj=(strName in oS.Prop)?oS.Prop[strName]:{};
          var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,$ele);  else tmp=oS.MTab[iMTab][strName];
          $ele.html(tmp);
        }
      };
      var elComparePriceButSpan=new ComparePriceButSpan("({0} {1}, {2} {3})", setUpUnits);    elComparePriceButSpan.css({'font-size':'0.78em'});
      createContainersTmp.apply(this, arguments);
      this.$divCont.find('div[name=comparePrice]').after($(elComparePriceButSpan));
      ComparePriceButSpan.tmpPrototype.setUpAll();
    };

      // Rewrite $settingDivS.createDivs
    let settingDivCreateDivsTmp=$settingDivS.createDivs;
    $settingDivS.createDivs=function(){
      var $tmpU=$settingDivS.find('[name=strUnitDist]').css({'float':'none'});   $tmpU.parent().detach();
      var $tmpPPD=$settingDivS.find('[name=pricePerDist]'); $tmpPPD.parent().empty().append(langHtml.PricePer+' ',$tmpU,$tmpPPD);
      settingDivCreateDivsTmp.apply(this, arguments);
    };

      // priceStart
    $.extend(oS.Prop.priceStart, {strType:'number',inpW:4});
      // pricePerDist
    var tmpSetPricePerDist=function(iMTab){ var tmp=(strUnitDist=='mile'?1.609:1) * oS.MTab[iMTab].pricePerDist;  return Number(tmp.toFixed(2));};
    var tmpSetPricePerDistStr=function(iMTab){return tmpSetPricePerDist(iMTab)+'/'+strUnitDist;};
    $.extend(oS.Prop.pricePerDist, {
      strType:'number',inpW:4,
      setInfo:tmpSetPricePerDistStr,
      setTabF:tmpSetPricePerDist,sortTabF:tmpSetPricePerDist,
      setMapF:tmpSetPricePerDistStr,setMapMF:tmpSetPricePerDistStr
    });
      // pricePerHour
    $.extend(oS.Prop.pricePerHour, { strType:'number',inpW:4 });
      // strUnitDist
    var tmpSetUnitDist=function(iMTab,$c){$c.children('button').html('('+Number(comparePrice.dist).toFixed(2)+' '+strUnitDist+', '+comparePrice.time+' '+langHtml.timeUnit.min[3]+')');};
    $.extend(oS.Prop.strUnitDist, {
      strType:'select',
      crInp:function(){  return $('<select>').append($("<option>").text('km').val(0),  $("<option>").text('mile').val(1));  },
      setInfo:tmpSetUnitDist
    });
      // comparePrice
    var calcComparePrice=function(iMTab){
      var divisor=strUnitTime=='min'?60:1, rT=oS.MTab[iMTab]; return Number(rT.priceStart)  +tmpSetPricePerDist(iMTab)*comparePrice.dist  +rT.pricePerHour/divisor*comparePrice.time;
    };
    var tmpSetComparePriceOneLineWOCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return Number(tmp.toFixed(2)); };
    var tmpSetComparePriceOneLineWCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return oS.MTab[iMTab].currency+' '+Number(tmp.toFixed(2)); };
    var tmpSetComparePrice=function(boTryTwoLine){ return function(iMTab){
      var rT=oS.MTab[iMTab], tmp=calcComparePrice(iMTab);
      var boTwoLine=(oS.ColsShow.indexOf('image')!=-1) && boTryTwoLine,  strSep=boTwoLine?'<br>':' ';
      return (boMultCurrency?rT.currency+strSep:'')+Number(tmp.toFixed(2));
    }};
    var tmpSetComparePriceOneLine=tmpSetComparePrice(0);
    var tmpSetComparePriceTwoLine=tmpSetComparePrice(1);
    $.extend(oS.Prop.comparePrice, {
      setInfo:tmpSetComparePriceOneLineWOCur,
      setTabF:tmpSetComparePriceTwoLine,sortTabF:tmpSetComparePriceOneLine,
      setMapF:tmpSetComparePriceOneLineWCur,setMapMF:tmpSetComparePriceOneLineWCur
    });


      // $tableDivS.$tHeadLabel
      // Add ComparePriceButSpan to $tableDivS.$tHeadLabel
    var $comparePriceButSpanSmall=$(new ComparePriceButSpan("{0} {1}<br>{2} {3}")); 
    var $butT=$comparePriceButSpanSmall.children().addClass('smallButt').css({padding:'0.3em 0.1em'});
    $butT.children().css({'font-size':'0.7em'});
    $tableDivS.$tHeadLabel.find('[name=comparePrice]').append($comparePriceButSpanSmall);

      // Add currencyInfoDivs to $tableDivS.$tHeadLabel
    var $da=$('<div>'),$db=$('<div>'),$dc=$('<div>'),$dd=$('<div>');
    $tableDivS.$tHeadLabel.find('[name=comparePrice]').prepend($da);
    $tableDivS.$tHeadLabel.find('[name=priceStart]').prepend($db);
    $tableDivS.$tHeadLabel.find('[name=pricePerDist]').prepend($dc);
    $tableDivS.$tHeadLabel.find('[name=pricePerHour]').prepend($dd);
    $currencyInfoDivs=$currencyInfoDivs.add($da).add($db).add($dc).add($dd);

      // Create $tableDivS.$tHeadLabel.setPricePerDistCanvas
    pricePerKMCanvas=makeTextCanvas(langHtml.PricePerKM,-1);    pricePerMileCanvas=makeTextCanvas(langHtml.PricePerMile,-1);
    $tableDivS.$tHeadLabel.setPricePerDistCanvas=function(){
      var tmpCanvas=(strUnitDist=='km')?pricePerKMCanvas:pricePerMileCanvas;
      this.find('[name=pricePerDist]').children('div:eq(1)').html(tmpCanvas);
    };
    $tableDivS.$tHeadLabel.setPricePerDistCanvas();


      // Add ComparePriceButSpan to $settingDivW
    var $comparePriceButSpan=$(new ComparePriceButSpan("({0} {1}, {2} {3})")); $comparePriceButSpan.children('button').prepend(langHtml.comparePrice.head,' ');
    var $opt=$([]).push($comparePriceButSpan);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
    $settingDivW.$divCont.children('#buttShowMarkSelectS').after($opt);

  };
};
//0123456789abcdef





CreatorPlugin.price=function(){
  this.rewriteObj=function(){}
};
//0123456789abcdef

CreatorPlugin.transportCustomer=function(){
  this.rewriteObj=function(){
    var tmpSet=function(iMTab,$c){  return oC.MTab[iMTab].distStartToGoal+' km ('+oC.MTab[iMTab].compassPoint+')'; }
    $.extend(oC.Prop.distStartToGoal, {
      setInfo:tmpSet,
      setTabF:tmpSet,
      setMapF:tmpSet
    });
    
    
  }
};
//0123456789abcdef


CreatorPlugin.standingByMethod=function(){
  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // standingByMethod
    var tmpSet=function(iMTab,$c){  return langHtml.standingByMethodsLong[Number(  oS.MTab[iMTab].standingByMethod  )]; }
    var crInpFunc=function(){
      var $c=$('<select>'), arrTmp=langHtml.standingByMethodsLong;
      for(var i=0;i<arrTmp.length;i++){  var $opt=$("<option>").text(arrTmp[i]).val(i);   $c.append($opt);    }
      return $c;
    };
    $.extend(oS.Prop.standingByMethod, {
      strType:'select',
      crInp:crInpFunc,
      setInfo:tmpSet,
      setTabF:tmpSet,
      setMapF:function(iMTab,$c){  return langHtml.standingByMethodsLong[Number(  oS.MTab[iMTab].standingByMethod  )]; },
      setRowButtF:function($span,val,boOn){ var tmp=langHtml.standingByMethodsLong[val]; $span.html(tmp);  }
    });
  };
};
//0123456789abcdef

CreatorPlugin.shiftEnd=function(){

  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
      // shiftEnd
    var tmpSetShiftEnd=makeTimeF(oS.ind,'shiftEnd',1);
    oS.Prop.shiftEnd.boUseTimeDiff=1;
    var $tmp = timeStampButtExtend($("<button>"), oS.ind, 'shiftEnd').css({padding:'0.3em 0.5em'});    $tableDivS.$tHeadLabel.find('[name=shiftEnd]').append($tmp);
    $filterDivS.$filterDivI.Unit.shiftEnd=langHtml.timeUnit.h[1];

    $.extend(oS.Prop.shiftEnd, {strType:'select',
      crInp:function(){  var $c=$('<select>'); for(var i=0;i<225;i++){ $c.append($("<option>")); }   return $c; },
      setInp:function($c){
        var d=new Date(); d.setMilliseconds(0); d.setSeconds(0); var tmp= Math.round(d.getMinutes()/15);  d.setMinutes(tmp*15);
        var d=d.valueOf(); //alert(d);  alert(Date(d));
        $c.children('option').each(function(i){
          var dv=d+i*15*60*1000, dt=new Date(dv);
          var str=dt.toLocaleTimeString(); str=str.replace(/(\d\d):00/,'$1');
          $(this).text(str).val(dv/1000);
        });
        //if(typeof userInfoFrDB.seller=='array' && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
        if(userInfoFrDB.seller instanceof Array && 'shiftEnd' in userInfoFrDB.seller) {   // If there is a saved value for 'shiftEnd' then try set it as selected
          var tmp="option[value='"+userInfoFrDB.seller.shiftEnd+"']";
          var $tmp=$c.children(tmp);   if($tmp.length==1) $tmp.prop('selected', 'selected');
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


CreatorPlugin.hourlyPrice=function(charRoleUC){
  var oRole=charRoleUC=='C'?oC:oS;
  
  this.rewriteObj=function(){
      // pricePerHour
    var tmpSet=function(iMTab){ var rT=oRole.MTab[iMTab], tmp=Number(rT.pricePerHour); return rT.currency+' '+Number(tmp.toFixed(2)); };
    var tmpSetComparePriceTryTwoLine=function(iMTab){
      var rT=oRole.MTab[iMTab], tmp=Number(rT.pricePerHour);
      var boTwoLine=(oRole.ColsShow.indexOf('image')!=-1),  strSep=boTwoLine?'<br>':' ';      return rT.currency+strSep+Number(tmp.toFixed(2));
    }
    $.extend(oRole.Prop.pricePerHour, { strType:'number',inpW:4, setInfo:tmpSet, setTabF:tmpSetComparePriceTryTwoLine, sortTabF:tmpSet, setMapF:tmpSet, setMapMF:tmpSet});
  }
};
//0123456789abcdef


CreatorPlugin.fixedPricePerUnit=function(){
}
//0123456789abcdef

//////////////////////////////////////////////////////////////////////////////////////////////////////////

CreatorPlugin.taxi=function(){
  strUnitTime='min';
  var StrS=oS.StrPropE;  // ['brand', 'idDriverGovernment', 'nExtraSeat']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
  var {StrPropE}=site;  // ['nPassenger','nChildSeat','nWheelChairPlace']
  var {StrTransportCustomer}=oC;  // ['distStartToGoal','compassPoint','destination']
  
  
    // oRole.Main: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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

  $comparePriceDataPop.setDefault(10,15); // Arg: dist, time

    // images
  var strPlugin='taxi';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  uExtraSeat=uSpecImageFolder+'extraSeat.png';
  uChildSeat=uSpecImageFolder+'childSeat.jpg';
  uChildSeat2=uSpecImageFolder+'childSeat2.jpg';
  //uDummy=uSpecImageFolder+'dummy.png';
  //uSleepy=uSpecImageFolder+'carSleepy.png';


  this.rewriteLang=function(){
    rewriteLangDriver();
    var $tmp=$('<span>').append(langHtml.helpBub.nExtraSeat);  $tmp.children('img:eq(0)').prop({src:uExtraSeat,width:200}); langHtml.helpBub.nExtraSeat=$tmp.html();
    var $tmp=$('<span>').append(langHtml.helpBub.nChildSeat);
      $tmp.children('img:eq(0)').prop({src:uChildSeat});$tmp.children('img:eq(1)').prop({src:uChildSeat2}); langHtml.helpBub.nChildSeat=$tmp.html();
  };

  this.rewriteObj=function(){
      // nPassengers, nChildSeat, nWheelChairPlaces, nExtraSeat
    var tmp={strType:'number', inpW:3, saveInp:posNumOrEmptyF};
    for(let i=0;i<ORole.length;i++){
      $.extend(ORole[i].Prop.nPassengers, tmp);
      $.extend(ORole[i].Prop.nChildSeat, tmp);
      $.extend(ORole[i].Prop.nWheelChairPlaces, tmp);
    }
    $.extend(oS.Prop.nExtraSeat, tmp);
      // brand, idDriverGovernment
    $.extend(oS.Prop.brand, {strType:'text',inpW:6});
    $.extend(oS.Prop.idDriverGovernment, {strType:'text',inpW:6});
  };
};
//0123456789abcdef


CreatorPlugin.transport=function(){
  strUnitTime='min';
  var StrS=oS.StrPropE;  // ['brand']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  var {StrPropE}=site;
  var {StrTransportCustomer}=oC;  // ['distStartToGoal','compassPoint','destination']
 

  //var StrTransportBool=['generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer'];
  var StrTransportBool=site.StrTransportBool;
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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
  [].concat('Vehicle', 'vehicleType', StrPropE, 'otherContainer'),
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
  [].concat('Vehicle', 'vehicleType', StrPropE, 'otherContainer'),
  [].concat('Price', 'currency', 'priceStart', 'pricePerDist', 'strUnitDist', 'pricePerHour')]);

    // Properties in filterDiv
  oC.filter=separateGroupLabels([
  [].concat('Customer', 'tPos'),
  [].concat('Cargo', StrPropE),
  [].concat('Destination', 'distStartToGoal', 'compassPoint', 'destination'),
  [].concat('Reputation', 'tCreated', 'donatedAmount', 'nComplaint')]);
  oS.filter=separateGroupLabels([
  [].concat('Seller', 'homeTown', 'standingByMethod', 'currency', 'tPos', 'shiftEnd'),
  [].concat('Vehicle', 'vehicleType', StrPropE, 'otherContainer'),
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
  

  $comparePriceDataPop.setDefault(10,15); // Arg: dist, time

    // images
  var strPlugin='transport';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  uDummy=uSpecImageFolder+'dummy.png';
  uSleepy=uSpecImageFolder+'carSleepy.png';

  this.rewriteLang=function(){
    rewriteLangDriver();
    var Tmp=StrTransportBool.slice(0,-1);
    for(var i=0;i<Tmp.length;i++) {
      var strName=Tmp[i], $tmp=$('<span>').append(langHtml.helpBub[strName]);  $tmp.children('img:eq(0)').prop({src:uSpecImageFolder+strName+'.jpg',width:200}); langHtml.helpBub[strName]=$tmp.html();
    }
  };

  this.rewriteObj=function(){
      // StrTransportBool
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };
    for(let i=0;i<ORole.length;i++){
      var tmpSetBool=function(iMTab,$ele){
        var data=ORole[i].MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
        //var colT=''; if(data>0) colT='red';
        $ele.css({'background':colT});
        return Number(data)?langHtml.Yes:'-';
      }
      for(var j=0;j<StrTransportBool.length;j++) {
        var strName=StrTransportBool[j];
        var tmpSetMap=function(iMTab){ return Number(ORole[i].MTab[iMTab][strName])?langHtml.Yes:langHtml.No; };
        $.extend(ORole[i].Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBool, setTabF:tmpSetBool, setMapF:tmpSetMap,setMapMF:tmpSetMap, setRowButtF:tmpRowButtf });
      }
    }
      // brand
    $.extend(oS.Prop.brand, {strType:'text', inpW:6});
      // payload
    var tmp={strType:'number', inpW:3, saveF:posNumF}; $.extend(oC.Prop.payload, tmp); $.extend(oS.Prop.payload, tmp);
  }
};
//0123456789abcdef


CreatorPlugin.cleaner=function(){
  var StrC=oC.StrPropE;  // ['household','janitor','sanitation', 'exterior','customerHasEquipment']
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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

  $comparePriceDataPop.setDefault(10,2); // Arg: dist, time

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
    var tmpSetBool=function(iMTab,$ele){
      var data=oC.MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

    for(var i=0;i<StrC.length;i++) {
      var strName=StrC[i];
      var tmpSetMap=makeSetMapF(oC, strName);
      $.extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBool, setTabF:tmpSetBool, setMapF:tmpSetMap,setMapMF:tmpSetMap, setRowButtF:tmpRowButtf });
    }
  };
};
//0123456789abcdef


CreatorPlugin.windowcleaner=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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


  $comparePriceDataPop.setDefault(10,2); // Arg: dist, time

    // images
  var strPlugin='windowcleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.windowcleaner;
  };

  this.rewriteObj=function(){

      // For boolean properties
    var makeSetBoolF=function(oRole){ return function(iMTab,$ele){
      var data=oRole.MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

      // customerHasEquipment
    var strName='customerHasEquipment', tmpSetMap=makeSetMapF(oC, strName);
    $.extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
      // nWindow
    $.extend(oC.Prop.nWindow, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // StrS
    for(var i=0;i<StrS.length;i++) {
      var strName=StrS[i], tmpSetMap=makeSetMapF(oS, strName);
      $.extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
  };
};
//0123456789abcdef

CreatorPlugin.lawnmower=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice'],   ['pushMower','ridingMower', 'edger']
  
      // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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

  $comparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='lawnmower';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.lawnmower;
  };

  this.rewriteObj=function(){

      // For boolean properties
    var makeSetBoolF=function(oRole){ return function(iMTab,$ele){
      var data=oRole.MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

      // customerHasEquipment
    var strName='customerHasEquipment', tmpSetMap=makeSetMapF(oC, strName);
    $.extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
      // area
    $.extend(oC.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
      // oS.StrBool
    for(var i=0;i<oS.StrBool.length;i++) {
      var strName=oS.StrBool[i], tmpSetMap=makeSetMapF(oS, strName);
      $.extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
      // cuttingWidth
    $.extend(oS.Prop.cuttingWidth, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


CreatorPlugin.snowremoval=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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

  $comparePriceDataPop.setDefault(10,1); // Arg: dist, time

    // images
  var strPlugin='snowremoval';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';
  uDummy=uSpecImageFolder+'dummy.png';

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
    var makeSetBoolF=function(oRole){ return function(iMTab,$ele){
      var data=oRole.MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    }};
    var tmpSetBoolC=makeSetBoolF(oC), tmpSetBoolS=makeSetBoolF(oS);
    var makeSetMapF=function(oRole, strN){return function(iMTab){ return Number(oRole.MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

    for(var i=0;i<oC.StrBool.length;i++) {
      var strName=oC.StrBool[i], tmpSetMap=makeSetMapF(oC, strName);
      $.extend(oC.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolC, setTabF:tmpSetBoolC, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
    for(var i=0;i<oS.StrBool.length;i++) {
      var strName=oS.StrBool[i], tmpSetMap=makeSetMapF(oS, strName);
      $.extend(oS.Prop[strName], { strType:'checkbox', saveInp:inpAsNum, setInfo:tmpSetBoolS, setTabF:tmpSetBoolS, setMapF:tmpSetMap, setMapMF:tmpSetMap, setRowButtF:tmpRowButtf});
    }
      // area
    $.extend(oC.Prop.area, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    
  };
};
//0123456789abcdef


CreatorPlugin.fruitpicker=function(){
  var StrC=oC.StrPropE;
  var {StrDistTimePrice}=oS;  // ['priceStart', 'pricePerDist', 'pricePerHour', 'comparePrice']
  
    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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

  $comparePriceDataPop.setDefault(10,8); // Arg: dist, time
  
    // images
  var strPlugin='fruitpicker';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';

  this.rewriteLang=function(){
    langHtml.sellerRewritten=langHtml.picker;
    boRewriteSeller=true;
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
    $.extend(oC.Prop.fruit, {strType:'text', inpW:6});

  }
};
//0123456789abcdef

CreatorPlugin.programmer=function(){
  var StrC=oC.StrPropE, StrS=oS.StrPropE;
  
  var StrProgrammerLang=oS.StrProgrammerLang;

    // oRole.Main.StrProp: rows in roleInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, TableDiv
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
    boRewriteSeller=true;
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
    $.extend(oC.Prop.database, {strType:'text',inpW:6});
      // language
    $.extend(oC.Prop.language, {strType:'text',inpW:6});

      // StrProgrammerLang
    var crInpFunc=function(){
      var $c=$('<select>'), arrTmp=[0,1,2,3,4,5];
      for(var j=0;j<arrTmp.length;j++){  var $opt=$("<option>").text(arrTmp[j]).val(j);   $c.append($opt);    }
      return $c;
    };
    var tmpSetGrade=function(iMTab,$ele){
      var data=oS.MTab[iMTab][$ele.attr('name')]; data=bound(data,0,5); var ColT=['','lightblue','lightgreen','yellow','orange','red'], colT=ColT[data];
      $ele.css({'background':colT});
      return data;
    }
    for(var i=0;i<StrProgrammerLang.length;i++) {
      var strName=StrProgrammerLang[i];
      $.extend(oS.Prop[strName], { strType:'select', crInp:crInpFunc, setInfo:tmpSetGrade, setTabF:tmpSetGrade });
    }
      // otherLang
    $.extend(oS.Prop.otherLang, {strType:'text',inpW:6});
  }
};
//0123456789abcdef

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//0123456789abcdef client.js
setUp=function(){
var trackConv=function(google_conversion_id,google_conversion_label) {
  var image = new Image(1,1);
  image.src = "https://www.googleadservices.com/pagead/conversion/"+google_conversion_id+"/?label="+google_conversion_label+"&script=0";
}



histGoTo=function($view){}
doHistBack=function(){  history.back();}
doHistPush=function(obj){
    // Set "scroll" of stateNew  (If the scrollable div is already visible)
  var $view=obj.$view;
  var scrollT=$window.scrollTop();
  if(typeof $view.setScroll=='function') $view.setScroll(scrollT); else history.StateMy[history.state.ind].scroll=scrollT;  //$view.intScroll=scrollT;

  if((boChrome || boOpera) && !boTouch)  history.boFirstScroll=true;

  var indNew=history.state.ind+1;
  stateTrans={hash:history.state.hash, ind:indNew};  // Should be called stateLast perhaps
  history.pushState(stateTrans, strHistTitle, uCanonical);
  history.StateMy=history.StateMy.slice(0,indNew);
  history.StateMy[indNew]=obj;
}


doHistReplace=function(obj, indDiff=0){
  history.StateMy[history.state.ind+indDiff]=obj;
}
changeHist=function(obj){
  history.StateMy[history.state.ind]=obj;
}
getHistStatName=function(){
  return history.StateMy[history.state.ind].$view.toString();
}


history.distToGoal=function($viewGoal){
  var ind=history.state.ind;
  var indGoal;
  for(var i=ind; i>=0; i--){
    var obj=history.StateMy[i];
    var $view; if(typeof obj=='object') $view=obj.$view; else continue;
    if($view===$viewGoal) {indGoal=i; break;}
  }

  var dist; if(typeof indGoal!='undefined') dist=indGoal-ind;
  return dist;
}
history.fastBack=function($viewGoal, boRefreshHash){
  var dist=history.distToGoal($viewGoal);
  if(dist) {
    if(typeof boRefreshHash!='undefined') history.boResetHashCurrent=boRefreshHash;
    history.go(dist);
  }
}

popUpExtend=function($el){
"use strict"
  $el.openPop=function() {
    //$messageText.detach(); $el.append($messageText);
    elBody.removeChild(spanMessageText); $el[0].appendChild(spanMessageText);
    //siz=getViewPortSize();  winW=siz.w;winH=siz.h;
    //var siz=getViewPortSize(); var winW=siz.w;
    var winW=$(window).width(),winH=$(window).height();
    var $doc=$(document), scrollX=$doc.scrollLeft(), scrollY=$doc.scrollTop();
    //var pageYOffset=window.pageYOffset;   if(typeof pageYOffset =='undefined') pageYOffset=document.body.scrollTop;
    $el.setBlanketSize();

    $el.addClass('popUpDiv');

    $body.prepend($el.$blanket);
    $body.prepend($el);

    $(window).on('scroll',$el.setBlanketSize);

    //var bubW=$el.width(), bubH=$el.height();
    var bubW=$el.outerWidth(), bubH=$el.outerHeight(); //alert('$(window).width(): '+winW+' '+winH+', bubW: '+bubW+' '+bubH);
    var x=scrollX+(winW-bubW)/2; if(x<0) x=0;    var y=scrollY+(winH-bubH)/4;  if(y<0) y=0;
    //$el.append("scrollY:"+scrollY+", winH:"+winH+", bubH:"+bubH);
    //if($.browser.msie)  $el.css({'left':x+'px'});   else $el.css({'top':y+'px','left':x+'px'});
    $el.css({'top':y+'px','left':x+'px'});
  }

  $el.closePop=function() {
    $el.detach();
    $(window).off('scroll',$el.setBlanketSize);
    $el.$blanket.detach();
    //$body.append($messageText);
    elBody.appendChild(spanMessageText);
  }

  $el.setBlanketSize=function(){

    var docH=$(document).height(), winH=$(window).height(), blankH=docH>winH?docH:winH, blankHOld=$el.$blanket.css("height");
    if(blankH!=blankHOld)  $el.$blanket.css({"height": blankH  });
    var docW=$(document).width(), winW=$(window).width(), blankW=docW>winW?docW:winW, blankWOld=$el.$blanket.css("width");
    if(blankW!=blankWOld)  $el.$blanket.css({"width": blankW  });

  }

  $el.$blanket=$('<div>').addClass('blanketPop');
  $el.$blanket.css({'background':'#fff'});
  return $el;
}


var toastExtend=function($el){
  var hideToast=function(){  $el.fadeOut(400);  }
  $el.showToast=function(t=4000){
    $el.fadeIn(0);
    t=setTimeout(hideToast, t);
  }
  var t;
  $el.on('click', function(){clearTimeout(t); hideToast();});
  $el.addClass('toast').hide();
  return $el;
}



/*******************************************************************************************************************
 * Some loose functions
 *******************************************************************************************************************/

calcLabel=function(Label,strName){ return Label[strName]||ucfirst(strName); }

//var messExtend=function($el){
//"use strict"
  ////$el.resetMess=function(){ $el.html(''); clearTimeout(messTimer); }
  //$el.resetMess=function(time){
    //if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    //else {$el.html(''); clearTimeout(messTimer);}
  //}
  //$el.setMess=function(str,time,boRot){
    //$el.html(str);  clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    //if(boRot) $el.append($imgBusy);
  //};
  //$el.appendMess=function(str,time,boRot){
    //$el.append(str);  clearTimeout(messTimer);
    //if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    //if(boRot) $el.append($imgBusy);
  //};
  //var messTimer;
  //$el.addClass('message').css({'z-index':8100,position:'fixed'});
  //return $el;
//}
TypeSpanMessageText=function(){
  var el=document.createElement('span');
  el.resetMess=function(time){
    clearTimeout(messTimer);
    if(typeof time =='number') { messTimer=setTimeout('resetMess()',time*1000); return; }
    el.innerHTML='';
  }
  el.setMess=function(str,time,boRot){
    el.innerHTML=str;  clearTimeout(messTimer);
    if(typeof time =='number')     messTimer=setTimeout('resetMess()',time*1000);
    if(boRot) el.appendChild($imgBusy[0]);
  };
  var messTimer;
  el.classList.add('message'); el.css({'z-index':8100,position:'fixed'});
  return el;
}

separateGroupLabels=function(arr){
  var objOut={StrProp:[], StrGroupFirst:[], StrGroup:[]};
  for(var i=0;i<arr.length;i++){
    objOut.StrProp=objOut.StrProp.concat(arr[i].slice(1));
    objOut.StrGroupFirst.push(arr[i][1]);
    objOut.StrGroup.push(arr[i][0]);
  }
  return objOut;
}

/*******************************************************************************************************************
 * Menu-divs
 *******************************************************************************************************************/

var adminDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'adminDiv';}
  $el.setUp=function(data){
    boShowTeam=Boolean(Number(data.boShowTeam)); $inpBoShowTeam.prop({checked:boShowTeam});
    //$filterDiv.setBoShowTeam(boShowTeam);
    for(var i=0;i<ORole.length;i++){
      $FilterDiv[i].$filterDivI.children('[name=idTeam]').toggle(boShowTeam);
      $MarkSelectorDiv[i].children('table').children('tbody').children('[name=idTeam]').toggle(boShowTeam);
      $ColumnSelectorDiv[i].children('table').children('tbody').children('[name=idTeam]').toggle(boShowTeam);
      $SettingDiv[i].find('[name=idTeamWanted]').parent().toggle(boShowTeam);
      if(!boShowTeam) {
        arrValRemove(ORole[i].ColsShowDefault,'idTeam');
        arrValRemove(ORole[i].ColsShow,'idTeam');  setItem('ColsShow'+ORole[i].charRoleUC, ORole[i].ColsShow);
        if(ORole[i].colOneMark=='idTeam') ORole[i].colOneMark=ORole[i].colOneMarkDefault;
      }
    }   
  }


    //set 
  $el.saveFunc=function(){
    var data={boShowTeam:Number($inpBoShowTeam[0].checked)}; $el.setUp(data);
    var vec=[['setSetting',data]];   majax(oAJAX,vec);
  }

  var $inpBoShowTeam=$('<input>').prop({type:'checkbox'});
  var $pBoShowTeam=$('<p>').css({'margin-top':'1em'}).append('boShowTeam:',$inpBoShowTeam);
  

  var $divCont=$('<div>').append($pBoShowTeam).addClass('contDiv');

      // divFoot
  var $buttonSave=$('<button>').on('click', $el.saveFunc).append(langHtml.Save).addClass('flexWidth').css({ 'margin-right':'.2em'});
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Admin settings').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack, $buttonSave, $span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


/*******************************************************************************************************************
 * startpop
 *******************************************************************************************************************/

var startPopExtend=function($el){
"use strict"
  $el=popUpExtend($el);
  $el.css({ width:'14em', padding: '1.1em'});
  $el.openFunc=$el.openPop;    $el.closeFunc=$el.closePop;
  return $el;
}

var startPopExtendTouch=function($el){
"use strict"
  $el.css({width:'100%',padding: '1em 0',position:'fixed',top:'0px','border':'solid 1px','background':'lightgrey','z-index':'9004'});
  $el.openPop=function() {
    $body.prepend($el);
  }
  $el.closePop=function() {  $el.detach(); }
  $el.openFunc=$el.openPop;    $el.closeFunc=$el.closePop;
  return $el;
}



var noOneIsVisibleToastExtend=function($el){
"use strict"
  $el=toastExtend($el);  $el.css({bottom:'10em'});
  var $im=$('<img>').prop({src:uDummy}).css({margin:'auto',display:'block'});
  //var $p1=$('<span>').append(langHtml.DummiesShowingMess);
  var $p1=$('<span>').append(langHtml.CurrentlyNoOneIsVisible);
  //var $ok=$('<button>').append(langHtml.OK).on('click', $el.closePop).css({display:'block','margin-top':'1em'});
  $el.append($p1);  //,$im
  return $el;
}

/*
 * agreementStart
 */

var agreementStartExtend=function($el){
"use strict"
  $el=popUpExtend($el);
  $el.openFunc=$el.openPop;
  $el.compareLocalDates=function(boSeller){
    var boFirst=0;
    dateLocal=getItem('agreInformedDate'); if(dateLocal===null) {dateLocal=[0,0]; }
    if(dateLocal[boSeller]===0) boFirst=1;  //if the local stored time is 0 then boFirst shall be true
    var boNew=0;  if(dateTextComp[boSeller]>dateLocal[boSeller]) {boNew=1;}

    //$el.find('span').hide();
    //var $d0=$el.find('span:eq(0)'), $d1=$el.find('span:eq(1)');
    //if(boFirst) $d0.show(); else $d1.show();
    $d0.toggle(Boolean(boFirst));  $d1.toggle(Boolean(1-boFirst));
    //return [boFirst,boNew];
    return {boFirst:boFirst,boNew:boNew};
    //return boNew;
  }
  $el.setLocalDates=function(boSeller){
    //setItem('agreInformedDate',dateTextComp);
    if(boSeller) setItem('agreInformedDate',dateTextComp); // Write both
    else {var dateTextTmp=[dateTextComp[0],dateLocal[1]]; setItem('agreInformedDate',dateTextTmp);} // Write only the first
  }
  $el.css({ width:'25em', padding: '2em'});
  //$el.find('button:eq(0)').on('click', $el.closePop);
  var $buttonOK=$('<button>').append(langHtml.OK).on('click', $el.closePop);
  var $d0=$('<span>').append(langHtml.agreement[0]), $d1=$('<span>').append(langHtml.agreement[1]);

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

  return $el;
}






var entryTest=function(arrMustBeSet,arrPosNum,arrPosNumOrEmpty){
  for(var i=0;i<arrPosNum.length;i++){
    var id=arrPosNum[i], tmp=$('#'+id).val();  if(!(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive', 5); return false;}     }
  for(var i=0;i<arrMustBeSet.length;i++){
    var id=arrMustBeSet[i], tmp=$('#'+id).val();  if(tmp.length==0) {setMess(id+' can not be empty', 5); return false;}     }
  for(var i=0;i<arrPosNumOrEmpty.length;i++){
    var id=arrPosNumOrEmpty[i], tmp=$('#'+id).val();  if(tmp.length>0 && !(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive', 5); return false;}     }

  return true;
}



/*******************************************************************************************************************
 * selSprite
 *******************************************************************************************************************/

selSpriteExtend=function(el,iObj){
"use strict"
  el.isOpen=function() { return !$divMenu.is(":hidden"); }
  var openFunc=function(e) {
    e.stopPropagation();
    var i=$spriteOnButt[0].iCur;
    $divMenu.show();
    $divMenu.find('div').css(colOff);
    $divMenu.find('div:eq('+i+')').css(colOn);
  }
  el.closeFunc=function() {
    $divMenu.hide();
  }
  el.mySet=function(i){
    $spriteOnButt[0].mySet(i);
  }
  var menuClickF=function() {
    var i=$divMenu.children('div').index(this);
    $divMenu.hide(); $spriteOnButt[0].mySet(i);
  }
  el.myGet=function(){ return $spriteOnButt[0].iCur;  }
  var mouseOver=function(ele){var tmp=colSel; if(this.i==$spriteOnButt[0].iCur) tmp=colOn; $(this).css(tmp);}
  var mouseOut=function(ele){var tmp=colOff; if(this.i==$spriteOnButt[0].iCur) tmp=colOn; $(this).css(tmp);}

  var colOn={background:'#f92'}, colOff={background:''}, colSel={background:'pink'};
  $(el).css({display:'inline-block',position: 'relative'});

  var $spriteOnButt=$(spriteExtend($('<span>')[0],iObj));

  var $button=$('<button>').append($spriteOnButt).on('click', function(e){   if(el.isOpen()) { el.closeFunc();}  else { openFunc(e);}  });
  var $divMenu=$('<div>').css({position:'absolute',border:'black 1px solid',background:'#fff',left:0+'px',top:28+'px','z-index':1});
  $(el).append($button,$divMenu);

  for(var i=0;i<iObj.order.length;i++){
    var $span=$(spriteExtend($('<span>')[0],iObj));
    $span.css({position:'relative', top:'50%',  transform:'translateY(-50%)'})
    var $div=$('<div>').append($span).on('click', menuClickF).css({'height':'2em'}); //,display:'block'
    $div.on('mouseover', mouseOver);
    $div.on('mouseout', mouseOut);
    $div[0].i=i
    $span[0].mySet(i); $divMenu.append($div);
  }

  $divMenu.hide();
  $('html').on('click', el.closeFunc);

  return el;
}

spriteExtend=function(el,iObj){
"use strict"
  el.mySet=function(iItem){
    //if(iItem<0) iItem=0; // Ugly fix: the real problem: mysql allows empty stuff in enums, which would here result in iItem==-1;
    el.iCur=iItem; var strName=iObj.order[iItem];
    var item=iObj.item[strName];
    var wSc=Math.ceil(zT*item.w),  hSc=Math.ceil(zT*item.h);  //el.strName=strName; el.iCur=iObj.order.indexOf(strName);
    $(el).css({width:wSc+'px',height:hSc+'px'});
    var lef=-zT*item.x, to=-zT*item.y;
    img.css({left:lef+'px', top:to+'px'});
  }
  el.iCur=undefined;
  var zT=iObj.zoom;

  $(el).css({display:'inline-block',position: 'relative',overflow:'hidden',bottom:'0px'});
  var wSSc=zT*iObj.sheetW, hSSc=zT*iObj.sheetH;
  var img=$('<img>').prop({src:iObj.url}).css({position:'absolute',width:wSSc+'px',height:hSSc+'px'});
  $(el).html(img);
  return el;
}


posNumF=function($inp){var val=$inp.val().trim(), strName=$inp.attr('name'); if(isNumber(val) && val>=0) return [null,val]; else return [strName+' must be nummeric and positive']; }
mustBeSetF=function($inp){var val=$inp.val().trim(), strName=$inp.attr('name'); if(val.length) return [null,val]; else return [strName+' can not be empty'];  }
posNumOrEmptyF=function($inp){
  var val=$inp.val().trim(), strName=$inp.attr('name'); if(val.length==0 || (isNumber(val) && val>=0) ) return [null,val]; else return [strName+' must be nummeric and positive'];
}
inpAsNum=function($inp){return [null, Number($inp.prop('checked'))]; }


/*******************************************************************************************************************
 * roleSettingDiv
 *******************************************************************************************************************/

var roleSettingDivExtend=function($el,oRole){
"use strict"
  var {charRole, strRole, charRoleUC}=oRole;
  $el.toString=function(){return 'settingDiv'+charRoleUC;}
  $el.save=function(){
    resetMess();
    var o={charRole:charRole},boErr=0;
    $inps.each(function(i){
      var $inp=$(this),  strName=$inp.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
      //if('saveInp' in tmpObj) {var tmp=tmpObj.saveInp($inp); if(tmp===false) boErr=1; else if(tmp===null); else o[strName]=tmp;} else o[strName]=$inp.val().trim();
      if('saveInp' in tmpObj) {var [err,val]=tmpObj.saveInp($inp); if(err) {setMess(err, 10); boErr=1; } else o[strName]=val;}
      else {var tmp=$inp.val(); if(typeof tmp=='string') tmp=tmp.trim(); o[strName]=tmp; }
    });
    if(boErr) return;
    var vec=[['RUpdate', o, $el.setUp], ['setupById',{Role:strRole}]];   majax(oAJAX,vec);
    setMess('',null,true);
  }

  $el.createDivs=function(){
    var {StrProp, StrGroup, StrGroupFirst}=oRole.roleSetting;
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var $imgH=''; if(strName in oRole.helpBub ) {    var $imgH=$imgHelp.clone();   popupHoverJQ($imgH,oRole.helpBub[strName]);         }

      //var strLabel=ucfirst(strName)+': '; if(strName in langHtml.label) strLabel=langHtml.label[strName]+': ';
      var strLabel=calcLabel(langHtml.label, strName)+': ';

      var $inp='', tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('crInp' in tmpObj) $inp=tmpObj.crInp(); else $inp=$('<input type='+strType+'>');
      if('inpW' in tmpObj)  $inp.css({width:tmpObj.inpW+'em'});
      $inp.attr('name',strName);
      var $divLCH=$('<div>').append(strLabel,$imgH,$inp);
      $divs.push($divLCH);
      $inps.push($inp);
    }
    $divCont.append($divs);
    $divCont.find('input[type=text],[type=number],[type=tel],[type=email],[type=url]').on('keypress', function(e){ if(e.which==13) {save();return false;}} );
    var $tmp=$divCont.find('input[type=number]').prop({min:0});
    $divCont.find('input,select').css({'float':'right',clear:'both'});

    var $checkBoxes=$divCont.find('input[type=checkbox]');
    if(boAndroid) $checkBoxes.css({'-webkit-transform':'scale(2,2)'}); else $checkBoxes.css({width:'1.4em',height:'1.4em'});

    $divs.css({position:'relative', margin:'.8em 0','min-height':'2em'}); //,overflow:'hidden'
    //$inps.css({position:'absolute',right:'0px'}); //,overflow:'hidden'

      // Add labels
    for(var i=0;i<StrGroup.length;i++){
      var $h=$('<span>').append(langHtml[StrGroup[i]],':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      $el.find('[name='+StrGroupFirst[i]+']').parent().before('<hr style="clear:both">',$h);
    }
  }
  $el.setUp=function(){
    $inps.each(function(i){
      var $inp=$(this), strName=$inp.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{},  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('setInp' in tmpObj) tmpObj.setInp($inp);
      else {
        var data=userInfoFrDB[strRole][strName];
        if(strType==='checkbox') $inp.prop('checked',Number(data));   else $inp.val(data);
      }
    });

    return true;
  }
  var $inps=$([]);

  //$el.helpBub=$.extend({},helpBub);

  var $divs=$([]), $divCont=$('<div>').addClass('contDiv');
  
    // divFoot
  var $buttonSave=$('<button>').on('click', $el.save).append(langHtml.Save).addClass('flexWidth').css({'margin-right':'.2em'});
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var strLabT=strRole=='customer'?langHtml.CustomerSettings:langHtml.SellerSettings; 
  var $span=$('<span>').append(strLabT).addClass('footDivLabel').css({background:oRole.strColor});
  var $divFoot=$('<div>').append($buttonBack, $buttonSave, $span).addClass('footDiv');

  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


spanIdTeamWantedExtend=function(el,oRole){
  var strRole=oRole.strRole;
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  el.setStat=function(){
    var idTmp=userInfoFrDB[strRole].idTeamWanted, tag=userInfoFrDB[strRole].imTagTeam;
    if(idTmp!=0){ var strTmp=uRoleTeamImage+idTmp+'?v='+tag; $thumbDis.prop({src:strTmp}); $thumbDis.show(); $spanDisNApproved.show(); $inp.val(idTmp);}
    else { $thumbDis.hide(); $spanDisNApproved.hide(); $inp.val('');}

    var idTeam=userInfoFrDB[strRole].idTeam; $spanDisNApproved.toggle(idTmp!=idTeam);
  }
  var $inp=$('<input type=text>').css({width:'3em'});
  var $thumbDis=$('<img>').css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  var $spanDisNApproved=$('<span>').append(langHtml.NotYetApproved).css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  $(el).append($inp, $thumbDis,$spanDisNApproved);
  el.$inp=$inp; return el;
}



/*
 * quickDiv
 */

var quickDivExtend=function($el,oRole){
"use strict"
  var {charRole, strRole}=oRole;
  var myHide=function(){
    setMess('',null,true); //$imgBusyL.css({visibility:''});//show();
    var vec=[['RHide',{charRole:charRole}], ['setupById',{Role:strRole}]];  majax(oAJAX,vec); 
  }

  $el.setUp=function(){
    var boShow=Number(userInfoFrDB[strRole].boShow);  //$imgBusyL.css({visibility:'hidden'});//hide();
    var hideTimer=Number(userInfoFrDB[strRole].hideTimer);
    var tHide=Number(userInfoFrDB[strRole].tPos)+hideTimer, tDiff=tHide-curTime;
    var tDiffForm=UTC2ReadableDiff(tDiff);
    var tmpShow,tmpHide,str; if(boShow) { str=hideTimer==uintMax?'∞':tDiffForm; tmpShow='#0f0'; tmpHide=colGray;}else { str=langHtml.On; tmpShow=colGray; tmpHide='#f00'; }
    $butShowWPos.html(str).css('background-color', tmpShow); $buthide.css('background-color', tmpHide);
    $spanDragMess.toggle(Boolean(1-boShow));

    var [bestVal, iBest]=closest2Val(arrHideTime, userInfoFrDB[strRole].hideTimer);
    $el.$selHideTimer.val(bestVal);
  }

  var colGray='#eee'
  var $butShowWPos=$("<button>").append(langHtml.On).css({'margin-left':'1em'});
  var $buthide=$("<button>").append(langHtml.Off).css({'margin-left':'1em'});
  var $divButts=$('<span>').append($butShowWPos,$buthide); //,' ',$imgBusyL

  var myShow=function(pos){
    var latLng={lat:pos.coords.latitude, lng:pos.coords.longitude}; if(boVideo) latLng=latLngDebug;
    uploadPosNLoadTabStart(latLng, Number($el.$selHideTimer.val()), oRole);
  }

  $butShowWPos.on('click', function(){
    if(boDbg) {  setMess('... using origo ... ',null,true); myShow({coords:{latitude:0, longitude:0}});  return;  }
      
    if(boFirstPosOK==0) {setMess('You must agree to sending your position.'); return;}
    //setMess('... getting pos ...');  //$imgBusyL.css({visibility:''});//show();
    setMess('... getting position ... ',null,true);
    if(boEmulator){ myShow(posDebug); }else{ navigator.geolocation.getCurrentPosition(myShow, geoError);  }  //, {maximumAge:Infinity, timeout:5000}
  });

  $buthide.on('click', myHide);

  var tu=langHtml.timeUnit, mi=tu.min[1], h=tu.h[1], d=tu.d[1];
  $el.$selHideTimer=$('<select>');
  //var arrHideTime=[0.25,1,2, 5,10,15,20,30,40,60,90,2*60,3*60,4*60,5*60,6*60,8*60,10*60,12*60,18*60,24*60,36*60,2*24*60,3*24*60,4*24*60,5*24*60,6*24*60,7*24*60,14*24*60,30*24*60,365*24*60]; // Minutes
  //for(var i=0;i<arrHideTime.length;i++) arrHideTime[i]*=60;
  var arrHideTime=[15,60,120, 300,600,15*60,20*60,30*60,40*60,3600,1.5*3600,2*3600,3*3600,4*3600,5*3600,6*3600,8*3600,10*3600,12*3600,18*3600,86400,1.5*86400,2*86400,3*86400,4*86400,5*86400,6*86400,7*86400,14*86400,30*86400,uintMax], len=arrHideTime.length;
  for(var i=0;i<len;i++){  var str=UTC2ReadableDiff(arrHideTime[i]); if(i==len-1) str='∞'; var $opt=$("<option>").text(str).val(arrHideTime[i]);   $el.$selHideTimer.append($opt);    }

  var $spanDragMess=$('<span>').append(langHtml.DragOrZoom).css({'font-size':'75%',position:'absolute',top:'-1.15em',left:'50%', transform:'translate(-50%, 0)', 'white-space':'nowrap'}).hide();
  
  var $imgH=$imgHelp.clone().css({'margin-left':'1em'});   popupHoverJQ($imgH,$('<div>').append(langHtml.quickHelp));
  var $spanLabel=$el.$spanLabel=$('<span>').append(langHtml[ucfirst(oRole.strRole)]).addClass('footDivLabel').css({'font-size':'80%', top:'-.1em'});
  
    // butTog
  $el.$ElToggleble=$([]).push($el.$selHideTimer, $divButts, $imgH, $spanLabel);
  $el.$butTog=$("<button>").append('-').css({'margin-left':'.4em', position:'absolute', right:'0em', 'z-index':'1'}).on('click', function(){
    var boVis=$QuickDiv[oRole.ind].$spanLabel.is(':visible');
    var boAltVis=$QuickDiv[1-oRole.ind].$spanLabel.is(':visible');
    if(boVis && boAltVis){
      $QuickDiv[oRole.ind].$ElToggleble.hide(); $QuickDiv[oRole.ind].$butTog.html('+');  $QuickDiv[1-oRole.ind].$butTog.hide(); $QuickDiv[oRole.ind].css({'padding-top':'.2em'});
      $QuickDiv[oRole.ind].$butTog.css(oRole==oC?'top':'bottom','0em');
    }else {
      for(var i=0;i<ORole.length;i++) {
        $QuickDiv[i].$ElToggleble.show();  $QuickDiv[i].$butTog.html('-').show();  $QuickDiv[i].css({'padding-top':'.7em'});
        $QuickDiv[i].$butTog.css(ORole[i]==oC?'top':'bottom','0.3em');
      }
    }
  });
  $el.$butTog.css(oRole==oC?'top':'bottom','0.3em');
  $el.$butTogW=$('<span>').append($el.$butTog);

  $el.append($el.$ElToggleble, $el.$butTogW);
  
  
  $el.css({position:'relative'});
  $el.css({'text-align':'left', position:'relative', background:oRole.strColor});
  return $el;
}


var entryTestWMyName=function($el,arrMustBeSet,arrPosNum,arrPosNumOrEmpty){
"use strict"
  for(var i=0;i<arrPosNum.length;i++){
    var id=arrPosNum[i], tmp=$el.find('[myName="'+id+'"]').val();  if(!(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive', 5); return false;}     }
  for(var i=0;i<arrMustBeSet.length;i++){
    var id=arrMustBeSet[i], tmp=$el.find('[myName="'+id+'"]').val();  if(tmp.length==0) {setMess(id+' can not be empty', 5); return false;}     }
  for(var i=0;i<arrPosNumOrEmpty.length;i++){
    var id=arrPosNumOrEmpty[i], tmp=$el.find('[myName="'+id+'"]').val();  if(tmp.length>0 && !(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive', 5); return false;}     }

  return true;
}


var input2object=function($el){
  var o={};
  $el.find('input, select').each(function(){
    var type=this.getAttribute('type'), tmp=this.value;
    //alert(this.id+' '+type+' '+tmp);
    if(type==='checkbox')  tmp=Number(this.checked);
    if(tmp.length) o[$(this).attr('myName')]=tmp;});
  return o;
}

/*
 * roleIntroDiv
 */

var roleIntroDivExtend=function($el, oRole){
"use strict"
  var {charRole, strRole}=oRole;
  var save=function(){ 
    resetMess();  
    //$el.find(':text').each(function(){var tmp=$(this).val().trim(); $(this).val(tmp); });
    //if(!entryTestWMyName($el,arrMustBeSet,arrPosNum,arrPosNumOrEmpty)) return;
    //var o1=input2object($el);
    var strTel=$inpTel.val().trim(); $inpTel.val(strTel); if(strTel.length==0) {setMess('telephone number can not be empty'); return; }
    var curT; if(strLang=='sv') curT='SEK'; else curT='USD';
    var nameT=$inpName.val().trim();  $inpName.val(nameT);
    var boIdIPImage=Number($cbIdIPImage.prop('checked'));
    var o1={tel:strTel, displayName:nameT, currency:curT, charRole:charRole, boIdIPImage:boIdIPImage};
    var vec=[['RIntroCB',o1,function(data){$el.closePop();}], ['setupById']];   majax(oAJAX,vec);

    var $iframeConversion=$('<iframe src="'+uConversion+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:292px; height:62px;display:none" allowTransparency="true"></iframe>');
    $body.append($iframeConversion);

    setMess('',null,true);  
  }
  $el.setUp=function(){
    $inpTel.val(''); $inpTel.focus();
    var nameT=sessionLoginIdP?sessionLoginIdP.nameIP:'';
    $inpName.val(nameT);
    $cbIdIPImage.prop('checked', true);
    return true;
  }
  $el.openFunc=function(){   $el.openPop(); $el.setUp(); }
 
  $el=popUpExtend($el);  
  $el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em', 'text-align':'left'}); 

  
  var $helpPopup=$('<div>').html('At least one of email or phone should be entered');
  var $imgH=$imgHelp.clone().css({'margin-left':'1em'});   popupHoverJQ($imgH,$helpPopup);
         
  var $head=$('<h3>').append(langHtml.introHead);
  var $pBread=$('<p>').append("Data shown to other users (can be changed later in the settings).");
  //var $pBread=$('<p>').append("A telephone number is needed for customers to contact you. You may want to use a separate phone for this.");
  var $inpName=$('<input type=text>').css({width:'70%', 'box-sizing':'border-box'});
  var $inpTel=$('<input type=tel>').css({width:'70%', 'box-sizing':'border-box'});
  var $cbIdIPImage=$('<input>').prop({"type":"checkbox"});
  var $divName=$('<p>').append('Name', ': ',$inpName);
  var $divTel=$('<p>').append(langHtml.Tel, ': ',$inpTel);
  var $divIdIPImage=$('<p>').append('Use image from ID provider', ': ',$cbIdIPImage);
  $divName.add($divTel).add($divIdIPImage).css({display:'flex', 'justify-content':'space-between', margin:'0.8em 0'});

  var $saveButton=$('<button>').append(langHtml.Continue).on('click', save).css({display:'block', 'margin':'1em auto'});
  $el.append($head, $pBread, $divName, $divTel, $divIdIPImage, $saveButton).css({padding:'0.5em'}); 

  return $el;
}

var divIPSettingExtend=function($el){  // Div in userSettingDiv
  $el.setUp=function(){
    var tmp=userInfoFrDB.user;
    $spanIdUser.html(tmp.idUser);   $spanIdFB.html(tmp.idFB);  $spanIdIdPlace.html(tmp.idIdPlace);  $spanIdOpenId.html(tmp.idOpenId);
    $imgImage.prop({src:tmp.image});
    $spanNameIP.html(tmp.nameIP);  $spanEmail.html(tmp.email);
    return true;
  }
  
  var $divHead=$('<div>').append('Data from Id-provider (user info): ').css({'margin-bottom':'0.5em','font-weight':'bold'});

  var uImagePrim=window['u'+ucfirst(strIPPrim)+'22'];
  var $buttRefetch=$("<img>").prop({src:uImagePrim}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'refetchFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      $el.setUp();
    })(); flow.next();
    return false;
  });
  var $divRefresh=$('<div>').append('Refetch data: ', $buttRefetch);

  var $spanIdUser=$('<span>'), $spanIdFB=$('<span>'), $spanIdIdPlace=$('<span>'), $spanIdOpenId=$('<span>');
  $spanIdFB.add($spanIdIdPlace).add($spanIdOpenId).css({margin:'0 0.2em 0 0', 'font-weight':'bold'});

  var $divIdUser=$('<div>').append('idUser (db): ', $spanIdUser);
  var $divIdIP=$('<div>').append('FB: ', $spanIdFB, ', IdPlace: ', $spanIdIdPlace, ', OpenID: ', $spanIdOpenId);
  
  var $imgImage=$('<img>').css({'vertical-align':'middle'}), $spanNameIP=$('<span>');
  var $divImageName=$('<div>').append($imgImage, $spanNameIP);

  var $spanEmail=$('<span>');
  var $bub=$('<div>').html("This email is not shown to the public.");
  var $imgH=$imgHelp.clone();  popupHoverJQ($imgH,$bub);
  var $divEmail=$('<div>').append('Email: ', $spanEmail, $imgH);

    // change PW
  var $buttChangePW=$("<button>").append('Change password').on('click', function(e){ $changePWPop.openFunc(); });
  var $divPW=$('<div>').append('Change password: ', $buttChangePW);

      // deleteDiv
  var $imgH=$imgHelp.clone(); popupHoverJQ($imgH,$('<div>').html(langHtml.deleteBox.help));
  var $butDelete=$('<button>').append(langHtml.DeleteAccount).css({'margin-right':'1em'}).on('click', function(){doHistPush({$view:$deleteAccountPop}); $deleteAccountPop.setVis();});
  var $deleteDiv=$('<div>').append($butDelete); //,$imgH


  var $divs=$([]).push($divHead, $divRefresh, $divIdIP, $divImageName, $divEmail).css({'margin-top':'1em'});
  $el.append($divs);
  return $el;
}
/*
 * userSettingDiv
 */

var userSettingDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'userSettingDiv';}

  $el.setUp=function(){
    var tmp=userInfoFrDB.user;
    $inpDisplayName.val(tmp.displayName);  
    oC.Prop.image.setInp($spanImg);
    $divIPSetting.setUp();
    return true;
  }
  var $divIPSetting=divIPSettingExtend($('<div>')).css({background:'lightgrey', margin:'0.2em', border:'1px black solid'});
  
  var saveDisplayName=function(){ var vec=[['UUpdate',{displayName:$inpDisplayName.val().trim()}], ['setupById']];   majax(oAJAX,vec); }
  var $inpDisplayName=$('<input>').prop({type:'text'}).on('keypress', function(e){if(e.which==13) {saveDisplayName();return false;}} );
  var $butDisplayName=$('<button>').append('Change').on('click', saveDisplayName);
  var $divDisplayName=$('<div>').append('Display name: ', $inpDisplayName, $butDisplayName);
  

  $el.createDivs=function(){
    $spanImg=oC.Prop.image.crInp();
    $divImage.append('Display image: ', $spanImg);
  }
  var $spanImg;
  var $divImage=$('<div>');
    // change PW
  var $buttChangePW=$("<button>").append('Change password').on('click', function(e){ $changePWPop.openFunc(); });
  var $divPW=$('<div>').append('Change password: ', $buttChangePW);

      // deleteDiv
  var $imgH=$imgHelp.clone(); popupHoverJQ($imgH,$('<div>').html(langHtml.deleteBox.help));
  var $butDelete=$('<button>').append(langHtml.DeleteAccount).css({'margin-right':'1em'}).on('click', function(){doHistPush({$view:$deleteAccountPop}); $deleteAccountPop.setVis();});
  var $deleteDiv=$('<div>').append($butDelete); //,$imgH


  var $divs=$([]).push($divIPSetting, $divDisplayName, $divImage, $divPW, $deleteDiv).css({'margin-top':'1em'});
  var $divCont=$('<div>').append($divs).addClass('contDiv');
  
    // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('User settings').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}








var deleteAccountPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'deleteAccountPop';}
  //var $el=popUpExtend($el);
  var $yes=$('<button>').html(langHtml.Yes).on('click', function(){
    //var vec=[['UDelete',1,function(data){doHistBack();doHistBack();}]];   majax(oAJAX,vec);
    sessionLoginIdP={};  userInfoFrDB=$.extend({}, specialistDefault);
    var vec=[['UDelete',1], ['logout',1, function(data){
      history.fastBack($frontDiv,true);
    }]];   majax(oAJAX,vec);

  });
  var $cancel=$('<button>').html(langHtml.Cancel).on('click', doHistBack);
  //$el.append(langHtml.deleteBox.regret,'<br>',$yes,$cancel);
  //$el.css({padding:'1.1em',border:'1px solid'});
  $el.setVis=function(){
    $el.show();
    return true;
  }
  var $h1=$('<div>').append(langHtml.deleteBox.regret);
  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($h1,$cancel,$yes);
  $centerDiv.addClass("Center").css({padding:'1.1em'}); // 'width':'20em', height:'7em', 
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //
  $el.css({'text-align':'left'});
  return $el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * login stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var toggleSpecialistButts=function(){
"use strict"
  $loginInfo.setStat();

  var boE=Boolean(userInfoFrDB.user); $frontDiv.$topDiv.toggle(!boE);
  
  var boE=Boolean(userInfoFrDB.admin); $adminButton.toggle(boE);
  
  var boTeamExistC=Boolean(userInfoFrDB.customerTeam);
  var boTeamApprovedC=false;  if(boTeamExistC){ boTeamApprovedC=Number(userInfoFrDB.customerTeam.boApproved);  }
  $settingDivW.$customerTeamButton.toggle(Boolean(boTeamExistC && boTeamApprovedC));
  $entryDivC.$teamApprovedMess.toggle(Boolean(boTeamExistC && !boTeamApprovedC));
  
  var boTeamExistS=Boolean(userInfoFrDB.sellerTeam),   boTeamApprovedS=Number(userInfoFrDB.sellerTeam.boApproved);
  $settingDivW.$sellerTeamButton.toggle(Boolean(boTeamExistS && boTeamApprovedS));
  $entryDivS.$teamApprovedMess.toggle(Boolean(boTeamExistS && !boTeamApprovedS));

  var boCE=Boolean(userInfoFrDB.customer), boVE=Boolean(userInfoFrDB.seller);
  $quickDivC.toggle(boCE);   $quickDivS.toggle(boVE);
  $settingDivW.$userDiv.$customerSettingButton.toggle(boCE);
  $settingDivW.$userDiv.$sellerSettingButton.toggle(boVE);
  $settingDivW.$userDiv.toggle(boCE || boVE);
  
  var boBoth=boCE && boVE;  $quickDivC.$butTogW.toggle(boBoth); $quickDivS.$butTogW.toggle(boBoth);
  //$buttLoginSeller.toggle(!boE);

  /* if(userInfoFrDB.seller){
    var tmp=$agreementStart.compareLocalDates(1); if(tmp.boNew) {$agreementStart.setLocalDates(1); $agreementStart.openFunc(); }
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
getOAuthCode=function*(flow){
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



idPLoginDivExtend=function($el){

  return $el;
}


formLoginDivExtend=function($el){
  "use strict"
  $el.toString=function(){return 'formLoginDiv';}


  $el.setUp=function(){
    $inpEmail.val('');    $inpPass.val('');
  }

  var loginWEmail=function(){
    var flow=(function*(){
      var tmp=SHA1($inpPass.val()+strSalt); //$inpPass.val('');
      var vec=[['loginWEmail',{email:$inpEmail.val(), password:tmp}], ['setupById', {}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      history.fastBack($frontDiv);

    })(); flow.next();
    return false;
  }
  var sendEmail=function(){
    var vec=[['sendLoginLink',{email:$inpEmail.val()}]];   majax(oAJAX,vec);  return false;
  }

  var $divHead=$('<h3>').append('Sign in using email / password').css({'text-align':'center'});

  var $formLogin=$('#formLogin');
  var $inpEmail=$formLogin.children("input[name='email']").css({'max-width':'100%'});
  var $inpPass=$formLogin.children("input[name='password']").css({'max-width':'100%'});
  var $buttLogin=$formLogin.children("button[name='submit']").css({"margin-top": "1em"}).on('click',loginWEmail);
  $formLogin.find('input[type=text],[type=email],[type=number],[type=password]').css({display:'block'}).on('keypress', function(e){ if(e.which==13) { loginWEmail(); }} );

  var $messDiv=$('<div>').css({color:'red'});
  var $buttForgot=$('<a>').prop({href:''}).text('Forgot your password?').on('click', function(){  $forgottPWPop.openFunc(); return false; });
  var $imgH=popupHoverJQ($imgHelp.clone(), $('<div>').html("A new password is generated and sent to the email address."));
  var $divForgot=$('<div>').css({'margin-top':'1em'}).append($buttForgot, $imgH);
  var $butSendLink=$('<a>').prop({href:''}).text('Login with email link').on('click', sendEmail);
  var $imgH=popupHoverJQ($imgHelp.clone(), $('<div>').html("An email is sent with a link which will log you in. Your password is not changed."));
  var $divSendLink=$('<div>').css({'margin-top':'1em'}).append($butSendLink, $imgH);

  var $buttonCreateAccount=$('<button>').addClass('highStyle').append('Create an account').on('click', function(){
    doHistPush({$view:$createUserDiv});
    $createUserDiv.setVis();
  });

  var $divCont=$('<div>').addClass('contDiv').append($divHead, $messDiv, $formLogin, $divForgot, $divSendLink, '<hr>', $buttonCreateAccount);

  
      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Login with email / password').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


var loginSelectorDivExtend=function($el, oRole){
"use strict"
  var {strRole, charRoleUC}=oRole;
  $el.toString=function(){return 'loginSelectorDiv';}
  //$el.setUp=function(){}

  var strButtonSize='2em';
  var $imgFb=$('<img>').prop({src:uFb}).on('click', function(){
    var flow=(function*(){
      ga('send', 'event', 'button', 'click', 'login');
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:strRole+'Fun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById',{}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

      var boE=Boolean(userInfoFrDB[strRole]);
      var $tmpIntroDiv=strRole=='customer'?$introDivC:$introDivS;
      var $tmpQuickDiv=strRole=='customer'?$quickDivC:$quickDivS;
      if(boE) $tmpQuickDiv.setUp(); else $tmpIntroDiv.openFunc(); 
      history.fastBack($frontDiv);
    })(); flow.next();
  });
  $imgFb.css({align:'center', display:'block', 'margin': '0.7em auto'}); //     , position:'relative',top:'0.4em',heigth:strButtonSize,width:strButtonSize



  var $divHead=$('<h3>').append('Sign in / Create account').css({'text-align':'center'});

  var emailToggleEventF=function(){
    var now=Date.now(); if(now>timeSpecialR+1000*10) {timeSpecialR=now; nSpecialReq=0;}    nSpecialReq++;
    //if(nSpecialReq==3) { nSpecialReq=0;boAllowEmailLogin=!boAllowEmailLogin; $divRight.toggle(boAllowEmailLogin);   }
    if(nSpecialReq==3) { nSpecialReq=0; $divRight.toggle();   }
  }
  var timeSpecialR=0, nSpecialReq=0;
  $divHead.on('click', emailToggleEventF);


  var cssCol={display:'inline-block','box-sizing': 'border-box',padding:'1em',flex:1}; //width:'50%',
  var $buttonViaEmail=$('<button>').addClass('highStyle').append('Email and password').on('click', function(){
    doHistPush({$view:$formLoginDiv});
    $formLoginDiv.setVis();
  });
  var $divLeft=$('<div>').css(cssCol).css({'text-align':'center'}).append($imgFb, '<p>Email, name and image are used, although not shown publicly unless you want to.<p>Nothing is written to your Facebook flow.' ); // <p>You can delete your account at any time., '(recommended)' <br>(fewer passwords to remember) (no new password to remember)
  var $divRight=$('<div>').css(cssCol).css({'border-left':'2px solid grey', 'text-align':'center'}).append( $buttonViaEmail);        $divRight.hide();
  var $divRow=$('<div>').append($divLeft, $divRight).css({display: 'flex', 'justify-content':'space-around'});  //


  $divHead.css({display:'block', 'margin':'1em 0em 1em 0.6em'});
  $el.append($divHead, $divRow);

  $el.css({'text-align':'left'});
  return $el;
}


var createUserDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'createUserDiv';}
  var save=function(){
    resetMess();
    var strPassword=$inpPass.val().trim();
    if(strPassword!==$inpPassB.val().trim()) { var tmp='Password-fields are not equal'; setMess(tmp, 5); return; }
    if(strPassword.length<lPWMin) { var tmp='The password must be at least '+lPWMin+' characters long'; setMess(tmp, 5); return; }


    var strName=$inpName.val().trim();
    var strEmail=$inpEmail.val().trim(); if(/\S+@\S+/.test(strEmail)) ; else {setMess('Invalid email', 5); return;}

    var strTmp=grecaptcha.getResponse(); if(!strTmp) {setMess("Captcha response is empty", 5); return; }
    var o={name:strName, email:strEmail, password:SHA1(strPassword+strSalt),  'g-recaptcha-response': grecaptcha.getResponse()};

    //var vec=[['createUser',o], ['setupById',{}, $el.cb]];   majax(oAJAX,vec);
    var vec=[['sendVerifyEmailNCreateUserMessage',o, saveRet]];   majax(oAJAX,vec);

    $inpPass.val(''); $inpPassB.val('');
    setMess('',null,true);
  }
  var saveRet=function(data){
    if(data.boOK){
      var strTmp='Check your mailbox, an email was sent which contains a link which will create the account.';
      setMess(strTmp);  $messEndDiv.append(strTmp);
    }
  }

  var lPWMin=boDbg?2:6;

  $el.setUp=function(){
    if($divReCaptcha.is(':empty')){
    if(typeof grecaptcha=='undefined') var grecaptcha={render:function(){console.log('no grecaptcha');}};
      grecaptcha.render($divReCaptcha[0], {sitekey:strReCaptchaSiteKey});
    }
    $messDiv.html('');  $messEndDiv.html('');
    return true;
  }
  $el.cb=null;

  var $h1=$('<h1>').append('Create account');

  var $formCreateAccount=$('#formCreateAccount');
  var $inpName=$formCreateAccount.children("input[name='name']").css({'max-width':'100%'});
  var $inpEmail=$formCreateAccount.children("input[name='email']").css({'max-width':'100%'});
  var $inpPass=$formCreateAccount.children("input[name='password']").css({'max-width':'100%'});
  var $inpPassB=$formCreateAccount.children("input[name='passwordB']").css({'max-width':'100%'});
  $formCreateAccount.find('input[type=text],[type=email],[type=number],[type=password]').css({display:'block', 'margin-bottom':'0.5em'});
  $inpPass.attr("placeholder", 'at least '+lPWMin+' characters');

  var $divReCaptcha=$('<div>');
  $el.$divDisclaimerW=$('<div>').css({'margin':'0em', 'padding':'0em'});

  var $messDiv=$('<div>').css({color:'red'});


  var $buttonVerifyNCreate=$("<button>").text('Verify email and create account').on('click', save).addClass('flexWidth').css({'margin':'0.5em 0em 0.3em'})
  var $messEndDiv=$('<div>');  //=$('<span>').css({'margin-left':'.4em'});

  var $divCont=$('<div>').addClass('contDiv').append($h1, $el.$divDisclaimerW, $messDiv,   $formCreateAccount, $divReCaptcha, $buttonVerifyNCreate, $messEndDiv);
  
      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.CreateAccount).addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


var changePWPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'changePWPop';}
  var save=function(){
    resetMess();
    $messDiv.html('');
    if($inpPass.val().trim()!==$inpPassB.val().trim()) { setMess('The new password fields are not equal', 5); return; }
    var lTmp=boDbg?2:6; if($inpPass.val().trim().length<lTmp) { setMess('The password must be at least '+lTmp+' characters long', 5); return; }

    var o={passwordOld:SHA1($inpPassOld.val().trim()+strSalt), passwordNew:SHA1($inpPass.val().trim()+strSalt)};

    var vec=[['changePW',o,changePWRet]];   majax(oAJAX,vec);
    setMess('',null,true);
  }

  $el.openFunc=function(){
    doHistPush({$view:$changePWPop});
    $el.setVis();
    $inpPassOld.val(''); $inpPass.val(''); $inpPassB.val('');
  }
  $el.setVis=function(){
    $el.show();
    return true;
  }
  var changePWRet=function(data){
    if(data.boOK) { $inpPassOld.val(''); $inpPass.val(''); $inpPassB.val('');  doHistBack(); }
  }

  var $h1=$('<h3>').append('Change your password');
  var $blanket=$('<div>').addClass("blanket");
  var $messDiv=$('<div>').css({color:'red'});
  var $labPassOld=$('<label>').append('Old password'), $labPass=$('<label>').append('New password'),  $labPassB=$('<label>').append('New password again');
  var $inpPassOld=$('<input type=password>'), $inpPass=$('<input type=password placeholder="at least 6 characters">'),  $inpPassB=$('<input type=password>');

  $([]).push($inpPassOld, $inpPass, $inpPassB).css({display:'block', 'margin-bottom':'0.5em'}).on('keypress', function(e){ if(e.which==13) {okF();return false;}} );

  var $ok=$('<button>').html(langHtml.OK).addClass('highStyle').on('click', save);
  var $cancel=$('<button>').html(langHtml.Cancel).addClass('highStyle').on('click', doHistBack);
  var $divBottom=$('<div>').append($cancel,$ok);  //$buttonCancel,

  var $centerDiv=$('<div>').append($h1, $messDiv,   $labPassOld, $inpPassOld, $labPass, $inpPass, $labPassB, $inpPassB, $divBottom);
  $centerDiv.addClass("Center").css({padding:'1.1em'}); // 'width':'20em', height:'21em', 
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}

var forgottPWPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'forgottPWPop';}
  var okF=function(){
    var vec=[['verifyPWReset',{email:$inpEmail.val().trim()}, okRet]];   majax(oAJAX,vec);

  };
  $el.openFunc=function(){
    doHistPush({$view:$forgottPWPop});
    $el.setVis();
    $inpEmail.val('');
  }
  $el.setVis=function(){
    $el.show();
    return true;
  }
  var okRet=function(data){
    if(data.boOK) { $inpEmail.val('');  doHistBack(); }
  }

  var $h1=$('<h3>').append('Forgott your password?');
  var $blanket=$('<div>').addClass("blanket");
  var $labEmail=$('<label>').append('Email');
  var $inpEmail=$('<input type=email>').on('keypress', function(e){ if(e.which==13) {okF();return false;}} );
  $inpEmail.css({display:'block', 'margin-bottom':'0.5em'});

  var $ok=$('<button>').html(langHtml.OK).addClass('highStyle').on('click', okF);
  var $cancel=$('<button>').html(langHtml.Cancel).addClass('highStyle').on('click', doHistBack);
  var $divBottom=$('<div>').append($cancel,$ok);  //$buttonCancel,

  var $centerDiv=$('<div>').append($h1, $labEmail, $inpEmail, $divBottom);
  $centerDiv.addClass("Center").css({padding:'1.1em'});  // 'width':'20em', height:'13em', 
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}

var convertIDDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'convertIDDiv';}

  $el.setUp=function(){
  }

  $el.openFunc=function(){
    $pendingMess.hide(); $cancelMess.hide();
    doHistPush({$view:$convertIDDiv});
    $el.setVis();
  };
  $el.myReset=function(){   clearInterval(timerClosePoll);     }
  $el.myResetNBack=function(){   $el.myReset(); doHistBack();    }
  var $pendingMess=$('<span>').hide().append(langHtml.pendingMessLogin,' ',$imgBusy.clone()).css({"margin-left":"0.3em"});
  var $cancelMess=$('<span>').hide().append(langHtml.cancelMessLogin);

  var $headA=$('<h2>').append('This site has changed ID-provider').css({'margin-top':'0.5em'});
  var $headB=$('<div>').append('<p>Before '+strIPAltLong+' was used as ID-provider now '+strIPPrimLong+' is used instead. Sorry if you think its an inconvenience.<p>Login with '+strIPPrimLong+' (You\'ll be asked to create an account if you don\'t have one).').css({'margin-top':'0.5em'});
  var $headC=$('<div>').append('<p>After that login with your old ('+strIPAltLong+') ID to convert reputation and comments to the '+strIPPrimLong+' ID.').css({'margin-top':'0.5em'});


  var timerClosePoll;

  var uImagePrim=window['u'+ucfirst(strIPPrim)];
  var $imPrim=$('<img>').prop({src:uImagePrim}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'userFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
    })(); flow.next();
  });


  var uImageAlt=window['u'+ucfirst(strIPAlt)];
  var $imAlt=$('<img>').prop({src:uImageAlt}).css({'vertical-align':'middle'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPAlt, fun:'mergeIDFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

    })(); flow.next();
  });



  var $rows=$([]).push($pendingMess, $cancelMess, $headA, $headB, $imPrim, $headC, $imAlt);
  $rows.css({'margin':'1em 0em 1em 0.6em'});
  var $divCont=$('<div>').append($rows).addClass('contDiv');

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Convert ID').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}

/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Complainer divs
 *
 *  Summary:
 *  $complaintCommentPop   // Popup where a complainer can write a complaint
 *  $complaintAnswerPop    // Popup where a complainee can answer a complaint
 *  $complaintCommentButt  // Opens $complaintCommentPop, placed in $complaineeDiv
 *  $complaintAnswerButt   // Opens $complaintAnswerPop, placed in $complaineeDiv
 *  $complaineeDiv         // List of complaints on a certain complainee
 *  $complainerDiv         // List of complaints from a certain complainer
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/



var complaintCommentPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'complaintCommentPop';}
  $el.openFunc=function(idComplaineeT){
    idComplainee=idComplaineeT; $idComplainee.html(idComplaineeT);

    if(isSet(sessionLoginIdP) || typeof userInfoFrDB.user=='object'){} else {setMess('not logged in', 5); return;}
    var vec=[['complaintOneGet', {idComplainee:idComplainee}, complaintCommentOneGet]];   majax(oAJAX,vec);
    $el.setVis();
    $comment.focus();
  };
  $el.setVis=function(){
    $el.show();
    return true;
  }
  $el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() {
    var o1={idComplainee:idComplainee,comment:$comment.val().trim()};
    var vec=[['complaintUpdateComment',o1], ['getComplaintsOnComplainee', $complaineeDiv.getLoadArg(), $complaineeDiv.getComplaintsOnComplaineeRet], ['setupById']];   majax(oAJAX,vec);
    doHistBack();
  }
  var complaintCommentOneGet=function(data){
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; $comment.val(tmp);
    var tmp=row.answer;   if(typeof tmp==="undefined")  tmp=''; $answer.html(tmp);
    if($answer.html().length) $answerHead.show(); else $answerHead.hide();
  };
  //$el=popUpExtend($el);
  //$el.css({'max-width':'16em', padding: '1em'});

  var idComplainee, $idComplainee=$('<span>');

  var $commentHead=$('<div>').html(langHtml.Complaint+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $comment=$('<textarea>').css({display:'block',margin:'0em 0em 0.7em'});  $comment.on('keypress', function(e){ if(e.which==13) {sendFunc();return false;}} );
  var $save=$('<button>').html(langHtml.Save).on('click', function(){sendFunc();});
  var $del=$('<button>').html(langHtml.vote.deleteComplaint).on('click', function(){$comment.val(''); sendFunc();});
  var $cancel=$('<button>').html(langHtml.Cancel).on('click', doHistBack);
  //var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $answerHead=$('<div>').html(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'}); $answerHead.hide();
  var $answer=$('<div>');
  //$el.append($commentHead,$comment,$butts,$answerHead,$answer);

  //var $mess=$('<div>');   $el.append($mess);
  $el.css({'text-align':'left'});

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($commentHead,$comment,$butts,$answerHead,$answer);
  $centerDiv.addClass("Center").css({padding: '1em'}); // 'width':'20em', height:'22em', 
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}


var complaintAnswerPopExtend=function($el){
  $el.toString=function(){return 'complaintAnswerPop';}
  $el.openFunc=function(idT){
    idComplainer=idT;  $idComplainer.html(idT);
    var o1={idComplainer:idComplainer}, vec=[['complaintOneGet',o1,complaintAnswerOneGet]];   majax(oAJAX,vec);
    $answer.focus();
    doHistPush({$view:$complaintAnswerPop});
    $el.setVis();
    $answer.focus();
  };
  $el.setVis=function(){
    $el.show();
    return true;
  }
  $el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() {
    var o1={idComplainer:idComplainer,answer:$answer.val().trim()};
    var vecG; 
    if($complaineeDiv.css('display')!='none') { vecG=['getComplaintsOnComplainee', $complaineeDiv.getLoadArg(), $complaineeDiv.getComplaintsOnComplaineeRet];  }
    else { vecG=['getComplaintsFromComplainer', $complainerDiv.getLoadArg(), $complainerDiv.getComplaintsFromComplainerRet];   }
    var vec=[['complaintUpdateAnswer',o1],vecG];   majax(oAJAX,vec);
    doHistBack();
  }

  var complaintAnswerOneGet=function(data){
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; $comment.html(tmp);
    var tmp=row.answer;   if(typeof tmp==="undefined")  tmp=''; $answer.val(tmp);
  };
  //$el=popUpExtend($el);
  //$el.css({'max-width':'16em', padding: '1em'});

  var idComplainer, $idComplainer=$('<span>');

  var $commentHead=$('<div>').html(langHtml.Complaint+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $comment=$('<div>');
  var $answerHead=$('<div>').html(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $answer=$('<textarea>').css({display:'block',margin:'0em 0em 0.7em'}); $answer.on('keypress', function(e){ if(e.which==13) {sendFunc();return false;}} );
  var $save=$('<button>').html(langHtml.Save).on('click', function(){sendFunc();});
  var $del=$('<button>').html(langHtml.vote.deleteAnswer).on('click', function(){$answer.val(''); sendFunc();});
  var $cancel=$('<button>').html(langHtml.Cancel).on('click', doHistBack);
  //var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  //$el.append($commentHead,$comment,$answerHead,$answer,$butts);

  //var $mess=$('<div>');   $el.append($mess);
  $el.css({'text-align':'left'});

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($commentHead,$comment,$answerHead,$answer,$butts);
  $centerDiv.addClass("Center").css({padding: '1em'}); // 'width':'20em', height:'22em', 
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}

var complaineeDivExtend=function($el){    // Complaints on a certain complainee
"use strict"
  $el.toString=function(){return 'complaineeDiv';}
  $el.setUp=function(oRoleT, id){
    oRole=oRoleT; $el.indRole=oRole.ind;
    var iMTab=$TableDiv[oRole.ind].getMTabInd(id);
    rowComplainee=oRole.MTab[iMTab];
    $el.idComplainee=rowComplainee.idUser;
    $nameSpan.html(rowComplainee.displayName);

    var strTmp; //var IPTmp=enumIP[Number(rowComplainee.IP)];
    strTmp=calcImageUrl(rowComplainee);
    $imgComplainee.prop({src:strTmp});
    $ListCtrlDiv[oRole.ind].mySet(iMTab);
    $spanRole.html(langHtml[ucfirst(oRole.strRole)]);
    $span.html('Complaints on a user ('+langHtml[oRole.strRole]+')').css({background:oRole.strColor}); // divFoot label
  }
  $el.getLoadArg=function(){ return {offset:offset, rowCount:rowCount, idComplainee:$el.idComplainee};   }
  $el.load=function(){
    setMess('',null,true);  majax(oAJAX,[['getComplaintsOnComplainee', $el.getLoadArg(), $el.getComplaintsOnComplaineeRet]]);
    $el.boLoaded=1;
  }
  //var makeImgClickFun=function(idR,image){return function(){
    //$complainerDiv.setUp({idUser:idR,image:image});
    ////$complainerDiv.setUp(idR,image);
    //$complainerDiv.load();
    //$complainerDiv.setVis();
    //doHistPush({$view:$complainerDiv});
  //}}
  var makeImgClickFun=function(objArg){return function(){
    $complainerDiv.setUp(objArg);
    //$complainerDiv.setUp(idR,image);
    $complainerDiv.load();
    $complainerDiv.setVis();
    doHistPush({$view:$complainerDiv});
  }}
  var ansButClick=function(){
    var idComplainer=$(this).closest('tr').data('idComplainer');
    $complaintAnswerPop.openFunc(idComplainer);
  }
  $el.getComplaintsOnComplaineeRet=function(data){
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    //tab.length=0; tmp=data.tab;  if(typeof tmp !='undefined') tab.push.apply(tab,tmp);

    $tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var idComplainerTmp=tab[i].idComplainer;
      var image=tab[i].image;
      var strTmp=image || uUserImage+idComplainerTmp;
      var $img=$('<img>').prop({src:strTmp}).css({'float':'left', width:"50px", height:"50px", background:"eee"});
      //var objTmp=copySome({},tab[i],['idComplainer','image','nameIP']);
      //var objTmp={idUser,tab[i],['idComplainer','image','nameIP']);
      
      $img.on('click', makeImgClickFun(tab[i]));
      //$img.on('click', makeImgClickFun(idComplainerTmp,image));

      var d=(new Date(tab[i].tCreated*1000)).toLocaleDateString(),   $tCreated=$('<p>').append(d).css({'font-weight':'bold'});
      var $comm=$('<p>').append(tab[i].comment);

      var strAns=tab[i].answer, $ans='';
      if(strAns) {
        var $ansLab=$('<p>').append(langHtml.vote.answer+':').css({'font-weight':'bold'});
        $ans=$('<p>').append($ansLab,strAns).css({background:'#ff3',overflow:'hidden'});
      }

      var $butAns=''
      if(userInfoFrDB.user && $el.idComplainee==userInfoFrDB.user.idUser){
        var idR=tab[i].idComplainer;
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        $butAns=$('<button>').html(strtmp).css({'float':'right'}).on('click', ansButClick);
      }

      var $td=$('<td>').append($img,$tCreated,$comm,$ans,$butAns);
      if(strAns) $ans.append($butAns);
      var $row=$('<tr>').data({idComplainer:idR}).append($td);  $tBody.append($row);
    }


    if(nTot>offset+tab.length) $butNext.prop({disabled:false}); else $butNext.prop({disabled:1});
    if(offset>0) $butPrev.prop({disabled:false}); else $butPrev.prop({disabled:1});
    $spanOffsetInfo.html('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }
  var complaintCommentButtClick=function(){
    var flow=(function*(){
      if(isEmpty(sessionLoginIdP) && typeof userInfoFrDB.user!='object'){
        var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
        var oT={IP:strIPPrim, fun:'complainerFun', caller:'index', code:code};
        var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      }
      doHistPush({$view:$complaintCommentPop});   $complaintCommentPop.openFunc($complaineeDiv.idComplainee);
    })(); flow.next();
  }
  
  var oRole;
  $el.$listCtrlDivW=$('<span>').css({'float':'right'});
  
  var $complaintCommentButt=$('<button>').html(langHtml.vote.writeComment+' ('+langHtml.IdProviderNeeded+')').css({'margin-right':'1em'}).on('click', complaintCommentButtClick);
  var $topDiv=$('<div>').append($complaintCommentButt, $el.$listCtrlDivW).css({'margin-top':'1em',overflow:'hidden'});
  
  var offset=0,rowCount=20;
  $el.boLoaded=0; //$el.idComplainee;
  var tab=[], rowComplainee, $imgComplainee=$('<img>').css({'vertical-align':'middle'}), $nameSpan=$('<span>'), $spanRole=$('<span>');
  var $complaineeInfo=$('<div>').append($spanRole,': ',$imgComplainee,' ',$nameSpan).css({'margin':'0.5em',display:'inline-block', 'float':'right'}); //,'float':'right'
  var $bub=$('<div>').html(langHtml.writeComplaintPopup);
  var $imgH=$imgHelp.clone();  popupHoverJQ($imgH,$bub);

  var $tBody=$('<tbody>'),   $table=$('<table>').append($tBody).css({'width':'100%'});//.addClass('complaintTab');

  var $butPrev=$('<button>').append('Prev page').on('click', function(){ offset-=rowCount; offset=offset>=0?offset:0; $el.load();});
  var $butNext=$('<button>').append('Next page').on('click', function(){ offset+=rowCount; $el.load();});
  var $spanOffsetInfo=$('<span>').css({'white-space':'nowrap'});
  var $divCont=$('<div>').addClass('contDiv').append($topDiv, $complaineeInfo, $table, $butPrev, $butNext, $spanOffsetInfo);

  
      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Complaints on a user').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}

var complainerDivExtend=function($el){  // Complaints from a certain Complainer
"use strict"
  $el.toString=function(){return 'complainerDiv';}
  $el.setUp=function(objArg){
    var {idComplainer:idTmp, image, displayName}=objArg;
    idComplainer=idTmp;
    var strTmp=image || uUserImage+idComplainer;
    $imgComplainer.prop({src:strTmp}); $spanName.html(displayName);
  }
  $el.getLoadArg=function(){ return {offset:offset,rowCount:rowCount,idComplainer:idComplainer}; }
  $el.load=function(){
    setMess('',null,true); majax(oAJAX,[['getComplaintsFromComplainer', $el.getLoadArg(), $el.getComplaintsFromComplainerRet]]);
    $el.boLoaded=1;
  }
  var ansButClick=function(e){
    var idComplainer=$(this).closest('tr').data('idComplainer');
    $complaintAnswerPop.openFunc(idComplainer);
  }
  $el.getComplaintsFromComplainerRet=function(data){
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    //tab.length=0; tmp=data.tab;  if(typeof tmp !='undefined') tab.push.apply(tab,tmp);

    $tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var strTmp=calcImageUrl({idUser:tab[i].idUser, boImgOwn:tab[i].boImgOwn, imTag:tab[i].imTag, image:tab[i].image}); //
      //var strTmp=tab[i].image;

      var $img=$('<img>').prop({src:strTmp}).css({'float':'right','border-left':'solid #ff3 15px'});

      var d=(new Date(tab[i].tCreated*1000)).toLocaleDateString(), $tCreated=$('<p>').append(d).css({'font-weight':'bold'});
      var $comm=$('<p>').append(tab[i].comment);

      var strAns=tab[i].answer, $ans='';
      if(strAns) {
        var $ansLab=$('<p>').append(langHtml.vote.answer+':').css({'font-weight':'bold'});
        $ans=$('<p>').append($ansLab,strAns).css({background:'#ff3',overflow:'hidden'}); //$img='';
      }else $ans='';

      var $butAns=''
      if(userInfoFrDB.user && tab[i].idUser==userInfoFrDB.user.idUser){
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        $butAns=$('<button>').html(strtmp).css({'float':'right'}).on('click', ansButClick);
      }

      var $td=$('<td>').append($img,$tCreated,$comm,$ans,$butAns);
      if(strAns) $ans.prepend($img,$butAns);
      var $row=$('<tr>').data({idComplainer:idComplainer}).append($td);    $tBody.append($row);
    }


    if(nTot>offset+tab.length) $butNext.prop({disabled:false}); else $butNext.prop({disabled:1});
    if(offset>0) $butPrev.prop({disabled:false}); else $butPrev.prop({disabled:1});
    $spanOffsetInfo.html('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }

  var offset=0,rowCount=20;
  $el.boLoaded=0;
  var idComplainer, tab=[], $imgComplainer=$('<img>').css({'vertical-align':'middle', 'margin-top':'1em'}), $spanName=$('<span>');
  var $complainerInfo=$('<div>').append(langHtml.Complainer,': ',$imgComplainer, $spanName);

  var $tBody=$('<tbody>'),   $table=$('<table>').append($tBody).css({'width':'100%'});//.addClass('complaintTab');

  var $butPrev=$('<button>').append('Prev page').on('click', function(){ offset-=rowCount; offset=offset>=0?offset:0; $el.load();});
  var $butNext=$('<button>').append('Next page').on('click', function(){ offset+=rowCount; $el.load();});
  var $spanOffsetInfo=$('<span>').css({'white-space':'nowrap'});
  var $divCont=$('<div>').addClass('contDiv').append($complainerInfo, $table, $butPrev, $butNext, $spanOffsetInfo);

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Complaints from complainer').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * roleInfo Divs
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var updateTableThumb=function($el, iRow, nRow){
"use strict"
  var canvas=$el[0],  ctx = canvas.getContext("2d");
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

  return $el;
}

var mapThumbDivExtend=function($el){
"use strict"
  $el.updateMapThumb=function(oRole,iRow){
    var canvas=$mapThumb[0],  ctx = canvas.getContext("2d");

    var zoomDiff=3, zoomDiffFac=Math.pow(2,zoomDiff),  Div=zoomDiffFac;
  
    var {pC:pMerCent, zoom, VPSize}=$mapDiv.getMapStatus();
    var zoomFac=Math.pow(2,zoom),  thumbFac=zoomFac/Div,  widthBox=VPSize[0]/Div,  heightBox=VPSize[1]/Div;

    canvas.width=widthBox;   canvas.height=heightBox;

    var iMTab=$TableDiv[oRole.ind].$tBody.children('tr:eq('+iRow+')').data('iMTab');

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

    $el.css({width:widthBox+'px',height:heightBox+'px'});

    var zoomThumb=zoom-zoomDiff+1, zoomThumbFac=Math.pow(2,zoomThumb);
    var pixXRC=pMerCent.x*zoomThumbFac,   pixYRC=pMerCent.y*zoomThumbFac;  // tileXRC=pixXRC*256,tileYRC=pixYRC*256;
    var pixXR=[pixXRC-widthBox/2*2,pixXRC+widthBox/2*2,pixXRC+widthBox/2*2,pixXRC-widthBox/2*2];
    var pixYR=[pixYRC-heightBox/2*2,pixYRC-heightBox/2*2,pixYRC+heightBox/2*2,pixYRC+heightBox/2*2];
    var $img=[$imga,$imgb,$imgc,$imgd];

    var arrtmp=[], tileXRZ, tileYRZ
    for(var i=0;i<4;i++){
      var tileXR=pixXR[i]/256, tileYR=pixYR[i]/256,   tileX=Math.floor(tileXR), tileY=Math.floor(tileYR);
      if(i==0) { tileXRZ=tileXR; tileYRZ=tileYR;}
      var lef=-(tileXRZ-tileX)*128, to=-(tileYRZ-tileY)*128;
      var uTmp=uMapSourceDir+'/'+zoomThumb+'/'+tileX+'/'+tileY+'.png';
      if(zoomThumb<0) {uTmp=window['uMapm'+-Number(zoomThumb)]; }
      $img[i].prop({src:uTmp}).css({left:lef+'px',top:to+'px'});
      var tmpName=lef+' '+to;
      //if(arrtmp.indexOf(uTmp)==-1) {$img[i].show(); arrtmp.push(uTmp);} else $img[i].hide();
      if(arrtmp.indexOf(tmpName)==-1) {$img[i].show(); arrtmp.push(tmpName);} else $img[i].hide();
    }
  }

  var arrInd=[];
  var $mapThumb=$('<canvas>').css({position:'absolute'});
  var $imga=$('<img>'), $imgb=$('<img>'), $imgc=$('<img>'), $imgd=$('<img>');
  //var $images=$([]).push($imga, $imgb, $imgc, $imgd).css({position:'absolute',width:'128px',height:'128px',opacity:0.9});
  var $images=$([]).push($imga, $imgb, $imgc, $imgd).css({position:'absolute',width:'128px',height:'128px',opacity:0.9});
  $el.append($images,$mapThumb);
  $el.css({display:'inline-block',position: 'relative',overflow:'hidden'});
  return $el;
}



var roleInfoDivExtend=function($el, oRole){
"use strict"
  var {strRole, Prop, charRoleUC}=oRole, {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  $el.indRole=oRole.ind;
  $el.toString=function(){return 'infoDiv'+charRoleUC;}
  $el.setContainers=function(iMTab){
    $containers.each(function(j){
      var $ele=$(this), strName=$ele.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:{};
      var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,$ele);  else tmp=oRole.MTab[iMTab][strName];
      if(typeof tmp!='undefined') $ele.html(tmp);
    });
    $el.boLoaded=1;
    $ListCtrlDiv[oRole.ind].mySet(iMTab);
  }
  $el.createContainers=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i], tmpObj=(strName in Prop)?Prop[strName]:{};
      var $imgH=''; if(strName in oRole.helpBub && Number(Prop[strName].b[oRole.bFlip.help])) { $imgH=$imgHelp.clone();   popupHoverJQ($imgH,oRole.helpBub[strName]); }

      var strDisp,strMargRight,strWW; if(Number(Prop[strName].b[oRole.bFlip.block])) {strDisp='block'; strMargRight='0em'; strWW='';} else {strDisp='inline'; strMargRight='.2em'; strWW='nowrap';}

      var strLabel=''; if(Number(Prop[strName].b[oRole.bFlip.label])) { strLabel=calcLabel(langHtml.label, strName)+': ';      }

      var $divC=$('<span>').attr({name:strName}).css({'font-weight':'bold',margin:'0 0.2em 0 0em'});
      if('crInfo' in tmpObj) tmpObj.crInfo($divC);
      var $divLCH=$('<div>').append(strLabel,$divC,$imgH).css({display:strDisp,'margin-right':strMargRight,'white-space':strWW}).attr({name:strName});
      $el.$divCont.append($divLCH,' ');
    }
    $containers=$el.$divCont.find('div>span');

    for(var i=0;i<StrGroup.length;i++){
      var $h=$('<span>').append(langHtml[StrGroup[i]],':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      $el.find('div[name='+StrGroupFirst[i]+']').before('<hr>',$h);
    }
  }
  $el.$divCont=$('<div>').addClass('contDiv');
  var $containers;

  $el.boLoaded=0;

  //var $buttonBack=$('<button>').html(langHtml.Back).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  $el.$listCtrlDivW=$('<div>');
  $el.$menuDiv=$('<div>').css({flex:"0 0 auto", 'margin-top':'1em','padding':'0'}).append($el.$listCtrlDivW);
  
  
      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(ucfirst(langHtml[strRole])+' info').addClass('footDivLabel').css({background:oRole.strColor});
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($el.$menuDiv,$el.$divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}

var listCtrlDivExtend=function($el, oRole){ // The little map and up/down arrows
  var $tableDiv=$TableDiv[oRole.ind]
  $el.mySet=function(iMTab){
    $arrowDiv.toggle(oRole.nMTab>1);
    $el.$tr=$tableDiv.getRow(iMTab);
    var iRow=$el.$tr.index();

    $tableThumb=updateTableThumb($tableThumb, iRow, oRole.nMTab);
    $mapThumbDiv.updateMapThumb(oRole, iRow);
  }
  var $mapThumbDiv=mapThumbDivExtend($('<div>')).css({'display':'inline-block','margin-right':'1em',border:'1px solid grey','vertical-align':'top'});
  //$mapThumbDiv.on('click', function(){frontButtonClick();});

  var $tableThumb=$('<canvas>').css({'margin-right':'1.5em',border:'1px solid grey','vertical-align':'top'}); //.on('click', function(){tableButtonClick();});

  var tmpf=function(iDiff){
    var $trt; if(iDiff==1) {$trt=$el.$tr.next(); if($trt.length==0 || $trt.css('display')=='none') $trt=$el.$tr.parent().children(':first');}
    else {$trt=$el.$tr.prev(); if($trt.length==0) $trt=$tableDiv.$tBody.children(':eq('+(oRole.nMTab-1)+')'); }
    var iTmp=$trt.data('iMTab');
    $InfoDiv[oRole.ind].setContainers(iTmp);
    if($complaineeDiv.is(':visible')){$complaineeDiv.setUp(oRole, oRole.MTab[iTmp].idUser); $complaineeDiv.load(); }
  }
  var $buttonPrev=$('<button>').html('&#x25b2;').on('click', function(){tmpf(-1);}).css({display:'block','margin':'0em'});
  var $buttonNext=$('<button>').html('&#x25bc;').on('click', function(){tmpf(1);}).css({display:'block','margin':'1.5em 0em 0em'});
  var $arrowSpan=$('<span>').css({display:'inline-block'}).append($buttonPrev,$buttonNext);
  var $arrowDiv=$('<div>').css({display:'inline-block','margin':'0em 1.5em 0em 0em'}).append($tableThumb,$arrowSpan);
  $el.append($mapThumbDiv,$arrowDiv);
  return $el;
}



/*******************************************************************************************************************
 * top-line-div
 *******************************************************************************************************************/
var loginInfoExtend=function($el){
"use strict"
  $el.setStat=function(){
    var arrKind=[], boIn=0;
    if('user' in userInfoFrDB && userInfoFrDB.user){
      boIn=1;
      var arrTmp=['customer','seller','complainer', 'admin']
      for(var i in arrTmp){  var key=arrTmp[i]; if(userInfoFrDB[key]) {  arrKind.push(langHtml.loginInfo[key]); }   }
    }
    if(boIn){
      $spanName.html(userInfoFrDB.user.nameIP);
      var strTmp=arrKind.join(', '); if(strTmp) strTmp='('+strTmp+')';
      $spanKind.html(strTmp);
      //$el.css({visibility:''});
      $el.show();
    }else {
      //$el.css({visibility:'hidden'});
      $el.hide();
    }
  }
  var $spanName=$('<span>'), $spanKind=$('<span>').css({'margin-left':'.4em'});
  //var $logoutButt=$('<a>').prop({href:''}).text(langHtml.loginInfo.logoutButt).css({'float':'right'});
  var $logoutButt=$('<button>').text(langHtml.loginInfo.logoutButt).css({'margin-left':'auto', 'font-size':'90%'});
  $logoutButt.on('click', function(){
    sessionLoginIdP={}; userInfoFrDB=$.extend({}, specialistDefault);
    var vec=[['logout',1, function(data){
      history.fastBack($frontDiv,true);
    }]];
    majax(oAJAX,vec);
    return false;
  });

  //$el.append($spanName,' ',$spanKind,' ',$logoutButt,'<br clear=all>');
  $el.append($spanName,' ',$spanKind,' ',$logoutButt);
  $el.css({'text-align':'left', display:'flex', 'justify-content':'space-between', width:'100%', 'max-width':'800px'});
  $el.hide();
  return $el;
}





/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * filterExtend
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/

teamImgButtonExtend=function($el, oRole){
  var strRole=oRole.strRole;
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  $el.mySet=function(idTeam,boOn){
    var boId=Number(idTeam)!=0;
    $spanIndependent.toggle(!boId);   $im.toggle(boId);
    if(boId){
      var strTmp=uRoleTeamImage+idTeam;
      $im.prop({src:strTmp});
    }
    if(boOn) opacity=1; else opacity=0.4; $im.css({opacity: opacity});
  }
  var $spanIndependent=$('<span>').append(langHtml.Independent);
  var $im=$('<img>');
  $el.append($spanIndependent,$im);
  return $el;
}

      // filt (client-side): 'B/BF'-features: [vOffNames,vOnNames, boWhite],     'S'-features: [iOn,iOff]
      // filt (server-side): 'B/BF'-features: [vSpec, boWhite],     'S'-features: [iOn,iOff]
      // hist (client-side): 'B'-features: [vPosName,vPosVal],       'S'/'BF'-features: [vPosInd,vPosVal]
      // histPHP (server-side): histPHP[buttonNumber]=['name',value], (converts to:) hist[0]=names,  hist[1]=values
//var FilterDiv=function(Prop, Label, StrOrderFilt, changeFunc, StrGroupFirst=[], StrGroup=[]){
var FilterDiv=function(oRole){
  var {strRole, charRoleUC}=oRole;
  var $el=$('<div>');
  $el.toString=function(){return 'filterDiv'+charRoleUC;}
  
  //arrValRemove(oRole.filter.StrProp,'nComplaint');
  
  $el.$filterDivI=(new FilterDivI(oRole, loadTabStart)).addClass('contDiv');
  
  $el.addClass('unselectable');    $el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em'});

  $el.$filterInfoSpan=filterInfoSpanExtend($('<span>'));
  var $tmpImg=$('<img>').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  
  var $roleToggler=roleTogglerExtend($('<span>'), oRole, $FilterDiv).css({'margin':'0 auto', padding:'0px', display:'flex'});
  
  var $buttAll=$('<a>').prop({href:''}).append(langHtml.All).on('click', function(){$el.$filterDivI.Filt.filtAll(); loadTabStart(); return false;}).css({ 'margin':'0em 1em', 'font-size':'80%'});
  var $buttNone=$('<a>').prop({href:''}).append(langHtml.None).on('click', function(){$el.$filterDivI.Filt.filtNone(); loadTabStart(); return false;}).css({ 'margin':'0em 1em', 'font-size':'80%'});
  
  var tmp='Filter'; //+oRole.charRoleUC;
  var $filterInfoWrap2=$('<span>').append($tmpImg, langHtml[tmp],' (',$el.$filterInfoSpan,')').addClass('footDivLabel').css({background:oRole.strColor});
  var $divFoot=$('<div>').append($buttonBack, $roleToggler, $buttAll, $buttNone, $filterInfoWrap2).addClass('footDiv'); //.css({'padding-top':'0em'});  // , 'text-align':'center' ,overflow:'hidden'


  $el.append($el.$filterDivI, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


var filterInfoSpanExtend=function($el){
"use strict"
  $el.setRatio=function(arr){ $el.empty(); $el.append(arr[0],'/',arr[1]);  }
  return $el;
}

var filterButtonExtend=function($el){
"use strict"
  $el.setUp=function(NTotNFilt){
    $filterInfoSpanC.setRatio(NTotNFilt[0]);
    $filterInfoSpanS.setRatio(NTotNFilt[1]);
  }
  var $filterInfoSpanC=filterInfoSpanExtend($('<span>'));
  var $filterInfoSpanS=filterInfoSpanExtend($('<span>'));

  //var $tmpImg=$('<img>').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var $tmpImg=$('<img>').prop({src:uFilter}).css({height:'1em', width:'1em', 'margin-right':'0.5em'});// height:'1em', width:'1em',   //,'vertical-align':'middle'  //,'vertical-align':'text-bottom'
  var $tmpDivC=$('<div>').append($filterInfoSpanC).css({background:oC.strColor});
  var $tmpDivS=$('<div>').append($filterInfoSpanS).css({background:oS.strColor});
  var $tmpDivW=$('<div>').append($tmpDivC, $tmpDivS).css({'font-size':'.7em'})
  $el.append($tmpImg, $tmpDivW).addClass('flexWidth').prop('title',langHtml.FilterTitle);
  $el.on('click',function(){
    var charRoleSelcted=getItem('charRoleSelcted');  if(charRoleSelcted===null) charRoleSelcted=charRoleSelctedDefault;
    var $filterDivTmp=charRoleSelcted=='c'?$filterDivC:$filterDivS;
    $filterDivTmp.setVis();  doHistPush({$view:$filterDivTmp});
    ga('send', 'event', 'button', 'click', 'filter');
  });
  $el.css({'padding-left':'0.3em', 'padding-right':'0.3em', display:'flex', 'align-items':'center'});
  return $el;
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
boDbgCheckered=0;
pixMult=function(pixT,fac){return {x:pixT.x*fac, y:pixT.y*fac};}
var mapDivExtendI=function(el){
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
  elDivPivotDbg=createElement('div'); elDivPivotDbg.css({position:'absolute',background:'black',width:'5px',height:'5px','z-index':5});
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
      elBoard.appendChildren(elGlasBack, elGlas); // To place the elGlasBack and elGlas last in the elBoard
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
      elMark.css({transform:'translate(-50%, -100%)', position:'absolute', 'z-index':1, position: 'absolute'});
      elMark.on('click',MarkerT.tmpPrototype.funcInfoClick);
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
      if(typeof tmp=='string' || typeof tmp=='number') { this.arrFuncOverData[k]=calcLabel(langHtml.label, strName)+': '+tmp; k++; }
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
    //var $tmpDiv=this.oRole.$infoDiv;
    var $tmpDiv=this.oRole==oC?$infoDivC:$infoDivS;
    $tmpDiv.setContainers(i);
    $tmpDiv.setVis();
    doHistPush({$view:$tmpDiv});
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

  elGlas=createElement('div').css({position:'absolute', top:0, left:0, width:'512',height:'512'});
  //elGlas=createElement('div').css({position:'absolute', top:0, left:0, width:"calc(100% + 256px)",height:"calc(100% + 256px)"});
  elGlas.css({'box-sizing': 'border-box'});
  elGlas.css({width:"calc(200% + 512px)",height:"calc(200% + 512px)"});
  if(boDbg) elGlas.css({border:'pink solid'});
  var elGlasBack=elGlas.cloneNode(true);

  var elImgCurLoc=createElement('img').css({transform:'translate(-50%, -100%)', position:'absolute','z-index':1}); elImgCurLoc.src=uMyMarker;
  elGlas.appendChild(elImgCurLoc);
  
  el.ElImgGroupOverlay=[]; for(var i=0;i<ORole.length;i++) el.ElImgGroupOverlay[i]=new ElImgGroupOverlayT(ORole[i]);
  elGlas.appendChildren.apply(elGlas, el.ElImgGroupOverlay);
  
  if(boDbg) elBoard.append(elDivPivotDbg);
  elBoard.appendChildren(elGlasBack, elGlas);

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

  // JQuery wrapper
var mapDivExtend=function($el){
  mapDivExtendI($el[0]);
  copySome($el,$el[0],['setMarkers', 'drawMarkers', 'setGroupOverlay', 'drawGroupOverlay', 'drawMe', 'set1', 'setTile', 'setCentNMe', 'getMapStatus', 'getPWCC']);
  return $el
}

charRoleSelctedDefault='s';
var frontDivExtend=function($el){
  $el.toString=function(){return 'frontDiv';}
  
    // divFoot
  $el.$topDiv=$('<div>').css({background:'', "box-sizing":"border-box",color:'black','font-size':'1.2em','line-height':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.2em 0em 0.2em', margin:'1px 0em 0em 0em', flex:'0 0 auto', display:"flex", "justify-content":"space-around"}); //, 'border-top':'solid 1px', "justify-content":"space-evenly"
  $el.$topDiv.append($entryButtonC, $entryButtonS);
  
  
  var settingButtonClick=function(){
    $settingDivW.setVis(); doHistPush({$view:$settingDivW});
    ga('send', 'event', 'button', 'click', 'setting');
  }
  var $tmpImg=$('<img>').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  var $settingButton=$('<button>').append($tmpImg).addClass('fixWidth').css({'margin-left':'0.8em', 'margin-right':'1em'}).prop('title',langHtml.Settings).on('click',settingButtonClick);

  //var uWikiT=uWiki,tmp='trackerSites'; if(strLang!='en') tmp+='_'+strLang; uWikiT+='/'+tmp;
  var uWikiT=uWiki; if(strLang!='en') uWikiT=uWiki+'/'+strLang;
  var $infoLink=$('<a>').prop({href:uWikiT}).append(langHtml.OtherMarkets).css({'margin':'0em auto'}).on('click', function(){
    ga('send', 'event', 'button', 'click', 'wiki');
  });
  
  var tableButtonClick=function(){
    var charRoleSelcted=getItem('charRoleSelcted');  if(charRoleSelcted===null) charRoleSelcted=charRoleSelctedDefault;
    var $tableDivTmp=charRoleSelcted=='c'?$tableDivC:$tableDivS;
    $tableDivTmp.setVis();  doHistPush({$view:$tableDivTmp});
    ga('send', 'event', 'button', 'click', 'table');
  }
  var $tmpImg=$('<img>').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $el.$tableButton=$('<button>').append($tmpImg).addClass('fixWidth').css({'margin-left':'0.8em'}).prop('title',langHtml.ComparisonTable).on('click',tableButtonClick);  // , background:'transparent'
  
  
  $el.$filterButton=filterButtonExtend($('<button>')).css({'margin-left':'0.4em', 'white-space':'nowrap'}); //, background:'transparent'

  
    // QuickFilterButtons
  var setBut=function(boOn){
    boOn=Boolean(boOn); var $b=$(this), iRole=this==$butS[0]?1:0; 
    if(boOn) $b.css({color:'black', background:ORole[iRole].strColor}); else $b.css({color:'graytext', background:''});
  }
  var clickF=function(){
    var iRole=this==$butS[0]?1:0;
    var $b=$(this), $bAlt=iRole?$butC:$butS;
    var boOn=this.style.color=='black',  boOnAlt=$bAlt[0].style.color=='black'; 
    
    var iRoleT=iRole;
    
    if(boOn && boOnAlt) boOnAlt=false;
    else if(!boOn && boOnAlt) boOn=true;
    else if(boOn && !boOnAlt) boOnAlt=true;
    else if(!boOn && !boOnAlt) boOn=true;
    
    setItem('charRoleSelcted', ORole[iRoleT].charRole);
    
    if(boOn) $FilterDiv[iRole].$filterDivI.Filt.filtAll(); else $FilterDiv[iRole].$filterDivI.Filt.filtNone(); 
    if(boOnAlt) $FilterDiv[1-iRole].$filterDivI.Filt.filtAll(); else $FilterDiv[1-iRole].$filterDivI.Filt.filtNone(); 
    loadTabStart(); 
    
    setBut.call($b[0], boOn);
    setBut.call($bAlt[0], boOnAlt);
  }
  var $butC=$('<button>').append(langHtml['Customers']).css({background:oC.strColor, 'margin-left':'0.8em'}).on('click',clickF).addClass('flexWidth').prop('title','Show / hide '+langHtml['Customers']); // &shy;
  var $butS=$('<button>').append(langHtml['Sellers']).css({background:oS.strColor, 'margin-left':'0.4em'}).on('click',clickF).addClass('flexWidth').prop('title','Show / hide '+langHtml['Sellers']);
  $butC.add($butS).css({'word-break':'break-word', 'font-size':'70%', padding:'0.1em'});   
  setBut.call($butC[0], true);
  setBut.call($butS[0], true);
  
  var $divFoot=$('<div>').append($settingButton, $infoLink, $el.$tableButton, $butC, $butS, $el.$filterButton).addClass('footDiv'); //.css({display:'flex', 'align-items':'center', 'justify-content':'space-between'});

  
  var $quickDivOuter=$('<div>').append($quickDivC, $quickDivS).css({flex:'0 0 auto'});  //'border-top':'solid white 1px'
  //if(boIOS && boTouch) $quickDivOuter.css({padding:'0em 0em 1.7em'});
  
  $el.append($el.$topDiv, $mapDiv, $quickDivOuter, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el
}


var roleTogglerExtend=function($el, oRole, $TargetDiv){
"use strict"
  
  $el.prop('title', langHtml.ToggleBetweenCustomerAndSeller).on('click',function(){
    var iTmp=1-oRole.ind;
    setItem('charRoleSelcted', ORole[iTmp].charRole);
    $TargetDiv[iTmp].setVis();  doHistReplace({$view:$TargetDiv[iTmp]});
  });

  var $divLabelC=$('<div>').append(langHtml['Customers']).css({background:oC.strColor, 'font-size':'80%', height:'50%', 'padding-right':'2em'});
  var $divLabelS=$('<div>').append(langHtml['Sellers']).css({background:oS.strColor, 'font-size':'80%', height:'50%', 'padding-right':'2em'});
  var $divLabelW=$('<div>').append($divLabelC, $divLabelS);
  
  var scale=0.45;
  if(oRole.charRole=='c'){  var strYDir=1, strTranslate=''; }
  else {  var strYDir=-1, strTranslate='translate(0,-100%)'; }
  var $imgTogBut=$('<img>').prop('src',uTogVertical).css({transform:'scaleX('+scale+') scaleY('+strYDir*scale+') '+strTranslate, position:'absolute',  right:'.2em', top:'0em', 'transform-origin':'100% 0%'});
  
  $el.append($divLabelW, $imgTogBut);
  $el.css({cursor:'default', 'user-select':'none', position:'relative'});
  return $el;
}

// intRoleOn
// intRoleSel

/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Plugin classes
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/



timeStampButtExtend=function($el, iRole, colName){ // Used in plugins (in $tableDivS.$tHeadLabel)
"use strict"
  $el.setStat=function(){
    var boTmp=ORole[iRole].Prop[colName].boUseTimeDiff;
    if(!boTmp){$el.text('-');}  else $el.text('+');
  }
  $el.on('click', function(e) {
    e.stopPropagation();
    ORole[iRole].Prop[colName].boUseTimeDiff=1-ORole[iRole].Prop[colName].boUseTimeDiff;
    $el.setStat();
    for(var i=0;i<ORole.length;i++) {
      $TableDiv[i].setCell();
      if(ORole[i].MTab.length){    $mapDiv[0].ArrMarker[i].setMarkers();  $mapDiv[0].ArrMarker[i].drawMarkers();   }
    }
  });
  //$el.html(langHtml.timePref.ts);
  $el.addClass('smallButt');
  $el.setStat();
  var $bub=$('<div>').html(langHtml.tsPopup);
  popupHoverJQ($el,$bub);
  return $el;
}



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Table stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


/*
 * columnDivs
 */

var markSelectorDivExtend=function($el,oRole){
"use strict"
  var {charRoleUC}=oRole;
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  $el.toString=function(){return 'markSelectorDiv'+charRoleUC;}
  $el.setUp=function() {  $table.find(':radio[value='+oRole.colOneMark+']').prop({checked:true});  }

  var saveRB=function(colOneMarkNew) {
    if(colOneMarkNew!=oRole.colOneMark){
      oRole.colOneMark=colOneMarkNew; setItem('colOneMark'+charRoleUC, oRole.colOneMark);
      var ind=oRole.ind;
      if(oRole.MTab.length){    $mapDiv[0].ArrMarker[ind].setMarkers();  $mapDiv[0].ArrMarker[ind].drawMarkers();   }
      
    }
  }
  $el.createTable=function(){
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var $rb=$('<input>').prop({"type":"radio",name:'markSel'}).val(strName);
      var $imgH=''; if(strName in oRole.helpBub) { $imgH=$imgHelp.clone().css({'margin-right':'1em'});  popupHoverJQ($imgH,oRole.helpBub[strName]);  }
      var $tdL=$('<td>').append(calcLabel(langHtml.label, strName),' ',$imgH), $tdRB=$('<td>').append($rb);//, $tdIM=$('<td>').append($imgH);
      var $r=$('<tr>').append($tdL,$tdRB).attr({name:strName});
      $table.append($r);
    }

    var $radioBoxes=$table.find(':radio').change(function(){ saveRB($(this).val()); });
    $radioBoxes.css({'margin':'0.6em 1.2em'});
    if(boAndroid) $radioBoxes.css({'-webkit-transform':'scale(2,2)'}); else $radioBoxes.css({width:'1.4em',height:'1.4em'});

      // Add labels
    for(var i=0;i<StrGroup.length;i++){
      var $th=$('<th>').append(langHtml[StrGroup[i]],':').css({'font-size':'120%','text-align':'center'});
      var $h=$('<tr>').append($th,$('<td>'));
      $el.find('tr[name='+StrGroupFirst[i]+']').before($h);
    }

  }

  var $checkBoxes;

  var $table=$('<table>').css({'margin':'0.3em 0em 0.8em',border:'1px'});
  var $divCont=$('<div>').addClass('contDiv').append($table);

  
      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.ChangeMapMarkers+' ('+langHtml[oRole.strRole]+')').addClass('footDivLabel').css({background:oRole.strColor});
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}



var columnSelectorDivExtend=function($el, oRole){
"use strict"
  var {charRoleUC}=oRole;
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  $el.toString=function(){return 'columnSelectorDiv'+charRoleUC;}
  $el.setUp=function() {  $checkBoxes.each(function(i,el){ var strName=$(el).val(), boOn=oRole.ColsShow.indexOf(strName)!=-1;  $(el).prop({checked:boOn}); });  }
  $el.defaultFunc=function() {
    myCopy(ColsShowLoc,oRole.ColsShowDefault); saveCB(); $el.setUp();
  }
  var StrColsByTypeTmp=[];
  $el.allFunc=function() {  myCopy(StrColsByTypeTmp,StrProp); if(!boShowTeam) arrValRemove(StrColsByTypeTmp,'idTeam'); myCopy(ColsShowLoc,StrColsByTypeTmp); saveCB(); $el.setUp(); }
  //$el.allFunc=function() {  myCopy(ColsShowLoc,StrProp); saveCB(); $el.setUp(); }
  $el.noneFunc=function() {  ColsShowLoc.length=0; saveCB(); $el.setUp();  }

  $el.getCurrentInd=function(ColsShowOut){  // Capture the checked checkboxes to ColsShowOut in a way that keeps the order of ColsShow
    myCopy(ColsShowOut,oRole.ColsShow);
    var $checkBoxesOn=$table.find(":checkbox");
    $checkBoxesOn.each(function(i,el){
      var strName=$(el).val(), boOn=Number($(el).prop('checked')), ind=ColsShowOut.indexOf(strName), boExist=ind!=-1;
      if(!boExist && boOn) ColsShowOut.push(strName); else if(boExist && !boOn) mySplice1(ColsShowOut,ind);
    });
    return ColsShowOut;
  }
  var saveCB=function() {
    if(!myCompare(oRole.ColsShow, ColsShowLoc) ){
      myCopy(oRole.ColsShow, ColsShowLoc); setItem('ColsShow'+charRoleUC, oRole.ColsShow);
      $TableDiv[oRole.ind].colOrderRefresh();
    }
  }
  $el.createTable=function(){
    var $ha=$('<th>').append(langHtml.Column),$hb=$('<th>').append(langHtml.Show), $rh=$('<tr>').append($ha,$hb); $table.append($rh);  //.append(langHtml.Visible)
    for(var i=0;i<StrProp.length;i++){
      var strName=StrProp[i];
      var $cb=$('<input>').prop({"type":"checkbox"}).val(strName);
      var $imgH=''; if(strName in oRole.helpBub) { $imgH=$imgHelp.clone().css({'margin-right':'1em'});  popupHoverJQ($imgH,oRole.helpBub[strName]);  }
      var $tdL=$('<td>').append(calcLabel(langHtml.label, strName),' ',$imgH), $tdCB=$('<td>').append($cb);
      var $r=$('<tr>').append($tdL,$tdCB).attr({name:strName});
      $table.append($r);
    }

    $checkBoxes=$table.find(':checkbox').change(function(){
      var $ele=$(this);
      $el.getCurrentInd(ColsShowLoc);
      myCopy(oRole.ColsShow, ColsShowLoc); setItem('ColsShow'+charRoleUC, oRole.ColsShow);
      var boOn=Boolean($ele.prop('checked'));
      $TableDiv[oRole.ind].colToggle($ele.val(),boOn);
      var indNew=boOn?oRole.ColsShow.length-1:oRole.ColsShow.length;
      $TableDiv[oRole.ind].colMove($ele.val(),indNew);
    });
    $checkBoxes.css({'margin':'0.6em 1.2em'});
    if(boAndroid) $checkBoxes.css({'-webkit-transform':'scale(2,2)'}); else $checkBoxes.css({width:'1.4em',height:'1.4em'});

      // add labels
    for(var i=0;i<StrGroup.length;i++){
      var $th=$('<th>').append(langHtml[StrGroup[i]],':').prop('colspan',2).css({'font-size':'120%','text-align':'center'});
      var $h=$('<tr>').append($th); //,$('<td>')
      $el.find('tr[name='+StrGroupFirst[i]+']').before($h);
    }
  }

  var ColsShowLoc=[];
  var $checkBoxes;

  var $table=$('<table>').css({'margin':'0.3em auto 0.8em',border:'1px'});
  var $divCont=$('<div>').addClass('contDiv').append($table);

  
      // divFoot
  var $buttDefault=$('<button>').on('click', $el.defaultFunc).append(langHtml.Default);
  var $buttAll=$('<button>').on('click', $el.allFunc).append(langHtml.All);
  var $buttNone=$('<button>').on('click', $el.noneFunc).append(langHtml.None);
  var $buttSort=$('<button>').append('Rearrange<br>columns').on('click', function(){
    var $tmp=oRole.strRole=='customer'?$columnSorterDivC:$columnSorterDivS;
    $tmp.setUp();    $tmp.setVis();    doHistPush({$view:$tmp});
  }).addClass('flexWidth').css({'margin-left':'auto', 'margin-right':'1em', 'font-size':'0.72rem'});
  var $buttonBack=$('<button>').on('click', doHistBack).append(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em','margin-right':'1em'});

  var $tmpImg=$('<img>').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  //var $span=$('<span>').append($tmpImg, langHtml.SelectColumns).css({'vertical-align':'-0.4em', 'text-align':'center', display:'inline-block'});
  var $span=$('<span>').append($tmpImg, langHtml.SelectColumns).addClass('footDivLabel').css({background:oRole.strColor})
  var $ButPre=$([]).push($buttAll,$buttDefault, $buttNone).css({'font-size':'80%'});
  //var $spanRightB=$('<span>').append().css({'float':'right',margin:'0 0 0 0'});
  var $divFoot=$('<div>').append($buttonBack, $buttSort, $span, $buttNone, $buttDefault, $buttAll).addClass('footDiv'); //,overflow:'hidden'
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


var dragSorterExtend=function($el){
"use strict"
  var myMousedown= function(e){
    var e = e || window.event; if(e.which==3) return;
    $movedSpan=$(this);
    $movedRow=$movedSpan.parent().css({position:'relative',opacity:0.55,'z-index':'auto'});
    //if(boTouch){      $(document).on('touchmove',myMousemove).on('touchend',$el.myMouseup);  }
    //else{   $(document).on('mousemove',myMousemove).on('mouseup',$el.myMouseup);    }
    $(document).on(strMoveEv,myMousemove).on(strEndEv,$el.myMouseup);
    //setMess('Down');
    e.preventDefault(); // to prevent mobile crome from reloading page
  }
  $el.myMouseup= function(e){
    $movedRow.css({position:'relative',opacity:1,'z-index':'auto',top:'0px'});
    //if(boTouch) $(document).off('touchmove',myMousemove).off('touchend',$el.myMouseup);
    //else $(document).off('mousemove').off('mouseup');
    $(document).off(strMoveEv,myMousemove).off(strEndEv,$el.myMouseup);
    //setMess(print_r($el.myGet(),1));
  }

  var myMousemove= function(e){
    var mouseX,mouseY;
    if(boTouch) {e.preventDefault(); var orig=e.originalEvent;  mouseX=orig.changedTouches[0].pageX; mouseY=orig.changedTouches[0].pageY;}
    else {mouseX=e.pageX; mouseY=e.pageY;}

    var iCur=$movedRow.index();
    var hCur=$movedRow.css('height').slice(0,-2);
    var yCurOff=mouseY-hCur/2;

    var len=$el.children('div').length;

    var str='iCur:'+iCur+'m'+yCurOff; str+=' h'+hCur;
    if(iCur>0) {  //Check if previous is better
      var $tmp=$movedRow.prev();
      var yPrevOff=$tmp.offset().top;
      var hPrev=$tmp.css('height').slice(0,-2);
      str+=' p'+hPrev;
      if(mouseY<yPrevOff+hPrev/2) {
          //iPhone-bug-workaround (must remove event before element is detached from DOM-tree)
        //if(boTouch) $movedSpan.off('touchstart',myMousedown);   $tmp.before($movedRow);    if(boTouch) $movedSpan.on('touchstart',myMousedown);
        $tmp.before($movedRow);
      }
    }

    if(iCur<len-1) { //Check if next is better
      var $tmp=$movedRow.next();
      var yNextOff=$tmp.offset().top;
      var hNext=$tmp.css('height').slice(0,-2);
      str+=' n'+hNext;
      if(mouseY>yNextOff+hNext/2) {
        //if(boTouch) $movedSpan.off('touchstart',myMousedown);  $tmp.after($movedRow);  if(boTouch) $movedSpan.on('touchstart',myMousedown);
        $tmp.after($movedRow);
      }
    }

    //setMess(str);
    $movedRow.offset({ top: yCurOff, left: $movedRow.offset().left });
  };

  $el.myAdd=function(arrName,arrLabel){
    for(var i=0;i<arrName.length;i++){
      var $d=$('<span>').addClass('grabbable').append(arrLabel[i]).css({display:'inline-block',padding:'0.6em 0.7em',width:'150px',margin:'2px 0px','background':'#aaa'}); //cursor:'pointer',

      var $r=$('<div>').append($d);
      $r.attr({name:arrName[i]});
      $el.append($r);
      if(boTouch) $d.on('touchstart',myMousedown); else $d.on('mousedown',myMousedown);
    }
    $el.find('*').prop({UNSELECTABLE:"on"});
  }
  $el.getMovedRow=function(){return $movedRow;}

  $el.setUp=function(arrName,arrLabel){    $el.children('div').remove();    $el.myAdd(arrName,arrLabel);  }

  $el.myRemove=function(arrName){  for(var i=0;i<arrName.length;i++){ $el.children('[name='+arrName[i]+']').remove(); }  }
  //$el.myGet=function(){  var $d=$el.children('div');   var arrTmp=[];    $d.each(function(i){arrTmp[i]=Number($(this).attr("name"));}); return arrTmp;    }
  $el.myGet=function(arrO=[]){  var $d=$el.children('div');   arrO.length=0;    $d.each(function(i){arrO[i]=$(this).attr("name");}); return arrO;   }

  $el.addClass('unselectable');    $el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie
  var $movedRow,$movedSpan;
  if(boTouch){  var strMoveEv='touchmove', strEndEv='touchend'; }  else{   var strMoveEv='mousemove', strEndEv='mouseup';    }

  return $el;
}


var columnSorterDivExtend=function($el, oRole){
"use strict"
  $el.toString=function(){return 'columnSorterDiv'+oRole.charRoleUC;}
  $el.setUp=function(){
    arrLabel.length=0;  for(var i=0;i<oRole.ColsShow.length;i++){ arrLabel[i]=calcLabel(langHtml.label, oRole.ColsShow[i]);  }
    $dragSorter.setUp(oRole.ColsShow,arrLabel);
    $el.boLoaded=1;
  }

  $el.boLoaded=0;
  var $head=$('<h3>').append(langHtml.SortColumns);

  var $dragSorter=dragSorterExtend($('<div>')).css({margin:'1em auto',display:'inline-block', 'text-align':'left'});

  var tmpf=$dragSorter.myMouseup;
  $dragSorter.myMouseup=function(){
    tmpf();
    var $tmp=$dragSorter.getMovedRow(), ind=$tmp.index();
    oRole.ColsShow=$dragSorter.myGet(oRole.ColsShow);
    setItem('ColsShow'+oRole.charRoleUC, oRole.ColsShow);
    $TableDiv[oRole.ind].colMove($tmp.attr('name'),ind);

  }

  var arrLabel=[];
  var $divCont=$('<div>').addClass('contDiv').append($dragSorter);

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.SortColumns).addClass('footDivLabel').css({background:oRole.strColor})
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'center', display:"flex","flex-direction":"column"});
  return $el;
}


/*
 * tHeadLabel
 */

var tHeadLabelExtend=function($el, oRole){
"use strict"

  $el.setArrow=function(strName,dir){
    boAsc=dir==1;
    $sortImages.prop({src:uUnsorted});     var tmp=boAsc?uIncreasing:uDecreasing;  $r.children('th[name='+strName+']').children('img[data-type=sort]').prop({src:tmp});
  }

  var headerCanvas=[];
  for(var i=0;i<oRole.KeyCol.length;i++) {
    var strName=oRole.KeyCol[i];
    //var colText=''; if(strName in langHtml.label) colText=langHtml.label[strName];
    var colText=calcLabel(langHtml.label, strName);
    if(strName=='index') colText='';
    headerCanvas[strName]=makeTextCanvas(colText,-1);
  }

  $el.setUpCurrencyInfo=function(){
    var strCurrency='';      boMultCurrency=0;
    for (var i=0;i<oRole.MTab.length;i++) { var tmp=oRole.MTab[i].currency; if(strCurrency=='') {strCurrency=tmp;} else if(tmp!=strCurrency){boMultCurrency=1; strCurrency=''; break;} }
    var tmpCanvas=makeTextCanvas(strCurrency,-1);

    $currencyInfoDivs.each(function(i,el){
      var tmp=Object.create(tmpCanvas);
      var tmp=cloneCanvas(tmpCanvas);
      $(el).html(tmp);
    });
  };

  var thClick=function() {
    var $ele=$(this); strName=$ele.attr('name');
    boAsc=(thSorted===this)?!boAsc:true;  thSorted=this;
    $sortImages.prop({src:uUnsorted});     var tmp=boAsc?uIncreasing:uDecreasing;  $ele.children('img[data-type=sort]').prop({src:tmp});
    $TableDiv[oRole.ind].$tBody.detach();
    var $tr=$TableDiv[oRole.ind].$tBody.children('tr:lt('+oRole.MTab.length+')');
    var $tdNameSort =$tr.children('td[name='+strName+']');
    $tdNameSort.sortElements(function(aT, bT){
      var $a=$(aT), $b=$(bT), a = $a.data('valSort'),  b = $b.data('valSort'),   dire=boAsc?1:-1;
      var boAStr=0,boBStr=0;
      var aN=Number(a); if(!isNaN(aN) && a!=='') {a=aN;} else {a=a.toLowerCase(); boAStr=1;}
      var bN=Number(b); if(!isNaN(bN) && b!=='') {b=bN;} else {b=b.toLowerCase(); boBStr=1;}
      if(boAStr!=boBStr) return ((boAStr<boBStr)?-1:1)*dire;
      if(a==b) {return 0;} else return ((a<b)?-1:1)*dire;
    }, function(){ return this.parentNode;  });
    $TableDiv[oRole.ind].$table.append($TableDiv[oRole.ind].$tBody);

    //var $tdT=$tr.children('[name=index]'); $tdT.each(function(i){$(this).html(i);});
    $TableDiv[oRole.ind].setIndex();
    //$TableDiv[oRole.ind].sortTable(i);
  }

  $el.myCreate=function(){
    var ColsTmp=myCopy([],oRole.ColsShow);
    for(var j=0;j<oRole.Main.StrProp.length;j++){var strName=oRole.Main.StrProp[j]; if(oRole.ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }


    for(var i=0;i<ColsTmp.length;i++){
      var strName=ColsTmp[i], jtmp=oRole.colsFlip[strName];
      var canvas=headerCanvas[strName], $div=$('<div>').append(canvas);
      var $imgH=''; if(strName in oRole.helpBub) { var $imgH=$imgHelp.clone();   popupHoverJQ($imgH,oRole.helpBub[strName]); }
      var $imgSort=$('<img data-type=sort>');
      var $h=$("<th>").append($div,$imgH,$imgSort).addClass('unselectable').attr('name',strName);
      if(jtmp>0) $h.on('click', thClick).css({cursor:'pointer'});

      if(i>=oRole.ColsShow.length) $h.hide();
      $r.append($h);
    }

    var $th=$r.children('th');
    $sortImages=$th.children('img[data-type=sort]').prop({src:uUnsorted});
    $sortImages.css({display:'block',zoom:1.5,'margin':'auto','margin-top':'0.3em','margin-bottom':'0.3em'});
    var $hBut=$("<th>").append($butSel).css({'box-shadow':'0 0'});  $r.append($hBut);
  }
  var $r=$("<tr>"), boAsc=false, thSorted=null;

  var $butSel=$('<button>').append('+').addClass('fixWidth').prop('title',langHtml.AddRemoveColumns).on('click', function(){
    var i=oRole.ind;
    $ColumnSelectorDiv[i].setUp();
    $ColumnSelectorDiv[i].setVis();
    doHistPush({$view:$ColumnSelectorDiv[i]});
  });
  
  $el.append($r);
  var $sortImages=$([]);

  $el.myCreate();

  return $el;
}


thumbTeamExtend=function(el, oRole){  // Used in plugin
"use strict"
  var uRoleTeamImage=oRole==oC?uCustomerTeamImage:uSellerTeamImage;
  el.mySet=function(iMTab){
    var rT=oRole.MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam;
    if(data!=0) {
      $(el).show();
      var strTmp=uRoleTeamImage+data+'?v='+tag;
      $img.prop({src:strTmp});
      var url=rT.linkTeam;  if(url && url.length && !RegExp("^https?:\/\/","i").test(url)) { url='http://'+url; }      $(el).prop({href:url});
    }else $(el).hide();

  }
  var $img=$('<img>');    $(el).prop({target:"_blank"}).append($img);    return el;
}

complaintButtonExtend=function(el, oRole){
"use strict"
  el.mySet=function(iMTab){    var rT=oRole.MTab[iMTab]; idUser=rT.idUser;   $(el).html(rT.nComplaint);     }
  $(el).on('click', function(){
    $complaineeDiv.setUp(oRole, idUser); $complaineeDiv.load();
    $complaineeDiv.setVis();
    doHistPush({$view:$complaineeDiv});
  });
  var idUser;      return el;
}


/*
 * tableDiv
 */


var tableDivExtend=function($el, oRole){
"use strict"
  var {StrProp, StrGroup, StrGroupFirst}=oRole.Main;
  var {strRole}=oRole;
  $el.toString=function(){return 'tableDiv'+oRole.charRoleUC;}

  $el.setIndex=function(){ var $td=$tBody.children('tr').children('[name=index]'); $td.each(function(i){$(this).html(i);});}

  $el.setRowDisp=function(){
    var tmpshow='tr:lt('+oRole.nMTab+')';
    var tmphide='tr:gt('+(oRole.nMTab-1)+')'; if(oRole.nMTab==0) tmphide='tr';
    var $rShow=$tBody.find(tmpshow);
    $rShow.show();
    $tBody.find(tmphide).hide();
  }

  var arrCHide=[],arrHHide=[];
  var strCHide='', strHHide='';
  $el.colOrderRefresh=function(){
    var len=oRole.ColsShow.length;
    var $tr=$tBody.add($tHeadLabel).children('tr');
    for(var i=len-1;i>=0;i--) {
      var strName=oRole.ColsShow[i];
      var $tmp=$tr.children('[name='+strName+']');
      $tmp.each(function(){var $ele=$(this).show(); $ele.parent().prepend($ele);});  //
    }

    //var StrTmp=AMMinusB(StrProp,oRole.ColsShow);
    var StrTmp=StrProp.concat([]); AMMinusB(StrTmp, oRole.ColsShow);
    arrCHide.length=0; arrHHide.length=0;
    for(var i=0;i<StrTmp.length;i++) {
      arrCHide.push('td[name='+StrTmp[i]+']');
      arrHHide.push('th[name='+StrTmp[i]+']');
    }
    //strCHide.length=0;  strHHide.length=0;
    strCHide=arrCHide.join(',');   strHHide=arrHHide.join(',');
    $tBody.children('tr').find(strCHide).hide();
    $tHeadLabel.children('tr').find(strHHide).hide();
  }
  $el.colToggle=function(strName,boOn){
    $tHeadLabel.find('tr>th[name='+strName+']').toggle(boOn);
    $tBody.find('tr>td[name='+strName+']').toggle(boOn);
  }
  $el.colMove=function(strName,ind){
    var len=StrProp.length;
    var $movH=$tHeadLabel.find('tr>th[name='+strName+']');
    var $rH=$tHeadLabel.children('tr');
    //if(ind==len-1) $rH.append($movH);  else $rH.children('th:nth-child('+(ind+1)+')').before($movH);
    //if(ind==len-1) $rH.append($movH);  else $rH.children('th[name='+oRole.ColsShow[ind]+']').before($movH);
    if(ind==0) $rH.prepend($movH);  else $rH.children('th[name='+oRole.ColsShow[ind-1]+']').after($movH);

    var $movD=$tBody.find('tr>td[name='+strName+']');
    var $Tr=$tBody.children('tr');
    //var $Td=$tBody.find('tr>td:nth-child('+(ind+1)+')');
    if(ind==0) {
      $Tr.each(function(j){
        var $tr=$(this);  $tr.prepend($movD.eq(j));
      });
    }else{
      var $Td=$tBody.find('tr>td[name='+oRole.ColsShow[ind-1]+']');
      $Tr.each(function(j){
        var $tr=$(this);  $tr.children('td[name='+oRole.ColsShow[ind-1]+']').after($movD.eq(j));
      });
    }
  }


  $el.setCell=function(){
    var $tr=$tBody.children('tr');
    for(var i=0;i<oRole.nMTab;i++){
      var $r=$tr.eq(i); $r.data({iMTab:i});
      $r.children('td').each(function(j){
        var $ele=$(this), strName=$ele.attr('name'), tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        //var tmp=''; if(strName in $el.sortTabF) tmp=$el.sortTabF[strName](i,$ele);  else tmp=oRole.MTab[i][strName];     $ele.data('valSort',tmp);
        var tmp=''; if('sortTabF' in tmpObj) tmp=tmpObj.sortTabF(i,$ele);  else tmp=oRole.MTab[i][strName];     $ele.data('valSort',tmp);
        //var tmp=''; if(strName in $el.setTabF) tmp=$el.setTabF[strName](i,$ele);  else tmp=oRole.MTab[i][strName];
        var tmp=''; if('setTabF' in tmpObj) tmp=tmpObj.setTabF(i,$ele);  else tmp=oRole.MTab[i][strName];
        if(typeof tmp!='undefined') $ele.html(tmp);
      });
    }
    $el.setIndex();
  }

  $el.createTBody=function(){
    var ColsTmp=myCopy([],oRole.ColsShow);
    for(var j=0;j<StrProp.length;j++){var strName=StrProp[j]; if(oRole.ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }

    var $rows=$([]);
    for(var i=0;i<maxList;i++) {
      var $row=$('<tr>');
      if(!boTouch) $row.on('mouseover',function(){$(this).css({background:'lightgreen'});}).on('mouseout',function(){$(this).css({background:''});});
      for(var j=0;j<ColsTmp.length;j++){
        var strName=ColsTmp[j], tmpObj=(strName in oRole.Prop)?oRole.Prop[strName]:{};
        var $td=$('<td>').css({'max-width':'200px','max-height':'40px',overflow:'hidden'}).attr('name',strName);
        if('crTabF' in tmpObj) tmpObj.crTabF($td);
        if(j>=oRole.ColsShow.length) $td.hide();
        $row.append($td);  //,'word-break':'break-all'
      }
      $rows.push($row);
    }
    $tBody.append($rows);
    var tmp='td:not([name=tel],[name=displayEmail],[name=nComplaint])'; //,[name=link]
    $tBody.on('click',tmp,function(){
      var iMTab=$(this).parent().data('iMTab');
      var $roleInfoDiv=strRole=='customer'?$infoDivC:$infoDivS;
      $roleInfoDiv.setContainers(iMTab);
      $roleInfoDiv.setVis();
      doHistPush({$view:$roleInfoDiv});
    });
  }

  $el.getRow=function(iMTab){
    var $tmp=$tBody.children('tr:lt('+oRole.nMTab+')');
    $tmp=$tmp.filter(function(){return $(this).data('iMTab') == iMTab;});
    return $tmp;
  }
  $el.getMTabInd=function(idU){
    for(var i=0;i<oRole.nMTab;i++){
      if(oRole.MTab[i].idUser==idU) return i;
    }
    return NaN;
  }
  var indSortedLast=-1, strSortedLast=-1;

  $el.$toManyMess=$('<div>').html(langHtml.toManyMess).hide();

  var $table=$('<table>').css({background:'#fff', margin:'0em auto 0em'}); //display:'inline-table',
  var $tBody=$("<tbody>");

  $table.append($tBody);
  $table.show();
  $el.append($table,$el.$toManyMess);

  $el.$table=$table; $el.$tBody=$tBody;



  var $tHeadLabel=$el.$tHeadLabel=tHeadLabelExtend($('<thead>'), oRole).css({'text-align':'center'});
  $table.prepend($el.$tHeadLabel);


  var $divCont=$('<div>').addClass('contDiv').append($table,$el.$toManyMess);

      // divFoot
  var $buttonBack=$('<button>').on('click', doHistBack).append(strBackSymbol).addClass('fixWidth').css({'margin-left':'0.8em'}); //'font-size':'1em'

  var tmpf=function(){
    var i=oRole.ind;
    $ColumnSelectorDiv[i].setUp();
    $ColumnSelectorDiv[i].setVis();
    doHistPush({$view:$ColumnSelectorDiv[i]});
  };
  var $tmpImg=$('<img>').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $el.$buttShowSelect=$('<button>').append($tmpImg).addClass('fixWidth').css({'margin-left':'0.8em'}).on('click', tmpf).prop('title',langHtml.AddRemoveColumns);

  var $roleToggler=roleTogglerExtend($('<span>'), oRole, $TableDiv).css({'margin':'0 auto', padding:'0px', display:'flex'});
  
  $el.$filterButton=filterButtonExtend($('<button>')).css({'margin-left':'0.8em'});
  
  var $tmpImg=$('<img>').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var tmp='Table'; //+oRole.charRoleUC;
  var $span=$('<span>').append($tmpImg, langHtml[tmp]).addClass('footDivLabel').css({background:oRole.strColor});
  

  var $divFoot=$('<div>').append($buttonBack, $roleToggler, $el.$buttShowSelect, $el.$filterButton, $span).addClass('footDiv');
  //if(boIOS && boTouch) $roleToggler.after($el.$buttShowSelect);
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex", "flex-direction":"column"});
  return $el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * LoadTab-callbacks
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/



var firstAJAXCall=function(latLngFirst){
"use strict"
  clearTimeout(startPopTimer);  $startPop.closeFunc();
  //if(boVideo) pos=posDebug;
  if(boVideo) latLngFirst=latLngDebug;
  window.latLngFirstTmp=latLngFirst;
  var pC=merProj.fromLatLngToPoint(latLngFirst);

  var VPSizeT=[$mapDiv.width(),$mapDiv.height()];
  //if(boVideo) zoomT=14;

  var o1={pC:pC, VPSize:VPSizeT}, oFiltC=$filterDivC.$filterDivI.gatherFiltData(), oFiltS=$filterDivS.$filterDivI.gatherFiltData(), OFilt=[oFiltC, oFiltS];
  var vec=[['getSetting',['boShowTeam'],$adminDiv.setUp], ['setupById'], ['VSetPosCond',pC],
    ['setUpCond',{CharRole:'cs', OFilt:OFilt}],['setUp',o1,setUpRet],['getList',1,getListRet],['getGroupList',1,getGroupListRet],['getHist',1,getHistRet]];   majax(oAJAX,vec);
  setMess('',null,true);
}

//loadTabStart=function(boFlexZoom=0){
loadTabStart=function(boSetupById=0){
  ga('send', 'event', 'tab', 'loadTab');
  var o1=$mapDiv.getMapStatus(); // pC, zoom, VPSize
  //if(boFlexZoom) {o1.zoom=-1; }

  var oFiltC=$filterDivC.$filterDivI.gatherFiltData(), oFiltS=$filterDivS.$filterDivI.gatherFiltData(), OFilt=[oFiltC, oFiltS];
  var vec=[['setUpCond',{CharRole:'cs', OFilt:OFilt}],['setUp',o1,setUpRet],['getList',1,getListRet],['getGroupList',1,getGroupListRet],['getHist',1,getHistRet]];
  if(boSetupById){
    var arrRole=[]; if(userInfoFrDB.customer) arrRole.push('customer'); if(userInfoFrDB.seller) arrRole.push('seller');
    if(arrRole.length) vec.unshift(['setupById',{Role:arrRole}]);
  }
  majax(oAJAX,vec);

  setMess('',null,true);
}

var uploadPosNLoadTabStart=function(latLng, hideTimer, oRole){
"use strict"
  $mapDiv.setCentNMe(latLng);
  var o1=$mapDiv.getMapStatus(), {pC}=o1;
  
  var arrRole=[]; if(userInfoFrDB.customer) arrRole.push('customer'); if(userInfoFrDB.seller) arrRole.push('seller');
  
  var oFiltC=$filterDivC.$filterDivI.gatherFiltData(), oFiltS=$filterDivS.$filterDivI.gatherFiltData(), OFilt=[oFiltC, oFiltS];
  var vec=[['RUpdate',{hideTimer: hideTimer, charRole:oRole.charRole}], ['RShow', {x:pC.x, y:pC.y, charRole:oRole.charRole}],  // copySome(o1, oRole, ['charRole'])],
    ['setupById',{Role:arrRole}], ['setUpCond',{CharRole:'cs', OFilt:OFilt}],['setUp',o1,setUpRet],['getList',1,getListRet],['getGroupList',1,getGroupListRet],['getHist',1,getHistRet]];
  
  majax(oAJAX,vec);
  setMess('',null,true);
}




majax=function(oAJAX,vecIn){  // Each argument of vecIn is an array: [serverSideFunc, serverSideFuncArg, returnFunc]
"use strict"
  var makeRetF=function(vecT){ return function(data,textStatus,jqXHR){
      var dataArr=data.dataArr;  // Each argument of dataArr is an array, either [argument] or [altFuncArg,altFunc]
      delete data.dataArr;
      beRet(data,textStatus,jqXHR);
      for(var i=0;i<dataArr.length;i++){
        var r=dataArr[i];
        if(r.length==1) {var f=vecT[i][2]; if(f) f(r[0]);} else { window[r[1]].call(window,r[0]);   }
      }
    };
  }

  var oOut=$.extend(true, [], oAJAX);
  if('boFormData' in oAJAX && oAJAX.boFormData){
    var formData=vecIn[0][1]; vecIn[0][1]=0; // First element in vecIn contains the formData object. Rearrange it as "root object" and add the remainder to a property 'vec'
    var vecMod=$.extend(true, [], vecIn);
    for(var i=0; i<vecMod.length; i++){delete vecMod[i][2];}
    vecMod.push(['CSRFCode',CSRFCode]);
    oOut.data=formData; oOut.data.append('vec', JSON.stringify(vecMod));
  }else{
    var vecMod=$.extend(true, [], vecIn);
    for(var i=0; i<vecMod.length; i++){delete vecMod[i][2];}
    vecMod.push(['CSRFCode',CSRFCode]);
    oOut.data=JSON.stringify(vecMod);
  }
  $busyLarge.show();
  //if(oAJAX.crossDomain) tmp=o;
  oOut.success=makeRetF(vecIn);  return $.ajax(oOut);
}

var beRet=function(data,textStatus,jqXHR){
"use strict"
  if(typeof jqXHR!='undefined') var tmp=jqXHR.responseText;
  for(var key in data){
    window[key].call(this,data[key]);
  }
  $busyLarge.hide();
}


window.GRet=function(data){
"use strict"
  if('curTime' in data) curTime=data.curTime;
  if('strMessageText' in data) {var tmp=data.strMessageText.length?'<b>Server:</b> ':''; setMess(tmp+data.strMessageText,10);}
  if('CSRFCode' in data) CSRFCode=data.CSRFCode;
  if('sessionLoginIdP' in data) sessionLoginIdP=data.sessionLoginIdP;
  //var WBD=[]; tmp=data.boSpecialistWannaBe; if(typeof tmp!="undefined") {
  //    for(var key in tmp){   if(boSpecialistWannaBe[key]==tmp[key]) {delete tmp[key];} else {boSpecialistWannaBe[key]=tmp[key]; }  } $loginInfo.setStat(); WBD=tmp; }
  var tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }  if(tmp.customer) $quickDivC.setUp();  if(tmp.seller) $quickDivS.setUp(); }
  if('nCustomerReal' in data) window.nCustomerReal=data.nCustomerReal;
  if('nSellerReal' in data) window.nSellerReal=data.nSellerReal;


  toggleSpecialistButts();
  $loginInfo.setStat();

  //var boE=Boolean(userInfoFrDB.seller);

  if(boFirstLoadTab) {
    $frontDiv.setVis();
  }

  /*if(userInfoFrDB.seller){  //check for changes in the fineprint
    var tmp=$agreementStart.compareLocalDates(1);  if(!tmp.boFirst && tmp.boNew) { $agreementStart.setLocalDates(1); $agreementStart.openFunc(); }
  }  */
}


var errFunc=function(data){ resetMess(10);  }

var setUpRet=function(data){
  var zoomLevel;  if('zoom' in data) zoomLevel=data.zoom;
  if(boFirstLoadTab) {
    $mapDiv.set1(zoomLevel, latLngFirstTmp);
    var boRefresh=$mapDiv.setTile(zoomLevel);
  }
}
var getListRet=function(data){
  $frontDiv.$filterButton.setUp(data.NTotNFilt);

  for(var i=0;i<ORole.length;i++){
    $TableDiv[i].$filterButton.setUp(data.NTotNFilt);
    $FilterDiv[i].$filterInfoSpan.setRatio(data.NTotNFilt[i]);
    
    ORole[i].MTab=tabNStrCol2ArrObj(data.arrList[i]);
    ORole[i].nMTab=ORole[i].MTab.length;
  }
  
}
var getGroupListRet=function(data){
  var boGroupAny=0;
  for(var i=0;i<2;i++){
    var boGroupTmp=Boolean(data.arrGroup[i].tab.length);
    boGroupAny=boGroupAny||boGroupTmp;
    
    $TableDiv[i].$toManyMess.toggle(boGroupTmp);
    $TableDiv[i].$buttShowSelect.toggle(!boGroupTmp);
    $TableDiv[i].children('table').toggle(!boGroupTmp);
    if(boGroupTmp) {
      //ORole[i].MGroupTab=data.arrGroup[i];
      //ORole[i].MGroupTab=tabNStrCol2ArrObj(data.arrGroup[i]);
      ORole[i].MGroupTab=data.arrGroup[i].tab;
      
      $mapDiv[0].ArrMarker[i].hideMarkers();
      $mapDiv[0].ElImgGroupOverlay[i].setGroupOverlay(); $mapDiv[0].ElImgGroupOverlay[i].drawGroupOverlay();
      
    } else{
      $mapDiv[0].ArrMarker[i].setMarkers();  $mapDiv[0].ArrMarker[i].drawMarkers();
      $mapDiv[0].ElImgGroupOverlay[i].hideGroupOverlay();
      
      $TableDiv[i].$tHeadLabel.setUpCurrencyInfo();
      $TableDiv[i].setCell();

      $TableDiv[i].setRowDisp();
      $TableDiv[i].$tHeadLabel.setArrow('tPos',-1);
    }
  }
  var tmp=boGroupAny?('\n ('+langHtml.toManyMess+')'):'';
  $frontDiv.$tableButton.prop({disabled:boGroupAny, title:langHtml.ComparisonTable+tmp});  $frontDiv.$tableButton.children('img').css({opacity:boGroupAny?0.4:1});
  
  $mapDiv.drawMe();
  boFirstLoadTab=0;
}

var getHistRet=function(data){
"use strict"
  for(var i=0;i<ORole.length;i++) {
    $FilterDiv[i].$filterDivI.interpretHistPHP(data.arrHist[i])
    $FilterDiv[i].$filterDivI.update();
  }
};



var geoError=function(errObj) {
"use strict"
  var str='';
  var type='str';
  if(typeof errObj == 'string') str=errObj;
  else {
    if(errObj.code==errObj.PERMISSION_DENIED){
      type='PERMISSION_DENIED';
      str="geoLocation: PERMISSION_DENIED";
    }else if(errObj.code==errObj.POSITION_UNAVAILABLE){
      type='POSITION_UNAVAILABLE';
      str="getCurrentPosition failed: "+type+', '+'<b>'+errObj.message+'</b>';
    }else if(errObj.code==errObj.TIMEOUT){
      type='TIMEOUT';
      str="getCurrentPosition failed: "+type+', '+'<b>'+errObj.message+'</b>';
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
  $mapDiv.boGeoStatSucc=0;
}


var langSelectExtend=function($sel){
"use strict"
  var changeCB=function(){
    var str=$sel.val(), tmpA, url;
    var url=uSite+'?lang='+str;
    //boAndroid
    if(1)  window.location.assign(url); else setTimeout(function(){window.location.assign(url);},0.1);
  }
  for(var i=0;i<arrLang.length;i++){    var $opt=$("<option>").val(arrLang[i][0]).text(arrLang[i][0]);  $sel.append($opt);    }
  var tmp="option[value='"+strLang+"']";
  var $tmp=$sel.find(tmp);   if($tmp.length==1) $tmp.prop('selected', 'selected');
  $sel.change(changeCB);
  //$sel.css({'font-size':'0.8em','font-weight':'normal','text-align':'left',margin:'0em',position:'relative',top:'0.2em'});
  $sel.css({margin:'0em'});
  return $sel;
}



var uploadImageDivExtend=function($el){
  $el.toString=function(){return 'uploadImageDiv';}
  var progressHandlingFunction=function(e){      if(e.lengthComputable){   $progress.attr({value:e.loaded,max:e.total});      }      }
  var errorFunc=function(jqXHR, textStatus, errorThrown){
    setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
  }
  var oAJAXL={
    url: leafBE,
    type: 'POST',
    xhr: function() {  // Custom XMLHttpRequest
      var myXhr = $.ajaxSettings.xhr();
      if(myXhr.upload){   myXhr.upload.addEventListener('progress',progressHandlingFunction, false);   }
      return myXhr;
    },
    beforeSend: function(){$progress.visible();},
    success: function(){    $progress.attr({value:0});  $progress.invisible();     },
    error: function(){ $progress.invisible(); errorFunc.call(this,arguments);},//errorHandler=function(){setMess('error uploading',5);},
    //Options to tell jQuery not to process data or worry about content-type.
    cache: false,
    contentType: false,
    processData: false,
    headers:{'x-type':'single'}
  }
  oAJAXL.boFormData=1;

  var setMess=function(str) {$divMess.html(str);}
  var clearMess=function() {$divMess.html('');}
  var toggleVerified=function(boT){  boT=Boolean(boT);   $uploadButton.prop("disabled",!boT); }
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
    if(boFormDataOK==0) {alert("Your browser doesn't support FormData"); return; }
    var formData = new FormData();
    formData.append("type", 'single');
    formData.append("kind", strKind);
    formData.append("fileToUpload[]", objFile);

    majax(oAJAXL,[['uploadImage',formData,sendFunRet]]);
    setMess('Uploading ...');
    $uploadButton.prop("disabled",true);
  }
  var sendFunRet=function(data){
      if('strMessage' in data) setMess(data.strMessage); $progress.invisible(); $uploadButton.prop("disabled",false);
      callback();
  }
  $el.openFunc=function(strKindT, callbackT){
    strKind=strKindT; callback=callbackT; setMess('');  $inpFile.val('');
    doHistPush({$view:$uploadImageDiv});
    $el.setVis();
  };
  $el.setVis=function(){
    $el.show();
    return true;
  }
  var strKind='u', callback;
  //$el=popUpExtend($el);
  //$el.css({'max-width':'20em', padding: '0.3em 0.5em 1.2em 0.6em'});

  var $head=$('<h3>').append('Upload Image: ').css({'font-weight':'bold'});
  var $formFile=$('<form >'); //enctype="multipart/form-data"
  var $inpFile=$('<input type=file name=file id=file accept="image/*">').css({background:'lightgrey'});
  //var $inpUploadButton=$('<input type="button" value="Upload">');
  var $uploadButton=$('<button>').text('Upload').prop("disabled",true).css({'margin-right':'0.5em'});
  var $progress=$('<progress max=100, value=0>').css({'display':'block','margin-top':'1em'}).invisible();
  var $divMess=$('<div>').css({'margin-top':'1.2em', 'min-height':'1em'});

  var objFile;
  $inpFile.change(verifyFun).on('click', function(){$uploadButton.prop("disabled",true);});
  $formFile.append($inpFile);   $formFile.css({display:'inline'});


  var $closeButton=$('<button>').append('Close').on('click', doHistBack);
  var $menuBottom=$('<div>').append($closeButton, $uploadButton).css({'margin-top':'1.2em'});

  //$el.append($head, $formFile, $progress, $divMess,$menuBottom);

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($head, $formFile, $progress, $divMess,$menuBottom);
  $centerDiv.addClass("Center").css({'max-width':'21em', padding: '0.3em 0.5em 1.2em 0.6em'}); // , height:'15em'
  //if(boIE) $centerDiv.css({'width':'20em'});
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  $uploadButton.on('click', sendFun);
  $el.css({'text-align':'left'});
  return $el;
}


var teamDivExtend=function($el, oRole){
"use strict"
  var {strRole, charRoleUC}=oRole;
  $el.toString=function(){return 'teamDiv'+charRoleUC;}
  $el.setUp=function(boShow){
    $el.$id.val('');  $el.$link.val('');
    var vec=[['teamLoad',{strRole:strRole},disLoadRet]];   majax(oAJAX,vec);
    $el.boLoaded=1;
  }
  var disLoadRet=function(data){
    var idUser='', imTag=''
    var tmp=data.idUser;   if(typeof tmp==="undefined")  tmp=''; $el.$id.text(tmp); idUser=tmp;
    var tmp=data.imTag;   if(typeof tmp==="undefined")  tmp=''; imTag=tmp; $thumb.attr({src:uRoleTeamImage+idUser+'?v='+imTag});
    var tmp=data.link;   if(typeof tmp==="undefined")  tmp=''; $el.$link.val(tmp);
    var tmp=data.tab;  if(typeof tmp==='undefined') tmp=[]; $el.tab=tmp;
    $el.$divList.empty();
    //if($el.tab.length==0) return;
    for(var i=0; i<$el.tab.length; i++) {
      var $id=$('<span>').append($el.tab[i][1],' ',$el.tab[i][2],' ',$el.tab[i][3]);
      var $cb=$('<input type=checkbox>').on('click', save);
      //if(Number($el.tab[i][4])) $cb.attr('checked','checked');
      var boTmp=Boolean(Number($el.tab[i][4])); $cb.attr('checked',boTmp);
      var $row=$('<div>').append($cb,' ',$id);
      $el.$divList.append($row);
    }

    //resetMess(10);
  };
  var save=function(){
    var $cb=$(this), $span=$cb.parent(), i=$span.index(), idUser=$el.tab[i][0];
    var vec=[['teamSave',{idUser:idUser,boOn:this.checked}]];   majax(oAJAX,vec);
  }
  var saveName=function(){
    var link=$el.$link.val().trim();
    var vec=[['teamSaveName',{link:link}]];   majax(oAJAX,vec);
  }
  var calcTeamImageUrl=function(){
    var idUser=userInfoFrDB[strRole+'Team'].idUser, tag=userInfoFrDB[strRole+'Team'].imTag;  return uRoleTeamImage+idUser+'?v='+tag;
  }
  var uRoleTeamImage=strRole=='customer'?uCustomerTeamImage:uSellerTeamImage;
  $el.boLoaded=0;
  $el.$id=$('<span>').css({'font-weight':'bold'});
  $el.$link=$('<input>').attr({type:'text',size:10}).on('keypress', function(e){ if(e.which==13) {saveName();return false;}} )
  //$el.$file=$('<input>').attr({type:'file'});
  var $thumb=$('<img>').css({'vertical-align':'middle'});
  var uploadCallback=function(){
    userInfoFrDB[strRole+'Team'].imTag=randomHash(); $thumb.attr({src:calcTeamImageUrl()});
    //var tmpF=function(){$thumb.attr({src:calcTeamImageUrl()});};    var vec=[ ['setupById',{Role:'team'},tmpF]];   majax(oAJAX,vec);
  }
  var $buttUploadImage=$('<button>').html('Upload image').on('click', function(){$uploadImageDiv.openFunc(oRole.charRole, uploadCallback);});
  var $buttSaveName=$('<button>').html('Save link').on('click', saveName);
  $el.$divList=$('<div>');

  var $hId=$('<div>').html('Inform the team members of this number, they should enter it in their repective settings tab.');
  var $hLink=$('<div>').html('A link to any other site of yours.');
  var $hList=$('<div>').html('A list of userss who wants to belong to your team. Mark those who you approve.');

  var $hImg0=$imgHelp.clone(), $hImg1=$imgHelp.clone(), $hImg2=$imgHelp.clone(); $hImg0.add($hImg1).add($hImg2).css({'margin-left':'1em'});
  popupHoverJQ($hImg0,$hId);   popupHoverJQ($hImg1,$hLink);   popupHoverJQ($hImg2,$hList);


  var $divCont=$('<div>').addClass('contDiv').append('Team-Id: ',$el.$id,',',$hImg0,'<br>',
          'Thumb image: ',$thumb,' ',$buttUploadImage,' &nbsp;&nbsp;(will be shrunk to fit a 50 x 50 pixel square)<br>',
          'Link: (optional)',$el.$link,' &nbsp;',$buttSaveName,$hImg1,'<hr>','<b>List of users</b>',$hImg2,$el.$divList);
  //$el.append('Link: ',$el.$link,$buttSaveName,'<br>',$a,'<hr>',$el.$divList);
  //$el.append('Name: ',$el.$name,'<br>Link: ',$el.$link,'<br>',$buttSaveName,'<hr>',$el.$divList);


      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Team settings').addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


var settingDivWExtend=function($el){
"use strict"
  $el.toString=function(){return 'settingDivW';}
  

  var $buttShowMarkSelectC=$('<button id=buttShowMarkSelectC>').append(langHtml.ChangeMapMarkersC).on('click', function(){
    var $tmp=$markSelectorDivC; $tmp.setUp(); $tmp.setVis();doHistPush({$view:$tmp});
  });
  var $buttShowMarkSelectS=$('<button id=buttShowMarkSelectS>').append(langHtml.ChangeMapMarkersS).on('click', function(){
    var $tmp=$markSelectorDivS; $tmp.setUp(); $tmp.setVis();doHistPush({$view:$tmp});
  });
  


    // userDiv
  $el.$userDiv=$('<div>');
  $el.$userDiv.$customerSettingButton=$('<button>').append(langHtml.CustomerSettings).on('click',function(){
    $settingDivC.setVis(); doHistPush({$view:$settingDivC});
  });
  $el.$userDiv.$sellerSettingButton=$('<button>').append(langHtml.SellerSettings).on('click',function(){
    $settingDivS.setVis(); doHistPush({$view:$settingDivS});
  });
  var $complainerButton=$('<button>').append('Complaints from me').on('click',function(){
    var userT=userInfoFrDB.user, objT={idComplainer:userT.idUser}; copySome(objT, userT, ['image', 'displayName']);
    $complainerDiv.setUp(objT);
    //$complainerDiv.setUp(userInfoFrDB.user);
    $complainerDiv.load();
    $complainerDiv.setVis(); doHistPush({$view:$complainerDiv});
  });
  var $butts=$([]).push($userSettingButton, $el.$userDiv.$customerSettingButton, $el.$userDiv.$sellerSettingButton, '<br>', $complainerButton).css({margin:'1em 0.1em'});
  var $h=$('<p>').append("Settings for logged in user").css({'font-weight':'bold'});
  $el.$userDiv.append($h,$butts);
  $el.$userDiv.css({'background':'#ccc', 'border':'solid 1px', 'padding':'0.2em 0', 'margin':'1em 0.6em 1em 0.6em'});
  
  
  $el.$customerTeamButton=$("<button>").css({display:'block'}).append('Customer team settings').on('click', function(){
    $teamDivC.setUp(); $teamDivC.setVis(); doHistPush({$view:$teamDivC});
  });
  $el.$sellerTeamButton=$("<button>").css({display:'block'}).append('Seller team settings').on('click', function(){
    $teamDivS.setUp(); $teamDivS.setVis(); doHistPush({$view:$teamDivS});
  });
  
  var $opt=$([]).push($buttShowMarkSelectC, $buttShowMarkSelectS, $el.$userDiv, $adminButton, $el.$customerTeamButton, $el.$sellerTeamButton);  //, $pMapType
  $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
  
  $buttShowMarkSelectC.add($el.$userDiv.$customerSettingButton).add($el.$customerTeamButton).css({background:oC.strColor})
  $buttShowMarkSelectS.add($el.$userDiv.$sellerSettingButton).add($el.$sellerTeamButton).css({background:oS.strColor})

  $el.$divCont=$('<div>').addClass('contDiv').append($opt);

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $tmpImg=$('<img>').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var $span=$('<span>').append($tmpImg, langHtml.Settings).addClass('footDivLabel');
  var $divFoot=$('<div>').append($buttonBack,$span).addClass('footDiv');
  
  $el.append($el.$divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}

  
var entryDivExtend=function($el, oRole){
"use strict"
  var {strRole, charRoleUC}=oRole;
  $el.toString=function(){return 'entryDiv'+charRoleUC;}
  $el.setUp=function(){
    var nTmp=strRole=='customer'?nCustomerReal:nSellerReal;
    var nNext=nSellerReal+1; //if(nNext==13) nNext=14;
    var ending=makeOrdinalEndingEn(nNext);
    $nNext.html(nNext); //+ending
  }
  var $headOrdinal=$('<span>').append(langHtml['headOrdinal'+charRoleUC]).css({'font-weight':'bold'});
  var $labOrdinal=$('<span>').append(langHtml['labOrdinal'+charRoleUC]), $nNext=$labOrdinal.children(':nth-child(1)').css({'font-weight':'bold'});
  var $labOrdinalB=$('<div>').append(langHtml['labOrdinalB'+charRoleUC]);
  var $divOrdinal=$('<div>').append($headOrdinal, ' ', $labOrdinal).css({border:'solid green 2px', padding:'0.3em'});  //, $labOrdinalB
  //var func=function(){}; if(!boDbg) func=function(){trackConv(949679695,"wCpMCPHKhQUQz-zrxAM");}

  var specialRequstF=function(){
    var now=Date.now(); if(timeSpecialR+1000*10<now) {timeSpecialR=now; nSpecialReq=1;} else nSpecialReq++;
    if(nSpecialReq==3) { $buttLoginTeam.show();    }
  }
  var timeSpecialR=0, nSpecialReq=0;

  var $infoLinkSeller=$('<a>').prop({href:uWiki+'/'+'New_User',target:"_blank"}).append(langHtml.gettingStartedLink);
  var $aTOS=$('<a>').prop({href:uWiki+'/'+'ToS',target:"_blank"}).append('Terms of service');
  //var $pSeeAlso=$('<p>').append(langHtml.SeeAlso,': ',$aTOS);
  var $pSeeAlso=$('<p>').append($aTOS);


  var $buttLoginTeam=$("<button>").append(langHtml.SignInAs+' ('+langHtml.TeamAdmin+')').css({display:'block'}).on('click', function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'teamFun', strRole:strRole, caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;

      history.fastBack($frontDiv);

    })(); flow.next();
    return false;
  }).hide();


  if(document.domain.substr(0,4)=='demo') $buttLoginSeller.hide();

  var $pWiki=$('<div>').append($pSeeAlso);

  var $loginSelectorDiv=loginSelectorDivExtend($('<div>'), oRole);
  

  //var $hovWhyIsFBNeeded=$hovHelp.clone().text(langHtml.WhyIsFBNeededQ).css({margin:'1em 0 0 0', display:'block', 'vertical-align':'middle'}),  $bub=$('<div>').html(langHtml.WhyIsFBNeededA);     popupHoverJQ(//$hovWhyIsFBNeeded,$bub,15000);
  //var $NothingIsWrittenToYourFBFlow=$('<div>').append(langHtml.NothingIsWrittenToYourFBFlow);
  //var $YouCanUseCustomImage=$('<div>').append(langHtml.YouCanUseCustomImage);
  var $NoteYouCanDeleteYourAccount=$('<div>').append(langHtml.NoteYouCanDeleteYourAccount);
  //var $FBToPreventMultipleAccounts=$('<div>').append(langHtml.FBToPreventMultipleAccounts);
  //var $aPrivacyPolicy=$('<a>').prop({href:'https://closeby.market/Privacy_policy_2016-Oct-12'}).append("Privacy policy 2016-Oct-12");
  //var $aDisclaimer=$('<a>').prop({href:'https://closeby.market/Disclaimer_2016-Oct-12'}).append("Disclaimer 2016-Oct-12").css({display:'block'});
  var $aMoreAboutWhyAnIdPIsUsed=$('<a>').prop({href:'https://closeby.market/WhyIsAnIdPUsed'}).append(langHtml.MoreAboutWhyAnIdPIsUsed).css({display:'block'});

  //var $opt=$([]).push($pWiki, $langSpan, $buttLoginSeller, $buttLoginTeam, $teamApprovedMess);
  
  $el.$teamApprovedMess=$("<div>").css({display:'block'}).append('Team/brand not approved, Contact '+domainName+' to become approved.');
  var $rows=$([]).push($divOrdinal, $loginSelectorDiv, $pWiki, $buttLoginTeam, $el.$teamApprovedMess);  // , $NoteYouCanDeleteYourAccount  $FBToPreventMultipleAccounts, $NothingIsWrittenToYourFBFlow, $YouCanUseCustomImage, , $langSpan, $NoteYouCanDeleteYourAccount
  var $topDivA=$('<div>').append($iframeLike).css({'margin-top':'1em',overflow:'hidden'});  //$buttonBack,  , $aMoreAboutWhyAnIdPIsUsed
  $rows.css({'margin':'1em 0em 1em 0.6em'});
  var $divCont=$('<div>').addClass('contDiv').append($topDivA,$rows);

      // divFoot
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').on('click', doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $divFoot=$('<div>').append($buttonBack).addClass('footDiv');
  
  $el.append($divCont, $divFoot);

  $el.css({'text-align':'left', display:"flex","flex-direction":"column"});
  return $el;
}


/********************************************************************************************************************
 ********************************************************************************************************************/



setUp1=function(){

  elHtml=document.documentElement;  elBody=document.body
  $body=$('body');  $html=$('html');
  $bodyNHtml=$body.add($html);
  //$bodyNHtml=$body;
  //$bodyNHtml=$([]);
  $bodyNHtml.css({height:'100%'});
  $body.css({margin:0, padding:0});
  
  $document=$(document);
  $window=$(window);

  browser=getBrowser();
  boTouch = Boolean('ontouchstart' in document.documentElement);  //boTouch=1;

  var ua=navigator.userAgent, uaLC = ua.toLowerCase(); //alert(ua);
  boAndroid = uaLC.indexOf("android") > -1;
  boFF = uaLC.indexOf("firefox") > -1;
  //boIE = uaLC.indexOf("msie") > -1;
  versionIE=detectIE();
  boIE=versionIE>0; if(boIE) browser.brand='msie';

  boChrome= /chrome/i.test(uaLC);
  boIOS= /iPhone|iPad|iPod/i.test(uaLC);
  boEpiphany=/epiphany/.test(uaLC);    if(boEpiphany && !boAndroid) boTouch=false;  // Ugly workaround
  boUCBrowser = 0;

  boOpera=RegExp('OPR\\/').test(ua); if(boOpera) boChrome=false; //alert(ua);

  boReallySmall=0;
  if(boTouch){
    if(boIOS) {
      dr=window.devicePixelRatio;
      sc=1/dr;
      if(dr>=2) {
        sc=1;
      }
      //alert(dr);
      //$('#viewportMy').prop('content','initial-scale='+sc);
      //$bodyNHtml.css({"overflow-x":"hidden"});
      $bodyNHtml.css({"-webkit-overflow-scrolling":"touch", "overflow":"hidden" });  // "height":"100%", "-webkit-overflow-scrolling":"touch"
      $bodyNHtml.css({height:'100%', overflow:'hidden'});
      

    } else if(boFF){
      dr=window.devicePixelRatio;
      sc=1/dr;
      //sc=4;
      var h=screen.height, w=screen.width;
    }
    else {
      sc=1;
      //var h=screen.height, w=screen.width;
      var h=window.innerHeight, w=window.innerWidth;
      //alert(window.devicePixelRatio+' '+ screen.height+' '+screen.width);
      if(boTouch && h*w>230400) $body.css({'font-size':'120%'}); // between 320*480=153600 and 480*640=307200
      if(boTouch && h*w<115200) {boReallySmall=1; $body.css({'font-size':'85%'}); } // between 240*320=76800 and 320*480=153600
      //$('#viewportMy').prop('content','initial-scale='+sc);
    }
    //if(boIOS) {  dr=window.devicePixelRatio;  sc=1/dr;} else {  sc=1; }
  }

  dr=window.devicePixelRatio; // dr=Math.round(dr); //dr=2; //alert(dr);  //Settings text: "Use hardware resolution for the map"
  drLev=log2(dr);
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

  if(boIOS  || boIE) strBackSymbol='◄'; else strBackSymbol='◀';

  WCMIN=0; WCMAX=256; WCMID=WCMAX/2;
  TILESIZE=256/dr; TILESIZEHALF=TILESIZE/2;

  //uMapSourceDir='http://otile1.mqcdn.com/tiles/1.0.0/map';
  uMapSourceDir='http://c.tile.openstreetmap.org';


  var boHistoryOK=1, tmp='';
  if(!('pushState' in history)) { boHistoryOK=0; }
  if(!('state' in history)) { boHistoryOK=0; tmp=".state"; }
  if(!boHistoryOK) {tmp="This browser doesn't support the history"+tmp+" object, and this is really killing me.... aaahhhhhggggg....";  alert(tmp); return;}

  if(!navigator.geolocation) { alert('This browers does not support geolocation '); return;}

  boFormDataOK=1;  if(typeof FormData=='undefined') {  boFormDataOK=0;  }

  if(!(typeof sessionStorage=='object' && sessionStorage.getItem)) {alert("Your browser doesn't support sessionStorage"); return;}

  //boTouch=true;

  //if(boVideo) boTouch=true;

  assignSiteSpecific();
  console.log('boDbg='+boDbg);



  ORole=site.ORole;
  [oC,oS]=site.ORole;



  var objLong={fb:'Facebook',google:"Google",idplace:"idPlace"};
  strIPPrimLong=objLong[strIPPrim];
  strIPAltLong=objLong[strIPAlt];


  var Match=RegExp("^[^/]+").exec(wwwSite);    domainName=Match[0];

  strScheme='http'+(boTLS?'s':'');    strSchemeLong=strScheme+'://';    uSite=strSchemeLong+wwwSite;     uCommon=strSchemeLong+wwwCommon;    uBE=uSite+"/"+leafBE;
  uCanonical=uSite;

  uConversion=uSite+'/conversion.html';
  //uTeamImage=uSite+'/image/t';
  //uSellerImage=uSite+'/image/s';
  uUserImage=uSite+'/image/u';
  uCustomerTeamImage=uSite+'/image/c';
  uSellerTeamImage=uSite+'/image/s';


  wseImageFolder='/'+flImageFolder+'/';
  uImageFolder=uCommon+wseImageFolder;
  uSleepy=uImageFolder+'sleepy.png';
  uDummy=uImageFolder+'dummy.png';

  uHelpFile=uImageFolder+'help.png';
  uVipp0=uImageFolder+'vipp0.png';
  uVipp1=uImageFolder+'vipp1.png';
  uFb22=uImageFolder+'fb22.png';
  uGoogle22=uImageFolder+'google22.jpg';
  uIdplace22=uImageFolder+'idPlaceOrg64Login.png';
  uFb=uImageFolder+'fb68.png';
  uGoogle=uImageFolder+'google69.jpg';
  uIdplace=uImageFolder+'idPlaceOrg64Login.png';
  uIncreasing=uImageFolder+'increasingFlip.png';
  uDecreasing=uImageFolder+'decreasingFlip.png';
  uUnsorted=uImageFolder+'unsortedFlip.png';
  uBusy=uImageFolder+'busy.gif';
  uBusyLarge=uImageFolder+'busyLarge.gif';
  uList16=uImageFolder+'list16.png';
  uSetting1=uImageFolder+'setting1.png';
  uFilter=uImageFolder+'filter.png';
  uEqualizer=uImageFolder+'equalizer.png';
  uMapm1=uImageFolder+'mapm1.png';
  uMapm2=uImageFolder+'mapm2.png';
  uColumn16=uImageFolder+'column16.png';
  uMyMarker=uImageFolder+'myMarker.gif';
  uOnePixTransparent=uImageFolder+'dummy.png';
  //uTogButPinkBlue=uImageFolder+'toggleButtonVerticalPinkBlueBlack.png';
  uTogVertical=uImageFolder+'toggleButtonVerticalBlack.png';
  uWheel3Sprite=uImageFolder+'wheel3Sprite.png';



  uWiki='https://closeby.market';

  //uMapSourceDir='http://otile1.mqcdn.com/tiles/1.0.0/map';
  uMapSourceDir='https://c.tile.openstreetmap.org';


  var oVersion=getItem('version');      if(version!==oVersion) boNewVersion=1; else boNewVersion=0;        setItem('version',version);




  langClientFunc();


  PlugIn=[];
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

  //langHtml.label.histActive=langHtml.label.histActive.replace(/<span><\/span>/,lenHistActive);
  //langHtml.helpBub.histActive=langHtml.helpBub.histActive.replace(/<span><\/span>/,lenHistActive);



  var regNom=new RegExp("<span nom=\"([^\"]+)\">.*?</span>",'g');
  var nomFunc=function(m,n){return langHtml[n]};
  //var nomFunc=function(m,n){return "<span nom="+n+">"+langHtml[n]+"</span>"};
  replaceNom=function(parent,strName){
    parent[strName]=parent[strName].replace(regNom,nomFunc);
  }
  replaceNom(langHtml.label,'standingByMethod');


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
  replaceNom(langHtml,'SeeUnActivePopMess');
  replaceNom(langHtml,'writeComplaintPopup');
  replaceNom(langHtml,'introHead');
  replaceNom(langHtml,'LoginSingInAsSeller');
  
  replaceNom(langHtml,'FilterC');
  replaceNom(langHtml,'FilterS');
  replaceNom(langHtml,'TableC');
  replaceNom(langHtml,'TableS');
  
  //replaceNom(langHtml,'DummiesShowingMess');
  //replaceNom(langHtml,'noteLoginSeller');


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
    $.extend(oRole, {colOneMark:colOneMark, ColsShow:ColsShow});
  }

  boMultCurrency=0;


  sessionLoginIdP={};
  userInfoFrDB=$.extend({}, specialistDefault);

  CSRFCode='';

  curTime=0;


  currencies=[['UAE Dirham','Afghani','Lek','Armenian Dram','Netherlands Antillean Guilder','Kwanza','Argentine Peso','Australian Dollar','Aruban Florin','Azerbaijanian Manat','Convertible Mark','Barbados Dollar','Taka','Bulgarian Lev','Bahraini Dinar','Burundi Franc','Bermudian Dollar','Brunei Dollar','Boliviano','Mvdol','Brazilian Real','Bahamian Dollar','Ngultrum','Pula','Belarussian Ruble','Belize Dollar','Canadian Dollar','Congolese Franc','WIR Euro','Swiss Franc','WIR Franc','Unidades de fomento','Chilean Peso','Yuan Renminbi','Colombian Peso','Unidad de Valor Real','Costa Rican Colon','Peso Convertible','Cuban Peso','Cape Verde Escudo','Czech Koruna','Djibouti Franc','Danish Krone','Dominican Peso','Algerian Dinar','Egyptian Pound','Nakfa','Ethiopian Birr','Euro','Fiji Dollar','Falkland Islands Pound','Pound Sterling','Lari','Ghana Cedi','Gibraltar Pound','Dalasi','Guinea Franc','Quetzal','Guyana Dollar','Hong Kong Dollar','Lempira','Croatian Kuna','Gourde','Forint','Rupiah','New Israeli Sheqel','Indian Rupee','Iraqi Dinar','Iranian Rial','Iceland Krona','Jamaican Dollar','Jordanian Dinar','Yen','Kenyan Shilling','Som','Riel','Comoro Franc','North Korean Won','Won','Kuwaiti Dinar','Cayman Islands Dollar','Tenge','Kip','Lebanese Pound','Sri Lanka Rupee','Liberian Dollar','Loti','Lithuanian Litas','Latvian Lats','Libyan Dinar','Moroccan Dirham','Moldovan Leu','Malagasy Ariary','Denar','Kyat','Tugrik','Pataca','Ouguiya','Mauritius Rupee','Rufiyaa','Kwacha','Mexican Peso','Malaysian Ringgit','Mozambique Metical','Namibia Dollar','Naira','Cordoba Oro','Norwegian Krone','Nepalese Rupee','New Zealand Dollar','Rial Omani','Balboa','Nuevo Sol','Kina','Philippine Peso','Pakistan Rupee','Zloty','Guarani','Qatari Rial','New Romanian Leu','Serbian Dinar','Russian Ruble','Rwanda Franc','Saudi Riyal','Solomon Islands Dollar','Seychelles Rupee','Sudanese Pound','Swedish Krona','Singapore Dollar','Saint Helena Pound','Leone','Somali Shilling','Surinam Dollar','South Sudanese Pound','Dobra','El Salvador Colon','Syrian Pound','Lilangeni','Baht','Somoni','Turkmenistan New Manat','Tunisian Dinar','Pa´anga','Turkish Lira','Trinidad and Tobago Dollar','New Taiwan Dollar','Tanzanian Shilling','Hryvnia','Uganda Shilling','US Dollar','Peso Uruguayo','Uzbekistan Sum','Bolivar Fuerte','Dong','Vatu','Tala','CFA Franc BEAC','East Caribbean Dollar','CFA Franc BCEAO','CFP Franc','Yemeni Rial','Rand','Zambian Kwacha','Zimbabwe Dollar',],
  ['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BOV','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHE','CHF','CHW','CLF','CLP','CNY','COP','COU','CRC','CUC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','FKP','GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LTL','LVL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','SSP','STD','SVC','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VEF','VND','VUV','WST','XAF','XCD','XOF','XPF','YER','ZAR','ZMK','ZWL',],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,3,2,0,2,3,0,2,2,2,0,2,0,3,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,0,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,0,0,2,0,2,0,0,2,2,2,2,]
  ];


  //colMenuOn='lightgreen'; colMenuOff='#ddd';
  colMenuOn='#aaa'; colMenuOff='#ddd';
  colMenuBOn='#616161'; colMenuBOff='#aaa';




  $imgBusy=$('<img>').prop({src:uBusy});
  //$messageText=messExtend($("<span>"));  window.setMess=$messageText.setMess;  window.resetMess=$messageText.resetMess;  window.appendMess=$messageText.appendMess;  $body.append($messageText);
  spanMessageText=new TypeSpanMessageText();  window.setMess=spanMessageText.setMess;  window.resetMess=spanMessageText.resetMess;  window.appendMess=spanMessageText.appendMess;  $body.append($(spanMessageText))

  $busyLarge=$('<img>').prop({src:uBusyLarge}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
  $body.append($busyLarge);


  merProj = new MercatorProjection();

  var tmp=getItem('boFirstVisit');     if(tmp===null) boFirstVisit=1; else boFirstVisit=0;      setItem('boFirstVisit',0);

  $imgHelp=$('<img>').prop({src:uHelpFile}).css({'vertical-align':'-0.4em', 'margin-left':'0.6em'});
  $hovHelp=$('<span>').text('?').css({'font-size':'88%',color:'#a7a7a7','vertical-align':'-0.4em'}); //on('click', function(){return false;})    //'pointer-events':'none',

  for(var i=0;i<ORole.length;i++){
    ORole[i].KeyCol=Object.keys(ORole[i].Prop);
    let nCol=ORole[i].KeyCol.length;
    ORole[i].colsFlip=array_flip(ORole[i].KeyCol);
    ORole[i].helpBub={};
    for(var j=0;j<nCol;j++){
      var strName=ORole[i].KeyCol[j], text='';
      if(strName in langHtml.helpBub)  text=langHtml.helpBub[strName];
      if(text!='') { ORole[i].helpBub[strName]=$('<div>').html(text); }
    }
    ORole[i].Label=$.extend({},langHtml.label);
  }
  
  $H1=$('h1:eq(0)').detach();
  $H1.css({background:'#ff0', "box-sizing":"border-box", border:'solid 1px',color:'black','font-size':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.4em 0em 0.4em 0em',margin:'0em auto', 'max-width':'800px', width:'100%'});
  //$H1.css({'border-top':'1px solid black'});



  $body.css({padding:'0 0 0 0'});
  $body.css({margin:'0 0 0 0'});


  strHistTitle=wwwSite;
  histList=[];
  stateLoaded=history.state;
  var tmpi=stateLoaded?stateLoaded.ind:0;    stateLoadedNew={hash:randomHash(), ind:tmpi};
  history.replaceState(stateLoadedNew,'',uCanonical);
  stateTrans=stateLoadedNew;
  history.StateMy=[];
  //alert("reExecute");
  //iPop=0;
  $poporder=$('<div>').html('poporder'); $iLoad=$('<div>').html('iLoad'); $iPopstate=$('<div>').html('iPopstate'); $stateMyT=$('<div>').html('stateMyT'); $indT=$('<div>').html('indT'); $dirT=$('<div>').html('dirT');
  $butClearCounter=$('<button>').append('ClearCounter').on('click', function(){
    setItem('iLoad', 0);  setItem('iPopstate', 0);  setItem('iPagehide', 0);  setItem('iBeforeunload', 0);
    $iLoad.html('iLoad:'); $iPopstate.html('iPopstate:'); $poporder.html('poporder:');
  });
  $aNext=$('<a>').prop({href:'http://192.168.0.5:5000/transport/lib/image/help.png'}).append('next');
  $divDbg=$('<div>').append($iLoad,$iPopstate,$poporder, $butClearCounter, $aNext, $stateMyT, $indT, $dirT).css({flex:'0 0 0'});
  boDbgL=0;
  window.addEventListener('popstate', function(event) {
    var iPopstate=getItem('iPopstate'); setItem('iPopstate', iPopstate+1);
    $iPopstate.append(iPopstate+',');
    $poporder.append('pop'+iPopstate+',');
    $stateMyT.html(Object.keys(history.StateMy));
    $indT.append('<font style="color:red">'+stateTrans.ind+'</font>'+history.state.ind+', ');

    var dir=history.state.ind-stateTrans.ind;
    //if(Math.abs(dir)>1) {alert('dir='+dir); debugger;}
    $dirT.append(dir+',');
    //$body.append(' iPop'+(++iPop));
    //console.log("stateTrans.ind: "+stateTrans.ind+", history.state.ind: "+history.state.ind);
    var boSameHash=history.state.hash==stateTrans.hash; //alert("Error: typeof stateTrans: "+Object.keys(stateTrans));
    if(boSameHash){
      var tmpObj=history.state;
      if('boResetHashCurrent' in history && history.boResetHashCurrent) {
        tmpObj.hash=randomHash();
        history.replaceState(tmpObj,'',uCanonical);
        history.boResetHashCurrent=false;
      }

      //var strName=tmpObj.strName, $obj=window['$'+strName];
      //$obj.setVis();       $body.scrollTop(tmpObj.scroll);

      var stateMy=history.StateMy[history.state.ind];
      if(typeof stateMy!='object' ) {

        //var tmpStr=window.location.href +" Error: typeof stateMy: "+(typeof stateMy)+', history.state.ind:'+history.state.ind+', history.StateMy.length:'+history.StateMy.length+', Object.keys(history.StateMy):'+Object.keys(history.StateMy);
        //if(!boEpiphany) alert(tmpStr); else  console.log(tmpStr);
        //debugger;
        return;
      }
      var $view=stateMy.$view;
      $view.setVis();
      if(typeof $view.getScroll=='function') {
        var scrollT=$view.getScroll();
        setTimeout(function(){$window.scrollTop(scrollT);},1);
      } else {
        //var scrollT=stateMy.scroll;  setTimeout(function(){  $window.scrollTop(scrollT);},1);
      }


      if('funOverRule' in history && history.funOverRule) {history.funOverRule(); history.funOverRule=null;}
      else{
        if('fun' in stateMy && stateMy.fun) {var fun=stateMy.fun(stateMy); }
      }

      stateTrans=$.extend({},tmpObj);
    }else{
      //$body.append('≠');
      stateTrans=history.state; $.extend(stateTrans,{hash:randomHash()}); history.replaceState(stateTrans,'',uCanonical);
      history.go(sign(dir));
    }
  });
  if(boFF){
    window.addEventListener('beforeunload', function(){   });
  }
  //$(window).bind('beforeunload', function(){  console.log("beforeunload"); });


  var iLoad=getItem('iLoad'); setItem('iLoad', iLoad+1);
  $iLoad.append(iLoad+',');
  $poporder.append('load'+iLoad+',');

  oAJAX={
    url:uBE,
    global: false,
    type: "POST",
    dataType:'json',
    contentType:'application/json',
    processData:false,
    success: beRet,
    error: function(jqXHR, textStatus, errorThrown){
      setMess('responseText: '+jqXHR.responseText+', textStatus: '+' '+textStatus+', errorThrown: '+errorThrown);     throw 'bla';
    }
  };


  setTimeout(setUp2,1);
}
var setUp2=function(){


  $loginInfo=loginInfoExtend($('<div>'));  $loginInfo.css({'font-size':'75%', flex:'0 0 auto', margin:'0.4em auto','line-height':'1.6em'});

  $divs=$body.children('div:not(:last-child)').detach();
  divs=[];  $divs.each(function(i){divs[i]=$(this);});

  $tmp=divs[0].children('div');  menuDivs=[];  $tmp.each(function(i){menuDivs[i]=$(this);});


  $body.css({visibility:'visible',background:'#fff'});

  var $pa=$('<p>').append(langHtml.WaitingForYourPosition);
  var $pb=$('<p>').append('(',langHtml.WaitingForYourPositionHelp,')');
  $startPop=$('<div>').append($pa,$pb);

  if(!boTouch) $startPop=startPopExtend($startPop); else  $startPop=startPopExtendTouch($startPop);
  startPopTimer=null;
  //if(boTouch && boIOS) $startPop.openFunc(); else startPopTimer=setTimeout($startPop.openFunc,1000);


  $noOneIsVisibleToast=noOneIsVisibleToastExtend($('<div>')).css({padding:'0.5em','text-align':'center',left:'50%',width:'12em','margin-left':'-6em','z-index':6});
  $body.append($noOneIsVisibleToast);

  $IntroDiv=[];
  for(var i=0;i<ORole.length;i++){
    $IntroDiv[i]=roleIntroDivExtend($('<div>'),ORole[i]);
  }
  [$introDivC, $introDivS]=$IntroDiv;

  $userSettingButton=$('<button>').append(langHtml.UserSettings);
  $userSettingDiv=userSettingDivExtend($('<div>')).addClass('mainDiv');
  
  $QuickDiv=[]; $SettingDiv=[];
  for(var i=0;i<ORole.length;i++){
    $QuickDiv[i]=quickDivExtend($('<div>'),ORole[i]).css({padding:'0.7em 0.2em 0.1em',margin:'0em 0em 0em',display:'flex','border-top':'solid 1px'});   $QuickDiv[i].hide();
    $SettingDiv[i]=roleSettingDivExtend($('<div>'),ORole[i]).addClass('mainDiv');
  }
  [$quickDivC, $quickDivS]=$QuickDiv;   [$settingDivC,$settingDivS]=$SettingDiv;
  
  $deleteAccountPop=deleteAccountPopExtend($('<div>'));


  $uploadImageDiv=uploadImageDivExtend($('<div>'));
  $teamDivC=teamDivExtend($('<div>'),oC).addClass('mainDiv');
  $teamDivS=teamDivExtend($('<div>'),oS).addClass('mainDiv');


  $adminButton=$('<button>').html('Admin').css({display:'block'});
  $adminDiv=adminDivExtend($('<div>')).addClass('mainDiv');
  
  
  
  $complaineeDiv=complaineeDivExtend($('<div>')).addClass('mainDiv');
  $complainerDiv=complainerDivExtend($('<div>')).addClass('mainDiv');
  $complaintCommentPop=complaintCommentPopExtend($('<div>')).css({border:'1px solid #000'});
  $complaintAnswerPop=complaintAnswerPopExtend($('<div>')).css({border:'1px solid #000'});

  //$agreementStart=agreementStartExtend($('<div>'));
  //if(boFirstVisit) $agreementStart.setLocalDates(1);


  $mapDiv=mapDivExtend($("<div>")).css({overflow:'hidden'});
  $mapDiv.css({flex:"auto"});  // "overflow-y":"scroll", "-webkit-overflow-scrolling":"touch",

    //filter colors
  colButtAllOn='#9f9'; colButtOn='#0f0'; colButtOff='#ddd'; colFiltOn='#bfb'; colFiltOff='#ddd'; colFontOn='#000'; colFontOff='#777'; colActive='#65c1ff'; colStapleOn='#f70'; colStapleOff='#bbb';

  maxStaple=20;

    // FilterDiv, ColumnSelectorDiv, ColumnSorterDiv
  $FilterDiv=[]; $ColumnSelectorDiv=[]; $ColumnSorterDiv=[];
  for(var i=0;i<ORole.length;i++){
    $FilterDiv[i]=new FilterDiv(ORole[i]).addClass('mainDiv').css({'background-color':'#eee'});  //,'padding-bottom':'0.6em'
    $ColumnSelectorDiv[i]=columnSelectorDivExtend($('<div>'), ORole[i]).addClass('mainDiv');
    $ColumnSorterDiv[i]=columnSorterDivExtend($('<div>'), ORole[i]).addClass('mainDiv');
  }
  [$filterDivC, $filterDivS]=$FilterDiv;   [$columnSelectorDivC, $columnSelectorDivS]=$ColumnSelectorDiv;   [$columnSorterDivC, $columnSorterDivS]=$ColumnSorterDiv;

  $currencyInfoDivs=$([]);


  $TableDiv=[];
  for(var i=0;i<ORole.length;i++){
    $TableDiv[i]=tableDivExtend($("<div>"), ORole[i]).addClass('mainDiv').css({'max-width':'none'});
    $TableDiv[i].$table.addClass('tableDiv');  //.css({'border-top':'0px'});
  }
  [$tableDivC, $tableDivS]=$TableDiv;
  

  if(0){
    $iframeLike=$('<iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fgavott&amp;width&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;stream=false&amp;show_border=false&amp;appId=237613486273256" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:62px;" allowTransparency="true"></iframe>');
  }else{$iframeLike=$('<span>');}
  $iframeLike.css({'float':'right',clear:'both'});

  $formLoginDiv=formLoginDivExtend($('<div>')).addClass('mainDiv').css({'text-align':'left'});



  $EntryButton=[]; $EntryDiv=[];
  for(var i=0;i<ORole.length;i++){
    var tmp=ORole[i].strRole=='customer'?langHtml.AppearAsCustomer:langHtml.AppearAsSeller;
    $EntryButton[i]=$('<button>').append(tmp).addClass('flexWidth').css({'width':'initial','font-size':'0.7em', background:ORole[i].strColor}); //'&equiv;'
    $EntryDiv[i]=entryDivExtend($('<div>'), ORole[i]).addClass('mainDiv');
  }
  [$entryButtonC, $entryButtonS]=$EntryButton;   [$entryDivC, $entryDivS]=$EntryDiv;
  
  if(document.domain.substr(0,4)=='demo') {$entryButtonC.hide(); $entryButtonS.hide();}
  $convertIDDiv=convertIDDivExtend($('<div>')).addClass('mainDiv');


  $createUserDiv=createUserDivExtend($('<div>')).addClass('mainDiv').css({'text-align':'left'});

  $changePWPop=changePWPopExtend($('<div>')).css({'text-align':'left'});
  $forgottPWPop=forgottPWPopExtend($('<div>')).css({'text-align':'left'});


  $settingDivW=settingDivWExtend($('<div>')).addClass('mainDiv');



  $MarkSelectorDiv=[]; $InfoDiv=[]; $ListCtrlDiv=[];
  for(var i=0;i<ORole.length;i++){
    $MarkSelectorDiv[i]=markSelectorDivExtend($('<div>'), ORole[i]).addClass('mainDiv');
    $InfoDiv[i]=roleInfoDivExtend($('<div>'), ORole[i]).addClass('mainDiv');
    $ListCtrlDiv[i]=listCtrlDivExtend($('<div>'), ORole[i]).css({display:'inline-block','float':'right'});
  }
  [$markSelectorDivC, $markSelectorDivS]=$MarkSelectorDiv;   [$infoDivC, $infoDivS]=$InfoDiv;   [$listCtrlDivC, $listCtrlDivS]=$ListCtrlDiv;
  

  
  $frontDiv=frontDivExtend($("<div>")).addClass('mainDiv');


     // Let plugins rewrite objects
  for(var i=0;i<PlugIn.length;i++){  var tmp=PlugIn[i].rewriteObj; if(tmp) tmp();   }


  $userSettingDiv.createDivs();
  for(var i=0;i<ORole.length;i++){
    $SettingDiv[i].createDivs();
    $FilterDiv[i].$filterDivI.createDivs();
    var tmpStartFilter=ORole[i].strRole=='customer'?startFilterC:startFilterS;
    if(tmpStartFilter){
      var StrOrderFilt=ORole[i].filter.StrProp, StrOrderFiltFlip=array_flip(StrOrderFilt);
      $FilterDiv[i].$filterDivI.Filt[StrOrderFiltFlip.idTeam]=[[],[tmpStartFilter],1];
    }

    $TableDiv[i].createTBody();   $TableDiv[i].setRowDisp();  //$TableDiv[i].css({margin:'0em'});
  
    $InfoDiv[i].createContainers();
    $ColumnSelectorDiv[i].createTable();
    $MarkSelectorDiv[i].createTable();
  }

  //if(boTouch) $H1.css({'font-size':'0.9em'});
  if(boTouch) $H1=$([]);



  if(typeof StrMainDiv=='undefined') StrMainDiv=[];
  StrMainDiv.push('frontDiv', 'filterDivC', 'filterDivS', 'tableDivC', 'tableDivS', 'userSettingDiv', 'settingDivC', 'settingDivS', 'infoDivC', 'infoDivS', 'adminDiv', 'complaineeDiv', 'complainerDiv', 'entryDivC', 'entryDivS', 'formLoginDiv', 'createUserDiv', 'convertIDDiv', 'settingDivW', 'columnSelectorDivC', 'columnSelectorDivS', 'columnSorterDivC', 'columnSorterDivS', 'markSelectorDivC', 'markSelectorDivS', 'teamDivC', 'teamDivS', 'deleteAccountPop', 'loginDiv', 'complaintCommentPop', 'complaintAnswerPop', 'uploadImageDiv', 'changePWPop', 'forgottPWPop');    // 'loginInfo', 'H1', 
  //if(boDbgL) StrMainDiv.unshift('divDbg');



  var MainDiv=[];
  for(var i=0;i<StrMainDiv.length;i++){
    var key=StrMainDiv[i], $el=window['$'+key];
    MainDiv[i]=$el;
  }
  $MainDiv=$([]); $MainDiv.push.apply($MainDiv,MainDiv);
  //$MainDiv.css({'border-top':'1px solid white'});



  history.StateMy[history.state.ind]={$view:$frontDiv};


  $MainDiv.hide();
  $body.append($MainDiv);
  
  $frontDiv.show();


      // Extra functionallity when clicking on menus
  frontButtonClick=function(){
    $frontDiv.setVis();   doHistPush({$view:$frontDiv});
    ga('send', 'event', 'button', 'click', 'map');
  }
  
  


  $userSettingButton.on('click',function(){
    $userSettingDiv.setVis(); doHistPush({$view:$userSettingDiv});
  });
  $adminButton.on('click',function(){
    $adminDiv.setVis(); doHistPush({$view:$adminDiv});
  });
  $entryButtonC.on('click',function(){
    $entryDivC.setVis(); doHistPush({$view:$entryDivC});
    ga('send', 'event', 'button', 'click', 'entryDivC');
  });
  $entryButtonS.on('click',function(){
    $entryDivS.setVis(); doHistPush({$view:$entryDivS});
    ga('send', 'event', 'button', 'click', 'entryDivS');
  });


  $mainDivsTogglable=$MainDiv;  // .not($loginInfo.add($H1));
  //if(boDbgL) $mainDivsTogglable=$MainDiv.not($loginInfo.add($H1).add($divDbg));
  var $topDivMain=$([]).push($loginInfo, $H1);  if(boDbgL) $topDivMain.push(divDbg);

  scalableTog=function(boOn){ return;
    if(typeof boOn=='undefined') boOn=document.body.style.opacity!=0.9999;
    var floatOpacity=boOn?1:0.9999;
    var strVPContent='width=device-width, initial-scale=1, '+(boOn?'maximum-scale=4':'maximum-scale=1, user-scalable=no');
    $('meta[name=viewport]').attr('content', strVPContent);
    document.body.style.opacity=floatOpacity;
    //setTimeout(function(){ document.body.style.opacity = 1;  }, 1);
  }

  $frontDiv.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.$topDiv.after($topDivMain);
    //$('meta[name=viewport]').prop({'user-scalable':'false'});
    scalableTog(0);
    $mapDiv[0].dispatchEvent(new Event('myResize'));
    return true;
  }
  $tableDivC.setVis=
  $tableDivS.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.prepend($topDivMain);
    //$('meta[name=viewport]').prop({'user-scalable':'true'});
    scalableTog(1);
    return true;
  }
  $filterDivC.setVis=
  $filterDivS.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.prepend($topDivMain);
    scalableTog(1);
    return true;
  }
  $userSettingDiv.setVis=function(){
    if(!userInfoFrDB.user) return false;
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $settingDivC.setVis=function(){
    if(!userInfoFrDB.customer) return false;
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $settingDivS.setVis=function(){
    if(!userInfoFrDB.seller) return false;
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $infoDivC.setVis=
  $infoDivS.setVis=function(){
    var $tmp=this;
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.$listCtrlDivW.append($ListCtrlDiv[this.indRole]);
    scalableTog(1);
    return true;
  }
  $complaineeDiv.setVis=function(){
    var $tmp=this;  
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $ListCtrlDiv[1-this.indRole].detach();
    $tmp.$listCtrlDivW.append($ListCtrlDiv[this.indRole]);
    scalableTog(1);
    return true;
  }
  $complainerDiv.setVis=function(){
    var $tmp=this;  
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $adminDiv.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $entryDivC.setVis=
  $entryDivS.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $formLoginDiv.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $createUserDiv.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $convertIDDiv.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tmp.setUp();
    scalableTog(1);
    return true;
  }
  $settingDivW.setVis=function(){
    var $tmp=this;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    //$tmp.setUp();
    $tmp.prepend($topDivMain);
    scalableTog(1);
    return true;
  }
  $columnSelectorDivC.setVis=
  $columnSelectorDivS.setVis=function(){
    var $tmp=this; 
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $columnSorterDivC.setVis=
  $columnSorterDivS.setVis=function(){
    var $tmp=this;
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $markSelectorDivC.setVis=
  $markSelectorDivS.setVis=function(){
    var $tmp=this;
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $teamDivC.setVis=
  $teamDivS.setVis=function(){
    var $tmp=this;
    if($tmp.boLoaded==0) return false;
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }

  //$loginDiv.setVis=function(){
    //var $tmp=$loginDiv;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    //scalableTog(1);
    //return true;
  //}


  $body.css({'text-align':'center'});

  $busyLarge.show();

  boFirstLoadTab=1;

  if(boEmulator || boVideo) {
    latLngDebug={lat:59.330454370984235, lng:18.059076067697106};
    posDebug={coords:{latitude:latLngDebug.lat,longitude:latLngDebug.lng}};
  }
  window.addEventListener("resize", function(){
    $mapDiv[0].dispatchEvent(new Event('myResize'));
  });

  //ga('send', 'event', 'button', 'click', 'geoOK');

  boFirstPosOK=0;

  var tmpFGeoSuccess=function(pos){
    //tmpFUseApprox=doNothing;
    if(typeof timerCoordApprox!='undefined') clearTimeout(timerCoordApprox);
    //clearTimeout(timerGeoNotOK);
    boFirstPosOK=1;
    boGeoOK=true; setItem('boGeoOK',boGeoOK);
    var latLng={lat:pos.coords.latitude, lng:pos.coords.longitude};
    if(typeof boApproxCalled!='undefined') { 
      $mapDiv.setCentNMe(latLng);
    } else firstAJAXCall(latLng);
    
  }

  if(boEmulator){ tmpFGeoSuccess(posDebug); }else{ navigator.geolocation.getCurrentPosition(function(pos){tmpFGeoSuccess(pos);}, geoError,{timeout:20000,maximumAge:60000});  }
  //, {maximumAge:Infinity, timeout:5000,enableHighAccuracy:false}
  //setMess('... getting position ... ',null,true);
  var tmpFUseApprox=function(){
    var latLng={lat:coordApprox[0],lng:coordApprox[1]};  if(boVideo) latLng=latLngDebug;
    boApproxCalled=true;
    firstAJAXCall(latLng);
  }
  //var tmpFGeoNotOK=function(){ boGeoOK=false; setItem('boGeoOK',boGeoOK); }
  boGeoOK=getItem('boGeoOK');  if(boGeoOK===null) boGeoOK=false;
  //var tTmp=2; if(boAndroid && boGeoOK) tTmp=10;
  var tTmp=2; if(boGeoOK) tTmp=10;
  timerCoordApprox=setTimeout(tmpFUseApprox,(tTmp)*1000);
  boGeoOK=false;  setItem('boGeoOK',boGeoOK);
  //timerGeoNotOK=setTimeout(tmpFGeoNotOK,20*1000);

}

};

window.onload=function(){  setUp(); setUp1();};





