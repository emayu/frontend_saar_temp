$(document).ready(function () {
    $("#recPassword").hide();

});

$("#buscar").on('click', function () {

  if($("#carneEstudiante").val() === ""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Carné esta vacio");
    }
    else if ($("#fechaNacimientoEstudiante").val() === "") {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Fecha de nacimiento esta vacio");
    }
    else {
      estudianteCarne();
    }

});


$("#aceptar").on('click', function () {

      var m = document.getElementById("contrasenia").value;

      var expreg = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

        if($("#contrasenia").val()==="" || $("#repContrasenia").val()===""){
          alertify.set('notifier','position', 'bottom-center');
          alertify.error("El campo contraseña esta vacio");
        }else {
          if($("#contrasenia").val() !=  $("#repContrasenia").val()){
            alertify.set('notifier','position', 'bottom-center');
            alertify.error("La Contraseña no coincide");
          } else if (expreg.test(m)) {
              actualizarDatos();
          }
          else {
            alertify.set('notifier','position', 'bottom-center');
            alertify.set('notifier','delay', 10);
            alertify.warning("La Contraseña debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula, un número y/o un caracter especial.");
          }
        }

});

$("#cancelar").on('click', function () {
  window.location.reload();
});

///////buscar estudiante carne
function estudianteCarne() {
carne = $("#carneEstudiante").val();
fechaNE = $("#fechaNacimientoEstudiante").val();

$.ajax({
    type: 'GET',
    url:  dominio + "buscarEstudiante/" + carne + '/' + fechaNE,
    contentType: "application/json",
    dataType: 'json',
    async: false,
    success: function (data) {

      if (data.message === 'carnet no existe') {
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("El Carné ingresado es incorrecto o no existe en el sistema. Verificalo o comunicate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

      }
      else if (data.message === 'fecha de nacimiento incorrecta') {
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("La fecha de nacimiento que ingresaste es incorrecta. Verificala o comunicate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

      }
      else {

            var carne = data.USAC_ESTUDIANTE.carnet;
            var nombreCompletoRegistro = data.USAC_ESTUDIANTE.nombre_completo;

            $("#recPassword").show();
            $("#datos").hide();

            document.getElementById("nombreBusqueda").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: '+ carne + '</strong></a>' +
            '<a class="nav-link" style="color: black;"><strong>Nombre: '+ nombreCompletoRegistro + '.</strong></a>'



      }

  },
  error: function (response) {
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("Error de conexión");
      }
});
}

////////////ingresar contraseña
function actualizarDatos() {

  password = $("#contrasenia").val();
  novCarne = $("#carneEstudiante").val();

  data = '{"contrasena": "'+myCipher(password)+'"}';

  $.ajax({
      type: 'PUT',
      url: dominio + `actualizarEstudiantePass/` + novCarne,
      contentType: 'application/json',
      dataType: 'HTML',
      crossDomain: true,
      async: false,
      data: data,
      success: function (data) {
          //console.log(data);
          alertify.set('notifier','position', 'bottom-center');
          alertify.success("Se ha realizado el registro correctamente");
          window.location.href = "login.html";

      }
  })


}


function mostrarPassword(){

var cambio = document.getElementById("contrasenia");
if(cambio.type == "password"){
  cambio.type = "text";
  $('.iconP').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
}else{
  cambio.type = "password";
  $('.iconP').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
}
}

function mostrarPassword2(){

var cambio = document.getElementById("repContrasenia");
if(cambio.type == "password"){
  cambio.type = "text";
  $('.iconR').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
}else{
  cambio.type = "password";
  $('.iconR').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
}

	}
