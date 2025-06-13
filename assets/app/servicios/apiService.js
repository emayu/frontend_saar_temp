const ApiService = {
    /**
     * Regresa configuración de exámenes
     * @param {EXAMENES} tipo - Tipo de examen ( ver enum EXAMENES)
     * @returns {JQuery.jqXHR}
     */
    getExamen: (tipo) => {
        return $.ajax({
            type: 'GET',
            url: dominio + `examenLimite/${tipo}`,
            contentType: "application/json",
            dataType: 'json'
        })
    },
    /**
     * Regresa listado de centros activos
     * @returns 
     */
    getCentrosActivos: function () {
        return $.ajax({
            type: 'GET',
            url: dominio + "buscarCentroActivo/1",
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Regresa listado de Facultades para el centro
     * @param {number} idCentro - identificador entero para centro
     * @returns 
     */
    getFacultades:  (idCentro) => {
        return  $.ajax({
          type: 'GET',
          url: dominio + "buscarFacultadActiva/" + idCentro + "/1",
          contentType: "application/json",
          dataType: 'json',
        });
    },
    /**
     * Regresa listado de pruebas asignadas
     * @param {string} nov
     * @returns {JQuery.jqXHR<AsignacionPasada[]>}
     */
    getAsignacionPasada: (nov) => {
        return $.ajax({
          type: 'GET',
          url: dominio + "buscarAsignacionPasada/" + nov,
          contentType: "application/json",
          dataType: 'json',
        });
    }
}