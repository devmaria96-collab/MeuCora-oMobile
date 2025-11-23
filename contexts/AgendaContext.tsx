import { agendaAPI } from '@/services/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Evento {
  id?: string;
  titulo: string;
  medico?: string;
  data: string; // formato: DD/MM/YYYY
  horario: string; // formato: HH:MM
  local?: string;
  observacoes?: string;
}

interface AgendaContextType {
  eventos: Evento[];
  loading: boolean;
  error: string | null;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<void>;
  updateEvento: (id: string, evento: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  getEventoById: (id: string) => Evento | undefined;
  refreshEventos: () => Promise<void>;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export function AgendaProvider({ children }: { children: React.ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar eventos ao montar o componente
  useEffect(() => {
    // Não carrega eventos se não houver token
    setLoading(false);
  }, []);

  const refreshEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await agendaAPI.getAll();
      setEventos(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
      // Fallback com dados vazios se a API falhar
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const addEvento = async (evento: Omit<Evento, 'id'>) => {
    try {
      setError(null);
      console.log('📅 AgendaContext - Criando evento:', evento);
      const response = await agendaAPI.create(evento);
      console.log('✅ AgendaContext - Evento criado:', response.data);
      setEventos([...eventos, response.data]);
    } catch (err: any) {
      console.error('❌ AgendaContext - Erro ao criar evento:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar evento';
      console.error('❌ AgendaContext - Detalhes:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  const updateEvento = async (id: string, updates: Partial<Evento>) => {
    try {
      setError(null);
      const response = await agendaAPI.update(id, updates);
      setEventos(eventos.map((e) => (e.id === id ? response.data : e)));
    } catch (err: any) {
      console.error('Erro ao atualizar evento:', err);
      setError(err.message || 'Erro ao atualizar evento');
      throw err;
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      setError(null);
      await agendaAPI.delete(id);
      setEventos(eventos.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar evento:', err);
      setError(err.message || 'Erro ao deletar evento');
      throw err;
    }
  };

  const getEventoById = (id: string) => {
    return eventos.find((e) => e.id === id);
  };

  return (
    <AgendaContext.Provider
      value={{ eventos, loading, error, addEvento, updateEvento, deleteEvento, getEventoById, refreshEventos }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda must be used within a AgendaProvider');
  }
  return context;
}
