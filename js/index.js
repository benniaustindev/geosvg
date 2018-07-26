document.addEventListener('DOMContentLoaded',function(){
  document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
  window.geosvg=new GeoSvg(document.getElementById('geosvg'));


  function parseFileName(fileName){
    let obj={}
    obj.href=fileName;
    let coordset=fileName.replace('.png','').split('/');
        coordset=coordset[coordset.length-1].split(',');

    obj.north=coordset[0]*1;
    obj.west=coordset[1]*1;
    obj.south=coordset[2]*1;
    obj.east=coordset[3]*1;
    return obj;
  }
  var fileOptions;
  var lats=[];
  var lons=[];
  files.forEach(path=>{
    fileOptions=parseFileName(path)
    lats.push(fileOptions.north)
    lats.push(fileOptions.south)
    lons.push(fileOptions.west)
    lons.push(fileOptions.east)
    geosvg.importImage(fileOptions);
  });
  var lat=(fileOptions.north+fileOptions.south)/2
  var lon=(fileOptions.west+fileOptions.east)/2
  console.log(lat)
  console.log(lon)
  geosvg.viewPort={
    scale:.25 , //1 px=scale meters
    lat:lats.reduce((a,b)=> a+b)/lats.length,
    lon:lons.reduce((a,b)=> a+b)/lons.length,
  }
  //console.log()
  //console.log(geosvg.viewPort)
})
