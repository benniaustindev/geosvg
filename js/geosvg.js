(function(){
  var initializers=[]

  class GeoSvg {
    constructor(element){
      this.element=element;
      while(initializers.length){
        let initializer=initializers.shift();

        initializer.call(this)
      }
    }
    get viewBox(){
      let obj={},
          arr=this.element.getAttribute('viewBox').split(' ');
          arr=arr.map(i => i*1);
      ({0:obj.minX,
        1:obj.minY,
        2:obj.width,
        3:obj.height,
      }=arr);
      obj.centerX=obj.minX+(obj.width/2);
      obj.centerY=obj.minY+(obj.height/2);
      return obj;
    }
    set viewBox(obj){
      let vals=this.viewBox;
      Object.assign(vals,obj);
      if(obj.centerX)vals.minX=obj.centerX-vals.width/2;
      if(obj.centerY)vals.minY=obj.centerY-vals.height/2;
      this.element.setAttribute('viewBox',[vals.minX,vals.minY,vals.width,vals.height].join(' '));
    }
  }
  GeoSvg.extend=function(obj){
    if(typeof obj.constructor === 'function'){
      initializers.push(obj.constructor);
      delete obj.constructor;
    }
    Object.assign(GeoSvg.prototype,obj);
  }
  window.GeoSvg=GeoSvg;
})();
