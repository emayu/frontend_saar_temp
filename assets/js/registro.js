/**
 * Enum for account type
 */
const AccountType = Object.freeze({
  ASPIRANTE: 1,
  ESTUDIANTE: 2
});

$(document).ready(function () {
  var hoy = new Date();
  var year = hoy.getFullYear();

  document.getElementById("infoRegistro").innerHTML = '<label><p> <br> <strong>Nota: Si tu NOV es del año ' + year + ' y acabas de recibir tus resultados de la Prueba de Orientación Vocacional,'
  +  'debes esperar al menos 3 días hábiles para poder crear tu cuenta. </strong> </p></label>';

tipoCuenta = 0;
$(".divAspirante").hide();
$(".divEstudiante").hide();
//////carne y nov
$("#modalNov").hide();
$("#modalCarne").hide();
alertify.defaults.notifier.delay = 10;
});

var modal = document.getElementById("myModal");

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var cancela = document.getElementById("cancelar");

// When the user clicks the button, open the modal


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
cancela.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function registro(cuenta) {


  if(cuenta== AccountType.ESTUDIANTE){
    carne = $("#carneEstudiante").val();
    fechaNE = $("#fechaNacimientoEstudiante").val();

    //console.log(nov.length);

    $.ajax({
        type: 'GET',
        url:  dominio + "buscarEstudiante/" + carne + '/' + fechaNE,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data) {

          if (data.message === 'carnet no existe') {
            alertify.set('notifier','position', 'bottom-center');
            alertify.warning("El Carné ingresado es incorrecto o no existe en el sistema. Verifícalo o comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

          }
          else if (data.message === 'fecha de nacimiento incorrecta') {
            alertify.set('notifier','position', 'bottom-center');
            alertify.warning("La fecha de nacimiento que ingresaste es incorrecta. Verifícala o comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte");

          }
          else {
            //console.log(data.OV_ASPIRANTE.nombres);
            if (data.USAC_ESTUDIANTE.registrado === 1) {
                alertify.set('notifier','position', 'bottom-center');
                alertify.error("Este usuario ya fue registrado anteriormente, debes iniciar sesión con los datos registrados.");
              }
              else{
                var nombres = data.USAC_ESTUDIANTE.nombre;
                var apellidos = data.USAC_ESTUDIANTE.apellido;
                var fechaNacimiento = data.USAC_ESTUDIANTE.fecha_nacimiento;
                var correo = data.USAC_ESTUDIANTE.correo;
                var carne = data.USAC_ESTUDIANTE.carnet;
                var nombreCompletoRegistro = data.USAC_ESTUDIANTE.nombre_completo;

                $("#modalNov").hide();
                $("#modalCarne").show();

               document.getElementById('nombres').textContent = nombreCompletoRegistro;
               document.getElementById("fechaNacimiento").value = fechaNacimiento;
               document.getElementById("correo").value = correo;
               document.getElementById('carne').textContent = carne;

                  modal.style.display = "block";

                  setCookie('api-nombre', nombres, 1);
                  setCookie('api-apellido', apellidos, 1);
                  setCookie('api-novCarne', carne, 1);
                  setCookie('api-nombreCompleto', nombreCompletoRegistro, 1);
                }

          }

      },
      error: function (response) {
        alertify.set('notifier','position', 'bottom-center');
        alertify.error("Error de conexión");
          }
    });
}
else if(cuenta== AccountType.ASPIRANTE){
  nov = $("#novAspirante").val();
  fechaNA = $("#fechaNacimientoAspirante").val();

      $.ajax({
          type: 'GET',
          url: dominio + 'buscarEstudianteNOV/' + nov,
          contentType: "application/json",
          dataType: 'json',
          crossDomain: true,
          async: false,
          success: function (response) {

            if (response.USAC_ESTUDIANTE.length > 0) {
              alertify.set('notifier','position', 'bottom-center');
              alertify.error("Como estudiante no puedes crear perfil de aspirante, debes crear tu perfil de estudiante, si ya lo tienes creado debes iniciar sesión.");
            } else {
              $.ajax({
                   type: 'GET',
                   url:  dominio + "buscarAspirante/" + nov + '/' + fechaNA,
                   contentType: "application/json",
                   dataType: 'json',
                   async: false,
                   success: function (data) {

                     if (data.message === 'nov no existe') {
                       alertify.set('notifier','position', 'bottom-center');
                       if(data.source === 'Local'){
                        alertify.warning("El NOV ingresado es incorrecto o no existe en el sistema. Verifícalo o comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte.");
                       }else if(data.source === 'External'){
                        alertify.warning("El NOV ingresado es incorrecto o no existe en el sistema. Verifícalo o dirigirte al edificio de bienestar estudiantil 3er nivel si eres del campus central o si eres de centro universitario departamental a la oficina de atención al estudiante, en horario de oficina.");
                       }

                     }
                     else if (data.message === 'fecha de nacimiento incorrecta') {
                       alertify.set('notifier','position', 'bottom-center');
                       if(data.source === 'Local'){
                        alertify.warning("La fecha de nacimiento que ingresaste es incorrecta. Verifícala o comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte.");
                       }else if(data.source === 'External'){
                        alertify.warning("La fecha de nacimiento que ingresaste es incorrecta. Verifícala o Dirigirte al edificio de bienestar estudiantil 3er nivel si eres del campus central o si eres de centro universitario departamental a la oficina de atención al estudiante, en horario de oficina.");
                       }

                     }else if (data.message === 'nov no entregado') {
                      alertify.set('notifier','position', 'bottom-center');
                      alertify.error(`NOV en estado incorrecto. ${data.details}. Dirigirte al edificio de bienestar estudiantil 3er nivel si eres del campus central o si eres de centro universitario departamental a la oficina de atención al estudiante, en horario de oficina.`);
                     }else {
                       //console.log(data.OV_ASPIRANTE.nombres);
                       if (data.OV_ASPIRANTE.registrado === 1) {
                           alertify.set('notifier','position', 'bottom-center');
                           alertify.error("Este usuario ya fue registrado anteriormente, debes iniciar sesión con los datos registrados.");
                         }
                         else{
                           var nombres = data.OV_ASPIRANTE.nombres;
                           var apellidos = data.OV_ASPIRANTE.apellidos;
                           var fechaNacimiento = data.OV_ASPIRANTE.fecha_nacimiento;
                           var correo = data.OV_ASPIRANTE.correo;
                           var nov = data.OV_ASPIRANTE.nov;

                           $("#modalNov").show();
                           $("#modalCarne").hide();

                          document.getElementById('nombres').textContent = nombres + " " + apellidos;
                          document.getElementById("fechaNacimiento").value = fechaNacimiento;
                          document.getElementById("correo").value = correo;
                          document.getElementById('nov').textContent = nov;

                             modal.style.display = "block";

                             setCookie('api-nombre', nombres, 1);
                             setCookie('api-apellido', apellidos, 1);
                             setCookie('api-novCarne', nov, 1);
                           }

                     }

                 },
                 error: function (xhr, status, errorThrow) {
                    // console.log('on internal', status, errorThrow, xhr);
                    // console.log('on responseJSON', xhr.responseJSON);
                    alertify.set('notifier','position', 'bottom-center');
                    if(xhr.status == 0){
                      alertify.error("No hay conexión. Por favor verifica tu red.");
                    }else if( xhr.status == 400 && xhr.responseJSON?.message ){
                      alertify.error(xhr.responseJSON?.message);
                    }else if(xhr.status == 500 && xhr.responseJSON?.message === 'Error en OV API'){
                      alertify.error(`Ocurrió un error. ${xhr.responseJSON.details}`);
                    }else if (xhr.status == 500 && xhr.responseJSON?.message === 'NOV incorrecto en servicio externo') {
                      alertify.set('notifier','position', 'bottom-center');
                      alertify.error(`La información del NOV es incorrecta en servicio de Orientación Vocacional. Dirigirte al edificio de bienestar estudiantil 3er nivel si eres del campus central o si eres de centro universitario departamental a la oficina de atención al estudiante, en horario de oficina.`);
                    }else{
                      alertify.error(`Ocurrió un error. ${xhr.responseJSON?.message || ""}`);
                    }
                  }
               });
            }
          },
          error: function (response, status) {
            // console.log('on external', status, response)
            alertify.set('notifier','position', 'bottom-center');
            alertify.error("error en la conexión");
          }
      });



}

}
////////////actualizar datos
function actualizarDatos() {
  if(tipoCuenta== AccountType.ESTUDIANTE){
    carne = $("#carneEstudiante").val();
    correo = $("#correo").val();
    fechaNacimiento = $("#fechaNacimiento").val();
    data = '{"correo": "'+correo+'", "fecha_nacimiento" : "'+fechaNacimiento+'"}';

      $.ajax({
          type: 'PUT',
          url: dominio + `actualizarEstudiante/` + carne,
          contentType: 'application/json',
          dataType: 'HTML',
          crossDomain: true,
          async: false,
          data: data,
          success: function (data) {
              //console.log(data);
              alertify.set('notifier','position', 'bottom-center');
              alertify.success("Se ha realizado el registro correctamente");
              window.location.href = "pass.html";

          }
      })

  } else if(tipoCuenta== AccountType.ASPIRANTE){
  nov = $("#novAspirante").val();
  correo = $("#correo").val();
  fechaNacimiento = $("#fechaNacimiento").val();
  data = '{"correo": "'+correo+'", "fecha_nacimiento" : "'+fechaNacimiento+'"}';

    $.ajax({
        type: 'PUT',
        url: dominio + `actualizarAspirante/` + nov,
        contentType: 'application/json',
        dataType: 'HTML',
        crossDomain: true,
        async: false,
        data: data,
        success: function (data) {
            //console.log(data);
            alertify.set('notifier','position', 'bottom-center');
            alertify.success("Se ha realizado el registro correctamente");
            window.location.href = "pass.html";

        }
    })
  }
}

