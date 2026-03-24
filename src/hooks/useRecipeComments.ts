import { useEffect, useState } from "react"
import { createRecipeComment, createRecipeRating, type RecipeComment, getRecipeCommentsByRecipeId, getRecipeRatingsByRecipeId } from "@/lib/recipeService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

interface UseRecipeCommentsParams {
  recipeId: string
}

export function useRecipeComments({ recipeId }: UseRecipeCommentsParams) {
  const { user } = useAuth()
  const [comments, setComments] = useState<RecipeComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!recipeId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getRecipeCommentsByRecipeId(recipeId)
        const ratings = await getRecipeRatingsByRecipeId(recipeId)
        const merged = (data || []).map((c: any) => {
          const r = ratings.find(rr => rr.userId === c.userId)
          return { ...c, rating: r?.rating ?? null }
        })
        if (!cancelled) setComments(merged)
      } catch (e) {
        if (!cancelled) setError("Não foi possível carregar os comentários.")
        console.error(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [recipeId])

  async function submitComment(commentText: string | null, rating: number | null, parentId?: string | null) {

    if (!user) return
    const trimmed = (commentText ?? "").trim()

    // Não permite envio vazio (nem comentário vazio + rating 0)
    if (!trimmed && (!rating || rating <= 0)) {
      return
    }

    // Se for comentário "root" sem rating, podemos exigir rating > 0
    const isReply = !!parentId
    if (!isReply && (!trimmed && (!rating || rating <= 0))) return
    setSubmitting(true)
    setError(null)
    try {
      // 1) se houver rating válido, crie no table recipe_ratings
      let createdRating = null
      if (rating && rating > 0) {
        createdRating = await createRecipeRating(recipeId, user.id, rating)
      }

      // 2) se houver texto, crie comentário (suporta parentId)
      let createdComment: RecipeComment | null = null
      if (trimmed.length > 0) {
        createdComment = await createRecipeComment(recipeId, user.id, trimmed, parentId ?? null)
        // adiciona comment recém-criado no estado (no topo)
        setComments((prev) => [createdComment!, ...prev])
      }

      return { createdComment, createdRating }
    } catch (e) {
      toast.error("Não foi possível publicar o comentário. Tente novamente.")
      console.error(e)
      throw e
    } finally {
      setSubmitting(false)
    }
  }

  return {
    user,
    comments,
    loading,
    error,
    submitting,
    submitComment,
  }
}

