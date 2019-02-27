
boBrowser=(typeof window != 'undefined' && window.document);



filterPropKeyByB=function(Prop, iBit){ // Check all Prop[strKey].b[iBit] for each strKey. Create an array with all strKey where Prop[strKey].b[iBit] is true.
  var KeyAll=Object.keys(Prop)
  var KeySel=[];  for(var i=0;i<KeyAll.length;i++) { var key=KeyAll[i], b=Prop[key].b;   if(Number(b[iBit])) KeySel.push(key);  }
  return KeySel;
}

//
// String
//

ucfirst=function(string){  return string.charAt(0).toUpperCase() + string.slice(1);  }
lcfirst=function(string){  return string.charAt(0).toLowerCase() + string.slice(1);  }
isAlpha=function(star){  var regEx = /^[a-zA-Z0-9]+$/;  return str.match(regEx); } 
//String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g,"");}
if(!String.format){
  String.format = function(format){
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number){ 
      return typeof args[number]!='undefined' ? args[number]:match;
    });
  };
}

ltrim=function(str,charlist){
  if(charlist === undefined) charlist = "\\s";
  return str.replace(new RegExp("^[" + charlist + "]+"), "");
};
rtrim=function(str,charlist){
  if (charlist === undefined) charlist = "\\s";
  return str.replace(new RegExp("[" + charlist + "]+$"), "");
};

//pad2=function(n){ return ('0'+n).slice(-2);}
pad2=function(n){return (n<10?'0':'')+n;}


myParser=function(strText,obj){
  var StrKey=Object.keys(obj);
  for(var i=0;i<StrKey.length;i++){
    var strKey=StrKey[i];
    var regKey=new RegExp('\\$'+strKey, 'g');
    strText.replace(regKey, obj[strKey]);
  }
  return strText;
}

//
// Array
//

arr_max=function(arr){return Math.max.apply(null, arr);}
arr_min=function(arr){return Math.min.apply(null, arr);}
indexOfMax=function(arr) {
  if (arr.length===0) return -1;
  var valBest=arr[0], iBest=0;      for (var i=1; i<arr.length; i++) {      if(arr[i]>valBest) { iBest=i; valBest=arr[i]; }         }
  return iBest;
}
indexOfMin=function(arr) {
  if (arr.length===0) return -1;
  var valBest=arr[0], iBest=0;      for (var i=1; i<arr.length; i++) {      if(arr[i]<valBest) { iBest=i; valBest=arr[i]; }         }
  return iBest;
}

arrArrange=function(arrV,arrI){
  var n=arrI.length, arrNew;
  if(typeof arrV=='string') arrNew=''; else arrNew=Array(n);
  //for(var i=0;i<arrI.length;i++){    arrNew.push(arrV[arrI[i]]);    }
  for(var i=0;i<arrI.length;i++){    arrNew[i]=arrV[arrI[i]];    }
  return arrNew;
}

//intersectionAB=function(A,B){return A.filter(function(ai){return B.indexOf(ai)!=-1;});}  // Loop through A; remove ai that is not in B
//AmB=function(A,B){return A.filter(function(ai){return B.indexOf(ai)==-1;});}  // Loop through A; remove ai that is in B
intersectionAB=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) A.splice(i,1); else Rem.push(a);} return Rem.reverse();}  // Changes A, returns the remainder
AMinusB=function(A,B){var ANew=[]; for(var i=0;i<A.length;i++){var a=A[i]; if(B.indexOf(a)==-1) ANew.push(a);} return ANew;}  // Does not change A, returns ANew
AMMinusB=function(A,B){var Rem=[]; for(var i=A.length-1;i>=0;i--){var a=A[i]; if(B.indexOf(a)==-1) Rem.push(a); else A.splice(i,1);} return Rem.reverse();}  // Changes A, returns the remainder
myIntersect=function(A,B){var arrY=[],arrN=[]; for(var i=0; i<A.length; i++){var a=A[i]; if(B.indexOf(a)==-1) arrN.push(a); else arrY.push(a);} return [arrY,arrN];}  
intersectBool=function(A,B){for(var i=0; i<A.length; i++){if(B.indexOf(A[i])!=-1) return true;} return false;}  //  If any 'a' within B
isAWithinB=function(A,B){ for(var i=0; i<A.length; i++){if(B.indexOf(A[i])==-1) return false;} return true;}  
AMUnionB=function(A,B){ // Modifies A
  for(var i=0;i<B.length;i++) { var b=B[i]; if(A.indexOf(b)==-1) A.push(b); return A; } 
}

