-- ============================================
-- RecipeShared - Schema do Banco de Dados
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================
-- ============================================
-- 1. EXTENSÕES
-- ============================================
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABELA: users (Perfis de Usuários)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Comentários
COMMENT ON TABLE public.users IS 'Perfis de usuários da plataforma';
COMMENT ON COLUMN public.users.id IS 'ID do usuário (mesmo do auth.users)';
COMMENT ON COLUMN public.users.email IS 'Email do usuário';
COMMENT ON COLUMN public.users.name IS 'Nome do usuário';
COMMENT ON COLUMN public.users.avatar IS 'URL do avatar do usuário';
COMMENT ON COLUMN public.users.bio IS 'Biografia do usuário';

-- ============================================
-- 3. TABELA: recipes (Receitas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    prep_time INTEGER NOT NULL CHECK (prep_time >= 0),
    cook_time INTEGER NOT NULL CHECK (cook_time >= 0),
    servings INTEGER NOT NULL CHECK (servings > 0),
    category TEXT NOT NULL DEFAULT 'Geral',
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_recipes_author_id ON public.recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON public.recipes(created_at DESC);

-- Comentários
COMMENT ON TABLE public.recipes IS 'Receitas da plataforma';
COMMENT ON COLUMN public.recipes.prep_time IS 'Tempo de preparo em minutos';
COMMENT ON COLUMN public.recipes.cook_time IS 'Tempo de cozimento em minutos';
COMMENT ON COLUMN public.recipes.servings IS 'Número de porções';

-- ============================================
-- 4. TABELA: ingredients (Ingredientes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    unit TEXT NOT NULL DEFAULT 'unidade',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON public.ingredients(recipe_id);

-- Comentários
COMMENT ON TABLE public.ingredients IS 'Ingredientes das receitas';
COMMENT ON COLUMN public.ingredients.unit IS 'Unidade de medida (g, ml, xícara, colher, etc)';

-- ============================================
-- 5. TABELA: steps (Passos das Receitas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL CHECK ("order" > 0),
    instruction TEXT NOT NULL,
    time_minutes INTEGER CHECK (time_minutes >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(recipe_id, "order")
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON public.steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_steps_order ON public.steps(recipe_id, "order");

-- Comentários
COMMENT ON TABLE public.steps IS 'Passos de preparo das receitas';
COMMENT ON COLUMN public.steps."order" IS 'Ordem do passo na receita';

-- ============================================
-- 6. TABELA: recipe_ratings (Avaliações)
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipe_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(recipe_id, user_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON public.recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_user_id ON public.recipe_ratings(user_id);

-- Comentários
COMMENT ON TABLE public.recipe_ratings IS 'Avaliações das receitas';
COMMENT ON COLUMN public.recipe_ratings.rating IS 'Avaliação de 1 a 5 estrelas';

-- ============================================
-- 7. TRIGGERS: Atualizar updated_at automaticamente
-- ============================================
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_recipe_ratings_updated_at
    BEFORE UPDATE ON public.recipe_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 8. TRIGGER: Criar perfil automaticamente ao registrar usuário
-- ============================================
-- Função para criar perfil quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    -- Tentar obter o nome dos metadados do usuário
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'Usuário'
    );
    
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        user_name
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS: users
-- ============================================
-- Qualquer um pode ver perfis públicos
CREATE POLICY "Usuários podem ver perfis públicos"
    ON public.users
    FOR SELECT
    USING (true);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Usuários podem inserir apenas seu próprio perfil (via trigger)
CREATE POLICY "Usuários podem inserir próprio perfil"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS: recipes
-- ============================================
-- Qualquer um pode ver receitas
CREATE POLICY "Qualquer um pode ver receitas"
    ON public.recipes
    FOR SELECT
    USING (true);

-- Apenas usuários autenticados podem criar receitas
CREATE POLICY "Usuários autenticados podem criar receitas"
    ON public.recipes
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Usuários podem atualizar apenas suas próprias receitas
CREATE POLICY "Usuários podem atualizar próprias receitas"
    ON public.recipes
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Usuários podem deletar apenas suas próprias receitas
CREATE POLICY "Usuários podem deletar próprias receitas"
    ON public.recipes
    FOR DELETE
    USING (auth.uid() = author_id);

-- ============================================
-- POLÍTICAS: ingredients
-- ============================================
-- Qualquer um pode ver ingredientes
CREATE POLICY "Qualquer um pode ver ingredientes"
    ON public.ingredients
    FOR SELECT
    USING (true);

-- Apenas o autor da receita pode gerenciar ingredientes
CREATE POLICY "Autores podem gerenciar ingredientes"
    ON public.ingredients
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.author_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE recipes.id = ingredients.recipe_id
            AND recipes.author_id = auth.uid()
        )
    );

-- ============================================
-- POLÍTICAS: steps
-- ============================================
-- Qualquer um pode ver passos
CREATE POLICY "Qualquer um pode ver passos"
    ON public.steps
    FOR SELECT
    USING (true);

-- Apenas o autor da receita pode gerenciar passos
CREATE POLICY "Autores podem gerenciar passos"
    ON public.steps
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE recipes.id = steps.recipe_id
            AND recipes.author_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE recipes.id = steps.recipe_id
            AND recipes.author_id = auth.uid()
        )
    );

-- ============================================
-- POLÍTICAS: recipe_ratings
-- ============================================
-- Qualquer um pode ver avaliações
CREATE POLICY "Qualquer um pode ver avaliações"
    ON public.recipe_ratings
    FOR SELECT
    USING (true);

-- Apenas usuários autenticados podem criar avaliações
CREATE POLICY "Usuários autenticados podem criar avaliações"
    ON public.recipe_ratings
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Usuários podem atualizar apenas suas próprias avaliações
CREATE POLICY "Usuários podem atualizar próprias avaliações"
    ON public.recipe_ratings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar apenas suas próprias avaliações
CREATE POLICY "Usuários podem deletar próprias avaliações"
    ON public.recipe_ratings
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 11. FUNÇÕES ÚTEIS
-- ============================================
-- Função para buscar receitas com todos os dados relacionados
CREATE OR REPLACE FUNCTION public.get_recipe_full(recipe_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'recipe', row_to_json(r.*),
        'author', row_to_json(u.*),
        'ingredients', (
            SELECT json_agg(row_to_json(i.*))
            FROM public.ingredients i
            WHERE i.recipe_id = r.id
        ),
        'steps', (
            SELECT json_agg(row_to_json(s.*) ORDER BY s."order")
            FROM public.steps s
            WHERE s.recipe_id = r.id
        ),
        'ratings', (
            SELECT json_agg(
                json_build_object(
                    'id', rr.id,
                    'user_id', rr.user_id,
                    'user_name', u2.name,
                    'rating', rr.rating,
                    'comment', rr.comment,
                    'created_at', rr.created_at
                )
            )
            FROM public.recipe_ratings rr
            JOIN public.users u2 ON rr.user_id = u2.id
            WHERE rr.recipe_id = r.id
        )
    ) INTO result
    FROM public.recipes r
    JOIN public.users u ON r.author_id = u.id
    WHERE r.id = recipe_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;