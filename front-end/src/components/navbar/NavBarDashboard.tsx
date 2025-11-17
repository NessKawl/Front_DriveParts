import { useState } from "react";
import Button from "../buttons/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NavBarDashboardProps {
  page: string;
}

export default function NavBarDashboard({ page }: NavBarDashboardProps) {
  const [isActive, setIsActive] = useState(page);
  const [vendasOpen, setVendasOpen] = useState(false);
  const navigate = useNavigate();

  const pages = ["Geral", "Reservas", "Caixa", "Produtos"];

  function handleClick(p: string) {
    setIsActive(p);
    navigate(`/dashboard/${p}`);
  }

  function handleVendasClick() {
    setVendasOpen((prev) => !prev);
  }

  function navigateVendas(subPage: string) {
    setIsActive("Vendas");
    setVendasOpen(false);
    navigate(`/dashboard/vendas/${subPage}`);
  }

  return (
    <div className="bg-black-smooth border-r border-gray-100/20 w-50 text-center text-white flex flex-col justify-between max-h-screen lg:min-h-screen font-bold">
      <img src="/logo-orange-full.png" alt=""  className="w-10/12 mx-auto " onClick={() => navigate("/catalogo")}/>

      <div className="flex flex-col">
        {/* Botões comuns */}
        {pages.map((p) => (
          <Button
            key={p}
            children={p}
            className={clsx(
              "w-full h-20 border-t border-gray-100/20 bg-black-smooth p-5 text-xl transition-colors duration-150",
              isActive === p
                ? "bg-primary-orange text-black-smooth"
                : "hover:text-primary-orange"
            )}
            onClick={() => handleClick(p)}
          />
        ))}

        {/* Botão de Vendas com Dropdown */}
        <div className="relative">
          <Button
            children={
              <div className="flex justify-center items-center gap-2">
                <span>Vendas</span>
                {vendasOpen ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
              </div>
            }
            className={clsx(
              "w-full h-20 border-t border-gray-100/20 bg-black-smooth p-5 text-xl flex items-center justify-center transition-colors duration-150",
              isActive === "Vendas"
                ? "bg-primary-orange text-black-smooth"
                : "hover:text-primary-orange"
            )}
            onClick={handleVendasClick}
          />

          {vendasOpen && (
            <div className="absolute left-0 w-full bg-black-smooth border-l border-r border-b border-gray-100/20 shadow-md z-10">
              <button
                onClick={() => navigateVendas("analise")}
                className="w-full text-left px-5 py-3 hover:bg-primary-orange/10 text-ice text-sm"
              >
                Análise de Vendas
              </button>
              <button
                onClick={() => navigateVendas("nova-venda")}
                className="w-full text-left px-5 py-3 hover:bg-primary-orange/10 text-ice text-sm"
              >
                Nova Venda
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botão Sair */}
      <Button
        children="Sair"
        className="w-full h-20 border-t border-red-alert text-red-alert p-5 text-xl hover:bg-red-alert/10 transition-colors duration-150"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
