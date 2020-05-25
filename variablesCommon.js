// Inactive users may be deleted

two31=Math.pow(2,31);  intMax=two31-1;  intMin=-two31; uintMax=Math.pow(2,32)-1;
sPerDay=24*3600;  sPerMonth=sPerDay*30;



fsWebRootFolder=process.cwd();
flLibFolder='lib';

flFoundOnTheInternetFolder=flLibFolder+"/foundOnTheInternet";
flImageFolder=flLibFolder+"/image";  
//flLogFolder="log";

  // Files: 
leafBE='be.json';
leafBEUpload='beUpload.json'; 
leafUploadFront="upload.html"; 
//leafAssign='assign.js'; 
leafSiteSpecific='siteSpecific.js';
leafLoginWLink="loginWLink";
//leafVerifyEmailReturn='verifyEmail';
leafVerifyPWResetReturn='verifyPWReset';
leafVerifyEmailNCreateUserReturn='verifyEmailNCreateUser';

hideTimerDefault=30*24*3600;
hideTimerDefault=365*24*3600;
hideTimerDefault=uintMax;
if(boDbg) hideTimerDefault=30*60;
hideTimerDefault=intMax;

   // DB- TableNameProt
StrTableKey=["buyerTeamImage","buyerTeam","buyer","sellerTeamImage","sellerTeam","seller","userImage","complaint","admin","webPushSubscription","user","setting"]; 
StrViewsKey=[]; //"hist"
TableNameProt={};for(var i=0;i<StrTableKey.length;i++) TableNameProt[StrTableKey[i]]='';
ViewNameProt={};for(var i=0;i<StrViewsKey.length;i++) ViewNameProt[StrViewsKey[i]]='';


//StrTableKey=["sellerTab","sellerTeamTab","sellerTeamImageTab","buyerTab","buyerTeamTab","buyerTeamImageTab","userImageTab","complaintTab","adminTab","settingTab","userTab"]; 
//StrViewsKey=["histView"]; 
//TableName={};for(var i=0;i<StrTableKey.length;i++) {var name=StrTableKey[i]; TableName[name]=strDBPrefix+'_'+name.slice(0,-3);}
//ViewName={};for(var i=0;i<StrViewsKey.length;i++) {var name=StrViewsKey[i]; ViewName[name]=strDBPrefix+'_'+name.slice(0,-4);}


lenGZ=100;
nHash=1000;


EnumUnitDist=['km','mile']

  // histActive variables
lenHistActive=30;
var maskHistActive=(1<<lenHistActive)-1;
sqlMaskHistActive="& "+maskHistActive; if(lenHistActive==64) sqlMaskHistActive='';
var sqlDayDiff="floor( UNIX_TIMESTAMP(now())/"+sPerDay+" )  -  floor( UNIX_TIMESTAMP(tPos)/"+sPerDay+" )";
var sqlHistActiveCol="histActive<<"+sqlDayDiff+"  "+sqlMaskHistActive;
//sqlHistActiveColUpd="histActive= (histActive<<"+sqlDayDiff+" | 1) "+sqlMaskHistActive; // "<<" has higher precedence than "|"
sqlHistActiveColCount="BIT_COUNT("+sqlHistActiveCol+")";

//sqlBoBeforeHiding="UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(tPos)<hideTimer"; // "-" has higher precedence than "<"
sqlBoBeforeHiding="UNIX_TIMESTAMP(now())<UNIX_TIMESTAMP(tHide)"; // "-" has higher precedence than "<"

specialistDefault={user:0,complainer:0,complainee:0,buyer:0,seller:0,buyerTeam:0,sellerTeam:0,admin:0};
arrCoordinatePrecisionM=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000];
wc2m=156542;   // wc2m: Point (world coordinate) to meter (at equator) (Should be earthCircumference/256 = 40074784/256 = 156542 [m])
//wc2m=40074784/256;
m2wc=1/wc2m;
//var len=arrCoordinatePrecisionM.length;
//arrCoordinatePrecision=Array(len); for(var i=0;i<len;i++) arrCoordinatePrecision[i]=arrCoordinatePrecisionM[i]*m2wc;
  //arrCoordinatePrecision=array(0.00001,0.00002,0.00005,0.0001,0.0002,0.0005,0.001,0.002,0.005,0.01,0.02,0.05,0.1,0.2); 

//Enum=[];
selEnumF=function(name){  return name+"-1";  };
selTimeF=function(name){  return "UNIX_TIMESTAMP("+name+")";  };
//updEnumBoundF=function(name,v){ v=bound( v, 0, Enum[name].length-1)+1;   return ['?', v];  };
updEnumBoundF=function(name,v){ v=bound( v, 0, this[name].Enum.length-1)+1;   return ['?', v];  };
updTimeF=function(name,v){  return [  'FROM_UNIXTIME(?)', v ];  };
//updPriceF=function(name,v){  return [  "tLastPriceChange= IF("+name+"="+v+",tLastPriceChange,now()), "+name+"="+v, v ];  };




         //    0        1         2       3       4       5       6           7              8   
var bNameB=['input','DBSelOne','DBSel','block','label','help','buyerTab','notNull', 'buyerTabIndex'];    // Block and label concerns buyerInfo (buyerInfoDiv?!?)
var bNameS=['input','DBSelOne','DBSel','block','label','help','sellerTab','notNull', 'sellerTabIndex'];    // Block and label concerns sellerInfo (sellerInfoDiv?!?)

var oBDefault={bFlip:array_flip(bNameB), Prop:{}, strRole:'buyer', charRole:'b'};
var oSDefault={bFlip:array_flip(bNameS), Prop:{}, strRole:'seller', charRole:'s'};

var ORoleDefault=[oBDefault,oSDefault];
for(var i=0;i<ORoleDefault.length;i++){
  let oRole=ORoleDefault[i];
  oRole.charRoleUC=oRole.charRole.toUpperCase();
  oRole.ind=i;
}

maxList=30;

