import Input from '@/components/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRemedios } from '@/contexts/RemedioContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RemediosAdicionarScreen() {
  const { adicionarRemedio } = useRemedios();
  const { token } = useAuth();
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Não autenticado',
        'Você precisa fazer login para adicionar remédios.',
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

    if (!nome.trim() || !dosagem.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (salvando) return;

    try {
      setSalvando(true);
      
      await adicionarRemedio({
        nome: nome.trim(),
        dosagem: dosagem.trim(),
      });

      Alert.alert('Sucesso', 'Remédio adicionado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao salvar remédio:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao adicionar remédio';
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
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>💊</Text>
            <Text style={styles.title}>Adicionar Remédio</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Preencha os dados do medicamento
        </Text>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Remédio</Text>
            <Input
              placeholder="Ex: Carvedilol"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosagem</Text>
            <Input
              placeholder="Ex: 6,25 mg"
              value={dosagem}
              onChangeText={setDosagem}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            <Text style={styles.saveButtonText}>
              {salvando ? 'Salvando...' : 'Salvar Remédio'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 32,
    color: '#DC143C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 32,
    marginLeft: 52,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: '#DC143C',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#6B1F2A',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A2B2F',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
  },
});
