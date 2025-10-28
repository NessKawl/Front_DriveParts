import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PWABadge from "../PWABadge";
import { dashboardRoutes } from "./DashboardRoutes"

const Catalogo = lazy(() => import("../pages/Catalogo"));
const Login = lazy(() => import("../pages/Login"));
const Cadastro = lazy(() => import("../pages/Cadastro"));
const Reserva = lazy(() => import("../pages/produto/Reserva"));
const DetalheProduto = lazy(() => import("../pages/produto/DetalheProduto"));
const Pesquisa = lazy(() => import("../pages/Pesquisa"));
const Perfil = lazy(() => import("../pages/perfil/Perfil"));
const Verificacao = lazy(() => import("../pages/Verificacao"));
const TermosDeUso = lazy(() => import("../pages/TermosDeUso"));
const EditarPerfil = lazy(() => import("../pages/perfil/EditarPerfil"));

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen text-primary-orange">
      <span className="animate-pulse text-xl font-semibold">Carregando...</span>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
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
  );
}

export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/pesquisa" element={<Pesquisa />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/verificacao" element={<Verificacao />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/detalhe-produto" element={<DetalheProduto />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          {/* rotas do dashboard importadas diretamente */}
          {dashboardRoutes}
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </Suspense>

      <PWABadge />
    </>
  );
}