//date_default_timezone_set('UTC');
arrLang=[['sv','Svenska'],['en','English']]; arrLangShort=[]; for(var i=0;i<arrLang.length;i++){    arrLangShort[i]=arrLang[i][0];    }
maxGroupsInFeat=20;
preDefault="ro.";
//snoreLim=12*3600;
snoreLim=20*24*3600;
version='367';
auto_increment_increment=1;


/***********************************************************************************
 * PluginF 
 ***********************************************************************************/
// Properties with "feat" are used in filterDiv
// Properties with "type" are in roleTab (buyer/seller) (also have b[6] == "1")

// Both in userTab and roleTab: tCreated, boWebPushOK, donatedAmount, nComplaintGivenCum, nComplaintGiven, nComplaintCum, nComplaint

PluginF={};
PluginF.general=function(site){
  var [oB,oS]=site.ORole;
    // Both ////////////////////
  var arrTCreatedLabel=[0, 1, 2, 4, 6, 9, 12, 18, 24, 36, 48], arrTCreatedMin=[].concat(eMultSc(arrTCreatedLabel,sPerMonth)); arrTCreatedLabel.splice(-1,1, '≥48');
  var arrTPosLabel=[0, 1, 2, 4, 8, 16, 24, 48], arrTPosMin=[].concat(eMultSc(arrTPosLabel,3600)); arrTPosLabel.splice(-1,1, '≥48');
  var arrTAccumulatedLabel=[0, 1, 2, 4, 6, 9, 12, 18, 24, 36, 48], arrTAccumulatedMin=[].concat(eMultSc(arrTAccumulatedLabel,sPerMonth)); arrTAccumulatedLabel.splice(-1,1, '≥48');

  //                       012345678
  var PropTmp={
  index:               {b:'000000000'},
  idUser:              {b:'011000110',type:'int(4)'},
  idFB:                {b:'000011000'},
  idIdPlace:           {b:'000011000'},
  idOpenId:            {b:'000011000'},
  donatedAmount:       {b:'011111110',type:'DOUBLE', default:0, feat:{kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]}},
  boShow:              {b:'110000110',type:'TINYINT', default:0},
  tCreated:            {b:'011111101',type:'TIMESTAMP', default:'CURRENT_TIMESTAMP', feat:{kind:'S10',min:arrTCreatedMin, bucketLabel:arrTCreatedLabel}},
  tPos:                {b:'011011101',type:'TIMESTAMP', default:'CURRENT_TIMESTAMP', feat:{kind:'S01',min:arrTPosMin, bucketLabel:arrTPosLabel}},
  hideTimer:           {b:'110000110',type:'INT(8)', default:hideTimerDefault},  // Not UNSIGNED because mysql cant have uint in expressions that end up negative
  tHide:               {b:'001000111',type:'TIMESTAMP', default:'CURRENT_TIMESTAMP'}, // Cached value of tPos+hideTimer
  histActive:          {b:'011110111',type:'BIGINT UNSIGNED', default:0},  // feat:{kind:'S10',min:[0,1,2,4,6,10,15,20,24,26,28,29,30]}},
  tLastWriteOfTA:      {b:'000000110',type:'TIMESTAMP', default:'CURRENT_TIMESTAMP'},  // tLastWriteOfTimeAccumulated 
  tAccumulated:        {b:'011110111',type:'INT(8) UNSIGNED', default:0, feat:{kind:'S10',min:arrTAccumulatedMin, bucketLabel:arrTAccumulatedLabel}},
  //terminationDate:   {b:'010000101',type:'TIMESTAMP', default:0},
  displayName:         {b:'001000000'},
  tel:                 {b:'111010110',type:'VARCHAR(65)', default:''},
  link:                {b:'111010110',type:'VARCHAR(128)', default:''},

  homeTown:            {b:'111010111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}},
  currency:            {b:'111000111',type:'VARCHAR(3)', default:'', feat:{kind:'B'}},
  tLastPriceChange:    {b:'011011101',type:'TIMESTAMP', default:'CURRENT_TIMESTAMP'},
  x:                   {b:'111000111',type:'DOUBLE', default:0},
  y:                   {b:'111000111',type:'DOUBLE', default:0},
  geoHash:             {b:'000000111',type:'BIGINT UNSIGNED', default:0},
  //nMonthsStartOffer: {b:'000000110',type:'INT(4)', default:0},

  //nPayment:          {b:'000000000'},
  imTag:               {b:'001000000'},
  //image:             {b:'000000000'},
  image:               {b:'001000010'},
  
  displayEmail:        {b:'111110110',type:'VARCHAR(65)', default:''},
  boWebPushOK:         {b:'011001110',type:'BOOL', default:0, feat:{kind:'BN',span:1}},


  imTagTeam:           {b:'011000000'},
  idTeam:              {b:'011000111',type:'INT(4) UNSIGNED', default:0, feat:{kind:'BN'}},
  idTeamWanted:        {b:'110000110',type:'INT(4) UNSIGNED', default:0},
  boImgOwn:            {b:'001000000'},
  linkTeam:            {b:'101000000'},
  nComplaint:          {b:'011110110',type:'INT(4) UNSIGNED', default:0, feat:{kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]}},
  nComplaintCum:       {b:'011110110',type:'INT(4) UNSIGNED', default:0, feat:{kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]}},
  nComplaintGiven:     {b:'011110110',type:'INT(4) UNSIGNED', default:0, feat:{kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]}},
  nComplaintGivenCum:  {b:'011110110',type:'INT(4) UNSIGNED', default:0, feat:{kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]}},
  coordinatePrecisionM:{b:'111011110',type:'INT(4) UNSIGNED', default:1000},
  dist:                {b:'000010000'},
  experience:          {b:'111011111',type:'INT(4) UNSIGNED', default:0, feat:{kind:'BN'}}
  };
  

  
    // StrOrder: Order of arguments in roleTab (Object.keys may give unpredictable order)
  var StrOrder=['idUser', 'boShow', 'tCreated', 'tPos', 'hideTimer', 'tHide', 'histActive', 'tLastWriteOfTA', 'tAccumulated', 'tel', 'link', 'homeTown', 'currency', 'tLastPriceChange', 'x', 'y', 'displayEmail', 'idTeam', 'idTeamWanted', 'coordinatePrecisionM']; // , 'keyFromExternalTracker', 'iSeq'
  
  
  
