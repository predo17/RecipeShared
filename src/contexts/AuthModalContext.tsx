import React, { createContext, useContext, useState } from "react"

type AuthMode = "login" | "register"

type UIContextType = {
  isAuthOpen: boolean
  authMode: AuthMode
  openAuth: (mode?: AuthMode) => void
  closeAuth: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("register")

  const openAuth = (mode: AuthMode = "register") => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }
  const closeAuth = () => setIsAuthOpen(false)

  return (
    <UIContext.Provider value={{ isAuthOpen, authMode, openAuth, closeAuth }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within UIProvider")
  return ctx
}