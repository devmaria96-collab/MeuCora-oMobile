import { router } from 'expo-router';
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

export default function LaudosScreen() {
  const { laudos, deleteLaudo } = useLaudos();

  const handleDelete = (id: string, titulo: string) => {
    Alert.alert(
      'Excluir Laudo',
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
            deleteLaudo(id);
          },
        },
      ],
    );
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
            <Text style={styles.headerIcon}>📋</Text>
            <Text style={styles.title}>Meus Laudos</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Seus exames e resultados médicos
        </Text>

        {/* Lista de laudos */}
        <View style={styles.laudosList}>
          {laudos.map((laudo) => (
            <TouchableOpacity
              key={laudo.id}
              style={styles.laudoCard}
              onPress={() => router.push(`/laudos-editar?id=${laudo.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.laudoHeader}>
                <View style={styles.laudoIcon}>
                  <Text style={styles.laudoEmoji}>📋</Text>
                </View>
                <View style={styles.laudoInfo}>
                  <Text style={styles.laudoTitulo}>{laudo.titulo}</Text>
                  <View style={styles.laudoDetalhes}>
                    <View style={styles.detalheChip}>
                      <Text style={styles.detalheIcon}>📆</Text>
                      <Text style={styles.detalheText}>{laudo.data}</Text>
                    </View>
                  </View>
                  {laudo.observacoes && (
                    <Text style={styles.laudoObservacoes}>{laudo.observacoes}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert('Exportar PDF', 'Funcionalidade em desenvolvimento');
                  }}
                  style={styles.exportButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exportIcon}>📄</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(laudo.id, laudo.titulo);
                  }}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão adicionar */}
        <TouchableOpacity 
          style={styles.addButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/laudos-adicionar')}
        >
          <Text style={styles.addButtonText}>+ Adicionar Laudo</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    marginLeft: 52,
  },
  laudosList: {
    gap: 16,
  },
  laudoCard: {
    backgroundColor: '#1A1A1E',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  laudoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  laudoIcon: {
    backgroundColor: '#DC143C',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  laudoEmoji: {
    fontSize: 24,
  },
  laudoInfo: {
    flex: 1,
    marginRight: 12,
  },
  laudoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  laudoDetalhes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  detalheChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2B2F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  detalheIcon: {
    fontSize: 12,
  },
  detalheText: {
    color: '#DC143C',
    fontSize: 13,
    fontWeight: '600',
  },
  laudoObservacoes: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  exportButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2A2B2F',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  exportIcon: {
    fontSize: 22,
  },
  deleteButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2A2B2F',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 22,
  },
  addButton: {
    backgroundColor: '#DC143C',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#DC143C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
