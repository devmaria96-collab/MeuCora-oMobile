import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();
  
  const cards = [
    { id: 1, title: "Agenda", icon: "📅", route: "/agenda" },
    { id: 2, title: "Laudos", icon: "📋", route: "/laudos" },
    { id: 3, title: "Emocional", icon: "💗", route: "/emocional" },
    { id: 4, title: "Remédios", icon: "💊", route: "/remedios" },
    { id: 5, title: "Alergias", icon: "🩸", route: "/alergias" },
    { id: 6, title: "Meus Dados", icon: "👤", route: "/dados" },
  ];

  const handleCardPress = (card: any) => {
    if (card.route) {
      router.push(card.route);
    } else {
      alert(`${card.title} - Em breve!`);
    }
  };

  // Pega o primeiro nome do usuário
  const primeiroNome = user?.name?.split(' ')[0] || "Usuário";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Olá, {primeiroNome}</Text>

        <View style={styles.grid}>
          {cards.map((card) => (
            <Pressable
              key={card.id}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
              onPress={() => handleCardPress(card)}
            >
              <Text style={styles.icon}>{card.icon}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              {!card.route && <Text style={styles.badge}>Em breve</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    padding: 20,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  badge: {
    marginTop: 8,
    backgroundColor: "#DC143C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
