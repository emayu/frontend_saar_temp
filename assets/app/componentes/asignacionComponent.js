class AsignacionComponent {
    constructor() {
        this.doc = document;
        this.$selectCentro = this.doc.querySelector("#selbox");
        this.$selectFacultad = this.doc.querySelector("#selFacultad");
        this.$divResultados = this.doc.querySelector("#datosResultados");
        this.$divHeader = this.doc.querySelector("#datosHeader");
        this.$divButtonAsignar = this.doc.querySelector("#btnAsignar");
        this.$divVisorPDF = this.doc.querySelector("#visorPDF");
        this.$divActivo = this.doc.querySelector("#activo");
        /**
         * alertify: objeto global proporcionado por AlertifyJS (https://alertifyjs.com/)
         * Se carga desde: cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js
         */
        this.alertify = window.alertify;
    }

    async init() {
        if (!novCarne) {
            window.location.href = "index.html";
            return;
        }

        $("#menuAE").load("menu.html");

        this.renderDatosUsuario();

        //verificar estado de prueba PCBs
        const examenResponse = await ApiService.getExamen(EXAMENES.PCBS);
        const asignacionPasadaResponse = await ApiService.getAsignacionPasada(novCarne);
        if (examenResponse.examen.activo === EXAMEN_ACTIVO) {
            if (asignacionPasadaResponse.asignaciones.length > 0) {
                $("#visorPDF").show();
                this.renderAsignaciones(asignacionPasadaResponse)
            } else {
                await this.cargarCentrosList();
                $("#selCentros").show();
                $("#selFacultades").show();
                this.$selectCentro.addEventListener('change', () => {
                    const idCentro = this.$selectCentro.value;
                    this.cargarFacultadesList(idCentro);
                });
                const boton = this.doc.createElement('button');
                boton.className = "btn btn-primary btn-lg botonAsignar";
                boton.type = "submit";
                boton.textContent = "Asignar";
                boton.addEventListener('click', this.handleAsignacionClick);
                this.$divButtonAsignar.innerHTML = '';
                this.$divButtonAsignar.appendChild(boton);
            }
        } else {
            if (asignacionPasadaResponse.asignaciones.length > 0) {
                $("#visorPDF").show();
                this.renderAsignaciones(asignacionPasadaResponse)
            } else {
                this.$divActivo.innerHTML = `
                <a class="nav-link text-dark" style="font-size: 25px;">Nota: <strong> ${examenResponse.examen.mensaje}</strong></a>
                `;
            }
        }

        //dialogo personalizado
        if (!this.alertify.loadingDialog) {
            this.alertify.dialog('loadingDialog', function () {
                return {
                    main: function (messageHTML) {
                        this.setContent(messageHTML);
                    },
                    setup: function () {
                        return {
                            buttons: [], // Sin botones
                            options: {
                                title: 'Espere un momento',
                                closable: false,
                                movable: false,
                                resizable: false,
                                maximizable: false,
                                pinnable: false,
                                modal: true,
                                frameless: false,
                                transition: 'fade'
                            }
                        };
                    }
                };
            });
        }
    }

    renderDatosUsuario() {
        if (isNOVCarnet(novCarne)) {
            this.$divResultados.innerHTML = `
            <a class="nav-link text-dark"><strong>NOV: </strong>${novCarne}</a>
            <a class="nav-link text-dark"><strong> Nombre: </strong>${nombres} ${apellidos}</a>
            `;
        } else {

            const novTexto = novEstudiante == 'null' ? 'No esta Registrado' : novEstudiante;
            this.$divResultados.innerHTML = `
            <a class="nav-link text-dark"><strong>Carné: </strong>${novCarne}</a>
            <a class="nav-link text-dark"><strong>NOV: </strong>${novTexto}</a>
            <a class="nav-link text-dark"><strong> Nombre: </strong>${nombreCompleto}</a>
            `;
        }
        this.$divHeader.innerHTML = `<a style="font-size: .82rem; color: #5777ba">${nombres} ${apellidos}
                <br><b>NOV: ${novCarne}</b></a>`;
    }

    renderAsignaciones(data) {
        /////////////crear pdf
        const builder = PDFBuilder.jsPDFBuilder;
        try {
            if (novCarne.toString().length === 10) {
                builder.setName(nombres + " " + apellidos)
            } else {
                builder.setName(nombreCompleto)
            }
            builder.setNov(novCarne)
                .setFechaNacimiento(fechaNacimiento)
                .setAsignaciones(data.asignaciones);
        } catch (err) {
            console.error('error al colocar valores', err);
            return;
        }
        const url = builder.build();
        this.$divVisorPDF.innerHTML = `
        <object data="${url}" type="application/pdf" width= "100%" height="100%">
         <p> El navegador web de tu Teléfono Móvil no soporta visualizar el pdf de tu constancia de asignación,
         pero la puedes <a href="${url}"> Descargar aquí</a></p> </object>
        `;
    }

    async cargarCentrosList() {
        const centrosResponse = await ApiService.getCentrosActivos();
        this.$selectCentro.innerHTML = "";
        this.addOption(this.$selectCentro, "", 'Seleccionar Unidad Académica', true);
        for (const centro of centrosResponse.centros) {
            this.addOption(this.$selectCentro, centro.id, centro.nombre)
        }
        // Refrescar el plugin de Bootstrap Select
        $('#selbox').selectpicker('refresh');
        const idCentro = this.$selectCentro.value;
        // Al inicio no hay centro seleccionado, por eso pasamos null
        this.cargarFacultadesList(null);
    }

    async cargarFacultadesList(idCentro) {
        this.$selectFacultad.innerHTML = "";
        this.addOption(this.$selectFacultad, "", idCentro == null ? "Primero selecciona un centro" : 'Selecciona Unidad Académica', true);
        if (idCentro) {
            const facultadesResponse = await ApiService.getFacultades(idCentro);
            for (const facultad of facultadesResponse.facultad) {
                this.addOption(this.$selectFacultad, facultad.id_facultad, facultad.nombre);
            }
        }
        $('#selFacultad').selectpicker('refresh');
    }


    addOption(select, value, text, isDefault = false) {
        const option = this.doc.createElement('option');
        option.value = value;
        option.text = text;
        if(isDefault){
            option.disabled = true;
            option.selected = true;
            option.hidden = true;
        }
        select.appendChild(option);
    }


    handleAsignacionClick = async () => {
        //Limpiar errores visuales antes de validar
        this.$selectCentro.closest('.bootstrap-select').classList.remove('is-invalid');
        this.$selectFacultad.closest('.bootstrap-select').classList.remove('is-invalid');

        this.alertify.set('notifier', 'position', 'bottom-center');
        if (!this.$selectCentro.checkValidity()) {
            this.$selectCentro.closest('.bootstrap-select').classList.add('is-invalid');
            this.$selectCentro.reportValidity();
            this.alertify.warning("Debes seleccionar un centro universitario. Para poder asignarte.");
            return;
        }
        if (!this.$selectFacultad.checkValidity()) {
            this.$selectFacultad.closest('.bootstrap-select').classList.add('is-invalid');
            this.$selectFacultad.reportValidity();
            this.alertify.warning("Debes seleccionar una unidad académica (Facultad/Escuela). Para poder asignarte.");
            return;
        }

        const centroText = this.$selectCentro.options[this.$selectCentro.selectedIndex].text;
        const facultadText = this.$selectFacultad.options[this.$selectFacultad.selectedIndex].text;
        console.log(`centro: ${centroText}, facultad: ${facultadText}.`, this.$selectCentro.selectedIndex, this.$selectFacultad.selectedIndex);
        const dialogText = `¿Deseas Asignarte al centro universitario: ${centroText}, a la unidad académica:  ${facultadText}?`;
        const self = this;
        this.alertify.confirm('Asignación',
            dialogText,
            async () => {
                const examenResponse = await ApiService.getExamen(EXAMENES.PCBS);
                if (examenResponse.examen.activo !== EXAMEN_ACTIVO) {
                    this.alertify.set('notifier', 'position', 'bottom-center');
                    this.alertify.warning("La fecha de asignación está cerrada.");
                    location.reload();
                    return;
                }
                const loadingHTML = `
                    <div class="loading-dialog">
                        <img src="assets/img/cargando.gif" alt="Cargando" />
                        <p>cargando...</p>
                        <p style="color: black; font-size: 25px;">
                             <strong> Espera un momento, se está procesando tu solicitud, no cierres esta ventana ni refresques el navegador.
                             </strong>
                        </p>
                    </div>`;
                this.alertify.loadingDialog(loadingHTML).show();
                
                try {
                    const asignaciones = await this.generarAsignaciones();
                    console.log('asignaciones por generar', asignaciones);
                    if(asignaciones && asignaciones.length> 0){
                        await this.guardarAsignacion(asignaciones);
                        location.reload();
                    }
                } catch(e){
                    console.error(e);
                    this.alertify.set('notifier', 'position', 'bottom-center');
                    this.alertify.error("Ocurrió un error al procesar tu solicitud, por favor vuelve a intentar más tarde", 25);

                }finally{
                    this.alertify.loadingDialog().close()
                }

            },
            function onCancel() { self.alertify.error('Vuelve a seleccionar las opciones de nuevo') }
        )
    }

    notificarMateriaAprobada(detalleSalon) {
        if (detalleSalon.id_materia === 1) {
            this.alertify.set('notifier', 'position', 'bottom-center');
            this.alertify.warning("Ya has ganado el requisito BIOLOGÍA, ve al menú de Resultados para descargar la constancia.");
        }
        else if (detalleSalon.id_materia === 2) {
            this.alertify.set('notifier', 'position', 'bottom-center');
            this.alertify.warning("Ya has ganado el requisito FÍSICA, ve al menú de Resultados para descargar la constancia.");
        }
        else if (detalleSalon.id_materia === 3) {
            this.alertify.set('notifier', 'position', 'bottom-center');
            this.alertify.warning("Ya has ganado el requisito LENGUAJE, ve al menú de Resultados para descargar la constancia.");
        }
        else if (detalleSalon.id_materia === 4) {
            this.alertify.set('notifier', 'position', 'bottom-center');
            this.alertify.warning("Ya has ganado el requisito MATEMÁTICA, ve al menú de Resultados para descargar la constancia.");
        }
        else if (detalleSalon.id_materia === 5) {
            this.alertify.set('notifier', 'position', 'bottom-center');
            this.alertify.warning("Ya has ganado el requisito QUÍMICA, ve al menú de Resultados para descargar la constancia.");
        }
    }
   /**
    * 
    * @returns {Promise<AsignacionRecord[]|undefined>}
    */
    async generarAsignaciones() {

        /** @type{AsignacionRecord[]}*/
        const asignaciones = [];

        const idCentro = this.$selectCentro.value;
        const idFacultad = this.$selectFacultad.value;

        const { DETALLEFACULTAD } = await ApiService.buscarSalonesActivos(idCentro, idFacultad);
        const { materias } = await ApiService.getMateriasEnDetalleFacultad(idCentro, idFacultad);
        console.log('facultades y materias', DETALLEFACULTAD, materias);
        const cantidadMateriasConfiguradas = materias.length;
        const cantidadSalonesActivos = DETALLEFACULTAD.length;
        if (cantidadMateriasConfiguradas != cantidadSalonesActivos) {
            const seconds = 15;
            this.alertify.warning('La unidad académica seleccionada no cuenta con salones creados, comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder apoyarte. ', seconds);
            return;
        }

        for (const detalleSalon of DETALLEFACULTAD) {
            //consultar asignados para materia específica
            const { contador } = await ApiService.getContadorAsignadosPorSalon(detalleSalon.id_tablads, detalleSalon.fecha_examen);
            console.log('detalleSalon', detalleSalon, 'response', contador);
            if (!Array.isArray(contador) || contador.length < 1) {
                alertify.set('notifier', 'position', 'bottom-center');
                alertify.error("Ocurrió un error al encontrar espacios en un salón, por favor vuelve a intentar más tarde.");
                return;
            }

            const [{ count }] = contador;
            console.log('count', count);
            if (count >= detalleSalon.cupo) {
                //aquí puedo lanzar una notificación de que salon se llenó
                alertify.set('notifier', 'position', 'bottom-center');
                alertify.error("No se puede asignar en este momento, espacio no disponible en esta unidad académica. Comunícate al Facebook: Sistema de Ubicación y Nivelación SUN, para poder ayudarte.");
                return;
            }

            const { RESULTADO } = await ApiService.buscarResultadosAnteriores(
                novCarne,
                isNOVCarnet(novCarne) ? 0 : novEstudiante,
                detalleSalon.id_materia,
                ASIGNACION_RESULTADO.APROBADO);
            console.log('resultado anterior', RESULTADO)
            if (!Array.isArray(RESULTADO)) {
                alertify.set('notifier', 'position', 'bottom-center');
                alertify.error("Ocurrió un error al consultar resultados anteriores, por favor vuelve a intentar más tarde.");
                return;
            }

            if (RESULTADO.length > 0) {
                this.notificarMateriaAprobada(detalleSalon);
            } else {
                const { ultimo_asingado } = await ApiService.getUltimoAsignado(detalleSalon.id_tablads, detalleSalon.fecha_examen);
                console.log('ultimo_asingado', ultimo_asingado)
                //investigar el uso de sumador, que solo se copio la lógica
                let sumador;
                if (ultimo_asingado.length === 0) {
                    sumador = 1;
                } else if (count < ultimo_asingado[0].asignacion) {
                    sumador = 2;
                } else {
                    sumador = 1;
                }

                asignaciones.push({
                    id_detalle_salon: detalleSalon.id_tablads,
                    nov: novCarne,
                    asignacion: count + sumador,
                    fecha_examen: detalleSalon.fecha_examen,
                    asignado_por: nombres + ' ' + apellidos,
                    fecha_asignacion: getTodayFormatted()
                });
            }
        }
        return asignaciones;
    }
/**
 * 
 * @param {AsignacionRecord[]} asignaciones 
 * @returns 
 */
    guardarAsignacion(asignaciones) {
        const records = [];
        for (const asignacion of asignaciones) {
            records.push(JSON.stringify(asignacion));
        }
        return ApiService.guardarAsignacion(JSON.stringify(records));
    }
}

/**
 * DTO de asignación, esta estructura espera el backend
 */
class AsignacionRecord {
    id_detalle_salon;
    nov;
    asignacion;
    fecha_examen;
    asignado_por;
    fecha_asignacion;
}



//load component in page
document.addEventListener('DOMContentLoaded', () => {
    const componente = new AsignacionComponent();
    componente.init();
    console.log('cargando controlador nuevo......!');
});

// funciones dummy para no que imprima errores con la nueva implementación
// estas no tiene ninguna utilizadas más que solo evitar errores en consola
function facultades(){}