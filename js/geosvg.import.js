(function(){
  const Import={
    import(options){
      this.layers.findLayer(options.layer)
      this.assets.insert(options);
    }
  }
  GeoSvg.extend(Import);

})();
