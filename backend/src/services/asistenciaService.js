const asistenciaRepository = require('../repositories/asistenciaRepository');

// Servicio: Obtener la lista de alumnos para pasar lista
const getAlumnosForAttendance = async (tallerId, instructorMatricula) => {
    // Regla de Negocio: Verificar que el instructor está a cargo del taller (Simulación simple)
    if (instructorMatricula !== 'inst') { 
        throw new Error('No autorizado: Solo el instructor asignado puede ver esta lista.');
    }

    const alumnos = await asistenciaRepository.findAlumnosInscritosByTaller(tallerId);
    
    // Aplicación del Patrón DTO (Data Transfer Object) para la presentación al Frontend
    return alumnos.map(a => ({ 
        matricula: a.alumno_id, 
        nombre_display: `Alumno (${a.alumno_id})` 
    }));
};

// Servicio: Registrar la asistencia de un alumno
const registerAttendance = async (tallerId, alumnoId, instructorMatricula) => {
    // Re-verificar la autorización
    if (instructorMatricula !== 'inst') {
        throw new Error('No autorizado para registrar asistencia.');
    }

    return await asistenciaRepository.registerAsistencia(tallerId, alumnoId);
};

module.exports = { getAlumnosForAttendance, registerAttendance };