import { Clock, Star, User } from "lucide-react"
import type { Recipe } from "@/lib/recipe"
import { Link } from "react-router-dom"


type RecipeCardProps = {
    recipe: Recipe
    showDescription?: boolean
}

export function RecipeCard({ recipe, showDescription = false, }: RecipeCardProps) {

    return (
        <>
            <div key={recipe?.id} className="group relative h-100 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 cursor-pointer bg-white">

                {/* Imagem */}
                <div className="absolute inset-0">
                    <img
                        src={recipe?.imageUrl}
                        alt={recipe?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20" />
                </div>

                {/* Categoria */}
                {recipe?.category && (
                    <div className="absolute top-4 left-4">
                        <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inter text-xs font-semibold text-neutral-900">
                            {recipe?.category}
                        </span>
                    </div>
                )}

                {/* Tempo */}
                <div className="absolute top-4 right-4 bg-amber-500/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="inter text-sm font-bold text-white">
                        {recipe?.prepTime} Min
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="absolute bottom-0 left-0 right-0 p-6">

                    <h3 className="inter text-xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors duration-300">
                        {recipe?.title}
                    </h3>

                    {/* ⭐ Rating */}
                    <div className="flex items-center gap-2 mb-4">
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
                        <span className="raleway text-sm text-white/90">
                            {recipe?.author.name}
                        </span>
                    </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Botão*/}
                <div className="absolute bottom-5.5 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Link
                        to={`/recipes/details/${encodeURIComponent(recipe?.title ?? "")}`}
                        className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2.5 rounded-full inter text-sm font-semibold shadow-lg transition-colors">
                        Ver Receita
                    </Link>
                </div>
            </div>
        </>
    )
}
