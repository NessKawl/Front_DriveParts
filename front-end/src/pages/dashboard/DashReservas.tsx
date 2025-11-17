import { useEffect, useState, useCallback, useMemo } from "react";
import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { X } from "lucide-react";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import { dashboardReservaService } from "../../services/dashboardReservaService";

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
            alert(`Reserva ${status.toLowerCase()} com sucesso!`);
            carregarReservas();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status.");
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

            if (ordenacao === "mais-recentes") return dataB - dataA; // do mais recente para o mais antigo
            return dataA - dataB; // do mais antigo para o mais recente
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
        { chave: "quantidade", titulo: "Quantidade", size: "md" },
        { chave: "total", titulo: "Total (R$)", size: "md" },
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

        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Reservas" />

            <div className="flex flex-col justify-center gap-2 py-5 px-5 w-screen">
                <div className="flex flex-row w-full gap-5">
                    <CardEstatistica
                        className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 w-60 h-full"
                        titulo="RESERVAS ATIVAS"
                        valor={reservasAtivas}
                    />
                    <GraficoLinhas
                        titulo="Reservas Mensais"
                        data={dadosGrafico}
                        series={[
                            { key: "vendidas", color: "#22C55E", label: "Reservas Vendidas" },
                            { key: "canceladas", color: "#EF4444", label: "Reservas Canceladas" },
                        ]}
                    />
                </div>

                {loading ? (
                    <p className="text-gray-400">Carregando reservas...</p>
                ) : erro ? (
                    <p className="text-red-500">{erro}</p>
                ) : (
                    <>
                        <div className="flex flex-row gap-6">
                            <div>
                                <label className="text-lg font-light text-ice">Status Reserva: </label>
                                <select
                                    value={filtroSelecionado}
                                    onChange={(e) => setFiltroSelecionado(e.target.value)}
                                    className="bg-black-smooth text-white border border-gray-600 rounded px-2 py-1 w-40 mb-2"
                                >
                                    {filtros.map(f => (
                                        <option key={f.children} value={f.children}>{f.value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-lg font-light text-ice">Data da Reserva: </label>
                                <select
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value as "mais-recentes" | "mais-antigas")}
                                    className="bg-black-smooth text-white border border-gray-600 rounded px-2 py-1 w-60 mb-2"
                                >
                                    <option value="mais-recentes">Mais recentes primeiro</option>
                                    <option value="mais-antigas">Mais antigas primeiro</option>
                                </select>
                            </div>
                        </div>

                        <TabelaLista
                            titulo="Reservas"
                            pesquisa={true}
                            filtro={true}
                            tituloFiltro="Filtrar"
                            filtroChildren={filtros}
                            colunas={colunasReservas}
                            fetchData={async () => reservasFiltradas}
                            acoes={[
                                {
                                    label: "Ver detalhes",
                                    cor: "bg-primary-orange hover:bg-orange-400 hover:shadow-orange-400/50 hover:text-white",
                                    onClick: (item: ReservaFormatada) => {
                                        setSelectedReserva(item);
                                        setIsOpen(true);
                                    },
                                },
                            ]}
                        />
                    </>
                )}
            </div>

            {isOpen && selectedReserva && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
                    <div className="flex flex-col justify-between bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

                        <div className="flex flex-col w-full">
                            <div className="flex flex-row justify-between">
                                <h1 className="text-xl font-light text-ice">
                                    Detalhes da Reserva de <span className="text-2xl font-semibold text-primary-orange">{selectedReserva.cliente}</span>
                                </h1>
                                <X
                                    size={30}
                                    color="#FFF"
                                    onClick={() => { setIsOpen(false); setSelectedReserva(null); }}
                                    className="cursor-pointer hover:scale-110 transition-transform"
                                />
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                <p className="font-light text-ice text-lg">Telefone:</p>
                                <p className="text-xl font-semibold text-primary-orange">{selectedReserva.telefone}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-end border-b border-gray-500 pb-4">
                                <p className="font-light text-ice text-lg">Período:</p>
                                <p className="text-xl font-semibold text-primary-orange">{selectedReserva.periodo}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-end border-b border-gray-500 pb-4">
                                <p className="font-light text-ice text-lg">Data da Reserva:</p>
                                <p className="text-xl font-semibold text-primary-orange">{formatarData(selectedReserva.data)}</p>
                            </div>

                            <div className="mt-5 border border-primary-orange">
                                <TabelaLista
                                    titulo="Lista de produtos"
                                    pesquisa={false}
                                    filtro={false}
                                    colunas={colunasListaProdutos}
                                    fetchData={async () => selectedReserva.produtos}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end border-t border-gray-500 pt-4 mt-5">
                            <div className="flex flex-row gap-2 items-end w-full">
                                <p className="font-light text-ice text-xl">Total:</p>
                                <p className="text-2xl font-semibold text-primary-orange">{selectedReserva.total}</p>
                            </div>
                            <div className="flex flex-row justify-around items-center w-full text-xl">
                                {selectedReserva.status === "RESERVA" && (
                                    <Button
                                        onClick={() => atualizarStatus(selectedReserva.id, "CANCELADA")}
                                        children="Cancelar reserva"
                                        className="border border-red-alert text-red-alert font-semibold py-2 px-6 rounded-xl hover:bg-red-alert hover:text-white hover:shadow-red-alert/50 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                    />
                                )}
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSelectedReserva(null);
                                        navigate(`/dashboard/vendas/nova-venda?reserva=${selectedReserva.id}`);
                                    }}
                                    children="Ir para venda"
                                    className="bg-pear-green/80 text-white font-semibold px-6 py-2 rounded-xl hover:bg-pear-green hover:shadow-pear-green/50 hover:shadow-md transition-shadow duration-300 hover:text-shadow-2xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}