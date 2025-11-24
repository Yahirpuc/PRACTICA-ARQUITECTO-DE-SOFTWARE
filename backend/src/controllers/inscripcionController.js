const inscripcionService = require('../services/inscripcionService');

const registerInscripcion = async (req, res) => {
    const alumnoMatricula = req.user.matricula; 
    const { tallerId } = req.body;

    try {
        const resultado = await inscripcionService.inscribirAlumno(alumnoMatricula, tallerId);
        res.status(200).json({ message: 'Inscripción completada exitosamente.', ...resultado });
    } catch (error) {
        const status = error.message.includes('rechazada') || error.message.includes('cupo') ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

module.exports = { registerInscripcion };