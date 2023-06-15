$(document).ready(function () {

$("#menuAE").load("menu.html");

if(novCarne.length === 10){
  //////////body
  var tel = "";
  if(telefono == 'null'){
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> No esta registrado</a>';
  }
  else {
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> '+telefono+'</a>';
  }
  document.getElementById("datosResultados").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novCarne+ '</a>' +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres+ ' ' +apellidos+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';

/////////////recibir los resultados


}
else if (novCarne == 'null') {
  window.location.href = "index.html";

}
else if(novCarne.length >= 1 && novCarne.length <= 9){

  //////////body
  var tel = "";
  var novE = "";
  if(telefono == 'null'){
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> No esta registrado</a>';
  }
  else {
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> '+telefono+'</a>';
  }

  if( novEstudiante == 'null'){
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong> No esta Registrado</a>';
  }
  else {
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novEstudiante+ '</a>';
  }


  document.getElementById("datosResultados").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: </strong>'+novCarne+ '</a>' + novE +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+ nombreCompleto +'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+ nombreCompleto +'<br><b>Carné: '+novCarne+'</b></a>';

  ///////////recibir los resultados

}

  verificarAsignacion();

});

var materiaSimulador = [];
var materiaEncabezado = '';
jsonHtml = '{';

//////////verificar si ya esta activa la asignacion y si ya esta asignado
function verificarAsignacion(){
  $.ajax({
       type: 'GET',
       url:  dominio + "examenLimite/3",
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       ////console.log(data.examen[0].activo);
       mensajeMostrar = data.examen.mensaje;

       if(data.examen.activo === 1){
         $.ajax({
              type: 'GET',
              url:  dominio + "buscarAsignacionPasada/" + novCarne,
              contentType: "application/json",
              dataType: 'json',
              async: false,
              success: function (data) {
              ////console.log(data.asignaciones.length);
              html = '';
              if(data.asignaciones.length > 0){
              //  //console.log("si tiene materias asignadas");

                for (i = 0; i < data.asignaciones.length; i++){
                  html += '<a id="'+data.asignaciones[i].materia+'"><img src="assets/img/img-'+data.asignaciones[i].materia+'.png" class="text-center col-lg-4 shadow  order-1 order-lg-2 hero-img img-fluid" data-aos="fade-up" alt=""></a>'
                  materiaEncabezado = data.asignaciones[i].materia;

                  jsonHtml += '"'+data.asignaciones[i].materia+ '": "' + data.asignaciones[i].id_detalle_salon+ '",';
              //  materiaSimulador.push('{"'+data.asignaciones[i].materia+ '": "' + data.asignaciones[i].id_detalle_salon+ '"}');
                  }
                  jsonHtml += '}';


                  ////console.log(jsonHtml.substring(0, jsonHtml.length -2) + '}');

                  $("#activo").html(html);
                    document.getElementById("instrucciones").innerHTML = `<a class="nav-link" style="color: black; font-size: 17px;"><strong>Instrucciones:</strong> <p class="text-left">1. Solo puedes realizar las pruebas de los requisitos
                    a los cuales estas asignado.</p><p class="text-left">2. Las pruebas tienen una duración máxima de 30 minutos
                     y constan de 15 preguntas (Física y Matemática) y de 20 preguntas (Lenguaje, Química y Biología).</p>
                     <p class="text-left">3. No respondas las pruebas al azar ya que al finalizar se te presentará tu resultado con el listado de preguntas y el criterio de cada una, el cual consta de: <br>
                                        - Criterio de pregunta con respuesta incorrecta<br>
                                        - Criterio de pregunta sin respuesta<br>
                                        - Criterio de pregunta con respuesta correcta<br>
                                        Esto te será de utilidad para reforzar los temas en los que presentes debilidades.</p></a>`;

              }
              else {
                ////console.log("no tiene materias asignadas");
                document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> Debes estar asignado a las pruebas de conocimiento básico PCB para poder realizar el simulador.</strong></a>';
              }


            },
            error: function (response) {
              alertify.set('notifier','position', 'bottom-center');
              alertify.error("error de conexión");
                }
          });
       }
       else {
         document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> '+ mensajeMostrar+'</strong></a>';
       }

     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
     });
}

/////////////////

//////////////simuladores

function simBiologia(){

  //console.log("soy sim simBiologia");
  ////console.log(jsonHtml.substring(0, jsonHtml.length -2) + '}');
  ////console.log(JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE']);
  idDetalleSalonBiologia = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['BIOLOGÍA'];
  //console.log(idDetalleSalonBiologia);

  data = JSON.stringify({
    estado_simulador: 1
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonBiologia,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          setCookie('api-nombreMateria', 'BIOLOGÍA', 1);
          setCookie('api-idTemario', 1, 1);
          window.location.href = "simuladorPR.html";

      }
  });

}