mySplice1=function(arr,iItem){ var item=arr[iItem]; for(var i=iItem, len=arr.length-1; i<len; i++)  arr[i]=arr[i+1];  arr.length = len; return item; }  // GC-friendly splice
myCopy=function(arr,brr){ var len=brr.length; if(typeof arr=="undefined") arr=Array(len); else arr.length = len; for(var i=0; i<len; i++)  arr[i]=brr[i];   return arr; }  // GC-friendly copy
//myCopy=function(arr,brr){  if(typeof arr=="undefined") arr=[]; arr.length=0; arr.push.apply(arr,brr);  }  // GC-friendly copy
myCompare=function(arr,brr){  var la=arr.length,lb=brr.length; if(la!=lb) return false; for(var i=0; i<la; i++)  if(arr[i]!=brr[i]) return false;  return true;}  // compare
  

addIndexColumn=function(M){    var Mt=Array();     for(var i=0;i<M.length;i++){  var tmp=[(i+1).toString()];   Mt[i]=tmp.concat(M[i]);  }       return Mt;      }
arrCopy=function(A){return [].concat(A);}

arrarrCopy=function(B){var A=[]; for(var i=0;i<B.length;i++){ A[i]=[].concat(B[i]);} return A; }

array_removeInd=function(a,i){a.splice(i,1);}
array_removeVal1=function(a,v){var i=a.indexOf(v); if(i!=-1) a.splice(i,1);}
//array_removeVal=function(a,v){ while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}}
//array_removeVal=function(a){
  //var t=[], b=t.slice.call(arguments, 1), Val=t.concat.apply([],b);
  //for(var j=0;j<Val.length;j++){var v=Val[j]; while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}  }
//} 
array_removeVal=function(a, ...Val){
  //for(var j=0;j<Val.length;j++){var v=Val[j]; while(1) {var i=a.indexOf(v); if(i!=-1) a.splice(i,1);else break;}  }
  var j=0;
  while(j<Val.length){
    var v=Val[j]; j++;
    if(v instanceof Array) Val=Val.push(v);
    else {
      while(1) {
        var i=a.indexOf(v);   if(i!=-1) a.splice(i,1);else break;
      }
    }
  }
}

array_splice=function(arr,st,len,arrIns){
  [].splice.apply(arr, [st,len].concat(arrIns));
}
array_merge=function(){  return Array.prototype.concat.apply([],arguments);  } // Does not modify origin
//array_mergeM=function(a,b){  a.push.apply(a,b); return a; } // Modifies origin (first argument)
array_mergeM=function(){var t=[], a=arguments[0], b=t.slice.call(arguments, 1), c=t.concat.apply([],b); t.push.apply(a,c); return a; } // Modifies origin (first argument)

array_flip=function(A){ var B={}; for(var i=0;i<A.length;i++){B[A[i]]=i;} return B;}
array_fill=function(n, val){ return Array.apply(null, new Array(n)).map(String.prototype.valueOf,val); }

is_array=function(a){return a instanceof Array;}
in_array=function(needle,haystack){ return haystack.indexOf(needle)!=-1;}
array_filter=function(A,f){f=f||function(a){return a;}; return A.filter(f);}


range=function(min,max,step){ var n=(max-min)/step; return Array.apply(null, Array(n)).map(function(trash, i){return min+i*step;}); }

