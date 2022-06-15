$(document).ready(function () {
  $("#seleccionCursos").hide();
  $("#generarBoletaCursos").hide();


$("#menuAE").load("menu.html");
costoTotal = 0;
/*
$("#footerDiv").load("footer.html");*/

if(novCarne.length === 10){
  //////////body


  document.getElementById("datosGenerales").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novCarne+ '</a>' +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres + ' '+ apellidos+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';


}
else if (novCarne == 'null') {
  window.location.href = "index.html";

}
else if(novCarne.length >= 1 && novCarne.length <= 9){

  //////////body
  var tel = "";
  var novE = "";


  if( novEstudiante == 'null'){
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong> No esta Registrado</a>';
  }
  else {
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novEstudiante+ '</a>';
  }


  document.getElementById("datosGenerales").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: </strong>'+novCarne+ '</a>' + novE +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+ nombreCompleto +'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+ nombreCompleto +'<br><b>Carné: '+novCarne+'</b></a>';
}

adAsignacion();

});
/*
$(document).ready(function () {

alert($(":checkbox:checked").length);

});*/

//////////asignacion activa o desactivada
function adAsignacion(){

  $.ajax({
       type: 'GET',
       url:  dominio + "examenLimite/2",
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       //console.log(data.fecha.fecha);


       if(data.examen.activo === 1){
         verificarEstadoPago();
       }
       else {
         $.ajax({
              type: 'GET',
              url:  dominio + "boletaPagada/" + novCarne,
              contentType: "application/json",
              dataType: 'json',
              async: false,
              success: function (data) {
            //  console.log(data.fecha[0].fecha);

              if(data.boleta != null){
               if(data.boleta.estado === 1){
                 window.location.href = "asignacionPAP.html";
               }
               else {
                 document.getElementById("activo").innerHTML = '<img src="assets/img/pap.jpeg" class="img-fluid" alt="">';
                 $("#seleccionCursos").hide();
                 $("#generarBoletaCursos").hide();
               }
              }
              else {
                document.getElementById("activo").innerHTML = '<img src="assets/img/pap.jpeg" class="img-fluid" alt="">';
                $("#seleccionCursos").hide();
                $("#generarBoletaCursos").hide();
              }

            },
            error: function (response) {
              alertify.set('notifier','position', 'bottom-center');
              alertify.error("error en la conexión");
                }
          });

       }


     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error en la conexión");
         }
   });

}
/*function adAsignacion() {
  let date = new Date();
let fechaActual = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');


 $.ajax({
      type: 'GET',
      url:  dominio + "fechaId/1",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
      //console.log(data.fecha.fecha);

      if(data.fecha.fecha >= fechaActual)
      {
        verificarEstadoPago();
      }
      else {
        $.ajax({
             type: 'GET',
             url:  dominio + "boletaPagada/" + novCarne,
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data) {
           //  console.log(data.fecha[0].fecha);

             if(data.boleta != null){
              if(data.boleta.estado === 1){
                window.location.href = "asignacionPAP.html";
              }
              else {
                document.getElementById("activo").innerHTML = '<img src="assets/img/pap.jpeg" class="img-fluid" alt="">';
                $("#seleccionCursos").hide();
                $("#generarBoletaCursos").hide();
              }
             }
             else {
               document.getElementById("activo").innerHTML = '<img src="assets/img/pap.jpeg" class="img-fluid" alt="">';
               $("#seleccionCursos").hide();
               $("#generarBoletaCursos").hide();
             }

           },
           error: function (response) {
             alertify.set('notifier','position', 'bottom-center');
             alertify.error("error en la conexión");
               }
         });

      }


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("error en la conexión");
        }
  });
}*/



$('input[type=checkbox]').on('change', function() {

if (document.querySelectorAll('input[type="checkbox"]:checked').length > 0 && document.querySelectorAll('input[type="checkbox"]:checked').length <= 2){
  document.getElementById("totalCursos").innerHTML = '<p><h3>Total a pagar: Q.350.00</h3></p>';
  costoTotal = 350;
}
else if(document.querySelectorAll('input[type="checkbox"]:checked').length > 2) {
  document.getElementById("totalCursos").innerHTML = '<p><h3>Total a pagar: Q.500.00</h3></p>';
  costoTotal = 500;
}
else {
  document.getElementById("totalCursos").innerHTML = '<p><h3>Total a pagar: Q.0.00</h3></p>';
  costoTotal = 0;
}

});


