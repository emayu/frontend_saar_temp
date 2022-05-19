$(document).ready(function () {

  $("#selCentros").hide();
  $("#selFacultades").hide();

$("#menuAE").load("menu.html");

if(novCarne.length === 10){
  //////////body
  var tel = "";
  if(telefono == 'null'){
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> No esta registrado</a>';
  }
  else {
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> '+telefono+'</a>';
  }
  document.getElementById("datosResultados").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novCarne+ '</a>' +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres+ ' ' +apellidos+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';

/////////////recibir los resultados


}
else if (novCarne == 'null') {
  window.location.href = "index.html";

}
else if(novCarne.length >= 1 && novCarne.length <= 9){

  //////////body
  var tel = "";
  var novE = "";
  if(telefono == 'null'){
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> No esta registrado</a>';
  }
  else {
    tel = '<a class="nav-link" style="color: black;"><strong>Teléfono:</strong> '+telefono+'</a>';
  }

  if( novEstudiante == 'null'){
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong> No esta Registrado</a>';
  }
  else {
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novEstudiante+ '</a>';
  }


  document.getElementById("datosResultados").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: </strong>'+novCarne+ '</a>' + novE +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+ nombreCompleto +'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+ nombreCompleto +'<br><b>Carné: '+novCarne+'</b></a>';

}


verificarAsignacion();
});

var datosAsignacion = [];
var facultadConstancia = "";
var centroConstancia = "";


//////////hacer consulta de Resultados

//////////////buscar resultados si ya esta asignado

