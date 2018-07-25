(function(){

  const panzoom={
    constructor(){
      let originX,originY;
      const mousedown=(event)=>{
        originX=event.screenX;
        originY=event.screenY;
        this.element.addEventListener('mouseup',mouseup);
        this.element.addEventListener('mousemove',mousemove);
        document.addEventListener('mouseover',mouseover);
      }
      const mousemove=(event)=>{
        let x=(this.width*-.5)+(originX-event.screenX)*this.scale,
            y=(this.height*-.5)+(originY-event.screenY)*this.scale;
        this.element.setAttribute('viewBox',[x,y,this.width,this.height].join(' '));
      }
      const mouseup=(event)=>{
        //move this.lat and this.lon
        this.element.removeEventListener('mouseup',mouseup);
        this.element.removeEventListener('mousemove',mousemove);
        document.removeEventListener('mouseover',mouseover);
        let diffX=(originX-event.screenX)*this.scale,
            diffY=(originY-event.screenY)*this.scale,
            distance=Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2)),
            angle=(Math.atan2(diffY,diffX)*(180 / Math.PI))+90;
        this.viewPort=new LatLon(this.lat,this.lon).destinationPoint(distance,angle);
      }
      const mouseover=(event)=> {
        if(event.which!==1) mouseup();
      }


      this.element.addEventListener('mousedown',mousedown);
    },
  };
  GeoSvg.extend(panzoom);
})();
