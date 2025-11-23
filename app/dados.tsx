import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function DadosScreen() {
  const { user } = useAuth();
  
  console.log('👤 DadosScreen - Usuário:', user);
  console.log('👤 DadosScreen - Nome:', user?.name);
  console.log('👤 DadosScreen - Email:', user?.email);
  
  // Debug AsyncStorage
  const checkAsyncStorage = async () => {
    const token = await AsyncStorage.getItem('jwt_token');
    const userData = await AsyncStorage.getItem('user_data');
    console.log('🔍 DEBUG AsyncStorage - Token:', token ? 'Existe' : 'Não existe');
    console.log('🔍 DEBUG AsyncStorage - User Data:', userData);
  };
  
  checkAsyncStorage();
  
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>👤</Text>
            <Text style={styles.title}>Meus Dados</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Minhas informações pessoais
        </Text>

        {/* Avatar e Nome */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👵🏽</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Cards de Informações */}
        <View style={styles.infoCards}>
          {/* Tipo Sanguíneo */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🩸</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tipo Sanguíneo</Text>
              <Text style={styles.infoValue}>O+</Text>
            </View>
          </View>

          {/* Doença Cardíaca */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>🫀</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Doença Cardíaca</Text>
              <Text style={styles.infoValue}>Hipertensão Arterial Pulmonar</Text>
            </View>
          </View>
        </View>

        {/* Informação adicional */}
        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>ℹ️</Text>
          <Text style={styles.noteText}>
            Mantenha suas informações sempre atualizadas para um melhor acompanhamento médico.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// TESTE TESTANDO.

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0F0F10",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 32,
    color: "#DC143C",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    marginBottom: 32,
    marginLeft: 52,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DC143C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#DC143C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  userAge: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  infoCards: {
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#1A1A1E",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2B2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  noteCard: {
    backgroundColor: "#2A2B2F",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    borderLeftWidth: 4,
    borderLeftColor: "#DC143C",
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
});
