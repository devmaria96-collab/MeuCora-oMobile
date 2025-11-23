import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar token ao iniciar
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('jwt_token');
      const savedUser = await AsyncStorage.getItem('user_data');
      
      console.log('🔍 Bootstrap - Token encontrado:', savedToken ? 'Sim' : 'Não');
      console.log('🔍 Bootstrap - User data encontrado:', savedUser ? 'Sim' : 'Não');
      console.log('🔍 Bootstrap - User data raw:', savedUser);
      
      if (savedToken) {
        setToken(savedToken);
        console.log('✅ Token restaurado do AsyncStorage');
      }
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Dados do usuário restaurados:', parsedUser);
      } else {
        console.log('⚠️ Nenhum dado de usuário encontrado no AsyncStorage');
      }
    } catch (e) {
      console.error('❌ Falha ao restaurar dados do AsyncStorage:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { access_token, user: userData } = response.data;
      
      console.log('🔐 Login bem-sucedido. Token:', access_token ? 'Recebido' : 'Não recebido');
      console.log('👤 Dados do usuário recebidos:', userData);
      
      if (!access_token) {
        throw new Error('Token não foi retornado pelo servidor');
      }
      
      // Salvar token no AsyncStorage e aguardar confirmação
      await AsyncStorage.setItem('jwt_token', access_token);
      console.log('✅ Token salvo no AsyncStorage');
      
      // Salvar dados do usuário no AsyncStorage
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      console.log('✅ Dados do usuário salvos no AsyncStorage');
      
      // Verificar se o token foi realmente salvo
      const savedToken = await AsyncStorage.getItem('jwt_token');
      if (savedToken !== access_token) {
        console.error('❌ Token não foi salvo corretamente!');
        throw new Error('Erro ao salvar token de autenticação');
      }
      
      console.log('✅ Token verificado no AsyncStorage');
      
      // Pequeno delay para garantir persistência (especialmente no web)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setToken(access_token);
      setUser(userData);
      
      console.log('✅ Estado do AuthContext atualizado');
      console.log('👤 Usuário logado:', userData.name, '-', userData.email);
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      console.log('📝 AuthContext.register - Iniciando com:', data);
      const response = await authAPI.register(data);
      const { access_token, user: userData } = response.data;
      
      console.log('🔐 Registro bem-sucedido. Token:', access_token ? 'Recebido' : 'Não recebido');
      console.log('👤 Dados do usuário recebidos:', userData);
      
      if (!access_token) {
        throw new Error('Token não foi retornado pelo servidor');
      }
      
      // Salvar token no AsyncStorage e aguardar confirmação
      await AsyncStorage.setItem('jwt_token', access_token);
      console.log('✅ Token salvo no AsyncStorage');
      
      // Salvar dados do usuário no AsyncStorage
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      console.log('✅ Dados do usuário salvos no AsyncStorage');
      
      // Verificar se o token foi realmente salvo
      const savedToken = await AsyncStorage.getItem('jwt_token');
      if (savedToken !== access_token) {
        console.error('❌ Token não foi salvo corretamente!');
        throw new Error('Erro ao salvar token de autenticação');
      }
      
      console.log('✅ Token verificado no AsyncStorage');
      
      // Pequeno delay para garantir persistência (especialmente no web)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setToken(access_token);
      setUser(userData);
      
      console.log('✅ Estado do AuthContext atualizado');
      console.log('👤 Usuário registrado:', userData.name, '-', userData.email);
    } catch (error: any) {
      console.error('❌ Erro ao registrar:', error);
      
      // Melhorar mensagem de erro
      if (error.code === 'ERR_NETWORK') {
        const networkError = new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        (networkError as any).isNetworkError = true;
        throw networkError;
      }
      
      if (error.response) {
        // Erro retornado pelo servidor
        const serverError = new Error(error.response.data?.message || 'Erro ao registrar usuário');
        (serverError as any).response = error.response;
        throw serverError;
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
