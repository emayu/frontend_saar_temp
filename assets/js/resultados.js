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
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres+ ' ' +apellidos+'</a> <p> <a class="nav-link" style="color: black; font-size: 25px;">Nota: <strong> Los resultados estarán disponibles a partir del 20 de mayo del 2022</strong></a></p>';

  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';

/////////////recibir los resultados

//resultados(novCarne, 0);

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
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+ nombreCompleto +'</a> <p> <label for="">Los resultados estarán disponibles a partir del 20 de mayo del 2022 </label> </p>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+ nombreCompleto +'<br><b>Carné: '+novCarne+'</b></a>';

  ///////////recibir los resultados
  //resultados(novEstudiante, novCarne);
}


});

var datos = [];

//////////hacer consulta de Resultados
function resultados(nov, carneE) {

  materia = "";
  tipoAprobacion = "";
  ingreso = "";
  contadorSatisfactorio  = 0;


  $.ajax({
      type: 'GET',
      url:  dominio + "buscarResultadoNC/" + nov + "/" + carneE,
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data) {


        if(data.RESULTADO.length > 0){

              $("#Table").append('<tr><th>Materia</th>'+
              '<th>Fecha de calificación</th>' +
              '<th>Resultado</th>'+
              '<th>Identificador</th>');

              for (i = 0; i < data.RESULTADO.length; i++){

                fechaEvaluacion = data.RESULTADO[i].fecha_evaluacion.split("-");
                fechaResultado = fechaEvaluacion[2] +"/"+ fechaEvaluacion[1]+"/"+ fechaEvaluacion[0];


                if(data.RESULTADO[i].id_materia === 1) {
                  materia = "Biología"
                }
                else if(data.RESULTADO[i].id_materia === 2) {
                  materia = "Física"
                }
                else if(data.RESULTADO[i].id_materia === 3) {
                  materia = "Lenguaje"
                }
                else if(data.RESULTADO[i].id_materia === 4) {
                  materia = "Matemática"
                }
                else if(data.RESULTADO[i].id_materia ===5) {
                  materia = "Química"
                }

                ////////////tipo aprobo o // no

                if(data.RESULTADO[i].aprobacion === 1) {
                  tipoAprobacion = "Satisfactorio"
                  contadorSatisfactorio += 1;

                  if(data.RESULTADO[i].ingreso === 1) {

                    datos.push([materia, fechaResultado, data.RESULTADO[i].nota, tipoAprobacion, data.RESULTADO[i].nov]);
                  }
                  else if(data.RESULTADO[i].ingreso === 2) {

                    datos.push([materia, fechaResultado, data.RESULTADO[i].nota, tipoAprobacion, novCarne]);
                  }



                }
                else if(data.RESULTADO[i].aprobacion === 2) {
                  tipoAprobacion = "Insatisfactorio";
                }

                //////////////////tipo de Usuario

                if(data.RESULTADO[i].ingreso === 1) {
                  ingreso = '<td align="center" style="dislay: none;">' + data.RESULTADO[i].nov + '</td>';
                }
                else if(data.RESULTADO[i].ingreso === 2) {
                  ingreso = '<td align="center" style="dislay: none;">' + novCarne + '</td>';
                }

           $("#Table").append('<tr>' +
              '<td align="center" style="dislay: none;">' + materia + '</td>'+
              '<td align="center" style="dislay: none;">' + fechaResultado + '</td>'+
              '<td align="center" style="dislay: none;">' + tipoAprobacion + '</td>'+ ingreso +'</tr>');
              }


                  if(contadorSatisfactorio >= 1){

                    document.getElementById("constancia").innerHTML = '<button class="btn btn-primary btn-lg" type="submit" id="descargarConstancia">Descargar Constancia</button>';

                  }
        }
        else {
          alertify.set('notifier','position', 'bottom-center');
          alertify.warning("No cuentas con resultados de PCB.");
        }

    },
    error: function (response) {
      alertify.set('notifier','position', 'bottom-center');
      alertify.error("Error de conexión");
        }
  });

}

$(document).ready(function () {

$("#descargarConstancia").on('click', function () {

  var imgUsac = new Image()
  imgUsac.src = 'assets/img/machoteTransparente1.png'
  const addFooters = pdf => {
    const pageCount = pdf.internal.getNumberOfPages()

    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
    pdf.addImage(imgUsac, 'jpeg', 0, 6, 605, 415);
    pdf.setFontSize(13).setFont(undefined, 'bold');
    pdf.text(250, 75, "Form.SUN.09.02");
    pdf.text(50, 90, "CONSTANCIA DE RESULTADOS DE PRUEBAS DE CONOCIMIENTOS BÁSICOS");
    pdf.setFontSize(12).setFont(undefined, 'normal');

    if(novCarne.length === 10){
      pdf.text(40,125,"Nombre: " + nombres + " " + apellidos);
      pdf.text(40,140,"NOV: " + novCarne );
      risa = myCipher(novCarne);
    }
    else if(novCarne.length >= 1 && novCarne.length <= 9){
      pdf.text(40,125,"Nombre: " + nombreCompleto);
      pdf.text(40,140,"Carné: " + novCarne );
      risa = myCipher(novCarne);
    }

    var fechajs = new Date();
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    pdf.setFontSize(9).setFont(undefined, 'normal');
    pdf.text(490,10,hoy.toLocaleDateString() + ' ' + fechajs.getHours() + ':' + fechajs.getMinutes() + ':' + fechajs.getSeconds());

    pdf.text(20,410,risa);
    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.textWithLink('SUNUSAC', 255, 400, {url: 'https://www.facebook.com/SUNUSAC'});
    pdf.textWithLink('sun_usac', 337, 400, {url: 'https://www.instagram.com/sun_usac/'});
    pdf.setPage(i);
    pdf.text('Página ' + String(i) + ' de ' + String(pageCount), 550, 410, {
     align: 'center'
   });


    }
  }

var risa = "";




  var pdf = new jsPDF('l', 'pt', 'a5');



  var columns = ["Materia", "Fecha de calificación", "Nota", "Resultado", "Identificador"];
  var data = datos;


pdf.autoTable(columns,data,
  {
              margin: { top: 150, left: 65, right: 65, bottom: 75 }
          }
);
addFooters(pdf);


/////////////////////////////////////////////////

pdf.save(novCarne +'-' +contadorSatisfactorio+ '.pdf');
//var out = pdf.output();
//  console.log(out);
  //var url = 'data:application/pdf;base64,' + btoa(out);

//PDFObject.embed('data:application/pdf;base64,' + btoa(out));
});
});

$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
