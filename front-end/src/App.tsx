import PWABadge from './PWABadge.tsx'
import { Routes, Route, useNavigate } from "react-router-dom"
import './App.css'
import Catalogo from './pages/Catalogo.tsx'
import Login from './pages/Login.tsx'
import Cadastro from './pages/Cadastro.tsx'
import DashboardGeral from './pages/dashboard/Geral.tsx'
//import { useEffect } from 'react'

function App() {
  const navigate = useNavigate()
  //useEffect(() => {
  //  const timer = setTimeout(() => {
  //    navigate("/catalogo")
  //  }, 2000)

  //  return () => clearTimeout(timer)
  //}, [navigate])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-3xl font-bold">Tela Inicial</h1>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => navigate("/catalogo")}
              >
                Ir para Catálogo
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => navigate("/login")}
              >
                Ir para login
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => navigate("/cadastro")}
              >
                Ir para cadastro
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => navigate("/dashboard/geral")}
              >
                Ir para dashboard
              </button>
            </div>
          }
        />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/dashboard/geral" element={<DashboardGeral/>}/>
      </Routes>
      <PWABadge />
    </>
  )
}

export default App
