import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaListaReserva from "../../components/tabelas/TabelaListaReserva";

export default function DashReserva() {
    const dataReservas = [
        { name: "Jan", vendidas: 45,  canceladas: 10 },
        { name: "Fev", vendidas: 60,  canceladas: 15 },
        { name: "Mar", vendidas: 55,  canceladas: 8 },
        { name: "Abr", vendidas: 70,  canceladas: 12 },
        { name: "Mai", vendidas: 50,  canceladas: 10 },
        { name: "Jun", vendidas: 65,  canceladas: 15 },
        { name: "Jul", vendidas: 75,  canceladas: 18 },
        { name: "Ago", vendidas: 80,  canceladas: 20 },
        { name: "Set", vendidas: 85,  canceladas: 22 },
        { name: "Out", vendidas: 90,  canceladas: 25 },
        { name: "Nov", vendidas: 95,  canceladas: 28 },
        { name: "Dez", vendidas: 100, canceladas: 30 },
    ];
    const colunasReservas = [
        { chave: "cliente",     titulo: "Cliente" },
        { chave: "produto",     titulo: "produto" },
        { chave: "valor",       titulo: "Valor Unidade"},
        { chave: "quantidade",  titulo: "Quantidade"},
        { chave: "total",       titulo: "Total"},

    ];
    const buscarReservas = async () => [
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "João",  produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00", quantidade: 2, total: "R$240,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },
        { cliente: "Maria", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00",  quantidade: 1, total: "R$75,00" },

    ];
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Reserva" />
            <div className="flex flex-col justify-center gap-2 py-5 px-5 w-screen">
                <div className="flex flex-row w-ful gap-5">
                    <CardEstatistica
                        className="bg-black-smooth flex flex-col border-l border-primary-orange p-2 w-60 h-full"
                        titulo="RESERVAS ATIVAS"
                        valor="14"
                    />
                    <GraficoLinhas
                        titulo="Reservas Mensais"
                        data={dataReservas}
                        series={[
                            { key: "vendidas", color: "#22C55E", label: "Reservas Vendidas" },
                            { key: "canceladas", color: "#EF4444", label: "Reservas Canceladas" },
                        ]}
                    />
                </div>
                <div className="flex w-full">
                    <TabelaListaReserva
                        titulo="Últimas Reservas"
                        colunas={colunasReservas}
                        fetchData={buscarReservas}
                        alturaMax="max-h-90"
                    />
                </div>
            </div>
        </div>
    );
}