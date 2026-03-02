import { useEffect, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import type { Recipe } from "@/lib/recipe"
import { getAllRecipes } from "@/lib/recipeService"

export default function SearchHome() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

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

    // Extrair categorias únicas
    const uniqueCategories = Array.from(
        new Set(recipes.map(r => r.category).filter(Boolean))
    ).slice(0, 6)

    // Extrair ingredientes únicos (nomes)
    const uniqueIngredients = Array.from(
        new Set(
            recipes
                .flatMap(r => r.ingredients || [])
                .map(ing => ing.name)
                .filter(Boolean)
        )
    ).slice(0, 6)

    return (
        <section className="container mx-auto px-4 md:px-8 py-16">
            {/* Container principal */}
            <div className="relative bg-linear-to-b from-stone-100 to-white overflow-hidden rounded-sm">
                {/* Ornamento superior */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                    {/* Coluna de busca */}
                    <div className="lg:col-span-7 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-stone-200">
                        <form
                            className="space-y-6"
                            onSubmit={(e: FormEvent) => {
                                e.preventDefault()
                                const value = searchTerm.trim()
                                if (!value) return
                                navigate(`/search?search=${encodeURIComponent(value)}`)
                            }}
                        >
                            {/* Header */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white border border-stone-300 rounded-lg flex items-center justify-center shadow-sm">
                                        <Search className="w-5 h-5 text-stone-600" />
                                    </div>
                                    <div className="flex-1 h-px bg-linear-to-r from-stone-300 to-transparent"></div>
                                </div>

                                <h2 className="inter text-2xl sm:text-3xl font-medium leading-tight text-stone-900 tracking-tight">
                                    O que você quer cozinhar hoje?
                                </h2>

                                <p className="raleway text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                                    Encontre receitas por nome, ingrediente ou categoria
                                </p>
                            </div>

                            {/* Campo de busca refinado */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-linear-to-r from-stone-300 to-stone-200 rounded-sm opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>

                                <div className="relative flex items-center bg-white border-2 border-stone-300 focus-within:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md rounded-sm">
                                    <Input
                                        type="text"
                                        placeholder="Ex: lasanha, bolo de chocolate, pizza margherita..."
                                        className="raleway border-0 bg-transparent h-12 sm:h-14 px-2.5 sm:px-5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-stone-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                    <Button
                                        type="submit"
                                        className="sm:h-10 sm:w-12 rounded-sm shadow-none border-l-2 mr-1 group-hover:scale-105 group-focus:scale-105"
                                    >
                                        <Search className="h-4 w-4 text-white" />
                                    </Button>
                                </div>
                            </div>

                            {/* Dicas de busca */}
                            <div className="pt-2">
                                <p className="inter text-[10px] uppercase tracking-[0.15em] text-stone-500/80 font-semibold mb-3">
                                    Sugestões de busca
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        ...uniqueCategories.slice(0, 2),
                                        ...uniqueIngredients.slice(0, 2),
                                    ]
                                    .map((tag, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="text-xs px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-100 hover:border-stone-400 transition-all duration-200 font-medium rounded-sm"
                                            style={{
                                                animation: `fadeIn 0.4s ease-out ${index * 0.1}s backwards`
                                            }}
                                            onClick={() => {
                                                setSearchTerm(tag)
                                                navigate(`/search?search=${encodeURIComponent(tag)}`)
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Coluna de categorias populares */}
                    <div className="lg:col-span-5 p-8 lg:p-12">
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white border border-stone-300 rounded-lg flex items-center justify-center shadow-sm">
                                        <TrendingUp className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1 h-px bg-linear-to-r from-stone-300 to-transparent"></div>
                                </div>

                                <h3 className="inter text-xl sm:text-2xl text-stone-900 leading-tight tracking-tight font-medium mb-2">
                                    Categorias Populares
                                </h3>

                                <p className="raleway text-xs text-stone-600 leading-relaxed font-medium">
                                    Explore as categorias mais buscadas
                                </p>
                            </div>

                            {/* Lista de categorias */}
                            <ul className="flex flex-wrap gap-2">
                                {uniqueCategories.length > 0 ? (
                                    uniqueCategories.map((category, index) => (
                                        <li key={index}>
                                            <Link
                                                to={`/search?category=${encodeURIComponent(category)}`}
                                                className="group flex p-3 bg-white border border-stone-200 hover:border-orange-400 hover:shadow-md focus:shadow-md transition-all duration-300 rounded-sm"
                                            >
                                                <span className="inter text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors">
                                                    {category}
                                                </span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center py-8">
                                        <p className="text-sm text-stone-400">Carregando categorias...</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>

            </div>

        </section>
    )
}