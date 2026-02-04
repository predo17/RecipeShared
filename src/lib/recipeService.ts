
import { supabase } from "./Supabase"
import type { Recipe, Ingredient, Step } from "./recipe"

// Tipo simplificado para criação de receita (sem campos gerados automaticamente)
export interface CreateRecipeData {
  title: string
  description: string
  imageUrl: string
  prepTime: number
  cookTime: number
  servings: number
  category: string
  ingredients: Omit<Ingredient, "id">[]
  steps: Omit<Step, "id">[]
  authorId: string
}

export interface UpdateRecipeData {
  title: string
  description: string
  imageUrl: string
  prepTime: number
  cookTime: number
  servings: number
  category: string
  ingredients: Omit<Ingredient, "id">[]
  steps: Omit<Step, "id">[]
}

export interface RecipeComment {
  id: string
  userId: string
  avatar: string | null
  userName: string
  userBio: string | null
  comment: string
  createdAt: string
}

// Buscar todas as receitas
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(`
        *,
        author:users(id, name, email, avatar, bio),
        ratings:recipe_ratings(
          id,
          user_id,
          user:users(name),
          rating,
          comment,
          created_at
        ),
        ingredients:ingredients(*),
        steps:steps(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Transformar os dados para o formato esperado
    return (data || []).map(transformRecipe)
  } catch (error) {
    console.error("Erro ao buscar receitas:", error)
    throw error
  }
}

// Buscar receita por ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select(`
        *,
        author:users(id, name, email, avatar, bio),
        ratings:recipe_ratings(
          id,
          user_id,
          user:users(name),
          rating,
          comment,
          created_at
        ),
        ingredients:ingredients(*),
        steps:steps(*)
      `)
      .eq("id", id)
      .maybeSingle() // evita erro quando não existe

    if (error) throw error
    if (!data) return null

    return transformRecipe(data)
  } catch (error) {
    console.error("Erro ao buscar receita:", error)
    throw error
  }
}
// Buscar receitas por categoria
export async function getRecipesByCategory(category: string, excludeId?: string, limit = 4): Promise<Recipe[]> {
  try {
    let query = supabase
      .from("recipes")
      .select(`
        *,
        author:users(id, name, email, avatar, bio),
        ratings:recipe_ratings(
          id,
          user_id,
          user:users(name),
          rating,
          comment,
          created_at
        ),
        ingredients:ingredients(*),
        steps:steps(*)
      `)
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (excludeId) {
      query = (query as any).neq("id", excludeId)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map(transformRecipe)
  } catch (error) {
    console.error("Erro ao buscar receitas por categoria:", error)
    throw error
  }
}

// Buscar comentários de uma receita (com dados do usuário: avatar, nome, bio)
export async function getRecipeComments(recipeId: string): Promise<RecipeComment[]> {
  const { data, error } = await supabase
    .from("recipe_ratings")
    .select(`
      id,
      user_id,
      rating,
      comment,
      created_at,
      user:users(id, name, avatar, bio)
    `)
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    avatar: row.user?.avatar ?? null,
    userName: row.user?.name ?? "Anônimo",
    userBio: row.user?.bio ?? null,
    comment: row.comment ?? "",
    createdAt: row.created_at,
  }))
}

// Criar comentário em uma receita
export async function createRecipeComment(
  recipeId: string,
  userId: string,
  comment: string
): Promise<RecipeComment> {
  const { data, error } = await supabase
    .from("recipe_ratings")
    .insert({
      recipe_id: recipeId,
      user_id: userId,
      comment: comment.trim(),
    })
    .select(`
      id,
      user_id,
      rating,
      comment,
      created_at,
      user:users(id, name, avatar, bio)
    `)
    .single()

  if (error) throw error
  const row = data as any

  return {
    id: row.id,
    userId: row.user_id,
    avatar: row.user?.avatar ?? null,
    userName: row.user?.name ?? "Anônimo",
    userBio: row.user?.bio ?? null,
    comment: row.comment ?? "",
    createdAt: row.created_at,
  }
}

// Criar nova receita
export async function createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
  try {
    // Criar a receita principal
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert({
        title: recipeData.title,
        description: recipeData.description,
        image_url: recipeData.imageUrl,
        prep_time: recipeData.prepTime,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        category: recipeData.category,
        author_id: recipeData.authorId,
      })
      .select() // retorna os campos da receita
      .single()

    if (recipeError) throw recipeError
    if (!recipe) throw new Error("Receita não foi criada")

    const recipeId = recipe.id

    // Criar ingredientes (se houver)
    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const ingredientsPayload = recipeData.ingredients.map((ing) => ({
        recipe_id: recipeId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      }))

      const { error: ingredientsError } = await supabase
        .from("ingredients")
        .insert(ingredientsPayload)

      if (ingredientsError) {
        // opcional: tentar limpar a receita criada ou informar erro
        throw ingredientsError
      }
    }

    // Criar passos (se houver)
    if (recipeData.steps && recipeData.steps.length > 0) {
      const stepsPayload = recipeData.steps.map((step) => ({
        recipe_id: recipeId,
        // o schema usa a coluna "order"
        order: step.order,
        instruction: step.instruction,
        time_minutes: step.timeMinutes ?? null,
      }))

      const { error: stepsError } = await supabase
        .from("steps")
        .insert(stepsPayload)

      if (stepsError) {
        // opcional: tentar limpar a receita/ingredientes ou informar erro
        throw stepsError
      }
    }

    // Recarregar a receita completa com relacionamentos
    const fullRecipe = await getRecipeById(recipeId)
    if (!fullRecipe) throw new Error("Erro ao buscar receita criada")

    return fullRecipe
  } catch (error) {
    console.error("Erro ao criar receita:", error)
    throw error
  }
}

// Atualizar receita existente (substitui ingredientes e passos)
export async function updateRecipe(
  recipeId: string,
  recipeData: UpdateRecipeData
): Promise<Recipe> {
  try {
    const { error: recipeError } = await supabase
      .from("recipes")
      .update({
        title: recipeData.title,
        description: recipeData.description,
        image_url: recipeData.imageUrl,
        prep_time: recipeData.prepTime,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        category: recipeData.category,
      })
      .eq("id", recipeId)

    if (recipeError) throw recipeError

    // Substituir ingredientes
    const { error: deleteIngredientsError } = await supabase
      .from("ingredients")
      .delete()
      .eq("recipe_id", recipeId)

    if (deleteIngredientsError) throw deleteIngredientsError

    if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      const ingredientsPayload = recipeData.ingredients.map((ing) => ({
        recipe_id: recipeId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      }))

      const { error: insertIngredientsError } = await supabase
        .from("ingredients")
        .insert(ingredientsPayload)

      if (insertIngredientsError) throw insertIngredientsError
    }

    // Substituir passos
    const { error: deleteStepsError } = await supabase
      .from("steps")
      .delete()
      .eq("recipe_id", recipeId)

    if (deleteStepsError) throw deleteStepsError

    if (recipeData.steps && recipeData.steps.length > 0) {
      const stepsPayload = recipeData.steps.map((step) => ({
        recipe_id: recipeId,
        order: step.order,
        instruction: step.instruction,
        time_minutes: step.timeMinutes ?? null,
      }))

      const { error: insertStepsError } = await supabase
        .from("steps")
        .insert(stepsPayload)

      if (insertStepsError) throw insertStepsError
    }

    const fullRecipe = await getRecipeById(recipeId)
    if (!fullRecipe) throw new Error("Erro ao buscar receita atualizada")

    return fullRecipe
  } catch (error) {
    console.error("Erro ao atualizar receita:", error)
    throw error
  }
}

const RECIPE_IMAGES_BUCKET = "recipe-images"

/** Faz upload de uma imagem para o Supabase Storage e retorna a URL pública. */
export async function uploadRecipeImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${userId}/${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(path, file, { upsert: false })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from(RECIPE_IMAGES_BUCKET).getPublicUrl(data.path)
  return publicUrl
}

// Função auxiliar para transformar dados do Supabase para o formato Recipe
function transformRecipe(data: any): Recipe {
  // Calcular média de avaliações
  const ratings = (data.ratings || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user?.name,
    rating: r.rating,
    comment: r.comment || "",
    createdAt: r.created_at,
  }))

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
      : 0

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    imageUrl: data.image_url || "",
    prepTime: data.prep_time,
    cookTime: data.cook_time,
    servings: data.servings,
    category: data.category,
    ingredients: (data.ingredients || []).map((ing: any) => ({
      id: ing.id,
      name: ing.name,
      quantity: parseFloat(ing.quantity),
      unit: ing.unit,
    })),
    steps: (data.steps || [])
      .map((step: any) => ({
        id: step.id,
        order: step.order,
        instruction: step.instruction,
        timeMinutes: step.time_minutes ?? undefined,
      }))
      .sort((a: Step, b: Step) => a.order - b.order),
    authorId: data.author_id || data.author?.id || "",
    author: data.author
      ? {
        id: data.author.id,
        name: data.author.name,
        email: data.author.email,
        avatar: data.author.avatar,
        bio: data.author.bio,
      }
      : {
        id: "",
        name: "Desconhecido",
        email: "",
      },
    ratings,
    averageRating: Math.round(averageRating * 10) / 10,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
