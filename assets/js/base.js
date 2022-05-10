
//var dominio = 'http://localhost:4000/';
//var dominio = 'http://192.168.1.23:4000/';
//var dominio = 'http://10.50.40.66:4000/';
var dominio = 'https://sunenlineaapi.usac.edu.gt/';

//var profesorId = getCookie('api-idUsuario');

var nombres = getCookie('api-nombre');
var apellidos = getCookie('api-apellido');
var novCarne = getCookie('api-novCarne');
var cui = getCookie('api-cui');
var fechaNacimiento = getCookie('api-fechaNacimiento');
var correo = getCookie('api-correo');
var telefono = getCookie('api-telefono');
var novEstudiante = getCookie('api-novEstudiante');
var nombreCompleto = getCookie('api-nombreCompleto');

//////pago
var total = getCookie('api-totalCursos');


/////BP
var novBP = getCookie('api-novBP');
var nombreBP = getCookie('api-nombreBP');
var numBP = getCookie('api-numBP');
var correlativoBP = getCookie('api-correlativoBP');
var totalBP = getCookie('api-totalBP');
var fechaBP = getCookie('api-fechaBP');
var llaveBP = getCookie('api-llaveBP');


const cipher = salt => {
const textToChars = text => text.split('').map(c => c.charCodeAt(0));
const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

return text => text.split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}

const decipher = salt => {
const textToChars = text => text.split('').map(c => c.charCodeAt(0));
const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
return encoded => encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}
// To create a cipher
const myCipher = cipher('mySecretSalt')

//Then cipher any text:
myCipher('the secret string')   // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"

//To decipher, you need to create a decipher and use it:
const myDecipher = decipher('mySecretSalt')
myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f")    // --> 'the secret string'

/////id para Visualizacion de personal

//var idPersonal = getCookie('api-idPersonal');

function get(url, param) {
    var url_string = url;
    var url = new URL(url_string);
    var param = url.searchParams.get(param);
    return param;
}
