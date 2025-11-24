const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DB_PATH = './talleres.db';
const db = new sqlite3.Database(DB_PATH);

// ------------------------------
// LOGIN
// ------------------------------
const login = (req, res) => {
    const { matricula, password } = req.body;

    // Validación
    if (!matricula || !password) {
        return res.status(400).json({ message: 'Faltan credenciales.' });
    }

    // Buscar usuario
    db.get('SELECT * FROM users WHERE matricula = ?', [matricula], (err, row) => {
        if (err) {
            console.error("Error DB:", err);
            return res.status(500).json({ message: 'Error interno en la base de datos.' });
        }

        if (!row) {
            return res.status(401).json({ message: 'Usuario o contraseña inválidos.' });
        }

        // Comparar contraseñas
        let match = false;
        try {
            match = bcrypt.compareSync(password, row.password);
        } catch (e) {
            console.error("Error al comparar passwords:", e);
            return res.status(500).json({ message: 'Error interno.' });
        }

        if (!match) {
            return res.status(401).json({ message: 'Usuario o contraseña inválidos.' });
        }

        // Crear JWT
        const payload = { id: row.id, matricula: row.matricula, rol: row.rol };
        const secret = process.env.JWT_SECRET || 'dev-secret';

        let token;
        try {
            token = jwt.sign(payload, secret, { expiresIn: '1h' });
        } catch (e) {
            console.error("Error generando token:", e);
            return res.status(500).json({ message: 'Error generando token.' });
        }

        return res.json({
            message: 'Login exitoso',
            token,
            rol: row.rol,
            matricula: row.matricula,
            nombre: row.nombre
        });
    });
};

// ------------------------------
// AUTENTICAR JWT
// ------------------------------
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(401).json({ message: "Token no enviado." });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token inválido." });

    const secret = process.env.JWT_SECRET || 'dev-secret';

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado." });
        }
        req.user = user;
        next();
    });
};

// ------------------------------
// AUTORIZAR POR ROL
// ------------------------------
const authorizeRole = (requiredRole) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Token no válido." });
    }

    if (req.user.rol !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }

    next();
};

module.exports = { login, authenticateToken, authorizeRole };
