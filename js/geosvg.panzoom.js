(function(){

  const panzoom={
    constructor(){
      let originX,originY,moveEvent;
      const mousedown=(event)=>{
        originX=event.screenX;
        originY=event.screenY;
        this.element.addEventListener('mouseup',mouseup);
        this.element.addEventListener('mousemove',mousemove);
        document.addEventListener('mouseenter',mouseenter);
      }
      const mousemove=(event)=>{
        moveEvent=event;
        let x=Math.round(((this.width*-.5)+(originX-event.screenX)*this.scale)*100)/100,
            y=Math.round(((this.height*-.5)+(originY-event.screenY)*this.scale)*100)/100;
        this.element.setAttribute('viewBox',[x,y,this.width,this.height].join(' '));
      }
      const mouseup=(event)=>{
        //move this.lat and this.lon
        this.element.removeEventListener('mouseup',mouseup);
        this.element.removeEventListener('mousemove',mousemove);
        document.removeEventListener('mouseenter',mouseenter);

        let distance = Math.planeDistance(originX,originY,event.screenX,event.screenY)*this.scale,
            angle = Math.planeAngle(originX,originY,event.screenX,event.screenY);
        this.viewPort=this.center.destinationPoint(distance,angle);
      }
      const mouseenter=(event)=> {
        if(event.which!==1) mouseup(moveEvent);
      }
      const mousewheel=(event)=>{
        event.preventDefault();
        let pxAngle=Math.planeAngle((this.element.clientWidth/2),(this.element.clientHeight/2),event.layerX,event.layerY);
        let pxDistance=Math.planeDistance((this.element.clientWidth/2),(this.element.clientHeight/2),event.layerX,event.layerY);
        let mousePoint=this.center.destinationPoint(pxDistance*this.scale,pxAngle-180);
        let newScale=(event.deltaY>0)?Math.round((this.scale/9*10)*100)/100:Math.round((this.scale*.9)*100)/100;
        let newCenter=mousePoint.destinationPoint(pxDistance*newScale,pxAngle)
        this.viewPort = {
          scale:newScale,
          lat:newCenter.lat,
          lon:newCenter.lon,
        }
      }
      this.element.addEventListener('mousedown',mousedown);
      this.element.addEventListener('mousewheel',mousewheel);
    },
  };
  GeoSvg.extend(panzoom);
})();
