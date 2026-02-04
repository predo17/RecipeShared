import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus, X, ArrowLeft, ChefHat, Clock, Users, Image as ImageIcon, Tag, Upload, Link, ImageUp } from "lucide-react"
import type { Recipe } from "@/lib/recipe"
import { createRecipe, updateRecipe, uploadRecipeImage, type CreateRecipeData, type UpdateRecipeData } from "@/lib/recipeService"
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

  const [imageSourceMode, setImageSourceMode] = useState<"url" | "upload">("url")
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    setImageUploading(true)
    try {
      const url = await uploadRecipeImage(file, user.id)
      setImageUrl(url)
    } catch (err) {
      console.error(err)
      setError("Falha ao enviar a imagem. Tente novamente ou use a URL.")
    } finally {
      setImageUploading(false)
      e.target.value = ""
    }
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
    <div className="min-h-screen bg-linear-to-brom-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Premium */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/recipes")}
            className="mb-6 hover:bg-stone-100 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para receitas
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-linear-to-br from-stone-800 to-stone-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-stone-900 tracking-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                {isEditMode ? "Editar Receita" : "Criar Nova Receita"}
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                {isEditMode ? "Atualize os detalhes da sua receita" : "Compartilhe sua criação culinária com a comunidade"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <div className="h-1 flex-1 bg-stone-800 rounded-full"></div>
            <div className="h-1 flex-1 bg-stone-300 rounded-full"></div>
            <div className="h-1 flex-1 bg-stone-300 rounded-full"></div>
            <div className="h-1 flex-1 bg-stone-300 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
                  <ChefHat className="w-5 h-5 text-stone-700" />
                </div>
                <div>
                  <CardTitle className="inter text-lg">Informações Básicas</CardTitle>
                  <CardDescription className="raleway text-xs">
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
                  className="border-stone-300 focus:border-stone-500 focus:ring-stone-300 text-base h-12"
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
                  className="border-stone-300 focus:border-stone-500 focus:ring-stone-300 text-base resize-none"
                  style={{ fontFamily: '"Source Serif Pro", Georgia, serif' }}
                />
                <p className="text-xs text-stone-400 text-right">{description.length} caracteres</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem da Receita
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageSourceMode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageSourceMode("upload")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={imageSourceMode === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageSourceMode("url")}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    URL da imagem
                  </Button>
                </div>

                {imageSourceMode === "url" && (
                  <>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem-da-receita.jpg"
                      className="border-stone-300 focus:border-stone-500 focus:ring-stone-300 h-11"
                    />
                    {imageUrl && (
                      <div className="mt-3 rounded border border-stone-200 p-2 bg-stone-50">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-80 sm:h-105 md:h-125 lg:h-160 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagem+Inválida"
                          }}
                        />
                      </div>
                    )}
                  </>
                )}


                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />


                {imageSourceMode === "upload" && (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Enviar imagem da receita"
                    onClick={() => {
                      if (!imageUploading) {
                        fileInputRef.current?.click()
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !imageUploading
                      ) {
                        fileInputRef.current?.click()
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files?.[0]
                      if (file) {
                        handleImageUpload({ target: { files: [file] } } as any)
                      }
                    }}

                    className="
      mt-3
      rounded
      border
      border-stone-200
      border-dashed
      p-2
      bg-stone-50
      min-h-48 sm:min-h-64 md:min-h-80 lg:min-h-96
      flex
      items-center
      justify-center
      cursor-pointer
      hover:bg-stone-100
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-stone-400
      focus:ring-offset-2
    "
                  >
                    {imageUploading ? (
                      <span className="text-stone-500 text-sm">
                        Enviando imagem...
                      </span>
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview da receita"
                        className="w-full h-80 sm:h-105 md:h-125 lg:h-160 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Imagem+Inválida"
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <ImageUp className="w-6 h-6 text-stone-500 mb-2" />
                        <p className="text-stone-500 text-sm">
                          Clique para enviar
                        </p>
                        <p className="text-stone-500 text-xs">
                          PNG, JPG ou WEBP
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                    className="border-stone-300 focus:border-stone-500 h-11"
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
                    className="border-stone-300 focus:border-stone-500 h-11"
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
                    className="border-stone-300 focus:border-stone-500 h-11"
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
                  className="border-stone-300 focus:border-stone-500 h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredientes */}
          <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
                    <img src="/ingredientes.png" alt="ingredients" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <CardTitle className="inter text-lg">Ingredientes</CardTitle>
                    <CardDescription className="raleway text-xs">
                      Liste todos os ingredientes necessários
                    </CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
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
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 w-8 h-8 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Quantidade"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          updateIngredient(index, "quantity", e.target.value)
                        }
                        required
                        className="h-10"
                      />
                      <Input
                        placeholder="Unidade (g, ml, xícara...)"
                        value={ingredient.unit}
                        onChange={(e) =>
                          updateIngredient(index, "unit", e.target.value)
                        }
                        className="h-10"
                      />
                      <Input
                        placeholder="Nome do ingrediente"
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(index, "name", e.target.value)
                        }
                        required
                        className="h-10"
                      />
                    </div>
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Modo de Preparo */}
          <Card className="border-stone-200 shadow-md overflow-hidden">
            <CardHeader className="bg-linear-to-r from-stone-50 to-transparent border-b border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
                    <img src="/Bowl.png" alt="bowl" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <CardTitle className="inter text-lg">Modo de Preparo</CardTitle>
                    <CardDescription className="raleway  text-xs">
                      Descreva passo a passo como preparar
                    </CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-alll"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Passo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  {/* Timeline line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-5.75otop-12-0.5 h-[calc(100%+16px)] bg-linear-to-b-bm-blue-300 to-transparent"></div>
                  )}

                  <div className="flex gap-4 items-start bg-stone-50/50 border border-stone-200 rounded-lg p-4 hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all relative z-10">
                    <div className="shrink-0 w-12 h-12 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg shadow-md group-hover:scale-110 transition-transform">
                      {step.order}
                    </div>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Descreva este passo detalhadamente..."
                        value={step.instruction}
                        onChange={(e) =>
                          updateStep(index, "instruction", e.target.value)
                        }
                        rows={3}
                        required
                        className="raleway border-stone-300 resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <Input
                          type="number"
                          min="0"
                          placeholder="Tempo em minutos (opcional)"
                          value={step.timeMinutes}
                          onChange={(e) =>
                            updateStep(index, "timeMinutes", e.target.value)
                          }
                          className="w-48 border-stone-300 focus:border-blue-400 h-9"
                        />
                      </div>
                    </div>
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Erro ao processar</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="sticky bottom-0 bg-linear-to-t from-white via-white to-transparent pt-6 pb-4 -mx-4 px-4 z-50">
            <div className="flex gap-4 justify-end max-w-5xl mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/recipes")}
                disabled={loading}
                className="border-stone-300 hover:bg-stone-50 px-8"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-linear-to-r from-stone-800 to-stone-700 hover:from-stone-900 hover:to-stone-800 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all"
              >
                {loading
                  ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isEditMode ? "Salvando..." : "Criando..."}
                    </div>
                  )
                  : (isEditMode ? "Salvar Alterações" : "Criar Receita")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}