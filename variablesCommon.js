

two31=Math.pow(2,31);  intMax=two31-1;  intMin=-two31;
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
leafPayNotify="payNotify.js";
leafLoginWLink="loginWLink";
//leafVerifyEmailReturn='verifyEmail';
leafVerifyPWResetReturn='verifyPWReset';
leafVerifyEmailNCreateUserReturn='verifyEmailNCreateUser';

hideTimerDefault=30*24*3600;
hideTimerDefault=365*24*3600;
if(boDbg) hideTimerDefault=30*60;

   // DB- TableNameProt
StrTableKey=["pubKey","vendor","vendorImage","payment","team","teamImage","marketer","rebateCode","report","admin","setting","user"]; 
StrViewsKey=["hist"]; 
TableNameProt={};for(var i=0;i<StrTableKey.length;i++) TableNameProt[StrTableKey[i]]='';
ViewNameProt={};for(var i=0;i<StrViewsKey.length;i++) ViewNameProt[StrViewsKey[i]]='';






EnumDistUnit=['km','mile']

  // histActive variables
lenHistActive=30;
var maskHistActive=(1<<lenHistActive)-1;
sqlMaskHistActive="& "+maskHistActive; if(lenHistActive==64) sqlMaskHistActive='';
var sqlDayDiff="floor( UNIX_TIMESTAMP(now())/"+sPerDay+" )  -  floor( UNIX_TIMESTAMP(posTime)/"+sPerDay+" )";
var sqlHistActiveCol="histActive<<"+sqlDayDiff+"  "+sqlMaskHistActive;
//sqlHistActiveColUpd="histActive= (histActive<<"+sqlDayDiff+" | 1) "+sqlMaskHistActive; // "<<" has higher precedence than "|"
sqlHistActiveColCount="BIT_COUNT("+sqlHistActiveCol+")";



specialistDefault={user:0,reporter:0,vendor:0,team:0,marketer:0,admin:0};
arrCoordinatePrecisionM=[1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000];
wc2m=1e5;   // wc2m: Point (world coordinate) to meter (at equator) (Should be earthCircumference/256 = 4e7/256 = 156250 which I round to 1e5 [m])
wc2m=40074784/256;
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



    //    0        1         2       3       4       5       6           7              8   
bName=['input','DBSelOne','DBSel','block','label','help','vendorTab','notNull', 'vendorTabIndex'];    // Block and label concerns vendorInfo (vendorInfoDiv?!?)
bFlip=array_flip(bName);

maxVendor=30;

//date_default_timezone_set('UTC');
arrLang=[['sv','Svenska'],['en','English']]; arrLangShort=[]; for(var i=0;i<arrLang.length;i++){    arrLangShort[i]=arrLang[i][0];    }
maxGroupsInFeat=20;
preDefault="v.";
//snoreLim=12*3600;
snoreLim=20*24*3600;
boShowTeam=0;
rebateCodeLen=8;
version='364';
auto_increment_increment=1;


/***********************************************************************************
 * CreatorPlugin
 ***********************************************************************************/
