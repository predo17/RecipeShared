import { useState } from "react"
import { X, UserPlus, Mail, Lock, User, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "register"
}

export default function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "register">(defaultMode)

  // Estados do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "register") {
      // Validações para registro
      if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres")
        return
      }

      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem")
        return
      }

      setLoading(true)
      try {
        await signUp(email, password, name)
        toast.success("Conta criada com sucesso!")
        onClose()
      } catch (err: any) {
        toast.error(err.message || "Erro ao criar conta. Tente novamente.")
      } finally {
        setLoading(false)
      }
    } else {
      // Login
      setLoading(true)
      try {
        await signIn(email, password)
        toast.success("Login realizado com sucesso!")
        onClose()
      } catch (err: any) {
        toast.error(err.message || "Erro ao fazer login. Verifique suas credenciais.")
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
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
      <div className="relative w-full h-full max-h-[95vh] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 rounded-sm ">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-3 md:right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm border-2 border-stone-200 hover:border-stone-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <X className="w-5 h-5 text-stone-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full ">
          {/* Lado Esquerdo - Imagem */}
          <div className="hidden lg:block relative bg-linear-to-br from-stone-800 to-stone-600 overflow-hidden">
            {/* Imagem de fundo */}
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Culinária"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Lado Direito - Formulário */}
          <div className="bg-linear-to-b from-stone-50 to-white overflow-y-auto">
            <div className="flex flex-col min-h-full p-4 md:px-8">
              {/* Header do formulário */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-stone-100 to-stone-50 border-2 border-stone-200 rounded-lg flex items-center justify-center shadow-sm">
                    {mode === "register" ? (
                      <UserPlus className="w-6 h-6 text-stone-700" />
                    ) : (
                      <LogIn className="w-6 h-6 text-stone-700" />
                    )}
                  </div>
                  <div className="flex-1 h-px bg-linear-to-r from-stone-200 to-transparent"></div>
                </div>

                <h3 className="inter text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight mb-2 -ml-0.5">
                  {mode === "register" ? "Criar Conta" : "Entrar"}
                </h3>
                <p className="raleway text-xs sm:text-sm text-stone-600 leading-relaxed font-medium mb-3">
                  {mode === "register"
                    ? "Crie sua conta para começar a compartilhar receitas"
                    : "Entre com sua conta para continuar"}
                </p>

                <div className="h-px w-12 bg-stone-300"></div>

              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {mode === "register" && (
                  <div className="space-y-2">
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
                        className="pl-12 h-12 text-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
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
                      className="pl-12 h-12 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
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
                      className="pl-12 h-12 text-sm"
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
                  <div className="space-y-2">
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
                        className="pl-12 h-12 text-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Botão de submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading
                    ? (mode === "register" ? "Criando conta..." : "Entrando...")
                    : (mode === "register" ? "Criar Conta" : "Entrar")}
                </Button>

                {/* Toggle entre login/registro */}
                <div className="raleway text-center pt-2 border-t border-stone-200">
                  <p className="text-xs text-stone-600 font-medium">
                    {mode === "register"
                      ? "Já tem uma conta?"
                      : "Não tem uma conta?"}{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-semibold text-orange-500 hover:underline transition-all cursor-pointer"
                    >
                      {mode === "register" ? "Entrar" : "Criar conta"}
                    </button>
                  </p>
                </div>
              </form>
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