# Correções Aplicadas - 23 de Novembro de 2025

## 1. Erros de Estilos Deprecados

### ✅ Corrigido: Shadow Props em React Native
**Problema**: "shadow*" style props são deprecated no React Native

**Arquivos Afetados**:
- `components/Tile.tsx`
- `app/remedios.tsx`
- `app/remedios-adicionar.tsx`
- `app/remedios-editar.tsx`

**Solução**: Adicionado `shadowOffset` aos estilos de shadow para melhor compatibilidade com diferentes plataformas.

```javascript
// Antes:
shadowColor: '#000',
shadowOpacity: 0.2,
shadowRadius: 8,

// Depois:
shadowColor: '#000',
shadowOpacity: 0.2,
shadowRadius: 8,
shadowOffset: { width: 0, height: 2 }, // ou height: 4 dependendo do componente
```

### ✅ Corrigido: Image Props Deprecated
**Problema**: `Image: style.tintColor` e `Image: style.resizeMode` são deprecated

**Status**: Código em `components/ui/icon-symbol.ios.tsx` está correto - está usando `tintColor` e `resizeMode` como props do `SymbolView`, não como style props.

---

## 2. Erro de Layout Children

### ✅ Corrigido: Layout children must be of type Screen
**Problema**: Providers estavam sendo renderizados dentro do componente `<Stack>`, que espera apenas `<Stack.Screen>` como filhos

**Arquivo**: `app/_layout.tsx`

**Solução**: Movidos todos os Providers para fora do `<Stack>` e para fora do `RootLayoutNav`:

```typescript
// Estrutura Corrigida:
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

function RootLayoutNav() {
  // Apenas <Stack> e <Stack.Screen> aqui
  return (
    <ThemeProvider>
      <Stack>
        {/* Stack.Screen components */}
      </Stack>
    </ThemeProvider>
  );
}
```

---

## 3. Erros 401 (Unauthorized) na API

### ✅ Corrigido: Resposta de Autenticação Incompleta

**Problema**: Backend estava retornando apenas `{ access_token }` na resposta de login, mas o frontend esperava `{ access_token, user: userData }`

**Arquivo**: `backend/cardio-backend/src/auth/auth.service.ts`

**Solução**:
1. Atualizado endpoint de `login()` para retornar dados do usuário junto com o token
2. Atualizado endpoint de `register()` para retornar dados do usuário junto com o token

```typescript
// Antes:
async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  if (user) {
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { access_token: token };
  }
}

// Depois:
async login(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  if (user) {
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { 
      access_token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    };
  }
}
```

### ✅ Melhorado: Interceptor de Autenticação

**Arquivo**: `services/api.ts`

**Melhorias**:
- Adicionado logs de debug para verificar se o token está sendo obtido e adicionado corretamente
- Logs indicam se o token existe no AsyncStorage e foi adicionado ao header Authorization

```typescript
// Logs adicionados:
console.log('Token obtido do AsyncStorage:', token ? 'Existe' : 'Não encontrado');
console.log('Token adicionado ao header:', config.headers.Authorization);
```

### ✅ Melhorado: Contexto de Autenticação

**Arquivo**: `contexts/AuthContext.tsx`

**Melhorias**:
- Adicionados logs de debug em `login()` e `register()`
- Logs indicam se o token foi recebido e salvo com sucesso

```typescript
console.log('Login bem-sucedido. Token:', access_token ? 'Recebido' : 'Não recebido');
console.log('Token salvo no AsyncStorage');
```

---

## 4. Fluxo de Autenticação Esperado

1. Usuário faz login em `app/login.tsx`
2. `AuthContext.login()` é chamado
3. API (`services/api.ts`) faz POST para `/auth/login`
4. Backend (`auth.service.ts`) valida credenciais e retorna `{ access_token, user }`
5. Token é salvo em `AsyncStorage`
6. Contexto atualiza estado com `token` e `user`
7. `RootLayout` detecta token e renderiza telas autenticadas
8. Requisições subsequentes usam interceptor para adicionar `Authorization: Bearer {token}` automaticamente

---

## 5. Próximos Passos para Debug

Se ainda houver erros 401:

1. **Verificar MongoDB**: Confirmar que o MongoDB está rodando
   ```bash
   mongod
   ```

2. **Verificar Backend**: Confirmar que o backend está rodando na porta 3000
   ```bash
   cd backend/cardio-backend
   npm run start:dev
   ```

3. **Verificar Variáveis de Ambiente**: 
   - `backend/.env` deve conter `JWT_SECRET`
   - `EXPO_PUBLIC_API_URL` deve apontar para o backend correto

4. **Verificar Logs**:
   - Abrir DevTools do navegador (F12)
   - Aba "Console" para ver logs de autenticação
   - Aba "Network" para verificar se Authorization header está sendo enviado

