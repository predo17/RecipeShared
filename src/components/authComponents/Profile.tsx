import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Edit2, Save, X, Camera, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export default function Profile() {
  const navigate = useNavigate()
  const { user, signOut, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estados do formulário
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
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
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="p-4 rounded-sm bg-muted/50">
                <p className="inter text-xs mb-2 text-stone-600 font-semibold">Avaliações</p>
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="p-4 rounded-sm bg-muted/50">
                <p className="inter text-xs mb-2 text-stone-600 font-semibold">Favoritos</p>
                <span className="text-2xl font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
