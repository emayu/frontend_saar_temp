$(document).ready(function () {

  $("#preguntasRespuetas").hide();
buscarResultado();
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

document.getElementById("nombreSimulador").innerHTML = '<h2>Simulador de PCB '+ nombreMateria +'</h2>';

//document.getElementById("cuerpoSimulador").innerHTML = '<div class=""><div class=""><p>Si has estado usando tests o cuestionarios en papelusando tests o cuestionarios en papel usando tests o cuestionarios en papel .</p></div></div>'


});

function buscarResultado() {

  $.ajax({
       type: 'GET',
       url:  dominio + "buscarSimResultadoIdTemario/" + novCarne + "/" + idTemario,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       //console.log(data);
       var html = '';
       var cPregunta = 0;
       var criterioVacio = '';
       var sumarNota = 0;
       if(data.resultados.length > 0){
         //window.location.href = "simuladorRes.html";
         ////console.log("if datos");
         for (var i = 0; i < data.resultados.length; i++) {

           if(data.resultados[i].criterio === ''){
             criterioVacio = 'No seleccionaste ninguna respuesta para contestar la pregunta.';
           }
           else {
             criterioVacio = data.resultados[i].criterio;
           }

           if(data.resultados[i].criterio === 'correcta'){

             sumarNota += parseFloat(data.resultados[i].nota);
           }

           cPregunta++;
           html += '<p style="font-size: 1.1rem;"><label for=""><strong>' + cPregunta + '. ' + data.resultados[i].pregunta + '</strong></label>'+
                  '<br>Critero: ' + criterioVacio + '</p>';
         }

         html += '<p style="font-size: 1.6rem;"><label><strong>NOTA: '+ sumarNota.toFixed(2)+ '/100 puntos.</strong></label></p>'
         html += '<p><strong>Recuerda: </strong>Los resultados que se obtengan no comprometen al Sistema de Ubicación y Nivelación –SUN– en la admisión para ingreso a las Pruebas Especificas en las unidades académicas, ni están asociados con los futuros desempeños en las pruebas reales.</p>'
         ////console.log(sumarNota);
         document.getElementById("notas").innerHTML = html;

         $("#preguntasRespuetas").hide();
         if(idTemario == 2 || idTemario == 3 || idTemario == 4){
           //console.log("entre if matriculado");
           matricularCurso();
         }
         else  {
          //no se matricula
          document.getElementById("cargandoWS").innerHTML = '';
         }
       }
       else{
        // //console.log("else datos");
         $("#preguntasRespuetas").show();
         buscarTemario();
       }
       ////console.log(data.temarios[0].nombre_archivo2);

     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });

}

/////////////////////////
var doc1 = "";
var doc2 = "";

function buscarTemario(){

  $.ajax({
       type: 'GET',
       url:  dominio + "buscarTemarioId/" + idTemario,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       ////console.log(data);
       ////console.log(data.temarios[0].nombre_archivo2);

       if(data.temarios[0].nombre_archivo1 != '' && data.temarios[0].nombre_archivo2 != ''){
         //console.log("si tengo 2 archivo");
         document.getElementById("documentosTemario").innerHTML = '<h5>Documentos disponibles:</h5><button type="button" class="btn btn-info" data-toggle="modal" id="boton-doc1" data-target=".bd-example-modal-lg">'+ data.temarios[0].nombre_archivo1 + '</button>&nbsp;'+
         '<button type="button" class="btn btn-info" data-toggle="modal" id="boton-doc2" data-target=".bd-example-modal-lg">'+ data.temarios[0].nombre_archivo2 + '</button>';

         doc1 = data.temarios[0].archivo1;
         doc2 = data.temarios[0].archivo2;
       }
       else if (data.temarios[0].nombre_archivo1 != '') {
         //console.log("si tengo primer archivo");
         document.getElementById("documentosTemario").innerHTML = '<h5>Documentos disponibles:</h5><button type="button" class="btn btn-info" data-toggle="modal" id="boton-doc1" data-target=".bd-example-modal-lg">'+ data.temarios[0].nombre_archivo1 + '</button>';

         doc1 = data.temarios[0].archivo1;

       }
       else if (data.temarios[0].nombre_archivo2 != '') {
         //console.log("si tengo segundo archivo");
         document.getElementById("documentosTemario").innerHTML = '<h5>Documentos disponibles:</h5><button type="button" class="btn btn-info" data-toggle="modal" id="boton-doc2" data-target=".bd-example-modal-lg">'+ data.temarios[0].nombre_archivo2 + '</button>';

         doc2 = data.temarios[0].archivo2;

       }
       else {
         //console.log("no tiene documentos");
         document.getElementById("documentosTemario").innerHTML = '';
       }
      // document.getElementById("documentosTemario").innerHTML

      preguntas(data.temarios[0].id_temario);

     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });


}

