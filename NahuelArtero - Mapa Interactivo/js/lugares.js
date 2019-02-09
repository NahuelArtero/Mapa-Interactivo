lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

  // Completa las direcciones ingresadas por el usuario a y establece los límites
  function autocompletar() {
    var circulo = new google.maps.Circle({
      map: mapa,
      center: posicionCentral,
      radius: 20000,
      visible: false,

    });
    var direccion = new google.maps.places.Autocomplete(document.getElementById('direccion'));
    var desde = new google.maps.places.Autocomplete(document.getElementById('desde'));
    var hasta = new google.maps.places.Autocomplete(document.getElementById('hasta'));
    var agregar = new google.maps.places.Autocomplete(document.getElementById('agregar'));

    direccion.setBounds(circulo.getBounds());
    desde.setBounds(circulo.getBounds());
    hasta.setBounds(circulo.getBounds());
    agregar.setBounds(circulo.getBounds());
  };

  // Inicializo la variable servicioLugares y llamo a la función autocompletar
  function inicializar() {
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

  // Busca lugares con el tipo especificado en el campo de TipoDeLugar

  function buscarCerca(posicion) {
    var radio = document.getElementById("radio").value;
    var tipoDeLugar = document.getElementById("tipoDeLugar").value;
    var request = {
      location: posicion,
      radius: radio,
      type: [tipoDeLugar],
    };
    servicioLugares.nearbySearch(request, marcadorModulo.marcarLugares);

  }
  return {
    inicializar,
    buscarCerca
  }
})()
