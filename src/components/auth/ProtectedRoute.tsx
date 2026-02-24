import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/skeleton/PageLoader"
import AuthModal from "../authComponents/AuthModal"
import { useUI } from "@/contexts/AuthModalContext"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { isAuthOpen, closeAuth, openAuth } = useUI()

  useEffect(() => {
    if (!loading && !user) {
      // abre o modal quando não há usuário
      openAuth?.("login")
    }
    if (user) {
      // fecha caso o usuário esteja presente
      closeAuth?.()
    }
  }, [loading, user, openAuth, closeAuth])

  if (loading) return <PageLoader />

  if (!user) {
    return <AuthModal
      isOpen={isAuthOpen}
      onClose={closeAuth}
       />
  }

  return <>{children}</>
}
