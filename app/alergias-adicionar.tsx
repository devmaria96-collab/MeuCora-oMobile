import Input from '@/components/input';
import { useAlergias } from '@/contexts/AlergiaContext';
import { useAuth } from '@/contexts/AuthContext';
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

export default function AlergiasAdicionarScreen() {
  const { adicionarAlergia } = useAlergias();
  const { token } = useAuth();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert(
        'Não autenticado',
        'Você precisa fazer login para adicionar alergias.',
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

    if (!nome.trim() || !tipo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (salvando) return;

    try {
      setSalvando(true);
      
      await adicionarAlergia({
        nome: nome.trim(),
        tipo: tipo.trim(),
      });

      Alert.alert('Sucesso', 'Alergia adicionada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao salvar alergia:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão expirada',
          'Sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Não foi possível adicionar a alergia';
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
            <Text style={styles.headerIcon}>🩸</Text>
            <Text style={styles.title}>Adicionar Alergia</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Preencha os dados da alergia
        </Text>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Alergia</Text>
            <Input
              placeholder="Ex: Penicilina"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo</Text>
            <Input
              placeholder="Ex: Medicamento, Alimento, etc."
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, salvando && styles.saveButtonDisabled]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            <Text style={styles.saveButtonText}>
              {salvando ? 'Salvando...' : 'Salvar Alergia'}
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
    boxShadow: '0 4px 10px rgba(220, 20, 60, 0.4)',
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
