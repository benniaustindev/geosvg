(function(){

  const properties={};
  const removeAssets=function(){
    Array.from(this.element.children).forEach((img)=>{
      if(img.getAttribute('north')<this.south || img.getAttribute('south')>this.north || img.getAttribute('west')>this.east || img.getAttribute('east')<this.west){
        img.parentElement.removeChild(img);
      }
    });
  };
  const loadAssets=function(){
    this.assets.find({
      '$and':[
        {'north':{'$gt':this.south}},
        {'south':{'$lt':this.north}},
        {'west':{'$lt':this.east}},
        {'east':{'$gt':this.west}},
      ]
    }).forEach((asset)=>{
      let img= this.element.querySelector('image[href="'+asset.href+'"]'),
          nw=new LatLon(asset.north,asset.west),
          size=nw.planeDifference(new LatLon(asset.south,asset.east)),
          position=new LatLon(this.lat,this.lon).planeDifference(nw);
      if(!img){
        img=document.createSVGElement('image');
        ['href','north','south','west','east'].forEach(prop =>  img.setAttribute(prop,asset[prop]));
        this.element.appendChild(img);
      }
      img.setAttribute('width',size.x);
      img.setAttribute('height',size.y);
      img.setAttribute('x',position.x);
      img.setAttribute('y',position.y);
    });
    removeAssets.call(this);
  };

  const viewPort={
    fixViewBox(){
      //get the center coord
      let {north,west,width,height,lat,lon} = this.viewPort;
      this.element.setAttribute('viewBox',[width*-.5,height*-.5,width,height].join(' '));
      loadAssets.call(this);
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
        return this.element.clientWidth*this.scale;
      }
    },
    'height':{
      get:function(){
        return this.element.clientHeight*this.scale;
      }
    },
    'north':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.height*1.5,0).lat;
      }
    },
    'south':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.height*1.5,180).lat;
      }
    },
    'west':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.width*1.5,270).lon;
      }
    },
    'east':{
      get:function(){
        return new LatLon(this.lat,this.lon).destinationPoint(this.width*1.5,90).lon;
      }
    }
  });
  GeoSvg.extend(viewPort);
})();
