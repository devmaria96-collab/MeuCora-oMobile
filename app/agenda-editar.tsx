import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAgenda } from '@/contexts/AgendaContext';

export default function AgendaEditarScreen() {
  const params = useLocalSearchParams();
  const { getEventoById, updateEvento, deleteEvento } = useAgenda();
  
  const eventoId = params.id as string;
  const evento = getEventoById(eventoId);
  
  const [titulo, setTitulo] = useState(evento?.titulo || '');
  const [medico, setMedico] = useState(evento?.medico || '');
  const [data, setData] = useState(evento?.data || '');
  const [horario, setHorario] = useState(evento?.horario || '');
  const [local, setLocal] = useState(evento?.local || '');
  const [observacoes, setObservacoes] = useState(evento?.observacoes || '');

  useEffect(() => {
    if (!evento) {
      Alert.alert('Erro', 'Evento não encontrado', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  }, [evento]);

  useEffect(() => {
    if (evento) {
      setTitulo(evento.titulo);
      setMedico(evento.medico || '');
      setData(evento.data);
      setHorario(evento.horario);
      setLocal(evento.local || '');
      setObservacoes(evento.observacoes || '');
    }
  }, [evento]);

  const handleSalvar = () => {
    if (!titulo.trim() || !data.trim() || !horario.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      updateEvento(eventoId, {
        titulo: titulo.trim(),
        medico: medico.trim(),
        data: data.trim(),
        horario: horario.trim(),
        local: local.trim(),
        observacoes: observacoes.trim(),
      });

      Alert.alert('Sucesso', 'Evento atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Evento',
      `Deseja excluir "${titulo}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteEvento(eventoId);
            Alert.alert('Excluído', 'Evento excluído com sucesso!', [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]);
          },
        },
      ],
    );
  };

  if (!evento) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Editar Evento</Text>
          
          <TouchableOpacity 
            onPress={handleExcluir}
            style={styles.headerButton}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Card de informações */}
        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCircleEmoji}>📅</Text>
          </View>
          
          <Text style={styles.eventoNome}>{titulo}</Text>
          {medico && (
            <Text style={styles.eventoMedico}>Dr(a). {medico}</Text>
          )}
          <View style={styles.detalhesRow}>
            <View style={styles.detalheChip}>
              <Text style={styles.detalheText}>{data}</Text>
            </View>
            <View style={styles.detalheChip}>
              <Text style={styles.detalheText}>{horario}</Text>
            </View>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Editar Informações</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título do Evento *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Consulta Cardiologista"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Médico (opcional)</Text>
            <TextInput
              style={styles.input}
              value={medico}
              onChangeText={setMedico}
              placeholder="Nome do médico"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Data *</Text>
              <TextInput
                style={styles.input}
                value={data}
                onChangeText={setData}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9CA3AF"
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={{ width: 12 }} />

            <View style={styles.col}>
              <Text style={styles.label}>Horário *</Text>
              <TextInput
                style={styles.input}
                value={horario}
                onChangeText={setHorario}
                placeholder="HH:MM"
                placeholderTextColor="#9CA3AF"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local (opcional)</Text>
            <TextInput
              style={styles.input}
              value={local}
              onChangeText={setLocal}
              placeholder="Endereço do local"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Informações adicionais"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Botões */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSalvar}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#DC143C',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteIcon: {
    fontSize: 24,
  },
  infoCard: {
    backgroundColor: '#1A1A1E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    backgroundColor: '#DC143C',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleEmoji: {
    fontSize: 40,
  },
  eventoNome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventoMedico: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: '600',
    marginBottom: 12,
  },
  detalhesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detalheChip: {
    backgroundColor: '#2A2B2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detalheText: {
    color: '#DC143C',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#D1D5DB',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1A1A1E',
    borderWidth: 1,
    borderColor: '#2A2B2F',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#DC143C',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#2A2B2F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
});
