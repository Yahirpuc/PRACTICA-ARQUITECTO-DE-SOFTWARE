const { db } = require('../../server'); 

const findTallerById = (tallerId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT cupo_maximo, cupo_actual FROM talleres WHERE id = ?', [tallerId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const registerInscripcionAndUpdateCupo = (alumnoId, tallerId) => {
    // Transacción para garantizar la integridad (registro + actualización de cupo) [cite: 89]
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION;");

            const insertSql = 'INSERT INTO inscripciones (alumno_id, taller_id, fecha) VALUES (?, ?, DATETIME(\'now\'))';
            db.run(insertSql, [alumnoId, tallerId], function(err) {
                if (err) { db.run("ROLLBACK;"); return reject(new Error('Fallo al registrar inscripción.')); }
            });

            const updateSql = 'UPDATE talleres SET cupo_actual = cupo_actual + 1 WHERE id = ?';
            db.run(updateSql, [tallerId], function(err) {
                if (err) { db.run("ROLLBACK;"); return reject(new Error('Fallo al actualizar cupo.')); }
            });

            db.run("COMMIT;", (err) => {
                 if (err) return reject(new Error('Fallo al hacer COMMIT.'));
                 resolve({ success: true, message: 'Inscripción y cupo actualizados.' });
            });
        });
    });
};

module.exports = { findTallerById, registerInscripcionAndUpdateCupo };