CreatorPlugin={}
CreatorPlugin.general=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                       012345678
  var tmp={
  index:               {b:'000000000'},
  idUser:              {b:'011000110',type:'int(4)'},
  idFB:                {b:'001011000'},
  idIdPlace:           {b:'001011000'},
  idOpenId:            {b:'001011000'},
  donatedAmount:       {b:'011111111',type:'DOUBLE', default:0},
  boShow:              {b:'110000110',type:'TINYINT', default:0},
  created:             {b:'011111101',type:'TIMESTAMP', default:0},
  posTime:             {b:'011011101',type:'TIMESTAMP', default:0},
  histActive:          {b:'001110111',type:'BIGINT UNSIGNED', default:0},
  tLastWriteOfTA:      {b:'000000110',type:'TIMESTAMP', default:0},  // tLastWriteOfTimeAccumulated 
  timeAccumulated:     {b:'011110111',type:'INT(8) UNSIGNED', default:0},
  hideTimer:           {b:'110000110',type:'INT(8)', default:hideTimerDefault},
  terminationDate:     {b:'010000101',type:'TIMESTAMP', default:0},
  displayName:         {b:'111000110',type:'VARCHAR(32)', default:''},
  tel:                 {b:'111010110',type:'VARCHAR(65)', default:''},
  link:                {b:'111010110',type:'VARCHAR(128)', default:''},

  homeTown:            {b:'111010111',type:'VARCHAR(20)', default:''},
  currency:            {b:'111000111',type:'VARCHAR(3)', default:''},
  lastPriceChange:     {b:'011011101',type:'TIMESTAMP', default:0},
  x:                   {b:'111000111',type:'DOUBLE', default:0},
  y:                   {b:'111000111',type:'DOUBLE', default:0},
  nMonthsStartOffer:   {b:'000000110',type:'INT(4)', default:0},

  nPayment:            {b:'000000000'},
  imTag:               {b:'011000110',type:'INT(4)', default:0},
  //image:               {b:'000000000'},
  image:               {b:'001000010'},
  
  displayEmail:        {b:'111110110',type:'VARCHAR(65)', default:''},


  imTagTeam:           {b:'011000000'},
  idTeam:              {b:'011000111',type:'INT(4)', default:0},
  idTeamWanted:        {b:'110000110',type:'INT(4)', default:0},
  boImgOwn:            {b:'011000110',type:'BOOL', default:0},
  linkTeam:            {b:'101000000'},
  nReport:             {b:'001110000'},
  coordinatePrecisionM:{b:'111011110',type:'INT(4) UNSIGNED', default:10000},
  dist:                {b:'000010000'}
  };
  extend(Prop,tmp);
  site.StrOrderDB=Object.keys(tmp);
  //StrOrderDB=['index', 'idUser', 'idFB', 'idIdPlace', 'idOpenId', 'boShow', 'created', 'posTime', 'histActive', 'tLastWriteOfTA', 'timeAccumulated', 'hideTimer', 'terminationDate', 'displayName', 'tel', 'link', 'homeTown', 'currency', 'lastPriceChange', 'x', 'y', 'nMonthsStartOffer', 'nPayment', 'imTag', 'imTagTeam', 'idTeam', 'idTeamWanted', 'boImgOwn', 'linkTeam', 'nReport', 'coordinatePrecisionM', 'dist', 'image']
  Prop.donatedAmount.feat={kind:'S11',min:[0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]};
  Prop.homeTown.feat={kind:'B'};
  Prop.idTeam.feat={kind:'BN'};
  Prop.currency.feat={kind:'B'};
  Prop.posTime.feat={kind:'S01',min:[0, 1, 2, 4, 8, 16, 24, 48]};  //, myDefault:[0,5]
  Prop.created.feat={kind:'S10',min:[0, 1, 2, 4, 6, 9, 12, 18, 24, 36, 48]};
  Prop.timeAccumulated.feat={kind:'S10',min:[0, 1, 2, 4, 6, 9, 12, 18, 24, 36, 48]};
  Prop.histActive.feat={kind:'S10',min:[0,1,2,4,6,10,15,20,24,26,28,29,30]};

  
  Prop.idUser.pre='u.';
  Prop.idFB.pre='u.';
  Prop.idIdPlace.pre='u.';
  Prop.idOpenId.pre='u.';
  Prop.image.pre='u.';

  Prop.posTime.cond0F=function(name, val){  val="DATE_SUB(now(), INTERVAL "+val+" HOUR)"; return name+"<="+val;};
  Prop.created.cond0F=function(name, val){  val="DATE_SUB(now(), INTERVAL "+val+" MONTH)"; return name+"<="+val;};
  Prop.histActive.cond0F=function(name, val){ return sqlHistActiveColCount+">="+val;};
  Prop.timeAccumulated.cond0F=function(name, val){ return "FLOOR(timeAccumulated/"+sPerMonth+")>="+val;};

  Prop.posTime.cond1F=function(name, val){ val="DATE_SUB(now(), INTERVAL "+val+" HOUR)"; return name+">"+val;};
  Prop.created.cond1F=function(name, val){ val="DATE_SUB(now(), INTERVAL "+val+" MONTH)"; return name+">"+val;};
  Prop.histActive.cond1F=function(name, val){ return sqlHistActiveColCount+"<"+val;};
  Prop.timeAccumulated.cond1F=function(name, val){ return "FLOOR(timeAccumulated/"+sPerMonth+")<"+val;};

  Prop.created.selOneF=function(){ return "UNIX_TIMESTAMP(v.created)";};
  //Prop.nPayment.selOneF=function(){ return '0';};
  Prop.idUser.selOneF=function(){ return "v.idUser";};
  //Prop.idUser.selOneF=function(){ return "(@idUser:=u.idUser)";};
  Prop.link.selOneF=function(){ return "v.link";};
  Prop.imTag.selOneF=function(){ return "v.imTag";};
  Prop.imTagTeam.selOneF=function(){ return "dis.imTag";};
  Prop.posTime.selOneF=Prop.tLastWriteOfTA.selOneF=Prop.terminationDate.selOneF=Prop.lastPriceChange.selOneF=selTimeF;

  Prop.created.selF=function(){ return "UNIX_TIMESTAMP(v.created)";};
  //Prop.idUser.selF=function(){ return "u.idUser";};
  Prop.link.selF=function(){ return "v.link";};
  Prop.imTag.selF=function(){ return "v.imTag";};
  Prop.imTagTeam.selF=function(){return "dis.imTag";};
  Prop.linkTeam.selF=function(){return "dis.link";};
  Prop.nReport.selF=function(){return "sum(rb.created IS NOT NULL)";};
  Prop.histActive.selF=function(){return sqlHistActiveColCount;};
  Prop.posTime.selF=Prop.tLastWriteOfTA.selF=Prop.terminationDate.selF=Prop.lastPriceChange.selF=selTimeF;

  Prop.posTime.histCondF=function(name){ return "floor((-UNIX_TIMESTAMP(v.posTime)+UNIX_TIMESTAMP(now()))/3600)";};
  Prop.created.histCondF=function(name){ return "floor((-UNIX_TIMESTAMP(v.created)+UNIX_TIMESTAMP(now()))/"+sPerMonth+")";};
  Prop.histActive.histCondF=function(name){return sqlHistActiveColCount;};
  Prop.timeAccumulated.histCondF=function(name){ return "floor(timeAccumulated/"+sPerMonth+")";};

  Prop.idTeamWanted.vendorUpdF=function(name,value){ var v=value.length==0?0:Number(value);  return ['?',v];};
  Prop.created.vendorUpdF=Prop.posTime.vendorUpdF=Prop.tLastWriteOfTA.vendorUpdF=Prop.terminationDate.vendorUpdF=Prop.lastPriceChange.vendorUpdF=updTimeF;



  site.StrPropContact=['tel', 'displayEmail', 'homeTown', 'link'];
  site.StrPropPos=['dist', 'posTime'];
  site.StrPropRep=['created', 'histActive', 'timeAccumulated', 'donatedAmount'];

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam','posTime'],site.StrPropRep);
}
}

