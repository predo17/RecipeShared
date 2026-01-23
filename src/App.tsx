import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"

import HomePage from "./pages/HomePage"

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </>
  )
}
