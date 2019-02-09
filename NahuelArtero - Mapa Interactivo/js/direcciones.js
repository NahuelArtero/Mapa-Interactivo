direccionesModulo = (function () {
  var servicioDirecciones // Servicio que calcula las direcciones
  var mostradorDirecciones // Servicio muestra las direcciones

  // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
  function calcularRutasConClic() {
    document.getElementById('comoIr').addEventListener('change', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    document.getElementById('calcularMuchos').addEventListener('click', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    var listasLugares = document.getElementsByClassName('lugares')
    for (var j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener('change', function () {
        if (document.getElementById('desde').value != '' && document.getElementById('desde').value != '') {
          direccionesModulo.calcularYMostrarRutas()
        }
      })
    }
  }

  // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  function agregarDireccionEnLista(direccion, coord) {
    var lugaresIntermedios = document.getElementById('puntosIntermedios')

    var haceFaltaAgregar = true
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, ' ') === direccion.replace(/\r?\n|\r/g, ' ')) {
        haceFaltaAgregar = false
      }
    }
    if (haceFaltaAgregar) {
      var opt = document.createElement('option')
      opt.value = coord
      opt.innerHTML = direccion
      lugaresIntermedios.appendChild(opt)
    }
  }

  // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  function agregarDireccionYMostrarEnMapa(direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
    streetViewModulo.fijarStreetView(ubicacion)
    marcadorModulo.mostrarMiMarcador(ubicacion)
  }

  function agregarDireccion(direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
  }

  // Inicializo las variables que muestra el panel y el que calcula las rutas//
  function inicializar() {
    calcularRutasConClic()
    // Agrega la direccion cuando se presioná enter en el campo agregar
    $('#agregar').keypress(function (e) {
      if (e.keyCode == 13) {
        var direccion = document.getElementById('agregar').value
        geocodificadorModulo.usaDireccion(direccion, direccionesModulo.agregarDireccion)
      }
    })
    // Calcula las rutas cuando se presioná enter en el campo desde y hay un valor disitnto a vacío en 'hasta'
    $('#desde').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('hasta').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })

    // Calcula las rutas cuando se presioná enter en el campo hasta y hay un valor disitnto a vacío en 'desde'
    $('#hasta').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('desde').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })
    servicioDirecciones = new google.maps.DirectionsService()
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById('directions-panel-summary'),
      suppressMarkers: true
    })
  }

  // Calcula la ruta entre los puntos Desde y Hasta con los puntosIntermedios
  // dependiendo de la formaDeIr que puede ser Caminando, Auto o Bus/Subterraneo/Tren
  function calcularYMostrarRutas() {
    var desde = document.getElementById('desde').value;
    var hasta = document.getElementById('hasta').value;
    var medioDeTransporte = document.getElementById("comoIr").value;
    var puntos = document.getElementById("puntosIntermedios");
    var lugaresIntermedios = [];
    for (var i = 0; i < puntos.length; i++) {
      if (puntos.options[i].selected) {
        lugaresIntermedios.push({
          location: puntos[i].value,
          stopover: true
        });
      }
    }
    // Agrega el marcador del comienzo con una A
    marcadorModulo.agregarMarcadorRuta(document.getElementById('desde').value, 'A', true)
    // Agrega los marcadores de los puntos intermedios con letras consecutivas.
    for (var i = 0; i < lugaresIntermedios.length; i++) {
        // console.log(ptsIntermedios[i].location);
        var letter = String.fromCharCode('B'.charCodeAt(0) + i)
        marcadorModulo.agregarMarcadorRuta(lugaresIntermedios[i].location, letter, false)
    }
    marcadorModulo.agregarMarcadorRuta(document.getElementById('hasta').value, String.fromCharCode('B'.charCodeAt(0) + lugaresIntermedios.length), false)


    if (medioDeTransporte === 'Auto') {
      medioDeTransporte = google.maps.TravelMode.DRIVING
    } if (medioDeTransporte === 'Caminando') {
      medioDeTransporte = google.maps.TravelMode.WALKING
    } if (medioDeTransporte === 'Bus/Subterraneo/Tren') {
      medioDeTransporte = google.maps.TravelMode.TRANSIT
    };

    var request = {
      origin: desde,
      destination: hasta,
      travelMode: medioDeTransporte,
      waypoints: lugaresIntermedios,
      optimizeWaypoints: true
    };


    servicioDirecciones.route(request, function (result, status) {
      if (status == 'OK') {
        mostradorDirecciones.setDirections(result);
      } else {
        window.alert('La direccion no tuvo éxito debido a: ' + status);
      }
    });
  }

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas
  }
})()
