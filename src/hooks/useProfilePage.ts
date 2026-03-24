import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import {
  deleteRecipe as deleteRecipeFromDb,
  getRecipesByAuthor,
  getUserFavoritesCount,
} from "@/lib/recipeService"
import { updateUserProfile } from "@/lib/authService"
import type { Recipe } from "@/lib/recipe"

export function useProfile() {
  const navigate = useNavigate()
  const { user, signOut, refreshUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [statsLoading, setStatsLoading] = useState(true)
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [topRatedRecipe, setTopRatedRecipe] = useState<Recipe | null>(null)
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("")

  // Avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB")
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setAvatar(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  // Preencher dados do usuário
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

  // Buscar estatísticas
  useEffect(() => {
    if (!user) return

    const userId = user.id
    let mounted = true

    async function fetchStats() {
      try {
        setStatsLoading(true)

        const [recipes, favCount] = await Promise.all([
          getRecipesByAuthor(userId),
          getUserFavoritesCount(userId),
        ])

        if (!mounted) return

        setCreatedRecipes(recipes)
        setFavoritesCount(favCount)

        const best = recipes.reduce<Recipe | null>((acc, r) => {
          if (!acc) return r
          return (r.averageRating ?? 0) > (acc.averageRating ?? 0) ? r : acc
        }, null)

        setTopRatedRecipe(best)

      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setStatsLoading(false)
      }
    }

    fetchStats()

    return () => {
      mounted = false
    }

  }, [user])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)

    try {
      await updateUserProfile(user.id, {
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: avatar.trim() || undefined,
      })

      await refreshUser()

      setIsEditing(false)

      toast.success("Perfil atualizado com sucesso!")

    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
    }

    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  const recomputeTopRated = (list: Recipe[]) => {
    const best = list.reduce<Recipe | null>((acc, r) => {
      if (!acc) return r
      return (r.averageRating ?? 0) > (acc.averageRating ?? 0) ? r : acc
    }, null)
    setTopRatedRecipe(best)
  }

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if (!user || recipe.authorId !== user.id) return

    setDeletingRecipeId(recipe.id)
    try {
      await deleteRecipeFromDb(recipe.id)
      setCreatedRecipes((prev) => {
        const next = prev.filter((r) => r.id !== recipe.id)
        recomputeTopRated(next)
        return next
      })
      toast.success("Receita excluída.")
    } catch (err) {
      console.error(err)
      toast.error("Não foi possível excluir a receita.")
    } finally {
      setDeletingRecipeId(null)
    }
  }

  return {
    user,
    isEditing,
    loading,
    statsLoading,
    createdRecipes,
    favoritesCount,
    topRatedRecipe,
    name,
    bio,
    avatar,
    setName,
    setBio,
    setAvatar,
    setIsEditing,
    handleAvatarUpload,
    handleSave,
    handleCancel,
    handleLogout,
    handleDeleteRecipe,
    deletingRecipeId,
  }
}