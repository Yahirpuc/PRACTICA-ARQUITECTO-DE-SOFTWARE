const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// MIDDLEWARE
// =======================================================
app.use(cors());
app.use(express.json());

// =======================================================
// BASE DE DATOS GLOBAL (una sola conexión)
// =======================================================
const DB_PATH = './talleres.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error al conectar con SQLite:', err.message);
    } else {
        console.log('✅ Conexión a SQLite exitosa. Inicializando tablas...');

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                matricula TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                rol TEXT NOT NULL,
                nombre TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS talleres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                descripcion TEXT,
                cupo_maximo INTEGER NOT NULL,
                cupo_actual INTEGER DEFAULT 0,
                sede TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS inscripciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alumno_id TEXT NOT NULL,
                taller_id INTEGER NOT NULL,
                fecha DATETIME,
                UNIQUE(alumno_id, taller_id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS asistencias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                taller_id INTEGER NOT NULL,
                alumno_id TEXT NOT NULL,
                fecha_registro DATETIME,
                asistio BOOLEAN NOT NULL DEFAULT 1,
                UNIQUE(taller_id, alumno_id, fecha_registro)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS pagos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alumno_id TEXT NOT NULL,
                taller_id INTEGER NOT NULL,
                monto REAL NOT NULL,
                estado TEXT NOT NULL DEFAULT 'PENDIENTE',
                referencia_pago TEXT UNIQUE,
                fecha_pago DATETIME,
                UNIQUE(alumno_id, taller_id)
            )
        `);
    }
});

// ESTA ES LA CLAVE: exporta la conexión única
module.exports = { db };

// =======================================================
// IMPORTAR CONTROLADORES (usan la MISMA conexión)
// =======================================================
const { login, authenticateToken, authorizeRole } = require('./src/controllers/authController');
const { getTalleres, createTaller } = require('./src/controllers/tallerController');
const { registerInscripcion } = require('./src/controllers/inscripcionController');
const { getAlumnosList, postAsistencia } = require('./src/controllers/asistenciaController');
const { postInitiatePayment, postPaymentWebhook } = require('./src/controllers/pagoController');
const { getReporte } = require('./src/controllers/reporteController');
const { getNotificaciones } = require('./src/controllers/notificationController');

// =======================================================
// RUTAS
// =======================================================
app.post('/api/login', login);

app.get('/api/talleres', authenticateToken, getTalleres);
app.post('/api/talleres', authenticateToken, authorizeRole('Administrador'), createTaller);

app.post('/api/inscripciones', authenticateToken, authorizeRole('Alumno'), registerInscripcion);

app.get('/api/talleres/:tallerId/alumnos', authenticateToken, authorizeRole('Instructor'), getAlumnosList);
app.post('/api/asistencia', authenticateToken, authorizeRole('Instructor'), postAsistencia);

// Endpoint simple de notificaciones/avisos
app.get('/api/notificaciones', authenticateToken, getNotificaciones);

app.post('/api/pagos/iniciar', authenticateToken, authorizeRole('Alumno'), postInitiatePayment);
app.post('/api/pagos/webhook', postPaymentWebhook);

app.get('/api/reportes/general', authenticateToken, authorizeRole('Administrador'), getReporte);

app.get('/', (req, res) => res.send('API Central del Sistema de Talleres Activa 🚀'));

// =======================================================
// INICIAR SERVIDOR
// =======================================================
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