CreatorPlugin.transportProt=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                             012345678
  var tmpEnum=['sedan', 'wagon', 'largeMPV', 'MPV', 'hatchback'];
  var tmp={
    vehicleType:         {b:'111000111',type:'ENUM', default:tmpEnum[0]}
  };
  tmp.vehicleType.feat={kind:'BF',bucket:tmpEnum};
  extend(Prop,tmp);
  Prop.vehicleType.Enum=tmpEnum;
  site.StrOrderDB.push('vehicleType');
  
  Prop.vehicleType.selF=selEnumF;
  Prop.vehicleType.selOneF=selEnumF;
  Prop.vehicleType.vendorUpdF=updEnumBoundF;

  site.StrOrderFilt.unshift('vehicleType');
}
}

CreatorPlugin.transportPrice=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                           012345678
  var tmpEnum=['km','mile'];
  var tmp={
  priceStart:          {b:'111010110',type:'DECIMAL(10,2)', default:0},
  distUnit:            {b:'111000110',type:'ENUM', default:tmpEnum[0]},
  pricePerDist:        {b:'111011110',type:'DECIMAL(10,2)', default:0},
  pricePerHour:        {b:'111011110',type:'DECIMAL(10,2)', default:0},
  comparePrice:        {b:'000010000'}
  };
  extend(Prop,tmp);
  array_mergeM(site.StrOrderDB,Object.keys(tmp));
  Prop.distUnit.Enum=tmpEnum;
  Prop.distUnit.selOneF=selEnumF;
  Prop.distUnit.selF=selEnumF;
  Prop.distUnit.vendorUpdF=updEnumBoundF;

  site.StrPropTransportProtPrice=['priceStart', 'pricePerDist', 'pricePerHour','comparePrice'];
}
}

