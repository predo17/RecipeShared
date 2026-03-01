import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Edit2, Save, X, Camera, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/authService"
import type { Recipe } from "@/lib/recipe"
import { getRecipesByAuthor, getUserFavoritesCount } from "@/lib/recipeService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { RecipeCard } from "@/components/RecipeCard"
import { RecipesSkeleton } from "../skeleton/RecipesSkeleton"

export default function Profile() {
  const navigate = useNavigate()
  const { user, signOut, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [statsLoading, setStatsLoading] = useState(true)
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [topRatedRecipe, setTopRatedRecipe] = useState<Recipe | null>(null)

  // Estados do formulário
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("")

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

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

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

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-14">
        <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-2xl">

          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-stone-300"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Área Pessoal
            </span>
          </div>

          <h1 className="inter text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium leading-[1.05] text-stone-900 tracking-tight">
            Meu Perfil
          </h1>

          <p className="raleway text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            Gerencie suas informações pessoais e acompanhe suas atividades
          </p>

          <div className="h-px w-20 bg-stone-300"></div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="inter font-medium">Informações Pessoais</CardTitle>
            <CardDescription className="raleway font-medium text-[13px]">
              Gerencie suas informações de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <label htmlFor="avatarUpload" className={isEditing ? "cursor-pointer" : ""}>
                  {avatar || user.avatar ? (
                    <Avatar className="w-24 h-24 border-2">
                      <AvatarImage src={avatar || user.avatar} alt={user.name} />
                    </Avatar>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                  )}

                  {isEditing && (
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                      <Camera className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </label>

                {isEditing && (
                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="avatar">URL da Imagem</Label>
                    <Input
                      id="avatar"
                      type="url"
                      placeholder="https://exemplo.com/avatar.jpg"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Avatar</p>
                    <p className="text-sm">
                      {avatar || user.avatar
                        ? "Imagem personalizada"
                        : "Avatar padrão"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-sm border bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="inter text-sm">{user.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 p-2 rounded-sm border bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="inter text-sm">{user.email}</span>
              </div>
              <p className="raleway text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                />
              ) : (
                <div className="p-3 rounded-sm border bg-muted/50 min-h-15">
                  <p className="text-sm">
                    {user.bio || "Nenhuma biografia adicionada ainda."}
                  </p>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 justify-end">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="inter font-medium">Estatísticas</CardTitle>
            <CardDescription className="raleway font-medium text-xs">
              Suas atividades na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 rounded-sm bg-muted/50">
                <p className="inter text-xs mb-2 text-stone-600 font-semibold">Receitas Criadas</p>
                <span className="text-2xl font-bold">{statsLoading ? "—" : createdRecipes.length}</span>
              </div>
              <div className="p-4 rounded-sm bg-muted/50">
                <p className="inter text-xs mb-2 text-stone-600 font-semibold">Receita com a maior avaliação</p>
                {statsLoading ? (
                  <span className="text-2xl font-bold">—</span>
                ) : topRatedRecipe ? (
                  <div className="space-y-1">
                    <span className="inter text-sm font-semibold text-stone-900 line-clamp-2">
                      {topRatedRecipe.title}
                    </span>
                    <span className="text-xs text-stone-600">
                      Nota média: <span className="font-semibold">{topRatedRecipe.averageRating.toFixed(1)}</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-stone-600">Você ainda não criou receitas.</span>
                )}
              </div>
              <div className="p-4 rounded-sm bg-muted/50">
                <p className="inter text-xs mb-2 text-stone-600 font-semibold">Receitas favoritas</p>
                <span className="text-2xl font-bold">{statsLoading ? "—" : favoritesCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minhas receitas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="inter font-medium">Minhas receitas</CardTitle>
            <CardDescription className="raleway font-medium text-xs">
              Receitas que você criou na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RecipesSkeleton />
              </div>
            ) : createdRecipes.length === 0 ? (
              <p className="text-sm text-stone-600">Você ainda não criou nenhuma receita.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdRecipes.map((r) => (
                  <RecipeCard key={r.id} recipe={r} showDescription  />
                ))} 
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
