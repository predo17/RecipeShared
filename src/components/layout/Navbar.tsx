import { useState } from "react"
import { Link } from "react-router-dom"
import { ChefHat, Menu, Search, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { linksNavigate } from "@/constants/navigaion"
import { useUI } from "@/contexts/AuthModalContext"

export default function Navbar() {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const { openAuth } = useUI();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Mobile - Menu Hamburger */}
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                  className="hover:bg-stone-100 transition-colors"
                >
                  <Menu className="h-5 w-5 text-stone-700" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 bg-linear-to-b from-stone-50 to-white border-r-2 border-stone-200">
                {/* Header do menu mobile */}
                <div className="flex items-center gap-2 p-2.5 border-b-2 border-stone-200">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-linear-to-br from-stone-800 to-stone-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <ChefHat className="h-5 lg:h-5 lg:w-5 text-orange-400" />
                  </div>
                  <span className="inter text-lg lg:text-xl font-semibold text-stone-900 tracking-tight">
                    RecipeShared
                  </span>
                </div>

                {/* Links do menu mobile */}
                <nav className="space-y-2">

                  {linksNavigate.map((link) => {

                    if (link.href === "/profile" && !user) {
                      return (
                        <SheetClose asChild>
                          <Button
                            key="register"
                            onClick={() => openAuth("register")}
                            aria-label="Criar Conta"
                            className="flex items-center justify-center gap-2 px-6 py-2.5  bg-linear-to-r from-orange-500 to-orange-400 text-white focus:from-orange-600 focus:to-orange-500 font-semibold rounded-xs shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <span className="text-xs uppercase tracking-wider">
                              Criar Conta
                            </span>
                          </Button>
                        </SheetClose>
                      )
                    }

                    return (
                      <SheetClose asChild>
                        <Link
                          key={link.href}
                          to={link.href}
                          aria-label={link.name}
                          className="group flex items-center gap-2 px-4 py-2 focus:bg-stone-100 focus:outline-0 border-l-2 border-transparent focus:border-stone-800 transition-all duration-200 relative"
                        >
                          <link.icon className="h-4 w-4 text-stone-600 group-hover:text-stone-900 group-focus:text-stone-900 transition-colors" />

                          <span className="text-sm font-medium text-stone-700 group-hover:text-stone-900 group-focus:text-stone-900 transition-colors">
                            {link.name}
                          </span>
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - Centralizado mobile, esquerda desktop */}
          <Link
            to="/"
            onClick={() => setShowSearch(false)}
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 group flex items-center gap-2 py-2"
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-linear-to-br from-stone-800 to-stone-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <ChefHat className="h-5 w-5 text-orange-400" />
            </div>
            <span className="hidden sm:block inter text-lg lg:text-xl font-semibold tracking-tight">
              RecipeShared
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2">
            {linksNavigate.map((link) => {

              if (link.href === "/profile" && !user) {
                return (
                  <Button
                    key="register"
                    onClick={() => openAuth("register")}
                    aria-label="Criar Conta"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500 font-semibold rounded-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102"
                  >
                    <span className="text-xs lg:text-sm uppercase tracking-wider">
                      Criar Conta
                    </span>
                  </Button>
                )
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-label={link.name}
                  className="group flex items-center gap-2 px-4 py-2 hover:bg-stone-100 focus:bg-stone-100 focus:outline-0 transition-all duration-200 relative"
                >
                  <link.icon className="h-4 w-4 text-stone-600 group-hover:text-stone-900 group-focus:text-stone-900 transition-colors" />

                  <span className="raleway text-sm font-medium text-stone-700 group-hover:text-stone-900 group-focus:text-stone-900 transition-colors tracking-wider ">
                    {link.name}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800 scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              )
            })}
          </div>

          {/* Search Button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(prev => !prev)}
              className="hover:bg-stone-100 transition-colors"
            >
              {showSearch ? (
                <X className="h-5 w-5 text-stone-700" />
              ) : (
                <Search className="h-5 w-5 text-stone-700" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-stone-200
          ${showSearch ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <form className="px-4 py-4 bg-stone-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Buscar receitas, ingredientes..."
              className="pl-10 border-stone-300 focus:border-stone-500 focus-visible:ring-stone-300 bg-white h-11"
            />
          </div>
        </form>
      </div>
    </nav>
  )
}