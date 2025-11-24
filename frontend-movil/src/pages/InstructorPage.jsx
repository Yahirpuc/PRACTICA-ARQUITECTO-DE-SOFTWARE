import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';

const API_BASE_URL = 'http://localhost:3000/api';

function InstructorPage() {
    const [talleres, setTalleres] = useState([]);
    const [selectedTallerId, setSelectedTallerId] = useState('');
    const [alumnos, setAlumnos] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [materialUrl, setMaterialUrl] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    const getToken = () => localStorage.getItem('auth_token');

    useEffect(() => { fetchTalleres(); }, []);

    const fetchTalleres = async () => {
        setError('');
        try {
            const token = getToken();
            const res = await axios.get(`${API_BASE_URL}/talleres`, { headers: { Authorization: `Bearer ${token}` } });
            setTalleres(res.data || []);
        } catch (err) {
            setError('No se pudieron cargar los talleres.');
        }
    };

    const fetchAlumnos = async (tallerId) => {
        setError('');
        setAlumnos([]);
        try {
            const token = getToken();
            const res = await axios.get(`${API_BASE_URL}/talleres/${tallerId}/alumnos`, { headers: { Authorization: `Bearer ${token}` } });
            setAlumnos(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudieron cargar los alumnos.');
        }
    };

    const handleRegisterAsistencia = async (alumnoMatricula) => {
        setError('');
        setMessage('');
        if (!selectedTallerId) return setError('Seleccione un taller primero.');
        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/asistencia`, { tallerId: selectedTallerId, alumnoId: alumnoMatricula }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Asistencia registrada.');
            // refrescar lista si necesario
            fetchAlumnos(selectedTallerId);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar asistencia.');
        }
    };

    // Materiales (simple persistencia local para demo)
    const loadMaterials = (tallerId) => {
        try {
            const raw = localStorage.getItem(`materials_taller_${tallerId}`) || '[]';
            setMaterials(JSON.parse(raw));
        } catch (e) { setMaterials([]); }
    };

    const addMaterial = () => {
        if (!selectedTallerId) return setError('Seleccione un taller antes de subir materiales.');
        if (!materialUrl) return setError('Ingrese la URL del material.');
        const key = `materials_taller_${selectedTallerId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const nuevo = { id: Date.now(), url: materialUrl };
        const updated = [nuevo, ...existing];
        localStorage.setItem(key, JSON.stringify(updated));
        setMaterials(updated);
        setMaterialUrl('');
        setMessage('Material agregado (demo local).');
    };

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-2xl font-bold mb-2">📋 Portal del Instructor - Asistencia</h2>
                <p className="text-sm text-gray-600">Selecciona un taller para ver alumnos y registrar asistencias.</p>
                {message && <p className="text-green-600 mt-2">{message}</p>}
                {error && <p className="text-red-600 mt-2">{error}</p>}

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Taller</label>
                    <select
                        value={selectedTallerId}
                        onChange={(e) => { setSelectedTallerId(e.target.value); fetchAlumnos(e.target.value); loadMaterials(e.target.value); }}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">-- Seleccione --</option>
                        {talleres.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre} {t.sede ? `- ${t.sede}` : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Materiales (demo)</h3>
                    <div className="mt-2 flex gap-2">
                        <input value={materialUrl} onChange={(e) => setMaterialUrl(e.target.value)} placeholder="https://... enlace al material" className="flex-1 border border-gray-300 rounded px-3 py-2" />
                        <Button variant="primary" onClick={addMaterial}>Agregar</Button>
                    </div>

                    <div className="mt-3">
                        {materials.length === 0 ? (
                            <p className="text-gray-500">Aún no hay materiales publicados para este taller.</p>
                        ) : (
                            <ul className="space-y-2">
                                {materials.map(m => (
                                    <li key={m.id}><a className="text-blue-600 underline" href={m.url} target="_blank" rel="noreferrer">{m.url}</a></li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Alumnos inscritos</h3>
                    {alumnos.length === 0 ? (
                        <p className="text-gray-500 mt-2">No hay alumnos inscritos para este taller.</p>
                    ) : (
                        <div className="mt-2">
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Matrícula</th>
                                        <th className="px-4 py-2 text-left">Nombre</th>
                                        <th className="px-4 py-2 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnos.map(a => (
                                        <tr key={a.matricula} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">{a.matricula}</td>
                                            <td className="px-4 py-2 border-b">{a.nombre || '-'}</td>
                                            <td className="px-4 py-2 border-b">
                                                <div className="flex gap-2">
                                                    <Button variant="primary" size="sm" onClick={() => handleRegisterAsistencia(a.matricula)}>Marcar Asistencia</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </Card>
        </div>
    );
}

export default InstructorPage;