// imTagTeam in teamTab (or should it be in roleTab to avoid a join in getinfo)
        
  // Should be moved to userTab: tPos?, x, y
  
  //PropTmp.idUser.pre='u.';
  PropTmp.idFB.pre='u.';
  PropTmp.idIdPlace.pre='u.';
  PropTmp.idOpenId.pre='u.';
  PropTmp.image.pre='u.';
  PropTmp.boImgOwn.pre='u.';
  PropTmp.displayName.pre='u.';
  PropTmp.imTag.pre='u.';
  
    // These "pre" are denormalized, so they occur in resp role tab
  //PropTmp.donatedAmount.pre='u.';
  //PropTmp.nComplaint.pre='u.';
  //PropTmp.nComplaintCum.pre='u.';
  //PropTmp.nComplaintGiven.pre='u.';
  //PropTmp.nComplaintGivenCum.pre='u.';

  //PropTmp.tPos.cond0F=function(name, val){  val="DATE_SUB(now(), INTERVAL "+val+" HOUR)"; return name+"<="+val;};
  //PropTmp.tCreated.cond0F=function(name, val){  val="DATE_SUB(now(), INTERVAL "+val+" MONTH)"; return name+"<="+val;};
  PropTmp.tPos.cond0F=function(name, val){  return "UNIX_TIMESTAMP("+name+")<=UNIX_TIMESTAMP(now())-"+val; };
  PropTmp.tCreated.cond0F=function(name, val){  return "UNIX_TIMESTAMP("+name+")<=UNIX_TIMESTAMP(now())-"+val; };
  PropTmp.histActive.cond0F=function(name, val){ return sqlHistActiveColCount+">="+val;};
  //PropTmp.tAccumulated.cond0F=function(name, val){ return "FLOOR(tAccumulated/"+sPerMonth+")>="+val;};
  PropTmp.tAccumulated.cond0F=function(name, val){ return "tAccumulated>="+val;};

  //PropTmp.tPos.cond1F=function(name, val){ val="DATE_SUB(now(), INTERVAL "+val+" HOUR)"; return name+">"+val;};
  //PropTmp.tCreated.cond1F=function(name, val){ val="DATE_SUB(now(), INTERVAL "+val+" MONTH)"; return name+">"+val;};
  PropTmp.tPos.cond1F=function(name, val){ return "UNIX_TIMESTAMP("+name+")>UNIX_TIMESTAMP(now())-"+val; };
  PropTmp.tCreated.cond1F=function(name, val){ return "UNIX_TIMESTAMP("+name+")>UNIX_TIMESTAMP(now())-"+val; };
  PropTmp.histActive.cond1F=function(name, val){ return sqlHistActiveColCount+"<"+val;};
  //PropTmp.tAccumulated.cond1F=function(name, val){ return "FLOOR(tAccumulated/"+sPerMonth+")<"+val;};
  PropTmp.tAccumulated.cond1F=function(name, val){ return "tAccumulated<"+val;};

  PropTmp.tCreated.selOneF=function(){ return "UNIX_TIMESTAMP(ro.tCreated)";};
  //PropTmp.nPayment.selOneF=function(){ return '0';};
  //PropTmp.idUser.selOneF=function(){ return "ro.idUser";};
  //PropTmp.link.selOneF=function(){ return "ro.link";}; // Because link is a column in tea too
  //PropTmp.imTag.selOneF=function(){ return "u.imTag";};
  PropTmp.imTagTeam.selOneF=function(){ return "tea.imTag";};
  PropTmp.linkTeam.selOneF=function(){return "tea.link";};
  PropTmp.tPos.selOneF=PropTmp.tLastWriteOfTA.selOneF=PropTmp.tLastPriceChange.selOneF=selTimeF;  //=PropTmp.terminationDate.selOneF

  PropTmp.tCreated.selF=function(){ return "UNIX_TIMESTAMP(ro.tCreated)";};
  //PropTmp.idUser.selF=function(){ return "u.idUser";};
  PropTmp.link.selF=function(){ return "ro.link";}; // Because link is a column in tea too
  //PropTmp.imTag.selF=function(){ return "u.imTag";};
  PropTmp.imTagTeam.selF=function(){return "tea.imTag";};
  PropTmp.linkTeam.selF=function(){return "tea.link";};
  //PropTmp.nComplaint.selF=function(){return "sum(rb.tCreated IS NOT NULL)";};
  PropTmp.histActive.selF=function(){return sqlHistActiveColCount;};
  PropTmp.tPos.selF=PropTmp.tLastWriteOfTA.selF=PropTmp.tLastPriceChange.selF=selTimeF;  //=PropTmp.terminationDate.selF

  //PropTmp.tPos.histCondF=function(name){ return "floor(UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(ro.tPos))";};
  //PropTmp.tCreated.histCondF=function(name){ return "floor(UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(ro.tCreated))";};
  PropTmp.tPos.histCondF=function(name){ return "UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(ro.tPos)";};
  PropTmp.tCreated.histCondF=function(name){ return "UNIX_TIMESTAMP(now())-UNIX_TIMESTAMP(ro.tCreated)";};
  PropTmp.histActive.histCondF=function(name){return sqlHistActiveColCount;};
  //PropTmp.tAccumulated.histCondF=function(name){ return "floor(tAccumulated/"+sPerMonth+")";};
  PropTmp.tAccumulated.histCondF=function(name){ return "tAccumulated";};

  PropTmp.idTeamWanted.roleUpdF=function(name,value){ var v=value.length==0?0:Number(value);  return ['?',v];};
  PropTmp.tCreated.roleUpdF=PropTmp.tPos.roleUpdF=PropTmp.tLastWriteOfTA.roleUpdF=PropTmp.tLastPriceChange.roleUpdF=updTimeF;  // =PropTmp.terminationDate.roleUpdF
  //PropTmp.tHide.roleUpdF=function(){return ["FROM_UNIXTIME(UNIX_TIMESTAMP(tPos)+hideTimer)"];}
  PropTmp.tHide.roleUpdF=function(){return ["FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(tPos)+hideTimer,"+intMax+"))"];}

  extend(oS.Prop, PropTmp);
  extend(oB.Prop, PropTmp);  delete oB.Prop.experience;
  

  //site.StrOther=['idTeam', 'currency', 'experience'];

  var StrFiltAccept=['donatedAmount', 'tCreated', 'tPos', 'hideTimer', 'histActive', 'tAccumulated', 'homeTown', 'currency', 'tLastPriceChange', 'idTeam', 'nComplaint', 'nComplaintCum', 'nComplaintGiven', 'nComplaintGivenCum', 'coordinatePrecisionM'];
  oB.StrFiltAccept=StrFiltAccept;
  oS.StrFiltAccept=StrFiltAccept.concat('experience');
  
  oB.StrOrder=StrOrder;
  oS.StrOrder=StrOrder.concat('experience');
}



