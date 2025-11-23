import { alergiaAPI } from '@/services/api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Alergia {
  id?: string;
  nome: string;
  tipo: string;
}

interface AlergiaContextType {
  alergias: Alergia[];
  loading: boolean;
  error: string | null;
  adicionarAlergia: (alergia: Omit<Alergia, 'id'>) => Promise<void>;
  editarAlergia: (id: string, alergia: Omit<Alergia, 'id'>) => Promise<void>;
  excluirAlergia: (id: string) => Promise<void>;
  obterAlergia: (id: string) => Alergia | undefined;
  refreshAlergias: () => Promise<void>;
}

const AlergiaContext = createContext<AlergiaContextType | undefined>(undefined);

export function AlergiaProvider({ children }: { children: ReactNode }) {
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Não carrega alergias se não houver token
    setLoading(false);
  }, []);

  const refreshAlergias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await alergiaAPI.getAll();
      setAlergias(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar alergias:', err);
      setError(err.message || 'Erro ao carregar alergias');
      setAlergias([]);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAlergia = async (alergia: Omit<Alergia, 'id'>) => {
    try {
      setError(null);
      console.log('🤧 AlergiaContext - Adicionando alergia:', alergia);
      const response = await alergiaAPI.create(alergia);
      console.log('✅ AlergiaContext - Alergia adicionada:', response.data);
      setAlergias([...alergias, response.data]);
    } catch (err: any) {
      console.error('❌ AlergiaContext - Erro ao adicionar alergia:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao adicionar alergia';
      console.error('❌ AlergiaContext - Detalhes:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const editarAlergia = async (id: string, alergiaAtualizada: Omit<Alergia, 'id'>) => {
    try {
      setError(null);
      const response = await alergiaAPI.update(id, alergiaAtualizada);
      setAlergias(
        alergias.map((alergia) =>
          alergia.id === id ? response.data : alergia
        )
      );
    } catch (err: any) {
      console.error('Erro ao editar alergia:', err);
      setError(err.message || 'Erro ao editar alergia');
      throw err;
    }
  };

  const excluirAlergia = async (id: string) => {
    try {
      setError(null);
      await alergiaAPI.delete(id);
      setAlergias(alergias.filter((alergia) => alergia.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir alergia:', err);
      setError(err.message || 'Erro ao excluir alergia');
      throw err;
    }
  };

  const obterAlergia = (id: string) => {
    return alergias.find((alergia) => alergia.id === id);
  };

  return (
    <AlergiaContext.Provider
      value={{ alergias, loading, error, adicionarAlergia, editarAlergia, excluirAlergia, obterAlergia, refreshAlergias }}
    >
      {children}
    </AlergiaContext.Provider>
  );
}

export function useAlergias() {
  const context = useContext(AlergiaContext);
  if (!context) {
    throw new Error('useAlergias deve ser usado dentro de um AlergiaProvider');
  }
  return context;
}
