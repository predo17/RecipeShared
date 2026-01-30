import type { Recipe } from "@/lib/recipe"

interface Props {
    recipe: Recipe
}

export default function PreviewRecipe({ recipe }: Props) {

    return (
        <section className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* Imagem */}
                <div className="col-span-2 w-full h-160 relative overflow-hidden group rounded-sm">
                    {/* Bordas decorativas duplas */}
                    <div className="absolute inset-0 border border-stone-300/50 rounded-sm"></div>

                    {/* Container da imagem */}
                    <div className="absolute inset-2 overflow-hidden">
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-contain filter contrast-105 saturate-105 transition-all duration-700 group-hover:contrast-110 group-hover:saturate-110"
                        />
                    </div>
                </div>

                {/* Informações */}
                <div className="space-y-8 pt-2">
                    {/* Header com ícone */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                            <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-lg shadow-sm">
                                <img src="/freehand.png" alt="Freehand" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <div className="h-px flex-1 bg-stone-200"></div>
                                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">
                                    {recipe.category}
                                </span>
                            </div>
                        </div>

                        <h1 className="inter text-4xl font-serif leading-tight text-stone-900 tracking-tight">
                            {recipe.title}
                        </h1>

                        <p className="realeway text-stone-600 leading-[1.75] text-[15px] font-light border-l-2 border-stone-300 pl-4">
                            {recipe.description}
                        </p>
                    </div>

                    {/* Métricas refinadas */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4">
                            <p className="inter text-xs font-bold uppercase tracking-[0.12em]  mb-2">
                                Preparo
                            </p>
                            <p className="text-2xl tabular-nums tracking-tight">
                                {recipe.prepTime}
                            </p>
                            <p className="realeway text-xs mt-0.5">minutos</p>
                        </div>

                        <div className="p-4">
                            <p className="inter text-xs font-bold uppercase tracking-[0.12em] mb-2">
                                Cozimento
                            </p>
                            <p className="text-2xl tabular-nums tracking-tight">
                                {recipe.cookTime}
                            </p>
                            <p className="realeway text-xs mt-0.5">minutos</p>
                        </div>

                        <div className="p-4">
                            <p className="inter text-xs font-bold uppercase tracking-[0.12em] mb-2">
                                Avaliação
                            </p>
                            <p className="text-2xl tabular-nums tracking-tight">
                                {recipe.averageRating.toFixed(1)}
                            </p>
                            <p className="text-xs mt-0.5">de 5.0</p>
                        </div>
                    </div>

                    {/* Ingredientes premium */}
                    <div className="bg-linear-to-b from-stone-50/40 to-transparent border border-stone-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-200">
                            <div className="w-9 h-9 flex items-center justify-center bg-white border border-stone-200 rounded-lg shadow-sm">
                                <img src="/ingredientes.png" alt="ingredients" className="w-5 h-5 object-contain" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-stone-900">
                                Ingredientes
                            </h2>
                            <div className="flex-1 h-px bg-linear-to-r from-stone-300 to-transparent"></div>
                            <span className="text-sm text-stone-400 font-light tabular-nums">
                                {recipe.ingredients.length} itens
                            </span>
                        </div>

                        <ul className="space-y-0">
                            {recipe.ingredients.map((item, index) => (
                                <li
                                    key={index}
                                    className="group relative py-3 px-3 -mx-3 hover:bg-white/80 transition-all duration-200 border-l-2 border-transparent hover:border-stone-400"
                                    style={{
                                        animation: `fadeInLeft 0.4s ease-out ${index * 0.04}s backwards`
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-[11px] font-mono text-stone-400 tabular-nums w-6 shrink-0 pt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[14px] leading-relaxed text-stone-700 flex-1">
                                            <span className="font-semibold text-stone-900">{item.quantity}</span>
                                            <span className="text-stone-400 mx-1.5">·</span>
                                            <span className="font-light">{item.name}</span>
                                        </span>
                                    </div>

                                    {index < recipe.ingredients.length - 1 && (
                                        <div className="absolute bottom-0 left-12 right-0 h-px bg-linear-to-r from-stone-200/50 via-stone-200/30 to-transparent"></div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ornamento decorativo */}
                    <div className="flex items-center justify-center gap-1.5 pt-2 opacity-15">
                        <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                        <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                        <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                    </div>
                </div>

            </div>
        </section>
    )
}
