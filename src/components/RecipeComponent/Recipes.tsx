import { useEffect, useState } from "react";
import { RecipesSkeleton } from "@/components/RecipesSkeleton";
import { RecipeCard } from "@/components/RecipeCard";
import { getAllRecipes } from "@/lib/recipeService";
import type { Recipe } from "@/lib/recipe";

export default function Recipes() {

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        const data = await getAllRecipes()
        setRecipes(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-2xl">

          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-stone-300"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Coleção de Receitas
            </span>
          </div>

          <h1 className="inter text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-[1.05] text-stone-900 tracking-tight">
            Receitas
          </h1>

          <p className="raleway text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            Descubra receitas deliciosas criadas pela nossa comunidade.
          </p>

          <div className="h-px w-20 bg-stone-300"></div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => <RecipesSkeleton key={i} />)
          : recipes.map((r) => <RecipeCard key={r.id} recipe={r} showDescription />)}
      </div>
    </div>
  )
}