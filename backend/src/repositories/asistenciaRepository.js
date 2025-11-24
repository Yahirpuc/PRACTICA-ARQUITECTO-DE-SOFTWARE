const { db } = require('../../server'); 

// 1. Obtiene la lista de alumnos inscritos en un taller específico
const findAlumnosInscritosByTaller = (tallerId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT alumno_id FROM inscripciones WHERE taller_id = ?', [tallerId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// 2. Registra la asistencia para un alumno en un taller
const registerAsistencia = (tallerId, alumnoId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO asistencias (taller_id, alumno_id, fecha_registro, asistio) 
            VALUES (?, ?, DATE('now'), 1)
        `;
        db.run(sql, [tallerId, alumnoId], function(err) {
            if (err) {
                 // Manejo de la restricción UNIQUE (ya asistió hoy)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return resolve({ success: false, message: 'Asistencia ya registrada hoy.' });
                }
                return reject(err);
            }
            resolve({ success: true, message: 'Asistencia registrada.' });
        });
    });
};

module.exports = { findAlumnosInscritosByTaller, registerAsistencia };