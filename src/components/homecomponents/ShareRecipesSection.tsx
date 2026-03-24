import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function ShareRecipesSection() {
  return (
    <section className="relative container mx-auto py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Container principal com bordas decorativas */}
      <div className="border-2 border-stone-200 shadow-xl overflow-hidden rounded-sm">
        {/* Container da imagem - ajustado para proporções mais equilibradas */}
        <div className="relative h-100 sm:h-112.5 md:h-125 lg:h-137.5 xl:h-150 overflow-hidden">
          {/* Imagem com tratamento editorial */}
          <div className="absolute inset-0">
            <img
              src="/share-recipe.avif"
              alt="Compartilhe sua receita favorita"
              className="w-full h-full object-cover filter contrast-110 saturate-105"
            />
          </div>

          {/* Overlay gradiente refinado */}
          <div className="absolute inset-0 bg-linear-to-t from-stone-900/95 via-stone-900/60 to-stone-900/20" />

          {/* Conteúdo refinado */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="w-full flex items-center justify-center mx-auto px-4 sm:px-6">
              <div className="max-w-3xl space-y-6 md:space-y-8 text-center">
                {/* Título editorial */}
                <h2 className="inter text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-white tracking-tight">
                  Compartilhe suas {" "}
                  <span className="italic font-medium">
                    criações
                  </span>
                  {" "} com a comunidade
                </h2>

                {/* Descrição */}
                <p className="raleway text-sm sm:text-base text-white/90 leading-relaxed md:leading-relaxed max-w-2xl mx-auto px-4 sm:px-6">
                  Mostre ao mundo aquele prato especial que todo mundo elogia.
                  Crie, compartilhe e inspire outras pessoas na cozinha.
                </p>

                {/* Linha decorativa */}
                <div className="flex justify-center py-2">
                  <div className="h-px w-16 sm:w-20 bg-white/40"></div>
                </div>

                {/* Botão refinado  */}
                <div className="pt-4 sm:pt-6">
                  <Link
                    to="/create-recipe"
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-stone-900 font-semibold rounded-sm shadow-lg hover:shadow-xl hover:bg-stone-50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                  >
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs sm:text-sm uppercase tracking-wider">Criar Receita</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}