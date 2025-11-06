import ProductsGrid from "../../components/cards/ProductsGrid";
import NavBarSimples from "../../components/navbar/NavbarSimples";
import FooterMain from "../../components/footer/FooterMain";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/dataService";

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

    const [nome, setNome] = useState<any>(null);
    const [tel, setTel] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return; // usuário não logado, sai da função

                const response = await getUserProfile();
                setNome(response.data.usu_nome); // O Nest retorna req.user
                setTel(response.data.usu_tel)
            } catch (err) {
                console.error("Erro ao obter perfil:", err);
                // Token inválido ou expirado → limpa storage
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        };

        fetchUser();
    }, []);

    const user = {
        nome: nome,
        telefone: tel
    }

    return (
        <div className="bg-ice min-h-screen ">
            <NavBarSimples rota={"catalogo"} />
            <main>
                {/* Header */}
                <header className=" flex justify-center items-center px-6 py-3 shadow">
                    <h1 className="text-2xl font-bold">Seu Perfil</h1>
                </header>
                {/* Card de informações */}
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
                    />
                </div>
                <div className="md:px-10">
                    <ProductsGrid
                        filtro={true}
                        filtroChildren={filtros}
                        tituloFiltro="Período"
                        title="Histórico de Reservas"
                        tipo="historico"
                    />
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    )
}