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

import { useAgenda } from '@/contexts/AgendaContext';

export default function AgendaScreen() {
  const { eventos, deleteEvento } = useAgenda();

  const handleDelete = (id: string, titulo: string) => {
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
            deleteEvento(id);
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
            <Text style={styles.headerIcon}>📅</Text>
            <Text style={styles.title}>Minha Agenda</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Seus compromissos e eventos de saúde
        </Text>

        {/* Lista de eventos */}
        <View style={styles.eventosList}>
          {eventos.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={styles.eventoCard}
              onPress={() => router.push(`/agenda-editar?id=${evento.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.eventoHeader}>
                <View style={styles.calendarioIcon}>
                  <Text style={styles.calendarioEmoji}>📅</Text>
                </View>
                <View style={styles.eventoInfo}>
                  <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
                  {evento.medico && (
                    <Text style={styles.eventoMedico}>Dr(a). {evento.medico}</Text>
                  )}
                  <View style={styles.eventoDetalhes}>
                    <View style={styles.detalheChip}>
                      <Text style={styles.detalheIcon}>📆</Text>
                      <Text style={styles.detalheText}>{evento.data}</Text>
                    </View>
                    <View style={styles.detalheChip}>
                      <Text style={styles.detalheIcon}>🕐</Text>
                      <Text style={styles.detalheText}>{evento.horario}</Text>
                    </View>
                  </View>
                  {evento.local && (
                    <View style={styles.localContainer}>
                      <Text style={styles.localIcon}>📍</Text>
                      <Text style={styles.localText}>{evento.local}</Text>
                    </View>
                  )}
                  {evento.observacoes && (
                    <Text style={styles.eventoObservacoes}>
                      {evento.observacoes}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(evento.id, evento.titulo);
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
          onPress={() => router.push('/agenda-adicionar')}
        >
          <Text style={styles.addButtonText}>+ Adicionar Evento</Text>
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
  eventosList: {
    gap: 16,
  },
  eventoCard: {
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
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  calendarioIcon: {
    backgroundColor: '#DC143C',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calendarioEmoji: {
    fontSize: 24,
  },
  eventoInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventoMedico: {
    fontSize: 15,
    color: '#DC143C',
    fontWeight: '600',
    marginBottom: 8,
  },
  eventoDetalhes: {
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
  localContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  localIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  localText: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  eventoObservacoes: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
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
