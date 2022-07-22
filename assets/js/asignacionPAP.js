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


verificarAsignacion();
//buscarCursosPagados();

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
  //  console.log(data.asignacion);

    if(data.asignacion.length > 0){
      //console.log("entre al if");
      $("#btAsignar").hide();

      for (i = 0; i < data.asignacion.length; i++){

        fechaEvaluacion =  data.asignacion[i].fecha_asignacion.split("-");
        fechaAsignacion = fechaEvaluacion[2] +"/"+ fechaEvaluacion[1]+"/"+ fechaEvaluacion[0];

          datosAsignacion.push([data.asignacion[i].asignacion, data.asignacion[i].nombre, data.asignacion[i].jornada, data.asignacion[i].seccion, data.asignacion[i].hora_entrada + ' A ' + data.asignacion[i].hora_salida]);
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
            pdf.text(100, 75, "CONSTANCIA DE INSCRIPCIÓN PAP DE CONOCIMIENTOS BÁSICOS");
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

            pdf.text(40,350,"Fecha de inscripción: " + fechaAsignacion);

            pdf.setFontSize(17).setFont(undefined, 'bold');
            pdf.text(40,390,"IMPORTANTE:");

            pdf.setFontSize(15).setFont(undefined, 'normal');
            pdf.text(40,410,"Para finalizar tu inscripción ingresa a al siguente formulario:");

            pdf.text(40,475,"llena tus datos y envia tu papelería. \n Se te solicitará: \n - Esta constancia de inscripción. \n - Fotografía de DPI (parte frontal) o partida de nacimiento. \n - Fotografía de tu tarjeta, resultado en pdf de orientación vocacional o \n carné universitario. \n - Fotografía tamaño cédula (Los archivos en formato pdf ó jpg deben tener \n un máximo de 1MB).");

            pdf.setFontSize(14).setFont(undefined, 'bold');
            pdf.text(40,615,"- Es indispensable el envío de tus datos personales y papelería a través del \n formulario en caso no lo realices, tu inscripción quedará sin efecto.");

            pdf.setFontSize(14).setFont(undefined, 'normal');
            pdf.text(40,665,"Una vez asignado no hay cambios de horarios o jornada.");

            pdf.setFontSize(14).setFont(undefined, 'bold');
            pdf.text(40,680,"Inicio de clases: ");
            pdf.setFontSize(14).setFont(undefined, 'normal');
            pdf.text(150,680,"27 de julio de 2022 (sujeto a cambios).");

            pdf.setFontSize(17).setFont(undefined, 'bold');
            pdf.textWithLink('https://forms.gle/qugTybbVj8FLJm6n6', 145, 435, {url: 'https://forms.gle/qugTybbVj8FLJm6n6'});


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



          var columns = ["No. Asignado", "Curso Asignado", "Jornada", "Sección", "Hora"];
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
    //  console.log("entre al else");
      obtenerPreasignacion();
    }


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
  document.getElementById("botonAs").innerHTML= '<button type="button" class="btn btn-primary" onclick="CheckDropdowns()" id="btAsignar">Asignar</button>';


  $.ajax({
       type: 'GET',
       url:  dominio + "papPreasignacionNov/" + novCarne,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       //console.log(data.PAPPREASIGNACION.length);

       html = "";
       html += '<a class="nav-link" style="color: black; font-size: 25px;">Selecciona los horarios de tus cursos</a>'
       cursosPreasignacion.length = 0;

       for(i=0; i<data.PAPPREASIGNACION.length; i++){
         //cursosPreasignacion.push(data.PAPPREASIGNACION[i].id_materia);


         $.ajax({
              type: 'GET',
              url:  dominio + "papDetalleSalonesMateria/" + data.PAPPREASIGNACION[i].id_materia,
              contentType: "application/json",
              dataType: 'json',
              async: false,
              success: function (data) {
                //console.log(data.DETALLESALONPAP.length);

                if(data.DETALLESALONPAP.length >0){

                  if(data.DETALLESALONPAP[0].id_materia === 1){
                    html += '<div class="text-center"> <label>'+ data.DETALLESALONPAP[0].nombre +'</label> <select id="selectBiolo" class="form-select">'
                    html += '<option value="0" disabled selected hidden>Seleccione el Horario</option>';

                    for(j=0; j<data.DETALLESALONPAP.length; j++){
                      //cursosPreasignacion.push([data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].id_materia, data.DETALLESALONPAP[j].nombre, data.DETALLESALONPAP[j].jornada, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida])
                      buscarCursosPagados(1, data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida, data.DETALLESALONPAP[j].jornada);
                    }
                      html += '</select>';

                  //  html += '<option value="">'+ cursosPreasignacion[i][5] + ' a ' + cursosPreasignacion[i][6] +'</option>';
                    html += '</div>';
                  }
                  else if(data.DETALLESALONPAP[0].id_materia === 2){
                      //console.log(data.DETALLESALONPAP[i].nombre);
                      html += '<div class="text-center"> <label>'+ data.DETALLESALONPAP[0].nombre +'</label> <select id="selectFisica" class="form-select">'
                      html += '<option value="0" disabled selected hidden>Seleccione el Horario</option>';

                      for(j=0; j<data.DETALLESALONPAP.length; j++){
                        //cursosPreasignacion.push([data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].id_materia, data.DETALLESALONPAP[j].nombre, data.DETALLESALONPAP[j].jornada, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida])
                        buscarCursosPagados(2, data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida, data.DETALLESALONPAP[j].jornada);
                      }
                        html += '</select>';

                    //  html += '<option value="">'+ cursosPreasignacion[i][5] + ' a ' + cursosPreasignacion[i][6] +'</option>';
                      html += '</div>';
                    }
                    else if(data.DETALLESALONPAP[0].id_materia === 3){
                        //console.log(data.DETALLESALONPAP[i].nombre);
                        html += '<div class="text-center"> <label>'+ data.DETALLESALONPAP[0].nombre +'</label> <select id="selectLen" class="form-select">'
                        html += '<option value="0" disabled selected hidden>Seleccione el Horario</option>';

                        for(j=0; j<data.DETALLESALONPAP.length; j++){
                          //cursosPreasignacion.push([data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].id_materia, data.DETALLESALONPAP[j].nombre, data.DETALLESALONPAP[j].jornada, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida])
                          buscarCursosPagados(3, data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida, data.DETALLESALONPAP[j].jornada);
                        }
                          html += '</select>';

                      //  html += '<option value="">'+ cursosPreasignacion[i][5] + ' a ' + cursosPreasignacion[i][6] +'</option>';
                        html += '</div>';
                      }
                      else if(data.DETALLESALONPAP[0].id_materia === 4){
                          //console.log(data.DETALLESALONPAP[i].nombre);
                          html += '<div class="text-center"> <label>'+ data.DETALLESALONPAP[0].nombre +'</label> <select id="selectMate" class="form-select">'
                          html += '<option value="0" disabled selected hidden>Seleccione el Horario</option>';

                          for(j=0; j<data.DETALLESALONPAP.length; j++){
                            //cursosPreasignacion.push([data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].id_materia, data.DETALLESALONPAP[j].nombre, data.DETALLESALONPAP[j].jornada, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida])
                            buscarCursosPagados(4, data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida, data.DETALLESALONPAP[j].jornada);
                          }
                            html += '</select>';

                        //  html += '<option value="">'+ cursosPreasignacion[i][5] + ' a ' + cursosPreasignacion[i][6] +'</option>';
                          html += '</div>';
                        }
                        else if(data.DETALLESALONPAP[0].id_materia === 5){
                            //console.log(data.DETALLESALONPAP[i].nombre);
                            html += '<div class="text-center"> <label>'+ data.DETALLESALONPAP[0].nombre +'</label> <select id="selectQuimica" class="form-select">'
                            html += '<option value="0" disabled selected hidden>Seleccione el Horario</option>';

                            for(j=0; j<data.DETALLESALONPAP.length; j++){
                              //cursosPreasignacion.push([data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].id_materia, data.DETALLESALONPAP[j].nombre, data.DETALLESALONPAP[j].jornada, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida])
                              buscarCursosPagados(5, data.DETALLESALONPAP[j].id, data.DETALLESALONPAP[j].cupo, data.DETALLESALONPAP[j].hora_entrada, data.DETALLESALONPAP[j].hora_salida, data.DETALLESALONPAP[j].jornada);
                            }
                              html += '</select>';

                          //  html += '<option value="">'+ cursosPreasignacion[i][5] + ' a ' + cursosPreasignacion[i][6] +'</option>';
                            html += '</div>';
                          }
                  else {
                    //console.log("logelseantes");
                  }

                }
                else {
                  //console.log("faltan materias");
                  alertify.set('notifier','position', 'bottom-center');
                  var duration = 15;
                  var msg = alertify.warning('En este momento no hay disponibilidad de cupo para una de las materias a asignarte, comunícate vía mensaje directo al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte', 15, function(){ clearInterval(interval);});
                  var interval = setInterval(function(){
                          msg.setContent('En este momento no hay disponibilidad de cupo para una de las materias a asignarte, comunícate vía mensaje directo al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte');
                        },1000);
                  $("#btAsignar").hide();

                }



            },
            error: function (response) {
              alertify.set('notifier','position', 'bottom-center');
              alertify.error("error de conexión");
                }
          });

       }

       $("#activo").html(html);

       //console.log(cursosPreasignacion.length);

     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });

}

