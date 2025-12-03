import { useEffect, useState } from "react";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { dashboardGeralService } from "../../services/dashboardGeralService";

const colunasVendas = [
    { chave: "produto", titulo: "Produto", size: "auto" },
    { chave: "valor", titulo: "Valor Unidade", size: "md" },
    { chave: "quantidade", titulo: "Quantidade", size: "md" },
    { chave: "total", titulo: "Total", size: "sm" },
    { chave: "data", titulo: "Data", size: "md" },
    { chave: "usuario", titulo: "Usuário", size: "md" },
];

const filtros = [
    { value: "Dia", children: "Dia" },
    { value: "Semanal", children: "Semanal" },
    { value: "Mensal", children: "Mensal" },
    { value: "Semestral", children: "Semestral" },
    { value: "Anual", children: "Anual" },
];

const ordenacoes = [
    { value: "recentes", label: "Mais Recentes" },
    { value: "antigas", label: "Mais Antigas" },
];

// Funções de utilidade para datas
function pad(n: number) { return String(n).padStart(2, "0"); }
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function formatLocalISO(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function gerarIntervaloDatas(filtro: string) {
    const hoje = startOfDay(new Date());
    const datas: string[] = [];

    if (filtro === "Dia") return [formatLocalISO(hoje)];

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
        for (let d = 1; d <= ultimoDia; d++) datas.push(formatLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), d)));
        return datas;
    }

    if (filtro === "Semestral") {
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth() + 1;
        const primeiroMes = mes <= 6 ? 1 : 7;
        const ultimoMes = mes <= 6 ? 6 : 12;
        for (let m = primeiroMes; m <= ultimoMes; m++) datas.push(formatLocalISO(new Date(ano, m - 1, 1)));
        return datas;
    }

    if (filtro === "Anual") {
        const ano = hoje.getFullYear();
        for (let m = 0; m < 12; m++) datas.push(formatLocalISO(new Date(ano, m, 1)));
        return datas;
    }

    return gerarIntervaloDatas("Mensal");
}

function formatLabelForKey(key: string, filtro: string) {
    const parts = key.split("-");
    if (filtro === "Mensal") return parts[2];
    if (filtro === "Semanal" || filtro === "Dia") return `${pad(Number(parts[2]))}/${pad(Number(parts[1]))}`;
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    return `${meses[Number(parts[1]) - 1]}/${parts[0].slice(2)}`;
}

export default function DashAnalise() {
    const [filtro, setFiltro] = useState("Mensal");
    const [ordenacao, setOrdenacao] = useState("recentes"); // nova state
    const [dadosGrafico, setDadosGrafico] = useState<{ name: string, vendas: number }[]>([]);

    // Carrega gráfico de vendas
    useEffect(() => {
        const carregarGrafico = async () => {
            try {
                const vendas = await dashboardGeralService.listarVendas();
                const intervalKeys = gerarIntervaloDatas(filtro);
                const mapa: { [key: string]: number } = {};
                intervalKeys.forEach(k => mapa[k] = 0);

                (vendas || []).forEach((v: any) => {
                    if (v.ven_status !== "CONCLUIDA") return;
                    const dataVenda = new Date(v.ven_data_modificacao || v.ven_data_criacao || v.ven_data);
                    const keyDate = (filtro === "Semestral" || filtro === "Anual") ? new Date(dataVenda.getFullYear(), dataVenda.getMonth(), 1) : startOfDay(dataVenda);
                    const key = formatLocalISO(keyDate);
                    if (mapa[key] !== undefined) mapa[key]++;
                });

                const resultado = intervalKeys.map(k => ({ name: formatLabelForKey(k, filtro), vendas: mapa[k] }));
                setDadosGrafico(resultado);
            } catch (err) { console.error(err); }
        };
        carregarGrafico();
    }, [filtro]);

    // Fetch todas vendas com ordenação
    const fetchVendas = async () => {
        try {
            const vendas = await dashboardGeralService.listarVendas();
            if (!vendas) return [];

            return vendas
                .sort((a: any, b: any) => {
                    if (ordenacao === "recentes") return (b.ven_id ?? 0) - (a.ven_id ?? 0);
                    return (a.ven_id ?? 0) - (b.ven_id ?? 0);
                })
                .map((v: any) => {
                    const itens = v.ite_itemVenda ?? [];
                    const produto = itens[0]?.pro_produto?.pro_nome ?? "—";
                    const valorUnitario = itens[0]?.pro_produto?.pro_valor ?? 0;
                    const quantidade = itens.reduce((acc: number, it: any) => acc + (it.ite_quantidade ?? it.ite_qtd ?? 1), 0);
                    const total = itens.reduce((acc: number, it: any) => acc + (it.ite_quantidade ?? it.ite_qtd ?? 1) * (it.pro_produto?.pro_valor ?? 0), 0);

                    // Formata a data para dd/mm/yyyy
                    const dataVenda = new Date(v.ven_data_modificacao || v.ven_data_criacao || v.ven_data);
                    const dataFormatada = `${pad(dataVenda.getDate())}/${pad(dataVenda.getMonth() + 1)}/${dataVenda.getFullYear()}`;

                    // Nome do usuário que comprou
                    const nomeUsuario = v.usu_usuario?.usu_nome ?? "—";

                    return {
                        produto,
                        valor: valorUnitario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                        quantidade,
                        data: dataFormatada,
                        total: total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                        usuario: nomeUsuario, // substitui a coluna 'reserva'
                    };
                });

        } catch { return []; }
    }


    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Análise de Vendas" />
            <div className="flex flex-col gap-5 py-10 px-5 w-full">
                <div className="bg-black-smooth border-l border-primary-orange">
                    {/* Filtro gráfico */}
                    <div className="flex justify-between items-center gap-2 w-full p-4">
                        <h2 className="text-primary-orange text-xl font-semibold">Vendas</h2>
                        <select value={filtro} onChange={e => setFiltro(e.target.value)} className="bg-black-smooth text-white border border-gray-600 rounded px-2 py-1">
                            {filtros.map(f => <option key={f.children} value={f.children}>{f.value}</option>)}
                        </select>
                    </div>

                    {/* Gráfico */}
                    <GraficoLinhas
                        titulo=""
                        filtro={false}
                        data={dadosGrafico}
                        series={[{ key: "vendas", color: "#22C55E", label: "Vendas" }]}
                    />
                </div>

                <div className="bg-black-smooth border-l border-primary-orange">
                    {/* Ordenação tabela */}
                    <div className="flex justify-between p-2">
                        <h2 className="text-primary-orange text-xl font-semibold">Vendas</h2>
                        <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)} className="bg-black-smooth text-white border border-gray-600 rounded px-2 py-1">
                            {ordenacoes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    {/* Tabela */}
                    <TabelaLista
                        titulo=""
                        colunas={colunasVendas}
                        fetchData={fetchVendas}
                        alturaMax="md:max-h-90"
                    />
                </div>

            </div>
        </div>
    );
}
