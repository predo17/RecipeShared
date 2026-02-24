import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-2 py-8 max-w-7xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="space-y-4 max-w-2xl w-full">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-px" />
            <Skeleton className="h-3 w-24" />
          </div>

          <Skeleton className="h-8 w-48 sm:h-9 sm:w-64 lg:h-10 lg:w-80" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-px w-20" />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD PERFIL */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>

          <CardContent className="space-y-6">

            {/* AVATAR */}
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-full max-w-sm" />
              </div>
            </div>

            {/* NOME */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-3 w-40" />
            </div>

            {/* BIO */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* BOTÕES */}
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>

          </CardContent>
        </Card>

        {/* CARD ESTATÍSTICAS */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-40" />
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-20 w-full rounded-sm" />
              <Skeleton className="h-20 w-full rounded-sm" />
              <Skeleton className="h-20 w-full rounded-sm" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}