CreatorPlugin.transportUrgent=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  var tmpEnum=['inCar','atHome','5min','10min'];
  var tmp={
  standingByMethod:    {b:'111110111',type:'ENUM', default:tmpEnum[0]}};
  tmp.standingByMethod.feat={kind:'BF',bucket:tmpEnum};
  extend(Prop,tmp); // after,'homeTown'
  Prop.standingByMethod.Enum=tmpEnum;
  Str_insertM(site.StrOrderDB,'homeTown','standingByMethod');

  Prop.standingByMethod.selF=selEnumF;
  Prop.standingByMethod.selOneF=selEnumF;
  Prop.standingByMethod.vendorUpdF=updEnumBoundF;
  Str_insertM(site.StrOrderFilt,'idTeam','standingByMethod');
}
}

CreatorPlugin.night=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                           012345678
  var tmp={
  shiftEnd:            {b:'111110101',type:'TIMESTAMP', default:0}};
  tmp.shiftEnd.feat={kind:'S10',min:[intMin, 1, 2, 3, 4, 6, 8, 10]};
  extend(Prop,tmp); // after,'vehicleType'
  array_mergeM(site.StrOrderDB,['shiftEnd']);
  Prop.shiftEnd.cond0F=function(name, val){   val="GREATEST(DATE_ADD(now(), INTERVAL "+val+" HOUR),0)";   return name+">="+val;};
  Prop.shiftEnd.cond1F=function(name, val){   val="GREATEST(DATE_ADD(now(), INTERVAL "+val+" HOUR),0)";   return name+"<"+val;};
  Prop.shiftEnd.selOneF=selTimeF; Prop.shiftEnd.selF=selTimeF;
  Prop.shiftEnd.histCondF=function(name){return "floor((UNIX_TIMESTAMP(v.shiftEnd)-UNIX_TIMESTAMP(now()))/3600)";};
  Prop.shiftEnd.vendorUpdF=updTimeF;

  Str_insertM(site.StrOrderFilt,'vehicleType','shiftEnd');
}
}


//CreatorPlugin.taxi=CreatorPlugin.demo=CreatorPlugin.test=function(){
CreatorPlugin.taxi=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  site.StrPropTaxi=['nPassengers', 'extraSeat', 'childSeat', 'wheelChairPlaces'];
  
  //                           012345678
  var tmpA={
  brand:               {b:'111000111',type:'VARCHAR(20)', default:''}};

  tmpA.brand.feat={kind:'B'};
  var tmpB={
  idDriverGovernment:  {b:'111011110',type:'VARCHAR(65)', default:''},
  nPassengers:         {b:'111010111',type:'SMALLINT(2)',default:4},
  extraSeat:           {b:'111011110',type:'TINYINT', default:0},
  childSeat:           {b:'111011110',type:'TINYINT', default:0},
  wheelChairPlaces:    {b:'111010110',type:'TINYINT', default:0}};
  tmpB.nPassengers.feat={kind:'S11',min:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40],span:1};
  tmpB.extraSeat.feat={kind:'S10',min:[0, 1, 2, 3],span:1};
  tmpB.childSeat.feat={kind:'S10',min:[0, 1, 2, 3],span:1};
  tmpB.wheelChairPlaces.feat={kind:'S10',min:[0, 1, 2, 3],span:1};

  extend(Prop,tmpA); // after,'vehicleType'
  extend(Prop,tmpB);
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));
  array_mergeM(site.StrOrderDB,Object.keys(tmpB));
  Prop.vehicleType.feat.bucket=array_mergeM(Prop.vehicleType.Enum, ['rickshaw', 'limo', 'bus', 'smallBus', 'boat']);
  
  site.StrOrderFilt=array_mergeM(['vehicleType','brand'],site.StrPropTaxi,['homeTown','idTeam','standingByMethod','currency','posTime','shiftEnd'],site.StrPropRep);
}
}


