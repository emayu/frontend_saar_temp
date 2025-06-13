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
                })
                this.$divButtonAsignar.innerHTML = '<button class="btn btn-primary btn-lg botonAsignar" type="submit" id="">Asignar</button>';

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
        this.addOption(this.$selectCentro, 0, 'Seleccionar Unidad Académica');
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
        this.addOption(this.$selectFacultad, 0, 'Selecciona Unidad Académica');
        if (idCentro) {
            const facultadesResponse = await ApiService.getFacultades(idCentro);
            for (const facultad of facultadesResponse.facultad) {
                this.addOption(this.$selectFacultad, facultad.id_facultad, facultad.nombre);
            }
        }
        $('#selFacultad').selectpicker('refresh');
    }


    addOption(select, value, text) {
        const option = this.doc.createElement('option');
        option.value = value;
        option.text = text;
        select.appendChild(option);
    }
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