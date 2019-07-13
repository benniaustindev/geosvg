(function(){
  const events=new Map();
  class Layer{
    constructor(loki,root){
      this.root=root;
      this.id=loki.$loki;
    }
    get loki(){
      return this.root.db.get(this.id);
    }
    set loki(newValues){
      newValues=Object.assign(this.loki,newValues);

      this.root.db.update(newValues);
      return newValues;
    }
    get order(){
      return this.loki.order;
    }
    insertChild(child,newIndex=0){
      child.parent=this;
      this.children.forEach((child,i)=>{
        let childDoc=child.loki;
            childDoc.order=i+1;
            child.loki=childDoc;
      })

    }

    toggleVisibility(){}
    get parent(){
      const parent=this.loki.parent;
      if(!parent)return null;
      return new Layer(this.root.db.get(parent),this.root);

    }
    set parent(newParent){
      const oldParent=this.parent;
      const childDoc=this.loki;
      childDoc.parent=newParent.id;
      childDoc.order=0;
      this.loki=childDoc;
      this.dispatchEvent('insertLayer',{
        oldParent:oldParent
      });
    }

    get visibility(){
      return this.loki.visibility;
    }
    set visibility(value){
      if(this.visibility!==value){

        const doc=this.loki;
        if(doc.visibility!==value){
          doc.visibility=value;
          this.loki=doc;
          this.dispatchEvent((value==='hidden')?'layerHide':'layerShow');
        }
      }

    }
    get children(){
      return this.root.db.find({parent:this.id}).sort((a,b)=>a.order>b.order).map(childDoc=>new Layer(childDoc,this.root));
    }
    get name(){
      return this.loki.name;
    }
    set name(name){
      const doc=this.loki;
      doc.name=name;
      this.loki=doc;
      this.dispatchEvent('renameLayer');
      return this;
    }
    get address(){
      let arr=[this.name];
      let layer=this.parent;
      while(layer){
        arr.unshift(layer.name);
        layer=layer.parent;
      }
      return arr.join('.');
    }

    addEventListener(eventName,method){
      if(!events[this.id]) this.events[this.address]=new Map();
      if(!events[this.id].has(eventName))events.get(this.address).set(eventName,[]);
      events[this.id].get(eventName).push(method)
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
      eventProperties.path.push(this.root)
      eventProperties.path.push(this.root.geosvg)
      eventProperties.path.push(this.geosvg)
      const event=new GeoSvgEvent(eventName,eventProperties)
      event.path.forEach((pathItem)=>{
        if(pathItem instanceof Layer &&  events.has(pathItem.address) && events.get(pathItem.address).get(eventName)){
          events[pathItem.id].get(eventName).forEach((eventMethod)=>{
            eventMethod(event);
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





  class Layers {
    constructor(geosvg){
      this.geosvg=geosvg;
      this.db=geosvg.db.addCollection('layers');
    }
    getLayerById(id){
      return new Layer(this.db.get(id),this);
    }
    findLayer(address){
      const path=address.split('.');
      let layerName;
      let layer=this;
      while (path.length){
        layerName=path.shift();
        let childLayer=layer.children.find(child=>child.name==layerName);
        if(!childLayer){
          childLayer=this.createLayer(layerName)
          if(layer.insertChild)layer.insertChild(childLayer);

        }
        layer=childLayer;
      }
      return layer;
    }
    createLayer(name){
      const doc=this.db.insert({
        name:name,
        visibility:'visible',
        order:0
      });
      const newLayer= new Layer(doc,this);
      return newLayer;
    }
    get children(){
      return this.db.find({parent:undefined}).map((result)=>new Layer(result,this))
    }
    set children(children){
      return this.children;
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
      this.layers=new Layers(this);
      this.layers.geosvg=this;

    },
    activateLayer:function(address){
      this.activeLayer=address;
      this.layers.getLayer(address).dispatchEvent('layerActivated')
    }
  });
  GeoSvg.Layer=Layer
})();





class Layer_old {
  constructor(name,parent){
    this.name=name;
    this.parent=parent;
    this.children=[];
    this.visibility='visible';
  }
  hide(){
    this.visibility='hidden';
    this.dispatchEvent('layerHide')
  }
  show(){
    this.visibility='visible';
    this.dispatchEvent('layerShow')
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
    name.unshift(layer.name)
    return name.join('.');
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
  rename(newName){
    const oldName=this.name;
    const oldAddress=this.address;
    this.name=newName;
    const newAddress=this.address;
    const elements=Array.from(document.querySelectorAll('[data-layer^="'+oldAddress+'"]')).forEach(element=>{
      if(element.dataset.layer===oldAddress)element.setAttribute('data-layer',newAddress);
      else {
        element.setAttribute('data-layer',newAddress+element.dataset.layer.substring(newAddress.length+1));
      }
    });
  }
}
