// Simula la consulta síncrona al API del Sistema Escolar[cite: 109].
const validateAlumnoMatricula = async (matricula) => {
    return new Promise((resolve) => {
        if (matricula === 'alumno') {
            resolve({ isValid: true, nombre: 'Alumno de Prueba' });
        } else if (matricula === 'invalido') {
             resolve({ isValid: false, message: 'Matrícula no encontrada o inactiva.' });
        } else {
             // Simulación genérica de éxito
            resolve({ isValid: true, nombre: 'Alumno Genérico' });
        }
    });
};

module.exports = { validateAlumnoMatricula };