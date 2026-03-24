import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { createRecipe, updateRecipe, uploadRecipeImage, type CreateRecipeData, type UpdateRecipeData } from "@/lib/recipeService"
import type { Recipe } from "@/lib/recipe"

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

export function useCreateRecipe() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const editRecipe = (location.state as CreateRecipeLocationState | null)?.editRecipe
  const isEditMode = Boolean(editRecipe)

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [category, setCategory] = useState("")

  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: "", quantity: "", unit: "" }
  ])

  const [steps, setSteps] = useState<StepForm[]>([
    { order: 1, instruction: "", timeMinutes: "" }
  ])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageSourceMode, setImageSourceMode] = useState<"url" | "upload">("upload")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleChangeImageSource = (mode: "url" | "upload") => {
    setImageSourceMode(mode)

    if (mode === "upload") {
      // Limpando URL
      setImageUrl("")
      setImagePreview(null)
    }

    if (mode === "url") {
      // Limpando upload
      setImagePreview(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // 🔥 Preencher dados se for edição
  useEffect(() => {
    if (!editRecipe) return

    setTitle(editRecipe.title ?? "")
    setDescription(editRecipe.description ?? "")
    setImageUrl(editRecipe.imageUrl ?? "")
    setPrepTime(String(editRecipe.prepTime ?? ""))
    setCookTime(String(editRecipe.cookTime ?? ""))
    setServings(String(editRecipe.servings ?? ""))
    setCategory(editRecipe.category ?? "")

    setIngredients(
      editRecipe.ingredients?.length
        ? editRecipe.ingredients.map((ing: any) => ({
          name: ing.name ?? "",
          quantity: String(ing.quantity ?? ""),
          unit: ing.unit ?? ""
        }))
        : [{ name: "", quantity: "", unit: "" }]
    )

    setSteps(
      editRecipe.steps?.length
        ? editRecipe.steps
          .slice()
          .sort((a: any, b: any) => a.order - b.order)
          .map((s: any) => ({
            order: s.order,
            instruction: s.instruction ?? "",
            timeMinutes: s.timeMinutes ? String(s.timeMinutes) : ""
          }))
        : [{ order: 1, instruction: "", timeMinutes: "" }]
    )
  }, [editRecipe?.id])

  // 🔥 Manipulação ingredientes
  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])

  const removeIngredient = (index: number) =>
    ingredients.length > 1 &&
    setIngredients(ingredients.filter((_, i) => i !== index))

  const updateIngredient = (
    index: number,
    field: keyof IngredientForm,
    value: string
  ) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  // 🔥 Manipulação passos
  const addStep = () =>
    setSteps([
      ...steps,
      { order: steps.length + 1, instruction: "", timeMinutes: "" }
    ])

  const removeStep = (index: number) => {
    if (steps.length <= 1) return
    const updated = steps.filter((_, i) => i !== index)
    updated.forEach((step, i) => (step.order = i + 1))
    setSteps(updated)
  }

  const updateStep = (
    index: number,
    field: keyof StepForm,
    value: string | number
  ) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  // 🔥 Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    const preview = URL.createObjectURL(file)

    setImagePreview(preview)
    setImageFile(file)

  }

  // 🔥 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error("Você precisa estar logado")
        return
      }

      let finalImageUrl = imageUrl

      // 🔥 upload acontece aqui
      if (imageFile) {
        setImageUploading(true)

        finalImageUrl = await uploadRecipeImage(imageFile, user.id)

        setImageUploading(false)
      }

      const payload: UpdateRecipeData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl:
          finalImageUrl.trim(),
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        servings: parseInt(servings),
        category: category.trim(),

        ingredients: ingredients.map((ing) => ({
          name: ing.name.trim(),
          quantity: parseFloat(ing.quantity) || 0,
          unit: ing.unit.trim() || "Unidade de"
        })),

        steps: steps.map((step) => ({
          order: step.order,
          instruction: step.instruction.trim(),
          timeMinutes: step.timeMinutes
            ? parseInt(step.timeMinutes)
            : undefined
        }))
      }

      const saved =
        isEditMode && editRecipe
          ? await updateRecipe(editRecipe.id, payload)
          : await createRecipe({
            ...(payload as CreateRecipeData),
            authorId: user.id
          })

      navigate(`/recipes/details/${encodeURIComponent(saved.title ?? "")}`)

    } catch {
      toast.error("Erro ao salvar receita")
    } finally {
      setLoading(false)
    }
  }

  return {
    isEditMode,
    loading,
    title, setTitle,
    description, setDescription,
    imageUrl, setImageUrl,
    prepTime, setPrepTime,
    cookTime, setCookTime,
    servings, setServings,
    category, setCategory,
    ingredients,
    steps,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addStep,
    removeStep,
    updateStep,
    handleImageUpload,
    handleChangeImageSource,
    handleSubmit,
    imageSourceMode,
    imagePreview,
    imageUploading,
    fileInputRef
  }
}