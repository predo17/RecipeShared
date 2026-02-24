import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { Recipe } from "@/lib/recipe"
import { createRecipe, updateRecipe, uploadRecipeImage, type CreateRecipeData, type UpdateRecipeData } from "@/lib/recipeService"
import { useAuth } from "@/contexts/AuthContext"
import RecipeBasicInfo from "./RecipeBasicInfo"
import RecipeImagePicker from "./RecipeImagePicker"
import RecipeIngredients from "./RecipeIngredients"
import RecipeSteps from "./RecipeSteps"
import { ChefHat,  } from "lucide-react"
import RecipeFormActions from "./RecipeFormActions"
import { toast } from "sonner"

export interface IngredientForm {
  name: string
  quantity: string
  unit: string
}

export interface StepForm {
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

  const [imageSourceMode, setImageSourceMode] = useState<"url" | "upload">("upload")
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Ingredientes e passos
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: "", quantity: "", unit: "" },
  ])
  const [steps, setSteps] = useState<StepForm[]>([
    { order: 1, instruction: "", timeMinutes: "" },
  ])

  const handleChangeImageSource = (mode: "url" | "upload") => {
    setImageSourceMode(mode)

    if (mode === "upload") {
      // limpando URL
      setImageUrl("")

      // limpa preview antigo (caso tenha vindo de URL)
      setImagePreview(null)
    }

    if (mode === "url") {
      // limpando upload
      setImagePreview(null)

      // limpa o input file real
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }


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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } }
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    // Preview instantâneo (antes do upload)
    const localPreview = URL.createObjectURL(file)
    setImagePreview(localPreview)
    setImageUploading(true)

    setImageUrl("")

    try {
      const url = await uploadRecipeImage(file, user.id)
      setImageUrl(url)
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err)
      toast.error("Falha ao enviar a imagem. Tente novamente ou use uma URL.")
    } finally {
      setImageUploading(false)

    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error(
          isEditMode
            ? "Você precisa estar logado para editar uma receita"
            : "Você precisa estar logado para criar uma receita"
        )
      }
      if (isEditMode && editRecipe && user && editRecipe.authorId !== user.id) {
        toast.error("Você não tem permissão para editar esta receita")
      }

      // Validação básica
      if (!title.trim()) {
        toast.error("O título é obrigatório")
      }
      if (!description.trim()) {
        toast.error("A descrição é obrigatória")
      }
      if (!prepTime || !cookTime || !servings) {
        toast.error("Preencha todos os campos de tempo e porções")
      }
      if (ingredients.some((ing) => !ing.name.trim() || !ing.quantity.trim())) {
        toast.error("Preencha todos os ingredientes corretamente")
      }
      if (steps.some((step) => !step.instruction.trim())) {
        toast.error("Preencha todos os passos corretamente")
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
        : await createRecipe({ ...(commonPayload as CreateRecipeData), authorId: user?.id as string })

      navigate(`/recipes/details/${encodeURIComponent(savedRecipe.title ?? "")}`)
    } catch (error) {
      toast.error("Erro ao salvar a receita", {
        description: "Tente novamente em alguns instantes"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-brom-stone-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-linear-to-br from-stone-800 to-stone-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <ChefHat className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="inter text-2xl md:text-4xl font-bold text-stone-900 tracking-tight">
                {isEditMode ? "Editar Receita" : "Criar Nova Receita"}
              </h1>
              <p className="raleway text-xs md:text-sm text-stone-500 mt-1">
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

          <RecipeBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            prepTime={prepTime}
            setPrepTime={setPrepTime}
            cookTime={cookTime}
            setCookTime={setCookTime}
            servings={servings}
            setServings={setServings}
            category={category}
            setCategory={setCategory}
          />
          {/* Imagem da Receita */}
          <RecipeImagePicker
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imagePreview={imagePreview}
            imageUploading={imageUploading}
            imageSourceMode={imageSourceMode}
            fileInputRef={fileInputRef}
            onChangeSource={handleChangeImageSource}
            onUpload={handleImageUpload}
          />
          {/* Ingredientes */}
          <RecipeIngredients
            ingredients={ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            onUpdate={updateIngredient}
          />
          {/* Modo de Preparo */}
          <RecipeSteps
            steps={steps}
            onAdd={addStep}
            onRemove={removeStep}
            onUpdate={updateStep}
          />
          {/* Botões de Ação */}
          <RecipeFormActions
            loading={loading}
            isEditMode={isEditMode}
            onCancel={() => navigate("/recipes")}
          />
        </form>
      </div>
    </div>
  )
}