$(document).ready(function () {

  $("#selCentros").hide();
  $("#selFacultades").hide();

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

}


adAsignacion();


});

var datosAsignacion = [];
var facultadConstancia = "";
var centroConstancia = "";

//////////asignacion activa o desactivada
function adAsignacion() {
  idCentro = $("#selbox").val();
  $('.selectpicker').selectpicker();

  $.ajax({
    type: 'GET',
    url: dominio + "examenLimite/1",
    contentType: "application/json",
    dataType: 'json',
    async: false,
    success: function (data) {
      //console.log(data.examen[0].activo);
      mensajeMostrar = data.examen.mensaje;

      if (data.examen.activo === 1) {
        verificarResultadoAsignacion();
      }
      else {
        //document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> '+ data.examen.mensaje +'</strong></a>';
        $.ajax({
          type: 'GET',
          url: dominio + "buscarAsignacionPasada/" + novCarne,
          contentType: "application/json",
          dataType: 'json',
          async: false,
          success: function (data) {
            //console.log(data.asignaciones.length);

            if (data.asignaciones.length > 0) {

              $("#selCentros").hide();
              $("#selFacultades").hide();
              $("#visorPDF").show();

              /////////////crear pdf
              const builder = PDFBuilder.jsPDFBuilder;
              try{
                if(novCarne.toString().length === 10){
                  builder.setName(nombres + " " + apellidos)
                }else{
                  builder.setName(nombreCompleto)
                }
                builder.setNov(novCarne)
                  .setFechaNacimiento(fechaNacimiento)
                  .setAsignaciones(data.asignaciones);
              }catch(err){
                console.error('error al colocar valores', err);
                return;
              }

              /////////////////////////////////////////////////

              //pdf.save(carneEmpleado + '.pdf');
              
              //  console.log(out);
              var url = builder.build();
              //console.log(url);
              //  PDFObject.embed('data:application/pdf;base64,' + btoa(out), '#visorPDF');

              //console.log(datosAsignacion);
              //  $('#pPDf').attr('src', url)
              document.getElementById("visorPDF").innerHTML = '<iframe src="' + url + ' #view=fitH" width= "70%" height="100%"></iframe>';
              document.getElementById("visorPDF").innerHTML = '<object data="' + url + '" type="application/pdf" width= "100%" height="100%"> <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf de tu constancia de asignación, pero la puedes <a href="' + url + '"> Descargar aquí</a></p> </object>';


            }
            else {
              document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> ' + mensajeMostrar + '</strong></a>';
            }


          },
          error: function (response) {
            alertify.set('notifier', 'position', 'bottom-center');
            alertify.error("Usuario o Contraseña Incorrecto!");
          }
        });

      }


    },
    error: function (response) {
      alertify.set('notifier', 'position', 'bottom-center');
      alertify.error("error de conexión");
    }
  });
}

//////////hacer consulta de Resultados
function facultades() {
  idCentro = $("#selbox").val();
  $('.selectpicker').selectpicker();

 $.ajax({
      type: 'GET',
      url:  dominio + "buscarFacultadActiva/" + idCentro + "/1",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
    //  console.log(data);

    // html = "";
      const selectFacultad = document.querySelector("#selFacultad");
    for (let i = selectFacultad.options.length; i >= 0; i--) {
   selectFacultad.remove(i);
 }

     var option = document.createElement('option');
     option.text = 'Selecciona Unidad Académica';
     option.value = 0;
     selectFacultad.appendChild(option);
      for(i=0; i<data.facultad.length; i++){
        option = document.createElement('option');
    //    console.log(option.text = data.facultad[i].nombre);
        //html += '<option value="'+data.centros[i].id+'">'+data.centros[i].nombre+'</option>';
        option.value = data.facultad[i].id_facultad;
        option.text = data.facultad[i].nombre;
        selectFacultad.appendChild(option);
      }
      $('#selFacultad').selectpicker('refresh');

    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("error de conexión");
        }
  });
}

