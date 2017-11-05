




var CreatorPlugin={};

// Main, vendorInfoDiv, filterDiv, vendorSettingDiv, priceSettingDiv


CreatorPlugin.general=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'idTeam'];
  ColsShowDefaultS= ['image', 'displayName'];
  ColsShowDefaultRS= ['image', 'displayName'];
  colOneMarkDefault='image';
  
  StrPropContact=site.StrPropContact; StrPropPos=site.StrPropPos; StrPropRep=site.StrPropRep;

    // StrPropMain: rows in vendorInfoDiv, markSelectorDiv, columnSelectorDiv, tHeadLabel, tableDiv
  StrPropMain=[].concat('image', 'idTeam', 'displayName', StrPropContact, 'currency', 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Contact','Price','Position','Reputation'];
  
  //enumIP=Enum.IP; enumDistUnit=Enum.distUnit;
  //enumIP=Prop.IP.Enum; enumDistUnit=Prop.distUnit.Enum;
  //enumIP=Prop.IP.Enum;
 
  distUnitDefault='km'; if(strLang=='en') {distUnitDefault='mile'; }
  if(boNewVersion) { setItem('distUnit',distUnitDefault);}
  distUnit=getItem('distUnit');  if(distUnit===null) distUnit=distUnitDefault;
  

  setDistUnit=function(unit){
    distUnit=unit;   setItem('distUnit',distUnit);
    $tableDiv.setCell();  $mapDiv.setMarkers();
  };
  setDistUnitButtons=function(){  $distUnitChoise.setUp(); $distUnitChoiseB.setUp();  };
  distUnitChoiseExtend=function($el){
    $el.setUp=function(){
      $butKM.css({background:distUnit=='km'?colOn:colOff});$butMile.css({background:distUnit=='km'?colOff:colOn}); };
    var $butKM=$('<button>').html('km').click(function(e){e.stopPropagation(); if(distUnit=='mile'){setDistUnit('km'); setDistUnitButtons();} });
    var $butMile=$('<button>').html('mile').click(function(e){e.stopPropagation(); if(distUnit=='km'){setDistUnit('mile'); setDistUnitButtons();} });
    //var colOn={background:'#4f4'}, colOff={background:'#eee'};
    var colOn='#4f4', colOff='#eee';
    $el.append($butKM,'<br>',$butMile);
    return $el;
  };

  
  $distUnitChoise=distUnitChoiseExtend($('<span>'));  $distUnitChoise.setUp(); $distUnitChoise.children('br').remove(); $distUnitChoise.prepend(langHtml.DistanceUnit,': ');
  $distUnitChoiseB=distUnitChoiseExtend($('<span>'));  $distUnitChoiseB.setUp(); $distUnitChoiseB.addClass('smallButt').css({padding:'0.5em 0.1em'});

  //this.rewriteLang=function(){};


  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName',StrPropContact,'coordinatePrecisionM');
    $vendorSettingDiv.StrGroupFirst=[];
    $vendorSettingDiv.StrGroup=[];    
    $priceSettingDiv.StrProp=['currency'];
    $filterDiv.StrGroupFirst=['homeTown','created'];
    $filterDiv.StrGroup=['Vendor','Reputation'];

 
    $markSelectorDiv.strImageSel=":radio:not([value='vehicleType'],[value='image'],[value='idTeam'])";  // Fields that are disabled if boImgCreationOK==0


      // tHeadLabel
    boUseTimeDiff={created:1,lastPriceChange:1,posTime:1};
    var $tmp = timeStampButtExtend($("<button>"),'lastPriceChange').css({padding:'0.3em 0.5em'});    $tHeadLabel.find('[name=lastPriceChange]').append($tmp);
    var $tmp = timeStampButtExtend($("<button>"),'posTime').css({padding:'0.3em 0.5em'});    $tHeadLabel.find('[name=posTime]').append($tmp);
    
    
    $tHeadLabel.find('[name=dist]').append($distUnitChoiseB); 

    var $opt=$([]).push($distUnitChoise);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
    $vendorDiv.before($opt);


      // filterDiv
    $filterDiv.arrLabel=$.extend({},langHtml.label);   
    var h=langHtml.timeUnit.h[1], mon=langHtml.timeUnit.mo[3];   // arrUnit
    $filterDiv.Unit={posTime:h,created:mon,timeAccumulated:mon};


      // currency
    $.extend(Prop.currency, {strType:'select',
      crInp:function(){
        var $c=$('<select>').prop('id','currency');
        for(var i=0;i<currencies[0].length;i++){    var $opt=$("<option>").text(currencies[1][i]+' ('+currencies[0][i]+')').val(currencies[1][i]);   $c.append($opt);    }
        var $optT=$c.find("option[value='USD']");    $optT.prop('selected', 'selected');
        return $c;
      }
    });

      // created, lastPriceChange, posTime
    makeTimeF=function(strN,dir){return function(iMTab){ var data=MTab[iMTab][strN];  if(boUseTimeDiff[strN]) data=UTC2ReadableDiff(dir*(data-curTime)); else data=UTC2Readable(data); return data; }; };
    var tmpF=makeTimeF('created',-1);    $.extend(Prop.created, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    var tmpF=makeTimeF('lastPriceChange',-1);   $.extend(Prop.lastPriceChange, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });    
    var tmpF=makeTimeF('posTime',-1);   $.extend(Prop.posTime, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });

      // timeAccumulated, IP
    var tmpF=function(iMTab,$c){ return UTC2ReadableDiff(MTab[iMTab].timeAccumulated); };
    $.extend(Prop.timeAccumulated, { setInfo:tmpF, sortTabF:tmpF, setTabF:tmpF, setMapF:tmpF, setMapMF:tmpF });
    //var tmpIP=function(iMTab,$c){  return enumIP[Number( MTab[iMTab].IP )]; };
    //$.extend(Prop.IP, { setInfo:tmpIP, sortTabF:tmpIP, setTabF:tmpIP, setMapF:tmpIP, setMapMF:tmpIP });

      // nReport
    var tmpSetNReport=function(iMTab,$c){   $c.children('button')[0].mySet(iMTab);   };
    var tmpCrNReport=function($c){  $c.append(  $(reportButtonExtend($('<button>')[0]))  ); };
    $.extend(Prop.nReport, {
      setInfo:tmpSetNReport, crInfo:tmpCrNReport,
      setTabF:tmpSetNReport, crTabF:tmpCrNReport
    });

      // idTeam
    var tmpSetIdTeam=function(iMTab,$c){   $c.children('a')[0].mySet(iMTab);   };
    var tmpCrIdTeam=function($c){  $c.append(  $(thumbDisExtend($('<a>')[0]))  );   };
    $.extend(Prop.idTeam, {
      setInfo:tmpSetIdTeam,crInfo:tmpCrIdTeam,
      setTabF:tmpSetIdTeam,crTabF:tmpCrIdTeam,
      setMapF:function(iMTab){
        var rT=MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam, tmp;
        if(data && data.length>0 && data!==0) {
          var strTmp=uTeamImage+data+'?v='+tag;
          tmp = {url:strTmp};
        } else tmp=langHtml.IndependentVendor.replace("<br>","\n");
        return tmp;
      },
      setRowButtF:function($span,val,boOn){ $span.mySet(val,boOn); },
      crRowButtF:function(i){ return teamImgButtonExtend($('<span>')).css({'margin-right':'0.25em'}); }
    });

      // dist
    var tmpSetDist=function(iMTab){ 
      //var rT=MTab[iMTab],  tmpPoint = new google.maps.Point(rT.x, rT.y),   tmpLatLng=merProj.fromPointToLatLng(tmpPoint); 
      var rT=MTab[iMTab],  tmpPoint = [rT.x, rT.y],   tmpLatLng=merProj.fromPointToLatLngV(tmpPoint); 
      //var dist=distCalc(tmpLatLng.lng(),tmpLatLng.lat(),$mapDiv.latLngMe.lng(),$mapDiv.latLngMe.lat());  if(distUnit=='mile') dist=dist/1.609;
      //var dist=distCalc(tmpLatLng[1],tmpLatLng[0],$mapDiv.latLngMe.lng(),$mapDiv.latLngMe.lat());  if(distUnit=='mile') dist=dist/1.609;
      var dist=distCalc(tmpLatLng[1],tmpLatLng[0],$mapDiv.latLngMe.lng,$mapDiv.latLngMe.lat);  if(distUnit=='mile') dist=dist/1.609;
      return Number(dist.toFixed(1));
    };
    var tmpSetDistOther=function(iMTab,$c){return tmpSetDist(iMTab,$c)+' '+distUnit;};
    $.extend(Prop.dist, {
      setInfo:tmpSetDistOther,
      setTabF:tmpSetDist,sortTabF:tmpSetDist,
      setMapF:tmpSetDistOther,setMapMF:tmpSetDistOther
    });
    
      // displayName
    $.extend(Prop.displayName, {strType:'text',inpW:9});

      // tel
    var tmpSetTel=function(iMTab,$c){  var tmp=MTab[iMTab].tel.trim();    $c.children('a').prop({href:'tel:'+tmp}).text(tmp).toggle(tmp.length>0);  };
    var tmpCrTel=function($c){   $c.append($('<a>'));  };
    $.extend(Prop.tel, {
      strType:'tel',inpW:6,
      setInfo:tmpSetTel, crInfo:tmpCrTel,
      setTabF:tmpSetTel, crTabF:tmpCrTel
    }); //,saveInp:mustBeSetF
    
      // displayEmail
    var tmpSet=function(iMTab,$c){  var tmp=MTab[iMTab].displayEmail.trim();    $c.children('a').prop({href:'mailto:'+tmp}).text(tmp).toggle(tmp.length>0);  };
    var tmpCr=function($c){   $c.append($('<a>'));  };
    $.extend(Prop.displayEmail, {
      strType:'email',inpW:6,
      setInfo:tmpSet, crInfo:tmpCr,
      setTabF:tmpSet, crTabF:tmpCr
    }); //,saveInp:mustBeSetF

      // link
    var makeTrunkF=function(strName,n){return {
          setMapF:function(iMTab){var str=MTab[iMTab][strName],n=40; return str.length>n?str.substr(0,n)+'…':str;},
          setMapMF:function(iMTab){var str=MTab[iMTab][strName]; return str.length>n?str.substr(0,n)+'…':str;}}; };
    var tmp=makeTrunkF('link',40-langHtml.label.link.length);     
    $.extend(Prop.link, {
      strType:'url',inpW:9,
      setInfo:function(iMTab,$c){  
        var url=MTab[iMTab].link; if(url && !RegExp("^https?:\\/\\/").test(url)) { url='http://'+url; }
        $c.children('a').prop({href:url}).text(url).toggle(url.length>0);  
      },
      crInfo:function($c){  $c.append(  $('<a>').prop({target:"_blank"})  );   },
      setMapF:tmp.setMapF, setMapMF:tmp.setMapMF
    }); 


      // idFB, idIdPlace, idOpenId, homeTown 
    var tmp=makeTrunkF('idFB',40-langHtml.label.idFB.length); 
    var tmp=makeTrunkF('idIdPlace',40-langHtml.label.idIdPlace.length); 
    var tmp=makeTrunkF('idOpenId',40-langHtml.label.idOpenId.length); 
    $.extend(Prop.idFB, {setMapF:tmp.setMapF, setMapMF:tmp.setMapMF});
    $.extend(Prop.idIdPlace, {setMapF:tmp.setMapF, setMapMF:tmp.setMapMF});
    $.extend(Prop.idOpenId, {setMapF:tmp.setMapF, setMapMF:tmp.setMapMF});
    $.extend(Prop.homeTown, {strType:'text',inpW:6});
    
      // idTeamWanted 
    $.extend(Prop.idTeamWanted, {strType:'span',inpW:3,
      crInp:function(){ var $c=$(spanIdTeamWantedExtend($('<span>')[0])); return $c;  }, 
      setInp:function($c){ $c[0].setStat(); },   
      saveInp:function($c){return [null, $c[0].$inp.val().trim()];}
    });

      // coordinatePrecisionM
    $.extend(Prop.coordinatePrecisionM, {strType:'select',
      crInp:function(){  var $c=$('<select>'); for(var i=0;i<arrCoordinatePrecisionM.length;i++){ var v=arrCoordinatePrecisionM[i], $op=$("<option>").val(v).append(approxDist(v)); $c.append($op); }   return $c; },
      setInp:function($c){
        var tmp=closest2Val(arrCoordinatePrecisionM, userInfoFrDB.vendor.coordinatePrecisionM), bestVal=tmp[0];
        $c.val(bestVal);
      }
    });

      // image
    var tmpCrInp=function(){
      var $c=$('<span>');
      var $thumb=$c[0].$thumb=$('<img>').css({'vertical-align':'middle'});
      $c[0].$butDeleteImg=$('<button>').append(langHtml.Delete).click(function(){
        var vec=[['deleteImage',1,function(data){
          if(data.boOK) userInfoFrDB.boImgOwn=0;
          $vendorSettingDiv.setUp();
        }]];   majax(oAJAX,vec);  //, ['setupById',{Role:'vendor'}]
      });
      var uploadCallback=function(){
        userInfoFrDB.vendor.boImgOwn=1; userInfoFrDB.vendor.imTag=randomHash(); var tmp=calcImageUrlUser(); $thumb.attr({src:tmp.str}); $c[0].$butDeleteImg.toggle(tmp.boImgOwn);
        //var tmpF=function(){var tmp=calcImageUrlUser(); $thumb.attr({src:tmp.str});};  $c[0].$butDeleteImg.toggle(tmp.boImgOwn);  var vec=[ ['setupById',{Role:'vendor'},tmpF]];   majax(oAJAX,vec);
      }
      var $buttUploadImage=$('<button>').html(langHtml.uploadNewImg).click(function(){$uploadImageDiv.openFunc('v',uploadCallback);});
      $c.append($c[0].$thumb,$c[0].$butDeleteImg,$buttUploadImage);  //langHtml.YourImage+': ',
      return $c;
    };
    calcImageUrl=function(rT){ // Keys of rT: ["IP", "boImageOwn", "idUser", "imTag", "image"] 
      var tmp='',  boImgOwn=Number(rT.boImgOwn);  // IPTmp=enumIP[Number(rT.IP)]
      if(boImgOwn  || rT.image.length==0) tmp=uVendorImage+rT.idUser+'?v='+rT.imTag;  else tmp=rT.image; 
      return tmp;
    };
    calcImageUrlW=function(iMTab){      return calcImageUrl(MTab[iMTab]);     };
    calcImageUrlUser=function(){   var tmp=$.extend({image:userInfoFrDB.user.image}, userInfoFrDB.vendor);  return {str:calcImageUrl(tmp),    boImgOwn:Boolean(Number(tmp.boImgOwn))};     }
/*
    calcImageUrlUser=function(){
      var idUser=userInfoFrDB.vendor.idUser, tag=userInfoFrDB.vendor.imTag, boImgOwn=Boolean(Number(userInfoFrDB.vendor.boImgOwn));
      var strTmp;        if(boImgOwn){ strTmp=uVendorImage+idUser+'?v='+tag; }     else {strTmp=userInfoFrDB.vendor.image; }
      return {str:strTmp,boImgOwn:boImgOwn};
    }*/
    var tmpSetInp=function($c){
      var tmp=calcImageUrlUser();
      $c[0].$butDeleteImg.toggle(tmp.boImgOwn);
      $c[0].$thumb.prop({src:tmp.str});
    };

    var tmpSetImage=function(iMTab,$c){ $c.children('img').prop({src:calcImageUrlW(iMTab)});  };
    var tmpCrImage=function($c){ $c.append($('<img>'));  };
    $.extend(Prop.image, {
      strType:'span',
      crInp:tmpCrInp, setInp:tmpSetInp, saveInp:function(){return [null,null];},
      setInfo:tmpSetImage, crInfo:tmpCrImage,
      sortTabF:function(iMTab){return MTab[iMTab].idUser;},  // MTab[iMTab].IP+
      setTabF:tmpSetImage,
      crTabF:tmpCrImage,
      setMapF:function(iMTab){     return {url:calcImageUrlW(iMTab)};  },
      setMapMF:function(iMTab){return false;}
    });

  };
};
//0123456789abcdef


//////////////////////////////////////////////////////////////////////////////////////////////////////////

CreatorPlugin.transportProt=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam'];
  ColsShowDefaultS= ['image', 'displayName'];
  ColsShowDefaultRS= ['image', 'displayName'];
  colOneMarkDefault='vehicleType';
  
  StrPropMain=[].concat('image', 'idTeam', 'displayName','vehicleType', StrPropContact, 'currency', 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','vehicleType','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Vehicle','Contact','Price','Position','Reputation'];
  
  
  //enumVehicleType=Enum.vehicleType;
  enumVehicleType=Prop.vehicleType.Enum;
  
    // images
  var strPlugin='transportProt';
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
    langHtml.vendorRewritten=langHtml.driver;
    boRewriteVendor=true;
    langHtml.loginInfo.vendor=langHtml.driver;
    langHtml.Vendor=ucfirst(langHtml.driver);
    langHtml.Vendors=ucfirst(langHtml.drivers);
    langHtml.IndependentVendor=langHtml.IndependentDriver;
    
    langHtml.vendor=langHtml.driver;   langHtml.vendors=langHtml.drivers;
    langHtml.theVendor=langHtml.theDriver;  langHtml.theVendors=langHtml.theDrivers;
    langHtml.theVendors0=langHtml.theDrivers0;
  };

  //this.rewriteLang=function(){};


  this.rewriteObj=function(){ 
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName',StrPropContact, 'coordinatePrecisionM', 'vehicleType');
    $vendorSettingDiv.StrGroupFirst=['image','vehicleType'];
    $vendorSettingDiv.StrGroup=['Vendor','Vehicle'];
    $filterDiv.StrGroupFirst=['vehicleType','homeTown','created'];
    $filterDiv.StrGroup=['Vehicle','Vendor','Reputation'];
    

    var tmpSetVehicleType=function(iMTab,$c){     $c.children('span')[0].mySet(Number(  MTab[iMTab].vehicleType  ));    };
    var tmpSetVehicleTypeM=function(iMTab){
      var data=MTab[iMTab].vehicleType, strName=enumVehicleType[MTab[iMTab].vehicleType];
      var tmp; if(MTab[iMTab].posTime<curTime-snoreLim) tmp=vehSpriteZ; else tmp=vehSpriteW;
      //if(MTab[iMTab].idUser<=3) tmp=vehSpriteDummy;
      //if(MTab[iMTab].displayName=='Dummy') tmp=vehSpriteDummy;
      if(MTab[iMTab].displayName.match(/^Dummy/)) tmp=vehSpriteDummy;
      var item=tmp.item[strName];
      var zT=tmp.zoom, wSc=Math.ceil(zT*item.w), hSc=Math.ceil(zT*item.h), wSSc=zT*tmp.sheetW, hSSc=zT*tmp.sheetH;
      //return {url:tmp.url, size:new google.maps.Size(wSc,hSc), origin:new google.maps.Point(zT*item.x, zT*item.y), anchor:new google.maps.Point(wSc/2,hSc), scaledSize:new google.maps.Size(wSSc,hSSc)};
      return {url:tmp.url, size:{width:wSc, height:hSc}, origin:{x:zT*item.x, y:zT*item.y}, anchor:{x:wSc/2, y:hSc}, scaledSize:{width:wSSc, height:hSSc}};
    };
    var tmpSetVehicleTypeMM=function(iMTab){return langHtml.vehicleType[enumVehicleType[MTab[iMTab].vehicleType]];};
    var tmpCrVehicleType=function($c){   $c.append(  $(spriteExtend($('<span>')[0],vehSprite))  );   };
    $.extend(Prop.vehicleType, {
      crInp:function(){ var $c=$(selSpriteExtend($('<span>')[0],vehSprite)); return $c; },
      setInp:function($c){ $c[0].mySet(userInfoFrDB.vendor.vehicleType); },
      saveInp:function($c){return [null, $c[0].myGet()];},
      setInfo:tmpSetVehicleType,crInfo:tmpCrVehicleType,
      setTabF:tmpSetVehicleType,crTabF:tmpCrVehicleType,
      setMapF:tmpSetVehicleTypeM, setMapMF:tmpSetVehicleTypeMM,
      crRowButtF:function(i){ $span=$(spriteExtend($('<span>')[0],vehSprite));    $span[0].mySet(i);  return $span;},
      setRowButtF:function($span,val,boOn){   $span[0].mySet(val);  if(boOn) opacity=1; else opacity=0.4; $span.children('img').css({opacity: opacity});  }
    });
  };
};
//0123456789abcdef

CreatorPlugin.transportPrice=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'comparePrice'];
  colOneMarkDefault='vehicleType';

  StrPropTransportProtPrice=site.StrPropTransportProtPrice;
  
  StrPropMain=[].concat('image', 'idTeam', 'displayName','vehicleType', StrPropContact, 'currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','vehicleType','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Vehicle','Contact','Price','Position','Reputation'];
  

  if(typeof StrMainDiv=='undefined') StrMainDiv=[];
  StrMainDiv.push('comparePriceDataPop');
  comparePriceDataPopExtend=function($el){
    $el.toString=function(){return 'comparePriceDataPop';}
    //$el=popUpExtend($el);  
    //$el.css({ width:'16em', padding: '2em'});
    var defaultFunc=function() { 
      $dist.val(comparePrice.dataDefault.dist); 
      $unit.val(distUnitDefault); 
      $time.val(comparePrice.dataDefault.time); 
    };
    $el.openFunc=function(extraSaveFuncT) { 
      //e.stopPropagation();
      $dist.val(comparePrice.dist); 
      $unit.val(distUnit); 
      $time.val(comparePrice.time); 
      $mess.html('');
      if(typeof extraSaveFuncT!='undefined') extraSaveFunc=extraSaveFuncT; else extraSaveFunc=null;
      doHistPush({$view:$comparePriceDataPop});
      $el.setVis();
    };
    $el.setVis=function(){
      $el.show();
      return true;
    }
   
    var saveFunc=function() {    
      var dist=Number($dist.val()), unit=$unit.val(), time=Number($time.val());
      if(isNaN(dist)) {$mess.html('input not valid'); return;}
      if(isNaN(time)) {$mess.html('input not valid'); return;}
      distUnit=unit; comparePrice.dist=dist; comparePrice.time=time;
      setItem('comparePriceData',{dist:dist, time:time});
      setItem('distUnit',distUnit);
      
      comparePriceInfosSet();
      $tHeadLabel.setPricePerDistCanvas();
      setDistUnitButtons();
      $tableDiv.setCell();    $mapDiv.setMarkers();
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
    var $dist=$('<input type=number>').prop({min:0}).css({'width':'3em'}).keypress( function(e){if(e.which==13) {saveFunc();return false;}} );
    var $unit=$('<select>');  $unit.append($('<option>').val('km').text('km')).append($('<option>').val('mile').text('mile'));
    var $time=$('<input type=number>').prop({min:0}).css({'width':'3em'}).keypress( function(e){if(e.which==13) {saveFunc();return false;}} );
    
    var $head=$('<h3>').append(langHtml.comparePrice.head);
    var $divDist=$('<div>').append(langHtml.Distance,': ',$dist,' ',$unit);
    var $divTime=$('<div>').append(langHtml.Time,' (',langHtml.timeUnit.min[3],'): ',$time);

    var $buttDefault=$('<button>').click(defaultFunc).append(langHtml.Default).css({display:'block','margin':'0.8em 0em'});
    var $buttCancel=$('<button>').click(doHistBack).append(langHtml.Cancel);
    var $buttonSave=$('<button>').click(saveFunc).append(langHtml.Done);
    

    //$el.find('h3:eq(0)').css({'font-weight':'bold'});
    $el.find('p').css({'margin':'0.8em'});
    $divDist.add($divTime).css({'margin-top':'0.8em'});
    var $vSpace=$('<div>').css({height:'0.6em'}),  $mess=$('<div>');
    $el.append($head,$divDist,$divTime,$buttDefault,$buttCancel,$buttonSave,$mess);

    $el.css({'text-align':'left'});

    var $blanket=$('<div>').addClass("blanket");
    var $centerDiv=$('<div>').append($head,$divDist,$divTime,$buttDefault,$buttCancel,$buttonSave,$mess);
    $centerDiv.addClass("Center").css({'width':'20em', height:'18em', padding: '1em'})
    if(boIE) $centerDiv.css({'width':'20em'}); 
    $el.addClass("Center-Container").append($centerDiv,$blanket); //

    return $el;
  };

  $comparePriceDataPop=comparePriceDataPopExtend($('<div>'));

 
  comparePriceInfosSet=function(){$comparePriceButSpan.setUp(); $comparePriceButSpanB.setUp(); $comparePriceButSpanSmall.setUp();};
  comparePriceButSpanExtend=function($el,func){
    $el.setUp=function(){
      $span.html('('+Number(comparePrice.dist).toFixed(2)+' '+distUnit+', '+comparePrice.time+' '+langHtml.timeUnit.min[1]+')');};
    var $span=$('<span>');
    var $butPricePref=$("<button>").append($span).click(function(){$comparePriceDataPop.openFunc(func); return false;});
    if(!boTouch) popupHoverM($butPricePref,$('<div>').html(langHtml.pricePref.pop));
    $el.append($butPricePref);
    //$el.setUp();
 
    return $el;
  };

  comparePriceButSpanSmallExtend=function($el,func){
    $el.setUp=function(){    $span.html(Number(comparePrice.dist).toFixed(2)+' '+distUnit+'<br>'+comparePrice.time+' min<br>');  };

    var $span=$('<span>').css({'font-size':'0.7em'});
    var $butPricePref=$("<button>").text(langHtml.Change).addClass('smallButt').css({padding:'0.3em 0.1em'}).click(function(){$comparePriceDataPop.openFunc(func); return false;});
    if(!boTouch) popupHoverM($butPricePref,$('<div>').html(langHtml.pricePref.pop));
    $el.append($span, $butPricePref);
    //$el.setUp();

    return $el;
  };

  $comparePriceButSpan=comparePriceButSpanExtend($('<span>'),comparePriceInfosSet); $comparePriceButSpan.children('button').prepend(langHtml.comparePrice.head,' ');
  $comparePriceButSpanB=comparePriceButSpanExtend($('<span>'),function(){comparePriceInfosSet(); $vendorInfoDiv.setUpUnits(); });    $comparePriceButSpanB.css({'font-size':'0.78em'});
  $comparePriceButSpanSmall=comparePriceButSpanSmallExtend($('<span>'),comparePriceInfosSet);
   

  setDistUnit=(function(){
    var tmpf=setDistUnit;
    return function(unit){
      if(distUnit!=unit) if(unit=='km') comparePrice.dist*=1.609; else comparePrice.dist/=1.609;
      comparePrice.dist=Number(comparePrice.dist).toString();
      setItem('comparePriceData',{dist:comparePrice.dist, time:comparePrice.time});
      //tmpf(unit);
      tmpf.apply(this, arguments);
      comparePriceInfosSet(); $tHeadLabel.setPricePerDistCanvas();
    };
  })();


  //this.rewriteLang=function(){  };

  this.rewriteObj=function(){ 
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName',StrPropContact, 'coordinatePrecisionM', 'vehicleType');
    $vendorSettingDiv.StrGroupFirst=['image','vehicleType'];
    $vendorSettingDiv.StrGroup=['Vendor','Vehicle'];
    $priceSettingDiv.StrProp=['currency','priceStart','pricePerDist','pricePerHour','distUnit'];
    $filterDiv.StrGroupFirst=['vehicleType','homeTown','created'];
    $filterDiv.StrGroup=['Vehicle','Vendor','Reputation'];
    
    comparePriceInfosSet();

      // vendorInfoDiv
    $vendorInfoDiv.createContainers=function_mod($vendorInfoDiv.createContainers,function(){
      $vendorInfoDiv.find('div[name=comparePrice]').after($comparePriceButSpanB);
    });
    $vendorInfoDiv.setUpUnits=function(){
      var arrStr=['dist','comparePrice','pricePerDist','distUnit'], iMTab=$vendorListCtrlDiv.$tr.data('iMTab');
      for(var i=0;i<arrStr.length;i++){ 
        var $ele=$vendorInfoDiv.$divCont.find('div>span[name='+arrStr[i]+']'), strName=$ele.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
        var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,$ele);  else tmp=MTab[iMTab][strName]; 
        $ele.html(tmp);    
      }
    };
    
      // priceSettingDiv
    $priceSettingDiv.createDivs=function_mod($priceSettingDiv.createDivs,function(){
      var $tmpU=$priceSettingDiv.find('[name=distUnit]').css({'float':'none'});   $tmpU.parent().detach();
      var $tmpPPD=$priceSettingDiv.find('[name=pricePerDist]');$tmpPPD.parent().empty().append(langHtml.PricePer+' ',$tmpU,$tmpPPD);
    });

    var tmpSetPricePerDist=function(iMTab){ var tmp=(distUnit=='mile'?1.609:1) * MTab[iMTab].pricePerDist;  return Number(tmp.toFixed(2));};
    var tmpSetPricePerDistOther=function(iMTab){return tmpSetPricePerDist(iMTab)+'/'+distUnit;};
    var calcComparePrice=function(iMTab){      var rT=MTab[iMTab]; return Number(rT.priceStart)  +tmpSetPricePerDist(iMTab)*comparePrice.dist  +rT.pricePerHour/60*comparePrice.time;    };
    var tmpSetComparePriceOneLineWOCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return Number(tmp.toFixed(2)); };
    var tmpSetComparePriceOneLineWCur=function(iMTab){ var tmp=calcComparePrice(iMTab); return MTab[iMTab].currency+' '+Number(tmp.toFixed(2)); };
    var tmpSetComparePrice=function(boTryTwoLine){ return function(iMTab){
      //var rT=MTab[iMTab], tmp=Number(rT.priceStart)  +tmpSetPricePerDist(iMTab)*comparePrice.dist  +rT.pricePerHour/60*comparePrice.time;
      var rT=MTab[iMTab], tmp=calcComparePrice(iMTab);
      var boTwoLine=(ColsShow.indexOf('image')!=-1) && boTryTwoLine,  strSep=boTwoLine?'<br>':' ';
      return (boMultCurrency?rT.currency+strSep:'')+Number(tmp.toFixed(2)); 
    }};
    var tmpSetComparePriceOneLine=tmpSetComparePrice(0);
    var tmpSetComparePriceTwoLine=tmpSetComparePrice(1);
  

    $.extend(Prop.priceStart, {strType:'number',inpW:4});
    $.extend(Prop.pricePerDist, {
      strType:'number',inpW:4,
      setInfo:tmpSetPricePerDistOther,
      setTabF:tmpSetPricePerDist,sortTabF:tmpSetPricePerDist,
      setMapF:tmpSetPricePerDistOther,setMapMF:tmpSetPricePerDistOther
    }); 
    $.extend(Prop.pricePerHour, {
      strType:'number',inpW:4
    });  
    var tmpSetDistUnit=function(iMTab,$c){$c.children('button').html('('+Number(comparePrice.dist).toFixed(2)+' '+distUnit+', '+comparePrice.time+' '+langHtml.timeUnit.min[3]+')');};
    $.extend(Prop.distUnit, {
      strType:'select',
      crInp:function(){  return $('<select>').append($("<option>").text('km').val(0),  $("<option>").text('mile').val(1));  },
      setInfo:tmpSetDistUnit
    });
    $.extend(Prop.comparePrice, {
      setInfo:tmpSetComparePriceOneLineWOCur,
      setTabF:tmpSetComparePriceTwoLine,sortTabF:tmpSetComparePriceOneLine,
      setMapF:tmpSetComparePriceOneLineWCur,setMapMF:tmpSetComparePriceOneLineWCur
    });

    
      // tHeadLabel
    $tHeadLabel.find('[name=comparePrice]').append($comparePriceButSpanSmall);
    
    var $da=$('<div>'),$db=$('<div>'),$dc=$('<div>'),$dd=$('<div>');
    $tHeadLabel.find('[name=comparePrice]').prepend($da);
    $tHeadLabel.find('[name=priceStart]').prepend($db);
    $tHeadLabel.find('[name=pricePerDist]').prepend($dc);
    $tHeadLabel.find('[name=pricePerHour]').prepend($dd);
    $currencyInfoDivs=$currencyInfoDivs.add($da).add($db).add($dc).add($dd);

    pricePerKMCanvas=makeTextCanvas(langHtml.PricePerKM,-1);    pricePerMileCanvas=makeTextCanvas(langHtml.PricePerMile,-1);
    $tHeadLabel.setPricePerDistCanvas=function(){
      var tmpCanvas=(distUnit=='km')?pricePerKMCanvas:pricePerMileCanvas;
      $tHeadLabel.find('[name=pricePerDist]').children('div:eq(1)').html(tmpCanvas);
    };
    $tHeadLabel.setPricePerDistCanvas();


      // vendorDiv
    var $opt=$([]).push($comparePriceButSpan);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
    $vendorDiv.before($opt);    //$settingDiv.append($opt);

  };
};
//0123456789abcdef

