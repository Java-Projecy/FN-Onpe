import axios from 'axios';

// URL base de tu API
const API_BASE_URL = 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
    }
);

// ============================================
// CANDIDATOS
// ============================================
export const candidatosAPI = {
    // Obtener todos los candidatos
    getAll: () => api.get('/candidatos'),

    // Obtener candidato por ID
    getById: (id) => api.get(`/candidatos/${id}`),

    // Crear nuevo candidato
    create: (candidato) => api.post('/candidatos', candidato),

    // Eliminar candidato
    delete: (id) => api.delete(`/candidatos/${id}`),
};

// ============================================
// VOTANTES
// ============================================
export const votantesAPI = {
    // Obtener todos los votantes
    getAll: () => api.get('/votantes'),

    // Obtener votante por ID
    getById: (id) => api.get(`/votantes/${id}`),

    // Obtener votante por DNI
    getByDni: (dni) => api.get(`/votantes/dni/${dni}`),

    // Crear nuevo votante
    create: (votante) => api.post('/votantes', votante),

    // Eliminar votante
    delete: (id) => api.delete(`/votantes/${id}`),
};

// ============================================
// VOTOS PRESIDENCIALES
// ============================================
export const votosPresidencialesAPI = {
    // Obtener todos los votos presidenciales
    getAll: () => api.get('/votos-presidenciales'),

    // Obtener voto por ID
    getById: (id) => api.get(`/votos-presidenciales/${id}`),

    // Registrar nuevo voto
    create: (voto) => api.post('/votos-presidenciales', voto),

    // Eliminar voto
    delete: (id) => api.delete(`/votos-presidenciales/${id}`),
};

// ============================================
// VOTOS REGIONALES
// ============================================
export const votosRegionalesAPI = {
    // Obtener todos los votos regionales
    getAll: () => api.get('/votos-regionales'),

    // Obtener voto por ID
    getById: (id) => api.get(`/votos-regionales/${id}`),

    // Registrar nuevo voto
    create: (voto) => api.post('/votos-regionales', voto),

    // Eliminar voto
    delete: (id) => api.delete(`/votos-regionales/${id}`),
};

// ============================================
// VOTOS DISTRITALES
// ============================================
export const votosDistritalesAPI = {
    // Obtener todos los votos distritales
    getAll: () => api.get('/votos-distritales'),

    // Obtener voto por ID
    getById: (id) => api.get(`/votos-distritales/${id}`),

    // Registrar nuevo voto
    create: (voto) => api.post('/votos-distritales', voto),

    // Eliminar voto
    delete: (id) => api.delete(`/votos-distritales/${id}`),
};

export default api;