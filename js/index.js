  const geosvg=new GeoSvg();

  geosvg.addEventListener('ready',function(){
    geosvg.element=document.getElementById('geo')


  function parseFileName(fileName){
    let coordset=fileName.replace('.png','').split('/');
        coordset=coordset[coordset.length-1].split(',');
    return obj={
      type:'image',
      layer:'assets.Saint Paul.Orthography',
      href:fileName,
      north:coordset[0]*1,
      west:coordset[1]*1,
      south:coordset[2]*1,
      east:coordset[3]*1
    }
  }
  var lats=[];
  var lons=[];


  files.forEach(path=>{
    fileOptions=parseFileName(path)
    lats.push(fileOptions.north)
    lats.push(fileOptions.south)
    lons.push(fileOptions.west)
    lons.push(fileOptions.east)
    geosvg.import(fileOptions);
  });
  geosvg.viewPort={
    scale:.6, //1 px=scale meters
    lat:44.94291074016926,
    lon:-93.09441367328247,
  }
});
