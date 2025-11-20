// src/services/api.js
import axios from 'axios';

// ✅ SOLUCIÓN DEFINITIVA
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

console.log('🌐 API URL configurada:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// ======================== ENDPOINTS ========================
export const candidatosAPI = {
    getAll: () => api.get('/data/candidates'),
    getById: (id) => api.get(`/data/candidates/${id}`), // ← Quitado /api
    create: (candidato) => api.post('/data/candidates', candidato), // ← Quitado /api
    update: (id, candidato) => api.put(`/data/candidates/${id}`, candidato), // ← Quitado /api
    delete: (id) => api.delete(`/data/candidates/${id}`), // ← Quitado /api
};

// ============================================
// VOTANTES → /data/voters (SEGURO)
// ============================================
export const votantesAPI = {
    getAll: () => api.get('/data/voters'),
    getById: (id) => api.get(`/data/voters/${id}`),
    getByDni: (dni) => api.get(`/data/voters/dni/${dni}`),        // ← Crucial para LandingPage
    create: (votante) => api.post('/data/voters', votante),
    update: (id, votante) => api.put(`/data/voters/${id}`, votante),
    delete: (id) => api.delete(`/data/voters/${id}`),
};

// ============================================
// VOTOS PRESIDENCIALES → /data/presidential-votes
// ============================================
export const votosPresidencialesAPI = {
    getAll: () => api.get('/data/presidential-votes'),
    getById: (id) => api.get(`/data/presidential-votes/${id}`),
    create: (voto) => api.post('/data/presidential-votes', voto),
    delete: (id) => api.delete(`/data/presidential-votes/${id}`),
};

// ============================================
// VOTOS REGIONALES → /data/regional-votes
// ============================================
export const votosRegionalesAPI = {
    getAll: () => api.get('/data/regional-votes'),
    getById: (id) => api.get(`/data/regional-votes/${id}`),
    create: (voto) => api.post('/data/regional-votes', voto),
    delete: (id) => api.delete(`/data/regional-votes/${id}`),
};

// ============================================
// VOTOS DISTRITALES → /data/district-votes
// ============================================
export const votosDistritalesAPI = {
    getAll: () => api.get('/data/district-votes'),
    getById: (id) => api.get(`/data/district-votes/${id}`),
    create: (voto) => api.post('/data/district-votes', voto),
    delete: (id) => api.delete(`/data/district-votes/${id}`),
};

// ============================================
// HEALTH CHECK (opcional – útil para monitorear Railway)
// ============================================
export const healthAPI = {
    check: () => api.get('/actuator/health').catch(() => ({ data: { status: 'DOWN' } })),
};

// Exportar la instancia por si alguien la necesita directamente
export default api;