$("#generarBoletaCursos").on('click', function () {

if(costoTotal == 0){
  alertify.set('notifier','position', 'bottom-center');
  alertify.warning("Debes seleccionar al menos un curso para poder genera la boleta de pago.");
} else {

  $.each($("input[name='cursoCheck']:checked"), function(){

        insertarPreasignacion($(this).val());

  });

  generarBoleta();

}

function generarBoleta() {

  var nombre = "";

  var currentTime = new Date();
  var year = currentTime.getFullYear()

  if(novCarne.length === 10){
    nombre = nombres +' ' + apellidos;
  }
  else if(novCarne.length >= 1 && novCarne.length <= 9){
    nombre = nombreCompleto;
  }

  data = JSON.stringify({
  carnet: novCarne,
  unidad: 29,
  extension: 0,
  carrera: 0,
  nombre: nombre,
  monto: costoTotal,
  anio_temporada: year,
  id_rubro: '8',
  id_variante_rubro: '1',
  subotal: costoTotal,
})

  $.ajax({
       type: 'POST',
       url: dominio + 'generarBoleta',
       contentType: "application/json",
       dataType: 'json',
       crossDomain: true,
       async: false,
       data: data,
       success: function (response) {

          location.reload();

       },
       error: function (response) {
         //  window.location.href = "index.html";
       }
   });

}


});

function insertarPreasignacion(curso){

  data = JSON.stringify({
  nov: novCarne,
  id_materia: curso,
  estado: 0,

})

  $.ajax({
       type: 'POST',
       url: dominio + 'crearPreasignacionPap',
       contentType: "application/json",
       dataType: 'json',
       crossDomain: true,
       async: false,
       data: data,
       success: function (response) {

          location.reload();

       },
       error: function (response) {
         //  window.location.href = "index.html";
       }
   });

}


/////////////////////////////////verificar estado de pago

function verificarEstadoPago(){
  $.ajax({
       type: 'GET',
       url:  dominio + "boletaPagada/" + novCarne,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       //console.log(data.boleta);


       if(data.boleta != null){

         var novBoleta = data.boleta.nov;
         var nombreBoleta = data.boleta.nombre;
         var numeroBoleta = data.boleta.num_boleta;
         var correlativo = data.boleta.correlativo;
         var totalBoleta = data.boleta.total;
         var fechaEmision = data.boleta.fecha_emision;
         var llave = data.boleta.llave;

         if(data.boleta.estado === 1){
           window.location.href = "asignacionPAP.html";
         }
         else {
           $.ajax({
                   type: 'GET',
                   url:  dominio + "boleta/" + novCarne + "/" + numeroBoleta,
                   contentType: "application/json",
                   dataType: 'json',
                   async: false,
                   success: function (data) {
                  // console.log(data.message);

                   if(data.message === 'no ha pagado'){
                    setCookie('api-novBP', novBoleta, 1);
                    setCookie('api-nombreBP', nombreBoleta, 1);
                    setCookie('api-numBP', numeroBoleta, 1);
                    setCookie('api-correlativoBP', correlativo, 1);
                    setCookie('api-totalBP', totalBoleta, 1);
                    setCookie('api-fechaBP', fechaEmision, 1);
                    setCookie('api-llaveBP', llave, 1);

                     window.location.href = "boletaPago.html";

                   }
                   else{

                     window.location.href = "asignacionPAP.html";

                   }
                 },
                 error: function (response) {
                   alertify.set('notifier','position', 'bottom-center');
                   alertify.error("error de conexión al sistema de generación de boleta de pagos, intenta más tarde.");
                     }
               });
         }

       }
       else {
         //console.log("else");
         $("#seleccionCursos").show();
         $("#generarBoletaCursos").show();
       }


     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });
}

$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
