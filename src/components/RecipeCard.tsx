import { useState } from "react"
import { Clock, Star, User, Heart, Tag } from "lucide-react"
import type { Recipe } from "@/lib/recipe"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { addRecipeFavorite, removeRecipeFavorite } from "@/lib/recipeService"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"


type RecipeCardProps = {
    recipe: Recipe
    showDescription?: boolean
    onUnfavorite?: (recipeId: string) => void
}

export function RecipeCard({ recipe, showDescription = false, onUnfavorite }: RecipeCardProps) {

    const { user } = useAuth()
    const [isFavorite, setIsFavorite] = useState<boolean>(Boolean(recipe.isFavorite))

    const handleToggleFavorite = async (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!user) {
            toast.error("Faça login para favoritar receitas.")
            return
        }
        
        try {
            if (isFavorite) {
                await removeRecipeFavorite(recipe.id, user.id)
                setIsFavorite(false)
                toast.success("Receita removida dos favoritos.")
                onUnfavorite?.(recipe.id)
            } else {
                await addRecipeFavorite(recipe.id, user.id)
                setIsFavorite(true)
                toast.success("Receita adicionada aos favoritos.")
            }
        } catch (error) {
            console.error("Erro ao atualizar favorito:", error)
            toast.error("Não foi possível atualizar seus favoritos.")
        }
    }

    return (
        <>
            <div key={recipe?.id} className="group relative h-100 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-500">

                {/* Imagem */}
                <div className="absolute inset-0">
                    <img
                        src={recipe?.imageUrl}
                        alt={recipe?.title}
                        className="w-full h-full object-cover group-hover:scale-110 group-focus-within:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20" />
                </div>

                {/* Favorito */}
                <div className="absolute top-4 left-4 z-10">
                    <Button
                        type="button"
                        onClick={handleToggleFavorite}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <Heart
                            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
                        />
                    </Button>
                </div>

                {/* Tempo */}
                <div className="absolute top-4 right-4 bg-amber-500/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="inter text-sm font-bold text-white">
                        {recipe?.prepTime} Min
                    </span>
                </div>
                {/* Conteúdo */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 space-y-1">

                    <h3 className="inter text-xl font-bold text-white group-hover:text-amber-100 transition-colors duration-300">
                        {recipe?.title}
                    </h3>

                    <div className="inline-flex items-center gap-2">
                        <Tag className="w-4 h-4 text-white/70" />
                        <span className="inter text-xs sm:text-sm font-semibold text-white/95 block">
                            {recipe.category}
                        </span>
                    </div>

                    {/* ⭐ Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(recipe?.averageRating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-gray-400/30 text-gray-400/30"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="inter text-sm font-medium text-white/90">
                            {recipe?.averageRating.toFixed(1)}
                        </span>
                    </div>

                    {/* 📝 Descrição (opcional) */}
                    {showDescription && recipe?.description && (
                        <p className="raleway text-sm text-white/85 line-clamp-2 mb-4">
                            {recipe?.description}
                        </p>
                    )}

                    {/* Autor */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                        <User className="w-4 h-4 text-white/70" />
                        <span className="raleway text-sm text-white/90 line-clamp-1  max-w-35">
                            {recipe?.author.name}
                        </span>
                    </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />

                {/* Botão */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 opacity-100 xl:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 xl:translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-500">
                    <Link
                        to={`/recipes/details/${encodeURIComponent(recipe?.title)}`}
                        aria-label={`Ver detalhes da receita: ${recipe?.title}`}
                        className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2.5 rounded-sm inter text-sm font-semibold shadow-lg transition-colors">
                        Ver Receita
                    </Link>
                </div>
            </div>
        </>
    )
}
