
var dominio = 'https://sunenlineaapi.usac.edu.gt/';

const apiV1 = dominio+'v1/';

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

/** Instancia Global necesaria para los servicios de api */
const axiosInstance = (() => {
    try {
        const instance = axios.create({
            baseURL: apiV1,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        });
        // Interceptor para simplificar respuesta y desempaquetar la Promesa<AxiosResponse>
        // esto hace transparente el uso de Axios 
        instance.interceptors.response.use(
            res => res.data,
            err => {
                if (!err.response) {
                    return Promise.reject(err);
                }
                const { status } = err.response;
                if (status === 401) {
                    alertify.set('notifier', 'position', 'bottom-center');
                    alertify.error(`Ocurrió un error: ${err.response.data?.details}`);
                    redirectToLogin();
                    return;
                }
                if (status === 403) {
                    alertify.set('notifier', 'position', 'bottom-center');
                    alertify.error(`Ocurrió un error: ${err.response.data?.details}`);
                }
                return Promise.reject(err);
            }
        );
        return instance;
    } catch (e) { return null; }
})();
console.debug('Instancia global de axios', axiosInstance);

/**
 * Global error handler for jquery
 * @param {*} alertify local var
 * @returns 
 */
const errorHandlerSetup = (alertify) => (xhr, status, errorThrow) => {
    alertify.set('notifier', 'position', 'bottom-center');
    if(status && status === "timeout"){
        alertify.error("Tiempo de espera agotado. La petición tardó demasiado en responder.");
    }else if(xhr.status == 0){
        alertify.error("Parece que no hay conexión. Por favor verifica tu conexión red.");
    }else if (xhr.status >= 400 && xhr.responseJSON?.details) {
        alertify.error(`Ocurrió un error: ${xhr.responseJSON.details}`);
        if (xhr.status === 401) {
            redirectToLogin();
        }
    } else {
        alertify.error(`Ocurrió un error. ${xhr.responseJSON?.message || ""}`);
    }
};

/**
 * Error handler for register Estudiante/Aspirante views
 */
const errorRegisterHandler = (xhr, status, errorThrow) => {
    alertify.set('notifier', 'position', 'bottom-center');
    if(status && status === "timeout"){
        alertify.error("Tiempo de espera agotado. La petición tardó demasiado en responder.");
    }else if(xhr.status == 0){
        alertify.error("Parece que no hay conexión. Por favor verifica tu conexión red.");
    }else if (xhr.status >= 400 && xhr.responseJSON?.message) {
        if (xhr.responseJSON.message === "NOT_AUTHENTICATED") {
            alertify.error(`Ocurrió un error: debes volver a iniciar`);
        } else if (xhr.responseJSON.message === "NOT_AUTHORIZED") {
            alertify.error(`Ocurrió un error: ${xhr.responseJSON.details ? xhr.responseJSON.details : "operación no permitida para este token, intenta volver a iniciar"}`);
        } else if (xhr.responseJSON.message === "TOKEN_EXPIRED") {
            alertify.error(`Ocurrió un error: token expirado, debes volver a iniciar`);
        }
    } else {
        alertify.error(`Ocurrió un error. ${xhr.responseJSON?.message || ""}`);
    }
};

const redirectToLogin = () => {
    setTimeout(() => {
        console.log('novCarnet:', novCarne, 'here:', window.location.pathname, 'search:', window.location.search);
        const here = window.location.pathname + window.location.search;
        if (novCarne && novCarne !== 'null') {
            if (isNOVCarnet(novCarne)) {
                window.location.href = `login.html?type=aspirante&next=${encodeURIComponent(here)}`;
            } else {
                window.location.href = `login.html?type=estudiante&next=${encodeURIComponent(here)}`;
            }
        } else {
            window.location.href = `login.html?next=${encodeURIComponent(here)}`;
        }
        return;
    }, 1750);
}

const handlerLogout = event => {
    event.preventDefault();
    axiosInstance
     .post('logout')
     .finally( result => {
        console.log(result);
        setCookie('api-nombre', null, 1);
        setCookie('api-novCarne', null, 1);
        window.location.href = 'index.html';
     });
}


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


/**
 * Verifica si alguna variable tiene un valor no válido
 * @param {[]} array 
 * @returns {boolean} true si al menos un es nulo, undefined o vacío para un string ""
 */
const isSomeInvalidValue = (array) => {
    return array.some(field =>
        (field === null || field === undefined)
        || (typeof field === "string" && (field.trim() === "" || field === "null")))
}

/**
 * 
 * @param {string} idButton id definido para el botón html
 * @param {boolean} isLoading true coloca el botón bloqueado y activa animación del spinner
 */
const toggleButton = (idButton, isLoading) => {
  const btn = document.getElementById(idButton);
  const spinner = btn.querySelector('[role="status"]');
  
  if(isLoading){
    btn.disabled = true;
    spinner.classList.remove('d-none');
  }else{
    btn.disabled = false;
    spinner.classList.add('d-none');
  }
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

/**
 * Enum for account type
 */
const AccountType = Object.freeze({
  ASPIRANTE: 1,
  ESTUDIANTE: 2
});

//Modelos DTO
class AsignacionPasada {
    /** @type {number} */
    id_detalle_salon;
    /** @type {string} */
    fecha_examen;
    /** @type {number} */
    asignacion;
}

class AppBusinessException extends Error {
    constructor(message){
        super(message);
        this.name = 'AppBusinessException';
    }
}
