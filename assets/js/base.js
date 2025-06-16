
var dominio = 'https://sunenlineaapi.usac.edu.gt/';


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

//////simulador

var nombreMateria = getCookie('api-nombreMateria');
var idTemario = getCookie('api-idTemario');


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


/**
 * Global error handler
 * @param {*} alertify local var
 * @returns 
 */
const errorHandlerSetup = (alertify) => (xhr, status, errorThrow) => {
    alertify.set('notifier', 'position', 'bottom-center');
    if (xhr.status >= 400 && xhr.responseJSON?.details) {
        alertify.error(`Ocurrió un error: ${xhr.responseJSON.details}`);
    } else {
        alertify.error(`Ocurrió un error. ${xhr.responseJSON?.message || ""}`);
    }
};

/**
 * 
 * @param {string} nov 
 * @returns {boolean}
 */
function isNOVCarnet(nov){
    return nov.length === 10 //un número de nov debe de ser de 10
}

/**
 * Get Local given date object in this format:
 * YYYY-MM-DD
 * @param {Date} date - The date to formmat
 * @returns {(string|null)} formatted date or null
 */
const formatDate = (date) => {
    if(date instanceof Date && !isNaN(date)){
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1 ).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
    return null;
}

/**
 * Get Local today time in this format:
 * YYYY-MM-DD
 * @returns {string}
 */
const getTodayFormatted = () => {
    return formatDate(new Date());
}

//CONSTANTES

/**
 * Enum par tipos de examens
 * @enum {number}
 */
const EXAMENES = Object.freeze({
    PCBS: 1,
    PAP: 2,
    SIMULADOR: 3
});

const EXAMEN_ACTIVO = 1;

/**
 * Emun para resultados.aprobado
 * @enum {number}
 */
const ASIGNACION_RESULTADO = Object.freeze({
    APROBADO: 1,
    NO_APROBADO: 2
})

//Modelos DTO
class AsignacionPasada {
    /** @type {number} */
    id_detalle_salon;
    /** @type {string} */
    fecha_examen;
    /** @type {number} */
    asignacion;
}
