import PWABadge from './PWABadge.tsx'
import { Routes, Route, useNavigate } from "react-router-dom"
import './App.css'
import Catalogo from './pages/Catalogo.tsx'
import Login from './pages/Login.tsx'
import Cadastro from './pages/Cadastro.tsx'
import DashboardGeral from './pages/dashboard/DashGeral.tsx'
import Reserva from './pages/produto/Reserva.tsx'
import DetalheProduto from './pages/produto/DetalheProduto.tsx'
import Pesquisa from './pages/Pesquisa.tsx'
import Perfil from './pages/perfil/Perfil.tsx'
import Verificacao from './pages/Verificacao.tsx'
import DashReserva from './pages/dashboard/DashReserva.tsx'
import DashCaixa from './pages/dashboard/DashCaixa.tsx'
import DashProdutos from './pages/dashboard/DashProdutos.tsx'
import DashVenda from './pages/dashboard/DashVenda.tsx'
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
                onClick={() => navigate("/login")}
              >
                Ir para login
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
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/dashboard/geral" element={<DashboardGeral/>}/>
        <Route path="/reserva" element={<Reserva/>}/>
        <Route path="/detalhe-produto" element={<DetalheProduto/>}/>
        <Route path="/verificacao" element={<Verificacao/>}/>
        <Route path="*" element={<h1>404</h1>} />

        <Route path="/dashboard/reserva" element={<DashReserva />} />
        <Route path="/dashboard/caixa" element={<DashCaixa />} />
        <Route path="/dashboard/produtos" element={<DashProdutos />} />
        <Route path="/dashboard/vendas" element={<DashVenda />} />
      </Routes>
      <PWABadge />
    </>
  )
}

export default App
