$(document).ready(async function () {
  if (isNOVCarnet(novCarne)) {

    document.getElementById("datos").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: ' + novCarne + '</strong></a>' +
      '<a class="nav-link" style="color: black;"><strong>' + nombres + ', ' + apellidos + '.</strong></a>';
    const loadingForm = document.getElementById("loadingDiv");
    const passForm = document.getElementById('passForm');
    loadingForm.style.display = 'block';
    passForm.style.display = 'none';
    const token = sessionStorage.getItem('actionToken');
    const response = await $.ajax({
      type: 'GET',
      url: apiV1 + "aspiranteNOV/" + novCarne,
      headers: {
        'Authorization': 'Bearer ' + token
      },
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
  else if (novCarne.length >= 1 && novCarne.length <= 9) {
    document.getElementById("datos").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: ' + novCarne + '</strong></a>' +
      '<a class="nav-link" style="color: black;"><strong>' + nombreCompleto + '.</strong></a>';
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
  if (!contraseniaInput.checkValidity()) {
    contraseniaInput.classList.add('is-invalid');
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo contraseña esta vacío");
  }

  if (!repContraseniaInput.checkValidity()) {
    repContraseniaInput.classList.add('is-invalid');
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo de verificación de contraseña esta vacío");
  }


  if (contraseniaInput.checkValidity() && repContraseniaInput.checkValidity()) {
    if ($("#contrasenia").val() != $("#repContrasenia").val()) {
      alertify.set('notifier', 'position', 'bottom-center');
      alertify.error("La Contraseña no coincide");
    } else if (expreg.test(m)) {
      actualizarDatos();
    }
    else {
      alertify.set('notifier', 'position', 'bottom-center');
      alertify.set('notifier', 'delay', 10);
      alertify.warning("La Contraseña debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula, un número y/o un caracter especial.");
    }
  }
});

const errorHandler = (xhr, status, errorThrow) => {
  errorRegisterHandler(xhr, status, errorThrow);
  if (xhr?.responseJSON?.message === "TOKEN_EXPIRED") {
    setTimeout(() => {
      window.location.href = `registro.html`;
      return;
    }, 3500);
  }
};


////////////ingresar contraseña
function actualizarDatos() {
  password = $("#contrasenia").val();
  const token = sessionStorage.getItem('actionToken');
  toggleButton('aceptar', true);
  if (isNOVCarnet(novCarne)) {
    const versionInput = document.getElementById('version');
    const data = {
      contrasena: myCipher(password),
      version: versionInput.value,
    }
    $.ajax({
      type: 'PUT',
      url: apiV1 + `actualizarAspirantePass/` + novCarne,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      contentType: 'application/json',
      dataType: 'json',
      crossDomain: true,
      data: JSON.stringify(data),
      success: function (data) {
        //  console.log(data);
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success("Se ha realizado el registro correctamente");
        sessionStorage.removeItem('actionToken');
        window.location.href = "login.html";

      },
      error: errorHandler,
      complete: function(jqXHR, textStatus){
        toggleButton('aceptar', false);
      }
    })
  }
  else if (novCarne == 'null') {
    window.location.href = "index.html";

  }
  else if (novCarne.length >= 1 && novCarne.length <= 9) {
    data = '{"contrasena": "' + myCipher(password) + '"}';
    $.ajax({
      type: 'PUT',
      url: apiV1 + `actualizarEstudiantePass/` + novCarne,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      contentType: 'application/json',
      dataType: 'json',
      crossDomain: true,
      data: data,
      success: function (data) {
        //console.log(data);
        alertify.set('notifier', 'position', 'bottom-center');
        alertify.success("Se ha realizado el registro correctamente");
        window.location.href = "login.html";

      },
      error: errorHandler,
      complete: function(jqXHR, textStatus){
        toggleButton('aceptar', false);
      }
    })

  }

}


function mostrarPassword() {

  var cambio = document.getElementById("contrasenia");
  if (cambio.type == "password") {
    cambio.type = "text";
    $('.iconP').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
  } else {
    cambio.type = "password";
    $('.iconP').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
  }
}

function mostrarPassword2() {

  var cambio = document.getElementById("repContrasenia");
  if (cambio.type == "password") {
    cambio.type = "text";
    $('.iconR').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
  } else {
    cambio.type = "password";
    $('.iconR').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
  }

}
