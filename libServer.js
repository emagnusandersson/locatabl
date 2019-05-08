


"use strict"


// At lat=0 (y=128), a world coordinate unit will be wc2m meters
// At lat=arccos(0.5), (lat=+-60 or y=128+-53.66), a world coordinate unit will be wc2m/2 meters
// At lat=arccos(0.25), (lat=+-75.52 or y=128+-84.08), a world coordinate unit will be wc2m/4 meters
app.roundXY=function(resM,x,y,lat){
  var resWC=resM2resWC(resM,lat);
  var xA=Math.round(x/resWC)*resWC,  yA=Math.round(y/resWC)*resWC;  return [xA,yA];
}



//var text=fs.readFileSync(strFileName, 'utf8');

app.SplitterPlugIn=function(){
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
      //var buf=new Buffer(Buf[i],'utf8');
      var buf=Buffer.from(Buf[i],'utf8');
      var [err]=yield *CacheUri.set(flow, uriT, buf, 'js', true, true); if(err) return [err];
    }
    return [null];
  }
}

app.SplitterPlugIn=function(){
  //var regA=RegExp("\n(CreatorPlugin\\.(\\w+)[\\s\\S]*?)//0123456789abcdef",'g');
  //var regB=RegExp("\n//0123456789abcdef client\\.js([\\s\\S]*?)$",'g');
  var regA=RegExp("\n//0123456789abcdef ([a-zA-Z0-9_]+\\.js)([\\s\\S]*?)//0123456789abcdef\\b",'g');
  var goSplit=function*(flow, strFileName){
    var StrFile=[], Buf=[];
    var text, err=null;
    fs.readFile(strFileName, 'utf8', function(errT, bufT) { err=errT; text=bufT; flow.next(); });  yield;
    if(err) return [err];
    text.replace(regA,function(m,n,o){
      StrFile.push(n);  Buf.push(o);   //obj[o]=n;
    });
    return [err, {StrFile:StrFile, Buf:Buf}];
  }
  
  this.readFileToCacheClientJs=function*(flow){ // Separate readFileToCache for client.js
    var [err, tmpObj]= yield *goSplit(flow, 'client.js'); if(err) return [err];
    var StrFile=tmpObj.StrFile, Buf=tmpObj.Buf;
    for(var i=0;i<StrFile.length;i++){ 
      var uriT='/'+lcfirst(StrFile[i]); 
      //var buf=new Buffer(Buf[i],'utf8');
      var buf=Buffer.from(Buf[i],'utf8');
      var [err]=yield *CacheUri.set(flow, uriT, buf, 'js', true, true); if(err) return [err];
    }
    return [null];
  }
}
     

app.createSiteSpecificClientJSAll=function*(flow) {
  for(var i=0;i<SiteName.length;i++){
    var siteName=SiteName[i];
    var buf=createSiteSpecificClientJS(siteName);
    var keyCache=siteName+'/'+leafSiteSpecific;
    var [err]=yield *CacheUri.set(flow, keyCache, buf, 'js', true, true);
  }
}

app.createSiteSpecificClientJS=function(siteName) {
  var site=Site[siteName], wwwSite=site.wwwSite; 

  var StrSimplified=["wwwSite", "strRootDomain", "ORole", "siteName", "StrPropE", "StrTransportBool", "KeySel", "StrPlugInNArg", "testWWW", "client_id", "wwwLoginRet", "wwwLoginScope"]; 
  var siteSimplified={}; for(var i=0;i<StrSimplified.length;i++){ var name=StrSimplified[i]; siteSimplified[name]=site[name]; }


  var Str=[];
  Str.push("assignSiteSpecific=function(){");
  
  var StrVar=['boDbg', 'urlPayPal', 'storedButt', 'version', 'intMax', 'uintMax', 'arrLang', 'snoreLim', 'leafBE', 'leafUploadFront', 'flImageFolder', 'boShowTeam', 'maxList', 'lenHistActive', 'maxGroupsInFeat', 'specialistDefault', 'arrCoordinatePrecisionM', 'wwwCommon', 'siteName', 'strIPPrim', 'strIPAlt' ];
  var objOut=copySome({},app,StrVar);
  //copySome(objOut,site,['wwwSite']);
  objOut.site=siteSimplified;

  Str.push(`var tmp=`+serialize(objOut)+`;\n extend(window, tmp);`);

  Str.push("}");




  var str=Str.join('\n');
  return str;
}


