import { useState } from "react";
import CardEstatistica from "../../components/cards/CardEstatistica";
import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";
import { X } from "lucide-react";
import Button from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

export default function DashReservas() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState<any | null>(null);
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
    const colunasReservas = [
        { chave: "cliente", titulo: "Cliente", size: "md" },
        { chave: "telefone", titulo: "Telefone", size: "md" },
        { chave: "quantidade", titulo: "Quantidade", size: "md" },
        { chave: "total", titulo: "Total-(R$)", size: "md" },
        { chave: "periodo", titulo: "Período", size: "lg" },
        { chave: "status", titulo: "Status", size: "sm" },

    ];
    const buscarReservas = async () => [
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "1.500,00", periodo: "01/01/2025 - manhã", status: "cancelada" },
        { cliente: "João", telefone: "1234-5678", quantidade: 2, total: "240,00", periodo: "02/01/2025 - tarde", status: "vendida" },
        { cliente: "João", telefone: "1234-5678", quantidade: 2, total: "240,00", periodo: "03/01/2025 - manhã", status: "vendida" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "04/01/2025 - tarde", status: "ativa" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "05/01/2025 - manhã", status: "ativa" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "03/01/2025 - tarde", status: "expirada" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "01/01/2025 - manhã", status: "cancelada" },
        { cliente: "João", telefone: "1234-5678", quantidade: 2, total: "240,00", periodo: "02/01/2025 - tarde", status: "vendida" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "04/01/2025 - manhã", status: "ativa" },
        { cliente: "João", telefone: "1234-5678", quantidade: 2, total: "240,00", periodo: "05/01/2025 - tarde", status: "vendida" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "06/01/2025 - manhã", status: "ativa" },
        { cliente: "Maria", telefone: "1234-5678", quantidade: 1, total: "75,00", periodo: "03/01/2025 - tarde", status: "expirada" },
    ];

    const filtros = [
        { value: "Todos", children: "todos" },
        { value: "Ativas", children: "ativas" },
        { value: "Vendidas", children: "vendidas" },
        { value: "Canceladas", children: "canceladas" },
        { value: "Expiradas", children: "expiradas" },
    ];

    const colunasListaProdutos = [
        { chave: "codigo", titulo: "Código", size: "sm" },
        { chave: "produto", titulo: "Produto", size: "auto" },
        { chave: "valor", titulo: "Valor", size: "md" },
    ]
    const buscarProdutos = async () => [
        { codigo: "1", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "2", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "3", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "4", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "5", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "6", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "7", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "8", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
        { codigo: "9", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$ 75,00" },
    ]
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Reservas" />
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
                <TabelaLista
                    titulo="Reservas"
                    pesquisa={true}
                    filtro={true}
                    tituloFiltro="Filtar"
                    filtroChildren={filtros}
                    colunas={colunasReservas}
                    fetchData={buscarReservas}
                    acoes={[
                        {
                            label: "Ver detalhes",
                            cor: "bg-primary-orange hover:bg-orange-400 hover:shadow-orange-400/50 hover:text-white",
                            onClick: (item: any) => {
                                setSelectedReserva(item);
                                setIsOpen(true);
                            }
                        },
                    ]}
                />

            </div>
            {isOpen && (
                <div className="absolute flex justify-center items-center w-full h-full bg-black/50 z-50">
                    <div className="flex flex-col justify-between bg-black-smooth h-[90%] w-[60%] rounded-md p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row justify-between">
                                <h1 className="text-xl font-light text-ice ">
                                    Detalhes da Reserva de <span className="text-2xl font-semibold text-primary-orange">{selectedReserva?.cliente}</span>
                                </h1>
                                <X
                                    size={30}
                                    color="#FFF"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSelectedReserva(null);
                                    }}
                                    className="cursor-pointer hover:scale-110 transition-transform"
                                />
                            </div>
                            <div className="flex flex-row gap-2 items-end ">
                                <p className="font-light text-ice text-lg">Telefone:</p>
                                <p className="text-xl font-semibold text-primary-orange">{selectedReserva?.telefone}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-end border-b border-gray-500 pb-4">
                                <p className="font-light text-ice text-lg">Valido até:</p>
                                <p className="text-xl font-semibold text-primary-orange">{selectedReserva?.periodo}</p>
                            </div>
                            <div className=" mt-5 border border-primary-orange">
                                <TabelaLista
                                    titulo="lista de produtos"
                                    pesquisa={false}
                                    filtro={false}
                                    tituloFiltro="Filtar"
                                    filtroChildren={filtros}
                                    colunas={colunasListaProdutos}
                                    fetchData={buscarProdutos}
                                    acoes={[
                                        {
                                            label: "remover",
                                            cor: "bg-primary-orange hover:bg-orange-400 hover:shadow-orange-400/50 hover:text-white",
                                            onClick: (item: any) => {
                                                setSelectedReserva(item);
                                                setIsOpen(true);
                                            }
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end border-t border-gray-500 pb-4 mt-5">
                            <div className="flex flex-row gap-2 items-end w-full">
                                <p className="font-light text-ice text-xl">Total:</p>
                                <p className="text-2xl font-semibold text-primary-orange">R$ {selectedReserva?.total}</p>
                            </div>
                            <div className="flex flex-row justify-around items-center  w-full text-xl">
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSelectedReserva(null);
                                    }}
                                    children="Cancelar reserva"
                                    className="border border-red-alert text-red-alert font-semibold py-2 px-6 rounded-xl hover:bg-red-alert hover:text-white hover:shadow-red-alert/50 hover:shadow-md transition-shadow duration-300"
                                />
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSelectedReserva(null);
                                        navigate(`/dashboard/vendas/nova-venda?reserva=${selectedReserva?.id}`);
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