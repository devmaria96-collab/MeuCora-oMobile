// Arquivo: app/(tabs)/index.tsx
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  
  function handleStart() {
    // navega para a tela de cadastro
    router.push("/cadastro");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>Meu Coração</Text>

        {/* Saudação com nome do usuário */}
        {user && (
          <Text style={styles.greeting}>Olá, {user.name.split(' ')[0]}!</Text>
        )}

        {/* Subtítulo / texto de apoio */}
        <Text style={styles.subtitle}>
          Bem-vindo(a) ao Meu Coração.{"\n"}
          Aqui, você aprende a ouvir e{"\n"}
          cuidar do seu coração com{"\n"}
          calma e segurança.
        </Text>

        {/* Emoji de coração anatômico */}
        <Text style={styles.heartEmoji}>🫀</Text>

        {/* Botão */}
        <Pressable onPress={handleStart} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}>
          <Text style={styles.buttonText}>Começar agora</Text>
        </Pressable>

        {/* Rodapé */}
        <Text style={styles.footer}>
          Criado para quem quer entender{"\n"}
          o próprio coração — com{"\n"}
          tecnologia
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000000" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: "center" },
  title: { color: "white", fontSize: 32, fontWeight: "800", marginTop: 8, marginBottom: 16 },
  greeting: { color: "#DC143C", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  subtitle: { color: "white", opacity: 0.9, fontSize: 16, textAlign: "center", lineHeight: 22 },
  heartEmoji: { fontSize: 120, marginVertical: 24 },
  button: { backgroundColor: "#FF6464", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16, alignSelf: "stretch", marginTop: 4 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700", textAlign: "center", letterSpacing: 0.2 },
  footer: { color: "white", opacity: 0.8, textAlign: "center", fontSize: 14, marginTop: 16, lineHeight: 20 },
});
