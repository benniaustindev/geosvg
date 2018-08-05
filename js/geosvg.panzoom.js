(function(){

  let originX,originY,moveEvent;
  const mousedown=(event)=>{
    originX=event.screenX;
    originY=event.screenY;
    geosvg.element.addEventListener('mouseup',mouseup);
    geosvg.element.addEventListener('mousemove',mousemove);
    document.addEventListener('mouseenter',mouseenter);
  }
  const mousemove=(event)=>{
    moveEvent=event;
    let x=Math.round(((geosvg.width*-.5)+(originX-event.screenX)*geosvg.scale)*100)/100,
        y=Math.round(((geosvg.height*-.5)+(originY-event.screenY)*geosvg.scale)*100)/100;
    geosvg.element.setAttribute('viewBox',[x,y,geosvg.width,geosvg.height].join(' '));
  }
  const mouseup=(event)=>{
    //move geosvg.lat and geosvg.lon
    geosvg.element.removeEventListener('mouseup',mouseup);
    geosvg.element.removeEventListener('mousemove',mousemove);
    document.removeEventListener('mouseenter',mouseenter);

    let distance = Math.planeDistance(originX,originY,event.screenX,event.screenY)*geosvg.scale,
        angle = Math.planeAngle(originX,originY,event.screenX,event.screenY);
    geosvg.viewPort=geosvg.center.destinationPoint(distance,angle);
  }
  const mouseenter=(event)=> {
    if(event.which!==1) mouseup(moveEvent);
  }
  const mousewheel=(event)=>{
    event.preventDefault();
    let pxAngle=Math.planeAngle((geosvg.element.clientWidth/2),(geosvg.element.clientHeight/2),event.layerX,event.layerY);
    let pxDistance=Math.planeDistance((geosvg.element.clientWidth/2),(geosvg.element.clientHeight/2),event.layerX,event.layerY);
    let mouseLatLon=geosvg.center.destinationPoint(pxDistance*geosvg.scale,pxAngle-180);
    let newScale=(event.deltaY>0)?Math.round((geosvg.scale/9*10)*100)/100:Math.round((geosvg.scale*.9)*100)/100;
    let newCenter=mouseLatLon.destinationPoint(pxDistance*newScale,pxAngle)
    geosvg.viewPort = {
      scale:newScale,
      lat:newCenter.lat,
      lon:newCenter.lon,
    }
  }

  geosvg.addEventListener('ready',function(){

    geosvg.element.addEventListener('mousedown',mousedown);
    geosvg.element.addEventListener('mousewheel',mousewheel);
  })

})();
