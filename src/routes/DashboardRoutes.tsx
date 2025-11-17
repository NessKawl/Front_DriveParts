import { Route } from "react-router-dom";
import DashGeral from "../pages/dashboard/DashGeral";
import DashCaixa from "../pages/dashboard/DashCaixa";
import DashProdutos from "../pages/dashboard/DashProdutos";
import DashReservas from "../pages/dashboard/DashReservas";
import DashAnalise from "../pages/dashboard/DashAnalise";
import DashNovaVenda from "../pages/dashboard/DashNovaVenda";

export const dashboardRoutes = (
  <>
    <Route path="/dashboard/geral" element={<DashGeral />} />
    <Route path="/dashboard/caixa" element={<DashCaixa />} />
    <Route path="/dashboard/produtos" element={<DashProdutos />} />
    <Route path="/dashboard/reservas" element={<DashReservas />} />
    <Route path="/dashboard/vendas/analise" element={<DashAnalise />} />
    <Route path="/dashboard/vendas/nova-venda" element={<DashNovaVenda />} />
  </>
);
