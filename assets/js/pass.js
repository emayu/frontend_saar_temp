$(document).ready(function () {
if(novCarne.length === 10){
  document.getElementById("datos").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: '+novCarne+ '</strong></a>' +
  '<a class="nav-link" style="color: black;"><strong>'+nombres+ ', '+apellidos+'.</strong></a>';
}
else if (novCarne == 'null') {
  window.location.href = "index.html";

}
else if(novCarne.length >= 1 && novCarne.length <= 9){
  document.getElementById("datos").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: '+novCarne+ '</strong></a>' +
  '<a class="nav-link" style="color: black;"><strong>'+ nombreCompleto + '.</strong></a>';
}
});


$("#aceptar").on('click', function () {

var m = document.getElementById("contrasenia").value;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^ ]|(?=.*[$@$!%*?&])[^ ]{8,}$/;

//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[A-Za-z\d]|[^ ]){8,}$/;

var expreg = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;

  if($("#contrasenia").val()==="" || $("#repContrasenia").val()===""){
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("El campo esta vacio");
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


////////////ingresar contraseña
function actualizarDatos() {
  password = $("#contrasenia").val();


  data = '{"contrasena": "'+myCipher(password)+'"}';

  if(novCarne.length === 10){
    $.ajax({
        type: 'PUT',
        url: dominio + `actualizarAspirantePass/` + novCarne,
        contentType: 'application/json',
        dataType: 'HTML',
        crossDomain: true,
        async: false,
        data: data,
        success: function (data) {
          //  console.log(data);
            alertify.set('notifier','position', 'bottom-center');
            alertify.success("Se ha realizado el registro correctamente");
            window.location.href = "login.html";

        }
    })
  }
  else if (novCarne == 'null') {
    window.location.href = "index.html";

  }
  else if(novCarne.length >= 1 && novCarne.length <= 9){

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
