import { User, Mail, Edit2, Save, X, Camera, LogOut, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { RecipeCard } from "@/components/RecipeCard"
import { RecipesSkeleton } from "../skeleton/RecipesSkeleton"
import { useProfile } from "@/hooks/useProfilePage"
import type { Recipe } from "@/lib/recipe"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Profile() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)

  const {
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
  } = useProfile()

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
                  {avatar || user?.avatar ? (
                    <Avatar className="w-24 h-24 border-2">
                      <AvatarImage src={avatar || user?.avatar} alt={user?.name} />
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
                      {avatar || user?.avatar
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
                  <span className="inter text-sm">{user?.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 p-2 rounded-sm border bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="inter text-sm">{user?.email}</span>
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
                    {user?.bio || "Nenhuma biografia adicionada ainda."}
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
                  <Button variant="outline" onClick={() => setLogoutDialogOpen(true)}>
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
                  <div key={r.id} className="relative">
                    <RecipeCard recipe={r} onButtonFavorite />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-14 left-4 z-20 h-9 w-9 rounded-full shadow-md opacity-90 hover:opacity-100"
                      disabled={deletingRecipeId === r.id}
                      aria-label={`Excluir receita ${r.title}`}
                      onClick={() => setRecipeToDelete(r)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja sair da sua conta?</DialogTitle>
            <DialogDescription>
              Você será desconectado e voltará para a página inicial.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                setLogoutDialogOpen(false)
                await handleLogout()
              }}
            >
              Confirmar saída
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(recipeToDelete)}
        onOpenChange={(open) => {
          if (!open) setRecipeToDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir receita</DialogTitle>
            <DialogDescription>
              {recipeToDelete
                ? `Tem certeza que deseja excluir "${recipeToDelete.title}"? Esta ação não pode ser desfeita.`
                : "Esta ação não pode ser desfeita."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRecipeToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={!recipeToDelete || deletingRecipeId === recipeToDelete.id}
              onClick={async () => {
                if (!recipeToDelete) return
                const selected = recipeToDelete
                setRecipeToDelete(null)
                await handleDeleteRecipe(selected)
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
