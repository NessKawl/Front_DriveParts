import { useState } from "react";
import Button from "../../components/buttons/Button";
import NavBarDashboard from "../../components/navbar/NavBarDashboard";
import TabelaLista from "../../components/tabelas/TabelaLista";

export default function DashNovaVenda() {
    const colunas = [
        { chave: "numero", titulo: "N° Item" },
        { chave: "codigo", titulo: "Código" },
        { chave: "produto", titulo: "Produto" },
        { chave: "valor", titulo: "Valor" },
    ];
    const listaItens = async () => [
        { numero: 1, codigo: "001", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 2, codigo: "002", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 3, codigo: "003", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 4, codigo: "004", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 5, codigo: "005", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 6, codigo: "006", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 7, codigo: "007", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 8, codigo: "008", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 9, codigo: "009", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 10, codigo: "010", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 11, codigo: "011", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 12, codigo: "012", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 13, codigo: "013", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 14, codigo: "014", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 15, codigo: "015", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
        { numero: 16, codigo: "016", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$75,00" },
        { numero: 17, codigo: "017", produto: "Pneu Goodyear Direction Touring 2 185/70 R14 88H", valor: "R$120,00" },
    ];
    const quantidadeItens = 10;
    const [formaPagamento, setFormaPagamento] = useState("");
    return (
        <div className="flex bg-black-smooth/95">
            <NavBarDashboard page="Vendas" />
            <form action="" className="w-full flex flex-row justify-center  p-2 gap-5">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col">
                            <label htmlFor="" className="font-light text-lg text-ice">Nome do Cliente</label>
                            <input
                                type="text"
                                id="cliente"
                                name="clienteName"
                                placeholder="Buscar Cliente"
                                className="bg-ice/80 rounded-md p-1 w-full h-10 font-semibold text-lg" />
                        </div>

                        <div className="flex flex-row w-full gap-2 items-end">
                            <div className="flex flex-col w-full">
                                <label htmlFor="" className="font-light text-lg text-ice">Telefone do Cliente</label>
                                <input
                                    type="text"
                                    id="telefone"
                                    name="clientePhone"
                                    placeholder="Buscar Telefone"
                                    className="bg-ice/80 rounded-md p-1 w-full h-10 font-semibold text-lg" />
                            </div>

                            <Button
                                type="button"
                                className="bg-primary-orange hover:bg-orange-600 text-black-smooth font-bold px-4 py-2 rounded-md ml-2 transition duration-200 w-50"
                            >
                                Selecionar Reserva
                            </Button>
                        </div>
                    </div>
                    <div className="max-h-150">
                        <TabelaLista
                            titulo="Últimas Vendas"
                            colunas={colunas}
                            fetchData={listaItens}
                            alturaMax="md:max-h-125"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full gap-3 ">
                    <div className="flex flex-row gap-5 border-b border-primary-orange/100 pb-4">
                        <div className="flex flex-col gap-6">
                            <img src="/produtos/pneu.png" alt="" className="w-40 h-40 bg-ice/90" />
                            <div className="flex flex-col">
                                <label htmlFor="" className="font-light text-lg text-ice">Valor Unitário</label>
                                <input
                                    type="text"
                                    id="valorUnidade"
                                    name="valorUnidade"
                                    placeholder="R$ 0,00"
                                    className="bg-ice/80 rounded-md p-1 w-40 h-10 font-semibold text-lg "
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col">
                                <label htmlFor="" className="font-light text-lg text-ice">Produto</label>
                                <input
                                    type="text"
                                    id="produto"
                                    name="produto"
                                    placeholder="Buscar Produto"
                                    className="bg-ice/80 rounded-md p-1 w-full h-10 font-semibold text-lg" />
                            </div>
                            <div className="flex flex-row gap-5 w-full">
                                <div className="flex flex-col w-40">
                                    <label htmlFor="" className="font-light text-lg text-ice">Código do Produto</label>
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        placeholder="000"
                                        className="bg-ice/80 rounded-md p-1 w-40 h-10 font-semibold text-lg" />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label htmlFor="" className="font-light text-lg text-ice">Código de Barras</label>
                                    <input
                                        type="text"
                                        id="codigoBarras"
                                        name="codigoBarras"
                                        placeholder="000000000  000000000"
                                        className="bg-ice/80 rounded-md p-1 w-full h-10 font-semibold text-lg" />
                                </div>
                            </div>
                            <div className="flex flex-row gap-5 justify-between">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="" className="font-light text-lg text-ice">Valor Total</label>
                                    <input
                                        type="text"
                                        id="valorTotal"
                                        name="valorTotal"
                                        placeholder="R$ 0,00"
                                        className="bg-ice/80 rounded-md p-1 w-full h-10 font-semibold text-lg" />
                                </div>
                                <div className="flex flex-col w-40">
                                    <label htmlFor="" className="font-light text-lg text-ice">Quantidade</label>
                                    <select
                                        name=""
                                        id=""
                                        className="bg-ice/80 rounded-md p-1 w-40 h-10 font-semibold text-lg"
                                    >
                                        <option hidden value="0">0</option>
                                        {Array.from({ length: quantidadeItens }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="" className="font-md text-lg text-ice">Sub Total</label>
                        <input
                            type="text"
                            id="subTotal"
                            name="subTotal"
                            placeholder="R$ 0,00"
                            className="bg-ice/80 rounded-md p-1 w-full h-15 font-semibold text-3xl" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="formaPagamento" className="font-md text-lg text-ice">
                            Forma de Pagamento
                        </label>
                        <select
                            id="formaPagamento"
                            name="formaPagamento"
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            className="bg-ice/80 rounded-md p-1 w-75 h-12 font-semibold text-xl"
                        >
                            <option hidden value="">
                                Selecione forma de pagamento
                            </option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartaoCredito">Cartão de Crédito</option>
                            <option value="cartaoDebito">Cartão de Débito</option>
                            <option value="pix">Pix</option>
                        </select>
                    </div>
                    {formaPagamento === "dinheiro" && (
                        <div className="flex flex-row w-full gap-4">
                            <div className="flex flex-col w-full">
                                <label htmlFor="totalRecebido" className="font-md text-lg text-ice">
                                    Total Recebido
                                </label>
                                <input
                                    type="text"
                                    id="totalRecebido"
                                    name="totalRecebido"
                                    placeholder="R$ 0,00"
                                    className="bg-ice/80 rounded-md p-1 w-full h-12 font-semibold text-2xl"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="troco" className="font-md text-lg text-ice">
                                    Troco
                                </label>
                                <input
                                    type="text"
                                    id="troco"
                                    name="troco"
                                    placeholder="R$ 0,00"
                                    className="bg-ice/80 rounded-md p-1 w-full h-12 font-semibold text-2xl"
                                />
                            </div>
                        </div>
                    )}

                    {formaPagamento === "cartaoCredito" && (
                        <div className="flex flex-col w-full">
                            <label htmlFor="parcelas" className="font-md text-lg text-ice">
                                Número de Parcelas
                            </label>
                            <select
                                id="parcelas"
                                name="parcelas"
                                className="bg-ice/80 rounded-md p-1 w-full h-12 font-semibold text-xl"
                            >
                                <option hidden value="">
                                    Selecione a quantidade de parcelas
                                </option>
                                <option value="1">1x</option>
                                <option value="2">2x</option>
                                <option value="3">3x</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-center items-end w-full h-full p-5">
                        <Button
                            type="submit"
                            className="bg-pear-green/80 hover:bg-pear-green text-ice font-bold text-3xl px-4 py-2  transition duration-200 w-full hover:shadow-lg hover:shadow-pear-green/50 rounded-md"
                            children="Finalizar Venda"
                        />
                    </div>    
                </div>
            </form>
        </div>
    );
}