let tipoCuenta = null;
let novAspiranteInput = null;
let passAspiranteInput = null;
let carneEstudianteInput = null;
let passEstudianteInput = null;
$(document).ready(function () {
  tipoCuenta = 0;
  novAspiranteInput = document.getElementById('novAspirante');
  passAspiranteInput = document.getElementById('passAspirante');
  carneEstudianteInput = document.getElementById('carneEstudiante');
  passEstudianteInput = document.getElementById('passEstudiante');

});


function login(cuenta) {
  console.log('cuenta', cuenta);
  if (cuenta === AccountType.ESTUDIANTE) {
    carne = $("#carneEstudiante").val();
    pass = $("#passEstudiante").val();



    data = '{"carne": "' + carne + '", "contrasena" : "' + myCipher(pass) + '"}';
    toggleButton('loginEstudiante', true);
    $.ajax({
      type: 'POST',
      url: apiV1 + `loginEstudiante`,
      xhrFields: { withCredentials: true },
      contentType: 'application/json',
      dataType: 'json',
      crossDomain: true,
      data: data,
      success: function (info) {
        if (info.message === 'logueado') {

          var nombres = info.datos.nombre;
          var apellidos = info.datos.apellido;
          var novEstudiante = info.datos.nov;
          var carne = info.datos.carnet;
          var cui = info.datos.cui;
          var fechaNacimiento = info.datos.fecha_nacimiento;
          var correo = info.datos.correo;
          var telefono = info.datos.telefono;
          var nombreCompleto = info.datos.nombre_completo;

          setCookie('api-nombre', nombres, 1);
          setCookie('api-apellido', apellidos, 1);
          setCookie('api-novCarne', carne, 1);
          setCookie('api-cui', cui, 1);
          setCookie('api-fechaNacimiento', fechaNacimiento, 1);
          setCookie('api-correo', correo, 1);
          setCookie('api-telefono', telefono, 1);
          setCookie('api-novEstudiante', novEstudiante, 1);
          setCookie('api-nombreCompleto', nombreCompleto, 1);

          window.location.href = "principal.html";
        }
        else if (info.message === 'errorpass') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.error("La contraseña es incorrecta.");
        }
        else if (info.message === 'No se ha registrado') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.notify('No te has registrado, ve al menú Crear Cuenta para crear tu usuario.', 'custom', 8, function () { });
        }
        else if (info.message === 'carne no existe') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.warning('El Número de Carné que ingresaste es incorrecto.', 'custom', 2, function () { });
        }
        else if (info.message === 'Eror en la consulta externa') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.warning('El Número de Carné que ingresaste es incorrecto.', 'custom', 2, function () { });
        }

      },
      error: errorHandlerSetup(alertify),
      complete: function( jqXHR, textStatus){
        toggleButton('loginEstudiante', false);
      }
    })
  }
  else if (cuenta === AccountType.ASPIRANTE) {
    nov = $("#novAspirante").val();
    pass = $("#passAspirante").val();


    data = '{"nov": "' + nov + '", "contrasena" : "' + myCipher(pass) + '"}';
    toggleButton('loginAspirante', true);
    $.ajax({
      type: 'POST',
      url: apiV1 + `loginAspirante`,
      xhrFields: { withCredentials: true },
      contentType: 'application/json',
      dataType: 'json',
      crossDomain: true,
      data: data,
      success: function (info) {
        if (info.message === 'logueado') {
          // /console.log(info.datos);

          var nombres = info.datos.nombres;
          var apellidos = info.datos.apellidos;
          var nov = info.datos.nov;
          var cui = info.datos.cui;
          var fechaNacimiento = info.datos.fecha_nacimiento;
          var correo = info.datos.correo;
          var telefono = info.datos.telefono;


          setCookie('api-nombre', nombres, 1);
          setCookie('api-apellido', apellidos, 1);
          setCookie('api-novCarne', nov, 1);
          setCookie('api-cui', cui, 1);
          setCookie('api-fechaNacimiento', fechaNacimiento, 1);
          setCookie('api-correo', correo, 1);
          setCookie('api-telefono', telefono, 1);

          window.location.href = "principal.html";
        }
        else if (info.message === 'errorpass') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.error("La contraseña es incorrecta.");
        }
        else if (info.message === 'No se ha registrado') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.notify('No te has registrado, ve al menú Crear Cuenta para crear tu usuario.', 'custom', 8, function () { });
        }
        else if (info.message === 'nov no existe') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.warning('El Número de Orientación Vocacional que ingresaste es incorrecto.', 'custom', 2, function () { });
        }
        else if (info.message === 'Eror en la consulta externa') {
          alertify.set('notifier', 'position', 'bottom-center');
          alertify.warning('El Número de Orientación Vocacional que ingresaste es incorrecto.', 'custom', 2, function () { });
        }

      },
      error: errorHandlerSetup(alertify),
      complete: function( jqXHR, textStatus){
        toggleButton('loginAspirante', false);
      }
    })
  }

}


