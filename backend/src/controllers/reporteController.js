const reporteService = require('../services/reporteService');

const getReporte = async (req, res) => {
    try {
        // Los reportes son típicamente una función administrativa
        const reporte = await reporteService.generateReporteGeneral();
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el reporte.' });
    }
};

module.exports = { getReporte };