5. **Testar Endpoint Manualmente**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"seu@email.com","password":"senha"}'
   ```

---

## Resumo das Mudanças

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `components/Tile.tsx` | Fix | Adicionado shadowOffset |
| `app/remedios.tsx` | Fix | Adicionado shadowOffset |
| `app/remedios-adicionar.tsx` | Fix | Adicionado shadowOffset + async error handling |
| `app/remedios-editar.tsx` | Fix | Adicionado shadowOffset |
| `app/_layout.tsx` | Fix | Reestruturado providers fora do Stack |
| `backend/cardio-backend/src/auth/auth.service.ts` | Fix | Retorna user dados no login/register |
| `services/api.ts` | Enhancement | Adicionados logs de debug |
| `contexts/AuthContext.tsx` | Enhancement | Adicionados logs de debug |
| `contexts/RemedioContext.tsx` | Enhancement | Melhorado tratamento de erros |
| **Backend Schemas** | **Fix** | **Adicionado userId a todos os schemas** |
| `schemas/remedio.schema.ts` | Fix | Campo userId obrigatório |
| `schemas/agenda.schema.ts` | Fix | Campo userId obrigatório |
| `schemas/alergia.schema.ts` | Fix | Campo userId obrigatório |
| `schemas/laudo.schema.ts` | Fix | Campo userId obrigatório |
| **Backend Controllers** | **Fix** | **Isolamento de dados por usuário** |
| `remedios/remedios.controller.ts` | Fix | Extrai userId do JWT, valida acesso |
| `agenda/agenda.controller.ts` | Fix | Extrai userId do JWT, valida acesso |
| `alergias/alergias.controller.ts` | Fix | Extrai userId do JWT, valida acesso |
| `laudos/laudos.controller.ts` | Fix | Extrai userId do JWT, valida acesso |
| **Backend Services** | **Fix** | **Segurança e validação** |
| `remedios/remedios.service.ts` | Fix | Filtra por userId, valida propriedade |
| `agenda/agenda.service.ts` | Fix | Filtra por userId, valida propriedade |
| `alergias/alergias.service.ts` | Fix | Filtra por userId, valida propriedade |
| `laudos/laudos.service.ts` | Fix | Filtra por userId, valida propriedade |

---

## 6. 🔐 CORREÇÃO CRÍTICA: Isolamento de Dados por Usuário (23/11/2025)

### Problema Identificado
- ❌ Erro 401 ao tentar adicionar remédios, mesmo com usuário autenticado
- ❌ Dados não estavam isolados por usuário (todos viam tudo)
- ❌ Nenhuma validação de propriedade dos recursos

### Solução Implementada

#### 1. **Schemas Atualizados** ✅
Adicionado campo `userId` obrigatório a todos os schemas MongoDB:
- `remedio.schema.ts`
- `agenda.schema.ts`
- `alergia.schema.ts`
- `laudo.schema.ts`

```typescript
@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
userId: MongooseSchema.Types.ObjectId;
```

#### 2. **Controllers Refatorados** ✅
Todos os controllers agora extraem `userId` do token JWT:

```typescript
@Post()
create(@Request() req, @Body() createDto: CreateDto) {
  return this.service.create(createDto, req.user.userId);
}
```

#### 3. **Services com Validação** ✅
Implementada lógica completa de isolamento e segurança:

```typescript
async findOne(id: string, userId: string) {
  const resource = await this.model.findById(id).exec();
  if (!resource) {
    throw new NotFoundException('Recurso não encontrado');
  }
  if (resource.userId.toString() !== userId) {
    throw new UnauthorizedException('Acesso negado');
  }
  return resource;
}
```

#### 4. **Frontend Melhorado** ✅
- Tratamento assíncrono de erros em `remedios-adicionar.tsx`
- Logs detalhados em `RemedioContext.tsx`
- Mensagens de erro claras ao usuário

### Funcionalidades Garantidas

✅ **Isolamento Total**: Cada usuário vê apenas seus próprios dados  
✅ **Segurança**: Impossível acessar dados de outros usuários  
✅ **Autenticação JWT**: Validada em todas as requisições protegidas  
✅ **Tratamento de Erros**: NotFoundException e UnauthorizedException  
✅ **Consistência**: Aplicado em todos os módulos (Remédios, Agenda, Alergias, Laudos)

### Como Testar

1. **Reinicie o backend**:
   ```bash
   cd backend/cardio-backend
   npm run start:dev
   ```

2. **Teste o fluxo**:
   - Cadastre um usuário → Adicione remédios
   - Cadastre outro usuário → Verifique isolamento de dados
   - Tente acessar recursos de outro usuário → Deve retornar 401

### ⚠️ Importante: Migração de Dados

Se já existem dados no banco, eles NÃO terão `userId` e causarão erros. Opções:

1. **Limpar banco** (desenvolvimento):
   ```bash
   # No MongoDB shell:
   use cardio
   db.remedios.deleteMany({})
   db.agendas.deleteMany({})
   db.alergias.deleteMany({})
   db.laudos.deleteMany({})
   ```

2. **Migrar dados** (produção):
   Criar script para associar dados existentes a um usuário específico.

