import { laudoAPI } from '@/services/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Laudo {
  id?: string;
  titulo: string;
  data: string; // formato: DD/MM/YYYY
  observacoes?: string;
}

interface LaudoContextType {
  laudos: Laudo[];
  loading: boolean;
  error: string | null;
  addLaudo: (laudo: Omit<Laudo, 'id'>) => Promise<void>;
  updateLaudo: (id: string, laudo: Partial<Laudo>) => Promise<void>;
  deleteLaudo: (id: string) => Promise<void>;
  getLaudoById: (id: string) => Laudo | undefined;
  refreshLaudos: () => Promise<void>;
}

const LaudoContext = createContext<LaudoContextType | undefined>(undefined);

export function LaudoProvider({ children }: { children: React.ReactNode }) {
  const [laudos, setLaudos] = useState<Laudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Não carrega laudos se não houver token
    setLoading(false);
  }, []);

  const refreshLaudos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await laudoAPI.getAll();
      setLaudos(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar laudos:', err);
      setError(err.message || 'Erro ao carregar laudos');
      setLaudos([]);
    } finally {
      setLoading(false);
    }
  };

  const addLaudo = async (laudo: Omit<Laudo, 'id'>) => {
    try {
      setError(null);
      console.log('📄 LaudoContext - Criando laudo:', laudo);
      const response = await laudoAPI.create(laudo);
      console.log('✅ LaudoContext - Laudo criado:', response.data);
      setLaudos([...laudos, response.data]);
    } catch (err: any) {
      console.error('❌ LaudoContext - Erro ao criar laudo:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar laudo';
      console.error('❌ LaudoContext - Detalhes:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const updateLaudo = async (id: string, updates: Partial<Laudo>) => {
    try {
      setError(null);
      const response = await laudoAPI.update(id, updates);
      setLaudos(laudos.map((l) => (l.id === id ? response.data : l)));
    } catch (err: any) {
      console.error('Erro ao atualizar laudo:', err);
      setError(err.message || 'Erro ao atualizar laudo');
      throw err;
    }
  };

  const deleteLaudo = async (id: string) => {
    try {
      setError(null);
      await laudoAPI.delete(id);
      setLaudos(laudos.filter((l) => l.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar laudo:', err);
      setError(err.message || 'Erro ao deletar laudo');
      throw err;
    }
  };

  const getLaudoById = (id: string) => {
    return laudos.find((l) => l.id === id);
  };

  return (
    <LaudoContext.Provider
      value={{ laudos, loading, error, addLaudo, updateLaudo, deleteLaudo, getLaudoById, refreshLaudos }}
    >
      {children}
    </LaudoContext.Provider>
  );
}

export function useLaudos() {
  const context = useContext(LaudoContext);
  if (!context) {
    throw new Error('useLaudos must be used within a LaudoProvider');
  }
  return context;
}
