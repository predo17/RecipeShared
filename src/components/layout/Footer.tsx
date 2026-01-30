
import { ChefHat } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-background backdrop-blur supports-backdrop-filter:bg-background/60 border-t">
            <div className="container mx-auto px-2 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

                <div className="space-y-2">
                    <Link to="/" className="flex items-center gap-2 font-semibold max-w-max">
                        <ChefHat className="h-6 w-6 text-primary" />
                        <span className="text-xl">RecipeShared</span>
                    </Link>
                    <p className="realway text-base text-muted-foreground">
                        Compartilhe, descubra e salve receitas incríveis feitas por pessoas
                        apaixonadas por cozinhar.
                    </p>
                </div>

                {/* Links temporários */}
                <div>
                    <h4 className="inter font-semibold mb-2 text-lg">Navegação</h4>
                    <ul className="flex flex-col gap-2 text-muted-foreground text-base">
                        <li>
                            <Link to="/" className="hover:text-foreground transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/recipes" className="hover:text-foreground transition">
                                Receitas
                            </Link>
                        </li>
                        <li>
                            <Link to="/create-recipe" className="hover:text-foreground transition">
                                Criar receita
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Mensagem extra */}
                <div className="space-y-1">
                    <h4 className="inter font-semibold text-lg">Feito com amor</h4>
                    <p className="relaway text-muted-foreground text-base">
                        Porque cozinhar é compartilhar amor — e comida boa também.
                    </p>
                </div>
            </div>

            {/* Rodapé inferior */}
            <div className="border-t py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} RecipesShared. Todos os direitos reservados.
            </div>
        </footer>
    )
}

