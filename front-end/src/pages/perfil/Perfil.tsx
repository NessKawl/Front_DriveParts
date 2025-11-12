import ProductsGrid from "../../components/cards/ProductsGridHistorico";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import FooterMain from "../../components/footer/FooterMain";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/dataService";
import { getReservasAtivas, getHistoricoGeral } from "../../services/historicoService";

export default function Perfil() {
    const navigate = useNavigate()
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
    // const products = [
    //     {
    //         image: "/produtos/cabecote.png",
    //         name: "JUNTA CABECOTE - HISTÓRICO",
    //         reserva: "Reservado em 20/10/2025",
    //         status: "Finalizado",
    //     },
    //     {
    //         image: "/produtos/cabecote.png",
    //         name: "JUNTA CABECOTE - HISTÓRICO",
    //         reserva: "Reservado em 20/10/2025",
    //         status: "Cancelado",
    //     },
    //     {
    //         image: "/produtos/cabecote.png",
    //         name: "JUNTA CABECOTE - ATIVA",
    //         praso: "Reservado até as 18:00 de 13/10/2025",
    //     },
    // ]
    const [nome, setNome] = useState<any>(null);
    const [tel, setTel] = useState<any>(null);
    const [reservasAtivas, setReservasAtivas] = useState<any[]>([]);
    const [historico, setHistorico] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserAndReservas = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;


                const response = await getUserProfile();
                setNome(response.data.usu_nome);
                setTel(response.data.usu_tel);


                const reservasAtivasRaw = await getReservasAtivas(token);
                const historicoRaw = await getHistoricoGeral(token);

                // Mapear para ProductsGrid
                const mapearReservas = (lista: any[]) =>
                    lista.map((reserva) => ({
                        image: "/produtos/cabecote.png",
                        name: reserva.ite_itemVenda[0]?.pro_produto?.pro_nome || `Reserva #${reserva.ven_id}`,
                        reserva: new Date(reserva.ven_data_criacao).toLocaleDateString("pt-BR"),
                        status: reserva.ven_status,
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
        telefone: tel
    }

    return (
        <div className="bg-ice min-h-screen ">
            <NavBarSimples rota={"catalogo"} />
            <main>
                <header className=" flex justify-center items-center px-6 py-3 shadow">
                    <h1 className="text-2xl font-bold">Seu Perfil</h1>
                </header>
                <div className="flex justify-center my-10">
                    <div className="bg-white shadow-xl rounded-xl p-4 w-[350px] text-center">
                        <div className=" flex justify-end">
                            <button
                                className="flex items-center gap-2 bg-white hover:bg-primary-orange border hover:border-primary-orange px-3 py-1 rounded transition"
                                onClick={() => navigate("/editar-perfil")}
                            >
                                <Edit size={18} /> Editar
                            </button>
                        </div>
                        <div className="flex flex-col items-center mt-4">
                            <div className="w-26 h-26 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white mb-3">
                                <User size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.nome}</h2>
                            <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                                <Phone size={16} /> {user.telefone}
                            </p>
                        </div>
                        <button
                            className="mt-6 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full"
                            onClick={() => {
                                // Lógica de logout aqui
                                navigate("/catalogo")
                            }}
                        >
                            <LogOut size={20} /> Desconectar
                        </button>
                    </div>
                </div>

                <div className="md:px-10 mb-2">
                    <ProductsGrid
                        filtro={false}
                        title="Suas Reservas Ativas"
                        tipo="reservasAtivas"
                        products={reservasAtivas}
                    />
                </div>
                <div className="md:px-10">
                    <ProductsGrid
                        filtro={true}
                        filtroChildren={filtros}
                        tituloFiltro="Período"
                        title="Histórico de Reservas"
                        tipo="historico"
                        products={historico}
                    />
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    )
}