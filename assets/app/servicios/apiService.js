const ApiService = {
    /**
     * Regresa configuración de exámenes
     * @param {EXAMENES} tipo - Tipo de examen ( ver enum EXAMENES)
     * @returns {{examen:{id:number, activo:number, mensaje:string }}}
     */
    getExamen: (tipo) => {
        return axiosInstance.get(`examenLimite/${tipo}`);
    },
    /**
     * Regresa listado de centros activos
     * @returns {{centros:[]}}
     */
    getCentrosActivos: function () {
        return axiosInstance.get("buscarCentroActivo/1");
    },
    /**
     * Regresa listado de Facultades para el centro
     * @param {number} idCentro - identificador entero para centro.
     *  espera campo id (primary key) de la tabla centros, NO USAR id_centro
     * @returns {{facultad:[]}}
     */
    getFacultades:  (idCentro) => {
        return  axiosInstance.get("buscarFacultadActiva/" + idCentro + "/1");
    },
    /**
     * Regresa listado de pruebas asignadas
     * @param {string} nov
     * @returns {{asignaciones:[]}}
     */
    getAsignacionPasada: (nov) => {
        return axiosInstance.get("buscarAsignacionPasada/" + nov);
    },
    /**
     * Regresa listado de salones configurados para el centro y facultad determinado
     * que se encuentran en estado activo
     * @param {number} idCentro 
     * @param {number} idFacultad 
     * @returns {{DETALLEFACULTAD:[]}}
     */
    buscarSalonesActivos: (idCentro, idFacultad) => {
        return axiosInstance.get("buscarFechaExamen/" + idFacultad + "/" + idCentro + "/1");
    },
    /**
     * Obtiene listado de materias configuradas para el centro y facultad determinado
     * @param {number} idCentro 
     * @param {number} idFacultad 
     * @returns {{materias:[]}}
     */
    getMateriasEnDetalleFacultad: (idCentro, idFacultad) => {
        return axiosInstance.get("facultadMaterias/" + idCentro + "/" + idFacultad);
    },
    /**
     * Obtiene el contador actual de asignados al momento de hacer la consulta.
     * @param {number} idDetalleSalon 
     * @param {string} fechaExamen 
     * @returns {{contador:[{count:number}]}}
     */
    getContadorAsignadosPorSalon: (idDetalleSalon, fechaExamen) => {
        return axiosInstance.get("asignadosPorSalon/" + idDetalleSalon + "/" + fechaExamen);
    },
    /**
     * Buscar resultados anteriores para una materia específica.
     * Esto para prevenir asignaciones duplicadas.
     * @param {number} novOCarne 
     * @param {number} novEstudiante 
     * @param {number} idMateria 
     * @param {ASIGNACION_RESULTADO} tipo
     * @returns {{RESULTADO:[]}}
     */
    buscarResultadosAnteriores: (novOCarne, novEstudiante, idMateria, tipo) => {
        return axiosInstance.get("resultadoPorAsignacionNC/" + novOCarne + "/" + novEstudiante + "/" + idMateria + "/"+ tipo);
    },
    /**
     * Obtiene el último registro insertado por salon y fecha
     * @param {number} idDetalleSalon 
     * @param {string} fechaExamen 
     * @returns {{ultimo_asingado:[]}}
     */
    getUltimoAsignado: (idDetalleSalon, fechaExamen) => {
        return axiosInstance.get(dominio + "ultimoAsignadoPorSalon/" + idDetalleSalon + "/" + fechaExamen);
    },
    /**
     * Guarda las asignaciones 
     * @param {Array<AsignacionRecord>} data 
     * @returns {{asignado:string}}
     */
    guardarAsignacion: (data) => {
        // console.debug('using axios got', data);
        return axiosInstance.post('insertarAsignacion', data);
    },
    /**
     * Cierra la sesión actual
     * @returns 
     */
    logout: () => axiosInstance.post('logout')


}