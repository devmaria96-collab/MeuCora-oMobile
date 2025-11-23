import { router } from 'expo-router';
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
import { useAuth } from '@/contexts/AuthContext';

export default function AgendaAdicionarScreen() {
  const { addEvento, eventos } = useAgenda();
  const { token, user } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [medico, setMedico] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Verificar autenticação ao carregar a tela
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Verificando autenticação...');
      console.log('Token no contexto:', token ? 'Presente' : 'Ausente');
      console.log('Usuário no contexto:', user ? user.email : 'Nenhum');
      
      // Verificar AsyncStorage diretamente
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const storedToken = await AsyncStorage.getItem('jwt_token');
      console.log('Token no AsyncStorage:', storedToken ? 'Presente (' + storedToken.substring(0, 20) + '...)' : 'Ausente');
      
      if (!token) {
        Alert.alert(
          'Não autenticado',
          'Você precisa fazer login para adicionar eventos.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    };
    
    checkAuth();
  }, [token]);

  const handleSalvar = async () => {
    console.log('🎯 handleSalvar - Iniciando...');
    console.log('🎯 Token presente:', !!token);
    console.log('🎯 Dados:', { titulo, medico, data, horario, local, observacoes });
    
    // Verificar autenticação antes de salvar
    if (!token) {
      console.log('❌ Sem token - redirecionando para login');
      Alert.alert(
        'Sessão expirada',
        'Sua sessão expirou. Por favor, faça login novamente.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
      return;
    }

    if (!titulo.trim() || !data.trim() || !horario.trim()) {
      console.log('❌ Campos obrigatórios não preenchidos');
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (salvando) {
      console.log('⏳ Já está salvando...');
      return;
    }

    try {
      setSalvando(true);
      console.log('💾 Chamando addEvento...');
      
      await addEvento({
        titulo: titulo.trim(),
        medico: medico.trim(),
        data: data.trim(),
        horario: horario.trim(),
        local: local.trim(),
        observacoes: observacoes.trim(),
      });
      
      console.log('✅ Evento adicionado com sucesso!');

      Alert.alert('Sucesso', 'Evento adicionado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      
      // Verificar se é erro de autenticação
      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Não foi possível adicionar o evento';
      Alert.alert('Erro', errorMessage);
    } finally {
      setSalvando(false);
    }
  };

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
          
          <Text style={styles.headerTitle}>Adicionar Evento</Text>
          
          <View style={styles.headerButton} />
        </View>

        {/* Card informativo */}
        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCircleEmoji}>📅</Text>
          </View>
          
          <Text style={styles.infoTitle}>Novo Evento</Text>
          <Text style={styles.infoSubtitle}>
            Adicione consultas, exames e outros compromissos de saúde
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações do Evento</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título do Evento *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Consulta Cardiologista, Exame de Sangue..."
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
              placeholder="Informações adicionais sobre o evento"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.saveButton, salvando && styles.saveButtonDisabled]} 
            onPress={handleSalvar}
            activeOpacity={0.8}
            disabled={salvando}
          >
            <Text style={styles.saveButtonText}>
              {salvando ? 'Salvando...' : 'Adicionar Evento'}
            </Text>
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
  infoCard: {
    backgroundColor: '#1A1A1E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0 4px 8px rgba(220, 20, 60, 0.2)',
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
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
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
    boxShadow: '0 4px 8px rgba(220, 20, 60, 0.3)',
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#6B1F2A',
    opacity: 0.6,
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
