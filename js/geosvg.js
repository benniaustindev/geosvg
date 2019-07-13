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
  Math.planeDistance=function(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
  }
  Math.planeAngle=function(x1,y1,x2,y2){
    let angle = (Math.atan2(y1-y2,x1-x2)*(180 / Math.PI))+90;
    while(angle<0)angle+=360;
    return angle;
  }
  document.createSVGElement=function(type){
    return document.createElementNS('http://www.w3.org/2000/svg',type);
  }


  var initializers=[];
  var readyMethods=[];
  var properties={
    lat:0,
    lon:0,

  };
  events=new Map();
  class GeoSvgEvent {
    constructor(eventName,eventInit){
      Object.assign(this,{
        type:eventName,
        timeStamp:performance.now(),
        bubbles:true,
        cancelable:true,
        srcElement:null,
      },eventInit);

    }
    stopPropegation(){

    }
  }
  class GeoSvg {
    constructor(elementId){
      this.db=new loki('loki.json');
        this.assets=this.db.addCollection('assets');
      this.activeLayer='assets.Saint Paul';
      window.addEventListener('resize',()=>this.fixViewBox);
      while(initializers.length){
        let initializer=initializers.shift();
        initializer.call(this);
      }
      if(document.readyState=='compete'){
        this.element=document.getElementById(elementId)
        while(readyMethods.length)readyMethods.shift().call(this)
        this.dispatchEvent('ready');
        this.readyState='complete';
      }
      else {
        document.addEventListener('DOMContentLoaded',event=>{
          this.element=document.getElementById(elementId)
          while(readyMethods.length)readyMethods.shift().call(this)
          this.dispatchEvent('ready');
          this.readyState='complete';
        });
      }
    }
    addEventListener(eventName,method){
      if(!events.has(eventName))events.set(eventName,[]);
      events.get(eventName).push(method);
      if(eventName === 'ready' && this.readystate === 'complete'){
        this.dispatchEvent(eventName)
      }
    }
    removeEventListener(){}
    dispatchEvent(eventName,obj){
      let event;
      if(eventName instanceof GeoSvgEvent){
        event=eventName;
        eventName=event.type;
      }
      if(events.has(eventName)){
        if(typeof event === 'undefined'){
          const eventProperties=Object.assign({
            currentTarget:this,
            target:this,
            path:[this],
          },obj);
          event=new GeoSvgEvent(eventName,eventProperties);
        }
        events.get(eventName).forEach((eventMethod)=>{
          eventMethod(event);
        });
        if(eventName==='ready'){
          events.set(eventName,[])
        }
      }

    }
    static ready(method){
      readyMethods.push(method)
    }
  }

  GeoSvg.extend=function(obj){
    let proto=Object.getPrototypeOf(this);

    if(typeof obj.constructor === 'function'){
      initializers.push(obj.constructor);
      delete obj.constructor;
    }
    Object.getOwnPropertyNames(obj).forEach((propName)=>{
      let newDescriptor=Object.getOwnPropertyDescriptor(obj,propName);
      let oldDescriptor=Object.getOwnPropertyDescriptor(this.prototype,propName);
      if(newDescriptor && oldDescriptor){
        if(newDescriptor.value){
          this.prototype[propName]=function(){
            oldDescriptor.value.apply(this,arguments);
            newDescriptor.value.apply(this,arguments);
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
      else Object.defineProperty(this.prototype,propName,newDescriptor);
    });
  }
  window.GeoSvg=GeoSvg;
  window.GeoSvgEvent=GeoSvgEvent;
})();
