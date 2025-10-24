import GraficoLinhas from "../../components/graficos/GraficoLinhas";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";

export default function DashVenda() {
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
    const quantidade = 10;
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
                <div className="flex flex-col w-full items-center bg-black-smooth">
                    <h1 className="text-3xl text-ice font-semibold border-b border-gray-400 w-full text-center">Formulário de Venda</h1>
                    <form action="" className="flex flex-col bg-black-smooth w-full p-4">
                        <div className="flex flex-row gap-4 ">
                            <div className=" flex flex-col items-center justify-center gap-3">
                                <img src="/produtos/pneu.png" alt="" className="bg-ice w-50" />
                                <div className="flex flex-col">
                                    <label htmlFor="produto" className=" text-primary-orange font-semibold">Valor Unidade:</label>
                                    <input
                                        type="text"
                                        id="produto"
                                        name="produto"
                                        placeholder="R$ 0,00"
                                        className="bg-ice p-1 w-40 h-10 font-semibold text-lg" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-between w-full">
                                <div className="flex flex-col">
                                    <label htmlFor="produto" className=" text-primary-orange font-semibold">Produto:</label>
                                    <input
                                        type="text"
                                        id="produto"
                                        name="produto"
                                        placeholder="Insira o nome do produto"
                                        className="bg-ice p-1 w-full h-10 font-semibold text-lg" />
                                </div>
                                <div className="flex flex-row mt-2 justify-between w-full">
                                    <div className="flex flex-col w-40">
                                        <label htmlFor="produto" className=" text-primary-orange font-semibold">Código:</label>
                                        <input
                                            type="text"
                                            id="produto"
                                            name="produto"
                                            placeholder="Código"
                                            className="bg-ice font-semibold p-1 w-40 h-10" />
                                    </div>
                                    <div className="flex flex-col w-40">
                                        <label htmlFor="produto" className="text-primary-orange font-semibold">Quantidade:</label>
                                        <select name="" id="" className="h-full w-40 bg-ice font-semibold text-xl px-2 ">
                                            {Array(quantidade).fill(0).map((_, index) => (<option className="font-semibold text-black-smooth bg-ice" value={index + 1}>{index + 1}</option>))}
                                        </select>
                                    </div>

                                </div>
                                <div className="flex flex-row justify-end">

                                    <div className="flex flex-col w-40">
                                        <label htmlFor="produto" className="text-primary-orange font-semibold">De Reserva:</label>
                                        <select
                                            name=""
                                            id=""
                                            className="h-10 w-40 bg-ice font-semibold text-xl px-2 ">
                                            <option className="font-semibold text-black-smooth bg-ice" value="True">Sim</option>
                                            <option className="font-semibold text-black-smooth bg-ice" value="False">Não</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 mb-4 border-b border-primary-orange py-3">
                            
                            <div className="flex flex-col w-full">
                                <label htmlFor="produto" className=" text-primary-orange font-semibold">Total:</label>
                                <input
                                    type="text"
                                    id="produto"
                                    name="produto"
                                    placeholder="R$ 450"
                                    className="bg-ice p-1 w-full h-10 font-semibold text-lg" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col w-full">
                                <label htmlFor="produto" className=" text-primary-orange font-semibold">Nome do Cliente:</label>
                                <input
                                    type="text"
                                    id="produto"
                                    name="produto"
                                    placeholder="Insira o nome do cliente"
                                    className="bg-ice p-1 w-full h-10 font-semibold text-lg" />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="produto" className=" text-primary-orange font-semibold">Telefone do Cliente:</label>
                                <input
                                    type="text"
                                    id="produto"
                                    name="produto"
                                    placeholder="(00) 00000-0000"
                                    className="bg-ice p-1 w-full h-10 font-semibold text-lg" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 mt-4">
                            <div className="flex flex-col w-full">
                                <label htmlFor="produto" className="text-primary-orange font-semibold">Forma de Pagamento:</label>
                                <select
                                    name=""
                                    id=""
                                    className="h-10 bg-ice font-semibold text-xl px-2 ">
                                    <option value="" disabled selected >
                                        Forma de pagamento
                                    </option>
                                    <option className="font-semibold text-black-smooth bg-ice" value="Dinheiro">Dinheiro</option>
                                    <option className="font-semibold text-black-smooth bg-ice" value="Cartão de Crédito">Cartão de Crédito</option>
                                    <option className="font-semibold text-black-smooth bg-ice" value="Cartão de Débito">Cartão de Débito</option>
                                    <option className="font-semibold text-black-smooth bg-ice" value="Pix">Pix</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="produto" className=" text-primary-orange font-semibold">Pago / parcelas:</label>
                                    <input
                                        type="text"
                                        id="produto"
                                        name="produto"
                                        placeholder="Insira o nome do cliente"
                                        className="bg-ice p-1 w-full h-10 font-semibold text-lg" />
                                </div>
                            </div>
                        </div>
                        
                       
                        <div>
                            <button type="submit" className="bg-primary-orange hover:bg-orange-600 text-black-smooth font-bold px-4 py-2 rounded-md w-full mt-6 transition duration-200">Registrar Venda</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}