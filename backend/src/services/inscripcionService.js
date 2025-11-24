const inscripcionRepository = require('../repositories/inscripcionRepository');
const integracionEscolarService = require('./integracionEscolarService');

const inscribirAlumno = async (alumnoMatricula, tallerId) => {
    // 1. Validar Alumno con el Sistema Escolar (Integración requerida)
    const validacion = await integracionEscolarService.validateAlumnoMatricula(alumnoMatricula);
    if (!validacion.isValid) {
        throw new Error(`Inscripción rechazada: ${validacion.message}`);
    }

    // 2. Verificar Cupo Disponible (Regla de Negocio)
    const tallerData = await inscripcionRepository.findTallerById(tallerId);
    if (!tallerData) {
        throw new Error('Taller no encontrado.');
    }

    const cupoDisponible = tallerData.cupo_maximo - tallerData.cupo_actual;
    if (cupoDisponible <= 0) {
        throw new Error('Lo sentimos, el cupo para este taller está lleno.');
    }

    // 3. Persistencia de la Inscripción
    const resultado = await inscripcionRepository.registerInscripcionAndUpdateCupo(alumnoMatricula, tallerId);
    
    // Aquí iría la llamada asíncrona al Servicio de Notificaciones [cite: 47]
    
    return resultado;
};

module.exports = { inscribirAlumno };