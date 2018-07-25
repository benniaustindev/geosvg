

# geosvg

## Dependancies

 * **latlon-spherical.js** from https://github.com/chrisveness/geodesy
 * **Loki.js.js** from https://github.com/techfort/LokiJS

## quickstart
assuming this HTML:

    <svg id="geosvg" width="300" height="300" ></svg>


Use this javascript:

    //create a geosvg object

    const geosvg=new GeoSvg(document.getElementById('geosvg'));

    //import an asset
    geosvg.import({
      "href":"assets/example.png",
      "north":44.9313863113211,
      "west":-93.0802598953383,
      "south":44.929885978345894,
      "east":-93.0781445774379
    });

    //move the viewport
    geosvg.viewPort={
      lat:44.9306361448335,
      lon:-93.0792022363881
    }

## viewPort

### geosvg.viewPort [getter]

returns an object containing the lat, lon, width, height, north, south, west, east, and scale values of the current view

### geosvg.viewPort [setter]

set to an object containing any of lat, lon and scale, and the svg element's viewBox will be updated. It is not necessary to set values which have not changed.

### geosvg.lat, geosvg.lon [getter]

returns the current latitude or longitude at the center of the current view

### geosvg.lat, geosvg.lon [setter]

set to a decimal latitude or longitude, and the viewport will be updated

### geosvg.scale [getter]

returns the current conversion ratio from pixels to meters

### geosvg.scale [setter]

set the the number of meters you with 1 pixel to represent


### geosvg.width, geosvg.height [getter only]

returns the width or height of the current visible area in meters

### geosvg.north, geosvg.south, geosvg.west, geosvg.east [getter only]

returns the edge of the viewport, as it extends past the actual visible area

## Import image

### geosvg.import({object});

Import a new image into the geosvg assets library the object expects a path, and all of the following: [north,south,west,east] which are latitudes and longitudes which describe the farthest edges of the image.