CreatorPlugin.transport=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                           012345678
  var tmpA={
  brand:               {b:'111000111',type:'VARCHAR(20)', default:''},
  payload:             {b:'111010111',type:'INT(4)', default:0}
  };
  tmpA.brand.feat={kind:'B'};
  tmpA.payload.feat={kind:'S11',min:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40]};
  site.StrTransportBool=[
  'generalCargo', 'tailLift', 'loaderCrane', 'tipper', 'loadableFromTheSide', 'iso20', 'iso40', 'tiltBed', 'sideLift', 'rollerContainer', 'otherContainer',
  // 'tankTruck', 'flatbed', 'lowboy', 'loggingTruck', 'automobileTransport', 'livestock', 'vehicleTowing'
  ];
  var tmpB=[];
  for(var i=0;i<site.StrTransportBool.length;i++){
    var name=site.StrTransportBool[i];
    tmpB[name]=          {b:'111011110',type:'BOOL', default:0};
    tmpB[name].feat=          {kind:'BN',span:1};
  }  
  extend(Prop,tmpA); // after,'vehicleType'
  extend(Prop,tmpB);
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));
  array_mergeM(site.StrOrderDB,Object.keys(tmpB));
  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=array_mergeM(['bike', 'moped', 'MC'], Prop.vehicleType.Enum, ['pickup', 'van', 'lorry', 'semiTrailer',  'lorryWTrailer', 'semiTrailerWTrailer', 'boat']);
  //, 'lorryWDollyTrailer', 'semiTrailerWDollyTrailer'

  site.StrOrderFilt=array_mergeM(['vehicleType','brand','payload'],site.StrTransportBool,['homeTown','idTeam','standingByMethod','currency','posTime','shiftEnd'],site.StrPropRep);

}
}



CreatorPlugin.cleaner=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  site.StrCleanerBool=['boHome','boOffice','boIndustrial', 'boGotEquipment'];

  //                          012345678
  var tmpA=[];
  for(var i=0;i<site.StrCleanerBool.length;i++){
    var name=site.StrCleanerBool[i];
    tmpA[name]=         {b:'111011110',type:'BOOL', default:0};
    tmpA[name].feat={kind:'BN',span:1};
  }
  extend(Prop,tmpA); 
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));
  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];

  site.StrOrderFilt=array_mergeM(['homeTown','currency','shiftEnd','idTeam'],site.StrCleanerBool,['vehicleType','posTime'],site.StrPropRep);
}
}
CreatorPlugin.windowcleaner=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  site.StrCleanerBool=['boLadder','boSkyLift'];

  //                          012345678
  var tmpA=[];
  for(var i=0;i<site.StrCleanerBool.length;i++){
    var name=site.StrCleanerBool[i];
    tmpA[name]=         {b:'111011110',type:'BOOL', default:0};
    tmpA[name].feat={kind:'BN',span:1};
  }
  extend(Prop,tmpA); 
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));
  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam'],site.StrCleanerBool,['vehicleType','posTime'],site.StrPropRep);
}
}

CreatorPlugin.lawnmower=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  site.StrToolBool=['pushMower','ridingMower', 'edger'];
  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=['ridingMower', 'foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van'];

  //                           012345678
  var tmpA={
  cuttingWidth:        {b:'111110111',type:'INT(4)', default:0}
  };
  tmpA.cuttingWidth.feat={kind:'S11',min:[0, 10, 20, 30, 40, 50, 60, 80, 100, 120, 140]};

  var tmpB=[];
  for(var i=0;i<site.StrToolBool.length;i++){
    var name=site.StrToolBool[i];
    tmpB[name]=          {b:'111010110',type:'BOOL', default:0};
    tmpB[name].feat={kind:'BN',span:1};
  }
  extend(Prop,tmpA);
  extend(Prop,tmpB);
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));
  array_mergeM(site.StrOrderDB,Object.keys(tmpB));

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam'],site.StrToolBool,['cuttingWidth','vehicleType','posTime'],site.StrPropRep);
}
}

