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
// frame: coordinate from upper left corner of $mapDiv (dom-tree resolution).
// pWC={x:x,y:y}  (point with world coordinate):  where x resp y ∈ [0,256) regardles of zoom
// pix={x:x,y:y}: (scaled world coordinate) pix.x=pWC.x*zFac (same for y) (for whatever zFac that is currently used)
// brd: same as pix although with origo at the board origo (upper left coorner of the board)
//


// State variables:
//   pWCC keeps the state (must be set) before laying out the tiles (calling setTile)
//   zoomFacW: zoom factor written (when the tiles where placed)
//   zCur, leftCur, topCur:  Quick access of the css "transform" parameter of $board
//
//   touchesOld: array of touches (only used on touch deviced)
//   xavgL, yavgL: (only used with "mouse"-panning)
//   pixBoardX, pixBoardY: (I forgotten what these are) 



//pixMult=function(pixT,fac){pixT.x*=fac; pixT.y*=fac;}
pixMult=function(pixT,fac){return {x:pixT.x*fac, y:pixT.y*fac};}
var mapDivExtend=function($el){
  $el.toString=function(){return 'mapDiv';}

  //
  // Touch events
  //

  var handleStart=function(evt) {
    evt.preventDefault();
    var Tou = evt.targetTouches, mode=Tou.length;
    storeTouches(Tou);
    //setMess(mode);
  }

  var touchesOld=[];
  var storeTouches=function(Tou){
    touchesOld=[];
    for(var i=0; i<Tou.length; i++) { var t=Tou[i]; touchesOld[i]={pageX:t.pageX, pageY:t.pageY, identifier:t.identifier};}
  }
  var getStoredTouch=function(identifier) {
    for (var i=0; i<touchesOld.length; i++) {
      if(touchesOld[i].identifier == identifier) { return touchesOld[i]; }
    }
    return null;
  }

  var calcD=function(tA,tB){  var xD=tB.pageX-tA.pageX, yD=tB.pageY-tA.pageY;  return Math.sqrt(xD*xD +yD*yD);  }
  var calcTwoTouchCenterNDist=function(Tou){
    var tA=Tou[0], tB=Tou[1], xA=tA.pageX, xB=tB.pageX, xavg=(xA+xB)/2,     yA=tA.pageY, yB=tB.pageY, yavg=(yA+yB)/2;
    var d=calcD(tA,tB);
    return {x:xavg,y:yavg,d:d};
  }

  var zCur,leftCur,topCur;  // Quick access of the css "transform" parameter of $board
  var panNZoom=function(Tou,boEnd){
    var TouL=[];    for(var i=0;i<Tou.length;i++){    var touT=getStoredTouch(Tou[i].identifier); if(touT) TouL.push(touT);      }
    var mode=TouL.length;
    if(mode==1){
      var xavgL=TouL[0].pageX, yavgL=TouL[0].pageY;
      var xavg=Tou[0].pageX, yavg=Tou[0].pageY;
      var dXScreen=xavg-xavgL;    leftCur+=dXScreen;
      var dYScreen=yavg-yavgL;    topCur+=dYScreen;
      boundY();
      $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    }else if(mode==2){

      var doub=calcTwoTouchCenterNDist(Tou);
      var doubL=calcTwoTouchCenterNDist(TouL);

      var rat=doub.d/doubL.d;
      var zL=zCur;
      zCur=rat*zL;
      var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
      var widthBox=$el.width(), heightBox=$el.height();


      var brdTilePiv=calcBrdTilePiv(doubL.x-leftContainer, doubL.y-topContainer, zL, leftCur, topCur);
      [leftCur,topCur]=calcLeftTop(doub.x-leftContainer, doub.y-topContainer, zCur, brdTilePiv);

 
      boundY();
      $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
      $divPivotDbg.css({left:brdTilePiv.x+'px',top:brdTilePiv.y+'px'}); // little black square
    }
    else if(mode==0){ // boEnd

      var zL=zCur;
      var zCurLev=round(log2(zCur)); zCur=Math.pow(2,zCurLev);
      var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
      var widthBox=$el.width(), heightBox=$el.height();

      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zL, leftCur, topCur);
      [leftCur,topCur]=calcLeftTop(widthBox/2, heightBox/2, zCur, brdTilePiv);

      boundY();
      $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});

        // Converting to pWCC
      var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
      var pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};
      pWCC=pixMult(pixC,1/(zCur*zoomFacW));

      var zoomFacRTmp=zCur*zoomFacW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
      var boRefresh=$el.setTile(zoomLevT); $el.drawW(boRefresh);

    }
  }
  $divPivotDbg=$('<div>').css({position:'absolute',background:'black',width:'5px',height:'5px','z-index':5});
  var pixBoardX, pixBoardY

  var handleMove=function(evt) {
    evt.preventDefault(); var Tou=evt.targetTouches;
    panNZoom(Tou,0);
    storeTouches(Tou);
  }
  var handleEnd=function(evt) {
    evt.preventDefault(); var Tou=evt.targetTouches;
    panNZoom(Tou,1);
    storeTouches(Tou);
    return false;
  }
  var handleCancel=function(evt) {
    evt.preventDefault(); var Tou=evt.targetTouches;
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
    var rat; if(boFF) rat=e.detail>=0?0.5:2; else  rat=e.originalEvent.wheelDelta>=0?2:0.5;
    var xavg=e.pageX, yavg=e.pageY;

    var zL=zCur;
    zCur=rat;
    var leftContainer=$el.offset().left,  topContainer=$el.offset().top;
    var widthBox=$el.width(), heightBox=$el.height();


    var brdTilePiv=calcBrdTilePiv(xavg-leftContainer, yavg-topContainer, zL, leftCur, topCur);
    [leftCur,topCur]=calcLeftTop(xavg-leftContainer, yavg-topContainer, zCur, brdTilePiv);

    boundY();
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});

      // Converting to pWCC; (might seem unnecessary, in a future version the amount of statevariables might be reduced) See comment below on state variables
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    var pixC={x:pixBoardX*zCur+brdTilePiv.x*zCur, y:pixBoardY*zCur+brdTilePiv.y*zCur};
    pWCC=pixMult(pixC,1/(zCur*zoomFacW));

    var zoomFacRTmp=zCur*zoomFacW, zoomLevT=round(log2(zoomFacRTmp));//, zFacNew=Math.pow(2,zoomLevT);
    var boRefresh=$el.setTile(zoomLevT); $el.drawW(boRefresh);

  }
  var xavgL, yavgL;
  var panF=function(e){
    var xavg=e.pageX, yavg=e.pageY;
    var dXScreen=xavg-xavgL;    leftCur=leftCur+dXScreen;
    var dYScreen=yavg-yavgL;    topCur=topCur+dYScreen;
    boundY();
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    
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
    boundY();
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    //pixC=calcPixC();
    pWCC=pixMult(calcPixC(),1/zoomFacW);
    //var zFac=round(zCur)*zoomFacW, zLev=log2(zFac);
    var zoomLevT=log2(zoomFacW);
    var boRefresh=$el.setTile(zoomLevT); $el.drawW(boRefresh);
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
    var widthBox=$el.width(), heightBox=$el.height();
    var brdTilePiv=calcBrdTilePiv(widthBox/2, heightBox/2, zCur, leftCur, topCur);
    var pixCN={x:pixBoardX+brdTilePiv.x, y:pixBoardY+brdTilePiv.y};
    return pixCN;
  }

  var boundY=function(){ // Bounds zCur, leftCur and topCur (so that the world doesn't gets dragged out of frame or gets zoomed unnecessary small) (should perhaps be a property of $board)
    var zL=zCur;
    var zoomFac=zCur*zoomFacW;
    var widthBox=$el.width(), heightBox=$el.height(), minDim=Math.min(widthBox,heightBox);
    var zoomFacWorld=minDim/WCMAX;  // zoomFacWorld: The zoom factor that will make the whole world fit into $el
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
    zCur=zCurN; leftCur=leftCurN; topCur=topCurN;
  }

  $el.setPos=function(latLng){
    //$el.pWCMe=merProj.fromLatLngToPoint({lat:position.coords.latitude, lng:position.coords.longitude});
    $el.pWCMe=merProj.fromLatLngToPoint(latLng);
    copySome(pWCC, $el.pWCMe, ['x','y']);
  }
  $el.setTile=function(zoomLev){
    var widthBox=$el.width(), heightBox=$el.height();

    var boRefresh=0;

    var zoomFac=Math.pow(2,zoomLev);
    var pixC=pixMult(pWCC,zoomFac);
    var pixFrameX=pixC.x-widthBox/2, iTileRFirst=pixFrameX/TILESIZE, iTileFirst=Math.floor(iTileRFirst);  leftCur=-(iTileRFirst-iTileFirst)*TILESIZE;
    var pixFrameY=pixC.y-heightBox/2, jTileRFirst=pixFrameY/TILESIZE, jTileFirst=Math.floor(jTileRFirst); topCur=-(jTileRFirst-jTileFirst)*TILESIZE;
    pixBoardX=pixFrameX+leftCur; pixBoardY=pixFrameY+topCur;
      var nTileX=Math.ceil(widthBox/TILESIZE)+1, nTileY=Math.ceil(heightBox/TILESIZE)+1;

    if(iTileFirst!=iTileFirstLast || jTileFirst!=jTileFirstLast || zoomLev!=zoomLevLast || drLev!=drLevLast){
      boRefresh=1; iTileFirstLast=iTileFirst; jTileFirstLast=jTileFirst; zoomLevLast=zoomLev; drLevLast=drLev;}
    zoomFacW=zoomFac;
    if(boRefresh){
      var zoomLevPlusDRLev=zoomLev+drLev;
      var $tileTmp=$board.children('img').detach(); $TileStack.push($tileTmp);
      var iTileZ=iTileFirst, jTileZ=jTileFirst;
      for(var i=0;i<nTileX;i++){
        var iTile=iTileZ+i, left=i*TILESIZE;
        for(var j=0;j<nTileY;j++){
          var jTile=jTileZ+j, top=j*TILESIZE;
          [iTile]=normalizeAng(iTile, zoomFac/2*dr, zoomFac*dr);
          var boBlue=0, [,nCorrectionY]=normalizeAng(jTile, zoomFac/2*dr, zoomFac*dr);

          var wTmp;
          if(nCorrectionY<0) wTmp='northPole.png';
          else if(nCorrectionY>0) wTmp='southPole.png';
          else {
            if(zoomLevPlusDRLev>=0) wTmp=uMapSourceDir+'/'+zoomLevPlusDRLev+'/'+iTile+'/'+jTile+'.png';
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
      $board.append($glas);
    }else{
    }
    zCur=1;
    $board.css({'transform':'matrix('+zCur+',0,0,'+zCur+','+leftCur+','+topCur+')'});
    return boRefresh;
  }


  $el.set1=function(zoomLevel, latLngFirst){
    $el.latLngMe=latLngFirst;
    //var pos={coords:{latitude:latLngFirst.lat, longitude:latLngFirst.lng}};
    $el.setPos(latLngFirst);
  }
  
  
  //
  // Markers
  //

  $el.drawMarkers=function(){
    var $arr=$markers;
    $arr.each(function(i){
      var $t=$(this), left=this.x*zoomFacRW-pixBoardX, top=this.y*zoomFacRW-pixBoardY;
       $t.css({left:left,top:top});
    });
  }

  $el.setMarkers=function(){
    if(boImgCreationOK) {    if(typeof groupOverlay!='undefined') groupOverlay.setMap(null);  }
    else { $el.hideGroupMarkers(); }

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
  $board=$('<div>').css({position:'absolute','box-sizing': 'border-box'});
  
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


  $board.append($divPivotDbg,$glas);
  var $markers=$([]);


  if(!boTouch){
    if(boFF) $glas[0].addEventListener("DOMMouseScroll", myMousewheel, false); else   $glas.bind('mousewheel', myMousewheel);
    $glas.on('mousedown','',myMousedown);
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
