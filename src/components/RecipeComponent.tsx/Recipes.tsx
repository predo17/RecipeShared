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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground mt-2">
            Descubra receitas deliciosas da nossa comunidade
          </p>
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