var Questions = '';
function preguntas(idT) {

  $.ajax({
       type: 'GET',
       url:  dominio + "buscarPorTemario/" + idT,
       contentType: "application/json",
       dataType: 'json',
       async: false,
       success: function (data) {
       ////console.log(data);
       ////console.log(data.temarios[0].nombre_archivo2);
      // //console.log(JSON.parse(data.preguntas));

       Questions = JSON.parse(data.preguntas);
       document.getElementById("cargandoWS").innerHTML = '';

     },
     error: function (response) {
       alertify.set('notifier','position', 'bottom-center');
       alertify.error("error de conexión");
         }
   });

   if (start) {
   	iterate("0");
   }
}

var preguntaActual = "";
var selected = "";
var start = true;
function iterate(id) {
//console.log(id);
contadorPregunta = parseInt(id) + 1;
document.getElementById("noPregunta").innerHTML = 'Pregunta ' + contadorPregunta;
	// Getting the question
	const question = document.getElementById("cuerpoSimulador");


	// Setting the question text
	question.innerHTML =Questions[id].q;
	// Getting the options
  const op1 = document.getElementById('op1');
	const op2 = document.getElementById('op2');
	const op3 = document.getElementById('op3');
	const op4 = document.getElementById('op4');


  const op1O = document.getElementById('op1O');
	const op2O = document.getElementById('op2O');
	const op3O = document.getElementById('op3O');
	const op4O = document.getElementById('op4O');

  const btAcptar = document.getElementById('btnGuardar');

  //console.log(Questions[id]);

	// Providing option text
	op1.innerText = Questions[id].a[0].text;
	op2.innerText = Questions[id].a[1].text;
	op3.innerText = Questions[id].a[2].text;
	op4.innerText = Questions[id].a[3].text;

	// Providing the true or false value to the options
	op1O.value = Questions[id].a[0].isCorrect;
	op2O.value = Questions[id].a[1].isCorrect;
	op3O.value = Questions[id].a[2].isCorrect;
	op4O.value = Questions[id].a[3].isCorrect;

  btAcptar.addEventListener("click", ()  => {
  preguntaActual = $("#cuerpoSimulador").text();
  })

  op1O.addEventListener("click", () => {
    selected = op1O.value;
  })

  // Show selection for op2
  op2O.addEventListener("click", () => {
    selected = op2O.value;
  })

  // Show selection for op3
  op3O.addEventListener("click", () => {
    selected = op3O.value;
  })

  // Show selection for op4
  op4O.addEventListener("click", () => {
    selected = op4O.value;

  })

}


// boton siguiente

//$(document).ready(function () {
  const next = document.getElementsByClassName('next')[0];
  var id = 0;
  var cantPreguntas = 0;
  if(idTemario == 1 || idTemario == 3 || idTemario == 5){
    ////cantidad de preguntas va de 0 a n
    cantPreguntas = 19;
  }
  else if (idTemario == 2 || idTemario == 4) {
    cantPreguntas = 14;
  }

  contador = 0;
  next.addEventListener("click", () => {
  	start = false;
    //console.log(cantPreguntas);
  	if (id < cantPreguntas) {
  		id++;
  		iterate(id);
  		//console.log(id);
  	}
    contador++;
    ////console.log("contador: " + contador);

    if (selected == "correcta") {
			funCorrecta(1);
		} else {
			//console.log("se guarda el criterio");
      funCorrecta(0);
		}

    document.getElementById('op1O').checked = false;
    document.getElementById('op2O').checked = false;
    document.getElementById('op3O').checked = false;
    document.getElementById('op4O').checked = false;
    selected = "";

    ////id = a la cantidad

    if(idTemario == 1 || idTemario == 3 || idTemario == 5){
      if (contador == 20) {
        location.reload();
          /////fi  de pregunta
      }
    }
    else if (idTemario == 2 || idTemario == 4) {
      if (contador == 15) {
        location.reload();
      }
    }

  })
//});

/////////funciones de de calificacion

function funCorrecta(tipoRespuesta){
  nota = 0;

  if(tipoRespuesta == 1){
    //console.log("correcta");
    if(idTemario == 1 || idTemario == 3 || idTemario == 5){
      nota = 100/20;
    }
    else if(idTemario == 2 || idTemario == 4) {
      nota = 100/15;
    }

  }
  else {
    //console.log("incorrecta");
    nota = 0;
  }

  data = JSON.stringify({
  pregunta: preguntaActual,
  criterio: selected,
  nota: nota,
  nov: novCarne,
  id_temario: idTemario
})

  $.ajax({
       type: 'POST',
       url: dominio + 'crearSimResultado',
       contentType: "application/json",
       dataType: 'json',
       crossDomain: true,
       async: false,
       data: data,
       success: function (response) {

       },
       error: function (response) {
          window.location.href = "index.html";
       }
   });
}