//////////////buscar resultados si ya esta asignado


function verificarResultadoAsignacion() {

  $.ajax({
    type: 'GET',
    url: dominio + "buscarAsignacionPasada/" + novCarne,
    contentType: "application/json",
    dataType: 'json',
    async: false,
    success: function (data) {
      //console.log(data);

      if (data.asignaciones.length > 0) {

        $("#selCentros").hide();
        $("#selFacultades").hide();
        $("#visorPDF").show();

        /////////////crear pdf

        const builder = PDFBuilder.jsPDFBuilder;
        try {
          if (novCarne.toString().length === 10) {
            builder.setName(nombres + " " + apellidos)
          } else {
            builder.setName(nombreCompleto)
          }
          builder.setNov(novCarne.toString())
            .setFechaNacimiento(fechaNacimiento)
            .setAsignaciones(data.asignaciones);
        } catch (err) {
          console.error('error al colocar valores', err);
          return;
        }

        /////////////////////////////////////////////////

        //pdf.save(carneEmpleado + '.pdf');
        
        //  console.log(out);
        var url = builder.build();
        //console.log(url);
        //  PDFObject.embed('data:application/pdf;base64,' + btoa(out), '#visorPDF');

        //console.log(datosAsignacion);
        //  $('#pPDf').attr('src', url)
        document.getElementById("visorPDF").innerHTML = '<iframe src="' + url + ' #view=fitH" width= "70%" height="100%"></iframe>';
        document.getElementById("visorPDF").innerHTML = '<object data="' + url + '" type="application/pdf" width= "100%" height="100%"> <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf de tu constancia de asignación, pero la puedes <a href="' + url + '"> Descargar aquí</a></p> </object>';


      } else {

        alertify.set('notifier', 'position', 'bottom-center');
        $("#selCentros").show();
        $("#selFacultades").show();
        $("#visorPDF").hide();
        document.getElementById("btnAsignar").innerHTML = '<button class="btn btn-primary btn-lg botonAsignar" type="submit" id="">Asignar</button>';


      }


    },
    error: function (response) {
      alertify.set('notifier', 'position', 'bottom-center');
      alertify.error("Usuario o Contraseña Incorrecto!");
    }
  });

}


//////////////////////////


