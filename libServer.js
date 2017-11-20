


// At lat=0 (y=128), a world coordinate unit will be p2m meters
// At lat=arccos(0.5), (lat=+-60 or y=128+-53.66), a world coordinate unit will be p2m/2 meters
// At lat=arccos(0.25), (lat=+-75.52 or y=128+-84.08), a world coordinate unit will be p2m/4 meters
roundXY=function(resM,x,y){  // The higher resM  the more the position will be rounded
  var resT=resM;
  if(Math.abs(y-128)>53.66) resT=Math.round(resT/2);
  if(Math.abs(y-128)>84.08) resT=Math.round(resT/2);
  if(resT<1)resT=1;
  var resP=resT*m2p;
  var xA=Math.round(x/resP)*resP,  yA=Math.round(y/resP)*resP;  return [xA,yA];
}



//var text=fs.readFileSync(strFileName, 'utf8');

SplitterPlugIn=function(){
  var regA=RegExp("\n(CreatorPlugin\\.(\\w+)[\\s\\S]*?)//0123456789abcdef",'g');
  var regB=RegExp("\n//0123456789abcdef client\\.js([\\s\\S]*?)$",'g');
  var goSplit=function*(flow, strFileName){
    var StrFile=[], Buf=[];
    var text, err=null;
    fs.readFile(strFileName, 'utf8', function(errT, bufT) { err=errT; text=bufT; flow.next(); });  yield;
    if(err) return [err];
    text.replace(regA,function(m,n,o){
      var tmp=ucfirst(o);
      StrFile.push('plugin'+tmp+'.js');  Buf.push(n);   //obj[o]=n;
    }); 
    text.replace(regB,function(m,n,o){
      StrFile.push('client.js');  Buf.push(n);   //obj.client=n;
    }); 
    return [err, {StrFile:StrFile, Buf:Buf}];
  }

    //
    // modifiy readFileToCache
    //
  readFileToCache=(function(){
    var tmpgen=readFileToCache;
    return function*(flow, strFileName){
      if(strFileName=='client.js'){ 
        var [err, tmpObj]= yield *goSplit(flow, strFileName);
        if(!err) {
          var StrFile=tmpObj.StrFile, Buf=tmpObj.Buf;
          for(var i=0;i<StrFile.length;i++){ 
            var uriT='/'+lcfirst(StrFile[i]); 
            var buf=new Buffer(Buf[i],'utf8');
            yield *CacheUri.set(flow, uriT, buf, 'js', true, true);
          }
        } 
        return err;
      } else {    var tmp=yield *tmpgen(flow, strFileName); return tmp;     }
    };
  })();

}



createSiteSpecificClientJSAll=function*(flow) {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    yield *CacheUri.set(flow, keyCache, buf, 'js', true, true);
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


