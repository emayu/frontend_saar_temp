$(document).ready(function () {


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


adAsignacion();
//buscarCursosPagados();

});

var datosAsignacion = [];

//////////hacer consulta de Resultados

//////////////buscar resultados si ya esta asignado

function adAsignacion() {
  let date = new Date();
let fechaActual = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');


 $.ajax({
      type: 'GET',
      url:  dominio + "fechaId/2",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
      //console.log(data.fecha.fecha);

      if(data.fecha.fecha >= fechaActual){
        verificarAsignacion();
      }
      else {

        fechaLimiteConstancia = data.fecha.fecha.split("-");
        diasMas = parseInt(fechaLimiteConstancia[2]) + 10;
        fechaVistaConstancia = diasMas +"/"+ fechaLimiteConstancia[1]+"/"+ fechaLimiteConstancia[0];

         document.getElementById("activo").innerHTML = '<img src="assets/img/pap.jpeg" class="img-fluid" alt="">';
         //document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> La constancia estará disponible a partir de '+ fechaVistaConstancia +'</strong></a>';

      }


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("error en la conexión");
        }
  });
}


function verificarAsignacion(){


 $.ajax({
      type: 'GET',
      url:  dominio + "papAsignacionNov/" + novCarne,
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {
  //  console.log(data.asignacion);

    if(data.asignacion.length > 0){
      //console.log("entre al if");
      $("#btAsignar").hide();

      for (i = 0; i < data.asignacion.length; i++){

        fechaEvaluacion =  data.asignacion[i].fecha_asignacion.split("-");
        fechaAsignacion = fechaEvaluacion[2] +"/"+ fechaEvaluacion[1]+"/"+ fechaEvaluacion[0];

          datosAsignacion.push([data.asignacion[i].nombre, data.asignacion[i].jornada, data.asignacion[i].seccion, data.asignacion[i].hora_entrada + ' A ' + data.asignacion[i].hora_salida,data.asignacion[i].nombre_docente, data.asignacion[i].link_meet]);
          //  buscarEnAsignacion(data.DETALLEFACULTAD[i].fecha_examen);
        }

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
            pdf.text(60, 75, "CONSTANCIA DE CURSOS ASIGNADOS PAP DE CONOCIMIENTOS BÁSICOS");
            pdf.text(240, 90, "2022 (Segundo Semestre)");
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

            pdf.text(40,165,"CUI: " + cui);

            pdf.text(40,370,"Fecha de inscripción: " + fechaAsignacion);

            pdf.setFontSize(17).setFont(undefined, 'bold');
            pdf.text(40,410,"IMPORTANTE:");

            pdf.setFontSize(15).setFont(undefined, 'normal');
            pdf.text(40,430,"- Puedes acceder a los salones virtuales de clases a través del enlace que aparece \n en la descripción de cada curso.");

            pdf.setFontSize(14).setFont(undefined, 'normal');
            pdf.text(40,465,"- Una vez asignado no hay cambios de horarios o jornada.");

            pdf.setFontSize(14).setFont(undefined, 'bold');
            pdf.text(40,495,"Inicio de clases: ");
            pdf.setFontSize(14).setFont(undefined, 'normal');
            pdf.text(150,495,"11 de julio de 2022 (sujeto a cambios).");



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



          var columns = ["Curso Asignado", "Jornada", "Sección", "Hora", "Docente", "Enlace de clase"];
          var data = datosAsignacion;


        pdf.autoTable(columns,data,
          {
                      margin: { top: 185, left: 65, right: 65, bottom: 75 }
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


    }
    else {
    //  mostrar mensaje que no tiene asignacion
    document.getElementById("activo").innerHTML = '<a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> No tienes cursos asignados.</strong></a>';

    }


    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Error de conexión");
        }
  });

}


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
