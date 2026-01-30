import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {

        setTimeout(() => setIsLoaded(true), 100)

    }, [])

    return (
        <section className="relative min-h-screen bg-linear-to-br from-neutral-50 via-orange-50/30 to-amber-50/40 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 py-8 ">
                <div className="flex flex-col md:grid lg:grid-cols-12 gap-6 lg:gap-16 items-center min-h-[calc(100vh-4rem)]">

                    {/* Coluna de conteúdo - Assimétrica */}
                    <div className={`lg:col-span-5 space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                        <div className="space-y-4">
                            <h1 className="inter text-6xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
                                Sabor que
                                <span className="block text-coral-500 italic">conecta</span>
                                pessoas
                            </h1>

                            <p className="raleway text-lg lg:text-xl text-neutral-600 leading-relaxed max-w-lg">
                                Descubra receitas autênticas, compartilhe suas criações e faça parte de uma comunidade apaixonada pela arte de cozinhar.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                to="/recipes"
                                className="px-4 py-2 bg-white text-neutral-700 font-semibold rounded-sm overflow-hidden shadow shadow-coral-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-coral-500/40 hover:-translate-y-0.5"
                            >
                                Explorar Receitas
                            </Link>

                            <Link
                                to="/create-recipe"
                                className="px-4 py-2 bg-white text-neutral-700 font-semibold rounded-sm hover:border-sage-400 transition-all duration-300 shadow hover:shadow-lg hover:shadow-coral-500/40  hover:-translate-y-0.5"
                            >
                                Criar Receita
                            </Link>
                        </div>
                    </div>

                    {/* Coluna visual - Galeria assimétrica com glassmorphism */}
                    <div className={`hidden md:grid lg:col-span-7 relative h-125 lg:h-150 transition-all duration-1200 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>

                        {/* Card principal - Grande e dramático */}
                        <div className="absolute top-0 right-0 w-[70%] h-[65%] group cursor-pointer">
                            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-neutral-900/10 border border-white/50 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02]">
                                <img
                                    src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"
                                    alt="Prato gourmet"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-neutral-900/60 via-neutral-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-coral-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Bolo de cereja
                                </div>

                            </div>
                        </div>

                        {/* Card secundário - Sobreposto à esquerda */}
                        <div className="absolute bottom-0 left-0 w-[45%] h-[45%] group cursor-pointer" style={{ animationDelay: '200ms' }}>
                            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl shadow-neutral-900/10 border-4 border-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 hover:scale-105">
                                <img
                                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
                                    alt="Pizza artesanal"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>

                                {/* Badge flutuante */}
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-coral-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Trending
                                </div>
                            </div>
                        </div>

                        {/* Card terciário - Accent superior */}
                        <div className="absolute top-[15%] left-[15%] w-[35%] h-[35%] group cursor-pointer" style={{ animationDelay: '400ms' }}>
                            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg shadow-neutral-900/10 border-4 border-white transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:-rotate-2 hover:scale-105">
                                <img
                                    src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=500&q=80"
                                    alt="Sobremesa deliciosa"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-br from-mustard-500/20 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-coral-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Cheesecake Premium
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* imagem para mobile */}

                    <div className={`block md:hidden w-full max-w-md mx-auto transition-all duration-1200 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="relative w-full h-65 sm:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-neutral-900/10 border border-white/50">
                            <img
                                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"
                                alt="Prato gourmet"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}