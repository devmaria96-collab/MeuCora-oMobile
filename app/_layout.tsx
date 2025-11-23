// app/_layout.tsx
import { AgendaProvider } from '@/contexts/AgendaContext';
import { AlergiaProvider } from '@/contexts/AlergiaContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LaudoProvider } from '@/contexts/LaudoContext';
import { RemedioProvider } from '@/contexts/RemedioContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {token ? (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="agenda" options={{ headerShown: false }} />
              <Stack.Screen name="agenda-adicionar" options={{ headerShown: false }} />
              <Stack.Screen name="agenda-editar" options={{ headerShown: false }} />
              <Stack.Screen name="laudos" options={{ headerShown: false }} />
              <Stack.Screen name="laudos-adicionar" options={{ headerShown: false }} />
              <Stack.Screen name="laudos-editar" options={{ headerShown: false }} />
              <Stack.Screen name="emocional" options={{ headerShown: false }} />
              <Stack.Screen name="remedios" options={{ headerShown: false }} />
              <Stack.Screen name="remedios-adicionar" options={{ headerShown: false }} />
              <Stack.Screen name="remedios-editar" options={{ headerShown: false }} />
              <Stack.Screen name="alergias" options={{ headerShown: false }} />
              <Stack.Screen name="alergias-adicionar" options={{ headerShown: false }} />
              <Stack.Screen name="alergias-editar" options={{ headerShown: false }} />
              <Stack.Screen name="dados" options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="cadastro" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
      </ThemeProvider>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AgendaProvider>
        <LaudoProvider>
          <RemedioProvider>
            <AlergiaProvider>
              <RootLayoutNav />
            </AlergiaProvider>
          </RemedioProvider>
        </LaudoProvider>
      </AgendaProvider>
    </AuthProvider>
  );
}
