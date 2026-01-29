import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Clock, Star, User } from 'lucide-react';
import type { Recipe } from '@/lib/recipe';
import { useEffect, useState } from 'react';
import { getAllRecipes } from '@/lib/recipeService';

export default function RecipesHome() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const data = await getAllRecipes()
                setRecipes(data)
            } catch (err) {
                console.error("Erro ao carregar receitas",err)
            }
        }
        fetchRecipes()
    }, [])

    // const recipes = [
    //     {
    //         id: 1,
    //         title: "Ovo Frito com Bacon",
    //         image: "https://imgs.search.brave.com/fva43QdXkfG1Fx-s68GVJPWGavgH-mPUHKkWMXMuqyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcuZnJlZXBpay5jb20vZm90b3MtcHJlbWl1bS9vdm8tZnJpdG8tY29tLWJhY29uXzE5NzMyNy03LmpwZz9zZW10PWFpc19oeWJyaWQmdz03NDA",
    //         time: "2 min",
    //         difficulty: "Fácil",
    //         rating: 4.8,
    //         author: "Chef Maria",
    //         category: "Café da Manhã"
    //     },
    //     {
    //         id: 2,
    //         title: "Salada Mediterrânea",
    //         image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    //         time: "15 min",
    //         difficulty: "Fácil",
    //         rating: 4.5,
    //         author: "Chef João",
    //         category: "Salada"
    //     },
    //     {
    //         id: 3,
    //         title: "Risoto de Cogumelos",
    //         image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    //         time: "30 min",
    //         difficulty: "Médio",
    //         rating: 4.9,
    //         author: "Chef André",
    //         category: "Prato Principal"
    //     },
    //     {
    //         id: 4,
    //         title: "Brownie de Chocolate",
    //         image: "https://images.unsplash.com/photo-1564355808539-22fda35db7aa?w=400&h=300&fit=crop",
    //         time: "45 min",
    //         difficulty: "Fácil",
    //         rating: 4.7,
    //         author: "Chef Ana",
    //         category: "Sobremesa"
    //     },
    //     {
    //         id: 5,
    //         title: "Smoothie Tropical",
    //         image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    //         time: "5 min",
    //         difficulty: "Fácil",
    //         rating: 4.6,
    //         author: "Chef Pedro",
    //         category: "Bebida"
    //     },
    //     {
    //         id: 6,
    //         title: "Hambúrguer Artesanal",
    //         image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    //         time: "25 min",
    //         difficulty: "Médio",
    //         rating: 4.8,
    //         author: "Chef Carlos",
    //         category: "Lanche"
    //     },
    //     {
    //         id: 7,
    //         title: "Sopa de Abóbora",
    //         image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    //         time: "40 min",
    //         difficulty: "Fácil",
    //         rating: 4.4,
    //         author: "Chef Sofia",
    //         category: "Sopa"
    //     },
    //     {
    //         id: 8,
    //         title: "Tacos Mexicanos",
    //         image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    //         time: "20 min",
    //         difficulty: "Fácil",
    //         rating: 4.9,
    //         author: "Chef Diego",
    //         category: "Internacional"
    //     }
    // ];

    return (
        <section className="container mx-auto px-4 py-8 md:px-8 ">
            <div className="mb-10">
                <h2 className="inter text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
                    Receitas em destaque
                </h2>
                <p className="raleway text-neutral-600 text-sm max-w-2xl">
                    Descubra receitas inspiradoras e deliciosas para todos os momentos.
                </p>
            </div>

            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                speed={800}
                grabCursor={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
                className="recipes-swiper pb-12"
            >
                {recipes.map((recipe) => (
                    <SwiperSlide key={recipe.id}>
                        <div className="group relative h-100 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white">
                            {/* Imagem da receita */}
                            <div className="absolute inset-0">
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-black/20" />
                            </div>

                            {/* Badge de categoria */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inter text-xs font-semibold text-neutral-900">
                                    {recipe.category}
                                </span>
                            </div>

                            {/* Badge de tempo */}
                            <div className="absolute top-4 right-4 bg-amber-500/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                <Clock className="w-4 h-4 text-white" />
                                <span className="inter text-sm font-bold text-white">{recipe.prepTime} Min</span>
                            </div>

                            {/* Conteúdo inferior */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">

                                <h3 className="inter text-xl font-bold text-white mb-3 group-hover:text-amber-100 transition-colors duration-300">
                                    {recipe.title}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(recipe.averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-400/30 text-gray-400/30'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="inter text-sm font-medium text-white/90">
                                        {recipe.averageRating.toFixed(1)}
                                    </span>
                                </div>

                                {/* Autor */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/20">
                                    <User className="w-4 h-4 text-white/70" />
                                    <span className="raleway text-sm text-white/90">{recipe.author.name}</span>
                                </div>
                            </div>

                            {/* Overlay de hover */}
                            <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Botão de ação */}
                            <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <button className="bg-white text-amber-700 hover:bg-amber-50 px-4 py-2 rounded-full inter text-sm font-semibold shadow-lg transition-colors">
                                    Ver Receita
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Estilos para o Swiper */}
            <style>{`
               .recipes-swiper {
                    padding: 10px 5px 40px;
                }
                
                .recipes-swiper .swiper-button-next,
                .recipes-swiper .swiper-button-prev {
                    background: white;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    color: #333;
                }
                
                .recipes-swiper .swiper-button-next:after,
                .recipes-swiper .swiper-button-prev:after {
                    font-size: 18px;
                    font-weight: bold;
                }
                
                .recipes-swiper .swiper-pagination-bullet {
                    background: #d1d5db;
                    opacity: 1;
                }
                
                .recipes-swiper .swiper-pagination-bullet-active {
                    background: #f59e0b;
                }
                
                .recipes-swiper .swiper-slide {
                    height: auto;
                }
            `}</style>
        </section>
    );
}