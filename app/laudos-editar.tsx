import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useLaudos } from '@/contexts/LaudoContext';

export default function LaudosEditarScreen() {
  const params = useLocalSearchParams();
  const { getLaudoById, deleteLaudo } = useLaudos();
  
  const laudoId = params.id as string;
  const laudo = getLaudoById(laudoId);

  useEffect(() => {
    if (!laudo) {
      Alert.alert('Erro', 'Laudo não encontrado', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  }, [laudo]);

  const handleExportar = () => {
    Alert.alert('Exportar PDF', 'Funcionalidade em desenvolvimento');
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Laudo',
      `Deseja excluir "${laudo?.titulo}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteLaudo(laudoId);
            Alert.alert('Excluído', 'Laudo excluído com sucesso!', [
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

  if (!laudo) {
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
          
          <Text style={styles.headerTitle}>Laudo Médico</Text>
          
          <TouchableOpacity 
            onPress={handleExcluir}
            style={styles.headerButton}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {/* Card do título */}
        <View style={styles.titleCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCircleEmoji}>📋</Text>
          </View>
          
          <Text style={styles.laudoTitulo}>{laudo.titulo}</Text>
          <View style={styles.dataChip}>
            <Text style={styles.dataText}>{laudo.data}</Text>
          </View>
        </View>

        {/* Conteúdo do laudo */}
        <View style={styles.laudoContent}>
          <Text style={styles.pacienteLabel}>Paciente:</Text>
          <Text style={styles.pacienteNome}>Maria Fulana</Text>

          <View style={styles.divider} />

          <Text style={styles.laudoTexto}>
            A paciente apresenta sintomas compatíveis com redução da capacidade funcional cardíaca, incluindo fadiga e dispneia leve durante esforços moderados.
          </Text>

          <Text style={styles.laudoTexto}>
            Exames complementares (ecocardiograma e ressonância magnética cardíaca) indicam remodelamento ventricular compatível com miocardiopatia congênita não dilatada.
          </Text>

          {laudo.observacoes && (
            <>
              <View style={styles.divider} />
              <Text style={styles.observacoesLabel}>Observações:</Text>
              <Text style={styles.observacoesTexto}>{laudo.observacoes}</Text>
            </>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.exportButton} 
            onPress={handleExportar}
            activeOpacity={0.8}
          >
            <Text style={styles.exportButtonIcon}>📄</Text>
            <Text style={styles.exportButtonText}>Exportar em PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleExcluir}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Excluir Laudo</Text>
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
  titleCard: {
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
  laudoTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  dataChip: {
    backgroundColor: '#2A2B2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dataText: {
    color: '#DC143C',
    fontSize: 14,
    fontWeight: '600',
  },
  laudoContent: {
    backgroundColor: '#1A1A1E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  pacienteLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  pacienteNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2B2F',
    marginVertical: 20,
  },
  laudoTexto: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 26,
    marginBottom: 16,
    textAlign: 'justify',
  },
  observacoesLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '600',
  },
  observacoesTexto: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#DC143C',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exportButtonIcon: {
    fontSize: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#2A2B2F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC143C',
    fontSize: 16,
    fontWeight: '600',
  },
});
