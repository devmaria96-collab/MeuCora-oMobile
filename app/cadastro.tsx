// app/cadastro.tsx
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState<string | undefined>(undefined);
  const [doenca, setDoenca] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  async function onContinuar() {
    console.log('🔵 Botão Continuar pressionado!');
    
    // Validação de campos
    if (!nome.trim()) {
      Alert.alert("Campo Obrigatório", "Por favor, preencha o nome completo");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Campo Obrigatório", "Por favor, preencha o e-mail");
      return;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email Inválido", "Por favor, insira um e-mail válido");
      return;
    }
    
    if (!senha.trim()) {
      Alert.alert("Campo Obrigatório", "Por favor, preencha a senha");
      return;
    }
    
    if (senha.length < 6) {
      Alert.alert("Senha Fraca", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    console.log('✅ Validações passaram, iniciando registro...');
    setLoading(true);
    try {
      console.log('Cadastro iniciado com:', { name: nome, email, password: senha });
      await register({ name: nome, email, password: senha });
      
      console.log('✅ Cadastro realizado com sucesso!');
      // Sucesso - o AuthContext já atualizou o token e user
      // O RootLayoutNav irá automaticamente mostrar as tabs
      // Não precisa de Alert ou navegação manual
    } catch (error: any) {
      console.error('❌ Erro completo capturado:', error);
      
      let errorMessage = "Erro ao registrar";
      let errorTitle = "Erro no Cadastro";
      
      // Erro de conexão
      if ((error as any).isNetworkError || error?.code === 'ERR_NETWORK') {
        errorTitle = "Servidor Indisponível";
        errorMessage = "Não foi possível conectar ao servidor. Por favor, verifique:\n\n1. Se o backend está rodando\n2. Sua conexão com a internet\n3. Se o servidor está na porta 3000";
      }
      // Verificar diferentes formatos de resposta do backend
      else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Se o email já existe
        if (errorMessage.toLowerCase().includes('já cadastrado') || 
            errorMessage.toLowerCase().includes('already exists') ||
            errorMessage.toLowerCase().includes('duplicate')) {
          errorTitle = "Email já Cadastrado";
          errorMessage = "Este email já está em uso. Por favor:\n\n• Use outro email\n• Ou faça login se já tem uma conta";
        }
      } 
      else if (error?.response?.data?.errors) {
        // Erros de validação
        const validationErrors = error.response.data.errors;
        errorMessage = validationErrors.map((e: any) => e.errors.join(', ')).join('\n');
      } 
      else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
      console.log('🔵 Loading finalizado');
    }
  }

  function onGoogle() {
    alert("Login com Google (será implementado em breve)");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cadastro</Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#9CA3AF" value={nome} onChangeText={setNome} />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@email.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Tipo sanguíneo</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={tipoSanguineo}
                  onValueChange={(v) => setTipoSanguineo(v)}
                  dropdownIconColor="#9CA3AF"
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione" value={undefined} color="#000000" />
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                    <Picker.Item key={t} label={t} value={t} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ width: 12 }} />

            <View style={styles.col}>
              <Text style={styles.label}>Doença cardíaca (opcional)</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={doenca}
                  onValueChange={(v) => setDoenca(v)}
                  dropdownIconColor="#000000"
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione" value={undefined} color="#000000" />
                  {[
                    "Hipertensão",
                    "Arritmia",
                    "Insuficiência",
                    "Cardiopatia Congênita",
                    "Coronariana",
                    "Insuficiência Cardiaca",
                    "Cardiomiopatia",
                  ].map((d) => (
                    <Picker.Item key={d} label={d} value={d} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <Pressable 
            onPress={onContinuar} 
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryBtn, 
              (pressed || loading) && { opacity: 0.7 }
            ]}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Continuar</Text>
            )}
          </Pressable>

          <Pressable onPress={onGoogle} style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.9 }]}>
            <AntDesign name="google" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.googleText}>Continuar com o Google</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Seus dados são protegidos e usados{"\n"}apenas para cuidar da sua saúde.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F0F10" },
  content: { padding: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 24, alignSelf: "center" },
  label: { color: "#D1D5DB", marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: "#16171A",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2A2B2F",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  row: { flexDirection: "row", marginTop: 8 },
  col: { flex: 1 },
  pickerBox: {
    backgroundColor: "#16171A",
    borderWidth: 1,
    borderColor: "#2A2B2F",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    height: 44,
    backgroundColor: "#16171A",
    ...(Platform.OS === "web"
      ? {
          borderWidth: 0,
          outlineWidth: 0,
          outlineColor: "transparent",
          borderRadius: 0,
        }
      : {}),
  },
  primaryBtn: {
    backgroundColor: "#FF4D5A",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    overflow: "hidden",
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  googleBtn: {
    backgroundColor: "#202125",
    borderRadius: 12,
    height: 48,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2A2B2F",
  },
  googleText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  disclaimer: { color: "#9CA3AF", textAlign: "center", marginTop: 18, lineHeight: 20 },
});
