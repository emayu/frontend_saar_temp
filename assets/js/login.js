$(document).ready(function () {
tipoCuenta = 0;
$(".divAspirante").hide();
$(".divEstudiante").hide();
});


function login(cuenta) {

  if(cuenta==2){
    carne = $("#carneEstudiante").val();
    pass = $("#passEstudiante").val();



    data = '{"carne": "'+carne+'", "contrasena" : "'+myCipher(pass)+'"}';

      $.ajax({
          type: 'POST',
          url: dominio + `loginEstudiante`,
          contentType: 'application/json',
          dataType: 'HTML',
          crossDomain: true,
          async: false,
          data: data,
          success: function (data) {
            var info = JSON.parse(data);
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
                alertify.set('notifier','position', 'bottom-center');
                alertify.error("La contraseña es incorrecta.");
              }
              else if (info.message === 'No se ha registrado') {
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify('No te has registrado, ve al menú Crear Cuenta para crear tu usuario.', 'custom', 8, function(){});
              }
              else if (info.message === 'carne no existe') {
                alertify.set('notifier','position', 'bottom-center');
                alertify.warning('El Número de Carné que ingresaste es incorrecto.', 'custom', 2, function(){});
              }
              else if (info.message === 'Eror en la consulta externa') {
                alertify.set('notifier','position', 'bottom-center');
                alertify.warning('El Número de Carné que ingresaste es incorrecto.', 'custom', 2, function(){});
              }

          }
      })
}
else if(cuenta==1){
  nov = $("#novAspirante").val();
  pass = $("#passAspirante").val();


  data = '{"nov": "'+nov+'", "contrasena" : "'+myCipher(pass)+'"}';

    $.ajax({
        type: 'POST',
        url: dominio + `loginAspirante`,
        contentType: 'application/json',
        dataType: 'HTML',
        crossDomain: true,
        async: false,
        data: data,
        success: function (data) {
          var info = JSON.parse(data);
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
              alertify.set('notifier','position', 'bottom-center');
              alertify.error("La contraseña es incorrecta.");
            }
            else if (info.message === 'No se ha registrado') {
              alertify.set('notifier','position', 'bottom-center');
              alertify.notify('No te has registrado, ve al menú Crear Cuenta para crear tu usuario.', 'custom', 8, function(){});
            }
            else if (info.message === 'nov no existe') {
              alertify.set('notifier','position', 'bottom-center');
              alertify.warning('El Número de Orientación Vocacional que ingresaste es incorrecto.', 'custom', 2, function(){});
            }
            else if (info.message === 'Eror en la consulta externa') {
              alertify.set('notifier','position', 'bottom-center');
              alertify.warning('El Número de Orientación Vocacional que ingresaste es incorrecto.', 'custom', 2, function(){});
            }

        }
    })
}

}


$("#aspirante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#estudiante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = 1;
        $(".divAspirante").show();
        $(".divEstudiante").hide();
});

$("#loginAspirante").on('click', function () {
inicioAspirante();
});

function inicioAspirante(){
  if($("#novAspirante").val()==="" && $("#passAspirante").val()===""){
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("Los campos están vacios");
  }
  else if($("#novAspirante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Número de Orientación Vocacional esta vacio");
    }
    else if($("#passAspirante").val()===""){
        alertify.set('notifier','position', 'bottom-center');
        alertify.error("El campo Contraseña esta vacio");
      }
  else {
  login(tipoCuenta);
  }
}

$("#estudiante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#aspirante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = 2;
        $(".divEstudiante").show();
        $(".divAspirante").hide();
});


$("#loginEstudiante").on('click', function () {
inicioEstudiante();
});

function inicioEstudiante(){
  if($("#carneEstudiante").val()==="" && $("#passEstudiante").val()===""){
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("Los campos están vacios");
  }
  else if($("#carneEstudiante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Número de carné esta vacio");
    }
    else if($("#passEstudiante").val()===""){
        alertify.set('notifier','position', 'bottom-center');
        alertify.error("El campo Contraseña esta vacio");
      }
  else {
  login(tipoCuenta);
  }
}


function mostrarPasswordAspirante(){

var cambio = document.getElementById("passAspirante");
if(cambio.type == "password"){
  cambio.type = "text";
  $('.icon').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
}else{
  cambio.type = "password";
  $('.icon').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
}
}

function mostrarPasswordEstudiante(){

var cambio = document.getElementById("passEstudiante");
if(cambio.type == "password"){
  cambio.type = "text";
  $('.iconE').removeClass('bx bxs-low-vision').addClass('bx bx-show-alt');
}else{
  cambio.type = "password";
  $('.iconE').removeClass('bx bx-show-alt').addClass('bx bxs-low-vision');
}

	}


$('body').keyup(function (e) {
    if (e.keyCode === 13) {
        if (tipoCuenta == 1) {
          inicioAspirante();
        }
        else if (tipoCuenta == 2) {
          inicioEstudiante();
        }
    }

});

$('#passAspirante').keypress(function(e) {
    var s = String.fromCharCode( e.which );
    if ( s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey ) {
      alertify.set('notifier','position', 'bottom-center');
        alertify.warning('Bloq Mayus está activado.');
    }
});


$('#passEstudiante').keypress(function(e) {
    var s = String.fromCharCode( e.which );
    if ( s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey ) {
      alertify.set('notifier','position', 'bottom-center');
        alertify.warning('Bloq Mayus está activado.');
    }
});