PluginF.vehicleType=function(site){
  var [oB,oS]=site.ORole;

    // oS ////////////////////
  var Prop=oS.Prop;
  //                         012345678
  var tmpEnumVehicle=['sedan', 'wagon', 'largeMPV', 'MPV', 'hatchback'];
  var PropTmp={
    vehicleType:         {b:'111000111',type:'ENUM', default:tmpEnumVehicle[0], feat:{kind:'BF',bucket:tmpEnumVehicle}}
  };
  extend(Prop,PropTmp);
  Prop.vehicleType.Enum=tmpEnumVehicle;
  Prop.vehicleType.selF=selEnumF;
  Prop.vehicleType.selOneF=selEnumF;
  Prop.vehicleType.roleUpdF=updEnumBoundF;

  array_mergeM(oS.StrFiltAccept, Object.keys(PropTmp));
  oS.StrOrder.push('vehicleType');
}

PluginF.distNTimePrice=function(site){
  var [oB,oS]=site.ORole;

    // oS ////////////////////
  var Prop=oS.Prop;
  //                         012345678
  var tmpEnumDist=['km','mile'];
  var PropTmp={
    priceStart:          {b:'111010110',type:'DECIMAL(10,2)', default:0},
    strUnitDist:         {b:'111000110',type:'ENUM', default:tmpEnumDist[0]},
    pricePerDist:        {b:'111011110',type:'DECIMAL(10,2)', default:0},
    pricePerHour:        {b:'111011110',type:'DECIMAL(10,2)', default:0},
    comparePrice:        {b:'000010000'}
  };
  extend(Prop,PropTmp);
  
  Prop.strUnitDist.Enum=tmpEnumDist;
  Prop.strUnitDist.selOneF=selEnumF;
  Prop.strUnitDist.selF=selEnumF;
  Prop.strUnitDist.roleUpdF=updEnumBoundF;

  oS.StrPrice=oS.StrPrice||[];  oS.StrPrice.push('priceStart', 'pricePerDist', 'pricePerHour','comparePrice');
  oS.StrDistTimePrice=['priceStart', 'pricePerDist', 'pricePerHour','comparePrice'];
  array_mergeM(oS.StrFiltAccept, Object.keys(PropTmp));
  oS.StrOrder.push('priceStart', 'strUnitDist', 'pricePerDist', 'pricePerHour');
  
}


PluginF.transportBuyer=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  var Prop=oB.Prop;
  var tmpEnumCompassPoint=["-", 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  //var tmpEnumCompassPoint=['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  //                         012345678
  var PropTmp={
    compassPoint:        {b:'111000110',type:'ENUM', default:tmpEnumCompassPoint[0], feat:{kind:'BF',bucket:tmpEnumCompassPoint}},
    distStartToGoal:     {b:'111010111',type:'SMALLINT(2)',default:4, feat:{kind:'S11',min:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40],span:1}},
    destination:         {b:'111110110',type:'VARCHAR(65)', default:'', feat:{kind:'B'}},
    //price:               {b:'111011111',type:'DECIMAL(10,2)', default:0}
  };
  extend(Prop,PropTmp);
  Prop.compassPoint.Enum=tmpEnumCompassPoint;
  
  Prop.compassPoint.selF=selEnumF;
  Prop.compassPoint.selOneF=selEnumF;
  Prop.compassPoint.roleUpdF=updEnumBoundF;
  oB.StrTransportBuyer=['compassPoint','distStartToGoal','destination']; // ,'price'
  var StrTmp=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, StrTmp);
  array_mergeM(oB.StrOrder, StrTmp);
}

    
PluginF.standingByMethod=function(site){
  var [oB,oS]=site.ORole;
    // oS ////////////////////
  var Prop=oS.Prop;
  
  var tmpEnum=['inCar','atHome','5min','10min'];
  var PropTmp={
    standingByMethod:    {b:'111110111',type:'ENUM', default:tmpEnum[0], feat:{kind:'BF',bucket:tmpEnum}}
  };
  extend(Prop,PropTmp);
  Prop.standingByMethod.Enum=tmpEnum;

  Prop.standingByMethod.selF=selEnumF;
  Prop.standingByMethod.selOneF=selEnumF;
  Prop.standingByMethod.roleUpdF=updEnumBoundF;
  array_mergeM(oS.StrFiltAccept, 'standingByMethod');
  oS.StrOrder.push('standingByMethod');
}

