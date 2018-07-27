(function(){
  const loadBox={}

  const properties={};
  const removeAssets=function(){
    Array.from(this.element.children).forEach((img)=>{
      if(img.getAttribute('north')<loadBox.south || img.getAttribute('south')>loadBox.north || img.getAttribute('west')>loadBox.east || img.getAttribute('east')<loadBox.west){
        img.parentElement.removeChild(img);
      }
    });
  };
  const loadAssets=function(){
    for(var collectionName in this.collections){
      if(this.collections[collectionName].visible){
        this.collections[collectionName].find({
          '$and':[
            {'north':{'$gt':this.center.destinationPoint(this.height*1.5,180).lat}},
            {'south':{'$lt':this.center.destinationPoint(this.height*1.5,0).lat}},
            {'west':{'$lt':this.center.destinationPoint(this.width*1.5,90).lon}},
            {'east':{'$gt':this.center.destinationPoint(this.width*1.5,270).lon}},
          ]
        }).forEach(asset=>this.placeAsset(asset));
      }
    }
    removeAssets.call(this);
  };
  const createAssetElement=function(asset){

  }
  const viewPort={
    fixViewBox(){
      let {width,height,lat,lon} = this.viewPort;
      this.center=new LatLon(lat,lon);
      this.element.setAttribute('viewBox',[width*-.5,height*-.5,width,height].join(' '));
      loadAssets.call(this);
    },
    placeAsset(asset){
      let collectionName=asset.collection||'assets';
      let element=this.element.querySelector('g[data-collection="'+asset.collection+'"]')
      if(element){
        let img= this.element.querySelector('image[href="'+asset.href+'"]'),
        nw=new LatLon(asset.north,asset.west),
        size=nw.planeDifference(new LatLon(asset.south,asset.east)),
        position=this.center.planeDifference(nw);
        if(!img){
          img=document.createSVGElement('image');
          ['href','north','south','west','east'].forEach(prop =>  img.setAttribute(prop,asset[prop]));
          element.appendChild(img);
        }
        img.setAttribute('width',size.x);
        img.setAttribute('height',size.y);
        img.setAttribute('x',position.x);
        img.setAttribute('y',position.y);
      }
    }
  }

  Object.defineProperties(viewPort,{
    'scale':{
      get:function(){
        return properties.scale;
      },
      set:function(scale){
        properties.scale=scale;
        this.fixViewBox();
      }
    },
    'lat':{
      get:function(){
        return properties.lat;
      },
      set:function(lat){
        properties.lat=lat*1;
        this.fixViewBox();
      }
    },
    'lon':{
      get:function(){
        return properties.lon
      },
      set:function(lon){
        properties.lon=lon*1;
        this.fixViewBox();
      }
    },
    'viewPort':{
      get:function(){
        var obj={};
        ['lat','lon','width','height','north','south','west','east','scale'].forEach(prop=>obj[prop]=this[prop])
        return obj;
      },
      set:function(obj){
        if(obj.lat)properties.lat=obj.lat;
        if(obj.lon)properties.lon=obj.lon;
        if(obj.scale)properties.scale=obj.scale;
        this.fixViewBox();
      }
    },
    'width':{
      get:function(){
        return Math.round(this.element.clientWidth*this.scale*100)/100;
      }
    },
    'height':{
      get:function(){
        return Math.round(this.element.clientHeight*this.scale*100)/100;
      }
    },
    'north':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.height*.5,0).lat;
      }
    },
    'south':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.height*.5,180).lat;
      }
    },
    'west':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.width*.5,270).lon;
      }
    },
    'east':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.width*.5,90).lon;
      }
    }
  });
  GeoSvg.extend(viewPort);
})();