CreatorPlugin.transportUrgent=function(){
  StrPropMain=[].concat('image', 'idTeam', 'displayName','vehicleType', StrPropContact, 'standingByMethod','currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');

  //enumStandingByMethod=Enum.standingByMethod;
  enumStandingByMethod=Prop.standingByMethod.Enum;
  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName',StrPropContact, 'standingByMethod', 'coordinatePrecisionM', 'vehicleType');

    var tmpSetStandingByMethod=function(iMTab,$c){  return langHtml.standingByMethodsLong[Number(  MTab[iMTab].standingByMethod  )]; } 
    var crInpFunc=function(){
      var $c=$('<select>'), arrTmp=langHtml.standingByMethodsLong;
      for(var i=0;i<arrTmp.length;i++){  var $opt=$("<option>").text(arrTmp[i]).val(i);   $c.append($opt);    } 
      return $c;
    };
    $.extend(Prop.standingByMethod, {
      strType:'select',
      crInp:crInpFunc,
      setInfo:tmpSetStandingByMethod,
      setTabF:tmpSetStandingByMethod,
      setMapF:function(iMTab,$c){  return langHtml.standingByMethodsLong[Number(  MTab[iMTab].standingByMethod  )]; },
      setRowButtF:function($span,val,boOn){ var tmp=langHtml.standingByMethodsLong[val]; $span.html(tmp);  }
    });
  };
};
//0123456789abcdef

CreatorPlugin.night=function(){
  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'vehicleType', StrPropContact, 'shiftEnd','currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  
  //this.rewriteLang=function(){};
  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'shiftEnd', 'coordinatePrecisionM', 'vehicleType');

    var tmpSetShiftEnd=makeTimeF('shiftEnd',1);
    boUseTimeDiff.shiftEnd=1;
    var $tmp = timeStampButtExtend($("<button>"),'shiftEnd').css({padding:'0.3em 0.5em'});    $tHeadLabel.find('[name=shiftEnd]').append($tmp);
    $filterDiv.Unit.shiftEnd=langHtml.timeUnit.h[1];

    $.extend(Prop.shiftEnd, {strType:'select',
      crInp:function(){  var $c=$('<select>'); for(var i=0;i<225;i++){ $c.append($("<option>")); }   return $c; },
      setInp:function($c){
        var d=new Date(); d.setMilliseconds(0); d.setSeconds(0); var tmp= Math.round(d.getMinutes()/15);  d.setMinutes(tmp*15);
        var d=d.valueOf(); //alert(d);  alert(Date(d));
        $c.children('option').each(function(i){
          var dv=d+i*15*60*1000, dt=new Date(dv);
          var str=dt.toLocaleTimeString(); str=str.replace(/(\d\d):00/,'$1');
          $(this).text(str).val(dv/1000);
        });
        //if(typeof userInfoFrDB.vendor=='array' && 'shiftEnd' in userInfoFrDB.vendor) {   // If there is a saved value for 'shiftEnd' then try set it as selected
        if(userInfoFrDB.vendor instanceof Array && 'shiftEnd' in userInfoFrDB.vendor) {   // If there is a saved value for 'shiftEnd' then try set it as selected
          var tmp="option[value='"+userInfoFrDB.vendor.shiftEnd+"']";
          var $tmp=$c.children(tmp);   if($tmp.length==1) $tmp.prop('selected', 'selected');
        }
      },
      setInfo:tmpSetShiftEnd,
      sortTabF:tmpSetShiftEnd, setTabF:tmpSetShiftEnd,
      setMapF:tmpSetShiftEnd,setMapMF:tmpSetShiftEnd
    });
    
    Prop.shiftEnd.feat.minName[0]='0';   Prop.shiftEnd.feat.bucketLabel[0]='-';        // Rewrite filterDiv range label
  }
};
//0123456789abcdef
//////////////////////////////////////////////////////////////////////////////////////////////////////////



CreatorPlugin.taxi=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'brand', 'nPassengers', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'brand', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'brand', 'comparePrice'];

  //StrPropTaxi=['nPassengers', 'extraSeat', 'childSeat', 'wheelChairPlaces'];
  var StrPropTaxi=site.StrPropTaxi;
  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'idDriverGovernment', 'vehicleType', 'brand', StrPropTaxi, StrPropContact, 'standingByMethod','shiftEnd','currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');

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
    var $tmp=$('<span>').append(langHtml.helpBub.extraSeat);  $tmp.children('img:eq(0)').prop({src:uExtraSeat,width:200}); langHtml.helpBub.extraSeat=$tmp.html();
    var $tmp=$('<span>').append(langHtml.helpBub.childSeat); 
      $tmp.children('img:eq(0)').prop({src:uChildSeat});$tmp.children('img:eq(1)').prop({src:uChildSeat2}); langHtml.helpBub.childSeat=$tmp.html();
  };

  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', 'idDriverGovernment', StrPropContact, 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM', 'vehicleType', 'brand', StrPropTaxi);

    $.extend(Prop.brand, {strType:'text',inpW:6});
    $.extend(Prop.idDriverGovernment, {strType:'text',inpW:6});
    $.extend(Prop.nPassengers, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    $.extend(Prop.childSeat, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    $.extend(Prop.extraSeat, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
    $.extend(Prop.wheelChairPlaces, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});
  };
};
//0123456789abcdef



CreatorPlugin.transport=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'brand', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'brand', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'brand', 'comparePrice'];

  //var StrCompact=['generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer'];
  var StrCompact=site.StrTransportBool;
  
  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'vehicleType', 'brand','payload', StrCompact, StrPropContact, 'standingByMethod','shiftEnd','currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');

  $comparePriceDataPop.setDefault(10,15); // Arg: dist, time

    // images
  var strPlugin='transport';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 
  uDummy=uSpecImageFolder+'dummy.png';
  uSleepy=uSpecImageFolder+'carSleepy.png';

  this.rewriteLang=function(){
    rewriteLangDriver();
    var Tmp=StrCompact.slice(0,-1);
    for(var i=0;i<Tmp.length;i++) {
      var strName=Tmp[i], $tmp=$('<span>').append(langHtml.helpBub[strName]);  $tmp.children('img:eq(0)').prop({src:uSpecImageFolder+strName+'.jpg',width:200}); langHtml.helpBub[strName]=$tmp.html();
    }
  };

  this.rewriteObj=function(){    
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'standingByMethod', 'shiftEnd', 'coordinatePrecisionM', 'vehicleType', 'brand', 'payload', StrCompact);

    var makeBoF=function(strN){return function(iMTab){ return Number(MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };
    var tmpSetBool=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };

    for(var i=0;i<StrCompact.length;i++) {
      var strName=StrCompact[i];
      var tmpSetF=makeBoF(strName);
      $.extend(Prop[strName], {
        strType:'checkbox', saveInp:inpAsNum,
        setInfo:tmpSetBool,
        setTabF:tmpSetBool,
        setMapF:tmpSetF,setMapMF:tmpSetF,
        setRowButtF:tmpRowButtf
      });
    }
    $.extend(Prop.brand, {strType:'text', inpW:6});
    $.extend(Prop.payload, {strType:'number', inpW:3, saveF:posNumF});
  }
};
//0123456789abcdef


CreatorPlugin.cleaner=function(){
  ColsShowDefault= ['image', 'displayName', 'boHome','boOffice','boIndustrial','boGotEquipment','tel', 'vehicleType', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'boHome','boOffice','boIndustrial','boGotEquipment', 'vehicleType', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  colOneMarkDefault='vehicleType';

  //var StrCleanerBool=['boHome','boOffice','boIndustrial', 'boGotEquipment'];
  var StrBool=site.StrCleanerBool;

  StrPropMain=[].concat('image', 'idTeam', 'displayName','vehicleType', StrBool, StrPropContact, 'shiftEnd','currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Contact','Price','Position','Reputation'];

  $comparePriceDataPop.setDefault(10,120); // Arg: dist, time

    // images
  var strPlugin='cleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.cleaner;
    //langHtml.loginInfo.vendor=langHtml.cleaner;
    //langHtml.Vendor=ucfirst(langHtml.cleaner);
    //langHtml.Vendors=ucfirst(langHtml.cleaners);
    //langHtml.IndependentVendor=langHtml.IndependentCleaner;
    
    //langHtml.vendor=langHtml.cleaner;   langHtml.vendors=langHtml.cleaners;
    //langHtml.theVendor=langHtml.theCleaner;   langHtml.theVendors=langHtml.theCleaners;
    //langHtml.theVendors0=langHtml.theCleaners0;
  };
  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'shiftEnd', 'coordinatePrecisionM', 'vehicleType', StrBool);
    $vendorSettingDiv.StrGroupFirst=['displayName','boHome'];
    $vendorSettingDiv.StrGroup=['Vendor','Other'];
    $filterDiv.StrGroupFirst=['homeTown','created'];
    $filterDiv.StrGroup=['Vendor','Reputation'];

      // vendorInfoDiv 
    var makeBoF=function(strN){return function(iMTab){ return Number(MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

    var tmpSetBool=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };

    for(var i=0;i<StrBool.length;i++) {
      var strName=StrBool[i];
      var tmpSetF=makeBoF(strName);
      $.extend(Prop[strName], {
        strType:'checkbox', saveInp:inpAsNum,
        setInfo:tmpSetBool,
        setTabF:tmpSetBool,
        setMapF:tmpSetF,setMapMF:tmpSetF,
        setRowButtF:tmpRowButtf
      });
    }
  };
};
//0123456789abcdef


CreatorPlugin.windowcleaner=function(){
  ColsShowDefault= ['image', 'displayName', 'boLadder', 'boSkyLift', 'tel', 'vehicleType', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'boLadder', 'boSkyLift', 'vehicleType', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'comparePrice'];
  colOneMarkDefault='vehicleType';

  var StrBool=site.StrCleanerBool;

  StrPropMain=[].concat('image', 'idTeam', 'displayName','vehicleType', StrBool, StrPropContact,'currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Contact','Price','Position','Reputation'];

  $comparePriceDataPop.setDefault(10,120); // Arg: dist, time

    // images
  var strPlugin='windowcleaner';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.windowcleaner;
  };
  
  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'coordinatePrecisionM', 'vehicleType', StrBool);
    $vendorSettingDiv.StrGroupFirst=['displayName','boLadder'];
    $vendorSettingDiv.StrGroup=['Vendor','Other'];
    $filterDiv.StrGroupFirst=['homeTown','created'];
    $filterDiv.StrGroup=['Vendor','Reputation'];

      // vendorInfoDiv 
    var makeBoF=function(strN){return function(iMTab){ return Number(MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   };

    var tmpSetBool=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      //var colT=''; if(data>0) colT='red';
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };

    for(var i=0;i<StrBool.length;i++) {
      var strName=StrBool[i];
      var tmpSetF=makeBoF(strName);
      $.extend(Prop[strName], {
        strType:'checkbox', saveInp:inpAsNum,
        setInfo:tmpSetBool,
        setTabF:tmpSetBool,
        setMapF:tmpSetF,setMapMF:tmpSetF,
        setRowButtF:tmpRowButtf
      });
    }
  };
};
//0123456789abcdef

CreatorPlugin.lawnmower=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'ridingMower', 'pushMower', 'edger', 'idTeam', 'cuttingWidth', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'ridingMower', 'pushMower', 'edger', 'cuttingWidth', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'ridingMower', 'pushMower', 'edger', 'comparePrice'];
  colOneMarkDefault='vehicleType';

  var StrBool=site.StrToolBool;
  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'vehicleType', StrBool, 'cuttingWidth', StrPropContact,'currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','vehicleType','pushMower','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Vehicle','Tools','Contact','Price','Position','Reputation'];

  $comparePriceDataPop.setDefault(10,120); // Arg: dist, time

    // images
  var strPlugin='lawnmower';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 
  uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.lawnmower;
  };

  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'coordinatePrecisionM', StrBool, 'cuttingWidth', 'vehicleType');
    $vendorSettingDiv.StrGroupFirst=['image','vehicleType','pushMower'];
    $vendorSettingDiv.StrGroup=['Vendor','Vehicle','Tools'];
    $filterDiv.StrGroupFirst=['vehicleType','homeTown','pushMower', 'created'];
    $filterDiv.StrGroup=['Vehicle','Vendor','Tools', 'Reputation'];


    var makeBoF=function(strN){return function(iMTab){ return Number(MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   }; 
    var tmpSetBool=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };

    for(var i=0;i<StrBool.length;i++) {
      var strName=StrBool[i];
      var tmpSetF=makeBoF(strName);
      $.extend(Prop[strName], {
        strType:'checkbox',
        saveInp:inpAsNum,
        setInfo:tmpSetBool,
        setTabF:tmpSetBool,
        setMapF:tmpSetF,setMapMF:tmpSetF,
        setRowButtF:tmpRowButtf
      });
    }
    $.extend(Prop.cuttingWidth, {strType:'number', inpW:3, saveInp:posNumOrEmptyF});

  };
};
//0123456789abcdef


CreatorPlugin.snowremoval=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'vehicleType', 'shovel', 'snowblower', 'plow', 'idTeam', 'comparePrice'];
  ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'shovel', 'snowblower', 'plow', 'comparePrice'];
  ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'shovel', 'snowblower', 'plow', 'comparePrice'];
  colOneMarkDefault='vehicleType';

  var StrBool=site.StrToolBool;
  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'vehicleType', StrBool, StrPropContact,'currency', StrPropTransportProtPrice, 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','vehicleType','shovel','tel','currency','dist','created'];
  StrGroupMain=['Vendor','Vehicle','Tools','Contact','Price','Position','Reputation'];

  $comparePriceDataPop.setDefault(10,120); // Arg: dist, time

    // images
  var strPlugin='snowremoval';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 
  uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.snowRemovalWorker;
    //langHtml.loginInfo.vendor=langHtml.snowShoveler;
    //langHtml.Vendor=ucfirst(langHtml.snowShoveler);
    //langHtml.Vendors=ucfirst(langHtml.snowShovelers);
    //langHtml.IndependentVendor=langHtml.IndependentSnowShoveler;
    
    //langHtml.vendor=langHtml.snowShoveler;   langHtml.vendors=langHtml.snowShovelers;
    //langHtml.theVendor=langHtml.theSnowShoveler;  langHtml.theVendors=langHtml.theSnowShovelers;
    //langHtml.theVendors0=langHtml.theSnowShoveler0;
  };

  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'coordinatePrecisionM', StrBool, 'vehicleType');
    $vendorSettingDiv.StrGroupFirst=['image','vehicleType','shovel'];
    $vendorSettingDiv.StrGroup=['Vendor','Vehicle','Tools'];
    $filterDiv.StrGroupFirst=['vehicleType','homeTown','shovel', 'created'];
    $filterDiv.StrGroup=['Vehicle','Vendor','Tools', 'Reputation'];


    var makeBoF=function(strN){return function(iMTab){ return Number(MTab[iMTab][strN])?langHtml.Yes:langHtml.No; }; };
    var tmpRowButtf=function($span,val,boOn){   $span.html(Number(val)?langHtml.Yes:langHtml.No);   }; 
    var tmpSetBool=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,1); var ColT=['','lightgreen'], colT=ColT[data];
      $ele.css({'background':colT});
      return Number(data)?langHtml.Yes:'-';
    };

    for(var i=0;i<StrBool.length;i++) {
      var strName=StrBool[i];
      var tmpSetF=makeBoF(strName);
      $.extend(Prop[strName], {
        strType:'checkbox',
        saveInp:inpAsNum,
        setInfo:tmpSetBool,
        setTabF:tmpSetBool,
        setMapF:tmpSetF,setMapMF:tmpSetF,
        setRowButtF:tmpRowButtf
      });
    }

  };
};
//0123456789abcdef

CreatorPlugin.hourlyPrice=function(){
    // images
  var strPlugin='hourlyPrice';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/';  

  //this.rewriteLang=function(){  };
  this.rewriteObj=function(){

    var tmpSetComparePrice=function(boTryTwoLine){ return function(iMTab){
      var rT=MTab[iMTab], tmp=Number(rT.pricePerHour);
      var boTwoLine=(ColsShow.indexOf('image')!=-1) && boTryTwoLine,  strSep=boTwoLine?'<br>':' ';      return (rT.currency+strSep)+Number(tmp.toFixed(2)); 
    }};
    var tmpSetComparePriceOneLine=tmpSetComparePrice(0),  tmpSetComparePriceTwoLine=tmpSetComparePrice(1);
    //var tmpSetComparePriceOneLineWOCur=function(iMTab){ var rT=MTab[iMTab], tmp=Number(rT.pricePerHour); return Number(tmp.toFixed(2)); };
    var tmpSetComparePriceOneLineWCur=function(iMTab){ var rT=MTab[iMTab], tmp=Number(rT.pricePerHour); return rT.currency+' '+Number(tmp.toFixed(2)); };
    

    $.extend(Prop.pricePerHour, {
      strType:'number',inpW:4,
      setInfo:tmpSetComparePriceOneLineWCur,
      setTabF:tmpSetComparePriceTwoLine,sortTabF:tmpSetComparePriceOneLine,
      setMapF:tmpSetComparePriceOneLineWCur,setMapMF:tmpSetComparePriceOneLineWCur
    });
  };
};
//0123456789abcdef


CreatorPlugin.fruitpicker=function(){
  ColsShowDefault= ['image', 'displayName','tel', 'vehicleType', 'idTeam', 'pricePerHour'];
  ColsShowDefaultS= ['image', 'displayName', 'vehicleType', 'pricePerHour'];
  ColsShowDefaultRS= ['image', 'displayName', 'vehicleType', 'pricePerHour'];
  colOneMarkDefault='vehicleType';

  StrPropMain=[].concat('image', 'idTeam', 'displayName', 'vehicleType', StrPropContact, 'pricePerHour', 'lastPriceChange', StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','tel','pricePerHour','dist','created'];
  StrGroupMain=['Vendor','Contact','Price','Position','Reputation'];

    // images
  var strPlugin='fruitpicker';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.picker;
    boRewriteVendor=true;
    langHtml.loginInfo.vendor=langHtml.picker;
    langHtml.Vendor=ucfirst(langHtml.picker);
    langHtml.Vendors=ucfirst(langHtml.pickers);
    langHtml.IndependentVendor=langHtml.IndependentPicker;
    
    langHtml.vendor=langHtml.picker;     langHtml.vendors=langHtml.pickers;
    langHtml.theVendor=langHtml.thePicker;   langHtml.theVendors=langHtml.thePickers;
    langHtml.theVendors0=langHtml.thePickers0;
  }
  this.rewriteObj=function(){

    $priceSettingDiv.StrProp=['currency','pricePerHour'];
    $filterDiv.StrGroupFirst=['homeTown','created'];
    $filterDiv.StrGroup=['Vendor','Reputation'];
  }
};
//0123456789abcdef

CreatorPlugin.programmer=function(){
  ColsShowDefault= ['image', 'displayName', 'tel', 'idTeam', 'pricePerHour','c','java','php','javascript'];
  ColsShowDefaultS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  ColsShowDefaultRS= ['image', 'displayName', 'pricePerHour','c','java','php','javascript'];
  colOneMarkDefault='image';

  var StrProgrammerLang=site.StrProgrammerLang;
  var StrSpec=StrProgrammerLang.concat('otherLang');
 
  StrPropMain=[].concat('image', 'idTeam', 'displayName', StrPropContact, 'pricePerHour', 'lastPriceChange', StrSpec, StrPropPos, StrPropRep, 'nReport');
  StrGroupFirstMain=['image','tel','pricePerHour','dist','c','created'];
  StrGroupMain=['Vendor','Contact','Price','Position','Languages','Reputation'];

    // images
  var strPlugin='programmer';
  var uSpecImageFolder=uCommon+'/pluginLib/'+strPlugin+'/'; 
  //uDummy=uSpecImageFolder+'dummy.png';

  this.rewriteLang=function(){
    langHtml.vendorRewritten=langHtml.programmer;
    boRewriteVendor=true;
    langHtml.loginInfo.vendor=langHtml.programmer;
    langHtml.Vendor=ucfirst(langHtml.programmer);
    langHtml.Vendors=ucfirst(langHtml.programmers);
    langHtml.IndependentVendor=langHtml.IndependentProgrammer;
    
    langHtml.vendor=langHtml.programmer;    langHtml.vendors=langHtml.programmers;
    langHtml.theVendor=langHtml.theProgrammer; langHtml.theVendors=langHtml.theProgrammers;
    langHtml.theVendors0=langHtml.theProgrammers0;
  }
  this.rewriteObj=function(){
    $vendorSettingDiv.StrProp=[].concat('image', 'idTeamWanted', 'displayName', StrPropContact, 'coordinatePrecisionM', StrSpec);
    $vendorSettingDiv.StrGroupFirst=['displayName','c'];
    $vendorSettingDiv.StrGroup=['Vendor','Languages'];
    $priceSettingDiv.StrProp=['currency','pricePerHour'];
    $filterDiv.StrGroupFirst=['homeTown','c','created'];
    $filterDiv.StrGroup=['Vendor','Languages','Reputation'];

    var tmpSetGrade=function(iMTab,$ele){
      var data=MTab[iMTab][$ele.attr('name')]; data=bound(data,0,5); var ColT=['','lightblue','lightgreen','yellow','orange','red'], colT=ColT[data];
      $ele.css({'background':colT});
      return data;
    }
/*    var makeCrInpFunc=function(i){return function(){
      var $c=$('<select>'), arrTmp=[0,1,2,3,4,5];
      for(var j=0;j<arrTmp.length;j++){  var $opt=$("<option>").text(arrTmp[j]).val(j);   $c.append($opt);    } 
      return $c;
    };};*/
    var crInpFunc=function(){
      var $c=$('<select>'), arrTmp=[0,1,2,3,4,5];
      for(var j=0;j<arrTmp.length;j++){  var $opt=$("<option>").text(arrTmp[j]).val(j);   $c.append($opt);    } 
      return $c;
    };
    for(var i=0;i<StrProgrammerLang.length;i++) {
      var strName=StrProgrammerLang[i];
      $.extend(Prop[strName], {
        strType:'select',
        crInp:crInpFunc,
        setInfo:tmpSetGrade,
        setTabF:tmpSetGrade
      });
    }
    $.extend(Prop.otherLang, {strType:'text',inpW:6});
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


doHistReplace=function(obj, indDiff){
  if(typeof indDiff=='undefined') indDiff=0;
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
    if(typeof obj=='object') var $view=obj.$view; else continue;
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


//var maskToInd=function(mask){  var ind=[];  for(var i=0;i<mask.length;i++) {if(mask[i]) ind.push(i);} return ind; }
var maskToInd=function(mask,ind){  if(typeof ind=='undefined') ind=[]; else ind.length=0;  for(var i=0;i<mask.length;i++) {if(mask[i]) ind.push(i);} return ind; }

//var indToMask=function(ind,len){   var mask=[]; for(var i=0;i<len;i++) {mask[i]=0;}  for(var i=0;i<ind.length;i++) {mask[ind[i]]=1;} return mask; } 
var indToMask=function(ind,len,mask){  if(typeof mask=='undefined') mask=Array(len); else mask.length=len; for(var i=0;i<len;i++) {mask[i]=0;}  for(var j=0;j<ind.length;j++) {mask[ind[j]]=1;} return mask; } 

var createColJIndexNamesObj=function(arrName){
  var o={};
  for(var i=0;i<arrName.length;i++){ 
    var tmp="j"+arrName[i][0].toUpperCase()+arrName[i].substr(1);       o[tmp]=i;
  }
  return o;
}


var createChildInd=function(arrI,arrO){
  var len=arrI.length;
  if(typeof arrO=='undefined') arrO=Array(len); else arrO.length=len;
  for(var i=0;i<len;i++){  arrO[arrI[i]]=i;  }  return arrO;
}


var setUpColsShowIndCurrency=function(){
  myCopy(ColsShowCurrency,ColsShow);
  if(boMultCurrency){
    if(ColsShow.indexOf('currency')==-1) ColsShowCurrency.push('currency');
  }
};



popUpExtend=function($el){
"use strict"
  $el.openPop=function() {
    $messageText.detach(); $el.append($messageText);
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
    $body.append($messageText);
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
  $el.showToast=function(){
    $el.fadeIn(0);
    t=setTimeout(hideToast, 4000);
  }
  var t;
  $el.click(function(){clearTimeout(t); hideToast();});
  $el.addClass('toast').hide();
  return $el;
}






var vippButtonExtend=function($el){
"use strict"
  $el.setStat=function(bo1){
    if(!bo1) {$el.css(o0);} else {$el.css(o1);} 
    $el.attr({boOn:bo1});
  }
  var o0={background:'url('+uVipp0+') no-repeat'}, o1={background:'url('+uVipp1+') no-repeat'};
    
  $el.attr({boOn:0});
  $el.css({'background':'url('+uVipp0+') no-repeat',height:'33px',width:'90px',zoom:'60%','vertical-align':'-0.5em',cursor:'pointer',display:'inline-block'}).addClass('unselectable');
  $el.on('click',function(){var t=1-$el.attr('boOn');   $el.setStat(t);});
  return $el;
}

var toggleButtonExtend=function($el){
  $el.setStat=function(bo1){
    if(bo1) {$el.css(colOn);} else {$el.css(colOff);} 
    //$el.toggleClass('on',Boolean(bo1));
    $el.attr({boOn:bo1});
  }
  var colOn={background:'#4f4'}, colOff={background:''};
    
  $el.attr({boOn:0});
  $el.css({height:'1em',width:'1em'});
  $el.on('click',function(){var t=1-$el.attr('boOn');   $el.setStat(t);});
  return $el;
}



 

/*******************************************************************************************************************
 * Some loose functions
 *******************************************************************************************************************/
 
 
var messExtend=function($el){
"use strict"
  //$el.resetMess=function(){ $el.html(''); clearTimeout(messTimer); }
  $el.resetMess=function(time){ 
    if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    else {$el.html(''); clearTimeout(messTimer);} 
  }
  $el.setMess=function(str,time,boRot){  
    $el.html(str);  clearTimeout(messTimer); 
    if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    if(boRot) $el.append($imgBusy);
  };
  $el.appendMess=function(str,time,boRot){  
    $el.append(str);  clearTimeout(messTimer); 
    if(typeof time =='number')     messTimer=setTimeout(resetMess,time*1000);
    if(boRot) $el.append($imgBusy);
  };
  var messTimer;
  $el.addClass('message').css({'z-index':8100,position:'fixed'}); 
  return $el;
}



/*******************************************************************************************************************
 * Menu-divs
 *******************************************************************************************************************/

var adminDivExtend=function($el){ 
"use strict"
  $el.toString=function(){return 'adminDiv';}
  $el.setUp=function(data){   
    $inpPayLev.val(data.payLev);   $inpBoTerm.prop({checked:Boolean(Number(data.boTerminationCheck))});  
    boShowTeam=Boolean(Number(data.boShowTeam)); $inpBoShowTeam.prop({checked:boShowTeam}); 
    //$filterDiv.setBoShowTeam(boShowTeam);
    $filterDiv.children('[name=idTeam]').toggle(boShowTeam);
    $markSelectorDiv.children('table').children('tbody').children('[name=idTeam]').toggle(boShowTeam);
    $columnSelectorDiv.children('table').children('tbody').children('[name=idTeam]').toggle(boShowTeam);
    $vendorSettingDiv.find('[name=idTeamWanted]').parent().toggle(boShowTeam);
    if(!boShowTeam) {arrValRemove(ColsShowDefault,'idTeam'); arrValRemove(ColsShow,'idTeam');  setItem('ColsShow',ColsShow);}
  }

  var $buttMonitorClear=$('<button>').html('Clear Monitor').css({display:'block','margin-top':'1em'}).click(function(){    var vec=[['adminMonitorClear',1]];   majax(oAJAX,vec);  });
  
    //set payLev  
  $el.saveFunc=function(){    
    var data={payLev:Number($inpPayLev.val()),boTerminationCheck:Number($inpBoTerm[0].checked),boShowTeam:Number($inpBoShowTeam[0].checked)}; $el.setUp(data);
    //var vec=[['setSetting',data],['adminMakeOfferFiles',{payLev:data.payLev}]];   majax(oAJAX,vec);
    var vec=[['setSetting',data]];   majax(oAJAX,vec);
  }
  var $inpPayLev=$('<input>').prop({type:'number',min:0,value:0,step:1,max:2});
  var $inpBoTerm=$('<input>').prop({type:'checkbox'});
  var $inpBoShowTeam=$('<input>').prop({type:'checkbox'});
  var $pPayLev=$('<p>').css({'margin-top':'1em'}).append('PayLev:',$inpPayLev);
  var $pBoTerm=$('<p>').css({'margin-top':'1em'}).append('boTerminationCheck:',$inpBoTerm);
  var $pBoShowTeam=$('<p>').css({'margin-top':'1em'}).append('boShowTeam:',$inpBoShowTeam);

  $el.append($pPayLev,$pBoTerm,$pBoShowTeam);
  $el.css({'text-align':'left'});
  return $el;
}
var adminFootExtend=function($el){
"use strict"
  var $buttonSave=$('<button>').click($adminDiv.saveFunc).append(langHtml.Save).addClass('flexWidth').css({'float':'left', 'margin-right':'.2em'});
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Admin settings').addClass('footDivLabel');
  $el.append($buttonBack,$buttonSave, $span).addClass('footDiv'); 
  return $el;
}


var marketerDivExtend=function($el){
  $el.removeClass().css({width:'100%'});
  $el.css({'text-align':'left'});
  return $el;
}
var marketerFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Marketer settings').addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv'); 
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



var seeUnActivePopExtend=function($el){ 
"use strict"
  $el=popUpExtend($el);  
  $el.css({'max-width':'16em', padding: '1.1em'});
  $el.openFunc=$el.openPop; 
  var $im=$('<img>').prop({src:uSleepy});
  var $now=$('<button>').html(langHtml.SeeUnActivePopMessButt).click(function(){
    $filterDiv.Filt.filtClear();
    loadTabStart(1); $el.closePop();
  }).css({display:'block','margin-top':'1em'});
  var $ok=$('<button>').append(langHtml.OK).click($el.closePop).css({display:'block','margin-top':'1em'});
  var $p1=$('<p>').append($im).css({'text-align':'center'});
  var $tmp=$(langHtml.SeeUnActivePopMess);
  var $p2=$tmp.eq(0), $p3=$tmp.eq(1);
  var tmpFeatDefault=Prop.posTime.feat.myDefault[1]
  $p2.children('span:last').last().append(Prop.posTime.feat.max[tmpFeatDefault-1]);
  //var $pButt=$('<p>').append($ok,$now).css({'margin-top':'1em'});
  $el.append($p1,$p2,$p3,$ok,$now);  
  return $el;
}

var dummyShowingToastExtend=function($el){ 
"use strict"
  $el=toastExtend($el); 
  var $im=$('<img>').prop({src:uDummy}).css({margin:'auto',display:'block'});
  var $p1=$('<span>').append(langHtml.DummiesShowingMess);
  var $p2=$('<span>').append($im);
  //var $ok=$('<button>').append(langHtml.OK).click($el.closePop).css({display:'block','margin-top':'1em'});
  $el.append($p1,$im);
  return $el;
}

/*
 * agreementStart
 */

var agreementStartExtend=function($el){
"use strict"
  $el=popUpExtend($el);
  $el.openFunc=$el.openPop;  
  $el.compareLocalDates=function(boVendor){
    var boFirst=0;
    dateLocal=getItem('agreInformedDate'); if(dateLocal===null) {dateLocal=[0,0]; }
    if(dateLocal[boVendor]===0) boFirst=1;  //if the local stored time is 0 then boFirst shall be true
    var boNew=0;  if(dateTextComp[boVendor]>dateLocal[boVendor]) {boNew=1;}
    
    //$el.find('span').hide();
    //var $d0=$el.find('span:eq(0)'), $d1=$el.find('span:eq(1)'); 
    //if(boFirst) $d0.show(); else $d1.show();
    $d0.toggle(Boolean(boFirst));  $d1.toggle(Boolean(1-boFirst));
    //return [boFirst,boNew];
    return {boFirst:boFirst,boNew:boNew};
    //return boNew;
  }  
  $el.setLocalDates=function(boVendor){
    //setItem('agreInformedDate',dateTextComp);
    if(boVendor) setItem('agreInformedDate',dateTextComp); // Write both
    else {var dateTextTmp=[dateTextComp[0],dateLocal[1]]; setItem('agreInformedDate',dateTextTmp);} // Write only the first
  }
  $el.css({ width:'25em', padding: '2em'});
  //$el.find('button:eq(0)').click($el.closePop);
  var $buttonOK=$('<button>').append(langHtml.OK).click($el.closePop);
  var $d0=$('<span>').append(langHtml.agreement[0]), $d1=$('<span>').append(langHtml.agreement[1]);

  var dateLocal=[];
  var vStr=['agreementReporterHead','agreementVendorHead'];
  var dateText=[];
  for(var i=0;i<vStr.length;i++){
    var arrT=langHtml[vStr[i]].match(/(\d\d\d\d)-(\d\d)-(\d\d)/); 
    dateText[i]=(new Date(arrT[1],arrT[2],arrT[3]))/1000;
  }
  var dateTextComp=[0,0]; dateTextComp[0]=dateText[0];  // dateTextComp: date of text to compare with dateLocal (for reporter resp vendor) (vendor shall read both texts)
  for(var i=0;i<vStr.length;i++){
    if(dateText[i]>dateTextComp[1]) dateTextComp[1]=dateText[i];
  }

  return $el;
}






/*******************************************************************************************************************
 * payDiv
 *******************************************************************************************************************/

var payDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'payDiv';}
  var setTax=function(boTax){
    if(boTax) {
      $inpButtId.val(storedButt.payTax);
      $select.empty().append($optT);
      $VATDiv.show(); $inEu1.prop({checked:1});
    } else {
      $inpButtId.val(storedButt.pay);
      $select.empty().append($opt);
      $VATDiv.hide();  $inEu0.prop({checked:1}); 
    }
     //$os2.val('');
  }
  var sendRebateCode=function(){
    var tmp=$rebateCode.val(); //if(tmp.length!=rebateCodeLen ) {$messageText.html($lengthErrMess.html()); return false;}  
    var vec=[['SUseRebateCode',{rebateCode:tmp.slice(0,10)}]];   majax(oAJAX,vec);  // , ['setupById',{Role:'vendor'}]
  }
  $el.setUp=function(){
    $rebateCode.val('');
    $inpIdUser.val(userInfoFrDB.vendor.idUser);
    setTax(0);
    if($payButton.tDiff>3600*24*365) {$formDiv.hide();  $rebateCodeDiv.hide(); $deadLineMess.show();} 
    else {$formDiv.show();  $rebateCodeDiv.show(); $deadLineMess.hide();}
  }
  var mySubmit=function(){
    $inpTime.val($select.val());
    $inpVatNumber.val($vatNumber.val());
    $form.submit();
  }
  
  var $formDiv=$el.children('div:eq(0)').css({'margin-bottom':'0em','margin-top':'0.5em','background-color':'#fdd',border:'solid 1px'});
  var $select=$formDiv.find('select');
  var $inEu0=$formDiv.find(':radio:eq(0)');   $inEu0.prop({name:'inEU'}).val(0).change(function(){setTax(0);}); 
  var $inEu1=$formDiv.find(':radio:eq(1)');   $inEu1.prop({name:'inEU'}).val(1).change(function(){setTax(1);}); 
  var $VATDiv=$formDiv.find('p:eq(3)'); 
  var $vatNumber=$VATDiv.children('input');
  //var urlPaypalButton="https://www.paypal.com/en_US/i/btn/btn_paynowCC_LG.gif";
  //var urlPaypalButton="https://www.paypalobjects.com/webstatic/en_US/btn/btn_paynow_cc_144x47.png";
  var urlPaypalButton="https://www.paypalobjects.com/webstatic/en_US/btn/btn_pponly_142x27.png";
  var $img=$formDiv.find('img').prop({src:urlPaypalButton,border:"0"}).css({display:'block','margin-top':'0.3em',cursor:'pointer'}).click(mySubmit);
  $inEu0.prop({checked:1});

  $formDiv.children('p').css({margin:'0.8em 0'});
  //$el.css({'max-width':'400px'});
  

    // opt, optT
  var arrSelVal=['1 month','6 months','12 months'];
  var arrNMon=[1,6,12];
  var $opt=$([]),$optT=$([]);
  var cur=storedButt.cur;
  var prices=storedButt.prices;
  for(var i=1;i<arrNMon.length;i++){
    var n=arrNMon[i];
    var tmpM; if(i==0) tmpM=langHtml.timeUnit.mo[2]; else tmpM=langHtml.timeUnit.mo[3];
    var price=prices[i];
    var $otmp=$('<option>').append(n+' '+tmpM+' '+price+' '+cur).val(arrSelVal[i]);
    var $otmpT=$('<option>').append(n+' '+tmpM+' '+price+' '+cur+' ('+(price*1.25)+' '+cur+')').val(arrSelVal[i]);
    $opt=$opt.add($otmp);    $optT=$optT.add($otmpT);
  }


    // form
  var $form=$('<form>');  $form.prop({action:urlPayPal,method:'post'});
  var $inpCmd=$('<input>').prop({name:"cmd", value:"_s-xclick"});
  var $inpButtId=$('<input>').prop({name:"hosted_button_id"}); 
  var $on0=$('<input>').prop({name:"on0", value:"time"});
  var $inpTime=$('<input>').prop({name:"os0"});
  var $on1=$('<input>').prop({name:'on1',value:'idUser'});
  var $inpIdUser=$('<input>').prop({name:'os1'});
  var $on2=$('<input>').prop({name:'on2',value:'vatNumber'});
  var $inpVatNumber=$('<input>').prop({name:'os2'});
  var $currency=$('<input>').prop({name:"currency_code", value:cur});
  var $submitFix=$('<input type="submit" value="submit"/>'); // IE need a "type=submit" in the form
  $form.append($inpCmd,$inpButtId,$on0,$inpTime,$on1,$inpIdUser,$on2,$inpVatNumber,$currency,$submitFix);
  $form.hide(); $el.append($form); // IE needs it mounted to DOM
  

    // rebateCodeDiv
  var $rebateCodeDiv=$el.children('div:eq(1)').css({'margin-top':'0.7em'});
  var $rebateCode=$rebateCodeDiv.children('input').prop({size:8}).keypress( function(e){ if(e.which==13) {sendRebateCode();return false;}} );
  var $rebateCodeButton=$rebateCodeDiv.children('button').click(sendRebateCode);
  
    // deadLineMess
  var $deadLineMess=$el.children('div:eq(2)').css({'margin-top':'1em'});
 
    // paymentListShowButt
  var $paymentListShowButt=$deadLineMess.nextAll('button:eq(0)').click(function(){ 
    $paymentListDiv.load();
    $paymentListDiv.setVis();
    doHistPush({$view:$paymentListDiv});
  });
  

  $el.css({'text-align':'left'});
  return $el;
}
var payFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.Deadline).addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv'); 
  return $el;
}