PluginF.shiftEnd=function(site){
  var [oB,oS]=site.ORole;
    // oS ////////////////////
  var Prop=oS.Prop;
  //                           012345678
  var arrTmp=[1, 2, 3, 4, 6, 8, 10], arrShiftEndLabel=['-'].concat(arrTmp), arrShiftEndMin=[intMin].concat(eMultSc(arrTmp,3600));
  var PropTmp={
    shiftEnd:            {b:'111110101',type:'TIMESTAMP', default:0, feat:{kind:'S10',min:arrShiftEndMin, bucketLabel:arrShiftEndLabel}}
  };
  extend(Prop,PropTmp);
  //Prop.shiftEnd.cond0F=function(name, val){   val="GREATEST(DATE_ADD(now(), INTERVAL "+val+" HOUR),0)";   return name+">="+val;};
  //Prop.shiftEnd.cond1F=function(name, val){   val="GREATEST(DATE_ADD(now(), INTERVAL "+val+" HOUR),0)";   return name+"<"+val;};
  Prop.shiftEnd.cond0F=function(name, val){   return "UNIX_TIMESTAMP("+name+")>=GREATEST(UNIX_TIMESTAMP(now())+"+val+", 0)";  };
  Prop.shiftEnd.cond1F=function(name, val){   return "UNIX_TIMESTAMP("+name+")<GREATEST(UNIX_TIMESTAMP(now())+"+val+", 0)";   };
  Prop.shiftEnd.selOneF=selTimeF; Prop.shiftEnd.selF=selTimeF;
  //Prop.shiftEnd.histCondF=function(name){return "floor((UNIX_TIMESTAMP(ro.shiftEnd)-UNIX_TIMESTAMP(now()))/3600)";};
  //Prop.shiftEnd.histCondF=function(name){return "floor(UNIX_TIMESTAMP(ro.shiftEnd)-UNIX_TIMESTAMP(now()))";};
  Prop.shiftEnd.histCondF=function(name){return "UNIX_TIMESTAMP(ro.shiftEnd)-UNIX_TIMESTAMP(now())";};
  Prop.shiftEnd.roleUpdF=updTimeF;

  array_mergeM(oS.StrFiltAccept, 'shiftEnd');
  oS.StrOrder.push('shiftEnd');
}

PluginF.price=function(site, charRoleUC){
  var [oB,oS]=site.ORole;
  var oRole=charRoleUC=='B'?oB:oS;
    // oRole ////////////////////
  //                         012345678
  var PropTmp={
    price:        {b:'111010110',type:'DECIMAL(10,0)', default:0}
  };
  extend(oRole.Prop, PropTmp);
  oRole.StrPrice=oRole.StrPrice||[];  oRole.StrPrice.push('price');
  array_mergeM(oRole.StrFiltAccept, 'price'); 
  oRole.StrOrder.push('price');
}
PluginF.hourlyPrice=function(site, charRoleUC){
  var [oB,oS]=site.ORole;
  var oRole=charRoleUC=='B'?oB:oS;
    // oRole ////////////////////
  //                         012345678
  var PropTmp={
    pricePerHour:        {b:'111010110',type:'DECIMAL(10,0)', default:0}
  };
  extend(oRole.Prop, PropTmp);
  oRole.StrPrice=oRole.StrPrice||[];  oRole.StrPrice.push('pricePerHour');
  array_mergeM(oRole.StrFiltAccept, 'pricePerHour'); 
  oRole.StrOrder.push('pricePerHour');
}

PluginF.fixedPricePerUnit=function(site){
  var [oB,oS]=site.ORole;
    // oB ////////////////////
  //                            012345678
  var PropTmp={
    fixedPricePerUnit:      {b:'111010110',type:'DECIMAL(10,0)', default:0},
    fixedPricePerUnitUnit:  {b:'111011111',type:'VARCHAR(5)', default:'', feat:{kind:'B'}}
  };
  extend(oB.Prop, PropTmp); 
  oB.StrPrice=oB.StrPrice||[];  oB.StrPrice.push('fixedPricePerUnit', 'fixedPricePerUnitUnit');
  array_mergeM(oB.StrFiltAccept, 'fixedPricePerUnit', 'fixedPricePerUnitUnit');
  oB.StrOrder.push('fixedPricePerUnit', 'fixedPricePerUnitUnit');
}

/***********************************************************************************
 * PluginF (site specific)
 ***********************************************************************************/

//PluginF.taxi=PluginF.demo=PluginF.test=function(){
PluginF.taxi=function(site){
  var [oB,oS]=site.ORole;
  
    // Both ////////////////////
  //                           012345678
  var PropTmp={
    nPassengers:          {b:'111010111',type:'SMALLINT(2)',default:4, feat:{kind:'S11',min:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40],span:1}},
    nChildSeat:           {b:'111011110',type:'TINYINT', default:0, feat:{kind:'S10',min:[0, 1, 2, 3],span:1}},
    nWheelChairPlaces:    {b:'111010110',type:'TINYINT', default:0, feat:{kind:'S10',min:[0, 1, 2, 3],span:1}}
  };

  extend(oB.Prop,PropTmp);   extend(oS.Prop, PropTmp);
  site.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, site.StrPropE);   array_mergeM(oS.StrFiltAccept, site.StrPropE); 
  //oB.StrOrder.push('nPassengers', 'nChildSeat', 'nWheelChairPlaces');
  //oS.StrOrder.push('nPassengers', 'nChildSeat', 'nWheelChairPlaces');
  array_mergeM(oB.StrOrder, site.StrPropE);
  array_mergeM(oS.StrOrder, site.StrPropE);
  
      // oS ////////////////////
  //                           012345678
  var PropTmpS={
    brand:               {b:'111000111',type:'VARCHAR(20)', default:'',feat:{kind:'B'}},
    idDriverGovernment:  {b:'111011110',type:'VARCHAR(65)', default:''},
    nExtraSeat:          {b:'111011110',type:'TINYINT', default:0, feat:{kind:'S10',min:[0, 1, 2, 3],span:1}}
  };
  
  extend(oS.Prop, PropTmpS);
  
  oS.StrPropE=Object.keys(PropTmpS);
  array_mergeM(oS.StrFiltAccept, oS.StrPropE);  
  
  oS.Prop.vehicleType.feat.bucket=array_mergeM(oS.Prop.vehicleType.Enum, ['rickshaw', 'limo', 'bus', 'smallBus', 'boat']);
  //oS.StrOrder.push('brand', 'idDriverGovernment', 'nExtraSeat');
  array_mergeM(oS.StrOrder, oS.StrPropE);
}