CreatorPlugin.snowremoval=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  site.StrToolBool=['shovel', 'snowblower', 'plow'];
  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=[ 'foot', 'bike', 'moped', 'sedan', 'wagon', 'pickup', 'van', 'lorryOpen', 'ridingMower', 'tractor'];

  //                           012345678
  var tmpA=[];
  for(var i=0;i<site.StrToolBool.length;i++){
    var name=site.StrToolBool[i];
    tmpA[name]=          {b:'111010110',type:'BOOL', default:0};
    tmpA[name].feat={kind:'BN',span:1};
  }
  extend(Prop,tmpA);
  array_mergeM(site.StrOrderDB,Object.keys(tmpA));

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam'],site.StrToolBool,['vehicleType','posTime'],site.StrPropRep);
}
}

CreatorPlugin.hourlyPrice=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                           012345678
  var tmp={
  pricePerHour:        {b:'111010110',type:'DECIMAL(10,0)', default:0}
  };
  extend(Prop,tmp); 
  array_mergeM(site.StrOrderDB,Object.keys(tmp));
}
}

CreatorPlugin.fruitpicker=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;

  Prop.vehicleType.feat.bucket=Prop.vehicleType.Enum=['foot', 'bike', 'moped', 'sedan', 'van'];

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam','vehicleType','posTime'],site.StrPropRep);
}
}

              //  0         1        2       3       4       5       6           7             8   
//$bName=['input','DBSelOne','DBSel','block','label','help','vendorTab','notNull', 'vendorTabIndex'];

CreatorPlugin.programmer=function(){
this.rewriteSite=function(site){
  //eval(extractLocSome('site','Prop'));
  var Prop=site.Prop;
  
  //                           012345678
  var tmpA={
  otherLang:           {b:'111111111',type:'VARCHAR(20)', default:''}
  };
  tmpA.otherLang.feat={kind:'B'};

  site.StrProgrammerLang=['c', 'java', 'php', 'javascript', 'cpp', 'python', 'shell', 'ruby', 'objectiveC', 'cSharp', 'assembly', 'sql', 'perl', 'asp', 'd', 'vb', 'delphi', 'scala', 'actionScript', 'coldFusion', 'lua', 'ada', 'pascal', 'haskell', 'scheme', 'cobol', 'lisp', 'clojure', 'erlang', 'fortran'];  // 30 most popular from http://langpop.com/
  var tmpB=[];
  for(var i=0;i<site.StrProgrammerLang.length;i++){
    var name=site.StrProgrammerLang[i];
    tmpB[name]=          {b:'111010110',type:'INT(4)', default:0};
    tmpB[name].feat={kind:'S10',min:[0, 1, 2, 3, 4, 5],span:1};
  }
  
  extend(Prop,tmpA);
  extend(Prop,tmpB); // after,'pricePerHour'
  Str_insertM(site.StrOrderDB,'pricePerHour',Object.keys(tmpA));
  Str_insertM(site.StrOrderDB,'pricePerHour',Object.keys(tmpB));

  site.StrOrderFilt=array_mergeM(['homeTown','currency','idTeam','posTime'],site.StrPropRep,site.StrProgrammerLang,['otherLang']);
}
}


featCalcValExtend=function(Prop){
  for(var name in Prop){
    var vv=Prop[name];
    if(!('feat' in vv)) continue;
    var v=vv.feat, boBucket='bucket' in v, boMin='min' in v;
    if(boBucket||boMin){  // set n (=length) (if applicable)
      var len;   if(boBucket) len=v.bucket.length; else if(boMin) len=v.min.length; 
      Prop[name].feat.n=len;  Prop[name].feat.last=len-1;
    }
  
    if(v.kind[0]=='S'){
            // Create v.max;  maxClosed
      v.max=[]; var maxClosed=[];
      var jlast=v.last;    
      for(var j=0;j<jlast;j++){ 
        var tmp=v.min[j+1]; v.max[j]=tmp; maxClosed[j]=tmp-1;
      }
      v.max[jlast]=intMax; maxClosed[jlast]=intMax;

            // Create minName/maxName (labels in 'sel0') and  v.maxName (labels in 'sel1') 
      v.minName=[].concat(v.min);
      v.maxName=[].concat(maxClosed);  v.maxName[v.last]="&infin;";

      v.bucketLabel=[].concat(v.min);       v.bucketLabel[v.last]='&ge;'+v.bucketLabel[v.last];  // (labels in histogram)

      Prop[name].feat=v;
    }
  }
}