eliminateDuplicates=function(arr){
  var i, len=arr.length, out=[], obj={};
  for (i=0;i<len;i++){ obj[arr[i]]=0; }
  for (i in obj){ out.push(i); }
  return out;
}
arrValMerge=function(arr,val){  var indOf=arr.indexOf(val); if(indOf==-1) arr.push(val); }
//arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) arr.splice(indOf,1); }
arrValRemove=function(arr,val){  var indOf=arr.indexOf(val); if(indOf!=-1) mySplice1(arr,indOf); }

var stepN=function(start,n,step){ if(typeof step=='undefined') step=1;  var arr=Array(n),ii=start; for(var i=0;i<n;i++){ arr[i]=ii;ii+=step;} return arr; }


//
// Str (Array of Strings)
//

StrComp=function(A,B){var lA=A.length; if(lA!==B.length) return false; for(var i=0;i<lA;i++){ if(A[i]!==B[i]) return false;} return true;}
Str_insertM=function(arr,strRefVal,arrIns,boBefore=0){
  var i=arr.indexOf(strRefVal); if(i==-1) throw 'bla';  if(boBefore==0) i++; 
  if(!(arrIns instanceof Array)) arrIns=[arrIns];
  array_splice(arr, i, 0, arrIns);
}
Str_insertMObj=function(arr,inp){
  if(inp.after) {var i=arr.indexOf(inp.after); if(i==-1) throw 'bla';  i++; }
  else if(inp.before) {var i=arr.indexOf(inp.before); if(i==-1) throw 'bla';}
  var arrIns=inp.ins;
  if(!(arrIns instanceof Array)) arrIns=[arrIns];
  array_splice(arr, i, 0, arrIns);
}
Str_moveM=function(arr,strRefVal,arrMove,boBefore){
  if(!(arrMove instanceof Array)) arrMove=[arrMove];
  removeBFrA(arr,arrMove);
  Str_insertM(arr,strRefVal,arrMove,boBefore);
  //return arrRem;
}
Str_addUnique=function(arr,str){ if(arr.indexOf(str)==-1) arr.push(str); return arr; } // Add if str does not exist in arr else do nothing
Str_changeOne=function(arr,strO,strN){ var ind=arr.indexOf(strO); if(ind==-1) arr.push(strN); else arr[ind]=strN; return arr; } // Change strO to strN.

//
// Object
//

copySome=function(a,b,Str){for(var i=0;i<Str.length;i++) { var name=Str[i]; a[name]=b[name]; } return a; }
object_values=function(obj){
  var arr=[];      for(var name in obj) arr.push(obj[name]);
  return arr;
}
copy=function(o, isdeep){
    if (o===undefined || o===null || ['string', 'number', 'boolean'].indexOf(typeof o)!==-1)
        return o;
    var n= o instanceof Array? [] :{};
    for (var k in o)
        if (o.hasOwnProperty(k))
            n[k]= isdeep? copy(o[k], isdeep) : o[k];
    return n;
}
removeProp=function(obj, arrProp){
  if(typeof arrProp=='string') arrProp=[arrProp];
  for(var i=0;i<arrProp.length;i++)  delete obj[arrProp[i]];
}

var copyDeep=function(objI) { return JSON.parse(JSON.stringify(objI));};

/*JSON.myParse=function(str){
    try{
        return [null, JSON.parse(str)];
    }catch(err){
        return [err, undefined];
    }
}*/
isEmpty=function(v){ 
  if(typeof v=='undefined') return true;
  if(typeof v=='number') return v==0;
  if(typeof v=='string') return v.length==0;
  if(typeof v=='object') {
    if(v===null) return true;
    if(v instanceof Array) return v.length==0;
    return Object.keys(v).length==0;
  }
}
isSet=function(v){ return !isEmpty(v); }


//
// Misc
//
parseQS=function(str){
  var params = {},      regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(str)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
}
/////////////////////////////////////////////////////////////////////



//extractLoc=function(obj,strObjName){   // Ex: eval(extractLoc(objMy,'objMy'));
  //var Str=[];  for(var key in obj) Str.push(key+'='+strObjName+'.'+key);
  //var str=''; if(Str.length) str='var '+Str.join(', ')+';';  return str;
