$(document).ready(function () {

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
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres +' ' + apellidos+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>Carné: '+novCarne+'</b></a>';
}

verificarEstadoPago();

});
/*
$(document).ready(function () {

alert($(":checkbox:checked").length);

});*/


$('input[type=checkbox]').on('change', function() {

if (document.querySelectorAll('input[type="checkbox"]:checked').length > 0 && document.querySelectorAll('input[type="checkbox"]:checked').length <= 3){
  document.getElementById("totalCursos").innerHTML = '<p><h3>Total a pagar: Q.350.00</h3></p>';
  costoTotal = 350;
}
else if(document.querySelectorAll('input[type="checkbox"]:checked').length > 3) {
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

  //crearBoletaPago();

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


/////////////////////////////////verificar estado de pago crearBoletaPago

function verificarEstadoPago(){
  $.ajax({
       type: 'GET',
       url:  dominio + "boletaPagada/" + novCarne,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       console.log(data.boleta);

       if(data.boleta != null){
         if(data.boleta.estado === 0){
            ////////
            setCookie('api-novBP', data.boleta.nov, 1);
            setCookie('api-nombreBP', data.boleta.nombre, 1);
            setCookie('api-numBP', data.boleta.num_boleta, 1);
            setCookie('api-correlativoBP', data.boleta.correlativo, 1);
            setCookie('api-totalBP', data.boleta.total, 1);
            setCookie('api-fechaBP', data.boleta.fecha_emision, 1);
            setCookie('api-llaveBP', data.boleta.llave, 1);

            window.location.href = "boletaPago.html";
          }
          else if (data.boleta[0].estado === 1) {
            window.location.href = "asignacionPAP.html";
          }
          else {
            //console.log("elimino la boleta y asignacion o no se a preasignado");
          }

       }
       else {
         console.log("entrealelse");
       }



     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("Usuario o Contraseña Incorrecto!");
         }
   });
}

$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
