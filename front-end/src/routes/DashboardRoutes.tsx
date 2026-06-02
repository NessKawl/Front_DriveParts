import { Route } from "react-router-dom";
import DashGeral from "../pages/dashboard/DashGeral";
import DashCaixa from "../pages/dashboard/DashCaixa";
import DashProdutos from "../pages/dashboard/DashProdutos";
import DashReservas from "../pages/dashboard/DashReservas";
import DashAnalise from "../pages/dashboard/DashAnalise";
import DashNovaVenda from "../pages/dashboard/DashNovaVenda";
import ProdfutoForm from "../pages/dashboard/ProdfutoForm";
import DashMovimentacoes from "../pages/dashboard/DashMovimentacoes";
import ProtectedRoute from "./ProtectedRoute";

export const dashboardRoutes = (
  <>
    <Route path="/dashboard/geral" element={<ProtectedRoute><DashGeral /></ProtectedRoute>} />
    <Route path="/dashboard/caixa" element={<ProtectedRoute><DashCaixa /></ProtectedRoute>} />
    <Route path="/dashboard/produtos" element={<ProtectedRoute><DashProdutos /></ProtectedRoute>} />
    <Route path="/dashboard/reservas" element={<ProtectedRoute><DashReservas /></ProtectedRoute>} />
    <Route path="/dashboard/movimentacoes" element={<ProtectedRoute><DashMovimentacoes /></ProtectedRoute>} />
    <Route path="/dashboard/vendas/analise" element={<ProtectedRoute><DashAnalise /></ProtectedRoute>} />
    <Route path="/dashboard/vendas/nova-venda" element={<ProtectedRoute><DashNovaVenda /></ProtectedRoute>} />
    <Route path="/dashboard/teste" element={<ProtectedRoute><ProdfutoForm /></ProtectedRoute>} />
  </>
);

