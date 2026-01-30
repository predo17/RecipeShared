import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { RecipesSkeleton } from '@/components/RecipesSkeleton';
import { RecipeCard } from '@/components/RecipeCard';
import type { Recipe } from '@/lib/recipe';
import { getAllRecipes } from '@/lib/recipeService';

export default function RecipesHome() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true)
                const data = await getAllRecipes()
                setRecipes(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes()
    }, [])


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
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SwiperSlide key={i}>
                            <RecipesSkeleton />
                        </SwiperSlide>
                    ))
                    : recipes.slice(0, 6).map((recipe) => (
                        <SwiperSlide key={recipe.id}>
                            <RecipeCard recipe={recipe} />
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