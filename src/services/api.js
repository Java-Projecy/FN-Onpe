// src/services/api.js
import axios from 'axios';

// URL base del backend (Railway, localhost, producción, etc.)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('API URL configurada:', API_BASE_URL);

// Instancia global de Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos (ideal para Railway)
});

// ======================== INTERCEPTORES (opcional pero útil) ========================
api.interceptors.request.use(
    (config) => {
        console.log(`%c${config.method?.toUpperCase()} ${config.url}`, 'color: #4ade80');
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log(`%c${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`, 'color: #60a5fa');
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`%cERROR ${error.response.status} → ${error.config?.url}`, 'color: #ef4444', error.response.data);
        } else if (error.request) {
            console.error('%cSin respuesta del servidor', 'color: #ef4444', error.request);
        } else {
            console.error('%cError de configuración', 'color: #ef4444', error.message);
        }
        return Promise.reject(error);
    }
);

// ============================================
// CANDIDATOS → /api/data/candidates (SEGURO)
// ============================================
export const candidatosAPI = {
    getAll: () => api.get('/data/candidates'),
    getById: (id) => api.get(`/data/candidates/${id}`),
    create: (candidato) => api.post('/data/candidates', candidato),
    update: (id, candidato) => api.put(`/data/candidates/${id}`, candidato),
    delete: (id) => api.delete(`/data/candidates/${id}`),
};

// ============================================
// VOTANTES → /api/data/voters (SEGURO)
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
// VOTOS PRESIDENCIALES → /api/data/presidential-votes
// ============================================
export const votosPresidencialesAPI = {
    getAll: () => api.get('/data/presidential-votes'),
    getById: (id) => api.get(`/data/presidential-votes/${id}`),
    create: (voto) => api.post('/data/presidential-votes', voto),
    delete: (id) => api.delete(`/data/presidential-votes/${id}`),
};

// ============================================
// VOTOS REGIONALES → /api/data/regional-votes
// ============================================
export const votosRegionalesAPI = {
    getAll: () => api.get('/data/regional-votes'),
    getById: (id) => api.get(`/data/regional-votes/${id}`),
    create: (voto) => api.post('/data/regional-votes', voto),
    delete: (id) => api.delete(`/data/regional-votes/${id}`),
};

// ============================================
// VOTOS DISTRITALES → /api/data/district-votes
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