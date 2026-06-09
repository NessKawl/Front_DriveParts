import ProductsGrid from "../../components/cards/ProductsGridHistorico";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import FooterMain from "../../components/footer/FooterMain";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, Phone, User, ClipboardList, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getReservasAtivas,
  getHistoricoGeral,
} from "../../services/historicoService";
import { logout } from "../../utils/auth";
import ModalReserva from "../../components/modal/ModalHistórico";

const formatarTelefone = (telefone: string) => {
  if (!telefone) return "";
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return telefone;
  }
};

export default function Perfil() {
  const navigate = useNavigate();
  const filtros = [
    { value: "Hoje", children: "Hoje" },
    { value: "Ultimos 7 dias", children: "Ultimos 7 dias" },
    { value: "Ultimos 30 dias", children: "Ultimos 30 dias" },
    { value: "Ultimos 6 meses", children: "Ultimos 6 meses" },
    { value: "Ultimos 1 ano", children: "Ultimos 1 ano" },
    { value: "Todos", children: "Todos" },
    { value: "Finalizado", children: "Finalizado" },
    { value: "Cancelado", children: "Cancelado" },
  ];

  const userStorage = JSON.parse(localStorage.getItem("user") || "{}");

  const nome = userStorage.usu_nome || "";
  const tel = userStorage.usu_tel || "";
  const [reservasAtivas, setReservasAtivas] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [reservaSelecionada, setReservaSelecionada] = useState<any>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const abrirModalReserva = (item: any) => {
    setReservaSelecionada(item.dadosCompletos);
    setModalAberto(true);
  };

  const fecharModalReserva = () => {
    setModalAberto(false);
    setReservaSelecionada(null);
  };

  useEffect(() => {
    const fetchUserAndReservas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const reservasAtivasRaw = await getReservasAtivas(token);
        const historicoRaw = await getHistoricoGeral(token);

        const mapearReservas = (lista: any[]) =>
          lista.map((reserva) => ({
            image:
              reserva.ite_itemVenda?.[0]?.pro_produto?.pro_caminho_img ||
              "/produtos/sem-imagem.png",
            name:
              reserva.ite_itemVenda?.[0]?.pro_produto?.pro_nome ||
              `Reserva #${reserva.ven_id}`,
            reserva: `Reservado em ${new Date(reserva.ven_data_criacao).toLocaleDateString("pt-BR")}`,
            status: reserva.ven_status,
            dadosCompletos: {
              ...reserva,
              itens: reserva.ite_itemVenda.map((item: any) => ({
                quantidade: item.ite_qtd,
                valor: item.ite_valor,
                nome: item.pro_produto?.pro_nome || "Produto sem nome",
              })),
            },
          }));

        setReservasAtivas(mapearReservas(reservasAtivasRaw));
        setHistorico(mapearReservas(historicoRaw));
      } catch (err) {
        console.error("Erro ao carregar perfil/reservas:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    fetchUserAndReservas();
  }, []);

  const user = {
    nome: nome,
    telefone: tel,
  };

  return (
    <div className="bg-ice min-h-screen">
      <NavBarSimples rota={"catalogo"} />

      <main>
        {/* Hero / Profile Card Section */}
        <section className="relative overflow-hidden">
          {/* Background banner gradient */}
          <div
            className="h-44 w-full"
          >
          </div>

          {/* Card flutuante */}
          <div className="flex justify-center mb-15">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 px-6 pb-6 -mt-20"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
            >
              {/* Botão Editar */}
              <div className="flex justify-end pt-4">
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-orange border border-gray-200 hover:border-primary-orange px-3 py-1.5 rounded-lg transition-all duration-200"
                  onClick={() => navigate("/editar-perfil")}
                >
                  <Edit size={15} />
                  Editar
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center -mt-2">
                <div className="relative">
                  {/* Anel decorativo externo */}
                  <div
                    className="w-28 h-28 rounded-full p-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF961F 0%, #ff6b1a 100%)",
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white p-1">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF961F 0%, #ff6b1a 100%)",
                        }}
                      >
                        <User size={44} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black-smooth mt-4 mb-1">
                  {user.nome || "Usuário"}
                </h2>

                {user.telefone && (
                  <p className="text-gray-500 flex items-center gap-1.5 text-sm">
                    <Phone size={14} className="text-primary-orange" />
                    {formatarTelefone(user.telefone)}
                  </p>
                )}

                {/* Stats rápidas */}
                <div className="flex gap-4 mt-5 w-full">
                  <div
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl"
                    style={{ background: "#fff8f0" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#FF961F20" }}
                    >
                      <ClipboardList size={16} className="text-primary-orange" />
                    </div>
                    <span className="text-xl font-bold text-black-smooth">
                      {reservasAtivas.length}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Ativas
                    </span>
                  </div>

                  <div className="w-px bg-gray-100" />

                  <div
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl"
                    style={{ background: "#f5f5f5" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "#1E1E1E20" }}
                    >
                      <Clock size={16} className="text-black-smooth" />
                    </div>
                    <span className="text-xl font-bold text-black-smooth">
                      {historico.length}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Histórico
                    </span>
                  </div>
                </div>

                {/* Botão Desconectar */}
                <button
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-alert text-red-alert font-semibold hover:bg-red-alert hover:text-white transition-all duration-200"
                  onClick={() => {
                    logout();
                    navigate("/catalogo");
                  }}
                >
                  <LogOut size={17} />
                  Desconectar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Grids de reservas */}
        <div className="md:px-10 mt-10 mb-20">
          <ProductsGrid
            filtro={false}
            title="Suas Reservas Ativas"
            tipo="reservasAtivas"
            products={reservasAtivas}
            onClickItem={abrirModalReserva}
          />
        </div>
        <div className="md:px-10 mb-10">
          <ProductsGrid
            filtro={true}
            filtroChildren={filtros}
            tituloFiltro="Período"
            title="Histórico de Reservas"
            tipo="historico"
            products={historico}
            onClickItem={abrirModalReserva}
          />
        </div>

        {modalAberto && reservaSelecionada && (
          <ModalReserva
            isOpen={modalAberto}
            dados={reservaSelecionada}
            onClose={fecharModalReserva}
          />
        )}
      </main>

      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}