PluginF.transport=function(site){
  var [oB,oS]=site.ORole;
 
    // Both ////////////////////
  var PropTmp={
    payload:             {b:'111010111',type:'INT(4)', default:0, feat:{kind:'S11',min:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40]}}
  };
  
  site.StrTransportBool=[
  'generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer'
  // 'tankTruck', 'flatbed', 'lowboy', 'loggingTruck', 'automobileTransport', 'livestock', 'vehicleTowing'
  ];
  for(var i=0;i<site.StrTransportBool.length;i++){
    var name=site.StrTransportBool[i];
    PropTmp[name]=          {b:'111011110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  } 
  
  extend(oB.Prop, PropTmp); extend(oS.Prop, PropTmp);
  site.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, site.StrPropE);  array_mergeM(oS.StrFiltAccept, site.StrPropE);
  //array_mergeM(oB.StrOrder, 'payload', site.StrTransportBool);
  //array_mergeM(oS.StrOrder, 'payload', site.StrTransportBool);
  array_mergeM(oB.StrOrder, site.StrPropE);
  array_mergeM(oS.StrOrder, site.StrPropE);
   
    // oS ////////////////////
  //                           012345678
  var PropTmpS={
    brand:               {b:'111000111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}}
  };

  extend(oS.Prop, PropTmpS);
  
  oS.StrPropE=Object.keys(PropTmpS);  
  array_mergeM(oS.StrFiltAccept, oS.StrPropE);  
  
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=array_mergeM(['bike', 'moped', 'MC'], oS.Prop.vehicleType.Enum, ['pickup', 'van', 'lorry', 'semiTrailer',  'lorryWTrailer', 'semiTrailerWTrailer', 'boat']);   //, 'lorryWDollyTrailer', 'semiTrailerWDollyTrailer'
  //oS.StrOrder.push('brand');
  array_mergeM(oS.StrOrder, oS.StrPropE);
  
}

PluginF.cleaner=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  var StrCleanerBool=['household','janitor','sanitation', 'exterior','customerHasEquipment'];
  //                          012345678
  var PropTmp={};
  for(var i=0;i<StrCleanerBool.length;i++){
    var name=StrCleanerBool[i];
    PropTmp[name]=         {b:'111011110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  }
  extend(oB.Prop, PropTmp); 
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE); 
  array_mergeM(oB.StrOrder, oB.StrPropE);
  
    // oS ////////////////////
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];
}


PluginF.windowcleaner=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  //                          012345678
  var PropTmp={
    nWindow:               {b:'111110111',type:'INT(4)', default:0, feat:{kind:'S11',min:[0, 1, 2, 4, 8, 16, 32, 64, 128, 256]}},
    customerHasEquipment:{b:'111010110',type:'BOOL', default:0, feat:{kind:'BN',span:1}}
  };
  extend(oB.Prop,PropTmp);
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE); 
  array_mergeM(oB.StrOrder, oB.StrPropE);
  
  
    // oS ////////////////////
  var StrBool=['ladder','skyLift'];
  //                          012345678
  var PropTmp={};
  for(var i=0;i<StrBool.length;i++){
    var name=StrBool[i];
    PropTmp[name]=         {b:'111011110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  }
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];
  extend(oS.Prop,PropTmp); 
  oS.StrPropE=Object.keys(PropTmp);
  array_mergeM(oS.StrFiltAccept, oS.StrPropE); 
  array_mergeM(oS.StrOrder, oS.StrPropE);
}

