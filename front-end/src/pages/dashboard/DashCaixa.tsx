import Button from "../../components/buttons/Button";
import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoBarras from "../../components/graficos/GraficoBarras";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import GraficoPizza from "../../components/graficos/GraficoPizza";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";

const dataVendasPizza = [
    { name: "Dinheiro", value: 600 },
    { name: "Pix", value: 250 },
    { name: "Cartao de Credito", value: 105 },
    { name: "Cartao de Debito", value: 100 },
];
const dataFluxoEntradaSaida = [
    { mes: "Jan", entrada: 5000, saida: 3200 },
    { mes: "Fev", entrada: 4200, saida: 1800 },
    { mes: "Mar", entrada: 6100, saida: 4500 },
    { mes: "Abr", entrada: 3000, saida: 2800 },
    { mes: "Mai", entrada: 8000, saida: 5200 },
    { mes: "Jun", entrada: 9000, saida: 6200 },
    { mes: "Jul", entrada: 11000, saida: 7200 },
    { mes: "Ago", entrada: 12000, saida: 8200 },
    { mes: "Set", entrada: 13000, saida: 9200 },
    { mes: "Out", entrada: 14000, saida: 10200 },
];
const dataFluxoMovimentacao = [
    { name: "Jan", caixa: 5000 },
    { name: "Fev", caixa: -420 },
    { name: "Mar", caixa: 6100 },
    { name: "Abr", caixa: 3000 },
    { name: "Mai", caixa: 8000 },
    { name: "Jun", caixa: 9000 },
    { name: "Jul", caixa: 1100 },
    { name: "Ago", caixa: 1200 },
    { name: "Set", caixa: 13000 },
    { name: "Out", caixa: 1400 },
];
const filtros = [
    { value: "Diario", children: "Diario" },
    { value: "Semanal", children: "Semanal" },
    { value: "Mensal", children: "Mensal" },
    { value: "Semestral", children: "Semestral" },
    { value: "Anual", children: "Anual" },
];
const colunashistoricoCaixa = [
    { chave: "tipo", titulo: "Tipo" },
    { chave: "descricao", titulo: "Descrição" },
    { chave: "data", titulo: "Data" },
    { chave: "valor", titulo: "Valor" },
];
const historicoDeMovimentacoes = [
    {
        tipo: "Entrada",
        descricao: "Venda de pneus - João Silva",
        data: "01/10/2023",
        valor: "R$ 500,00",
    },
]
export default function DashCaixa() {
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Caixa" />
            <div className="flex flex-row gap-2 py-2 px-5 w-screen">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row w-full gap-2">
                        <CardEstatistica
                            className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-80 "
                            titulo="CAIXA ATUAL (R$)"
                            valor="32.192,19"
                        />
                        <GraficoPizza
                            titulo="Principais formas de pagamento"
                            data={dataVendasPizza}
                            height="h-47"
                        />
                    </div>
                    <div className="w-full h-50">
                        <GraficoBarras data={dataFluxoEntradaSaida} />
                    </div>
                    <div className="w-full h-80">
                        <GraficoLinhas
                            titulo="Fluxo de movimentação"
                            filtro={true}
                            tituloFiltro="Filtar"
                            filtroChildren={filtros}
                            data={dataFluxoMovimentacao}
                            series={[
                                { key: "caixa", color: "#FF961F", label: "Fluxo de caixa do mês" },
                            ]}
                        />
                    </div>

                </div>
                <div className="flex flex-col w-full">
                    <TabelaLista
                        titulo="HISTÓRICO DE MOVIMENTAÇÕES DO CAIXA"
                        colunas={colunashistoricoCaixa}
                        fetchData={async () => historicoDeMovimentacoes}
                        alturaMax="md:max-h-33"
                    />
                    <div className="flex justify-end items-center w-ful mb-10 mt-2">
                        <Button
                            className="bg-primary-orange text-black font-semibold mt-2 px-4 py-2 rounded hover:bg-orange-600"
                            children="Fazer nova movimentação"
                            onClick={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}