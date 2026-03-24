import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChefHat, Clock, Tag, Users } from 'lucide-react'

interface Props {
    title: string
    setTitle: (v: string) => void
    description: string
    setDescription: (v: string) => void
    prepTime: string
    setPrepTime: (v: string) => void
    cookTime: string
    setCookTime: (v: string) => void
    servings: string
    setServings: (v: string) => void
    category: string
    setCategory: (v: string) => void
}


export default function RecipeBasicInfo({
    title,
    setTitle,
    description,
    setDescription,
    prepTime,
    setPrepTime,
    cookTime,
    setCookTime,
    servings,
    setServings,
    category,
    setCategory
}: Props) {

    const maxCharacters = 500; 

    return (
        <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <ChefHat className="w-5 h-5 text-stone-700" />
                    </div>
                    <div>
                        <CardTitle className="inter text-lg">Informações Básicas</CardTitle>
                        <CardDescription className="raleway font-medium text-xs">
                            Os detalhes principais que definem sua receita
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                        Título da Receita
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Bolo de Chocolate Perfeito"
                        required
                        className="raleway font-medium text-sm h-12"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                        Descrição
                        <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Conte um pouco sobre sua receita, o que a torna especial..."
                        rows={4}
                        required
                        maxLength={maxCharacters}
                        className="raleway leading-relaxed font-medium text-sm min-h-20 resize-none"
                    />
                    <p className="text-xs text-stone-500 text-right">{description.length} / {maxCharacters} caracteres</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                        <Label htmlFor="prepTime" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Preparo (min)
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="prepTime"
                            type="number"
                            min="0"
                            value={prepTime}
                            onChange={(e) => setPrepTime(e.target.value)}
                            required
                            className="raleway font-medium text-sm h-11"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="cookTime" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Cozimento (min)
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cookTime"
                            type="number"
                            min="0"
                            value={cookTime}
                            onChange={(e) => setCookTime(e.target.value)}
                            required
                            className="raleway font-medium text-sm h-11"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="servings" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Porções
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="servings"
                            type="number"
                            min="1"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            required
                            className="raleway font-medium text-sm h-11"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Categoria
                    </Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Ex: Sobremesa, Prato Principal, Café da Manhã..."
                        className="raleway font-medium text-sm h-11"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
