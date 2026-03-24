import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { RecipesSkeleton } from '@/components/skeleton/RecipesSkeleton';
import { RecipeCard } from '@/components/RecipeCard';
import { useAllRecipes } from '@/hooks/useRecipes';

export default function RecipesHome() {
    const { recipes, loading } = useAllRecipes()

    return (
        <section className="container mx-auto px-4 py-8 md:px-8 ">
            <div className="mb-10">
                <div className="max-w-3xl">
                    <h2 className="inter text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight text-stone-900 tracking-tight mb-3">
                        Receitas em Destaque
                    </h2>
                    <p className="raleway text-stone-600 leading-relaxed font-medium">
                         Descubra receitas inspiradoras e deliciosas para todos os momentos.
                    </p>
                </div>

                <div className="h-px w-16 bg-stone-300 mt-6" />
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