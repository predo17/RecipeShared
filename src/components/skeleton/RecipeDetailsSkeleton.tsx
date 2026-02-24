import { Skeleton } from "@/components/ui/skeleton";

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
    </section>
  )
}