/////////funcion de matricular cursos

function matricularCurso(){

  var nombre = '';
  var apellido = '';
  var fechaModificada = '';
  var nombreArray = [];

  fechaSplit = fechaNacimiento.split("-");
  fechaModificada = fechaSplit[0]+fechaSplit[1]+fechaSplit[2];

  if(novCarne.length === 10){
    nombre = nombres;
    apellido = apellidos;
  }
  else if(novCarne.length >= 1 && novCarne.length <= 9){
  //  nombreArray = nombreCompleto.split(" ");
    nombre = nombreCompleto;
    apellido = '';
  }

  data = JSON.stringify({
  nov: novCarne,
  fecha_nacimiento: fechaModificada,
  nombre: nombre,
  apellido: apellido,
  id_materia: idTemario
});
//console.log(data);

  $.ajax({
       type: 'POST',
       url: dominio + 'wsMatricularCurso',
       contentType: "application/json",
       dataType: 'json',
       crossDomain: true,
       async: false,
       data: data,
       success: function (response) {
         token = response.message.token;
          document.getElementById("buttonMatricular").innerHTML = '<p style="color: black; font-size: 19px;"><strong>¿Quieres reforzar tus conocimientos en esta materia?</strong></p> <button class="btn btn-success" type="button" name="button" onclick="cursoVirtual()">matriculate al curso virtual de PCB ' + nombreMateria + '</button>';
          document.getElementById("cargandoWS").innerHTML ='';
       },
       error: function (response) {
        //  window.location.href = "index.html";
          document.getElementById("buttonMatricular").innerHTML = '<p style="color: black; font-size: 19px;"><strong>¿Quieres reforzar tus conocimientos en esta materia?</strong></p><label style="color: black; font-size: 17px;">En este momento no es posible matricularte al curso virtual, intentalo más tarde.</label>';
          document.getElementById("cargandoWS").innerHTML = '';
       }
   });
}

///////redirigir al curso virtual matriculado
function cursoVirtual() {
//console.log(token);
window.location.href = "https://virtual.usac.edu.gt/aspirantes/servicio/home/login/" + token;
}

/////////////////////////////////////////////

function paddedFormat(num) {
    return num < 10 ? "0" + num : num;
}

function startCountDown(duration, element) {

    let secondsRemaining = duration;
    let min = 0;
    let sec = 0;

    let countInterval = setInterval(function () {

        min = parseInt(secondsRemaining / 60);
        sec = parseInt(secondsRemaining % 60);


        element.textContent = `Tiempo disponible: ${paddedFormat(min)}:${paddedFormat(sec)} minutos`;

        secondsRemaining = secondsRemaining - 1;
        if (secondsRemaining < 0) { clearInterval(countInterval) };
        if(min == 00 && sec == 00){
          location.reload();
        }

    }, 1000);

}

window.onload = function () {
    let time_minutes =30; // Value in minutes
    let time_seconds = 00; // Value in seconds

    let duration = time_minutes * 60 + time_seconds;

    element = document.querySelector('#count-down-timer');
    element.textContent = `Tiempo disponible: ${paddedFormat(time_minutes)}:${paddedFormat(time_seconds)} minutos`;

    startCountDown(--duration, element);
};


/////////Biología no tiene documentos

////////////////////mostrar documentos

$(document).ready(function () {

  $("#boton-doc1").on('click', function () {
  var url = 'data:application/pdf;base64,' + doc1;
  document.getElementById('pdfVisor').innerHTML = '<iframe src="' + url + ' #view=fitH" width= "70%" height="100%" allowfullscreen></iframe>';
  document.getElementById("pdfVisor").innerHTML ='<object data="' + url + '" type="application/pdf" width= "100%" height="100%"> <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf, pero la puedes <a href="'+ url +'"> Descargar aquí</a></p> </object>';
  $("#tituloDocTemario").html($(this).text());

  });

  $("#boton-doc2").on('click', function () {
    var url = 'data:application/pdf;base64,' + doc2;

  document.getElementById('pdfVisor').innerHTML = '<iframe src="' + url + ' #view=fitH" width= "70%" height="100%" allowfullscreen></iframe>';
  document.getElementById("pdfVisor").innerHTML ='<object data="' + url + '" type="application/pdf" width= "100%" height="100%"> <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf, pero la puedes <a href="'+ url +'"> Descargar aquí</a></p> </object>';
  $("#tituloDocTemario").html($(this).text());

  });

});

$("#limpRespuesta").on('click', function () {

  document.getElementById('op1O').checked = false;
  document.getElementById('op2O').checked = false;
  document.getElementById('op3O').checked = false;
  document.getElementById('op4O').checked = false;
  selected = "";

});


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