function verificarAsignacion(){


 $.ajax({
      type: 'GET',
      url:  dominio + "papAsignacionNov/" + novCarne,
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
    //console.log(data.PAPASIGNACION.length);

    if(data.PAPASIGNACION.length > 0){
      console.log("entre al if");
    }
    else {
      console.log("entre al else");
      obtenerPreasignacion();
    }


    /*if(data.asignaciones.length > 0){

      for (i = 0; i < data.asignaciones.length; i++){

        fechaEvaluacion =  data.asignaciones[i].fecha_examen.split("-");
        fechaAsignacion = fechaEvaluacion[2] +"/"+ fechaEvaluacion[1]+"/"+ fechaEvaluacion[0];

          datosAsignacion.push([data.asignaciones[i].asignacion, data.asignaciones[i].materia, fechaAsignacion, data.asignaciones[i].tipo, data.asignaciones[i].hora_examen]);
          //  buscarEnAsignacion(data.DETALLEFACULTAD[i].fecha_examen);

        }
        facultadConstancia = data.asignaciones[0].facultad;
        centroConstancia = data.asignaciones[0].centro;

        /////////////crear pdf


          var imgUsac = new Image()
          var imgSun = new Image()
          var imgRedes = new Image()


          imgUsac.src = 'assets/img/logoUSACCarta.png'
          imgSun.src = 'assets/img/logosunLetras.png'
          imgRedes.src = 'assets/img/footerRedes.png'
          const addFooters = pdf => {
            const pageCount = pdf.internal.getNumberOfPages()

            pdf.setFont('helvetica', 'italic')
            pdf.setFontSize(8)
            for (var i = 1; i <= pageCount; i++) {
            pdf.addImage(imgUsac, 'jpeg', 10, 10, 0, 0);
            pdf.addImage(imgSun, 'jpeg', 535, 470, 0, 0);
            pdf.addImage(imgRedes, 'jpeg', 65, 720, 0, 0);
            pdf.setFontSize(13).setFont(undefined, 'bold');
            pdf.text(250, 75, "Form.SUN.09.01");
            pdf.text(50, 90, "CONSTANCIA DE ASIGNACIÓN DE PRUEBAS DE CONOCIMIENTOS BÁSICOS");
            pdf.setFontSize(12).setFont(undefined, 'normal');

            if(novCarne.length === 10){
              pdf.text(40,125,"Nombre: " + nombres + " " + apellidos);
              pdf.text(40,145,"NOV: " + novCarne );
              risa = myCipher(novCarne);
            }
            else if(novCarne.length >= 1 && novCarne.length <= 9){
              pdf.text(40,125,"Nombre: " + nombreCompleto);
              pdf.text(40,145,"Carné: " + novCarne );
              risa = myCipher(novCarne);
            }

            fechaNa =  fechaNacimiento.split("-");
            fechaNac = fechaNa[2] +"/"+ fechaNa[1]+"/"+ fechaNa[0];

            pdf.text(40,165,"Fecha de Nacimiento: " + fechaNac);
            pdf.text(40,185,"Estudiará en: " + centroConstancia);
            pdf.text(40,205,"Unidad académica: " + facultadConstancia);

            pdf.setFontSize(15).setFont(undefined, 'normal');

            pdf.text(40,390,"Tus Pruebas de Conocimientos Básicos se llevarán a cabo en línea. \n Podrás ingresar dando clic en el siguiente enlace:");

            pdf.text(40,490,"En las fechas y horarios establecidos en esta constancia de inscripción.");

            pdf.setFontSize(13).setFont(undefined, 'normal');
            pdf.text(40,545,"Tres días antes de tu(s) prueba(s) se habilitará el acceso a la plataforma de aplicación, \n para que verifques lo siguiente: \n - Que tu explorador de Internet sea compatible y esté actualizado \n - Que puedas iniciar sesión (debes utilizar el número de orientación vocacional o carnet \n universitario y la fecha de nacimiento registrada en esta constancia de inscripción) \n - Las materias y horarios asignados");

            pdf.text(40,665,"Para la aplicación de Pruebas de Conocimientos Básicos");

            pdf.setFontSize(17).setFont(undefined, 'bold');
            pdf.textWithLink('https://radd1.virtual.usac.edu.gt/pcb/', 145, 445, {url: 'https://radd1.virtual.usac.edu.gt/pcb/'});
            pdf.textWithLink('Clic acá', 260, 685, {url: 'https://drive.google.com/file/d/1u-b0x2vsWcMOxbgSJZf0uZDSnCcR9Y6D/view'});
            pdf.text(40,520,"** IMPORTANTE**");
            pdf.text(160,645,"Instrucciones y Recomendaciones");

            var fechajs = new Date();
            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);
            pdf.setFontSize(9).setFont(undefined, 'normal');
            pdf.text(524,10,hoy.toLocaleDateString() + ' ' + fechajs.getHours() + ':' + fechajs.getMinutes() + ':' + fechajs.getSeconds());

            pdf.text(20,780,risa);
            pdf.setFontSize(10).setFont(undefined, 'bold');
            pdf.textWithLink('SUNUSAC', 255, 765, {url: 'https://www.facebook.com/SUNUSAC'});
            pdf.textWithLink('sun_usac', 337, 765, {url: 'https://www.instagram.com/sun_usac/'});
            pdf.setPage(i);
            pdf.text('Página ' + String(i) + ' de ' + String(pageCount), 560, 780, {
             align: 'center'
           });


            }
          }

        var risa = "";




          var pdf = new jsPDF('p', 'pt', 'letter');



          var columns = ["No. Asignado", "Materia Asignada", "Fecha", "Lugar", "Hora"];
          var data = datosAsignacion;


        pdf.autoTable(columns,data,
          {
                      margin: { top: 220, left: 65, right: 65, bottom: 75 }
                  }
        );
        addFooters(pdf);


        /////////////////////////////////////////////////

        //pdf.save(novCarne + '.pdf');
        var out = pdf.output();
        //  console.log(out);
          var url = 'data:application/pdf;base64,' + btoa(out);

        PDFObject.embed('data:application/pdf;base64,' + btoa(out), '#visorPDF');

        //console.log(datosAsignacion);
      //  $('#pPDf').attr('src', url)
    // document.getElementById("visorPDF").innerHTML ='<iframe src="' +url+ ' #view=fitH" width= "70%" height="100%"></iframe>';
    document.getElementById("visorPDF").innerHTML ='<object data="' +url+ '" type="application/pdf" width= "100%" height="100%"> <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf de tu constancia de asignación, pero la puedes <a href="'+url+'"> Descargar aquí</a></p> </object>';


    } else {
        buscarPreAsignacion();
        $("#visorPDF").hide();

      document.getElementById("btnAsignar").innerHTML = '<button class="btn btn-primary btn-lg botonAsignar" type="submit" id="">Asignar</button>';

    }*/


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Error de conexión");
        }
  });

}

cursosPreasignacion = [];
/////////buscar resultados

function obtenerPreasignacion() {


  $.ajax({
       type: 'GET',
       url:  dominio + "papPreasignacionNov/" + novCarne,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       //console.log(data.PAPPREASIGNACION.length);

       cursosPreasignacion.length = 0;

       for(i=0; i<data.PAPPREASIGNACION.length; i++){
         cursosPreasignacion.push(data.PAPPREASIGNACION[i].id_materia);
       }

    console.log(cursosPreasignacion);



     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("Usuario o Contraseña Incorrecto!");
         }
   });

}



$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});