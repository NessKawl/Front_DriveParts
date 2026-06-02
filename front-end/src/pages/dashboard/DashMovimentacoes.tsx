import NavBarDashboard from "../../components/navbar/NavBarDashboard";

export default function DashMovimentacoes() {
  return (
    <div className="flex min-h-screen bg-[#080808]">
      <NavBarDashboard page="Movimentações" />
      <div className="flex-1 flex flex-col p-8 text-white">
        <h1 className="text-3xl font-semibold text-[#FF961F]">Últimas Movimentações</h1>
        <p className="text-gray-400 mt-1">Acompanhe as entradas e saídas recentes do caixa.</p>
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#1E1E1E] rounded-2xl mt-6 bg-[#0D0D0D]">
          <span className="text-gray-500 font-medium">Tela em desenvolvimento (API externa pendente)</span>
        </div>
      </div>
    </div>
  );
}