//}
//extract=function(obj){  for(var key in obj){  window[key]=obj[key];  }  }
//extract=function(obj,par){
  //if(typeof par=='undefined') par=app; for(var key in obj){
    //par[key]=obj[key];
  //}
//}
//extractLocSome=function(strObjName,arrSome){  // Ex: eval(extractLocSome('objMy',['a','b']));
  //if(typeof arrSome=='string') arrSome=[arrSome];
  //var len=arrSome.length, Str=Array(len);  for(var i=0;i<len;i++) { var key=arrSome[i]; Str[i]=key+'='+strObjName+'.'+key; }
  //return 'var '+Str.join(', ')+';';
//}

//
// Data Formatting
//

arrObj2TabNStrCol=function(arrObj){ //  Ex: [{abc:0,def:1},{abc:2,def:3}] => {tab:[[0,1],[2,3]],StrCol:['abc','def']}
    // Note! empty arrObj returns {tab:[]}
  var Ou={tab:[]}, lenI=arrObj.length, StrCol=[]; if(!lenI) return Ou;
  StrCol=Object.keys(arrObj[0]);  var lenJ=StrCol.length;
  for(var i=0;i<lenI;i++) {
    var row=arrObj[i], rowN=Array(lenJ);
    for(var j=0;j<lenJ;j++){ var key=StrCol[j]; rowN[j]=row[key]; }
    Ou.tab.push(rowN);
  }
  Ou.StrCol=StrCol;
  return Ou;
}
tabNStrCol2ArrObj=function(tabNStrCol){  //Ex: {tab:[[0,1],[2,3]],StrCol:['abc','def']}    =>    [{abc:0,def:1},{abc:2,def:3}] 
    // Note! An "empty" input should look like this:  {tab:[]}
  var tab=tabNStrCol.tab, StrCol=tabNStrCol.StrCol, arrObj=Array(tab.length);
  for(var i=0;i<tab.length;i++){
    var row={};
    for(var j=0;j<StrCol.length;j++){  var key=StrCol[j]; row[key]=tab[i][j];  }
    arrObj[i]=row;
  }
  return arrObj;
}

print_r=function(o,boHTML){
  var tmp=JSON.stringify(o,null,'\t');
  if(typeof(boHTML) !='undefined' && boHTML) tmp=tmp.replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;'); return tmp;
}






//
// Dates and time
//

Date.prototype.toUnix=function(){return Math.round(this.valueOf()/1000);}
Date.prototype.toISOStringMy=function(){return this.toISOString().substr(0,19);}
swedDate=function(tmp){ if(tmp){tmp=UTC2JS(tmp);  tmp=tmp.getFullYear()+'-'+pad2(tmp.getMonth()+1)+'-'+pad2(tmp.getDate());}  return tmp;}
UTC2JS=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);  return tmp;  }
UTC2Readable=function(utcTime){ var tmp=new Date(Number(utcTime)*1000);   return tmp.toLocaleString();  }
//myISODATE=function(d){ return d.toISOString().substr(0,19);}
//unixNowMS=function(){var tmp=new Date(); return Number(tmp);}
//unixNow=function(){return Math.round(unixNowMS()/1000);}
unixNow=function(){return (new Date()).toUnix();}

getSuitableTimeUnit=function(t){ // t in seconds
  var tabs=Math.abs(t), tsign=t>=0?+1:-1;
  if(tabs<=90) return [tsign*tabs,'s'];
  tabs/=60; // t in minutes
  if(tabs<=90) return [tsign*tabs,'m']; 
  tabs/=60; // t in hours
  if(tabs<=36) return [tsign*tabs,'h'];
  tabs/=24; // t in days
  if(tabs<=2*365) return [tsign*tabs,'d'];
  tabs/=365; // t in years
  return [tsign*tabs,'y'];
}


