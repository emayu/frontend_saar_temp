$(document).ready(function () {
  $("#recPassword").hide();
});

$("#buscar").on('click', function () {

  if($("#novAspirante").val() === ""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Número de Orientación Vocacional esta vacio");
    }
    else if ($("#fechaNacimientoAspirante").val() === "") {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Fecha de nacimiento esta vacio");
    }
    else {
      aspiranteNOV();
    }

});


$("#aceptar").on('click', function () {
  const contraseniaInput = document.getElementById("contrasenia");
  const repContraseniaInput = document.getElementById("repContrasenia");


  contraseniaInput.classList.remove('is-invalid');
  repContraseniaInput.classList.remove('is-invalid');


      var m = contraseniaInput.value;

      var expreg = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

        if(!contraseniaInput.checkValidity()){
          contraseniaInput.classList.add('is-invalid');
          alertify.set('notifier','position', 'bottom-center');
          alertify.error("El campo contraseña esta vacio");
        }

        if(!repContraseniaInput.checkValidity()){
          repContraseniaInput.classList.add('is-invalid');
          alertify.set('notifier','position', 'bottom-center');
          alertify.error("El campo de verificación de contraseña esta vacío");
        }
        
        
        if (contraseniaInput.checkValidity() && repContraseniaInput.checkValidity()) {
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


///////buscar aspirantes NOV
function aspiranteNOV() {
nov = $("#novAspirante").val();
fechaNA = $("#fechaNacimientoAspirante").val();

$.ajax({
    type: 'GET',
    url:  dominio + "buscarAspirante/" + nov + '/' + fechaNA,
    contentType: "application/json",
    dataType: 'json',
    async: false,
    success: function (data) {


      if (data.message === 'nov no existe') {
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("El NOV ingresado es incorrecto o no existe en el sistema. Verificalo o comunicate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

      }
      else if (data.message === 'fecha de nacimiento incorrecta') {
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("La fecha de nacimiento que ingresaste es incorrecta. Verificala o comunicate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

      }
      else if (data.OV_ASPIRANTE?.registrado === 1) {

        var nombres = data.OV_ASPIRANTE.nombres;
        var apellidos = data.OV_ASPIRANTE.apellidos;
        var nov = data.OV_ASPIRANTE.nov;
        var version = data.OV_ASPIRANTE.version;

        $("#recPassword").show();
        $("#datos").hide();

        document.getElementById("nombreBusqueda").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: '+nov+ '</strong></a>' +
        '<a class="nav-link" style="color: black;"><strong>Nombre: '+ nombres + ' ' + apellidos + '.</strong></a>';

        document.getElementById('version').value = version;

      }
      else {
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("Debes de crear tu cuenta en el menú Crear Cuenta.");
      }


  },
  error: function (response) {
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("error en la conexión");
      }
});
}


////////////ingresar contraseña
function actualizarDatos() {

  password = $("#contrasenia").val();
  novCarne = $("#novAspirante").val();
  const version = document.getElementById('version').value;
  const dataRaw = {
    contrasena: myCipher(password),
    version: version,
    usuario_ultima_modificacion: novCarne
  };
  const data = JSON.stringify(dataRaw);

    $.ajax({
        type: 'PUT',
        url: dominio + `actualizarAspirantePass/` + novCarne,
        contentType: 'application/json',
        dataType: 'json',
        crossDomain: true,
        async: false,
        data: data,
        success: function (data) {
          //  console.log(data);
            alertify.set('notifier','position', 'bottom-center');
            alertify.success("Se ha realizado el registro correctamente");
            window.location.href = "login.html";
        },
        error: errorHandlerSetup(alertify)
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
