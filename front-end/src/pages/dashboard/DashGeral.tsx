import CardEstatistica from "../../components/cards/CardEstatistica"
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard"
import TabelaLista from "../../components/tabelas/TabelaLista";
import { dashboardGeralService } from "../../services/dashboardGeralService";
import { useEffect, useState } from "react";

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
}

export default function DashGeral() {

    const [reservasAtivas, setReservasAtivas] = useState(0);
    const [ultimasReservas, setUltimasReservas] = useState<Reserva[]>([]);
    const [vendas30dias, setVendas30dias] = useState(0);

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [filtro, setFiltro] = useState("Semanal");
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);

    const [caixaAtual, setCaixaAtual] = useState<number>(0);

    const buscarVendas = async () => {
        try {
            const vendas = await dashboardGeralService.listarReservas();

            const ultimas = vendas
                .sort((a: any, b: any) => b.ven_id - a.ven_id)
                .slice(0, 5)
                .map((venda: any) => {
                    const itens = venda.ite_itemVenda ?? [];

                    const produto = itens[0]?.pro_produto?.pro_nome ?? "—";

                    const valorUnitario = itens[0]?.pro_produto?.pro_valor ?? 0;

                    const quantidade = itens.reduce(
                        (acc: number, item: any) =>
                            acc + (item.ite_quantidade ?? item.ite_qtd ?? 1),
                        0
                    );

                    const total = itens.reduce((acc: number, item: any) => {
                        const qtd = item.ite_quantidade ?? item.ite_qtd ?? 1;
                        const preco = item.pro_produto?.pro_valor ?? 0;
                        return acc + qtd * preco;
                    }, 0);

                    return {
                        produto,
                        valor: valorUnitario.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }),
                        quantidade,
                        total: total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }),
                        reserva: venda.ven_status == "RESERVA" ? "Sim" : "Não",
                    };
                });

            return ultimas;
        } catch (err) {
            console.error(err);
            return [];
        }
    };


    useEffect(() => {
        dashboardGeralService
            .getCaixaAtual()
            .then((data) => setCaixaAtual(data.caixa))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        dashboardGeralService
            .getReservasAtivas()
            .then((data) => setReservasAtivas(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const hoje = new Date();
        let dataInicio = new Date();

        switch (filtro) {
            case "Dia":
                dataInicio = new Date(hoje);
                dataInicio.setHours(0, 0, 0, 0);
                break;
            case "Semanal":
                dataInicio.setDate(hoje.getDate() - 6);
                break;
            case "Mensal":
                dataInicio.setMonth(hoje.getMonth() - 1);
                dataInicio.setDate(hoje.getDate());
                break;
            case "Semestral":
                dataInicio.setMonth(hoje.getMonth() - 6);
                dataInicio.setDate(hoje.getDate());
                break;
            case "Anual":
                dataInicio.setFullYear(hoje.getFullYear() - 1);
                dataInicio.setDate(hoje.getDate());
                break;
            default:
                dataInicio = new Date(0);
        }

        const nomesMeses = [
            "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
            "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
        ];

        const datas: string[] = [];
        const temp = new Date(dataInicio);
        while (temp <= hoje) {
            if (filtro === "Dia" || filtro === "Semanal") {
                datas.push(temp.toLocaleDateString("pt-BR"));
                temp.setDate(temp.getDate() + 1);
            } else {
                const key = `${temp.getMonth() + 1}/${temp.getFullYear()}`;
                if (!datas.includes(key)) datas.push(key);
                temp.setMonth(temp.getMonth() + 1);
            }
        }

        const mapa: { [key: string]: { vendidas: number; canceladas: number } } = {};
        datas.forEach((d) => (mapa[d] = { vendidas: 0, canceladas: 0 }));

        reservas.forEach((r) => {
            if (!r.ven_data_modificacao) return;
            const dataR = new Date(r.ven_data_modificacao);
            let key = "";
            if (filtro === "Dia" || filtro === "Semanal") {
                key = dataR.toLocaleDateString("pt-BR");
            } else {
                key = `${dataR.getMonth() + 1}/${dataR.getFullYear()}`;
            }
            if (mapa[key]) {
                if (r.ven_status === "CONCLUIDA") mapa[key].vendidas++;
                if (r.ven_status === "CANCELADA") mapa[key].canceladas++;
            }
        });

        const dados = datas.map((d) => {
            if (filtro === "Mensal" || filtro === "Semestral" || filtro === "Anual") {
                const [mes, ano] = d.split("/").map(Number);
                return { name: `${nomesMeses[mes - 1]}/${ano}`, ...mapa[d] };
            }
            return { name: d, ...mapa[d] };
        });

        setDadosGrafico(dados);
    }, [reservas, filtro]);


    const [dadosGraficoVendas, setDadosGraficoVendas] = useState<{ name: string, vendas: number }[]>([]);

    useEffect(() => {
        const carregarVendasGrafico = async () => {
            try {
                const vendas = await dashboardGeralService.listarVendas();

                const hoje = new Date();
                let dataInicio = new Date();

                switch (filtro) {
                    case "Dia":
                        dataInicio = new Date(hoje);
                        dataInicio.setHours(0, 0, 0, 0);
                        break;
                    case "Semanal":
                        dataInicio.setDate(hoje.getDate() - 6);
                        break;
                    case "Mensal":
                        dataInicio.setMonth(hoje.getMonth() - 1);
                        dataInicio.setDate(hoje.getDate());
                        break;
                    case "Semestral":
                        dataInicio.setMonth(hoje.getMonth() - 6);
                        dataInicio.setDate(hoje.getDate());
                        break;
                    case "Anual":
                        dataInicio.setFullYear(hoje.getFullYear() - 1);
                        dataInicio.setDate(hoje.getDate());
                        break;
                    default:
                        dataInicio = new Date(0);
                }

                const nomesMeses = [
                    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
                    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
                ];

                // Criar array de datas do filtro
                const datas: string[] = [];
                const temp = new Date(dataInicio);
                while (temp <= hoje) {
                    if (filtro === "Dia" || filtro === "Semanal") {
                        datas.push(temp.toLocaleDateString("pt-BR"));
                        temp.setDate(temp.getDate() + 1);
                    } else {
                        // Para mensal/semestral/anual usamos nomes de mês
                        const key = `${temp.getMonth()}/${temp.getFullYear()}`; // temporário
                        datas.push(key);
                        temp.setMonth(temp.getMonth() + 1);
                    }
                }

                const mapa: { [key: string]: number } = {};
                datas.forEach((d) => (mapa[d] = 0));

                vendas.forEach((venda: any) => {
                    if (venda.ven_status !== "CONCLUIDA") return;
                    const dataVenda = new Date(venda.ven_data_modificacao);
                    let key = "";
                    if (filtro === "Dia" || filtro === "Semanal") {
                        key = dataVenda.toLocaleDateString("pt-BR");
                    } else {
                        key = `${dataVenda.getMonth()}/${dataVenda.getFullYear()}`;
                    }
                    if (mapa[key] !== undefined) mapa[key]++;
                });

                const resultado = datas.map((d) => {
                    if (filtro === "Mensal" || filtro === "Semestral" || filtro === "Anual") {
                        const [mes, ano] = d.split("/").map(Number);
                        return { name: `${nomesMeses[mes]}/${ano}`, vendas: mapa[d] };
                    }
                    return { name: d, vendas: mapa[d] };
                });


                setDadosGraficoVendas(resultado);

            } catch (err) {
                console.error(err);
            }
        };

        carregarVendasGrafico();
    }, [filtro]);



    useEffect(() => {
        dashboardGeralService
            .listarReservas()
            .then((data) => {
                setReservas(data);

                const ultimas = data
                    .sort((a: any, b: any) => b.ven_id - a.ven_id)
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
                                const qtd =
                                    item.ite_quantidade ??
                                    item.ite_qtd ??
                                    1;
                                const valor = item.pro_produto?.pro_valor ?? 0;
                                return acc + qtd * valor;
                            }, 0) ?? 0;

                        const dataReservaRaw = reserva.ven_data_criacao;
                        let dataFormatada = "—";
                        if (dataReservaRaw) {
                            const dataObj = new Date(dataReservaRaw);
                            if (!isNaN(dataObj.getTime())) {
                                dataFormatada = dataObj.toLocaleDateString("pt-BR");
                            }
                        }

                        return {
                            cliente: reserva.usu_usuario?.usu_nome ?? "—",
                            telefone: reserva.usu_usuario?.usu_tel ?? "—",
                            quantidade: quantidadeTotal,
                            total: valorTotalNumber.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }),
                            periodo: reserva.ven_periodo ? `${dataFormatada} - ${reserva.ven_periodo.toUpperCase()}` : dataFormatada,
                        };
                    });

                setUltimasReservas(ultimas);
            })
            .catch((err) => console.error(err));
    }, []);


    useEffect(() => {
        dashboardGeralService
            .getVendasUltimos30Dias()
            .then((data) => setVendas30dias(data))
            .catch((err) => console.error(err));
    }, []);

    function formatReaisSinalDepois(valor: number) {
        const fmt = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        if (valor < 0) {
            return fmt.format(Math.abs(valor)).replace("R$", "R$ -");
        }

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
                                fetchData={buscarVendas}
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
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-row gap-2 items-center mb-2">
                            <label className="text-white">Filtro Gráficos:</label>
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

                        <div className="flex flex-row gap-5">
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
                                filtro={true}
                                tituloFiltro="Filtrar"
                                filtroChildren={filtros}
                                series={[
                                    { key: "vendas", color: "#22C55E", label: "Vendas" },
                                ]}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}