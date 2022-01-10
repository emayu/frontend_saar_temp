$(document).ready(function () {
tipoCuenta = 0;
$(".divAspirante").hide();
$(".divEstudiante").hide();
//////carne y nov
$("#modalNov").hide();
$("#modalCarne").hide();
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

  if(cuenta==2){
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
        // console.log(data);
          //var acceso = data.paciente;

        //console.log(acceso);
        if(data.USAC_ESTUDIANTE.length === 0){
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("Número de Carné o la fecha de nacimiento son incorrectos");

        } else if (data.USAC_ESTUDIANTE[0].registrado === 1) {
          alertify.set('notifier','position', 'bottom-center');
          alertify.error("Este usuario ya fue registrado anteriormente, debes iniciar sesión con los datos registrados.");
        }
        else{
          var nombres = data.USAC_ESTUDIANTE[0].nombre;
          var apellidos = data.USAC_ESTUDIANTE[0].apellido;
          var fechaNacimiento = data.USAC_ESTUDIANTE[0].fecha_nacimiento;
          var correo = data.USAC_ESTUDIANTE[0].correo;
          var carne = data.USAC_ESTUDIANTE[0].carnet;

          $("#modalNov").hide();
          $("#modalCarne").show();

         document.getElementById('nombres').textContent = nombres + " " + apellidos;
         document.getElementById("fechaNacimiento").value = fechaNacimiento;
         document.getElementById("correo").value = correo;
         document.getElementById('carne').textContent = carne;

            modal.style.display = "block";

            setCookie('api-nombre', nombres, 1);
            setCookie('api-apellido', apellidos, 1);
            setCookie('api-novCarne', carne, 1);


        }
      },
      error: function (response) {
        alertify.set('notifier','position', 'bottom-center');
        alertify.error("Usuario o Contraseña Incorrecto!");
          }
    });
}
else if(cuenta==1){
  nov = $("#novAspirante").val();
  fechaNA = $("#fechaNacimientoAspirante").val();

  //console.log(nov.length);

  $.ajax({
      type: 'GET',
      url:  dominio + "buscarAspirante/" + nov + '/' + fechaNA,
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {

      if(data.OV_ASPIRANTE.length === 0){
        alertify.set('notifier','position', 'bottom-center');
        alertify.warning("Número de Orientación Vocacional o la fecha de nacimiento son incorrectos");

      } else if (data.OV_ASPIRANTE[0].registrado === 1) {
        alertify.set('notifier','position', 'bottom-center');
        alertify.error("Este usuario ya fue registrado anteriormente, debes iniciar sesión con los datos registrados.");
      }
      else{
        var nombres = data.OV_ASPIRANTE[0].nombres;
        var apellidos = data.OV_ASPIRANTE[0].apellidos;
        var fechaNacimiento = data.OV_ASPIRANTE[0].fecha_nacimiento;
        var correo = data.OV_ASPIRANTE[0].correo;
        var nov = data.OV_ASPIRANTE[0].nov;

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
    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Usuario o Contraseña Incorrecto!");
        }
  });
}

}
////////////actualizar datos
function actualizarDatos() {
  if(tipoCuenta==2){
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

  } else if(tipoCuenta==1){
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

$("#aspirante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#estudiante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = 1;
        $(".divAspirante").show();
        $(".divEstudiante").hide();
        alertify.set('notifier','position', 'bottom-center');
        alertify.notify('Este tipo de cuenta es para aspirantes de primer ingreso.', 'custom', 4, function(){});
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

$("#estudiante").on('click', function () {
        this.style.background="#D3ECFB";
        $("#aspirante").attr('style',  'background-color:#FFFFFF');
        tipoCuenta = 2;
        $(".divEstudiante").show();
        $(".divAspirante").hide();

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



/*
$('body').keyup(function (e) {
    if (e.keyCode == 13) {
          login(tipoCuenta);
    }
});*/
