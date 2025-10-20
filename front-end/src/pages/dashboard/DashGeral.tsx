import CardEstatistica from "../../components/cards/CardEstatistica"
import GraficoBarras from "../../components/graficos/GraficoBarras";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard"
import TabelaLista from "../../components/tabelas/TabelaLista";

const data = [
    { name: "Jan", vendas: 400 },
    { name: "Fev", vendas: 800 },
    { name: "Mar", vendas: 600 },
    { name: "Abr", vendas: 1000 },
    { name: "Mai", vendas: 750 },
    { name: "Jun", vendas: 900 },
    { name: "Jul", vendas: 1200 },
    { name: "Ago", vendas: 800 },
    { name: "Set", vendas: 1000 },
    { name: "Out", vendas: 1100 },
    { name: "Nov", vendas: 1300 },
    { name: "Dez", vendas: 1500 },
]
const dataReservas = [
    { name: "Jan", vendidas: 45, canceladas: 10 },
    { name: "Fev", vendidas: 60, canceladas: 15 },
    { name: "Mar", vendidas: 55, canceladas: 8 },
    { name: "Abr", vendidas: 70, canceladas: 12 },
    { name: "Mai", vendidas: 50, canceladas: 10 },
    { name: "Jun", vendidas: 65, canceladas: 15 },
    { name: "Jul", vendidas: 75, canceladas: 18 },
    { name: "Ago", vendidas: 80, canceladas: 20 },
    { name: "Set", vendidas: 85, canceladas: 22 },
    { name: "Out", vendidas: 90, canceladas: 25 },
    { name: "Nov", vendidas: 95, canceladas: 28 },
    { name: "Dez", vendidas: 100, canceladas: 30 },
];
const dataFluxo = [
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
const colunasReservas = [
    { chave: "cliente", titulo: "Cliente" },
    { chave: "produto", titulo: "produto" },
    { chave: "valor", titulo: "Valor Unidade" },
    { chave: "quantidade", titulo: "Quantidade" },
    { chave: "total", titulo: "Total" },
];
const buscarReservas = async () => [
    { cliente: "João", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
    { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00" },
    { cliente: "João", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
    { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00" },
    { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00" },
    { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00" },
    { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00" },

];
const colunasVendas = [
    { chave: "produto", titulo: "produto" },
    { chave: "valor", titulo: "Valor Unidade" },
    { chave: "quantidade", titulo: "Quantidade" },
    { chave: "total", titulo: "Total" },
    { chave: "reserva", titulo: "Reserva" },
];
const buscarVendas = async () => [
    { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00", reserva: "Sim" },
    { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Sim" },
    { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00", reserva: "Não" },
    { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Sim" },
];
export default function DashGeral() {
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
                                valor="14"
                            />
                            <TabelaLista
                                titulo="Últimas Reservas"
                                colunas={colunasReservas}
                                fetchData={buscarReservas}
                                alturaMax="max-h-45 md:max-h-33"
                            />
                        </div>
                        <div className="flex flex-row items-center gap-4 w-full h-full">
                            <CardEstatistica
                                className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 w-60 h-full"
                                titulo="VENDAS NOS ULTIMOS 30 DIAS"
                                valor="1.806"
                            />
                            <TabelaLista
                                titulo="Últimas Vendas"
                                colunas={colunasVendas}
                                fetchData={buscarVendas}
                                alturaMax="max-h-45 md:max-h-33"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
                        <CardEstatistica
                            className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 min-w-80 "
                            titulo="CAIXA ATUAL (R$)"
                            valor="32.192,19"
                        />
                        <GraficoBarras data={dataFluxo} />
                    </div>
                </div>
                
                <div className="flex flex-row gap-4 w-full h-full">
                    <GraficoLinhas
                        titulo="Reservas Mensais"
                        data={dataReservas}
                        series={[
                            { key: "vendidas", color: "#22C55E", label: "Reservas Vendidas" },
                            { key: "canceladas", color: "#EF4444", label: "Reservas Canceladas" },
                        ]}
                    />
                    <GraficoLinhas
                        data={data}
                        titulo="Vendas Mensais"
                        series={[
                            { key: "vendas", color: "#22C55E", label: "Vendas" },
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