/***************************************************************************
 * SiteExtend
 ***************************************************************************/

siteCalcValExtend=function(site,siteName){ // Adding stuff that can be calculated from the other properties
  var Prop=site.Prop;
  site.KeyCol=Object.keys(Prop);   site.nCol=site.KeyCol.length;   site.colsFlip=array_flip(site.KeyCol);
  site.KeySel=calcKeySel(Prop,site.KeyCol);

  //site.StrOrderFiltFlip=array_flip(site.StrOrderFilt);

  featCalcValExtend(Prop); 
  
  site.TableName={};   for(var name in TableNameProt){  site.TableName[name+"Tab"]=siteName+'_'+name; }
  site.ViewName={}; for(var name in ViewNameProt){  site.ViewName[name+"View"]=siteName+'_'+name; }

  var arrAllowed=[];for(var name in Prop ){ var arr=Prop[name]; if(Number(arr.b[bFlip.input])) arrAllowed.push(name);} site.arrAllowed=arrAllowed;
  extend(site, {boGotNewVendors:0, timerNUserLast:0, nVis:0, nUser:0}); 
  //site.db=siteName in DB?siteName:'default';
  //var db=siteName in DB?DB[siteName]:DB.default;  site.pool=db.pool;
}

StrPlugInAll=Object.keys(CreatorPlugin);

createPlugins=function(){
  PlugIn={};  for(var name in CreatorPlugin){ PlugIn[name]=new CreatorPlugin[name]();   }  
}

SiteExtend=function(){
  /*
  Site.getSite=function(domainName){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   if(Site[siteName].testDomain(domainName)) return siteName;
    }
    return false;
  }
  */
  Site.getSite=function(wwwReq){
    for(var i=0;i<SiteName.length;i++){
      var siteName=SiteName[i];   var tmp; if(tmp=Site[siteName].testWWW(wwwReq)) {return {siteName:siteName, wwwSite:tmp};  }
    }
    return {siteName:null};
  }
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i], StrPlugIn=[];
    //var tmp={siteName:siteName, Prop:{}, Cond0F:{}, Cond1F:{}, SelOneF:{}, SelF:{}, HistCondF:{}, VendorUpdF:{}, Enum:{}};
    var tmp={siteName:siteName, Prop:{}};
    var site=extend(Site[siteName],tmp);
    if(['taxi', 'transport'].indexOf(siteName)!=-1) { // , 'demo', 'test'
      StrPlugIn=['general','transportProt','transportPrice','transportUrgent','night',siteName];   //if(['demo', 'test'].indexOf(siteName)!=-1) StrPlugIn.splice(5,0,'taxi');
    }
    else if(siteName=='cleaner') StrPlugIn=['general','transportProt','transportPrice','night',siteName];
    else if(siteName=='windowcleaner') StrPlugIn=['general','transportProt','transportPrice',siteName];
    else if(siteName=='fruitpicker') StrPlugIn=['general','transportProt','hourlyPrice',siteName];
    else if(siteName=='lawnmower') StrPlugIn=['general','transportProt','transportPrice',siteName];
    else if(siteName=='snowremoval') StrPlugIn=['general','transportProt','transportPrice',siteName];
    else if(siteName=='programmer') StrPlugIn=['general','hourlyPrice',siteName];
    else StrPlugIn=['general'];
    console.log(siteName+': '+StrPlugIn.join(', '));
    for(var j=0;j<StrPlugIn.length;j++){  var nameT=StrPlugIn[j];  PlugIn[nameT].rewriteSite(site);  }
    siteCalcValExtend(site,siteName);
    site.StrPlugIn=StrPlugIn;

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


