import { Link, useNavigate } from "react-router-dom"
import { ChefHat, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ChefHat className="h-6 w-6 text-primary" />
            <span>RecipeShared</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/recipes">
              <Button variant="ghost">Receitas</Button>
            </Link>

            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name || "Perfil"}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
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
