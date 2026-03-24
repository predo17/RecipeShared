
import { RecipesSkeleton } from "@/components/skeleton/RecipesSkeleton"
import { RecipeCard } from "@/components/RecipeCard"
import { useRelatedRecipes } from "@/hooks/useRecipes"

interface Props {
    category: string
    excludeId?: string
}
 
export default function RelatedRecipes({ category, excludeId  }: Props) {
    const { recipes, loading } = useRelatedRecipes(category, excludeId, 4)

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