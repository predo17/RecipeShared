import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'
import type { IngredientForm } from './CreateRecipe'

interface Props {
    ingredients: IngredientForm[]
    onAdd: () => void
    onRemove: (index: number) => void
    onUpdate: (
        index: number,
        field: keyof IngredientForm,
        value: string
    ) => void
}

export default function RecipeIngredients({ ingredients, onAdd, onRemove, onUpdate }: Props) {
    return (
        <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            <img src="/ingredientes.png" alt="ingredients" className="w-5 h-5 object-contain" />
                        </div>
                        <div>
                            <CardTitle className="inter text-lg">Ingredientes</CardTitle>
                            <CardDescription className="raleway font-medium text-xs">
                                Liste todos os ingredientes necessários
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAdd}
                        className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
                {ingredients.map((ingredient, index) => (
                    <div
                        key={index}
                        className="group relative bg-stone-50/50 border border-stone-200 rounded-lg p-4 hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all"
                        style={{
                            animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                        }}
                    >
                        <div className="flex items-start max-sm:flex-col gap-3">
                            <div className="shrink-0 w-8 h-8 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm">
                                {index + 1}
                            </div>

                            {/* Botão de remover visível em mobile */}
                            {ingredients.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(index)}
                                    className="absolute top-3.5 right-1.5 sm:hidden opacity-100 hover:bg-red-50 hover:text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}

                            <div className="flex-1 sm:grid sm:grid-cols-3 max-sm:space-y-3 gap-3">
                                <Input
                                    placeholder="Quantidade"
                                    value={ingredient.quantity}
                                    onChange={(e) =>
                                        onUpdate(index, "quantity", e.target.value)
                                    }
                                    required
                                    className="raleway h-10 font-medium text-sm"
                                />
                                <Input
                                    placeholder="Unidade (g, ml, xícara...)"
                                    value={ingredient.unit}
                                    onChange={(e) =>
                                        onUpdate(index, "unit", e.target.value)
                                    }
                                    className="raleway h-10 font-medium text-sm"
                                />
                                <Input
                                    placeholder="Nome do ingrediente"
                                    value={ingredient.name}
                                    onChange={(e) =>
                                        onUpdate(index, "name", e.target.value)
                                    }
                                    required
                                    className="raleway h-10 font-medium text-sm"
                                />
                            </div>
                            {ingredients.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(index)}
                                    className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
