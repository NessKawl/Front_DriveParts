import { useEffect, useState, useCallback, useMemo } from "react";
import { X, CalendarDays, CalendarCheck, Filter, CalendarRange } from "lucide-react";
//import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { dashboardReservaService } from "../../services/dashboardReservaService";
import Modal from "../../components/modal/Modal";

type StatusReserva = "RESERVA" | "CONCLUIDA" | "CANCELADA" | "EXPIRADA";

interface UsuarioAPI {
    usu_nome?: string;
    usu_tel?: string;
}

interface ProdutoAPI {
    pro_id: number;
    pro_nome: string;
    pro_valor?: number;
}

interface ItemVendaAPI {
    ite_qtd: number;
    pro_produto: ProdutoAPI;
}

interface ReservaAPI {
    ven_id: number;
    ven_data_criacao?: string;
    ven_data_modificacao?: string;
    ven_status?: StatusReserva;
    ven_valor?: number;
    ven_periodo?: string;
    usu_usuario?: UsuarioAPI;
    ite_itemVenda?: ItemVendaAPI[];
}

interface ProdutoFormatado {
    codigo: number;
    produto: string;
    valor: string;
}

interface ReservaFormatada {
    id: number;
    cliente: string;
    telefone: string;
    quantidade: number;
    total: string;
    periodo: string;
    status: StatusReserva | string;
    produtos: ProdutoFormatado[];
    data?: string;
}

interface DadosGrafico {
    name: string;
    vendidas: number;
    canceladas: number;
    [key: string]: string | number;
}

const formatarTelefone = (telefone?: string): string => {
    if (!telefone) return "—";
    const apenasNumeros = telefone.replace(/\D/g, "");
    const match = apenasNumeros.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        const [, ddd, prefixo, sufixo] = match;
        return `(${ddd}) ${prefixo}-${sufixo}`;
    }
    return telefone;
};

const formatarData = (data?: string): string => {
    if (!data) return "—";
    const d = new Date(data);
    if (isNaN(d.getTime())) return "—";

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, "0");
    const minutos = String(d.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
};

const gerarDataReservas = (reservas: ReservaAPI[]): DadosGrafico[] => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const data: DadosGrafico[] = meses.map((m) => ({ name: m, vendidas: 0, canceladas: 0 }));

    reservas.forEach((r) => {
        if (!r.ven_data_modificacao) return;

        const dataCriacao = new Date(r.ven_data_modificacao);
        if (isNaN(dataCriacao.getTime())) return;

        const mes = dataCriacao.getMonth();
        if (r.ven_status === "CONCLUIDA") data[mes].vendidas++;
        if (r.ven_status === "CANCELADA") data[mes].canceladas++;
    });
    return data;
};

const formatarReservasParaTabela = (data: ReservaAPI[]): ReservaFormatada[] => {
    return data.map((r) => {
        const quantidade = r.ite_itemVenda?.reduce((acc, i) => acc + i.ite_qtd, 0) ?? 0;
        const total = r.ven_valor?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        }) ?? "—";

        const produtos = r.ite_itemVenda?.map((i) => ({
            codigo: i.pro_produto.pro_id,
            produto: i.pro_produto.pro_nome,
            valor: i.pro_produto.pro_valor?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }) ?? "—",
        })) ?? [];

        return {
            id: r.ven_id,
            data: r.ven_data_criacao,
            cliente: r.usu_usuario?.usu_nome || "—",
            telefone: formatarTelefone(r.usu_usuario?.usu_tel),
            quantidade,
            total,
            periodo: r.ven_periodo || "—",
            status: r.ven_status || "—",
            produtos,
        };
    });
};