var payButtonExtend=function($el){
  var timeSpanExtend=function($el){
    $el.setUp=function(boT){if(boT) {t1=setInterval(blinkF,500);} else {clearInterval(t1); $timeSpan.css({background:'transparent'});} }
    var blinkF=function(){ boOn=1-boOn; tmpStr=boOn?'#f33':'transparent'; $el.css({background:tmpStr}); }
    var t1,boOn=0,tmpStr;
    return $el;
  }
  $el.setUp=function(){
    var tTermination=userInfoFrDB.vendor.terminationDate, tCur=(new Date())/1000; //tTermination=0;
    $el.tDiff=intMax;   var num=' - ', unit='', boBlink=0; 
    if(tTermination!=intMax) {  
      $el.tDiff=Math.max(tTermination-tCur,0); if($el.tDiff<3600*24*3) {boBlink=1;} 
      var arrT=UTC2ReadableDiff($el.tDiff, 0, 1);  num=arrT[0]; unit=arrT[1];
    } 
    $num.html(num); $unit.html(unit);
    $timeSpan.setUp(boBlink);
  }
  var $timeSpan=timeSpanExtend($el.children('span'));
  var $num=$timeSpan.children('span.num').removeClass();
  var $unit=$timeSpan.children('span.unit').removeClass();  
  return $el;
}

var entryTest=function(arrMustBeSet,arrPosNum,arrPosNumOrEmpty){
  for(var i=0;i<arrPosNum.length;i++){
    var id=arrPosNum[i], tmp=$('#'+id).val();  if(!(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive'); return false;}     }
  for(var i=0;i<arrMustBeSet.length;i++){
    var id=arrMustBeSet[i], tmp=$('#'+id).val();  if(tmp.length==0) {setMess(id+' can not be empty'); return false;}     }
  for(var i=0;i<arrPosNumOrEmpty.length;i++){
    var id=arrPosNumOrEmpty[i], tmp=$('#'+id).val();  if(tmp.length>0 && !(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive'); return false;}     }

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

  var $button=$('<button>').append($spriteOnButt).click(function(e){   if(el.isOpen()) { el.closeFunc();}  else { openFunc(e);}  });
  var $divMenu=$('<div>').css({position:'absolute',border:'black 1px solid',background:'#fff',left:0+'px',top:28+'px','z-index':1});
  $(el).append($button,$divMenu);
  
  for(var i=0;i<iObj.order.length;i++){
    var $span=$(spriteExtend($('<span>')[0],iObj));
    $span.css({position:'relative', top:'50%',  transform:'translateY(-50%)'})
    var $div=$('<div>').append($span).click(menuClickF).css({'height':'2em'}); //,display:'block'
    $div.on('mouseover', mouseOver);
    $div.on('mouseout', mouseOut);
    $div[0].i=i
    $span[0].mySet(i); $divMenu.append($div);
  }

  $divMenu.hide();
  $('html').click(el.closeFunc);
    
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
  
  $(el).css({display:'inline-block',position: 'relative',overflow:'hidden',bottom:'-1px'}); 
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
 * vendorSettingDiv
 *******************************************************************************************************************/

var vendorSettingDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'vendorSettingDiv';}
  $el.save=function(){ 
    resetMess();  
    var o={},boErr=0;
    $inps.each(function(i){
      var $inp=$(this),  strName=$inp.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
      //if('saveInp' in tmpObj) {var tmp=tmpObj.saveInp($inp); if(tmp===false) boErr=1; else if(tmp===null); else o[strName]=tmp;} else o[strName]=$inp.val().trim();
      if('saveInp' in tmpObj) {var [err,val]=tmpObj.saveInp($inp); if(err) {setMess(err); boErr=1; } else o[strName]=val;} else o[strName]=$inp.val().trim();
    }); 
    if(boErr) return;
    var vec=[['VUpdate',o,$el.setUp], ['setupById',{Role:'vendor'}]];   majax(oAJAX,vec);
    setMess('',null,true); 
  }

  $el.createDivs=function(){
    for(var i=0;i<$el.StrProp.length;i++){      
      var strName=$el.StrProp[i];
      var $imgH=''; if(strName in $el.helpBub ) {    var $imgH=$imgHelp.clone();   popupHoverM($imgH,$el.helpBub[strName]);         }

      //var strLabel=ucfirst(strName)+': '; if(strName in langHtml.label) strLabel=langHtml.label[strName]+': ';
      var strLabel=calcLabel(langHtml.label, strName)+': ';

      var $inp='', tmpObj=(strName in Prop)?Prop[strName]:emptyObj,  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('crInp' in tmpObj) $inp=tmpObj.crInp(); else $inp=$('<input type='+strType+'>');
      if('inpW' in tmpObj)  $inp.css({width:tmpObj.inpW+'em'});
      $inp.attr('name',strName);
      var $divLCH=$('<div>').append(strLabel,$imgH,$inp);
      $divs.push($divLCH);
      $inps.push($inp);
    }
    $divCont.append($divs);
    $divCont.find('input[type=text],[type=number],[type=tel],[type=email],[type=url]').keypress( function(e){ if(e.which==13) {save();return false;}} );
    var $tmp=$divCont.find('input[type=number]').prop({min:0});
    $divCont.find('input,select').css({'float':'right',clear:'both'});

    var $checkBoxes=$divCont.find('input[type=checkbox]');
    if(boAndroid) $checkBoxes.css({'-webkit-transform':'scale(2,2)'}); else $checkBoxes.css({width:'1.4em',height:'1.4em'});

    $divs.css({position:'relative', margin:'.8em 0','min-height':'2em'}); //,overflow:'hidden'
    //$inps.css({position:'absolute',right:'0px'}); //,overflow:'hidden'

      // Add labels
    for(var i=0;i<$el.StrGroup.length;i++){
      var $h=$('<span>').append(langHtml[$el.StrGroup[i]],':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      $el.find('[name='+$el.StrGroupFirst[i]+']').parent().before('<hr style="clear:both">',$h);
    }
  }  
  $el.setUp=function(){
    $inps.each(function(i){
      var $inp=$(this), strName=$inp.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj,  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('setInp' in tmpObj) tmpObj.setInp($inp); 
      else {
        var data=userInfoFrDB.vendor[strName];
        if(strType==='checkbox') $inp.prop('checked',Number(data));   else $inp.val(data);
      }
    });    
        
    return true; 
  }
  
  var $inps=$([]);

  $el.helpBub=$.extend({},helpBub);

  var $divCont=$('<div>'), $divs=$([]);
  $el.append($divCont);

  $el.css({'text-align':'left'});
  return $el;
}
var vendorSettingFootExtend=function($el){
"use strict"
  var $buttonSave=$('<button>').click($vendorSettingDiv.save).append(langHtml.Save).addClass('flexWidth').css({'float':'left', 'margin-right':'.2em'});
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.DriverSettings).addClass('footDivLabel');
  $el.append($buttonBack, $buttonSave, $span).addClass('footDiv'); 
  return $el;
}


spanIdTeamWantedExtend=function(el){
  el.setStat=function(){
    var idTmp=userInfoFrDB.vendor.idTeamWanted, tag=userInfoFrDB.vendor.imTagTeam;
    if(idTmp!=0){ var strTmp=uTeamImage+idTmp+'?v='+tag; $thumbDis.prop({src:strTmp}); $thumbDis.show(); $spanDisNApproved.show(); $inp.val(idTmp);}
    else { $thumbDis.hide(); $spanDisNApproved.hide(); $inp.val('');}

    var idTeam=userInfoFrDB.vendor.idTeam; $spanDisNApproved.toggle(idTmp!=idTeam);
  }
  var $inp=$('<input type=text>').css({width:'3em'});
  var $thumbDis=$('<img>').css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  var $spanDisNApproved=$('<span>').append(langHtml.NotYetApproved).css({'vertical-align':'middle','margin-left':'0.5em'}); //'float':'right',clear:'both'
  $(el).append($inp, $thumbDis,$spanDisNApproved);
  el.$inp=$inp; return el;
}



/*
 * priceSettingDiv
 */


var priceSettingDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'priceSettingDiv';}
  $el.save=function(){ 
    resetMess();  
    var o={},boErr=0;
    $inps.each(function(i){
      var $inp=$(this),  strName=$inp.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
      //if('saveInp' in tmpObj) {var tmp=tmpObj.saveInp($inp); if(tmp===false) boErr=1; else o[strName]=tmp;}       else o[strName]=$inp.val().trim();
      if('saveInp' in tmpObj) {var tmp=tmpObj.saveInp($inp); if(tmp[0]) {setMess(tmp[0]); boErr=1; } else o[strName]=tmp[1];} else o[strName]=$inp.val().trim();
    }); 
    if(boErr) return;
    o.boPrice=1;
    var vec=[['VUpdate',o,$el.setUp], ['setupById',{Role:'vendor'}]];   majax(oAJAX,vec);
    setMess('',null,true); 
  }

  $el.createDivs=function(){
    for(var i=0;i<$el.StrProp.length;i++){      
      var strName=$el.StrProp[i];
      var $imgH=''; if(strName in helpBub ) {    var $imgH=$imgHelp.clone();   popupHoverM($imgH,helpBub[strName]);         }

      //var strLabel=ucfirst(strName)+': '; if(strName in langHtml.label) strLabel=langHtml.label[strName]+': ';
      var strLabel=calcLabel(langHtml.label, strName)+': ';

      var $inp='', tmpObj=(strName in Prop)?Prop[strName]:emptyObj,  strType=('strType' in tmpObj)?tmpObj.strType:'';
      if('crInp' in tmpObj) $inp=tmpObj.crInp(); else $inp=$('<input type='+strType+'>');     
      if('inpW' in tmpObj)  $inp.css({width:tmpObj.inpW+'em'}); 
      $inp.attr('name',strName);
      var $divLCH=$('<div>').append(strLabel,$imgH,$inp);
      $divs.push($divLCH);
      $inps.push($inp);
    }
    $divCont.append($divs);
    $divCont.find('input[type=text],[type=number]').keypress( function(e){ if(e.which==13) {save();return false;}} );
    var $tmp=$divCont.find('input[type=number]').prop({min:0});
    $divCont.find('input,select').css({'float':'right',clear:'both'});

    $divs.css({margin:'.8em 0','min-height':'2em'});
  }
  var $inps=$([]);


  $el.setUp=function(){
    $inps.each(function(i){
      var $inp=$(this);
      var strName=$inp.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
      if('setInp' in tmpObj) tmpObj.setInp($inp); else $inp.val(userInfoFrDB.vendor[strName]);
    });    
        
    return true; 
  }
  $el.StrProp=[];
  var $divCont=$('<div>'), $divs=$([]);
  $el.append($divCont);
  
  $el.css({'text-align':'left'});
  return $el;
}
var priceSettingFootExtend=function($el){
"use strict"
  var $buttonSave=$('<button>').click($priceSettingDiv.save).append(langHtml.Save).addClass('flexWidth').css({'float':'left', 'margin-right':'.2em'});
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.Prices).addClass('footDivLabel');
  $el.append($buttonBack, $buttonSave, $span).addClass('footDiv'); 
  return $el;
}





/*
 * quickDiv
 */

var quickDivExtend=function($el){
"use strict"
 
  
  var myHide=function(){
    setMess('',null,true); //$imgBusyL.css({visibility:''});//show();
    var point=merProj.fromLatLngToPointV($mapDiv.latLngMe); 
    var vec=[['VHide',{x:point[0],y:point[1]}], ['setupById',{Role:'vendor'}]];  majax(oAJAX,vec);
  }

  $el.setUp=function(){
    var boShow=Number(userInfoFrDB.vendor.boShow);  //$imgBusyL.css({visibility:'hidden'});//hide();
    //var tmpS,tmpH,str; if(boShow) { str=langHtml.NewPos; tmpS='#0f0'; tmpH=colGray;}else { str=langHtml.Visible; tmpS=colGray; tmpH='#f00'; }
    var tHide=Number(userInfoFrDB.vendor.posTime)+Number(userInfoFrDB.vendor.hideTimer), tDiff=tHide-curTime; 
    var tDiff=UTC2ReadableDiff(tDiff);
    var tmpS,tmpH,str; if(boShow) { str=tDiff; tmpS='#0f0'; tmpH=colGray;}else { str=langHtml.On; tmpS=colGray; tmpH='#f00'; }
    $butShowWPos.html(str).css('background-color', tmpS); $buthide.css('background-color', tmpH); 
    $spanDragMess.toggle(Boolean(1-boShow));

    //var tmpMi=userInfoFrDB.vendor.hideTimer, bestFit=intMax, bestVal;
    //for(var i=0;i<arrHideTime.length;i++) { var tmp=Math.abs(tmpMi-arrHideTime[i]); if(tmp<bestFit) {bestFit=tmp; bestVal=arrHideTime[i];}}
    var tmp=closest2Val(arrHideTime, userInfoFrDB.vendor.hideTimer), bestVal=tmp[0];
    $el.$selHideTimer.val(bestVal);
  }

  var colGray='#eee'
  //var $butShowWPos=$("<button>").append(langHtml.ShowNUpdate)
  //var $buthide=$("<button>").append(langHtml.Hide);
  var $butShowWPos=$("<button>").append(langHtml.On).css({'margin-left':'1em'});
  var $buthide=$("<button>").append(langHtml.Off).css({'margin-left':'1em'});
  //var $imgBusyL=$('<img>').prop({src:uBusy});
  var $divButts=$('<span>').append($butShowWPos,$buthide); //,' ',$imgBusyL

  var tmpf=function(pos){
    if(boVideo) pos=posDebug;
    $mapDiv.setPos(pos);
    //$mapDiv.latLngMe = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    uploadPosNLoadTabStart();
    //$mapDiv.curMarker.setPosition($mapDiv.latLngMe);
    //$mapDiv.map.setOptions({center: $mapDiv.latLngMe});
  }
  
  $butShowWPos.click(function(){
    if(boFirstPosOK==0) {setMess('You must agree to sending your position.'); return;}
    setMess('... getting pos ...');  //$imgBusyL.css({visibility:''});//show();
    setMess('... getting position ... ',null,true);
    if(boEmulator){ tmpf(posDebug); }else{ navigator.geolocation.getCurrentPosition(tmpf, geoError);  }  //, {maximumAge:Infinity, timeout:5000}
  });

  $buthide.click(myHide);


  var tu=langHtml.timeUnit, mi=tu.min[1], h=tu.h[1], d=tu.d[1];
  $el.$selHideTimer=$('<select>');
  var arrHideTime=[0.25,1,2, 5,10,15,20,30,40,60,90,2*60,3*60,4*60,5*60,6*60,8*60,10*60,12*60,18*60,24*60,36*60,2*24*60,3*24*60,4*24*60,5*24*60,6*24*60,7*24*60,14*24*60,30*24*60,365*24*60]; // Minutes
  for(var i=0;i<arrHideTime.length;i++) arrHideTime[i]*=60;
  for(var i=0;i<arrHideTime.length;i++){  var str=UTC2ReadableDiff(arrHideTime[i]),  $opt=$("<option>").text(str).val(arrHideTime[i]);   $el.$selHideTimer.append($opt);    } 
  
  var $imgH=$imgHelp.clone().css({'margin-left':'1em'});   popupHoverM($imgH,$('<div>').append(langHtml.quickHelp));

  //var $spanDragMess=$('<span>').append(langHtml.DragOrZoom).css({'font-size':'75%',position:'absolute',top:'-1.15em',left:'0em','white-space':'nowrap'}).hide();
  var $spanDragMess=$('<span>').append(langHtml.DragOrZoom).css({'font-size':'75%',position:'absolute',top:'-1.15em',left:'50%', transform:'translate(-50%, 0)', 'white-space':'nowrap'}).hide();
  

  $el.append($el.$selHideTimer,$divButts,$imgH); //,$spanDragMess
  //$el.append($divButts,$spanDragMess);
  $el.css({position:'relative'});
  $el.css({'text-align':'left', position:'relative'});
  return $el;
}


var entryTestWMyName=function($el,arrMustBeSet,arrPosNum,arrPosNumOrEmpty){
"use strict"
  for(var i=0;i<arrPosNum.length;i++){
    var id=arrPosNum[i], tmp=$el.find('[myName="'+id+'"]').val();  if(!(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive'); return false;}     }
  for(var i=0;i<arrMustBeSet.length;i++){
    var id=arrMustBeSet[i], tmp=$el.find('[myName="'+id+'"]').val();  if(tmp.length==0) {setMess(id+' can not be empty'); return false;}     }
  for(var i=0;i<arrPosNumOrEmpty.length;i++){
    var id=arrPosNumOrEmpty[i], tmp=$el.find('[myName="'+id+'"]').val();  if(tmp.length>0 && !(isNumber(tmp) && tmp>=0) ) {setMess(id+' must be nummeric and positive'); return false;}     }

  return true;
}


var input2object=function($el){
  var o={};
  $el.find('input, select').each(function(){
      var type=this.getAttribute('type'), tmp=this.value;
      //alert(this.id+' '+type+' '+tmp);
      if(type==='checkbox')  tmp=Number(this.checked);
      if(tmp.length!=0) o[$(this).attr('myName')]=tmp;});
  return o;
}

/*
 * vendorIntroDiv
 */



var vendorIntroDivExtend=function($el){
"use strict"
  var save=function(){ 
    resetMess();  
    var strEmail=$inpEmail.val().trim(); $inpEmail.val(strEmail); if(strEmail.length==0) {setMess('telephone number can not be empty'); return; }
    var curT; if(strLang=='sv') curT='SEK'; else curT='USD';
    var nameT=sessionLoginIdP?sessionLoginIdP.nameIP:'';
    var o1={email:strEmail, displayName:nameT, currency:curT};
    var vec=[['VIntroCB',o1,function(data){$el.closePop();}], ['setupById']];   majax(oAJAX,vec);

    var $iframeConversion=$('<iframe src="'+uConversion+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:292px; height:62px;display:none" allowTransparency="true"></iframe>');
    $body.append($iframeConversion);

    setMess('',null,true);  
  }
  $el.setUp=function(){  var emailT=sessionLoginIdP?sessionLoginIdP.email:''; $inpEmail.val(emailT); $inpEmail.focus();  return true;  }
  $el.openFunc=function(){   $el.openPop(); $el.setUp(); }
 
  $el=popUpExtend($el);  
  $el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em'}); 

  
  var $helpPopup=$('<div>').html(langHtml.driverTextPopup.contactEmail);
  var $imgH=$imgHelp.clone().css({'margin-left':'1em'});   popupHoverM($imgH,$helpPopup);
         
  var $head=$('<h3>').append(langHtml.introHead);
  var $pBread=$('<p>').append(langHtml.introBread);

  var $inpEmail=$('<input>').prop({type:'email', placeholder:'Contact email'}).css({width:'100%', 'box-sizing':'border-box'}).keypress( function(e){if(e.which==13) {save();return false;}} );
  //var $divEmail=$('<div>').append($inpEmail,$imgH);
  
  var $saveButton=$('<button>').append(langHtml.Continue).click(save).css({display:'block', 'margin':'1em auto'});
  $el.append($head,$pBread,$inpEmail,$saveButton).css({padding:'0.1em'}); 

  return $el;
}

var reporterIntroDivExtend=function($el){
"use strict"
  var save=function(){ 
    resetMess();  
    var strEmail=$inpEmail.val().trim(); $inpEmail.val(strEmail); if(strEmail.length==0) {setMess('telephone number can not be empty'); return; }
    var curT; if(strLang=='sv') curT='SEK'; else curT='USD';
    var nameT=sessionLoginIdP?sessionLoginIdP.nameIP:'';
    var o1={email:strEmail, displayName:nameT, currency:curT};
    var vec=[['RIntroCB',o1,function(data){$el.closePop();}], ['setupById']];   majax(oAJAX,vec);

    var $iframeConversion=$('<iframe src="'+uConversion+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:292px; height:62px;display:none" allowTransparency="true"></iframe>');
    $body.append($iframeConversion);

    setMess('',null,true);  
  }
  $el.setUp=function(){  var emailT=sessionLoginIdP?sessionLoginIdP.email:''; $inpEmail.val(emailT); $inpEmail.focus();  return true;  }
  $el.openFunc=function(){   $el.openPop(); $el.setUp(); }
 
  $el=popUpExtend($el);  
  $el.css({'max-width':'20em', padding: '1.2em 0.5em 1.2em 1.2em'}); 

  
  var $helpPopup=$('<div>').html(langHtml.driverTextPopup.contactEmail);
  var $imgH=$imgHelp.clone().css({'margin-left':'1em'});   popupHoverM($imgH,$helpPopup);
         
  var $head=$('<h3>').append(langHtml.introHead);
  var $pBread=$('<p>').append(langHtml.introBread);

  var $inpEmail=$('<input>').prop({type:'email', placeholder:'Contact email'}).css({width:'100%', 'box-sizing':'border-box'}).keypress( function(e){if(e.which==13) {save();return false;}} );
  //var $divEmail=$('<div>').append($inpEmail,$imgH);
  
  var $saveButton=$('<button>').append(langHtml.Continue).click(save).css({display:'block', 'margin':'1em auto'});
  $el.append($head,$pBread,$inpEmail,$saveButton).css({padding:'0.1em'}); 

  return $el;
}


/*
 * vendorDiv
 */

var vendorDivExtend=function($el){    
"use strict"
  var $butts=$([]).push($userSettingButton, $vendorSettingButton, $priceSettingButton, $payButton).css({margin:'1em 0.1em'});
  var $h=$('<p>').append(langHtml.UserSettings).css({'font-weight':'bold'});
  $el.append($h,$butts);
  return $el;
}
  
  

var paymentListDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'paymentListDiv';}
  $el.getLoadObj=function(){
    var oGet={offset:offset,rowCount:rowCount};  return ['VPaymentList',oGet,$el.ajaxReturn];
  }
  $el.load=function(){ 
    setMess('... fetching paymentList ... ',15,true);  majax(oAJAX,[$el.getLoadObj()]);
    $el.boLoaded=1;
  }
  $el.ajaxReturn=function(data){ 
    var nCur;
    var tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    var tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    
    tabToTBody();  
    
    if(nTot>offset+tab.length) $butNext.prop({disabled:false}); else $butNext.prop({disabled:1});
    if(offset>0) $butPrev.prop({disabled:false}); else $butPrev.prop({disabled:1});
    $infoSpan.html('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }
  var tHeadExtend=function($el1){
    var $row=$('<tr>');
    for(var j=0;j<StrCol.length;j++){   $row.append($('<th>').text(StrCol[j]));   }
    $el1.append($row);
    return $el1;
  }
  var tabToTBody=function() {   // Reads tab, writes $tBody
    $el.$tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var $row=$('<tr>');
      for(var j=0;j<StrCol.length;j++) { 
        var tmp=tab[i][strName];  if(['payment_date','created'].indexOf(strName)!=-1) tmp=swedate(tmp,i);
        $row.append($('<td>').append(tmp)); 
      }
      $el.$tBody.append($row);
    }
  }
  var tab=[];
  $el.boLoaded=0;
  var StrCol=['txn_id','payer_email',  'amount','currency','tax','VATNumber','monthsToAdd',  'payment_date','created'];
  var nCol=StrCol.length; 
  
  var nTot;
  //var $buttonBack=$('<button>').html(langHtml.Back).addClass('fixWidth').click(doHistBack).css({'margin-left':'0.8em'});
  var $tHead=tHeadExtend($('<thead>'));
  $el.$tBody=$('<tbody>');  
  var $table=$('<table>').append($tHead,$el.$tBody);  $table.css({display:'block',margin:'1em 0'});
  
  var $butPrev=$('<button>').append('Prev page').click(function(){ offset-=rowCount; offset=offset>=0?offset:0; $el.load();});
  var $butNext=$('<button>').append('Next page').click(function(){ offset+=rowCount; $el.load();});
  var $infoSpan=$('<span>').css({'white-space':'nowrap'});
  var $infoDiv=$('<div>').append($butPrev,$butNext,$infoSpan).css({'text-align':'left'});  //display:'inline-block'});

  $el.append($table,$infoDiv);

  var offset=0,rowCount=20;
  
  $el.css({'text-align':'left'});
  return $el;
}
var paymentListFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.PaymentList).addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv'); 
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
    $spanIdUser.html(tmp.idUser);   $spanIdFB.html(tmp.idFB);  $spanIdIdPlace.html(tmp.idIdPlace);  $spanIdOpenId.html(tmp.idOpenId);
    $imgImage.prop({src:tmp.image});
    $spanNameIP.html(tmp.nameIP);  $inpEmail.val(tmp.email);
        
    if(userInfoFrDB.vendor.nPayment==0) $deleteDiv.show(); else $deleteDiv.hide();
    return true; 
  }
  var saveEmail=function(){
    var vec=[['UUpdate',{email:$inpEmail.val()}], ['setupById']];   majax(oAJAX,vec); 
  }
  
  //var uImagePrim=window['u'+ucfirst(strIPPrim)];
  var uImagePrim=window['u'+ucfirst(strIPPrim)+'22'];
  var $buttRefetch=$("<img>").prop({src:uImagePrim}).css({'vertical-align':'middle'}).click(function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'refetchFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      $el.setUp();
    })(); flow.next();
    return false;
  });
  
  
  var $spanIdUser=$('<span>'), $spanIdFB=$('<span>'), $spanIdIdPlace=$('<span>'), $spanIdOpenId=$('<span>');
  $spanIdFB.add($spanIdIdPlace).add($spanIdOpenId).css({margin:'0 0.2em 0 0'})
  var $imgImage=$('<img>').css({'vertical-align':'middle'});
  var $spanNameIP=$('<span>');
  var $inpEmail=$('<input>').prop({type:'email', placeholder:'Your email address'}).keypress( function(e){if(e.which==13) {saveEmail();return false;}} );
  var $butEmail=$('<button>').append('Change email').click(saveEmail);
  
  var $divIdUser=$('<div>').append('idUser (db): ', $spanIdUser);
  var $divIdIP=$('<div>').append('ID-codes: FB: ', $spanIdFB, ', IdPlace: ', $spanIdIdPlace, ', OpenID: ', $spanIdOpenId);
  var $divImage=$('<div>').append('Image: ', $imgImage);
  var $divNameIP=$('<div>').append('Name: ', $spanNameIP);
  
  var $bub=$('<div>').html("This email is not shown to the public, however it allows you to login if the Id-provider is changed.");
  var $imgH=$imgHelp.clone();  popupHoverM($imgH,$bub); 
  var $divEmail=$('<div>').append('Contact email: ', $inpEmail, $butEmail, $imgH);
  var $divRefresh=$('<div>').append('Refetch data: ', $buttRefetch);
  var $divHead=$('<div>').append('Data from Id-provider (user info): ').css({'margin-bottom':'0.5em','font-weight':'bold'});
  
    // change PW
  var $buttChangePW=$("<button>").append('Change password').click(function(e){ $changePWPop.openFunc(); });
  var $divPW=$('<div>').append('Change password: ', $buttChangePW);

      // deleteDiv
  var $imgH=$imgHelp.clone(); popupHoverM($imgH,$('<div>').html(langHtml.deleteBox.help));
  var $butDelete=$('<button>').append(langHtml.DeleteAccount).css({'margin-right':'1em'}).click(function(){doHistPush({$view:$deleteAccountPop}); $deleteAccountPop.setVis();});
  var $deleteDiv=$('<div>').append($butDelete); //,$imgH

  
  var $divs=$([]).push($divHead, $divRefresh, $divIdIP, $divImage, $divNameIP, $divEmail, $divPW, $deleteDiv).css({'margin-top':'1em'}), $divCont=$('<div>').append($divs);
  $el.append($divCont);
  
  $el.css({'text-align':'left'});
  return $el;
}
var userSettingFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('User info').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}

var deleteAccountPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'deleteAccountPop';}
  //var $el=popUpExtend($el);
  var $yes=$('<button>').html(langHtml.Yes).click(function(){
    //var vec=[['VDelete',1,function(data){doHistBack();doHistBack();}]];   majax(oAJAX,vec);
    sessionLoginIdP={};  userInfoFrDB=$.extend({}, specialistDefault);
    var vec=[['VDelete',1], ['logout',1, function(data){
      //$mapDiv.setVis(); 
      history.fastBack($mapDiv,true);
    }]];   majax(oAJAX,vec);
    
  });
  var $cancel=$('<button>').html(langHtml.Cancel).click(doHistBack);
  //$el.append(langHtml.deleteBox.regret,'<br>',$yes,$cancel);
  //$el.css({padding:'1.1em',border:'1px solid'});
  $el.setVis=function(){
    $el.show();   
    return true;
  }
  var $h1=$('<div>').append(langHtml.deleteBox.regret);
  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($h1,$cancel,$yes);
  $centerDiv.addClass("Center").css({'width':'20em', height:'7em', padding:'1.1em'})
  if(boIE) $centerDiv.css({'width':'20em'}); 
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

  var boE=Boolean(userInfoFrDB.admin); $adminButton.toggle(boE);
  var boE=Boolean(userInfoFrDB.team); 
  $teamButton.toggle(Boolean(boE && Number(userInfoFrDB.team.boApproved)));
  $teamApprovedMess.toggle(Boolean(boE && Number(userInfoFrDB.team.boApproved)==0));
  
  var boE=Boolean(userInfoFrDB.vendor);
  $quickDiv.toggle(boE); 
  $vendorDiv.toggle(boE);
  //$buttLoginVendor.toggle(!boE);
  if(boE) {$payButton.setUp(); }

  /* if(userInfoFrDB.vendor){    
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
      history.fastBack($mapDiv);
      
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
  $formLogin.find('input[type=text],[type=email],[type=number],[type=password]').css({display:'block'}).keypress( function(e){ if(e.which==13) { loginWEmail(); }} );

  var $messDiv=$('<div>').css({color:'red'});
  var $buttForgot=$('<a>').prop({href:''}).text('Forgot your password?').click(function(){  $forgottPWPop.openFunc(); return false; });
  var $imgH=popupHoverM($imgHelp.clone(), $('<div>').html("A new password is generated and sent to the email address.")); 
  var $divForgot=$('<div>').css({'margin-top':'1em'}).append($buttForgot, $imgH);
  var $butSendLink=$('<a>').prop({href:''}).text('Login with email link').click(sendEmail); 
  var $imgH=popupHoverM($imgHelp.clone(), $('<div>').html("An email is sent with a link which will log you in. Your password is not changed.")); 
  var $divSendLink=$('<div>').css({'margin-top':'1em'}).append($butSendLink, $imgH);
  
  var $buttonCreateAccount=$('<button>').addClass('highStyle').append('Create an account').click(function(){
    doHistPush({$view:$createUserDiv});
    $createUserDiv.setVis();
  });
  $el.append($divHead, $messDiv, $formLogin, $divForgot, $divSendLink, '<hr>', $buttonCreateAccount); 
  return $el;
}
var formLoginFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Login with email / password').addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv'); 
  return $el;
}


var loginSelectorDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'loginSelectorDiv';}
  //$el.setUp=function(){}

  var strButtonSize='2em';
  var $imgFb=$('<img>').prop({src:uFb}).click(function(){
    var flow=(function*(){
      ga('send', 'event', 'button', 'click', 'login');
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'vendorFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById',{}, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      
      var boE=Boolean(userInfoFrDB.vendor);
      if(!boE){ $vendorIntroDiv.openFunc(); }
      if(boE) $quickDiv.setUp();
      history.fastBack($mapDiv);
    })(); flow.next();
  });
  $imgFb.css({align:'center', display:'block', 'margin': '0.7em auto'}); //     , position:'relative',top:'0.4em',heigth:strButtonSize,width:strButtonSize

      
  
  var $divHead=$('<h3>').append('Sign in / Create account, using ...').css({'text-align':'center'});


  
  var cssCol={display:'inline-block','box-sizing': 'border-box',padding:'1em',flex:1}; //width:'50%',
  var $buttonViaEmail=$('<button>').addClass('highStyle').append('Email and password').click(function(){
    doHistPush({$view:$formLoginDiv});
    $formLoginDiv.setVis();
  });  
  var $divLeft=$('<div>').css(cssCol).css({'text-align':'center'}).append($imgFb); // , '(recommended)' <br>(fewer passwords to remember) (no new password to remember)
  var $divRight=$('<div>').css(cssCol).css({'border-left':'2px solid grey', 'text-align':'center'}).append( $buttonViaEmail); 
  var $divRow=$('<div>').append($divLeft, $divRight).css({display: 'flex', 'justify-content':'space-around'});
  
  
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
    if(strPassword!==$inpPassB.val().trim()) { var tmp='Password-fields are not equal'; setMess(tmp); return; }
    if(strPassword.length<lPWMin) { var tmp='The password must be at least '+lPWMin+' characters long'; setMess(tmp); return; }

  
    var strName=$inpName.val().trim();
    var strEmail=$inpEmail.val().trim(); if(/\S+@\S+/.test(strEmail)) ; else {setMess('Invalid email'); return;}
    
    var strTmp=grecaptcha.getResponse(); if(!strTmp) {setMess("Captcha response is empty"); return; }
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
  

  var $buttonVerifyNCreate=$("<button>").text('Verify email and create account').click(save).addClass('flexWidth').css({'margin':'0.5em 0em 0.3em'})
  var $messEndDiv=$('<div>');

  $el.append($h1, $el.$divDisclaimerW, $messDiv,   $formCreateAccount, $divReCaptcha, $buttonVerifyNCreate, $messEndDiv);
  return $el;
}
var createUserFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.CreateAccount).addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv'); 
  return $el;
}




var changePWPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'changePWPop';}
  var save=function(){ 
    resetMess();
    $messDiv.html('');
    if($inpPass.val().trim()!==$inpPassB.val().trim()) { setMess('The new password fields are not equal'); return; }
    var lTmp=boDbg?2:6; if($inpPass.val().trim().length<lTmp) { setMess('The password must be at least '+lTmp+' characters long'); return; }

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

  $([]).push($inpPassOld, $inpPass, $inpPassB).css({display:'block', 'margin-bottom':'0.5em'}).keypress( function(e){ if(e.which==13) {okF();return false;}} );

  var $ok=$('<button>').html(langHtml.OK).addClass('highStyle').click(save);
  var $cancel=$('<button>').html(langHtml.Cancel).addClass('highStyle').click(doHistBack);
  var $divBottom=$('<div>').append($cancel,$ok);  //$buttonCancel,

  var $centerDiv=$('<div>').append($h1, $messDiv,   $labPassOld, $inpPassOld, $labPass, $inpPass, $labPassB, $inpPassB, $divBottom);
  $centerDiv.addClass("Center").css({'width':'20em', height:'21em', padding:'1.1em'})
  if(boIE) $centerDiv.css({'width':'20em'}); 
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
  var $inpEmail=$('<input type=email>').keypress( function(e){ if(e.which==13) {okF();return false;}} );
  $inpEmail.css({display:'block', 'margin-bottom':'0.5em'});

  var $ok=$('<button>').html(langHtml.OK).addClass('highStyle').click(okF);
  var $cancel=$('<button>').html(langHtml.Cancel).addClass('highStyle').click(doHistBack);
  var $divBottom=$('<div>').append($cancel,$ok);  //$buttonCancel,

  var $centerDiv=$('<div>').append($h1, $labEmail, $inpEmail, $divBottom);
  $centerDiv.addClass("Center").css({'width':'20em', height:'13em', padding:'1.1em'});
  if(boIE) $centerDiv.css({'width':'20em'}); 
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
  var $headC=$('<div>').append('<p>After that login with your old ('+strIPAltLong+') ID to convert reputation (for vendors) and comments (for reporters/vendors) to the '+strIPPrimLong+' ID.').css({'margin-top':'0.5em'});


  var timerClosePoll; 

  var uImagePrim=window['u'+ucfirst(strIPPrim)];
  var $imPrim=$('<img>').prop({src:uImagePrim}).css({'vertical-align':'middle'}).click(function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'vendorFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      
      var boE=Boolean(userInfoFrDB.vendor);
      if(!boE){
        //var o1={tel:'000', displayName:'bla',boInsert:1, currency:'USD'};
        //var o1={boInsert:1};
        var o1={};
        var vec=[['VUpdate',o1], ['setupById']];   majax(oAJAX,vec);
      }
    })(); flow.next();
  });
  

  var uImageAlt=window['u'+ucfirst(strIPAlt)];
  var $imAlt=$('<img>').prop({src:uImageAlt}).css({'vertical-align':'middle'}).click(function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPAlt, fun:'mergeIDFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      
    })(); flow.next();
  });



  var $rows=$([]).push($pendingMess, $cancelMess, $headA, $headB, $imPrim, $headC, $imAlt);  
  $rows.css({'margin':'1em 0em 1em 0.6em'});
  $el.append($rows);  


  $el.css({'text-align':'left'});
  return $el;
}
var convertIDFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Convert ID').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}

/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Reporter divs
 *
 *  Summary:
 *  $reportCommentPop   // Popup where a reporter can write a report
 *  $reportAnswerPop    // Popup where a vendor can answer a report
 *  $reportCommentButt  // Opens $reportCommentPop, placed in $reportVDiv
 *  $reportAnswerButt   // Opens $reportAnswerPop, placed in $reportVDiv
 *  $reportVDiv         // List of reporters reports on a certain Vendor
 *  $reportRDiv         // List of reports from a certain Reporter
 * 
 *******************************************************************************************************************
 *******************************************************************************************************************/

  
  
