# geosvg

## viewBox

### ViewBox (getter)

returns an object containing the minY, minY, width, height, centerX and centerY

### ViewBox (setter)

  set geoSvg.viewBox to an object containing any of [minY, minY, width, height, centerX and centerY], and the svg element's viewBox will be updated. If both a min, and center for either axis is attempted to be set, the center will take precedence. it is not necessary to set values which have not changed.
