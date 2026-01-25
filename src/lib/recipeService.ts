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
        )
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
        )
      `)
      .eq("id", id)
      .single()

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
    // Primeiro, criar a receita principal
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
      .select()
      .single()

    if (recipeError) throw recipeError
    if (!recipe) throw new Error("Receita não foi criada")

    // Criar ingredientes
    if (recipeData.ingredients.length > 0) {
      const { error: ingredientsError } = await supabase
        .from("ingredients")
        .insert(
          recipeData.ingredients.map((ing) => ({
            recipe_id: recipe.id,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }))
        )

      if (ingredientsError) throw ingredientsError
    }

    // Criar passos
    if (recipeData.steps.length > 0) {
      const { error: stepsError } = await supabase
        .from("steps")
        .insert(
          recipeData.steps.map((step) => ({
            recipe_id: recipe.id,
            order: step.order,
            instruction: step.instruction,
            time_minutes: step.timeMinutes,
          }))
        )

      if (stepsError) throw stepsError
    }

    // Buscar a receita completa criada
    const fullRecipe = await getRecipeById(recipe.id)
    if (!fullRecipe) throw new Error("Erro ao buscar receita criada")

    return fullRecipe
  } catch (error) {
    console.error("Erro ao criar receita:", error)
    throw error
  }
}

// Função auxiliar para transformar dados do Supabase para o formato Recipe
function transformRecipe(data: unknown): Recipe {
  // Calcular média de avaliações
  const ratings = (data.ratings || []).map((r: unknown) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user?.name || "Anônimo",
    rating: r.rating,
    comment: r.comment || "",
    createdAt: r.created_at,
  }))

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, r: unknown) => sum + r.rating, 0) / ratings.length
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
      quantity: ing.quantity,
      unit: ing.unit,
    })),
    steps: (data.steps || [])
      .map((step: unknown) => ({
        id: step.id,
        order: step.order,
        instruction: step.instruction,
        timeMinutes: step.time_minutes,
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
