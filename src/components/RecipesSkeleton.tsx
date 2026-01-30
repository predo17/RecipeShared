import { Skeleton } from "@/components/ui/skeleton";

export function RecipesSkeleton() {
    return (
        <div className="relative h-100 rounded-2xl overflow-hidden shadow-md bg-muted animate-pulse">


            <Skeleton className="absolute inset-0" />
            {/* Categoria */}
            <div className="absolute top-4 left-4">
                <Skeleton className="h-6 w-20 rounded-full bg-white/80" />
            </div>

            <div className="absolute top-4 right-4">
                <Skeleton className="h-6 w-16 rounded-full bg-white/80" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">

                <Skeleton className="h-6 w-3/4 bg-white/80" />


                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 bg-white/80" />
                    <Skeleton className="h-4 w-10 bg-white/80" />
                </div>

                <Skeleton className="h-4 w-full bg-white/70" />
                <Skeleton className="h-4 w-5/6 bg-white/70" />

                <div className="pt-4 border-t border-white/20">
                    <Skeleton className="h-4 w-32 bg-white/80" />
                </div>
            </div>
        </div>
    )
}
