import { RecipesSkeleton } from "@/components/skeleton/RecipesSkeleton"
import { RecipeCard } from "@/components/RecipeCard"
import { useFavoriteRecipes } from "@/hooks/useRecipes"

export default function Favorites() {

  const { recipes, loading, removeFromFavorites } = useFavoriteRecipes()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-2xl">

          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-stone-300"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Minhas Receitas
            </span>
          </div>

          <h1 className="inter text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-[1.05] text-stone-900 tracking-tight">
            Favoritos
          </h1>

          <p className="raleway text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            Todas as receitas que você marcou como favoritas.
          </p>

          <div className="h-px w-20 bg-stone-300"></div>

        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipesSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="raleway text-base text-stone-600">
            Você ainda não adicionou nenhuma receita aos favoritos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onButtonFavorite
              onUnfavorite={removeFromFavorites} />
          ))}
        </div>
      )}
    </div>
  )
}

