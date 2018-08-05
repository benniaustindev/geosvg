(function(){
  const events=new Map();
  class Layer {
    constructor(name,parent){
      this.name=name;
      this.parent=parent;
      this.children=[];
      this.visibility='visible';
    }
    hide(){
      this.visibility='hidden';
    }
    show(){
      this.visibility='visible';
    }
    toggleVisibility(){
      if(this.visibility==='hidden')this.show()
      else this.hide()
      return this.visibility;
    }
    getLayer(address){
      address=address.split('.');
      address.shift();
      return  address.reduce((layer,name)=>{
        return layer.getChild(name)
      },this);
    }
    getChild(name){
      let index=this.children.findIndex(item=>item.name===name);
      if(index==-1){
        return this.createChild(name)
      }
      else return this.children[index];
    }
    createChild(name){
      let newLayer=new Layer(name,this);
      this.children.push(newLayer);
      newLayer.geosvg=this.geosvg;
      newLayer.dispatchEvent('layerCreated')
      return newLayer;
    }
    get address(){
      let name=[],layer=this;
      while(layer.parent){
        name.unshift(layer.name);
        layer=layer.parent;
      }
      return 'assets.'+name.join('.');
    }
    addEventListener(eventName,method){
      if(!events.has(this.address)) this.events.set(this.address,new Map());
      if(!events.get(this.address).has(eventName))events.get(this.address).set(eventName,[]);
      events.get(this.address).get(eventName).push(method)
    }
    dispatchEvent(eventName,obj){
      const eventProperties=Object.assign({
        currentTarget:this,
        target:this,
        path:[this],
      },obj);
      let parent=this.parent;
      while (parent){
        eventProperties.path.push(parent)
        parent=parent.parent;
      }
      eventProperties.path.push(this.geosvg)
      const event=new GeoSvgEvent(eventName,eventProperties)
      event.path.forEach((pathItem)=>{
        if(pathItem instanceof Layer &&  events.has(pathItem.address) && events.get(pathItem.address).get(eventName)){
          events.get(pathItem.address).get(eventName).forEach((eventMethod)=>{
            eventMethod(event)
          })
        }
        else if(pathItem instanceof GeoSvg){
          pathItem.dispatchEvent(event);
        }
      });
      if(events.get(this.address) && events.get(this.address).get(eventName)){

        events.get(this.address).get(eventName).forEach(function(eventMethod){
          eventMethod(event)
        })
      }
    }
  }
  GeoSvg.extend({
    constructor:function(){
      console.log(this);
      this.layers=new Layer('assets');
      this.layers.geosvg=this;
    },
    activateLayer:function(address){
      this.activeLayer=address;
      this.layers.getLayer(address).dispatchEvent('layerActivated')
    }
  });
  GeoSvg.Layer=Layer
})();