function buscarCursosPagados(idMateria, idSalonPap, cupoPap, horaEntrada, horaSalida, jornada) {
//console.log("entreacabuscarcusros");

  $.ajax({
         type: 'GET',
         url:  dominio + "buscarPapSalon/" + idSalonPap,
         contentType: "application/json",
         dataType: 'json',
         async: false,
         success: function (data) {
        // console.log(data.PAPASIGNACION);

         if(data.PAPASIGNACION.length >= cupoPap || cupoPap === 0){

           ///// quitar de la lista el salon
         }
         else {
           //console.log("si hay cupo");
           html += '<option value="'+ idSalonPap +'">'+ jornada + ', ' +horaEntrada + ' a ' + horaSalida+'</option>';

         }

       },
       error: function (response) {
         alertify.set('notifier','position', 'bottom-center');
         alertify.error("error de conexión");
           }
     });

}


function CheckDropdowns() {

            datoseSelect = [];
            //Grab all dropdown objects in array
            var drpArray = document.getElementsByTagName('select');

            //Loop through the array
            for (i = 0; i < drpArray.length; i++) {
              if(drpArray.length === 1){
                if(drpArray[i].options[drpArray[i].selectedIndex].value === '0'){
                  alertify.set('notifier','position', 'bottom-center');
                  alertify.error("debes de seleccionar un horario para la materia");
                  return false;
                }
                else {
                      //alertify.set('notifier','position', 'bottom-center');
                      //alertify.error("si asignar " + drpArray[i].options[drpArray[i].selectedIndex].value + ".");
                      datoseSelect.push(drpArray[i].options[drpArray[i].selectedIndex].value);

                  }
              }
              else {
                //Loop through the array again
                for (j = 0; j < drpArray.length; j++){

                // Checking to ensure that we are not comparing same drop downlist
                    if (drpArray[i].id != drpArray[j].id) {

                    // compare values between dropdownlists
                    if(drpArray[i].options[drpArray[i].selectedIndex].value === '0'){
                      alertify.set('notifier','position', 'bottom-center');
                      alertify.error("debes de seleccionar un horario para una materia");
                      return false;
                    }
                    else {
                        if (drpArray[i].options[drpArray[i].selectedIndex].text == drpArray[j].options[drpArray[j].selectedIndex].text) {
                          alertify.set('notifier','position', 'bottom-center');
                        //  alertify.error("Verifica tus horarios, no se permite seleccionar materias con el mismo horario. Horario repetido: " + drpArray[i].options[drpArray[i].selectedIndex].text + ".");
                          var duration = 15;
                          var msg = alertify.warning("Verifica tus horarios, no se permite seleccionar materias con el mismo horario. Horario repetido: " + drpArray[i].options[drpArray[i].selectedIndex].text + ".", 15, function(){ clearInterval(interval);});
                          var interval = setInterval(function(){
                                  msg.setContent("Verifica tus horarios, no se permite seleccionar materias con el mismo horario. Horario repetido: " + drpArray[i].options[drpArray[i].selectedIndex].text + ".");
                                },1000);
                            return false;
                        }else {

                          //alertify.set('notifier','position', 'bottom-center');
                          //alertify.error("si asignar " + drpArray[i].options[drpArray[i].selectedIndex].value + ".");
                          datoseSelect.push(drpArray[i].options[drpArray[i].selectedIndex].value);

                        }
                      }
                    }
                  }
              }
            }

                let result = datoseSelect.filter((item,index)=>{
                  return datoseSelect.indexOf(item) === index;
                })

                conteoAsignadosPAP(result);
            }

