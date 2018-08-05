(function(){
  const Import={
    import(options){
      this.layers.getLayer(options.layer)
      this.assets.insert(options);
    }
  }
  GeoSvg.extend(Import);

})();
