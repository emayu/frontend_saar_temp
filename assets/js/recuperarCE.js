$(document).ready(function () {

});


$("#aceptar").on('click', function () {

  if($("#novAspirante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Número de Orientación Vocacional esta vacio");
    }
    else {
      var m = document.getElementById("contrasenia").value;
      //var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      //var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
      //var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^ ]|(?=.*[$@$!%*?&])[^ ]{8,}$/;

      //var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[A-Za-z\d]|[^ ]){8,}$/;

      var expreg = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

        if($("#contrasenia").val()==="" || $("#repContrasenia").val()===""){
          alertify.set('notifier','position', 'bottom-center');
          alertify.error("El campo contraseña esta vacio");
        }else {
          if($("#contrasenia").val() !=  $("#repContrasenia").val()){
            alertify.set('notifier','position', 'bottom-center');
            alertify.error("La Contraseña no coincide");
          } else if (expreg.test(m)) {
              estudianteCarne();
          }
          else {
            alertify.set('notifier','position', 'bottom-center');
            alertify.set('notifier','delay', 10);
            alertify.warning("La Contraseña debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula, un número y/o un caracter especial.");
          }
        }

    }

});


///////buscar estudiante carne
function estudianteCarne() {
carne = $("#carneEstudiante").val();

    $.ajax({
        type: 'GET',
        url: dominio + 'buscarEstudianteCarne/' + carne,
        contentType: "application/json",
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: function (response) {
          //console.log(response.USAC_ESTUDIANTE.length);

          if (response.USAC_ESTUDIANTE[0].registrado === 1) {
            actualizarDatos();

          } else {
            alertify.set('notifier','position', 'bottom-center');
            alertify.error("El estudiante no esta registrado, ve al menú Crear Cuenta para registrar tu usuario.");
          }

        },
        error: function (response) {
         window.location.href = "index.html";
        }
    });
}

////////////ingresar contraseña
function actualizarDatos() {

  password = $("#contrasenia").val();
  novCarne = $("#carneEstudiante").val()

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