////////////////////////verificar resultado y cupo para Asignar
cupoAsignacion = [];
/////////buscar resultados
function verificarResultado(){


  idCentro = $("#selbox").val();
  idFacultad = $("#selFacultad").val();
  $.ajax({
    type: 'GET',
    url:  dominio + "buscarFechaExamen/" + idFacultad + "/" + idCentro + "/1",
    contentType: "application/json",
    dataType: 'json',
    async: false,
        beforeSend: function() {
            $('#btnAsignar').html("<img src='assets/img/cargando.gif' />"); // Muestro el Spinner (Animación)
        },
    })

    .done(function(data) {
      var cantidadMaterias = 0;
      $.ajax({

           type: 'GET',
           url:  dominio + "facultadMaterias/" + idCentro + "/" + idFacultad,
           contentType: "application/json",
           dataType: 'json',
           async: false,
           success: function (data) {
            // console.log(data.materias.length);
         //  console.log(data.contador[0].count);
            cantidadMaterias = data.materias.length;


         },
         error: function (response) {
           alertify.set('notifier','position', 'bottom-center');
           alertify.error("Error de conexión");
             }
       });
       ///console.log(cantidadMaterias);
       ///console.log(data.DETALLEFACULTAD.length);

       if(cantidadMaterias === data.DETALLEFACULTAD.length){
         cupoAsignacion.length = 0;

         if(data.DETALLEFACULTAD.length > 0) {

           for (i = 0; i < data.DETALLEFACULTAD.length; i++){
             //  buscarAsignacion(data.DETALLEFACULTAD[i].fecha_examen, data.DETALLEFACULTAD[i].id_materia, data.DETALLEFACULTAD[i].id_tablads, data.DETALLEFACULTAD[i].cupo, data.DETALLEFACULTAD[i].id_salon);
               buscarCupo(data.DETALLEFACULTAD[i].id_tablads, data.DETALLEFACULTAD[i].fecha_examen, data.DETALLEFACULTAD[i].cupo, data.DETALLEFACULTAD[i].id_materia);
           }

         }
         else
         {
             $('#btnAsignar').html('<p>cargando...</p><img src="assets/img/cargando.gif" />');
           alertify.set('notifier','position', 'bottom-center');
           var duration = 15;
           var msg = alertify.warning('La unidad académica seleccionada no cuenta con salones creados,  comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte. ', 15, function(){ clearInterval(interval);});
           var interval = setInterval(function(){
                   msg.setContent('La unidad académica seleccionada no cuenta con salones creados,  comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte. ');
                 },1000);
           document.getElementById("btnAsignar").innerHTML = '<button class="btn btn-primary btn-lg botonAsignar" type="submit" id="">Asignar</button>';

           $(".botonAsignar").on('click', function () {
             var selCentro = document.getElementById("selbox");
             var centroSelect= selCentro.options[selCentro.selectedIndex].text;

             var selUnidad = document.getElementById("selFacultad");
             var unidadSelect= selUnidad.options[selUnidad.selectedIndex].text;

             if(centroSelect === 'Selecciona Centro Universitario'){
               alertify.set('notifier','position', 'bottom-center');
               alertify.warning("Debes seleccionar un centro universitario. Para poder asignarte.");

             }
             else{

               if(unidadSelect === 'Selecciona Unidad Académica'){
                 alertify.set('notifier','position', 'bottom-center');
                 alertify.warning("Debes seleccionar una unidad académica (Facultad/Escuela). Para poder asignarte.");

               }
               else {

               alertify.confirm('Asignación', '¿Deseas Asignarte al centro universitario: ' + centroSelect + ', a la unidad académica:  ' + unidadSelect + '?', function(){verificarResultado(); verificarCupo();if(asignacionJson.length > 0){generarAsignacion()};; }
                          , function(){ alertify.error('Vuelve a seleccionar las opciones de nuevo')});
                   }

             }

           });
         }
       }
       else {
         alertify.set('notifier','position', 'bottom-center');
         var duration = 15;
         var msg = alertify.warning('La unidad académica seleccionada no cuenta con uno o varios salones creados,  comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte. ', 15, function(){ clearInterval(interval);});
         var interval = setInterval(function(){
                 msg.setContent('La unidad académica seleccionada no cuenta con uno o varios salones creados,  comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte. ');
               },1000);
         document.getElementById("btnAsignar").innerHTML = '<button class="btn btn-primary btn-lg botonAsignar" type="submit" id="">Asignar</button>';

         $(".botonAsignar").on('click', function () {
           var selCentro = document.getElementById("selbox");
           var centroSelect= selCentro.options[selCentro.selectedIndex].text;

           var selUnidad = document.getElementById("selFacultad");
           var unidadSelect= selUnidad.options[selUnidad.selectedIndex].text;

           if(centroSelect === 'Selecciona Centro Universitario'){
             alertify.set('notifier','position', 'bottom-center');
             alertify.warning("Debes seleccionar un centro universitario. Para poder asignarte.");

           }
           else{

             if(unidadSelect === 'Selecciona Unidad Académica'){
               alertify.set('notifier','position', 'bottom-center');
               alertify.warning("Debes seleccionar una unidad académica (Facultad/Escuela). Para poder asignarte.");

             }
             else {

             alertify.confirm('Asignación', '¿Deseas Asignarte al centro universitario: ' + centroSelect + ', a la unidad académica:  ' + unidadSelect + '?', function(){verificarResultado(); verificarCupo();if(asignacionJson.length > 0){generarAsignacion()};; }
                        , function(){ alertify.error('Vuelve a seleccionar las opciones de nuevo')});
                 }

           }

         });
       }

})

// Este método es para manejar algún error al obtener los datos
.fail(function(data) {
  alertify.set('notifier','position', 'bottom-center');
  alertify.error("Error de conexión");
    //
});

}

