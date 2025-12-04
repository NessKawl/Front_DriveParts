import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PWABadge from "../PWABadge";
import { dashboardRoutes } from "./DashboardRoutes"
import { Navigate } from "react-router-dom";


const Catalogo = lazy(() => import("../pages/Catalogo"));
const Login = lazy(() => import("../pages/Login"));
const Cadastro = lazy(() => import("../pages/Cadastro"));
const Reserva = lazy(() => import("../pages/produto/Reserva"));
const DetalheProduto = lazy(() => import("../pages/produto/DetalheProduto"));
const Pesquisa = lazy(() => import("../pages/Pesquisa"));
const Perfil = lazy(() => import("../pages/perfil/Perfil"));
const Verificacao = lazy(() => import("../pages/verificacao"));
const TermosDeUso = lazy(() => import("../pages/TermosDeUso"));
const EditarPerfil = lazy(() => import("../pages/perfil/EditarPerfil"));
const RecuperarSenha = lazy(() => import("../pages/RecuperarSenha"));
const ValidarUsuario = lazy(() => import("../pages/ValidarUsuario"))

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen text-primary-orange">
      <span className="animate-pulse text-xl font-semibold">Carregando...</span>
    </div>
  );
}
export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
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
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/validar-usuario" element={<ValidarUsuario />} />
          {/* rotas do dashboard importadas diretamente */}
          {dashboardRoutes}
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </Suspense>

      <PWABadge />
    </>
  );
}
