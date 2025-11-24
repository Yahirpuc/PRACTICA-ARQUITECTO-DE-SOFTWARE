import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const API_BASE_URL = 'http://localhost:3000/api';

function LoginPage() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedRole = params.get('role') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        matricula,
        password
      });

      const { token, rol } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', rol);

      if (rol === 'Administrador') navigate('/admin/talleres');
      else if (rol === 'Instructor') navigate('/instructor/asistencia');
      else navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión. Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Portal de Acceso</h2>

        {selectedRole && (
          <div className="text-center mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Ingresar como {selectedRole}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Usuario / Matrícula"
            placeholder="admin, inst, alumno, A123456..."
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />

          <FormInput
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
