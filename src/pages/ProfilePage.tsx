import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Edit2, Save, X, Camera } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { updateUserProfile } from "@/lib/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      await updateUserProfile(user.id, {
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: avatar.trim() || undefined,
      })
      await refreshUser()
      setIsEditing(false)
      setSuccess("Perfil atualizado com sucesso!")
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil")
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
    setError(null)
    setSuccess(null)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        {!isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Gerencie suas informações de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatar || user.avatar ? (
                  <img
                    src={avatar || user.avatar}
                    alt={user.name || "Avatar"}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
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
                <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name || "Não informado"}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <p className="text-xs text-muted-foreground">
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
                <div className="p-3 rounded-md border bg-muted/50 min-h-15">
                  <p className="text-sm">
                    {user.bio || "Nenhuma biografia adicionada ainda."}
                  </p>
                </div>
              )}
            </div>

            {/* Mensagens de erro/sucesso */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Botões de ação */}
            {isEditing && (
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas (futuro) */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>
              Suas atividades na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Receitas Criadas</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Avaliações</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Favoritos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
