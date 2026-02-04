
import { useEffect, useState } from "react"
import type { Recipe } from "@/lib/recipe"
import { getRecipesByCategory } from "@/lib/recipeService"
import { RecipesSkeleton } from "@/components/RecipesSkeleton"
import { RecipeCard } from "@/components/RecipeCard"

interface Props {
    category: string
    excludeId?: string
}
 
export default function RelatedRecipes({ category, excludeId  }: Props) {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!category) return
        let mounted = true
        async function fetchRelated() {
            try {
                setLoading(true)
                const data = await getRecipesByCategory(category, excludeId, 4)
                if (mounted) setRecipes(data)
            } catch (err) {
                console.error(err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchRelated()
        return () => {
            mounted = false
        }
    }, [category, excludeId])

    return (
        <section className="container mx-auto mt-8">
            <h2 className="inter text-xl font-bold mb-4">Receitas relacionadas</h2>

            {loading || recipes.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}><RecipesSkeleton /></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recipes.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                    ))}
                </div>
            )}
        </section>
    )
}