function simFisica(){
  //console.log("soy sim fisica");


  idDetalleSalonFisica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['FÍSICA'];
  console.log(idDetalleSalonFisica);

  data = JSON.stringify({
    estado_simulador: 1
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonFisica,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          setCookie('api-nombreMateria', 'FÍSICA', 1);
          setCookie('api-idTemario', 2, 1);
          window.location.href = "simuladorPR.html";

      }
  });
}

function simLenguaje(){

  //console.log("soy sim Lenguaje");
  ////console.log(jsonHtml.substring(0, jsonHtml.length -2) + '}');
  ////console.log(JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE']);
  idDetalleSalonLenguaje = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE'];
  //console.log(idDetalleSalonLenguaje);

  data = JSON.stringify({
    estado_simulador: 1
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonLenguaje,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          setCookie('api-nombreMateria', 'LENGUAJE', 1);
          setCookie('api-idTemario', 3, 1);
          window.location.href = "simuladorPR.html";

      }
  });

}

function simMatematica(){

  //console.log("soy sim simMatematica");
  ////console.log(jsonHtml.substring(0, jsonHtml.length -2) + '}');
  ////console.log(JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE']);
  idDetalleSalonMate = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['MATEMÁTICA'];
  //console.log(idDetalleSalonMate);

  data = JSON.stringify({
    estado_simulador: 1
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonMate,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          setCookie('api-nombreMateria', 'MATEMÁTICA', 1);
          setCookie('api-idTemario', 4, 1);
          window.location.href = "simuladorPR.html";

      }
  });

}

function simQuimica(){

  //console.log("soy simQuimica");
  ////console.log(jsonHtml.substring(0, jsonHtml.length -2) + '}');
  ////console.log(JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE']);
  idDetalleSalonQuimica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['QUÍMICA'];
  //console.log(idDetalleSalonQuimica);

  data = JSON.stringify({
    estado_simulador: 1
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonQuimica,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          setCookie('api-nombreMateria', 'QUÍMICA', 1);
          setCookie('api-idTemario', 5, 1);
          window.location.href = "simuladorPR.html";

      }
  });

}


//////////////

//////////////reiniciar simuladores //////////////////////

function reiniciarSimBiologia(){

  idDetalleSalonBiologia = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['BIOLOGÍA'];
  //console.log(idDetalleSalonFisica);

  data = JSON.stringify({
    estado_simulador: 2
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonBiologia,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);

          $.ajax({
                type: 'DELETE',
                url: dominio + 'deleteSimResultado/' + novCarne,
                contentType: "application/json",
                dataType: 'json',
                crossDomain: true,
                async: false,

                success: function (response) {

                      alertify.success('Se elimino correctamente');
                      setCookie('api-nombreMateria', 'BIOLOGÍA', 1);
                      setCookie('api-idTemario', 1, 1);
                      window.location.href = "simuladorPR.html";

                },
                error: function (response) {
                //   window.location.href = "index.html";
                }
        });

      }
  });

}


function reiniciarSimFisica(){

  idDetalleSalonFisica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['FÍSICA'];
  console.log(idDetalleSalonFisica);

  data = JSON.stringify({
    estado_simulador: 2
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonFisica,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);

          $.ajax({
                type: 'DELETE',
                url: dominio + 'deleteSimResultado/' + novCarne,
                contentType: "application/json",
                dataType: 'json',
                crossDomain: true,
                async: false,

                success: function (response) {

                      alertify.success('Se elimino correctamente');
                      setCookie('api-nombreMateria', 'FÍSICA', 1);
                      setCookie('api-idTemario', 2, 1);
                      window.location.href = "simuladorPR.html";

                },
                error: function (response) {
                //   window.location.href = "index.html";
                }
        });

      }
  });

}

function reiniciarSimLenguaje(){

  idDetalleSalonLenguaje = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE'];

  data = JSON.stringify({
    estado_simulador: 2
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonLenguaje,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);

          $.ajax({
                type: 'DELETE',
                url: dominio + 'deleteSimResultado/' + novCarne,
                contentType: "application/json",
                dataType: 'json',
                crossDomain: true,
                async: false,

                success: function (response) {

                      alertify.success('Se elimino correctamente');
                      setCookie('api-nombreMateria', 'LENGUAJE', 1);
                      setCookie('api-idTemario', 3, 1);
                      window.location.href = "simuladorPR.html";

                },
                error: function (response) {
                //   window.location.href = "index.html";
                }
        });

      }
  });

}

