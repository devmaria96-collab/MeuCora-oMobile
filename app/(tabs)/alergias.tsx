import { useAlergias } from '@/contexts/AlergiaContext';
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

export default function AlergiasScreen() {
  const { alergias, excluirAlergia } = useAlergias();

  const handleExcluir = (id: string, nome: string) => {
    Alert.alert(
      'Excluir Alergia',
      `Deseja excluir ${nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirAlergia(id),
        },
      ]
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
            <Text style={styles.headerIcon}>🩸</Text>
            <Text style={styles.title}>Minhas Alergias</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Gerencie suas alergias
        </Text>

        {/* Lista de Alergias */}
        <View style={styles.listContainer}>
          {alergias.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🩸</Text>
              <Text style={styles.emptyText}>Nenhuma alergia cadastrada</Text>
              <Text style={styles.emptySubtext}>
                Registre suas alergias para um melhor controle do tratamento
              </Text>
            </View>
          ) : (
            alergias.map((alergia) => (
              <View key={alergia.id} style={styles.alergiaCard}>
                <View style={styles.alergiaInfo}>
                  <Text style={styles.alergiaNome}>{alergia.nome}</Text>
                  <Text style={styles.alergiaTipo}>{alergia.tipo}</Text>
                </View>
                
                <View style={styles.alergiaActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/alergias-editar?id=${alergia.id}`)}
                  >
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleExcluir(alergia.id, alergia.nome)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Botão Adicionar */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/alergias-adicionar')}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Adicionar Nova Alergia</Text>
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
  listContainer: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  alergiaCard: {
    backgroundColor: '#1A1A1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alergiaInfo: {
    flex: 1,
  },
  alergiaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  alergiaTipo: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  alergiaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2A2B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2A2B2F',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#DC143C',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    boxShadow: '0 4px 10px rgba(220, 20, 60, 0.4)',
    elevation: 8,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
