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

import { useAuth } from '@/contexts/AuthContext';
import { useLaudos } from '@/contexts/LaudoContext';

export default function LaudosAdicionarScreen() {
  const { addLaudo, laudos } = useLaudos();
  const { token, user } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Não autenticado',
        'Você precisa fazer login para adicionar laudos.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    }
  }, [token]);

  const handleSalvar = async () => {
    if (!token) {
      Alert.alert(
        'Sessão expirada',
        'Sua sessão expirou. Por favor, faça login novamente.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
      return;
    }

    if (!titulo.trim() || !data.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (salvando) return;

    try {
      setSalvando(true);
      
      await addLaudo({
        titulo: titulo.trim(),
        data: data.trim(),
        observacoes: observacoes.trim(),
      });

      Alert.alert('Sucesso', 'Laudo adicionado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao salvar laudo:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Não foi possível adicionar o laudo';
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
          
          <Text style={styles.headerTitle}>Adicionar Laudo</Text>
          
          <View style={styles.headerButton} />
        </View>

        {/* Card informativo */}
        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCircleEmoji}>📋</Text>
          </View>
          
          <Text style={styles.infoTitle}>Novo Laudo Médico</Text>
          <Text style={styles.infoSubtitle}>
            Registre diagnósticos e laudos importantes
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações do Laudo</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título do Laudo *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Cardiopatia Congênita, Hipertensão..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data *</Text>
            <TextInput
              style={styles.input}
              value={data}
              onChangeText={setData}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Detalhes do diagnóstico ou observações importantes"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
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
              {salvando ? 'Salvando...' : 'Adicionar Laudo'}
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
    height: 120,
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
