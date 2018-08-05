Object.defineProperties(SVGSVGElement.prototype,{
  'minX':{
    get:function(){
      return this.viewBox.base.x;
    }
    set:function(value){
      this.viewBox.base.x=value
    }
  }
  'minY':{
    get:function(){
      return this.viewBox.base.y;
    }
    set:function(value){
      this.viewBox.base.y=value
    }
  }
  '':{
    get:function(){
      return this.viewBox.base.y;
    }
    set:function(value){
      this.viewBox.base.y=value
    }
  }
})
