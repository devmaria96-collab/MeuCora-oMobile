import Input from '@/components/input';
import { useAlergias } from '@/contexts/AlergiaContext';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function AlergiasEditarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { obterAlergia, editarAlergia } = useAlergias();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    if (id) {
      const alergia = obterAlergia(id);
      if (alergia) {
        setNome(alergia.nome);
        setTipo(alergia.tipo);
      }
    }
  }, [id]);

  const handleSalvar = () => {
    if (!nome.trim() || !tipo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!id) {
      Alert.alert('Erro', 'ID da alergia não encontrado');
      return;
    }

    editarAlergia(id, {
      nome: nome.trim(),
      tipo: tipo.trim(),
    });

    Alert.alert('Sucesso', 'Alergia atualizada com sucesso!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
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
            <Text style={styles.title}>Editar Alergia</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Atualize os dados da alergia
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
            style={styles.saveButton}
            onPress={handleSalvar}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    elevation: 8,
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
