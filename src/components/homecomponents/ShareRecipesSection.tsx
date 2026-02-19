import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export default function ShareRecipesSection() {
  return (
    <section className="relative container mx-auto py-16 lg:py-24 px-4 md:px-8">
      {/* Container principal com bordas decorativas */}
      <div className="relative border-2 border-stone-200 shadow-xl overflow-hidden rounded-xs">
        {/* Ornamento superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-stone-400 to-transparent z-20"></div>

        {/* Container da imagem */}
        <div className="relative h-96 md:h-125 lg:h-150 overflow-hidden">
          {/* Imagem com tratamento editorial */}
          <div className="absolute inset-0">
            <img
              src="/share-recipe.avif"
              alt="Compartilhe sua receita favorita"
              className="w-full h-full object-cover filter contrast-110 saturate-105"
            />
          </div>

          {/* Overlay gradiente refinado */}
          <div className="absolute inset-0 bg-linear-to-t from-stone-900/95 via-stone-900/50 to-transparent" />

          {/* Conteúdo refinado */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="w-full flex items-center justify-center mx-auto">
              <div className="max-w-2xl space-y-8 text-center">
                {/* Título editorial */}
                <h2 className="inter text-4xl md:text-5xl lg:text-6xl  leading-[1.1] text-white tracking-tight">
                  Compartilhe suas {" "}
                  <span className="relative inline-block italic">
                    criações
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-rrom-amber-400/60 to-transparent"></div>
                  </span>
                  {" "} com a comunidade
                </h2>

                {/* Descrição */}
                <p className="raleway text-sm md:text-base lg:text-lg text-white/90 leading-[1.8] font-medium ">
                  Mostre ao mundo aquele prato especial que todo mundo elogia.
                  Crie, compartilhe e inspire outras pessoas na cozinha.
                </p>

                <div className="flex justify-center" >
                  <div className="h-px w-20 bg-white/40"></div>
                </div>

                {/* Botão refinado */}
                <div className="pt-2">
                  <Link
                    to="/create-recipe"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-stone-900 font-semibold rounded-sm shadow-xl hover:shadow-2xl hover:bg-stone-50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <ChefHat className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm uppercase tracking-wider">Criar Receita</span>
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