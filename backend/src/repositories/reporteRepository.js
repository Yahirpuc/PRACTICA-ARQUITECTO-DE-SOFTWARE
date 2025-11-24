const { db } = require('../../server'); 

// Reporte 1: Talleres más demandados (simulado por cupos actuales)
const getReporteDemanda = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT nombre, cupo_actual, cupo_maximo FROM talleres ORDER BY cupo_actual DESC LIMIT 5', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Reporte 2: Total de asistencias registradas
const getReporteAsistenciaTotal = () => {
    return new Promise((resolve, reject) => {
        // Cuenta el número de registros en la tabla de asistencias
        db.get('SELECT COUNT(id) AS total_asistencias FROM asistencias', [], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { getReporteDemanda, getReporteAsistenciaTotal };