export default function DashReservas() {
    const navigate = useNavigate();
    const [reservasAPI, setReservasAPI] = useState<ReservaAPI[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState<ReservaFormatada | null>(null);
    const [filtroSelecionado, setFiltroSelecionado] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [ordenacao, setOrdenacao] = useState<"mais-recentes" | "mais-antigas">("mais-recentes");
    const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
    const [idReservaCancelar, setIdReservaCancelar] = useState<number | null>(null);
    const [modalSucessoOpen, setModalSucessoOpen] = useState(false);
    const [modalSucessoMensagem, setModalSucessoMensagem] = useState("");

    const abrirModalSucesso = (mensagem: string, onConfirm?: () => void) => {
        setModalSucessoMensagem(mensagem);
        setModalSucessoOpen(true);
        if (onConfirm) {
            const originalOnClose = () => {
                setModalSucessoOpen(false);
                onConfirm();
            };
            setModalSucessoOpen(true);
            return originalOnClose;
        }
    };

    const confirmarCancelamento = async () => {
        if (!idReservaCancelar) return;

        await atualizarStatus(idReservaCancelar, "CANCELADA");

        setModalConfirmOpen(false);
        setIdReservaCancelar(null);
        setIsOpen(false);
    };

    const carregarReservas = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dashboardReservaService.listarReservas();
            setReservasAPI(data);
            setErro(null);
        } catch (error) {
            console.error(error);
            setErro("Falha ao carregar reservas.");
        } finally {
            setLoading(false);
        }
    }, []);

    const atualizarStatus = useCallback(async (id: number, status: "CANCELADA") => {
        try {
            await dashboardReservaService.atualizarStatusReserva(id, status);
            abrirModalSucesso(`Reserva ${status.toLowerCase()} com sucesso!`, () => {
                carregarReservas();
            });

            carregarReservas();

            const novasAtivas = await dashboardReservaService.getReservasAtivas();
            setReservasAtivas(novasAtivas);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    }, [carregarReservas]);

    useEffect(() => {
        carregarReservas();
    }, [carregarReservas]);

    const reservasFormatadas = useMemo(() => {
        const formatadas = formatarReservasParaTabela(reservasAPI);

        return formatadas.sort((a, b) => {
            const dataA = a.data ? new Date(a.data).getTime() : 0;
            const dataB = b.data ? new Date(b.data).getTime() : 0;

            if (ordenacao === "mais-recentes") return dataB - dataA;
            return dataA - dataB;
        });
    }, [reservasAPI, ordenacao]);

    const reservasFiltradas = useMemo(() => {
        switch (filtroSelecionado) {
            case "ativas": return reservasFormatadas.filter(r => r.status === "RESERVA");
            case "vendidas": return reservasFormatadas.filter(r => r.status === "CONCLUIDA");
            case "canceladas": return reservasFormatadas.filter(r => r.status === "CANCELADA");
            case "expiradas": return reservasFormatadas.filter(r => r.status === "EXPIRADA");
            default: return reservasFormatadas;
        }
    }, [filtroSelecionado, reservasFormatadas]);

    const dadosGrafico = useMemo(
        () => gerarDataReservas(reservasAPI),
        [reservasAPI]
    );

    const filtros = [
        { value: "Todos", children: "todos" },
        { value: "Ativas", children: "ativas" },
        { value: "Vendidas", children: "vendidas" },
        { value: "Canceladas", children: "canceladas" },
        { value: "Expiradas", children: "expiradas" },
    ];

    const colunasReservas = [
        { chave: "cliente", titulo: "Cliente", size: "md" },
        { chave: "telefone", titulo: "Telefone", size: "md" },
        { chave: "quantidade", titulo: "Qtd", size: "sm" },
        { chave: "total", titulo: "Total", size: "sm" },
        { chave: "periodo", titulo: "Período", size: "lg" },
        { chave: "status", titulo: "Status", size: "md" },
    ];

    const colunasListaProdutos = [
        { chave: "codigo", titulo: "Código", size: "sm" },
        { chave: "produto", titulo: "Produto", size: "auto" },
        { chave: "valor", titulo: "Valor", size: "md" },
    ];

    const [reservasAtivas, setReservasAtivas] = useState(0);

    useEffect(() => {
        dashboardReservaService
            .getReservasAtivas()
            .then((data) => setReservasAtivas(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="flex bg-[#080808] h-screen overflow-hidden">
            <NavBarDashboard page="Reservas" />

            <div className="flex-1 flex flex-col p-5 text-white overflow-hidden h-screen">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestão de Reservas</h1>
                        <p className="text-gray-400 text-xs mt-0.5">Monitore agendamentos e converta reservas pendentes em vendas.</p>
                    </div>
                </div>

                {/* Dashboard Stats & Graphic Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                    {/* Card Estatístico */}
                    <div className="lg:col-span-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:border-[#222]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reservas Ativas</span>
                            <span className="text-3xl font-bold text-white mt-1">{reservasAtivas}</span>
                        </div>
                        <div className="bg-[#FF961F]/10 text-[#FF961F] border border-[#FF961F]/20 w-10 h-10 rounded-lg flex items-center justify-center">
                            <CalendarDays size={20} />
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="lg:col-span-8 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3 flex flex-col hover:border-[#222] transition-colors">
                        <GraficoLinhas
                            titulo="Reservas Mensais"
                            data={dadosGrafico}
                            heightClass="w-full h-24"
                            series={[
                                { key: "vendidas", color: "#369638", label: "Reservas Concluídas" },
                                { key: "canceladas", color: "#FF2817", label: "Reservas Canceladas" },
                            ]}
                        />
                    </div>
                </div>

                {/* Main Content: Table & Filters */}
                <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex-1 flex flex-col gap-3 overflow-hidden transition-all duration-200 hover:border-[#222]">
                    
                    <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                                <CalendarCheck size={15} />
                            </div>
                            <span className="text-sm font-semibold text-white">Listagem de Reservas</span>
                        </div>

                        {/* Controles de Filtro */}
                        <div className="flex items-center gap-2">
                            {/* Filtro status */}
                            <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                                <Filter size={10} className="text-gray-500 mr-1.5" />
                                <select
                                    value={filtroSelecionado}
                                    onChange={(e) => setFiltroSelecionado(e.target.value)}
                                    className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                                >
                                    {filtros.map(f => (
                                        <option key={f.children} value={f.children} className="bg-[#121212]">{f.value}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Ordenação data */}
                            <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                                <CalendarRange size={10} className="text-gray-500 mr-1.5" />
                                <select
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value as "mais-recentes" | "mais-antigas")}
                                    className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                                >
                                    <option value="mais-recentes" className="bg-[#121212]">Recentes</option>
                                    <option value="mais-antigas" className="bg-[#121212]">Antigas</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <p className="text-gray-400 py-4 text-center">Carregando reservas...</p>
                        ) : erro ? (
                            <p className="text-red-500 py-4 text-center">{erro}</p>
                        ) : (
                            <TabelaLista
                                titulo=""
                                colunas={colunasReservas}
                                fetchData={async () => reservasFiltradas}
                                alturaMax="max-h-52"
                                acoes={[
                                    {
                                        label: "Detalhes",
                                        cor: "bg-[#FF961F] text-black hover:bg-orange-400",
                                        onClick: (item: ReservaFormatada) => {
                                            setSelectedReserva(item);
                                            setIsOpen(true);
                                        },
                                    },
                                ]}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Detalhes */}
            {isOpen && selectedReserva && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/60 z-50">
                    <div className="flex flex-col justify-between bg-[#0D0D0D] border border-[#1A1A1A] h-[85%] w-[55%] rounded-2xl p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">

                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-row justify-between items-center border-b border-[#1A1A1A] pb-3">
                                <h1 className="text-lg font-light text-gray-300">
                                    Reserva de <span className="text-xl font-semibold text-[#FF961F]">{selectedReserva.cliente}</span>
                                </h1>
                                <X
                                    size={24}
                                    color="#FFF"
                                    onClick={() => { setIsOpen(false); setSelectedReserva(null); }}
                                    className="cursor-pointer hover:scale-110 transition-transform opacity-70 hover:opacity-100"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm bg-[#121212]/50 p-4 border border-[#1A1A1A] rounded-xl">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Telefone</span>
                                    <span className="font-semibold text-white mt-0.5">{selectedReserva.telefone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Período</span>
                                    <span className="font-semibold text-white mt-0.5">{selectedReserva.periodo}</span>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Data de Criação</span>
                                    <span className="font-semibold text-white mt-0.5">{formatarData(selectedReserva.data)}</span>
                                </div>
                            </div>

                            <div className="mt-2 border border-[#1A1A1A] rounded-xl overflow-hidden">
                                <TabelaLista
                                    titulo="Lista de Produtos"
                                    colunas={colunasListaProdutos}
                                    fetchData={async () => selectedReserva.produtos}
                                    alturaMax="max-h-24"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-[#1A1A1A] pt-4 mt-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs text-gray-500 font-bold uppercase">Valor Total</span>
                                <span className="text-xl font-bold text-[#369638] font-mono">{selectedReserva.total}</span>
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                {selectedReserva.status === "RESERVA" && (
                                    <Button
                                        onClick={() => {
                                            setIdReservaCancelar(selectedReserva.id);
                                            setModalConfirmOpen(true);
                                        }}
                                        children="Cancelar reserva"
                                        className="border border-[#FF2817] text-[#FF2817] hover:bg-[#FF2817]/10 font-semibold py-2 px-4 rounded-xl text-xs transition duration-200"
                                    />
                                )}
                                {selectedReserva.status === "RESERVA" && (
                                    <Button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setSelectedReserva(null);
                                            navigate(`/dashboard/vendas/nova-venda?reserva=${selectedReserva.id}`);
                                        }}
                                        children="Ir para venda"
                                        className="bg-[#369638] text-white hover:bg-green-600 font-semibold py-2 px-4 rounded-xl text-xs transition duration-200"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={modalConfirmOpen}
                title="Cancelar Reserva"
                message="Tem certeza que deseja cancelar esta reserva?"
                actionText="Sim, cancelar"
                cancelText="Não"
                onClose={() => setModalConfirmOpen(false)}
                onAction={confirmarCancelamento}
                onCancel={() => setModalConfirmOpen(false)}
            />

            <Modal
                isOpen={modalSucessoOpen}
                title="Sucesso"
                message={modalSucessoMensagem}
                actionText="OK"
                onClose={() => setModalSucessoOpen(false)}
                onAction={() => setModalSucessoOpen(false)}
            />
        </div>
    );
}