///////////buscar cupo en los salones que se quiere asignar
function buscarCupo(idDetalleSalon, fechaExamen, cupo, idMateria){
 $.ajax({
      type: 'GET',
      url:  dominio + "asignadosPorSalon/" + idDetalleSalon + "/" + fechaExamen,
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {

      if(novCarne.length === 10){

        cupoAsignacion.push([idMateria, idDetalleSalon, novCarne, 0, parseInt(data.contador[0].count), cupo, fechaExamen]);

      }
      else if(novCarne.length >= 1 && novCarne.length <= 9){

      cupoAsignacion.push([idMateria, idDetalleSalon, novCarne, novEstudiante, parseInt(data.contador[0].count), cupo, fechaExamen]);

      }


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("error de conexión");
        }
  });

}


function verificarCupo(){

contadorCUpo = 0;
//console.log(cupoAsignacion);

for(i = 0; i < cupoAsignacion.length; i++) {

  if(cupoAsignacion[i][4] >= cupoAsignacion[i][5]){
     contadorCUpo += 1;
  }
  else {

  //  console.log("no");
  }

}

if(contadorCUpo > 0){
  alertify.set('notifier','position', 'bottom-center');
  alertify.error("No se puede asignar en este momento, espacio no disponible en esta unidad académica. Comunicate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte.");
  $('#btnAsignar').html("");
}
else {

  for(i = 0; i < cupoAsignacion.length; i++) {

    buscarResultado(cupoAsignacion[i][0], cupoAsignacion[i][1], cupoAsignacion[i][2], cupoAsignacion[i][3], cupoAsignacion[i][4], cupoAsignacion[i][6]);

  }

}

}


function buscarResultado(idMateria, idDetalleSalon, novOCarne, novEstudiante, contadorAsignado, fechaExamen){

$.ajax({
      type: 'GET',
      url:  dominio + "resultadoPorAsignacionNC/" + novOCarne + "/" + novEstudiante + "/" + idMateria + "/1",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
    //  console.log(data);

     if(data.RESULTADO.length === 0){
        ////////insertar en la tabla asignacion
        numeroUltimoAsignado(idDetalleSalon, novCarne, contadorAsignado, fechaExamen);
        //agregarAsignacion(idDetalleSalon, novCarne, contadorAsignado, fechaExamen);

      }
      else{
        if(idMateria === 1){
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Ya has ganado el requisito BIOLOGÍA, ve al menú de Resultados para descargar la constancia.");
        }
        else if (idMateria === 2) {
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Ya has ganado el requisito FÍSICA, ve al menú de Resultados para descargar la constancia.");

        }
        else if (idMateria === 3) {
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Ya has ganado el requisito LENGUAJE, ve al menú de Resultados para descargar la constancia.");

        }
        else if (idMateria === 4) {
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Ya has ganado el requisito MATEMÁTICA, ve al menú de Resultados para descargar la constancia.");

        }
        else if (idMateria === 5) {
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Ya has ganado el requisito QUÍMICA, ve al menú de Resultados para descargar la constancia.");

        }

        document.getElementById("btnAsignar").innerHTML = '';

      }


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Error de conexión!");
        }
  });

}

function numeroUltimoAsignado(idDetalleSalon, novCarne, contadorAsignado, fechaExamen){
  $.ajax({
       type: 'GET',
       url:  dominio + "ultimoAsignadoPorSalon/" + idDetalleSalon + "/" + fechaExamen,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {

        if(data.ultimo_asingado.length === 0) {
          agregarAsignacion(idDetalleSalon, novCarne, contadorAsignado, fechaExamen, 1);
        }
        else {

         if(contadorAsignado  < data.ultimo_asingado[0].asignacion){
           agregarAsignacion(idDetalleSalon, novCarne, contadorAsignado, fechaExamen, 2);
         }
         else {
           agregarAsignacion(idDetalleSalon, novCarne, contadorAsignado, fechaExamen, 1);
         }
        }
     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("Error de conexión!");
         }
   });

}


