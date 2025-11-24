const pagoService = require('../services/pagoService');

const postInitiatePayment = async (req, res) => {
    const alumnoId = req.user.matricula; 
    const { tallerId, monto } = req.body;

    try {
        const result = await pagoService.initiatePayment(alumnoId, tallerId, monto);
        // Devolvemos la URL para la redirección SÍNCRONA
        res.status(200).json(result); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const postPaymentWebhook = async (req, res) => {

    const { referencia_pago, estado } = req.body; 
    
    if (estado !== 'SUCCESS') {
        return res.status(200).send('Pago no exitoso, ignorado.');
    }

    try {
        await pagoService.handlePaymentConfirmation(referencia_pago);
        // Devolvemos 200 para que la pasarela no reintente.
        res.status(200).json({ message: 'Confirmación de pago procesada.' });
    } catch (error) {
        console.error('Error al procesar webhook:', error.message);
        // Devolvemos 200 para no generar reintentos innecesarios
        res.status(200).json({ message: 'Error interno, pero webhook recibido.' }); 
    }
};

module.exports = { postInitiatePayment, postPaymentWebhook };