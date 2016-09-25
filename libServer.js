


// At lat=0 (y=128), a world coordinate unit will be p2m meters
// At lat=arccos(0.5), (lat=+-60 or y=128+-53.66), a world coordinate unit will be p2m/2 meters
// At lat=arccos(0.25), (lat=+-75.52 or y=128+-84.08), a world coordinate unit will be p2m/4 meters
roundXY=function(resM,x,y){
  var resT=resM;
  if(Math.abs(y-128)>53.66) resT=Math.round(resT/2);
  if(Math.abs(y-128)>84.08) resT=Math.round(resT/2);
  if(resT<1)resT=1;
  var resP=resT*m2p;
  var xA=Math.round(x/resP)*resP,  yA=Math.round(y/resP)*resP;  return [xA,yA];
}


runIdIP=function(){ //check  idIP against the vendor-table and return diverse data
"use strict"
  var site=this.site, siteName=site.siteName; 
  
  var StrRole, callback, StrRoleAll=['vendor','team','marketer','admin','reporter'];
  if(arguments.length==2){StrRole=arguments[0]; callback=arguments[1];}
  else if(arguments.length==1) {StrRole=StrRoleAll; callback=arguments[0];}
  StrRole=StrRole||StrRoleAll;   if(typeof StrRole=='string') StrRole=[StrRole];

  var userInfoFrDBUpd={};
  
  var tmp=this.sessionMain.userInfoFrIP; 
  var BoTest={};
  for(var i=0;i<StrRoleAll.length;i++) { var strRole=StrRoleAll[i]; BoTest[strRole]=StrRole.indexOf(strRole)!=-1; }
  var Sql=[], Val=[tmp.IP, tmp.idIP, BoTest.vendor, BoTest.team, BoTest.marketer, BoTest.admin, BoTest.reporter];
  Sql.push("CALL "+siteName+"GetUserInfo(?, ?, ?, ?, ?, ?, ?, @OboOk, @Omess);");
  var sql=Sql.join('\n');
  
  myQueryF(sql, Val, this.pool, function(err, results) {
    if(err) {callback(err);}
    else{
      var res=results[0], c=res.length; 
      if(c==1) {
        var userInfoFrDBGen=res[0];
        var res=results[1], c=res.length; if(BoTest.vendor) userInfoFrDBUpd.vendor=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.vendor=='object') extend(userInfoFrDBUpd.vendor,userInfoFrDBU);
        var res=results[2]; if(BoTest.vendor && res.length && 'n' in res[0]  &&  typeof userInfoFrDBUpd.vendor=='object') userInfoFrDBUpd.vendor.nPayment=res[0].n;  
        var res=results[3], c=res.length; if(BoTest.team) userInfoFrDBUpd.team=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.team=='object') extend(userInfoFrDBUpd.team,userInfoFrDBU);
        var res=results[4], c=res.length; if(BoTest.marketer) userInfoFrDBUpd.marketer=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.marketer=='object') extend(userInfoFrDBUpd.marketer,userInfoFrDBU); 
        var res=results[5], c=res.length; if(BoTest.admin) userInfoFrDBUpd.admin=c==1?res[0]:null; //if(typeof userInfoFrDBUpd.admin=='object') extend(userInfoFrDBUpd.admin,userInfoFrDBU);
        var res=results[6]; if(BoTest.reporter ) {   var  c=res[0].n;  userInfoFrDBUpd.reporter=c?{idUser:userInfoFrDBGen.idUser, c:c}:null;    }
      } else extend(userInfoFrDBUpd, specialistDefault);
      callback(null, userInfoFrDBUpd); 
    }
  });
}


//var text=fs.readFileSync(strFileName, 'utf8');

