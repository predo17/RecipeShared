import RecipeBasicInfo from "./RecipeBasicInfo"
import RecipeImagePicker from "./RecipeImagePicker"
import RecipeIngredients from "./RecipeIngredients"
import RecipeSteps from "./RecipeSteps"
import { ChefHat, } from "lucide-react"
import RecipeFormActions from "./RecipeFormActions"
import { useCreateRecipe } from "@/hooks/useCreateRecipe"
import { useNavigate } from "react-router-dom"

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

export default function CreateRecipe() {
  const navigate = useNavigate()
  const {
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
    fileInputRef } = useCreateRecipe()

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