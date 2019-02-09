streetViewModulo = (function () {
  var panorama; // 'Visor' de StreetView

  function inicializar() {

    var opciones = {
      position: posicionCentral,
      pov: {
        heading: 34,
        pitch: 10
      }
    }
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), opciones);
  }

  // Actualiza la ubicación del Panorama
  function fijarStreetView(ubicacion) {
    panorama.setPosition(ubicacion);
    /* Completar la función fijarStreetView que actualiza la posición
     de la variable panorama y cambia el mapa de modo tal que se vea
     el streetView de la posición actual. */
  }

  return {
    inicializar,
    fijarStreetView
  }
})()