var reportCommentPopExtend=function($el){
"use strict"
  $el.toString=function(){return 'reportCommentPop';}
  $el.openFunc=function(idV){
    idVendor=idV;  $idVendor.html(idV);
    
    if(isSet(sessionLoginIdP) || typeof userInfoFrDB.user=='object'){} else {setMess('not logged in'); return;}
    var o1={idVendor:idVendor}, vec=[['reportOneGet',o1,reportCommentOneGet]];   majax(oAJAX,vec);
    $el.setVis();    
    $comment.focus();
  };
  $el.setVis=function(){
    $el.show();   
    return true;
  }
  $el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() { 
    var o1={idVendor:idVendor,comment:$comment.val().trim()};
    var vec=[['reportUpdateComment',o1], $reportVDiv.getLoadObj(), ['setupById']];   majax(oAJAX,vec);
    doHistBack();
  }  
  var reportCommentOneGet=function(data){    
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; $comment.val(tmp);
    var tmp=row.answer;   if(typeof tmp==="undefined")  tmp=''; $answer.html(tmp);
    if($answer.html().length) $answerHead.show(); else $answerHead.hide();
  };
  //$el=popUpExtend($el);  
  //$el.css({'max-width':'16em', padding: '1em'});
  
  var idVendor, $idVendor=$('<span>'); 

  var $commentHead=$('<div>').html(langHtml.Report+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $comment=$('<textarea>').css({display:'block',margin:'0em 0em 0.7em'});  $comment.keypress( function(e){ if(e.which==13) {sendFunc();return false;}} ); 
  var $save=$('<button>').html(langHtml.Save).click(function(){sendFunc();});
  var $del=$('<button>').html(langHtml.vote.deleteReport).click(function(){$comment.val(''); sendFunc();});
  var $cancel=$('<button>').html(langHtml.Cancel).click(doHistBack);
  //var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $answerHead=$('<div>').html(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'}); $answerHead.hide();
  var $answer=$('<div>'); 
  //$el.append($commentHead,$comment,$butts,$answerHead,$answer);

  //var $mess=$('<div>');   $el.append($mess);
  $el.css({'text-align':'left'});

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($commentHead,$comment,$butts,$answerHead,$answer);
  $centerDiv.addClass("Center").css({'width':'20em', height:'22em', padding: '1em'})
  if(boIE) $centerDiv.css({'width':'20em'}); 
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}
  
  
var reportAnswerPopExtend=function($el){
  $el.toString=function(){return 'reportAnswerPop';}
  $el.openFunc=function(idR){
    idReporter=idR;  $idReporter.html(idR);
    var o1={idReporter:idReporter}, vec=[['reportOneGet',o1,reportAnswerOneGet]];   majax(oAJAX,vec);
    $answer.focus();
    doHistPush({$view:$reportAnswerPop});
    $el.setVis();    
    $answer.focus();
  };
  $el.setVis=function(){
    $el.show();   
    return true;
  }
  $el.closeFunc=function(){    doHistBack();    }
  var sendFunc=function() { 
    var o1={idReporter:idReporter,answer:$answer.val().trim()};
    var vecG; if($reportVDiv.css('display')!='none') { vecG=$reportVDiv.getLoadObj(); }  else { vecG=$reportRDiv.getLoadObj(); }
    var vec=[['reportUpdateAnswer',o1],vecG];   majax(oAJAX,vec);
    doHistBack();
  } 
  
  var reportAnswerOneGet=function(data){ 
    var row;
    var tmp=data.row;   if(typeof tmp==="undefined")  row=[]; else row=tmp;
    var tmp=row.comment;   if(typeof tmp==="undefined")  tmp=''; $comment.html(tmp);
    var tmp=row.answer;   if(typeof tmp==="undefined")  tmp=''; $answer.val(tmp);
  };
  //$el=popUpExtend($el);  
  //$el.css({'max-width':'16em', padding: '1em'});
  
  var idReporter, $idReporter=$('<span>'); 

  var $commentHead=$('<div>').html(langHtml.Report+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $comment=$('<div>'); 
  var $answerHead=$('<div>').html(langHtml.vote.answer+': ').css({margin:'0.5em 0em 0.2em','font-weight':'bold'});
  var $answer=$('<textarea>').css({display:'block',margin:'0em 0em 0.7em'}); $answer.keypress( function(e){ if(e.which==13) {sendFunc();return false;}} );
  var $save=$('<button>').html(langHtml.Save).click(function(){sendFunc();});
  var $del=$('<button>').html(langHtml.vote.deleteAnswer).click(function(){$answer.val(''); sendFunc();});
  var $cancel=$('<button>').html(langHtml.Cancel).click(doHistBack);
  //var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  var $butts=$([]).push($save, $del, $cancel).css({margin:'0.5em 0'});
  //$el.append($commentHead,$comment,$answerHead,$answer,$butts);

  //var $mess=$('<div>');   $el.append($mess);
  $el.css({'text-align':'left'});

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($commentHead,$comment,$answerHead,$answer,$butts);
  $centerDiv.addClass("Center").css({'width':'20em', height:'22em', padding: '1em'})
  if(boIE) $centerDiv.css({'width':'20em'}); 
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  return $el;
}

    //if(Object.keys(sessionLoginIdP).length || typeof userInfoFrDB.user=='object'){
var reportCommentButtExtend=function($el){    // Opens $reportCommentPop, placed in $reportVDiv
"use strict"
  $el.click(function(e){
    e.stopPropagation();
    var flow=(function*(){
      if(isEmpty(sessionLoginIdP) && typeof userInfoFrDB.user!='object'){
        var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
        var oT={IP:strIPPrim, fun:'reporterFun', caller:'index', code:code};
        var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      }
      doHistPush({$view:$reportCommentPop});   $reportCommentPop.openFunc($reportVDiv.idVendor); 
    })(); flow.next();
  });
  return $el;
}


var reportAnswerButtExtend=function($el){    // Opens $reportAnswerPop, placed in $reportVDiv
"use strict"
  $el.click(function(e){
    e.stopPropagation();
    var idReporter=$el.closest('tr').data('idReporter');
    $reportAnswerPop.openFunc(idReporter);
  });
  return $el;
}


var reportVDivExtend=function($el){    // Reporters reports on a certain Vendor
"use strict"
  $el.toString=function(){return 'reportVDiv';}
  $el.setUp=function(idV){
    var iMTab=$tableDiv.getMTabInd(idV);
    rowVendor=MTab[iMTab];
    $el.idVendor=rowVendor.idUser;
    $nameSpan.html(rowVendor.displayName);

    var strTmp; //var IPTmp=enumIP[Number(rowVendor.IP)];
    strTmp=calcImageUrl(rowVendor);
    $imgVendor.prop({src:strTmp});
    $vendorListCtrlDiv.mySet(iMTab);
  }
  $el.getLoadObj=function(){
    var oGet={offset:offset,rowCount:rowCount,idVendor:$el.idVendor};  return ['reportVGet',oGet,$el.reportVGetRet];
  }
  $el.load=function(){ 
    setMess('... fetching reports on a vendor ... ',15,true);  majax(oAJAX,[$el.getLoadObj()]);
    $el.boLoaded=1;
  }
  var makeImgClickFun=function(idR,image){return function(){
    $reportRDiv.setUp(idR,image); $reportRDiv.load(); 
    $reportRDiv.setVis(); 
    doHistPush({$view:$reportRDiv});
  }}
  $el.reportVGetRet=function(data){ 
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    //tab.length=0; tmp=data.tab;  if(typeof tmp !='undefined') tab.push.apply(tab,tmp);

    $tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var idReporterTmp=tab[i].idReporter;
      var image=tab[i].image;
      var tmp=image;
      var $img=$('<img>').prop({src:tmp}).css({'float':'left'}); 
      $img.click(makeImgClickFun(idReporterTmp,image));

      var d=(new Date(tab[i].created*1000)).toLocaleDateString(),   $created=$('<p>').append(d).css({'font-weight':'bold'});
      var $comm=$('<p>').append(tab[i].comment);
      
      var strAns=tab[i].answer, $ans='';
      if(strAns) {
        var $ansLab=$('<p>').append(langHtml.vote.answer+':').css({'font-weight':'bold'});
        $ans=$('<p>').append($ansLab,strAns).css({background:'#ff3',overflow:'hidden'});
      }

      var $butAns=''
      if(userInfoFrDB.vendor && $el.idVendor==userInfoFrDB.vendor.idUser){
        var idR=tab[i].idReporter;
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        $butAns=reportAnswerButtExtend($('<button>')).html(strtmp).css({'float':'right'});
      }
  
      var $td=$('<td>').append($img,$created,$comm,$ans,$butAns); 
      if(strAns) $ans.append($butAns);
      var $row=$('<tr>').data({idReporter:idR}).append($td);  $tBody.append($row);
    }
    
    
    if(nTot>offset+tab.length) $butNext.prop({disabled:false}); else $butNext.prop({disabled:1});
    if(offset>0) $butPrev.prop({disabled:false}); else $butPrev.prop({disabled:1});
    $infoSpan.html('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }
  
  $el.boLoaded=0; $el.idVendor;
  var tab=[], rowVendor, $imgVendor=$('<img>').css({'vertical-align':'middle'}), $nameSpan=$('<span>');
  var $vendorInfo=$('<div>').append(langHtml.Vendor,': ',$imgVendor,' ',$nameSpan).css({'margin':'0.5em',display:'inline-block'}); //,'float':'right'
  //var $buttonBack=$('<button>').html(langHtml.Back).addClass('fixWidth').click(doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});
  var $reportCommentButt=reportCommentButtExtend($('<button>')).html(langHtml.vote.writeComment+' ('+langHtml.IdProviderNeeded+')').css({'margin-right':'1em'});
  var $bub=$('<div>').html(langHtml.writeReportPopup);
  var $imgH=$imgHelp.clone();  popupHoverM($imgH,$bub); 

  var $tBody=$('<tbody>'),   $table=$('<table>').append($tBody).css({'width':'100%'});//.addClass('reportTab'); 
  
  var $butPrev=$('<button>').append('Prev page').click(function(){ offset-=rowCount; offset=offset>=0?offset:0; $el.load();});
  var $butNext=$('<button>').append('Next page').click(function(){ offset+=rowCount; $el.load();});
  var $infoSpan=$('<span>').css({'white-space':'nowrap'});
  $el.$topDiv=$('<div>').append($reportCommentButt).css({'margin-top':'1em',overflow:'hidden'});  //$buttonBack,
  $el.append($el.$topDiv,$vendorInfo,$table,$butPrev,$butNext,$infoSpan);

  var offset=0,rowCount=20;
  $el.css({'text-align':'left'});
  return $el;
}
var reportVFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Vendor reports').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}

var reportRDivExtend=function($el){  // Reports from a certain Reporter
"use strict"
  $el.toString=function(){return 'reportRDiv';}
  $el.setUp=function(idR,image){
    idReporter=idR;
    $imgReporter.prop({src:image});
  }
  $el.getLoadObj=function(){
    var oGet={offset:offset,rowCount:rowCount,idReporter:idReporter};  return ['reportRGet',oGet,$el.reportRGetRet];
  }
  $el.load=function(){ 
    setMess('... fetching reports from a reporter  ... ',15,true); majax(oAJAX,[$el.getLoadObj()]);
    $el.boLoaded=1;
  }
  $el.reportRGetRet=function(data){ 
    var nTot,nCur,tmp;
    tmp=data.nTot;   if(typeof tmp!="undefined")  nTot=tmp;
    tmp=data.nCur;   if(typeof tmp!="undefined")  nCur=tmp;    
    tab.length=0; if('tab' in data) tab=tabNStrCol2ArrObj(data);
    //tab.length=0; tmp=data.tab;  if(typeof tmp !='undefined') tab.push.apply(tab,tmp);

    $tBody.empty();
    for(var i=0; i<tab.length; i++) {
      var strTmp=calcImageUrl({idUser:tab[i].idUser, boImgOwn:tab[i].boImgOwn, imTag:tab[i].imTag, image:tab[i].image}); //, IP:tab[i].IP
      
      var $img=$('<img>').prop({src:strTmp}).css({'float':'right','border-left':'solid #ff3 15px'});

      var d=(new Date(tab[i].created*1000)).toLocaleDateString(), $created=$('<p>').append(d).css({'font-weight':'bold'});
      var $comm=$('<p>').append(tab[i].comment);

      var strAns=tab[i].answer, $ans=''; 
      if(strAns) {
        var $ansLab=$('<p>').append(langHtml.vote.answer+':').css({'font-weight':'bold'});
        $ans=$('<p>').append($ansLab,strAns).css({background:'#ff3',overflow:'hidden'}); //$img='';
      }else $ans='';

      var $butAns=''
      if(userInfoFrDB.vendor && tab[i].idUser==userInfoFrDB.vendor.idUser){
        var strtmp='';if(strAns) strtmp=langHtml.Change; else strtmp=langHtml.Answer;
        var $butAns=reportAnswerButtExtend($('<button>')).html(strtmp).css({'float':'right'}); 
      }
  
      var $td=$('<td>').append($img,$created,$comm,$ans,$butAns);
      if(strAns) $ans.prepend($img,$butAns);
      var $row=$('<tr>').data({idReporter:idReporter}).append($td);    $tBody.append($row);
    }
    
    
    if(nTot>offset+tab.length) $butNext.prop({disabled:false}); else $butNext.prop({disabled:1});
    if(offset>0) $butPrev.prop({disabled:false}); else $butPrev.prop({disabled:1});
    $infoSpan.html('Row: '+(offset+1)+'-'+(nCur+offset)+', tot: '+nTot);
    resetMess(10);
  }
  
  $el.boLoaded=0;
  var idReporter, tab=[], $imgReporter=$('<img>').css({'vertical-align':'middle'});
  var $reporterInfo=$('<div>').append(langHtml.Reporter,': ',$imgReporter);
  //var $buttonBack=$('<button>').html(langHtml.Back).addClass('fixWidth').click(doHistBack).css({'margin-left':'0.8em'});
  
  var $tBody=$('<tbody>'),   $table=$('<table>').append($tBody).css({'width':'100%'});//.addClass('reportTab'); 
  
  var $butPrev=$('<button>').append('Prev page').click(function(){ offset-=rowCount; offset=offset>=0?offset:0; $el.load();});
  var $butNext=$('<button>').append('Next page').click(function(){ offset+=rowCount; $el.load();});
  var $infoSpan=$('<span>').css({'white-space':'nowrap'});
  var $topDiv=$('<div>').css({'margin-top':'1em'}); // .append($buttonBack)
  $el.append($topDiv,$reporterInfo,$table,$butPrev,$butNext,$infoSpan);

  var offset=0,rowCount=20;
  $el.css({'text-align':'left'});
  return $el;
}
var reportRFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Reports from reporter').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * vendorInfo Divs 
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/


var updateTableThumb=function($el,iRow){
"use strict"
  var canvas=$el[0],  ctx = canvas.getContext("2d");
  //var heightRow=2; if(nMTab<4) heightRow=5; if(nMTab<4) heightRow=10;
  var heightRow=2; if(nMTab*2<15) heightRow=Math.round(15/nMTab); if(nMTab==1) heightRow=10;
  var widthBox=25;
  canvas.width=widthBox;   canvas.height=nMTab*heightRow-1;
  for(var i=0;i<nMTab;i++){
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
  $el.updateMapThumb=function(iRow){
    var canvas=$mapThumb[0],  ctx = canvas.getContext("2d");

    var zoomDiff=3, zoomDiffFac=Math.pow(2,zoomDiff),  Div=zoomDiffFac;
    var zoom=$mapDiv.storedZoom, zoomFac=Math.pow(2,zoom), thumbFac=zoomFac/Div;
    var widthBox=$mapDiv.storedVPSize[0]/Div, heightBox=$mapDiv.storedVPSize[1]/Div;
    var pMerCent=merProj.fromLatLngToPoint($mapDiv.storedLatLngCent);

    
    canvas.width=widthBox;   canvas.height=heightBox;

    var iMTab=$tableDiv.$tBody.children('tr:eq('+iRow+')').data('iMTab');

    arrInd.length=0; for(var i=0;i<nMTab;i++) arrInd[i]=i;  arrValRemove(arrInd,iMTab);   arrInd.push(iMTab);  // Put iMTab last 
    
    var dotSizeH=2;
    for(var i=0;i<arrInd.length;i++){ 

      var itmp=arrInd[i];
      //if(i==nMTab) itmp=iRow; else itmp=i;
      var cx=MTab[itmp].x-pMerCent.x, cy=MTab[itmp].y-pMerCent.y;
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

    var arrtmp=[];
    for(var i=0;i<4;i++){    
      var tileXR=pixXR[i]/256, tileYR=pixYR[i]/256,   tileX=Math.floor(tileXR), tileY=Math.floor(tileYR);
      if(i==0) {var tileXRZ=tileXR; var tileYRZ=tileYR;}
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



var vendorInfoDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'vendorInfoDiv';}
  $el.setContainers=function(iMTab){
    $containers.each(function(j){
      var $ele=$(this), strName=$ele.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
      var tmp=''; if('setInfo' in tmpObj) tmp=tmpObj.setInfo(iMTab,$ele);  else tmp=MTab[iMTab][strName]; 
      if(typeof tmp!='undefined') $ele.html(tmp);    
    });
    $el.boLoaded=1;  
    $vendorListCtrlDiv.mySet(iMTab);
  }
  $el.createContainers=function(){
    for(var i=0;i<StrPropMain.length;i++){ 
      var strName=StrPropMain[i], tmpObj=(strName in Prop)?Prop[strName]:emptyObj; 
      var $imgH=''; if(strName in helpBub && Number(Prop[strName].b[bFlip.help])) { $imgH=$imgHelp.clone();   popupHoverM($imgH,helpBub[strName]); }
      
      var strDisp,strMargRight,strWW; if(Number(Prop[strName].b[bFlip.block])) {strDisp='block'; strMargRight='0em'; strWW='';} else {strDisp='inline'; strMargRight='.2em'; strWW='nowrap';}
      
      var strLabel=''; if(Number(Prop[strName].b[bFlip.label])) { strLabel=calcLabel(langHtml.label, strName)+': ';      }

      var $divC=$('<span>').attr({name:strName}).css({'font-weight':'bold',margin:'0 0.2em 0 0em'});      
      if('crInfo' in tmpObj) tmpObj.crInfo($divC); 
      var $divLCH=$('<div>').append(strLabel,$divC,$imgH).css({display:strDisp,'margin-right':strMargRight,'white-space':strWW}).attr({name:strName});
      $el.$divCont.append($divLCH,' ');
    }
    $containers=$el.$divCont.find('div>span');

    for(var i=0;i<StrGroupMain.length;i++){
      var $h=$('<span>').append(langHtml[StrGroupMain[i]],':').css({'font-size':'120%','font-weight':'bold', display:'block'});
      $el.find('div[name='+StrGroupFirstMain[i]+']').before('<hr>',$h);
    }
  }
  $el.$divCont=$('<div>');
  var $containers;
  
  $el.boLoaded=0;

  //var $buttonBack=$('<button>').html(langHtml.Back).addClass('fixWidth').click(doHistBack).css({'margin-left':'0.8em','margin-right':'1em'});   
  $el.$menuDiv=$('<div>').css({'margin-top':'1em','padding':'0'}); // .append($buttonBack)
  $el.append($el.$menuDiv,$el.$divCont,'<br>');
  $el.css({'text-align':'left'});
  return $el;
}
var vendorInfoFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Vendor info').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv');
  return $el;
}

var vendorListCtrlDivExtend=function($el){ // The little map and up/down arrows
  $el.mySet=function(iMTab){
    $arrowDiv.toggle(nMTab>1);
    $el.$tr=$tableDiv.getRow(iMTab);
    var iRow=$el.$tr.index();
    
    $tableThumb=updateTableThumb($tableThumb,iRow);
    $mapThumbDiv.updateMapThumb(iRow);
  }
  var $mapThumbDiv=mapThumbDivExtend($('<div>')).css({'display':'inline-block','margin-right':'1em',border:'1px solid grey','vertical-align':'top'});
  //$mapThumbDiv.click(function(){mapButtonClick();});

  var $tableThumb=$('<canvas>').css({'margin-right':'1.5em',border:'1px solid grey','vertical-align':'top'}); //.click(function(){tableButtonClick();});

  var tmpf=function(iDiff){
    var $trt; if(iDiff==1) {$trt=$el.$tr.next(); if($trt.length==0 || $trt.css('display')=='none') $trt=$el.$tr.parent().children(':first');} 
    else {$trt=$el.$tr.prev(); if($trt.length==0) $trt=$tableDiv.$tBody.children(':eq('+(nMTab-1)+')'); }
    var iTmp=$trt.data('iMTab');
    $vendorInfoDiv.setContainers(iTmp);
    if($reportVDiv.is(':visible')){$reportVDiv.setUp(MTab[iTmp].idUser); $reportVDiv.load(); }
  }
  var $buttonPrev=$('<button>').html('&#x25b2;').click(function(){tmpf(-1);}).css({display:'block','margin':'0em'});  
  var $buttonNext=$('<button>').html('&#x25bc;').click(function(){tmpf(1);}).css({display:'block','margin':'1.5em 0em 0em'}); 
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
    var arrKind=[];
    for(var key in userInfoFrDB){   if(userInfoFrDB[key] && key!='user') {  arrKind.push(langHtml.loginInfo[key]); }   }
    var boShow=Boolean(arrKind.length);
    if(boShow){
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
  var $spanName=$('<span>'), $spanKind=$('<span>'); 
  //var $logoutButt=$('<a>').prop({href:''}).text(langHtml.loginInfo.logoutButt).css({'float':'right'});
  var $logoutButt=$('<button>').text(langHtml.loginInfo.logoutButt).css({'float':'right','font-size':'90%'});
  $logoutButt.click(function(){ 
    sessionLoginIdP={}; userInfoFrDB=$.extend({}, specialistDefault); 
    var vec=[['logout',1, function(data){
      //$mapDiv.setVis();  changeHistNRefreshHash({$view:$mapDiv});
      history.fastBack($mapDiv,true);
    }]];
    majax(oAJAX,vec);
    return false;
  });
  
  //$el.append($spanName,' ',$spanKind,' ',$logoutButt,'<br clear=all>');
  $el.append($spanName,' ',$spanKind,' ',$logoutButt);
  $el.css({'text-align':'left'});
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

teamImgButtonExtend=function($el){
  $el.mySet=function(idTeam,boOn){  
    var boId=Number(idTeam)!=0;
    $spanIndependent.toggle(!boId);   $im.toggle(boId);
    if(boId){  
      var strTmp=uTeamImage+idTeam;
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
var FilterDiv=function(Prop, Label, StrOrderFilt, changeFunc, StrGroupFirst, StrGroup){   //  Note!! StrOrderFilt should not be changed by any client side plugins (as it is also used on the server)
"use strict"
  if(typeof StrGroupFirst=='undefined') StrGroupFirst=[];    if(typeof StrGroup=='undefined') StrGroup=[];
  var $el=$('<div>'); $.extend($el,FilterDivProt);
  $el.Prop=Prop; $el.Label=Label; $el.StrOrderFilt=StrOrderFilt; $el.changeFunc=changeFunc; $el.StrGroupFirst=StrGroupFirst; $el.StrGroup=StrGroup;

  $el.addClass('unselectable');    $el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie

  $el.$divCont=$el;
  $el.css({'text-align':'left'});
  return $el;
}
var filterFootExtend=function($el){
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
 
  $el.$filterInfoWrap=$('<span>');
  var $tmpImg=$('<img>').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  //var $filterInfoWrap2=$('<span>').append($tmpImg, langHtml.Filter,' (',$el.$filterInfoWrap,')').css({'vertical-align':'-0.4em', display:'inline-block'});
  var $filterInfoWrap2=$('<span>').append($tmpImg, langHtml.Filter,' (',$el.$filterInfoWrap,')').addClass('footDivLabel');
  
  var $buttClear=$('<a>').prop({href:''}).append(langHtml.All).click(function(){$filterDiv.Filt.filtClear(); loadTabStart(); return false;}).css({'float':'right', 'margin-left':'0.5em', 'font-size':'80%'});
  
  //var $buttClear=$('<a>').prop({href:''}).text(langHtml.All).css({'font-size':'80%'}).click(function(){allOnButtClick();return false;});
  
  $el.append($buttonBack, $buttClear, $filterInfoWrap2).addClass('footDiv');  // , 'text-align':'center' ,overflow:'hidden'
  
  return $el;
}


var filterInfoSpanExtend=function($el){
"use strict"
  $el.setNVendor=function(arr){
    $el.empty(); $el.append(arr[0],'/',arr[1]);
  }
  $el.append();
  return $el;
}


/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * Map stuff
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/



var MyOverlay=function( options )  {
"use strict"
  //this.latLng_=options.position;
  //this.setValues( options );
  //this.set('position', map.getCenter());
  this.bounds_=null;

  this.$div = $('<div>').css({border:'0px',position:'absolute'});
  this.$img=$('<img>').css({width:'100%',height:'100%'});
  var strFont="8pt Arial", leading=10;       
  this.$canvas = $('<canvas>').css({width:'100%',height:'100%'});
  this.canvas=this.$canvas[0];
  this.ctx = this.canvas.getContext("2d");    this.ctx.font = strFont;   this.ctx.textBaseline  = "middle";
  this.ctxMeas = this.canvas.getContext("2d");  this.ctxMeas.font = strFont;     //Create temporary context
  

  this.$div.append(this.$img);
  //this.setMap(map);
};
var makeMyOverlay=function(){
  MyOverlay.prototype = new google.maps.OverlayView();

  MyOverlay.prototype.onAdd = function()  {
    //var $pane = $(this.getPanes().overlayImage); // Pane 4
    //$pane.append( this.$div );
    var panes = this.getPanes();   panes.overlayImage.appendChild(this.$div[0]);
  };

  MyOverlay.prototype.onRemove = function()  {   this.$div.detach();  };
  
  /*MyOverlay.prototype.myBounds=function(){
    var projection = this.getProjection();
    var latLngSW=$mapDiv.map.getBounds().getSouthWest(), latLngNE=$mapDiv.map.getBounds().getNorthEast();
    var pointSW = projection.fromLatLngToDivPixel(latLngSW), pointNE = projection.fromLatLngToDivPixel(latLngNE);
    var w=pointNE.x-pointSW.x, h=pointSW.y-pointNE.y;
    var arrT=$el.calcOverlayBounds(w,h); this.widthCanvas=arrT[0]; this.heightCanvas=arrT[1];
  }*/
  MyOverlay.prototype.draw = function()  {
    var projection = this.getProjection();
    var zoom=$mapDiv.map.getZoom(),   zoomFac=Math.pow(2,zoom);
    //var pointMer=merProj.fromLatLngToPoint(this.latLng_);        x=pointMer.x*zoomFac,   y=pointMer.y*zoomFac;
    //this.myBounds(); 
    //var widthCanvas=this.widthCanvas, heightCanvas=this.heightCanvas;
    //var latLngSW=$mapDiv.map.getBounds().getSouthWest(), latLngNE=$mapDiv.map.getBounds().getNorthEast();
    //var sw = projection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    //var ne = projection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var sw = projection.fromLatLngToDivPixel(this.bounds_[0]);
    var ne = projection.fromLatLngToDivPixel(this.bounds_[1]);
    //var pointSW = projection.fromLatLngToDivPixel(latLngSW), pointNE = projection.fromLatLngToDivPixel(latLngNE);
    //var w=pointNE.x-pointSW.x, h=pointSW.y-pointNE.y;
    //var arrT=$mapDiv.calcOverlayBounds(w,h), widthCanvas=arrT[0], heightCanvas=arrT[1];
    //var w=this.$div.width(), h=this.$div.height();
    //var xMerL=x-w/2, xMerH=x+w/2, yMerL=y-h/2, yMerH=y+h/2;
    
    var w=ne.x-sw.x, h=sw.y-ne.y;
       
    var point = projection.fromLatLngToDivPixel(this.latLng_);
    if(typeof projection.zoom=='undefined' || projection.zoom<2) {
    //if(ne.x<point.x || sw.x>point.x){
      //var ww=projection.getWorldWidth();
      var dim=this.boundsDim_;
      w=dim[0]/dim[1]*h; wH=w/2; sw.x=point.x-wH;
      
      //var n=1; if(w/ww>2) n=2;
      //if(ne.x<point.x) { ne.x+=ww;}
      //if(sw.x>point.x) { sw.x-=ww; }
      //w=ne.x-sw.x;
      
    }
    
    //this.$div.css({left:point.x-widthCanvas/2,top:point.y-heightCanvas/2,width:widthCanvas,height:heightCanvas});
    this.$div.css({left:sw.x,top:ne.y,width:w,height:h});
    //setMess('r');
    //this.$div.css({left:0,top:0,width:widthCanvas,height:heightCanvas,background:'green'});
  };

  //groupOverlay = new MyOverlay( { map: map, 'position': map.getCenter() } );  
}


var doNothing=function(){};


/*
 * mapDiv
 */

//window.zoomLevel=-2;
var mapDivExtendGoogle=function($el){
"use strict"
  $el.toString=function(){return 'mapDiv';}
  var markers=[], markerOn=[];
  var groupOverlay, groupMarkers=[]; // "groupOverlay" used when boImgCreationOK==TRUE, "groupMarkers" otherwise.
  var maxZ=google.maps.Marker.MAX_ZINDEX;
  var markerZ=[];
  $el.markers=markers;
  
  $el.curMarker;
  $el.map;
  $el.hideMarkers=function(){
    for (var i=0;i<markers.length; i++) {  markers[i].setVisible(false);  } 
  }
  $el.hideGroupMarkers=function(){
    for (var i=0;i<groupMarkers.length; i++) {  groupMarkers[i].setVisible(false);  } 
    //groupMarkers=[];   groupMarkers.length = 0;
  }
  $el.calcOverlayBounds=function(w,h,arr){
    if(typeof arr=='undefined') arr=Array(2);
    arr[0]=w/2; arr[1]=h/2;
    arr[0]=2*w; arr[1]=2*h;
    //arr[0]=200+w; arr[1]=200+h;
    arr[0]=w; arr[1]=h;
    return arr;
  }
  
  var makeFuncOver=function(i){ return function() {  
    var arrTmp=[];
    if(i>=nMTab) {markers[i].setIcon(makeMarkerBubble('  '));}
    //for(var jSel in ColsShow){
    for(var j=0;j<ColsShow.length;j++){
      var strName=ColsShow[j], tmp, tmpObj=(strName in Prop)?Prop[strName]:emptyObj; 
      if('setMapMF' in tmpObj) {  var tmp=tmpObj.setMapMF(i);  }else tmp=MTab[i][strName]; 
      if(typeof tmp=='string') arrTmp.push(calcLabel(langHtml.label, strName)+': '+tmp);
    }
    var tmp=arrTmp.join('\n'); arrTmp=null;
    markers[i].setIcon(makeMarkerBubble(tmp)); markers[i].setZIndex(maxZ); };
  }
 
  var makeOneRowIcon=function(i){
    if(i>=nMTab) {return makeMarkerBubble('  ');}
    var ico;  // url or object
    var strName=colOneMark;  if(boImgCreationOK==0 && strName!='image' && strName!='idTeam') strName='image';
    var tmp=MTab[i][strName], tmpObj=(strName in Prop)?Prop[strName]:emptyObj; 
    if('setMapF' in tmpObj)  tmp=tmpObj.setMapF(i);
    if(typeof tmp!='object'){
      if((typeof tmp=='string' && tmp.length==0) || tmp===null){tmp='  ';}
      ico=makeMarkerBubble(tmp);
    }else ico=tmp;
    return ico;
  }

  var makeFuncOut=function(i){ return function() { 
    var imgUri=makeOneRowIcon(i);  markers[i].setIcon(imgUri); markers[i].setZIndex(markerZ[i]); };   } 
  var makeFuncTog=function(i){   
    var fOut=makeFuncOut(i), fOn=makeFuncOver(i); return function(){  if(markerOn[i]) fOut(); else fOn(); markerOn[i]=1-markerOn[i];};    
  }
  var makeFuncInfoClick=function(i){ 
    //var fOut=makeFuncOut(i);
    return function(){    
      //var idFB=MTab[i].idFB;   
      //$vendorInfoDiv.setContainers(idFB);
      $vendorInfoDiv.setContainers(i);
      $vendorInfoDiv.setVis(); 
      doHistPush({$view:$vendorInfoDiv});
      //if(!boTouch) {fOut();}
    }
  }
  
  $el.setMarkers=function(){ 
    if(boImgCreationOK) {    if(typeof groupOverlay!='undefined') groupOverlay.setMap(null);  }
    else { $mapDiv.hideGroupMarkers(); } 

    // reads globals: $el.map, markerZ, MTab, ColsShow, colOneMark

    for(var i=0; i<nMTab; i++) {
      markerZ[i]=nMTab-i; //first mark on top (highest Z)
      //var tmpPoint = new google.maps.Point(MTab[i].x, MTab[i].y);
      var tmpPoint = [MTab[i].x, MTab[i].y];
      var ico=''; 
      //if(boImgCreationOK) { ico=makeOneRowIcon(i); } else ico=uImageFolder+'numbers/'+(i+1)+'.png';
      ico=makeOneRowIcon(i);
      markers[i].setOptions({ position: merProj.fromPointToLatLng(tmpPoint), icon:ico, zIndex:markerZ[i], visible:true })
      markerOn[i]=0;
    }
    for(var i=nMTab;i<maxVendor; i++) { markers[i].setVisible(false);}
    
  }
  
  $el.setGroupOverlayW=function(){
    if(boImgCreationOK) $el.setGroupOverlay(); else $el.setGroupMarkers();
  }
  
    // For browsers where boImgCreationOK==false
  $el.setGroupMarkers=function(){
    $mapDiv.hideMarkers();
    $mapDiv.hideGroupMarkers();
    var lenMGroupTab=$mapDiv.MGroupTab.length;
    for(var i = 0; i < lenMGroupTab; i++) {
      //var tmpPoint = new google.maps.Point($mapDiv.MGroupTab[i][0], $mapDiv.MGroupTab[i][1]);
      var tmpPoint = [$mapDiv.MGroupTab[i][0], $mapDiv.MGroupTab[i][1]];
      var nD=$mapDiv.MGroupTab[i][2];
      var imgUri; if(boImgCreationOK) {  imgUri=makeMarker(nD); }
      else {
        if(nD>=100000) nD=100000; else if(nD>=10000) nD=10000; else if(nD>=1000) nD=1000;  else if(nD>=100) nD=100;  else if(nD>=10) nD=10;
        imgUri=uImageFolder+'numGroup/'+nD+'.png';
      }
      
      var tmpLatLng=merProj.fromPointToLatLng(tmpPoint);
      if(typeof groupMarkers[i]==='undefined') {
        //alert(i);
        groupMarkers[i] = new google.maps.Marker({ map: $el.map, position: tmpLatLng, visible:true, icon:imgUri, zIndex:i, clickable:false });
      }
      else { groupMarkers[i].setOptions({ map: $el.map, position: tmpLatLng, icon:imgUri, zIndex:i, visible:true }); }
    }
    var lenGroupMarkers=groupMarkers.length;
    //setMess(lenMGroupTab+' '+lenGroupMarkers);
    //for(var i=lenMGroupTab;i<lenGroupMarkers; i++) { groupMarkers[i].setVisible(false); }
  }


    // For browsers where boImgCreationOK==true
  $el.setGroupOverlay=function(){
    $mapDiv.hideMarkers();
    var zoom=$el.map.getZoom(), latLng=$el.map.getCenter();
    var pointMer=merProj.fromLatLngToPoint(latLng); 

    var zoomFac=Math.pow(2,zoom);

    var pointMerZ={x:pointMer.x*zoomFac,y:pointMer.y*zoomFac};
    
    if(typeof groupOverlay=='undefined') groupOverlay = new MyOverlay();  
    groupOverlay.latLng_=latLng;
    
    var arrT=$el.calcOverlayBounds($el.width(),$el.height()); var widthCanvas=arrT[0], heightCanvas=arrT[1];
    var canvas=groupOverlay.canvas, ctx=groupOverlay.ctx;

    var w=widthCanvas, h=heightCanvas;
    var xMerL=pointMer.x-w/2/zoomFac, xMerH=pointMer.x+w/2/zoomFac, yMerL=pointMer.y-h/2/zoomFac, yMerH=pointMer.y+h/2/zoomFac;
    var pointMerSW = new google.maps.Point(xMerL, yMerH), pointMerNE = new google.maps.Point(xMerH, yMerL);
    var latLngSW=merProj.fromPointToLatLng(pointMerSW,true), latLngNE=merProj.fromPointToLatLng(pointMerNE,true);
    //var pointMerSW = [xMerL, yMerH], pointMerNE = [xMerH, yMerL];
    //var latLngSW=merProj.fromPointToLatLngV(pointMerSW,true), latLngNE=merProj.fromPointToLatLngV(pointMerNE,true);
    //groupOverlay.bounds_=new google.maps.LatLngBounds(latLngSW, latLngNE);
    groupOverlay.bounds_=[latLngSW, latLngNE];
    groupOverlay.boundsDim_=[widthCanvas,heightCanvas];
    //xMerL=Math.max(xMerL,0); xMerH=Math.min(xMerH,256); widthCanvas=xMerH*zoomFac-xMerL;
    
    canvas.width=widthCanvas;   canvas.height=heightCanvas;   
    var widthCanvasH=widthCanvas/2, heightCanvasH=heightCanvas/2; 
    //var pointXMin=pointMerZ.x-widthCanvasH, pointXMax=pointMerZ.x+widthCanvasH, pointYMin=pointMerZ.y-heightCanvasH, pointYMax=pointMerZ.y+heightCanvasH; 
    //pointXMin=Math.round(pointXMin/xDiv)*xDiv; pointXMax=Math.round(pointXMax/xDiv)*xDiv; pointYMin=Math.round(pointYMin/yDiv)*yDiv; pointYMax=Math.round(pointYMax/yDiv)*yDiv;
    

    var lenMGroupTab=$mapDiv.MGroupTab.length;
    for(var i = 0; i < lenMGroupTab; i++) {
      //var tmpPoint = new google.maps.Point($mapDiv.MGroupTab[i][0], $mapDiv.MGroupTab[i][1]);
      var xZ=$mapDiv.MGroupTab[i][0]*zoomFac, yZ=$mapDiv.MGroupTab[i][1]*zoomFac;
      var nD=$mapDiv.MGroupTab[i][2], str=nD+'';
      var cx=xZ-pointMerZ.x+widthCanvasH, cy=yZ-pointMerZ.y+heightCanvasH;
      var widthText=groupOverlay.ctxMeas.measureText(str).width;  
      var widthBox=widthText+4, heightBox=10,  widthBoxHalf=widthBox/2, heightBoxHalf=heightBox/2,  wTH=widthBox/2, hTH=heightBox/2;

      ctx.beginPath(); ctx.moveTo(cx-wTH, cy-hTH); ctx.lineTo(cx+wTH,cy-hTH);  ctx.lineTo(cx+wTH, cy+hTH); ctx.lineTo(cx-wTH, cy+hTH);   ctx.closePath();   ctx.fillStyle="#FF7777"; ctx.fill();
      ctx.fillStyle = "black";     ctx.fillText(str, cx-widthText/2, cy+heightBoxHalf-1 );    // Write text
    }
   
    if(boImgCreationOK) {  
      groupOverlay.$img.prop({src:canvas.toDataURL("image/png")});//.css({background:'green'});
    }
    else {
    
    }
    //groupOverlay.setValues( { map: $el.map, 'position': groupOverlay.latLng_} );
    groupOverlay.setValues( { map: $el.map} );
    
  }

  $el.initMarkers=function(){
    for(var i=0; i<maxVendor; i++) {
      markers[i] = new google.maps.Marker({
        map: $el.map, 
        visible:false
      });
        
      google.maps.event.addListener(markers[i], 'click', makeFuncInfoClick(i));
      if(boImgCreationOK){
        if(boTouch) {
          //google.maps.event.addListener(markers[i], 'click', makeFuncTog(i));
        }else {
          google.maps.event.addListener(markers[i], 'mouseover', makeFuncOver(i));
          google.maps.event.addListener(markers[i], 'mouseout', makeFuncOut(i));
        }
      }
      
    }
  }
  
    // Store values for times when the map is not visible.
  $el.storeVar=function(){
    if($el.is(':visible')) { 
      $el.storedLatLngCent=$el.map.getCenter(); 
      $el.storedZoom=$el.map.getZoom();
      $el.storedVPSize=$el.getVPSize();
    }
  } 
  $el.boGeoStatSucc=0;
  $el.set1=function(zoomLevel) {
    var myOptions = {
      zoom: zoomLevel,  
      center: $el.latLngMe,  
      //disableDefaultUI:true,
      panControl: false,
      mapTypeControl: false,
      streetViewControl:false,
      //zoomControl:true,
      zoomControlOptions:{  position: google.maps.ControlPosition.LEFT_BOTTOM},
      //navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $el.map = new google.maps.Map($el[0], myOptions);
    $el.initMarkers();

    var boTmp=Boolean(boVideo);
    //boTmp=true;
    $el.curMarker = new google.maps.Marker({
      position: $el.latLngMe, 
      map: $el.map, 
      draggable:boTmp,
      //icon:uHelpFile,
      //zIndex:-1,
      title:"You are here!"
    });

    google.maps.event.addListener($el.curMarker, 'dragend', function(arg){  
      $el.latLngMe=arg.latLng;
      var tmp=merProj.fromLatLngToPointV($el.latLngMe);
    });


    
    
    $el.map.addListener('idle', $el.storeVar);
    
      // On user drag/zoom, temporarly add reloadFunc
    var h=null;
    var reloadFunc=function(){ 
      loadTabStart();
      google.maps.event.removeListener(h); h=null;
    }
    var addReloadFunc=function() {
      if(!h) h=$el.map.addListener('idle', reloadFunc);
    }
    $el.map.addListener('zoom_changed', addReloadFunc);    $el.map.addListener('drag', addReloadFunc);
  
  
    /*
    var contentString = 'abc';
    var infowindow = new google.maps.InfoWindow({ content: contentString });
    if(boTouch){ google.maps.event.addListener($el.curMarker, 'click', function() {  infowindow.open($el.map,$el.curMarker);  });
    }else{
      google.maps.event.addListener($el.curMarker, 'mouseover', function() {  infowindow.open($el.map,$el.curMarker);  });
      google.maps.event.addListener($el.curMarker, 'mouseout', function() {  infowindow.close();  });
    }
    */
    //IRet2();
    //setTimeout(IRet2,100);
     
  }
  $el.setPos=function(position) {
    if(boVideo) position=posDebug;
    
    $el.latLngMe = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    $el.map.setOptions({center: $el.latLngMe});
    $el.curMarker.setPosition($el.latLngMe);
    $el.storedLatLngCent=$el.latLngMe;
    //$el.storeVar();
  }
  $el.set=$el.setPos; // for backward compatibility
  $el.getVPSize=function() {
    var $d=$($el.map.getDiv());
    return [Number(String($d.width())), Number(String($d.height()))];
    //return [$d.width(), $d.height()];
  }
    
  //$el.setF={};$el.setMF={};
  
  

  //$el.css({height:'25em',width:'25em'}); 
  $el.css({height:'25em',width:'100%'}); 
  $el.latLngMe=new google.maps.LatLng(0, 0);

  return $el;
}




pixMult=function(pixT,fac){pixT.x*=fac; pixT.y*=fac;}
var mapDivExtend=function($el){
  $el.toString=function(){return 'mapDiv';}
  var markers=[], markerOn=[];
  var groupOverlay, groupMarkers=[]; // "groupOverlay" used when boImgCreationOK==TRUE, "groupMarkers" otherwise.
  var maxZ=intMax;
  var markerZ=[];
  $el.markers=markers;
  
  $el.curMarker;
  
  var touchesOld=[];
  var getStoredTouch=function(identifier) {
    for (var i=0; i<touchesOld.length; i++) {
      if(touchesOld[i].identifier == identifier) { return touchesOld[i]; }
    }
    alert('Touch not found, touchesOld.length:'+touchesOld.length+', touchesOld[0].identifier: '+touchesOld[0].identifier+', idNew:'+identifier);
    return -1;
  }

  var handleStart=function(evt) {
    evt.preventDefault();
    var Tou = evt.targetTouches, mode=Tou.length;
          
    storeTouches(Tou);
    //setMess(mode);
  }
  var storeTouches=function(Tou){
    touchesOld=[];
    for(var i=0; i<Tou.length; i++) { var t=Tou[i]; touchesOld[i]={pageX:t.pageX, pageY:t.pageY, identifier:t.identifier};}
  }
  var calcD=function(tA,tB){  var xD=tB.pageX-tA.pageX, yD=tB.pageY-tA.pageY;  return Math.sqrt(xD*xD +yD*yD);  }
  var getCorresponingTouchesOld=function(Tou){return [getStoredTouch(Tou[0].identifier), getStoredTouch(Tou[1].identifier)];}
  var calcTwoTouchCenterNDist=function(Tou){
    var tA=Tou[0], tB=Tou[1], xA=tA.pageX, xB=tB.pageX, xavg=(xA+xB)/2,     yA=tA.pageY, yB=tB.pageY, yavg=(yA+yB)/2;
    var d=calcD(tA,tB);
    return {x:xavg,y:yavg,d:d};
  }

  var zCur,leftCur,topCur;
  var panNZoom=function(Tou,boEnd){
    var mode=Tou.length;
    if(mode==1){
      var tAL=getStoredTouch(Tou[0].identifier), xavgL=xAL=tAL.pageX, yavgL=yAL=tAL.pageY;
      var tA=Tou[0], xavg=xA=tA.pageX, yavg=yA=tA.pageY;
      var dXScreen=xavg-xavgL;    leftCur+=dXScreen;
      var dYScreen=yavg-yavgL;    topCur+=dYScreen;
      var tmp=boundY(zCur,leftCur,topCur),  zCurT=tmp.z, leftCurT=tmp.left, topCurT=tmp.top;
      $board.css({'transform':'matrix('+zCurT+',0,0,'+zCurT+','+leftCurT+','+topCurT+')'});
    }else if(mode==2){

      var doub=calcTwoTouchCenterNDist(Tou);
      var TouL=getCorresponingTouchesOld(Tou);
      var doubL=calcTwoTouchCenterNDist(TouL);

      var rat=doub.d/doubL.d;
      var zL=zCur;
      zCur=rat*zL;       
      var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
      var widthBox=$mapDiv.width(), heightBox=$mapDiv.height();


      var brdTilePiv=calcBrdTilePiv(doubL.x-leftContainer, doubL.y-topContainer, zL, leftCur, topCur);
      var tmp=calcLeftTop(doub.x-leftContainer, doub.y-topContainer, zCur, brdTilePiv); leftCur=tmp.left; topCur=tmp.top;

      //var brdTilePivX=(doubL.x-leftContainer-leftCur)/zL,  brdTilePivY=(doubL.y-topContainer-topCur)/zL;
      //var tmp=calcLeftTop(doub.x-leftContainer, doub.y-topContainer, zCur, {x:brdTilePivX,y:brdTilePivY}); leftCur=tmp.left; topCur=tmp.top;

      var tmp=boundY(zCur,leftCur,topCur),  zCurT=tmp.z, leftCurT=tmp.left, topCurT=tmp.top;

      $board.css({'transform':'matrix('+zCurT+',0,0,'+zCurT+','+leftCurT+','+topCurT+')'});
      $divPiv.css({left:brdTilePiv.x+'px',top:brdTilePiv.y+'px'}); // little black square
    }
    else if(mode==0){ // boEnd   

      var zL=zCur;
      var zCurLev=round(log2(zCur)); zCur=Math.pow(2,zCurLev); 
      var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
      var widthBox=$mapDiv.width(), heightBox=$mapDiv.height();

      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zL, leftCur, topCur);
      var tmp=calcLeftTop(widthBox/2, heightBox/2, zCur, brdTilePiv); leftCur=tmp.left; topCur=tmp.top;

      //var brdTilePivX=(widthBox/2-leftCur)/zL,  brdTilePivY=(heightBox/2-topCur)/zL;
      //var tmp=calcLeftTop(widthBox/2, heightBox/2, zCur, {x:brdTilePivX,y:brdTilePivY}); leftCur=tmp.left; topCur=tmp.top;

      var tmp=boundY(zCur,leftCur,topCur);  zCur=tmp.z; leftCur=tmp.left; topCur=tmp.top;

      $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});

        // Converting to pixC; (might seem unnecessary, in a future version the amount of statevariables might be reduced) See comment below on state variables
      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
      pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};

      //var brdTilePivX=(widthBox/2-leftCur)/zCur,  brdTilePivY=(heightBox/2-topCur)/zCur;
      //pixC={x:pixBoardX*zCur+brdTilePivX*zCur, y:pixBoardY*zCur+brdTilePivY*zCur};

      var zoomFacRTmp=zCur*zoomFacRW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
      $el.setTile(zoomLevT);

    }
    storeTouches(Tou);
  }
  $divPiv=$('<div>').css({position:'absolute',background:'black',width:'5px',height:'5px','z-index':5});



  var pixBoardX, pixBoardY
  

  var handleMove=function(evt) {
    evt.preventDefault();
    panNZoom(evt.targetTouches,0);
  }

  var handleEnd=function(evt) {
    evt.preventDefault(); 
    panNZoom(evt.targetTouches,1); 
    return false;
  }

  var handleCancel=function(evt) {
    evt.preventDefault(); 
    panNZoom(evt.targetTouches,1); 
    strMess=' C'+evt.targetTouches.length;
    setMess(strMess);
  }


  //////////////////////////////////////////////////////////////////////////

  var myMousewheel=function(e) {
    var rat; if(boFF) rat=e.detail>=0?0.5:2; else  rat=e.originalEvent.wheelDelta>=0?2:0.5;
    var xavg=e.pageX, yavg=e.pageY;

    zL=zCur;
    zCur=rat; 
    var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
    var widthBox=$mapDiv.width(), heightBox=$mapDiv.height();


    var brdTilePiv=calcBrdTilePiv(xavg-leftContainer, yavg-topContainer, zL, leftCur, topCur);
    var tmp=calcLeftTop(xavg-leftContainer, yavg-topContainer, zCur, brdTilePiv); leftCur=tmp.left; topCur=tmp.top;

    //var brdTilePivX=(xavg-leftContainer-leftCur)/zL,  brdTilePivY=(yavg-topContainer-topCur)/zL;
    //var tmp=calcLeftTop(xavg-leftContainer, yavg-topContainer, zCur, {x:brdTilePivX,y:brdTilePivY}); leftCur=tmp.left; topCur=tmp.top;

    var tmp=boundY(zCur,leftCur,topCur);  zCur=tmp.z; leftCur=tmp.left; topCur=tmp.top;
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});


      // Converting to pixC; (might seem unnecessary, in a future version the amount of statevariables might be reduced) See comment below on state variables
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};

    //var brdTilePivX=(widthBox/2-leftCur)/zCur,  brdTilePivY=(heightBox/2-topCur)/zCur;
    //pixC={x:pixBoardX*zCur+brdTilePivX*zCur, y:pixBoardY*zCur+brdTilePivY*zCur};

    var zoomFacRTmp=zCur*zoomFacRW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
    $el.setTile(zoomLevT);

  }
  var panF=function(e){
    var xavg=e.pageX, yavg=e.pageY;
    var dXScreen=xavg-xavgL;    leftCur=leftCur+dXScreen;
    var dYScreen=yavg-yavgL;    topCur=topCur+dYScreen;
    var tmp=boundY(zCur,leftCur,topCur); var leftCurT=tmp.left, topCurT=tmp.top;
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCurT+','+topCurT+')'});
    setMess('topCur: '+round(topCur-dYScreen)+', dYScreen: '+round(dYScreen)+', topCur: '+round(topCur));
    xavgL=xavg; yavgL=yavg;
  }
  var myMousedown=function(e){
    var e = e || window.event; if(e.which==3) return;
    xavgL=e.pageX; yavgL=e.pageY;
    $(document).on('mousemove',myMousemove).on('mouseup',myMouseup);
    $glas.css({cursor:'move'});
    e.preventDefault();
  }
  var myMouseup=function(e){ 
    panF(e);
    $(document).off('mousemove').off('mouseup');
    $glas.css({cursor:''});
    e.preventDefault();
    var tmp=boundY(zCur,leftCur,topCur);  zCur=tmp.z; leftCur=tmp.left; topCur=tmp.top;
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    pixC=calcPixC();
    //var zFac=round(zCur)*zoomFacRW, zLev=log2(zFac);
    var zoomLevT=log2(zoomFacRW);
    $el.setTile(zoomLevT);
  }
  var myMousemove=function(e){
    panF(e);
    e.preventDefault();
  };



  var calcBrdTilePiv=function(framePivX, framePivY, z, left, top){ 
    var brdTilePivX=framePivX/z  -left/z ;
    var brdTilePivY=framePivY/z  -top/z ;
    return {x:brdTilePivX,y:brdTilePivY};
  }

  var calcLeftTop=function(framePivX, framePivY, z, brdTilePiv){
    var left=framePivX  -brdTilePiv.x*z ;
    var top=framePivY  -brdTilePiv.y*z ;
    return {left:left,top:top};
  }


  var regExpTransform=RegExp('matrix\\(([^,]*),[^,]*,[^,]*,[^,]*,([^,]*),([^,]*)\\)');
  var getTransform=function(){
    var str=$board.css('transform');
    var Match=regExpTransform.exec(str);
    if(typeof Match!='array') new Error("typeof Match!='array'");
    if(Match.length!=4) new Error("Match.length!=4");
    return {z:Number(Match[1]),left:Number(Match[2]),top:Number(Match[3])};
    
  }
  var calcPixC=function(){
    var trans=getTransform(); var zCur=trans.z, leftCur=trans.left, topCur=trans.top;
    var widthBox=$mapDiv.width(), heightBox=$mapDiv.height();
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    var pixCN={x:pixBoardX+brdTilePiv.x, y:pixBoardY+brdTilePiv.y};    
    //var brdTilePivX=(widthBox/2-leftCur)/zCur,  brdTilePivY=(heightBox/2-topCur)/zCur;
    //var pixCN={x:pixBoardX+brdTilePivX, y:pixBoardY+brdTilePivY}; 
    return pixCN;
  }
  var calcPC=function(){ var tmp=calcPixC();  pixMult(tmp,1/zoomFacRW);  return tmp;}


  boundY=function(zCur,leftCur,topCur){
    var zL=zCur;
    var zoomFac=zCur*zoomFacRW;
    var widthBox=$mapDiv.width(), heightBox=$mapDiv.height(), minDim=Math.min(widthBox,heightBox);
    var zoomFacWorld=minDim/WCMAX;  // If zoomFac is smaller than this then the whole world will fit in $mapDiv
    var zoomLevCenter=Math.floor(log2(zoomFacWorld)), zoomFacCenter=Math.pow(2,zoomLevCenter);  // Smallest allowed zoom; "The world" will be centered if below this level  
    
    var brdTilePiv=calcBrdTilePiv(0, 0, zCur, leftCur, topCur);
    var pixFrameNorth=pixBoardY +brdTilePiv.y,   pixFrameSouth=pixFrameNorth+heightBox/zCur;

    //var brdTilePivY=-topCur/zCur ;
    //var pixFrameNorth=pixBoardY +brdTilePivY,   pixFrameSouth=pixFrameNorth+heightBox/zCur;

    var zCurN=zCur,leftCurN=leftCur,topCurN=topCur;
    var boBound=0;
    if(zoomFac<=zoomFacWorld) {
      if(zoomFac<=zoomFacCenter){ 
        zoomFac=zoomFacCenter; zCurN=zoomFac/zoomFacRW;
      } 
      boBound=1;

      leftCurN=-WCMID*zoomFac +pixBoardX*zCurN +widthBox/2;
      topCurN=-WCMID*zoomFac +pixBoardY*zCurN  +heightBox/2;
    }else {
      var boSpaceAbove=pixFrameNorth<0;
      var boSpaceBelow=pixFrameSouth>WCMAX*zoomFacRW;
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
    return {boBound:boBound, z:zCurN, left:leftCurN, top:topCurN};
  }

  $el.setPos=function(position,zoomLev){
    var latLng={lat:position.coords.latitude, lng:position.coords.longitude};
    var pMerCent=merProj.fromLatLngToPoint(latLng);
    var zoomFac=Math.pow(2,zoomLev);
    pixC={x:pMerCent.x*zoomFac, y:pMerCent.y*zoomFac};  
    //pixC={x:0, y:0};  
    $el.setTile(zoomLev);
  }
  $el.set1=function() {
  }
  $el.setTile=function(zoomLev){
    var widthBox=$mapDiv.width(), heightBox=$mapDiv.height();

    var boRefresh=1;
    if(widthBox!=widthBoxLast || heightBox!=heightBoxLast || zoomLev!=zoomLevLast) { boRefresh=1; widthBoxLast=widthBox; heightBoxLast=heightBox; zoomLevLast=zoomLev;}

    var zoomFac=Math.pow(2,zoomLev);
    var pixCX=pixC.x,pixCY=pixC.y;
    var pixFrameX=pixCX-widthBox/2, tileXRFirst=pixFrameX/TILESIZE, tileXFirst=Math.floor(tileXRFirst);  leftCur=-(tileXRFirst-tileXFirst)*TILESIZE;
    var pixFrameY=pixCY-heightBox/2, tileYRFirst=pixFrameY/TILESIZE, tileYFirst=Math.floor(tileYRFirst); topCur=-(tileYRFirst-tileYFirst)*TILESIZE;
    pixBoardX=pixFrameX+leftCur; pixBoardY=pixFrameY+topCur;
      var nTileX=Math.ceil(widthBox/TILESIZE)+1, nTileY=Math.ceil(heightBox/TILESIZE)+1;

    zoomFacRW=zoomFac;
    if(boRefresh){
      var zoomLevPlusDRLev=zoomLev+drLev;
      var $tileTmp=$board.children('img').detach(); $TileStack.push($tileTmp);
      var tileXZ=tileXFirst, tileYZ=tileYFirst;
      for(var i=0;i<nTileX;i++){ 
        var tileX=tileXZ+i, left=i*TILESIZE;
        for(var j=0;j<nTileY;j++){   
          var tileY=tileYZ+j, top=j*TILESIZE;
          var tmp=normalizeAng(tileX, zoomFac/2*dr, zoomFac*dr); tileX=tmp[0];
          var boBlue=0, tmp=normalizeAng(tileY, zoomFac/2*dr, zoomFac*dr); nCorrectionY=tmp[1];

          var wTmp;
          if(nCorrectionY<0) wTmp='northPole.png';
          else if(nCorrectionY>0) wTmp='southPole.png';
          else {
            if(zoomLevPlusDRLev>=0) wTmp=uMapSourceDir+'/'+zoomLevPlusDRLev+'/'+tileX+'/'+tileY+'.png';  
            else wTmp='mapm'+(-zoomLevPlusDRLev)+'.png';
            //else if(zoomLev==-1) wTmp='mapm1.png';
            //else if(zoomLev==-2) wTmp='mapm2.png';
            //else if(zoomLev==-3) wTmp='mapm3.png';
          }
          var $tile; if($TileStack.length) $tile=$($TileStack.pop()); else $tile=$('<img>').css({position:'absolute',opacity:0.7}); //,border:'solid 1px grey'
          $tile.prop({src:wTmp}).css({left:left+'px',top:top+'px', 'transform-origin':'left top', transform:'scale('+1/dr+')'});
          $board.append($tile);
        }
      }
      $el.drawMarkers();
      $board.append($glas);
    }else{
    }
    zCur=1;
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
  }
  $el.drawMarkers=function(){  
    var $arr=$markers;
    $arr.each(function(i){
      var $t=$(this), left=this.x*zoomFacRW-pixBoardX, top=this.y*zoomFacRW-pixBoardY;
       $t.css({left:left,top:top});      
    });
  }
  //$el.setMarkers=function($arr){
    //$markers=$arr;
    //$glas.append($arr);
  //}
  $el.setMarkers=function(){ 
    if(boImgCreationOK) {    if(typeof groupOverlay!='undefined') groupOverlay.setMap(null);  }
    else { $mapDiv.hideGroupMarkers(); } 

    // reads globals: $el.map, markerZ, MTab, ColsShow, colOneMark

    for(var i=0; i<nMTab; i++) {
      markerZ[i]=nMTab-i; //first mark on top (highest Z)
      //var tmpPoint = new google.maps.Point(MTab[i].x, MTab[i].y);
      var tmpPoint = [MTab[i].x, MTab[i].y];
      var ico=''; 
      //if(boImgCreationOK) { ico=makeOneRowIcon(i); } else ico=uImageFolder+'numbers/'+(i+1)+'.png';
      ico=makeOneRowIcon(i);
      markers[i].setOptions({ position: merProj.fromPointToLatLng(tmpPoint), icon:ico, zIndex:markerZ[i], visible:true })
      markerOn[i]=0;
    }
    for(var i=nMTab;i<maxVendor; i++) { markers[i].setVisible(false);}
    
  }

  var widthBoxLast=-1, heightBoxLast=-1, zoomLevLast=-20;
  var $TileStack=$([]);
  var arrInd=[];
  $board=$('<div>').css({position:'absolute','box-sizing': 'border-box'})
  //$board.css({width:2*256,height:2*256}); //,border:'solid 3px red' ,'zoom':0.5
  $board.css({width:'100%',height:'100%'}); //,border:'solid 3px red' ,'zoom':0.5
  $board.css({'transform-origin':'left top'}); //,border:'solid 3px red' ,'zoom':0.5
  //$board.css({width:50,height:50}); //,border:'solid 3px red' ,'zoom':0.5
  //var $pinDiv=$('<div>').css({position:'relative', width:'100%',height:'100%'});
  
  var $Img=$([]);//.push($img1).push($img2).css({transform:'translate(-50%, 0)', position:'absolute','z-index':1});
  $glas=$('<div>').css({position:'absolute', top:0, left:0, width:'512',height:'512'});
  //$glas=$('<div>').css({position:'absolute', top:0, left:0, width:"calc(100% + 256px)",height:"calc(100% + 256px)"});
  $glas.css({border:'pink solid','box-sizing': 'border-box'});
  $glas.css({width:"calc(200% + 512px)",height:"calc(200% + 512px)"});
  //for(var i=0;i<20;i++){
    //var x=20*(i%5), y=20*(i/5);
    //$img=$('<img>').attr({src:'num1/1.png'}).css({ left:256+x,top:256+y});
    //$Img.push($img);
    //$glas.append($img);
  //}
  //$Img.css({transform:'translate(-50%, 0)', position:'absolute','z-index':1});

  
  $board.append($divPiv,$glas);
  var $markers=$([]); 
  

  if(!boTouch){
    if(boFF) $glas[0].addEventListener("DOMMouseScroll", myMousewheel, false); else   $glas.bind('mousewheel', myMousewheel);
    $glas.on('mousedown','',myMousedown);
    //$Img.on('mouseover',function(){$(this).attr({src:'num1/1.png'}); return 0;});
    //$Img.on('mouseout',function(){$(this).attr({src:'num1/2.png'}); return 0;});
    //$Img.on('mousedown',function(){console.log('gg'); return false;});
  }


  var el = $glas[0];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  //el.addEventListener("touchleave", handleEnd, false);
  el.addEventListener("touchmove", handleMove, false);

  $el.append($board); 
  $el.css({position: 'relative',overflow:'hidden'}); 
  $el.$board=$board;
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
 * timePointButt
 */

timeStampButtExtend=function($el,colName){
"use strict"
  $el.setStat=function(){ 
    if(!boUseTimeDiff[colName]){$el.text('-');}  else $el.text('+');
  }
  $el.click(function(e) { 
    e.stopPropagation();
    boUseTimeDiff[colName]=1-boUseTimeDiff[colName];
    $el.setStat();
    $tableDiv.setCell();
    $mapDiv.setMarkers();  
  });
  //$el.html(langHtml.timePref.ts);
  $el.addClass('smallButt');
  $el.setStat();
  var $bub=$('<div>').html(langHtml.tsPopup);
  popupHoverM($el,$bub); 
  return $el;
}


/*
 * columnDivs
 */

var markSelectorDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'markSelectorDiv';}
  $el.setUp=function() {  $table.find(':radio[value='+colOneMark+']').prop({checked:true});  }
   
  var saveRB=function(colOneMarkNew) { 
    if(colOneMarkNew!=colOneMark){ colOneMark=colOneMarkNew; setItem('colOneMark',colOneMark); $mapDiv.setMarkers(); }
  }
  //var saveNewMarker=function() { setItem('colOneMark',colOneMark); $mapDiv.setMarkers(); }
  $el.createTable=function(){
    for(var i=0;i<StrPropMain.length;i++){ 
      var strName=StrPropMain[i]; 
      var $rb=$('<input>').prop({"type":"radio",name:'markSel'}).val(strName);
      var $imgH=''; if(strName in helpBub) { $imgH=$imgHelp.clone().css({'margin-right':'1em'});  popupHoverM($imgH,helpBub[strName]);  }
      var $tdL=$('<td>').append(calcLabel(langHtml.label, strName),' ',$imgH), $tdRB=$('<td>').append($rb);//, $tdIM=$('<td>').append($imgH);
      var $r=$('<tr>').append($tdL,$tdRB).attr({name:strName});
      $table.append($r);
    }

    var $radioBoxes=$table.find(':radio').change(function(){ saveRB($(this).val()); });
    $radioBoxes.css({'margin':'0.6em 1.2em'});
    if(boAndroid) $radioBoxes.css({'-webkit-transform':'scale(2,2)'}); else $radioBoxes.css({width:'1.4em',height:'1.4em'});
    if(boImgCreationOK==0) { $table.find($el.strImageSel).prop('disabled', true); }

      // Add labels
    for(var i=0;i<StrGroupMain.length;i++){
      var $th=$('<th>').append(langHtml[StrGroupMain[i]],':').css({'font-size':'120%','text-align':'center'}); 
      var $h=$('<tr>').append($th,$('<td>'));    
      $markSelectorDiv.find('tr[name='+StrGroupFirstMain[i]+']').before($h);
    }

  }  

  var $checkBoxes;
  
  $el.strImageSel=":radio:not([value='image'],[value='idTeam'])";

  var $table=$('<table>').css({'margin':'0.3em 0em 0.8em',border:'1px'});
  $el.append($table);

  $el.css({'text-align':'left'});
  return $el;
}
var markSelectorFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.ChangeMapMarker).addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}



var columnSelectorDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'columnSelectorDiv';}
  $el.setUp=function() {  $checkBoxes.each(function(i,el){ var strName=$(el).val(), boOn=ColsShow.indexOf(strName)!=-1;  $(el).prop({checked:boOn}); });  }
  $el.defaultFunc=function() { 
    myCopy(ColsShowLoc,ColsShowDefault); saveCB(); $el.setUp(); 
  }  
  var StrColsByTypeTmp=[];
  $el.allFunc=function() {  myCopy(StrColsByTypeTmp,StrPropMain); if(!boShowTeam) arrValRemove(StrColsByTypeTmp,'idTeam'); myCopy(ColsShowLoc,StrColsByTypeTmp); saveCB(); $el.setUp(); }
  //$el.allFunc=function() {  myCopy(ColsShowLoc,StrPropMain); saveCB(); $el.setUp(); }
  $el.noneFunc=function() {  ColsShowLoc.length=0; saveCB(); $el.setUp();  } 
   
  $el.getCurrentInd=function(ColsShowOut){  // Capture the checked checkboxes to ColsShowOut in a way that keeps the order of ColsShow
    myCopy(ColsShowOut,ColsShow);
    var $checkBoxesOn=$table.find(":checkbox");
    $checkBoxesOn.each(function(i,el){
      var strName=$(el).val(), boOn=Number($(el).prop('checked')), ind=ColsShowOut.indexOf(strName), boExist=ind!=-1; 
      if(!boExist && boOn) ColsShowOut.push(strName); else if(boExist && !boOn) mySplice1(ColsShowOut,ind);
    });
    return ColsShowOut;
  }
  var saveCB=function() { 
    if(!myCompare(ColsShow,ColsShowLoc) ){ 
      myCopy(ColsShow,ColsShowLoc); setItem('ColsShow',ColsShow); 
      $tableDiv.colOrderRefresh();
    }
  }
  $el.createTable=function(){
    var $ha=$('<th>').append(langHtml.Column),$hb=$('<th>').append(langHtml.Show), $rh=$('<tr>').append($ha,$hb); $table.append($rh);  //.append(langHtml.Visible)
    for(var i=0;i<StrPropMain.length;i++){ 
      var strName=StrPropMain[i]; 
      var $cb=$('<input>').prop({"type":"checkbox"}).val(strName);
      var $imgH=''; if(strName in helpBub) { $imgH=$imgHelp.clone().css({'margin-right':'1em'});  popupHoverM($imgH,helpBub[strName]);  }
      var $tdL=$('<td>').append(calcLabel(langHtml.label, strName),' ',$imgH), $tdCB=$('<td>').append($cb);
      var $r=$('<tr>').append($tdL,$tdCB).attr({name:strName});
      $table.append($r);
    }

    $checkBoxes=$table.find(':checkbox').change(function(){
      var $ele=$(this);
      $el.getCurrentInd(ColsShowLoc);
      myCopy(ColsShow,ColsShowLoc); setItem('ColsShow',ColsShow); 
      var boOn=Boolean($ele.prop('checked'));
      $tableDiv.colToggle($ele.val(),boOn);
      var indNew=boOn?ColsShow.length-1:ColsShow.length;
      $tableDiv.colMove($ele.val(),indNew);
    });
    $checkBoxes.css({'margin':'0.6em 1.2em'});
    if(boAndroid) $checkBoxes.css({'-webkit-transform':'scale(2,2)'}); else $checkBoxes.css({width:'1.4em',height:'1.4em'});
    if(boImgCreationOK==0) { $table.find($markSelectorDiv.strImageSel).prop('disabled', true); }

      // add labels
    for(var i=0;i<StrGroupMain.length;i++){
      var $th=$('<th>').append(langHtml[StrGroupMain[i]],':').prop('colspan',2).css({'font-size':'120%','text-align':'center'}); 
      var $h=$('<tr>').append($th); //,$('<td>')    
      $columnSelectorDiv.find('tr[name='+StrGroupFirstMain[i]+']').before($h);
    }
  }  

  var ColsShowLoc=[];
  var $checkBoxes;

  var $table=$('<table>').css({'margin':'0.3em auto 0.8em',border:'1px'});

  $el.append($table);

  $el.css({'text-align':'left'});
  return $el;
}

var columnSelectorFootExtend=function($el){
"use strict"
  var $buttDefault=$('<button>').click($columnSelectorDiv.defaultFunc).append(langHtml.Default);
  var $buttAll=$('<button>').click($columnSelectorDiv.allFunc).append(langHtml.All);
  var $buttNone=$('<button>').click($columnSelectorDiv.noneFunc).append(langHtml.None);
  var $buttSort=$('<button>').append('Column<br>order').click(function(){ 
    $columnSorterDiv.setUp();
    $columnSorterDiv.setVis();
    doHistPush({$view:$columnSorterDiv});
  }).addClass('flexWidth').css({'float':'left','margin-right':'0.4em', 'font-size':'0.72rem'});
  var $buttonBack=$('<button>').click(doHistBack).append(strBackSymbol).addClass('fixWidth').css({'float':'left','margin-left':'0.8em','margin-right':'1em'});

  var $tmpImg=$('<img>').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  //var $span=$('<span>').append($tmpImg, langHtml.SelectColumns).css({'vertical-align':'-0.4em', 'text-align':'center', display:'inline-block'});
  var $span=$('<span>').append($tmpImg, langHtml.SelectColumns).addClass('footDivLabel');
  var $ButPre=$([]).push($buttAll,$buttDefault, $buttNone).css({'font-size':'80%','float':'right'});
  //var $spanRightB=$('<span>').append().css({'float':'right',margin:'0 0 0 0'});
  $el.append($buttonBack, $buttSort, $span, $buttNone, $buttDefault, $buttAll).addClass('footDiv'); //,overflow:'hidden'
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
  $el.myGet=function(arrO){  var $d=$el.children('div');   if(typeof arrO=='undefined') arrO=[]; else arrO.length=0;    $d.each(function(i){arrO[i]=$(this).attr("name");}); return arrO;   }
  
  $el.addClass('unselectable');    $el.prop({unselectable:"on"}); //class: needed by firefox, prop: needed by opera, firefox and ie
  var $movedRow,$movedSpan; 
  if(boTouch){  var strMoveEv='touchmove', strEndEv='touchend'; }  else{   var strMoveEv='mousemove', strEndEv='mouseup';    }
  
  return $el;
}


var columnSorterDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'columnSorterDiv';}
  $el.setUp=function(){
    arrLabel.length=0;  for(var i=0;i<ColsShow.length;i++){ arrLabel[i]=calcLabel(langHtml.label, ColsShow[i]);  }
    $dragSorter.setUp(ColsShow,arrLabel);
    $el.boLoaded=1;
  }  

  $el.boLoaded=0;
  var $head=$('<h3>').append(langHtml.SortColumns);

  var $dragSorter=dragSorterExtend($('<div>')).css({margin:'1em auto',display:'inline-block', 'text-align':'left'});  

  var tmpf=$dragSorter.myMouseup;
  $dragSorter.myMouseup=function(){
    tmpf();
    var $tmp=$dragSorter.getMovedRow(), ind=$tmp.index();
    ColsShow=$dragSorter.myGet(ColsShow);
    setItem('ColsShow',ColsShow);
    $tableDiv.colMove($tmp.attr('name'),ind);
    
  }

  var arrLabel=[];  
  $el.append($dragSorter);
  $el.css({'text-align':'center'});
  //$el.$dragSorter=$dragSorter;

  return $el;
}

var columnSorterFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').click(doHistBack).append(strBackSymbol).addClass('fixWidth').css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append(langHtml.SortColumns).addClass('footDivLabel');
  $el.append($buttonBack, $span).addClass('footDiv');  // ,overflow:'hidden' , 'text-align':'center'
  return $el;
}

/*
 * tHeadLabel
 */


