const asistenciaService = require('../services/asistenciaService');

const getAlumnosList = async (req, res) => {
    const { tallerId } = req.params;
    const instructorMatricula = req.user.matricula; // Obtenido del token (Gateway)

    try {
        const alumnos = await asistenciaService.getAlumnosForAttendance(parseInt(tallerId), instructorMatricula);
        res.json(alumnos);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

const postAsistencia = async (req, res) => {
    const { tallerId, alumnoId } = req.body;
    const instructorMatricula = req.user.matricula;

    try {
        const resultado = await asistenciaService.registerAttendance(tallerId, alumnoId, instructorMatricula);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAlumnosList, postAsistencia };