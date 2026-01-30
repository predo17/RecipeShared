import { useState } from "react"
import { Link } from "react-router-dom"
import { ChefHat, Plus, User, Menu, Search, Home } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const { user } = useAuth()
  const [showSearch, setShowSearch] = useState(false)

  return (
    <nav className="relative border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-2">
        <div className="flex h-14 items-center justify-between">

          {/* Mobile - Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="flex flex-col gap-4 py-4 px-2">
                <div
                  className="flex items-center gap-2 font-semibold -mt-0.5"
                >
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span>RecipeShared</span>
                </div>

                <SheetClose asChild>
                  <Link to="/" className="flex items-center gap-2 px-1">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link to="/create-recipe" className="flex items-center gap-2 px-1">
                    <Plus className="h-4 w-4" />
                    Criar Receita
                  </Link>
                </SheetClose>
                <SheetClose asChild>

                  {user ? (
                    <Link
                      to="/profile"
                      className="flex items-center gap-1.5"
                      arial-label="Perfil"
                    >
                      <User className="h-4 w-4" />
                      Perfil
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="p-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-sm text-center"
                      arial-label="Criar Conta"
                    >
                      Criar Conta
                    </Link>
                  )}
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setShowSearch(false)}
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-2 font-semibold px-2 py-1"
          >
            <ChefHat className="h-6 w-6 text-primary" />
            <span>RecipeShared</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/"
              arial-label="Home">
              <Button variant="ghost">Home</Button>
            </Link>

            <Link to="/create-recipe"
              arial-label="Criar Receita">
              <Button variant="ghost" className="flex items-center gap-1.5">
                <Plus className="h-4 w-4" />
                Criar Receita
              </Button>
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-1.5"
                arial-label="Perfil"
              >
                <User className="h-4 w-4" />
                Perfil
              </Link>
            ) : (
              <Link
                to="/register"
                className="p-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-sm"
                arial-label="Criar Conta"
              >
                Criar Conta
              </Link>
            )}
          </div>

          {/* Mobile - Search */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(prev => !prev)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search animado */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${showSearch ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <form className="px-4 pb-3 mt-1">
          <Input
            placeholder="Buscar receitas..."
            className="w-full bg-white/80 focus-visible:ring-orange-400"
          />
        </form>
      </div>
    </nav>
  )
}
