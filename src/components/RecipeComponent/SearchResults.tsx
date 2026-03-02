import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"
import { RecipesSkeleton } from "@/components/skeleton/RecipesSkeleton"
import { RecipeCard } from "@/components/RecipeCard"

export default function SearchResults() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        const data = await getAllRecipes()
        setRecipes(data)
      } catch (err) {
        console.error("Erro ao carregar receitas", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

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

  const rawSearch = searchParams.get("search") || ""
  const rawCategory = searchParams.get("category") || ""

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-stone-300"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Resultados da Busca
            </span>
          </div>

          <h1 className="inter text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-[1.05] text-stone-900 tracking-tight">
            {rawSearch
              ? `Resultados para "${rawSearch}"`
              : rawCategory
                ? `Categoria: ${rawCategory}`
                : "Todas as receitas"}
          </h1>

          <p className="raleway text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            Explore receitas filtradas por nome, categoria ou ingredientes.
          </p>

          <div className="h-px w-20 bg-stone-300"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 16 }).map((_, i) => <RecipesSkeleton key={i} />)
        ) : filteredRecipes.length === 0 ? (
          <>
            <p className="inter col-span-full text-center text-sm text-stone-600 m-40">
              Nenhuma receita encontrada
            </p>

            <p className="col-span-full text-sm text-stone-600 mb-6">
              Receitas que você pode gostar:
            </p>

            {recipes.slice(0, 8).map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onButtonFavorite
              />
            ))}
          </>
        ) : (
          filteredRecipes.map((r) => <RecipeCard key={r.id} recipe={r} onButtonFavorite />)
        )}
      </div>
    </div>
  )
}

