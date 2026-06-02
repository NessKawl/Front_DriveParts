import { useEffect, useState } from "react";
import { 
  CalendarDays, 
  TrendingUp, 
  Coins, 
  Activity 
} from "lucide-react";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { dashboardGeralService } from "../../services/dashboardGeralService";

interface Reserva {
    ven_id: number;
    ven_data_modificacao?: string;
    ven_data_criacao?: string;
    ven_status?: string;
    ite_itemVenda?: any[];
    usu_usuario?: any;
}

const colunasReservas = [
    { chave: "cliente", titulo: "Cliente", size: "sm" },
    { chave: "telefone", titulo: "Telefone", size: "md" },
    { chave: "quantidade", titulo: "Qtd", size: "sm" },
    { chave: "total", titulo: "Total", size: "sm" },
    { chave: "periodo", titulo: "Período", size: "auto" },
];

const colunasVendas = [
    { chave: "produto", titulo: "Produto", size: "auto" },
    { chave: "valor", titulo: "Preço Un.", size: "sm" },
    { chave: "quantidade", titulo: "Qtd", size: "sm" },
    { chave: "total", titulo: "Total", size: "sm" },
    { chave: "reservaStatus", titulo: "Reserva", size: "sm" },
];

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

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function formatLocalISO(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function gerarIntervaloDatas(filtro: string) {
    const hoje = startOfDay(new Date());
    const datas: string[] = [];

    if (filtro === "Dia") {
        datas.push(formatLocalISO(hoje));
        return datas;
    }

    if (filtro === "Semanal") {
        for (let i = 6; i >= 0; i--) {
            const d = new Date(hoje);
            d.setDate(hoje.getDate() - i);
            datas.push(formatLocalISO(d));
        }
        return datas;
    }

    if (filtro === "Mensal") {
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        for (let d = 1; d <= ultimoDia; d++) {
            const dd = new Date(hoje.getFullYear(), hoje.getMonth(), d);
            datas.push(formatLocalISO(dd));
        }
        return datas;
    }

    if (filtro === "Semestral") {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1;

        const primeiroMes = mes <= 6 ? 1 : 7;
        const ultimoMes = mes <= 6 ? 6 : 12;

        const meses: string[] = [];

        for (let m = primeiroMes; m <= ultimoMes; m++) {
            const ref = new Date(ano, m - 1, 1);
            meses.push(formatLocalISO(ref));
        }

        return meses;
    }

    if (filtro === "Anual") {
        const meses: string[] = [];
        const hoje2 = new Date();
        const ano = hoje2.getFullYear();
        for (let m = 0; m < 12; m++) {
            const ref = new Date(ano, m, 1);
            meses.push(formatLocalISO(ref));
        }
        return meses;
    }

    return gerarIntervaloDatas("Semanal");
}

function formatLabelForKey(key: string, filtro: string) {
    const parts = key.split("-");
    if (filtro === "Mensal") return parts[2];
    if (filtro === "Semanal" || filtro === "Dia") return `${pad(Number(parts[2]))}/${pad(Number(parts[1]))}`;
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const ano2 = parts[0].slice(2);

    return `${meses[Number(parts[1]) - 1]}/${ano2}`;
}

export default function DashGeral() {
    const [reservasAtivas, setReservasAtivas] = useState(0);
    const [ultimasReservas, setUltimasReservas] = useState<any[]>([]);
    const [ultimasVendas, setUltimasVendas] = useState<any[]>([]);
    const [vendas30dias, setVendas30dias] = useState(0);

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtro, setFiltro] = useState("Semanal");
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

    const [caixaAtual, setCaixaAtual] = useState<number>(0);
    const [dadosGraficoVendas, setDadosGraficoVendas] = useState<{ name: string; vendas: number }[]>([]);

    useEffect(() => {
        dashboardGeralService
            .getCaixaAtual()
            .then((data) => setCaixaAtual(data.caixa))
            .catch((err) => console.error(err));

        dashboardGeralService
            .getReservasAtivas()
            .then((data) => setReservasAtivas(data))
            .catch((err) => console.error(err));

        dashboardGeralService
            .getVendasUltimos30Dias()
            .then((data) => setVendas30dias(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        dashboardGeralService
            .listarReservas()
            .then((data: Reserva[]) => {
                setReservas(data || []);

                const ultimas = (data || [])
                    .sort((a: any, b: any) => {
                        const dataA = new Date(a?.ven_data_criacao ?? 0).getTime();
                        const dataB = new Date(b?.ven_data_criacao ?? 0).getTime();
                        return dataB - dataA;
                    })
                    .slice(0, 3)
                    .map((reserva: any) => {
                        const quantidadeTotal =
                            reserva.ite_itemVenda?.reduce(
                                (acc: number, item: any) =>
                                    acc + (item.ite_quantidade ?? item.ite_qtd ?? 1),
                                0
                            ) ?? 0;

                        const valorTotalNumber =
                            reserva.ite_itemVenda?.reduce((acc: number, item: any) => {
                                const qtd = item.ite_quantidade ?? item.ite_qtd ?? 1;
                                const valor = item.pro_produto?.pro_valor ?? 0;
                                return acc + qtd * valor;
                            }, 0) ?? 0;

                        const dataReservaRaw = reserva.ven_data_criacao;
                        let dataFormatada = "—";
                        if (dataReservaRaw) {
                            const dataObj = new Date(dataReservaRaw);
                            if (!isNaN(dataObj.getTime()))
                                dataFormatada = dataObj.toLocaleDateString("pt-BR");
                        }

                        return {
                            cliente: reserva.usu_usuario?.usu_nome ?? "—",
                            telefone: formatarTelefone(reserva.usu_usuario?.usu_tel) ?? "—",
                            quantidade: quantidadeTotal,
                            total: valorTotalNumber.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }),
                            periodo: reserva.ven_periodo
                                ? `${dataFormatada} - ${reserva.ven_periodo.toUpperCase()}`
                                : dataFormatada,
                        };
                    });

                setUltimasReservas(ultimas);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        dashboardGeralService.listarVendas()
            .then((vendas) => {
                const formatadas = (vendas || [])
                    .sort((a: any, b: any) => (b.ven_id ?? 0) - (a.ven_id ?? 0))
                    .slice(0, 3)
                    .map((v: any) => {
                        const itens = v.ite_itemVenda ?? [];
                        const produto = itens[0]?.pro_produto?.pro_nome ?? "—";
                        const valorUnitario = itens[0]?.pro_produto?.pro_valor ?? 0;
                        const quantidade = itens.reduce((acc: number, item: any) => acc + (item.ite_quantidade ?? item.ite_qtd ?? 1), 0);
                        const total = itens.reduce((acc: number, item: any) => {
                            const qtd = item.ite_quantidade ?? item.ite_qtd ?? 1;
                            const preco = item.pro_produto?.pro_valor ?? 0;
                            return acc + qtd * preco;
                        }, 0);

                        return {
                            produto,
                            valor: valorUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                            quantidade,
                            total: total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                            reservaStatus: v.ven_status === "RESERVA" ? "Sim" : "Não",
                        };
                    });
                setUltimasVendas(formatadas);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const montarDadosGraficoReservas = () => {
            const intervalKeys = gerarIntervaloDatas(filtro);
            const mapa: { [key: string]: { vendidas: number; canceladas: number } } = {};
            intervalKeys.forEach((k) => (mapa[k] = { vendidas: 0, canceladas: 0 }));

            reservas.forEach((r) => {
                if (!r.ven_data_modificacao) return;
                const d = new Date(r.ven_data_modificacao);
                let keyDate = startOfDay(d);

                if (filtro === "Semestral" || filtro === "Anual") {
                    keyDate = new Date(d.getFullYear(), d.getMonth(), 1);
                }

                const key = formatLocalISO(keyDate);
                if (mapa[key]) {
                    if (r.ven_status === "CONCLUIDA") mapa[key].vendidas++;
                    if (r.ven_status === "CANCELADA") mapa[key].canceladas++;
                }
            });

            const dados = intervalKeys.map((k) => {
                const label = formatLabelForKey(k, filtro);
                return { name: label, vendidas: mapa[k].vendidas, canceladas: mapa[k].canceladas };
            });

            setDadosGrafico(dados);
        };
        montarDadosGraficoReservas();
    }, [reservas, filtro]);

    useEffect(() => {
        const carregarVendasGrafico = async () => {
            try {
                const vendas = await dashboardGeralService.listarVendas();
                const intervalKeys = gerarIntervaloDatas(filtro);
                const mapa: { [key: string]: number } = {};
                intervalKeys.forEach((k) => (mapa[k] = 0));

                (vendas || []).forEach((venda: any) => {
                    if (venda.ven_status !== "CONCLUIDA") return;
                    const dataVenda = new Date(venda.ven_data_modificacao || venda.ven_data_criacao || venda.ven_data);
                    let keyDate = startOfDay(dataVenda);

                    if (filtro === "Semestral" || filtro === "Anual") {
                        keyDate = new Date(dataVenda.getFullYear(), dataVenda.getMonth(), 1);
                    }

                    const key = formatLocalISO(keyDate);
                    if (mapa[key] !== undefined) mapa[key]++;
                });

                const resultado = intervalKeys.map((k) => ({ name: formatLabelForKey(k, filtro), vendas: mapa[k] }));
                setDadosGraficoVendas(resultado);
            } catch (err) {
                console.error(err);
            }
        };
        carregarVendasGrafico();
    }, [filtro]);

    function formatReaisSinalDepois(valor: number) {
        const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
        if (valor < 0) return fmt.format(Math.abs(valor)).replace("R$", "R$ -");
        return fmt.format(valor);
    }

    return (
        <div className="flex bg-[#080808] h-screen overflow-hidden">
            <NavBarDashboard page="Geral" />
            
            <div className="flex-1 flex flex-col p-5 text-white overflow-hidden h-screen">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Geral</h1>
                        <p className="text-gray-400 text-xs mt-0.5">Acompanhe as métricas de vendas, reservas e fluxo de caixa da DriveParts.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Reservas Ativas Card */}
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3 flex items-center justify-between transition-all duration-200 hover:border-[#222]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reservas Ativas</span>
                            <span className="text-2xl font-bold text-white mt-0.5">{reservasAtivas}</span>
                        </div>
                        <div className="bg-[#FF961F]/10 text-[#FF961F] border border-[#FF961F]/20 w-9 h-9 rounded-lg flex items-center justify-center">
                            <CalendarDays size={18} />
                        </div>
                    </div>

                    {/* Vendas Card */}
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3 flex items-center justify-between transition-all duration-200 hover:border-[#222]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendas (30 Dias)</span>
                            <span className="text-2xl font-bold text-white mt-0.5">{vendas30dias}</span>
                        </div>
                        <div className="bg-[#369638]/10 text-[#369638] border border-[#369638]/20 w-9 h-9 rounded-lg flex items-center justify-center">
                            <TrendingUp size={18} />
                        </div>
                    </div>

                    {/* Caixa Card */}
                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-3 flex items-center justify-between transition-all duration-200 hover:border-[#222]">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Caixa Atual</span>
                            <span className="text-xl font-bold text-white mt-0.5 font-mono">{formatReaisSinalDepois(caixaAtual)}</span>
                        </div>
                        <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 w-9 h-9 rounded-lg flex items-center justify-center">
                            <Coins size={18} />
                        </div>
                    </div>
                </div>

                {/* Unified Charts Panel */}
                <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 flex flex-col h-full gap-3 mb-4 transition-all duration-200 hover:border-[#222]">
                    <div className="flex flex-row justify-between items-center border-b border-[#1A1A1A] pb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500/10 text-[#FF961F] w-7 h-7 rounded-md flex items-center justify-center">
                                <Activity size={15} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white">Desempenho Geral</h2>
                            </div>
                        </div>
                        
                        {/* Dark Select Pill */}
                        <div className="flex items-center bg-[#121212] border border-[#222] rounded-lg px-2 py-1 text-[11px] text-white">
                            <select
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="bg-transparent border-none text-white outline-none cursor-pointer pr-1 font-semibold"
                            >
                                <option value="Dia" className="bg-[#121212]">Diário</option>
                                <option value="Semanal" className="bg-[#121212]">Semanal</option>
                                <option value="Mensal" className="bg-[#121212]">Mensal</option>
                                <option value="Semestral" className="bg-[#121212]">Semestral</option>
                                <option value="Anual" className="bg-[#121212]">Anual</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 bg-transparent h-full">
                        <div className="bg-[#121212]/30 border border-[#1A1A1A]/40 rounded-xl p-2.5 h-full">
                            <GraficoLinhas
                                titulo="Reservas"
                                filtro={false}
                                data={dadosGrafico}
                                heightClass="w-full h-[300px]"
                                series={[
                                    { key: "vendidas", color: "#369638", label: "Vendidas" },
                                    { key: "canceladas", color: "#FF2817", label: "Canceladas" },
                                ]}
                            />
                        </div>
    
                        <div className="bg-[#121212]/30 border border-[#1A1A1A]/40 rounded-xl p-2.5 h-full">
                            <GraficoLinhas
                                data={dadosGraficoVendas}
                                titulo="Vendas"
                                filtro={false}
                                heightClass="w-full h-[300px]"
                                series={[{ key: "vendas", color: "#369638", label: "Vendas" }]}
                            />
                        </div>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
                    <TabelaLista
                        titulo="Últimas Reservas"
                        colunas={colunasReservas}
                        fetchData={() => Promise.resolve(ultimasReservas)}
                        alturaMax="max-h-28"
                    />

                    <TabelaLista
                        titulo="Últimas Vendas"
                        colunas={colunasVendas}
                        fetchData={() => Promise.resolve(ultimasVendas)}
                        alturaMax="max-h-28"
                    />

                </div>
            </div>
        </div>
    );
}