var tHeadLabelExtend=function($el){
"use strict"

  $el.setArrow=function(strName,dir){
    boAsc=dir==1;
    $sortImages.prop({src:uUnsorted});     var tmp=boAsc?uIncreasing:uDecreasing;  $r.children('th[name='+strName+']').children('img[data-type=sort]').prop({src:tmp});
  }
   
  var headerCanvas=[];
  for(var i=0;i<KeyCol.length;i++) {
    var strName=KeyCol[i];
    //var colText=''; if(strName in langHtml.label) colText=langHtml.label[strName]; 
    var colText=calcLabel(langHtml.label, strName);
    if(strName=='index') colText='';
    headerCanvas[strName]=makeTextCanvas(colText,-1); 
  }

  $el.setUpCurrencyInfo=function(){
    var strCurrency='';      boMultCurrency=0;   
    for (var i=0;i<nMTab;i++) { var tmp=MTab[i].currency; if(strCurrency=='') {strCurrency=tmp;} else if(tmp!=strCurrency){boMultCurrency=1; strCurrency=''; break;} }
    var tmpCanvas=makeTextCanvas(strCurrency,-1);

    $currencyInfoDivs.each(function(i,el){
      var tmp=Object.create(tmpCanvas);
      var tmp; if(boImgCreationOK) tmp=cloneCanvas(tmpCanvas); else tmp=makeTextCanvas(strCurrency,-1);
      $(el).html(tmp);
    });    
  };

  var thClick=function() { 
    var $ele=$(this); strName=$ele.attr('name');
    boAsc=(thSorted===this)?!boAsc:true;  thSorted=this;
    $sortImages.prop({src:uUnsorted});     var tmp=boAsc?uIncreasing:uDecreasing;  $ele.children('img[data-type=sort]').prop({src:tmp});
    $tableDiv.$tBody.detach();
    var $tr=$tableDiv.$tBody.children('tr:lt('+nMTab+')');
    var $tdNameSort =$tr.children('td[name='+strName+']'); 
    $tdNameSort.sortElements(function(aT, bT){               
      var $a=$(aT), $b=$(bT), a = $a.data('valSort'),  b = $b.data('valSort'),   dire=boAsc?1:-1;
      var boAStr=0,boBStr=0;
      var aN=Number(a); if(!isNaN(aN) && a!=='') {a=aN;} else {a=a.toLowerCase(); boAStr=1;}
      var bN=Number(b); if(!isNaN(bN) && b!=='') {b=bN;} else {b=b.toLowerCase(); boBStr=1;}
      if(boAStr!=boBStr) return ((boAStr<boBStr)?-1:1)*dire; 
      if(a==b) {return 0;} else return ((a<b)?-1:1)*dire; 
    }, function(){ return this.parentNode;  });
    $tableDiv.$table.append($tableDiv.$tBody);

    //var $tdT=$tr.children('[name=index]'); $tdT.each(function(i){$(this).html(i);});
    $tableDiv.setIndex();
    //$tableDiv.sortTable(i); 
  }

  $el.myCreate=function(){
    var ColsTmp=myCopy([],ColsShow);
    for(var j=0;j<StrPropMain.length;j++){var strName=StrPropMain[j]; if(ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }


    for(var i=0;i<ColsTmp.length;i++){
      var strName=ColsTmp[i], jtmp=colsFlip[strName];
      var canvas=headerCanvas[strName], $div=$('<div>').append(canvas);   
      var $imgH=''; if(strName in helpBub) { var $imgH=$imgHelp.clone();   popupHoverM($imgH,helpBub[strName]); }
      var $imgSort=$('<img data-type=sort>');
      var $h=$("<th>").append($div,$imgH,$imgSort).addClass('unselectable').attr('name',strName); 
      if(jtmp>0) $h.click(thClick).css({cursor:'pointer'});
      
      if(i>=ColsShow.length) $h.hide();
      $r.append($h);
    }

    var $th=$r.children('th');
    $sortImages=$th.children('img[data-type=sort]').prop({src:uUnsorted});
    $sortImages.css({display:'block',zoom:1.5,'margin':'auto','margin-top':'0.3em','margin-bottom':'0.3em'}); 

  }
  var $r=$("<tr>"), boAsc=false, thSorted=null;

  $el.append($r);
  var $sortImages=$([]);

  $el.myCreate();
  
  return $el;
}

var checkCurrency=function(){
  var strCurrency='';      boMultCurrency=0;   
  for (var i=0;i<nMTab;i++) { var tmp=MTab[i].currency; if(strCurrency=='') {strCurrency=tmp;} else if(tmp!=strCurrency){boMultCurrency=1; strCurrency=''; break;} }
  return strCurrency;
}



thumbDisExtend=function(el){
"use strict"
  el.mySet=function(iMTab){
    var rT=MTab[iMTab], data=rT.idTeam, tag=rT.imTagTeam;
    if(data!=0) {
      $(el).show(); 
      var strTmp=uTeamImage+data+'?v='+tag;
      $img.prop({src:strTmp});  
      var url=rT.linkTeam;  if(url && url.length && !RegExp("^https?:\/\/","i").test(url)) { url='http://'+url; }      $(el).prop({href:url});
    }else $(el).hide();    
    
  }
  var $img=$('<img>');    $(el).prop({target:"_blank"}).append($img);    return el;
}

reportButtonExtend=function(el){
"use strict"
  el.mySet=function(iMTab){    var rT=MTab[iMTab]; idUser=rT.idUser;   $(el).html(rT.nReport);     }
  $(el).click(function(){
    $reportVDiv.setUp(idUser); $reportVDiv.load(); 
    $reportVDiv.setVis(); 
    doHistPush({$view:$reportVDiv});
  });
  var idUser;      return el;
}


/*
 * tableDiv
 */

window.MTab=[]; window.nMTab=0;
var tableDivExtend=function($el){  
"use strict"
  $el.toString=function(){return 'tableDiv';}
  $el.setMTab=function(MOrg){
    if(typeof MOrg =='undefined') nMTab=0;
    else{
      nMTab=MOrg.length;
      for(var i=0;i<nMTab;i++){
        if(typeof MTab[i] =='undefined') MTab[i]={};
        for(var j=0;j<KeySel.length;j++){  var name=KeySel[j]; MTab[i][name]=MOrg[i][j];    } 
      }
    }
  }

  $el.setIndex=function(){ var $td=$tBody.children('tr').children('[name=index]'); $td.each(function(i){$(this).html(i);});}

  $el.setRowDisp=function(){
    var tmpshow='tr:lt('+nMTab+')';
    var tmphide='tr:gt('+(nMTab-1)+')'; if(nMTab==0) tmphide='tr';
    var $rShow=$tBody.find(tmpshow);
    $rShow.show();
    $tBody.find(tmphide).hide();
  }

  var arrCHide=[],arrHHide=[];
  var strCHide='', strHHide='';
  $el.colOrderRefresh=function(){
    var len=ColsShow.length;
    var $tr=$tBody.add($tHeadLabel).children('tr');
    for(var i=len-1;i>=0;i--) { 
      var strName=ColsShow[i];
      var $tmp=$tr.children('[name='+strName+']');
      $tmp.each(function(){var $ele=$(this).show(); $ele.parent().prepend($ele);});  //
    }    

    //var StrTmp=AMinusBM(StrPropMain,ColsShow);
    var StrTmp=StrPropMain.concat([]); AMinusBM(StrTmp,ColsShow);
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
    var len=StrPropMain.length;
    var $movH=$tHeadLabel.find('tr>th[name='+strName+']');
    var $rH=$tHeadLabel.children('tr'); 
    //if(ind==len-1) $rH.append($movH);  else $rH.children('th:nth-child('+(ind+1)+')').before($movH);
    //if(ind==len-1) $rH.append($movH);  else $rH.children('th[name='+ColsShow[ind]+']').before($movH);
    if(ind==0) $rH.prepend($movH);  else $rH.children('th[name='+ColsShow[ind-1]+']').after($movH);

    var $movD=$tBody.find('tr>td[name='+strName+']');
    var $Tr=$tBody.children('tr'); 
    //var $Td=$tBody.find('tr>td:nth-child('+(ind+1)+')');
    if(ind==0) {
      $Tr.each(function(j){
        var $tr=$(this);  $tr.prepend($movD.eq(j));
      });
    }else{
      var $Td=$tBody.find('tr>td[name='+ColsShow[ind-1]+']');
      $Tr.each(function(j){
        var $tr=$(this);  $tr.children('td[name='+ColsShow[ind-1]+']').after($movD.eq(j));
      });
    }
  }


  $el.setCell=function(){
    var $tr=$tBody.children('tr');
    for(var i=0;i<nMTab;i++){ 
      var $r=$tr.eq(i); $r.data({iMTab:i});
      $r.children('td').each(function(j){
        var $ele=$(this), strName=$ele.attr('name'), tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
        //var tmp=''; if(strName in $el.sortTabF) tmp=$el.sortTabF[strName](i,$ele);  else tmp=MTab[i][strName];     $ele.data('valSort',tmp);
        var tmp=''; if('sortTabF' in tmpObj) tmp=tmpObj.sortTabF(i,$ele);  else tmp=MTab[i][strName];     $ele.data('valSort',tmp);
        //var tmp=''; if(strName in $el.setTabF) tmp=$el.setTabF[strName](i,$ele);  else tmp=MTab[i][strName]; 
        var tmp=''; if('setTabF' in tmpObj) tmp=tmpObj.setTabF(i,$ele);  else tmp=MTab[i][strName]; 
        if(typeof tmp!='undefined') $ele.html(tmp);    
      });
    }
    $el.setIndex();
  }
  
  $el.createTBody=function(){
    var ColsTmp=myCopy([],ColsShow);
    for(var j=0;j<StrPropMain.length;j++){var strName=StrPropMain[j]; if(ColsShow.indexOf(strName)==-1) ColsTmp.push(strName); }

    for(var i=0;i<maxVendor;i++) {
      var $row=$('<tr>');
      if(!boTouch) $row.on('mouseover',function(){$(this).css({background:'#faa'});}).on('mouseout',function(){$(this).css({background:''});});
      for(var j=0;j<ColsTmp.length;j++){ 
        var strName=ColsTmp[j], tmpObj=(strName in Prop)?Prop[strName]:emptyObj;
        var $td=$('<td>').css({'max-width':'200px','max-height':'40px',overflow:'hidden'}).attr('name',strName);
        if('crTabF' in tmpObj) tmpObj.crTabF($td);  
        if(j>=ColsShow.length) $td.hide();
        $row.append($td);  //,'word-break':'break-all'
      }
      $tBody.append($row);
    }
    var tmp='td:not([name=tel],[name=displayEmail],[name=nReport])'; //,[name=link]
    $tBody.on('click',tmp,function(){
      var iMTab=$(this).parent().data('iMTab');
      $vendorInfoDiv.setContainers(iMTab);
      $vendorInfoDiv.setVis(); 
      doHistPush({$view:$vendorInfoDiv});
    });
  }
  
  $el.getRow=function(iMTab){
    var $tmp=$tBody.children('tr:lt('+nMTab+')');
    $tmp=$tmp.filter(function(){return $(this).data('iMTab') == iMTab;});
    return $tmp;
  }
  $el.getMTabInd=function(idV){
    for(var i=0;i<nMTab;i++){
      if(MTab[i].idUser==idV) return i;
    }
    return NaN;
  }

  //$el.StrProp=
  //$el.StrGroup=$el.StrGroupFirst=[];
  var indSortedLast=-1, strSortedLast=-1;
  
  $el.$toManyMess=$('<div>').html(langHtml.toManyMess).hide();
  
  var $table=$('<table>').css({background:'#fff', margin:'1em auto 0em'}); //display:'inline-table',
  var $tBody=$("<tbody>");  
 
  $table.append($tBody); 
  $table.show();
  $el.append($table,$el.$toManyMess);

  $el.$table=$table; $el.$tBody=$tBody;

  return $el;
}


var tableFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').click(doHistBack).append(strBackSymbol).addClass('fixWidth').css({'float':'left','margin-left':'0.8em','margin-right':'1em'}); //'font-size':'1em'

  var tmpf=function(){ 
    $columnSelectorDiv.setUp();
    $columnSelectorDiv.setVis();
    doHistPush({$view:$columnSelectorDiv});
  };
  var $tmpImg=$('<img>').prop({src:uColumn16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $el.$buttShowSelect=$('<button>').append($tmpImg).addClass('fixWidth').css({'float':'left', 'margin-right':'1em'}).click(tmpf).prop('title',langHtml.AddRemoveColumns);

  //$el.$filterButton=$('<button>').append(langHtml.Filtered,': ').click(function(){  filterButtonClick();  }).css({'float':'right','clear':'both'});
  var $tmpImg=$('<img>').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  //var $span=$('<span>').append($tmpImg,langHtml.ComparisonTable).css({'float':'right',margin:'0.4em 0 0 0'});
  //$el.$filterButton=$filterButton.clone().click(function(){  filterButtonClick();  });
 
  //var $span=$('<span>').append($tmpImg, langHtml.ComparisonTable).css({'vertical-align':'-0.4em', 'text-align':'center', display:'inline-block'});
  var $span=$('<span>').append($tmpImg, langHtml.ComparisonTable).addClass('footDivLabel');
  $el.$filterButton=$filterButton.clone().click(function(){  filterButtonClick();  });
  $el.append($buttonBack, $el.$buttShowSelect, $span, $el.$filterButton).addClass('footDiv');  //,'text-align':'center' ,overflow:'hidden'
  return $el;
}



/*******************************************************************************************************************
 *******************************************************************************************************************
 *
 * LoadTab-callbacks
 *
 *******************************************************************************************************************
 *******************************************************************************************************************/




loadTabStart=function(boFlexZoom){
"use strict"
  if(typeof boFlexZoom=='undefined') boFlexZoom=0;
  var zoomT, VPSizeT, point, zoomT=$mapDiv.map.getZoom(), VPSizeT=$mapDiv.getVPSize();
  var latLngCent=$mapDiv.map.getCenter();  
  if($mapDiv.storedLatLngCent) {
    latLngCent=$mapDiv.storedLatLngCent;
    zoomT=$mapDiv.storedZoom;
    VPSizeT=$mapDiv.storedVPSize;
  }
  point=merProj.fromLatLngToPointV(latLngCent);

  ga('send', 'event', 'tab', 'loadTab');
  
  if(boFlexZoom) {zoomT=-1; VPSizeT=[$mapDiv.width(),$mapDiv.height()]; }
    
  //var o1={zoom:zoomT, pC:point, VPSize:VPSizeT},   oH=$filterDiv.gatherFiltData();    $.extend(o1,oH);
  //var vec=[['IFun',o1,IRet]];   majax(oAJAX,vec);
  var o1={zoom:zoomT, pC:point, VPSize:VPSizeT},   oH=$filterDiv.gatherFiltData();
  var vec=[['setUpCond',oH],['setUp',o1],['getList',1],['getGroupList',1],['getHist',1,IRet]];
  if(userInfoFrDB.vendor) vec.unshift(['setupById',{Role:'vendor'}]);  // "setupById" is included to change quickdiv button... (I think)
  majax(oAJAX,vec);
    
  setMess('... fetching vendors ... ',15,true);
}

var uploadPosNLoadTabStart=function(){
"use strict"
  var pos=merProj.fromLatLngToPointV($mapDiv.latLngMe);
  var zoomT=$mapDiv.map.getZoom(), VPSizeT=$mapDiv.getVPSize();
  
  //var o1={zoom:zoomT, pC:pos, VPSize:VPSizeT}, oH=$filterDiv.gatherFiltData();  $.extend(o1,oH);  
  //var vec=[['VUpdate',{hideTimer:Number($quickDiv.$selHideTimer.val())}], ['VShow',pos], ['setupById',{Role:'vendor'}], ['IFun',o1,IRet]];   majax(oAJAX,vec);  
  var o1={zoom:zoomT, pC:pos, VPSize:VPSizeT}, oH=$filterDiv.gatherFiltData();  
  var vec=[['VUpdate',{hideTimer:Number($quickDiv.$selHideTimer.val())}], ['VShow',pos], 
    ['setupById',{Role:'vendor'}], ['setUpCond',oH],['setUp',o1],['getList',1],['getGroupList',1],['getHist',1,IRet]];   majax(oAJAX,vec);  
  setMess('... updating pos and fetching vendors ... ',15,true);
}


var firstAJAXCall=function(pos){
"use strict"

  clearTimeout(startPopTimer);  $startPop.closeFunc();
  if(boVideo) pos=posDebug;
  //$mapDiv.latLngMe = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  $mapDiv.latLngMe={lat:pos.coords.latitude, lng:pos.coords.longitude}
  
  var point=merProj.fromLatLngToPointV($mapDiv.latLngMe);
  var zoomT=-1, VPSizeT=[$mapDiv.width(),$mapDiv.height()];
  //if(boVideo) zoomT=14;
  
  //var o1={zoom:zoomT, pC:point, VPSize:VPSizeT}, oH=$filterDiv.gatherFiltData();  $.extend(o1,oH);  
  //var vec=[['getSetting',['payLev','boTerminationCheck','boShowTeam'],$adminDiv.setUp], ['setupById',1], ['VSetPosCond',point], ['IFun',o1,IRet]];   majax(oAJAX,vec);
  var o1={zoom:zoomT, pC:point, VPSize:VPSizeT}, oH=$filterDiv.gatherFiltData();  
  var vec=[['getSetting',['payLev','boTerminationCheck','boShowTeam'],$adminDiv.setUp], ['setupById'], ['VSetPosCond',point], 
    ['setUpCond',oH],['setUp',o1],['getList',1],['getGroupList',1],['getHist',1,IRet]];   majax(oAJAX,vec);
  setMess('... fetching vendors ... ',15,true);
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
  var tmp;
  tmp=data.curTime;   if(typeof tmp!="undefined") curTime=tmp;
  tmp=data.strMessageText;   if(typeof tmp!="undefined") setMess(tmp);
  tmp=data.CSRFCode;   if(typeof tmp!="undefined") CSRFCode=tmp;
  tmp=data.sessionLoginIdP; if(typeof tmp!="undefined") {sessionLoginIdP=tmp;}
  //var WBD=[]; tmp=data.boSpecialistWannaBe; if(typeof tmp!="undefined") {
  //    for(var key in tmp){   if(boSpecialistWannaBe[key]==tmp[key]) {delete tmp[key];} else {boSpecialistWannaBe[key]=tmp[key]; }  } $loginInfo.setStat(); WBD=tmp; }
  tmp=data.userInfoFrDBUpd; if(typeof tmp!="undefined") {  for(var key in tmp){ userInfoFrDB[key]=tmp[key]; }  if(tmp.vendor) $quickDiv.setUp(); }
  tmp=data.boShowDummy;   if(typeof tmp =='undefined') tmp=0;  window.boShowDummy=tmp;
  tmp=data.nUserReal;   if(typeof tmp =='undefined'){} else  window.nUserReal=tmp;
  
 
  toggleSpecialistButts();
  $loginInfo.setStat();

  var boE=Boolean(userInfoFrDB.vendor); 
  
  if(boFirstLoadTab) {
    $mapDiv.setVis();
  }
  if(boE){ $payButton.setUp(); } 
  
  /*if(userInfoFrDB.vendor){  //check for changes in the fineprint 
    var tmp=$agreementStart.compareLocalDates(1);  if(!tmp.boFirst && tmp.boNew) { $agreementStart.setLocalDates(1); $agreementStart.openFunc(); }
  }  */
}


//var DRet=function(data){       tmp=data.boShow;   if(typeof tmp!="undefined") {userInfoFrDB.vendor.boShow=tmp; $quickDiv.setUp(); }      resetMess(10);      }
var errFunc=function(data){ resetMess(10);  }


var IRet=function(data){   
"use strict"
  var tmp,HistPHP, zoomLevel;
  tmp=data.zoom;   if(typeof tmp!="undefined") zoomLevel=tmp; 
  tmp=data.Hist;   if(typeof tmp=="undefined") tmp=[];     HistPHP=tmp;
  tmp=data.NVendor;   if(typeof tmp!="undefined") { $filterInfoSpan.setNVendor(tmp); }
  tmp=data.groupTab;   if(typeof tmp =='undefined') tmp=[];  $mapDiv.MGroupTab=tmp;
  //tmp=data.boSpur;   if(typeof tmp =='undefined') tmp=0; boSpur=tmp;
   

  var boGroupTmp=Boolean($mapDiv.MGroupTab.length);
  $tableDiv.$toManyMess.toggle(boGroupTmp);
  $tableFoot.$buttShowSelect.toggle(!boGroupTmp);
  $tableButton.prop({disabled:boGroupTmp});  $tableButton.children('img').css({opacity:boGroupTmp?0.4:1});
  var tmp=boGroupTmp?('\n ('+langHtml.toManyMess+')'):'';  $tableButton.prop('title',langHtml.ComparisonTable+tmp);
  //$tableButton.toggle(!boGroupTmp);

  //if(boFirstLoadTab) $mapDiv.set1();  else setTimeout(IRet2,100);
  
  var vt; if(typeof vt=='undefined') vt=[]; else vt.length=0;
  var t0,t1=new Date().getTime();vt.push();

  $filterDiv.interpretHistPHP(HistPHP)



  t0=t1; t1=new Date().getTime();vt.push('hist:'+(t1-t0));
  
  $tableDiv.setMTab(data.tab);
  
  if(nMTab){
  //if(1){
    //checkCurrency();
    $tHeadLabel.setUpCurrencyInfo();
    //setUpColsShowIndCurrency();
    t0=t1; t1=new Date().getTime();vt.push('setMTab:'+(t1-t0));
    $tableDiv.setCell();
    t0=t1; t1=new Date().getTime();vt.push('setCell:'+(t1-t0));
    
    //$tHeadLabel.setUpOrder();
    $tableDiv.setRowDisp();
    t0=t1; t1=new Date().getTime();vt.push('setRowDisp:'+(t1-t0));
    $tHeadLabel.setArrow('posTime',-1);  
    t0=t1; t1=new Date().getTime();vt.push('setArrow:'+(t1-t0));
    $tableDiv.children('table').show();
    //$tableDiv.show();
  }
  else {    $tableDiv.children('table').hide();  }
  $filterDiv.update();  

  
  //setMess(vt.join(', '));
  if(boMapGoogle){
    if(boFirstLoadTab) $mapDiv.set1(zoomLevel);
  }else{
    if(boFirstLoadTab) {
      var latLng=$mapDiv.latLngMe;
      var pos={coords:{latitude:latLng.lat, longitude:latLng.lng}};
      $mapDiv.setPos(pos, zoomLevel);
    }
  }

  
  //if(nMTab){    $mapDiv.setMarkers();  }  else {    $mapDiv.setGroupMarkers();  }
  if(nMTab){   $mapDiv.setMarkers();   }  
  else {  
    if(boMapGoogle){  
      if(boFirstLoadTab) {
        google.maps.event.addListenerOnce($mapDiv.map, 'bounds_changed', function(){ 
          $mapDiv.setGroupOverlayW();  }); // Need to wait, since get_bounds will be called within $mapDiv.setGroupOverlay();
      }else{ $mapDiv.setGroupOverlayW();  }
    }else{
      $mapDiv.setGroupOverlayW();
    }
  }

  if(boFirstLoadTab)  $footDiv.css({visibility:''});
  //$mapDiv.curMarker.setPosition($mapDiv.latLngMe);
  //$mapDiv.map.setOptions({center: $mapDiv.latLngMe});

  if(boFirstLoadTab && $mapDiv.MGroupTab.length==0 && nMTab==0) {
    //if(siteName=='taxi') {if($mapDiv.is(':visible'))    $seeUnActivePop.openFunc(); }
  }

  //if(siteName!='demo' && boShowDummy) $dummyShowingToast.showToast(); 
  if(boShowDummy && document.domain.substr(0,4)!='demo') $dummyShowingToast.showToast(); 
  boFirstLoadTab=0;
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
    if(boFormDataOK==0) {alert("Your browser doesn't support FormData"); return; };
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
  var strKind='v', callback;
  //$el=popUpExtend($el);  
  //$el.css({'max-width':'20em', padding: '0.3em 0.5em 1.2em 0.6em'});

  var $head=$('<h3>').append('Upload Image: ').css({'font-weight':'bold'});
  var $formFile=$('<form >'); //enctype="multipart/form-data"
  var $inpFile=$('<input type=file name=file id=file accept="image/*">').css({background:'lightgrey'});
  //var $inpUploadButton=$('<input type="button" value="Upload">');
  var $uploadButton=$('<button>').text('Upload').prop("disabled",true).css({'margin-right':'0.5em'}); //, 'float':'right'
  var $progress=$('<progress max=100, value=0>').css({'display':'block','margin-top':'1em'}).invisible();
  var $divMess=$('<div>').css({'margin-top':'1.2em', 'min-height':'1em'});
  
  var objFile;
  $inpFile.change(verifyFun).click(function(){$uploadButton.prop("disabled",true);});
  $formFile.append($inpFile);   $formFile.css({display:'inline'});
   

  var $closeButton=$('<button>').append('Close').click(doHistBack);
  var $menuBottom=$('<div>').append($closeButton, $uploadButton).css({'margin-top':'1.2em'});

  //$el.append($head, $formFile, $progress, $divMess,$menuBottom); 

  var $blanket=$('<div>').addClass("blanket");
  var $centerDiv=$('<div>').append($head, $formFile, $progress, $divMess,$menuBottom);
  $centerDiv.addClass("Center").css({'max-width':'21em', height:'15em', padding: '0.3em 0.5em 1.2em 0.6em'})
  if(boIE) $centerDiv.css({'width':'20em'}); 
  $el.addClass("Center-Container").append($centerDiv,$blanket); //

  $uploadButton.click(sendFun);
  $el.css({'text-align':'left'});
  return $el;
}


var teamDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'teamDiv';}
  $el.setUp=function(boShow){
    $el.$id.val('');  $el.$link.val('');     
    var vec=[['teamLoad',1,disLoadRet]];   majax(oAJAX,vec);
    $el.boLoaded=1;
  }
  var disLoadRet=function(data){   
    var idUser='', imTag=''
    var tmp=data.idUser;   if(typeof tmp==="undefined")  tmp=''; $el.$id.text(tmp); idUser=tmp;
    var tmp=data.imTag;   if(typeof tmp==="undefined")  tmp=''; imTag=tmp; $thumb.attr({src:uTeamImage+idUser+'?v='+imTag});
    var tmp=data.link;   if(typeof tmp==="undefined")  tmp=''; $el.$link.val(tmp);
    var tmp=data.tab;  if(typeof tmp==='undefined') tmp=[]; $el.tab=tmp;  
    $el.$divList.empty();
    //if($el.tab.length==0) return;
    for(var i=0; i<$el.tab.length; i++) {
      var $id=$('<span>').append($el.tab[i][1],' ',$el.tab[i][2],' ',$el.tab[i][3]);   
      var $cb=$('<input type=checkbox>').click(save);
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
    var idUser=userInfoFrDB.team.idUser, tag=userInfoFrDB.team.imTag;  return uTeamImage+idUser+'?v='+tag;
  }
  $el.boLoaded=0;
  $el.$id=$('<span>').css({'font-weight':'bold'});
  $el.$link=$('<input>').attr({type:'text',size:10}).keypress( function(e){ if(e.which==13) {saveName();return false;}} )
  //$el.$file=$('<input>').attr({type:'file'});
  var $thumb=$('<img>').css({'vertical-align':'middle'});
  var uploadCallback=function(){
    userInfoFrDB.team.imTag=randomHash(); $thumb.attr({src:calcTeamImageUrl()});
    //var tmpF=function(){$thumb.attr({src:calcTeamImageUrl()});};    var vec=[ ['setupById',{Role:'team'},tmpF]];   majax(oAJAX,vec);
  }
  var $buttUploadImage=$('<button>').html('Upload image').click(function(){$uploadImageDiv.openFunc('t',uploadCallback);});
  var $buttSaveName=$('<button>').html('Save link').click(saveName);
  $el.$divList=$('<div>');

  var $hId=$('<div>').html('Inform the team members of this number, they should enter it in their repective settings tab.');
  var $hLink=$('<div>').html('A link to any other site of yours.');
  var $hList=$('<div>').html('A list of drivers who wants to belong to your team. Mark those who you approve.');

  var $hImg0=$imgHelp.clone(), $hImg1=$imgHelp.clone(), $hImg2=$imgHelp.clone(); $hImg0.add($hImg1).add($hImg2).css({'margin-left':'1em'});
  popupHoverM($hImg0,$hId);   popupHoverM($hImg1,$hLink);   popupHoverM($hImg2,$hList);
  
  
 
  $el.append('Team-Id: ',$el.$id,',',$hImg0,'<br>',
          'Thumb image: ',$thumb,' ',$buttUploadImage,' &nbsp;&nbsp;(will be shrunk to fit a 50 x 50 pixel square)<br>',
          'Link: (optional)',$el.$link,' &nbsp;',$buttSaveName,$hImg1,'<hr>','<b>List of drivers</b>',$hImg2,$el.$divList); 
  //$el.append('Link: ',$el.$link,$buttSaveName,'<br>',$a,'<hr>',$el.$divList); 
  //$el.append('Name: ',$el.$name,'<br>Link: ',$el.$link,'<br>',$buttSaveName,'<hr>',$el.$divList); 
  
  $el.css({'text-align':'left'});
  return $el;
}
var teamFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $span=$('<span>').append('Team settings').addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}

var settingDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'settingDiv';}
  var $buttShowMarkSelect=$('<button>').append(langHtml.ChangeMapMarker).click(function(){ 
    $markSelectorDiv.setUp();
    $markSelectorDiv.setVis();
    doHistPush({$view:$markSelectorDiv});
  });

  //var $opt=$([]).push($buttShowMarkSelect, $vendorDiv, $adminButton, $teamButton);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
  var $opt=$([]).push($buttShowMarkSelect, $vendorDiv, $adminButton, $teamButton);    $opt.css({display:'block','margin':'1em 0em 1em 0.6em'});
  $vendorDiv.css({'margin':'1em 0.6em 1em 0.6em'}); 
  
  $el.append($opt);   
  
  $el.css({'text-align':'left'});
  return $el;
}
var settingFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').html(strBackSymbol).addClass('fixWidth').click(doHistBack).css({'float':'left', 'margin-left':'0.8em','margin-right':'1em'});
  var $tmpImg=$('<img>').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom', 'margin-right':'0.5em'});//,'vertical-align':'middle'
  var $span=$('<span>').append($tmpImg, langHtml.Settings).addClass('footDivLabel');
  $el.append($buttonBack,$span).addClass('footDiv'); 
  return $el;
}


var makeOrdinalEndingEn=function(n){
  var oneth=n%10, tmp=Math.floor(n/10); tenth=tmp%10;
  var ending='th';
  if(tenth!=1){
    if(oneth==1){ ending='st';}
    else if(oneth==2){ ending='nd';}
    else if(oneth==3){ ending='rd';}
  }
  return ending;
}
var moreDivExtend=function($el){
"use strict"
  $el.toString=function(){return 'moreDiv';}
  $el.setUp=function(){
    var nNext=nUserReal+1;
    var ending=makeOrdinalEndingEn(nNext);
    $nNext.html(nNext); //+ending
  }
  var $headOrdinal=$('<span>').append(langHtml.headOrdinal).css({'font-weight':'bold'});
  var $labOrdinal=$('<span>').append(langHtml.labOrdinal), $nNext=$labOrdinal.children(':nth-child(1)').css({'font-weight':'bold'});
  var $labOrdinalB=$('<div>').append(langHtml.labOrdinalB);
  var $divOrdinal=$('<div>').append($headOrdinal, ' ', $labOrdinal).css({border:'solid green 2px', padding:'0.3em'});  //, $labOrdinalB
  //var func=function(){}; if(!boDbg) func=function(){trackConv(949679695,"wCpMCPHKhQUQz-zrxAM");}

  var specialRequstF=function(){
    var now=Date.now(); if(timeSpecialR+1000*10<now) {timeSpecialR=now; nSpecialReq=1;} else nSpecialReq++;
    if(nSpecialReq==3) { $buttLoginTeam.show();    }
  }
  var timeSpecialR=0, nSpecialReq=0;

  //var $buttonBack=$('<button>').click(doHistBack).append(langHtml.Back).addClass('fixWidth').css({'margin-left':'0.8em'});
  //var uWikiT=uWiki,tmp='trackerSites'; if(strLang!='en') tmp+='_'+strLang; uWikiT+='/'+tmp;
  var uWikiT=uWiki; if(strLang!='en') uWikiT=uWiki+'/trackerSites_'+strLang;
  var $aWiki=$('<a>').prop({href:uWikiT,target:"_blank"}).append(langHtml.InformationPage);
  var $infoLinkVendor=$('<a>').prop({href:uWiki+'/'+'new_vendors',target:"_blank"}).append(langHtml.gettingStartedLink);
  var $pSeeAlso=$('<p>').append(langHtml.SeeAlso,': ',$infoLinkVendor);
  


  var $buttLoginTeam=$("<button>").append(langHtml.SignInAs+' ('+langHtml.TeamAdmin+')').css({display:'block'}).click(function(e){
    e.stopPropagation();
    var flow=(function*(){
      var [err, code]=yield* getOAuthCode(flow); if(err) {setMess(err); return;}
      var oT={IP:strIPPrim, fun:'teamFun', caller:'index', code:code};
      var vec=[['loginGetGraph', oT], ['setupById', null, function(){ flow.next(); }]];   majax(oAJAX,vec);   yield;
      
      history.fastBack($mapDiv);
      
    })(); flow.next();
    return false;
  }).hide();
  

  if(document.domain.substr(0,4)=='demo') $buttLoginVendor.hide(); 

  var $pWiki=$('<div>').append($pSeeAlso);

  
  $iframeLike.css({'float':'right',clear:'both'});
  //$iframeLike.css({display:'block'});
  
  //var $hovWhyIsFBNeeded=$hovHelp.clone().text(langHtml.WhyIsFBNeededQ).css({margin:'1em 0 0 0', display:'block', 'vertical-align':'middle'}),  $bub=$('<div>').html(langHtml.WhyIsFBNeededA);     popupHoverM(//$hovWhyIsFBNeeded,$bub,15000);
  //var $NothingIsWrittenToYourFBFlow=$('<div>').append(langHtml.NothingIsWrittenToYourFBFlow);
  //var $YouCanUseCustomImage=$('<div>').append(langHtml.YouCanUseCustomImage);
  //var $YouCanDeleteYourAccount=$('<div>').append(langHtml.YouCanDeleteYourAccount);
  //var $FBToPreventMultipleAccounts=$('<div>').append(langHtml.FBToPreventMultipleAccounts);
  //var $aPrivacyPolicy=$('<a>').prop({href:'https://closeby.market/Privacy_policy_2016-Oct-12'}).append("Privacy policy 2016-Oct-12");
  //var $aDisclaimer=$('<a>').prop({href:'https://closeby.market/Disclaimer_2016-Oct-12'}).append("Disclaimer 2016-Oct-12").css({display:'block'});
  var $aMoreAboutWhyAnIdPIsUsed=$('<a>').prop({href:'https://closeby.market/WhyIsAnIdPUsed'}).append(langHtml.MoreAboutWhyAnIdPIsUsed).css({display:'block'});

  //var $opt=$([]).push($pWiki, $langSpan, $buttLoginVendor, $buttLoginTeam, $teamApprovedMess);
  var $rows=$([]).push($divOrdinal, $loginSelectorDiv, $pWiki, $buttLoginTeam, $teamApprovedMess);  // $FBToPreventMultipleAccounts, $NothingIsWrittenToYourFBFlow, $YouCanUseCustomImage, $YouCanDeleteYourAccount, $langSpan
  var $topDivA=$('<div>').append($iframeLike).css({'margin-top':'1em',overflow:'hidden'});  //$buttonBack,  , $aMoreAboutWhyAnIdPIsUsed
  $rows.css({'margin':'1em 0em 1em 0.6em'});
  $el.append($topDivA,$rows);  
 
  $el.css({'text-align':'left'});
  return $el;
}
var moreFootExtend=function($el){
"use strict"
  var $buttonBack=$('<button>').click(doHistBack).append(strBackSymbol).addClass('fixWidth').css({'float':'left','margin-left':'0.8em','margin-right':'1em'}); //'font-size':'1em'
  $el.append($buttonBack).addClass('footDiv');  
  return $el;
}





/********************************************************************************************************************
 ********************************************************************************************************************/



