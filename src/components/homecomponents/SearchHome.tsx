
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"

export default function SearchHome() {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const data = await getAllRecipes()
                setRecipes(data)
            } catch (err) {
                console.error("Erro ao carregar receitas", err)
            }
        }

        fetchRecipes()
    }, [])

    return (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/60 backdrop-blur-xl border border-orange-100 rounded-3xl p-8 shadow-lg">

                <form className="space-y-4">
                    <div>
                        <h2 className="inter text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
                            O que você quer cozinhar hoje?
                        </h2>
                        <p className="raleway text-neutral-600 text-sm">
                            Encontre receitas por nome, ingrediente ou categoria
                        </p>
                    </div>

                    <div className="relative flex items-center">
                        <Input
                            type="text"
                            placeholder="Ex: lasanha, bolo, pizza..."
                            className="rounded-full pr-14  bg-white/80 focus-visible:ring-orange-400"
                            required
                        />

                        <Button
                            type="submit"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-orange-500 hover:bg-orange-600  shadow-md hover:shadow-lg transition-all"
                        >
                            <Search className="h-4 w-4 text-white" />
                        </Button>
                    </div>

                </form>

                <div className="space-y-4">
                    <h2 className="inter text-2xl font-bold text-neutral-900">
                        Pratos Populares
                    </h2>

                    <ul className="flex flex-wrap gap-3">
                        {recipes.slice(0, 5).map((recipe) => (
                            <li key={recipe.id}>
                                <Link
                                    to={`/recipes/${recipe.category}`}
                                    className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium raleway
                  bg-white/70 backdrop-blur border border-orange-100 text-neutral-700 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    {recipe.category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    )
}