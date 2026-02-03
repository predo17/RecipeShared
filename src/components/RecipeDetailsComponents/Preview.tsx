import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PreviewRecipe from "./PreviewRecipe"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"
import RecipeDetailsSkeleton from "../RecipeDetailsSkeleton"
import RelatedRecipes from "./RelatedRecipes"
import CommentsRecipe from "./CommentsRecipe"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface props {
    title: string | undefined
}

export default function Preview({ title }: props) {

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        async function fetchRecipes() {
            try {
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

    if (loading) {
        return <RecipeDetailsSkeleton />
    }

    const recipe = recipes.find(
        (r) => r.title === decodeURIComponent(title ?? "")
    )

    if (!recipe) {
        return <p>Receita não encontrada</p>
    }

    const canEdit = Boolean(user?.id && recipe.authorId && user?.id === recipe.authorId)

    return (
        <div className="px-4 py-10">
            {canEdit && (
                <div className="container mx-auto mb-4 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/create-recipe", { state: { editRecipe: recipe } })}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar receita
                    </Button>
                </div>
            )}
            <PreviewRecipe recipe={recipe} steps={recipe.steps} />
            <RelatedRecipes category={recipe.category} excludeId={recipe.id} />
            <CommentsRecipe recipeId={recipe.id} />

        </div>
    )
}
 