UTC2ReadableDiff=function(tdiff,boLong=0,boArr=0){
  //var tmp;  tmp=approxTimeDuration(tdiff,boLong,boArr);
  var [ttmp,indA]=getSuitableTimeUnit(tdiff), n=Math.round(ttmp);
  if(indA=='m') indA='min';
  var j1=0, j2=1; if(boLong==1){j1=2; j2=3;}
  var unit=langHtml.timeUnit, units=unit[indA][j1]; if(n!=1) units=unit[indA][j2];

  if(boArr==1){  return [n,units];  }
  else{
    var tmp=n+' '+units;  if(tdiff<0) tmp='-';
    return tmp;
  }
}

//
// Random
//

randomHash=function(){ return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);}

randomInt=function(min, max){    return min + Math.floor(Math.random() * (max - min + 1));  } // Random integer in the intervall [min, max] (That is including both min and max)

gauss=function(){   // returns random number with normal distribution N(0,1)  (mean=0,  std dev=1)
  var x=Math.random(), y=Math.random();

  // two independent variables with normal distribution N(0,1)
  var u=Math.sqrt(-2*Math.log(x))*Math.cos(2*Math.PI*y);
  var v=Math.sqrt(-2*Math.log(x))*Math.sin(2*Math.PI*y);

  // i will return only one, couse only one needed
  return u;
}

gauss_ms=function(m=0,s=1){  // returns random number with normal distribution: N(m,s)  (mean=m,  std dev=s)
  return gauss()*s+m;
}


//
// Math
//
minKeepType=function(){var valBest=Infinity; for(var i=0;i<arguments.length;i++){ if(arguments[i]<valBest) valBest=arguments[i];} return valBest;} // Keeping the type as opposed to Math.min
maxKeepType=function(){var valBest=-Infinity; for(var i=0;i<arguments.length;i++){ if(arguments[i]>valBest) valBest=arguments[i];} return valBest;} // Keeping the type as opposed to Math.max

isNumber=function(n){ return !isNaN(parseFloat(n)) && isFinite(n);}
sign=function(val){if(val<0) return -1; else if(val>0) return 1; else return 0;}

round=Math.round; sqrt=Math.sqrt;
log2=function(x){return Math.log(x)/Math.log(2);}
twoPi=2*Math.PI;
r2deg=180/Math.PI;  deg2r=Math.PI/180;
if(typeof(Number.prototype.toRad) === "undefined"){  Number.prototype.toRad = function(){  return this * Math.PI / 180; }   }
Math.log2=function(val) {  return Math.log(val) / Math.LN2; }
Math.log10=function(val) {  return Math.log(val) / Math.LN10; }