function reiniciarSimMate(){

  idDetalleSalonMate = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['MATEMÁTICA'];

  data = JSON.stringify({
    estado_simulador: 2
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonMate,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);

          $.ajax({
                type: 'DELETE',
                url: dominio + 'deleteSimResultado/' + novCarne,
                contentType: "application/json",
                dataType: 'json',
                crossDomain: true,
                async: false,

                success: function (response) {

                      alertify.success('Se elimino correctamente');
                      setCookie('api-nombreMateria', 'MATEMÁTICA', 1);
                      setCookie('api-idTemario', 4, 1);
                      window.location.href = "simuladorPR.html";

                },
                error: function (response) {
                //   window.location.href = "index.html";
                }
        });

      }
  });

}

function reiniciarSimQuimica(){

  idDetalleSalonQuimica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['QUÍMICA'];

  data = JSON.stringify({
    estado_simulador: 2
  })
  //console.log(data);

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstadoSimulador/` + novCarne + '/' + idDetalleSalonQuimica,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);

          $.ajax({
                type: 'DELETE',
                url: dominio + 'deleteSimResultado/' + novCarne,
                contentType: "application/json",
                dataType: 'json',
                crossDomain: true,
                async: false,

                success: function (response) {

                      alertify.success('Se elimino correctamente');
                      setCookie('api-nombreMateria', 'QUÍMICA', 1);
                      setCookie('api-idTemario', 5, 1);
                      window.location.href = "simuladorPR.html";

                },
                error: function (response) {
                //   window.location.href = "index.html";
                }
        });

      }
  });

}


/////////////////////////////////////


$(document).ready(function () {

  $("#BIOLOGÍA").on('click', function () {

    idDetalleSalonBiologia = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['BIOLOGÍA'];
    $.ajax({
         type: 'GET',
         url:  dominio + "buscarEstadoSimulador/" + novCarne + '/' + idDetalleSalonBiologia,
         contentType: "application/json",
         dataType: 'json',
         async: false,
         success: function (data) {
         //console.log(data.asignado.estado_simulador);
         if(data.asignado.estado_simulador === 1){
           alertify.confirm('Simulador', '¿Deseas realizar la segunda oportunidad del simulador de PCB para: BIOLOGÍA?', function(){reiniciarSimBiologia(); }
                      , function(){setCookie('api-nombreMateria', 'BIOLOGÍA', 1);
                      setCookie('api-idTemario', 1, 1);
                      window.location.href = "simuladorPR.html";});
           //simBiologia();
         }
         else if(data.asignado.estado_simulador === 2){
           alertify.set('notifier','position', 'bottom-center');
            alertify.warning("Ya realizaste las dos oportunidades del simulador: BIOLOGÍA.");
            setCookie('api-nombreMateria', 'BIOLOGÍA', 1);
            setCookie('api-idTemario', 1, 1);
            window.location.href = "simuladorPR.html";
         }
         else{

           alertify.confirm('Simulador', '¿Deseas realizar el simulador de PCB para: BIOLOGÍA?', function(){simBiologia(); }
                      , function(){ alertify.error('Puedes seleccionar otro simulador')});

         }

       },
       error: function (response) {
         alertify.set('notifier','position', 'bottom-center');
         alertify.error("error de conexión");
           }
     });


  });


    $("#FÍSICA").on('click', function () {

      idDetalleSalonFisica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['FÍSICA'];
      $.ajax({
           type: 'GET',
           url:  dominio + "buscarEstadoSimulador/" + novCarne + '/' + idDetalleSalonFisica,
           contentType: "application/json",
           dataType: 'json',
           async: false,
           success: function (data) {
           //console.log(data.asignado.estado_simulador);
           if(data.asignado.estado_simulador === 1){
             alertify.confirm('Simulador', '¿Deseas realizar la segunda oportunidad del simulador de PCB para: FÍSICA?', function(){reiniciarSimFisica(); }
                        , function(){setCookie('api-nombreMateria', 'FÍSICA', 1);
                        setCookie('api-idTemario', 2, 1);
                        window.location.href = "simuladorPR.html";});
             //simFisica();
           }
           else if(data.asignado.estado_simulador === 2){
             alertify.set('notifier','position', 'bottom-center');
              alertify.warning("Ya realizaste las dos oportunidades del simulador: FÍSICA.");
              setCookie('api-nombreMateria', 'FÍSICA', 1);
              setCookie('api-idTemario', 2, 1);
              window.location.href = "simuladorPR.html";
           }
           else{

             alertify.confirm('Simulador', '¿Deseas realizar el simulador de PCB para: FÍSICA?', function(){simFisica(); }
                        , function(){ alertify.error('Puedes seleccionar otro simulador')});

           }

         },
         error: function (response) {
           alertify.set('notifier','position', 'bottom-center');
           alertify.error("error de conexión");
             }
       });


    });

    $("#LENGUAJE").on('click', function () {

      idDetalleSalonLenguaje = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['LENGUAJE'];
      $.ajax({
           type: 'GET',
           url:  dominio + "buscarEstadoSimulador/" + novCarne + '/' + idDetalleSalonLenguaje,
           contentType: "application/json",
           dataType: 'json',
           async: false,
           success: function (data) {
           //console.log(data.asignado.estado_simulador);
           if(data.asignado.estado_simulador === 1){
             alertify.confirm('Simulador', '¿Deseas realizar la segunda oportunidad del simulador de PCB para: LENGUAJE?', function(){reiniciarSimLenguaje(); }
                        , function(){setCookie('api-nombreMateria', 'LENGUAJE', 1);
                        setCookie('api-idTemario', 3, 1);
                        window.location.href = "simuladorPR.html";});
             //simLenguaje();
           }
           else if(data.asignado.estado_simulador === 2){
             alertify.set('notifier','position', 'bottom-center');
              alertify.warning("Ya realizaste las dos oportunidades del simulador: LENGUAJE.");
              setCookie('api-nombreMateria', 'LENGUAJE', 1);
              setCookie('api-idTemario', 3, 1);
              window.location.href = "simuladorPR.html";
           }
           else{

             alertify.confirm('Simulador', '¿Deseas realizar el simulador de PCB para: LENGUAJE?', function(){simLenguaje(); }
                        , function(){ alertify.error('Puedes seleccionar otro simulador')});

           }

         },
         error: function (response) {
           alertify.set('notifier','position', 'bottom-center');
           alertify.error("error de conexión");
             }
       });

    });

    $("#MATEMÁTICA").on('click', function () {

      idDetalleSalonMate = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['MATEMÁTICA'];
      $.ajax({
           type: 'GET',
           url:  dominio + "buscarEstadoSimulador/" + novCarne + '/' + idDetalleSalonMate,
           contentType: "application/json",
           dataType: 'json',
           async: false,
           success: function (data) {
           //console.log(data.asignado.estado_simulador);
           if(data.asignado.estado_simulador === 1){
             alertify.confirm('Simulador', '¿Deseas realizar la segunda oportunidad del simulador de PCB para: MATEMÁTICA?', function(){reiniciarSimMate(); }
                        , function(){setCookie('api-nombreMateria', 'MATEMÁTICA', 1);
                        setCookie('api-idTemario', 4, 1);
                        window.location.href = "simuladorPR.html";});
            // simMatematica();
           }
           else if(data.asignado.estado_simulador === 2){
             alertify.set('notifier','position', 'bottom-center');
              alertify.warning("Ya realizaste las dos oportunidades del simulador: MATEMÁTICA.");
              setCookie('api-nombreMateria', 'MATEMÁTICA', 1);
              setCookie('api-idTemario', 4, 1);
              window.location.href = "simuladorPR.html";
           }
           else{

             alertify.confirm('Simulador', '¿Deseas realizar el simulador de PCB para: MATEMÁTICA?', function(){simMatematica(); }
                        , function(){ alertify.error('Puedes seleccionar otro simulador')});

           }

         },
         error: function (response) {
           alertify.set('notifier','position', 'bottom-center');
           alertify.error("error de conexión");
             }
       });

    });

    $("#QUÍMICA").on('click', function () {

      idDetalleSalonQuimica = JSON.parse(jsonHtml.substring(0, jsonHtml.length -2) + '}')['QUÍMICA'];
      $.ajax({
           type: 'GET',
           url:  dominio + "buscarEstadoSimulador/" + novCarne + '/' + idDetalleSalonQuimica,
           contentType: "application/json",
           dataType: 'json',
           async: false,
           success: function (data) {
           //console.log(data.asignado.estado_simulador);
           if(data.asignado.estado_simulador === 1){
             alertify.confirm('Simulador', '¿Deseas realizar la segunda oportunidad del simulador de PCB para: QUÍMICA?', function(){reiniciarSimQuimica(); }
                        , function(){setCookie('api-nombreMateria', 'QUÍMICA', 1);
                        setCookie('api-idTemario', 5, 1);
                        window.location.href = "simuladorPR.html";});
            // simQuimica();
           }
           else if(data.asignado.estado_simulador === 2){
             alertify.set('notifier','position', 'bottom-center');
              alertify.warning("Ya realizaste las dos oportunidades del simulador: QUÍMICA.");
              setCookie('api-nombreMateria', 'QUÍMICA', 1);
              setCookie('api-idTemario', 5, 1);
              window.location.href = "simuladorPR.html";
           }
           else{

             alertify.confirm('Simulador', '¿Deseas realizar el simulador de PCB para: QUÍMICA?', function(){simQuimica(); }
                        , function(){ alertify.error('Puedes seleccionar otro simulador')});

           }

         },
         error: function (response) {
           alertify.set('notifier','position', 'bottom-center');
           alertify.error("error de conexión");
             }
       });

    });



});

$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
