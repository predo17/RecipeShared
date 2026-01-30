import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import Navbar from "./components/layout/Navbar"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import CreateRecipePage from "./pages/CreateRecipePage"
import Footer from "./components/layout/Footer"
import RecipesPage from "./pages/RecipesPage"
import RecipesPageDetails from "./pages/RecipesPageDetails"

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/recipes" element={<RecipesPage/>} />
         <Route path="/recipes/details/:title" element={<RecipesPageDetails/>} />
        <Route path="/create-recipe" element={<CreateRecipePage/>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}