bound=function(value, opt_min, opt_max){
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}
closest2Val=function(v, val){
  var bestFit=Number.MAX_VALUE, curFit, len=v.length, best_i;
  for(var i=0;i<len;i++){
    curFit=Math.abs(v[i]-val);
    if(curFit<bestFit){bestFit=curFit; best_i=i;}
  }
  return [v[best_i], best_i];
}
normalizeAng=function(angIn, angCenter=0, lapSize=twoPi){
  var angOut,nLapsCorrection;
  var lapSizeHalf=lapSize/2;

  var upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf, angInTransfer=angIn-angCenter;
  var tmp;
  if(angIn>=upper){tmp=angInTransfer+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
  else if(angIn<lower){tmp=angInTransfer+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
  else return [angIn,0];
  
  angOut=angIn-nLapsCorrection*lapSize;  

  return [angOut,nLapsCorrection];
}

distCalc=function(lng1,lat1,lng2,lat2){
  var R = 6371; // km
  //var dLat = (lat2-lat1).toRad();
  //var dLng = (lng2-lng1).toRad();
  var lng1 = Number(lng1).toRad(),  lat1 = Number(lat1).toRad();
  var lng2 = Number(lng2).toRad(),  lat2 = Number(lat2).toRad();
  var dLat = lat2-lat1,   dLng = lng2-lng1;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

approxDist=function(mWhole,boArr=0){  
  //if(typeof boArr !='undefined' && boArr==1){} else boArr=0;
  var n, u; 
  var aMWhole=Math.abs(mWhole);
  if(mWhole>=1000){n=Math.round(mWhole/(1000)); u='km';} 
  else{n=mWhole;  u='m';} 
  if(boArr==1) return Array(n,u); else return n+' '+u;
}

makeOrdinalEndingEn=function(n){
  var oneth=n%10, tmp=Math.floor(n/10), tenth=tmp%10;
  var ending='th';
  if(tenth!=1){ // if not in the teens
    if(oneth==1){ ending='st';} else if(oneth==2){ ending='nd';} else if(oneth==3){ ending='rd';}
  }
  return ending;
}

//
// MercatorProjection
//

var TILE_SIZE = 256;
degreesToRadians=function(deg){  return deg*(Math.PI/180);  }
radiansToDegrees=function(rad){  return rad/(Math.PI/180);  }
MercatorProjection=function(){
  this.pOrg = {x:TILE_SIZE/2,y:TILE_SIZE/2};
  this.pixelsPerLonDegree_ = TILE_SIZE/360;
  this.pixelsPerLonRadian_ = TILE_SIZE/(2*Math.PI);
}
MercatorProjection.prototype.fromLatLngToPointV=function(latLng){
  var lat, lng;    if(latLng instanceof Array) {lat=latLng[0]; lng=latLng[1]; } else if(typeof latLng.lat=='function') {lat=latLng.lat(); lng=latLng.lng();} else { lat=latLng.lat; lng=latLng.lng;}
  var xOrg=this.pOrg.x, yOrg=this.pOrg.y;
  var xOut=xOrg+lng*this.pixelsPerLonDegree_;

  var siny = bound(Math.sin(degreesToRadians(lat)), -0.9999, 0.9999);
  var yOut=yOrg + 0.5*Math.log((1+siny)/(1-siny)) * -this.pixelsPerLonRadian_;
  return [xOut,yOut];
}
MercatorProjection.prototype.fromLatLngToPoint = function(latLng){  var [x,y]=this.fromLatLngToPointV(latLng);  return {x:x,y:y};   };
MercatorProjection.prototype.fromPointToLatLngV = function(point,noWrap=1){
  var x, y;    if(point instanceof Array) {x=point[0]; y=point[1]; } else { x=point.x; y=point.y;}
  var xOrg=this.pOrg.x, yOrg=this.pOrg.y;
  var lng = (x-xOrg) / this.pixelsPerLonDegree_;
  var latRadians = (y-yOrg) / -this.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI/2);
  if(noWrap) [lng]=normalizeAng(lng,0,360);
  return [lat, lng];
};
MercatorProjection.prototype.fromPointToLatLng = function(point,noWrap=1){  var [lat,lng]=this.fromPointToLatLngV(point, noWrap);  return {lat:lat,lng:lng};  };
MercatorProjection.prototype.getBounds=function(pC,z,size){
  var zf=Math.pow(2, z)*2;
  var dw=size[0]/zf, dh=size[1]/zf;
  var sw={x:pC.x-dw, y:pC.y+dh};
  var ne={x:pC.x+dw, y:pC.y-dh};
  return {sw:sw,ne:ne};
}
MercatorProjection.prototype.fromYToLat = function(y){
  var yOrg=this.pOrg.y;
  var latRadians = (y - yOrg) / -this.pixelsPerLonRadian_;
  var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI/2);
  return lat;
};

resM2resWC=function(resMEquator,lat){
  var divisor=Math.cos(deg2r*lat), resT=resMEquator/divisor;  if(resT<1)resT=1;
  var resWC=resT*m2wc; return resWC;
}  



//
// Obsolete
//
/*
reload=function(){ confirm('reload'); window.location.reload(); }
htmlDecode=function(input){ var e = document.createElement('div');    e.innerHTML = input;     return e.childNodes[0].nodeValue;  }
//getScrollHeight=function(){ var h; if($.browser.msie)  h=document.getElementsByTagName('body')[0].scrollHeight;   else h=document.body.parentNode.scrollHeight;   return h;  }
getColor = function(val, range){  var s=100, l=50, a=1,    h = 240-Math.round((240 / range) * val);      return "hsla("+h+","+s+"%,"+l+"%,"+a+")";    };
*/