function conteoAsignadosPAP(result) {
    document.getElementById("botonAs").innerHTML= '<p style="color: black; font-size: 25px;"> <strong> Espera un momento, se está generando tu constancia de inscripción al programa académico preparatorio PAP, no cierres esta ventana ni refresques el navegador.</strong></p><p>cargando...</p><img src="assets/img/cargando.gif" />';


    for(i=0; i<result.length; i++){

      $.ajax({
             type: 'GET',
             url:  dominio + "buscarPapSalon/" + result[i],
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data) {
            // console.log(data.PAPASIGNACION.length);

             asignarPAP(data.PAPASIGNACION.length, result[i]);

           },
           error: function (response) {
             alertify.set('notifier','position', 'bottom-center');
             alertify.error("error de conexión");
               }
         });
    }
}


function asignarPAP(asignados, idSalon) {
  //console.log(asignados);
  miAsignacion = asignados + 1;

  let date = new Date();
  let fechaAsignacion = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
//  console.log(fechaAsignacion);

  data = JSON.stringify({
  id_detalle_salon_pap: idSalon,
  nov: novCarne,
  asignacion: miAsignacion,
  fecha_asignacion: fechaAsignacion,

})

  $.ajax({
       type: 'POST',
       url: dominio + 'crearAsignacionPap',
       contentType: "application/json",
       dataType: 'json',
       crossDomain: true,
       async: false,
       data: data,
       success: function (response) {

          location.reload();

       },
       error: function (response) {
          window.location.href = "index.html";
       }
   });

}



$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
