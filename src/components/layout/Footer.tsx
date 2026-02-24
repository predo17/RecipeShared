import { linksNavigate } from "@/constants/navigaion"
import { ChefHat } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="relative bg-linear-to-b from-white to-stone-50 border-t border-stone-200">
            {/* Ornamento superior */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-stone-300 to-transparent"></div>

            <div className="container mx-auto px-4 md:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Logo e descrição - Maior espaço */}
                    <div className="md:col-span-5 space-y-6">
                        <div
                            className="inline-flex items-center gap-2"
                        >
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-stone-800 to-stone-600 rounded-lg flex items-center justify-center shadow-md">
                                <ChefHat className="h-6 w-6 text-orange-400" />
                            </div>
                            <span className="inter text-xl lg:text-2xl font-semibold text-stone-900 tracking-tight">
                                RecipeShared
                            </span>
                        </div>

                        <p className="raleway text-sm text-stone-700 leading-[1.8] font-medium max-w-md">
                            Compartilhe, descubra e salve receitas incríveis feitas por pessoas
                            apaixonadas por cozinhar.
                        </p>

                        <div className="h-px w-16 bg-stone-300"></div>

                    </div>

                    {/* Navegação */}
                    <div className="md:col-span-3 space-y-4">
                        <h4 className="inter text-xs font-semibold uppercase tracking-[0.15em]">
                            Navegação
                        </h4>
                        <ul className="space-y-3">
                            {linksNavigate.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors duration-200"
                                    >
                                        <div className="w-0.5 h-3 rounded-full bg-stone-300 group-hover:bg-stone-900 transition-colors"></div>
                                        <span className="raleway text-sm font-medium">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Mensagem especial */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="inter text-xs font-semibold uppercase tracking-[0.15em]">Feito com amor</h4>
                    <p className="relaway text-stone-700 text-sm">
                        Porque cozinhar é compartilhar amor — e comida boa também
                    </p>
                    </div>
                </div>
            </div>

            {/* Rodapé inferior */}
            <div className="border-t py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} RecipesShared. Todos os direitos reservados.
            </div>
        </footer>
    )
}