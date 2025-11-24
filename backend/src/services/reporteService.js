const reporteRepository = require('../repositories/reporteRepository');

const generateReporteGeneral = async () => {
    // Patrón Dependency Injection: usa el Repositorio de Reportes
    const demanda = await reporteRepository.getReporteDemanda();
    const asistenciaTotal = await reporteRepository.getReporteAsistenciaTotal();

    // Patrón DTO: Se usa para estructurar el reporte final
    return {
        fecha_generacion: new Date().toISOString(),
        talleres_mas_demandados: demanda,
        resumen_asistencia: asistenciaTotal
    };
};

module.exports = { generateReporteGeneral };