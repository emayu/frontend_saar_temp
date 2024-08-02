
class PDFBuilder{

    constructor(type){
        this._asignaciones = [];
        this._dataPattern = 'dd/mm/yyyy';
        this._registroBaseAsignacion = 0;
        this._name = null;
        this._fechaAsignacion = null;
        this._nov = null;
        this._fechaNacimiento = null;
        this._type = type;
    }

    setName(name){
        this._name = name;
        return this;
    }

    setRegistroBaseAsignacion(index){
        this._registroBaseAsignacion = index;
        return this;
    }

    setFechaAsignacion(fechaAsignacion){
        this._fechaAsignacion = fechaAsignacion;
        return this;
    }

    setNov(nov){
        this._nov = nov;
        return this;
    }

    setFechaNacimiento(fechaNacimiento){
        this._fechaNacimiento = fechaNacimiento;
        return this;
    }

    setAsignaciones(asignaciones){
        if(!Array.isArray(asignaciones)){
            throw new Error(`The parameter asigaciones is not an array`);
        }else if(asignaciones.length <= 0){
            throw new Error(`The parameter asigaciones is empty`);
        }
        const checkRegistroBase = ['facultad', 'centro', 'fecha_asignacion'];
        for (const check of checkRegistroBase) {
            if (!asignaciones[this._registroBaseAsignacion].hasOwnProperty(check)) {
                throw new Error(`The parameter asigaciones[${this._registroBaseAsignacion}] no cuenta con la propiedad ${check}`);
            }
        }

        for(let i=0; i < asignaciones; i++){
            const checkForAll = ['asignacion', 'materia', 'fecha_examen', 'tipo', 'hora_examen'];
            for(const check of checkForAll){
                if(!asignaciones[i].hasOwnProperty(check)){
                    throw new Error(`The parameter asigaciones[${i}] no cuenta con la propiedad ${check}`);
                }
            }
        }
        this._asignaciones = asignaciones;
        return this;
    }


    static get jsPDFBuilder(){
        return new PDFBuilder('jsPDF');
    }

    build(){
        if(this._type === 'jsPDF'){
            const builder = new jsPDFWrapper(this);
            return builder.build();
        }
    }

}

class jsPDFWrapper{

    constructor(data){
        this.data = data;
    }

    build(){
        
        let pdf = new jsPDF('p', 'pt', 'letter');

        let columns = ["No. Asignado", "Materia Asignada", "Fecha", "Lugar", "Hora"];
        
        let mostrarInstruccionesEnlinea = false;
        let mostrartInstruccionesPresencial = false;
        let rowData = this.data._asignaciones
            .map(asignacion =>{
                mostrarInstruccionesEnlinea = mostrarInstruccionesEnlinea || asignacion.tipo.includes('En linea');
                mostrartInstruccionesPresencial = mostrartInstruccionesPresencial || asignacion.tipo.includes('Presencial');
                return [
                    asignacion.asignacion,
                    asignacion.materia,
                    this.parseAsignacionFecha(asignacion.fecha_examen),
                    asignacion.tipo,
                    asignacion.hora_examen
                ];
            });

        pdf.autoTable(columns, rowData,
            {
            margin: { top: 220, left: 65, right: 65, bottom: 75 },
            columnStyles: { 
                3: { fontStyle: 'bold' }  // bold Lugar
            },
            }
        );

        const imgUsac = new Image();
        const imgSun = new Image();
        const imgRedes = new Image();
        imgUsac.src = 'assets/img/logoUSACCarta.png';
        imgSun.src = 'assets/img/logosunLetras.png';
        imgRedes.src = 'assets/img/footerRedes.png';
        let risa = "";

        const { _asignaciones, _nov:nov, _fechaNacimiento:fechaNacimiento, _registroBaseAsignacion } = this.data;
        const facultadConstancia = _asignaciones[_registroBaseAsignacion].facultad;
        const centroConstancia = _asignaciones[_registroBaseAsignacion].centro;
        const fechaAsignacionConstancia = _asignaciones[_registroBaseAsignacion].fecha_asignacion.split("-");
        const fechaAsignacionVista = fechaAsignacionConstancia[2] + "/" + fechaAsignacionConstancia[1] + "/" + fechaAsignacionConstancia[0];
        

        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8);
        for (var i = 1; i <= pageCount; i++) {
            pdf.addImage(imgUsac, 'jpeg', 10, 10, 0, 0);
            pdf.addImage(imgSun, 'jpeg', 535, 470, 0, 0);
            pdf.addImage(imgRedes, 'jpeg', 65, 720, 0, 0);
            // Header text
            pdf.setFontSize(13).setFont(undefined, 'bold');
            pdf.text(250, 75, "Form.SUN.09.01");
            pdf.text(50, 90, "CONSTANCIA DE ASIGNACIÓN DE PRUEBAS DE CONOCIMIENTOS BÁSICOS");

            const fechajs = new Date();
            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);

