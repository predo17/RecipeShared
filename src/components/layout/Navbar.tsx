import { Link } from "react-router-dom"
import { ChefHat, Plus, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-2">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="h-6 w-6 text-primary" />
            <span>RecipeShared</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/create-recipe">
              <Button variant="ghost" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                <span>Criar Receita</span> 
              </Button>
            </Link>

            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button>Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
