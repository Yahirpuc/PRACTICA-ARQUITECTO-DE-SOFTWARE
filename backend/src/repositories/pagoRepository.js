const { db } = require('../../server'); 

// 1. Crear un registro de pago inicial (Estado: PENDIENTE)
const createPendingPayment = (alumnoId, tallerId, monto) => {
    return new Promise((resolve, reject) => {
        const referencia_pago = `REF-${Date.now()}-${alumnoId}`; 

        db.run(
            'INSERT INTO pagos (alumno_id, taller_id, monto, estado, referencia_pago) VALUES (?, ?, ?, ?, ?)', 
            [alumnoId, tallerId, monto, 'PENDIENTE', referencia_pago], 
            function (err) {
                if (err) return reject(err);
                resolve({ id: this.lastID, referencia_pago, estado: 'PENDIENTE' });
            }
        );
    });
};

// 2. Actualizar el pago a COMPLETADO (Llamado por el Webhook Asíncrono)
const completePaymentByReference = (referencia_pago) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pagos SET estado = ?, fecha_pago = DATETIME(\'now\') WHERE referencia_pago = ? AND estado = \'PENDIENTE\'';
        db.run(sql, ['COMPLETADO', referencia_pago], function(err) {
            if (err) return reject(err);
            if (this.changes === 0) return reject(new Error('Referencia de pago no encontrada o ya procesada.'));
            resolve({ success: true, changes: this.changes });
        });
    });
};

module.exports = { createPendingPayment, completePaymentByReference };