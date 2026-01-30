import { useEffect, useState } from "react"
import PreviewRecipe from "./PreviewRecipe"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"


interface props {
    title: string | undefined
}

export default function Preview({ title }: props) {

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

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
        return <p>Carregando...</p>
    }

    const recipe = recipes.find(
        (r) => r.title === decodeURIComponent(title ?? "")
    )

    if (!recipe) {
        return <p>Receita não encontrada</p>
    }

    return (
        <>
            <PreviewRecipe recipe={recipe} />
        </>
    )
}
