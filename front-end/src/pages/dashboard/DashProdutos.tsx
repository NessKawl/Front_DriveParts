import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
export default function DashProdutos() {
    const colunasReservas = [
        { chave: "cliente", titulo: "Cliente" },
        { chave: "valor", titulo: "Valor" },
        { chave: "data", titulo: "Data" },
        { chave: "quantidade", titulo: "Quantidade" },
    ];

    const buscarReservas = async () => [
        { cliente: "João", valor: "R$120,00", data: "20/10/2025", quantidade: 2 },
        { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
        { cliente: "João", valor: "R$120,00", data: "20/10/2025", quantidade: 2 },
        { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
    ];

    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Produtos" />
            <div className="flex flex-1 flex-col text-white">
                <div className="p-6 bg-gray-100 min-h-screen">
                    <div className="grid gap-6">
                        <TabelaLista
                            titulo="Últimas Reservas"
                            colunas={colunasReservas}
                            fetchData={buscarReservas}
                            alturaMax="max-h-64"
                        />
                        <TabelaLista
                            titulo="Últimas Vendas"
                            colunas={[
                                { chave: "cliente", titulo: "Cliente" },
                                { chave: "valor", titulo: "Valor" },
                                { chave: "data", titulo: "Data" },
                                { chave: "quantidade", titulo: "Quantidade" },
                            ]}
                            fetchData={async () => [
                                { cliente: "João", valor: "R$120,00", data: "20/10/2025", quantidade: 2 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 }, 
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 }, 
                                { cliente: "Maria", valor: "R$75,00", data: "19/10/2025", quantidade: 1 },

                            ]}
                            alturaMax="max-h-64" // altura padrão
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}