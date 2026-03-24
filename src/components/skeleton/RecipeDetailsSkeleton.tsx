import { Skeleton } from "@/components/ui/skeleton";
import { RecipesSkeleton } from "./RecipesSkeleton";

export default function RecipeDetailsSkeleton() {
  return (
    <section className="container mx-auto mt-10">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:auto-rows-auto">

        {/* Imagem */}
        <div className="lg:col-span-2 lg:row-start-1">
          <Skeleton className="w-full h-80 sm:h-105 md:h-125 lg:h-160 rounded-sm" />
        </div>

        {/* Informações */}
        <div className="lg:col-start-3 lg:row-start-1 lg:row-span-3">
          <div className="space-y-8">

            {/* Categoria */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Título */}
              <Skeleton className="h-10 w-full" />

              {/* Descrição */}
              <div className="space-y-2 border-l-2 border-stone-300 pl-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>

            {/* Ingredientes */}
            <div className="border border-stone-200 rounded-lg p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </div>

              <ul className="space-y-4 max-h-81.25 overflow-hidden">
                {Array.from({ length: 8 }).map((_, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="h-4 flex-1" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Ornamento */}
            <div className="flex items-center justify-center gap-1.5 pt-2 opacity-20">
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="w-1 h-1 rounded-full" />
            </div>

          </div>
        </div>

        {/* Steps */}
        <div className="lg:col-span-2 lg:row-start-2 space-y-4">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Related */}
      <div className="mt-10 space-y-4">
        <Skeleton className="h-8 w-45" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}><RecipesSkeleton /></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-10 mt-10">
        <div className="w-full">
          {/* Header Section Skeleton */}
          <div className="flex items-center gap-3 mb-8 pb-4">
            <Skeleton className="w-11 h-11 rounded-lg" />
            <Skeleton className="h-7 w-48" />
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-14 gap-8">
            {/* LEFT SIDE - Comments List Skeleton */}
            <div className="lg:col-span-9 space-y-4">
              <div className="bg-linear-to-brom-stone-50/40 to-transparent border border-stone-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Skeleton className="w-1 h-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div className="space-y-8 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                  {/* Gerando 5 skeletons de comentários */}
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-4">
                      {/* Header do comentário com avatar e nome */}
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>

                      {/* Stars e data */}
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="w-3.5 h-3.5 rounded-full" />
                          ))}
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>

                      {/* Conteúdo do comentário */}
                      <div className="border-l-2 border-stone-200 pl-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>

                      {/* Ações do comentário */}
                      <div className="flex items-center gap-4 mt-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>

                      {/* Linha divisória entre comentários (exceto o último) */}
                      {index < 4 && <Skeleton className="h-px w-full my-6" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Form Skeleton */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 bg-linear-to-br from-stone-50 to-white border border-stone-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <Skeleton className="w-1 h-4 rounded-full" />
                  <Skeleton className="h-4 w-36" />
                </div>

                {/* Avatar e nome do usuário */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-stone-200">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>

                {/* Form fields skeleton */}
                <div className="space-y-4">
                  {/* Rating stars */}
                  <div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-6 h-6 rounded-full" />
                      ))}
                    </div>
                  </div>

                  {/* Textarea skeleton */}
                  <div>
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-30 w-full rounded-md" />
                    <div className="flex justify-end mt-2">
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Button skeleton */}
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
