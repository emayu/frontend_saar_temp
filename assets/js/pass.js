$(document).ready( async function () {
if(isNOVCarnet(novCarne)){
  
  document.getElementById("datos").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: '+novCarne+ '</strong></a>' +
  '<a class="nav-link" style="color: black;"><strong>'+nombres+ ', '+apellidos+'.</strong></a>';
  const loadingForm = document.getElementById("loadingDiv");
  const passForm = document.getElementById('passForm');
  loadingForm.style.display = 'block';
  passForm.style.display = 'none';
  const response = await $.ajax({
    type: 'GET',
    url: dominio + "buscarAspiranteNOV/" + novCarne,
    contentType: "application/json",
    dataType: 'json'
  });
  const versionInput = document.getElementById('version');
  versionInput.value = response.OV_ASPIRANTE[0].version;
  loadingForm.style.display = 'none';
  passForm.style.display = 'block';
  
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
const contraseniaInput = document.getElementById("contrasenia");
const repContraseniaInput = document.getElementById("repContrasenia");
contraseniaInput.classList.remove('is-invalid');
repContraseniaInput.classList.remove('is-invalid');
var m = contraseniaInput.value;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^ ]|(?=.*[$@$!%*?&])[^ ]{8,}$/;

//var expreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[A-Za-z\d]|[^ ]){8,}$/;

var expreg = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])|(?=.*[a-z])(?=.*[A-Z])(?=.*\d))([A-Za-z\d@$!%*?&]|[^ ]){8,}$/;
console.log("validity", contraseniaInput.checkValidity());
  if(!contraseniaInput.checkValidity()){
    contraseniaInput.classList.add('is-invalid');
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("El campo contraseña esta vacío");
  }

  if(!repContraseniaInput.checkValidity()){
    repContraseniaInput.classList.add('is-invalid');
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("El campo de verificación de contraseña esta vacío");
  }
  
  
  if(contraseniaInput.checkValidity() && repContraseniaInput.checkValidity()) {
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

  if(novCarne.length === 10){
    const versionInput = document.getElementById('version');
    const data = {
      contrasena: myCipher(password),
      version: versionInput.value,
      usuario_ultima_modificacion: novCarne
    }
    $.ajax({
        type: 'PUT',
        url: dominio + `actualizarAspirantePass/` + novCarne,
        contentType: 'application/json',
        dataType: 'json',
        crossDomain: true,
        async: false,
        data: JSON.stringify(data),
        success: function (data) {
          //  console.log(data);
            alertify.set('notifier','position', 'bottom-center');
            alertify.success("Se ha realizado el registro correctamente");
            window.location.href = "login.html";

        },
        error: errorHandlerSetup(alertify)
    })
  }
  else if (novCarne == 'null') {
    window.location.href = "index.html";

  }
  else if(novCarne.length >= 1 && novCarne.length <= 9){
    data = '{"contrasena": "'+myCipher(password)+'"}';
    $.ajax({
        type: 'PUT',
        url: dominio + `actualizarEstudiantePass/` + novCarne,
        contentType: 'application/json',
        dataType: 'json',
        crossDomain: true,
        async: false,
        data: data,
        success: function (data) {
            //console.log(data);
            alertify.set('notifier','position', 'bottom-center');
            alertify.success("Se ha realizado el registro correctamente");
            window.location.href = "login.html";

        },
        error: errorHandlerSetup(alertify)
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
