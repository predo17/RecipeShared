import { useState } from "react"
import { X, UserPlus, Mail, Lock, User, LogIn, ChefHat } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export default function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  // Estados do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (mode === "register") {
      // Validações para registro
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres")
        return
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem")
        return
      }

      setLoading(true)
      try {
        await signUp(email, password, name)
        setSuccess("Conta criada com sucesso!")
        setTimeout(() => {
          onClose()
          navigate("/profile")
        }, 1500)
      } catch (err: any) {
        setError(err.message || "Erro ao criar conta. Tente novamente.")
      } finally {
        setLoading(false)
      }
    } else {
      // Login
      setLoading(true)
      try {
        await signIn(email, password)
        setSuccess("Login realizado com sucesso!")
        setTimeout(() => {
          onClose()
          navigate("/profile")
        }, 1500)
      } catch (err: any) {
        setError(err.message || "Erro ao fazer login. Verifique suas credenciais.")
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setError(null)
    setSuccess(null)
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Overlay clicável */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm border-2 border-stone-200 hover:border-stone-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <X className="w-5 h-5 text-stone-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[95vh]">
          {/* Lado Esquerdo - Imagem */}
          <div className="hidden lg:block relative bg-linear-to-br from-stone-800 to-stone-600 overflow-hidden">
            {/* Imagem de fundo */}
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Culinária"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Overlay com textura */}
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/95 via-stone-900/50 to-transparent"></div>

            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              }}>
            </div>

            {/* Conteúdo */}
            <div className="relative h-full flex flex-col justify-end p-12 lg:p-16">
              {/* Logo */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center shadow-xl">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-serif font-semibold text-white tracking-tight"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                    RecipeShared
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-serif leading-tight text-white mb-4 tracking-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  Compartilhe suas{" "}
                  <span className="italic relative inline-block">
                    receitas favoritas
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-amber-400/60 to-transparent"></div>
                  </span>
                </h2>

                <p className="text-lg text-white/80 leading-relaxed font-light max-w-md"
                  style={{ fontFamily: '"Source Serif Pro", Georgia, serif' }}>
                  Faça parte de uma comunidade apaixonada por gastronomia. Descubra, crie e inspire.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/20">
                  <div>
                    <p className="text-2xl font-light text-white tabular-nums">500+</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Receitas</p>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div>
                    <p className="text-2xl font-light text-white tabular-nums">100+</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Chefs</p>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div>
                    <p className="text-2xl font-light text-white tabular-nums">4.8★</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60 mt-1">Avaliação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="bg-linear-to-b from-stone-50 to-white overflow-y-auto">
            <div className="flex flex-col min-h-full p-8 lg:p-12 xl:p-16">
              {/* Header do formulário */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-linear-to-br from-stone-100 to-stone-50 border-2 border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
                    {mode === "register" ? (
                      <UserPlus className="w-6 h-6 text-stone-700" />
                    ) : (
                      <LogIn className="w-6 h-6 text-stone-700" />
                    )}
                  </div>
                  <div className="h-px flex-1 bg-stone-200"></div>
                </div>

                <h3 className="text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight mb-3"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {mode === "register" ? "Criar Conta" : "Entrar"}
                </h3>
                <p className="text-stone-600 leading-relaxed font-light"
                  style={{ fontFamily: '"Source Serif Pro", Georgia, serif' }}>
                  {mode === "register"
                    ? "Crie sua conta para começar a compartilhar receitas"
                    : "Entre com sua conta para continuar"}
                </p>

                {/* Linha decorativa */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px w-12 bg-stone-300"></div>
                  <div className="flex gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                    <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                    <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {mode === "register" && (
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-stone-900">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 h-12 border-stone-300 focus:border-stone-500 focus-visible:ring-stone-300"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-stone-900">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-stone-300 focus:border-stone-500 focus-visible:ring-stone-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-stone-900">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-12 border-stone-300 focus:border-stone-500 focus-visible:ring-stone-300"
                      required
                      minLength={6}
                    />
                  </div>
                  {mode === "register" && (
                    <p className="text-xs text-stone-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                      Mínimo de 6 caracteres
                    </p>
                  )}
                </div>

                {mode === "register" && (
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-stone-900">
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 h-12 border-stone-300 focus:border-stone-500 focus-visible:ring-stone-300"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Mensagens */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-sm">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <LogIn className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}

                {/* Botão de submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-linear-to-r from-stone-800 to-stone-700 hover:from-stone-900 hover:to-stone-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading
                    ? (mode === "register" ? "Criando conta..." : "Entrando...")
                    : (mode === "register" ? "Criar Conta" : "Entrar")}
                </Button>

                {/* Toggle entre login/registro */}
                <div className="text-center pt-4 border-t border-stone-200">
                  <p className="text-sm text-stone-600 font-light">
                    {mode === "register"
                      ? "Já tem uma conta?"
                      : "Não tem uma conta?"}{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-stone-900 hover:underline transition-all"
                    >
                      {mode === "register" ? "Entrar" : "Criar conta"}
                    </button>
                  </p>
                </div>
              </form>

              {/* Ornamento inferior */}
              <div className="flex items-center justify-center gap-1.5 mt-8 opacity-15">
                <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                <div className="w-1 h-1 rounded-full bg-stone-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        
        .animate-in {
          animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}