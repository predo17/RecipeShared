
export default function Hero() {
    return (
        <section className="w-full min-h-screen bg-linear-to-brrom-orange-50 via-amber-50 to-rose-100 overflow-hidden relative">
            {/* Efeitos de background animados */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-orange-200 to-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-rose-200 to-pink-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
                {/* Partículas flutuantes */}
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-1 h-1 bg-orange-300 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`
                        }}
                    />
                ))}
            </div>

            {/* Container principal com perspectiva 3D */}
            <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 lg:p-12 perspective-1000">
                
                {/* Conteúdo principal com animação de entrada */}
                <div className="relative z-10 w-full lg:w-2/5 transform-gpu transition-all duration-700 hover:scale-105">
                    <div className="space-y-6">
                        <h1 className="text-5xl lg:text-6xl font-black leading-tight bg-linear-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                            Descubra e compartilhe 
                            <span className="block text-4xl lg:text-5xl mt-2">receitas incríveis</span>
                        </h1>
                        
                        <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                            Junte-se a uma comunidade apaixonada por gastronomia. 
                            <span className="block mt-2">Explore milhares de receitas, compartilhe suas criações 
                            e aprenda com outros cozinheiros.</span>
                        </p>
                        
                        {/* Input de busca interativa */}
                        <div className="relative max-w-md mt-8 group">
                            <input 
                                type="text" 
                                placeholder="Pesquisar receitas, ingredientes..."
                                className="w-full p-4 pl-12 pr-24 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none shadow-lg shadow-orange-100 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-orange-200"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                                Buscar
                            </button>
                        </div>
                        
                        {/* Tags interativas */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {['Para Iniciantes', 'Saudável', 'Rápido', 'Sobremesa', 'Vegetariano'].map((tag, i) => (
                                <span 
                                    key={tag}
                                    className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-orange-100 hover:bg-white hover:border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card 3D interativo com múltiplas imagens */}
                <div className="relative w-full lg:w-3/5 h-100 lg:h-150 transform-gpu transition-transform duration-700 hover:scale-105">
                    {/* Card principal com efeito 3D */}
                    <div className="relative w-full h-full group cursor-pointer">
                        {/* Efeito de brilho */}
                        <div className="absolute inset-0 bg-linear-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        
                        {/* Container do card */}
                        <div className="relative h-full bg-linear-to-br from-white to-orange-50 rounded-3xl overflow-hidden shadow-2xl shadow-orange-200/50 border-2 border-white/50 backdrop-blur-sm">
                            {/* Grid de imagens em camadas 3D */}
                            <div className="relative h-full p-8">
                                {/* Imagem principal flutuante */}
                                <div className="absolute -right-8 -top-8 w-3/4 h-3/4 transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
                                    <div className="relative w-full h-full">
                                        <img 
                                            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800"
                                            alt="Prato gourmet"
                                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent rounded-2xl"></div>
                                    </div>
                                </div>
                                
                                {/* Imagem secundária */}
                                <div className="absolute -left-4 bottom-16 w-1/3 h-1/3 transform -rotate-6 group-hover:-rotate-3 transition-transform duration-500 delay-100">
                                    <img 
                                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400"
                                        alt="Pizza"
                                        className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                                    />
                                </div>
                                
                                {/* Terceira imagem */}
                                <div className="absolute left-12 top-12 w-1/4 h-1/4 transform rotate-3 group-hover:rotate-6 transition-transform duration-500 delay-200">
                                    <img 
                                        src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w-300"
                                        alt="Sobremesa"
                                        className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                                    />
                                </div>
                                
                                {/* Badge interativo */}
                                <div className="absolute right-8 bottom-8 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">+1.2k receitas</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicador scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="animate-bounce w-6 h-10 border-2 border-orange-300 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }
                
                .transform-gpu {
                    transform: translateZ(0);
                }
            `}</style>
        </section>
    )
}