$("#aspirante").on('click', function () {
  this.style.background = "#D3ECFB";
  $("#estudiante").attr('style', 'background-color:#FFFFFF');
  tipoCuenta = AccountType.ASPIRANTE;
  $(".divAspirante").show();
  scrollToElement('#botonesTipo');
  $(".divEstudiante").hide();
});

$("#loginAspirante").on('click', function () {
  inicioAspirante();
});

function inicioAspirante() {
  novAspiranteInput.classList.remove('is-invalid');
  passAspiranteInput.classList.remove('is-invalid');
  if ($("#novAspirante").val() === "" && $("#passAspirante").val() === "") {
    passAspiranteInput.classList.add('is-invalid');
    passAspiranteInput.reportValidity();
    novAspiranteInput.classList.add('is-invalid');
    novAspiranteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("Los campos están vacíos");
  }
  else if ($("#novAspirante").val() === "") {
    novAspiranteInput.classList.add('is-invalid');
    novAspiranteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo Número de Orientación Vocacional esta vacío");
  }
  else if ($("#passAspirante").val() === "") {
    passAspiranteInput.classList.add('is-invalid');
    passAspiranteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo Contraseña esta vacío");
  }
  else {
    login(tipoCuenta);
  }
}

$("#estudiante").on('click', function () {
  this.style.background = "#D3ECFB";
  $("#aspirante").attr('style', 'background-color:#FFFFFF');
  tipoCuenta = AccountType.ESTUDIANTE;
  $(".divEstudiante").show();
  scrollToElement('#botonesTipo');
  $(".divAspirante").hide();
});


$("#loginEstudiante").on('click', function () {
  inicioEstudiante();
});

function inicioEstudiante() {
  carneEstudianteInput.classList.remove('is-invalid');
  passEstudianteInput.classList.remove('is-invalid');
  if ($("#carneEstudiante").val() === "" && $("#passEstudiante").val() === "") {
    passEstudianteInput.classList.add('is-invalid');
    passEstudianteInput.reportValidity();
    carneEstudianteInput.classList.add('is-invalid');
    carneEstudianteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("Los campos están vacíos");
  }
  else if ($("#carneEstudiante").val() === "") {
    carneEstudianteInput.classList.add('is-invalid');
    carneEstudianteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo Número de carné esta vacío");
  }
  else if ($("#passEstudiante").val() === "") {
    passEstudianteInput.classList.add('is-invalid');
    passEstudianteInput.reportValidity();
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.error("El campo Contraseña esta vacío");
  }
  else {
    login(tipoCuenta);
  }
}


function mostrarPasswordAspirante() {

  var cambio = document.getElementById("passAspirante");
  if (cambio.type == "password") {
    cambio.type = "text";
    $('.icon').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
  } else {
    cambio.type = "password";
    $('.icon').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
  }
}

function mostrarPasswordEstudiante() {

  var cambio = document.getElementById("passEstudiante");
  if (cambio.type == "password") {
    cambio.type = "text";
    $('.iconE').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
  } else {
    cambio.type = "password";
    $('.iconE').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
  }

}


$('body').keyup(function (e) {
  if (e.keyCode === 13) {
    if (tipoCuenta === AccountType.ASPIRANTE) {
      inicioAspirante();
    }
    else if (tipoCuenta === AccountType.ESTUDIANTE) {
      inicioEstudiante();
    }
  }

});

$('#passAspirante').keypress(function (e) {
  var s = String.fromCharCode(e.which);
  if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.warning('Bloq Mayus está activado.');
  }
});


$('#passEstudiante').keypress(function (e) {
  var s = String.fromCharCode(e.which);
  if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
    alertify.set('notifier', 'position', 'bottom-center');
    alertify.warning('Bloq Mayus está activado.');
  }
});



function scrollToElement(selector, callback) {
  var animation = { scrollTop: $(selector).offset().top };
  $('html,body').animate(animation, 'slow', 'swing', function () {
    if (typeof callback == 'function') {
      callback();
    }
    callback = null;
  });
}
