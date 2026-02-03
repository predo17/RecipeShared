
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus, X, ArrowLeft } from "lucide-react"
import type { Recipe } from "@/lib/recipe"
import { createRecipe, updateRecipe, type CreateRecipeData, type UpdateRecipeData } from "@/lib/recipeService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

interface IngredientForm {
  name: string
  quantity: string
  unit: string
}

interface StepForm {
  order: number
  instruction: string
  timeMinutes: string
}

type CreateRecipeLocationState = {
  editRecipe?: Recipe
}

export default function CreateRecipe() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editRecipe = (location.state as CreateRecipeLocationState | null)?.editRecipe
  const isEditMode = Boolean(editRecipe)

  // Dados principais da receita
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [category, setCategory] = useState("")

  // Ingredientes e passos
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: "", quantity: "", unit: "" },
  ])
  const [steps, setSteps] = useState<StepForm[]>([
    { order: 1, instruction: "", timeMinutes: "" },
  ])

  useEffect(() => {
    if (!editRecipe) return

    setTitle(editRecipe.title ?? "")
    setDescription(editRecipe.description ?? "")
    setImageUrl(editRecipe.imageUrl ?? "")
    setPrepTime(String(editRecipe.prepTime ?? ""))
    setCookTime(String(editRecipe.cookTime ?? ""))
    setServings(String(editRecipe.servings ?? ""))
    setCategory(editRecipe.category ?? "")

    const nextIngredients: IngredientForm[] =
      editRecipe.ingredients && editRecipe.ingredients.length > 0
        ? editRecipe.ingredients.map((ing) => ({
            name: ing.name ?? "",
            quantity: String(ing.quantity ?? ""),
            unit: ing.unit ?? "",
          }))
        : [{ name: "", quantity: "", unit: "" }]

    const nextSteps: StepForm[] =
      editRecipe.steps && editRecipe.steps.length > 0
        ? editRecipe.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => ({
              order: s.order,
              instruction: s.instruction ?? "",
              timeMinutes: s.timeMinutes != null ? String(s.timeMinutes) : "",
            }))
        : [{ order: 1, instruction: "", timeMinutes: "" }]

    setIngredients(nextIngredients)
    setSteps(nextSteps)
  }, [editRecipe?.id])

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, field: keyof IngredientForm, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const addStep = () => {
    setSteps([
      ...steps,
      { order: steps.length + 1, instruction: "", timeMinutes: "" },
    ])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const updated = steps.filter((_, i) => i !== index)
      // Reordenar os passos
      updated.forEach((step, i) => {
        step.order = i + 1
      })
      setSteps(updated)
    }
  }

  const updateStep = (index: number, field: keyof StepForm, value: string | number) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!user) {
        throw new Error(
          isEditMode
            ? "Você precisa estar logado para editar uma receita"
            : "Você precisa estar logado para criar uma receita"
        )
      }
      if (isEditMode && editRecipe && editRecipe.authorId !== user.id) {
        throw new Error("Você não tem permissão para editar esta receita")
      }

      // Validação básica
      if (!title.trim()) {
        throw new Error("O título é obrigatório")
      }
      if (!description.trim()) {
        throw new Error("A descrição é obrigatória")
      }
      if (!prepTime || !cookTime || !servings) {
        throw new Error("Preencha todos os campos de tempo e porções")
      }
      if (ingredients.some((ing) => !ing.name.trim() || !ing.quantity.trim())) {
        throw new Error("Preencha todos os ingredientes corretamente")
      }
      if (steps.some((step) => !step.instruction.trim())) {
        throw new Error("Preencha todos os passos corretamente")
      }

      // Preparar dados para envio
      const commonPayload: UpdateRecipeData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || "https://via.placeholder.com/400x300?text=Receita",
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        servings: parseInt(servings),
        category: category.trim() || "Geral",
        ingredients: ingredients.map((ing) => ({
          name: ing.name.trim(),
          quantity: parseFloat(ing.quantity) || 0,
          unit: ing.unit.trim() || "unidade",
        })),
        steps: steps.map((step) => ({
          order: step.order,
          instruction: step.instruction.trim(),
          timeMinutes: step.timeMinutes ? parseInt(step.timeMinutes) : undefined,
        })),
      }

      const savedRecipe = isEditMode && editRecipe
        ? await updateRecipe(editRecipe.id, commonPayload)
        : await createRecipe({ ...(commonPayload as CreateRecipeData), authorId: user.id })

      navigate(`/recipes/details/${encodeURIComponent(savedRecipe.title ?? "")}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditMode
            ? "Erro ao editar receita"
            : "Erro ao criar receita"
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/recipes")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-8">
        {isEditMode ? "Editar Receita" : "Nova Receita"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha as informações principais da receita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Bolo de Chocolate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva sua receita..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Tempo de Preparo (min) *</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Tempo de Cozimento (min) *</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Porções *</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Sobremesa, Prato Principal, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ingredientes</CardTitle>
                <CardDescription>
                  Adicione os ingredientes necessários
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Quantidade"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      updateIngredient(index, "quantity", e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Unidade (g, ml, xícara...)"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(index, "unit", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Nome do ingrediente"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Modo de Preparo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Modo de Preparo</CardTitle>
                <CardDescription>
                  Descreva os passos para preparar a receita
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Passo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {step.order}
                </div>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Descreva este passo..."
                    value={step.instruction}
                    onChange={(e) =>
                      updateStep(index, "instruction", e.target.value)
                    }
                    rows={2}
                    required
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Tempo em minutos (opcional)"
                    value={step.timeMinutes}
                    onChange={(e) =>
                      updateStep(index, "timeMinutes", e.target.value)
                    }
                    className="w-full md:w-48"
                  />
                </div>
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Erro */}
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/recipes")}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? (isEditMode ? "Salvando..." : "Criando...")
              : (isEditMode ? "Salvar Alterações" : "Criar Receita")}
          </Button>
        </div>
      </form>
    </div>
  )
}
