import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes, getRecipesByCategory, getUserFavoriteRecipes } from "@/lib/recipeService"
import { useAuth } from "@/contexts/AuthContext"

export function useAllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRecipes() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllRecipes()
        if (!cancelled) {
          setRecipes(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err)
        }
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

  return { recipes, loading, error }
}

export function useSearchRecipes() {
  const { recipes, loading, error } = useAllRecipes()
  const [searchParams] = useSearchParams()

  const filteredRecipes = useMemo(() => {
    const search = (searchParams.get("search") || "").toLowerCase().trim()
    const category = (searchParams.get("category") || "").trim()

    return recipes.filter((recipe) => {
      if (category && recipe.category !== category) {
        return false
      }

      if (!search) return true

      const haystack = [
        recipe.title,
        recipe.description,
        recipe.category,
        ...recipe.ingredients.map((i) => i.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(search)
    })
  }, [recipes, searchParams])

  return { recipes: filteredRecipes, loading, error, allRecipes: recipes }
}

export function useRelatedRecipes(category: string, excludeId?: string, limit = 4) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!category) return
    let cancelled = false

    async function fetchRelated() {
      try {
        setLoading(true)
        setError(null)
        const data = await getRecipesByCategory(category, excludeId, limit)
        if (!cancelled) {
          setRecipes(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRelated()

    return () => {
      cancelled = true
    }
  }, [category, excludeId, limit])

  return { recipes, loading, error }
}

export function useFavoriteRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }

    const userId = user.id
    let cancelled = false

    async function fetchFavorites() {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserFavoriteRecipes(userId)
        if (!cancelled) {
          setRecipes(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()

    return () => {
      cancelled = true
    }
  }, [user])

  function removeFromFavorites(recipeId: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId))
  }

  return { recipes, loading, error, removeFromFavorites }
}