$("#registrar").on('click', function () {
  var m = document.getElementById("correo").value;
  var expreg = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;

  if($("#correo").val()===""){
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("El campo Correo esta vacio");
  } else if (expreg.test(m)){
    actualizarDatos();
  }
  else {
    alertify.set('notifier','position', 'bottom-center');
    alertify.warning("El formato del correo es incorrecto, revisalo.");
  }

});

//botón aspirante
$("#aspirante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#estudiante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = AccountType.ASPIRANTE;
        $(".divAspirante").show();
        $(".divEstudiante").hide();
        scrollToElement('#botonesTipo');
        alertify.set('notifier','position', 'bottom-center');
        alertify.notify('Este tipo de cuenta es para aspirantes de primer ingreso con número de orientación vocacional.', 'custom', 4, function(){});
      //  alertify.notify("Este tipo de cuenta es para aspirantes de primer ingreso");
});

$("#registroAspirante").on('click', function () {

   if($("#novAspirante").val()==="" && $("#fechaNacimientoAspirante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Los dos campos estan vacios");
    }
    else if($("#novAspirante").val()===""){
    alertify.set('notifier','position', 'bottom-center');
    alertify.error("El campo Número de Orientación Vocacional esta vacio");
  }
  else if($("#fechaNacimientoAspirante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Fecha de nacimiento esta vacio");
    }
  else {
  registro(tipoCuenta);
  }
});

//bontón estudiante
$("#estudiante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#aspirante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = AccountType.ESTUDIANTE;
        $(".divEstudiante").show();
        $(".divAspirante").hide();
        scrollToElement('#botonesTipo');
        alertify.set('notifier','position', 'bottom-center');
        alertify.notify('Este tipo de cuenta es para estudiantes universitarios, en tramites de traslados y/o carreras simultaneas.', 'custom', 8, function(){});
        //alertify.notify("Este tipo de cuenta es para estudiantes universitarios, en tramites de traslados y/o carreras simultaneas.");
});


$("#registroEstudiante").on('click', function () {

   if($("#carneEstudiante").val()==="" && $("#fechaNacimientoEstudiante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Los dos campos estan vacios");
    }
    else if($("#carneEstudiante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Carné Universitario esta vacio");
    }
  else if($("#fechaNacimientoEstudiante").val()===""){
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("El campo Fecha de nacimiento esta vacio");
    }

  else {
  registro(tipoCuenta);
  }
});

function scrollToElement(selector, callback){
    var animation = {scrollTop: $(selector).offset().top};
    $('html,body').animate(animation, 'slow', 'swing', function() {
        if (typeof callback == 'function') {
            callback();
        }
        callback = null;
    });
}
