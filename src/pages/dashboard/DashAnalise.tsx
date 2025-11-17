import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";

export default function DashAnalise() {
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
    const colunasVendas = [
        { chave: "produto", titulo: "produto", size: "auto" },
        { chave: "valor", titulo: "Valor Unidade", size: "md" },
        { chave: "quantidade", titulo: "Quantidade", size: "sm" },
        { chave: "total", titulo: "Total", size: "sm" },
        { chave: "reserva", titulo: "Reserva", size: "sm" },
    ];
    const buscarVendas = async () => [
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00", reserva: "Sim" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Sim" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00", reserva: "Não" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Sim" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Não" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Sim" },
        { produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00", quantidade: 1, total: "R$75,00", reserva: "Não" },
    ];
    const filtros = [
        { value: "Dia", children: "Dia" },
        { value: "Semanal", children: "Semanal" },
        { value: "Mensal", children: "Mensal" },
        { value: "Semestral", children: "Semestral" },
        { value: "Anual", children: "Anual" },
    ];
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Vendas" />
            <div className="flex flex-row gap-2 py-10 px-5 w-screen">
                <div className="flex flex-col h-full w-full">
                    <div className="h-full">
                        <GraficoLinhas
                            data={data}
                            titulo="Vendas"
                            filtro={true}
                            tituloFiltro="Filtar"
                            filtroChildren={filtros}
                            series={[
                                { key: "vendas", color: "#22C55E", label: "Vendas" },
                            ]}
                        />
                    </div>
                    <TabelaLista
                        titulo="Últimas Vendas"
                        colunas={colunasVendas}
                        fetchData={buscarVendas}
                        alturaMax="md:max-h-68"
                    />
                </div>
                
            </div>
        </div>
    );
}