PluginF.lawnmowing=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  //                        012345678
  var PropTmp={
    area:                  {b:'111110111',type:'INT(4)', default:0, feat:{kind:'S11',min:[0, 100, 500, 2000, 10000, 50000]}},
    customerHasEquipment:{b:'111010110',type:'BOOL', default:0, feat:{kind:'BN',span:1}}
  };
  extend(oB.Prop,PropTmp);
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE);
  array_mergeM(oB.StrOrder, oB.StrPropE);
  
    // oS ////////////////////
  oS.StrBool=['pushMower','ridingMower', 'edger'];
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=['ridingMower', 'foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];

  //                        012345678
  var PropTmp={
    cuttingWidth:        {b:'111110111',type:'INT(4)', default:0, feat:{kind:'S11',min:[0, 10, 20, 30, 40, 50, 60, 80, 100, 120, 140]}}
  };

  for(var i=0;i<oS.StrBool.length;i++){
    var name=oS.StrBool[i];
    PropTmp[name]=         {b:'111010110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  }
  extend(oS.Prop,PropTmp);
  oS.StrPropE=Object.keys(PropTmp);
  array_mergeM(oS.StrFiltAccept, oS.StrPropE);
  array_mergeM(oS.StrOrder, oS.StrPropE);
}


PluginF.snowremoval=function(site){
  var [oB,oS]=site.ORole;

    // oB ////////////////////
  oB.StrBool=['road', 'driveway', 'roof', 'customerHasEquipment'];
  //                         012345678
  var PropTmp={
    area:                  {b:'111110111',type:'INT(4)', default:0, feat:{kind:'S11',min:[0, 10, 50, 200, 1000, 5000]}}
  };
  for(var i=0;i<oB.StrBool.length;i++){
    var name=oB.StrBool[i];
    PropTmp[name]=          {b:'111010110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  }
  extend(oB.Prop, PropTmp); 
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE);
  array_mergeM(oB.StrOrder, oB.StrPropE);
  
  
    // oS ////////////////////
  oS.StrBool=['shovel', 'snowblower', 'plow'];
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=[ 'foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van', 'lorryOpen', 'ridingMower', 'tractor'];
  //                         012345678
  var PropTmp={};
  for(var i=0;i<oS.StrBool.length;i++){
    var name=oS.StrBool[i];
    PropTmp[name]=          {b:'111010110',type:'BOOL', default:0, feat:{kind:'BN',span:1}};
  }
  extend(oS.Prop,PropTmp);
  oS.StrPropE=Object.keys(PropTmp);
  array_mergeM(oS.StrFiltAccept, oS.StrPropE);
  array_mergeM(oS.StrOrder, oS.StrPropE);
}

PluginF.fruitpicker=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  //                        012345678
  var PropTmp={
    fruit:              {b:'111111111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}}
  };
  extend(oB.Prop, PropTmp); 
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE);
  array_mergeM(oB.StrOrder, oB.StrPropE);


    // oS ////////////////////
  oS.Prop.vehicleType.feat.bucket=oS.Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'van'];

}

        //  0         1        2       3       4       5       6           7             8   
//bNameS=['input','DBSelOne','DBSel','block','label','help','sellerTab','notNull', 'sellerTabIndex'];

PluginF.programmer=function(site){
  var [oB,oS]=site.ORole;
  
    // oB ////////////////////
  //                           012345678
  var PropTmp={
    database:              {b:'111111111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}},
    language:              {b:'111111111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}}
  };
  extend(oB.Prop, PropTmp);
  oB.StrPropE=Object.keys(PropTmp);
  array_mergeM(oB.StrFiltAccept, oB.StrPropE);
  array_mergeM(oB.StrOrder, oB.StrPropE);
  
  
    // oS ////////////////////
  oS.StrProgrammerLang=['c', 'java', 'php', 'javascript', 'cpp', 'python', 'shell', 'ruby', 'objectiveC', 'cSharp', 'assembly', 'sql', 'perl', 'asp', 'd', 'vb', 'delphi', 'scala', 'actionScript', 'coldFusion', 'lua', 'ada', 'pascal', 'haskell', 'scheme', 'cobol', 'lisp', 'clojure', 'erlang', 'fortran'];  // 30 most popular from http://langpop.com/
  var PropTmp={};
  //                            012345678
  for(var i=0;i<oS.StrProgrammerLang.length;i++){
    var name=oS.StrProgrammerLang[i];
    PropTmp[name]=          {b:'111010110',type:'INT(4)', default:0, feat:{kind:'S10',min:[0, 1, 2, 3, 4, 5],span:1}};
  }
  PropTmp.otherLang=        {b:'111111111',type:'VARCHAR(20)', default:'', feat:{kind:'B'}};
  
  Object.assign(oS.Prop, PropTmp);
  oS.StrPropE=Object.keys(PropTmp);
  array_mergeM(oS.StrFiltAccept, oS.StrPropE);
  array_mergeM(oS.StrOrder, oS.StrPropE);
  arrValRemove(oS.StrFiltAccept, 'experience');  arrValRemove(oS.StrOrder, 'experience');
  //removeProp(oS,'experience');
  delete oS.Prop.experience
}


featCalcValExtend=function(Prop){
  for(var name in Prop){
    var prop=Prop[name];
    if(!('feat' in prop)) continue;
    var feat=prop.feat, boBucket='bucket' in feat, boMin='min' in feat;
    if(boBucket||boMin){  // set n (=length) (if applicable)
      var len=boBucket?feat.bucket.length:feat.min.length;
      Prop[name].feat.n=len;  Prop[name].feat.last=len-1;
    }
  
    if(feat.kind[0]=='S'){
      if(!('max' in feat)){
            // Create feat.max;  maxClosed
        feat.max=[]; var maxClosed=[];
        var jlast=feat.last;    
        for(var j=0;j<jlast;j++){ 
          var tmp=feat.min[j+1]; feat.max[j]=tmp; maxClosed[j]=tmp-1;
        }
        feat.max[jlast]=intMax; maxClosed[jlast]=intMax;
      }

      if(!('bucketLabel' in feat)){ // (labels in histogram)
        feat.bucketLabel=[].concat(feat.min);
        feat.bucketLabel[feat.last]='≥'+feat.bucketLabel[feat.last];
      }

      Prop[name].feat=feat;
    }
  }
}

/***************************************************************************
 * SiteExtend
 ***************************************************************************/

siteCalcValExtend=function(site,siteName){ // Adding stuff that can be calculated from the other properties
  var {ORole}=site;
  for(var i=0;i<ORole.length;i++){
    var oRole=ORole[i], Prop=oRole.Prop;
    oRole.KeyCol=Object.keys(Prop);   oRole.nCol=oRole.KeyCol.length;   oRole.colsFlip=array_flip(oRole.KeyCol);
    var KeySel=oRole.KeySel=filterPropKeyByB(Prop, oRole.bFlip.DBSel); // KeySel: the data (columns) of MTab that is transfered from server to client

    featCalcValExtend(oRole.Prop);
    var arrAllowed=[];for(var name in Prop ){ var arr=Prop[name]; if(Number(arr.b[oRole.bFlip.input])) arrAllowed.push(name);} oRole.arrAllowed=arrAllowed;
      
      // Completeing oRole.StrOrder (The key order of an object varies, so StrOrder is assigned separatly to make the order more predictable.)
    for(var j=0;j<oRole.KeyCol.length;j++) {
      var strKey=oRole.KeyCol[j]; if(oRole.StrOrder.indexOf(strKey)==-1) oRole.StrOrder.push(strKey);
    }

    var arrCol=[];
    for(var j=0;j<KeySel.length;j++) {
      var key=KeySel[j], b=Prop[key].b, pre=Prop[key].pre||preDefault;
      var tmp; if('selF' in Prop[key]) { tmp=Prop[key].selF(pre+key);  }   else tmp=pre+"`"+key+"`";
      arrCol.push(tmp+" AS "+"`"+key+"`");
    }
    oRole.strCol=arrCol.join(', ');
  }
  
  site.TableName={};   for(var name in TableNameProt){  site.TableName[name+"Tab"]=siteName+'_'+name; }
  site.ViewName={}; for(var name in ViewNameProt){  site.ViewName[name+"View"]=siteName+'_'+name; }

  extend(site, {boGotNewSellers:0, boGotNewBuyers:0, timerNUserLast:0, nVisB:0, nVisS:0, nTotB:0, nTotS:0, nUser:0}); 
  
  //site.db=siteName in DB?siteName:'default';
  //var db=siteName in DB?DB[siteName]:DB.default;  site.pool=db.pool;
}



SiteExtend=function(){
  Site.getSite=function(wwwReq){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   var tmp; if(tmp=Site[siteName].testWWW(wwwReq)) {return {siteName:siteName, wwwSite:tmp};  }
    }
    return {siteName:null};
  }
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i], StrPlugInNArg=[];
    //var tmp={siteName:siteName, Prop:{}, Cond0F:{}, Cond1F:{}, SelOneF:{}, SelF:{}, HistCondF:{}, SellerUpdF:{}, Enum:{}};
    var ORole=JSON.parse(JSON.stringify(ORoleDefault));
    var tmp={siteName:siteName, ORole:ORole, oB:ORole[0], oS:ORole[1]};
    var site=extend(Site[siteName],tmp);
    if(['taxi', 'transport'].indexOf(siteName)!=-1) { // , 'demo', 'test'
      StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'priceB', 'transportBuyer', 'standingByMethod', 'shiftEnd', siteName];   //if(['demo', 'test'].indexOf(siteName)!=-1) StrPlugInNArg.splice(5,0,'taxi');
    }
    else if(siteName=='cleaner') StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'hourlyPriceB', 'shiftEnd', siteName];
    else if(siteName=='windowcleaner') StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'hourlyPriceB', siteName];
    else if(siteName=='fruitpicker') StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'hourlyPriceB', 'fixedPricePerUnit', siteName];
    else if(siteName=='lawnmowing') StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'hourlyPriceB', siteName];
    else if(siteName=='snowremoval') StrPlugInNArg=['general', 'vehicleType', 'distNTimePrice', 'hourlyPriceB', siteName];
    else if(siteName=='programmer') StrPlugInNArg=['general', 'hourlyPriceB', 'hourlyPriceS', siteName];
    else StrPlugInNArg=['general'];
    
    for(var j=0;j<StrPlugInNArg.length;j++){
      var nameT=StrPlugInNArg[j], n=nameT.length, charRoleUC=nameT[n-1]; if(charRoleUC=='B' || charRoleUC=='S') {nameT=nameT.substr(0, n-1);} else charRoleUC='';
      PluginF[nameT](site, charRoleUC);
    }
    siteCalcValExtend(site,siteName);
    site.StrPlugInNArg=StrPlugInNArg;

