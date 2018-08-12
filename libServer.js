


 
// At lat=0 (y=128), a world coordinate unit will be wc2m meters
// At lat=arccos(0.5), (lat=+-60 or y=128+-53.66), a world coordinate unit will be wc2m/2 meters
// At lat=arccos(0.25), (lat=+-75.52 or y=128+-84.08), a world coordinate unit will be wc2m/4 meters
roundXY=function(resM,x,y,lat){
  var resWC=resM2resWC(resM,lat);
  var xA=Math.round(x/resWC)*resWC,  yA=Math.round(y/resWC)*resWC;  return [xA,yA];
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
  
  this.readFileToCacheClientJs=function*(flow){ // Separate readFileToCache for client.js
    var [err, tmpObj]= yield *goSplit(flow, 'client.js'); if(err) return [err];
    var StrFile=tmpObj.StrFile, Buf=tmpObj.Buf;
    for(var i=0;i<StrFile.length;i++){ 
      var uriT='/'+lcfirst(StrFile[i]); 
      var buf=new Buffer(Buf[i],'utf8');
      var [err]=yield *CacheUri.set(flow, uriT, buf, 'js', true, true); if(err) return [err];
    }
    return [null];
  }
}

     

createSiteSpecificClientJSAll=function*(flow) {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=yield *CacheUri.set(flow, keyCache, buf, 'js', true, true);
  }

}

createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite; 

  var StrSimplified=["wwwSite", "strRootDomain", "ORole", "siteName", "StrPropE", "StrTransportBool", "KeySel", "StrPlugInNArg", "testWWW", "client_id", "wwwLoginRet", "wwwLoginScope"]; 
  var siteSimplified={}; for(var i=0;i<StrSimplified.length;i++){ var name=StrSimplified[i]; siteSimplified[name]=site[name]; }


  var Str=[];
  Str.push("assignSiteSpecific=function(){\n\
\n\
boDbg="+JSON.stringify(boDbg)+";\n\
urlPayPal="+JSON.stringify(urlPayPal)+";\n\
storedButt="+JSON.stringify(storedButt)+";\n\
\n\
version="+JSON.stringify(version)+";\n\
intMax="+JSON.stringify(intMax)+";\n\
uintMax="+JSON.stringify(uintMax)+";\n\
arrLang="+JSON.stringify(arrLang)+";\n\
snoreLim="+JSON.stringify(snoreLim)+";\n\
leafBE="+JSON.stringify(leafBE)+";\n\
leafUploadFront="+JSON.stringify(leafUploadFront)+";\n\
flImageFolder="+JSON.stringify(flImageFolder)+";\n\
boShowTeam="+JSON.stringify(boShowTeam)+";\n\
maxList="+JSON.stringify(maxList)+";\n\
lenHistActive="+JSON.stringify(lenHistActive)+";\n\
maxGroupsInFeat="+JSON.stringify(maxGroupsInFeat)+";\n\
specialistDefault="+JSON.stringify(specialistDefault)+";\n\
arrCoordinatePrecisionM="+JSON.stringify(arrCoordinatePrecisionM)+";\n\
\n\
wwwSite="+JSON.stringify(wwwSite)+";\n\
wwwCommon="+JSON.stringify(wwwCommon)+";\n\
\n\
siteName="+JSON.stringify(siteName)+";\n\
site="+JSON.stringify(siteSimplified)+";\n\
strIPPrim="+JSON.stringify(strIPPrim)+";\n\
strIPAlt="+JSON.stringify(strIPAlt)+";\n\
\n\
}");

  var str=Str.join('\n');
  return str;
}


