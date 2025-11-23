# Análise do Erro HTTP 400 - Bad Request no Registro

## Problema Identificado

Você estava recebendo um erro **400 Bad Request** ao tentar registrar um novo usuário com os dados:
```json
{
  "name": "diego",
  "email": "diego@gmail.com",
  "password": "12345"
}
```

## Causa Raiz

O erro 400 indica que a validação do servidor estava falhando, mas a mensagem de erro **não estava sendo claramente comunicada** entre backend e frontend. Os problemas eram:

1. **Falta de logging detalhado** - Não era possível ver exatamente qual campo estava falhando
2. **Mensagens de erro genéricas** - O frontend mostrava apenas "Bad Request" sem detalhe
3. **ValidationPipe sem exceptionFactory** - Não havia tratamento customizado de erros de validação

## Soluções Implementadas

### 1. **Backend - Melhorado logging em `auth.controller.ts`**
- Adicionado log detalhado dos dados recebidos
- Log dos tipos de dados
- Log de validações (tamanho de strings, email com @, etc)
- Log do sucesso ou erro da operação

### 2. **Backend - Melhorado logging em `auth.service.ts`**
- Adicionado log de cada etapa do registro
- Hash da senha
- Criação do usuário no banco
- Geração do token

### 3. **Backend - Melhorado tratamento de erros em `main.ts`**
```typescript
new ValidationPipe({ 
  whitelist: true, 
  transform: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors) => {
    const messages = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));
    console.error('Validation errors:', messages);
    return new BadRequestException({
      message: 'Validação falhou',
      errors: messages,
    });
  },
})
```

Isso garante que erros de validação sejam retornados com estrutura clara:
```json
{
  "message": "Validação falhou",
  "errors": [
    {
      "field": "password",
      "errors": ["Senha deve ter no mínimo 5 caracteres"]
    }
  ]
}
```

### 4. **Frontend - Melhorado erro handling em `contexts/AuthContext.tsx`**
```typescript
const customError = new Error(errorMessage);
(customError as any).response = error.response;
throw customError;
```

### 5. **Frontend - Melhorado exibição de erros em `app/cadastro.tsx`**
- Parse detalhado da resposta de erro
- Exibição formatada de múltiplos erros
- Quebras de linha para melhor leitura

## Possíveis Causas do Erro 400 Original

1. **Email já cadastrado** - Se "diego@gmail.com" já existia no banco
2. **Senha muito curta** - Mínimo é 5 caracteres (sua teste tinha exatamente 5, ok)
3. **Email inválido** - Validação do formato
4. **Conexão ao MongoDB falhou** - Erro silencioso no banco de dados
5. **Campos faltando** - Name, email ou password não foram enviados

## Próximos Passos para Debug

1. **Reinicie o servidor backend**:
```bash
npm run start:dev
```

2. **Teste novamente o registro** e observe os logs do terminal do backend

3. **Verifique se MongoDB está rodando**:
```bash
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -match "mongod"}
```

4. **Monitore os logs** - Tanto no backend quanto no frontend (console do navegador)

## Dados de Teste Validados

A senha `'12345'` tem **5 caracteres**, o que atende ao `@MinLength(5)` da validação.

O email `'diego@gmail.com'` é válido.

O nome `'diego'` é válido.

## Arquivo de Referência

Consulte `FIXES_APPLIED.md` para histórico de todas as correções aplicadas no projeto.
