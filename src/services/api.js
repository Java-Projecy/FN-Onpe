import axios from 'axios';

// 🌐 URL base de tu API - Detecta automáticamente el entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🔗 API URL configurada:', API_BASE_URL); // Para debug

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos de timeout para Railway
});

// Interceptor para logging y debugging
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Error en request interceptor:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    (error) => {
        // Manejo mejorado de errores
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('❌ Error del servidor:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url
            });
            
            // Mensajes personalizados según el código de error
            switch (error.response.status) {
                case 400:
                    console.error('Bad Request - Verifica los datos enviados');
                    break;
                case 401:
                    console.error('No autorizado - Verifica la autenticación');
                    break;
                case 403:
                    console.error('Prohibido - No tienes permisos');
                    break;
                case 404:
                    console.error('No encontrado - El recurso no existe');
                    break;
                case 500:
                    console.error('Error interno del servidor');
                    break;
                default:
                    console.error(`Error ${error.response.status}`);
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            console.error('❌ Sin respuesta del servidor:', {
                message: 'El servidor no respondió. Verifica la conexión.',
                baseURL: API_BASE_URL
            });
        } else {
            // Algo pasó al configurar la petición
            console.error('❌ Error en la configuración:', error.message);
        }
        
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

    // Actualizar candidato
    update: (id, candidato) => api.put(`/candidatos/${id}`, candidato),

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

    // Actualizar votante
    update: (id, votante) => api.put(`/votantes/${id}`, votante),

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

// ============================================
// HEALTH CHECK (útil para Railway)
// ============================================
export const healthAPI = {
    // Verificar si el backend está disponible
    check: () => api.get('/actuator/health').catch(() => ({ data: { status: 'DOWN' } })),
};

export default api;