var asignacionJson = [];

function agregarAsignacion(idDetalleSalon, novCarne, contadorAsignado, fechaExamen, sumadorContador){

  var fechajs = new Date();
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  var fechaNa =  hoy.toLocaleDateString().split("/");
  var fechaFormato = fechaNa[2] +"-"+ fechaNa[1]+"-"+ fechaNa[0];



  //console.log(contadorAsignado);
  sumadorAsignados = parseInt(contadorAsignado) + sumadorContador;

  data = JSON.stringify({
  id_detalle_salon: idDetalleSalon,
  nov: novCarne,
  asignacion: sumadorAsignados,
  fecha_examen: fechaExamen,
  asignado_por: nombres + ' ' + apellidos,
  fecha_asignacion: fechaFormato
})

asignacionJson.push(data);
}


  /*// Listen for messages
  socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
  });

  const sendMessage = () => {
      socket.send('');
  }*/

function generarAsignacion() {

  data = JSON.stringify(asignacionJson);

$.ajax({
     type: 'POST',
     url: dominio + 'insertarAsignacion',
     contentType: "application/json",
     dataType: 'json',
     crossDomain: true,
     async: false,
     data: data,
     success: function (response) {

        $("#selCentros").hide();
        $("#selFacultades").hide();
        $('#btnAsignar').html('<p style="color: black; font-size: 25px;"> <strong> Espera un momento, se está generando tu constancia de inscripción a las PCB, no cierres esta ventana ni refresques el navegador. </strong></p><p>cargando...</p><img src="assets/img/cargando.gif" />');
        location.reload();
     },
     error: function (response) {
       //  window.location.href = "index.html";
     }
 });
}

////////////////////////////////////

////////////////////


////////////parte asignar botonAsignar


$(document).ready(function () {

$(".botonAsignar").on('click', function () {

  $.ajax({
 type: 'GET',
 url:  dominio + "examenLimite/1",
 contentType: "application/json",
 dataType: 'json',
 async: false,
 success: function (data) {
 //console.log(data.examen[0].activo);
 mensajeMostrar = data.examen.mensaje;

 if(data.examen.activo === 1)
 {

   var selCentro = document.getElementById("selbox");
   var centroSelect= selCentro.options[selCentro.selectedIndex].text;

   var selUnidad = document.getElementById("selFacultad");
   var unidadSelect= selUnidad.options[selUnidad.selectedIndex].text;

   if(centroSelect === 'Selecciona Centro Universitario'){
     alertify.set('notifier','position', 'bottom-center');
     alertify.warning("Debes seleccionar un centro universitario. Para poder asignarte.");

   }
   else{

     if(unidadSelect === 'Selecciona Unidad Académica'){
       alertify.set('notifier','position', 'bottom-center');
       alertify.warning("Debes seleccionar una unidad académica (Facultad/Escuela). Para poder asignarte.");

     }
     else {

     alertify.confirm('Asignación', '¿Deseas Asignarte al centro universitario: ' + centroSelect + ', a la unidad académica:  ' + unidadSelect + '?', function(){verificarResultado(); verificarCupo();if(asignacionJson.length > 0){generarAsignacion()};; }
                , function(){ alertify.error('Vuelve a seleccionar las opciones de nuevo')});
         }

   }

 }
 else {

   alertify.set('notifier','position', 'bottom-center');
   alertify.warning("La fecha de asignación está cerrada.");
   location.reload();

 }



},
error: function (response) {
 alertify.set('notifier','position', 'bottom-center');
 alertify.error("Usuario o Contraseña Incorrecto!");
   }
});

//verificarResultado();
//verificarCupo();

});

});


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
