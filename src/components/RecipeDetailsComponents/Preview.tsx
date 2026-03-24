import PreviewRecipe from "./PreviewRecipe"
import RecipeDetailsSkeleton from "@/components/skeleton/RecipeDetailsSkeleton"
import RelatedRecipes from "./RelatedRecipes"
import CommentsRecipe from "./CommentsRecipe"
import { useAllRecipes } from "@/hooks/useRecipes"

interface props {
    title: string | undefined
}

export default function Preview({ title }: props) {

    const { recipes, loading } = useAllRecipes()


    if (loading) {
        return <RecipeDetailsSkeleton />
    }

    const recipe = recipes.find(
        (r) => r.title === decodeURIComponent(title ?? "")
    )

    if (!recipe) {
        return <p>Receita não encontrada</p>
    }

   

    return (
        <div className="px-4 py-10">
            <PreviewRecipe recipe={recipe} steps={recipe.steps} />
            <RelatedRecipes category={recipe.category} excludeId={recipe.id} />
            <CommentsRecipe recipeId={recipe.id} recipe={recipe} />

        </div>
    )
}
 