/*
    if('domainReg' in site) {
      site.regexp=RegExp(site.domainReg);       site.testDomain=function(domain){ return this.regexp.test(domain);};
    } else site.testDomain=function(domain){ return domain.indexOf(this.siteName)==0;};
*/
/*
    var domainTmp=RootDomain[site.strRootDomain].domain; if("subDomain" in site && site.subDomain) domainTmp=site.subDomain+'.'+domainTmp;     site.domain=domainTmp;
    if('domainReg' in site) {  site.regexp=RegExp(site.domainReg);       site.testDomain=function(domain){ return this.regexp.test(domain);};    } 
    else site.testDomain=function(domain){ return this.domain===domain;};
*/
    site.testWWW=function(wwwReq){
      if(wwwReq.indexOf(this.wwwSite)==0) return this.wwwSite; else return false;
    };

    site.client_id={};
    var objTmp=RootDomain[site.strRootDomain];
    var StrIP=['fb','google','idplace'];
    for(var j=0;j<StrIP.length;j++){
      var strIP=StrIP[j];      if(strIP in objTmp) site.client_id[strIP]=objTmp[strIP].id;
    }
    var regDomainRoot = RegExp('([^\\.]+\\.[^\\./]+)(?:/.*)?$');
    var regDomain = RegExp('^([^/]+)(?:/.*)?$');
    if(typeof wwwLoginRet=='undefined'){     var M=regDomain.exec(site.wwwSite); site.wwwLoginRet=site.wwwSite+"/"+leafLoginBack;      }
    else {      site.wwwLoginRet=wwwLoginRet;  site.wwwLoginScope=wwwLoginScope;    }


  }
}


nDBConnectionLimit=10; nDBQueueLimit=100;
nDBRetry=14;

DBExtend=function(){
  var StrDB=Object.keys(UriDB);
  for(var i=0;i<StrDB.length;i++){
    var name=StrDB[i], uriDB=UriDB[name];
    var uriObj=url.parse(uriDB);

    var StrMatch=RegExp('^(.*):(.*)$').exec(uriObj.auth);
    var nameDB=uriObj.pathname.substr(1);
    DB[name]={nameDB:nameDB};
    var pool  = mysql.createPool({
      connectionLimit : nDBConnectionLimit,
      host            : uriObj.host,
      user            : StrMatch[1],
      password        : StrMatch[2],
      database        : nameDB,
      multipleStatements: true,
      waitForConnections:true,
      queueLimit:nDBQueueLimit,
      flags:'-FOUND_ROWS'
    });
    pool.on('error',function(e){debugger});
    DB[name].pool=pool;
  }
}


TLSDataExtend=function(){
  this.getContext=function(domainName){
    for(var i=0;i<this.length;i++){
      if(this[i].testDomain(domainName)) return this[i].context;
    }
    return undefined;
    //return false;
  }
  
  for(var i=0;i<this.length;i++){
    var item=this[i];
    if('domainReg' in item) {  item.regexp=RegExp(item.domainReg);       item.testDomain=function(domain){ return this.regexp.test(domain);};    } 
    else item.testDomain=function(domain){ return this.domain===domain;};
    //item.context=crypto.createCredentials({        key:  item.strKey,        cert: item.strCert      }).context;
    item.context=tls.createSecureContext({        key:  item.strKey,        cert: item.strCert      });//.context;
  }
}





