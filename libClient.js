

//
// Storage, DOM etc
//

getItem=function(name){    var tmp=localStorage.getItem(name);   if(tmp!==null) tmp=JSON.parse(tmp);  return tmp;   }
setItem=function(name,value){  if(typeof value=='undefined') value=null; localStorage[name]=JSON.stringify(value); }
getItemS=function(name){    var tmp=sessionStorage.getItem(name);    if(tmp!==null) tmp=JSON.parse(tmp);   return tmp;   }
setItemS=function(name,value){  sessionStorage[name]=JSON.stringify(value); }

bindEvent=function(element, type, handler){
   if(element.addEventListener){
      element.addEventListener(type, handler, false);
   } else{
      element.attachEvent('on'+type, handler);
   }
}



//
// Hardware checking
//

getBrowser=function(){
    var ua=navigator.userAgent.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var brand=match[ 1 ] || "";
    var version=match[ 2 ] || "0";
    
    return {brand:brand,version:version};
};
detectIE=function() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


//
// JQuery extentions
//

$.fn.pushOne = function(selector){
    Array.prototype.push.apply(this, $.makeArray($(selector)));
    return this;
};
$.fn.push = function(){
  for(var i=0; i<arguments.length; i++){
    this.pushOne(arguments[i]);
  }
  return this;
}
$.fn.visible = function() {    return this.css('visibility', 'visible');  };
$.fn.invisible = function() {    return this.css('visibility', 'hidden');  };
jQuery.fn.sortElements = (function(){
 
    var funcSort = [].sort;
    //var funcSort=merge_sort;
    var funcSort = [].msort;
 
    return function(comparator, getSortable){
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){   // A vector of functions, each function asumes that its 'this' will be the moved object, which will then be moved to the corresponding 'flagNode'
 
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing it's original position in
                // the DOM. The easiest way is to have a 'flag' node:
                flagNode = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function(){
 
                if (parentNode === this){
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, flagNode);
                // Remove flag:
                parentNode.removeChild(flagNode);
 
            };
 
        });
 

        //var tmp=funcSort.call(this, comparator); 
        //var tmp=this.msort(comparator); 
        var tmp=msort.call(this,comparator); 

        //var tmp=merge_sort(this, comparator); 
        return tmp.forEach(function(v,i){
            placements[i].call(getSortable.call(v));
        });
        /*return this.each(function(i){
            placements[i].call(getSortable.call(this));
        });*/
        //return funcSort.call(this, comparator).each(function(i){
        //    placements[i].call(getSortable.call(this));
        //});
 
    };
 
})();



// Add stable merge sort to Array and jQuery prototypes

  // expose to Array and jQuery
//Array.prototype.msort = jQuery.fn.msort = msort;

msort=function(compare){
"use strict"
  var length = this.length,  middle = Math.floor(length / 2);
  //if(length < 2) return this;
  if(length==0) return [];
  if(length==1) return [this[0]];
  //return merge(    this.slice(0, middle).msort(compare),    this.slice(middle, length).msort(compare),    compare    );
  var a=this.slice(0, middle),  b=this.slice(middle, length);
  return merge(    msort.call(a,compare),    msort.call(b,compare),    compare    );
}

merge=function(left, right, compare){
"use strict"
  var result = [];

  while (left.length > 0 || right.length > 0){
    if(left.length > 0 && right.length > 0){
      if(compare(left[0], right[0]) <= 0){ result.push(left[0]);  left = left.slice(1);  }
      else{ result.push(right[0]); right = right.slice(1);  }
    }
    else if(left.length > 0){  result.push(left[0]);  left = left.slice(1);  }
    else if(right.length > 0){  result.push(right[0]);  right = right.slice(1);  }
  }
  return result;
}





//
// popupHover
//

popupHover=function($area,$bubble,msTimeout){
"use strict"
  var setBubblePos=function(e){
    var xClear=6, yClear=6;
    var x = e.pageX;
    var y = e.pageY;

    var borderMarg=10;
    var $win = $(window), $doc=$(document);
    var winW=$win.width(),winH=$win.height(),   bubW=$bubble.width(),bubH=$bubble.height(),   scrollX=$doc.scrollLeft(),scrollY=$doc.scrollTop();

    var paddingBorderNMarginX=3+1+10; bubW+=2*paddingBorderNMarginX;
    var paddingBorderNMarginY=3+1+5; bubH+=2*paddingBorderNMarginY;
    
    var xFar=x+xClear+bubW, xBorder=scrollX+winW-borderMarg;
    if(xFar<xBorder) x=x+xClear; else x=x-bubW-xClear;   // if the bubble doesn't fit on the right side then flip to the left side
    if(x<scrollX) x=scrollX;
    
    var yFar=y+yClear+bubH, yBorder=scrollY+winH-borderMarg;
    if(yFar<yBorder) y=y+yClear; else y=y-bubH-yClear;   // if the bubble doesn't fit below then flip to above
    if(y<scrollY) y=scrollY;
    
    $bubble.css({'position': 'absolute', 'top': y, 'left': x});
  };
  var closeFunc=function(){ 
    if(boTouch){ 
      $bubble.detach();//fadeOut(400); 
      if(boIOS) $blanket.detach();
    } 
    else{ $bubble.detach();  }
  } //
  
  var $blanket;
  if(boIOS){
    $blanket=$('<div>').css({'background':'#555',opacity:0,'z-index': 9001,top:'0px',left:'0px',width:'100%',position:'fixed',height:'100%'}).click(closeFunc);
  }
  if(boTouch){
    if(typeof msTimeout!='number') msTimeout=4000;
    $area.click(function(e){ e.stopPropagation();  $body.append($bubble); setBubblePos(e); setTimeout(closeFunc, msTimeout); if(boIOS) $body.append($blanket); });  //
    $bubble.click(function(e){ closeFunc(); });
    $('html').click(function(e){ closeFunc(); });
    
  }else{
    $area.mousemove(setBubblePos);  
    $area.mouseenter(function(e){$body.append($bubble);}).mouseleave(function(){$bubble.detach();});
  }
}

