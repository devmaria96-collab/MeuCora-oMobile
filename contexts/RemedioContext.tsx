import { remedioAPI } from '@/services/api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Remedio {
  id?: string;
  nome: string;
  dosagem: string;
}

interface RemedioContextType {
  remedios: Remedio[];
  loading: boolean;
  error: string | null;
  adicionarRemedio: (remedio: Omit<Remedio, 'id'>) => Promise<void>;
  editarRemedio: (id: string, remedio: Omit<Remedio, 'id'>) => Promise<void>;
  excluirRemedio: (id: string) => Promise<void>;
  obterRemedio: (id: string) => Remedio | undefined;
  refreshRemedios: () => Promise<void>;
}

const RemedioContext = createContext<RemedioContextType | undefined>(undefined);

export function RemedioProvider({ children }: { children: ReactNode }) {
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Não carrega remédios se não houver token
    setLoading(false);
  }, []);

  const refreshRemedios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await remedioAPI.getAll();
      setRemedios(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar remédios:', err);
      setError(err.message || 'Erro ao carregar remédios');
      setRemedios([]);
    } finally {
      setLoading(false);
    }
  };

  const adicionarRemedio = async (remedio: Omit<Remedio, 'id'>) => {
    try {
      setError(null);
      console.log('💊 RemedioContext - Adicionando remédio:', remedio);
      const response = await remedioAPI.create(remedio);
      console.log('✅ RemedioContext - Remédio adicionado com sucesso:', response.data);
      setRemedios([...remedios, response.data]);
    } catch (err: any) {
      console.error('❌ RemedioContext - Erro ao adicionar remédio:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao adicionar remédio';
      console.error('❌ RemedioContext - Detalhes:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const editarRemedio = async (id: string, remedioAtualizado: Omit<Remedio, 'id'>) => {
    try {
      setError(null);
      const response = await remedioAPI.update(id, remedioAtualizado);
      setRemedios(
        remedios.map((remedio) =>
          remedio.id === id ? response.data : remedio
        )
      );
    } catch (err: any) {
      console.error('Erro ao editar remédio:', err);
      setError(err.message || 'Erro ao editar remédio');
      throw err;
    }
  };

  const excluirRemedio = async (id: string) => {
    try {
      setError(null);
      await remedioAPI.delete(id);
      setRemedios(remedios.filter((remedio) => remedio.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir remédio:', err);
      setError(err.message || 'Erro ao excluir remédio');
      throw err;
    }
  };

  const obterRemedio = (id: string) => {
    return remedios.find((remedio) => remedio.id === id);
  };

  return (
    <RemedioContext.Provider
      value={{ remedios, loading, error, adicionarRemedio, editarRemedio, excluirRemedio, obterRemedio, refreshRemedios }}
    >
      {children}
    </RemedioContext.Provider>
  );
}

export function useRemedios() {
  const context = useContext(RemedioContext);
  if (!context) {
    throw new Error('useRemedios deve ser usado dentro de um RemedioProvider');
  }
  return context;
}
