import { useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Wallet, 
  Package, 
  ArrowUpDown, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  LogOut 
} from "lucide-react";
import { dashboardReservaService } from "../../services/dashboardReservaService";

interface NavBarDashboardProps {
  page: string;
}

export default function NavBarDashboard({ page }: NavBarDashboardProps) {
  const navigate = useNavigate();
  
  // Set dropdown to open initially if the active page is "Análise de Vendas" or related to Vendas
  const [vendasOpen, setVendasOpen] = useState(
    page === "Análise de Vendas" || page === "Vendas" || page === "Nova Venda"
  );

  const menuItems = [
    { name: "Geral", path: "/dashboard/geral", icon: Home },
    { name: "Reservas", path: "/dashboard/reservas", icon: Calendar },
    { name: "Caixa", path: "/dashboard/caixa", icon: Wallet },
    { name: "Produtos", path: "/dashboard/produtos", icon: Package },
    { name: "Movimentações", path:`${import.meta.env.VITE_LARAVEL_URL}/dashboard/Movimentacoes`, icon: ArrowUpDown },
  ];

  function handleNavigation(path: string) {
      if (path.startsWith("http")) {
    window.location.href = path;
    return;
  }
  
    navigate(path);
  }

  function handleVendasClick() {
    setVendasOpen((prev) => !prev);
  }

  function navigateVendas(subPage: string) {
    setVendasOpen(false);
    navigate(`/dashboard/vendas/${subPage}`);
  }

  const isVendasActive = page === "Vendas" || page === "Análise de Vendas" || page === "Nova Venda";

  return (
    <div className="bg-[#0A0A0A] border-r border-[#151515] w-54 text-white flex flex-col justify-between min-h-screen p-5 font-sans">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="mb-8 mt-2 flex justify-center border-b-1 border-[#151515]">
          <img 
            src="/logo-orange-full.png" 
            alt="DriveParts" 
            className="w-11/12 mx-auto cursor-pointer hover:opacity-90 transition-opacity duration-150" 
            onClick={() => navigate("/catalogo")} 
          />
        </div>

        {/* Section Heading */}
        <p className="text-[11px] uppercase font-bold text-[#555] tracking-[0.15em] pl-3 mb-4">
          Menu Principal
        </p>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = page.toLowerCase() === item.name.toLowerCase();

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={clsx(
                  "flex items-center gap-3 w-full py-4 px-4 rounded-xl font-medium text-sm transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#FF7E1F] to-[#FF961F] text-white shadow-[0_4px_15px_rgba(255,150,31,0.25)] font-semibold"
                    : "text-[#8E8E93] hover:bg-[#121212] hover:text-white"
                )}
              >
                <div className={clsx(isActive ? "bg-white/20" : "bg-[#1a1a1a]", "flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all duration-300 group-hover:scale-110")}>
                  <Icon size={22} className={clsx(isActive ? "text-white" : "text-gray-400")} />
                </div>
                
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* Vendas Dropdown Item */}
          <div className="relative">
            <button
              onClick={handleVendasClick}
              className={clsx(
                "flex items-center justify-between w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200",
                isVendasActive
                  ? "bg-gradient-to-r from-[#FF7E1F] to-[#FF961F] text-white shadow-[0_4px_15px_rgba(255,150,31,0.25)] font-semibold"
                  : "text-[#8E8E93] hover:bg-[#121212] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={clsx(isVendasActive ? "bg-white/20" : "bg-[#1a1a1a]", "flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all duration-300 group-hover:scale-110")}>
                  <Tag size={18} className={clsx(isVendasActive ? "text-white" : "text-[#8E8E93]")} />
                </div>
                <span>Vendas</span>
              </div>
              {vendasOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {vendasOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-[#222] flex flex-col gap-1 transition-all duration-200">
                <button
                  onClick={() => navigateVendas("analise")}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#8E8E93] hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Análise de Vendas
                </button>
                <button
                  onClick={async () => {
                    try {
                      const novaVenda = await dashboardReservaService.criarNovaVenda();
                      if (!novaVenda?.id) {
                        alert("Erro: não foi possível criar nova venda");
                        return;
                      }
                      navigate(`/dashboard/vendas/nova-venda?reserva=${novaVenda.id}`);
                    } catch (err) {
                      console.error(err);
                      alert("Erro ao criar nova venda!");
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#8E8E93] hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Nova Venda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sair do Sistema (Logout) */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 mt-auto rounded-xl border border-[#222] bg-[#121212]/30 hover:bg-[#FF2817]/10 hover:border-[#FF2817]/40 hover:text-[#FF2817] text-white/80 text-sm font-semibold transition-all duration-200"
      >
        <LogOut size={16} />
        <span>Sair do Sistema</span>
      </button>
    </div>
  );
}

