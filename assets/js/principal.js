$(document).ready(function () {

$("#menuAE").load("menu.html");
/*
$("#footerDiv").load("footer.html");*/

if(novCarne.length === 10){
  //////////body

  fechaCodigo = fechaNacimiento.split("-");
  fechaVistaPrincipal = fechaCodigo[2] +"/"+ fechaCodigo[1]+"/"+ fechaCodigo[0];



  document.getElementById("datosGenerales").innerHTML = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novCarne+ '</a>' +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+nombres + ' '+ apellidos+'</a>'+
  '<a class="nav-link" style="color: black;"><strong> Fecha Nacimiento: </strong>'+ fechaVistaPrincipal + '</a>' +
  '<a class="nav-link" style="color: black;"><strong>Correo: </strong>'+correo+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+nombres+' '+apellidos+
  '<br><b>NOV: '+novCarne+'</b></a>';


}
else if (novCarne == 'null') {
  window.location.href = "index.html";

}
else if(novCarne.length >= 1 && novCarne.length <= 9){

  //////////body
  fechaCodigo = fechaNacimiento.split("-");
  fechaVistaPrincipal = fechaCodigo[2] +"/"+ fechaCodigo[1]+"/"+ fechaCodigo[0];
  var novE = "";


  if( novEstudiante == 'null'){
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong> No esta Registrado</a>';
  }
  else {
    novE = '<a class="nav-link" style="color: black;"><strong>NOV: </strong>'+novEstudiante+ '</a>';
  }



  document.getElementById("datosGenerales").innerHTML = '<a class="nav-link" style="color: black;"><strong>Carné: </strong>'+novCarne+ '</a>' + novE +
  '<a class="nav-link" style="color: black;"><strong> Nombre: </strong>'+ nombreCompleto +'</a>'+
  '<a class="nav-link" style="color: black;"><strong> Fecha Nacimiento: </strong>'+ fechaVistaPrincipal + '</a>' +
  '<a class="nav-link" style="color: black;"><strong>Correo: </strong>'+correo+'</a>';


  //////header
  document.getElementById("datosHeader").innerHTML = '<a style="font-size: .82rem; color: #5777ba">'+ nombreCompleto +'<br><b>Carné: '+novCarne+'</b></a>';
}


});


$("#cerrarSesion").on('click', function () {
  setCookie('api-nombre', null, 1);
  setCookie('api-novCarne', null, 1);

});
