import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import ProfilePage from "@/pages/ProfilePage"
import FavoritesPage from "@/pages/FavoritesPage"
import Navbar from "@/components/layout/Navbar"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import CreateRecipePage from "@/pages/CreateRecipePage"
import Footer from "@/components/layout/Footer"
import RecipesPage from "@/pages/RecipesPage"
import RecipesPageDetails from "@/pages/RecipesPageDetails"
import AuthModal from "@/components/authComponents/AuthModal"
import { useUI } from "@/contexts/AuthModalContext"


export default function App() {
  const location = useLocation();
  const { isAuthOpen, authMode, closeAuth } = useUI()


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <Navbar />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={closeAuth}
        defaultMode={authMode} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/details/:title" element={<RecipesPageDetails />} />
        <Route path="/create-recipe" element={<CreateRecipePage />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}
