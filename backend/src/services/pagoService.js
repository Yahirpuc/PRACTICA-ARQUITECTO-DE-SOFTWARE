const pagoRepository = require('../repositories/pagoRepository');
const PASARELA_URL = 'https://simulacion-pasarela.com/pay'; 

// 1. Iniciar el proceso de pago (Llamada Síncrona)
const initiatePayment = async (alumnoId, tallerId, monto) => {
    if (monto <= 0) {
        throw new Error('El monto del pago debe ser positivo.');
    }
    
    // Patrón Repository: Aísla la lógica de cómo se crea el pago pendiente en la DB
    const pendingPayment = await pagoRepository.createPendingPayment(alumnoId, tallerId, monto);
    
    // Genera la URL de redirección (Integración con Servicio Externo)
    const paymentURL = `${PASARELA_URL}?ref=${pendingPayment.referencia_pago}&amount=${monto}`;
    
    return { 
        referencia: pendingPayment.referencia_pago,
        redirectUrl: paymentURL 
    };
};

// 2. Manejar la confirmación (Llamada Asíncrona/Webhooks)
const handlePaymentConfirmation = async (referenciaPago) => {
    // Si la Pasarela de Pago fallara (ej. se va a otro servicio), 
    // esta capa no cambia, solo cambiaría el Repositorio (Patrón Repository).
    return await pagoRepository.completePaymentByReference(referenciaPago);
};

module.exports = { initiatePayment, handlePaymentConfirmation };