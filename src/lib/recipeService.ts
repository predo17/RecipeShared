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