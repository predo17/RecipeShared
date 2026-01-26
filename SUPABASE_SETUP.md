# 🗄️ Configuração do Supabase - RecipeShared

Este guia explica como configurar o banco de dados Supabase para o projeto RecipeShared.

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase
3. Acesso ao SQL Editor do Supabase

## 🚀 Passo a Passo

### 1. Acessar o SQL Editor

1. Acesse seu projeto no Supabase Dashboard
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**

### 2. Executar o Script SQL

1. Abra o arquivo `supabase_schema.sql` deste projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)

### 3. Verificar se Tudo Foi Criado

Após executar o script, verifique se as seguintes tabelas foram criadas:

- ✅ `users` - Perfis de usuários
- ✅ `recipes` - Receitas
- ✅ `ingredients` - Ingredientes
- ✅ `steps` - Passos das receitas
- ✅ `recipe_ratings` - Avaliações

Você pode verificar isso em: **Table Editor** no menu lateral.

### 4. Configurar Variáveis de Ambiente

No seu projeto, crie um arquivo `.env` na raiz com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

**Onde encontrar essas informações:**
1. No Supabase Dashboard, vá em **Settings** → **API**
2. **Project URL** = `VITE_SUPABASE_URL`
3. **anon public** key = `VITE_SUPABASE_ANON_KEY`

### 5. Desabilitar Confirmação de Email (Opcional - Desenvolvimento)

Para desenvolvimento, você pode desabilitar a confirmação de email:

1. No Supabase Dashboard, vá em **Authentication** → **Settings**
2. Desabilite **Enable email confirmations**
3. Isso permite login imediato após registro

⚠️ **Atenção:** Isso é apenas para desenvolvimento. Em produção, mantenha a confirmação de email habilitada.

## 🔐 O Que Foi Configurado

### Tabelas Criadas

1. **users** - Armazena perfis de usuários
   - Criada automaticamente quando um usuário se registra (via trigger)
   - Campos: id, email, name, avatar, bio

2. **recipes** - Armazena receitas
   - Campos: id, title, description, image_url, prep_time, cook_time, servings, category, author_id

3. **ingredients** - Ingredientes das receitas
   - Campos: id, recipe_id, name, quantity, unit

4. **steps** - Passos de preparo
   - Campos: id, recipe_id, order, instruction, time_minutes

5. **recipe_ratings** - Avaliações das receitas
   - Campos: id, recipe_id, user_id, rating, comment

### Segurança (RLS - Row Level Security)

Todas as tabelas têm políticas de segurança configuradas:

- ✅ **Leitura pública** - Qualquer um pode ver receitas, ingredientes, passos e avaliações
- ✅ **Escrita autenticada** - Apenas usuários logados podem criar conteúdo
- ✅ **Edição própria** - Usuários só podem editar/deletar seu próprio conteúdo

### Triggers Automáticos

1. **handle_new_user** - Cria perfil automaticamente quando usuário se registra
2. **handle_updated_at** - Atualiza `updated_at` automaticamente em todas as tabelas

## 🧪 Testando a Configuração

### 1. Testar Registro de Usuário

1. Execute o projeto: `npm run dev`
2. Acesse `/register`
3. Crie uma conta
4. Verifique no Supabase (Table Editor → users) se o perfil foi criado

### 2. Testar Criação de Receita

1. Faça login
2. Acesse `/create-recipe`
3. Crie uma receita
4. Verifique no Supabase se a receita foi criada com ingredientes e passos

## ❌ Problemas Comuns

### Erro: "relation does not exist"

**Solução:** Execute o script SQL novamente. Certifique-se de copiar TODO o conteúdo.

### Erro: "permission denied"

**Solução:** Verifique se as políticas RLS estão ativas. No SQL Editor, execute:

```sql
SELECT * FROM pg_policies WHERE tablename = 'nome_da_tabela';
```

### Erro: "trigger does not exist"

**Solução:** Execute novamente a parte de triggers do script SQL.

### Usuário não é criado automaticamente

**Solução:** Verifique se o trigger `on_auth_user_created` existe:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Se não existir, execute novamente a seção de triggers do script.

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Triggers](https://supabase.com/docs/guides/database/triggers)

## ✅ Checklist Final

- [ ] Script SQL executado com sucesso
- [ ] Todas as tabelas criadas
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de registro funcionando
- [ ] Teste de criação de receita funcionando
- [ ] RLS habilitado e funcionando

---

**Pronto!** Seu banco de dados está configurado e pronto para uso. 🎉
