const tallerService = require('../services/tallerService');

const getTalleres = async (req, res) => {
    try {
        const talleres = await tallerService.getAllTalleres();
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ message: 'Error interno al obtener talleres.' });
    }
};

const createTaller = async (req, res) => {
    try {
        const nuevoTaller = await tallerService.createTaller(req.body);
        res.status(201).json(nuevoTaller); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
};

module.exports = { getTalleres, createTaller };