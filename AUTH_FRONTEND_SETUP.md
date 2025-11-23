# Configuração Frontend - Autenticação JWT com Backend

## O que foi feito

✅ **Contexto de Autenticação** (`contexts/AuthContext.tsx`)
- Gerencia login, registro e logout
- Armazena token JWT em AsyncStorage
- Fornece métodos para autenticação

✅ **Tela de Login** (`app/login.tsx`)
- Formulário de login com email e senha
- Validação básica de campos
- Integração com o AuthContext

✅ **Atualização da Tela de Cadastro** (`app/(tabs)/cadastro.tsx`)
- Agora faz registro real no backend
- Loading durante requisição
- Tratamento de erros

✅ **Serviço de API** (`services/api.ts`)
- Interceptor que adiciona token JWT automaticamente
- Endpoints de autenticação (login, register, google)
- Endpoints protegidos (agenda, alergias, laudos, remédios)

## Como usar

### 1. Envolver o App com AuthProvider

No seu arquivo principal (ex: `App.tsx` ou `_layout.tsx`), envolva a aplicação com o `AuthProvider`:

```tsx
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Resto do seu app */}
    </AuthProvider>
  );
}
```

### 2. Usar o contexto de autenticação nos componentes

```tsx
import { useAuth } from '../contexts/AuthContext';

export default function MeuComponente() {
  const { user, token, login, register, logout, loading } = useAuth();

  return (
    <View>
      {loading ? (
        <Text>Carregando...</Text>
      ) : user ? (
        <Text>Bem-vindo, {user.name}!</Text>
      ) : (
        <Text>Não autenticado</Text>
      )}
    </View>
  );
}
```

### 3. Fazer requisições protegidas

Todas as requisições feitas através de `apiClient` incluem automaticamente o token JWT:

```tsx
import { agendaAPI } from '../services/api';

const buscarAgenda = async () => {
  try {
    const response = await agendaAPI.getAll(); // Token incluído automaticamente
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

## Fluxo de Autenticação

1. **Login/Registro**
   - Usuário entra com email/senha
   - Backend retorna `access_token` e dados do usuário
   - Token é armazenado em `AsyncStorage`

2. **Requisições Subsequentes**
   - Interceptor automático adiciona `Authorization: Bearer {token}` em todas as requisições
   - Se receber 401 (token expirado), token é removido e usuário deslogado

3. **Logout**
   - Remove token de `AsyncStorage`
   - Limpa estado do usuário
   - Usuário redirecionado para login

## Endpoints Disponíveis

### Públicos (sem token):
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/google` - Login com Google

### Protegidos (precisam de token):
- `GET /agenda` - Listar agenda
- `POST /agenda` - Criar agenda
- `GET /agenda/:id` - Obter agenda por ID
- `PUT /agenda/:id` - Atualizar agenda
- `DELETE /agenda/:id` - Deletar agenda
- E similares para `/alergias`, `/laudos`, `/remedios`

## Variáveis de Ambiente

Se quiser mudar a URL do backend, configure:

```
EXPO_PUBLIC_API_URL=http://seu-dominio.com:3000
```

## Próximos Passos

- [ ] Implementar Google OAuth no frontend
- [ ] Adicionar refresh token
- [ ] Implementar recuperação de senha
- [ ] Adicionar biometria (fingerprint/face ID)