popupHoverM=function($area,$bubble,msTimeout){ 
  $bubble.addClass('popupHover'); 
  //var z=$area.css('z-index');
  //$bubble.css({'z-index':9005,'text-align':'left'}); 
  $bubble.css({'z-index':9005,'text-align':'left',padding:'0.4em'});  
  popupHover($area,$bubble,msTimeout);  
  return $area;
}




//
// Canvas
//

cloneCanvas=function(oldCanvas){
    //var newCanvas = new Canvas();
    var newCanvas = document.createElement("canvas");
    newCanvas.width=oldCanvas.width;   newCanvas.height=oldCanvas.height
    var context = newCanvas.getContext('2d');
    context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
}

makeMarker=function(strText){
"use strict"
  if(typeof strText !='string') strText=strText.toString();
	var strFont="8pt Arial", leading=10;
	var arrText=strText.split('\n');
	
		//Calculate dimensions of the bubble
	var canvas = document.createElement("canvas");    var ctx = canvas.getContext("2d");  ctx.font = strFont;     //Create temporary context
	var widthText=0;     for(var i in arrText){   var tmp=ctx.measureText(arrText[i]).width;    if(tmp > widthText) widthText=tmp;    }
	var widthBox=widthText+4, heightBox=arrText.length*leading+3, heightImg=heightBox+3;
	
		//Reseting canvas with new dimensions
	canvas.width=widthBox;   canvas.height=heightImg;    ctx = canvas.getContext("2d");    ctx.font = strFont;   ctx.textBaseline  = "middle";
	
		// Draw bubble
	ctx.beginPath(); //so start going clockwise from upper left corner
	ctx.moveTo(0, 0);
	ctx.lineTo(widthBox,0);
	ctx.lineTo(widthBox, heightBox);
	ctx.lineTo(0, heightBox);
	ctx.closePath();
	ctx.fillStyle="#FF7700";  ctx.fill();    
		
		// Write text
	ctx.fillStyle = "white";     for(var i in arrText){   ctx.fillText(arrText[i], 2, 7+i*leading );    }
	return canvas.toDataURL("image/png");
}


makeMarkerBubble=function(strText){
"use strict"
  if(typeof strText !='string') strText=strText.toString();
	var strFont="8pt Arial", leading=10;
	var arrText=strText.split('\n');
	
		//Calculate dimensions of the bubble
	var canvas = document.createElement("canvas");    var ctx = canvas.getContext("2d");  ctx.font = strFont;     //Create temporary context
	var widthText=0;     for(var i in arrText){   var tmp=ctx.measureText(arrText[i]).width;    if(tmp > widthText) widthText=tmp;    }
	var widthBox=widthText+4, heightBox=arrText.length*leading+3, heightImg=heightBox+3;
	
		//Reseting canvas with new dimensions
	canvas.width=widthBox;   canvas.height=heightImg;    ctx = canvas.getContext("2d");    ctx.font = strFont;   ctx.textBaseline  = "middle";
	
		// Draw bubble
	var center=widthBox/2;
	ctx.beginPath(); //so start going clockwise from upper left corner
	ctx.moveTo(0, 0);
	ctx.lineTo(widthBox,0);
	ctx.lineTo(widthBox, heightBox);
	ctx.lineTo(center+3, heightBox);
	ctx.lineTo(center, heightBox+3);  //tip of arrow
	ctx.lineTo(center-3, heightBox);
	ctx.lineTo(0, heightBox);
	ctx.closePath();
	ctx.fillStyle="#FFFF00";    ctx.fill();    ctx.strokeStyle = "orange";   ctx.stroke();
		
  ctx.font = "Symbol";
		// Write text
	ctx.fillStyle = "black";     for(var i in arrText){   ctx.fillText(arrText[i], 2, 7+i*leading );    }
	return canvas.toDataURL("image/png");
}


