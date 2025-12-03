import { useEffect, useState } from "react";
import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { dashboardGeralService } from "../../services/dashboardGeralService";

const colunasReservas = [
    { chave: "cliente", titulo: "Cliente", size: "sm" },
    { chave: "telefone", titulo: "Telefone", size: "md" },
    { chave: "quantidade", titulo: "Qtd de produtos", size: "md" },
    { chave: "total", titulo: "Total (R$)", size: "md" },
    { chave: "periodo", titulo: "Período Reserva", size: "auto" },
];

const colunasVendas = [
    { chave: "produto", titulo: "produto", size: "auto" },
    { chave: "valor", titulo: "Valor Unidade", size: "md" },
    { chave: "quantidade", titulo: "Quantidade", size: "md" },
    { chave: "total", titulo: "Total", size: "sm" },
    { chave: "reserva", titulo: "Reserva", size: "sm" },
];

const filtros = [
    { value: "Dia", children: "Dia" },
    { value: "Semanal", children: "Semanal" },
    { value: "Mensal", children: "Mensal" },
    { value: "Semestral", children: "Semestral" },
    { value: "Anual", children: "Anual" },
];

interface Reserva {
    ven_id: number;
    ven_data_modificacao?: string;
    ven_data_criacao?: string;
    ven_status?: string;
    ite_itemVenda?: any[];
    usu_usuario?: any;
}

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

    return gerarIntervaloDatas("Mensal");
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
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Geral" />
            <div className="grid grid-cols-1 w-full gap-2 py-2 px-5">
                <div className="flex fle-row gap-4 h-full ">
                    <div className="flex flex-col w-full gap-4 ">
                        <div className="flex flex-row items-center gap-4 w-full h-full">
                            <CardEstatistica
                                className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 w-60 h-full"
                                titulo="RESERVAS ATIVAS"
                                valor={reservasAtivas}
                            />
                            <TabelaLista
                                titulo="Últimas Reservas"
                                colunas={colunasReservas}
                                fetchData={() => Promise.resolve(ultimasReservas)}
                                alturaMax="md:max-h-33"
                            />
                        </div>
                        <div className="flex flex-row items-center gap-4 w-full h-full">
                            <CardEstatistica
                                className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 w-60 h-full"
                                titulo="VENDAS NOS ULTIMOS 30 DIAS"
                                valor={vendas30dias}
                            />
                            <TabelaLista
                                titulo="Últimas Vendas"
                                colunas={colunasVendas}
                                fetchData={async () => {
                                    try {
                                        const vendas = await dashboardGeralService.listarReservas();
                                        return (vendas || [])
                                            .sort((a: any, b: any) => (b.ven_id ?? 0) - (a.ven_id ?? 0))
                                            .slice(0, 5)
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
                                                    reserva: v.ven_status == "RESERVA" ? "Sim" : "Não",
                                                };
                                            });
                                    } catch (err) {
                                        console.error(err);
                                        return [];
                                    }
                                }}
                                alturaMax="md:max-h-33"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
                        <CardEstatistica
                            className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-80 "
                            titulo="CAIXA ATUAL (R$)"
                            valor={formatReaisSinalDepois(caixaAtual)}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4 w-full h-full">
                    <div className="flex flex-col w-full gap-2 bg-black-smooth border-l border-primary-orange">
                        <div className="flex flex-row justify-end gap-2 items-center p-2">
                            <label className="text-primary-orange">Filtro Gráficos:</label>
                            <select
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="bg-black-smooth text-white border border-gray-600 rounded px-2 py-1"
                            >
                                {filtros.map((f) => (
                                    <option key={f.children} value={f.children}>
                                        {f.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-row gap-5 bg-black-smooth">
                            <GraficoLinhas
                                titulo="Reservas"
                                filtro={false}
                                data={dadosGrafico}
                                series={[
                                    { key: "vendidas", color: "#22C55E", label: "Vendidas" },
                                    { key: "canceladas", color: "#EF4444", label: "Canceladas" },
                                ]}
                            />
        
                            <GraficoLinhas
                                data={dadosGraficoVendas}
                                titulo="Vendas"
                                filtro={false}
                                tituloFiltro="Filtrar"
                                filtroChildren={filtros}
                                series={[{ key: "vendas", color: "#22C55E", label: "Vendas" }]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}