$(document).ready(function () {

//14335456
$("#menuAE").load("menu.html");
alertify.set('notifier','position', 'bottom-center');
var duration = 15;
var msg = alertify.warning('La boleta aún no ha sido reportada como pagada, debes esperar un estimado de una hora para poder continuar con tu asignación. ', 15, function(){ clearInterval(interval);});
var interval = setInterval(function(){
        msg.setContent('La boleta aún no ha sido reportada como pagada, debes esperar un estimado de una hora para poder continuar con tu asignación. ');
      },1000);
fechaExpiracion();
buscarCursosPAP();

//////////7llenar bp
document.getElementById("no").innerHTML = numBP;
document.getElementById("correlativo").innerHTML = correlativoBP;
document.getElementById("nombre").innerHTML = nombreBP;
document.getElementById("descripcion").innerHTML = 'PAP';
document.getElementById("detalle-monto").innerHTML = 'Q. ' + totalBP + '.00';
document.getElementById("total").innerHTML = 'Q. ' + totalBP + '.00';

//////////bp banco
document.getElementById("orden").innerHTML = numBP;
document.getElementById("carnet-banco").innerHTML = novBP;
document.getElementById("total-banco").innerHTML = 'Q. ' + totalBP + '.00';
document.getElementById("total-banco").innerHTML = 'Q. ' + totalBP + '.00';

fechaBoleta = fechaBP.split("-");
fechaBoletaVista = fechaBoleta[2] +"/"+ fechaBoleta[1]+"/"+ fechaBoleta[0];
const fechaP = new Date();

document.getElementById("fecha-emision").innerHTML = 'Fecha de emisión: ' + fechaBoletaVista;
document.getElementById("fecha-impresion").innerHTML = 'Fecha de impresión: ' + new Date(fechaP).toLocaleDateString();
document.getElementById("fecha-banco").innerHTML = fechaBoletaVista;
document.getElementById("llave").innerHTML = llaveBP;

  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';

});

function fechaExpiracion(){
  $.ajax({
       type: 'GET',
       url:  dominio + "fechaId/1",
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
      //console.log(data.fecha[0].fecha);

        fechaBoletaExpiracion = data.fecha.fecha.split("-");
        fechaBoletaVistaExpiracion = fechaBoletaExpiracion[2] +"/"+ fechaBoletaExpiracion[1]+"/"+ fechaBoletaExpiracion[0];
        document.getElementById("limite").innerHTML = '** El documento es válido para su pago únicamente hasta el día ' +fechaBoletaVistaExpiracion+ '.**';
     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });
}

var materias = [];

function buscarCursosPAP(){
  $.ajax({
       type: 'GET',
       url:  dominio + "papPreasignacionNov/" + novCarne,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {

        // console.log(data.PAPPREASIGNACION[0].id_materia);

         for(i=0; i<data.PAPPREASIGNACION.length; i++){

           if(data.PAPPREASIGNACION[i].id_materia === 1){
            // console.log("BIOLOGÍA");
             materias.push (" BIOLOGÍA");
           }
           else if(data.PAPPREASIGNACION[i].id_materia === 2){
            // console.log("FÍSICA");
             materias.push (" FÍSICA");
           }
           else if(data.PAPPREASIGNACION[i].id_materia === 3){
          //   console.log("LENGUAJE");
             materias.push (" LENGUAJE");
           }
           else if(data.PAPPREASIGNACION[i].id_materia === 4){
            // console.log("MATEMÁTICA");
             materias.push (" MATEMÁTICA");
           }
           else if(data.PAPPREASIGNACION[i].id_materia === 5){
          //   console.log("QUÍMICA");
             materias.push (" QUÍMICA");
           }
         }

         //console.log(materias);
         document.getElementById("materias").innerHTML = '4. Boleta generada para los cursos del PAP de Conocimientos Básicos: ' + materias;

  },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });
}

function printBoleta() {
/*  const printContenido = document.getElementById('bPrueba').innerHTML;
  const original  = document.body.innerHTML;
  document.body.innerHTML = printContenido;*/

  //  console.log('hola mundo');
    window.print();
    //document.body.innerHTML = original;

}


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