makeTextCanvas=function(strText,rot){
	if(typeof rot=='undefined'){rot=0;}
	var fontHeight=12;
	var strFont=fontHeight+"pt Arial", leading=fontHeight+6;
	var arrText=strText.split('\n');
	
		//Calculate dimensions of the bubble
	var canvas = document.createElement("canvas");    var ctx = canvas.getContext("2d");  ctx.font = strFont;     //Create temporary context
	var widthText=0;     for(var i in arrText){   var tmp=ctx.measureText(arrText[i]).width;    if(tmp > widthText) widthText=tmp;    }
	var widthBox=widthText+4, heightBox=arrText.length*leading+3;
	if(rot==1 || rot==-1){ var tmp=heightBox; heightBox=widthBox; widthBox=tmp; }
	
		//Reseting canvas with new dimensions
	canvas.width=widthBox;   canvas.height=heightBox;   var ctx = canvas.getContext("2d");    ctx.font = strFont;   ctx.textBaseline  = "middle";
	
		// Translate and rotate context
	//ctx.strokeStyle="#000000"; ctx.strokeRect(0,0,widthBox,heightBox);
	ctx.save();
	if(rot==-1) ctx.translate(0, heightBox);
	else if(rot==1) ctx.translate(widthBox, 0);
	else if(rot==2) ctx.translate(widthBox, heightBox);
	
	ctx.rotate(rot*Math.PI/2);
	ctx.textAlign = "left";
	ctx.fillStyle = "black";     for(var i in arrText){   ctx.fillText(arrText[i], 2, fontHeight+i*leading );    }
	ctx.restore();
	
	return canvas;
	//return canvas.toDataURL("image/png");
	//var uri=canvas.toDataURL();  return $('<img>').attr(src,uri);
}



//
// autocompleteFieldExtend
//

autocompleteFieldExtend=function($el,storeID,func){
"use strict"
  var createMenu=function(){ 
    var wid=$el.width(), hei=32;
    var pos = $el.position(), x=pos.left+3, y=pos.top+hei;
    $menu.empty().css({'min-width':wid});
    for(var i=0;i<nEntriesSub;i++){
      var makeFunc=function(d){ return function(){ $el.val(d); closeFunc(); $el.focus();} }     
      var $r=$('<div>').html(entriesSub[i]);
      if(i===iSub) $r.css({background:'#ccc'});
      $r.click(makeFunc(entriesSub[i]));
      $menu.append($r);
    }
    $el.after($menu);
    $menu.css({position:'absolute',top:y+'px',left:x+'px',background:'#fff',border:'solid 1px','z-index':45});
  }
  var createEntriesSub=function(){
    //entriesSub=[];
    entriesSub.length=0;
    var val=$el.val(), valLen=val.length;
    for(var i=0;i<nEntries;i++){
      var cur=entries[i], curLen=cur.length;
      if(curLen>=valLen){
        var strSub=cur.substr(0,valLen);
        if(strSub===val){
          entriesSub.push(entries[i]); 
        }
      }
    }
    nEntriesSub=entriesSub.length;
  }
  var closeFunc=function(){  $menu.detach();  }
  var fieldKeyUp=function(e){ 
    var c=e.which;   //$menuessageText.append('<b>'+c+'</b>');
    if(c==13){
      var val=$el.val(); 
      //var ind=entries.indexOf(val);   if(ind==-1){  entries.push(val); }
      closeFunc();
      $el.store();   func($el.val());
      return; 
    }
    else if(c==40){ if(iSub==='') iSub=0; else{iSub++;if(iSub==nEntriesSub) iSub--;} $el.val(entriesSub[iSub]); }
    else if(c==38){ if(iSub!==''){iSub--;if(iSub<0) iSub++;} $el.val(entriesSub[iSub]); }
    else{iSub=''; createEntriesSub();}
    //$entriesSubDump.html(print_r(entriesSub));
    createMenu();
  }
  //$el.getEntries=function(){return entries;}
  $el.entryMerge=function(){ }
  $el.store=function(){
    var val=$el.val(), ind=entries.indexOf(val);   if(ind==-1){  entries.push(val); } 
    //localStorage[storeID]=JSON.stringify(entries);
    setItem(storeID,entries);
    //$entriesDump.html(print_r(entries));
  }
  var entries=getItem(storeID);   if(entries===null) entries=[]; 
  //var tmp=entries.indexOf(''); if(tmp!=-1) entries.splice(tmp,1);
  var tmp=entries.indexOf(''); if(tmp!=-1) mySplice1(entries,tmp);

  //ind=entries.indexOf(''); if(ind!=-1) entries.splice(ind,1);
  var nEntries=entries.length;

  var entriesSub=entries.concat([]), nEntriesSub=entriesSub.length;
  var iSub='';
  var $menu=$('<div>').css({cursor:'default'}).addClass('unselectable');
  //$menu.mouseenter(function(){$el.off('blur',closeFunc);}).mouseleave(function(){$el.on('blur',closeFunc);});
  
  $el.click(function(e){createEntriesSub();createMenu();e.stopPropagation();});
  $el.keyup( fieldKeyUp );
  $('html').click(closeFunc);
  
  return $el;
}

