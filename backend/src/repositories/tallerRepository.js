const { db } = require('../../server'); 

const findAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM talleres ORDER BY nombre', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const create = (taller) => {
    const { nombre, descripcion, cupo_maximo, sede } = taller; 
    
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO talleres (nombre, descripcion, cupo_maximo, cupo_actual, sede) VALUES (?, ?, ?, 0, ?)', 
            [nombre, descripcion, cupo_maximo, sede], 
            function (err) { 
                if (err) reject(err);
                else resolve({ id: this.lastID, ...taller, cupo_actual: 0 });
            }
        );
    });
};

module.exports = { findAll, create };