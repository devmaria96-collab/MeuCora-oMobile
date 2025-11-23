import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL base do backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Aguardar explicitamente o token do AsyncStorage
      const token = await AsyncStorage.getItem('jwt_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token adicionado ao header para:', config.url);
        console.log('🔑 Token (primeiros 20 caracteres):', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ Nenhum token encontrado no AsyncStorage para:', config.url);
        // Não rejeitamos aqui pois rotas públicas podem não precisar de token
      }
    } catch (error) {
      console.error('❌ Erro ao obter token do AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('🔒 Erro 401: Não autorizado. Token inválido ou expirado.');
      // Token expirado - limpar e redirecionar para login
      await AsyncStorage.removeItem('jwt_token');
      // Você pode adicionar lógica de redirecionamento aqui
    }
    return Promise.reject(error);
  }
);

// Função auxiliar para verificar se há token
export const hasAuthToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    return !!token;
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    return false;
  }
};

// Função auxiliar para obter o token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('jwt_token');
  } catch (error) {
    console.error('❌ Erro ao obter token:', error);
    return null;
  }
};

// Endpoints de Autenticação
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) => {
    console.log('API Register - Enviando dados:', data);
    return apiClient.post('/auth/register', data);
  },
  
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  googleAuth: () =>
    apiClient.get('/auth/google'),
};

// Endpoints da Agenda
export const agendaAPI = {
  getAll: () => apiClient.get('/agenda'),
  getById: (id: string) => apiClient.get(`/agenda/${id}`),
  create: (data: any) => apiClient.post('/agenda', data),
  update: (id: string, data: any) => apiClient.put(`/agenda/${id}`, data),
  delete: (id: string) => apiClient.delete(`/agenda/${id}`),
};

export const alergiaAPI = {
  getAll: () => apiClient.get('/alergias'),
  getById: (id: string) => apiClient.get(`/alergias/${id}`),
  create: (data: any) => apiClient.post('/alergias', data),
  update: (id: string, data: any) => apiClient.put(`/alergias/${id}`, data),
  delete: (id: string) => apiClient.delete(`/alergias/${id}`),
};

export const laudoAPI = {
  getAll: () => apiClient.get('/laudos'),
  getById: (id: string) => apiClient.get(`/laudos/${id}`),
  create: (data: any) => apiClient.post('/laudos', data),
  update: (id: string, data: any) => apiClient.put(`/laudos/${id}`, data),
  delete: (id: string) => apiClient.delete(`/laudos/${id}`),
};

export const remedioAPI = {
  getAll: () => apiClient.get('/remedios'),
  getById: (id: string) => apiClient.get(`/remedios/${id}`),
  create: (data: any) => apiClient.post('/remedios', data),
  update: (id: string, data: any) => apiClient.put(`/remedios/${id}`, data),
  delete: (id: string) => apiClient.delete(`/remedios/${id}`),
};
