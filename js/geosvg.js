(function(){

  const radius=6371000;

  LatLon.prototype.planeDifference=function(finalPoint){
    return {
      x:this.distanceTo(new LatLon(this.lat,finalPoint.lon))*Math.sign(finalPoint.lon-this.lon),
      y:this.distanceTo(new LatLon(finalPoint.lat,this.lon))*Math.sign(this.lat-finalPoint.lat),
    };
  }
  LatLon.prototype.planeDestination=function(x,y){
    let xBearing=(x<0)?270:90,
        yBearing=(x<0)?180:0;
    return new LatLon(this.lat,this.lon).destinationPoint(Math.abs(x),xBearing).destinationPoint(Math.abs(y),yBearing);

  }

  document.createSVGElement=function(type){
    return document.createElementNS('http://www.w3.org/2000/svg',type);

    return elem;
  }


  var initializers=[];
  var properties={
    lat:0,
    lon:0,

  };


  class GeoSvg {
    constructor(element){
      this.db=new loki('loki.json');
      this.assets=this.db.addCollection('assets');
      this.element=properties.element=element;
      window.addEventListener('resize',()=>this.fixViewBox);
      while(initializers.length){
        let initializer=initializers.shift();
        initializer.call(this);
      }

    }



  }
  GeoSvg.extend=function(obj){
    if(typeof obj.constructor === 'function'){
      initializers.push(obj.constructor);
      delete obj.constructor;
    }
    Object.getOwnPropertyNames(obj).forEach((propName)=>{
      let newDescriptor=Object.getOwnPropertyDescriptor(obj,propName);
      let oldDescriptor=Object.getOwnPropertyDescriptor(GeoSvg.prototype,propName);
      if(newDescriptor && oldDescriptor){

        if(newDescriptor.value){
          if(GeoSvg.prototype[propName]){
            GeoSvg.prototype[propName]=function(){
              oldDescriptor.value.apply(this,arguments);
              newDescriptor.value.apply(this,arguments);
            }

          }
        }
        else {
          if(newDescriptor.set && oldDescriptor.set){
            let newSetter=newDescriptor.set;
            newDescriptor.set=function(val){
              return newSetter.call(this,oldDescriptor.set.apply(this,arguments));
            }
          }

          if(newDescriptor.get && oldDescriptor.get){
            let newGetter=newDescriptor.get;
            newDescriptor.get=function(val){
              return newGetter.call(this,oldDescriptor.get.apply(this,arguments));
            }
          }

        }
      }

      Object.defineProperty(this.prototype,propName,newDescriptor);
    });
  }
  window.GeoSvg=GeoSvg;
})();
