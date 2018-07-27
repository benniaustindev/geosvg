(function(){

  GeoSvg.extend({
    selectCollection(collection){
      if(typeof collection === 'undefined')collection='assets'
      if(!this.collections[collection]) {
        this.collections[collection]=this.db.addCollection(collection)
      }
      return this.collections[collection];
    },
    import(options){
      let collection=this.selectCollection(options.collection)
      collection.insert(options);
    }
  });

})();
