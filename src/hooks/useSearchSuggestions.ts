import { useEffect, useState } from "react"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"

export interface SearchSuggestions {
  categories: string[]
  ingredients: string[]
  loading: boolean
}

export function useSearchSuggestions(): SearchSuggestions {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchRecipes() {
      try {
        setLoading(true)
        const data = await getAllRecipes()
        if (!cancelled) {
          setRecipes(data)
        }
      } catch (err) {
        console.error("Erro ao carregar receitas para sugestões de busca", err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRecipes()

    return () => {
      cancelled = true
    }
  }, [])

  const categories = Array.from(
    new Set(recipes.map((r) => r.category).filter(Boolean))
  )

  const ingredients = Array.from(
    new Set(
      recipes
        .flatMap((r) => r.ingredients || [])
        .map((ing) => ing.name)
        .filter(Boolean)
    )
  )

  return {
    categories,
    ingredients,
    loading,
  }
}

