$(document).ready(function () {

$("#menuAE").load("menu.html");

fechaExpiracion();

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
       url:  dominio + "AllFechaBoleta" ,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
      //console.log(data.fecha[0].fecha);

        fechaBoletaExpiracion = data.fecha[0].fecha.split("-");
        fechaBoletaVistaExpiracion = fechaBoletaExpiracion[2] +"/"+ fechaBoletaExpiracion[1]+"/"+ fechaBoletaExpiracion[0];
        document.getElementById("limite").innerHTML = '** El documento es válido para su pago únicamente hasta el día ' +fechaBoletaVistaExpiracion+ '.**';
     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("Usuario o Contraseña Incorrecto!");
         }
   });
}

function printBoleta() {
/*  const printContenido = document.getElementById('bPrueba').innerHTML;
  const original  = document.body.innerHTML;
  document.body.innerHTML = printContenido;*/

    console.log('hola mundo');
    window.print();
    //document.body.innerHTML = original;

}


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
