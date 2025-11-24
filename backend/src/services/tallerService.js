const tallerRepository = require('../repositories/tallerRepository');

const getAllTalleres = async () => {
    return await tallerRepository.findAll();
};

const createTaller = async (tallerData) => {
    // Regla de Negocio
    if (!tallerData.nombre || !tallerData.cupo_maximo || tallerData.cupo_maximo <= 0) {
        throw new Error('El nombre y el cupo máximo son obligatorios y deben ser válidos.');
    }
    
    return await tallerRepository.create(tallerData);
};

module.exports = { getAllTalleres, createTaller };