            pdf.setFontSize(9).setFont(undefined, 'bold');
            pdf.text(440, 10, "Fecha de impresión: " + hoy.toLocaleDateString() + ' ' + fechajs.getHours() + ':' + fechajs.getMinutes() + ':' + fechajs.getSeconds());
            pdf.text(440, 25, "Fecha de asignación: " + fechaAsignacionVista);

            //Body
            pdf.setFontSize(12).setFont(undefined, 'normal');
            pdf.text(40, 125, "Nombre: " + this.data._name);

            if (nov.toString().length === 10) {
                pdf.text(40, 145, "NOV: " + nov.toString());
                risa = myCipher(nov.toString());
            }
            else if (nov.toString().length >= 1 && nov.toString().length <= 9) {
                pdf.text(40, 145, "Carné: " + nov.toString());
                risa = myCipher(nov.toString());
            }

            var fechaNa = fechaNacimiento.split("-");
            var fechaNac = fechaNa[2] + "/" + fechaNa[1] + "/" + fechaNa[0];

            pdf.text(40, 165, "Fecha de Nacimiento: " + fechaNac);
            pdf.text(40, 185, "Estudiará en: " + centroConstancia);
            pdf.text(40, 205, "Unidad académica: " + facultadConstancia);

            //Notes
            pdf.setFontSize(17).setFont(undefined, 'bold');
            pdf.text(214, 390, "*** IMPORTANTE ***");

            pdf.setFontSize(17).setFont(undefined, 'normal');
            pdf.text(160, 420, "Instrucciones y Recomendaciones");

            pdf.setFontSize(12).setFont(undefined, 'normal');
            pdf.text(40, 450,
                `
   Revisa en la parte superior de esta constancia el lugar que te fue asignado para tus PCB.

   Según el lugar que te fue asignado descarga el instructivo respectivo:

      ${mostrarInstruccionesEnlinea ? '- Si el lugar indicado es:' : ''}

                  

      ${mostrartInstruccionesPresencial ? '- Si el lugar indicado es:' : ''}
      
                  `);

            if (mostrarInstruccionesEnlinea) {
                pdf.setFontSize(17).setFont(undefined, 'bold');
                pdf.text(190, 520, 'en línea');
                pdf.textWithLink('Clic acá', 102, 540, { url: 'https://drive.google.com/file/d/1pFfPWG7qAl1O6VHYUPCdMV1DMseOq41w/view?usp=drivesdk' });
            }

            if (mostrartInstruccionesPresencial) {
                pdf.setFontSize(17).setFont(undefined, 'bold');
                pdf.text(190, 575, 'presencial');
                pdf.textWithLink('Clic acá', 102, 600, { url: 'https://drive.google.com/file/d/1p8pYIDguwIdvBNO9m6jGhWU9K24-fy-T/view?usp=drivesdk' });
            }

            pdf.setFontSize(13).setFont(undefined, 'bold');
            pdf.text(40, 650, "Toma en cuenta que NO hay cambios de hora, fecha y/o modalidad.");



            //Footer
            pdf.text(20, 780, risa);
            pdf.setFontSize(10).setFont(undefined, 'bold');
            pdf.textWithLink('SUNUSAC', 255, 765, { url: 'https://www.facebook.com/SUNUSAC' });
            pdf.textWithLink('sun_usac', 337, 765, { url: 'https://www.instagram.com/sun_usac/' });
            pdf.setPage(i);
            pdf.text('Página ' + String(i) + ' de ' + String(pageCount), 560, 780, {
                align: 'center'
            });


        }
        const out = pdf.output();
        const url = 'data:application/pdf;base64,' + btoa(out);
        return url;
    }

    parseAsignacionFecha(fecha){
        if(typeof fecha === 'string'){
            const fechaEvaluacion = fecha.split("-");
            return  fechaEvaluacion[2] + "/" + fechaEvaluacion[1] + "/" + fechaEvaluacion[0];
        }
    }

    
}

