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
        });
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
    },
    /**
     * Regresa listado de salones configurados para el centro y facultad determinado
     * que se encuentran en estado activo
     * @param {number} idCentro 
     * @param {number} idFacultad 
     * @returns 
     */
    buscarSalonesActivos: (idCentro, idFacultad) => {
        return $.ajax({
            type: 'GET',
            url: dominio + "buscarFechaExamen/" + idFacultad + "/" + idCentro + "/1",
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Obtiene listado de materias configuradas para el centro y facultad determinado
     * @param {number} idCentro 
     * @param {number} idFacultad 
     * @returns 
     */
    getMateriasEnDetalleFacultad: (idCentro, idFacultad) => {
        return $.ajax({
            type: 'GET',
            url: dominio + "facultadMaterias/" + idCentro + "/" + idFacultad,
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Obtiene el contador actual de asignados al momento de hacer la consulta.
     * @param {number} idDetalleSalon 
     * @param {string} fechaExamen 
     * @returns 
     */
    getContadorAsignadosPorSalon: (idDetalleSalon, fechaExamen) => {
        return $.ajax({
            type: 'GET',
            url: dominio + "asignadosPorSalon/" + idDetalleSalon + "/" + fechaExamen,
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Buscar resultados anteriores para una materia específica.
     * Esto para prevenir asignaciones duplicadas.
     * @param {number} novOCarne 
     * @param {number} novEstudiante 
     * @param {number} idMateria 
     * @param {ASIGNACION_RESULTADO} tipo
     * @returns 
     */
    buscarResultadosAnteriores: (novOCarne, novEstudiante, idMateria, tipo) => {
        return $.ajax({
            type: 'GET',
            url: dominio + "resultadoPorAsignacionNC/" + novOCarne + "/" + novEstudiante + "/" + idMateria + "/"+ tipo,
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Obtiene el último registro insertado por salon y fecha
     * @param {number} idDetalleSalon 
     * @param {string} fechaExamen 
     * @returns 
     */
    getUltimoAsignado: (idDetalleSalon, fechaExamen) => {
        return $.ajax({
            type: 'GET',
            url: dominio + "ultimoAsignadoPorSalon/" + idDetalleSalon + "/" + fechaExamen,
            contentType: "application/json",
            dataType: 'json',
        });
    },
    /**
     * Guarda las asignaciones 
     * @param {Array<AsignacionRecord>} data 
     * @returns 
     */
    guardarAsignacion: (data) => {
        console.log('got', data);
        return $.ajax({
            type: 'POST',
            url: dominio + 'insertarAsignacion',
            contentType: "application/json",
            dataType: 'json',
            crossDomain: true,
            data: data,
        });
    }


}