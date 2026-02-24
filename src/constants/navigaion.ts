import { Heart, Home, Plus, Salad, User } from "lucide-react"

export const linksNavigate = [
  { name: "Início", href: "/", icon: Home },
  { name: "Receitas", href: "/recipes", icon: Salad },
  { name: "Criar Receita", href: "/create-recipe", icon: Plus },
  { name: "Favoritos", href: "/favorites", icon: Heart },
  { name: "Perfil", href: "/profile", icon: User },
]