SplitterPlugIn=function(){
  var regA=RegExp("\n(CreatorPlugin\\.(\\w+)[\\s\\S]*?)//0123456789abcdef",'g');
  var regB=RegExp("\n//0123456789abcdef client\\.js([\\s\\S]*?)$",'g');
  this.goSplit=function(strFileName){
    var StrFile=[], Buf=[];
    var text, err=null, fiber=Fiber.current;
    fs.readFile(strFileName, 'utf8', function(errT, bufT) { //, this.encRead
      if(errT){  err=errT; }
      text=bufT;
      fiber.run();
    });
    Fiber.yield();
    if(!err) {    
      text.replace(regA,function(m,n,o){
        var tmp=ucfirst(o);
        StrFile.push('plugin'+tmp+'.js');  Buf.push(n);   //obj[o]=n;
      }); 
      text.replace(regB,function(m,n,o){
        StrFile.push('client.js');  Buf.push(n);   //obj.client=n;
      }); 
      return [err, {StrFile:StrFile, Buf:Buf}];
    }
    else return [err];
  }

    //
    // modifiy readFileToCache
    //
  readFileToCache=(function(){
    var tmpf=readFileToCache;
    return function(strFileName){
      if(strFileName=='client.js'){ 
        var tmp=splitterPlugIn.goSplit('client.js'), err=tmp[0];
        if(!err) {
          var tmp=tmp[1], StrFile=tmp.StrFile, Buf=tmp.Buf;
          for(var i=0;i<StrFile.length;i++){ 
            var tmp=lcfirst(StrFile[i]);
            var uriT='/'+tmp; 
            var buf=new Buffer(Buf[i],'utf8');
            CacheUri.set(uriT, buf, 'js', true, true);
          }
        } 
        return err;
      } else {    var tmp=tmpf.apply(this, arguments); return tmp;     }
    };
  })();

}



createSiteSpecificClientJSAll=function() {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    CacheUri.set(keyCache, buf, 'js', true, true);
  }

}

createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite;  

  var StrSkip=['KeyCol', 'nCol', 'colsFlip', 'StrOrderDB', 'TableName', 'ViewName', 'arrAllowed',  'boGotNewVendors', 'timerNUserLast', 'nVis', 'nUser', 'db', 'googleAnalyticsTrackingID','serv'];
  var siteSkip={}; for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; siteSkip[name]=site[name]; delete site[name];}

  var Str=[];
  Str.push("assignSiteSpecific=function(){\n\
\n\
boDbg="+JSON.stringify(boDbg)+";\n\
urlPayPal="+JSON.stringify(urlPayPal)+";\n\
storedButt="+JSON.stringify(storedButt)+";\n\
\n\
version="+JSON.stringify(version)+";\n\
intMax="+JSON.stringify(intMax)+";\n\
arrLang="+JSON.stringify(arrLang)+";\n\
snoreLim="+JSON.stringify(snoreLim)+";\n\
leafBE="+JSON.stringify(leafBE)+";\n\
leafUploadFront="+JSON.stringify(leafUploadFront)+";\n\
flImageFolder="+JSON.stringify(flImageFolder)+";\n\
boShowTeam="+JSON.stringify(boShowTeam)+";\n\
maxVendor="+JSON.stringify(maxVendor)+";\n\
lenHistActive="+JSON.stringify(lenHistActive)+";\n\
rebateCodeLen="+JSON.stringify(rebateCodeLen)+";\n\
maxGroupsInFeat="+JSON.stringify(maxGroupsInFeat)+";\n\
bFlip="+JSON.stringify(bFlip)+";\n\
specialistDefault="+JSON.stringify(specialistDefault)+";\n\
arrCoordinatePrecisionM="+JSON.stringify(arrCoordinatePrecisionM)+";\n\
\n\
wwwSite="+JSON.stringify(wwwSite)+";\n\
wwwCommon="+JSON.stringify(wwwCommon)+";\n\
\n\
siteName="+JSON.stringify(siteName)+";\n\
site="+JSON.stringify(site)+";\n\
strIPPrim="+JSON.stringify(strIPPrim)+";\n\
strIPAlt="+JSON.stringify(strIPAlt)+";\n\
\n\
}");


  for(var i=0;i<StrSkip.length;i++){ var name=StrSkip[i]; site[name]=siteSkip[name]; }

  var str=Str.join('\n');
  return str;
}


