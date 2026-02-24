import { BookOpen, ChefHat } from "lucide-react"
import { Link } from "react-router-dom"

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1600&q=80"
                    alt="Mesa com ingredientes e receitas"
                    loading="lazy"
                    className="w-full h-full object-cover rotate-180"
                />

            </div>

            <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-8">
                <div className="flex flex-col justify-center min-h-[calc(100vh-16rem)]">

                    {/* Conteúdo */}
                    <div className="space-y-8">

                        {/* Overline */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-px bg-stone-400"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                                Receitas Artesanais
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h1
                                className="inter text-5xl lg:text-7xl leading-[1.05] text-stone-900 tracking-tight max-w-145"
                            >
                                Sabor que{" "}
                                <span className="italic">
                                    conecta
                                </span>{" "}
                                pessoas
                            </h1>

                            <div className="h-px w-20 bg-stone-400 my-6"></div>

                            <p
                                className="releway text-[17px] lg:text-[19px] text-stone-700 leading-[1.8] max-w-xl"
                            >
                                Descubra receitas autênticas, compartilhe suas criações e faça parte de uma comunidade apaixonada pela arte de cozinhar.
                            </p>
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to="/recipes"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-orange-500 to-orange-400 text-white font-medium rounded-sm shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span className="text-sm uppercase tracking-wider">
                                    Explorar Receitas
                                </span>
                            </Link>

                            <Link
                                to="/create-recipe"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-stone-800 font-medium rounded-sm border-2 border-stone-200  hover:bg-stone-50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <ChefHat className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm uppercase tracking-wider">
                                    Criar Receita
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}
