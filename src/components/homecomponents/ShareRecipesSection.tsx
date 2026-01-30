import { Link } from "react-router-dom";

export default function ShareRecipesSection() {
     return (
    <section className="relative w-full py-16 px-4 bg-linear-to-br from-neutral-50 via-orange-50/30 to-amber-50/40">
      
      {/* Container da imagem */}
      <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden">
        
        {/* Imagem */}
        <img
          src="/share-recipe.avif"
          alt="Compartilhe sua receita favorita"
          className="w-full h-105 md:h-120 object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20" />

        {/* Conteúdo */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="flex flex-col gap-6 px-6 md:px-12 max-w-xl text-white">
            
            <h2 className="inter text-3xl md:text-4xl font-bold">
              Compartilhe a sua receita favorita
            </h2>

            <p className="raleway text-white/90 text-lg">
              Mostre ao mundo aquele prato especial que todo mundo elogia.
              Crie, compartilhe e inspire outras pessoas na cozinha.
            </p>

            <div>
              <Link
                to="/create-recipe"
                className="inline-flex items-center justify-center px-6 py-3
                           rounded-xl bg-orange-500 hover:bg-orange-600  
                           text-white font-semibold transition"
              >
                Criar receita
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
