import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getRecipeComments, createRecipeComment, type RecipeComment } from "@/lib/recipeService";
import { FormatCount, formatRelativeTime } from "@/utils/Counter";
import { ArrowUp } from "lucide-react";

interface CommentsRecipeProps {
  recipeId: string;
}

export default function CommentsRecipe({ recipeId }: CommentsRecipeProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar comentários da receita
  useEffect(() => {
    if (!recipeId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeComments(recipeId);
        if (!cancelled) setComments(data);
      } catch (e) {
        if (!cancelled) setError("Não foi possível carregar os comentários.");
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const trimmed = commentText.trim();
    if (trimmed.length < 10) {
      setError("O comentário precisa ter no mínimo 10 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const newComment = await createRecipeComment(recipeId, user.id, trimmed);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (e) {
      setError("Não foi possível publicar o comentário. Tente novamente.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  const currentUser = user
    ? {
      avatar: user.avatar ?? "",
      name: user.name || "Usuário",
      bio: user.bio ?? "",
    }
    : null;

  return (
    <div className="container mx-auto py-10 mt-10">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-200">
          <div className="w-11 h-11 flex items-center justify-center bg-linear-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-lg shadow-sm">
            <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Comentários da Comunidade
          </h2>
          <div className="flex-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-200"></div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">
              {FormatCount(comments.length)} {comments.length === 1 ? "comentário" : "comentários"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8">
          {/* LEFT SIDE - Comments List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-linear-to-brom-stone-50/40 to-transparent border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-stone-800 rounded-full"></div>
                Discussões
              </h3>

              <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    Carregando comentários...
                  </div>
                ) : error && comments.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    {error}
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="group bg-white border border-stone-200 rounded-lg p-5 hover:shadow-md hover:border-stone-300 transition-all duration-300"
                      style={{
                        animation: `fadeIn 0.4s ease-out ${index * 0.08}s backwards`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-12 h-12 border-2 border-stone-200 shadow-sm">
                          <AvatarImage src={comment.avatar ?? undefined} alt={comment.userName} />
                          <AvatarFallback className="bg-linear-to-br from-stone-200 to-stone-100 text-stone-700 font-semibold">
                            {comment.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <h4 className="inter font-bold text-stone-900 text-base leading-tight">
                            {comment.userName}
                          </h4>
                          {comment.userBio && (
                            <p className="raleway text-xs text-stone-500 mt-0.5 leading-relaxed line-clamp-1">
                              {comment.userBio}
                            </p>
                          )}
                        </div>

                        <span className="text-[10px] text-stone-400 font-light tabular-nums whitespace-nowrap">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>

                      <div className="border-l-2 border-stone-200 pl-4 group-hover:border-stone-400 transition-colors">
                        <p
                          className="raleway text-[15px] leading-[1.7] text-stone-700 font-light"
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* funcionalidades futuras */}
                      <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[11px] text-stone-500 hover:text-stone-800 font-medium uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Curtir
                        </button>
                        <button className="text-[11px] text-stone-500 hover:text-stone-800 font-medium uppercase tracking-wider">
                          Responder
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {!loading && comments.length === 0 && !error && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-stone-500 text-sm font-light">
                      Nenhum comentário ainda. Seja o primeiro!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - New Comment Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 bg-linear-to-brrom-stone-50 to-white border border-stone-200 rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-600 rounded-full"></div>
                Deixe seu comentário
              </h3>

              {currentUser ? (
                <>
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-stone-200">
                    <Avatar className="w-14 h-14 border-2 border-primary">
                      <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} className="object-cover" />
                      <AvatarFallback className="bg-linear-to-br from-amber-200 to-amber-100 text-amber-800 font-bold text-lg">
                        {currentUser.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="inter font-bold text-stone-900 text-base leading-tight">
                        {currentUser.name}
                      </h4>
                      {currentUser.bio && (
                        <p className="raleway text-xs text-stone-500 mt-1 leading-relaxed line-clamp-1">
                          {currentUser.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && comments.length > 0 && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                    <div>
                      <label className="raleway text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-2 block">
                        Sua opinião sobre a receita
                      </label>
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Compartilhe sua experiência, dicas ou sugestões..."
                        className="raleway min-h-[160px] resize-none border-stone-300 focus:border-stone-400 focus:ring-stone-300 text-sm leading-relaxed font-medium"
                        disabled={submitting}
                        minLength={10}
                      />
                      <p className="raleway text-[10px] text-stone-400 mt-2 text-right">
                        Mínimo 10 caracteres
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || commentText.trim().length < 10}
                      className="text-white font-semibold uppercase tracking-wider text-sm py-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      <ArrowUp className="w-4 h-4" />
                      {submitting && (
                        <span className="flex items-center justify-center w-5.5 h-5.5">
                          <span className="w-4.5 h-4.5 border-2 border-primary bottom-t-transparent rounded-full animate-spin"></span>
                        </span>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <p className="text-stone-500 text-sm py-4">
                  Faça login para deixar seu comentário.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
