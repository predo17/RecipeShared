import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Clock, Users, ChefHat } from "lucide-react"
import { getAllRecipes } from "@/lib/recipeService"
import type { Recipe } from "@/lib/recipe"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        const data = await getAllRecipes()
        setRecipes(data)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar receitas. Tente novamente mais tarde.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <p className="text-muted-foreground">Carregando receitas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground mt-2">
            Descubra receitas deliciosas da nossa comunidade
          </p>
        </div>
      </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} porções</span>
                  </div>
                </div>
                {recipe.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {recipe.category}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to={`/recipes/${recipe.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver Receita
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
    </div>
  )
}
