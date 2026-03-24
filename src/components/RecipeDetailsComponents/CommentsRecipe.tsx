
import { Fragment, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormatCount, formatDate } from "@/utils/Counter";
import { ArrowUp, HeartIcon, MessageCircleMoreIcon, Star } from "lucide-react";
import { toast } from "sonner";
import { useRecipeComments } from "@/hooks/useRecipeComments";
import type { Recipe } from "@/lib/recipe";

interface CommentsRecipeProps {
  recipe: Recipe
  recipeId: string;
}

export default function CommentsRecipe({ recipe, recipeId }: CommentsRecipeProps) {
  const {
    user,
    comments,
    loading,
    error,
    submitting,
    submitComment,
  } = useRecipeComments({ recipeId })
  const [commentText, setCommentText] = useState("");
  const [selectRating, setSelectRating] = useState(0);
  const [selectParentId, setSelectParentId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [replyUserName, setReplyUserName] = useState<string | null>(null)
  const [isReplying, setIsReplying] = useState(false)
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({})

  const maxCharacters = 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const trimmed = commentText.trim();
    const respostTo = selectParentId;
    const star = selectRating;


    try {
      await submitComment(trimmed, star, respostTo);
      setSelectRating(0);
      setCommentText("");
      setSelectParentId(null);
      setIsReplying(false);
      setReplyUserName(null)
    } catch (e) {
      toast.error("Não foi possível publicar o comentário. Tente novamente.");
      console.error(e);
    }
  }

  function handleReply(userName: string, commentId: string) {
    setReplyUserName(userName)
    setSelectParentId(commentId)
    setIsReplying(true)

    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  function toggleReplies(commentId: string) {
    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const currentUser = user
    ? {
      avatar: user.avatar ?? "",
      name: user.name || "Usuário",
      bio: user.bio ?? "",
    }
    : null;

  const safeComments = comments ?? []
  const parentComments = safeComments.filter((c: any) => !("parentId" in c) || !(c as any).parentId)

  function getReplies(commentId: string) {
    return safeComments.filter((c: any) => (c as any).parentId === commentId)
  }
  const isAuthor = user?.id === recipe.authorId;

  const hasUserRated = recipe.ratings?.some(
    rating => rating.userId === user?.id
  );

  const shouldHideRating = isAuthor || hasUserRated;


  return (
    <div className="container mx-auto py-10 mt-10">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-stone-200">
          <div className="w-11 h-11 flex items-center justify-center bg-linear-to-br from-stone-100 to-stone-50 border border-stone-200 rounded-lg shadow-sm">
            <MessageCircleMoreIcon className="w-6 h-6 text-stone-600" />
          </div>
          <h2 className="inter text-xl font-bold text-stone-900 tracking-tight">
            Comentários da Comunidade
          </h2>
          <div className="hidden flex-1 sm:flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-200"></div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">
              {FormatCount(safeComments.length)} {safeComments.length === 1 ? "comentário" : "comentários"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8">
          {/* LEFT SIDE - Comments List */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-linear-to-brom-stone-50/40 to-transparent border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="inter text-sm font-bold uppercase tracking-widest text-stone-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-stone-800 rounded-full"></div>
                Discussões
              </h3>

              <div className="space-y-5 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    Carregando comentários...
                  </div>
                ) : error && comments.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    {error}
                  </div>
                ) : (
                  parentComments.map((comment, index) => {
                    const replies = getReplies(comment.id);

                    return (
                      <Fragment key={comment.id}>
                        <div

                          style={{
                            animation: `fadeIn 0.4s ease-out ${index * 0.08}s backwards`,
                          }}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={comment.avatar ?? undefined} alt={comment.userName} className="object-cover" />
                              <AvatarFallback className="bg-linear-to-br from-stone-200 to-stone-100 text-stone-700 font-semibold">
                                {comment.userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h4 className="inter font-bold text-stone-900 text-sm sm:text-base leading-tight line-clamp-2">
                                {comment.userName}
                              </h4>
                              {comment.userBio && (
                                <p className="raleway text-xs text-stone-500 mt-0.5 leading-relaxed line-clamp-1">
                                  {comment.userBio}
                                </p>
                              )}
                            </div>
                          </div>

                          {!openReplies ? (
                            ''
                          ) : (
                            typeof (comment as any).rating === "number" && (comment as any).rating > 0 && (
                              <div className="flex items-center gap-2 mb-2 ml-4">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                  <Star
                                    key={star}
                                    size={14}
                                    strokeWidth={2}
                                    className={`${(comment as any).rating >= star
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-stone-200 fill-stone-200"
                                      }`}
                                  />
                                ))}
                                <div className="text-xs text-stone-400 font-midium tabular-nums whitespace-nowrap">
                                  {formatDate(comment.createdAt)}
                                </div>

                              </div>
                            )
                          )}
                          <div className="border-l-2 border-stone-400 pl-4 ">
                            <p
                              className="raleway text-sm leading-[1.7] text-stone-600 font-medium"
                            >
                              {comment.comment}
                            </p>
                          </div>
                          {/* funcionalidades futuras */}
                          <div className="mt-4 flex items-center gap-4">
                            <button className="text-[11px] text-stone-500 hover:text-stone-800 font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                              <HeartIcon size={12} strokeWidth={3} />
                              Curtir
                            </button>
                            <button
                              onClick={() => handleReply(comment.userName, comment.id)}
                              className="text-[11px] text-stone-500 hover:text-stone-800 font-medium uppercase tracking-wider cursor-pointer">
                              Responder
                            </button>

                            {replies.length > 0 && (
                              <button
                                onClick={() => toggleReplies(comment.id)}
                                className="text-[11px] text-stone-500 hover:text-stone-800 font-medium uppercase tracking-wider cursor-pointer"
                              >
                                {openReplies[comment.id]
                                  ? "Ocultar respostas"
                                  : `Ver respostas (${replies.length})`}
                              </button>
                            )}
                          </div>
                        </div>


                        {openReplies[comment.id] && (
                          <div className="ml-12 mt-4 space-y-4 border-l border-stone-200 pl-4">
                            {replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-3">

                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={reply?.avatar ?? undefined} />
                                  <AvatarFallback>
                                    {reply.userName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <p className="text-xs font-semibold text-stone-900">
                                    {reply.userName}
                                  </p>

                                  <p className="text-sm text-stone-600">
                                    {reply.comment}
                                  </p>

                                  <span className="text-[10px] text-stone-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>

                              </div>
                            ))}
                          </div>
                        )}
                      </Fragment>
                    );
                  })
                )}
                {!loading && comments.length === 0 && !error && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                      <MessageCircleMoreIcon className="w-10 h-10 text-stone-400" />
                    </div>
                    <p className="releway text-stone-500 text-sm font-light">
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
                {user?.id && user.id === recipe.authorId ? "Responder a os comentários" : "Deixe seu comentário"}
              </h3>

              {currentUser ? (
                <>
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-stone-200">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} className="object-cover" />
                      <AvatarFallback className="bg-linear-to-br from-amber-200 to-amber-100 text-amber-800 font-bold text-lg">
                        {currentUser.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="inter font-bold text-stone-900 text-base leading-tight line-clamp-2">
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
                    <div>
                      {!shouldHideRating && (
                        <>
                          <label className="raleway text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-2 block">
                            Dê uma avaliação
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                value={star}
                                disabled={submitting}
                                onClick={(e) => setSelectRating(Number(e.currentTarget.value))}
                                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {star <= selectRating ? (
                                  <Star className="w-6 h-6 text-amber-400
                               fill-amber-400" />
                                ) : (
                                  <Star className="w-6 h-6 text-stone-300" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="raleway text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-2 block">
                        {isReplying
                          ? `Respondendo: ${replyUserName}`
                          : "Sua opinião sobre a receita"}
                      </label>
                      <Textarea
                        ref={textareaRef}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Compartilhe sua experiência, dicas ou sugestões..."
                        className="raleway min-h-30 resize-none text-sm leading-relaxed font-medium"
                        disabled={submitting}
                        minLength={10}
                        maxLength={maxCharacters}
                      />
                      <p className="raleway text-[10px] text-stone-400 mt-2 text-right">
                        Mínimo 10 caracteres
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        disabled={submitting || commentText.trim().length < 10 || (!isReplying && !selectRating)}
                        className="text-white font-semibold uppercase tracking-wider text-sm py-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        <ArrowUp className={`w-5 h-5 ${submitting ? "hidden" : ""}`} />
                        {submitting && (
                          <span className="flex items-center justify-center w-5.5 h-5.5">
                            <span className="w-4.5 h-4.5 border-2 border-orange-400 bottom-t-transparent rounded-full animate-spin"></span>
                          </span>
                        )}
                      </Button>
                      {isReplying && (
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setIsReplying(false)}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            Cancelar resposta
                          </Button>
                        </div>
                      )}
                    </div>
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