setUp1=function(){
  emptyObj={}

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
      $bodyNHtml.css({"height":"100%", "overflow":"scroll" , "-webkit-overflow-scrolling":"touch"});  // , position:'fixed'
 
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

  var imgUriTmp=makeMarker(0);  boImgCreationOK=1;  if(imgUriTmp.length<10) boImgCreationOK=0;
  //boImgCreationOK=0;

  assignSiteSpecific();

  
  StrPlugIn=site.StrPlugIn; 
  Prop=site.Prop; KeyCol=Object.keys(Prop); nCol=KeyCol.length;  StrOrderFilt=site.StrOrderFilt;   
  KeySel=calcKeySel(Prop,KeyCol);

  colsFlip=array_flip(KeyCol);
  StrOrderFiltFlip=array_flip(StrOrderFilt);


  var objLong={fb:'Facebook',google:"Google",idplace:"idPlace"};
  strIPPrimLong=objLong[strIPPrim];
  strIPAltLong=objLong[strIPAlt];


  var Match=RegExp("^[^/]+").exec(wwwSite);    domainName=Match[0];

  strScheme='http'+(boTLS?'s':'');    strSchemeLong=strScheme+'://';    uSite=strSchemeLong+wwwSite;     uCommon=strSchemeLong+wwwCommon;    uBE=uSite+"/"+leafBE;
  uCanonical=uSite;

  uConversion=uSite+'/conversion.html';
  uTeamImage=uSite+'/image/t';
  uVendorImage=uSite+'/image/v';


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
  uMapm1=uImageFolder+'mapm1.png';
  uMapm2=uImageFolder+'mapm2.png';
  uColumn16=uImageFolder+'column16.png';

  

  uWiki='https://closeby.market';

  //uMapSourceDir='http://otile1.mqcdn.com/tiles/1.0.0/map';
  uMapSourceDir='https://c.tile.openstreetmap.org';


  var oVersion=getItem('version');      if(version!==oVersion) boNewVersion=1; else boNewVersion=0;        setItem('version',version);

  
  colOneMarkDefault='image';


  langClientFunc(); 

  
  PlugIn=[]; 
  var rewriteProg=function(){    for(var i=0;i<StrPlugIn.length;i++){  PlugIn[i]=new CreatorPlugin[StrPlugIn[i]]();   }    };

    //
    // langHtml.vendor (and plural-, the-, uppercase-versions etc) may be rewritten by some sites.
    // 
  var rewriteLang=function(){  for(var i=0;i<PlugIn.length;i++){  var tmp=PlugIn[i].rewriteLang; if(tmp) tmp();   }  };
  rewriteObj=function(){  for(var i=0;i<PlugIn.length;i++){  PlugIn[i].rewriteObj();   }  };

  rewriteProg();
 


     // Create ucfirst versions
  var StrMakeUCase=['vendor', 'vendors', 'column', 'visible', 'show'];
  for(var i=0;i<StrMakeUCase.length;i++){var name=StrMakeUCase[i]; langHtml[ucfirst(name)]=ucfirst(langHtml[name]); }
  
  
     // Store vanilla version
  var StrStoreVanilla=['vendor', 'vendors', 'Vendor', 'Vendors', 'theVendor', 'theVendors', 'theVendors0', 'IndependentVendor'];
  for(var i=0;i<StrStoreVanilla.length;i++){var name=StrStoreVanilla[i]; langHtml[name+'Vanilla']=langHtml[name]; }
  

  rewriteLang();

  langHtml.label.histActive=langHtml.label.histActive.replace(/<span><\/span>/,lenHistActive);
  langHtml.helpBub.histActive=langHtml.helpBub.histActive.replace(/<span><\/span>/,lenHistActive);



  var regNom=new RegExp("<span nom=\"([^\"]+)\">.*?</span>",'g');
  var nomFunc=function(m,n){return langHtml[n]};
  //var nomFunc=function(m,n){return "<span nom="+n+">"+langHtml[n]+"</span>"};
  replaceNom=function(parent,strName){
    parent[strName]=parent[strName].replace(regNom,nomFunc);
  }
  replaceNom(langHtml.label,'standingByMethod');  // Only used by transportUrgent (taxi, transport)


  replaceNom(langHtml.helpBub,'link');
  replaceNom(langHtml.helpBub,'posTime');
  replaceNom(langHtml.helpBub,'shiftEnd');
  replaceNom(langHtml.helpBub,'donatedAmount');

  replaceNom(langHtml,'VendorSettings');
  //replaceNom(langHtml,'VendorLogin'); // Not used
  replaceNom(langHtml,'VendorEntry');
  replaceNom(langHtml,'FilterTitle');
  replaceNom(langHtml,'gettingStartedLink');
  replaceNom(langHtml,'toManyMess');
  replaceNom(langHtml,'SeeUnActivePopMess');
  replaceNom(langHtml,'writeReportPopup');
  replaceNom(langHtml,'introHead');
  replaceNom(langHtml,'LoginSingInAsVendor');

  replaceNom(langHtml,'DummiesShowingMess');
  //replaceNom(langHtml,'noteLoginVendor');
  

  replaceNom(langHtml,'headOrdinal');
  replaceNom(langHtml,'headOrdinalDouble');
  if(langHtml.vendorRewritten!=langHtml.vendor)  langHtml.headOrdinal=langHtml.headOrdinalDouble;
  replaceNom(langHtml,'labOrdinal'); 


  langHtml.DidYouUseAltIPBefore=langHtml.DidYouUseAltIPBefore.replace(regNom,strIPAltLong);

    

  if(boTouch) ColsShowDefault=ColsShowDefaultS;
  if(boReallySmall) ColsShowDefault=ColsShowDefaultRS
  if(boImgCreationOK==0) {ColsShowDefault.unshift('index'); }
  if(boShowTeam==0) { arrValRemove(ColsShowDefault,'idTeam');}
  ColsShow=[]; ColsShowCurrency=[];

  if(boNewVersion) { setItem('colOneMark',colOneMarkDefault);  setItem('ColsShow',ColsShowDefault);}
  colOneMark=getItem('colOneMark');    if(colOneMark===null) colOneMark=colOneMarkDefault;
  ColsShow=getItem('ColsShow');   if(ColsShow===null) ColsShow=[].concat(ColsShowDefault);
  if(StrPropMain.indexOf(colOneMark)==-1) colOneMark=colOneMarkDefault; setItem('colOneMark',colOneMark);
  intersectionAB(ColsShow,StrPropMain);   setItem('ColsShow',ColsShow);


  boMultCurrency=0;
  //setUpColsShowIndCurrency(); 

  
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
  $messageText=messExtend($("<span>"));  window.setMess=$messageText.setMess;  window.resetMess=$messageText.resetMess;  window.appendMess=$messageText.appendMess;  $body.append($messageText);

  $busyLarge=$('<img>').prop({src:uBusyLarge}).css({position:'fixed',top:'50%',left:'50%','margin-top':'-42px','margin-left':'-42px','z-index':'1000',border:'black solid 1px'}).hide();
  $body.append($busyLarge);
  





  merProj = new MercatorProjection();

  var tmp=getItem('boFirstVisit');     if(tmp===null) boFirstVisit=1; else boFirstVisit=0;      setItem('boFirstVisit',0);

  $imgHelp=$('<img>').prop({src:uHelpFile}).css({'vertical-align':'-0.4em', 'margin-left':'0.6em'});
  $hovHelp=$('<span>').text('?').css({'font-size':'88%',color:'#a7a7a7','vertical-align':'-0.4em'}); //click(function(){return false;})    //'pointer-events':'none',

  helpBub={}; for(var i=0;i<nCol;i++){
    var strName=KeyCol[i], text='';
    if(strName in langHtml.helpBub)  text=langHtml.helpBub[strName];   
    if(text!='') { helpBub[strName]=$('<div>').html(text); }
  }

  $H1=$('h1:eq(0)').detach();
  $H1.css({background:'#ff0', "box-sizing":"border-box", border:'solid 1px',color:'black','font-size':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.4em 0em 0.4em 0em',margin:'0em 0em 0em 0em'});
  //$divH1=$('<div>').append($H1); //$divH1.css({}); 
  
  //var uWikiT=uWiki,tmp='trackerSites'; if(strLang!='en') tmp+='_'+strLang; uWikiT+='/'+tmp;
  var uWikiT=uWiki; if(strLang!='en') uWikiT=uWiki+'/'+strLang;
  $infoLink=$('<a>').prop({href:uWikiT}).append(langHtml.OtherMapApps);
  $footDiv=$('<div>').css({background:'', "box-sizing":"border-box", 'border-top':'solid 1px',color:'black','font-size':'1.2em','line-height':'1.6em','font-weight':'bold','text-align':'center',
      padding:'0.2em 0em 0.2em', margin:'1px 0em 0em 0em', flex:'0 0 auto', display:"flex", "justify-content":"space-around"}); //, "justify-content":"space-evenly"
  $footDiv.css({visibility:'hidden'});

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
  $butClearCounter=$('<button>').append('ClearCounter').click(function(){
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
    if(Math.abs(dir)>1) alert('dir=',dir);
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

  //$seeUnActivePop=seeUnActivePopExtend($('<div>')).css({padding:'2em','text-align':'left'});

  $dummyShowingToast=dummyShowingToastExtend($('<div>')).css({padding:'0.5em','text-align':'center',left:'50%',width:'12em','margin-left':'-6em','z-index':6});
  $body.append($dummyShowingToast);

  //$loginDiv=loginDivExtend($('<div>'));    //$loginDiv.css({border:'1px solid #000'});
  $vendorIntroDiv=vendorIntroDivExtend($('<div>'));

  //$vendorButton=$('<button>').append('&equiv;');
  $quickDiv=quickDivExtend($('<div>'));   
  $payButton=payButtonExtend($('<button>').append(langHtml.vendorPay.head));
  $payDiv=payDivExtend($('<div>').append(langHtml.vendorPay.div)).css({flex:'1 1 0', overflow:'auto'});
  $payFoot=payFootExtend($('<div>'));  
  $userSettingButton=$('<button>').append(langHtml.UserInfo);
  $userSettingDiv=userSettingDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $userSettingFoot=userSettingFootExtend($('<div>'));  
  $vendorSettingButton=$('<button>').append(langHtml.VendorSettings);
  $vendorSettingDiv=vendorSettingDivExtend($('<div>')).css({flex:'1 1 0', 'overflow-y':'auto', 'overflow-x':'hidden'}); 
  $vendorSettingFoot=vendorSettingFootExtend($('<div>'));  
  $priceSettingButton=$('<button>').append(langHtml.Prices);
  $priceSettingDiv=priceSettingDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});  
  $priceSettingFoot=priceSettingFootExtend($('<div>'));  
  $deleteAccountPop=deleteAccountPopExtend($('<div>'));
  
  //if(boAndroid) { var h=window.innerHeight/2.5;   $payDiv.add($vendorSettingDiv).add($priceSettingDiv).css({'padding-bottom':h+'px'});  } //make room for keyboard
  $quickDiv.css({padding:'0.3em 0.2em',margin:'0em 0em 0em',display:'block',background:'#faa','border-top':'solid 1px'});  

  $quickDivOuter=$('<div>').append($quickDiv).css({flex:'0 0 auto'});  //'border-top':'solid white 1px'
  //if(boIOS && boTouch) $quickDivOuter.css({padding:'0em 0em 1.7em'});

  $uploadImageDiv=uploadImageDivExtend($('<div>'));
  $teamDiv=teamDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $teamFoot=teamFootExtend($('<div>'));  
  
  $vendorDiv=vendorDivExtend($('<div>')).css({'background':'#ccc','border':'solid 1px','padding':'0.2em 0'});
  
  $adminButton=$('<button>').html('Admin').css({display:'block'});
  $adminDiv=adminDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $adminFoot=adminFootExtend($('<div>')); 
  $teamButton=$("<button>").css({display:'block'}).append('Team/brand admin settings').click(function(){ 
    $teamDiv.setUp();
    $teamDiv.setVis();
    doHistPush({$view:$teamDiv});
  });
  $teamApprovedMess=$("<div>").css({display:'block'}).append('Team/brand not approved, Contact '+domainName+' to become approved.');
  $reportVDiv=reportVDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $reportVFoot=reportVFootExtend($('<div>')); 
  $reportRDiv=reportRDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $reportRFoot=reportRFootExtend($('<div>')); 

  $reportCommentPop=reportCommentPopExtend($('<div>')).css({border:'1px solid #000'});
  $reportAnswerPop=reportAnswerPopExtend($('<div>')).css({border:'1px solid #000'});

  //$agreementStart=agreementStartExtend($('<div>'));
  //if(boFirstVisit) $agreementStart.setLocalDates(1);
  
    // paymentList
  $paymentListDiv=paymentListDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $paymentListFoot=paymentListFootExtend($('<div>')); 

  makeMyOverlay();
  boMapGoogle=1
  if(boMapGoogle) $mapDiv=mapDivExtendGoogle($("<div>")); else $mapDiv=mapDivExtend($("<div>"));
  //$mapDiv.css({'margin-top':'0.9em'});  //,display:'inline-block','margin-top':'1px'
  $mapDiv.css({overflow:'hidden'});

    //filter colors
  colButtAllOn='#9f9', colButtOn='#0f0', colButtOff='#ddd', colFiltOn='#bfb', colFiltOff='#ddd', colFontOn='#000', colFontOff='#777', colActive='#65c1ff', colStapleOn='#f70', colStapleOff='#bbb';
  
  maxStaple=20;
  
    // filterDivs
  $filterInfoSpan=filterInfoSpanExtend($('<span>'));
  $filterInfoWrap=$('<span>').append($filterInfoSpan);
  //$filterButton=$('<button>').append(langHtml.Filter,': (',$filterInfoWrap,')').addClass('flexWidth').css({'float':'right','clear':'both'});//.css({background:colMenuOff});
  var $tmpImg=$('<img>').prop({src:uFilter}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $filterButton=$('<button>').append($tmpImg,' (',$filterInfoWrap,')').addClass('flexWidth').css({'float':'left'}).prop('title',langHtml.FilterTitle);// ,'clear':'both'  .css({background:colMenuOff});
  //$filterDiv=filterDivExtend($('<div>'),StrOrderFilt);  
  $filterDiv=new FilterDiv(Prop, $.extend({},langHtml.label), StrOrderFilt, loadTabStart);
  $filterDiv.css({'background-color':'#eee','padding-bottom':'0.6em', flex:'1 1 0', overflow:'auto'}); 
  $filterFoot=filterFootExtend($('<div>')); 


    // tableDivs
  var $tmpImg=$('<img>').prop({src:uList16}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $tableButton=$('<button>').append($tmpImg).addClass('fixWidth').css({'float':'left', 'margin-right':'1em'}).prop('title',langHtml.ComparisonTable);

  var $tmpImg=$('<img>').prop({src:uSetting1}).css({height:'1em',width:'1em','vertical-align':'text-bottom'});//,'vertical-align':'middle'
  $settingButton=$('<button>').append($tmpImg).addClass('fixWidth').css({'float':'left', 'margin-left':'0.8em', 'margin-right':'1em'}).prop('title',langHtml.Settings);

  $mapFoot=$('<div>').append($settingButton,$tableButton,$filterButton).addClass('footDiv');
  
  
  $columnSelectorDiv=columnSelectorDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $columnSelectorFoot=columnSelectorFootExtend($('<div>')); 
  $columnSorterDiv=columnSorterDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $columnSorterFoot=columnSorterFootExtend($('<div>')); 

  
  $currencyInfoDivs=$([]);



  $tHeadLabel=tHeadLabelExtend($('<thead>')).css({'text-align':'center'});  

  $tableDiv=tableDivExtend($("<div>")).css({flex:'1 1 0', overflow:'auto'}); 
  $tableFoot=tableFootExtend($("<div>"));   
  $tableDiv.$table.prepend($tHeadLabel);

  if(0){
    $iframeLike=$('<iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fgavott&amp;width&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;stream=false&amp;show_border=false&amp;appId=237613486273256" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:62px;" allowTransparency="true"></iframe>');
  }else{$iframeLike=$('<span>');}

  $formLoginDiv=formLoginDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto', 'text-align':'left'});
  $formLoginFoot=formLoginFootExtend($('<div>'));
  $loginSelectorDiv=loginSelectorDivExtend($('<div>'));//.css({flex:'1 1 0', overflow:'auto'});
  //$loginSelectorFoot=loginSelectorFootExtend($('<div>'));
  
  //var $tmp=$('<span>').append('&equiv;').css({height:'0.9em',width:'0.9em',display:'inline-block'});
  //$moreButton=$('<button>').append($tmp).css({'margin-left':'0.6em','margin-right':'1em'}); 
  $moreButton=$('<button>').append(langHtml.VendorEntry).addClass('flexWidth').css({'width':'initial','font-size':'0.7em'}); //'&equiv;'
  $moreDiv=moreDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $moreFoot=moreFootExtend($("<div>"));
  if(document.domain.substr(0,4)=='demo') $moreButton.hide(); 
  $convertIDDiv=convertIDDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});
  $convertIDFoot=convertIDFootExtend($('<div>'));
  
   
  $createUserDiv=createUserDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto', 'text-align':'left'});
  $createUserFoot=createUserFootExtend($('<div>')); 
  
  $changePWPop=changePWPopExtend($('<div>')).css({'text-align':'left'});
  $forgottPWPop=forgottPWPopExtend($('<div>')).css({'text-align':'left'});
  
  
  $settingDiv=settingDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $settingFoot=settingFootExtend($("<div>"));  
  
  $markSelectorDiv=markSelectorDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'}); 
  $markSelectorFoot=markSelectorFootExtend($("<div>")); 
  

  $vendorInfoDiv=vendorInfoDivExtend($('<div>')).css({flex:'1 1 0', overflow:'auto'});  
  $vendorInfoFoot=vendorInfoFootExtend($("<div>"));  
  $vendorListCtrlDiv=vendorListCtrlDivExtend($('<div>')).css({display:'inline-block','float':'right'});  
  
  
  $footDiv.append($infoLink,$moreButton);


  rewriteObj();

  $vendorSettingDiv.createDivs();
  $priceSettingDiv.createDivs();
  $filterDiv.createDivs();    
  if(startFilter)  $filterDiv.Filt[StrOrderFiltFlip.idTeam]=[[],[startFilter],1];
  $tableDiv.createTBody();   $tableDiv.setRowDisp();  $tableDiv.css({margin:'0em 0 0.9em 0'});
  $vendorInfoDiv.createContainers();
  $columnSelectorDiv.createTable();
  $markSelectorDiv.createTable();


  //if(boTouch) $H1.css({'font-size':'0.9em'});
  if(boTouch) $H1=$([]);
  


  if(typeof StrMainDiv=='undefined') StrMainDiv=[];
  StrMainDiv.push('loginInfo', 'H1', 'mapDiv', 'filterDiv', 'tableDiv', 'userSettingDiv', 'vendorSettingDiv', 'priceSettingDiv', 'payDiv', 'vendorInfoDiv', 'adminDiv', 'reportVDiv', 'reportRDiv', 'moreDiv', 'formLoginDiv', 'createUserDiv', 'convertIDDiv', 'settingDiv', 'columnSelectorDiv', 'columnSorterDiv', 'markSelectorDiv', 'paymentListDiv', 'teamDiv', 'deleteAccountPop', 'loginDiv', 'reportCommentPop', 'reportAnswerPop', 'uploadImageDiv', 'changePWPop', 'forgottPWPop');
  if(boDbgL) StrMainDiv.unshift('divDbg');
  
  
  //  List of foots: admin, pay, vendorSetting, priceSetting, paymentList, userSetting, reportV, reportR, vendorInfo, filter, markSelector, columnSelector, columnSorter, table, map, team, setting, more, createUser
  StrMainDiv.push('footDiv', 'quickDivOuter', 'mapFoot', 'filterFoot', 'tableFoot', 'userSettingFoot', 'vendorSettingFoot', 'priceSettingFoot', 'payFoot', 'vendorInfoFoot', 'adminFoot', 'reportVFoot', 'reportRFoot', 'moreFoot', 'formLoginFoot', 'createUserFoot', 'convertIDFoot', 'settingFoot', 'columnSelectorFoot', 'columnSorterFoot', 'markSelectorFoot', 'paymentListFoot', 'teamFoot');

  var MainDiv=[];
  for(var i=0;i<StrMainDiv.length;i++){
    var key=StrMainDiv[i], $el=window['$'+key]; 
    MainDiv[i]=$el;
  };
  $MainDiv=$([]); $MainDiv.push.apply($MainDiv,MainDiv); 
  //$MainDiv.css({'border-top':'1px solid white'});
  //if(!boTouch)
  $H1.css({'border-top':'1px solid black'});


  history.StateMy[history.state.ind]={$view:$mapDiv};


  $MainDiv.hide();
  $body.append($MainDiv); 
  //$MainDiv=$MainDiv.not($H1.add($footDiv)); 

  //$mapDivs=$H1.add($mapFoot).add($mapDiv).add($footDiv);  $mapDivs.show();
  $H1.add($footDiv).add($mapFoot).add($mapDiv).show();
  if(boDbgL) $divDbg.show();
  $filterDiv.hide();


      // Extra functionallity when clicking on menus

  mapButtonClick=function(){ 
    $mapDiv.setVis();   doHistPush({$view:$mapDiv}); 
    //ga('send', 'pageview', { 'page': '/map',  'title': 'map'});
    ga('send', 'event', 'button', 'click', 'map');
  }
  tableButtonClick=function(){ 
    $tableDiv.setVis();  doHistPush({$view:$tableDiv}); 
    //ga('send', 'pageview', { 'page': '/table',  'title': 'table'});
    ga('send', 'event', 'button', 'click', 'table');
  }
  filterButtonClick=function(){ 
    $filterDiv.setVis(); doHistPush({$view:$filterDiv});
    //ga('send', 'pageview', { 'page': '/filter',  'title': 'filter'});
    ga('send', 'event', 'button', 'click', 'filter');
  }
  settingButtonClick=function(){ 
    $settingDiv.setVis(); doHistPush({$view:$settingDiv});
    //ga('send', 'pageview', { 'page': '/setting',  'title': 'setting'});
    ga('send', 'event', 'button', 'click', 'setting');
  }
  $tableButton.on('click',tableButtonClick);
  $filterButton.on('click',filterButtonClick);
  $settingButton.on('click',settingButtonClick);


  $userSettingButton.on('click',function(){
    $userSettingDiv.setVis(); doHistPush({$view:$userSettingDiv});
  });  
  $vendorSettingButton.on('click',function(){
    $vendorSettingDiv.setVis(); doHistPush({$view:$vendorSettingDiv});
  });  
  $priceSettingButton.on('click',function(){
    $priceSettingDiv.setVis(); doHistPush({$view:$priceSettingDiv});
  });
  $payButton.on('click',function(){
    $payDiv.setVis(); doHistPush({$view:$payDiv});
  });
  $adminButton.on('click',function(){ 
    $adminDiv.setVis(); doHistPush({$view:$adminDiv});
  });     
  $moreButton.on('click',function(){ 
    $moreDiv.setVis(); doHistPush({$view:$moreDiv});
    //ga('send', 'pageview', { 'page': '/more',  'title': 'more'});
    ga('send', 'event', 'button', 'click', 'more');
  });
  

  $mainDivsTogglable=$MainDiv.not($loginInfo.add($H1));
  if(boDbgL) $mainDivsTogglable=$MainDiv.not($loginInfo.add($H1).add($divDbg));

  
  scalableTog=function(boOn){
    if(typeof boOn=='undefined') boOn=document.body.style.opacity!=.9999;
    var floatOpacity=boOn?1:0.9999;
    var strVPContent='width=device-width, initial-scale=1, '+(boOn?'maximum-scale=4':'maximum-scale=1, user-scalable=no');
    $('meta[name=viewport]').attr('content', strVPContent);
    document.body.style.opacity=floatOpacity;
    //setTimeout(function(){ document.body.style.opacity = 1;  }, 1);
  }

  $mapDiv.setVis=function(){
    $tableButton.add($filterButton).css({background:colMenuOff}); 
    var $tmp=$footDiv.add($mapDiv).add($mapFoot).add($quickDivOuter);
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $filterInfoWrap.append($filterInfoSpan);
    //$moreButton.after($filterButton);
    //$('meta[name=viewport]').prop({'user-scalable':'false'});
    scalableTog(0);
    google.maps.event.trigger($mapDiv.map, 'resize');
    return true;
  }
  $tableDiv.setVis=function(){
    $filterButton.css({background:colMenuOff});  $tableButton.css({background:colMenuOn});
    var $tmp=$tableDiv.add($tableFoot);
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $tableFoot.$filterButton.children('span').append($filterInfoSpan);
    //$('meta[name=viewport]').prop({'user-scalable':'true'});
    scalableTog(1);
    return true;
  }
  $filterDiv.setVis=function(){
    $tableButton.css({background:colMenuOff});  $filterButton.css({background:colMenuOn});
    var $tmp=$filterDiv.add($filterFoot);
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $filterFoot.$filterInfoWrap.append($filterInfoSpan);
    scalableTog(1);
    return true;
  }
  $userSettingDiv.setVis=function(){
    if(!userInfoFrDB.user) return false;
    $userSettingDiv.setUp(); 
    var $tmp=$userSettingDiv.add($userSettingFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $vendorSettingDiv.setVis=function(){
    if(!userInfoFrDB.vendor) return false;
    $vendorSettingDiv.setUp(); 
    var $tmp=$vendorSettingDiv.add($vendorSettingFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $priceSettingDiv.setVis=function(){
    if(!userInfoFrDB.vendor) return false;
    $priceSettingDiv.setUp(); 
    var $tmp=$priceSettingDiv.add($priceSettingFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $payDiv.setVis=function(){
    if(!userInfoFrDB.vendor) return false;
    $payDiv.setUp(); 
    var $tmp=$payDiv.add($payFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $vendorInfoDiv.setVis=function(){
    if($vendorInfoDiv.boLoaded==0) return false;
    var $tmp=$vendorInfoDiv.add($vendorInfoFoot);
    $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $vendorInfoDiv.$menuDiv.append($vendorListCtrlDiv);
    scalableTog(1);
    return true;
  }
  $reportVDiv.setVis=function(){
    if($reportVDiv.boLoaded==0) return false;
    var $tmp=$reportVDiv.add($reportVFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $reportVDiv.$topDiv.append($vendorListCtrlDiv);
    scalableTog(1);
    return true;
  }
  $reportRDiv.setVis=function(){
    if($reportRDiv.boLoaded==0) return false;
    var $tmp=$reportRDiv.add($reportRFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $adminDiv.setVis=function(){
    var $tmp=$adminDiv.add($adminFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $moreDiv.setVis=function(){
    var $tmp=$moreDiv.add($moreFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $moreDiv.setUp();
    scalableTog(1);
    return true;
  }
  $formLoginDiv.setVis=function(){
    var $tmp=$formLoginDiv.add($formLoginFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $formLoginDiv.setUp();
    scalableTog(1);
    return true;
  }
  //$loginSelectorDiv.setVis=function(){
    //var $tmp=$loginSelectorDiv.add($loginSelectorFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    //$loginSelectorDiv.setUp();
    //scalableTog(1);
    //return true;
  //}
  $createUserDiv.setVis=function(){
    var $tmp=$createUserDiv.add($createUserFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $createUserDiv.setUp();
    scalableTog(1);
    return true;
  }
  $convertIDDiv.setVis=function(){
    var $tmp=$convertIDDiv.add($convertIDFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    $convertIDDiv.setUp();
    scalableTog(1);
    return true;
  }
  $settingDiv.setVis=function(){
    var $tmp=$settingDiv.add($settingFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $columnSelectorDiv.setVis=function(){
    if($columnSelectorDiv.boLoaded==0) return false;
    var $tmp=$columnSelectorDiv.add($columnSelectorFoot); $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $columnSorterDiv.setVis=function(){
    if($columnSorterDiv.boLoaded==0) return false;
    var $tmp=$columnSorterDiv.add($columnSorterFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $markSelectorDiv.setVis=function(){
    if($markSelectorDiv.boLoaded==0) return false;
    var $tmp=$markSelectorDiv.add($markSelectorFoot); $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $paymentListDiv.setVis=function(){
    if($paymentListDiv.boLoaded==0) return false;
    var $tmp=$paymentListDiv.add($paymentListFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }
  $teamDiv.setVis=function(){
    if($teamDiv.boLoaded==0) return false;
    var $tmp=$teamDiv.add($teamFoot);  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    scalableTog(1);
    return true;
  }

  //$loginDiv.setVis=function(){
    //var $tmp=$loginDiv;  $mainDivsTogglable.not($tmp).hide(); $tmp.show();
    //scalableTog(1);
    //return true;
  //}


 
  $body.css({'text-align':'center'});
  //$MainDiv.css({'margin-left':'auto','margin-right':'auto','text-align':'left',background:'#fff'});
  $MainDiv.css({'margin-left':'auto','margin-right':'auto'});
  //$MainDiv.not($H1.add($footDiv)).css({'text-align':'left',background:'#fff'});
  $mainDivsNonFixWidth=$([]);
  if(!boTouch) {$mainDivsNonFixWidth.push($tableDiv, $paymentListDiv);}
  $mainDivsFixWidth=$MainDiv.not($mainDivsNonFixWidth).css({'max-width':'800px'});
  //$H1.add($footDiv).css({'width':'800px'});

  $mainDivsNonFixWidth.css({display:'inline-block','text-align':'left'});
  $tableDiv.children('table').css({'margin-top':'1em'});
  $mainDivsNonFixWidth.hide(); // Seems this line is needed because otherwise these divs will be visible untill first ajax returns  

  //if(!boTouch)
  //$H1.css({background:'#ff0','text-align':'center'});
  //$footDiv.css({background:'#ee8','text-align':'center',border:'1px solid'});
  
  
  $body.css({display:"flex","flex-direction":"column"});
  $MainDiv.css({width:"100%"}); //flex:"none", 
  $mapDiv.css({flex:"auto"});  // "overflow-y":"scroll", "-webkit-overflow-scrolling":"touch", 

  
  $busyLarge.show(); 

  boFirstLoadTab=1;

  if(boEmulator || boVideo) posDebug={coords:{latitude:59.330454370984235,longitude:18.059076067697106}};
  
  //ga('send', 'event', 'button', 'click', 'geoOK');

  boFirstPosOK=0;
    
  var tmpFGeoSuccess=function(pos){
    //tmpFUseApprox=doNothing; 
    clearTimeout(timerCoordApprox);
    //clearTimeout(timerGeoNotOK);
    boFirstPosOK=1;
    boGeoOK=true; setItem('boGeoOK',boGeoOK);
    //if(!boApproxCalled ) firstAJAXCall(pos); else {if(boFirstLoadTab==0) {$mapDiv.set(pos); loadTabStart(1);}} 
    if(!boApproxCalled ) firstAJAXCall(pos); else {$mapDiv.setPos(pos); } 
  }
  
  if(boEmulator){ tmpFGeoSuccess(posDebug); }else{ navigator.geolocation.getCurrentPosition(function(pos){tmpFGeoSuccess(pos);}, geoError,{timeout:20000,maximumAge:60000});  }  
  //, {maximumAge:Infinity, timeout:5000,enableHighAccuracy:false}
  //setMess('... getting position ... ',null,true);
  boApproxCalled=false;
  var tmpFUseApprox=function(){
    var pos={coords:{latitude:coordApprox[0],longitude:coordApprox[1]}};  if(boVideo) pos=posDebug;
    boApproxCalled=true;
    firstAJAXCall(pos);
  }
  //var tmpFGeoNotOK=function(){ boGeoOK=false; setItem('boGeoOK',boGeoOK); }
  boGeoOK=getItem('boGeoOK');  if(boGeoOK===null) boGeoOK=false;
  //timerCoordApprox=null;
  //var tTmp=2; if(boAndroid && boGeoOK) tTmp=10;
  var tTmp=2; if(boGeoOK) tTmp=10;
  timerCoordApprox=setTimeout(tmpFUseApprox,(tTmp)*1000);
  boGeoOK=false;  setItem('boGeoOK',boGeoOK);
  //timerGeoNotOK=setTimeout(tmpFGeoNotOK,20*1000);
  
}

};

window.onload=function(){  setUp(); setUp1();};





