import { router } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function EmocionalScreen() {

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
            <Text style={styles.headerIcon}>💗</Text>
            <Text style={styles.title}>Bem-estar Emocional</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Técnicas para acalmar a mente
        </Text>

        {/* Card principal */}
        <View style={styles.mainCard}>
          <Image 
            source={require('../assets/images/ansiedade.gif')}
            style={styles.gifImage}
            resizeMode="contain"
          />
        </View>

        {/* Dica */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Dica:</Text>
          <Text style={styles.tipText}>
            Quando estiver ansioso(a), controle a respiração. Inspirar e expirar no tempo certo acalma e ajuda a aliviar os sintomas.
          </Text>
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
    marginBottom: 24,
    marginLeft: 52,
  },
  mainCard: {
    backgroundColor: '#1A1A1E',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  gifImage: {
    width: 300,
    height: 300,
  },
  tipCard: {
    backgroundColor: '#2A2B2F',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC143C',
  },
  tipIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },
});
